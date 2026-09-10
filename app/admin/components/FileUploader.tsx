"use client";

import { useState } from 'react';
import { compressImage } from '../../lib/compress-image';

interface FileUploaderProps {
  label: string;
  kind: 'image' | 'pdf';
  value?: string;
  onUploaded: (url: string) => void;
}

export default function FileUploader({ label, kind, value, onUploaded }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const toUpload = kind === 'image' ? await compressImage(file) : file;
      const formData = new FormData();
      formData.append('file', toUpload);
      formData.append('kind', kind);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Yuklashda xatolik');
        return;
      }
      onUploaded(data.url);
    } catch {
      setError('Yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>{label}</label>
      {value && kind === 'image' && (
        <img src={value} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: '0.5rem', display: 'block' }} />
      )}
      {value && kind === 'pdf' && (
        <a href={value} target="_blank" rel="noreferrer" style={{ display: 'block', marginBottom: '0.5rem', color: '#1a3f62' }}>
          📄 Joriy PDF faylni ko'rish
        </a>
      )}
      <input
        type="file"
        accept={kind === 'image' ? 'image/*' : 'application/pdf'}
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p style={{ fontSize: '0.85rem', color: '#667' }}>Yuklanmoqda...</p>}
      {error && <p style={{ fontSize: '0.85rem', color: '#c0392b' }}>{error}</p>}
    </div>
  );
}
