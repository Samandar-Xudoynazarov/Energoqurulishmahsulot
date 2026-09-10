import { NextRequest, NextResponse } from 'next/server';
import { renameCategory, deleteCategory } from '../../../../lib/categories-store';
import { getProducts } from '../../../../lib/products-store';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (!body.name?.uz || !body.name?.ru || !body.name?.en) {
      return NextResponse.json({ error: 'Kategoriya nomi barcha 3 tilda kiritilishi shart' }, { status: 400 });
    }
    const categories = await renameCategory(params.id, body.name);
    return NextResponse.json({ categories });
  } catch (err) {
    console.error('PUT /api/admin/categories/[id] error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const products = await getProducts();
    const inUse = products.filter((p) => p.category === params.id);
    if (inUse.length > 0) {
      return NextResponse.json(
        { error: `Bu kategoriyada ${inUse.length} ta mahsulot bor. Avval ularni boshqa kategoriyaga o'tkazing yoki o'chiring.` },
        { status: 409 }
      );
    }
    const categories = await deleteCategory(params.id);
    return NextResponse.json({ categories });
  } catch (err) {
    console.error('DELETE /api/admin/categories/[id] error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
