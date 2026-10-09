"use client";

import { useState } from 'react';
import { Product } from '../types';
import { productImages, ProductImageKind } from '../lib/product-utils';
import ProtectedImage from './ProtectedImage';

const ICON: Record<ProductImageKind, string> = { photo: 'fa-camera', '3d': 'fa-cube', drawing: 'fa-ruler-combined' };
const LABEL_KEY: Record<ProductImageKind, string> = { photo: 'img_photo', '3d': 'img_3d', drawing: 'img_drawing' };

/** Mahsulot sahifasidagi rasm: real surat / 3D / chizma — tugmalar bilan almashtiriladi */
export default function ProductGallery({ product, alt, t }: { product: Product; alt: string; t: (k: string) => string }) {
  const images = productImages(product);
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="pp-gallery">
      <div className={`pp-image${current && current.kind !== 'photo' ? ' pp-image-contain' : ''}`}>
        {current ? (
          <ProtectedImage key={current.src} src={current.src} alt={`${alt} — ${t(LABEL_KEY[current.kind])}`} />
        ) : (
          <div className="pp-image-empty"><i className="fas fa-cubes"></i><span>{product.code}</span></div>
        )}
      </div>
      {images.length > 1 && (
        <div className="pp-thumbs" role="tablist">
          {images.map((img, i) => (
            <button
              key={img.kind}
              type="button"
              role="tab"
              aria-selected={img === current}
              className={`pp-thumb${img === current ? ' active' : ''}`}
              onClick={() => setActive(i)}
            >
              <span className="pp-thumb-img"><img src={img.src} alt="" draggable={false} loading="lazy" /></span>
              <span className="pp-thumb-label"><i className={`fas ${ICON[img.kind]}`}></i> {t(LABEL_KEY[img.kind])}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
