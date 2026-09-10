"use client";

interface FooterProps {
  t: (key: string) => string;
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer>
      <div className="container">
        <p>{t('footer_copy')}</p>
        <p style={{ fontSize: '0.85rem', marginTop: 6 }}>{t('footer_motto2')}</p>
      </div>
    </footer>
  );
}
