import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  LayoutDashboard,
  Building2
} from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';
import { getCurrentLocalDate, formatLocalDate } from '../../utils/dateUtils';

interface PublicDashboardHeaderProps {
  lastUpdated?: string;
  dataPeriod?: string;
  onRefresh?: () => void;
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
}

export const PublicDashboardHeader: React.FC<PublicDashboardHeaderProps> = ({
  lastUpdated = getCurrentLocalDate('with-time'),
  dataPeriod = `January ${new Date().getFullYear()} – ${formatLocalDate(new Date(), 'month-year')}`,
  onRefresh,
  activeTab = "overview",
  onSelectTab
}) => {
  const navigate = useNavigate();

  const navTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'applications', label: 'Applications' },
    { id: 'approvals', label: 'Approvals' },
    { id: 'departments', label: 'Departments' },
    { id: 'districts', label: 'Districts' },
    { id: 'industries', label: 'Industries' },
    { id: 'grievances', label: 'Grievances' },
    { id: 'services', label: 'Services' },
    { id: 'reports', label: 'Reports' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand & Emblem */}
          <div className="flex items-center gap-3.5">
            <Link to="/" className="flex items-center gap-3 cursor-pointer">
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
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-300 uppercase tracking-wide">
                  PUBLIC DATA
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  Govt of Maharashtra
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                Public Industrial Approvals & Clearances Analytics Portal
              </p>
            </div>
          </div>

          {/* Quick Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Refresh Data</span>
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Back to Home</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar text-xs font-semibold">
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onSelectTab && onSelectTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};

export const PublicDashboardFooter: React.FC = () => {
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
            <span className="font-bold text-slate-800">MahaUdyogSetu Public Dashboard (सार्वजनिक डॅशबोर्ड)</span>
            <span className="hidden sm:inline text-slate-400"> • </span>
            <span className="block sm:inline text-slate-600">Open Data & Statutory Performance Transparency</span>
          </div>
        </div>
        <div className="text-slate-400 text-[11px] text-center md:text-right">
          Public Data Framework: Maharashtra Right to Services Act, 2015 • Aggregated & Anonymized Industrial Metrics
        </div>
      </div>
    </footer>
  );
};
