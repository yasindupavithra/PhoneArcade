import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CategoriesPage = () => {
  const categories = [
    { name: 'Speakers', slug: 'Speakers', image: 'https://images.unsplash.com/photo-1589003020619-425e2f915edb?q=80&w=600&auto=format&fit=crop' },
    { name: 'Smartwatches', slug: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop' },
    { name: 'Cables & Adapters', slug: 'Cables & Adapters', image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=600&auto=format&fit=crop' },
    { name: 'Earphones', slug: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop' },
    { name: 'Mobile Accessories', slug: 'Accessories', image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=600&auto=format&fit=crop' },
    { name: 'Chargers', slug: 'Chargers', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop' },
    { name: 'Power Banks', slug: 'Power Banks', image: 'https://images.unsplash.com/photo-1609091839311-d53680102460?q=80&w=600&auto=format&fit=crop' },
    { name: 'Protective Cases', slug: 'Accessories', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="bg-white border-b border-border py-6">
        <div className="container">
          <nav className="flex items-center gap-2 text-[11px] font-bold text-muted uppercase tracking-widest">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-secondary">Categories</span>
          </nav>
        </div>
      </div>

      <main className="section-padding flex-grow">
        <div className="container">
          <div className="section-title">
            <h2>Shop by Category</h2>
            <div className="accent-line" />
            <p>Phones, accessories, audio & more</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/shop"
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
            >
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop"
                alt="Mobile"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl font-black uppercase tracking-tight">Smartphones</h3>
                <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">Shop now →</p>
              </div>
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/shop`}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-lg font-black uppercase tracking-tight leading-tight">{cat.name}</h3>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest mt-2">Explore →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoriesPage;
