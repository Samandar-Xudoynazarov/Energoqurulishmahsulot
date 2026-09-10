"use client";

import { FormEvent } from 'react';

interface ContactProps {
  t: (key: string) => string;
}

export default function Contact({ t }: ContactProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(t('form_submit') + ' - ' + 'Demo mode');
  };

  return (
    <section id="contact" className="container" style={{ paddingBottom: 60 }}>
      <h2 className="section-title">{t('contact_title')}</h2>
      <p className="section-subtitle">{t('contact_subtitle')}</p>
      <div className="contact-grid">
        <div className="contact-info">
          <h4>ENERGOQURILISHMAHSULOT MCHJ</h4>
          <p><i className="fas fa-map-pin"></i> {t('address')}</p>
          <p><i className="fas fa-phone-alt"></i> +998 (XX) XXX-XX-XX</p>
          <p><i className="fas fa-envelope"></i> info@energoqurilish.uz</p>
          <p><i className="fas fa-globe"></i> www.energoqurilish.uz</p>
          <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 12, textAlign: 'center' }}>
            <i className="fas fa-arrow-right" style={{ color: 'var(--accent)' }}></i> {t('footer_motto')}
          </div>
        </div>
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder={t('form_name')} required />
            <input type="email" placeholder={t('form_email')} required />
            <input type="text" placeholder={t('form_phone')} />
            <textarea rows={4} placeholder={t('form_message')}></textarea>
            <button type="submit">
              {t('form_submit')} <i className="fas fa-paper-plane" style={{ marginLeft: 8 }}></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
