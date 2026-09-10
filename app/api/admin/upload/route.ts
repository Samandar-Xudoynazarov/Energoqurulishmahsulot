import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_PDF_TYPES = ['application/pdf'];
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB upload cap before compression on client

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const kind = formData.get('kind') as string | null; // 'image' | 'pdf'

    if (!file) {
      return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Fayl hajmi juda katta' }, { status: 400 });
    }

    const allowed = kind === 'pdf' ? ALLOWED_PDF_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Ruxsat etilmagan fayl turi' }, { status: 400 });
    }

    const ext = kind === 'pdf' ? 'pdf' : (file.type.split('/')[1] || 'jpg');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `uploads/${kind || 'image'}/${Date.now()}-${safeName || `file.${ext}`}`;

    const blob = await put(pathname, file, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('POST /api/admin/upload error:', err);
    return NextResponse.json({ error: 'Yuklashda xatolik yuz berdi' }, { status: 500 });
  }
}
