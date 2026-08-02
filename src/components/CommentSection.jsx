import React, { useState } from 'react';
import { Send, ThumbsUp, CornerDownRight, Crown } from 'lucide-react';

export default function CommentSection({ postId, comments, user, onAddComment }) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddComment(inputText);
    setInputText('');
  };

  return (
    <div className="bg-[#0e0e13] border-t border-slate-800 p-4 space-y-4 animate-in fade-in duration-200">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <img 
          src={user.avatar} 
          alt={user.username} 
          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700" 
        />
        <input
          type="text"
          placeholder="Write a funny comment..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#161620] text-slate-100 placeholder-slate-500 px-4 py-2 rounded-full border border-slate-800 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-extrabold p-2 rounded-full transition-all"
        >
          <Send size={14} />
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-3 pt-2">
        {comments.length === 0 ? (
          <p className="text-slate-500 text-xs text-center py-2 italic">
            No comments yet. Be the first to drop a meme response!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start space-x-3 bg-[#13131a] p-3 rounded-xl border border-slate-800/60">
                <img 
                  src={comment.avatar} 
                  alt={comment.author} 
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" 
                />

                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs text-slate-200">{comment.author}</span>
                    {comment.badge && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                        comment.badge === 'PRO+' ? 'badge-pro-plus' : 'badge-pro'
                      }`}>
                        {comment.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">• {comment.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{comment.text}</p>

                  <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-400">
                    <button className="flex items-center space-x-1 hover:text-cyan-400">
                      <ThumbsUp size={12} />
                      <span>{comment.upvotes}</span>
                    </button>
                    <button className="hover:text-slate-200">Reply</button>
                  </div>
                </div>
              </div>

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-6 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start space-x-2 bg-[#171722] p-2.5 rounded-xl border border-slate-800/40">
                      <CornerDownRight size={14} className="text-slate-600 shrink-0 mt-1" />
                      <img 
                        src={reply.avatar} 
                        alt={reply.author} 
                        className="w-6 h-6 rounded-full object-cover shrink-0" 
                      />
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-[11px] text-slate-200">{reply.author}</span>
                          <span className="text-[10px] text-slate-500">• {reply.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-300">{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
