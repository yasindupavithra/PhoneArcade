import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, Smartphone } from 'lucide-react';
import { useProductsCatalog } from '../context/ProductsCatalogContext';
import { searchProducts } from '../utils/searchProducts';

const getThumb = (product) => {
  const img = product?.image;
  if (img && !img.includes('placehold.co')) return img;
  return null;
};

/**
 * @param {'shop'|'admin'} mode
 * @param {'compact'|'large'} variant
 * @param {(product) => void} onAdminSelect
 * @param {(query: string) => void} onQueryChange - admin inventory filter
 * @param {string} className
 */
const ProductSearch = ({
  mode = 'shop',
  variant = 'compact',
  onAdminSelect,
  onQueryChange,
  onShopQueryChange,
  className = '',
  placeholder,
  defaultQuery = '',
}) => {
  const { products, loading } = useProductsCatalog();
  const navigate = useNavigate();
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    if (query.trim().length < 1) return [];
    return searchProducts(products, query, mode === 'admin' ? 12 : 8);
  }, [products, query, mode]);

  useEffect(() => {
    const t = setTimeout(() => {
      onQueryChange?.(query);
      if (mode === 'shop') onShopQueryChange?.(query);
    }, 200);
    return () => clearTimeout(t);
  }, [query, onQueryChange, onShopQueryChange, mode]);

  useEffect(() => {
    setActiveIndex(-1);
    setOpen(query.trim().length > 0);
  }, [query, results.length]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToShop = (q) => {
    const term = (q || query).trim();
    if (term) navigate(`/shop?q=${encodeURIComponent(term)}`);
    else navigate('/shop');
    setOpen(false);
    setQuery('');
  };

  const selectProduct = (product) => {
    if (mode === 'admin') {
      onAdminSelect?.(product);
      setQuery(product.name || '');
      setOpen(false);
      return;
    }
    navigate(`/product/${product.id}`);
    setQuery('');
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        e.preventDefault();
        if (mode === 'shop') goToShop();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        selectProduct(results[activeIndex]);
      } else if (mode === 'shop') {
        goToShop();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const isLarge = variant === 'large';
  const inputClasses = isLarge
    ? 'w-full pl-12 pr-12 py-4 text-base rounded-2xl border-2 border-border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary'
    : 'w-full pl-10 pr-10 py-3 text-sm rounded-full border border-border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white';

  const defaultPlaceholder =
    mode === 'admin'
      ? 'Search inventory by name, brand...'
      : 'Search phones — iPhone, Samsung, Vivo...';

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${isLarge ? '' : 'left-3.5'}`}
          size={isLarge ? 22 : 18}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || defaultPlaceholder}
          className={inputClasses}
          autoComplete="off"
          aria-label="Search products"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {loading && !query && (
          <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-300" />
        )}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onQueryChange?.('');
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400"
            aria-label="Clear search"
          >
            <X size={isLarge ? 20 : 16} />
          </button>
        )}
      </div>

      {open && (
        <div
          className={`absolute left-0 right-0 z-[300] mt-2 bg-white rounded-2xl border border-border shadow-search overflow-hidden ${
            isLarge ? 'max-h-[420px]' : 'max-h-[360px]'
          }`}
        >
          {query.trim().length < 1 ? null : results.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              <p className="font-bold text-secondary mb-1">No matches</p>
              <p>Try another brand or model name</p>
            </div>
          ) : (
            <ul className="overflow-y-auto max-h-[340px] py-2" role="listbox">
              {results.map((product, index) => {
                const thumb = getThumb(product);
                const isActive = index === activeIndex;
                return (
                  <li key={product.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => selectProduct(product)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isActive ? 'bg-primary/10' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-12 h-12 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                        {thumb ? (
                          <img src={thumb} alt="" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <Smartphone size={22} className="text-gray-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="font-bold text-secondary text-sm truncate">{product.name}</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                          {product.brand}
                          {product.category ? ` · ${product.category}` : ''}
                        </p>
                      </div>
                      <span className="text-sm font-black text-primary shrink-0">{product.price}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {mode === 'shop' && query.trim() && (
            <button
              type="button"
              onClick={() => goToShop()}
              className="w-full py-3 border-t text-center text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5"
            >
              View all results for &quot;{query.trim()}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
