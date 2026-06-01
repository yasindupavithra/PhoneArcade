import React, { useState, useEffect } from 'react';
import { shopDetails } from '../constants';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useHeroSlides, BRAND_QUICK_LINKS } from '../hooks/useHeroSlides';

const SLIDE_MS = 5000;

const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const Hero = () => {
  const { slides, loading } = useHeroSlides();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides.length;

  useEffect(() => {
    if (current >= count) setCurrent(0);
  }, [count, current]);

  useEffect(() => {
    if (paused || count <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [paused, count]);

  const go = (dir) => {
    setCurrent((prev) => {
      if (dir === 'next') return (prev + 1) % count;
      return prev === 0 ? count - 1 : prev - 1;
    });
  };

  return (
    <section className="relative bg-secondary overflow-hidden">
      {/* Hero slider — full width, tall */}
      <div className="relative w-full min-h-[min(72vh,720px)] md:min-h-[min(78vh,820px)] lg:min-h-[min(82vh,900px)]">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-[#001a3d] to-[#003366]" />

        <AnimatePresence mode="wait">
          {!loading && slides[current] && (
            <motion.div
              key={slides[current]}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img
                src={slides[current]}
                alt={`Promotion ${current + 1}`}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Overlays for depth & text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-secondary/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/50 via-transparent to-secondary/50 pointer-events-none" />

        {/* Controls */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go('prev')}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-primary hover:border-primary transition-all hidden sm:flex items-center justify-center"
              aria-label="Previous slide"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              type="button"
              onClick={() => go('next')}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-primary hover:border-primary transition-all hidden sm:flex items-center justify-center"
              aria-label="Next slide"
            >
              <ChevronRight size={28} />
            </button>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2.5 rounded-full bg-black/30 backdrop-blur text-white hover:bg-primary transition-colors"
              aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
            >
              {paused ? <Play size={18} /> : <Pause size={18} />}
            </button>
          </>
        )}

        {/* Dots + counter */}
        {count > 1 && (
          <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {slides.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={`rounded-full transition-all duration-300 ${
                    current === index
                      ? 'w-10 h-2 bg-primary shadow-lg shadow-primary/50'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
              {current + 1} / {count}
            </span>
          </div>
        )}

        {/* Bottom content: brands + CTAs (no search on slider) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 md:pb-10 pt-16 bg-gradient-to-t from-secondary via-secondary/95 to-transparent">
          <div className="container">
            <p className="text-center text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-primary mb-4">
              Shop by brand
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 max-w-5xl mx-auto">
              {BRAND_QUICK_LINKS.map(({ label, query }) => (
                <Link
                  key={label}
                  to={`/shop?q=${encodeURIComponent(query)}`}
                  className="px-4 py-2.5 md:px-5 md:py-3 text-[11px] md:text-xs font-black uppercase tracking-wider rounded-xl bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-primary hover:border-primary hover:scale-105 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 md:gap-4">
              <Link to="/shop" className="btn-primary text-center justify-center min-w-[160px]">
                Shop All Phones
              </Link>
              <Link to="/brands" className="btn-outline text-center justify-center min-w-[160px] !border-white/40">
                All Brands
              </Link>
              <div className="flex items-stretch gap-3 w-full sm:w-auto justify-center">
                <a
                  href={`https://wa.me/${shopDetails.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 min-w-[140px] px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider bg-[#25D366] text-white hover:brightness-110 shadow-lg transition-all"
                >
                  WhatsApp
                </a>
                <a
                  href={shopDetails.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  title="Phone Arcade on Facebook"
                  className="inline-flex items-center justify-center gap-2 min-w-[56px] sm:min-w-[64px] px-5 py-4 rounded-full bg-[#1877F2] text-white hover:brightness-110 shadow-lg transition-all"
                  aria-label="Facebook"
                >
                  <FacebookIcon size={22} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
