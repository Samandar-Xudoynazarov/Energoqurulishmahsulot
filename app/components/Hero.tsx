"use client";

interface HeroProps {
  t: (key: string) => string;
}

export default function Hero({ t }: HeroProps) {
  return (
    <header className="hero">
      <div className="container hero-content">
        <h1>ENERGOQURILISH<br /><span>MAHSULOT</span> MCHJ</h1>
        <p className="tagline" dangerouslySetInnerHTML={{ __html: t('hero_tagline') }} />
        <a href="#contact" className="btn">
          {t('hero_btn')} <i className="fas fa-arrow-right" style={{ marginLeft: 10 }}></i>
        </a>
      </div>
    </header>
  );
}
