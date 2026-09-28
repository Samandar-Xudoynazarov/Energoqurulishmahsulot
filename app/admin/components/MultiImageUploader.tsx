"use client";

import { useState } from 'react';
import { uploadFile } from '../lib/upload';

interface Props {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  hint?: string;
  coverLabel?: string | false;
}

export default function MultiImageUploader({ label, value, onChange, hint, coverLabel = 'Muqova' }: Props) {
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState('');

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;
    setError('');
    setUploading(files.length);
    const urls: string[] = [];
    // Ketma-ket yuklaymiz — tartib saqlanadi va server ortiqcha yuklanmaydi
    for (const f of files) {
      try {
        urls.push(await uploadFile(f, 'image'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Yuklashda xatolik yuz berdi');
      }
      setUploading((n) => n - 1);
    }
    onChange([...value, ...urls]);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="a-field">
      <label>{label}</label>
      <p className="a-hint">{hint ?? "Birinchi rasm — muqova. Tartibni ← → tugmalari bilan o'zgartiring."}</p>
      {value.length > 0 && (
        <div className="a-gallery">
          {value.map((url, i) => (
            <div key={url} className={`a-gallery-item${i === 0 && coverLabel ? ' cover' : ''}`}>
              {i === 0 && coverLabel && <span className="tag">{coverLabel}</span>}
              <img src={url} alt="" />
              <div className="bar">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Chapga">←</button>
                <button type="button" className="del" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="O'chirish">✕</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="O'ngga">→</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="a-actions">
        <span className="a-btn a-btn-sm a-file-btn">
          <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-images'}`}></i>
          {uploading > 0 ? `Yuklanmoqda... (${uploading} ta qoldi)` : "Rasmlar qo'shish"}
          <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading > 0} />
        </span>
        <span className="a-hint">{value.length} ta rasm</span>
      </div>
      {error && <span className="a-field-warn">{error}</span>}
    </div>
  );
}
