import React from 'react';
import { ViewMode, User } from '../types';

interface NavbarProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  cartCount: number;
  onCartToggle: () => void;
  onShareToggle: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onAuthToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  view, setView, cartCount, onCartToggle, onShareToggle, currentUser, onLogout, onAuthToggle 
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-3xl border-b border-slate-100/50 px-4 md:px-12 py-4 md:py-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4 cursor-pointer group" onClick={() => setView(ViewMode.STOREFRONT)}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-xl shadow-indigo-200 transition-transform group-hover:scale-105">HI</div>
          <h1 className="hidden sm:block text-xl md:text-2xl font-black tracking-tighter text-slate-900 uppercase">Hussain Innovat</h1>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          {currentUser && (
            <button 
              onClick={onShareToggle}
              className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all flex items-center gap-2"
              title="Share Store Link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Share Store</span>
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center space-x-2 md:space-x-3">
               <button 
                onClick={() => setView(view === ViewMode.STOREFRONT ? ViewMode.ADMIN : ViewMode.STOREFRONT)}
                className={`px-4 md:px-6 py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${view === ViewMode.STOREFRONT ? 'bg-slate-950 text-white shadow-xl' : 'bg-white text-slate-900 border border-slate-200'}`}
              >
                {view === ViewMode.STOREFRONT ? 'Admin Hub' : 'View Store'}
              </button>
              <button onClick={onLogout} className="p-2 md:p-3 text-slate-300 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={onAuthToggle}
              className="px-4 md:px-6 py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-slate-50 text-slate-400 hover:text-indigo-600 border border-slate-100"
            >
              Owner Login
            </button>
          )}

          <div className="h-8 w-px bg-slate-100"></div>

          <button onClick={onCartToggle} className="relative p-3 md:p-3.5 bg-slate-950 text-white rounded-xl md:rounded-2xl shadow-2xl hover:scale-110 active:scale-90 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;