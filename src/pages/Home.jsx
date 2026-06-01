import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { ProductsTabRow, BrandGrid } from '../components/HomeSections';
import { Link } from 'react-router-dom';
import { Smartphone, Watch, Headphones, Zap, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

const trustItems = [
  {
    icon: ShieldCheck,
    title: 'Official Warranty',
    desc: '100% genuine products',
  },
  {
    icon: Truck,
    title: 'Islandwide Delivery',
    desc: 'Safe & fast shipping',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    desc: '7 days replacement',
  },
  {
    icon: Award,
    title: 'Best Prices',
    desc: 'Trusted local retailer',
  },
];

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        <Hero />

        <section className="border-y border-border bg-slate-50">
          <div className="container py-10 md:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {trustItems.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="trust-card">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-sm uppercase tracking-wide">{title}</h4>
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-slate-50">
          <div className="container">
            <div className="section-title">
              <h2>Trending Phones</h2>
              <div className="accent-line" />
              <p>New arrivals mixed from all brands — no tabs, always fresh</p>
            </div>
            <ProductsTabRow />
            <div className="text-center mt-10">
              <Link to="/shop" className="btn-primary">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container">
            <div className="section-title">
              <h2>Official Brand Partners</h2>
              <div className="accent-line" />
              <p>Genuine products from world-leading manufacturers</p>
            </div>
            <BrandGrid />
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container">
            <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop"
                  alt=""
                  className="w-full h-full object-cover opacity-25 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70" />
              </div>
              <div className="relative z-10 px-6 py-16 md:px-16 md:py-24 text-center max-w-3xl mx-auto">
                <span className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/30">
                  <Zap size={12} fill="currentColor" /> Premium Experience
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 uppercase tracking-tight text-balance leading-tight">
                  Ready for the Next Generation?
                </h2>
                <p className="text-slate-300 mb-10 text-sm md:text-base max-w-lg mx-auto">
                  Browse the latest smartphones, accessories, and wearables with islandwide delivery.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                  <Link to="/shop" className="btn-primary">
                    Shop Now
                  </Link>
                  <Link to="/categories" className="btn-outline">
                    Categories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
