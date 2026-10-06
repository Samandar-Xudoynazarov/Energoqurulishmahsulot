import { CatalogItem, LocalizedText, Product } from '../types';
import { CATALOG } from '../data/catalog';

export function cleanPrice(v: unknown): number | undefined {
  const n = Math.round(Number(String(v ?? '').replace(/[\s,]/g, '')));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

// Kirill va lotin harflari aralashib ketgan kodlarni bir xil ko'rinishga keltiradi
const LAT2CYR: Record<string, string> = { A: 'А', B: 'В', C: 'С', E: 'Е', H: 'Н', K: 'К', M: 'М', O: 'О', P: 'Р', T: 'Т', X: 'Х', Y: 'У' };
export function normCode(code: string): string {
  return code
    .toUpperCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[ABCEHKMOPTXY]/g, (c) => LAT2CYR[c])
    .replace(/З/g, '3')
    .replace(/,/g, '.')
    .replace(/[\s\-_–]/g, '');
}

// Saytdagi eski kod → katalog kodi (yozilishi farq qiladiganlar)
const ALIASES: Record<string, string> = { 'УБ-1А': 'УБ-1' };

/** Katalog boshqaradigan xarakteristika qatorlari — yangilashda shular almashtiriladi, admin qo'shgan boshqa qatorlar saqlanadi */
const PTO_SPEC_IDS = new Set(['olcham', 'ogirlik', 'beton', 'klass', 'f', 'w', 'hajm', 'armatura', 'metall', 'zaklad', 'seriya', 'uzunlik']);

/** Tavsifdagi eski «taxminiy og'irligi» iborasini katalogdagi aniq og'irlik bilan almashtiradi */
function patchWeight(d: LocalizedText, weight?: string): LocalizedText {
  const t = weight?.replace(/\s*t$/, '');
  if (!t) return d;
  return {
    uz: d.uz.replace(/(taxminiy )?og‘irligi [\d,]+ t/g, `og‘irligi ${t} t`),
    ru: d.ru.replace(/(ориентировочная )?масса [\d,]+ т/g, `масса ${t} т`),
    en: d.en.replace(/(approx\. )?weight [\d,]+ t/g, `weight ${t} t`),
  };
}

/** Boshlang'ich (qisqa) tavsif — admin hali o'zi yozmagan deb hisoblanadi */
const isShort = (p: Product) => Math.max(...(['uz', 'ru', 'en'] as const).map((l) => (p.description?.[l] || '').length)) < 400;

export interface ImportOptions {
  prices: boolean;
  specs: boolean;
  texts: boolean;
  addNew: boolean;
}

export interface ImportChange {
  code: string;
  catalogCode: string;
  action: 'add' | 'update' | 'same';
  fields: string[];
  price: number;
  oldPrice?: number;
}

/** Katalogni mavjud mahsulotlarga qo'shadi. Rasm, PDF va kategoriya hech qachon o'zgartirilmaydi. */
export function mergeCatalog(products: Product[], opts: ImportOptions, catalog: CatalogItem[] = CATALOG) {
  const out = products.map((p) => ({ ...p }));
  const changes: ImportChange[] = [];
  // bir xil normallashgan kodli katalog elementlari — faqat aniq kod bo'yicha moslanadi
  const normCount = new Map<string, number>();
  for (const c of catalog) normCount.set(normCode(c.code), (normCount.get(normCode(c.code)) || 0) + 1);
  const used = new Set<number>();

  for (const c of catalog) {
    let idx = out.findIndex((p) => p.code === c.code);
    if (idx < 0) idx = out.findIndex((p, i) => !used.has(i) && ALIASES[p.code] === c.code);
    if (idx < 0 && normCount.get(normCode(c.code)) === 1) {
      idx = out.findIndex((p, i) => !used.has(i) && p.category !== 'jamoa' && normCode(p.code) === normCode(c.code));
    }
    if (idx >= 0) {
      used.add(idx);
      const p = out[idx];
      const fields: string[] = [];
      if (opts.prices && c.price > 0 && p.price !== c.price) {
        fields.push('narx');
        changes.push({ code: p.code, catalogCode: c.code, action: 'update', fields, price: c.price, oldPrice: p.price });
        p.price = c.price;
      } else {
        changes.push({ code: p.code, catalogCode: c.code, action: 'same', fields, price: p.price || 0 });
      }
      if (opts.specs && c.specs.length) {
        // katalog qatorlari yangilanadi, admin o'zi qo'shgan boshqa qatorlar oxirida saqlanadi
        const own = (p.specs || []).filter((s) => !PTO_SPEC_IDS.has(s.id) && !c.specs.some((x) => x.id === s.id));
        const next = [...c.specs.map((s) => ({ ...s, label: { ...s.label } })), ...own];
        if (JSON.stringify(next) !== JSON.stringify(p.specs || [])) {
          p.specs = next;
          fields.push('xarakteristika');
        }
        const w = c.specs.find((s) => s.id === 'ogirlik')?.value;
        const desc = patchWeight(p.description, w);
        if (JSON.stringify(desc) !== JSON.stringify(p.description)) {
          p.description = desc;
          if (!fields.includes('xarakteristika')) fields.push("og'irlik");
        }
      }
      if (opts.texts && isShort(p)) {
        // katalog kodi saytdagi kod bilan almashtiriladi (masalan «Ф5-Усу(250)» → «Ф5-УСУ»)
        const swap = (t: LocalizedText): LocalizedText => ({ uz: t.uz.split(c.code).join(p.code), ru: t.ru.split(c.code).join(p.code), en: t.en.split(c.code).join(p.code) });
        p.description = swap(c.description);
        p.name = swap(c.name);
        p.tag = { ...c.tag };
        fields.push('tavsif');
      }
      if (fields.length) changes[changes.length - 1].action = 'update';
    } else if (opts.addNew) {
      out.push({
        code: c.code,
        category: c.category,
        name: { ...c.name },
        tag: { ...c.tag },
        description: { ...c.description },
        image: '',
        specs: c.specs.map((s) => ({ ...s, label: { ...s.label } })),
        order: out.length,
        price: c.price > 0 ? c.price : undefined,
      });
      changes.push({ code: c.code, catalogCode: c.code, action: 'add', fields: ['yangi'], price: c.price });
    }
  }
  return { products: out, changes };
}
