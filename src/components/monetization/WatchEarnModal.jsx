import React, { useState, useEffect } from 'react';
import { X, Play, Coins, Sparkles, CheckCircle2, ShieldCheck, Timer } from 'lucide-react';

const SAMPLE_REWARDED_ADS = [
  {
    id: 'rad_1',
    title: 'Discover CyberQuest 2077 - Next-Gen Sci-Fi Action RPG',
    advertiser: 'CyberQuest Studios',
    duration: 10, // seconds
    coinsReward: 50,
    videoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    description: 'Play free today on Android & iOS!'
  },
  {
    id: 'rad_2',
    title: 'CloudFlex Serverless - Get $100 Free Cloud Credits',
    advertiser: 'CloudFlex Infrastructure',
    duration: 8,
    coinsReward: 35,
    videoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    description: 'Deploy high speed node servers in under 60 seconds.'
  },
  {
    id: 'rad_3',
    title: 'Apex Pro Wireless Mechanical Keyboard & Gaming Mouse',
    advertiser: 'Apex Gaming Gear',
    duration: 12,
    coinsReward: 75,
    videoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    description: 'Ultra-low latency RGB wireless gear engineered for pros.'
  }
];

export default function WatchEarnModal({ isOpen, onClose, onRewardEarned, userCoins }) {
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [completed, setCompleted] = useState(false);
  const [adsWatchedToday, setAdsWatchedToday] = useState(1);
  const maxDailyAds = 5;

  const currentAd = SAMPLE_REWARDED_ADS[activeAdIndex % SAMPLE_REWARDED_ADS.length];

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setCompleted(true);
      onRewardEarned(currentAd.coinsReward);
      setAdsWatchedToday((prev) => prev + 1);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  if (!isOpen) return null;

  const handleStartWatch = () => {
    setTimeLeft(currentAd.duration);
    setIsPlaying(true);
    setCompleted(false);
  };

  const handleNextAd = () => {
    setActiveAdIndex((prev) => prev + 1);
    setCompleted(false);
    setIsPlaying(false);
    setTimeLeft(SAMPLE_REWARDED_ADS[(activeAdIndex + 1) % SAMPLE_REWARDED_ADS.length].duration);
  };

  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentAd.duration - timeLeft) / currentAd.duration) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121219] border border-amber-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-500/20 via-orange-600/20 to-purple-600/20 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Coins size={22} className="animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white font-outfit">Watch Ads & Earn Coins</h3>
              <p className="text-[11px] text-slate-400">Rewarded Ad Network • Daily limit {adsWatchedToday}/{maxDailyAds}</p>
            </div>
          </div>
          {!isPlaying && (
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Ad Container Player */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center group">
            <img 
              src={currentAd.videoUrl} 
              alt={currentAd.title} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-90 scale-105' : 'opacity-60'}`}
            />

            {/* Play Overlay Before Start */}
            {!isPlaying && !completed && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer" onClick={handleStartWatch}>
                  <Play size={28} className="ml-1 fill-current" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-extrabold text-sm text-white">{currentAd.title}</span>
                  <p className="text-xs text-amber-400 font-bold flex items-center justify-center space-x-1">
                    <Coins size={14} />
                    <span>Reward: +{currentAd.coinsReward} Free Coins</span>
                  </p>
                </div>
              </div>
            )}

            {/* Playing State HUD */}
            {isPlaying && (
              <div className="absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-t from-black/80 via-transparent to-black/60">
                <div className="flex items-center justify-between text-xs font-extrabold text-white">
                  <span className="bg-amber-500 text-black px-2 py-0.5 rounded-full text-[10px]">REWARDED AD</span>
                  <div className="flex items-center space-x-1 bg-black/70 px-2.5 py-1 rounded-full text-amber-400">
                    <Timer size={14} />
                    <span>{timeLeft}s</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Completed Reward View */}
            {completed && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-2 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="font-black text-lg text-white">Reward Earned!</h4>
                <p className="text-xs font-bold text-amber-400 flex items-center justify-center space-x-1">
                  <Coins size={16} />
                  <span>+{currentAd.coinsReward} Memetropolis Coins Added!</span>
                </p>
              </div>
            )}
          </div>

          {/* Ad Info Details */}
          <div className="bg-[#171722] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Sponsor</span>
              <div className="font-extrabold text-white">{currentAd.advertiser}</div>
              <p className="text-[11px] text-slate-400">{currentAd.description}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Reward</span>
              <div className="font-black text-amber-400 text-sm flex items-center justify-end space-x-1">
                <Coins size={14} />
                <span>+{currentAd.coinsReward}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            {!isPlaying && !completed && (
              <button
                onClick={handleStartWatch}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black py-3 rounded-2xl text-sm transition-transform hover:scale-[1.01] shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2"
              >
                <Play size={18} className="fill-current" />
                <span>WATCH VIDEO AD FOR +{currentAd.coinsReward} COINS</span>
              </button>
            )}

            {completed && (
              <div className="flex space-x-3">
                <button
                  onClick={handleNextAd}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <Sparkles size={16} />
                  <span>WATCH NEXT AD (+50 COINS)</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
