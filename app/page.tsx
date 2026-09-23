import type { Metadata } from 'next';
import HomePage from './components/HomePage';
import { SITE_URL, seoContent } from './lib/seo';
import { getProducts } from './lib/products-store';
import { getCategories } from './lib/categories-store';
import { getProjects } from './lib/projects-store';
import { getSettings } from './lib/settings-store';

export const dynamic = 'force-dynamic';

const seo = seoContent.uz;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: {
    canonical: `${SITE_URL}/uz`,
    languages: {
      uz: `${SITE_URL}/uz`,
      ru: `${SITE_URL}/ru`,
      en: `${SITE_URL}/en`,
      'x-default': `${SITE_URL}/uz`,
    },
  },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: `${SITE_URL}/uz`,
    siteName: 'ENERGOQURILISHMAHSULOT',
    locale: seo.ogLocale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
};

export default async function Home() {
  const [products, categories, projects, settings] = await Promise.all([getProducts(), getCategories(), getProjects(), getSettings()]);
  return <HomePage locale="uz" initialProducts={products} initialCategories={categories} projects={projects} settings={settings} />;
}
