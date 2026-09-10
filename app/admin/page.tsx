"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, Category } from '../types';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setError('Mahsulotlarni yuklab bo\'lmadi'));
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  function categoryLabel(id: string): string {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name.uz : id;
  }

  async function handleDelete(code: string) {
    if (!confirm(`"${code}" mahsulotini o'chirishni tasdiqlaysizmi?`)) return;
    setDeletingCode(code);
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(code)}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
      } else {
        alert(data.error || 'O\'chirishda xatolik');
      }
    } finally {
      setDeletingCode(null);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Mahsulotlar</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/categories" style={btnSecondary}>Kategoriyalar</Link>
          <Link href="/admin/products/new" style={btnPrimary}>+ Yangi mahsulot</Link>
        </div>
      </div>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}
      {!products && !error && <p>Yuklanmoqda...</p>}

      {products && products.length === 0 && <p>Hozircha mahsulot yo'q.</p>}

      {products && products.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#eef1f4', textAlign: 'left' }}>
                <th style={th}>Rasm</th>
                <th style={th}>Kod</th>
                <th style={th}>Nomi (uz)</th>
                <th style={th}>Kategoriya</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.code} style={{ borderTop: '1px solid #eee' }}>
                  <td style={td}>
                    {p.image ? (
                      <img src={p.image} alt={p.code} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <div style={{ width: 48, height: 48, background: '#ddd', borderRadius: 6 }} />
                    )}
                  </td>
                  <td style={td}><strong>{p.code}</strong></td>
                  <td style={td}>{p.name?.uz}</td>
                  <td style={td}>{categoryLabel(p.category)}</td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <Link href={`/admin/products/${encodeURIComponent(p.code)}/edit`} style={{ marginRight: 12, color: '#1a3f62' }}>
                      Tahrirlash
                    </Link>
                    <button
                      onClick={() => handleDelete(p.code)}
                      disabled={deletingCode === p.code}
                      style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}
                    >
                      {deletingCode === p.code ? 'O\'chirilmoqda...' : 'O\'chirish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#556' };
const td: React.CSSProperties = { padding: '0.6rem 1rem', verticalAlign: 'middle' };
const btnPrimary: React.CSSProperties = {
  background: '#1a3f62', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: 8,
  textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
};
const btnSecondary: React.CSSProperties = {
  background: '#eee', color: '#333', padding: '0.6rem 1.2rem', borderRadius: 8,
  textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
};
