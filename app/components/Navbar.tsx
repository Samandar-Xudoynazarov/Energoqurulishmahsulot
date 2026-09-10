"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Language } from '../types';

interface NavbarProps {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export default function Navbar({ currentLang, setLanguage, t }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '#about', key: 'nav_about' },
    { href: '#products', key: 'nav_products' },
    { href: '#process', key: 'nav_process' },
    { href: '#certificates', key: 'nav_cert' },
    { href: '#projects', key: 'nav_projects' },
    { href: '#contact', key: 'nav_contact' },
  ];

  const languages: Language[] = ['uz', 'ru', 'en'];
  const langLabels: Record<Language, string> = { uz: "O‘z", ru: "Ру", en: "En" };

  return (
    <nav>
      <div className="container">
        <Link href="/" className="logo">
          <Image src="/logo.png" alt="EQM logo" width={44} height={44} priority />
        </Link>
        <button 
          className="nav-toggle" 
          aria-label="Menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span></span><span></span><span></span>
        </button>
        <ul className={`nav-links${mobileOpen ? ' active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.key}>
              <a href={item.href} onClick={() => setMobileOpen(false)}>{t(item.key)}</a>
            </li>
          ))}
          <li className="lang-switch">
            {languages.map((lang) => (
              <Link
                key={lang}
                href={`/${lang}`}
                hrefLang={lang}
                className={`lang-btn${currentLang === lang ? ' active' : ''}`}
                onClick={() => setLanguage(lang)}
              >
                {langLabels[lang]}
              </Link>
            ))}
          </li>
        </ul>
      </div>
    </nav>
  );
}
