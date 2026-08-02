import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { ADS_DATA } from '../../services/mockData';

export default function AdBanner({ isPro, onOpenProModal, index = 0 }) {
  if (isPro) return null; // Ads automatically hidden for 9GAG PRO users!

  const ad = ADS_DATA[index % ADS_DATA.length];

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#181824] via-[#151520] to-[#181824] border border-slate-800 p-4 mb-5 shadow-lg relative overflow-hidden group">
      <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-wider text-slate-500 mb-2">
        <span className="flex items-center space-x-1">
          <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">ADVERTISEMENT</span>
          <span>•</span>
          <span>{ad.advertiser}</span>
        </span>
        <button 
          onClick={onOpenProModal}
          className="text-amber-400 hover:text-amber-300 font-extrabold normal-case flex items-center space-x-1"
        >
          <Sparkles size={12} />
          <span>Remove Ads with PRO</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <img 
          src={ad.imageUrl} 
          alt={ad.title} 
          className="w-full sm:w-36 h-24 object-cover rounded-xl shrink-0"
        />
        <div className="flex-1 space-y-2">
          <h4 className="font-extrabold text-sm text-white leading-snug">{ad.title}</h4>
          <a
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition-transform hover:scale-105"
          >
            <span>{ad.cta}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
