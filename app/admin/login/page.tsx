"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      setError('Server bilan bog\'lanishda xatolik');
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Admin panel</h1>
        <p style={styles.subtitle}>Kirish uchun parolni kiriting</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parol"
          autoFocus
          style={styles.input}
        />
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Tekshirilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f1e2e',
    fontFamily: 'Inter, sans-serif',
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '2.5rem',
    width: '100%',
    maxWidth: 360,
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
  },
  title: { margin: 0, fontSize: '1.5rem', color: '#0f1e2e' },
  subtitle: { margin: '0.4rem 0 1.5rem', color: '#667', fontSize: '0.9rem' },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: '1rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
  },
  error: { color: '#c0392b', fontSize: '0.85rem', marginBottom: '1rem' },
  button: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 8,
    border: 'none',
    background: '#1a3f62',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
