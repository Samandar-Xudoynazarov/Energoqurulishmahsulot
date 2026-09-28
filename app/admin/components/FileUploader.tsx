"use client";

import { useState } from 'react';
import { uploadFile } from '../lib/upload';

interface FileUploaderProps {
  label: string;
  kind: 'image' | 'pdf';
  value?: string;
  onUploaded: (url: string) => void;
  /** Berilsa — "Olib tashlash" tugmasi ko'rinadi */
  onRemove?: () => void;
  hint?: string;
  wide?: boolean;
}

export default function FileUploader({ label, kind, value, onUploaded, onRemove, hint, wide }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const url = await uploadFile(file, kind);
      onUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="a-field">
      <label>{label}</label>
      <div className={`a-upload${value ? ' has' : ''}${wide ? ' wide' : ''}`}>
        <div className="a-upload-prev">
          {value && kind === 'image' ? <img src={value} alt="" /> : <i className={`fas ${kind === 'pdf' ? 'fa-file-pdf' : 'fa-image'}`}></i>}
        </div>
        <div className="a-upload-body">
          {value && kind === 'pdf' && (
            <a href={value} target="_blank" rel="noreferrer" className="a-hint"><i className="fas fa-external-link-alt"></i> Joriy PDF faylni ko&apos;rish</a>
          )}
          {!value && <span className="a-hint">{hint || (kind === 'image' ? 'JPG, PNG yoki WEBP — avtomatik siqiladi' : 'PDF fayl')}</span>}
          <div className="a-actions">
            <span className={`a-btn a-btn-sm a-file-btn${uploading ? ' disabled' : ''}`}>
              <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>
              {uploading ? 'Yuklanmoqda...' : value ? 'Almashtirish' : 'Fayl tanlash'}
              <input type="file" accept={kind === 'image' ? 'image/*' : 'application/pdf'} onChange={handleFileChange} disabled={uploading} />
            </span>
            {value && onRemove && (
              <button type="button" className="a-btn a-btn-sm a-btn-danger" onClick={onRemove}>
                <i className="fas fa-trash-alt"></i> Olib tashlash
              </button>
            )}
          </div>
          {error && <span className="a-field-warn">{error}</span>}
        </div>
      </div>
    </div>
  );
}
