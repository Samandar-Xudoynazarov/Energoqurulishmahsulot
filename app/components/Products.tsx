"use client";

import { Product, Category, Language } from '../types';
import { productUrl } from '../lib/product-utils';

interface ProductsProps {
  t: (key: string) => string;
  currentLang: Language;
  openModal: (key: string) => void;
  products: Product[];
  categories: Category[];
}

const CATEGORY_ICON: Record<string, string> = {
  fundament: 'fa-cubes',
  tayanch: 'fa-columns',
  lotok: 'fa-water',
  plita: 'fa-border-all',
  maxsus: 'fa-cog',
};

function iconFor(categoryId: string): string {
  return CATEGORY_ICON[categoryId] || 'fa-cog';
}

export default function Products({ t, currentLang, openModal, products, categories }: ProductsProps) {
  const visibleCategories = categories
    .filter((c) => c.id !== 'jamoa')
    .sort((a, b) => a.order - b.order);

  return (
    <section id="products" className="container">
      <h2 className="section-title">{t('products_title')}</h2>
      <p className="section-subtitle">{t('products_subtitle')}</p>

      {visibleCategories.map((cat) => {
        const items = products
          .filter((p) => p.category === cat.id)
          .sort((a, b) => a.order - b.order);
        if (items.length === 0) return null;

        return (
          <div key={cat.id} className="product-category">
            <h3>
              <i className="fas fa-arrow-right" style={{ color: 'var(--accent)', marginRight: 10 }}></i>
              {cat.name[currentLang] || cat.name.uz}
            </h3>
            <div className="product-grid">
              {items.map((item) => (
                <a
                  key={item.code}
                  href={productUrl(currentLang, item.code)}
                  className="product-item"
                  title={item.name[currentLang] || item.name.uz}
                  onClick={(e) => {
                    // Oddiy bosishda modal ochiladi; Ctrl/Cmd+bosish yoki qidiruv botlari — alohida sahifaga
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    openModal(item.code);
                  }}
                >
                  <div className="p-icon"><i className={`fas ${iconFor(item.category)}`}></i></div>
                  <div className="p-name">{item.code}</div>
                </a>
              ))}
            </div>
            {cat.id === 'tayanch' && (
              <p style={{ marginTop: 10, color: 'var(--gray-text)' }}>
                <i className="fas fa-check-circle" style={{ color: 'var(--accent)' }}></i> {t('poles_note')}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
