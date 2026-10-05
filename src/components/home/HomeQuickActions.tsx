import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FileCheck2, 
  MessageSquareWarning, 
  TrendingUp, 
  Building2, 
  ChevronRight 
} from 'lucide-react';

interface HomeQuickActionsProps {
  onNavigate: (path: string, authMsg?: string) => void;
}

export const HomeQuickActions: React.FC<HomeQuickActionsProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const actions = [
    {
      title: t('login.wantsApplyVerifyTitle', 'Apply & Verify Permission'),
      description: t('login.wantsApplyVerifyDesc', 'Statutory clearance verification & QR authenticity'),
      icon: FileCheck2,
      path: '/apply-verify',
      authMsg: 'Please log in to Apply & Verify Permissions on MahaUdyogSetu.'
    },
    {
      title: t('login.registerGrievanceTitle', 'Register Grievance'),
      description: t('login.registerGrievanceDesc', 'Fast-track dispute redressal under RTS Act'),
      icon: MessageSquareWarning,
      path: '/grievance',
      authMsg: 'Please log in to access the Grievance & Support Centre.'
    },
    {
      title: t('login.wantToInvestTitle', 'Invest in Maharashtra'),
      description: t('login.wantToInvestDesc', 'Package Scheme of Incentives (PSI) & MIDC land'),
      icon: TrendingUp,
      path: '/invest',
      authMsg: 'Please log in to access Investor Clearance & Incentives.'
    },
    {
      title: t('login.goToMainPortalTitle', 'Go to Main Portal'),
      description: t('login.goToMainPortalDesc', 'Directorate of Industries official services gateway'),
      icon: Building2,
      path: '/main-portal',
      authMsg: 'Please log in to access the Maharashtra Digital Gateway Main Portal.'
    }
  ];

  return (
    <div className="w-full">
      {/* Frosted Glass Container (rgba(255,255,255,0.12), blur 16px, 1px white/20% border, radius 20px) */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-[20px] bg-white/[0.12] backdrop-blur-[16px] border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.25)] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Quick Services
          </span>
          <span className="text-[11px] text-orange-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Active Portals
          </span>
        </div>

        <div className="space-y-2">
          {actions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onNavigate(action.path, action.authMsg)}
                className="w-full p-3 sm:p-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.14] active:bg-white/[0.18] border border-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer flex items-center justify-between group text-left focus:outline-none focus:ring-2 focus:ring-orange-400/50 min-h-[52px]"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {/* Consistent Monochrome Icon in a Rounded Square */}
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/[0.10] border border-white/20 text-orange-400 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-orange-500/20 group-hover:text-orange-300 transition-colors">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight group-hover:text-orange-200 transition-colors truncate">
                      {action.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#CBD5E1] truncate font-medium">
                      {action.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
