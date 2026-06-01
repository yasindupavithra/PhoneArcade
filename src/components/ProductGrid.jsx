import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import { useProductsCatalog } from '../context/ProductsCatalogContext';
import { searchProducts } from '../utils/searchProducts';

const ProductGrid = ({ externalCategory = 'All', searchQuery = '' }) => {
  const { products, loading } = useProductsCatalog();

  const filteredProducts = useMemo(() => {
    let list =
      externalCategory === 'All'
        ? products
        : products.filter((p) => {
            if (externalCategory === 'Accessories') {
              return !['Mobile', 'Tablet', 'Wearables', 'Smartwatches'].includes(p.category);
            }
            if (externalCategory === 'Audio') {
              return ['Speakers', 'Earphones & Headphones', 'Accessories'].includes(p.category);
            }
            if (externalCategory === 'Wearables') {
              return p.category === 'Wearables' || p.category === 'Smartwatches';
            }
            return p.category === externalCategory;
          });

    if (searchQuery?.trim()) {
      list = searchProducts(list, searchQuery, 500);
    }
    return list;
  }, [products, externalCategory, searchQuery]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <p className="text-sm font-bold text-muted uppercase tracking-wider">
          {loading
            ? 'Loading products...'
            : searchQuery?.trim()
              ? `${filteredProducts.length} match(es) for "${searchQuery.trim()}"`
              : `Showing ${filteredProducts.length} products`}
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-border">
          <p className="text-4xl mb-4">📱</p>
          <h3 className="text-xl font-black text-secondary mb-2">No products found</h3>
          <p className="text-muted text-sm">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
