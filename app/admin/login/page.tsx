"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Xatolik yuz berdi');
        setLoading(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError("Server bilan bog'lanishda xatolik");
      setLoading(false);
    }
  }

  return (
    <div className="a-login">
      <form onSubmit={handleSubmit}>
        <div className="a-brand-mark">E</div>
        <h1>Boshqaruv paneli</h1>
        <p>ENERGOQURILISHMAHSULOT — kirish uchun parolni kiriting</p>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Parol" autoFocus autoComplete="current-password" />
        {error && <div className="err">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Tekshirilmoqda...' : 'Kirish'}</button>
      </form>
    </div>
  );
}
