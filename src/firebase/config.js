import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCRzpKd_D8as1_zzOu3TUWSpAwLtxH0BIk",
  authDomain: "phonearchade-20410.firebaseapp.com",
  projectId: "phonearchade-20410",
  storageBucket: "phonearchade-20410.firebasestorage.app",
  messagingSenderId: "539309982478",
  appId: "1:539309982478:web:dafae7c44b2c49fcab8d5f",
  measurementId: "G-MYSE47G469"
};

const app = initializeApp(firebaseConfig);

// Analytics can fail in some environments (privacy blocks, missing window, etc.).
// Initialize it defensively so a failure doesn't break the whole app.
let analyticsInstance = null;
try {
  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    analyticsInstance = getAnalytics(app);
  }
} catch (err) {
  // Fail silently — analytics is optional.
  // eslint-disable-next-line no-console
  console.warn('Firebase analytics disabled:', err && err.message ? err.message : err);
}

export const analytics = analyticsInstance;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
