import { useState, useEffect, useCallback } from 'react';

const FALLBACK_SLIDES = [
  '/assets/1778218580424.png',
  '/assets/Gemini_Generated_Image_l6fncxl6fncxl6fn.png',
];

export { HERO_BRAND_CHIPS as BRAND_QUICK_LINKS } from '../constants/brands';

export function useHeroSlides() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/assets/slider/manifest.json?t=${Date.now()}`);
      if (!res.ok) throw new Error('no manifest');
      const data = await res.json();
      if (Array.isArray(data.images) && data.images.length > 0) {
        setSlides(data.images);
      } else {
        setSlides(FALLBACK_SLIDES);
      }
    } catch {
      setSlides(FALLBACK_SLIDES);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [load]);

  return { slides, loading, refresh: load };
}
