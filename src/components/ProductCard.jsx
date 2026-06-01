import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductModal from './ProductModal';
import { Link } from 'react-router-dom';

const getPlaceholderImage = (product) => {
  const brand = (product.brand || product.name || '').toLowerCase();
  if (brand.includes('apple') || brand.includes('iphone')) {
    return 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=400';
  }
  if (brand.includes('samsung')) {
    return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400';
  }
  if (brand.includes('google') || brand.includes('pixel')) {
    return 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?auto=format&fit=crop&q=80&w=400';
  }
  const hash = product.id ? String(product.id).charCodeAt(0) % 3 : 0;
  return [
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cd8d3?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=400',
  ][hash];
};

/** Customer-facing product card — no add/edit/delete (admin uses /admin only). */
const ProductCard = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  let imageUrl = product.image;
  if (!imageUrl || imageUrl.includes('placehold.co')) {
    imageUrl = getPlaceholderImage(product);
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        className="card-product group"
      >
        <div className="relative">
          {product.isNew && <span className="badge-new absolute top-3 left-3 z-10">New</span>}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full aspect-square bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6 relative overflow-hidden"
          >
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getPlaceholderImage(product);
              }}
            />
            <span className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <span className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full text-[11px] font-black uppercase tracking-wider text-secondary shadow-lg">
                <Eye size={14} /> Quick View
              </span>
            </span>
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1 border-t border-border">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{product.brand}</p>
          <Link
            to={`/product/${product.id}`}
            className="text-sm font-semibold text-secondary line-clamp-2 mb-3 hover:text-primary leading-snug flex-1"
          >
            {product.name}
          </Link>
          <div className="flex items-end justify-between gap-2 mt-auto pt-2 border-t border-slate-100">
            <div>
              {product.originalPrice && (
                <p className="text-xs text-slate-400 line-through font-medium">{product.originalPrice}</p>
              )}
              <p className="text-lg font-black text-primary leading-none">{product.price}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-xl bg-slate-100 text-secondary hover:bg-primary hover:text-white shrink-0"
              title="Details"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </motion.article>

      <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ProductCard;
