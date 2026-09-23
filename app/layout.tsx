import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "./lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ENERGOQURILISHMAHSULOT | Zavod",
  description: "50 yillik tajriba va yuqori sifatli temir-beton mahsulotlari. Mamlakat energetikasi uchun ishonchli poydevor.",
  robots: { index: true, follow: true },
  verification: {
    google: "1JnqWNpdW5I_Pp_r8jJL5IUmmOt3AWQEgbeFrsXckpo",
    yandex: "efc72075fdec40de",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ENERGOQURILISHMAHSULOT MCHJ",
  alternateName: [
    "ЭНЕРГОКУРИЛИШМАХСУЛОТ",
    "Energoqurilishmahsulot",
  ],
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "50 yildan ortiq tajribaga ega, energetika va sanoat uchun temir-beton fundamentlar, tayanch ustunlar, lotok va plitalar ishlab chiqaruvchi zavod. Завод железобетонных изделий для энергетики. Reinforced concrete products factory for the energy sector.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "UZ",
  },
  email: "info@energoqurilish.uz",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
