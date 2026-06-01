const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.gsmarena.com/',
  'Connection': 'keep-alive',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin'
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanProductName(name) {
  // Remove storage configurations from name like (8GB/256GB)
  return name.replace(/\([^)]+\)/g, '').trim();
}

async function getGSMArenaImage(productName) {
  try {
    const cleanName = cleanProductName(productName);
    const searchUrl = `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(cleanName)}`;
    
    const searchRes = await axios.get(searchUrl, { headers });
    const $ = cheerio.load(searchRes.data);
    
    const firstLink = $('.makers ul li a').first().attr('href');
    if (!firstLink) {
        return null;
    }
    
    const productUrl = `https://www.gsmarena.com/${firstLink}`;
    const productRes = await axios.get(productUrl, { headers });
    const $p = cheerio.load(productRes.data);
    
    let imgUrl = $p('.specs-photo-main a img').attr('src');
    return imgUrl || null;
  } catch (err) {
    console.error(`  -> Failed: ${err.message}`);
    return null;
  }
}

async function updateImages() {
  console.log('Fetching products from Firestore...');
  const snapshot = await db.collection('products').get();
  const products = [];
  snapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() });
  });

  console.log(`Found ${products.length} products. Starting GSMArena scraper...`);
  
  let updatedCount = 0;
  for (const product of products) {
    // Check if we already updated this (optional: skip if already has fdn2.gsmarena.com)
    if (product.image && product.image.includes('fdn2.gsmarena.com')) {
      console.log(`[SKIPPED] ${product.name} (already has GSMArena image)`);
      continue;
    }

    console.log(`[SCRAPING] ${product.name}...`);
    const imgUrl = await getGSMArenaImage(product.name);
    
    if (imgUrl) {
      await db.collection('products').doc(product.id).update({ image: imgUrl });
      console.log(`  -> SUCCESS: ${imgUrl}`);
      updatedCount++;
    } else {
      console.log(`  -> NOT FOUND for ${product.name}`);
    }
    
    // Sleep for 2.5 seconds to prevent rate limits
    await sleep(2500);
  }

  console.log(`\nFinished! Successfully updated ${updatedCount} products.`);
  process.exit(0);
}

updateImages();
