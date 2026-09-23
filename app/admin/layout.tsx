"use client";

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/admin', label: 'Mahsulotlar' },
  { href: '/admin/categories', label: 'Kategoriyalar' },
  { href: '/admin/projects', label: 'Loyihalar' },
  { href: '/admin/settings', label: 'Sozlamalar' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8', fontFamily: 'Inter, sans-serif' }}>
      <header style={{
        background: '#0f1e2e', color: '#fff', padding: '1rem 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem' }}>
            ENERGOQURILISHMAHSULOT — Admin
          </Link>
          <nav style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
            {NAV.map((item) => {
              const active = item.href === '/admin'
                ? pathname === '/admin' || pathname.startsWith('/admin/products')
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    color: active ? '#f4a51c' : 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent', border: '1px solid #fff', color: '#fff',
            padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer',
          }}
        >
          Chiqish
        </button>
      </header>
      <main style={{ padding: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
