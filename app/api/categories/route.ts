import { NextResponse } from 'next/server';
import { getCategories } from '../../lib/categories-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (err) {
    console.error('GET /api/categories error:', err);
    return NextResponse.json({ error: 'Kategoriyalarni yuklab bo\'lmadi' }, { status: 500 });
  }
}
