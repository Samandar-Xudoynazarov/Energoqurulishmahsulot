import { NextRequest, NextResponse } from 'next/server';
import { getProductsFresh, saveProducts } from '../../../../lib/products-store';
import { mergeCatalog, ImportOptions } from '../../../../lib/catalog-import';
import { CATALOG, CATALOG_DATE } from '../../../../data/catalog';
import { storageCatalog, uploadCatalogImages, cleanReplacedImages } from '../../../../lib/catalog-images';
import { readJson } from '../../../../lib/storage';
import { Product } from '../../../../types';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function opts(body: any): ImportOptions {
  return { prices: body?.prices !== false, specs: body?.specs !== false, texts: body?.texts !== false, addNew: body?.addNew !== false, images: body?.images !== false };
}

/** Oldindan ko'rish: nima o'zgarishini qaytaradi, saqlamaydi */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const flag = (k: string) => sp.get(k) !== '0';
  const o = opts({ prices: flag('prices'), specs: flag('specs'), texts: flag('texts'), addNew: flag('addNew'), images: flag('images') });
  const { changes } = mergeCatalog(await getProductsFresh(), o, o.images ? storageCatalog() : CATALOG);
  return NextResponse.json({ changes, total: CATALOG.length, date: CATALOG_DATE });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    // Do not overwrite live data with seed products after a storage read failure.
    const previous = await readJson<Product[]>('data/products.json');
    if (!previous) return NextResponse.json({ error: 'Amaldagi katalog topilmadi. Avval mahsulotlarni saqlang.' }, { status: 409 });
    const options = opts(body);
    const { products, changes } = mergeCatalog(previous, options, options.images ? storageCatalog() : CATALOG);
    if (options.images) await uploadCatalogImages(previous, products);
    const current = await readJson<Product[]>('data/products.json');
    if (JSON.stringify(current) !== JSON.stringify(previous)) return NextResponse.json({ error: 'Katalog boshqa oynada o‘zgartirildi. Qayta yangilang.' }, { status: 409 });
    await saveProducts(products);
    const warnings = options.images ? await cleanReplacedImages(previous, products) : [];
    return NextResponse.json({ products, changes, warnings });
  } catch (err) {
    console.error('POST /api/admin/products/import error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
