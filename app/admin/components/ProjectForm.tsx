"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Language, Product, Project } from '../../types';
import MultiImageUploader from './MultiImageUploader';

const LANG_TABS: { value: Language; label: string }[] = [
  { value: 'uz', label: "O'zbekcha" },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];

type Draft = Omit<Project, 'id' | 'order'> & { id?: string };

function emptyProject(): Draft {
  return {
    title: { uz: '', ru: '', en: '' },
    location: { uz: '', ru: '', en: '' },
    description: { uz: '', ru: '', en: '' },
    year: '',
    images: [],
    productCodes: [],
  };
}

export default function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [project, setProject] = useState<Draft>(initial || emptyProject());
  const [products, setProducts] = useState<Product[]>([]);
  const [activeLang, setActiveLang] = useState<Language>('uz');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((d) => setProducts((d.products || []).filter((p: Product) => p.category !== 'jamoa')))
      .catch(() => {});
  }, []);

  function setText(field: 'title' | 'location' | 'description', value: string) {
    setProject((p) => ({ ...p, [field]: { ...p[field], [activeLang]: value } }));
  }

  function toggleCode(code: string) {
    setProject((p) => ({
      ...p,
      productCodes: p.productCodes.includes(code) ? p.productCodes.filter((c) => c !== code) : [...p.productCodes, code],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const missing = LANG_TABS.filter((l) => !project.title[l.value].trim());
    if (missing.length) {
      setError(`Loyiha nomi barcha 3 tilda kiritilishi shart (yetishmayapti: ${missing.map((m) => m.label).join(', ')})`);
      setActiveLang(missing[0].value);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/projects/${initial!.id}` : '/api/admin/projects', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Saqlashda xatolik');
        setSaving(false);
        return;
      }
      router.push('/admin/projects');
      router.refresh();
    } catch {
      setError("Server bilan bog'lanishda xatolik");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={card}>
      <h1 style={{ marginTop: 0 }}>{isEdit ? 'Loyihani tahrirlash' : 'Yangi loyiha'}</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', borderBottom: '2px solid #eee' }}>
        {LANG_TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setActiveLang(t.value)}
            style={{
              padding: '0.5rem 1rem', border: 'none', background: 'none', cursor: 'pointer',
              fontWeight: activeLang === t.value ? 700 : 400,
              borderBottom: activeLang === t.value ? '2px solid #1a3f62' : '2px solid transparent',
              marginBottom: -2,
            }}
          >
            {t.label}{!project.title[t.value].trim() && ' •'}
          </button>
        ))}
      </div>

      <div style={row}>
        <label style={label}>Loyiha nomi ({activeLang}) *</label>
        <input value={project.title[activeLang]} onChange={(e) => setText('title', e.target.value)} style={input}
          placeholder={activeLang === 'ru' ? 'Подстанция 500 кВ «Сырдарья»' : '500 kV "Sirdaryo" podstansiyasi'} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div style={row}>
          <label style={label}>Joylashuv ({activeLang})</label>
          <input value={project.location[activeLang]} onChange={(e) => setText('location', e.target.value)} style={input}
            placeholder={activeLang === 'ru' ? 'Сырдарьинская обл.' : 'Sirdaryo viloyati'} />
        </div>
        <div style={row}>
          <label style={label}>Yil</label>
          <input value={project.year} onChange={(e) => setProject((p) => ({ ...p, year: e.target.value }))} style={input} placeholder="2024" />
        </div>
      </div>
      <div style={row}>
        <label style={label}>Tavsif ({activeLang})</label>
        <textarea value={project.description[activeLang]} onChange={(e) => setText('description', e.target.value)}
          style={{ ...input, minHeight: 100, resize: 'vertical' }}
          placeholder="Qanday obyekt, qancha hajmda mahsulot yetkazildi, qisqacha natija..." />
      </div>

      <MultiImageUploader label="Rasmlar" value={project.images} onChange={(images) => setProject((p) => ({ ...p, images }))} />

      <div style={row}>
        <label style={label}>Yetkazilgan mahsulotlar</label>
        <p style={{ fontSize: '0.8rem', color: '#889', margin: '0 0 0.6rem' }}>
          Belgilangan mahsulotlar sahifasida &quot;Ushbu mahsulot ishlatilgan loyihalar&quot; bo&apos;limida bu loyiha ko&apos;rinadi.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {products.map((p) => {
            const on = project.productCodes.includes(p.code);
            return (
              <button type="button" key={p.code} onClick={() => toggleCode(p.code)}
                style={{
                  padding: '0.35rem 0.8rem', borderRadius: 16, cursor: 'pointer', fontSize: '0.85rem',
                  border: on ? '1px solid #1a3f62' : '1px solid #ccc',
                  background: on ? '#1a3f62' : '#fff', color: on ? '#fff' : '#333',
                }}>
                {p.code}
              </button>
            );
          })}
          {products.length === 0 && <span style={{ color: '#889', fontSize: '0.85rem' }}>Yuklanmoqda...</span>}
        </div>
      </div>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: 12 }}>
        <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
        <button type="button" onClick={() => router.push('/admin/projects')} style={btnSecondary}>Bekor qilish</button>
      </div>
    </form>
  );
}

const card: React.CSSProperties = { background: '#fff', borderRadius: 10, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' };
const row: React.CSSProperties = { marginBottom: '1rem' };
const label: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' };
const input: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box',
  fontFamily: 'inherit',
};
const btnPrimary: React.CSSProperties = {
  background: '#1a3f62', color: '#fff', padding: '0.7rem 1.5rem', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer',
};
const btnSecondary: React.CSSProperties = {
  background: '#eee', color: '#333', padding: '0.7rem 1.5rem', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer',
};
