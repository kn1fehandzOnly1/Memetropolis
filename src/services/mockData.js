// High quality mock dataset for ViralDrop

export const CATEGORIES = [
  { id: 'hot', name: 'Hot', icon: 'Flame', color: 'text-amber-500' },
  { id: 'trending', name: 'Trending', icon: 'TrendingUp', color: 'text-cyan-400' },
  { id: 'fresh', name: 'Fresh', icon: 'Sparkles', color: 'text-emerald-400' },
  { id: 'funny', name: 'Funny', icon: 'Laugh', color: 'text-yellow-400' },
  { id: 'memes', name: 'Memes', icon: 'Image', color: 'text-purple-400' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2', color: 'text-rose-400' },
  { id: 'anime', name: 'Anime', icon: 'Tv', color: 'text-pink-400' },
  { id: 'tech', name: 'Tech & Sci', icon: 'Cpu', color: 'text-blue-400' },
  { id: 'wtf', name: 'WTF', icon: 'Skull', color: 'text-orange-500' },
];

export const SUBSCRIBER_MILESTONES = [
  { count: 10, rewardCoins: 100, title: 'Rising Meme Creator', badge: '🌱 Rising' },
  { count: 50, rewardCoins: 500, title: 'Famous Memer', badge: '🔥 Famous' },
  { count: 100, rewardCoins: 2000, title: 'Meme Legend', badge: '👑 Legend' },
  { count: 500, rewardCoins: 10000, title: 'ViralDrop Superstar', badge: '🌟 Superstar' },
];

export const INITIAL_USER = {
  id: 'usr_current',
  username: 'MemeLord99',
  bio: 'Full-time meme curator & code refactoring ninja 🥷',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  isPro: false,
  isProPlus: false,
  coins: 250,
  subscribers: 42,
  following: ['CodeNinja_X', 'DoggoLover'],
  upvotedPosts: ['post_1'],
  downvotedPosts: [],
  savedPosts: ['post_2'],
};

export const AWARDS_LIST = [
  { id: 'award_lit', name: 'Lit Flame', cost: 10, icon: '🔥', description: 'This meme is straight fire!' },
  { id: 'award_rofl', name: 'ROFL Laugh', cost: 25, icon: '😂', description: 'Can’t stop laughing!' },
  { id: 'award_mindblown', name: 'Mind Blown', cost: 50, icon: '🤯', description: 'Blew my mind away!' },
  { id: 'award_legendary', name: 'Legendary', cost: 100, icon: '💎', description: 'God-tier content right here.' },
];

export const INITIAL_POSTS = [
  {
    id: 'post_1',
    title: 'Senior Dev watching Junior Dev push straight to production on Friday 4:59 PM',
    category: 'tech',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: '16/9',
    author: {
      username: 'CodeNinja_X',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      badge: 'PRO+',
      subscribers: 1280,
    },
    upvotes: 14230,
    downvotes: 184,
    userVote: 1, // 1 = upvoted, -1 = downvoted, 0 = none
    commentCount: 412,
    createdAt: '2 hours ago',
    tags: ['programming', 'humor', 'devlife', 'work'],
    isSponsored: false,
    awards: [
      { id: 'award_lit', count: 42, icon: '🔥' },
      { id: 'award_rofl', count: 18, icon: '😂' },
      { id: 'award_legendary', count: 5, icon: '💎' }
    ],
    comments: [
      {
        id: 'c_1',
        author: 'DevOps_Dave',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80',
        badge: 'PRO',
        text: 'And that is why our pipeline blocks all deployments after Thursday midnight. Learned it the hard way in 2019! 😂',
        upvotes: 520,
        createdAt: '1 hour ago',
        replies: []
      }
    ]
  },
  {
    id: 'post_sp_1',
    title: 'Level Up Your Gaming Gear with Apex Pro Wireless Setup!',
    category: 'gaming',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: '16/9',
    author: {
      username: 'ApexGamingGear',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      badge: 'SPONSORED',
      subscribers: 8500,
    },
    upvotes: 3120,
    downvotes: 42,
    userVote: 0,
    commentCount: 89,
    createdAt: 'Promoted',
    tags: ['gaming', 'setup', 'sponsored'],
    isSponsored: true,
    sponsorCta: 'Shop 30% Off Now',
    sponsorUrl: 'https://google.com',
    awards: [
      { id: 'award_lit', count: 12, icon: '🔥' }
    ],
    comments: []
  },
  {
    id: 'post_2',
    title: 'My dog whenever I open a slice of cheese from 3 rooms away',
    category: 'funny',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: '4/3',
    author: {
      username: 'DoggoLover',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'PRO',
      subscribers: 640,
    },
    upvotes: 28910,
    downvotes: 310,
    userVote: 0,
    commentCount: 654,
    createdAt: '4 hours ago',
    tags: ['dogs', 'wholesome', 'relatable', 'cheese'],
    isSponsored: false,
    awards: [
      { id: 'award_rofl', count: 98, icon: '😂' },
      { id: 'award_mindblown', count: 24, icon: '🤯' }
    ],
    comments: []
  }
];

export const ADS_DATA = [
  {
    id: 'ad_1',
    title: '🚀 Cloud Hosting $1/mo - Instant Setup & Unlimited Bandwidth',
    advertiser: 'CloudFlex Hosting',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    cta: 'Claim $100 Credit',
    url: 'https://google.com',
  }
];
