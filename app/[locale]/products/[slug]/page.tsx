import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { Language, Product } from '../../../types';
import { SITE_URL } from '../../../lib/seo';
import { getProducts } from '../../../lib/products-store';
import { getCategories } from '../../../lib/categories-store';
import { getProjects } from '../../../lib/projects-store';
import { getSettings } from '../../../lib/settings-store';
import { findProductBySlug, isRealProduct, isValidLocale, productSlug, realImage } from '../../../lib/product-utils';
import ProductPageView from '../../../components/ProductPageView';

export const dynamic = 'force-dynamic';

const BRAND = 'ENERGOQURILISHMAHSULOT';

const FALLBACK_DESC: Record<Language, (p: Product) => string> = {
  uz: (p) => `${p.code} — ${p.name.uz}. Temir-beton mahsuloti ENERGOQURILISHMAHSULOT zavodidan. Narx va yetkazib berish bo'yicha so'rov yuboring.`,
  ru: (p) => `${p.code} — ${p.name.ru}. Железобетонное изделие от завода ЭНЕРГОКУРИЛИШМАХСУЛОТ. Узнайте цену и сроки поставки.`,
  en: (p) => `${p.code} — ${p.name.en}. Reinforced concrete product by ENERGOQURILISHMAHSULOT. Request a quote for price and delivery.`,
};

async function load(params: { locale: string; slug: string }) {
  if (!isValidLocale(params.locale)) return null;
  const products = await getProducts();
  const product = findProductBySlug(products, params.slug);
  if (!product || !isRealProduct(product)) return null;
  return { locale: params.locale as Language, product, products };
}

function describe(product: Product, locale: Language): string {
  const d = (product.description[locale] || '').trim();
  const text = d || FALLBACK_DESC[locale](product);
  return text.length > 160 ? text.slice(0, 157).trimEnd() + '…' : text;
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const data = await load(params);
  if (!data) return { title: `404 | ${BRAND}` };
  const { locale, product } = data;
  const slug = productSlug(product.code);
  const name = product.name[locale] || product.name.uz;
  const title = `${product.code} — ${name} | ${BRAND}`;
  const description = describe(product, locale);
  const image = realImage(product.image);

  return {
    title,
    description,
    keywords: [product.code, name, product.name.uz, product.name.ru, BRAND, 'ЖБИ', 'temir-beton'],
    alternates: {
      canonical: `${SITE_URL}/${locale}/products/${slug}`,
      languages: {
        uz: `${SITE_URL}/uz/products/${slug}`,
        ru: `${SITE_URL}/ru/products/${slug}`,
        en: `${SITE_URL}/en/products/${slug}`,
        'x-default': `${SITE_URL}/uz/products/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/products/${slug}`,
      siteName: BRAND,
      type: 'website',
      images: image ? [{ url: image, alt: name }] : undefined,
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description, images: image ? [image] : undefined },
  };
}

export default async function ProductPage({ params }: { params: { locale: string; slug: string } }) {
  const data = await load(params);
  if (!data) notFound();
  const { locale, product, products } = data;

  // Kirillcha yoki eski URL bilan kirilsa — kanonik lotin slug'ga yo'naltiramiz
  const slug = productSlug(product.code);
  if (decodeURIComponent(params.slug) !== slug) {
    permanentRedirect(`/${locale}/products/${slug}`);
  }

  const [categories, projects, settings] = await Promise.all([getCategories(), getProjects(), getSettings()]);
  const category = categories.find((c) => c.id === product.category);
  const related = products
    .filter((p) => p.category === product.category && p.code !== product.code)
    .sort((a, b) => a.order - b.order);
  const usedIn = projects.filter((p) => p.productCodes.includes(product.code));

  const name = product.name[locale] || product.name.uz;
  const url = `${SITE_URL}/${locale}/products/${slug}`;
  const image = realImage(product.image);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${product.code} — ${name}`,
      sku: product.code,
      mpn: product.code,
      description: describe(product, locale),
      category: category ? category.name[locale] : undefined,
      image: image || undefined,
      url,
      brand: { '@type': 'Brand', name: BRAND },
      manufacturer: { '@type': 'Organization', name: 'ENERGOQURILISHMAHSULOT MCHJ', url: SITE_URL },
      additionalProperty: product.specs.map((s) => ({
        '@type': 'PropertyValue',
        name: s.label[locale] || s.label.uz,
        value: s.value,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: BRAND, item: `${SITE_URL}/${locale}` },
        ...(category
          ? [{ '@type': 'ListItem', position: 2, name: category.name[locale] || category.name.uz, item: `${SITE_URL}/${locale}#products` }]
          : []),
        { '@type': 'ListItem', position: category ? 3 : 2, name: product.code, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <ProductPageView
        locale={locale}
        product={product}
        category={category}
        related={related}
        projects={usedIn}
        products={products}
        settings={settings}
      />
    </>
  );
}
