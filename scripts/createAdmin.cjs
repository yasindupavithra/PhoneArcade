const admin = require('firebase-admin');
const readline = require('readline');

// You need to download your service account key from Firebase Console
// Settings -> Service Accounts -> Generate New Private Key
// Save it as 'serviceAccountKey.json' in the root folder
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const createAdmin = async () => {
  rl.question('Enter Email for Admin: ', async (email) => {
    rl.question('Enter Password for Admin (min 6 chars): ', async (password) => {
      try {
        // 1. Create User in Firebase Auth
        const userRecord = await auth.createUser({
          email: email,
          password: password,
        });

        // 2. Add Role as Admin in Firestore 'users' collection
        await db.collection('users').doc(userRecord.uid).set({
          email: email,
          role: 'admin',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`\nSuccessfully created Admin account!`);
        console.log(`UID: ${userRecord.uid}`);
        console.log(`Email: ${email}`);
        console.log(`\nYou can now log in at /login`);
        
        process.exit(0);
      } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
      }
    });
  });
};

createAdmin();
