"use client";

import { FormEvent, useState } from 'react';
import { Language } from '../types';

interface InquiryFormProps {
  t: (key: string) => string;
  locale: Language;
  productCode?: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function InquiryForm({ t, locale, productCode }: InquiryFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorKey, setErrorKey] = useState('form_error');
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', message: '', website: '' });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || form.phone.replace(/\D/g, '').length < 7) {
      setErrorKey('form_error_validation');
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, productCode, locale }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', phone: '', email: '', company: '', message: '', website: '' });
        return;
      }
      const data = await res.json().catch(() => ({}));
      setErrorKey(
        data.error === 'validation' ? 'form_error_validation' : data.error === 'rate_limited' ? 'form_error_rate' : 'form_error'
      );
      setStatus('error');
    } catch {
      setErrorKey('form_error');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status">
        <i className="fas fa-check-circle"></i>
        <p>{t('form_success')}</p>
        <button type="button" className="form-link-btn" onClick={() => setStatus('idle')}>
          {t('form_send_another')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {productCode && (
        <div className="form-product-chip">
          <i className="fas fa-cube"></i> {productCode}
        </div>
      )}
      <input type="text" placeholder={`${t('form_name')} *`} value={form.name} onChange={set('name')} autoComplete="name" required maxLength={100} />
      <input type="tel" placeholder={`${t('form_phone')} *`} value={form.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" required maxLength={40} />
      <input type="text" placeholder={t('form_company')} value={form.company} onChange={set('company')} autoComplete="organization" maxLength={150} />
      <input type="email" placeholder={t('form_email')} value={form.email} onChange={set('email')} autoComplete="email" maxLength={120} />
      <textarea
        rows={4}
        placeholder={productCode ? t('form_message_product') : t('form_message')}
        value={form.message}
        onChange={set('message')}
        maxLength={2000}
      ></textarea>
      {/* Honeypot — odamlarga ko'rinmaydi, botlar to'ldiradi */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={set('website')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
      />
      {status === 'error' && <p className="form-error" role="alert">{t(errorKey)}</p>}
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t('form_sending') : t('form_submit')}{' '}
        <i className={`fas ${status === 'sending' ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} style={{ marginLeft: 8 }}></i>
      </button>
    </form>
  );
}
