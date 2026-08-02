import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Crown, 
  Coins, 
  Sparkles, 
  Users, 
  Bookmark, 
  Image as ImageIcon, 
  CheckCircle,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { SUBSCRIBER_MILESTONES } from '../services/mockData';

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  user, 
  posts, 
  followingList, 
  onOpenProModal, 
  onOpenCoinStore,
  onOpenWatchEarn 
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const nextMilestone = SUBSCRIBER_MILESTONES.find(m => m.count > user.subscribers) || SUBSCRIBER_MILESTONES[SUBSCRIBER_MILESTONES.length - 1];
  const progressPercent = Math.min(100, Math.round((user.subscribers / nextMilestone.count) * 100));

  const myPosts = posts.filter(p => p.author.username === user.username);
  const savedPosts = posts.filter(p => user.savedPosts?.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121219] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-700 relative p-4 flex items-start justify-between">
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>{user.isPro || user.isProPlus ? 'Ad-Free Account' : 'Standard Member'}</span>
          </div>

          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg bg-black/40 backdrop-blur-md">
            <X size={20} />
          </button>
        </div>

        {/* User Info Bar */}
        <div className="px-6 pb-4 pt-0 relative flex-1 overflow-y-auto">
          {/* Avatar & Badges Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-3">
            <div className="flex items-end space-x-4">
              <div className="relative">
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className={`w-20 h-20 rounded-full object-cover ring-4 ${user.isProPlus ? 'ring-pink-500 shadow-lg shadow-pink-500/30' : user.isPro ? 'ring-amber-400' : 'ring-slate-800'}`}
                />
                {(user.isPro || user.isProPlus) && (
                  <div className={`absolute bottom-0 right-0 p-1 rounded-full text-[10px] font-black ${user.isProPlus ? 'badge-pro-plus' : 'badge-pro'}`}>
                    <Crown size={12} />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-black text-xl text-white font-outfit">{user.username}</h2>
                  {user.isProPlus && (
                    <span className="badge-pro-plus px-2 py-0.5 rounded text-[10px]">PRO+</span>
                  )}
                  {user.isPro && !user.isProPlus && (
                    <span className="badge-pro px-2 py-0.5 rounded text-[10px]">PRO</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{user.bio}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              {!user.isPro && (
                <button
                  onClick={onOpenProModal}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 text-black font-extrabold px-3.5 py-1.5 rounded-full text-xs flex items-center space-x-1 shadow-md"
                >
                  <Crown size={14} />
                  <span>Go Ad-Free</span>
                </button>
              )}
              <button
                onClick={onOpenCoinStore}
                className="bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold px-3 py-1.5 rounded-full text-xs flex items-center space-x-1"
              >
                <Coins size={14} />
                <span>{user.coins} Coins</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-[#171722] border border-slate-800 text-center mb-5">
            <div>
              <div className="font-black text-lg text-white">{user.subscribers}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subscribers</div>
            </div>
            <div>
              <div className="font-black text-lg text-white">{user.following?.length || 0}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Following</div>
            </div>
            <div>
              <div className="font-black text-lg text-amber-400">{user.coins}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Coin Balance</div>
            </div>
          </div>

          {/* Subscriber Milestone Creator Rewards Progress Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 via-[#181824] to-indigo-900/30 border border-purple-500/30 mb-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award size={18} className="text-amber-400" />
                <h4 className="font-extrabold text-sm text-white">Creator Subscriber Milestone Rewards</h4>
              </div>
              <span className="text-xs font-black text-amber-400">+{nextMilestone.rewardCoins} COINS BONUS</span>
            </div>

            <p className="text-xs text-slate-300">
              Reach <span className="font-bold text-white">{nextMilestone.count} subscribers</span> to unlock the <span className="text-cyan-400 font-bold">{nextMilestone.title}</span> milestone and receive <span className="text-amber-400 font-extrabold">+{nextMilestone.rewardCoins} Free Coins</span>!
            </p>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-extrabold text-slate-400">
                <span>{user.subscribers} / {nextMilestone.count} Subscribers</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-amber-400 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 mb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 font-extrabold text-xs border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'overview'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon size={14} />
              <span>My Memes ({myPosts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-4 py-2.5 font-extrabold text-xs border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'subscriptions'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Users size={14} />
              <span>Subscriptions ({user.following?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2.5 font-extrabold text-xs border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'saved'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark size={14} />
              <span>Saved ({savedPosts.length})</span>
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {myPosts.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-6">
                  You haven’t published any memes yet. Click the POST button to upload your first meme!
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {myPosts.map(post => (
                    <div key={post.id} className="rounded-xl overflow-hidden bg-[#171722] border border-slate-800 p-2">
                      <img src={post.mediaUrl} alt={post.title} className="w-full h-28 object-cover rounded-lg mb-2" />
                      <div className="font-bold text-xs text-white line-clamp-1">{post.title}</div>
                      <div className="text-[10px] text-amber-400 font-extrabold mt-1">▲ {post.upvotes} Upvotes</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-2">
              {(!user.following || user.following.length === 0) ? (
                <p className="text-slate-500 text-xs text-center py-6">
                  You are not subscribed to any meme creators yet. Click Subscribe on any post in your feed!
                </p>
              ) : (
                user.following.map(username => (
                  <div key={username} className="flex items-center justify-between p-3 rounded-xl bg-[#171722] border border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                        {username[0]}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-white">@{username}</div>
                        <div className="text-[10px] text-slate-400">Creator • Memetropolis</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle size={14} />
                      <span>Subscribed</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-3">
              {savedPosts.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-6">
                  No saved memes. Click the bookmark icon on any post to save it for later!
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {savedPosts.map(post => (
                    <div key={post.id} className="rounded-xl overflow-hidden bg-[#171722] border border-slate-800 p-2">
                      <img src={post.mediaUrl} alt={post.title} className="w-full h-28 object-cover rounded-lg mb-2" />
                      <div className="font-bold text-xs text-white line-clamp-1">{post.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
