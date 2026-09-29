import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Building2,
  LayoutDashboard
} from 'lucide-react';
import { BusinessProfile } from '../../types';
import { LanguageSelector } from '../common/LanguageSelector';

interface FeedbackHeaderProps {
  title?: string;
  subtitle?: string;
  profile?: BusinessProfile;
  activeTab?: 'form' | 'history';
  onSelectTab?: (tab: 'form' | 'history') => void;
  feedbackCount?: number;
}

export const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({
  title = "Feedback & Experience",
  subtitle = "Help us improve your industrial approval experience.",
  profile,
  activeTab = 'form',
  onSelectTab,
  feedbackCount = 0
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Navbar Bar */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand & Logo */}
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
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-900 border border-blue-200 uppercase tracking-wide">
                  CITIZEN & INVESTOR FEEDBACK
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  Govt of Maharashtra
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                Maharashtra Industry Bridge • Service Experience & Grievance Quality Bureau
              </p>
            </div>
          </div>

          {/* Nav Actions */}
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

        {/* Tab Switcher */}
        {onSelectTab && (
          <div className="flex items-center gap-2 pt-1 pb-3 overflow-x-auto border-t border-slate-100">
            <button
              onClick={() => onSelectTab('form')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Give Feedback</span>
            </button>

            <button
              onClick={() => onSelectTab('history')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>My Feedback</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {feedbackCount}
              </span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};

export const FeedbackFooter: React.FC = () => {
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
            <span className="block sm:inline text-slate-600">Department of Industries, Government of Maharashtra</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-600 font-semibold">
          <span>Continuous Improvement Framework</span>
          <span>•</span>
          <span>Right to Services Act 2015</span>
          <span>•</span>
          <span>Toll-Free: 1800 120 8040</span>
        </div>
      </div>
    </footer>
  );
};
