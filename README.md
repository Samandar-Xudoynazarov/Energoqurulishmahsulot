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
