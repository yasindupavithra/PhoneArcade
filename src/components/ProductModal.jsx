import React from 'react';
import { X, ShoppingCart, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getPlaceholderImage = (product) => {
  const brand = (product.brand || product.name || '').toLowerCase();
  
  if (brand.includes('apple') || brand.includes('iphone')) {
    return 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=400';
  } else if (brand.includes('samsung')) {
    return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400';
  } else if (brand.includes('google') || brand.includes('pixel')) {
    return 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?auto=format&fit=crop&q=80&w=400';
  } else if (brand.includes('vivo') || brand.includes('oppo') || brand.includes('xiaomi') || brand.includes('redmi')) {
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400';
  }
  
  const hash = product.id ? String(product.id).charCodeAt(0) % 3 : 0;
  const fallbacks = [
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cd8d3?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=400'
  ];
  return fallbacks[hash];
};

const ProductModal = ({ product, isOpen, onClose }) => {
  if (!isOpen) return null;

  let imageUrl = product.image;
  if (!imageUrl || imageUrl.includes('placehold.co') || imageUrl.includes('via.placeholder.com')) {
    imageUrl = getPlaceholderImage(product);
  } else if (imageUrl.includes('images.weserv.nl')) {
    if (decodeURIComponent(imageUrl).includes('placehold.co')) {
        imageUrl = getPlaceholderImage(product);
    } else {
        const urlParams = new URLSearchParams(imageUrl.split('?')[1]);
        const realUrl = urlParams.get('url');
        if (realUrl) imageUrl = realUrl;
    }
  }

  // Fallback for specs if fullSpecs isn't defined yet
  const specs = product.fullSpecs || {
    Display: product.specs,
    Platform: 'See store for details',
    Battery: 'See store for details'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row z-10"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-red-500 hover:text-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          {/* Left: Image & Quick Info */}
          <div className="w-full md:w-2/5 bg-gray-50 p-8 flex flex-col items-center justify-center border-r border-gray-100">
            <div className="w-full h-64 md:h-80 flex items-center justify-center mb-8 relative mix-blend-multiply">
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain drop-shadow-xl"
                onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(product); }}
              />
            </div>
            <div className="text-center w-full">
              <h2 className="text-2xl font-black text-secondary mb-2">{product.name}</h2>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">{product.brand}</p>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through decoration-gray-300">
                    {product.originalPrice}
                  </span>
                )}
                <span className="text-3xl font-black text-primary">
                  {product.price}
                </span>
              </div>

              <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
                <ShoppingCart size={24} /> ADD TO CART
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                <ShieldCheck size={18} className="text-green-500" />
                1 Year Agent Warranty Included
              </div>
            </div>
          </div>

          {/* Right: Detailed GSMArena Specs */}
          <div className="w-full md:w-3/5 p-8 overflow-y-auto bg-white custom-scrollbar">
            <h3 className="text-xl font-black border-b border-gray-200 pb-4 mb-6 uppercase tracking-wider text-secondary">
              Technical Specifications
            </h3>
            
            <div className="flex flex-col gap-0 border border-gray-200 rounded-lg overflow-hidden">
              {Object.entries(specs).map(([key, value], index) => (
                <div 
                  key={key} 
                  className={`flex flex-col sm:flex-row border-b border-gray-100 last:border-0 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="w-full sm:w-1/3 p-4 font-bold text-gray-700 text-sm border-r border-gray-100 uppercase tracking-wide">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="w-full sm:w-2/3 p-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {product.gsmLink && (
              <div className="mt-8 flex justify-center">
                <a 
                  href={product.gsmLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-secondary text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-opacity-90 transition-all shadow-md flex items-center gap-2"
                >
                  View on GSMArena
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
