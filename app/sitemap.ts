import { MetadataRoute } from 'next';
import { SITE_URL } from './lib/seo';
import { getProducts } from './lib/products-store';
import { isRealProduct, productSlug } from './lib/product-utils';

export const revalidate = 3600;

const LOCALES = ['uz', 'ru', 'en'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const homeLanguages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}`]));

  const home: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1, alternates: { languages: homeLanguages } },
    ...LOCALES.map((l) => ({
      url: `${SITE_URL}/${l}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 1,
      alternates: { languages: homeLanguages },
    })),
  ];

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = (await getProducts()).filter(isRealProduct);
    productEntries = products.flatMap((p) => {
      const slug = productSlug(p.code);
      const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/products/${slug}`]));
      return LOCALES.map((l) => ({
        url: `${SITE_URL}/${l}/products/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: { languages },
      }));
    });
  } catch (err) {
    console.error('sitemap products error:', err);
  }

  return [...home, ...productEntries];
}
