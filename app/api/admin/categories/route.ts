import { NextRequest, NextResponse } from 'next/server';
import { getCategories, addCategory } from '../../../lib/categories-store';

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name;
    if (!name?.uz || !name?.ru || !name?.en) {
      return NextResponse.json({ error: 'Kategoriya nomi barcha 3 tilda kiritilishi shart' }, { status: 400 });
    }
    const categories = await addCategory(name);
    return NextResponse.json({ categories }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/categories error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
