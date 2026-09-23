"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, ProductSpec, Language, Category } from '../../types';
import FileUploader from './FileUploader';

const LANG_TABS: { value: Language; label: string }[] = [
  { value: 'uz', label: "O'zbekcha" },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];

// Rus tilidagi matnlarda Lotin harflari (a-z, A-Z) ishlatilishini taqiqlaymiz.
// Mahsulot kodlari (Ф5-УСУ kabi) bu tekshiruvga kirmaydi — faqat nomi/teg/tavsif/tex.jadval uchun.
function hasLatinLetters(text: string): boolean {
  return /[a-zA-Z]/.test(text);
}

function emptyProduct(): Product {
  return {
    code: '',
    category: '',
    name: { uz: '', ru: '', en: '' },
    tag: { uz: '', ru: '', en: '' },
    description: { uz: '', ru: '', en: '' },
    image: '',
    specs: [],
    order: 0,
  };
}

export default function ProductForm({ initial, isEdit }: { initial?: Product; isEdit?: boolean }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(initial || emptyProduct());
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeLang, setActiveLang] = useState<Language>('uz');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        const cats: Category[] = data.categories || [];
        setCategories(cats);
        setProduct((p) => (p.category ? p : { ...p, category: cats[0]?.id || '' }));
      })
      .catch(() => {});
  }, []);

  function updateField(lang: Language, field: 'name' | 'tag' | 'description', value: string) {
    setProduct((p) => ({ ...p, [field]: { ...p[field], [lang]: value } }));
  }

  function addSpec() {
    const newSpec: ProductSpec = {
      id: `spec_${Date.now()}`,
      label: { uz: '', ru: '', en: '' },
      value: '',
    };
    setProduct((p) => ({ ...p, specs: [...p.specs, newSpec] }));
  }

  function updateSpecLabel(id: string, lang: Language, value: string) {
    setProduct((p) => ({
      ...p,
      specs: p.specs.map((s) => (s.id === id ? { ...s, label: { ...s.label, [lang]: value } } : s)),
    }));
  }

  function updateSpecValue(id: string, value: string) {
    setProduct((p) => ({ ...p, specs: p.specs.map((s) => (s.id === id ? { ...s, value } : s)) }));
  }

  function removeSpec(id: string) {
    setProduct((p) => ({ ...p, specs: p.specs.filter((s) => s.id !== id) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!product.code.trim()) {
      setError('Mahsulot kodi kiritilishi shart');
      return;
    }
    if (!product.name.uz.trim() || !product.name.ru.trim() || !product.name.en.trim()) {
      setError('Nom barcha 3 tilda (uz/ru/en) kiritilishi shart');
      return;
    }

    // Rus tili maydonlarida faqat Kirill alifbosi bo'lishi shart — Lotin harflari taqiqlanadi.
    const ruFieldsInvalid =
      hasLatinLetters(product.name.ru) ||
      hasLatinLetters(product.tag.ru) ||
      hasLatinLetters(product.description.ru) ||
      product.specs.some((s) => hasLatinLetters(s.label.ru));
    if (ruFieldsInvalid) {
      setError('Rus tilidagi maydonlarda Lotin harflari ishlatilmasin — faqat Kirill alifbosida yozing (masalan: "Фундамент", "Опора", "Лоток").');
      setActiveLang('ru');
      return;
    }

    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/products/${encodeURIComponent(product.code)}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Saqlashda xatolik');
        setSaving(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Server bilan bog\'lanishda xatolik');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 10, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      <h1 style={{ marginTop: 0 }}>{isEdit ? `Tahrirlash: ${product.code}` : 'Yangi mahsulot'}</h1>

      <div style={row}>
        <label style={label}>Mahsulot kodi (masalan Ф5-УСУ)</label>
        <input
          value={product.code}
          onChange={(e) => setProduct((p) => ({ ...p, code: e.target.value }))}
          disabled={isEdit}
          style={input}
          placeholder="Ф5-УСУ"
        />
      </div>

      <div style={row}>
        <label style={label}>Kategoriya</label>
        <select
          value={product.category}
          onChange={(e) => setProduct((p) => ({ ...p, category: e.target.value }))}
          style={input}
        >
          {categories.length === 0 && <option value="">Yuklanmoqda...</option>}
          {categories.sort((a, b) => a.order - b.order).map((c) => (
            <option key={c.id} value={c.id}>{c.name.uz}</option>
          ))}
        </select>
        <Link href="/admin/categories" target="_blank" style={{ fontSize: '0.8rem', color: '#1a3f62' }}>
          + Yangi kategoriya qo'shish (yangi oynada)
        </Link>
      </div>

      {/* Language tabs */}
      <div style={{ display: 'flex', gap: 8, marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '2px solid #eee' }}>
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
            {t.label}
          </button>
        ))}
      </div>

      {activeLang === 'ru' && (
        <p style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8, padding: '0.6rem 0.9rem', fontSize: '0.85rem', color: '#7a5c00', marginTop: 0 }}>
          ⚠️ Faqat Kirill alifbosida yozing (masalan: "Фундамент Ф5-УСУ"). Lotin harflarida ("Fundament") yozilsa, forma saqlashga yo'l qo'ymaydi.
        </p>
      )}
      <div style={row}>
        <label style={label}>Nomi ({activeLang})</label>
        <input
          value={product.name[activeLang]}
          onChange={(e) => updateField(activeLang, 'name', e.target.value)}
          style={{ ...input, ...(activeLang === 'ru' && hasLatinLetters(product.name.ru) ? invalidInput : {}) }}
        />
        {activeLang === 'ru' && hasLatinLetters(product.name.ru) && (
          <span style={fieldWarning}>Lotin harflari topildi — Kirillchaga o'zgartiring</span>
        )}
      </div>
      <div style={row}>
        <label style={label}>Teg/qisqa yorliq ({activeLang})</label>
        <input
          value={product.tag[activeLang]}
          onChange={(e) => updateField(activeLang, 'tag', e.target.value)}
          style={{ ...input, ...(activeLang === 'ru' && hasLatinLetters(product.tag.ru) ? invalidInput : {}) }}
        />
        {activeLang === 'ru' && hasLatinLetters(product.tag.ru) && (
          <span style={fieldWarning}>Lotin harflari topildi — Kirillchaga o'zgartiring</span>
        )}
      </div>
      <div style={row}>
        <label style={label}>Tavsif ({activeLang})</label>
        <textarea
          value={product.description[activeLang]}
          onChange={(e) => updateField(activeLang, 'description', e.target.value)}
          style={{
            ...input, minHeight: 260, resize: 'vertical' as const, lineHeight: 1.6,
            ...(activeLang === 'ru' && hasLatinLetters(product.description.ru) ? invalidInput : {}),
          }}
        />
        {activeLang === 'ru' && hasLatinLetters(product.description.ru) && (
          <span style={fieldWarning}>Lotin harflari topildi — Kirillchaga o'zgartiring</span>
        )}
      </div>

      {/* Technical specs table */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0 }}>Texnik jadval</h3>
          <button type="button" onClick={addSpec} style={btnSecondary}>+ Qator qo'shish</button>
        </div>
        {product.specs.length === 0 && <p style={{ color: '#889', fontSize: '0.9rem' }}>Hali qator yo'q. Masalan: "Beton markasi" — "B25".</p>}
        {product.specs.map((spec) => (
          <div key={spec.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input
              placeholder={`Nomi (${activeLang})`}
              value={spec.label[activeLang]}
              onChange={(e) => updateSpecLabel(spec.id, activeLang, e.target.value)}
              style={{ ...inputSmall, ...(activeLang === 'ru' && hasLatinLetters(spec.label.ru) ? invalidInput : {}) }}
            />
            <input
              placeholder="Qiymati (masalan: B25)"
              value={spec.value}
              onChange={(e) => updateSpecValue(spec.id, e.target.value)}
              style={inputSmall}
            />
            <span style={{ fontSize: '0.8rem', color: '#889' }}>
              {LANG_TABS.filter((t) => t.value !== activeLang).map((t) => spec.label[t.value] || '—').join(' / ')}
            </span>
            <button type="button" onClick={() => removeSpec(spec.id)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}>✕</button>
          </div>
        ))}
      </div>

      {/* Files */}
      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <FileUploader
          label="Mahsulot rasmi"
          kind="image"
          value={product.image}
          onUploaded={(url) => setProduct((p) => ({ ...p, image: url }))}
        />
        <FileUploader
          label="Sertifikat (PDF)"
          kind="pdf"
          value={product.certificatePdf}
          onUploaded={(url) => setProduct((p) => ({ ...p, certificatePdf: url }))}
        />
        <FileUploader
          label="Pasport (PDF)"
          kind="pdf"
          value={product.passportPdf}
          onUploaded={(url) => setProduct((p) => ({ ...p, passportPdf: url }))}
        />
      </div>

      {error && <p style={{ color: '#c0392b', marginTop: '1rem' }}>{error}</p>}

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: 12 }}>
        <button type="submit" disabled={saving} style={btnPrimary}>
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
        <button type="button" onClick={() => router.push('/admin')} style={btnSecondary}>
          Bekor qilish
        </button>
      </div>
    </form>
  );
}

const row: React.CSSProperties = { marginBottom: '1rem' };
const label: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' };
const input: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #ccc',
  fontSize: '0.95rem', boxSizing: 'border-box',
};
const inputSmall: React.CSSProperties = { ...input, padding: '0.5rem 0.6rem', fontSize: '0.85rem' };
const invalidInput: React.CSSProperties = { border: '1px solid #c0392b', background: '#fff5f5' };
const fieldWarning: React.CSSProperties = { display: 'block', color: '#c0392b', fontSize: '0.8rem', marginTop: '0.3rem' };
const btnPrimary: React.CSSProperties = {
  background: '#1a3f62', color: '#fff', padding: '0.7rem 1.5rem', borderRadius: 8,
  border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem',
};
const btnSecondary: React.CSSProperties = {
  background: '#eee', color: '#333', padding: '0.5rem 1rem', borderRadius: 8,
  border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
};
