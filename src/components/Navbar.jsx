import React, { useState, useEffect } from 'react';
import { Menu, X, User, ShoppingBag, ChevronRight } from 'lucide-react';
import { navLinks } from '../constants';
import { Link } from 'react-router-dom';
import ProductSearch from './ProductSearch';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const announcements = [
    '100% Authentic Products — Official Warranty',
    'PayHere Installments up to 36 months',
    'Islandwide Delivery · Best Prices Guaranteed',
  ];

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className={`header-spacer ${isSticky ? 'is-sticky' : ''}`} aria-hidden />

      <header className={`w-full z-[200] transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 shadow-lg' : 'relative'}`}>
        <div className="announcement-bar py-2.5 relative overflow-hidden">
          <div className="container flex items-center justify-center min-h-[36px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={announcementIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="text-center px-4"
              >
                {announcements[announcementIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className={`bg-white/95 backdrop-blur-md border-b border-border ${isSticky ? 'py-2.5' : 'py-4'}`}>
          <div className="container">
            <div className="flex items-center gap-3 lg:gap-6">
              <Link to="/" className="shrink-0 flex items-center py-0.5">
                <img
                  src="/assets/logo/1778248922397 (1).png"
                  alt="Phone Arcade"
                  className={`object-contain w-auto transition-all duration-300 ${
                    isSticky ? 'h-12 sm:h-14' : 'h-16 sm:h-[4.5rem] md:h-20'
                  }`}
                  style={{ maxWidth: isSticky ? '240px' : '340px', mixBlendMode: 'multiply' }}
                />
              </Link>

              <div className="hidden lg:flex flex-1 max-w-2xl mx-auto px-4">
                <ProductSearch variant="compact" mode="shop" className="w-full" />
              </div>

              <nav className="hidden xl:flex items-center gap-1 shrink-0">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.href} className="nav-link px-3">
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
                <Link
                  to="/login"
                  className="p-2.5 rounded-xl text-secondary hover:bg-slate-100 hover:text-primary"
                  title="Account"
                >
                  <User size={22} strokeWidth={1.75} />
                </Link>
                <Link
                  to="/shop"
                  className="hidden sm:flex p-2.5 rounded-xl text-secondary hover:bg-slate-100 hover:text-primary"
                  title="Shop"
                >
                  <ShoppingBag size={22} strokeWidth={1.75} />
                </Link>
                <button
                  type="button"
                  className="lg:hidden p-2.5 rounded-xl text-secondary hover:bg-slate-100"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>

            <div className="lg:hidden mt-3 pb-1">
              <ProductSearch variant="compact" mode="shop" />
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-[250] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed top-0 right-0 bottom-0 w-[min(100%,340px)] bg-white z-[260] lg:hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <img
                  src="/assets/logo/1778248922397 (1).png"
                  alt="Logo"
                  className="h-14 object-contain"
                  style={{ maxWidth: '280px', mixBlendMode: 'multiply' }}
                />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 text-secondary"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="p-5 border-b border-border">
                <ProductSearch variant="compact" mode="shop" />
              </div>
              <nav className="flex-1 overflow-y-auto p-5 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 px-3 rounded-xl text-lg font-bold text-secondary hover:bg-slate-50 hover:text-primary"
                  >
                    {link.name}
                    <ChevronRight size={18} className="text-slate-300" />
                  </Link>
                ))}
              </nav>
              <div className="p-5 border-t border-border">
                <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full">
                  Shop All Phones
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
