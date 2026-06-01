import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  { name: 'Blackview', logo: 'https://cdn.worldvectorlogo.com/logos/blackview-logo.svg' },
  { name: 'FreeYond', logo: 'https://placehold.co/200x80/ffffff/0033aa?text=FreeYond' },
  { name: 'Greentel', logo: 'https://placehold.co/200x80/ffffff/228822?text=Greentel' },
  { name: 'Honor', logo: 'https://cdn.worldvectorlogo.com/logos/honor-2.svg' },
  { name: 'Infinix', logo: 'https://cdn.worldvectorlogo.com/logos/infinix-logo.svg' },
  { name: 'Meizu', logo: 'https://cdn.worldvectorlogo.com/logos/meizu-2.svg' },
  { name: 'Motorola', logo: 'https://cdn.worldvectorlogo.com/logos/motorola-6.svg' },
  { name: 'OnePlus', logo: 'https://cdn.worldvectorlogo.com/logos/oneplus-1.svg' },
  { name: 'Oppo', logo: 'https://cdn.worldvectorlogo.com/logos/oppo-6.svg' },
  { name: 'Oscal', logo: 'https://placehold.co/200x80/ffffff/000000?text=OSCAL' },
  { name: 'Realme', logo: 'https://cdn.worldvectorlogo.com/logos/realme-1.svg' },
  { name: 'Samsung', logo: 'https://cdn.worldvectorlogo.com/logos/samsung-6.svg' },
  { name: 'Softlogic', logo: 'https://placehold.co/200x80/ffffff/0033aa?text=Softlogic' },
  { name: 'Tecno', logo: 'https://cdn.worldvectorlogo.com/logos/tecno-mobile-logo.svg' },
  { name: 'Vivo', logo: 'https://cdn.worldvectorlogo.com/logos/vivo-2.svg' },
  { name: 'Xiaomi', logo: 'https://cdn.worldvectorlogo.com/logos/xiaomi-2.svg' },
  { name: 'ZTE', logo: 'https://cdn.worldvectorlogo.com/logos/zte-logo.svg' },
];

const Brands = () => {
  return (
    <section id="brands" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-widest">
            Featured Brands
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex items-center justify-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-12 w-auto grayscale group-hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/200x80/ffffff/000000?text=${brand.name}`;
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;
