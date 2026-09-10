import { NextResponse } from 'next/server';
import { getProducts } from '../../lib/products-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error('GET /api/products error:', err);
    return NextResponse.json({ error: 'Mahsulotlarni yuklab bo\'lmadi' }, { status: 500 });
  }
}
