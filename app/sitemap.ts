import { MetadataRoute } from 'next';
import { SITE_URL } from './lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    uz: `${SITE_URL}/uz`,
    ru: `${SITE_URL}/ru`,
    en: `${SITE_URL}/en`,
  };

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}/uz`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}/ru`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
  ];
}
