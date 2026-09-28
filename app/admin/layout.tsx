"use client";

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './admin.css';

const NAV = [
  { group: 'Katalog' },
  { href: '/admin', label: 'Mahsulotlar', icon: 'fa-cubes', match: (p: string) => p === '/admin' || p.startsWith('/admin/products') },
  { href: '/admin/categories', label: 'Kategoriyalar', icon: 'fa-layer-group' },
  { group: 'Sayt' },
  { href: '/admin/content', label: "Sayt bo'limlari", icon: 'fa-th-large' },
  { href: '/admin/projects', label: 'Loyihalar', icon: 'fa-building' },
  { href: '/admin/settings', label: 'Sozlamalar va rasmlar', icon: 'fa-sliders-h' },
] as const;

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
    <div className="adm">
      <aside className="a-side">
        <Link href="/admin" className="a-brand">
          <span className="a-brand-mark">E</span>
          <span>
            <b>ENERGOQURILISH</b>
            <small>Boshqaruv paneli</small>
          </span>
        </Link>
        <div className="a-nav" role="navigation">
          {NAV.map((item, i) => {
            if ('group' in item) return <div key={i} className="a-nav-label">{item.group}</div>;
            const active = 'match' in item ? item.match(pathname) : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? 'active' : ''}>
                <i className={`fas ${item.icon}`}></i> {item.label}
              </Link>
            );
          })}
        </div>
        <div className="a-side-foot">
          <a href="/" target="_blank" rel="noreferrer">
            <i className="fas fa-external-link-alt"></i> <span>Saytni ochish</span>
          </a>
          <button type="button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> <span>Chiqish</span>
          </button>
        </div>
      </aside>
      <main className="a-main">
        <div className="a-container">{children}</div>
      </main>
    </div>
  );
}
