import React, { useState } from 'react';
import { 
  BusinessProfile, 
  ApprovalItem, 
  DocumentItem, 
  IncentiveScheme 
} from '../../types';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Download, 
  Zap, 
  Award, 
  FileCheck2, 
  ExternalLink, 
  MessageSquare, 
  Briefcase, 
  ChevronRight, 
  Sliders, 
  Brain, 
  Scale, 
  Landmark, 
  FolderOpen, 
  HelpCircle, 
  Plus, 
  Building2, 
  ChevronDown,
  ArrowUpRight,
  Shield,
  Layers,
  FileCheck,
  CheckCircle,
  Eye,
  AlertTriangle,
  RefreshCw,
  Info
} from 'lucide-react';
import { calculatePollutionCategory } from '../../data/regulatoryEngine';
import { useLanguage } from '../../context/LanguageContext';

export interface MahaUdyogDashboardViewProps {
  profile: BusinessProfile;
  approvals: ApprovalItem[];
  documents: DocumentItem[];
  schemes: IncentiveScheme[];
  onNavigateTab: (nav: string, tab?: 'services_applied' | 'services_available' | 'caf' | 'payment_history') => void;
  onOpenServiceReadiness?: (srv: any, deptName: string) => void;
  onOpenApplicationDetails?: (app: ApprovalItem) => void;
  onDownloadReceipt?: (app: ApprovalItem) => void;
  onDownloadDossier?: (app: ApprovalItem) => void;
  onOpenRegistration?: () => void;
  onUpdateApprovals?: (newApprovals: ApprovalItem[]) => void;
}

export const MahaUdyogDashboardView: React.FC<MahaUdyogDashboardViewProps> = ({
  profile,
  approvals,
  documents,
  schemes,
  onNavigateTab,
  onOpenServiceReadiness,
  onOpenApplicationDetails,
  onDownloadReceipt,
  onDownloadDossier,
  onOpenRegistration,
  onUpdateApprovals,
}) => {
  const { language, t } = useLanguage();
  const [appFilter, setAppFilter] = useState<'all' | 'action_required' | 'under_scrutiny' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationTab, setNotificationTab] = useState<'action' | 'info'>('action');
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  // Derived Operational Metrics
  const totalApps = approvals.length;
  const approvedApps = approvals.filter(a => a.status === 'approved');
  const scrutinyApps = approvals.filter(a => a.status === 'under_scrutiny' || a.status === 'submitted');
  const fastTrackApps = approvals.filter(a => a.fastTrack);

  // Real Action Required Items (Strictly from active database records)
  const pendingQueries = approvals.flatMap(a => 
    (a.queries || [])
      .filter(q => q.status === 'pending')
      .map(q => ({
        type: 'query' as const,
        appId: a.id,
        appName: a.name,
        department: a.department,
        refNumber: a.applicationRefNumber || a.id,
        date: q.dateRaised,
        deadline: q.deadlineDate,
        title: `Clarification Requested by ${q.department}`,
        detail: q.queryText,
        approval: a,
      }))
  );

  const pendingPayments = approvals
    .filter(a => a.paymentStatus && a.paymentStatus.toLowerCase() !== 'paid' && a.paymentStatus.toLowerCase() !== 'success')
    .map(a => ({
      type: 'payment' as const,
      appId: a.id,
      appName: a.name,
      department: a.department,
      refNumber: a.applicationRefNumber || a.id,
      date: a.appliedDate || '26/09/2026',
      deadline: 'Immediate',
      title: `Statutory Fee Settlement Pending`,
      detail: `Payment of ₹ ${a.feeAmount?.toLocaleString() || '1,000'} required to initiate processing.`,
      approval: a,
    }));

  const approachingSlaApps = approvals
    .filter(a => a.status !== 'approved' && a.slaDays > 0 && a.daysElapsed >= Math.max(1, a.slaDays - 2))
    .map(a => ({
      type: 'sla' as const,
      appId: a.id,
      appName: a.name,
      department: a.department,
      refNumber: a.applicationRefNumber || a.id,
      date: a.appliedDate || '26/09/2026',
      deadline: `${Math.max(0, a.slaDays - a.daysElapsed)} days left`,
      title: `Application Nearing SLA Deadline`,
      detail: `${a.daysElapsed} of ${a.slaDays} statutory days elapsed. Priority desk tracking active.`,
      approval: a,
    }));

  const unverifiedDocs = documents.filter(d => d.status !== 'verified');
  const verifiedDocsCount = documents.filter(d => d.status === 'verified').length;

  const allActionRequired = [...pendingQueries, ...pendingPayments, ...approachingSlaApps];
  const actionRequiredCount = allActionRequired.length + (unverifiedDocs.length > 0 ? 1 : 0);

  // Filtered applications list
  const filteredApprovals = approvals.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.applicationRefNumber && app.applicationRefNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (appFilter === 'action_required') {
      const hasQuery = app.queries?.some(q => q.status === 'pending');
      const isSlaRisk = app.status !== 'approved' && app.daysElapsed >= app.slaDays - 2;
      const unpaid = app.paymentStatus && app.paymentStatus !== 'Paid';
      return hasQuery || isSlaRisk || unpaid;
    }
    if (appFilter === 'under_scrutiny') {
      return app.status === 'under_scrutiny' || app.status === 'submitted';
    }
    if (appFilter === 'approved') {
      return app.status === 'approved';
    }
    return true;
  });

  const pollutionCategory = calculatePollutionCategory(
    profile.sector, 
    profile.handlesHazardous, 
    profile.connectedPowerKw, 
    profile.investmentCrores
  );

  return (
    <div className="space-y-6 pb-12 antialiased">
      
      {/* =========================================================================
          LEVEL 1 / HERO: COMPACT WELCOME & COMMAND BAR
         ========================================================================= */}
      <section className="bg-white/92 backdrop-blur-md rounded-2xl border border-white/80 p-5 sm:p-6 shadow-xl shadow-slate-900/10 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left: Enterprise & Context */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-900 text-white tracking-wide uppercase shadow-2xs">
                <Landmark className="w-3 h-3 text-orange-400" />
                Govt of Maharashtra
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                <ShieldCheck className="w-3 h-3 text-amber-600" />
                Single Window Clearance
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-slate-500">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {profile.name}
              </h1>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <span>(Authorized:</span>
                <span className="text-blue-700">{profile.authorizedPersonName || 'Arya Shah'}</span>
                <span>• {profile.pan})</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">{profile.sector}</span>
              </span>
              <span>•</span>
              <span>{profile.scale} Enterprise</span>
              <span>•</span>
              <span className="text-blue-700 font-semibold">
                {profile.isMIDC ? 'MIDC Industrial Estate' : profile.taluka || 'Industrial Zone'}, {profile.district}
              </span>
              <span>•</span>
              <span className="font-mono text-slate-500">CIN: {profile.cin || 'U29253MH2020PTC338912'}</span>
            </div>
          </div>

          {/* Right: Urgent Indicator & Primary Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200">
            {actionRequiredCount > 0 ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-900 text-xs font-bold animate-pulse">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{actionRequiredCount} Action{actionRequiredCount > 1 ? 's' : ''} Require Attention</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All Approvals On Track Within SLA</span>
              </div>
            )}

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => onNavigateTab('services_provided', 'services_available')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Apply for Clearances</span>
              </button>
              <button
                onClick={() => onNavigateTab('applications', 'services_applied')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Track Applications</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          LEVEL 1: ACTION REQUIRED OPERATIONAL PANEL
         ========================================================================= */}
      <section className="bg-white/92 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-lg shadow-slate-900/10">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${actionRequiredCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {actionRequiredCount > 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                  Action Required
                </h2>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${actionRequiredCount > 0 ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
                  {actionRequiredCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Statutory queries, payment settlement, and approaching compliance deadlines
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3.5">
          {actionRequiredCount === 0 ? (
            <div className="p-6 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-900">You're all caught up!</h3>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    No pending statutory queries, overdue SLA tasks, or missing mandatory documents.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('services_provided', 'services_available')}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Browse New Clearances →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* 1. Pending Queries */}
              {pendingQueries.map((item, idx) => (
                <div key={`query-${idx}`} className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/80 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-sm transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        Query Raised
                      </span>
                      <span className="text-[10px] text-amber-800 font-mono">
                        Due: {item.deadline}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.appName}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{item.detail}</p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Ref: {item.refNumber} • {item.department}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onNavigateTab('applications', 'services_applied');
                      if (onOpenApplicationDetails) onOpenApplicationDetails(item.approval);
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all text-center cursor-pointer shadow-2xs"
                  >
                    Resolve Clarification →
                  </button>
                </div>
              ))}

              {/* 2. Pending Payments */}
              {pendingPayments.map((item, idx) => (
                <div key={`payment-${idx}`} className="p-3.5 rounded-xl border border-rose-300 bg-rose-50/80 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-sm transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                        Fee Settlement
                      </span>
                      <span className="text-[10px] text-rose-800 font-mono">Immediate</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.appName}</h4>
                    <p className="text-[11px] text-slate-600">{item.detail}</p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Ref: {item.refNumber} • {item.department}
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateTab('payment_history')}
                    className="w-full py-1.5 px-3 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all text-center cursor-pointer shadow-2xs"
                  >
                    Complete Payment Gateway →
                  </button>
                </div>
              ))}

              {/* 3. Approaching SLA */}
              {approachingSlaApps.map((item, idx) => (
                <div key={`sla-${idx}`} className="p-3.5 rounded-xl border border-blue-300 bg-blue-50/80 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-sm transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                        SLA Priority
                      </span>
                      <span className="text-[10px] text-blue-800 font-semibold">{item.deadline}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.appName}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{item.detail}</p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Ref: {item.refNumber} • {item.department}
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateTab('applications', 'services_applied')}
                    className="w-full py-1.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all text-center cursor-pointer shadow-2xs"
                  >
                    View Status & Tracking →
                  </button>
                </div>
              ))}

              {/* 4. Unverified Documents Warning */}
              {unverifiedDocs.length > 0 && (
                <div className="p-3.5 rounded-xl border border-indigo-300 bg-indigo-50/80 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-sm transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-200 text-indigo-900">
                        Vault Action
                      </span>
                      <span className="text-[10px] text-indigo-800 font-semibold">
                        {unverifiedDocs.length} Pending
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">Pre-Validation Verification</h4>
                    <p className="text-[11px] text-slate-600">
                      {unverifiedDocs[0]?.name || 'Factory Layout & Land Agreement'} needs pre-validation to avoid department rejections.
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Document Repository • Digital Signatures
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateTab('document_repository')}
                    className="w-full py-1.5 px-3 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-all text-center cursor-pointer shadow-2xs"
                  >
                    Open Document Vault →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          LEVEL 2: APPLICATION OVERVIEW & OPERATIONAL PIPELINE
         ========================================================================= */}
      <section className="bg-white/92 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-lg shadow-slate-900/10 space-y-4">
        
        {/* Header & Metrics Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Application Overview & Tracking
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900">
                {totalApps} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory timeline tracking, scrutiny status, and clearance dossier generation
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-50/80 border border-slate-200 p-2 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Under Scrutiny</span>
              <span className="text-base font-black text-amber-700">{scrutinyApps.length}</span>
            </div>
            <div className="bg-slate-50/80 border border-slate-200 p-2 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Approved</span>
              <span className="text-base font-black text-emerald-700">{approvedApps.length}</span>
            </div>
            <div className="bg-slate-50/80 border border-slate-200 p-2 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Fast-Track</span>
              <span className="text-base font-black text-blue-700">{fastTrackApps.length}</span>
            </div>
            <div className="bg-slate-50/80 border border-slate-200 p-2 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">SLA Adherence</span>
              <span className="text-base font-black text-slate-800">96.4%</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            <button
              onClick={() => setAppFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                appFilter === 'all'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All ({totalApps})
            </button>
            <button
              onClick={() => setAppFilter('under_scrutiny')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                appFilter === 'under_scrutiny'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Under Scrutiny ({scrutinyApps.length})
            </button>
            <button
              onClick={() => setAppFilter('action_required')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                appFilter === 'action_required'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Action Required ({actionRequiredCount})
            </button>
            <button
              onClick={() => setAppFilter('approved')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                appFilter === 'approved'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Approved ({approvedApps.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference or service..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Operational Applications List */}
        <div className="space-y-3 pt-2">
          {filteredApprovals.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
              No applications match the current filter or search criteria.
            </div>
          ) : (
            filteredApprovals.map((app) => {
              const hasQuery = app.queries?.some(q => q.status === 'pending');
              const isApproved = app.status === 'approved';
              const slaPercent = Math.min(100, Math.round(((app.daysElapsed || 1) / (app.slaDays || 15)) * 100));
              const isExpanded = expandedAppId === app.id;

              return (
                <div 
                  key={app.id}
                  className={`rounded-xl border transition-all ${
                    hasQuery
                      ? 'border-amber-300 bg-amber-50/30'
                      : isApproved
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white/90'
                  } p-4 shadow-xs`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* App info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {app.applicationRefNumber || app.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {app.department}
                        </span>
                        {app.fastTrack && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Zap className="w-2.5 h-2.5 text-emerald-600" />
                            Fast-Track
                          </span>
                        )}
                        {hasQuery && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.2 rounded bg-amber-500 text-white animate-pulse">
                            Query Pending
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {app.name}
                      </h3>

                      {/* Timeline Visualization: 5-Step Operational Stepper */}
                      <div className="pt-2">
                        <div className="grid grid-cols-5 gap-1.5 text-[10px] font-semibold text-center select-none">
                          
                          {/* Step 1: Submitted */}
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-full h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-emerald-700 font-bold truncate">Submitted</span>
                          </div>

                          {/* Step 2: Scrutiny */}
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-full h-1.5 rounded-full ${app.status !== 'not_started' && app.status !== 'documents_pending' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                            <span className={app.status === 'under_scrutiny' ? 'text-amber-700 font-black' : 'text-slate-600 truncate'}>
                              Scrutiny
                            </span>
                          </div>

                          {/* Step 3: Query / Docs */}
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-full h-1.5 rounded-full ${hasQuery ? 'bg-amber-500 animate-pulse' : (isApproved ? 'bg-emerald-500' : 'bg-slate-200')}`} />
                            <span className={hasQuery ? 'text-amber-800 font-black' : 'text-slate-600 truncate'}>
                              Query / Docs
                            </span>
                          </div>

                          {/* Step 4: Inspection */}
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-full h-1.5 rounded-full ${isApproved ? 'bg-emerald-500' : (app.inspection ? 'bg-blue-500' : 'bg-slate-200')}`} />
                            <span className="text-slate-600 truncate">Inspection</span>
                          </div>

                          {/* Step 5: Approval */}
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-full h-1.5 rounded-full ${isApproved ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                            <span className={isApproved ? 'text-emerald-800 font-black' : 'text-slate-400 truncate'}>
                              Approval
                            </span>
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* SLA Progress & Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      
                      {/* SLA Progress */}
                      <div className="w-full sm:w-44 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Statutory SLA</span>
                          <span className="font-mono font-bold text-slate-800">
                            {app.daysElapsed} / {app.slaDays} Days
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              isApproved 
                                ? 'bg-emerald-500' 
                                : slaPercent > 80 
                                ? 'bg-amber-500' 
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${slaPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {onDownloadDossier && (
                          <button
                            onClick={() => onDownloadDossier(app)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                            title="Download statutory dossier"
                          >
                            <Download className="w-3 h-3" />
                            <span>Dossier</span>
                          </button>
                        )}
                        {onDownloadReceipt && (
                          <button
                            onClick={() => onDownloadReceipt(app)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                            title="Download official receipt"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onNavigateTab('applications', 'services_applied');
                            if (onOpenApplicationDetails) onOpenApplicationDetails(app);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View all applications button */}
        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigateTab('applications', 'services_applied')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Complete Applications Dossier & Timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          LEVEL 3: QUICK ACTIONS (PURPOSEFUL HIERARCHY — NOT IDENTICAL CARDS)
         ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            Quick Operational Actions
          </h2>
          <span className="text-xs text-slate-500">MahaUdyogSetu Direct Access</span>
        </div>

        {/* Primary Actions: Elevated & Distinctive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Apply for Services */}
          <div 
            onClick={() => onNavigateTab('services_provided', 'services_available')}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-lg shadow-blue-950/20 hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
                <Layers className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 block">
                  Primary Clearance
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                  Apply for Services
                </h3>
              </div>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Single-window statutory clearances across Labour, MPCB, Directorate of Industries, MIDC, and Energy.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-bold text-cyan-300 border-t border-white/10 mt-4">
              <span>Browse 40+ Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Track Applications */}
          <div 
            onClick={() => onNavigateTab('applications', 'services_applied')}
            className="p-5 rounded-2xl bg-white/92 backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between group text-slate-800"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">
                  Real-Time Tracking
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Track Applications
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                View live departmental desk review, officer inspections, query responses, and digital approval certificates.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-bold text-blue-700 border-t border-slate-100 mt-4">
              <span>View Active Dossier ({approvals.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Verify Permission */}
          <div 
            onClick={() => onNavigateTab('apply_verify')}
            className="p-5 rounded-2xl bg-white/92 backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between group text-slate-800"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                  Digital Authentication
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Verify Permission
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant cryptographic QR validation of clearances issued by Govt of Maharashtra single window authorities.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-bold text-emerald-700 border-t border-slate-100 mt-4">
              <span>Verify Digital Certificate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Secondary Actions: Streamlined Horizontal Group */}
        <div className="bg-white/92 backdrop-blur-md rounded-xl border border-white/80 p-3 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-semibold">
            
            <button
              onClick={() => onNavigateTab('document_repository')}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 flex items-center gap-2 transition-all cursor-pointer text-left"
            >
              <FolderOpen className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="truncate">
                <span className="block font-bold">Document Vault</span>
                <span className="text-[10px] text-slate-400">{documents.length} Docs</span>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('intelligence_engine')}
              className="p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-950 flex items-center gap-2 transition-all cursor-pointer text-left"
            >
              <Brain className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="truncate">
                <span className="block font-bold">AI Intelligence</span>
                <span className="text-[10px] text-indigo-600">Readiness Check</span>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('grievance')}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 flex items-center gap-2 transition-all cursor-pointer text-left"
            >
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="truncate">
                <span className="block font-bold">Grievance Portal</span>
                <span className="text-[10px] text-slate-400">Escalate Issue</span>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('feedback')}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 flex items-center gap-2 transition-all cursor-pointer text-left"
            >
              <MessageSquare className="w-4 h-4 text-teal-600 shrink-0" />
              <div className="truncate">
                <span className="block font-bold">User Feedback</span>
                <span className="text-[10px] text-slate-400">Rate Services</span>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('investor_wizard')}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 flex items-center gap-2 transition-all cursor-pointer text-left"
            >
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="truncate">
                <span className="block font-bold">Investor Services</span>
                <span className="text-[10px] text-slate-400">Incentive Wizard</span>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('imprisonment_provisions')}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 flex items-center gap-2 transition-all cursor-pointer text-left"
            >
              <Scale className="w-4 h-4 text-slate-700 shrink-0" />
              <div className="truncate">
                <span className="block font-bold">Jan Vishwas</span>
                <span className="text-[10px] text-slate-400">Decriminalized</span>
              </div>
            </button>

          </div>
        </div>
      </section>

      {/* =========================================================================
          LEVEL 4: DOCUMENTS, GRIEVANCE & STRATEGIC SUPPORT PANELS
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document Vault Summary */}
        <div className="bg-white/92 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-lg shadow-slate-900/10 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Document Repository</h3>
              </div>
              <span className="text-xs font-bold text-blue-700 font-mono">
                {verifiedDocsCount}/{documents.length} Verified
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Pre-validated digital vault linked directly with UIDAI, MCA, and GSTN.
            </p>

            <div className="space-y-2 pt-1">
              {documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{doc.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    doc.status === 'verified' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.status === 'verified' ? 'Verified' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('document_repository')}
            className="w-full mt-4 py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold transition-all text-center cursor-pointer shadow-2xs"
          >
            Manage All Vault Documents →
          </button>
        </div>

        {/* Grievance & Feedback Operational Area */}
        <div className="bg-white/92 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-lg shadow-slate-900/10 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Grievances & Support</h3>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Resolution Desk
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Direct escalation channel to Maharashtra single window nodal officers.
            </p>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Open Queries</span>
                <span className="text-lg font-black text-amber-700">{pendingQueries.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Resolution Rate</span>
                <span className="text-lg font-black text-emerald-700">100%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-700" />
                Nodal Escalation SLA
              </span>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Statutory responses are guaranteed within 7 working days as per Maharashtra Right to Public Services Act.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => onNavigateTab('grievance')}
              className="py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all text-center cursor-pointer shadow-2xs"
            >
              Lodge Grievance
            </button>
            <button
              onClick={() => onNavigateTab('feedback')}
              className="py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all text-center cursor-pointer shadow-2xs"
            >
              Submit Feedback
            </button>
          </div>
        </div>

        {/* Investor Support & Incentives */}
        <div className="bg-white/92 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-lg shadow-slate-900/10 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Incentives & Strategic Support</h3>
              </div>
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                PSI 2019
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Package Scheme of Incentives matched to your {profile.scale} unit in {profile.district}.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-200 text-purple-950">
                <span className="font-bold block">Industrial Promotion Subsidy (IPS)</span>
                <span className="text-[11px] text-purple-800">Up to 60% Gross SGST reimbursement for 7 years</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                <span className="font-bold block">Stamp Duty & Electricity Exemption</span>
                <span className="text-[11px] text-slate-600">100% exemption on industrial land acquisition</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('investor_wizard')}
            className="w-full mt-4 py-2 px-3 rounded-lg border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-all text-center cursor-pointer shadow-2xs"
          >
            Calculate Eligible Subsidies →
          </button>
        </div>

      </div>

      {/* =========================================================================
          LEVEL 5: ANALYTICS & REGULATORY SUMMARY (NO FAKE CHARTS)
         ========================================================================= */}
      <section className="bg-white/92 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-lg shadow-slate-900/10">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-700" />
              Industrial Compliance & Operational Profile
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authentic unit configuration driving automated statutory eligibility
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('business_profile')}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          
          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">Pollution Category</span>
            <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                pollutionCategory.includes('Red') 
                  ? 'bg-rose-500' 
                  : pollutionCategory.includes('Orange') 
                  ? 'bg-amber-500' 
                  : 'bg-emerald-500'
              }`} />
              {pollutionCategory}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">Connected Power</span>
            <span className="font-bold text-slate-800 text-sm font-mono">
              {profile.connectedPowerKw?.toLocaleString() || '150'} kW
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">Capital Investment</span>
            <span className="font-bold text-slate-800 text-sm font-mono">
              ₹ {profile.investmentCrores || 15} Crores
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">Direct Workforce</span>
            <span className="font-bold text-slate-800 text-sm font-mono">
              {profile.workforce || 120} Employees
            </span>
          </div>

        </div>
      </section>

    </div>
  );
};
