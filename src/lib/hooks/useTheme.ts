'use client';

import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const htmlTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
    setTheme(savedTheme || htmlTheme || 'light');
  }, []);

  if (!mounted) return 'light';
  return theme;
}
