"use client";

interface HeroProps {
  t: (key: string) => string;
  image?: string;
}

export default function Hero({ t, image }: HeroProps) {
  return (
    <header
      className={`hero${image ? ' hero-has-image' : ''}`}
      style={image ? { backgroundImage: `linear-gradient(135deg, rgba(11,42,74,0.88) 0%, rgba(13,53,89,0.62) 100%), url("${image}")` } : undefined}
    >
      <div className="container hero-content">
        <div className="hero-eyebrow"><span /> ENERGY · INDUSTRY · CONCRETE</div>
        <h1>ENERGOQURILISH<br /><span>MAHSULOT</span> MCHJ</h1>
        <p className="tagline" dangerouslySetInnerHTML={{ __html: t('hero_tagline') }} />
        <a href="#contact" className="btn">
          {t('hero_btn')} <i className="fas fa-arrow-right" style={{ marginLeft: 10 }}></i>
        </a>
      </div>
      <div className="hero-grid-art" aria-hidden="true"><span>01</span><i className="fas fa-cubes" /></div>
    </header>
  );
}
