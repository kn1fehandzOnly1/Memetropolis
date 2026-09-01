import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MemeCard from './components/MemeCard';
import UploadModal from './components/UploadModal';
import CoinStoreModal from './components/monetization/CoinStoreModal';
import ProUpgradeModal from './components/monetization/ProUpgradeModal';
import TipAwardModal from './components/monetization/TipAwardModal';
import WatchEarnModal from './components/monetization/WatchEarnModal';
import ProfileModal from './components/ProfileModal';
import AdBanner from './components/monetization/AdBanner';

import { CATEGORIES } from './services/mockData';
import { StoreProvider } from './context/StoreContext';
import { useStore } from './hooks/useStore';

import { 
  Crown,
  Coins, 
  PlusCircle, 
  Home, 
  User,
  AlertCircle
} from 'lucide-react';

function AppContent() {
  const {
    user,
    activeCategory,
    setActiveCategory,
    posts,
    activeModal,
    setActiveModal,
    tipModalPost,
    setTipModalPost,
    toast,
    shouldShowAds,
    handlers,
    loading
  } = useStore();

  // Native Android Hardware Back Button Handling
  useEffect(() => {
    const handleBackButton = () => {
      if (activeModal || tipModalPost) {
        setActiveModal(null);
        setTipModalPost(null);
      } else if (activeCategory !== 'hot') {
        setActiveCategory('hot');
      } else {
        if (window.Capacitor?.Plugins?.App) {
          window.Capacitor.Plugins.App.exitApp();
        }
      }
    };

    let handler;
    if (window.Capacitor?.Plugins?.App) {
      handler = window.Capacitor.Plugins.App.addListener('backButton', handleBackButton);
    } else {
      document.addEventListener('backbutton', handleBackButton);
    }

    return () => {
      if (handler && typeof handler.remove === 'function') {
        handler.remove();
      } else {
        document.removeEventListener('backbutton', handleBackButton);
      }
    };
  }, [activeModal, tipModalPost, activeCategory, setActiveModal, setTipModalPost, setActiveCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-cyan-400 font-black tracking-widest uppercase text-xs">Loading ViralDrop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-4 flex gap-6 pt-4 pb-20 md:pb-8">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Main Meme Feed */}
        <main className="flex-1 max-w-2xl mx-auto w-full min-w-0">
          {/* Feed Header Banner */}
          <div className="flex items-center justify-between px-2 py-3 mb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-white font-outfit capitalize flex items-center space-x-2">
                <span>{activeCategory} Feed</span>
              </h1>
              <span className="text-xs bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full">
                {posts.length} Memes
              </span>
            </div>

            {shouldShowAds && (
              <button
                onClick={() => setActiveModal('pro')}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center space-x-1"
              >
                <Crown size={14} />
                <span className="hidden sm:inline">Go Ad-Free</span>
              </button>
            )}
          </div>

          {/* Posts Feed */}
          {posts.length === 0 ? (
            <div className="p-12 text-center bg-[#14141c] rounded-2xl border border-slate-800 space-y-3">
              <AlertCircle size={36} className="mx-auto text-slate-500" />
              <h3 className="font-extrabold text-lg text-slate-200">No Memes Found</h3>
              <p className="text-xs text-slate-400">
                Try searching for something else or be the first to upload a meme in this category!
              </p>
              <button
                onClick={() => setActiveModal('upload')}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold px-4 py-2 rounded-xl text-xs"
              >
                Post a Meme Now
              </button>
            </div>
          ) : (
            <div>
              {posts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <MemeCard post={post} />

                  {/* Periodically inject native In-Feed Ad Banner every 2 posts */}
                  {(index + 1) % 2 === 0 && (
                    <AdBanner index={Math.floor(index / 2)} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </main>

        {/* Right Supplemental Sidebar */}
        <aside className="w-72 hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto space-y-5 py-2">
          <div className="p-4 rounded-2xl bg-[#14141c] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Coins size={14} className="text-amber-400" />
                <span>Weekly Top Tippers</span>
              </h3>
              <span className="text-[10px] text-cyan-400 font-bold">LIVE</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-amber-400 text-xs">1</span>
                  <span className="font-bold text-slate-200">MemeKing_99</span>
                </div>
                <span className="font-extrabold text-amber-400">4,200 🪙</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-slate-400 text-xs">2</span>
                  <span className="font-bold text-slate-200">GagMaster</span>
                </div>
                <span className="font-extrabold text-amber-400">2,850 🪙</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-amber-600 text-xs">3</span>
                  <span className="font-bold text-slate-200">CryptoLOL</span>
                </div>
                <span className="font-extrabold text-amber-400">1,900 🪙</span>
              </div>
            </div>
          </div>

          {shouldShowAds && (
            <div className="p-4 rounded-2xl bg-[#14141c] border border-slate-800 text-center space-y-2">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PROMO SLOT</div>
              <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80" 
                alt="Ad" 
                className="w-full h-32 object-cover rounded-xl"
              />
              <h4 className="font-black text-xs text-white">Join ViralDrop Discord</h4>
              <button 
                onClick={() => window.open('https://google.com', '_blank')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-2 rounded-xl text-xs"
              >
                Join Server
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e0e13]/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around py-2.5 px-4 shadow-2xl">
        <button
          onClick={() => setActiveCategory('hot')}
          className={`flex flex-col items-center space-y-0.5 text-xs font-bold ${
            activeCategory === 'hot' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveModal('profile')}
          className={`flex flex-col items-center space-y-0.5 text-xs font-bold ${
            activeModal === 'profile' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <User size={20} />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveModal('upload')}
          className="bg-cyan-500 text-black p-2.5 rounded-full shadow-lg shadow-cyan-500/30 transform -translate-y-2 hover:scale-110 transition-transform"
        >
          <PlusCircle size={22} />
        </button>

        <button
          onClick={() => setActiveModal('coins')}
          className={`flex flex-col items-center space-y-0.5 text-xs font-bold ${
            activeModal === 'coins' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Coins size={20} />
          <span>Coins</span>
        </button>

        <button
          onClick={() => setActiveModal('pro')}
          className={`flex flex-col items-center space-y-0.5 text-xs font-bold ${
            activeModal === 'pro' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Crown size={20} />
          <span>PRO</span>
        </button>
      </nav>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-4 z-50 bg-cyan-500 text-black font-extrabold px-4 py-2.5 rounded-2xl shadow-2xl text-xs animate-in slide-in-from-right duration-200">
          {toast}
        </div>
      )}

      {/* Modals */}
      <UploadModal
        isOpen={activeModal === 'upload'}
        onClose={() => setActiveModal(null)}
      />

      <CoinStoreModal
        isOpen={activeModal === 'coins'}
        onClose={() => setActiveModal(null)}
      />

      <ProUpgradeModal
        isOpen={activeModal === 'pro'}
        onClose={() => setActiveModal(null)}
      />

      <TipAwardModal
        isOpen={!!tipModalPost}
        onClose={() => setTipModalPost(null)}
      />

      <WatchEarnModal
        isOpen={activeModal === 'watch-earn'}
        onClose={() => setActiveModal(null)}
      />

      <ProfileModal
        isOpen={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
