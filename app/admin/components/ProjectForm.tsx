"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Language, Product, Project } from '../../types';
import MultiImageUploader from './MultiImageUploader';
import LangTabs, { LANGS as LANG_TABS } from './LangTabs';
import Link from 'next/link';


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
    <form onSubmit={handleSubmit}>
      <div className="a-page-head">
        <div>
          <h1>{isEdit ? 'Loyihani tahrirlash' : 'Yangi loyiha'}</h1>
          <p><Link href="/admin/projects"><i className="fas fa-arrow-left"></i> Loyihalar ro&apos;yxati</Link></p>
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-head">
          <h2><i className="fas fa-align-left"></i> Ma&apos;lumot</h2>
          <LangTabs value={activeLang} onChange={setActiveLang} missing={project.title} />
        </div>
        <div className="a-field">
          <label>Loyiha nomi ({activeLang}) *</label>
          <input value={project.title[activeLang]} onChange={(e) => setText('title', e.target.value)}
            placeholder={activeLang === 'ru' ? 'Подстанция 500 кВ «Сырдарья»' : '500 kV "Sirdaryo" podstansiyasi'} />
        </div>
        <div className="a-grid-2">
          <div className="a-field">
            <label>Joylashuv ({activeLang})</label>
            <input value={project.location[activeLang]} onChange={(e) => setText('location', e.target.value)}
              placeholder={activeLang === 'ru' ? 'Сырдарьинская обл.' : 'Sirdaryo viloyati'} />
          </div>
          <div className="a-field">
            <label>Yil</label>
            <input value={project.year} onChange={(e) => setProject((p) => ({ ...p, year: e.target.value }))} placeholder="2024" />
          </div>
        </div>
        <div className="a-field">
          <label>Tavsif ({activeLang})</label>
          <textarea rows={5} value={project.description[activeLang]} onChange={(e) => setText('description', e.target.value)}
            placeholder="Qanday obyekt, qancha hajmda mahsulot yetkazildi, qisqacha natija..." />
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-head"><h2><i className="fas fa-images"></i> Rasmlar</h2></div>
        <MultiImageUploader label="Loyiha rasmlari" value={project.images} onChange={(images) => setProject((p) => ({ ...p, images }))} />
      </div>

      <div className="a-card">
        <div className="a-card-head">
          <div>
            <h2><i className="fas fa-cubes"></i> Yetkazilgan mahsulotlar</h2>
            <p>Belgilangan mahsulotlar sahifasida «Ushbu mahsulot ishlatilgan loyihalar» bo&apos;limida bu loyiha ko&apos;rinadi.</p>
          </div>
          <span className="a-badge blue">{project.productCodes.length} ta tanlangan</span>
        </div>
        <div className="a-chips">
          {products.map((p) => (
            <button type="button" key={p.code} onClick={() => toggleCode(p.code)} className={`a-chip${project.productCodes.includes(p.code) ? ' on' : ''}`}>
              {p.code}
            </button>
          ))}
          {products.length === 0 && <span className="a-hint">Yuklanmoqda...</span>}
        </div>
      </div>

      <div className="a-savebar">
        {error && <div className="a-msg err">{error}</div>}
        <button type="button" onClick={() => router.push('/admin/projects')} className="a-btn">Bekor qilish</button>
        <button type="submit" disabled={saving} className="a-btn a-btn-primary">
          {saving ? <><i className="fas fa-spinner fa-spin"></i> Saqlanmoqda...</> : <><i className="fas fa-check"></i> Saqlash</>}
        </button>
      </div>
    </form>
  );
}
