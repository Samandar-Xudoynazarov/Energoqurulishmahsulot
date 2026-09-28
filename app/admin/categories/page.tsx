"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category, Language } from '../../types';
import LangTabs from '../components/LangTabs';

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

  const visible = (categories || []).filter((c) => c.id !== 'jamoa').sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="a-page-head">
        <div>
          <h1>Kategoriyalar</h1>
          <p>Saytdagi mahsulot guruhlari (Fundamentlar, Lotoklar ...).</p>
        </div>
        <Link href="/admin" className="a-btn"><i className="fas fa-arrow-left"></i> Mahsulotlar</Link>
      </div>

      {error && <div className="a-msg err">{error}</div>}

      <div className="a-card flush">
        {!categories && <div className="a-loading"><i className="fas fa-spinner fa-spin"></i> Yuklanmoqda...</div>}
        {categories && (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr><th>O&apos;zbekcha</th><th>Русский</th><th>English</th><th></th></tr>
              </thead>
              <tbody>
                {visible.map((cat) => (
                  <tr key={cat.id}>
                    {LANG_TABS.map((t) => (
                      <td key={t.value}>
                        {editingId === cat.id ? (
                          <input className="a-input" value={editName[t.value]} onChange={(e) => setEditName((n) => ({ ...n, [t.value]: e.target.value }))} placeholder={t.label} />
                        ) : (
                          t.value === 'uz' ? <b>{cat.name.uz}</b> : cat.name[t.value]
                        )}
                      </td>
                    ))}
                    <td>
                      <div className="a-row-actions">
                        {editingId === cat.id ? (
                          <>
                            <button onClick={() => saveEdit(cat.id)} disabled={busyId === cat.id} className="a-btn a-btn-sm a-btn-primary"><i className="fas fa-check"></i> Saqlash</button>
                            <button onClick={() => setEditingId(null)} className="a-btn a-btn-sm">Bekor</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(cat)} className="a-btn a-btn-sm"><i className="fas fa-pen"></i> Tahrirlash</button>
                            <button onClick={() => handleDelete(cat.id)} disabled={busyId === cat.id} className="a-btn a-btn-sm a-btn-danger a-icon-btn" title="O'chirish">
                              <i className={`fas ${busyId === cat.id ? 'fa-spinner fa-spin' : 'fa-trash-alt'}`}></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="a-card">
        <div className="a-card-head">
          <div>
            <h2><i className="fas fa-plus-circle"></i> Yangi kategoriya</h2>
            <p>Har uch tilda nom kiriting, keyin «Qo&apos;shish» tugmasini bosing.</p>
          </div>
          <LangTabs value={activeLang} onChange={setActiveLang} missing={newName} />
        </div>
        <form onSubmit={handleAdd} className="a-actions" style={{ flexWrap: 'nowrap' }}>
          <input className="a-input" value={newName[activeLang]} onChange={(e) => setNewName((n) => ({ ...n, [activeLang]: e.target.value }))} placeholder={`Kategoriya nomi (${activeLang})`} />
          <button type="submit" disabled={adding} className="a-btn a-btn-primary">
            <i className="fas fa-plus"></i> {adding ? "Qo'shilmoqda..." : "Qo'shish"}
          </button>
        </form>
      </div>
    </div>
  );
}
