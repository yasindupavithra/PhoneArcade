import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { products as sampleProducts } from '../constants';
import { ChevronRight, ShieldCheck } from 'lucide-react';

const getPlaceholderImage = (product) => {
  const brand = (product?.brand || product?.name || '').toLowerCase();
  if (brand.includes('apple') || brand.includes('iphone')) {
    return 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600';
  }
  if (brand.includes('samsung')) {
    return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600';
  }
  return 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=600';
};

const SpecRow = ({ title, value }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-4 border-b border-border last:border-0">
    <div className="font-bold text-sm text-secondary uppercase tracking-wide">{title}</div>
    <div className="sm:col-span-2 text-sm text-muted leading-relaxed whitespace-pre-line">{value}</div>
  </div>
);

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docSnap = await getDoc(doc(db, 'products', id.toString()));
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
          setLoading(false);
          return;
        }
      } catch {
        /* fallback */
      }
      const found =
        sampleProducts.find((p) => String(p.id) === String(id)) ||
        sampleProducts.find((p) => p.name?.toLowerCase().includes(String(id).toLowerCase()));
      setProduct(found || null);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-20 text-center flex-grow">
          <h1 className="text-2xl font-black text-secondary mb-4">Product not found</h1>
          <Link to="/shop" className="btn-primary">
            Back to shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  let imageUrl = product.image;
  if (!imageUrl || imageUrl.includes('placehold.co')) {
    imageUrl = getPlaceholderImage(product);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="container py-8 md:py-12 flex-grow">
        <nav className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span className="text-secondary truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-white rounded-3xl border border-border p-8 md:p-10 flex items-center justify-center min-h-[360px] shadow-card">
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-[420px] max-w-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getPlaceholderImage(product);
              }}
            />
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-black text-secondary leading-tight mb-4">{product.name}</h1>
            <div className="flex items-end gap-3 mb-6">
              {product.originalPrice && (
                <span className="text-lg text-muted line-through font-medium">{product.originalPrice}</span>
              )}
              <span className="text-3xl md:text-4xl font-black text-primary">{product.price}</span>
            </div>

            {product.specs && (
              <p className="text-muted text-sm leading-relaxed mb-6 pb-6 border-b border-border">{product.specs}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link to="/shop" className="btn-primary flex-1 text-center">
                Continue Shopping
              </Link>
              {product.gsmLink && (
                <a
                  href={product.gsmLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary flex-1 text-center"
                >
                  GSMArena Specs
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted bg-white rounded-2xl p-4 border border-border">
              <ShieldCheck className="text-primary shrink-0" size={20} />
              1 Year Agent Warranty · 100% Genuine
            </div>

            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <strong className="text-secondary">Category:</strong> {product.category || '—'}
              </li>
              <li>
                <strong className="text-secondary">Rating:</strong> {product.rating || '—'}
              </li>
            </ul>
          </div>
        </div>

        {product.fullSpecs && (
          <section className="mt-12 bg-white rounded-3xl border border-border p-6 md:p-10 shadow-card">
            <h2 className="text-xl font-black text-secondary uppercase tracking-tight mb-6 pb-4 border-b border-border">
              Full Specifications
            </h2>
            <div>
              {Object.entries(product.fullSpecs).map(([section, value]) => (
                <SpecRow key={section} title={section} value={String(value)} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Product;
