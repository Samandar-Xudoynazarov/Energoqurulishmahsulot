"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category, Language } from '../../types';

const LANG_TABS: { value: Language; label: string }[] = [
  { value: 'uz', label: "O'zbekcha" },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];

function emptyName() {
  return { uz: '', ru: '', en: '' };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState(emptyName());
  const [activeLang, setActiveLang] = useState<Language>('uz');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState(emptyName());
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setError('Kategoriyalarni yuklab bo\'lmadi'));
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!newName.uz.trim() || !newName.ru.trim() || !newName.en.trim()) {
      setError('Kategoriya nomi barcha 3 tilda kiritilishi shart');
      return;
    }
    setAdding(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Xatolik yuz berdi');
        return;
      }
      setCategories(data.categories);
      setNewName(emptyName());
    } finally {
      setAdding(false);
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
  }

  async function saveEdit(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Xatolik yuz berdi');
        return;
      }
      setCategories(data.categories);
      setEditingId(null);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu kategoriyani o\'chirishni tasdiqlaysizmi?')) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'O\'chirishda xatolik');
        return;
      }
      setCategories(data.categories);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Kategoriyalar</h1>
        <Link href="/admin" style={{ color: '#1a3f62' }}>← Mahsulotlarga qaytish</Link>
      </div>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}
      {!categories && <p>Yuklanmoqda...</p>}

      {categories && (
        <div style={{ background: '#fff', borderRadius: 10, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th style={th}>Nomi (uz / ru / en)</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {categories.sort((a, b) => a.order - b.order).map((cat) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>
                    {editingId === cat.id ? (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {LANG_TABS.map((t) => (
                          <input
                            key={t.value}
                            value={editName[t.value]}
                            onChange={(e) => setEditName((n) => ({ ...n, [t.value]: e.target.value }))}
                            placeholder={t.label}
                            style={inputSmall}
                          />
                        ))}
                      </div>
                    ) : (
                      <span>{cat.name.uz} / {cat.name.ru} / {cat.name.en}</span>
                    )}
                  </td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {editingId === cat.id ? (
                      <>
                        <button onClick={() => saveEdit(cat.id)} disabled={busyId === cat.id} style={linkBtn}>Saqlash</button>
                        <button onClick={() => setEditingId(null)} style={linkBtnMuted}>Bekor qilish</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(cat)} style={linkBtn}>Tahrirlash</button>
                        <button onClick={() => handleDelete(cat.id)} disabled={busyId === cat.id} style={linkBtnDanger}>
                          {busyId === cat.id ? '...' : 'O\'chirish'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 10, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginTop: 0 }}>Yangi kategoriya qo'shish</h3>
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
              {t.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8 }}>
          <input
            value={newName[activeLang]}
            onChange={(e) => setNewName((n) => ({ ...n, [activeLang]: e.target.value }))}
            placeholder={`Kategoriya nomi (${activeLang})`}
            style={{ ...inputSmall, flex: 1 }}
          />
          <button type="submit" disabled={adding} style={btnPrimary}>
            {adding ? 'Qo\'shilmoqda...' : '+ Qo\'shish'}
          </button>
        </form>
        <p style={{ fontSize: '0.8rem', color: '#889', marginTop: '0.5rem' }}>
          Eslatma: har uch tilda ({LANG_TABS.map((t) => t.label).join(', ')}) nom kiriting, keyin "Qo'shish" tugmasini bosing.
        </p>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: '0.6rem 0', fontSize: '0.85rem', color: '#556' };
const td: React.CSSProperties = { padding: '0.6rem 0' };
const inputSmall: React.CSSProperties = {
  padding: '0.5rem 0.7rem', borderRadius: 6, border: '1px solid #ccc', fontSize: '0.85rem',
};
const btnPrimary: React.CSSProperties = {
  background: '#1a3f62', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: 8,
  border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
};
const linkBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#1a3f62', cursor: 'pointer', marginRight: 12, fontSize: '0.85rem' };
const linkBtnMuted: React.CSSProperties = { ...linkBtn, color: '#889' };
const linkBtnDanger: React.CSSProperties = { ...linkBtn, color: '#c0392b', marginRight: 0 };
