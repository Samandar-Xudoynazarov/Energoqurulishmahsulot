import { Language } from '../types';

export const SITE_URL = 'https://energoqurilishmahsulot.uz';

const PRODUCT_CODES = [
  'F5-USU', 'F5-AMK', 'F5-AM', 'F4-AMK', 'F3-AMK', 'F5-4', 'F5-2', 'F4-2', 'F3-2',
  'PA3-1', 'PAZ-2', 'USO-3A', 'USO-4A',
  'L-1', 'L-2', 'L-3', 'LJ-2.8', 'LJ-1.6', 'SB-95/3', 'L-20.5',
  'AR-5', 'R1-A', 'UB-1A', 'OPP-5',
];

interface SeoEntry {
  title: string;
  description: string;
  keywords: string[];
  ogLocale: string;
}

export const seoContent: Record<Language, SeoEntry> = {
  uz: {
    title: 'ENERGOQURILISHMAHSULOT — temir-beton mahsulotlari ishlab chiqaruvchi zavod',
    description:
      '50 yildan ortiq tajribaga ega ENERGOQURILISHMAHSULOT zavodi — energetika va sanoat uchun temir-beton fundamentlar (F5-USU, F4-AMK, F3-2), tayanch ustunlar (PA3-1, USO-3A), lotok va plitalar ishlab chiqaradi. ISO 9001 sifat sertifikati.',
    keywords: [
      'ENERGOQURILISHMAHSULOT', 'temir-beton mahsulotlari', 'temir-beton zavodi',
      'fundament ishlab chiqarish', 'tayanch ustunlar', 'stalbalar', 'lotok',
      'beton plitalar', "O'zbekiston energetika", 'ISO 9001', ...PRODUCT_CODES,
    ],
    ogLocale: 'uz_UZ',
  },
  ru: {
    title: 'ЭНЕРГОКУРИЛИШМАХСУЛОТ — завод железобетонных изделий',
    description:
      'Завод «ЭНЕРГОКУРИЛИШМАХСУЛОТ» с более чем 50-летним опытом производит железобетонные фундаменты (F5-USU, F4-AMK, F3-2), опоры (PA3-1, USO-3A), лотки и плиты для энергетики и промышленности Узбекистана. Сертификат качества ISO 9001.',
    keywords: [
      'ЭНЕРГОКУРИЛИШМАХСУЛОТ', 'железобетонные изделия', 'завод жби',
      'производство фундаментов', 'опоры и стойки', 'лотки бетонные',
      'плиты железобетонные', 'энергетика Узбекистана', 'ISO 9001', ...PRODUCT_CODES,
    ],
    ogLocale: 'ru_RU',
  },
  en: {
    title: 'ENERGOQURILISHMAHSULOT — reinforced concrete products factory',
    description:
      'ENERGOQURILISHMAHSULOT is a 50-year-old Uzbekistan factory producing reinforced concrete foundations (F5-USU, F4-AMK, F3-2), support poles (PA3-1, USO-3A), trays and slabs for the energy and industrial sectors. ISO 9001 certified.',
    keywords: [
      'ENERGOQURILISHMAHSULOT', 'reinforced concrete products', 'concrete factory Uzbekistan',
      'foundation manufacturer', 'support poles', 'concrete trays', 'concrete slabs',
      'Uzbekistan energy sector', 'ISO 9001', ...PRODUCT_CODES,
    ],
    ogLocale: 'en_US',
  },
};
