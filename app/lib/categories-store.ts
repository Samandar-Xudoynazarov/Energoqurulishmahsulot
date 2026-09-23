import { createJsonStore } from './json-store';
import { Category } from '../types';


const DEFAULT_CATEGORIES: Category[] = [
  { id: 'fundament', name: { uz: 'Fundamentlar', ru: 'Фундаменты', en: 'Foundations' }, order: 0 },
  { id: 'tayanch', name: { uz: 'Tayanch ustunlar', ru: 'Опоры', en: 'Support poles' }, order: 1 },
  { id: 'lotok', name: { uz: 'Lotoklar', ru: 'Лотки', en: 'Trays' }, order: 2 },
  { id: 'plita', name: { uz: 'Plitalar', ru: 'Плиты', en: 'Slabs' }, order: 3 },
  { id: 'maxsus', name: { uz: 'Maxsus buyumlar', ru: 'Спецпродукция', en: 'Special products' }, order: 4 },
  { id: 'jamoa', name: { uz: 'Jamoa/Texnika', ru: 'Коллектив/Техника', en: 'Team/Equipment' }, order: 5 },
];

const store = createJsonStore<Category[]>('categories', () => DEFAULT_CATEGORIES.map((c) => ({ ...c, name: { ...c.name } })));

export const getCategories = store.get;
export const getCategoriesFresh = store.getFresh;
export const saveCategories = store.save;

export async function addCategory(name: Category['name']): Promise<Category[]> {
  const categories = await getCategoriesFresh();
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
  const categories = await getCategoriesFresh();
  const updated = categories.map((c) => (c.id === id ? { ...c, name } : c));
  await saveCategories(updated);
  return updated;
}

export async function deleteCategory(id: string): Promise<Category[]> {
  const categories = await getCategoriesFresh();
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
