import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  HelpCircle, 
  PhoneCall, 
  ShieldCheck,
  Building2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { BusinessProfile } from '../../types';
import { LanguageSelector } from '../common/LanguageSelector';

interface GrievanceHeaderProps {
  title?: string;
  subtitle?: string;
  profile?: BusinessProfile;
  activePath?: string;
}

export const GrievanceHeader: React.FC<GrievanceHeaderProps> = ({
  title = "Grievance & Support Centre",
  subtitle = "Raise a concern, ask a question, or track an existing grievance.",
  profile,
  activePath = "/grievance"
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand & Emblem */}
          <div className="flex items-center gap-3.5">
            <Link to="/services-provided" className="flex items-center gap-3 cursor-pointer">
              <img
                src="/assets/mahau_logo.jpg"
                alt="MahaUdyogSetu"
                className="h-10 sm:h-12 w-auto object-contain rounded-lg shadow-2xs"
              />
            </Link>
            <div className="border-l border-slate-200 pl-3">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  MahaUdyogSetu
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  Govt of Maharashtra
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                Maharashtra Industry Bridge • Grievance & Public Service Redressal
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />

            <button
              onClick={() => navigate('/services-provided')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Back to Dashboard</span>
            </button>
            
            <button
              onClick={() => navigate('/applications')}
              className="hidden md:flex px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
              <span>Applications</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export const GrievanceFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-16 text-xs text-slate-500 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/mahau_logo.jpg"
            alt="MahaUdyogSetu"
            className="h-8 w-auto object-contain rounded"
          />
          <div>
            <span className="font-bold text-slate-800">MahaUdyogSetu (महाराष्ट्र उद्योग सेतु)</span>
            <span className="hidden sm:inline text-slate-400"> • </span>
            <span className="block sm:inline text-slate-600">Statutory Grievance Redressal & Support Ecosystem</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-600 font-semibold">
          <Link to="/grievance" className="hover:text-teal-700 transition-colors">Support Centre</Link>
          <span>•</span>
          <Link to="/grievance/query" className="hover:text-teal-700 transition-colors">Register Query</Link>
          <span>•</span>
          <Link to="/grievance/register" className="hover:text-teal-700 transition-colors">Register Grievance</Link>
          <span>•</span>
          <Link to="/grievance/status" className="hover:text-teal-700 transition-colors">Check Status</Link>
        </div>
        <div className="text-slate-400 text-[11px] text-center md:text-right">
          Statutory Framework: Maharashtra Right to Public Services Act (RTS Act, 2015) • Toll-free: 1800-120-8040
        </div>
      </div>
    </footer>
  );
};
