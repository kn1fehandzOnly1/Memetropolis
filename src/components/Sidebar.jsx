import React from 'react';
import { 
  Flame, 
  TrendingUp, 
  Sparkles, 
  Laugh, 
  Image, 
  Gamepad2, 
  Tv, 
  Cpu, 
  Skull, 
  Crown,
  Play,
  Coins,
  Smartphone,
  ShieldCheck,
  Zap
} from 'lucide-react';

const ICON_MAP = {
  Flame,
  TrendingUp,
  Sparkles,
  Laugh,
  Image,
  Gamepad2,
  Tv,
  Cpu,
  Skull
};

export default function Sidebar({ 
  categories, 
  activeCategory, 
  setActiveCategory, 
  onOpenProModal, 
  onOpenWatchEarn,
  isPro 
}) {
  return (
    <aside className="w-64 hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto pr-3 py-4 space-y-6">
      {/* Category List Section */}
      <div className="space-y-1">
        <div className="px-3 text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
          Feeds & Categories
        </div>

        {categories.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Flame;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm transition-all group ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:bg-[#16161e] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconComp size={18} className={isActive ? 'text-cyan-400' : cat.color} />
                <span>{cat.name}</span>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
            </button>
          );
        })}
      </div>

      {/* Rewarded Ads Watch & Earn Widget */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 via-[#181824] to-indigo-900/40 border border-purple-500/30 shadow-lg relative overflow-hidden group">
        <div className="flex items-center space-x-1.5 text-purple-300 text-xs font-black mb-1">
          <Play size={14} className="fill-current text-pink-400" />
          <span>REWARDED ADS HUB</span>
        </div>

        <h4 className="font-black text-sm text-white mb-1">Earn Free Coins</h4>
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          Watch 10-second sponsor video ads and earn up to +75 free coins per view!
        </p>

        <button
          onClick={onOpenWatchEarn}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black py-2 rounded-xl text-xs transition-transform hover:scale-105 shadow-md flex items-center justify-center space-x-1.5"
        >
          <Coins size={14} className="text-amber-400" />
          <span>WATCH AD (+50 COINS)</span>
        </button>
      </div>

      {/* PRO Subscription Widget */}
      {!isPro && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181824] to-[#12121a] border border-amber-500/20 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Crown size={100} className="text-amber-400" />
          </div>

          <div className="flex items-center space-x-2 text-amber-400 text-xs font-black mb-1">
            <Crown size={14} />
            <span>MEMETROPOLIS PRO</span>
          </div>

          <h4 className="font-black text-sm text-white mb-1">Go Ad-Free Today</h4>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Enjoy 100% ad-free scrolling, golden badge, and 100 free monthly coins.
          </p>

          <button
            onClick={onOpenProModal}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black py-2 rounded-xl text-xs transition-transform hover:scale-105 shadow-md"
          >
            Upgrade for $2.99/mo
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="px-3 text-[11px] text-slate-600 space-y-1">
        <p>© 2026 Memetropolis Inc. • Go Fun The World</p>
        <div className="flex space-x-2 text-slate-500">
          <a href="#" className="hover:underline">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:underline">Terms</a>
          <span>•</span>
          <a href="#" className="hover:underline">Advertise</a>
        </div>
      </div>
    </aside>
  );
}
