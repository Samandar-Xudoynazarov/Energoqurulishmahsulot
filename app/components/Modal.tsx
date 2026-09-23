"use client";

import { useEffect } from 'react';
import { Language, Product } from '../types';
import { productUrl, realImage, isRealProduct } from '../lib/product-utils';
import ProtectedImage from './ProtectedImage';

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
            <ProtectedImage src={image} alt={title} />
          </div>
        )}

        <div className="modal-body" style={!image ? { paddingTop: 34 } : undefined}>
          {tag && <div className="modal-tag">{tag}</div>}
          <h3>{title}</h3>
          {desc && <p className="modal-desc-clamp">{desc}</p>}

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

        </div>
      </div>
    </div>
  );
}
