import { NextRequest, NextResponse } from 'next/server';
import { getSettingsFresh as getSettings, saveSettings } from '../../../lib/settings-store';
import { deleteBlobFile } from '../../../lib/products-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await getSettings();
    const settings = await saveSettings({ ...existing, ...body });
    if (existing.aboutImage && existing.aboutImage !== settings.aboutImage) {
      await deleteBlobFile(existing.aboutImage);
    }
    return NextResponse.json({ settings });
  } catch (err) {
    console.error('PUT /api/admin/settings error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
