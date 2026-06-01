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

async function listCollections() {
  console.log('--- Listing products collection ---');
  try {
    const productsSnap = await db.collection('products').get();
    if (productsSnap.empty) {
      console.log('No products found.');
    } else {
      productsSnap.forEach(doc => {
        console.log(doc.id, JSON.stringify(doc.data(), null, 2));
      });
    }
  } catch (err) {
    console.error('Error reading products:', err);
  }

  console.log('\n--- Listing users collection ---');
  try {
    const usersSnap = await db.collection('users').get();
    if (usersSnap.empty) {
      console.log('No users found.');
    } else {
      usersSnap.forEach(doc => {
        console.log(doc.id, JSON.stringify(doc.data(), null, 2));
      });
    }
  } catch (err) {
    console.error('Error reading users:', err);
  }
}

listCollections().catch(err => {
  console.error('Fatal error:', err);
});
