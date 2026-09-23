"use client";

import { CSSProperties } from 'react';

/** Rasmda suv belgisi yopishtirilganmi (admin panel orqali yangi yuklangan rasmlar) */
export function hasBakedWatermark(src: string): boolean {
  return /-wm\.[a-z0-9]+(\?|$)/i.test(src);
}

interface Props {
  src: string;
  alt: string;
  className?: string;
  imgStyle?: CSSProperties;
  loading?: 'lazy' | 'eager';
}

/**
 * Rasmni nusxalashni qiyinlashtiradi:
 * - o'ng tugma / sudrab olish / uzoq bosish o'chirilgan, rasm ustida shaffof qatlam bor;
 * - eski (suv belgisisiz) rasmlar ustida markazda xira logo ko'rsatiladi.
 * Eslatma: skrinshotdan to'liq himoya qilishning imkoni yo'q — shuning uchun asosiy himoya
 * yuklashda rasmga "yopishtiriladigan" logo (compress-image.ts).
 */
export default function ProtectedImage({ src, alt, className, imgStyle, loading }: Props) {
  const showOverlayLogo = !hasBakedWatermark(src);
  return (
    <div
      className={`protected-img${className ? ` ${className}` : ''}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <img src={src} alt={alt} draggable={false} loading={loading} style={imgStyle} />
      <div className="protected-img-shield" aria-hidden="true">
        {showOverlayLogo && <span className="protected-img-logo" />}
      </div>
    </div>
  );
}
