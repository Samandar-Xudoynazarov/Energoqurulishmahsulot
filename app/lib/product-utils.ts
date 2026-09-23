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

export function isValidLocale(l: string): l is Language {
  return l === 'uz' || l === 'ru' || l === 'en';
}
