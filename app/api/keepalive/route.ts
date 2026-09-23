import { NextRequest, NextResponse } from 'next/server';
import { getSettingsFresh } from '../../lib/settings-store';

export const dynamic = 'force-dynamic';

// Supabase bepul loyihasi 7 kun faolsiz qolsa "pauza"ga tushadi.
// Vercel Cron bu manzilni har kuni chaqiradi (vercel.json) — loyiha doim faol turadi.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  await getSettingsFresh();
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
