import { NextRequest, NextResponse } from 'next/server';
import { getProductsFresh as getProducts, upsertProduct, deleteProduct, deleteBlobFile } from '../../../../lib/products-store';
import { Product } from '../../../../types';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const body = await req.json();
    const products = await getProducts();
    const existing = products.find((p) => p.code === params.code);
    if (!existing) {
      return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
    }

    const updatedProduct: Product = {
      ...existing,
      category: body.category ?? existing.category,
      name: body.name ?? existing.name,
      tag: body.tag ?? existing.tag,
      description: body.description ?? existing.description,
      image: body.image ?? existing.image,
      certificatePdf: body.certificatePdf ?? existing.certificatePdf,
      passportPdf: body.passportPdf ?? existing.passportPdf,
      specs: Array.isArray(body.specs) ? body.specs : existing.specs,
    };

    // Eski fayllar yangisiga almashtirilgan bo'lsa, Blob'dan tozalash
    if (existing.image && existing.image !== updatedProduct.image) {
      await deleteBlobFile(existing.image);
    }
    if (existing.certificatePdf && existing.certificatePdf !== updatedProduct.certificatePdf) {
      await deleteBlobFile(existing.certificatePdf);
    }
    if (existing.passportPdf && existing.passportPdf !== updatedProduct.passportPdf) {
      await deleteBlobFile(existing.passportPdf);
    }

    const updated = await upsertProduct(updatedProduct);
    return NextResponse.json({ products: updated });
  } catch (err) {
    console.error('PUT /api/admin/products/[code] error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const products = await getProducts();
    const existing = products.find((p) => p.code === params.code);
    if (!existing) {
      return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
    }

    // Best-effort cleanup of associated files
    if (existing.image) await deleteBlobFile(existing.image);
    if (existing.certificatePdf) await deleteBlobFile(existing.certificatePdf);
    if (existing.passportPdf) await deleteBlobFile(existing.passportPdf);

    const updated = await deleteProduct(params.code);
    return NextResponse.json({ products: updated });
  } catch (err) {
    console.error('DELETE /api/admin/products/[code] error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}