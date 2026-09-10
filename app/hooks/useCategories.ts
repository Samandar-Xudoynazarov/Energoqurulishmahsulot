"use client";

import { useEffect, useState } from 'react';
import { Category } from '../types';

export function useCategories(initial: Category[] = []) {
  const [categories, setCategories] = useState<Category[]>(initial);
  const [loading, setLoading] = useState(initial.length === 0);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCategories(data.categories || []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading };
}
