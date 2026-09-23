"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Project } from '../../types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/projects')
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .catch(() => setError("Loyihalarni yuklab bo'lmadi"));
  }, []);

  async function handleDelete(p: Project) {
    if (!confirm(`"${p.title.uz}" loyihasini (rasmlari bilan) o'chirishni tasdiqlaysizmi?`)) return;
    setBusy(p.id);
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) setProjects(data.projects);
      else setError(data.error || "O'chirishda xatolik");
    } finally {
      setBusy(null);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    if (!projects) return;
    const j = index + dir;
    if (j < 0 || j >= projects.length) return;
    const next = [...projects];
    [next[index], next[j]] = [next[j], next[index]];
    const reordered = next.map((p, i) => ({ ...p, order: i }));
    setProjects(reordered);
    setBusy('order');
    try {
      const res = await fetch('/api/admin/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: reordered.map((p) => p.id) }),
      });
      if (!res.ok) setError('Tartibni saqlab bo\'lmadi');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Loyihalar (portfolio)</h1>
        <Link href="/admin/projects/new" style={btnPrimary}>+ Yangi loyiha</Link>
      </div>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}
      {!projects && !error && <p>Yuklanmoqda...</p>}
      {projects && projects.length === 0 && (
        <div style={{ background: '#fff', borderRadius: 10, padding: '2rem', textAlign: 'center', color: '#667' }}>
          Hali loyiha qo&apos;shilmagan. Birinchi loyihangizni qo&apos;shing — u saytdagi &quot;Loyihalar&quot; bo&apos;limida paydo bo&apos;ladi.
        </div>
      )}

      {projects && projects.length > 0 && (
        <div style={{ display: 'grid', gap: 12 }}>
          {projects.map((p, i) => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 10, padding: '0.8rem', display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              {p.images[0] ? (
                <img src={p.images[0]} alt="" style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <div style={{ width: 96, height: 64, background: '#ddd', borderRadius: 6 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{p.title.uz}</strong>
                <div style={{ fontSize: '0.85rem', color: '#667' }}>
                  {[p.location.uz, p.year].filter(Boolean).join(' · ')}
                  {' · '}{p.images.length} ta rasm · {p.productCodes.length} ta mahsulot
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button onClick={() => move(i, -1)} disabled={i === 0 || busy !== null} style={miniBtn}>↑</button>
                <button onClick={() => move(i, 1)} disabled={i === projects.length - 1 || busy !== null} style={miniBtn}>↓</button>
                <Link href={`/admin/projects/${p.id}/edit`} style={{ color: '#1a3f62', margin: '0 8px' }}>Tahrirlash</Link>
                <button onClick={() => handleDelete(p)} disabled={busy === p.id} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}>
                  {busy === p.id ? "O'chirilmoqda..." : "O'chirish"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  background: '#1a3f62', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
};
const miniBtn: React.CSSProperties = { background: '#eee', border: 'none', borderRadius: 6, cursor: 'pointer', padding: '0.3rem 0.6rem' };
