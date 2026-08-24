import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { CATEGORIES } from '../services/mockData';

export default function UploadModal({ isOpen, onClose }) {
  const { handlers } = useStore();
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [category, setCategory] = useState('memes');
  const [tags, setTags] = useState('funny, viral');
  const [type, setType] = useState('image');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !mediaUrl.trim()) return;

    handlers.handleUploadMeme({
      title,
      mediaUrl,
      category,
      type,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    onClose();
  };

  const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#14141c] border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
              +
            </div>
            <h3 className="font-extrabold text-lg text-white font-outfit">Upload a Meme</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Meme Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. When you fix a bug and 3 new ones appear..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1b1b26] text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          {/* Media URL Input & Quick Samples */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Image or GIF URL *
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="flex-1 bg-[#1b1b26] text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>

            {/* Quick Presets */}
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-[11px] text-slate-500 font-semibold">Or use sample:</span>
              {SAMPLE_IMAGES.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMediaUrl(url)}
                  className="text-[10px] bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-300 font-bold px-2 py-1 rounded-md"
                >
                  Sample #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Window */}
          {mediaUrl && (
            <div className="rounded-xl overflow-hidden bg-black max-h-48 border border-slate-800 flex items-center justify-center">
              <img 
                src={mediaUrl} 
                alt="Preview" 
                className="max-h-48 object-contain"
              />
            </div>
          )}

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#1b1b26] text-slate-100 px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-sm capitalize"
            >
              {CATEGORIES.filter(c => c.id !== 'hot' && c.id !== 'trending' && c.id !== 'fresh').map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="programming, gaming, funny"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[#1b1b26] text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
