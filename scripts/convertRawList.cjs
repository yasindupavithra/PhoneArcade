const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, 'raw-list.txt');
const outPath = path.join(__dirname, 'products-to-import.json');

if (!fs.existsSync(rawPath)) {
  console.error('Place your product plain-text list in', rawPath);
  process.exit(1);
}

const raw = fs.readFileSync(rawPath, 'utf8').split(/\r?\n/).map(l => l.trim());

// Filter out common UI noise lines
const noise = new Set(['Add to cart', 'Quick view', 'Compare', 'Showroom Payment', 'From: රු0.00']);
const lines = raw.filter(l => l.length > 0 && !noise.has(l));

const products = [];
let i = 0;
while (i < lines.length) {
  const name = lines[i++] || '';
  // price may be on next line; if not, price = ''
  let price = '';
  if (i < lines.length && lines[i].match(/[0-9]/)) {
    price = lines[i++];
  }

  // optional status like 'Sold out' or 'Hot'
  let status = '';
  if (i < lines.length && /sold out|soldout|sold-out|hot/i.test(lines[i])) {
    status = lines[i++];
  }

  // derive brand (first token before space) and category default
  const brand = name.split(' ')[0] || '';
  const available = !/sold out/i.test(status);
  const isNew = /hot|new/i.test(status);

  const product = {
    name,
    brand,
    price: price || '',
    category: 'Mobile',
    image: 'https://placehold.co/400x400/f3f4f6/1f2937?text=' + encodeURIComponent(name.slice(0,30)),
    specs: '',
    isNew: isNew,
    available: available
  };

  products.push(product);
}

fs.writeFileSync(outPath, JSON.stringify(products, null, 2), 'utf8');
console.log('Wrote', products.length, 'products to', outPath);
