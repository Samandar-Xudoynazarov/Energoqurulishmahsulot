"use client";

import { useState } from 'react';
import { compressImage } from '../../lib/compress-image';

interface Props {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function MultiImageUploader({ label, value, onChange }: Props) {
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState('');

  async function uploadOne(file: File): Promise<string | null> {
    const toUpload = await compressImage(file);
    const formData = new FormData();
    formData.append('file', toUpload);
    formData.append('kind', 'image');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Yuklashda xatolik');
      return null;
    }
    return data.url as string;
  }

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
        const url = await uploadOne(f);
        if (url) urls.push(url);
      } catch {
        setError('Yuklashda xatolik yuz berdi');
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
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>{label}</label>
      <p style={{ fontSize: '0.8rem', color: '#889', margin: '0 0 0.6rem' }}>
        Birinchi rasm — muqova. Tartibni ← → tugmalari bilan o'zgartiring.
      </p>
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
          {value.map((url, i) => (
            <div key={url} style={{ position: 'relative', width: 120 }}>
              <img
                src={url}
                alt=""
                style={{
                  width: 120, height: 90, objectFit: 'cover', borderRadius: 8, display: 'block',
                  outline: i === 0 ? '3px solid #f4a51c' : 'none',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} style={miniBtn}>←</button>
                <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} style={{ ...miniBtn, color: '#c0392b' }}>✕</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} style={miniBtn}>→</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading > 0} />
      {uploading > 0 && <p style={{ fontSize: '0.85rem', color: '#667' }}>Yuklanmoqda... ({uploading} ta qoldi)</p>}
      {error && <p style={{ fontSize: '0.85rem', color: '#c0392b' }}>{error}</p>}
    </div>
  );
}

const miniBtn: React.CSSProperties = {
  background: '#eee', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '2px 8px', fontSize: '0.8rem',
};
