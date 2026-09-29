import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, LogIn, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';

interface PublicHeaderProps {
  title?: string;
  subtitle?: string;
  showBackToHome?: boolean;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  title = "Apply & Verify Permission",
  subtitle = "Single Window Business Clearance & Verification Platform • Government of Maharashtra",
  showBackToHome = true,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Emblem & App Branding */}
          <div className="flex items-center gap-3.5">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/mahau_logo.jpg"
                alt="MahaUdyogSetu"
                className="h-10 sm:h-12 w-auto object-contain rounded-lg shadow-2xs"
              />
            </Link>
            <div className="border-l border-slate-200 pl-3">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  {t('brand.name', 'MahaUdyogSetu')}
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  {t('brand.govt', 'Govt of Maharashtra')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <LanguageSelector />

            {showBackToHome && (
              <button
                onClick={() => navigate('/')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('nav.landingPage', 'Landing Page')}</span>
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('nav.loginPortal', 'Login / Portal')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export const PublicFooter: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white border-t border-slate-200/90 py-8 mt-16 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/mahau_logo.jpg"
            alt="MahaUdyogSetu"
            className="h-8 w-auto object-contain rounded"
          />
          <div>
            <span className="font-bold text-slate-800">{t('brand.name', 'MahaUdyogSetu')} ({t('brand.marathiSubtitle', 'महाराष्ट्र उद्योग सेतु')})</span>
            <span className="hidden sm:inline text-slate-400"> • </span>
            <span className="block sm:inline">{t('brand.portalTitle', 'Government of Maharashtra Single Window Approval Ecosystem')}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-600 font-medium">
          <Link to="/apply-verify" className="hover:text-teal-700 transition-colors">{t('nav.applyVerify', 'Apply & Verify Hub')}</Link>
          <span>•</span>
          <Link to="/apply-for-services" className="hover:text-teal-700 transition-colors">{t('card.01.title', 'Apply for Services')}</Link>
          <span>•</span>
          <Link to="/list-of-services" className="hover:text-teal-700 transition-colors">{t('applyVerify.c2Title', 'List of Services')}</Link>
          <span>•</span>
          <Link to="/verify-permission" className="hover:text-teal-700 transition-colors">{t('card.02.title', 'Verify Permission')}</Link>
        </div>
        <div className="text-slate-400 text-[11px] text-center md:text-right">
          {t('footer.rights', '© 2026 MahaUdyogSetu • Government of Maharashtra. All Rights Reserved.')}
        </div>
      </div>
    </footer>
  );
};
