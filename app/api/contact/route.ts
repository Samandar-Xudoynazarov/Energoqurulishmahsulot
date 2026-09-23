import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage, escapeHtml } from '../../lib/telegram';
import { InquiryPayload } from '../../types';
import { SITE_URL } from '../../lib/seo';
import { productSlug } from '../../lib/product-utils';

export const dynamic = 'force-dynamic';

// Oddiy spam himoyasi: bitta IP'dan 10 daqiqada 5 tadan ortiq so'rov yo'q.
// (Serverless muhitda har bir instansiya uchun alohida — lekin oddiy botlarga yetarli.)
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > MAX_PER_WINDOW;
}

function clip(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

const LOCALE_FLAG: Record<string, string> = { uz: '🇺🇿 UZ', ru: '🇷🇺 RU', en: '🇬🇧 EN' };

export async function POST(req: NextRequest) {
  let body: InquiryPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  // Honeypot: odam ko'rmaydigan maydon to'ldirilgan bo'lsa — bot. Jim "muvaffaqiyat" qaytaramiz.
  if (body.website) return NextResponse.json({ ok: true });

  const name = clip(body.name, 100);
  const phone = clip(body.phone, 40);
  const email = clip(body.email, 120);
  const company = clip(body.company, 150);
  const message = clip(body.message, 2000);
  const productCode = clip(body.productCode, 60);
  const locale = clip(body.locale, 5);

  if (!name || !phone || phone.replace(/\D/g, '').length < 7) {
    return NextResponse.json({ error: 'validation' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const lines = [
    productCode ? `🧱 <b>Mahsulot bo'yicha so'rov: ${escapeHtml(productCode)}</b>` : '📩 <b>Saytdan yangi so\'rov</b>',
    '',
    `👤 <b>Ism:</b> ${escapeHtml(name)}`,
    `📞 <b>Telefon:</b> ${escapeHtml(phone)}`,
    email && `✉️ <b>Email:</b> ${escapeHtml(email)}`,
    company && `🏢 <b>Kompaniya:</b> ${escapeHtml(company)}`,
    message && `\n💬 <b>Xabar:</b>\n${escapeHtml(message)}`,
    '',
    productCode && `🔗 ${SITE_URL}/${locale || 'uz'}/products/${productSlug(productCode)}`,
    `🌐 Til: ${LOCALE_FLAG[locale] || locale || '—'}`,
  ].filter(Boolean);

  try {
    await sendTelegramMessage(lines.join('\n'));
    return NextResponse.json({ ok: true });
  } catch (err) {
    // So'rov yo'qolmasligi uchun kamida log'da qolsin
    console.error('CONTACT_FORM_FAILED', JSON.stringify({ name, phone, email, company, message, productCode }), err);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
}
