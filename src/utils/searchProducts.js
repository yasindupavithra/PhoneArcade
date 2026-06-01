import { matchesBrand } from '../constants/brands';

/**
 * Search products by name, brand, category, specs (letter-by-letter friendly).
 */
export function searchProducts(products, query, limit = 10) {
  const q = query.trim().toLowerCase();
  if (!q || !products?.length) return [];

  return products
    .map((product) => {
      const name = (product.name || '').toLowerCase();
      const brand = (product.brand || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const specs = (product.specs || '').toLowerCase();
      const fullSpecsText = product.fullSpecs
        ? Object.values(product.fullSpecs).join(' ').toLowerCase()
        : '';
      const haystack = `${name} ${brand} ${category} ${specs} ${fullSpecsText}`;

      let score = 0;

      if (name === q) score += 200;
      else if (name.startsWith(q)) score += 120;
      else if (name.includes(q)) score += 70;

      if (matchesBrand(product, q)) score += 110;
      else if (brand === q) score += 100;
      else if (brand.startsWith(q)) score += 80;
      else if (brand.includes(q)) score += 50;

      if (category.includes(q)) score += 30;
      if (specs.includes(q) || fullSpecsText.includes(q)) score += 25;

      q.split(/\s+/)
        .filter((w) => w.length >= 2)
        .forEach((word) => {
          if (name.includes(word)) score += 20;
          if (brand.includes(word)) score += 15;
          if (haystack.includes(word)) score += 10;
        });

      if (haystack.includes(q)) score += 15;

      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product }) => product);
}

export function productMatchesQuery(product, query) {
  if (!query?.trim()) return true;
  return searchProducts([product], query, 1).length > 0;
}
