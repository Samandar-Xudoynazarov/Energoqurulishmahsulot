"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteSettings } from '../../types';
import FileUploader from '../components/FileUploader';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => setMsg({ ok: false, text: "Sozlamalarni yuklab bo'lmadi" }));
  }, []);

  if (!settings) return <div className="a-loading">{msg?.text || <><i className="fas fa-spinner fa-spin"></i> Yuklanmoqda...</>}</div>;

  const set = (field: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings((s) => (s ? { ...s, [field]: e.target.value } : s));
  const setImg = (field: 'aboutImage' | 'heroImage', url: string) => setSettings((s) => (s ? { ...s, [field]: url } : s));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data.settings);
        setMsg({ ok: true, text: 'Saqlandi ✓' });
      } else {
        setMsg({ ok: false, text: data.error || 'Xatolik' });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="a-page-head">
        <div>
          <h1>Sozlamalar va rasmlar</h1>
          <p>Aloqa ma&apos;lumotlari, zavod rasmi va bosh ekran foni.</p>
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-head">
          <div>
            <h2><i className="fas fa-image"></i> Sayt rasmlari</h2>
            <p>Ishlab chiqarish bosqichlari, jamoa va «Nima uchun biz» rasmlari — <Link href="/admin/content">Sayt bo&apos;limlari</Link> sahifasida.</p>
          </div>
        </div>
        <div className="a-grid-2">
          <FileUploader
            wide
            label="Zavod rasmi («Biz haqimizda» bo'limi)"
            hint="Zavodning umumiy ko'rinishi — gorizontal rasm tavsiya etiladi"
            kind="image"
            value={settings.aboutImage}
            onUploaded={(url) => setImg('aboutImage', url)}
            onRemove={() => setImg('aboutImage', '')}
          />
          <FileUploader
            wide
            label="Bosh ekran foni (eng yuqoridagi katta blok)"
            hint="Keng rasm (masalan 1920×1080). Ustiga to'q ko'k qatlam qo'yiladi — matn o'qiladi"
            kind="image"
            value={settings.heroImage}
            onUploaded={(url) => setImg('heroImage', url)}
            onRemove={() => setImg('heroImage', '')}
          />
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-head">
          <div>
            <h2><i className="fas fa-address-book"></i> Aloqa</h2>
            <p>«Bog&apos;lanish» bo&apos;limida va ekran burchagidagi tugmalarda ko&apos;rinadi. Bo&apos;sh maydon saytda ko&apos;rsatilmaydi.</p>
          </div>
        </div>
        <div className="a-grid-3">
          <div className="a-field">
            <label>Telefon raqami</label>
            <input value={settings.phone} onChange={set('phone')} placeholder="+998 71 123-45-67" />
          </div>
          <div className="a-field">
            <label>Telegram username</label>
            <input value={settings.telegramUsername} onChange={set('telegramUsername')} placeholder="energoqurilish_sales" />
            <span className="a-hint">Bot emas — menejer yoki kanal</span>
          </div>
          <div className="a-field">
            <label>Email</label>
            <input type="email" value={settings.email} onChange={set('email')} placeholder="info@energoqurilishmahsulot.uz" />
          </div>
        </div>
      </div>

      <div className="a-savebar">
        {msg && <div className={`a-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
        <button type="submit" disabled={saving} className="a-btn a-btn-primary">
          {saving ? <><i className="fas fa-spinner fa-spin"></i> Saqlanmoqda...</> : <><i className="fas fa-check"></i> Saqlash</>}
        </button>
      </div>
    </form>
  );
}
