"use client";

import { compressImage } from '../../lib/compress-image';

/** Faylni Supabase'ga yuklaydi va uning public URL'ini qaytaradi. Xato bo'lsa — Error tashlaydi. */
export async function uploadFile(file: File, kind: 'image' | 'pdf'): Promise<string> {
  const toUpload = kind === 'image' ? await compressImage(file) : file;

  const signRes = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, filename: toUpload.name, contentType: toUpload.type, size: toUpload.size }),
  });
  const sign = await signRes.json().catch(() => ({}));
  if (!signRes.ok) throw new Error(sign.error || 'Yuklashda xatolik');

  const form = new FormData();
  form.append('cacheControl', '31536000');
  form.append('', toUpload);
  const putRes = await fetch(sign.signedUrl, { method: 'PUT', body: form, headers: { 'x-upsert': 'false' } });
  if (!putRes.ok) {
    const text = await putRes.text().catch(() => '');
    throw new Error(`Supabase'ga yuklab bo'lmadi (${putRes.status}) ${text.slice(0, 200)}`);
  }
  return sign.url as string;
}
