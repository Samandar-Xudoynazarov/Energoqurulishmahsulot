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
      <div className="a-page-head">
        <div>
          <h1>Loyihalar</h1>
          <p>«Bizning yirik loyihalarimiz» bo&apos;limi: har bir loyihaga bir nechta rasm yuklash mumkin.</p>
        </div>
        <Link href="/admin/projects/new" className="a-btn a-btn-primary"><i className="fas fa-plus"></i> Yangi loyiha</Link>
      </div>

      {error && <div className="a-msg err">{error}</div>}

      <div className="a-card">
        {!projects && !error && <div className="a-loading"><i className="fas fa-spinner fa-spin"></i> Yuklanmoqda...</div>}
        {projects && projects.length === 0 && (
          <div className="a-empty">
            <i className="fas fa-building"></i>
            Hali loyiha qo&apos;shilmagan. Birinchi loyihangizni qo&apos;shing — u saytdagi «Loyihalar» bo&apos;limida paydo bo&apos;ladi.
          </div>
        )}
        {projects && projects.length > 0 && (
          <div className="a-list">
            {projects.map((p, i) => (
              <div key={p.id} className="a-list-item">
                {p.images[0] ? <img src={p.images[0]} alt="" /> : <div className="ph"><i className="fas fa-image"></i></div>}
                <div className="grow">
                  <b>{p.title.uz}</b>
                  <span>
                    {[p.location.uz, p.year].filter(Boolean).join(' · ')}
                  </span>
                  <div className="a-chips" style={{ marginTop: 6 }}>
                    <span className={`a-badge ${p.images.length ? 'blue' : 'warn'}`}><i className="fas fa-images"></i> {p.images.length} ta rasm</span>
                    <span className="a-badge"><i className="fas fa-cube"></i> {p.productCodes.length} ta mahsulot</span>
                  </div>
                </div>
                <div className="a-row-actions">
                  <button onClick={() => move(i, -1)} disabled={i === 0 || busy !== null} className="a-btn a-btn-sm a-btn-ghost a-icon-btn" title="Yuqoriga"><i className="fas fa-arrow-up"></i></button>
                  <button onClick={() => move(i, 1)} disabled={i === projects.length - 1 || busy !== null} className="a-btn a-btn-sm a-btn-ghost a-icon-btn" title="Pastga"><i className="fas fa-arrow-down"></i></button>
                  <Link href={`/admin/projects/${p.id}/edit`} className="a-btn a-btn-sm"><i className="fas fa-pen"></i> Tahrirlash</Link>
                  <button onClick={() => handleDelete(p)} disabled={busy === p.id} className="a-btn a-btn-sm a-btn-danger a-icon-btn" title="O'chirish">
                    <i className={`fas ${busy === p.id ? 'fa-spinner fa-spin' : 'fa-trash-alt'}`}></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
