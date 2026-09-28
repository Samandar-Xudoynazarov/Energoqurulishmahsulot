"use client";

import { useEffect, useState } from 'react';
import { ContentCard, Language } from '../types';
import { realImage } from '../lib/product-utils';
import Gallery from './Gallery';

interface TeamProps {
  t: (key: string) => string;
  lang: Language;
  cards: ContentCard[];
}

const tx = (v: { uz: string; ru: string; en: string } | undefined, lang: Language) => (v ? v[lang] || v.uz : '');

/** Jamoa, zamonaviy uskunalar va avtopark — mahsulotlardan alohida bo'lim */
export default function Team({ t, lang, cards }: TeamProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = cards.find((c) => c.id === openId);
  if (cards.length === 0) return null;

  return (
    <section id="team" className="bg-light">
      <div className="container">
        <h2 className="section-title">{t('team_title')}</h2>
        <p className="section-subtitle">{t('team_subtitle')}</p>
        <div className="team-grid">
          {cards.map((card) => {
            const img = realImage(card.image);
            const count = [card.image, ...(card.images || [])].filter(Boolean).length;
            return (
              <button type="button" key={card.id} className="team-card" onClick={() => setOpenId(card.id)}>
                <div className="team-card-img" style={img ? { backgroundImage: `url("${img}")` } : undefined}>
                  {!img && <i className={`fas ${card.icon}`}></i>}
                  {count > 1 && <span className="project-card-count"><i className="fas fa-images"></i> {count}</span>}
                </div>
                <div className="team-card-body">
                  <span className="team-card-icon"><i className={`fas ${card.icon}`}></i></span>
                  <h4>{tx(card.title, lang)}</h4>
                  <p>{tx(card.desc, lang)}</p>
                  <span className="team-card-more">{t('team_more')} <i className="fas fa-arrow-right"></i></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {open && <TeamModal card={open} lang={lang} onClose={() => setOpenId(null)} />}
    </section>
  );
}

function TeamModal({ card, lang, onClose }: { card: ContentCard; lang: Language; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);
  const images = [card.image, ...(card.images || [])].map((x) => realImage(x)).filter(Boolean);
  const title = tx(card.title, lang);
  const body = tx(card.body, lang) || tx(card.desc, lang);
  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content project-modal">
        <button className="modal-close" onClick={onClose} aria-label="close">&times;</button>
        <Gallery images={images} title={title} />
        <div className="modal-body" style={images.length === 0 ? { paddingTop: 34 } : undefined}>
          <h3>{title}</h3>
          {body && <p style={{ whiteSpace: 'pre-line' }}>{body}</p>}
        </div>
      </div>
    </div>
  );
}
