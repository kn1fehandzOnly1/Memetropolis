import React, { useState } from 'react';
import { X, Coins, CheckCircle, Sparkles, ShieldCheck, Play } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { COIN_PACKS } from '../../services/monetizationService';

export default function CoinStoreModal({ isOpen, onClose }) {
  const { user, handlers, setActiveModal } = useStore();
  const [selectedPack, setSelectedPack] = useState(COIN_PACKS[1]);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handlePurchase = () => {
    handlers.handleBuyCoins(selectedPack.coins);
    setSuccessMsg(`Successfully added +${selectedPack.coins} ViralDrop Coins to your balance!`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#14141c] border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Coins size={24} className="animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-xl text-white font-outfit">ViralDrop Coin Store</h3>
              <p className="text-xs text-slate-400 font-medium">Use coins to award & tip top meme creators!</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Current Balance Banner */}
          <div className="p-3 rounded-2xl bg-[#1b1b26] border border-amber-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Your Coin Balance:</span>
            <div className="flex items-center space-x-1.5 font-black text-lg text-amber-400">
              <Coins size={20} />
              <span>{user.coins} Coins</span>
            </div>
          </div>

          {/* Watch Ad Free Coins Banner */}
          <div className="p-3 rounded-2xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Play size={16} className="text-pink-400 fill-current" />
              <div>
                <div className="text-xs font-extrabold text-white">Don’t want to purchase?</div>
                <div className="text-[11px] text-purple-300 font-bold">Watch a 10s video ad for +50 Free Coins</div>
              </div>
            </div>
            <button
              onClick={() => setActiveModal('watch-earn')}
              className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-md"
            >
              Watch Ad
            </button>
          </div>

          {/* Success Notification */}
          {successMsg ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center space-x-2 animate-in zoom-in-95 duration-150">
              <CheckCircle size={20} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          ) : (
            <>
              {/* Coin Packs Grid */}
              <div className="grid grid-cols-2 gap-3">
                {COIN_PACKS.map((pack) => {
                  const isSelected = selectedPack.id === pack.id;
                  return (
                    <div
                      key={pack.id}
                      onClick={() => setSelectedPack(pack)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10 scale-[1.02]'
                          : 'bg-[#181822] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {pack.badge && (
                        <span className="absolute -top-2.5 right-3 bg-amber-500 text-black font-black text-[9px] px-2 py-0.5 rounded-full shadow">
                          {pack.badge}
                        </span>
                      )}

                      <div className="flex items-center space-x-2 mb-2">
                        <Coins size={20} className="text-amber-400" />
                        <span className="font-black text-lg text-white">{pack.coins}</span>
                      </div>

                      <div className="font-extrabold text-sm text-cyan-400">{pack.price}</div>
                    </div>
                  );
                })}
              </div>

              {/* Checkout Security Disclaimer */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 justify-center pt-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Instant Billing / Card Checkout</span>
              </div>

              {/* Buy Button */}
              <button
                onClick={handlePurchase}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black py-3 rounded-2xl text-sm transition-transform hover:scale-[1.02] shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2"
              >
                <Sparkles size={18} />
                <span>BUY {selectedPack.coins} COINS FOR {selectedPack.price}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
