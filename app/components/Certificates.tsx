"use client";

import { useState } from 'react';

interface CertsProps {
  t: (key: string) => string;
}

const DOCS = [
  {
    key: 'cert_doc1',
    file: '/certificates/guvohnoma-royxatga-olish.pdf',
  },
  {
    key: 'cert_doc2',
    file: '/certificates/sertifikat-soatvetstviya.pdf',
  },
];

export default function Certificates({ t }: CertsProps) {
  const [activeDoc, setActiveDoc] = useState<{ file: string; title: string } | null>(null);

  const certs = [
    { icon: 'fa-certificate', key: 'cert1' },
    { icon: 'fa-leaf', key: 'cert2' },
    { icon: 'fa-globe', key: 'cert3' },
  ];

  return (
    <section id="certificates" className="container">
      <h2 className="section-title">{t('cert_title')}</h2>
      <p className="section-subtitle">{t('cert_subtitle')}</p>
      <div className="cert-grid">
        {certs.map((c) => (
          <div key={c.key} className="cert-item">
            <i className={`fas ${c.icon}`}></i>
            <span>{t(c.key)}</span>
          </div>
        ))}
      </div>

      <h3 className="cert-doc-heading">{t('cert_doc_title')}</h3>
      <div className="cert-doc-grid">
        {DOCS.map((doc) => (
          <div key={doc.key} className="cert-doc-card">
            <div className="cert-doc-icon">
              <i className="fas fa-file-pdf"></i>
            </div>
            <div className="cert-doc-info">
              <h4>{t(`${doc.key}_title`)}</h4>
              <p>{t(`${doc.key}_desc`)}</p>
              <div className="cert-doc-actions">
                <button
                  type="button"
                  className="cert-doc-btn cert-doc-btn-primary"
                  onClick={() => setActiveDoc({ file: doc.file, title: t(`${doc.key}_title`) })}
                >
                  <i className="fas fa-eye"></i>
                  {t('cert_doc_view')}
                </button>
                <a href={doc.file} download className="cert-doc-btn cert-doc-btn-secondary">
                  <i className="fas fa-download"></i>
                  {t('cert_doc_download')}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeDoc && (
        <div
          className="modal-overlay active"
          onClick={(e) => { if (e.target === e.currentTarget) setActiveDoc(null); }}
        >
          <div className="modal-content" style={{ maxWidth: 900 }}>
            <button className="modal-close" onClick={() => setActiveDoc(null)}>&times;</button>
            <div className="modal-body" style={{ paddingTop: 34 }}>
              <h3>{activeDoc.title}</h3>
              <div className="modal-docs" style={{ marginTop: '1rem' }}>
                <div className="modal-doc-card">
                  <div className="modal-doc-header">
                    <div className="modal-doc-title">
                      <i className="fas fa-file-pdf"></i>
                      {activeDoc.title}
                    </div>

                      className="modal-doc-open"
                      href={activeDoc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    <a>
                      <i className="fas fa-arrow-up-right-from-square"></i>
                      {t('cert_doc_view')}
                    </a>
                  </div>
                  <iframe src={activeDoc.file} title={activeDoc.title} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}