import { NextResponse } from 'next/server';
import { getProductsFresh as getProducts, saveProducts } from '../../../lib/products-store';
import { fullModalData } from '../../../data/modalData';
import { Product } from '../../../types';

export const dynamic = 'force-dynamic';

// Bir martalik migratsiya: blob'dagi (eski) mahsulotlar ro'yxatini
// app/data/modalData.ts dagi joriy kodlar bilan TARTIB bo'yicha moslashtiradi.
// Faqat `code` va `category` yangilanadi — image/description/specs kabi
// admin panelda tahrirlangan boshqa maydonlar o'zgarishsiz qoladi.

function categoryFor(code: string): Product['category'] {
  if (code.startsWith('Ф')) return 'fundament';
  if (code.startsWith('ПА') || code.startsWith('УСО')) return 'tayanch';
  if (code.startsWith('Л') || code.startsWith('СБ')) return 'lotok';
  return 'maxsus';
}

export async function POST() {
  const current = await getProducts();
  const seedEntries = Object.entries(fullModalData);

  if (current.length !== seedEntries.length) {
    return NextResponse.json(
      {
        error: `Mos kelmadi: bazada ${current.length} ta mahsulot, modalData.ts da ${seedEntries.length} ta. Ehtimol admin panelda mahsulot qo'shilgan/o'chirilgan — avtomatik sinxronlash xavfli, qo'lda tekshiring.`,
        currentCodes: current.map((p) => p.code),
        seedCodes: seedEntries.map(([code]) => code),
      },
      { status: 409 }
    );
  }

  const currentSorted = [...current].sort((a, b) => a.order - b.order);

  const updated: Product[] = currentSorted.map((product, i) => {
    const [newCode] = seedEntries[i];
    return { ...product, code: newCode, category: categoryFor(newCode) };
  });

  await saveProducts(updated);
  return NextResponse.json({ ok: true, count: updated.length, products: updated });
}

// Xavfsizlik uchun: tasodifan brauzerdan ochib yuborilmasligi uchun GET orqali
// faqat joriy holatni ko'rsatamiz, hech narsani o'zgartirmaymiz.
export async function GET() {
  const current = await getProducts();
  const seedEntries = Object.entries(fullModalData);
  return NextResponse.json({
    match: current.length === seedEntries.length,
    currentCodes: current.sort((a, b) => a.order - b.order).map((p) => p.code),
    seedCodes: seedEntries.map(([code]) => code),
  });
}