import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { products as sampleProducts } from '../constants';
import { PARTNER_BRANDS, pickTrendingMixed } from '../constants/brands';
import BrandLogo from './BrandLogo';

const TRENDING_LIMIT = 12;

export const ProductsTabRow = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), limit(80));
        const snapshot = await getDocs(q);
        let allProds = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (allProds.length === 0) {
          allProds = sampleProducts.map((p) => ({ ...p, id: String(p.id) }));
        }
        setProducts(pickTrendingMixed(allProds, { limit: TRENDING_LIMIT, maxPerBrand: 2 }));
      } catch {
        setProducts(
          pickTrendingMixed(
            sampleProducts.map((p) => ({ ...p, id: String(p.id) })),
            { limit: TRENDING_LIMIT, maxPerBrand: 2 }
          )
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 px-2">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.2em] border border-primary/20">
          <Sparkles size={14} />
          Fresh arrivals
        </span>
        <p className="text-sm text-muted text-center font-medium max-w-md">
          Newly added phones from every brand — mixed for you, updated when staff adds stock.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Loading trending phones…</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-dashed border-border bg-white">
          <p className="text-muted font-semibold">No phones yet. Check back soon.</p>
          <Link to="/shop" className="btn-primary mt-6 inline-flex">
            Browse shop
          </Link>
        </div>
      ) : (
        <div className="trending-phones-track">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="trending-phone-item"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const BrandGrid = () => {
  return (
    <div className="brand-partners-grid">
      {PARTNER_BRANDS.map((brand, index) => (
        <Link
          key={brand.id}
          to={`/shop?q=${encodeURIComponent(brand.searchQuery)}`}
          className="brand-partner-card group"
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <div
            className="brand-partner-glow"
            style={{ background: `radial-gradient(circle at 50% 120%, ${brand.color}22, transparent 70%)` }}
          />
          <div className="brand-partner-inner">
            <BrandLogo brand={brand} className="max-h-9 md:max-h-11 grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100" />
          </div>
          <span className="brand-partner-label">{brand.name}</span>
        </Link>
      ))}
      <Link to="/brands" className="brand-partner-card brand-partner-all group">
        <div className="brand-partner-inner flex-col gap-2 border-2 border-dashed border-primary/35 bg-primary/5">
          <span className="text-primary font-black text-sm uppercase tracking-wider">All Brands</span>
          <ArrowRight size={22} className="text-primary group-hover:translate-x-1 transition-transform" />
        </div>
        <span className="brand-partner-label text-primary">View more</span>
      </Link>
    </div>
  );
};
