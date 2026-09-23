"use client";

import { useEffect, useState } from 'react';
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

  if (!settings) return <p>{msg?.text || 'Yuklanmoqda...'}</p>;

  const set = (field: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings((s) => (s ? { ...s, [field]: e.target.value } : s));

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
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 10, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      <h1 style={{ marginTop: 0 }}>Sayt sozlamalari</h1>
      <p style={{ color: '#667', marginTop: 0 }}>
        Bu ma&apos;lumotlar saytdagi &quot;Bog&apos;lanish&quot; bo&apos;limida va ekran burchagidagi qo&apos;ng&apos;iroq / Telegram tugmalarida ko&apos;rinadi.
        Bo&apos;sh qoldirilgan maydon saytda ko&apos;rsatilmaydi.
      </p>

      <div style={row}>
        <label style={label}>Telefon raqami</label>
        <input value={settings.phone} onChange={set('phone')} style={input} placeholder="+998 71 123-45-67" />
      </div>
      <div style={row}>
        <label style={label}>Telegram username (bot emas, menejer yoki kanal)</label>
        <input value={settings.telegramUsername} onChange={set('telegramUsername')} style={input} placeholder="energoqurilish_sales" />
      </div>
      <div style={row}>
        <label style={label}>Email</label>
        <input type="email" value={settings.email} onChange={set('email')} style={input} placeholder="info@energoqurilishmahsulot.uz" />
      </div>

      <FileUploader
        label={'"Biz haqimizda" bo\'limidagi zavod rasmi'}
        kind="image"
        value={settings.aboutImage}
        onUploaded={(url) => setSettings((s) => (s ? { ...s, aboutImage: url } : s))}
      />
      {settings.aboutImage && (
        <button type="button" onClick={() => setSettings((s) => (s ? { ...s, aboutImage: '' } : s))}
          style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', padding: 0, marginBottom: '1rem' }}>
          Rasmni olib tashlash
        </button>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: '0.5rem' }}>
        <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
        {msg && <span style={{ color: msg.ok ? '#27ae60' : '#c0392b' }}>{msg.text}</span>}
      </div>
    </form>
  );
}

const row: React.CSSProperties = { marginBottom: '1rem' };
const label: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' };
const input: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box',
};
const btnPrimary: React.CSSProperties = {
  background: '#1a3f62', color: '#fff', padding: '0.7rem 1.5rem', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer',
};
