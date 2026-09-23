"use client";

import { useState } from 'react';
import { Category, Language, Product, Project, SiteSettings } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { productSlug, productUrl, realImage } from '../lib/product-utils';
import Navbar from './Navbar';
import Footer from './Footer';
import InquiryForm from './InquiryForm';
import FloatingContact from './FloatingContact';
import { ProjectCard, ProjectModal } from './Projects';
import { telHref } from './Contact';

interface Props {
  locale: Language;
  product: Product;
  category?: Category;
  related: Product[];
  projects: Project[];
  products: Product[];
  settings: SiteSettings;
}

export default function ProductPageView({ locale, product, category, related, projects, products, settings }: Props) {
  const { currentLang, setLanguage, t } = useLanguage(locale);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const lang = currentLang;
  const slug = productSlug(product.code);

  const name = product.name[lang] || product.name.uz;
  const tag = product.tag[lang] || product.tag.uz;
  const desc = product.description[lang] || product.description.uz;
  const image = realImage(product.image);
  const catName = category ? category.name[lang] || category.name.uz : '';

  return (
    <>
      <Navbar
        currentLang={lang}
        setLanguage={setLanguage}
        t={t}
        basePath={`/${lang}`}
        langHref={(l) => `/${l}/products/${slug}`}
      />

      <main className="product-page">
        <div className="container">
          <div className="breadcrumbs" role="navigation" aria-label="breadcrumb">
            <a href={`/${lang}`}>{t('nav_home')}</a>
            <i className="fas fa-chevron-right"></i>
            <a href={`/${lang}#products`}>{catName || t('product_all')}</a>
            <i className="fas fa-chevron-right"></i>
            <span>{product.code}</span>
          </div>

          <div className="pp-hero">
            <div className="pp-image">
              {image ? <img src={image} alt={`${product.code} — ${name}`} /> : (
                <div className="pp-image-empty"><i className="fas fa-cubes"></i><span>{product.code}</span></div>
              )}
            </div>
            <div className="pp-info">
              {tag && <div className="modal-tag">{tag}</div>}
              <h1><span className="pp-code">{product.code}</span> {name !== product.code && <span className="pp-name">{name}</span>}</h1>
              <p className="pp-desc">{desc || t('product_no_desc')}</p>

              <dl className="pp-facts">
                <div><dt>{t('product_code')}</dt><dd>{product.code}</dd></div>
                {catName && <div><dt>{t('product_category')}</dt><dd>{catName}</dd></div>}
              </dl>

              <div className="pp-cta">
                <a href="#inquiry" className="btn-accent"><i className="fas fa-file-invoice-dollar"></i> {t('product_request_price')}</a>
                {settings.phone && (
                  <a href={telHref(settings.phone)} className="btn-outline"><i className="fas fa-phone-alt"></i> {settings.phone}</a>
                )}
              </div>
            </div>
          </div>

          {product.specs.length > 0 && (
            <section className="pp-section">
              <h2>{t('product_specs')}</h2>
              <table className="pp-specs">
                <tbody>
                  {product.specs.map((s) => (
                    <tr key={s.id}>
                      <th scope="row">{s.label[lang] || s.label.uz}</th>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {(product.certificatePdf || product.passportPdf) && (
            <section className="pp-section">
              <h2>{t('product_docs')}</h2>
              <div className="pp-docs">
                {product.certificatePdf && (
                  <a href={product.certificatePdf} target="_blank" rel="noopener noreferrer" className="pp-doc">
                    <i className="fas fa-file-pdf"></i> {t('product_certificate')} <i className="fas fa-arrow-up-right-from-square pp-doc-ext"></i>
                  </a>
                )}
                {product.passportPdf && (
                  <a href={product.passportPdf} target="_blank" rel="noopener noreferrer" className="pp-doc">
                    <i className="fas fa-file-pdf"></i> {t('product_passport')} <i className="fas fa-arrow-up-right-from-square pp-doc-ext"></i>
                  </a>
                )}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="pp-section">
              <h2>{t('product_projects')}</h2>
              <div className="project-grid">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} lang={lang} onOpen={() => setOpenProject(p)} />
                ))}
              </div>
            </section>
          )}

          <section className="pp-section pp-inquiry" id="inquiry">
            <div>
              <h2>{t('product_inquiry_title')}</h2>
              <p>{t('product_inquiry_subtitle')}</p>
            </div>
            <div className="contact-form">
              <InquiryForm t={t} locale={lang} productCode={product.code} />
            </div>
          </section>

          {related.length > 0 && (
            <section className="pp-section">
              <h2>{t('product_related')}</h2>
              <div className="product-grid">
                {related.map((r) => (
                  <a key={r.code} href={productUrl(lang, r.code)} className="product-item" title={r.name[lang] || r.name.uz}>
                    <div className="p-icon"><i className="fas fa-cube"></i></div>
                    <div className="p-name">{r.code}</div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer t={t} />
      <FloatingContact settings={settings} t={t} />
      {openProject && (
        <ProjectModal project={openProject} lang={lang} t={t} products={products} onClose={() => setOpenProject(null)} />
      )}
    </>
  );
}
