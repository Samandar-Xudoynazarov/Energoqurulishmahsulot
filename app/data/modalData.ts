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
  "F5-USU": {
    uz: { title: "F5-USU fundamenti", tag: "F-seriyasi", image: IMG('F5-USU'), desc: "Yuqori kuchlanishli liniyalar va podstansiyalar uchun mo‘ljallangan mustahkam temir-beton fundament. Yuqori yuk ko‘tarish qobiliyati va uzoq xizmat muddati." },
    ru: { title: "Фундамент F5-USU", tag: "Серия F", image: IMG('F5-USU'), desc: "Прочный железобетонный фундамент для линий высокого напряжения и подстанций. Высокая несущая способность и длительный срок службы." },
    en: { title: "F5-USU foundation", tag: "F-Series", image: IMG('F5-USU'), desc: "A durable reinforced concrete foundation for high-voltage lines and substations. High load-bearing capacity and long service life." }
  },
  "F5-AMK": {
    uz: { title: "F5-AMK fundamenti", tag: "F-seriyasi", image: IMG('F5-AMK'), desc: "Modifikatsiyalangan F5 seriyali fundament. Kuchli korroziyaga qarshi qoplama va mustahkamlangan armatura." },
    ru: { title: "Фундамент F5-AMK", tag: "Серия F", image: IMG('F5-AMK'), desc: "Модифицированный фундамент серии F5. Усиленное антикоррозийное покрытие и армирование." },
    en: { title: "F5-AMK foundation", tag: "F-Series", image: IMG('F5-AMK'), desc: "A modified F5-series foundation with strong anti-corrosion coating and reinforced rebar." }
  },
  "F5-AM": {
    uz: { title: "F5-AM fundamenti", tag: "F-seriyasi", image: IMG('F5-AM'), desc: "Engilroq versiya, lekin yuqori mustahkamlikka ega. O‘rnatish qulayligi va tejamkorlik." },
    ru: { title: "Фундамент F5-AM", tag: "Серия F", image: IMG('F5-AM'), desc: "Облегчённая версия с высокой прочностью. Удобство монтажа и экономичность." },
    en: { title: "F5-AM foundation", tag: "F-Series", image: IMG('F5-AM'), desc: "A lighter version with high strength. Easy installation and cost efficiency." }
  },
  "F4-AMK": {
    uz: { title: "F4-AMK fundamenti", tag: "F-seriyasi", image: IMG('F4-AMK'), desc: "O‘rta o‘lchamdagi podstansiyalar uchun mo‘ljallangan. Yuqori sifatli beton va armatura." },
    ru: { title: "Фундамент F4-AMK", tag: "Серия F", image: IMG('F4-AMK'), desc: "Предназначен для подстанций среднего размера. Высококачественный бетон и арматура." },
    en: { title: "F4-AMK foundation", tag: "F-Series", image: IMG('F4-AMK'), desc: "Designed for medium-sized substations. High-quality concrete and rebar." }
  },
  "F3-AMK": {
    uz: { title: "F3-AMK fundamenti", tag: "F-seriyasi", image: IMG('F3-AMK'), desc: "Kichikroq o‘lchamdagi energetika inshootlari uchun ixcham va mustahkam poydevor." },
    ru: { title: "Фундамент F3-AMK", tag: "Серия F", image: IMG('F3-AMK'), desc: "Компактный и прочный фундамент для энергетических объектов меньшего размера." },
    en: { title: "F3-AMK foundation", tag: "F-Series", image: IMG('F3-AMK'), desc: "A compact and durable foundation for smaller energy facilities." }
  },
  "F5-4": {
    uz: { title: "F5-4 fundamenti", tag: "F-seriyasi", image: IMG('F5-4'), desc: "Maxsus yuk ko‘tarish talablari uchun mustahkamlangan variant." },
    ru: { title: "Фундамент F5-4", tag: "Серия F", image: IMG('F5-4'), desc: "Усиленный вариант для особых требований по несущей способности." },
    en: { title: "F5-4 foundation", tag: "F-Series", image: IMG('F5-4'), desc: "A reinforced variant for special load-bearing requirements." }
  },
  "F5-2": {
    uz: { title: "F5-2 fundamenti", tag: "F-seriyasi", image: IMG('F5-2'), desc: "Ikkita asosiy blokdan iborat, yig‘ish va o‘rnatish oson." },
    ru: { title: "Фундамент F5-2", tag: "Серия F", image: IMG('F5-2'), desc: "Состоит из двух основных блоков, прост в сборке и монтаже." },
    en: { title: "F5-2 foundation", tag: "F-Series", image: IMG('F5-2'), desc: "Consists of two main blocks, easy to assemble and install." }
  },
  "F4-2": {
    uz: { title: "F4-2 fundamenti", tag: "F-seriyasi", image: IMG('F4-2'), desc: "F4 seriyasining ikki blokli varianti. Yuqori mustahkamlik." },
    ru: { title: "Фундамент F4-2", tag: "Серия F", image: IMG('F4-2'), desc: "Двухблочный вариант серии F4. Высокая прочность." },
    en: { title: "F4-2 foundation", tag: "F-Series", image: IMG('F4-2'), desc: "A two-block version of the F4 series with high strength." }
  },
  "F3-2": {
    uz: { title: "F3-2 fundamenti", tag: "F-seriyasi", image: IMG('F3-2'), desc: "Kichik o‘lchamli, lekin ishonchli. Kichik podstansiyalar uchun." },
    ru: { title: "Фундамент F3-2", tag: "Серия F", image: IMG('F3-2'), desc: "Небольшого размера, но надёжный. Для малых подстанций." },
    en: { title: "F3-2 foundation", tag: "F-Series", image: IMG('F3-2'), desc: "Small in size but reliable. Suitable for small substations." }
  },
  "PA3-1": {
    uz: { title: "PA3-1 tayanch ustuni", tag: "Stalbalar", image: IMG('PA3-1'), desc: "Ochiq taqsimlovchi qurilmalar uchun mustahkam temir-beton ustun. Shamol va mexanik ta‘sirlarga yuqori bardoshli." },
    ru: { title: "Опора PA3-1", tag: "Стойки", image: IMG('PA3-1'), desc: "Прочная железобетонная опора для открытых распределительных устройств. Высокая устойчивость к ветру и механическим воздействиям." },
    en: { title: "PA3-1 support pole", tag: "Poles", image: IMG('PA3-1'), desc: "A durable reinforced concrete pole for open switchgear installations. High resistance to wind and mechanical stress." }
  },
  "PAZ-2": {
    uz: { title: "PAZ-2 tayanch ustuni", tag: "Stalbalar", image: IMG('PAZ-2'), desc: "Zilzilabardosh konstruksiya, seysmik hududlar uchun mo‘ljallangan." },
    ru: { title: "Опора PAZ-2", tag: "Стойки", image: IMG('PAZ-2'), desc: "Сейсмостойкая конструкция, предназначенная для сейсмоопасных регионов." },
    en: { title: "PAZ-2 support pole", tag: "Poles", image: IMG('PAZ-2'), desc: "An earthquake-resistant design intended for seismically active regions." }
  },
  "USO-3A": {
    uz: { title: "USO-3A ustuni", tag: "Stalbalar", image: IMG('USO-3A'), desc: "Universal o‘rnatish ustuni, turli xil energetika uskunalarini o‘rnatish uchun." },
    ru: { title: "Опора USO-3A", tag: "Стойки", image: IMG('USO-3A'), desc: "Универсальная монтажная опора для установки различного энергетического оборудования." },
    en: { title: "USO-3A pole", tag: "Poles", image: IMG('USO-3A'), desc: "A universal mounting pole for installing various types of energy equipment." }
  },
  "USO-4A": {
    uz: { title: "USO-4A ustuni", tag: "Stalbalar", image: IMG('USO-4A'), desc: "Katta o‘lchamdagi uskunalar uchun mustahkamlangan ustun." },
    ru: { title: "Опора USO-4A", tag: "Стойки", image: IMG('USO-4A'), desc: "Усиленная опора для крупногабаритного оборудования." },
    en: { title: "USO-4A pole", tag: "Poles", image: IMG('USO-4A'), desc: "A reinforced pole designed for large-scale equipment." }
  },
  "L-1": {
    uz: { title: "L-1 lotok", tag: "Lotoklar", image: IMG('L-1'), desc: "Suv va boshqa suyuqliklar uchun beton lotok. O‘lchami: 1000x400x300 mm." },
    ru: { title: "Лоток L-1", tag: "Лотки", image: IMG('L-1'), desc: "Бетонный лоток для воды и других жидкостей. Размер: 1000x400x300 мм." },
    en: { title: "L-1 tray", tag: "Trays", image: IMG('L-1'), desc: "A concrete tray for water and other liquids. Size: 1000x400x300 mm." }
  },
  "L-2": {
    uz: { title: "L-2 lotok", tag: "Lotoklar", image: IMG('L-2'), desc: "Kengroq va chuqurroq lotok, katta hajmli suv oqimlari uchun." },
    ru: { title: "Лоток L-2", tag: "Лотки", image: IMG('L-2'), desc: "Более широкий и глубокий лоток для больших объёмов воды." },
    en: { title: "L-2 tray", tag: "Trays", image: IMG('L-2'), desc: "A wider and deeper tray for larger volumes of water flow." }
  },
  "L-3": {
    uz: { title: "L-3 lotok", tag: "Lotoklar", image: IMG('L-3'), desc: "Maxsus mustahkamlangan lotok, sanoat suvlari uchun." },
    ru: { title: "Лоток L-3", tag: "Лотки", image: IMG('L-3'), desc: "Специально усиленный лоток для промышленных стоков." },
    en: { title: "L-3 tray", tag: "Trays", image: IMG('L-3'), desc: "A specially reinforced tray for industrial water discharge." }
  },
  "LJ-2.8": {
    uz: { title: "LJ-2.8 plita", tag: "Plitalar", image: IMG('LJ-2.8'), desc: "Temir-beton plita, o‘lchami 2.8 metr. Yuqori yuk ko‘tarish qobiliyati." },
    ru: { title: "Плита LJ-2.8", tag: "Плиты", image: IMG('LJ-2.8'), desc: "Железобетонная плита размером 2,8 метра. Высокая несущая способность." },
    en: { title: "LJ-2.8 slab", tag: "Slabs", image: IMG('LJ-2.8'), desc: "A reinforced concrete slab measuring 2.8 meters. High load-bearing capacity." }
  },
  "LJ-1.6": {
    uz: { title: "LJ-1.6 plita", tag: "Plitalar", image: IMG('LJ-1.6'), desc: "Kichik o‘lchamdagi plita, 1.6 metr. Yengil konstruksiyalar uchun." },
    ru: { title: "Плита LJ-1.6", tag: "Плиты", image: IMG('LJ-1.6'), desc: "Плита меньшего размера, 1,6 метра. Для лёгких конструкций." },
    en: { title: "LJ-1.6 slab", tag: "Slabs", image: IMG('LJ-1.6'), desc: "A smaller slab, 1.6 meters. Suitable for lightweight structures." }
  },
  "SB-95/3": {
    uz: { title: "SB-95/3 plita", tag: "Plitalar", image: IMG('SB-95-3'), desc: "Maxsus mustahkamlikdagi plita, sanoat qurilishi uchun." },
    ru: { title: "Плита SB-95/3", tag: "Плиты", image: IMG('SB-95-3'), desc: "Плита особой прочности для промышленного строительства." },
    en: { title: "SB-95/3 slab", tag: "Slabs", image: IMG('SB-95-3'), desc: "A special high-strength slab for industrial construction." }
  },
  "L-20.5": {
    uz: { title: "L-20.5 plita", tag: "Plitalar", image: IMG('L-20.5'), desc: "Katta o‘lchamdagi plita, 20.5 metr, katta maydonlarni qoplash uchun." },
    ru: { title: "Плита L-20.5", tag: "Плиты", image: IMG('L-20.5'), desc: "Крупногабаритная плита длиной 20,5 метра для покрытия больших площадей." },
    en: { title: "L-20.5 slab", tag: "Slabs", image: IMG('L-20.5'), desc: "A large-format slab, 20.5 meters, for covering large areas." }
  },
  "AR-5": {
    uz: { title: "AR-5 maxsus buyum", tag: "Maxsus", image: IMG('AR-5'), desc: "Energetika uskunalari uchun maxsus armaturali beton buyum." },
    ru: { title: "Специзделие AR-5", tag: "Спецпродукция", image: IMG('AR-5'), desc: "Специальное армированное бетонное изделие для энергетического оборудования." },
    en: { title: "AR-5 special product", tag: "Special", image: IMG('AR-5'), desc: "A specially reinforced concrete product for energy equipment." }
  },
  "R1-A": {
    uz: { title: "R1-A maxsus buyum", tag: "Maxsus", image: IMG('R1-A'), desc: "Reaktiv quvvat kompensatsiyasi uchun maxsus poydevor elementi." },
    ru: { title: "Специзделие R1-A", tag: "Спецпродукция", image: IMG('R1-A'), desc: "Специальный фундаментный элемент для компенсации реактивной мощности." },
    en: { title: "R1-A special product", tag: "Special", image: IMG('R1-A'), desc: "A special foundation element for reactive power compensation." }
  },
  "UB-1A": {
    uz: { title: "UB-1A maxsus buyum", tag: "Maxsus", image: IMG('UB-1A'), desc: "Universal beton blok, turli xil o‘rnatish ishlari uchun." },
    ru: { title: "Специзделие UB-1A", tag: "Спецпродукция", image: IMG('UB-1A'), desc: "Универсальный бетонный блок для различных монтажных работ." },
    en: { title: "UB-1A special product", tag: "Special", image: IMG('UB-1A'), desc: "A universal concrete block for various installation tasks." }
  },
  "OPP-5": {
    uz: { title: "OPP-5 maxsus buyum", tag: "Maxsus", image: IMG('OPP-5'), desc: "O‘ta mustahkam polimer-beton aralashmasidan tayyorlangan buyum." },
    ru: { title: "Специзделие OPP-5", tag: "Спецпродукция", image: IMG('OPP-5'), desc: "Изделие, изготовленное из сверхпрочной полимербетонной смеси." },
    en: { title: "OPP-5 special product", tag: "Special", image: IMG('OPP-5'), desc: "A product made from an ultra-durable polymer-concrete mix." }
  }
};
