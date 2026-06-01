import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductGrid from '../components/ProductGrid';
import ProductSearch from '../components/ProductSearch';
import Footer from '../components/Footer';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Smartphone, Watch, Zap, Speaker, BatteryCharging, Tablet } from 'lucide-react';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleShopSearchChange = (q) => {
    setSearchQuery(q);
    const trimmed = q.trim();
    if (trimmed) navigate(`/shop?q=${encodeURIComponent(trimmed)}`, { replace: true });
    else if (searchParams.get('q')) navigate('/shop', { replace: true });
  };

  const categories = [
    { name: 'All', icon: null },
    { name: 'Mobile', icon: Smartphone },
    { name: 'Tablet', icon: Tablet },
    { name: 'Accessories', icon: Zap },
    { name: 'Wearables', icon: Watch },
    { name: 'Audio', icon: Speaker },
    { name: 'Power Banks', icon: BatteryCharging },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="bg-white border-b border-border">
        <div className="container py-8 md:py-10">
          <nav className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-secondary">{searchQuery ? `Search` : 'Shop'}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-secondary uppercase tracking-tight">
                {searchQuery ? 'Search Results' : 'Shop All'}
              </h1>
              {searchQuery && (
                <p className="text-muted mt-2 text-sm">
                  Results for <strong className="text-secondary">&ldquo;{searchQuery}&rdquo;</strong>
                </p>
              )}
            </div>
            <div className="w-full lg:max-w-md">
              <ProductSearch
                variant="compact"
                mode="shop"
                defaultQuery={searchQuery}
                onShopQueryChange={handleShopSearchChange}
                placeholder="Search products..."
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-secondary text-white shadow-lg'
                      : 'bg-slate-100 text-secondary hover:bg-slate-200'
                  }`}
                >
                  {Icon && <Icon size={16} className={active ? 'text-primary' : 'text-muted'} />}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="container py-10 md:py-12 flex-grow">
        <ProductGrid externalCategory={activeCategory} searchQuery={searchQuery} />
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
