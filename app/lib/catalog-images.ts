import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { CATALOG } from '../data/catalog';
import { Product } from '../types';
import { BUCKET, ensureBucket, publicUrl, supabase, pathFromPublicUrl, readJson } from './storage';

export function storageCatalog() {
  return CATALOG.map(c => ({ ...c, image: c.image ? publicUrl(c.image.slice(1)) : undefined }));
}

export async function uploadCatalogImages(products: Product[], next: Product[]) {
  const current = new Set(products.map(p => p.image));
  const wanted = new Set(next.map(p => p.image));
  await ensureBucket();
  for (const c of CATALOG) {
    if (!c.image) continue;
    const key = c.image.slice(1);
    const url = publicUrl(key);
    if (!wanted.has(url) || current.has(url)) continue;
    const body = await readFile(path.join(process.cwd(), 'public', key));
    const { error } = await supabase().storage.from(BUCKET).upload(key, body, { upsert: true, contentType: 'image/webp', cacheControl: '31536000' });
    if (error) throw error;
  }
}

/** Remove only replaced renders, after saving, and only when no other site content references them. */
export async function cleanReplacedImages(previous: Product[], next: Product[]): Promise<string[]> {
  const warnings: string[] = [];
  const referenced = new Set<string>();
  const collect = (value: unknown): void => {
    if (typeof value === 'string') { const p = pathFromPublicUrl(value); if (p) referenced.add(p); }
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(next);
  try {
    for (const name of ['projects', 'content', 'settings']) collect(await readJson(`data/${name}.json`));
    const replaced = previous.filter(p => next.some(n => n.code === p.code && n.image !== p.image));
    const keys = Array.from(new Set(replaced.map(p => pathFromPublicUrl(p.image)).filter((p): p is string => !!p && !referenced.has(p))));
    if (keys.length) {
      const { error } = await supabase().storage.from(BUCKET).remove(keys);
      if (error) warnings.push('Yangi rasmlar saqlandi, ammo eski rasmlarni tozalash bajarilmadi.');
    }
  } catch {
    warnings.push('Yangi rasmlar saqlandi; umumiy ishlatilgan fayllarni tekshirish tugamagani uchun eski rasmlar saqlandi.');
  }
  return warnings;
}
