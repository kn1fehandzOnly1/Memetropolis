// Production Authentication Service for ViralDrop (Firebase Auth + Google Sign-In)

import { auth, googleAuthProvider, db } from './firebase.config';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export class AuthService {
  /**
   * Listen to active authentication state & sync user profile
   */
  static subscribeToAuthState(onUserChanged) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Subscribe to real-time profile updates (balance, subs, PRO status)
        const unsubscribeProfile = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            onUserChanged({ id: firebaseUser.uid, ...snapshot.data() });
          } else {
            // Initialize new user document in Firestore
            const initialUserData = {
              id: firebaseUser.uid,
              username: firebaseUser.displayName || `User_${firebaseUser.uid.substring(0, 5)}`,
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              bio: 'ViralDrop creator',
              coins: 250,
              subscribers: 0,
              following: [],
              isPro: false,
              isProPlus: false,
              createdAt: new Date().toISOString()
            };
            setDoc(userRef, initialUserData);
            onUserChanged(initialUserData);
          }
        });

        return () => unsubscribeProfile();
      } else {
        onUserChanged(null);
      }
    });
  }

  /**
   * Google 1-Tap Sign-In
   */
  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      return result.user;
    } catch (e) {
      console.error('Google Sign-In failed:', e);
      throw e;
    }
  }

  /**
   * Anonymous Sign-In for instant guest testing
   */
  static async signInGuest() {
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (e) {
      console.error('Guest Sign-In failed:', e);
      throw e;
    }
  }

  /**
   * Sign Out
   */
  static async logout() {
    return await signOut(auth);
  }
}
