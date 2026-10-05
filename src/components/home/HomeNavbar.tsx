import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, MessageSquare, ExternalLink, Menu, X } from 'lucide-react';

interface HomeNavbarProps {
  onNavigate: (path: string, authMsg?: string) => void;
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (path: string, msg?: string) => {
    setMobileMenuOpen(false);
    onNavigate(path, msg);
  };

  return (
    <header className="w-full max-w-[1280px] mx-auto px-3 sm:px-6 pt-3 sm:pt-4 pb-2 z-30">
      <nav 
        className="w-full px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white/[0.08] backdrop-blur-[12px] border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex items-center justify-between gap-2 sm:gap-4 relative"
        aria-label="Main Navigation"
      >
        {/* Left: Highlighted Emblem + Brand Name */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 rounded-xl bg-amber-400/40 blur-sm pointer-events-none group-hover:opacity-100 transition-opacity" />
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/25 border-2 border-amber-400/80 flex items-center justify-center p-1 sm:p-1.5 shrink-0 shadow-[0_0_16px_rgba(251,191,36,0.45)]">
              <img 
                src="/assets/mahau_icon_transparent.png" 
                alt="MahaUdyogSetu Emblem" 
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl font-bold text-white tracking-tight truncate">
                MahaUdyogSetu
              </span>
              <span className="hidden sm:inline-block text-[10px] sm:text-xs font-semibold text-orange-400 bg-orange-500/15 border border-orange-500/25 px-2 py-0.5 rounded-full shrink-0">
                महाउद्योगसेतू
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium hidden md:inline truncate">
              Government of Maharashtra • Directorate of Industries
            </span>
          </div>
        </div>

        {/* Right: Navigation Links, Language Toggle & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onNavigate('/public-dashboard', 'Please log in to view the Industrial Analytics & Public Dashboard.')}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-300" />
              <span>{t('login.publicDashboards', 'Public Dashboards')}</span>
            </button>

            <button
              onClick={() => onNavigate('/feedback', 'Please log in to submit your industrial approval feedback.')}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
              <span>{t('login.feedback', 'Feedback')}</span>
            </button>

            <button
              onClick={() => onNavigate('/main-portal', 'Please log in to access the Maharashtra Digital Gateway Main Portal.')}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{t('login.goToMainPortal', 'Main Portal')}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Language Toggle: EN | मराठी */}
          <div className="flex items-center bg-black/25 border border-white/15 rounded-xl p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-orange-500 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <span className="text-white/20 select-none">|</span>
            <button
              type="button"
              onClick={() => setLanguage('mr')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg transition-all cursor-pointer ${
                language === 'mr'
                  ? 'bg-orange-500 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="मराठी"
            >
              मराठी
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-orange-400" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl bg-[#0b1b3d]/95 backdrop-blur-xl border border-white/20 shadow-2xl z-50 flex flex-col gap-2 animate-fadeIn">
            <div className="text-[11px] font-semibold text-slate-300 pb-2 border-b border-white/10">
              Government of Maharashtra • Directorate of Industries
            </div>
            <button
              onClick={() => handleMobileNav('/public-dashboard', 'Please log in to view the Industrial Analytics & Public Dashboard.')}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors text-left flex items-center gap-2.5 min-h-[44px]"
            >
              <LayoutDashboard className="w-4 h-4 text-orange-400" />
              <span>{t('login.publicDashboards', 'Public Dashboards')}</span>
            </button>
            <button
              onClick={() => handleMobileNav('/feedback', 'Please log in to submit your industrial approval feedback.')}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors text-left flex items-center gap-2.5 min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 text-orange-400" />
              <span>{t('login.feedback', 'Feedback')}</span>
            </button>
            <button
              onClick={() => handleMobileNav('/main-portal', 'Please log in to access the Maharashtra Digital Gateway Main Portal.')}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors text-left flex items-center justify-between min-h-[44px]"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-orange-400" />
                <span>{t('login.goToMainPortal', 'Main Portal')}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">MAITRI</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

