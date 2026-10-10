"use client";
import { useState } from 'react';

import { Product, Category, Language } from '../types';
import { productUrl, hasPrice, formatPrice, priceFrom, mainImage } from '../lib/product-utils';

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
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const labels = {
    uz: { all: 'Barcha mahsulotlar', search: 'Mahsulot nomi yoki kodini qidiring', empty: 'Mos mahsulot topilmadi', view: 'Batafsil', count: 'mahsulot' },
    ru: { all: 'Все изделия', search: 'Поиск по названию или марке', empty: 'Изделия не найдены', view: 'Подробнее', count: 'изделий' },
    en: { all: 'All products', search: 'Search by name or product code', empty: 'No matching products', view: 'View details', count: 'products' },
  }[currentLang];
  const matched = products.filter(p => p.category !== 'jamoa' && (category === 'all' || p.category === category) && `${p.code} ${p.name[currentLang]}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim()));
  const visibleCategories = categories
    .filter((c) => c.id !== 'jamoa')
    .sort((a, b) => a.order - b.order);

  return (
    <section id="products" className="container">
      <h2 className="section-title">{t('products_title')}</h2>
      <p className="section-subtitle">{t('products_subtitle')}</p>
      <div className="catalog-toolbar">
        <label className="catalog-search"><i className="fas fa-search" aria-hidden="true" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={labels.search} aria-label={labels.search} type="search" /></label>
        <span className="catalog-count" aria-live="polite">{matched.length} {labels.count}</span>
      </div>
      <div className="catalog-filters" aria-label={labels.all}>
        <button type="button" className={category === 'all' ? 'active' : ''} aria-pressed={category === 'all'} onClick={() => setCategory('all')}>{labels.all}</button>
        {visibleCategories.map(cat => <button key={cat.id} type="button" className={category === cat.id ? 'active' : ''} aria-pressed={category === cat.id} onClick={() => setCategory(cat.id)}>{cat.name[currentLang] || cat.name.uz}</button>)}
      </div>
      {matched.length === 0 && <p className="catalog-empty">{labels.empty}</p>}

      {visibleCategories.map((cat) => {
        const items = matched
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
                  <div className="catalog-card-image">{mainImage(item) ? <img src={mainImage(item)} alt={item.name[currentLang] || item.code} loading="lazy" /> : <div className="p-icon"><i className={`fas ${iconFor(item.category)}`}></i></div>}</div>
                  <div className="p-name">{item.code}</div>
                  <div className="catalog-card-name">{item.name[currentLang] || item.name.uz}</div>
                  <div className="catalog-card-dimensions">{item.specs.find(s => s.id === 'olcham')?.value}</div>
                  {hasPrice(item) && <div className="p-price">{priceFrom(t) && <>{priceFrom(t)} </>}{formatPrice(item.price)} <small>{t('price_currency_from')}</small></div>}
                  <span className="catalog-card-link">{labels.view} <i className="fas fa-arrow-right" aria-hidden="true" /></span>
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
