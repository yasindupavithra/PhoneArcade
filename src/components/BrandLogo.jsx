import React, { useState } from 'react';

const BrandLogo = ({ brand, className = 'max-h-10 md:max-h-12', iconClassName = 'text-2xl font-black' }) => {
  const [failed, setFailed] = useState(false);

  if (!failed && brand.logo) {
    return (
      <img
        src={brand.logo}
        alt={brand.name}
        className={`max-w-[85%] object-contain transition-all duration-300 ${className}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className={`${iconClassName} tracking-tight`}
      style={{ color: brand.color || '#002d62' }}
    >
      {brand.name}
    </span>
  );
};

export default BrandLogo;
