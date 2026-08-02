import React, { useState } from 'react';
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  Gift, 
  Crown, 
  ExternalLink,
  Check,
  Bookmark,
  UserPlus,
  UserCheck
} from 'lucide-react';
import CommentSection from './CommentSection';

export default function MemeCard({ 
  post, 
  onVote, 
  onOpenTipModal, 
  user,
  onAddComment,
  onToggleSubscribe,
  isSubscribed
}) {
  const [showComments, setShowComments] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSelf = post.author.username === user.username;

  return (
    <article className={`rounded-2xl bg-[#14141a] border ${post.isSponsored ? 'border-amber-500/40 shadow-amber-500/5' : 'border-slate-800/80'} overflow-hidden shadow-xl hover:border-slate-700/80 transition-all mb-5 group`}>
      {/* Header Info */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/40">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={post.author.avatar} 
              alt={post.author.username} 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800"
            />
            {post.author.badge === 'PRO+' && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-[9px] font-black text-white">
                +
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-slate-100 hover:text-cyan-400 transition-colors cursor-pointer">
                {post.author.username}
              </span>

              {post.author.badge && post.author.badge !== 'SPONSORED' && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                  post.author.badge === 'PRO+' ? 'badge-pro-plus' : 'badge-pro'
                }`}>
                  {post.author.badge}
                </span>
              )}

              {post.isSponsored && (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black">
                  SPONSORED
                </span>
              )}

              {/* Subscribe Button */}
              {!isSelf && !post.isSponsored && (
                <button
                  onClick={() => onToggleSubscribe(post.author.username)}
                  className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold transition-all ml-1 ${
                    isSubscribed
                      ? 'bg-slate-800 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400'
                      : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black border border-cyan-500/40'
                  }`}
                >
                  {isSubscribed ? (
                    <>
                      <UserCheck size={12} />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={12} />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <span className="capitalize text-slate-400 font-bold">{post.category}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
              {post.author.subscribers && (
                <>
                  <span>•</span>
                  <span className="text-slate-400">{post.author.subscribers} Subs</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Save Bookmark */}
        <button 
          onClick={() => setSaved(!saved)}
          className={`p-2 rounded-xl transition-colors ${saved ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
        >
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Post Title & Tags */}
      <div className="px-4 py-3">
        <h2 className="font-extrabold text-base sm:text-lg text-white leading-snug tracking-tight mb-2">
          {post.title}
        </h2>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-semibold text-slate-400 hover:text-cyan-400 cursor-pointer bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-800">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media Renderer */}
      <div className="relative bg-black flex items-center justify-center overflow-hidden max-h-[600px]">
        {post.type === 'video' ? (
          <video 
            src={post.mediaUrl} 
            controls 
            autoPlay 
            muted 
            loop 
            className="w-full max-h-[600px] object-contain"
          />
        ) : (
          <img 
            src={post.mediaUrl} 
            alt={post.title}
            className="w-full max-h-[600px] object-contain transition-transform duration-300 group-hover:scale-[1.005]"
            loading="lazy"
          />
        )}

        {/* Sponsored CTA Overlay */}
        {post.isSponsored && (
          <a
            href={post.sponsorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-xl transition-transform hover:scale-105"
          >
            <span>{post.sponsorCta || 'Learn More'}</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Awards Badges Bar */}
      {post.awards && post.awards.length > 0 && (
        <div className="px-4 py-2 bg-[#101015] border-t border-slate-800/40 flex items-center space-x-3 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-500 shrink-0">Awards:</span>
          <div className="flex items-center space-x-2">
            {post.awards.map((award) => (
              <span 
                key={award.id} 
                className="flex items-center space-x-1 bg-slate-800/60 border border-slate-700/50 px-2 py-0.5 rounded-full text-xs font-bold text-slate-200"
              >
                <span>{award.icon}</span>
                <span className="text-[11px] text-amber-400 font-extrabold">{award.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Engagement & Monetization Controls Bar */}
      <div className="p-3 bg-[#111116] border-t border-slate-800/60 flex items-center justify-between">
        {/* Voting Group */}
        <div className="flex items-center space-x-1 bg-slate-900/90 rounded-full p-1 border border-slate-800">
          <button
            onClick={() => onVote(post.id, 1)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full font-black text-xs transition-all ${
              post.userVote === 1
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-orange-400 hover:bg-slate-800'
            }`}
          >
            <ArrowBigUp size={18} fill={post.userVote === 1 ? 'currentColor' : 'none'} />
            <span>{post.upvotes > 0 ? post.upvotes.toLocaleString() : 'Upvote'}</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-800" />

          <button
            onClick={() => onVote(post.id, -1)}
            className={`p-1.5 rounded-full font-black text-xs transition-all ${
              post.userVote === -1
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
            }`}
          >
            <ArrowBigDown size={18} fill={post.userVote === -1 ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Action Buttons: Tip Award, Comments, Share */}
        <div className="flex items-center space-x-2">
          {/* Tip / Award Creator Button */}
          <button
            onClick={() => onOpenTipModal(post)}
            className="flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-full font-bold text-xs transition-all hover:scale-105"
            title="Tip Creator with Awards"
          >
            <Gift size={16} className="text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Tip</span>
          </button>

          {/* Comments Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition-all ${
              showComments
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 bg-slate-900 border border-slate-800'
            }`}
          >
            <MessageSquare size={16} />
            <span>{post.commentCount}</span>
          </button>

          {/* Share Link */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all"
            title="Share Meme"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Comment Thread */}
      {showComments && (
        <CommentSection
          postId={post.id}
          comments={post.comments || []}
          user={user}
          onAddComment={(text) => onAddComment(post.id, text)}
        />
      )}
    </article>
  );
}
