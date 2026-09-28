import { NextRequest, NextResponse } from 'next/server';
import { getProductsFresh, saveProducts } from '../../../../lib/products-store';
import { mergeCatalog, ImportOptions } from '../../../../lib/catalog-import';
import { CATALOG, CATALOG_DATE } from '../../../../data/catalog';

export const dynamic = 'force-dynamic';

function opts(body: any): ImportOptions {
  return { prices: body?.prices !== false, specs: body?.specs !== false, texts: body?.texts !== false, addNew: body?.addNew !== false };
}

/** Oldindan ko'rish: nima o'zgarishini qaytaradi, saqlamaydi */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const flag = (k: string) => sp.get(k) !== '0';
  const o = opts({ prices: flag('prices'), specs: flag('specs'), texts: flag('texts'), addNew: flag('addNew') });
  const { changes } = mergeCatalog(await getProductsFresh(), o);
  return NextResponse.json({ changes, total: CATALOG.length, date: CATALOG_DATE });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { products, changes } = mergeCatalog(await getProductsFresh(), opts(body));
    await saveProducts(products);
    return NextResponse.json({ products, changes });
  } catch (err) {
    console.error('POST /api/admin/products/import error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
