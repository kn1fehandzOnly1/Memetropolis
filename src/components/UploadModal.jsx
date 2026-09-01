import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { CATEGORIES } from '../services/mockData';
import { StorageAdapter } from '../services/backend/storageAdapter';

export default function UploadModal({ isOpen, onClose }) {
  const { handlers, showToast } = useStore();
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [category, setCategory] = useState('memes');
  const [tags, setTags] = useState('funny, viral');
  const [type, setType] = useState('image');

  // File Upload States
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      const url = await StorageAdapter.uploadMedia(file, 'memes', (progress) => {
        setUploadProgress(progress);
      });
      setMediaUrl(url);
      showToast('Image uploaded successfully! 🚀');
    } catch (error) {
      showToast('Failed to upload image. Please try again or use a URL.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !mediaUrl.trim()) {
      showToast('Please provide a title and media content.');
      return;
    }

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

          {/* Mode Selector (File vs URL) */}
          <div className="flex bg-[#1b1b26] p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                uploadMode === 'file' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload size={14} />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                uploadMode === 'url' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LinkIcon size={14} />
              <span>Media URL</span>
            </button>
          </div>

          {/* File Upload Mode */}
          {uploadMode === 'file' ? (
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                Select Image or GIF *
              </label>
              <div className="relative border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 text-center bg-[#1b1b26]/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="flex flex-col items-center space-y-2">
                  {uploading ? (
                    <>
                      <Loader2 size={28} className="text-cyan-400 animate-spin" />
                      <span className="text-xs font-bold text-cyan-400">Uploading... {uploadProgress}%</span>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="bg-cyan-500 h-full transition-all duration-150"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={28} className="text-slate-500" />
                      <span className="text-xs font-bold text-slate-300">Click or drag image to upload</span>
                      <span className="text-[10px] text-slate-500">Supports PNG, JPG, GIF up to 10MB</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Media URL Mode */
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                Image or GIF URL *
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
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
          )}

          {/* Preview Window */}
          {mediaUrl && (
            <div className="rounded-xl overflow-hidden bg-black max-h-48 border border-slate-800 flex items-center justify-center relative">
              <img 
                src={mediaUrl} 
                alt="Preview" 
                className="max-h-48 object-contain"
              />
              <button
                type="button"
                onClick={() => setMediaUrl('')}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1 rounded-full backdrop-blur-md"
              >
                <X size={14} />
              </button>
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
              disabled={uploading || !mediaUrl}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
