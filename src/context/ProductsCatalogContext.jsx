import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { products as sampleProducts } from '../constants';

const ProductsCatalogContext = createContext();

export const useProductsCatalog = () => {
  const ctx = useContext(ProductsCatalogContext);
  if (!ctx) {
    throw new Error('useProductsCatalog must be used within ProductsCatalogProvider');
  }
  return ctx;
};

const mergeCatalog = (firestoreProducts) => {
  if (!firestoreProducts.length) return sampleProducts.map((p) => ({ ...p, id: String(p.id) }));

  const seen = new Set(firestoreProducts.map((p) => (p.name || '').toLowerCase()));
  const extras = sampleProducts
    .filter((p) => !seen.has((p.name || '').toLowerCase()))
    .map((p) => ({ ...p, id: String(p.id) }));

  return [...firestoreProducts, ...extras];
};

export const ProductsCatalogProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      const fromDb = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      setProducts(mergeCatalog(fromDb));
    } catch (err) {
      console.error('Catalog load failed:', err);
      setProducts(sampleProducts.map((p) => ({ ...p, id: String(p.id) })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ProductsCatalogContext.Provider value={{ products, loading, refresh }}>
      {children}
    </ProductsCatalogContext.Provider>
  );
};
