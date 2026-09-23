"use client";

import { Language, SiteSettings } from '../types';
import InquiryForm from './InquiryForm';

interface ContactProps {
  t: (key: string) => string;
  locale: Language;
  settings: SiteSettings;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export default function Contact({ t, locale, settings }: ContactProps) {
  return (
    <section id="contact" className="container" style={{ paddingBottom: 60 }}>
      <h2 className="section-title">{t('contact_title')}</h2>
      <p className="section-subtitle">{t('contact_subtitle')}</p>
      <div className="contact-grid">
        <div className="contact-info">
          <h4>ENERGOQURILISHMAHSULOT MCHJ</h4>
          <p><i className="fas fa-map-pin"></i>
            <a href="https://maps.app.goo.gl/KL94CdAhBf2qAEt29" target="_blank" rel="noopener noreferrer">&quot;Energoqurilishmahsulot&quot; MCHJ</a>
          </p>
          {settings.phone && (
            <p><i className="fas fa-phone-alt"></i> <a href={telHref(settings.phone)}>{settings.phone}</a></p>
          )}
          {settings.telegramUsername && (
            <p><i className="fab fa-telegram-plane"></i>
              <a href={`https://t.me/${settings.telegramUsername}`} target="_blank" rel="noopener noreferrer">@{settings.telegramUsername}</a>
            </p>
          )}
          {settings.email && (
            <p><i className="fas fa-envelope"></i> <a href={`mailto:${settings.email}`}>{settings.email}</a></p>
          )}
          <p><i className="fas fa-globe"></i> www.energoqurilishmahsulot.uz</p>
          <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 12, textAlign: 'center' }}>
            <i className="fas fa-arrow-right" style={{ color: 'var(--accent)' }}></i> {t('footer_motto')}
          </div>
        </div>
        <div className="contact-form">
          <InquiryForm t={t} locale={locale} />
        </div>
      </div>
    </section>
  );
}
