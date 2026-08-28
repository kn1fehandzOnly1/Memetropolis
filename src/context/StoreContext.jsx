import React, { createContext, useState, useEffect, useCallback } from 'react';
import { feedEngine } from '../services/feedEngine';
import { monetizationService } from '../services/monetizationService';
import { AuthService } from '../services/backend/authService';

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);

  // Modals state
  const [activeModal, setActiveModal] = useState(null);
  const [tipModalPost, setTipModalPost] = useState(null);

  // Toast notifications state
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  // Sync Auth State & Profile
  useEffect(() => {
    const unsubscribe = AuthService.subscribeToAuthState((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe && typeof unsubscribe === 'function' && unsubscribe();
  }, []);

  // Subscribe to real-time feed
  useEffect(() => {
    const unsubscribe = feedEngine.subscribeToFeed(activeCategory, (updatedPosts) => {
      let filtered = updatedPosts;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = updatedPosts.filter(p =>
          p.title?.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
        );
      }
      setPosts(filtered);
    });
    return () => unsubscribe && unsubscribe();
  }, [activeCategory, searchQuery]);

  // Handlers
  const handleLogin = useCallback(async () => {
    try {
      await AuthService.signInWithGoogle();
      showToast('Logged in successfully! 🚀');
    } catch (e) {
      showToast('Login failed. Please try again.');
    }
  }, [showToast]);

  const handleLogout = useCallback(async () => {
    try {
      await AuthService.logout();
      showToast('Logged out. See you soon!');
    } catch (e) {
      showToast('Logout failed.');
    }
  }, [showToast]);

  const handleVote = useCallback(async (postId, direction, currentVote) => {
    if (!user) return showToast('Please log in to vote!');
    await feedEngine.votePost(postId, user.id, direction, currentVote);
  }, [user, showToast]);

  const handleAddComment = useCallback(async (postId, commentText) => {
    if (!user) return showToast('Please log in to comment!');
    await feedEngine.addComment(postId, commentText, user);
    showToast('Comment posted!');
  }, [user, showToast]);

  const handleUploadMeme = useCallback(async (newPostData) => {
    if (!user) return showToast('Please log in to post!');
    await feedEngine.createPost(newPostData, user);
    setActiveModal(null);
    showToast('🚀 Your meme has been published to Fresh!');
  }, [user, showToast]);

  const handleToggleSubscribe = useCallback(async (creatorUsername) => {
    if (!user) return showToast('Please log in to subscribe!');
    const subscribedNow = await monetizationService.toggleSubscribe(user.id, creatorUsername, user.following || []);
    showToast(subscribedNow ? `Subscribed to @${creatorUsername}!` : `Unsubscribed from @${creatorUsername}`);
  }, [user, showToast]);

  const handleBuyCoins = useCallback(async (amount) => {
    if (!user) return;
    await monetizationService.addCoins(user.id, amount);
    showToast(`+${amount} Coins added to your account!`);
  }, [user, showToast]);

  const handleRewardEarned = useCallback(async (coinsReward) => {
    if (!user) return;
    await monetizationService.addCoins(user.id, coinsReward);
    showToast(`🎉 +${coinsReward} Free Coins Earned from Sponsor Ad!`);
  }, [user, showToast]);

  const handleUpgradePro = useCallback(async (tier) => {
    if (!user) return;
    await monetizationService.upgradePro(user.id, tier);
    showToast(`Welcome to VIRALDROP ${tier === 'PRO_PLUS' ? 'PRO+' : 'PRO'}! Ads removed.`);
  }, [user, showToast]);

  const handleSendAward = useCallback(async (postId, award) => {
    if (!user) return false;
    const ok = await monetizationService.spendCoins(user.id, award.cost, user.coins);
    if (!ok) {
      showToast('Insufficient coins! 🪙');
      return false;
    }

    await feedEngine.addAwardToPost(postId, award);
    showToast(`Awarded ${award.icon} ${award.name}!`);
    return true;
  }, [user, showToast]);

  const value = {
    user,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    posts,
    activeModal,
    setActiveModal,
    tipModalPost,
    setTipModalPost,
    toast,
    showToast,
    handlers: {
      handleLogin,
      handleLogout,
      handleVote,
      handleAddComment,
      handleUploadMeme,
      handleToggleSubscribe,
      handleBuyCoins,
      handleRewardEarned,
      handleUpgradePro,
      handleSendAward
    },
    loading,
    shouldShowAds: user ? !(user.isPro || user.isProPlus) : true
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
