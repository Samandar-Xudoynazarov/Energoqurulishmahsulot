"use client";

import { useEffect, useState } from 'react';
import { Language, Project, Product } from '../types';
import { productUrl, realImage } from '../lib/product-utils';

interface ProjectsProps {
  t: (key: string) => string;
  currentLang: Language;
  projects: Project[];
  products: Product[];
}

export function ProjectCard({ project, lang, onOpen }: { project: Project; lang: Language; onOpen: () => void }) {
  const cover = realImage(project.images[0]);
  const title = project.title[lang] || project.title.uz;
  const location = project.location[lang] || project.location.uz;
  return (
    <button type="button" className="project-card" onClick={onOpen}>
      <div className="project-card-img">
        {cover ? <img src={cover} alt={title} loading="lazy" /> : <i className="fas fa-industry"></i>}
        {project.images.length > 1 && (
          <span className="project-card-count"><i className="fas fa-images"></i> {project.images.length}</span>
        )}
      </div>
      <div className="project-card-body">
        <h4>{title}</h4>
        {(location || project.year) && (
          <p className="project-card-meta">
            {location && <><i className="fas fa-map-marker-alt"></i> {location}</>}
            {location && project.year && ' · '}
            {project.year}
          </p>
        )}
        {project.productCodes.length > 0 && (
          <div className="project-card-tags">
            {project.productCodes.slice(0, 4).map((c) => <span key={c}>{c}</span>)}
            {project.productCodes.length > 4 && <span>+{project.productCodes.length - 4}</span>}
          </div>
        )}
      </div>
    </button>
  );
}

export function ProjectModal({
  project, lang, t, products, onClose,
}: { project: Project; lang: Language; t: (k: string) => string; products: Product[]; onClose: () => void }) {
  const [active, setActive] = useState(0);
  const images = project.images.map(realImage).filter(Boolean);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActive((i) => (images.length ? (i + 1) % images.length : 0));
      if (e.key === 'ArrowLeft') setActive((i) => (images.length ? (i - 1 + images.length) % images.length : 0));
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, images.length]);

  const title = project.title[lang] || project.title.uz;
  const location = project.location[lang] || project.location.uz;
  const desc = project.description[lang] || project.description.uz;
  const knownCodes = new Set(products.map((p) => p.code));

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content project-modal">
        <button className="modal-close" onClick={onClose} aria-label={t('project_close')}>&times;</button>
        {images.length > 0 && (
          <div className="project-gallery">
            <div className="project-gallery-main">
              <img src={images[active]} alt={`${title} — ${active + 1}`} />
              {images.length > 1 && (
                <>
                  <button type="button" className="pg-nav pg-prev" aria-label="Prev" onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button type="button" className="pg-nav pg-next" aria-label="Next" onClick={() => setActive((i) => (i + 1) % images.length)}>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="project-gallery-thumbs">
                {images.map((src, i) => (
                  <button type="button" key={src} className={i === active ? 'active' : ''} onClick={() => setActive(i)}>
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="modal-body" style={images.length === 0 ? { paddingTop: 34 } : undefined}>
          {(location || project.year) && (
            <div className="modal-tag">{[location, project.year].filter(Boolean).join(' · ')}</div>
          )}
          <h3>{title}</h3>
          {desc && <p style={{ whiteSpace: 'pre-line' }}>{desc}</p>}
          {project.productCodes.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <h4 style={{ marginBottom: '0.6rem' }}>{t('project_products')}</h4>
              <div className="project-card-tags">
                {project.productCodes.map((c) =>
                  knownCodes.has(c) ? (
                    <a key={c} href={productUrl(lang, c)}>{c}</a>
                  ) : (
                    <span key={c}>{c}</span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects({ t, currentLang, projects, products }: ProjectsProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = projects.find((p) => p.id === openId);

  return (
    <section id="projects" className="bg-light">
      <div className="container">
        <h2 className="section-title">{t('projects_title')}</h2>
        <p className="section-subtitle">{t('projects_subtitle')}</p>
        {projects.length === 0 ? (
          <div className="project-placeholder">{t('projects_placeholder')}</div>
        ) : (
          <div className="project-grid">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} lang={currentLang} onOpen={() => setOpenId(p.id)} />
            ))}
          </div>
        )}
        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--gray-text)' }}>
          <i className="fas fa-check-circle" style={{ color: 'var(--accent)' }}></i> {t('projects_note')}
        </p>
      </div>
      {open && (
        <ProjectModal project={open} lang={currentLang} t={t} products={products} onClose={() => setOpenId(null)} />
      )}
    </section>
  );
}
