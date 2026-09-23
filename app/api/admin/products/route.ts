import { NextRequest, NextResponse } from 'next/server';
import { getProductsFresh as getProducts, upsertProduct } from '../../../lib/products-store';
import { Product } from '../../../types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

function validateProduct(body: any): { valid: boolean; error?: string } {
  if (!body.code || typeof body.code !== 'string') return { valid: false, error: 'Kod kiritilishi shart' };
  if (!body.category) return { valid: false, error: 'Kategoriya tanlanishi shart' };
  if (!body.name?.uz || !body.name?.ru || !body.name?.en) {
    return { valid: false, error: 'Nom barcha 3 tilda kiritilishi shart' };
  }
  return { valid: true };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { valid, error } = validateProduct(body);
    if (!valid) return NextResponse.json({ error }, { status: 400 });

    const products = await getProducts();
    if (products.some((p) => p.code === body.code)) {
      return NextResponse.json({ error: 'Bu kod bilan mahsulot allaqachon mavjud' }, { status: 409 });
    }

    const product: Product = {
      code: body.code,
      category: body.category,
      name: body.name,
      tag: body.tag || { uz: '', ru: '', en: '' },
      description: body.description || { uz: '', ru: '', en: '' },
      image: body.image || '',
      certificatePdf: body.certificatePdf || undefined,
      passportPdf: body.passportPdf || undefined,
      specs: Array.isArray(body.specs) ? body.specs : [],
      order: products.length,
    };

    const updated = await upsertProduct(product);
    return NextResponse.json({ products: updated }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/products error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
