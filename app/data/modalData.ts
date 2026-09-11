import { ModalData } from '../types';

const IMG = (label: string) => `https://via.placeholder.com/600x350/1a3f62/ffffff?text=${encodeURIComponent(label)}`;

export const fullModalData: ModalData = {
  jamoa: {
    uz: { title: "Ahil jamoa", tag: "Bizning kadrlar", image: IMG('Jamoa rasmi'), desc: "Zavodimizning eng katta boyligi — ko‘p yillik tajribaga ega mutaxassislarimiz. Yuqori malakali muhandislar, sifat nazorati inspektorlari va mas'uliyatli ishchi-xodimlar birgalikda sifatli mahsulotlar yaratadi. Har bir xodim o‘z ishining ustasi va bizning muvaffaqiyatimiz poydevori." },
    ru: { title: "Дружный коллектив", tag: "Наши кадры", image: IMG('Jamoa rasmi'), desc: "Наше главное богатство — это наши специалисты с многолетним опытом. Высококвалифицированные инженеры, инспекторы по качеству и ответственные рабочие совместно создают качественную продукцию. Каждый сотрудник — мастер своего дела и основа нашего успеха." },
    en: { title: "Friendly team", tag: "Our staff", image: IMG('Jamoa rasmi'), desc: "Our greatest asset is our specialists with many years of experience. Highly qualified engineers, quality control inspectors and dedicated workers together create quality products. Every employee is a master of their craft and the foundation of our success." }
  },
  texnika: {
    uz: { title: "Zamonaviy texnika va uskunalar", tag: "Ishlab chiqarish quvvati", image: IMG('Texnika rasmi'), desc: "Zavodimiz eng so‘nggi rusumdagi og‘ir texnika va ishlab chiqarish uskunalari bilan jihozlangan: yuqori quvvatli beton qorishtirish uskunalari, zamonaviy vibropress va qoliplash mashinalari, katta hajmdagi yuk ko‘tarish kranlari va kuchli avtopark. Bu bizga yuqori sifat va tezkorlikni kafolatlaydi." },
    ru: { title: "Современная техника и оборудование", tag: "Производственная мощность", image: IMG('Texnika rasmi'), desc: "Наш завод оснащён новейшей тяжёлой техникой и производственным оборудованием: высокопроизводительные бетоносмесители, современные вибропрессы и формовочные машины, крупнотоннажные краны и мощный автопарк. Это гарантирует высокое качество и оперативность." },
    en: { title: "Modern machinery and equipment", tag: "Production capacity", image: IMG('Texnika rasmi'), desc: "Our plant is equipped with the latest heavy machinery and production equipment: high-power concrete mixers, modern vibropress and molding machines, large-capacity cranes and a strong vehicle fleet. This ensures high quality and efficiency." }
  },
  avtopark: {
    uz: { title: "Kuchli avtopark", tag: "Logistika", image: IMG('Avtopark rasmi'), desc: "Bizning avtoparkimiz katta hajmdagi yuklarni tashish va logistika uchun mo‘ljallangan zamonaviy yuk mashinalari va maxsus texnikalar bilan jihozlangan. Bu yetkazib berish muddatlarini qisqartirish va mijozlarga o‘z vaqtida yetib borish imkonini beradi." },
    ru: { title: "Мощный автопарк", tag: "Логистика", image: IMG('Avtopark rasmi'), desc: "Наш автопарк оснащён современными грузовиками и специальной техникой для перевозки крупногабаритных грузов и логистики. Это позволяет сокращать сроки доставки и своевременно доставлять продукцию клиентам." },
    en: { title: "Strong vehicle fleet", tag: "Logistics", image: IMG('Avtopark rasmi'), desc: "Our vehicle fleet is equipped with modern trucks and special vehicles for transporting large loads and logistics. This reduces delivery times and ensures timely delivery to customers." }
  },
  "Ф5-УСУ": {
    uz: { title: "Ф5-УСУ fundamenti", tag: "F-seriyasi", image: IMG('Ф5-УСУ'), desc: "Yuqori kuchlanishli liniyalar va podstansiyalar uchun mo‘ljallangan mustahkam temir-beton fundament. Yuqori yuk ko‘tarish qobiliyati va uzoq xizmat muddati." },
    ru: { title: "Фундамент Ф5-УСУ", tag: "Серия F", image: IMG('Ф5-УСУ'), desc: "Прочный железобетонный фундамент для линий высокого напряжения и подстанций. Высокая несущая способность и длительный срок службы." },
    en: { title: "Ф5-УСУ foundation", tag: "F-Series", image: IMG('Ф5-УСУ'), desc: "A durable reinforced concrete foundation for high-voltage lines and substations. High load-bearing capacity and long service life." }
  },
  "Ф5-АМК": {
    uz: { title: "Ф5-АМК fundamenti", tag: "F-seriyasi", image: IMG('Ф5-АМК'), desc: "Modifikatsiyalangan F5 seriyali fundament. Kuchli korroziyaga qarshi qoplama va mustahkamlangan armatura." },
    ru: { title: "Фундамент Ф5-АМК", tag: "Серия F", image: IMG('Ф5-АМК'), desc: "Модифицированный фундамент серии F5. Усиленное антикоррозийное покрытие и армирование." },
    en: { title: "Ф5-АМК foundation", tag: "F-Series", image: IMG('Ф5-АМК'), desc: "A modified F5-series foundation with strong anti-corrosion coating and reinforced rebar." }
  },
  "Ф5-АМ": {
    uz: { title: "Ф5-АМ fundamenti", tag: "F-seriyasi", image: IMG('Ф5-АМ'), desc: "Engilroq versiya, lekin yuqori mustahkamlikka ega. O‘rnatish qulayligi va tejamkorlik." },
    ru: { title: "Фундамент Ф5-АМ", tag: "Серия F", image: IMG('Ф5-АМ'), desc: "Облегчённая версия с высокой прочностью. Удобство монтажа и экономичность." },
    en: { title: "Ф5-АМ foundation", tag: "F-Series", image: IMG('Ф5-АМ'), desc: "A lighter version with high strength. Easy installation and cost efficiency." }
  },
  "Ф4-АМК": {
    uz: { title: "Ф4-АМК fundamenti", tag: "F-seriyasi", image: IMG('Ф4-АМК'), desc: "O‘rta o‘lchamdagi podstansiyalar uchun mo‘ljallangan. Yuqori sifatli beton va armatura." },
    ru: { title: "Фундамент Ф4-АМК", tag: "Серия F", image: IMG('Ф4-АМК'), desc: "Предназначен для подстанций среднего размера. Высококачественный бетон и арматура." },
    en: { title: "Ф4-АМК foundation", tag: "F-Series", image: IMG('Ф4-АМК'), desc: "Designed for medium-sized substations. High-quality concrete and rebar." }
  },
  "Ф3-АМК": {
    uz: { title: "Ф3-АМК fundamenti", tag: "F-seriyasi", image: IMG('Ф3-АМК'), desc: "Kichikroq o‘lchamdagi energetika inshootlari uchun ixcham va mustahkam poydevor." },
    ru: { title: "Фундамент Ф3-АМК", tag: "Серия F", image: IMG('Ф3-АМК'), desc: "Компактный и прочный фундамент для энергетических объектов меньшего размера." },
    en: { title: "Ф3-АМК foundation", tag: "F-Series", image: IMG('Ф3-АМК'), desc: "A compact and durable foundation for smaller energy facilities." }
  },
  "Ф5-4": {
    uz: { title: "Ф5-4 fundamenti", tag: "F-seriyasi", image: IMG('Ф5-4'), desc: "Maxsus yuk ko‘tarish talablari uchun mustahkamlangan variant." },
    ru: { title: "Фундамент Ф5-4", tag: "Серия F", image: IMG('Ф5-4'), desc: "Усиленный вариант для особых требований по несущей способности." },
    en: { title: "Ф5-4 foundation", tag: "F-Series", image: IMG('Ф5-4'), desc: "A reinforced variant for special load-bearing requirements." }
  },
  "Ф5-2": {
    uz: { title: "Ф5-2 fundamenti", tag: "F-seriyasi", image: IMG('Ф5-2'), desc: "Ikkita asosiy blokdan iborat, yig‘ish va o‘rnatish oson." },
    ru: { title: "Фундамент Ф5-2", tag: "Серия F", image: IMG('Ф5-2'), desc: "Состоит из двух основных блоков, прост в сборке и монтаже." },
    en: { title: "Ф5-2 foundation", tag: "F-Series", image: IMG('Ф5-2'), desc: "Consists of two main blocks, easy to assemble and install." }
  },
  "Ф4-2": {
    uz: { title: "Ф4-2 fundamenti", tag: "F-seriyasi", image: IMG('Ф4-2'), desc: "F4 seriyasining ikki blokli varianti. Yuqori mustahkamlik." },
    ru: { title: "Фундамент Ф4-2", tag: "Серия F", image: IMG('Ф4-2'), desc: "Двухблочный вариант серии F4. Высокая прочность." },
    en: { title: "Ф4-2 foundation", tag: "F-Series", image: IMG('Ф4-2'), desc: "A two-block version of the F4 series with high strength." }
  },
  "Ф3-2": {
    uz: { title: "Ф3-2 fundamenti", tag: "F-seriyasi", image: IMG('Ф3-2'), desc: "Kichik o‘lchamli, lekin ishonchli. Kichik podstansiyalar uchun." },
    ru: { title: "Фундамент Ф3-2", tag: "Серия F", image: IMG('Ф3-2'), desc: "Небольшого размера, но надёжный. Для малых подстанций." },
    en: { title: "Ф3-2 foundation", tag: "F-Series", image: IMG('Ф3-2'), desc: "Small in size but reliable. Suitable for small substations." }
  },
  "ПА3-1": {
    uz: { title: "ПА3-1 tayanch ustuni", tag: "Stalbalar", image: IMG('ПА3-1'), desc: "Ochiq taqsimlovchi qurilmalar uchun mustahkam temir-beton ustun. Shamol va mexanik ta‘sirlarga yuqori bardoshli." },
    ru: { title: "Опора ПА3-1", tag: "Стойки", image: IMG('ПА3-1'), desc: "Прочная железобетонная опора для открытых распределительных устройств. Высокая устойчивость к ветру и механическим воздействиям." },
    en: { title: "ПА3-1 support pole", tag: "Poles", image: IMG('ПА3-1'), desc: "A durable reinforced concrete pole for open switchgear installations. High resistance to wind and mechanical stress." }
  },
  "ПАЗ-2": {
    uz: { title: "ПАЗ-2 tayanch ustuni", tag: "Stalbalar", image: IMG('ПАЗ-2'), desc: "Zilzilabardosh konstruksiya, seysmik hududlar uchun mo‘ljallangan." },
    ru: { title: "Опора ПАЗ-2", tag: "Стойки", image: IMG('ПАЗ-2'), desc: "Сейсмостойкая конструкция, предназначенная для сейсмоопасных регионов." },
    en: { title: "ПАЗ-2 support pole", tag: "Poles", image: IMG('ПАЗ-2'), desc: "An earthquake-resistant design intended for seismically active regions." }
  },
  "УСО-3А": {
    uz: { title: "УСО-3А ustuni", tag: "Stalbalar", image: IMG('УСО-3А'), desc: "Universal o‘rnatish ustuni, turli xil energetika uskunalarini o‘rnatish uchun." },
    ru: { title: "Опора УСО-3А", tag: "Стойки", image: IMG('УСО-3А'), desc: "Универсальная монтажная опора для установки различного энергетического оборудования." },
    en: { title: "УСО-3А pole", tag: "Poles", image: IMG('УСО-3А'), desc: "A universal mounting pole for installing various types of energy equipment." }
  },
  "УСО-4А": {
    uz: { title: "УСО-4А ustuni", tag: "Stalbalar", image: IMG('УСО-4А'), desc: "Katta o‘lchamdagi uskunalar uchun mustahkamlangan ustun." },
    ru: { title: "Опора УСО-4А", tag: "Стойки", image: IMG('УСО-4А'), desc: "Усиленная опора для крупногабаритного оборудования." },
    en: { title: "УСО-4А pole", tag: "Poles", image: IMG('УСО-4А'), desc: "A reinforced pole designed for large-scale equipment." }
  },
  "Л-1": {
    uz: { title: "Л-1 lotok", tag: "Lotoklar", image: IMG('Л-1'), desc: "Suv va boshqa suyuqliklar uchun beton lotok. O‘lchami: 1000x400x300 mm." },
    ru: { title: "Лоток Л-1", tag: "Лотки", image: IMG('Л-1'), desc: "Бетонный лоток для воды и других жидкостей. Размер: 1000x400x300 мм." },
    en: { title: "Л-1 tray", tag: "Trays", image: IMG('Л-1'), desc: "A concrete tray for water and other liquids. Size: 1000x400x300 mm." }
  },
  "Л-2": {
    uz: { title: "Л-2 lotok", tag: "Lotoklar", image: IMG('Л-2'), desc: "Kengroq va chuqurroq lotok, katta hajmli suv oqimlari uchun." },
    ru: { title: "Лоток Л-2", tag: "Лотки", image: IMG('Л-2'), desc: "Более широкий и глубокий лоток для больших объёмов воды." },
    en: { title: "Л-2 tray", tag: "Trays", image: IMG('Л-2'), desc: "A wider and deeper tray for larger volumes of water flow." }
  },
  "Л-3": {
    uz: { title: "Л-3 lotok", tag: "Lotoklar", image: IMG('Л-3'), desc: "Maxsus mustahkamlangan lotok, sanoat suvlari uchun." },
    ru: { title: "Лоток Л-3", tag: "Лотки", image: IMG('Л-3'), desc: "Специально усиленный лоток для промышленных стоков." },
    en: { title: "Л-3 tray", tag: "Trays", image: IMG('Л-3'), desc: "A specially reinforced tray for industrial water discharge." }
  },
  "ЛЖ-2.8": {
    uz: { title: "ЛЖ-2.8 plita", tag: "Plitalar", image: IMG('ЛЖ-2.8'), desc: "Temir-beton plita, o‘lchami 2.8 metr. Yuqori yuk ko‘tarish qobiliyati." },
    ru: { title: "Плита ЛЖ-2.8", tag: "Плиты", image: IMG('ЛЖ-2.8'), desc: "Железобетонная плита размером 2,8 метра. Высокая несущая способность." },
    en: { title: "ЛЖ-2.8 slab", tag: "Slabs", image: IMG('ЛЖ-2.8'), desc: "A reinforced concrete slab measuring 2.8 meters. High load-bearing capacity." }
  },
  "ЛЖ-1.6": {
    uz: { title: "ЛЖ-1.6 plita", tag: "Plitalar", image: IMG('ЛЖ-1.6'), desc: "Kichik o‘lchamdagi plita, 1.6 metr. Yengil konstruksiyalar uchun." },
    ru: { title: "Плита ЛЖ-1.6", tag: "Плиты", image: IMG('ЛЖ-1.6'), desc: "Плита меньшего размера, 1,6 метра. Для лёгких конструкций." },
    en: { title: "ЛЖ-1.6 slab", tag: "Slabs", image: IMG('ЛЖ-1.6'), desc: "A smaller slab, 1.6 meters. Suitable for lightweight structures." }
  },
  "СБ-95/3": {
    uz: { title: "СБ-95/3 plita", tag: "Plitalar", image: IMG('SB-95-3'), desc: "Maxsus mustahkamlikdagi plita, sanoat qurilishi uchun." },
    ru: { title: "Плита СБ-95/3", tag: "Плиты", image: IMG('SB-95-3'), desc: "Плита особой прочности для промышленного строительства." },
    en: { title: "СБ-95/3 slab", tag: "Slabs", image: IMG('SB-95-3'), desc: "A special high-strength slab for industrial construction." }
  },
  "Л-20.5": {
    uz: { title: "Л-20.5 plita", tag: "Plitalar", image: IMG('Л-20.5'), desc: "Katta o‘lchamdagi plita, 20.5 metr, katta maydonlarni qoplash uchun." },
    ru: { title: "Плита Л-20.5", tag: "Плиты", image: IMG('Л-20.5'), desc: "Крупногабаритная плита длиной 20,5 метра для покрытия больших площадей." },
    en: { title: "Л-20.5 slab", tag: "Slabs", image: IMG('Л-20.5'), desc: "A large-format slab, 20.5 meters, for covering large areas." }
  },
  "АР-5": {
    uz: { title: "АР-5 maxsus buyum", tag: "Maxsus", image: IMG('АР-5'), desc: "Energetika uskunalari uchun maxsus armaturali beton buyum." },
    ru: { title: "Специзделие АР-5", tag: "Спецпродукция", image: IMG('АР-5'), desc: "Специальное армированное бетонное изделие для энергетического оборудования." },
    en: { title: "АР-5 special product", tag: "Special", image: IMG('АР-5'), desc: "A specially reinforced concrete product for energy equipment." }
  },
  "Р1-А": {
    uz: { title: "Р1-А maxsus buyum", tag: "Maxsus", image: IMG('Р1-А'), desc: "Reaktiv quvvat kompensatsiyasi uchun maxsus poydevor elementi." },
    ru: { title: "Специзделие Р1-А", tag: "Спецпродукция", image: IMG('Р1-А'), desc: "Специальный фундаментный элемент для компенсации реактивной мощности." },
    en: { title: "Р1-А special product", tag: "Special", image: IMG('Р1-А'), desc: "A special foundation element for reactive power compensation." }
  },
  "УБ-1А": {
    uz: { title: "УБ-1А maxsus buyum", tag: "Maxsus", image: IMG('УБ-1А'), desc: "Universal beton blok, turli xil o‘rnatish ishlari uchun." },
    ru: { title: "Специзделие УБ-1А", tag: "Спецпродукция", image: IMG('УБ-1А'), desc: "Универсальный бетонный блок для различных монтажных работ." },
    en: { title: "УБ-1А special product", tag: "Special", image: IMG('УБ-1А'), desc: "A universal concrete block for various installation tasks." }
  },
  "ОПП-5": {
    uz: { title: "ОПП-5 maxsus buyum", tag: "Maxsus", image: IMG('ОПП-5'), desc: "O‘ta mustahkam polimer-beton aralashmasidan tayyorlangan buyum." },
    ru: { title: "Специзделие ОПП-5", tag: "Спецпродукция", image: IMG('ОПП-5'), desc: "Изделие, изготовленное из сверхпрочной полимербетонной смеси." },
    en: { title: "ОПП-5 special product", tag: "Special", image: IMG('ОПП-5'), desc: "A product made from an ultra-durable polymer-concrete mix." }
  }
};
