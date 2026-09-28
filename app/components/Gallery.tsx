"use client";

import { useEffect, useState } from 'react';
import ProtectedImage from './ProtectedImage';

/** Rasm galereyasi: katta rasm, oldinga/orqaga, kichik rasmlar (← → tugmalari ham ishlaydi) */
export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length]);
  if (images.length === 0) return null;
  const cur = images[Math.min(active, images.length - 1)];
  return (
    <div className="project-gallery">
      <div className="project-gallery-main">
        <ProtectedImage src={cur} alt={`${title} — ${active + 1}`} />
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
              <img src={src} alt="" loading="lazy" draggable={false} onContextMenu={(e) => e.preventDefault()} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
