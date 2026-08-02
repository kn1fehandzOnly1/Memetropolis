import React, { useState } from 'react';
import { 
  Flame, 
  Search, 
  PlusCircle, 
  Coins, 
  Crown, 
  Bell, 
  User, 
  Menu, 
  X,
  Play,
  Sparkles,
  Smartphone
} from 'lucide-react';

export default function Navbar({ 
  user, 
  onOpenUpload, 
  onOpenCoinStore, 
  onOpenWatchEarn,
  onOpenProModal, 
  onOpenProfile,
  searchQuery, 
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav px-4 py-2.5 flex items-center justify-between transition-all">
      {/* Left: Brand Logo & Mobile Menu Toggle */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <a href="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-black via-slate-900 to-black border-2 border-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span className="font-black text-2xl text-cyan-400 tracking-tighter">M</span>
          </div>
          <span className="font-black text-xl tracking-wider text-white hidden sm:inline font-outfit uppercase">
            MEMETROPOLIS
          </span>
        </a>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search memes, tags, gaming, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181820] text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2 rounded-full border border-slate-800 focus:outline-none focus:border-cyan-500 text-sm transition-all shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-800 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Actions: Watch Ads, Coins, Upload, PRO & User */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Watch & Earn Rewarded Ads CTA */}
        <button
          onClick={onOpenWatchEarn}
          className="hidden lg:flex items-center space-x-1.5 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/40 hover:to-indigo-600/40 border border-purple-500/40 text-purple-300 px-3 py-1.5 rounded-full text-xs font-black transition-all hover:scale-105 shadow-sm"
          title="Watch Ads & Earn Free Coins"
        >
          <Play size={14} className="text-pink-400 fill-current animate-pulse" />
          <span>EARN COINS</span>
        </button>

        {/* Coin Balance Badge */}
        <button
          onClick={onOpenCoinStore}
          className="flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
          title="Buy Memetropolis Coins"
        >
          <Coins size={16} className="text-amber-400 animate-pulse" />
          <span>{user.coins}</span>
          <span className="bg-amber-500 text-black rounded-full w-4 h-4 flex items-center justify-center font-extrabold text-[10px] ml-0.5">+</span>
        </button>

        {/* PRO / Upgrade CTA */}
        {user.isPro || user.isProPlus ? (
          <div className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wide ${user.isProPlus ? 'badge-pro-plus' : 'badge-pro'}`}>
            {user.isProPlus ? 'PRO+' : 'PRO'}
          </div>
        ) : (
          <button
            onClick={onOpenProModal}
            className="hidden md:flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-3.5 py-1.5 rounded-full text-xs font-black hover:opacity-90 transition-all shadow-md hover:scale-105"
          >
            <Crown size={15} />
            <span>GET PRO</span>
          </button>
        )}

        {/* Upload Meme Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center space-x-1 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold px-3.5 py-1.5 rounded-full text-xs transition-all shadow-md shadow-cyan-500/20 hover:scale-105"
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">POST</span>
        </button>

        {/* User Profile Avatar */}
        <div onClick={onOpenProfile} className="relative group cursor-pointer" title="View Profile & Creator Milestones">
          <div className={`w-8 h-8 rounded-full overflow-hidden ring-2 ${user.isProPlus ? 'ring-pink-500' : user.isPro ? 'ring-amber-400' : 'ring-slate-700'}`}>
            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#121217] border-b border-slate-800 p-4 shadow-2xl md:hidden animate-in slide-in-from-top duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Categories</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 p-2 rounded-lg text-sm font-semibold transition-all ${
                  activeCategory === cat.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
            <button
              onClick={() => {
                onOpenProfile();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold py-2 rounded-xl text-xs flex items-center justify-center space-x-2"
            >
              <User size={16} />
              <span>MY PROFILE & SUBSCRIBER MILESTONES</span>
            </button>

            <button
              onClick={() => {
                onOpenWatchEarn();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-purple-600/20 text-purple-300 border border-purple-500/40 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2"
            >
              <Play size={16} className="fill-current text-pink-400" />
              <span>WATCH ADS & EARN COINS (+50 COINS)</span>
            </button>

            {!user.isPro && (
              <button
                onClick={() => {
                  onOpenProModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold py-2 rounded-xl text-xs flex items-center justify-center space-x-2"
              >
                <Crown size={16} />
                <span>UPGRADE TO MEMETROPOLIS PRO (AD-FREE)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
