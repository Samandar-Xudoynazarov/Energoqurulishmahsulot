"use client";

import { useEffect, useState } from 'react';
import { Product } from '../types';

export function useProducts(initial: Product[] = []) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [loading, setLoading] = useState(initial.length === 0);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setProducts(data.products || []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}
