/**
 * Single source for shop brands. Apple & iPhone are one brand everywhere.
 */
export const APPLE_BRAND = 'Apple';

export const PARTNER_BRANDS = [
  { id: 'apple', name: APPLE_BRAND, searchQuery: 'Apple', logo: 'https://cdn.simpleicons.org/apple/111827', color: '#111827' },
  { id: 'samsung', name: 'Samsung', searchQuery: 'Samsung', logo: 'https://cdn.simpleicons.org/samsung/1428A0', color: '#1428A0' },
  { id: 'google', name: 'Google', searchQuery: 'Pixel', logo: 'https://cdn.simpleicons.org/google/4285F4', color: '#4285F4' },
  { id: 'xiaomi', name: 'Xiaomi', searchQuery: 'Xiaomi', logo: 'https://cdn.simpleicons.org/xiaomi/FF6900', color: '#FF6900' },
  { id: 'vivo', name: 'Vivo', searchQuery: 'Vivo', logo: 'https://cdn.simpleicons.org/vivo/415FFF', color: '#415FFF' },
  { id: 'honor', name: 'Honor', searchQuery: 'Honor', logo: 'https://cdn.simpleicons.org/honor/000000', color: '#000000' },
  { id: 'oneplus', name: 'OnePlus', searchQuery: 'OnePlus', logo: 'https://cdn.simpleicons.org/oneplus/F5010C', color: '#F5010C' },
  { id: 'oppo', name: 'OPPO', searchQuery: 'OPPO', logo: 'https://cdn.simpleicons.org/oppo/1D4D9F', color: '#1D4D9F' },
  { id: 'realme', name: 'Realme', searchQuery: 'Realme', logo: 'https://cdn.simpleicons.org/realme/FFC915', color: '#FFC915' },
  { id: 'infinix', name: 'Infinix', searchQuery: 'Infinix', logo: 'https://cdn.simpleicons.org/infinix/000000', color: '#000000' },
  { id: 'tecno', name: 'Tecno', searchQuery: 'Tecno', logo: 'https://cdn.simpleicons.org/tecno/0064D2', color: '#0064D2' },
  { id: 'zte', name: 'ZTE', searchQuery: 'ZTE', logo: 'https://cdn.simpleicons.org/zte/008ED6', color: '#008ED6' },
  { id: 'motorola', name: 'Motorola', searchQuery: 'Motorola', logo: 'https://cdn.simpleicons.org/motorola/E1140A', color: '#E1140A' },
];

export const HERO_BRAND_CHIPS = [
  { label: 'Apple', query: 'Apple' },
  { label: 'Samsung', query: 'Samsung' },
  { label: 'Vivo', query: 'Vivo' },
  { label: 'Xiaomi', query: 'Xiaomi' },
  { label: 'Honor', query: 'Honor' },
  { label: 'OnePlus', query: 'OnePlus' },
  { label: 'Infinix', query: 'Infinix' },
  { label: 'ZTE', query: 'ZTE' },
  { label: 'Tecno', query: 'Tecno' },
  { label: 'Realme', query: 'Realme' },
  { label: 'Pixel', query: 'Pixel' },
];

const APPLE_ALIASES = ['apple', 'iphone', 'ipad', 'ios'];

export function normalizeBrand(brand, productName = '') {
  const b = (brand || '').trim().toLowerCase();
  const n = (productName || '').trim().toLowerCase();

  if (APPLE_ALIASES.some((a) => b.includes(a) || b === a)) return APPLE_BRAND;
  if (/\b(iphone|ipad|airpods|macbook)\b/.test(n)) return APPLE_BRAND;

  if (!brand) return 'Other';
  return brand.trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function matchesBrand(product, brandNameOrQuery) {
  const query = (brandNameOrQuery || '').trim().toLowerCase();
  if (!query) return true;

  const normalized = normalizeBrand(product.brand, product.name).toLowerCase();
  const name = (product.name || '').toLowerCase();
  const rawBrand = (product.brand || '').toLowerCase();

  if (query === 'apple' || query === 'iphone') {
    return normalized === 'apple' || APPLE_ALIASES.some((a) => rawBrand.includes(a) || name.includes(a));
  }

  return (
    normalized.toLowerCase().includes(query) ||
    rawBrand.includes(query) ||
    name.includes(query)
  );
}

export function parsePriceLkr(priceStr) {
  if (!priceStr) return 0;
  const digits = String(priceStr).replace(/[^\d]/g, '');
  return parseInt(digits, 10) || 0;
}

export function getProductTimestamp(product) {
  if (product.createdAt?.toMillis) return product.createdAt.toMillis();
  if (product.createdAt?.seconds) return product.createdAt.seconds * 1000;
  if (product.updatedAt?.toMillis) return product.updatedAt.toMillis();
  if (product.updatedAt?.seconds) return product.updatedAt.seconds * 1000;
  return product.isNew ? Date.now() - 86400000 : 0;
}

/** Newest phones first, mixed across brands (max per brand cap). */
export function pickTrendingMixed(products, { limit = 12, maxPerBrand = 2 } = {}) {
  const mobiles = products
    .filter((p) => (p.category || 'Mobile') === 'Mobile')
    .map((p) => ({ ...p, _brand: normalizeBrand(p.brand, p.name) }))
    .sort((a, b) => getProductTimestamp(b) - getProductTimestamp(a));

  const byBrand = new Map();
  mobiles.forEach((p) => {
    const key = p._brand;
    if (!byBrand.has(key)) byBrand.set(key, []);
    byBrand.get(key).push(p);
  });

  const brands = [...byBrand.keys()].sort((a, b) => {
    const newestA = getProductTimestamp(byBrand.get(a)[0]);
    const newestB = getProductTimestamp(byBrand.get(b)[0]);
    return newestB - newestA;
  });

  const picked = [];
  const counts = new Map();

  while (picked.length < limit) {
    let added = false;
    for (const brand of brands) {
      if (picked.length >= limit) break;
      const count = counts.get(brand) || 0;
      if (count >= maxPerBrand) continue;
      const list = byBrand.get(brand);
      const product = list[count];
      if (!product) continue;
      picked.push(product);
      counts.set(brand, count + 1);
      added = true;
    }
    if (!added) break;
  }

  if (picked.length < limit) {
    mobiles.forEach((p) => {
      if (picked.length >= limit) return;
      if (!picked.find((x) => x.id === p.id)) picked.push(p);
    });
  }

  return picked.slice(0, limit);
}
