import { NextRequest, NextResponse } from 'next/server';
import { createUploadUrl } from '../../../lib/storage';

export const dynamic = 'force-dynamic';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_PDF_TYPES = ['application/pdf'];
const MAX_SIZE_BYTES = 45 * 1024 * 1024;

/**
 * Fayl endi server orqali o'tmaydi: server faqat bir martalik yuklash URL'ini beradi,
 * brauzer faylni to'g'ridan-to'g'ri Supabase'ga yuboradi (Vercel'ning 4.5 MB chekloviga tushmaydi).
 * Body: { kind: 'image' | 'pdf', filename, contentType, size }
 */
export async function POST(req: NextRequest) {
  try {
    const { kind, filename, contentType, size } = await req.json();

    if (typeof size === 'number' && size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Fayl hajmi juda katta (maks. 45 MB)' }, { status: 400 });
    }
    const allowed = kind === 'pdf' ? ALLOWED_PDF_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowed.includes(contentType)) {
      return NextResponse.json({ error: 'Ruxsat etilmagan fayl turi' }, { status: 400 });
    }

    const ext = kind === 'pdf' ? 'pdf' : (String(contentType).split('/')[1] || 'jpg');
    const rawBase = String(filename || 'file').replace(/\.[^.]+$/, '');
    const watermarked = /-wm$/.test(rawBase);
    const base = (rawBase.replace(/-wm$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50) || 'file') + (watermarked ? '-wm' : '');
    const path = `uploads/${kind === 'pdf' ? 'pdf' : 'image'}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${base}.${ext}`;

    const { signedUrl, publicUrl } = await createUploadUrl(path);
    return NextResponse.json({ signedUrl, url: publicUrl });
  } catch (err) {
    console.error('POST /api/admin/upload error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    const hint = /SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY/.test(msg)
      ? "Supabase ulanmagan: Vercel'da SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY ni kiriting va Redeploy qiling."
      : `Yuklashda xatolik: ${msg}`;
    return NextResponse.json({ error: hint }, { status: 500 });
  }
}
