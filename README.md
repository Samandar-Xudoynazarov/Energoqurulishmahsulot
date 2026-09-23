# ENERGOQURILISHMAHSULOT — sayt

Next.js 14 + Vercel Blob. Admin panel: `/admin`.

## Environment o'zgaruvchilari
`.env.example` faylini ko'ring. Vercel → Project → Settings → Environment Variables'ga qo'shing:

| O'zgaruvchi | Nima uchun |
|---|---|
| `ADMIN_PASSWORD` | Admin panel paroli |
| `BLOB_READ_WRITE_TOKEN` | Mahsulotlar, loyihalar, rasmlar saqlanadi (Vercel Blob) |
| `TELEGRAM_BOT_TOKEN` | So'rov formalari yuboriladigan bot |
| `TELEGRAM_CHAT_ID` | Qabul qiluvchi chat(lar), vergul bilan |

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
