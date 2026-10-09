import { ContentCard, LocalizedText, SiteContent } from '../types';
import { createJsonStore } from './json-store';
import { defaultContent, CONTENT_SECTIONS } from './content-defaults';
import { getProducts } from './products-store';
import { deleteByUrl } from './storage';

const store = createJsonStore<SiteContent>('content', defaultContent);

const txt = (v: any, max = 4000): LocalizedText => ({
  uz: String(v?.uz ?? '').slice(0, max),
  ru: String(v?.ru ?? '').slice(0, max),
  en: String(v?.en ?? '').slice(0, max),
});

function cleanCard(c: any, i: number): ContentCard {
  return {
    id: String(c?.id || `c${Date.now().toString(36)}${i}`).slice(0, 40),
    icon: String(c?.icon || 'fa-star').replace(/[^a-z0-9-]/g, '').slice(0, 40),
    image: String(c?.image || '').trim(),
    images: Array.isArray(c?.images) ? c.images.map((x: any) => String(x).trim()).filter(Boolean).slice(0, 30) : [],
    title: txt(c?.title, 200),
    desc: txt(c?.desc, 600),
    body: txt(c?.body, 6000),
  };
}

export function sanitizeContent(data: any): SiteContent {
  const d = defaultContent();
  const out = {} as SiteContent;
  for (const s of CONTENT_SECTIONS) {
    const list = Array.isArray(data?.[s]) ? data[s] : d[s];
    out[s] = list.slice(0, 12).map(cleanCard);
  }
  return out;
}

/**
 * Eski saytda jamoa/texnika/avtopark «mahsulot» sifatida saqlangan edi.
 * Yangi bo'limda rasm yoki matn bo'lmasa — o'sha eski yozuvdan olinadi.
 */
async function withLegacy(content: SiteContent): Promise<SiteContent> {
  const needs = content.team.some((c) => !c.image || !c.body?.uz);
  if (!needs) return content;
  const products = await getProducts().catch(() => []);
  const team = content.team.map((c) => {
    const p = products.find((x) => x.code === c.id);
    if (!p) return c;
    return {
      ...c,
      image: c.image || p.image || '',
      body: c.body?.uz || c.body?.ru ? c.body : { uz: p.description.uz, ru: p.description.ru, en: p.description.en },
    };
  });
  return { ...content, team };
}

export async function getContent(): Promise<SiteContent> {
  return withLegacy(sanitizeContent(await store.get()));
}

export async function getContentFresh(): Promise<SiteContent> {
  return withLegacy(sanitizeContent(await store.getFresh()));
}

const files = (c: SiteContent) =>
  new Set(CONTENT_SECTIONS.flatMap((s) => c[s].flatMap((x) => [x.image, ...(x.images || [])])).filter(Boolean));

export async function saveContent(data: unknown): Promise<SiteContent> {
  const before = sanitizeContent(await store.getFresh());
  const clean = sanitizeContent(data);
  await store.save(clean);
  // olib tashlangan rasmlarni Supabase'dan o'chirish (eski mahsulot rasmlariga tegmaydi)
  const now = files(clean);
  const products = await getProducts().catch(() => []);
  const productFiles = new Set(products.flatMap((p) => [p.image, p.photo, p.drawing]).filter(Boolean));
  for (const url of Array.from(files(before))) if (!now.has(url) && !productFiles.has(url)) await deleteByUrl(url).catch(() => {});
  return clean;
}
