import React from 'react';
import { 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  Globe, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface NswsViewProps {
  profile: BusinessProfile;
  onBackToDashboard?: () => void;
}

export const NswsView: React.FC<NswsViewProps> = ({
  profile,
  onBackToDashboard
}) => {
  const handleOpenOfficialNsws = () => {
    window.open('https://www.nsws.gov.in', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1b3d] via-[#122b5e] to-[#0b1b3d] text-white p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-400" />
              <span>National Single Window System (NSWS)</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
              DPIIT • Ministry of Commerce & Industry, GoI
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>National Single Window System Integration</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Single Digital Gateway for Central Ministries and Maharashtra State Approvals. Seamless single sign-on (SSO) and CAF synchronization.
          </p>
        </div>

        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* 2. NSWS Gateway Card */}
      <div className="bg-white rounded-xl border border-slate-300/80 p-6 shadow-xs space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-8 space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-black text-sm shrink-0">
                NSWS
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">National Single Window Clearance Integration</h3>
                <p className="text-slate-500 text-[11px]">Seamless bridge between Government of India Central Ministries & MahaUdyogSetu (MAITRI).</p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed pt-1">
              Your registered enterprise, <strong>{profile.name}</strong> (PAN: <span className="font-mono font-bold text-slate-900">{profile.pan}</span>), is mapped for single sign-on with the central NSWS portal. Central clearances such as Industrial Licensing (DPIIT), Explosives PESO, CGWA Central Water NOC, and Telecom clearances can be tracked in harmony with Maharashtra state clearances.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Single Sign-On (SSO)</div>
                <div className="font-bold text-slate-900 text-xs">Aadhaar / PAN Login</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Central Ministries</div>
                <div className="font-bold text-slate-900 text-xs">32+ Central Depts</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">CAF Synchronization</div>
                <div className="font-bold text-slate-900 text-xs">100% Data Synced</div>
              </div>
            </div>
          </div>

          {/* Action Callout Box */}
          <div className="md:col-span-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5 rounded-2xl border border-blue-200 text-center space-y-3">
            <Globe className="w-10 h-10 text-blue-600 mx-auto" />
            
            <div>
              <h4 className="font-black text-sm text-slate-900">Official NSWS Gateway</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">https://www.nsws.gov.in</p>
            </div>

            <button
              onClick={handleOpenOfficialNsws}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Login to NSWS Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <p className="text-[10px] text-slate-400">Opens the Government of India portal in a secure browser tab.</p>
          </div>

        </div>

      </div>

    </div>
  );
};
