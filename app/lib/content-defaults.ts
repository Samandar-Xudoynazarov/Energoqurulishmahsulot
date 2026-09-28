import { ContentCard, LocalizedText, SiteContent } from '../types';

const L = (uz: string, ru: string, en: string): LocalizedText => ({ uz, ru, en });
const card = (id: string, icon: string, title: LocalizedText, desc: LocalizedText, body?: LocalizedText): ContentCard => ({
  id, icon, image: '', images: [], title, desc, body: body || L('', '', ''),
});

/** Bosh sahifa bo'limlari — admin hali hech narsa saqlamagan bo'lsa */
export function defaultContent(): SiteContent {
  return {
    team: [
      card('jamoa', 'fa-users', L('Ahil jamoa', 'Дружный коллектив', 'Friendly team'),
        L('Yuqori malakali muhandislar, inspektorlar va ishchilar', 'Высококвалифицированные инженеры, инспекторы и рабочие', 'Highly qualified engineers, inspectors and workers')),
      card('texnika', 'fa-industry', L('Zamonaviy uskunalar', 'Современное оборудование', 'Modern equipment'),
        L('Yuqori quvvatli beton qorishtirish, vibropress va qoliplash mashinalari', 'Мощные бетоносмесители, вибропрессы и формовочные машины', 'High-power concrete mixers, vibropress and molding machines')),
      card('avtopark', 'fa-truck', L('Kuchli avtopark', 'Мощный автопарк', 'Strong vehicle fleet'),
        L('Katta hajmdagi yuk ko‘tarish kranlari va logistika vositalari', 'Крупнотоннажные краны и логистические средства', 'Large-capacity cranes and logistics vehicles')),
    ],
    process: [
      card('step1', 'fa-clipboard-check', L('Xomashyo nazorati', 'Контроль сырья', 'Raw material control'),
        L('Armatura karkaslari tayyorlash va materiallarni tekshirish', 'Подготовка арматурных каркасов и проверка материалов', 'Preparation of reinforcement frames and material inspection')),
      card('step2', 'fa-fill-drip', L('Beton tayyorlash', 'Приготовление бетона', 'Concrete preparation'),
        L('Yuqori markali betonni vibratsiya bilan zichlash', 'Уплотнение высокомарочного бетона вибрированием', 'Compaction of high-grade concrete by vibration')),
      card('step3', 'fa-flask', L('Laboratoriya sinovi', 'Лабораторные испытания', 'Laboratory testing'),
        L('Qat’iy sifat nazorati va standartlarga muvofiqlik', 'Строгий контроль качества и соответствие стандартам', 'Strict quality control and compliance with standards')),
      card('step4', 'fa-shipping-fast', L('Yetkazib berish', 'Доставка', 'Delivery'),
        L('Buyurtmachiga o‘z vaqtida va xavfsiz yetkazish', 'Своевременная и безопасная доставка заказчику', 'Timely and safe delivery to the customer')),
    ],
    why: [
      card('why1', 'fa-clock', L('50 yillik tajriba', '50-летний опыт', '50 years of experience'),
        L('Bozorda barqaror va ishonchli faoliyat', 'Стабильная и надёжная деятельность на рынке', 'Stable and reliable market presence')),
      card('why2', 'fa-check-circle', L('ISO 9001 sifat', 'Качество ISO 9001', 'ISO 9001 quality'),
        L('Qat’iy laboratoriya nazorati va standartlar', 'Строгий лабораторный контроль и стандарты', 'Strict laboratory control and standards')),
      card('why3', 'fa-shipping-fast', L('Tezkor logistika', 'Быстрая логистика', 'Fast logistics'),
        L('O‘z vaqtida va xavfsiz yetkazib berish', 'Своевременная и безопасная доставка', 'Timely and safe delivery')),
    ],
  };
}

export const CONTENT_SECTIONS = ['team', 'process', 'why'] as const;
export type ContentSection = (typeof CONTENT_SECTIONS)[number];
