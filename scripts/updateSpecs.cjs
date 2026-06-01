const admin = require('firebase-admin');
const { fetchFromGsmarena } = require('../server/gsmarenaScraper.cjs');

const serviceAccount = require('../serviceAccountKey.json');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Fetching products from Firestore...');
  const snapshot = await db.collection('products').get();
  const products = [];
  snapshot.forEach((doc) => products.push({ id: doc.id, ...doc.data() }));

  console.log(`Found ${products.length} products. GSMArena full-spec scraper...\n`);

  let updatedCount = 0;
  for (const product of products) {
    if (product.category && product.category !== 'Mobile') {
      console.log(`[SKIP] ${product.name} (not Mobile)`);
      continue;
    }

    if (product.fullSpecs && Object.keys(product.fullSpecs).length > 4) {
      console.log(`[SKIP] ${product.name} (already has specs)`);
      continue;
    }

    console.log(`[SCRAPING] ${product.name}...`);
    try {
      const query = [product.brand, product.name].filter(Boolean).join(' ');
      const result = await fetchFromGsmarena(query);

      if (result.needsPick) {
        console.log(`  -> Multiple matches — using first: ${result.candidates[0].name}`);
        const { fetchProductPage } = require('../server/gsmarenaScraper.cjs');
        const picked = await fetchProductPage(result.candidates[0].href);
        Object.assign(result, picked, { needsPick: false });
      }

      if (result.fullSpecs && Object.keys(result.fullSpecs).length > 0) {
        const updateData = {
          fullSpecs: result.fullSpecs,
          specs: result.specs || product.specs,
          gsmLink: result.gsmLink,
        };
        if (result.image && (!product.image || !product.image.includes('gsmarena'))) {
          updateData.image = result.image;
        }
        await db.collection('products').doc(product.id).update(updateData);
        console.log(`  -> OK: ${Object.keys(result.fullSpecs).length} sections`);
        updatedCount++;
      } else {
        console.log(`  -> NOT FOUND`);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        console.log('  -> Rate limited, waiting 30s...');
        await sleep(30000);
      } else {
        console.log(`  -> Error: ${err.message}`);
      }
    }

    await sleep(6000 + Math.floor(Math.random() * 4000));
  }

  console.log(`\nDone. Updated ${updatedCount} products.`);
  process.exit(0);
}

run();
