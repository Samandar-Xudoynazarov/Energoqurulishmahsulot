"use client";

import { ContentCard, Language } from '../types';
import { realImage } from '../lib/product-utils';

interface WhyProps {
  t: (key: string) => string;
  lang: Language;
  cards: ContentCard[];
}

export default function WhyUs({ t, lang, cards }: WhyProps) {
  return (
    <section className="container why-section">
      <h2 className="section-title">{t('why_title')}</h2>
      <p className="section-subtitle">{t('why_subtitle')}</p>
      <div className="why-cards">
        {cards.map((c) => {
          const img = realImage(c.image);
          return (
            <div
              key={c.id}
              className={`why-card${img ? ' has-img' : ''}`}
              style={img ? { backgroundImage: `url("${img}")` } : undefined}
              onContextMenu={img ? (e) => e.preventDefault() : undefined}
            >
              <div className="why-card-inner">
                <i className={`fas ${c.icon}`}></i>
                <h4>{c.title[lang] || c.title.uz}</h4>
                <p>{c.desc[lang] || c.desc.uz}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
