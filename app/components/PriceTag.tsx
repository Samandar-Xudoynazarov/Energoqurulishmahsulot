"use client";

import { Product } from '../types';
import { formatPrice, hasPrice } from '../lib/product-utils';

interface Props {
  product: Product;
  t: (key: string) => string;
  size?: 'lg' | 'sm';
}

/** Narx — QQSsiz, 1 dona uchun */
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
        {formatPrice(product.price)} <small>{t('price_currency')}</small>
      </span>
      <span className="price-note">
        <b>{t('price_no_vat')}</b> · {t('price_per_unit')}
      </span>
    </div>
  );
}
