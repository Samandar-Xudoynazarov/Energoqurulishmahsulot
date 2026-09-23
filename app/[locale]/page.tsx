import type { Metadata } from 'next';
import HomePage from '../components/HomePage';
import { Language } from '../types';
import { SITE_URL, seoContent } from '../lib/seo';
import { getProducts } from '../lib/products-store';
import { getCategories } from '../lib/categories-store';
import { getProjects } from '../lib/projects-store';
import { getSettings } from '../lib/settings-store';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [{ locale: 'uz' }, { locale: 'ru' }, { locale: 'en' }];
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (['uz', 'ru', 'en'].includes(params.locale) ? params.locale : 'uz') as Language;
  const seo = seoContent[locale];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
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
      url: `${SITE_URL}/${locale}`,
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
}

export default async function LocalePage({ params }: { params: { locale: string } }) {
  const locale = (['uz', 'ru', 'en'].includes(params.locale) ? params.locale : 'uz') as Language;
  const [products, categories, projects, settings] = await Promise.all([getProducts(), getCategories(), getProjects(), getSettings()]);
  return <HomePage locale={locale} initialProducts={products} initialCategories={categories} projects={projects} settings={settings} />;
}
