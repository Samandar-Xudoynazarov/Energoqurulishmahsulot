"use client";

import { useEffect } from 'react';
import { Language, Product } from '../types';
import { productUrl, realImage, isRealProduct } from '../lib/product-utils';

interface ModalProps {
  modalKey: string | null;
  currentLang: Language;
  onClose: () => void;
  products: Product[];
}

const LABELS: Record<Language, { noData: string; noDesc: string; certificate: string; passport: string; specs: string; openNewTab: string; details: string; quote: string }> = {
  uz: { noData: "Ma'lumot mavjud emas", noDesc: "Bu element uchun batafsil ma'lumot hali qo'shilmagan.", certificate: 'Sertifikat', passport: 'Pasport', specs: 'Texnik xususiyatlar', openNewTab: 'Yangi oynada ochish', details: 'Batafsil sahifa', quote: "Narx so'rash" },
  ru: { noData: 'Информация недоступна', noDesc: 'Подробная информация для этого элемента пока не добавлена.', certificate: 'Сертификат', passport: 'Паспорт', specs: 'Технические характеристики', openNewTab: 'Открыть в новой вкладке', details: 'Подробная страница', quote: 'Запросить цену' },
  en: { noData: 'No data available', noDesc: 'Detailed information for this item has not been added yet.', certificate: 'Certificate', passport: 'Passport', specs: 'Technical specifications', openNewTab: 'Open in new tab', details: 'Full page', quote: 'Request a quote' },
};

export default function Modal({ modalKey, currentLang, onClose, products }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (modalKey) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [modalKey, onClose]);

  if (!modalKey) return null;

  const product = products.find((p) => p.code === modalKey);
  const labels = LABELS[currentLang] || LABELS.uz;

  if (!product) {
    return (
      <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>&times;</button>
          <div className="modal-body" style={{ paddingTop: 34 }}>
            <h3>{labels.noData}</h3>
            <p>{labels.noDesc}</p>
          </div>
        </div>
      </div>
    );
  }

  const title = product.name[currentLang] || product.name.uz;
  const tag = product.tag[currentLang] || product.tag.uz;
  const desc = product.description[currentLang] || product.description.uz;
  const image = realImage(product.image);
  const pageUrl = isRealProduct(product) ? productUrl(currentLang, product.code) : '';

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>

        {image && (
          <div className="modal-image-wrap">
            <img src={image} alt={title} />
          </div>
        )}

        <div className="modal-body" style={!image ? { paddingTop: 34 } : undefined}>
          {tag && <div className="modal-tag">{tag}</div>}
          <h3>{title}</h3>
          {desc && <p>{desc}</p>}

          {pageUrl && (
            <div className="modal-actions">
              <a href={`${pageUrl}#inquiry`} className="btn-accent">
                <i className="fas fa-file-invoice-dollar"></i> {labels.quote}
              </a>
              <a href={pageUrl} className="btn-outline">
                {labels.details} <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          )}

          {product.specs.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>{labels.specs}</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {product.specs.map((spec) => (
                    <tr key={spec.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '0.5rem 0', color: '#556', fontWeight: 600 }}>
                        {spec.label[currentLang] || spec.label.uz}
                      </td>
                      <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(product.certificatePdf || product.passportPdf) && (
            <div className="modal-docs">
              {product.certificatePdf && (
                <div className="modal-doc-card">
                  <div className="modal-doc-header">
                    <div className="modal-doc-title">
                      <i className="fas fa-file-pdf"></i>
                      {labels.certificate}
                    </div>
                    <a
                      className="modal-doc-open"
                      href={product.certificatePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-arrow-up-right-from-square"></i>
                      {labels.openNewTab}
                    </a>
                  </div>
                  <iframe
                    src={product.certificatePdf}
                    title={`${title} - ${labels.certificate}`}
                  />
                </div>
              )}

              {product.passportPdf && (
                <div className="modal-doc-card">
                  <div className="modal-doc-header">
                    <div className="modal-doc-title">
                      <i className="fas fa-file-pdf"></i>
                      {labels.passport}
                    </div>
                    <a
                      className="modal-doc-open"
                      href={product.passportPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-arrow-up-right-from-square"></i>
                      {labels.openNewTab}
                    </a>
                  </div>
                  <iframe
                    src={product.passportPdf}
                    title={`${title} - ${labels.passport}`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
