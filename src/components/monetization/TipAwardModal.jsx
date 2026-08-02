import React, { useState } from 'react';
import { X, Gift, Coins, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { AWARDS_LIST } from '../../services/mockData';

export default function TipAwardModal({ 
  isOpen, 
  onClose, 
  post, 
  userCoins, 
  onSendAward, 
  onOpenCoinStore 
}) {
  const [selectedAward, setSelectedAward] = useState(AWARDS_LIST[0]);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !post) return null;

  const hasEnoughCoins = userCoins >= selectedAward.cost;

  const handleSend = () => {
    if (!hasEnoughCoins) return;
    const ok = onSendAward(post.id, selectedAward);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#14141c] border border-amber-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Gift size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white font-outfit">Award Creator</h3>
              <p className="text-[11px] text-slate-400">Supporting @{post.author.username}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {success ? (
            <div className="py-6 text-center space-y-2 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle size={28} />
              </div>
              <h4 className="font-extrabold text-lg text-white">Award Sent!</h4>
              <p className="text-xs text-slate-300">
                You awarded {selectedAward.icon} {selectedAward.name} to @{post.author.username}!
              </p>
            </div>
          ) : (
            <>
              {/* Wallet Info */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1b26] border border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold">Your Balance:</span>
                <div className="flex items-center space-x-1 font-black text-amber-400">
                  <Coins size={16} />
                  <span>{userCoins} Coins</span>
                </div>
              </div>

              {/* Award Selector Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {AWARDS_LIST.map((award) => {
                  const isSelected = selectedAward.id === award.id;
                  return (
                    <div
                      key={award.id}
                      onClick={() => setSelectedAward(award)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 scale-[1.02]'
                          : 'bg-[#181822] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-2xl mb-1">{award.icon}</div>
                      <div className="font-extrabold text-xs text-white">{award.name}</div>
                      <div className="text-[11px] font-bold text-amber-400 flex items-center space-x-1 mt-0.5">
                        <Coins size={12} />
                        <span>{award.cost} Coins</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 italic bg-[#101016] p-3 rounded-xl border border-slate-800/60">
                "{selectedAward.description}"
              </p>

              {/* Action Buttons */}
              {hasEnoughCoins ? (
                <button
                  onClick={handleSend}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black py-3 rounded-xl text-xs transition-transform hover:scale-[1.01] shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
                >
                  <Sparkles size={16} />
                  <span>SEND {selectedAward.icon} AWARD ({selectedAward.cost} COINS)</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-semibold justify-center">
                    <AlertCircle size={14} />
                    <span>You need {selectedAward.cost - userCoins} more coins for this award.</span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCoinStore();
                    }}
                    className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5"
                  >
                    <Coins size={16} />
                    <span>GET MORE COINS AT THE COIN STORE</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
