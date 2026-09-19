import { Language } from '../types';

export const SITE_URL = 'https://energoqurilishmahsulot.uz';

const PRODUCT_CODES = [
  'Ф5-УСУ', 'Ф5-АМК', 'Ф5-АМ', 'Ф4-АМК', 'Ф3-АМК', 'Ф5-4', 'Ф5-2', 'Ф4-2', 'Ф3-2',
  'ПА3-1', 'ПАЗ-2', 'УСО-3А', 'УСО-4А',
  'Л-1', 'Л-2', 'Л-3', 'ЛЖ-2.8', 'ЛЖ-1.6', 'СБ-95/3', 'Л-20.5',
  'АР-5', 'Р1-А', 'УБ-1А', 'ОПП-5',
];

interface SeoEntry {
  title: string;
  description: string;
  keywords: string[];
  ogLocale: string;
}

export const seoContent: Record<Language, SeoEntry> = {
  uz: {
    title: 'ENERGO QURILISH MAHSULOT — temir-beton mahsulotlari ishlab chiqaruvchi zavod',
    description:
      '50 yildan ortiq tajribaga ega ENERGOQURILISHMAHSULOT zavodi — energetika va sanoat uchun temir-beton fundamentlar (Ф5-УСУ, Ф4-АМК, Ф3-2), tayanch ustunlar (ПА3-1, УСО-3А), lotok va plitalar ishlab chiqaradi. ISO 9001 sifat sertifikati.',
    keywords: [
      'ENERGO QURILISH MAHSULOT', 'temir-beton mahsulotlari', 'temir-beton zavodi', 'EKM','ekm',
      'fundament ishlab chiqarish', 'tayanch ustunlar', 'stalbalar', 'lotok',
      'beton plitalar', "O'zbekiston energetika", 'ISO 9001', ...PRODUCT_CODES, 'Energo qurulish maxsuloti', 'energo', 'temir biton' 
    ],
    ogLocale: 'uz_UZ',
  },
  ru: {
    title: 'ЭНЕРГОКУРИЛИШМАХСУЛОТ — завод железобетонных изделий',
    description:
      'Завод «ЭНЕРГОКУРИЛИШМАХСУЛОТ» с более чем 50-летним опытом производит железобетонные фундаменты (Ф5-УСУ, Ф4-АМК, Ф3-2), опоры (ПА3-1, УСО-3А), лотки и плиты для энергетики и промышленности Узбекистана. Сертификат качества ISO 9001.',
    keywords: [
      'ЭНЕРГОКУРИЛИШМАХСУЛОТ', 'железобетонные изделия', 'завод жби', 'ЭКМ','экм',
      'производство фундаментов', 'опоры и стойки', 'лотки бетонные',
      'плиты железобетонные', 'энергетика Узбекистана', 'ISO 9001', ...PRODUCT_CODES,
    ],
    ogLocale: 'ru_RU',
  },
  en: {
    title: 'ENERGOQURILISHMAHSULOT — reinforced concrete products factory',
    description:
      'ENERGOQURILISHMAHSULOT is a 50-year-old Uzbekistan factory producing reinforced concrete foundations (Ф5-УСУ, Ф4-АМК, Ф3-2), support poles (ПА3-1, УСО-3А), trays and slabs for the energy and industrial sectors. ISO 9001 certified.',
    keywords: [
      'ENERGOQURILISHMAHSULOT', 'reinforced concrete products', 'concrete factory Uzbekistan','EKM','ekm',
      'foundation manufacturer', 'support poles', 'concrete trays', 'concrete slabs',
      'Uzbekistan energy sector', 'ISO 9001', ...PRODUCT_CODES,'Energo qurulish maxsuloti', 'energo', 'temir biton'
    ],
    ogLocale: 'en_US',
  },
};
