import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--accent)' }}>404</div>
      <p style={{ color: 'var(--gray-text)' }}>Sahifa topilmadi · Страница не найдена · Page not found</p>
      <Link href="/" className="btn-accent">ENERGOQURILISHMAHSULOT</Link>
    </main>
  );
}
