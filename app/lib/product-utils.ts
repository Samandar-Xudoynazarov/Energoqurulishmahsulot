import { Language, Product } from '../types';

const CYR_TO_LAT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
};

/** Mahsulot kodidan URL uchun lotin slug: "Ф5-АМК" -> "f5-amk", "СБ-95/3" -> "sb-95-3" */
export function productSlug(code: string): string {
  return code
    .toLowerCase()
    .split('')
    .map((ch) => (ch in CYR_TO_LAT ? CYR_TO_LAT[ch] : ch))
    .join('')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function productUrl(locale: Language, code: string): string {
  return `/${locale}/products/${productSlug(code)}`;
}

export function findProductBySlug(products: Product[], slug: string): Product | undefined {
  const s = decodeURIComponent(slug).toLowerCase();
  return products.find((p) => productSlug(p.code) === s || p.code.toLowerCase() === s);
}

/** Jamoa/texnika kartalari mahsulot emas — ular uchun alohida sahifa yo'q */
export function isRealProduct(p: Product): boolean {
  return p.category !== 'jamoa';
}

/** Yopilgan via.placeholder.com kabi soxta rasmlarni bo'sh deb hisoblaymiz */
export function realImage(url?: string): string {
  if (!url) return '';
  if (url.includes('via.placeholder.com') || url.includes('placehold')) return '';
  return url;
}

export type ProductImageKind = 'photo' | '3d' | 'drawing';

/** Mahsulotning barcha rasmlari tartib bilan: real surat → 3D → chizma (bo'shlari tashlab ketiladi) */
export function productImages(p: Product): { kind: ProductImageKind; src: string }[] {
  const list: { kind: ProductImageKind; src: string }[] = [
    { kind: 'photo', src: realImage(p.photo) },
    { kind: '3d', src: realImage(p.image) },
    { kind: 'drawing', src: realImage(p.drawing) },
  ];
  return list.filter((x) => x.src);
}

/** Kartochka va ulashish uchun asosiy rasm */
export function mainImage(p: Product): string {
  return productImages(p)[0]?.src || '';
}

export function isValidLocale(l: string): l is Language {
  return l === 'uz' || l === 'ru' || l === 'en';
}

/** 6121507 -> "6 121 507" (server va brauzerda bir xil — hydration uchun toLocaleString ishlatilmaydi) */
export function formatPrice(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function hasPrice(p?: Product): p is Product & { price: number } {
  return !!p && typeof p.price === 'number' && p.price > 0;
}

/** «от» / «from» so'zi (o'zbekchada bo'sh — u yerda «so'mdan» deyiladi) */
export function priceFrom(t: (k: string) => string): string {
  const v = t('price_from');
  return v && v !== 'price_from' ? v : '';
}

/**
 * Admin API manzili. Kod (masalan «СБ-95/3», «Ф5-Усу(250)») URL yo'lida emas, `?code=` da yuboriladi:
 * yo'lda «/» va kirill harflari Next.js/Vercel'da noto'g'ri o'qilib, «Mahsulot topilmadi» xatosiga olib kelardi.
 */
export function adminProductApi(code: string): string {
  return `/api/admin/products/${productSlug(code) || 'item'}?code=${encodeURIComponent(code)}`;
}

export function adminProductEdit(code: string): string {
  return `/admin/products/${productSlug(code) || 'item'}/edit?code=${encodeURIComponent(code)}`;
}

/** URL'dan kelgan kodni xavfsiz ochadi (ikki marta decode qilinsa ham xato bermaydi) */
export function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
