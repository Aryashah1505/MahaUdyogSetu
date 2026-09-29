import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  FolderLock, 
  TrendingUp, 
  Clock, 
  HelpCircle, 
  LayoutDashboard, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ExternalLink,
  Filter,
  User,
  LogOut,
  MapPin,
  Layers,
  Award,
  Zap,
  PhoneCall,
  Lock,
  ArrowUpRight,
  BarChart3,
  Cpu
} from 'lucide-react';
import { BusinessProfile, ApprovalItem, DocumentItem } from '../../types';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';

interface MainPortalPageProps {
  profile?: BusinessProfile;
  approvals?: ApprovalItem[];
  documents?: DocumentItem[];
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const MainPortalPage: React.FC<MainPortalPageProps> = ({
  profile,
  approvals = [],
  documents = [],
  isAuthenticated = false,
  onLogout
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Smart Approval Navigator Interactive Form State
  const [navSector, setNavSector] = useState<string>('Manufacturing & Heavy Engineering');
  const [navLocation, setNavLocation] = useState<string>('MIDC Industrial Area');
  const [navDistrict, setNavDistrict] = useState<string>('Pune');
  const [navProjectScale, setNavProjectScale] = useState<string>('Large Scale (₹50 Cr - ₹250 Cr)');
  const [navigatorResult, setNavigatorResult] = useState<any | null>(null);

  // Search Bar
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate user stats if authenticated
  const activeApplicationsCount = approvals.filter(a => (a.status as any) === 'in_progress' || a.status === 'under_scrutiny' || a.status === 'submitted').length || 2;
  const pendingActionsCount = approvals.filter(a => a.status === 'query_raised' || a.status === 'inspection_scheduled').length || 1;
  const verifiedDocsCount = documents.filter(d => d.status === 'verified').length || 8;
  const completedApprovalsCount = approvals.filter(a => a.status === 'approved').length || 1;

  const handleStartNavigator = (e: React.FormEvent) => {
    e.preventDefault();
    setNavigatorResult({
      sector: navSector,
      district: navDistrict,
      location: navLocation,
      scale: navProjectScale,
      requiredApprovals: [
        { name: 'MPCB Consent to Establish (CTE - Orange/Red)', dept: 'Maharashtra Pollution Control Board', sla: '21 Days' },
        { name: 'DISH Factory Plan & Machinery Layout Approval', dept: 'Directorate of Industrial Safety & Health', sla: '15 Days' },
        { name: 'MIDC Water Connection & Drainage NOC', dept: 'Maharashtra Industrial Development Corp', sla: '7 Days' },
        { name: 'Chief Fire Advisor Provisional Fire NOC', dept: 'Maharashtra Fire Services', sla: '10 Days' },
        { name: 'MSEDCL High Tension (HT) Power Clearance', dept: 'Maharashtra State Electricity Distribution', sla: '14 Days' }
      ],
      estimatedSLA: '21 Working Days (Single Window Unified Track)'
    });
  };

  const mainServicesList = [
    {
      id: '01',
      title: t('card.01.title', 'Apply for Services'),
      description: t('card.01.desc', 'Apply for licences, registrations, permissions, NOCs and other industrial services across 15+ Maharashtra departments.'),
      icon: <Layers className="w-6 h-6 text-blue-600" />,
      path: '/apply-for-services',
      badge: t('card.01.badge', '179 Services Online'),
      color: 'blue'
    },
    {
      id: '02',
      title: t('card.02.title', 'Verify Permission'),
      description: t('card.02.desc', 'Verify an existing business permission, certificate, clearance QR code or statutory NOC issued by the Government.'),
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      path: '/verify-permission',
      badge: t('card.02.badge', 'Instant QR Audit'),
      color: 'emerald'
    },
    {
      id: '03',
      title: t('card.03.title', 'Know Your Approvals'),
      description: t('card.03.desc', 'Identify all required clearances and permits based on industry sector, plot location, project scale and investment range.'),
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      path: '/invest/know-your-approvals',
      badge: t('card.03.badge', 'Pre-Application Wizard'),
      color: 'purple'
    },
    {
      id: '04',
      title: t('card.04.title', 'Document Repository'),
      description: t('card.04.desc', 'Upload, organize, reuse and manage common business documents securely across all department applications.'),
      icon: <FolderLock className="w-6 h-6 text-amber-600" />,
      path: '/document-repository',
      badge: t('card.04.badge', 'Single Vault Reuse'),
      color: 'amber'
    },
    {
      id: '05',
      title: t('card.05.title', 'Investor Support'),
      description: t('card.05.desc', 'Explore industrial opportunities, Package Scheme of Incentives (PSI 2024), NABL testing labs and infrastructure grants.'),
      icon: <TrendingUp className="w-6 h-6 text-teal-600" />,
      path: '/invest',
      badge: t('card.05.badge', 'Subsidies & Land'),
      color: 'teal'
    },
    {
      id: '06',
      title: t('card.06.title', 'Track Application'),
      description: t('card.06.desc', 'Track submitted clearance applications, inspect stage-wise processing timelines and download official certificates.'),
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      path: '/applications',
      badge: t('card.06.badge', 'RTS Timebound SLAs'),
      color: 'indigo'
    },
    {
      id: '07',
      title: t('card.07.title', 'Grievance & Query'),
      description: t('card.07.desc', 'Submit a formal grievance under the Maharashtra Right to Services Act or ask technical questions regarding any service.'),
      icon: <HelpCircle className="w-6 h-6 text-rose-600" />,
      path: '/grievance',
      badge: t('card.07.badge', '7-Day Resolution'),
      color: 'rose'
    },
    {
      id: '08',
      title: t('card.08.title', 'Public Dashboard'),
      description: t('card.08.desc', 'View public statistics, department disposal rates, average SLA turnaround and district clearance performance.'),
      icon: <BarChart3 className="w-6 h-6 text-sky-600" />,
      path: '/public-dashboard',
      badge: t('card.08.badge', '100% Transparency'),
      color: 'sky'
    }
  ];

  const quickActions = [
    { label: t('qa.applyNow', 'Apply Now'), path: '/apply-for-services', icon: <Layers className="w-4 h-4 text-blue-600" /> },
    { label: t('qa.verifyPermission', 'Verify Permission'), path: '/verify-permission', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
    { label: t('qa.trackApplication', 'Track Application'), path: '/applications', icon: <Clock className="w-4 h-4 text-indigo-600" /> },
    { label: t('qa.uploadDocuments', 'Upload Documents'), path: '/document-repository', icon: <FolderLock className="w-4 h-4 text-amber-600" /> },
    { label: t('qa.checkApprovals', 'Check Approvals'), path: '/invest/know-your-approvals', icon: <Sparkles className="w-4 h-4 text-purple-600" /> },
    { label: t('qa.contactSupport', 'Contact Support'), path: '/grievance', icon: <PhoneCall className="w-4 h-4 text-rose-600" /> }
  ];

  const filteredServices = mainServicesList.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* =========================================================================
          1. GOVERNMENT HEADER & NAVIGATION
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Top Header Row */}
          <div className="flex items-center justify-between h-20">
            
            {/* MahaUdyogSetu Brand & Emblem */}
            <div className="flex items-center gap-3.5">
              <Link to="/main-portal" className="flex items-center gap-3 cursor-pointer">
                <img
                  src="/assets/mahau_logo.jpg"
                  alt="MahaUdyogSetu Logo"
                  className="h-12 w-auto object-contain rounded-xl shadow-2xs"
                />
              </Link>
              <div className="border-l border-slate-200 pl-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-slate-900">
                    {t('brand.name', 'MahaUdyogSetu')} <span className="text-blue-700 text-xs font-semibold">({t('brand.marathiSubtitle', 'महाराष्ट्र उद्योग सेतु')})</span>
                  </span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-900 border border-blue-200 uppercase tracking-wide">
                    {t('brand.mainPortal', 'MAIN PORTAL')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                  {t('brand.dept', 'Department of Industries, Government of Maharashtra')}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-700">
              <Link to="/main-portal" className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700">{t('nav.home', 'Home')}</Link>
              <Link to="/list-of-services" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900">{t('nav.services', 'Services')}</Link>
              <Link to="/apply-verify" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900">{t('nav.applyVerify', 'Apply & Verify')}</Link>
              <Link to="/invest" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900">{t('nav.investor', 'Investor')}</Link>
              <Link to="/document-repository" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900">{t('nav.documents', 'Documents')}</Link>
              <Link to="/grievance" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900">{t('nav.support', 'Support')}</Link>
              <Link to="/public-dashboard" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900">{t('nav.publicData', 'Public Data')}</Link>
              <Link to="/feedback" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900">{t('nav.feedback', 'Feedback')}</Link>
            </nav>

            {/* User Auth / Dashboard Button */}
            <div className="flex items-center gap-2.5">
              <LanguageSelector />

              {isAuthenticated && profile ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/services-provided')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>{t('nav.myDashboard', 'My Dashboard')}</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="hidden sm:flex px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold items-center gap-1 cursor-pointer"
                    title={t('nav.logout', 'Log Out')}
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    {t('nav.login', 'Login')}
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-xs cursor-pointer"
                  >
                    {t('nav.registerBusiness', 'Register Business')}
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Sub Navigation Bar for Mobile / Quick Access */}
          <div className="flex xl:hidden items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 text-xs font-bold text-slate-600">
            <Link to="/main-portal" className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 shrink-0">Home</Link>
            <Link to="/list-of-services" className="px-2.5 py-1 rounded hover:bg-slate-100 shrink-0">Services</Link>
            <Link to="/apply-verify" className="px-2.5 py-1 rounded hover:bg-slate-100 shrink-0">Apply & Verify</Link>
            <Link to="/invest" className="px-2.5 py-1 rounded hover:bg-slate-100 shrink-0">Investor</Link>
            <Link to="/document-repository" className="px-2.5 py-1 rounded hover:bg-slate-100 shrink-0">Documents</Link>
            <Link to="/grievance" className="px-2.5 py-1 rounded hover:bg-slate-100 shrink-0">Support</Link>
            <Link to="/public-dashboard" className="px-2.5 py-1 rounded hover:bg-slate-100 shrink-0">Public Data</Link>
          </div>

        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION
         ========================================================================= */}
      <section className="bg-gradient-to-b from-blue-50/60 via-slate-50 to-transparent pt-10 pb-12 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-black uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('portal.heroBadge', 'Maharashtra Single Window Business Clearance Gateway')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {t('portal.heroTitle', 'Maharashtra’s Digital Gateway for Industrial Growth')}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {t('portal.heroSubtitle', 'Discover services, apply for approvals, manage documents, track applications, and access investment support from one unified platform.')}
            </p>

            {/* Search Input Bar */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('portal.searchPlaceholder', 'Search 179+ services, clearances, departments, NOCs or schemes...')}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300/90 text-xs sm:text-sm font-medium shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/apply-for-services')}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>{t('portal.applyService', 'Apply for a Service')}</span>
              </button>

              <button
                onClick={() => navigate('/list-of-services')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs sm:text-sm font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>{t('portal.exploreServices', 'Explore Services')}</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. PERSONALIZED SECTION (If Logged In)
         ========================================================================= */}
      {isAuthenticated && profile && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8 w-full">
          <div className="bg-white rounded-3xl border border-blue-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-900 border border-blue-200 uppercase">
                    {t('portal.activeEnterprise', 'ACTIVE ENTERPRISE PROFILE')}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{profile.pan}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t('portal.welcomeBack', 'Welcome back')}, {profile.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Unit Location: {profile.plotNumber || 'Plot W-42'}, {profile.isMIDC ? 'MIDC Ambad' : profile.taluka}, {profile.district}, Maharashtra
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate('/services-provided')}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>{t('portal.continueApplication', 'Continue Your Application')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('portal.activeApplications', 'Active Applications')}</span>
                <div className="text-lg font-black text-blue-700 mt-0.5">{activeApplicationsCount}</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('portal.pendingActions', 'Pending Actions')}</span>
                <div className="text-lg font-black text-amber-700 mt-0.5">{pendingActionsCount}</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('portal.verifiedDocuments', 'Verified Documents')}</span>
                <div className="text-lg font-black text-emerald-700 mt-0.5">{verifiedDocsCount} / {documents.length || 9}</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('portal.approvalsCompleted', 'Approvals Completed')}</span>
                <div className="text-lg font-black text-teal-700 mt-0.5">{completedApprovalsCount}</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('portal.grievances', 'Grievances')}</span>
                <div className="text-lg font-black text-rose-700 mt-0.5">0 Active</div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          4. HORIZONTAL QUICK ACTIONS BAR
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 w-full">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 px-2 text-xs font-black text-slate-800 uppercase tracking-wide">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('portal.quickActions', 'Quick Actions')}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {quickActions.map((qa, idx) => (
              <button
                key={idx}
                onClick={() => navigate(qa.path)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 text-left transition-all flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-white shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {qa.icon}
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900 truncate">
                  {qa.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. MAIN SERVICES CARDS (01 TO 08)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('portal.coreServicesTitle', 'MahaUdyogSetu Core Services & Ecosystem')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('portal.coreServicesSubtitle', 'Access statutory clearances, single vault documents, and transparency modules.')}
            </p>
          </div>

          <span className="text-xs font-bold text-slate-400">
            Showing {filteredServices.length} Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              onClick={() => navigate(srv.path)}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {srv.icon}
                  </div>
                  <span className="text-xl font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                    {srv.id}
                  </span>
                </div>

                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 mb-1.5">
                    {srv.badge}
                  </span>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-3">
                    {srv.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>{t('card.accessModule', 'Access Module')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. HIGHLIGHTED INTELLIGENT FEATURE: SMART APPROVAL NAVIGATOR
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 w-full">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl text-white p-8 sm:p-12 shadow-lg relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Col: Info & Explanation */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>{t('navigator.aiBadge', 'AI Regulatory Engine')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {t('navigator.title', 'Smart Approval Navigator')}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('navigator.desc', 'Tell us about your industry and project. MahaUdyogSetu identifies the relevant approvals, documents, statutory fees and governing departments you will need before setting up operations.')}
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('navigator.bullet1', 'Rule-based Maharashtra Industrial Policy 2024 mapping')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('navigator.bullet2', 'Auto-detects MPCB Red/Orange/Green categorization')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('navigator.bullet3', 'Calculates RTS Act statutory SLA timelines')}</span>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Parameter Selector */}
            <div className="lg:col-span-7 bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100">
              <form onSubmit={handleStartNavigator} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                      {t('navigator.industrySector', 'Industry Sector')}
                    </label>
                    <select
                      value={navSector}
                      onChange={(e) => setNavSector(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                    >
                      <option value="Manufacturing & Heavy Engineering">Manufacturing & Heavy Engineering</option>
                      <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                      <option value="Pharmaceuticals & Biotech">Pharmaceuticals & Biotech</option>
                      <option value="Automotive & Auto Components">Automotive & Auto Components</option>
                      <option value="Food Processing & Agrotech">Food Processing & Agrotech</option>
                      <option value="IT / ITES & Electronics">IT / ITES & Electronics</option>
                      <option value="Renewable Energy & Solar">Renewable Energy & Solar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                      {t('navigator.district', 'District in Maharashtra')}
                    </label>
                    <select
                      value={navDistrict}
                      onChange={(e) => setNavDistrict(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                    >
                      <option value="Pune">Pune</option>
                      <option value="Nashik">Nashik</option>
                      <option value="Thane">Thane</option>
                      <option value="Aurangabad (Chhatrapati Sambhajinagar)">Chhatrapati Sambhajinagar</option>
                      <option value="Nagpur">Nagpur</option>
                      <option value="Raigad">Raigad</option>
                      <option value="Kolhapur">Kolhapur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                      {t('navigator.unitLocation', 'Land / Unit Location')}
                    </label>
                    <select
                      value={navLocation}
                      onChange={(e) => setNavLocation(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                    >
                      <option value="MIDC Industrial Area">MIDC Industrial Area</option>
                      <option value="Private Industrial Estate">Private Industrial Estate</option>
                      <option value="Non-MIDC / Agricultural Converted">Non-MIDC / NA Converted</option>
                      <option value="Co-operative Industrial Zone">Co-operative Industrial Zone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                      {t('navigator.investmentScale', 'Investment Scale')}
                    </label>
                    <select
                      value={navProjectScale}
                      onChange={(e) => setNavProjectScale(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                    >
                      <option value="Micro Unit (Below ₹1 Cr)">Micro Unit (Below ₹1 Cr)</option>
                      <option value="Small Scale (₹1 Cr - ₹10 Cr)">Small Scale (₹1 Cr - ₹10 Cr)</option>
                      <option value="Medium Scale (₹10 Cr - ₹50 Cr)">Medium Scale (₹10 Cr - ₹50 Cr)</option>
                      <option value="Large Scale (₹50 Cr - ₹250 Cr)">Large Scale (₹50 Cr - ₹250 Cr)</option>
                      <option value="Mega Project (Above ₹250 Cr)">Mega Project (Above ₹250 Cr)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {t('navigator.statutoryCalculated', 'Calculated against 15 State Clearances & Central Acts')}
                  </span>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t('navigator.startBtn', 'Start Approval Navigator')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>

              {/* Navigator Dynamic Results Box */}
              {navigatorResult && (
                <div className="mt-5 p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                    <span className="text-xs font-black text-blue-950 uppercase">
                      {t('navigator.blueprint', 'Required Clearance Blueprint')} ({navigatorResult.requiredApprovals.length})
                    </span>
                    <span className="text-[10px] font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                      SLA: {navigatorResult.estimatedSLA}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {navigatorResult.requiredApprovals.map((app: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-blue-100">
                        <div>
                          <span className="font-bold text-slate-800 block">{app.name}</span>
                          <span className="text-[10px] text-slate-500">{app.dept}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                          {app.sla}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => navigate('/invest/know-your-approvals')}
                      className="text-xs font-black text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t('navigator.proceedFullDossier', 'Proceed to Full Approval Dossier')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          7. PROFESSIONAL GOVERNMENT FOOTER
         ========================================================================= */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto text-xs text-slate-600 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            
            {/* Col 1 & 2: Branding */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/mahau_logo.jpg"
                  alt="MahaUdyogSetu"
                  className="h-10 w-auto object-contain rounded-lg"
                />
                <div>
                  <span className="font-black text-slate-900 text-sm block">{t('brand.name', 'MahaUdyogSetu')}</span>
                  <span className="text-[11px] text-slate-500">{t('brand.dept', 'Department of Industries, Govt of Maharashtra')}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                {t('footer.statutory', 'Single Window Clearance and Compliance Facilitation mechanism established under the Maharashtra Single Window Clearances Act to empower industrial growth and investor ease.')}
              </p>
            </div>

            {/* Col 3: Key Links */}
            <div className="space-y-2">
              <span className="font-black text-slate-900 uppercase text-[11px] block">{t('nav.services', 'Services')}</span>
              <ul className="space-y-1.5 text-xs text-slate-500">
                <li><Link to="/apply-for-services" className="hover:text-blue-600">{t('card.01.title', 'Apply for Licences')}</Link></li>
                <li><Link to="/verify-permission" className="hover:text-blue-600">{t('card.02.title', 'Verify Permission')}</Link></li>
                <li><Link to="/list-of-services" className="hover:text-blue-600">{t('nav.services', 'Department Directory')}</Link></li>
                <li><Link to="/document-repository" className="hover:text-blue-600">{t('card.04.title', 'Document Vault')}</Link></li>
              </ul>
            </div>

            {/* Col 4: Investor & Data */}
            <div className="space-y-2">
              <span className="font-black text-slate-900 uppercase text-[11px] block">{t('nav.investor', 'Investor')} & {t('nav.publicData', 'Data')}</span>
              <ul className="space-y-1.5 text-xs text-slate-500">
                <li><Link to="/invest" className="hover:text-blue-600">Invest in Maharashtra</Link></li>
                <li><Link to="/invest/know-your-approvals" className="hover:text-blue-600">{t('card.03.title', 'Know Your Approvals')}</Link></li>
                <li><Link to="/invest/incentive-calculator" className="hover:text-blue-600">Incentive Calculator</Link></li>
                <li><Link to="/public-dashboard" className="hover:text-blue-600">{t('card.08.title', 'Public Dashboard')}</Link></li>
              </ul>
            </div>

            {/* Col 5: Help & Support */}
            <div className="space-y-2">
              <span className="font-black text-slate-900 uppercase text-[11px] block">{t('nav.support', 'Support & Help')}</span>
              <ul className="space-y-1.5 text-xs text-slate-500">
                <li><Link to="/grievance" className="hover:text-blue-600">{t('sidebar.grievance', 'Grievance Redressal')}</Link></li>
                <li><Link to="/grievance/query" className="hover:text-blue-600">{t('sidebar.query', 'Raise Query')}</Link></li>
                <li><Link to="/feedback" className="hover:text-blue-600">{t('nav.feedback', 'Feedback & Ratings')}</Link></li>
                <li><span className="text-slate-700 font-bold">{t('footer.helpline', 'Helpline: 1800 120 8040')}</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              {t('footer.rights', '© 2026 MahaUdyogSetu • Government of Maharashtra. All Rights Reserved.')}
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-800 cursor-pointer">{t('footer.privacyPolicy', 'Privacy Policy')}</span>
              <span>•</span>
              <span className="hover:text-slate-800 cursor-pointer">{t('footer.terms', 'Terms of Service')}</span>
              <span>•</span>
              <span className="hover:text-slate-800 cursor-pointer">{t('footer.accessibility', 'Accessibility Statement')}</span>
              <span>•</span>
              <span className="hover:text-slate-800 cursor-pointer">{t('footer.rtsCompliance', 'RTS Act 2015 Compliance')}</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
