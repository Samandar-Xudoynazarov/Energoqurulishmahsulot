"use client";

import { compressImage } from '../../lib/compress-image';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const EXT_TYPE: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jfif: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
  pdf: 'application/pdf',
};

/** Ba'zi brauzer/telefonlarda file.type bo'sh keladi — kengaytmadan aniqlaymiz */
function withType(file: File): File {
  if (file.type) return file;
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const type = EXT_TYPE[ext];
  return type ? new File([file], file.name, { type }) : file;
}

async function prepareImage(original: File): Promise<File> {
  const file = withType(original);
  const isHeic = /image\/hei[cf]/.test(file.type) || /\.(heic|heif)$/i.test(file.name);

  try {
    const out = await compressImage(file);
    if (ALLOWED_IMAGE_TYPES.includes(out.type)) return out;
  } catch (err) {
    console.warn('compressImage failed, original file will be used:', err);
  }

  // Siqib bo'lmadi — fayl o'zi ruxsat etilgan turda bo'lsa, shundayligicha yuklaymiz
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) return file;

  if (isHeic) {
    throw new Error(
      "iPhone HEIC formatidagi rasm bu brauzerda ochilmadi. Rasmni JPG ga o'tkazing (iPhone: Sozlamalar → Kamera → Formatlar → «Eng mos») yoki Safari orqali yuklang."
    );
  }
  throw new Error(`Bu fayl turi qo'llab-quvvatlanmaydi (${file.type || file.name}). JPG, PNG yoki WEBP yuklang.`);
}

/** Faylni Supabase'ga yuklaydi va uning public URL'ini qaytaradi. Xato bo'lsa — Error tashlaydi. */
export async function uploadFile(file: File, kind: 'image' | 'pdf'): Promise<string> {
  const toUpload = kind === 'image' ? await prepareImage(file) : withType(file);

  const signRes = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, filename: toUpload.name, contentType: toUpload.type, size: toUpload.size }),
  });
  const sign = await signRes.json().catch(() => ({}));
  if (!signRes.ok) throw new Error(sign.error || `Yuklashda xatolik (${signRes.status})`);

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
