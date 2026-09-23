import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Storage — rasmlar, PDF'lar va sayt ma'lumotlari (JSON) shu yerda saqlanadi.
 * Kerakli env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (yoki yangi "secret" kalit),
 * ixtiyoriy SUPABASE_BUCKET (standart: "site").
 */
export const BUCKET = process.env.SUPABASE_BUCKET || 'site';

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL yoki SUPABASE_SERVICE_ROLE_KEY sozlanmagan');
  }
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

let bucketChecked = false;

/** Bucket yo'q bo'lsa — avtomatik yaratadi (public). Qo'lda yaratish shart emas. */
export async function ensureBucket(): Promise<void> {
  if (bucketChecked) return;
  const sb = supabase();
  const { data } = await sb.storage.getBucket(BUCKET);
  if (!data) {
    const { error } = await sb.storage.createBucket(BUCKET, { public: true, fileSizeLimit: 50 * 1024 * 1024 });
    if (error && !/already exists/i.test(error.message)) throw error;
  } else if (!data.public) {
    await sb.storage.updateBucket(BUCKET, { public: true });
  }
  bucketChecked = true;
}

export function publicUrl(path: string): string {
  return supabase().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Bizning bucket'dagi public URL'dan fayl yo'lini ajratadi; begona URL bo'lsa null */
export function pathFromPublicUrl(url: string): string | null {
  const base = process.env.SUPABASE_URL;
  if (!base || !url) return null;
  const prefix = `${base.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET}/`;
  if (!url.startsWith(prefix)) return null;
  return decodeURIComponent(url.slice(prefix.length).split('?')[0]);
}

/** JSON faylni yangi holatda (keshsiz) o'qiydi. Topilmasa — null */
export async function readJson<T>(path: string): Promise<T | null> {
  const { data, error } = await supabase().storage.from(BUCKET).download(path, {}, { cache: 'no-store' } as any);
  if (error || !data) {
    const status = (error as any)?.status ?? (error as any)?.statusCode;
    if (String(status) === '404' || String(status) === '400' || /not.?found/i.test(error?.message || '')) return null;
    throw error || new Error(`readJson(${path}) failed`);
  }
  return JSON.parse(await data.text()) as T;
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  await ensureBucket();
  const body = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  const { error } = await supabase().storage.from(BUCKET).upload(path, body, {
    upsert: true,
    contentType: 'application/json',
    cacheControl: '0',
  });
  if (error) throw error;
}

export async function deleteByUrl(url: string): Promise<void> {
  const path = pathFromPublicUrl(url);
  if (!path) return; // eski Blob yoki tashqi URL — tegmaymiz
  try {
    await supabase().storage.from(BUCKET).remove([path]);
  } catch (err) {
    console.error('deleteByUrl error:', err);
  }
}

/** Brauzer faylni to'g'ridan-to'g'ri Supabase'ga yuklashi uchun bir martalik URL */
export async function createUploadUrl(path: string): Promise<{ signedUrl: string; publicUrl: string }> {
  await ensureBucket();
  const { data, error } = await supabase().storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw error || new Error('createSignedUploadUrl failed');
  return { signedUrl: data.signedUrl, publicUrl: publicUrl(path) };
}
