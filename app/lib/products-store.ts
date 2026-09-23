import { Product } from '../types';
import { fullModalData } from '../data/modalData';
import { createJsonStore } from './json-store';
import { deleteByUrl } from './storage';

// Boshlang'ich ma'lumot — admin hali hech narsa saqlamagan bo'lsa ishlatiladi.
function seedProducts(): Product[] {
  const categoryFor = (code: string): Product['category'] => {
    if (['jamoa', 'texnika', 'avtopark'].includes(code)) return 'jamoa';
    if (code.startsWith('Ф')) return 'fundament';
    if (code.startsWith('ПА') || code.startsWith('УСО')) return 'tayanch';
    if (code.startsWith('Л') || code.startsWith('СБ')) return 'lotok';
    return 'maxsus';
  };

  return Object.entries(fullModalData).map(([code, item], index) => ({
    code,
    category: categoryFor(code),
    name: { uz: item.uz.title, ru: item.ru.title, en: item.en.title },
    tag: { uz: item.uz.tag, ru: item.ru.tag, en: item.en.tag },
    description: { uz: item.uz.desc, ru: item.ru.desc, en: item.en.desc },
    image: item.uz.image,
    specs: [],
    order: index,
  }));
}

const store = createJsonStore<Product[]>('products', seedProducts);

/** Sayt uchun (keshlangan) */
export const getProducts = store.get;
/** Admin panel uchun (har doim yangi) */
export const getProductsFresh = store.getFresh;
export const saveProducts = store.save;

export async function upsertProduct(product: Product): Promise<Product[]> {
  const products = await getProductsFresh();
  const idx = products.findIndex((p) => p.code === product.code);
  if (idx >= 0) products[idx] = product;
  else products.push(product);
  await saveProducts(products);
  return products;
}

export async function deleteProduct(code: string): Promise<Product[]> {
  const products = await getProductsFresh();
  const filtered = products.filter((p) => p.code !== code);
  await saveProducts(filtered);
  return filtered;
}

/** Eski nom saqlab qolindi — endi Supabase'dan o'chiradi */
export async function deleteBlobFile(url: string): Promise<void> {
  await deleteByUrl(url);
}
