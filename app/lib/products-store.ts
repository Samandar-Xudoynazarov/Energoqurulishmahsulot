import { put, list, del } from '@vercel/blob';
import { Product } from '../types';
import { fullModalData } from '../data/modalData';

const PRODUCTS_KEY = 'data/products.json';

// Default/seed data derived from the original hardcoded modalData,
// used the very first time the site runs before any admin edits exist.
function seedProducts(): Product[] {
  const categoryFor = (code: string): Product['category'] => {
    if (['jamoa', 'texnika', 'avtopark'].includes(code)) return 'jamoa';
    if (code.startsWith('F')) return 'fundament';
    if (code.startsWith('PA') || code.startsWith('USO')) return 'tayanch';
    if (code.startsWith('L') || code.startsWith('SB')) return 'lotok';
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

let cache: { data: Product[]; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 5000;

export async function getProducts(): Promise<Product[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const { blobs } = await list({ prefix: PRODUCTS_KEY, limit: 1 });
    const match = blobs.find((b) => b.pathname === PRODUCTS_KEY);

    if (!match) {
      const seeded = seedProducts();
      await saveProducts(seeded);
      return seeded;
    }

    const res = await fetch(match.url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products.json from blob');
    const data = (await res.json()) as Product[];
    cache = { data, fetchedAt: Date.now() };
    return data;
  } catch (err) {
    console.error('getProducts error, falling back to seed data:', err);
    return seedProducts();
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  await put(PRODUCTS_KEY, JSON.stringify(products, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  cache = { data: products, fetchedAt: Date.now() };
}

export async function upsertProduct(product: Product): Promise<Product[]> {
  const products = await getProducts();
  const idx = products.findIndex((p) => p.code === product.code);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.push(product);
  }
  await saveProducts(products);
  return products;
}

export async function deleteProduct(code: string): Promise<Product[]> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.code !== code);
  await saveProducts(filtered);
  return filtered;
}

export async function deleteBlobFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch (err) {
    console.error('deleteBlobFile error:', err);
  }
}
