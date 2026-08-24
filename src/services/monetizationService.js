import { INITIAL_USER, AWARDS_LIST, SUBSCRIBER_MILESTONES } from './mockData';

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
  constructor() {
    this.user = this.loadUser();
  }

  loadUser() {
    try {
      const savedUser = localStorage.getItem('viraldrop_user');
      if (!savedUser) return INITIAL_USER;

      const parsed = JSON.parse(savedUser);
      // Basic migration/validation: Ensure required fields exist
      return {
        ...INITIAL_USER,
        ...parsed,
        // Preserve coins and subscription status
        coins: typeof parsed.coins === 'number' ? parsed.coins : INITIAL_USER.coins,
        isPro: !!parsed.isPro,
        isProPlus: !!parsed.isProPlus
      };
    } catch (e) {
      console.error('Failed to load user from LocalStorage:', e);
      return INITIAL_USER;
    }
  }

  saveUser() {
    try {
      localStorage.setItem('viraldrop_user', JSON.stringify(this.user));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }

  getUser() {
    return this.user;
  }

  toggleSubscribe(creatorUsername) {
    const following = [...(this.user.following || [])];
    const isSubscribed = following.includes(creatorUsername);

    if (isSubscribed) {
      this.user.following = following.filter(u => u !== creatorUsername);
    } else {
      this.user.following = [...following, creatorUsername];
    }

    this.saveUser();
    return !isSubscribed;
  }

  isSubscribed(creatorUsername) {
    return (this.user.following || []).includes(creatorUsername);
  }

  addCoins(amount) {
    this.user.coins = (this.user.coins || 0) + amount;
    this.saveUser();
    return this.user;
  }

  spendCoins(amount) {
    if (this.user.coins < amount) {
      return false; // Insufficient funds
    }
    this.user.coins -= amount;
    this.saveUser();
    return true;
  }

  upgradePro(tier = 'PRO') {
    if (tier === 'PRO_PLUS') {
      this.user.isPro = true;
      this.user.isProPlus = true;
      this.addCoins(300);
    } else {
      this.user.isPro = true;
      this.user.isProPlus = false;
      this.addCoins(100);
    }
    this.saveUser();
    return this.user;
  }

  shouldShowAds() {
    // Hide ads if user has PRO or PRO+
    return !(this.user.isPro || this.user.isProPlus);
  }

  getNextMilestone() {
    const subs = this.user.subscribers || 0;
    return SUBSCRIBER_MILESTONES.find(m => m.count > subs) || SUBSCRIBER_MILESTONES[SUBSCRIBER_MILESTONES.length - 1];
  }
}

export const monetizationService = new MonetizationService();
