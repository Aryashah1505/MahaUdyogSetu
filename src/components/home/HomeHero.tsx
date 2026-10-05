import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';

interface HomeHeroProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onLoginClick, onRegisterClick }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-start text-left space-y-4 sm:space-y-6 max-w-2xl w-full">
      {/* 1. Highlighted MahaUdyogSetu Symbol (Larger, Radiant Halo & Ambient Backlight) */}
      <div className="relative group">
        {/* Radiant golden/amber ambient backlight aura */}
        <div className="absolute -inset-2 sm:-inset-3 rounded-3xl bg-gradient-to-r from-amber-500/40 via-orange-500/35 to-yellow-400/30 blur-2xl opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        {/* Illuminated Glass Emblem Badge */}
        <div className="relative p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/[0.15] backdrop-blur-xl border border-amber-400/50 shadow-[0_0_35px_rgba(251,191,36,0.4),0_12px_36px_rgba(0,0,0,0.35)] inline-flex items-center justify-center">
          <img 
            src="/assets/mahau_logo_transparent.png" 
            alt="MahaUdyogSetu Official Emblem" 
            className="h-20 sm:h-28 lg:h-32 w-auto object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
          />
        </div>
      </div>

      {/* 2. Small Gov Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/20 text-slate-200 text-[10px] sm:text-xs font-semibold tracking-wider uppercase shadow-xs max-w-full">
        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shrink-0" />
        <span className="truncate">GOVERNMENT OF MAHARASHTRA • उद्योग संचालनालय</span>
      </div>

      {/* 3. H1 in white, 48-56px, bold, tight line-height */}
      <h1 className="text-2xl sm:text-4xl lg:text-[52px] font-extrabold text-white tracking-tight leading-[1.12] sm:leading-[1.08] drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] break-words w-full">
        {t('login.singleWindowSystem', 'Single Window System for Business Approvals')}
      </h1>

      {/* 4. Subtitle in light gray (#CBD5E1), 18px */}
      <p className="text-sm sm:text-base lg:text-[18px] text-[#CBD5E1] font-medium leading-relaxed max-w-xl drop-shadow-sm">
        {t('login.bridgeTitle', 'MahaUdyogSetu (Maharashtra Industry Bridge)')}
      </p>

      {/* 5. Two CTAs side by side: Primary solid Login (#F97316) + Secondary outline/glass Register */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
        {/* Primary CTA: Login */}
        <button
          type="button"
          onClick={onLoginClick}
          className="h-12 sm:h-[52px] px-6 sm:px-8 rounded-xl bg-[#F97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(249,115,22,0.35)] hover:shadow-[0_12px_32px_rgba(249,115,22,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 focus:outline-none focus:ring-4 focus:ring-orange-400/40 min-h-[48px]"
        >
          <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{t('login.btnLogin', 'Login')}</span>
        </button>

        {/* Secondary CTA: New User? Register */}
        <button
          type="button"
          onClick={onRegisterClick}
          className="h-12 sm:h-[52px] px-6 sm:px-8 rounded-xl bg-white/[0.10] hover:bg-white/[0.18] active:bg-white/[0.22] backdrop-blur-md border border-white/30 hover:border-white/50 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 focus:outline-none focus:ring-4 focus:ring-white/30 min-h-[48px]"
        >
          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" />
          <span>{t('login.newUserRegister', 'New User? Register')}</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
        </button>
      </div>
    </div>
  );
};
