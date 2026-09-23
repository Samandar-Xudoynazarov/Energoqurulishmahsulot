import { unstable_cache, revalidateTag } from 'next/cache';
import { readJson, writeJson } from './storage';

/**
 * Supabase Storage'dagi bitta JSON fayl.
 * - get(): sayt uchun — Next.js keshidan (10 daqiqa yoki admin saqlaganda darhol yangilanadi).
 *   Shu tufayli har bir tashrif Supabase'ga so'rov yubormaydi.
 * - getFresh(): admin panel uchun — har doim eng yangi holat.
 */
export function createJsonStore<T>(key: string, seed: () => T) {
  const path = `data/${key}.json`;
  const tag = `store:${key}`;

  async function getFresh(): Promise<T> {
    try {
      const data = await readJson<T>(path);
      return data ?? seed();
    } catch (err) {
      console.error(`json-store getFresh(${key}) error, falling back to seed:`, err);
      return seed();
    }
  }

  // Xato bo'lsa — keshga yozilmaydi (throw), faqat muvaffaqiyatli natija keshlanadi
  const cached = unstable_cache(async () => (await readJson<T>(path)) ?? null, [tag], { revalidate: 600, tags: [tag] });

  async function get(): Promise<T> {
    try {
      return (await cached()) ?? seed();
    } catch (err) {
      console.error(`json-store get(${key}) error, falling back to seed:`, err);
      return seed();
    }
  }

  async function save(data: T): Promise<void> {
    await writeJson(path, data);
    try {
      revalidateTag(tag);
    } catch {
      /* revalidateTag faqat request ichida ishlaydi */
    }
  }

  return { get, getFresh, save };
}
