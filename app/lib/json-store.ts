import { put, list } from '@vercel/blob';

/**
 * Vercel Blob'da bitta JSON fayl sifatida saqlanadigan oddiy ombor.
 * products-store / categories-store bilan bir xil yondashuv.
 */
export function createJsonStore<T>(key: string, seed: () => T) {
  let cache: { data: T; fetchedAt: number } | null = null;
  const CACHE_TTL_MS = 5000;

  async function save(data: T): Promise<void> {
    await put(key, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    cache = { data, fetchedAt: Date.now() };
  }

  async function get(): Promise<T> {
    if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache.data;
    try {
      const { blobs } = await list({ prefix: key, limit: 1 });
      const match = blobs.find((b) => b.pathname === key);
      if (!match) return seed();
      const res = await fetch(match.url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch ${key} from blob`);
      const data = (await res.json()) as T;
      cache = { data, fetchedAt: Date.now() };
      return data;
    } catch (err) {
      console.error(`json-store get(${key}) error, falling back to seed:`, err);
      return seed();
    }
  }

  return { get, save };
}
