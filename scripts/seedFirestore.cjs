const admin = require('firebase-admin');
const path = require('path');

const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');
let serviceAccount;
try {
  serviceAccount = require(keyPath);
} catch (err) {
  console.error('serviceAccountKey.json not found. Place your Firebase service account JSON in the project root with this exact filename.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const products = require('../src/constants').products;

async function seed() {
  if (!Array.isArray(products) || products.length === 0) {
    console.error('No products found in src/constants. Make sure `products` is exported.');
    return;
  }

  for (const p of products) {
    const id = p.id ? String(p.id) : undefined;
    const docRef = id ? db.collection('products').doc(id) : db.collection('products').doc();
    const data = { ...p };
    delete data.id;
    await docRef.set(data);
    console.log('Seeded product', p.name);
  }
  console.log('Done seeding products');
}

seed().catch(err => {
  console.error('Error seeding:', err);
});
