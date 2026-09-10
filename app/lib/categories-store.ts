import { put, list } from '@vercel/blob';
import { Category } from '../types';

const CATEGORIES_KEY = 'data/categories.json';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'fundament', name: { uz: 'Fundamentlar', ru: 'Фундаменты', en: 'Foundations' }, order: 0 },
  { id: 'tayanch', name: { uz: 'Tayanch ustunlar', ru: 'Опоры', en: 'Support poles' }, order: 1 },
  { id: 'lotok', name: { uz: 'Lotoklar', ru: 'Лотки', en: 'Trays' }, order: 2 },
  { id: 'plita', name: { uz: 'Plitalar', ru: 'Плиты', en: 'Slabs' }, order: 3 },
  { id: 'maxsus', name: { uz: 'Maxsus buyumlar', ru: 'Спецпродукция', en: 'Special products' }, order: 4 },
  { id: 'jamoa', name: { uz: 'Jamoa/Texnika', ru: 'Коллектив/Техника', en: 'Team/Equipment' }, order: 5 },
];

let cache: { data: Category[]; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 5000;

export async function getCategories(): Promise<Category[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const { blobs } = await list({ prefix: CATEGORIES_KEY, limit: 1 });
    const match = blobs.find((b) => b.pathname === CATEGORIES_KEY);

    if (!match) {
      await saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }

    const res = await fetch(match.url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories.json from blob');
    const data = (await res.json()) as Category[];
    cache = { data, fetchedAt: Date.now() };
    return data;
  } catch (err) {
    console.error('getCategories error, falling back to defaults:', err);
    return DEFAULT_CATEGORIES;
  }
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await put(CATEGORIES_KEY, JSON.stringify(categories, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  cache = { data: categories, fetchedAt: Date.now() };
}

export async function addCategory(name: Category['name']): Promise<Category[]> {
  const categories = await getCategories();
  const id = slugify(name.uz || name.ru || name.en || `category-${Date.now()}`);
  let uniqueId = id;
  let suffix = 1;
  while (categories.some((c) => c.id === uniqueId)) {
    uniqueId = `${id}-${suffix++}`;
  }
  const newCategory: Category = { id: uniqueId, name, order: categories.length };
  const updated = [...categories, newCategory];
  await saveCategories(updated);
  return updated;
}

export async function renameCategory(id: string, name: Category['name']): Promise<Category[]> {
  const categories = await getCategories();
  const updated = categories.map((c) => (c.id === id ? { ...c, name } : c));
  await saveCategories(updated);
  return updated;
}

export async function deleteCategory(id: string): Promise<Category[]> {
  const categories = await getCategories();
  const updated = categories.filter((c) => c.id !== id);
  await saveCategories(updated);
  return updated;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF\u0100-\u017F]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || `category-${Date.now()}`;
}
