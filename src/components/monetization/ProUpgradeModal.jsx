import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Zap, Star } from 'lucide-react';
import { PRO_TIERS } from '../../services/monetizationService';

export default function ProUpgradeModal({ isOpen, onClose, onUpgrade, currentProTier }) {
  const [selectedTier, setSelectedTier] = useState('PRO');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onUpgrade(selectedTier);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121219] border border-amber-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative">
        {/* Glowing Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500/20 via-orange-600/20 to-purple-600/20 border-b border-slate-800 text-center relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X size={20} />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-2">
            <Crown size={32} className="text-black" />
          </div>

          <h2 className="font-black text-2xl text-white font-outfit tracking-wide">
            Upgrade to MEMETROPOLIS PRO
          </h2>
          <p className="text-xs text-slate-300 font-medium max-w-md mx-auto mt-1">
            Unlock the ultimate ad-free experience, exclusive profile badges, and monthly coin rewards!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {success ? (
            <div className="p-6 text-center space-y-2 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <Check size={28} />
              </div>
              <h3 className="font-black text-lg text-white">Upgrade Successful!</h3>
              <p className="text-xs text-slate-400">
                You are now a MEMETROPOLIS {selectedTier === 'PRO_PLUS' ? 'PRO+' : 'PRO'} Member! Ads are removed.
              </p>
            </div>
          ) : (
            <>
              {/* Tier Selection Selector */}
              <div className="grid grid-cols-2 gap-3">
                {/* PRO Plan */}
                <div
                  onClick={() => setSelectedTier('PRO')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedTier === 'PRO'
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/50 scale-[1.02]'
                      : 'bg-[#181822] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sm text-amber-400">PRO</span>
                    <Crown size={16} className="text-amber-400" />
                  </div>
                  <div className="font-black text-lg text-white mb-2">$2.99 / mo</div>
                  <span className="text-[11px] font-bold text-slate-400">100% Ad-Free + 100 Coins</span>
                </div>

                {/* PRO+ Plan */}
                <div
                  onClick={() => setSelectedTier('PRO_PLUS')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                    selectedTier === 'PRO_PLUS'
                      ? 'bg-purple-500/10 border-pink-500 ring-2 ring-pink-500/50 scale-[1.02]'
                      : 'bg-[#181822] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 badge-pro-plus text-[9px] px-2 py-0.5 rounded-full">
                    POPULAR
                  </span>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sm text-pink-400">PRO+</span>
                    <Sparkles size={16} className="text-pink-400" />
                  </div>
                  <div className="font-black text-lg text-white mb-2">$5.99 / mo</div>
                  <span className="text-[11px] font-bold text-slate-400">Glowing Avatar + 300 Coins</span>
                </div>
              </div>

              {/* Perks List */}
              <div className="bg-[#171722] p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                  Included in {selectedTier === 'PRO_PLUS' ? 'PRO+' : 'PRO'}:
                </div>
                {(selectedTier === 'PRO_PLUS' ? PRO_TIERS.PRO_PLUS.perks : PRO_TIERS.PRO.perks).map((perk, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs text-slate-200">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check size={11} />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              {/* CTA Upgrade Button */}
              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:opacity-95 text-black font-black py-3.5 rounded-2xl text-sm transition-transform hover:scale-[1.01] shadow-2xl shadow-amber-500/20 flex items-center justify-center space-x-2"
              >
                <Crown size={18} />
                <span>CONFIRM & SUBSCRIBE NOW</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
