import React from 'react';
import { shopDetails, navLinks } from '../constants';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="bg-secondary text-white mt-auto">
      <div className="container section-padding !pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Phone size={24} />
              </div>
              <span className="text-2xl font-black tracking-tight">{shopDetails.name}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              Your trusted destination for genuine smartphones and accessories in Horana & Ingiriya. Quality at the
              best prices.
            </p>
            <div className="flex gap-3">
              <a
                href={shopDetails.socials.facebook}
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#1877F2] transition-colors"
              >
                <FacebookIcon />
              </a>
              <a
                href={`https://wa.me/${shopDetails.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#25D366] transition-colors"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="text-slate-300 hover:text-white text-sm font-medium">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-slate-300 hover:text-white text-sm font-medium">
                  Brands
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {shopDetails.locations.map((loc) => (
                    <span key={loc} className="block">
                      {loc}
                    </span>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <a href={`tel:${shopDetails.phone}`} className="hover:text-white">
                  {shopDetails.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <a href={`mailto:${shopDetails.email}`} className="hover:text-white break-all">
                  {shopDetails.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-6">Newsletter</h4>
            <p className="text-slate-300 text-sm mb-4">Get offers and new arrivals first.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full pl-5 pr-14 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <button
                type="button"
                className="absolute right-1.5 top-1.5 w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2026 {shopDetails.fullName}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
