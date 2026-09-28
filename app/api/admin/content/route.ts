import { NextRequest, NextResponse } from 'next/server';
import { getContentFresh, saveContent } from '../../../lib/content-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ content: await getContentFresh() });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const content = await saveContent(body?.content ?? body);
    return NextResponse.json({ content });
  } catch (err) {
    console.error('PUT /api/admin/content error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
