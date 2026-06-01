import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { products as sampleProducts } from '../constants';
import { PARTNER_BRANDS, matchesBrand } from '../constants/brands';

const brandTabs = PARTNER_BRANDS.map((b) => b.name);

const BrandsPage = () => {
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsByBrand = async () => {
      setLoading(true);
      try {
        // First try exact brand match
        let q = query(collection(db, 'products'), where('brand', '==', selectedBrand));
        let querySnapshot = await getDocs(q);
        let productsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        // If no products found, try fetching all and filtering by name/brand manually
        // (This handles cases where Redmi might be stored under Xiaomi brand)
        if (productsData.length === 0) {
          const allDocs = await getDocs(collection(db, 'products'));
          productsData = allDocs.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }))
            .filter((p) => matchesBrand(p, selectedBrand));
        }

        if (productsData.length > 0) {
          setProducts(productsData);
        } else {
          // Fallback to sample data if database is empty for this brand
          const filteredSamples = sampleProducts.filter((p) => matchesBrand(p, selectedBrand));
          setProducts(filteredSamples);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        const filteredSamples = sampleProducts.filter((p) => matchesBrand(p, selectedBrand));
        setProducts(filteredSamples);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByBrand();
  }, [selectedBrand]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-border sticky top-[88px] z-40 shadow-sm">
        <div className="container">
          <h1 className="text-3xl font-black text-secondary uppercase tracking-tight pt-8 pb-4">Shop by Brand</h1>
          <div className="flex items-center overflow-x-auto hide-scrollbar gap-4 md:gap-8 pb-4">
            {brandTabs.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`relative px-4 py-2 text-sm md:text-lg font-extrabold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${selectedBrand === brand
                    ? 'text-secondary'
                    : 'text-gray-400 hover:text-secondary'
                  }`}
              >
                {brand}
                {selectedBrand === brand && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute -bottom-0.5 left-0 right-0 h-[3px] bg-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-grow py-10 md:py-12">
        <div className="container">
          {/* Products Grid */}
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-secondary font-black tracking-widest uppercase animate-pulse">Loading {selectedBrand} Models...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedBrand}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-inner">
                    <p className="text-gray-300 font-black text-2xl uppercase tracking-tighter italic">Coming Soon</p>
                    <p className="text-gray-400 mt-2">New arrivals for {selectedBrand} are on their way!</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrandsPage;



