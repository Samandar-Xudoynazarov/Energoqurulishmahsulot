import { Project, LocalizedText } from '../../../types';

function lt(v: any): LocalizedText {
  return {
    uz: typeof v?.uz === 'string' ? v.uz.trim() : '',
    ru: typeof v?.ru === 'string' ? v.ru.trim() : '',
    en: typeof v?.en === 'string' ? v.en.trim() : '',
  };
}

export function normalizeProject(body: any): { project?: Omit<Project, 'id' | 'order'>; error?: string } {
  const title = lt(body?.title);
  if (!title.uz || !title.ru || !title.en) {
    return { error: 'Loyiha nomi barcha 3 tilda kiritilishi shart' };
  }
  return {
    project: {
      title,
      location: lt(body?.location),
      description: lt(body?.description),
      year: typeof body?.year === 'string' ? body.year.trim().slice(0, 20) : '',
      images: Array.isArray(body?.images) ? body.images.filter((s: unknown) => typeof s === 'string' && s) : [],
      productCodes: Array.isArray(body?.productCodes) ? body.productCodes.filter((s: unknown) => typeof s === 'string' && s) : [],
    },
  };
}
