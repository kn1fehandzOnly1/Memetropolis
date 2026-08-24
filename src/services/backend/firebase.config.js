// Production Firebase Configuration for ViralDrop
// Supports local dev mock fallbacks + live Firebase Cloud Console credentials

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_MOCK_API_KEY_FOR_LOCAL_DEV",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "viraldrop-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "viraldrop-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "viraldrop-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:a1b2c3d4e5f6"
};

// Initialize Firebase App Singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Enable IndexedDB offline persistence for high performance on mobile devices
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore offline persistence failed: Multiple tabs open.');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore offline persistence is not supported by browser.');
    }
  });
} catch (e) {
  // Ignored in SSR / test environments
}

export default app;
