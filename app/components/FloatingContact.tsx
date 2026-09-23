"use client";

import { SiteSettings } from '../types';
import { telHref } from './Contact';

export default function FloatingContact({ settings, t }: { settings: SiteSettings; t: (key: string) => string }) {
  if (!settings.phone && !settings.telegramUsername) return null;
  return (
    <div className="floating-contact">
      {settings.telegramUsername && (
        <a
          href={`https://t.me/${settings.telegramUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fc-btn fc-telegram"
          aria-label={t('float_telegram')}
          title={t('float_telegram')}
        >
          <i className="fab fa-telegram-plane"></i>
        </a>
      )}
      {settings.phone && (
        <a href={telHref(settings.phone)} className="fc-btn fc-phone" aria-label={t('float_call')} title={t('float_call')}>
          <i className="fas fa-phone-alt"></i>
        </a>
      )}
    </div>
  );
}
