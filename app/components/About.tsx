"use client";

import { realImage } from '../lib/product-utils';

interface AboutProps {
  t: (key: string) => string;
  image?: string;
}

export default function About({ t, image }: AboutProps) {
  const img = realImage(image);
  return (
    <section id="about" className="container">
      <h2 className="section-title">{t('about_title')}</h2>
      <p className="section-subtitle">{t('about_subtitle')}</p>
      <div className="about-grid">
        <div className="about-text">
          <p dangerouslySetInnerHTML={{ __html: t('about_text1') }} />
          <p>{t('about_text2')}</p>
          <div className="about-stats">
            <div className="stat-item">
              <span className="number">50+</span>
              <div className="label">{t('stat1')}</div>
            </div>
            <div className="stat-item">
              <span className="number">100+</span>
              <div className="label">{t('stat2')}</div>
            </div>
            <div className="stat-item">
              <span className="number">500+</span>
              <div className="label">{t('stat3')}</div>
            </div>
          </div>
        </div>
        {img ? (
          <div className="about-image about-image--photo">
            <img src={img} alt={t('about_image')} loading="lazy" />
          </div>
        ) : (
          <div className="about-image">{t('about_image')}</div>
        )}
      </div>
    </section>
  );
}
