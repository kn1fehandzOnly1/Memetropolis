import React, { createContext, useState, useEffect, useCallback } from 'react';
import { feedEngine } from '../services/feedEngine';
import { monetizationService } from '../services/monetizationService';

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(() => monetizationService.getUser());
  const [activeCategory, setActiveCategory] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState(() => feedEngine.getPosts(activeCategory, searchQuery));

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'upload', 'coins', 'pro', 'watch-earn', 'profile'
  const [tipModalPost, setTipModalPost] = useState(null);

  // Toast notifications state
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  // Update posts when category or search changes
  useEffect(() => {
    setPosts(feedEngine.getPosts(activeCategory, searchQuery));
  }, [activeCategory, searchQuery]);

  // Handlers
  const handleVote = useCallback((postId, direction) => {
    feedEngine.votePost(postId, direction);
    setPosts(feedEngine.getPosts(activeCategory, searchQuery));
  }, [activeCategory, searchQuery]);

  const handleAddComment = useCallback((postId, commentText) => {
    feedEngine.addComment(postId, commentText, user);
    setPosts(feedEngine.getPosts(activeCategory, searchQuery));
    showToast('Comment posted!');
  }, [activeCategory, searchQuery, user, showToast]);

  const handleUploadMeme = useCallback((newPostData) => {
    feedEngine.createPost(newPostData, user);
    setPosts(feedEngine.getPosts(activeCategory, searchQuery));
    setActiveModal(null);
    showToast('🚀 Your meme has been published to Fresh!');
  }, [activeCategory, searchQuery, user, showToast]);

  const handleToggleSubscribe = useCallback((creatorUsername) => {
    const subscribedNow = monetizationService.toggleSubscribe(creatorUsername);
    setUser({ ...monetizationService.getUser() });
    showToast(subscribedNow ? `Subscribed to @${creatorUsername}!` : `Unsubscribed from @${creatorUsername}`);
  }, [showToast]);

  const handleBuyCoins = useCallback((amount) => {
    const updatedUser = monetizationService.addCoins(amount);
    setUser({ ...updatedUser });
    showToast(`+${amount} Coins added to your account!`);
  }, [showToast]);

  const handleRewardEarned = useCallback((coinsReward) => {
    const updatedUser = monetizationService.addCoins(coinsReward);
    setUser({ ...updatedUser });
    showToast(`🎉 +${coinsReward} Free Coins Earned from Sponsor Ad!`);
  }, [showToast]);

  const handleUpgradePro = useCallback((tier) => {
    const updatedUser = monetizationService.upgradePro(tier);
    setUser({ ...updatedUser });
    showToast(`Welcome to VIRALDROP ${tier === 'PRO_PLUS' ? 'PRO+' : 'PRO'}! Ads removed.`);
  }, [showToast]);

  const handleSendAward = useCallback((postId, award) => {
    const ok = monetizationService.spendCoins(award.cost);
    if (!ok) return false;

    setUser({ ...monetizationService.getUser() });
    feedEngine.addAwardToPost(postId, award);
    setPosts(feedEngine.getPosts(activeCategory, searchQuery));
    showToast(`Awarded ${award.icon} ${award.name}!`);
    return true;
  }, [activeCategory, searchQuery, showToast]);

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
      handleVote,
      handleAddComment,
      handleUploadMeme,
      handleToggleSubscribe,
      handleBuyCoins,
      handleRewardEarned,
      handleUpgradePro,
      handleSendAward
    },
    shouldShowAds: monetizationService.shouldShowAds()
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
