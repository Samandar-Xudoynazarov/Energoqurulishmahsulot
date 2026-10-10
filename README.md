# ENERGOQURILISHMAHSULOT — sayt

Next.js 14 + Supabase Storage. Admin panel: `/admin`.

## Environment o'zgaruvchilari
`.env.example` faylini ko'ring. Vercel → Project → Settings → Environment Variables'ga qo'shing:

| O'zgaruvchi | Nima uchun |
|---|---|
| `ADMIN_PASSWORD` | Admin panel paroli |
| `SUPABASE_URL` | Supabase loyiha manzili |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Secret key — rasmlar va ma'lumotlar saqlanadi |
| `TELEGRAM_BOT_TOKEN` | So'rov formalari yuboriladigan bot |
| `TELEGRAM_CHAT_ID` | Qabul qiluvchi chat(lar), vergul bilan |

### Supabase'ni sozlash (5 daqiqa, bepul)
1. https://supabase.com → **Start your project** → GitHub yoki email bilan kiring (karta so'ralmaydi).
2. **New project**: nom — `energoqurilish`, parol — istalgan, region — **Central EU (Frankfurt)** yoki **Singapore**.
3. Loyiha tayyor bo'lgach: **Project Settings → API Keys** (yoki **Data API**):
   - **Project URL** → `SUPABASE_URL`
   - **Secret key** (`sb_secret_...`) yoki `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
4. Vercel → Settings → Environment Variables'ga ikkalasini kiriting → **Redeploy**.
5. Bucket (`site`) birinchi yuklashda avtomatik yaratiladi — qo'lda hech narsa qilish shart emas.

Sayt ma'lumotlarni 10 daqiqa keshlaydi va admin saqlaganda darhol yangilaydi — shuning uchun
tashriflar soni Supabase limitlariga deyarli ta'sir qilmaydi. `vercel.json` dagi kunlik cron
(`/api/keepalive`) bepul Supabase loyihasi "pauza"ga tushib qolmasligi uchun.

### Telegram botni sozlash (5 daqiqa)
1. Telegram'da **@BotFather** → `/newbot` → nom bering → **token**ni nusxalang.
2. Yangi botingizga `/start` yozing. (Guruhga kelsin desangiz — botni guruhga qo'shing va guruhda biror xabar yozing.)
3. Brauzerda oching: `https://api.telegram.org/bot<TOKEN>/getUpdates` → `"chat":{"id": ... }` raqamini oling.
4. Vercel'da `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` ni kiriting → **Redeploy**.
5. Saytdagi formani to'ldirib sinab ko'ring.

## Admin panel
- **Mahsulotlar** — kod, nom, tavsif, rasm, texnik jadval, sertifikat/pasport PDF.
- **Kategoriyalar**
- **Loyihalar** — portfolio: nomi, joylashuv, yil, rasmlar (bir nechta), yetkazilgan mahsulotlar.
- **Sozlamalar** — telefon, Telegram username, email, "Biz haqimizda" rasmi.

## Sahifalar
- `/uz`, `/ru`, `/en` — bosh sahifa
- `/{til}/products/{slug}` — har bir mahsulotning alohida sahifasi (masalan `/ru/products/f5-amk`).
  Slug koddan avtomatik yasaladi: `Ф5-АМК → f5-amk`, `СБ-95/3 → sb-95-3`.
- `/sitemap.xml` — barcha mahsulot sahifalari bilan

## 2026-09 yangilanish: narxlar, katalog, bo'limlar

- **PTO katalogi** (`app/data/catalog.ts`, 57 ta mahsulot): QQSsiz narx, xarakteristikalar va kengaytirilgan tavsif (uz/ru/en).
  Admin → Mahsulotlar → **«PTO katalogidan yangilash»**: avval nima o'zgarishini ko'rsatadi, keyin qo'llaydi.
  Tanlangan tavsiflar, xarakteristikalar va 3D rasmlar yangilanadi. PDF, fotosurat va kategoriyalar saqlanadi.
- **Mahsulot sahifasi**: xarakteristikalar ostida QQSsiz narx va «Sotib olish» tugmasi; buyurtma formasida miqdor
  va taxminiy summa. Telegram xabarida narx serverdagi ma'lumotdan hisoblanadi.
- **Sayt bo'limlari** (`/admin/content`, `data/content.json`): ishlab chiqarish bosqichlari (rasm bilan),
  jamoa va texnika (mahsulotlardan alohida; rasm + galereya + batafsil matn), «Nima uchun biz» (fon rasmli katta kartalar).
- **Sozlamalar**: zavod rasmi («Biz haqimizda») va bosh ekran fon rasmi.

## 2026-10 PTO va 3D yangilanishi

Yangi kodni hostingga joylagach, Admin → Mahsulotlar → **PTO katalogidan yangilash** → **Qo‘llash**.
3D rasmlar avval Supabase’ga yuklanadi, mahsulotlar saqlangach boshqa joyda ishlatilmaydigan eski renderlar o‘chiriladi. Yuklash xatosida mavjud mahsulotlar almashtirilmaydi.

- 57 mahsulot; 49 mahsulotga 48 ta yangi render. Qolgan mahsulotlar mavjud rasmini saqlaydi.
- M200/F150, M300/F200, M400/F300 — zavod tasdiqlagan moslik. НСП35.10А va Л12-8/2: M400/F300.
- Armatura tafsilotlari o‘rniga metall og‘irligi; tasdiqlanmagan beton klassi va suv o‘tkazmaslik qiymatlari olib tashlangan.
- 3D birinchi ko‘rinadi. Katalogda qidiruv va kategoriya filtrlari mavjud.
- Yangi ikkita mahsulot narxi tasdiqlanmagani sabab narx ko‘rsatilmaydi.
- Supabase sozlamalari mavjud hostingda saqlanishi kerak; maxfiy chizmalar bu yangilanishga kiritilmagan.
