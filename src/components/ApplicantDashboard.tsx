import React, { useState, useEffect } from 'react';
import { 
  BusinessProfile, 
  ApprovalItem, 
  DocumentItem, 
  IncentiveScheme 
} from '../types';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Upload, 
  Calendar, 
  Search, 
  ChevronRight, 
  ArrowRight, 
  Download, 
  RefreshCw,
  Send,
  Zap,
  Sliders,
  Award,
  FileCheck,
  CheckCircle,
  XCircle,
  ExternalLink,
  MessageSquare,
  Edit3,
  MapPin,
  Lock,
  Plus
} from 'lucide-react';
import { calculatePollutionCategory } from '../data/regulatoryEngine';

interface ApplicantDashboardProps {
  profile: BusinessProfile;
  approvals: ApprovalItem[];
  documents: DocumentItem[];
  schemes: IncentiveScheme[];
  onUpdateProfile: (newProfile: BusinessProfile) => void;
  onUpdateApprovals: (newApprovals: ApprovalItem[]) => void;
  onUpdateDocuments: (newDocs: DocumentItem[]) => void;
  onOpenFlowchart: () => void;
  onOpenRegistration: () => void;
}

export const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({
  profile,
  approvals,
  documents,
  schemes,
  onUpdateProfile,
  onUpdateApprovals,
  onUpdateDocuments,
  onOpenFlowchart,
  onOpenRegistration,
}) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'regulatory_engine' | 'vault' | 'queries' | 'inspections' | 'renewals' | 'schemes'>('approvals');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(approvals[0] || null);
  
  // Missing parameter / quick update modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...profile });

  useEffect(() => {
    setProfileForm({ ...profile });
    if (!selectedApproval || !approvals.some(a => a.id === selectedApproval.id)) {
      setSelectedApproval(approvals[0] || null);
    }
  }, [profile, approvals]);

  // Regulatory Engine State (Synced directly with the active authenticated company)
  const [engineForm, setEngineForm] = useState({
    businessName: profile.name,
    sector: profile.sector,
    state: profile.state,
    district: profile.district,
    investmentCrores: profile.investmentCrores,
    workforce: profile.workforce,
    powerKw: profile.connectedPowerKw,
    isHazardous: profile.handlesHazardous,
    landCategory: profile.landType,
  });

  useEffect(() => {
    setEngineForm({
      businessName: profile.name,
      sector: profile.sector,
      state: profile.state,
      district: profile.district,
      investmentCrores: profile.investmentCrores,
      workforce: profile.workforce,
      powerKw: profile.connectedPowerKw,
      isHazardous: profile.handlesHazardous,
      landCategory: profile.landType,
    });
  }, [profile]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Document Vault & Pre-validation State
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(documents[0] || null);
  const [isPrevalidating, setIsPrevalidating] = useState(false);
  const [prevalResult, setPrevalResult] = useState<any>(null);

  // Query Resolution Assistant State
  const [activeQueryApproval, setActiveQueryApproval] = useState<ApprovalItem | null>(
    approvals.find(a => a.queries.some(q => q.status === 'pending')) || approvals[0] || null
  );
  const [queryDraft, setQueryDraft] = useState<string>('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [querySubmitted, setQuerySubmitted] = useState(false);

  // Filtered approvals
  const filteredApprovals = approvals.filter(app => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'under_scrutiny') return app.status === 'under_scrutiny';
    if (statusFilter === 'query_raised') return app.status === 'query_raised';
    if (statusFilter === 'approved') return app.status === 'approved';
    if (statusFilter === 'fast_track') return app.fastTrack;
    return true;
  });

  // Calculate dynamic metrics strictly from current data
  const totalApprovals = approvals.length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const pendingQueryCount = approvals.reduce((acc, a) => acc + (a.queries?.filter(q => q.status === 'pending').length || 0), 0);
  const verifiedDocsCount = documents.filter(d => d.status === 'verified').length;
  const pollutionCategory = calculatePollutionCategory(profile.sector, profile.handlesHazardous, profile.connectedPowerKw, profile.investmentCrores);

  // Run AI Regulatory Engine
  const handleRunRegulatoryEngine = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch('/api/ai/regulatory-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(engineForm),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Document Pre-validation
  const handleSimulatePrevalidation = async (fileName: string, type: string) => {
    setIsPrevalidating(true);
    setPrevalResult(null);
    try {
      const res = await fetch('/api/ai/prevalidate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType: type,
          fileName: fileName || 'Uploaded_Document_Submission.pdf',
          applicantName: profile.name,
          companyGst: profile.gstin,
        }),
      });
      const data = await res.json();
      setPrevalResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPrevalidating(false);
    }
  };

  // Generate AI Query Draft
  const handleGenerateQueryDraft = async () => {
    if (!activeQueryApproval) return;
    const targetQuery = activeQueryApproval.queries?.find(q => q.status === 'pending') || activeQueryApproval.queries?.[0];
    if (!targetQuery) return;

    setIsGeneratingDraft(true);
    try {
      const res = await fetch('/api/ai/query-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: targetQuery.department,
          approvalName: activeQueryApproval.name,
          queryText: targetQuery.queryText,
          applicantContext: `${profile.name}, ${profile.sector}, ${profile.district}, ${profile.state}`,
        }),
      });
      const data = await res.json();
      setQueryDraft(data.suggestedResponse || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  // Submit query response
  const handleSubmitQueryResponse = () => {
    if (!activeQueryApproval) return;
    const updated = approvals.map(app => {
      if (app.id === activeQueryApproval.id) {
        return {
          ...app,
          status: 'under_scrutiny' as const,
          stageName: 'Department Re-Scrutiny of Submitted Response',
          queries: app.queries.map(q => ({
            ...q,
            status: 'resolved' as const,
            responseText: queryDraft,
          }))
        };
      }
      return app;
    });
    onUpdateApprovals(updated);
    setQuerySubmitted(true);
    setTimeout(() => setQuerySubmitted(false), 4000);
  };

  const handleSaveProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setShowEditProfileModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Concise 5-Step Clearance Journey Tracker */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Statutory Clearance Journey
          </span>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Single-Window Fast-Track
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 flex flex-col justify-between">
            <span className="font-mono font-black text-teal-700 text-base">01</span>
            <span className="font-bold text-slate-800 mt-1">Company & Rule Mapping</span>
            <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
            <span className="font-mono font-black text-emerald-700 text-base">02</span>
            <span className="font-bold text-slate-800 mt-1">Document Vault</span>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> {verifiedDocsCount} Files Active
            </span>
          </div>

          <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 flex flex-col justify-between">
            <span className="font-mono font-black text-sky-700 text-base">03</span>
            <span className="font-bold text-slate-800 mt-1">Department Submission</span>
            <span className="text-[11px] font-semibold text-sky-700 flex items-center gap-1 mt-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> In Progress
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
            <span className="font-mono font-black text-amber-700 text-base">04</span>
            <span className="font-bold text-slate-800 mt-1">Scrutiny & Queries</span>
            <span className="text-[11px] font-semibold text-amber-800 mt-1">
              {pendingQueryCount > 0 ? `${pendingQueryCount} Action Due` : 'In Review'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="font-mono font-black text-slate-400 text-base">05</span>
            <span className="font-bold text-slate-800 mt-1">Inspection & Approval</span>
            <span className="text-[11px] font-semibold text-slate-500 mt-1">
              {approvedCount} / {totalApprovals} Sealed
            </span>
          </div>
        </div>
      </div>

      {/* 2. Active Company Profile & Parameters Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                ACTIVE BUSINESS
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {profile.businessType || 'Private Limited'}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                pollutionCategory === 'Red Category' 
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : (pollutionCategory === 'Orange Category' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200')
              }`}>
                {pollutionCategory}
              </span>
              {profile.handlesHazardous && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  ⚠️ Hazardous Material
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {profile.name}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
              {profile.cin && <span>CIN: <strong className="font-mono text-slate-800">{profile.cin}</strong></span>}
              <span>PAN: <strong className="font-mono text-slate-800">{profile.pan}</strong></span>
              <span>GSTIN: <strong className="font-mono text-slate-800">{profile.gstin}</strong></span>
              <span>Jurisdiction: <strong className="text-slate-800">{profile.district}, {profile.state}</strong></span>
            </div>

            {profile.address && (
              <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>{profile.address}</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowEditProfileModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Parameters
            </button>
            <button
              onClick={onOpenRegistration}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Register New Company
            </button>
          </div>
        </div>

        {/* Dynamic Project Parameters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sector / Activity</span>
            <span className="font-bold text-slate-800 mt-0.5 truncate block" title={profile.sector}>
              {profile.sector || 'Not Declared'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Capital Outlay</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              ₹{profile.investmentCrores} Crores
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Connected Power</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {profile.connectedPowerKw} kW
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Workforce Scale</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {profile.workforce} Employees
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Land Category</span>
            <span className="font-bold text-slate-800 mt-0.5 truncate block" title={profile.landType}>
              {profile.landType}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Enterprise Scale</span>
            <span className="font-bold text-teal-700 mt-0.5 block">
              {profile.scale} (MSME)
            </span>
          </div>
        </div>

        {/* 4 Dynamic Calculated Stat Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Applicable Approvals</span>
              <Building2 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{totalApprovals} Identified</div>
            <span className="text-[11px] text-slate-500">Tailored to {profile.sector}</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center justify-between text-xs text-emerald-800 mb-1">
              <span>Approved & Sealed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-800">{approvedCount}</div>
            <span className="text-[11px] text-emerald-700">Digital QR Certificates</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-center justify-between text-xs text-amber-800 mb-1">
              <span>Action Due (Queries)</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-800">{pendingQueryCount}</div>
            <span className="text-[11px] text-amber-700">7-Day Response SLA</span>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200">
            <div className="flex items-center justify-between text-xs text-sky-800 mb-1">
              <span>Single Document Vault</span>
              <FileCheck className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-sky-800">{verifiedDocsCount}</div>
            <span className="text-[11px] text-sky-700">Pre-Validated Reusable Files</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Sub-Tabs (Clean Light Theme) */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-slate-200">
        {[
          { id: 'approvals', label: 'Clearance Dossiers', icon: Building2, badge: `${totalApprovals} Identified` },
          { id: 'regulatory_engine', label: 'AI Regulatory Rule Engine', icon: Sparkles, badge: 'Smart' },
          { id: 'vault', label: 'Single Document Vault', icon: FileText, badge: `${verifiedDocsCount} Reusable` },
          { id: 'queries', label: 'Queries & Clarifications', icon: MessageSquare, badge: pendingQueryCount > 0 ? `${pendingQueryCount} Action Due` : '0' },
          { id: 'inspections', label: 'Joint Synchronized Inspection', icon: Clock, badge: 'Protocol' },
          { id: 'renewals', label: 'Certificates & Renewals', icon: Calendar, badge: 'Live' },
          { id: 'schemes', label: 'Incentives & Schemes', icon: Award, badge: `${schemes.length} Matched` },
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-slate-900'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: CLEARANCE DOSSIERS & PARALLEL WORKFLOWS */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Filter Approvals:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Applicable Approvals ({approvals.length})</option>
                <option value="under_scrutiny">Under Scrutiny</option>
                <option value="query_raised">Query Raised (Action Required)</option>
                <option value="approved">Approved & Certificates</option>
                <option value="fast_track">Green Channel Fast-Track</option>
              </select>
            </div>

            <div className="text-xs text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Parallel Multi-Department Processing Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Approvals List */}
            <div className="lg:col-span-7 space-y-4">
              {filteredApprovals.map((app) => {
                const isSelected = selectedApproval?.id === app.id;
                const isOverdue = app.daysElapsed > app.slaDays;
                const hasPendingQuery = app.queries?.some(q => q.status === 'pending');

                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApproval(app)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-teal-600 shadow-md ring-1 ring-teal-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 font-bold">{app.code}</span>
                        <h4 className="font-bold text-slate-900 text-base leading-tight">
                          {app.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{app.department}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {app.status === 'approved' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved
                          </span>
                        )}
                        {app.status === 'query_raised' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Query Raised
                          </span>
                        )}
                        {app.status === 'under_scrutiny' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 flex items-center gap-1">
                            <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" /> Under Scrutiny
                          </span>
                        )}
                        {app.status === 'not_started' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" /> Pending Submission
                          </span>
                        )}
                        {app.fastTrack && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ⚡ Green Channel Fast-Track
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-600 font-medium">
                          Current Stage: <strong className="text-slate-800">{app.stageName}</strong>
                        </span>
                        <span className={`font-mono text-xs ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                          Day {app.daysElapsed} of {app.slaDays} SLA
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            app.status === 'approved' 
                              ? 'bg-emerald-500' 
                              : (isOverdue ? 'bg-rose-500' : 'bg-teal-500')
                          }`}
                          style={{ width: `${Math.min(100, (app.daysElapsed / (app.slaDays || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {hasPendingQuery && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center justify-between">
                        <span className="text-amber-800 font-semibold">
                          Clarification requested by scrutiny officer.
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveQueryApproval(app);
                            setActiveTab('queries');
                          }}
                          className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold text-xs hover:bg-amber-700 transition-all flex items-center gap-1"
                        >
                          Resolve Now <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Approval Detail Drawer */}
            <div className="lg:col-span-5">
              {selectedApproval ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6 space-y-5">
                  <div className="pb-4 border-b border-slate-100">
                    <span className="text-[11px] font-mono text-teal-700 font-bold uppercase">
                      APPROVAL DOSSIER DETAILS
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {selectedApproval.name}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedApproval.department}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Statutory SLA</span>
                      <span className="text-sm font-bold text-slate-800">{selectedApproval.slaDays} Days</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Risk Classification</span>
                      <span className="text-sm font-bold text-slate-800">{selectedApproval.riskTier} Tier</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Statutory Fee</span>
                      <span className="text-sm font-bold text-slate-800">₹{selectedApproval.feeAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Submission Status</span>
                      <span className="text-sm font-bold text-slate-800">{selectedApproval.submittedDate || 'Pending Submission'}</span>
                    </div>
                  </div>

                  {/* Required Documents from Vault */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Linked Reusable Documents (Single Vault)
                    </h4>
                    <div className="space-y-2">
                      {selectedApproval.requiredDocs?.map((docTitle, idx) => {
                        const isUploaded = selectedApproval.submittedDocs?.includes(docTitle);
                        return (
                          <div 
                            key={idx}
                            className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <span className="text-slate-700 font-medium truncate pr-2">
                              {docTitle}
                            </span>
                            {isUploaded ? (
                              <span className="text-emerald-700 flex items-center gap-1 font-bold shrink-0">
                                <CheckCircle className="w-3.5 h-3.5" /> Verified
                              </span>
                            ) : (
                              <span className="text-amber-700 flex items-center gap-1 font-bold shrink-0">
                                <Clock className="w-3.5 h-3.5" /> Pending
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Certificate Download if approved */}
                  {selectedApproval.status === 'approved' && selectedApproval.certificateNumber && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-900">
                          Digital Clearance Certificate Issued
                        </span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono">
                          QR-Signed
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-mono mb-3">
                        Cert No: {selectedApproval.certificateNumber}
                      </p>
                      <button
                        onClick={() => alert(`Certificate ${selectedApproval.certificateNumber} downloaded from Single Document Vault with Cryptographic Seal.`)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <Download className="w-4 h-4" /> Download Official Certificate
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                  Select an approval on the left to inspect dossier details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI REGULATORY ENGINE & SMART CHECKLIST GENERATOR */}
      {activeTab === 'regulatory_engine' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2 border border-teal-200">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                AI Regulatory Knowledge Engine (Powered by Gemini 3.8 Flash)
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Dynamic Clearance Mapping for {profile.name}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Company parameters drive the regulatory engine. The algorithm maps Environment Protection Acts, Factories Act, and State Industrial Policies to pinpoint exact approvals, fast-track eligibility, and risk tiers.
              </p>
            </div>

            {/* Interactive Parameter Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Enterprise Name
                </label>
                <input
                  type="text"
                  value={engineForm.businessName}
                  onChange={(e) => setEngineForm({ ...engineForm, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sector / Industry
                </label>
                <select
                  value={engineForm.sector}
                  onChange={(e) => setEngineForm({ ...engineForm, sector: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold"
                >
                  <option value="Engineering & Heavy Manufacturing">Engineering & Heavy Manufacturing</option>
                  <option value="Manufacturing (General)">Manufacturing (General)</option>
                  <option value="Automotive & EV Components">Automotive & EV Components</option>
                  <option value="Pharmaceuticals & APIs">Pharmaceuticals & APIs</option>
                  <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                  <option value="Food Processing & Agri Logistics">Food Processing & Agri Logistics</option>
                  <option value="Textiles & Garment Manufacturing">Textiles & Garment Manufacturing</option>
                  <option value="IT, Software & Data Centers">IT, Software & Data Centers</option>
                  <option value="Renewable Energy & Solar">Renewable Energy & Solar</option>
                  <option value="Construction & Building Materials">Construction & Building Materials</option>
                  <option value="Logistics & Warehousing">Logistics & Warehousing</option>
                  <option value="Agriculture / Agro Processing">Agriculture / Agro Processing</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Capital Investment (₹ Crores)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={engineForm.investmentCrores}
                  onChange={(e) => setEngineForm({ ...engineForm, investmentCrores: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Connected Power Load (kW)
                </label>
                <input
                  type="number"
                  value={engineForm.powerKw}
                  onChange={(e) => setEngineForm({ ...engineForm, powerKw: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jurisdiction (State / District)
                </label>
                <input
                  type="text"
                  value={`${engineForm.district}, ${engineForm.state}`}
                  onChange={(e) => setEngineForm({ ...engineForm, district: e.target.value.split(',')[0]?.trim() || e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Workforce Count
                </label>
                <input
                  type="number"
                  value={engineForm.workforce}
                  onChange={(e) => setEngineForm({ ...engineForm, workforce: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Land Category
                </label>
                <select
                  value={engineForm.landCategory}
                  onChange={(e) => setEngineForm({ ...engineForm, landCategory: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold"
                >
                  <option value="Industrial Park (Allotted)">Industrial Park (Allotted MIDC/GIDC)</option>
                  <option value="Agricultural (Requires CLU)">Agricultural (Requires Change of Land Use)</option>
                  <option value="Private Commercial">Private Commercial Zone</option>
                  <option value="SEZ Free Trade Zone">Special Economic Zone (SEZ)</option>
                </select>
              </div>

              <div className="flex items-center pt-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={engineForm.isHazardous}
                    onChange={(e) => setEngineForm({ ...engineForm, isHazardous: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-bold text-slate-800">
                    Handles Hazardous Materials
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={handleRunRegulatoryEngine}
              disabled={isAnalyzing}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Querying AI Regulatory Knowledge Base...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Re-evaluate Clearances & Risk Score
                </>
              )}
            </button>
          </div>

          {/* AI Regulatory Result Card */}
          {analysisResult && (
            <div className="bg-white border-2 border-teal-600 rounded-2xl p-6 shadow-lg space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                    ENGINE EVALUATION REPORT
                  </div>
                  <h4 className="text-xl font-black text-slate-900">
                    {analysisResult.summary}
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    analysisResult.pollutionCategory?.includes('Red') 
                      ? 'bg-rose-100 text-rose-800'
                      : (analysisResult.pollutionCategory?.includes('Orange') ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800')
                  }`}>
                    {analysisResult.pollutionCategory}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                    {analysisResult.riskTier}
                  </span>
                  {analysisResult.fastTrackEligible && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      ⚡ 48-Hour Deemed Fast-Track
                    </span>
                  )}
                </div>
              </div>

              {/* Identified Clearances Table */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Mandatory Identified Statutory Clearances ({analysisResult.keyClearances?.length || 0})
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-2.5 px-3 font-bold text-slate-700">Department</th>
                        <th className="py-2.5 px-3 font-bold text-slate-700">Approval / NOC Name</th>
                        <th className="py-2.5 px-3 font-bold text-slate-700">SLA Days</th>
                        <th className="py-2.5 px-3 font-bold text-slate-700">Criticality</th>
                        <th className="py-2.5 px-3 font-bold text-slate-700">Legal Justification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analysisResult.keyClearances?.map((cl: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-bold text-slate-900">{cl.department}</td>
                          <td className="py-3 px-3 text-slate-800 font-medium">{cl.approvalName}</td>
                          <td className="py-3 px-3 font-mono font-bold text-teal-700">{cl.slaDays} d</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cl.criticality === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {cl.criticality}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{cl.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Strategic Recommendations */}
              {analysisResult.aiRecommendations && (
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    Compliance Acceleration Tips
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {analysisResult.aiRecommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SINGLE DOCUMENT VAULT & AI PRE-VALIDATION */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold mb-2 border border-sky-200">
                  <FileCheck className="w-3.5 h-3.5 text-sky-600" />
                  Verified Reusable Document Vault
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Store Once, Auto-Populate Across All Clearances
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Upload deeds, layouts, and statutory filings once. The vault injects them into MPCB, Fire, DISH, and MSEDCL dossiers with automated OCR pre-validation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSimulatePrevalidation('Nashik_Factory_Site_Plan_Signed.pdf', 'Technical Architectural Layout')}
                  disabled={isPrevalidating}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  {isPrevalidating ? 'Running AI Pre-Scrutiny...' : 'Simulate Upload & Pre-Validate'}
                </button>
              </div>
            </div>

            {/* Prevalidation Live Result Banner */}
            {prevalResult && (
              <div className="mt-6 p-5 rounded-2xl border-2 border-teal-600 bg-teal-50/50 animate-fadeIn space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    AI Pre-Validation Scrutiny Completed
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    prevalResult.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    Quality Score: {prevalResult.validationScore}%
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">
                  {prevalResult.fileName} ({prevalResult.docType})
                </h4>
                <p className="text-xs text-slate-700">{prevalResult.correctionGuidance}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {prevalResult.checklistResults?.map((chk: any, idx: number) => (
                    <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                      <span className="text-slate-700 font-medium">{chk.check}</span>
                      {chk.passed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Documents in Vault */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              <div className="lg:col-span-6 space-y-3">
                {documents.map((doc) => {
                  const isSelected = selectedDoc?.id === doc.id;
                  const isDefective = doc.status === 'needs_correction';
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/40 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-600" />
                          <h4 className="font-bold text-slate-900 text-sm">
                            {doc.name}
                          </h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isDefective
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isDefective ? 'Correction Required' : 'Pre-Validated 100%'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                        <span>Category: <strong>{doc.category}</strong></span>
                        <span>Size: <strong>{doc.fileSize}</strong></span>
                        <span>Score: <strong className={isDefective ? 'text-rose-600' : 'text-emerald-600'}>{doc.validationScore}%</strong></span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500 truncate">
                        Linked Approvals: {doc.linkedApprovals?.join(', ') || 'General Dossier'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Document Scrutiny Details Panel */}
              <div className="lg:col-span-6">
                {selectedDoc ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">VAULT ASSET ID: {selectedDoc.id}</span>
                        <h4 className="font-bold text-slate-900 text-base mt-0.5">
                          {selectedDoc.name}
                        </h4>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-white rounded border border-slate-200 font-semibold">
                        {selectedDoc.type}
                      </span>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Automated OCR Pre-Scrutiny Verification Matrix
                      </h5>
                      <div className="space-y-2">
                        {selectedDoc.checklistResults?.map((chk, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center justify-between font-semibold">
                              <span className="text-slate-800">{chk.check}</span>
                              {chk.passed ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> Passed
                                </span>
                              ) : (
                                <span className="text-rose-600 font-bold flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" /> Flagged Defect
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 mt-1 text-[11px]">{chk.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedDoc.missingOrInvalidItems && selectedDoc.missingOrInvalidItems.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                        <h5 className="text-xs font-bold text-rose-800 mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Clerical Defect Detected
                        </h5>
                        <ul className="list-disc list-inside text-xs text-rose-700 space-y-1">
                          {selectedDoc.missingOrInvalidItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                        {selectedDoc.correctionGuidance && (
                          <p className="text-[11px] text-slate-600 mt-2 font-medium">
                            Guidance: {selectedDoc.correctionGuidance}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400">Select a document from the vault.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUERIES & AI RESPONSE ASSISTANT */}
      {activeTab === 'queries' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Online Query & Clarification Desk
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Resolve Scrutiny Inquiries with AI Drafting
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                No physical visits required. Department inquiries trigger automated alerts. The AI Assistant generates legally precise responses tailored to statutory regulations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Active Queries List */}
              <div className="lg:col-span-5 space-y-3">
                {approvals.flatMap(a => (a.queries || []).map(q => ({ query: q, approval: a }))).map(({ query, approval }) => {
                  const isSelected = activeQueryApproval?.id === approval.id;
                  return (
                    <div
                      key={query.id}
                      onClick={() => {
                        setActiveQueryApproval(approval);
                        setQueryDraft(query.responseDraft || query.responseText || '');
                      }}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-white ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/40 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-[10px] text-slate-400">{query.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          query.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {query.status === 'pending' ? 'Action Due' : 'Resolved'}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mb-1">
                        {approval.name}
                      </h4>
                      <p className="text-xs text-slate-500 mb-2">{query.department} • Officer: {query.officerName}</p>

                      <div className="p-2.5 rounded-lg bg-slate-50 text-xs text-slate-700 font-medium">
                        "{query.queryText}"
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                        <span>Raised: {query.dateRaised}</span>
                        <span className="text-rose-600 font-bold">Deadline: {query.deadlineDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Query Response Drafting Center */}
              <div className="lg:col-span-7">
                {activeQueryApproval && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-teal-700 uppercase">OFFICIAL RESPONSE WORKBENCH</span>
                        <h4 className="font-bold text-slate-900 text-base">
                          {activeQueryApproval.name}
                        </h4>
                      </div>
                      <button
                        onClick={handleGenerateQueryDraft}
                        disabled={isGeneratingDraft}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {isGeneratingDraft ? 'Drafting...' : 'AI Generate Compliant Response'}
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Statutory Formal Response Letter (Editable):
                      </label>
                      <textarea
                        rows={8}
                        value={queryDraft}
                        onChange={(e) => setQueryDraft(e.target.value)}
                        placeholder="Click 'AI Generate Compliant Response' above or type directly..."
                        className="w-full text-xs font-mono p-3 rounded-xl bg-white border border-slate-300 text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>Attachment: Revised Technical Specification</span>
                      </div>

                      <button
                        onClick={handleSubmitQueryResponse}
                        disabled={!queryDraft.trim()}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Submit Response to Scrutiny Officer
                      </button>
                    </div>

                    {querySubmitted && (
                      <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Response submitted successfully! Scrutiny clock reset.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: JOINT SYNCHRONIZED INSPECTION SCHEDULER */}
      {activeTab === 'inspections' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2 border border-teal-200">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Joint Synchronized Inspection Protocol
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                One Unified Site Visit Across All Departments
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Replaces uncoordinated individual visits. Fire, Pollution Control, and Factory Safety inspectors visit {profile.district} simultaneously on a pre-notified date with an integrated digital checklist.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-400 uppercase">INSPECTION ORDER: INSP-2026-MH-01</span>
                  <h4 className="text-xl font-bold text-white mt-1">Joint Synchronized Site Verification</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{profile.address || `${profile.district}, ${profile.state}`}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-teal-400 uppercase block font-semibold">Scheduled Date</span>
                  <span className="text-2xl font-black text-white">30 March 2026</span>
                  <span className="text-xs text-slate-400 block">10:30 AM IST</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Participating Authorities</span>
                  <ul className="space-y-1 font-semibold text-slate-200">
                    <li>• Maharashtra Pollution Control Board (MPCB)</li>
                    <li>• Maharashtra Fire Services</li>
                    <li>• Directorate of Industrial Safety (DISH)</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Lead Coordinating Officer</span>
                  <p className="font-bold text-white">Er. S. R. Deshmukh</p>
                  <p className="text-slate-400">Chief Joint Inspection Officer</p>
                  <p className="text-teal-400 mt-1 font-mono">+91 253 235 1244</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Inspection Protocol</span>
                  <p className="text-slate-300">
                    GPS geotagged mobile appraisal with synchronized digital observations uploaded directly to the single window server within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DIGITAL CERTIFICATES & COMPLIANCE CALENDAR */}
      {activeTab === 'renewals' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Statutory Compliance & Renewal Calendar
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Post-Approval Compliance & Renewal Reminders
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Track upcoming statutory renewals, annual audit submissions, and environmental returns with multi-channel alerts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: `Electricity HT Sanction (${profile.connectedPowerKw} kW)`,
                  dept: 'Maharashtra State DISCOM (MSEDCL)',
                  certNo: 'MSEDCL/NSK-AMBAD/HT/2026/4192',
                  status: 'Active',
                  expiry: '2029-03-31',
                  action: 'Download Certificate',
                  badge: 'Valid 3 Years'
                },
                {
                  title: 'Provisional Fire Safety NOC',
                  dept: 'Maharashtra Fire Services & MIDC',
                  certNo: 'MH-FIRE/NOC/2026/1089',
                  status: 'Renewal Due for Final Occupancy',
                  expiry: '2026-12-31',
                  action: 'Schedule Final Inspection',
                  badge: 'Occupancy Renewal'
                },
                {
                  title: 'Water & Air Act Consent to Operate (CTO)',
                  dept: 'Maharashtra Pollution Control Board',
                  certNo: 'MPCB/CTE/2026/8841',
                  status: 'Scheduled Upon CTE Completion',
                  expiry: '2031-03-31',
                  action: 'View Compliance Roadmap',
                  badge: '5-Year Validity'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {item.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-400">QR-Signed</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 mb-2">{item.dept}</p>
                    <p className="text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded-lg">
                      Cert No: {item.certNo}
                    </p>
                    <div className="text-xs text-slate-500 mt-3">
                      Validity Expires: <strong className="text-slate-900">{item.expiry}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Certificate ${item.certNo} retrieved with verifiable cryptographic QR seal.`)}
                    className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: INCENTIVE & SCHEME MATCHER */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2 border border-teal-200">
                <Award className="w-3.5 h-3.5 text-teal-600" />
                Tailored Incentive & Scheme Matcher
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Matched Subsidies & Concessions for {profile.name}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Matched specifically for your {profile.sector} sector, ₹{profile.investmentCrores} Cr capital outlay, and location in {profile.district}, {profile.state}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {schemes.map((sch) => (
                <div
                  key={sch.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:border-teal-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        Match Score: {sch.matchScore}%
                      </span>
                      <span className="text-xs text-rose-600 font-bold">Apply by: {sch.deadline}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base mb-1">
                      {sch.name}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">{sch.ministry}</p>

                    <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 mb-3">
                      <span className="text-[10px] font-bold text-teal-800 uppercase block">
                        Estimated Financial Benefit
                      </span>
                      <span className="text-sm font-black text-teal-900">
                        {sch.financialBenefit}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      <strong>Eligibility:</strong> {sch.eligibility}
                    </p>
                  </div>

                  <button
                    onClick={() => alert(`Application for ${sch.name} prepared using pre-validated documents from your Single Vault!`)}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    Apply with 1-Click Vault Dossier <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROJECT PARAMETERS MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 my-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Update Project Profile</h3>
                <p className="text-xs text-slate-500">Parameters dynamically re-calculate statutory clearances and risk scores.</p>
              </div>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfileUpdate} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sector / Industry</label>
                  <select
                    value={profileForm.sector}
                    onChange={(e) => setProfileForm({ ...profileForm, sector: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                  >
                    <option value="Engineering & Heavy Manufacturing">Engineering & Heavy Manufacturing</option>
                    <option value="Manufacturing (General)">Manufacturing (General)</option>
                    <option value="Automotive & EV Components">Automotive & EV Components</option>
                    <option value="Pharmaceuticals & APIs">Pharmaceuticals & APIs</option>
                    <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                    <option value="Food Processing & Agri Logistics">Food Processing & Agri Logistics</option>
                    <option value="Textiles & Garment Manufacturing">Textiles & Garment Manufacturing</option>
                    <option value="IT, Software & Data Centers">IT, Software & Data Centers</option>
                    <option value="Renewable Energy & Solar">Renewable Energy & Solar</option>
                    <option value="Construction & Building Materials">Construction & Building Materials</option>
                    <option value="Logistics & Warehousing">Logistics & Warehousing</option>
                    <option value="Agriculture / Agro Processing">Agriculture / Agro Processing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Land Classification</label>
                  <select
                    value={profileForm.landType}
                    onChange={(e) => setProfileForm({ ...profileForm, landType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                  >
                    <option value="Industrial Park (Allotted)">Industrial Park (Allotted MIDC/GIDC)</option>
                    <option value="Agricultural (Requires CLU)">Agricultural (Requires CLU)</option>
                    <option value="Private Commercial">Private Commercial Zone</option>
                    <option value="SEZ Free Trade Zone">SEZ Free Trade Zone</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Investment (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={profileForm.investmentCrores}
                    onChange={(e) => setProfileForm({ ...profileForm, investmentCrores: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Power Load (kW)</label>
                  <input
                    type="number"
                    value={profileForm.connectedPowerKw}
                    onChange={(e) => setProfileForm({ ...profileForm, connectedPowerKw: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Workforce Count</label>
                  <input
                    type="number"
                    value={profileForm.workforce}
                    onChange={(e) => setProfileForm({ ...profileForm, workforce: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={profileForm.handlesHazardous}
                    onChange={(e) => setProfileForm({ ...profileForm, handlesHazardous: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-bold text-slate-800">
                    Handles Hazardous / Inflammable Chemicals
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md"
                >
                  Save & Recalculate Clearances
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
