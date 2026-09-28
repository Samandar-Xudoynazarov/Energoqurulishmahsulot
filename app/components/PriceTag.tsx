"use client";

import { Product } from '../types';
import { formatPrice, hasPrice, priceFrom } from '../lib/product-utils';

interface Props {
  product: Product;
  t: (key: string) => string;
  size?: 'lg' | 'sm';
}

/** Narx — «...dan / от ...», 1 dona uchun */
export default function PriceTag({ product, t, size = 'lg' }: Props) {
  if (!hasPrice(product)) {
    return (
      <div className={`price-tag price-${size} price-none`}>
        <span className="price-value">{t('price_on_request')}</span>
      </div>
    );
  }
  return (
    <div className={`price-tag price-${size}`}>
      <span className="price-value">
        {priceFrom(t) && <span className="price-from">{priceFrom(t)}</span>}
        {formatPrice(product.price)} <small>{t('price_currency_from')}</small>
      </span>
      <span className="price-note">{t('price_per_unit')}</span>
    </div>
  );
}
