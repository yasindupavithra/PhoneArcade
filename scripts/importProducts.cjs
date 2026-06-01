const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

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

const importFileArg = process.argv[2] || path.join(__dirname, 'products-to-import.json');
if (!fs.existsSync(importFileArg)) {
  console.error('Import file not found:', importFileArg);
  console.error('Usage: node scripts/importProducts.cjs <optional-path-to-json>');
  process.exit(1);
}

let items;
try {
  items = JSON.parse(fs.readFileSync(importFileArg, 'utf8'));
} catch (err) {
  console.error('Failed to parse JSON:', err.message);
  process.exit(1);
}

if (!Array.isArray(items)) {
  console.error('Import file must be a JSON array of product objects');
  process.exit(1);
}

async function importProducts() {
  for (const p of items) {
    const id = p.id ? String(p.id) : undefined;
    const docRef = id ? db.collection('products').doc(id) : db.collection('products').doc();
    const data = { ...p };
    delete data.id;
    try {
      await docRef.set(data, { merge: true });
      console.log('Imported', p.name);
    } catch (err) {
      console.error('Failed to import', p.name, err.message);
    }
  }
  console.log('Done importing', items.length, 'products');
}

importProducts().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
