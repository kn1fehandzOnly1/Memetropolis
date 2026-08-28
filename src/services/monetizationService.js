import { db } from './backend/firebase.config';
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { SUBSCRIBER_MILESTONES } from './mockData';

export const COIN_PACKS = [
  { id: 'coins_100', coins: 100, price: '$0.99', popular: false, badge: '' },
  { id: 'coins_550', coins: 550, price: '$4.99', popular: true, badge: '+10% BONUS' },
  { id: 'coins_1200', coins: 1200, price: '$9.99', popular: false, badge: '+20% BONUS' },
  { id: 'coins_2800', coins: 2800, price: '$19.99', popular: false, badge: '+40% BEST VALUE' },
];

export const PRO_TIERS = {
  PRO: {
    id: 'pro',
    name: 'VIRALDROP PRO',
    price: '$2.99 / mo',
    color: 'from-amber-400 to-orange-500',
    badge: 'PRO',
    perks: [
      '100% Ad-Free Feed Browsing',
      'Golden PRO Badge on Profile & Comments',
      'Upload High-Resolution Images & GIFs (up to 50MB)',
      '100 Free Monthly Bonus Coins',
      'Exclusive Dark Mode Ultra Theme'
    ]
  },
  PRO_PLUS: {
    id: 'pro_plus',
    name: 'VIRALDROP PRO+',
    price: '$5.99 / mo',
    color: 'from-pink-500 via-purple-500 to-indigo-600',
    badge: 'PRO+',
    perks: [
      'All VIRALDROP PRO Features Included',
      'Animated Glowing Profile Avatar Frame',
      '300 Free Monthly Bonus Coins',
      'Pin 1 Comment on your own posts',
      'Early access to new experimental features'
    ]
  }
};

class MonetizationService {
  async toggleSubscribe(userId, creatorUsername, currentFollowing = []) {
    const userRef = doc(db, 'users', userId);
    const isSubscribed = currentFollowing.includes(creatorUsername);

    if (isSubscribed) {
      await updateDoc(userRef, {
        following: arrayRemove(creatorUsername)
      });
    } else {
      await updateDoc(userRef, {
        following: arrayUnion(creatorUsername)
      });
    }
    return !isSubscribed;
  }

  async addCoins(userId, amount) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      coins: increment(amount)
    });
  }

  async spendCoins(userId, amount, currentCoins) {
    if (currentCoins < amount) return false;

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      coins: increment(-amount)
    });
    return true;
  }

  async upgradePro(userId, tier = 'PRO') {
    const userRef = doc(db, 'users', userId);
    const updates = {
      isPro: true,
      isProPlus: tier === 'PRO_PLUS',
      coins: increment(tier === 'PRO_PLUS' ? 300 : 100)
    };
    await updateDoc(userRef, updates);
  }

  getNextMilestone(subscribers = 0) {
    return SUBSCRIBER_MILESTONES.find(m => m.count > subscribers) || SUBSCRIBER_MILESTONES[SUBSCRIBER_MILESTONES.length - 1];
  }
}

export const monetizationService = new MonetizationService();
