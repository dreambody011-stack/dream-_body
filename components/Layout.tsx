import React from 'react';
import { Dumbbell, LogOut, Menu, X } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  view: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, view, setView, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinkClass = "block py-2 px-4 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors cursor-pointer";

  return (
    <div className="min-h-screen bg-background text-slate-200 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => view === 'PUBLIC' ? window.scrollTo(0,0) : setView('PUBLIC')}
            >
               <div className="h-10 w-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-cyan-500/20">
                  <Dumbbell className="text-white h-6 w-6" />
               </div>
               <span className="font-bold text-xl tracking-wider text-white">DREAM<span className="text-cyan-500">BODY</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {view === 'PUBLIC' && (
                <>
                  <button onClick={() => setView('LOGIN')} className="text-sm font-medium hover:text-cyan-400 transition-colors">Client Login</button>
                  <button 
                    onClick={() => setView('LOGIN')}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-cyan-900/50"
                  >
                    Join Now
                  </button>
                </>
              )}
              
              {(view === 'ADMIN' || view === 'CLIENT') && (
                <button 
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {view === 'PUBLIC' && (
                <button 
                  onClick={() => { setView('LOGIN'); setIsMenuOpen(false); }}
                  className={`${navLinkClass} w-full text-left`}
                >
                  Client Portal
                </button>
              )}
               {(view === 'ADMIN' || view === 'CLIENT') && (
                <button 
                  onClick={() => { onLogout(); setIsMenuOpen(false); }}
                  className={`${navLinkClass} w-full text-left text-red-400`}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Dream Body Fitness. All rights reserved.</p>
          <p className="text-slate-600 text-xs mt-2">Built for the Elite.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
