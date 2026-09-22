import React, { useState } from 'react';
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
  MessageSquare
} from 'lucide-react';

interface ApplicantDashboardProps {
  profile: BusinessProfile;
  approvals: ApprovalItem[];
  documents: DocumentItem[];
  schemes: IncentiveScheme[];
  onUpdateApprovals: (newApprovals: ApprovalItem[]) => void;
  onUpdateDocuments: (newDocs: DocumentItem[]) => void;
  onOpenFlowchart: () => void;
}

export const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({
  profile,
  approvals,
  documents,
  schemes,
  onUpdateApprovals,
  onUpdateDocuments,
  onOpenFlowchart,
}) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'regulatory_engine' | 'vault' | 'queries' | 'inspections' | 'renewals' | 'schemes'>('approvals');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(approvals[0] || null);
  
  // Regulatory Engine State
  const [engineForm, setEngineForm] = useState({
    businessName: profile.name,
    sector: profile.sector,
    state: profile.state,
    investmentCrores: profile.investmentCrores,
    workforce: profile.workforce,
    powerKw: profile.connectedPowerKw,
    isHazardous: profile.handlesHazardous,
    landCategory: profile.landType,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Document Vault & Pre-validation State
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(documents[0] || null);
  const [isPrevalidating, setIsPrevalidating] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [prevalResult, setPrevalResult] = useState<any>(null);

  // Query Resolution Assistant State
  const [activeQueryApproval, setActiveQueryApproval] = useState<ApprovalItem | null>(
    approvals.find(a => a.queries.some(q => q.status === 'pending')) || approvals[1]
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

  // Calculate metrics
  const totalApprovals = approvals.length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const pendingQueryCount = approvals.reduce((acc, a) => acc + a.queries.filter(q => q.status === 'pending').length, 0);
  const verifiedDocsCount = documents.filter(d => d.status === 'verified').length;

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
    const targetQuery = activeQueryApproval.queries.find(q => q.status === 'pending');
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
          applicantContext: `${profile.name}, ${profile.sector}, ${profile.district}`,
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Enterprise Identity & Key Metrics Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {profile.scale} Enterprise
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {profile.stage}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                profile.handlesHazardous 
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200' 
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
              }`}>
                {profile.handlesHazardous ? '⚠️ Red Category (Hazardous)' : '🟢 Green Channel Eligible'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {profile.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span>GSTIN: <strong>{profile.gstin}</strong></span>
              <span>•</span>
              <span>PAN: <strong>{profile.pan}</strong></span>
              <span>•</span>
              <span>Sector: <strong>{profile.sector}</strong></span>
              <span>•</span>
              <span>Location: <strong>{profile.district}, {profile.state}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenFlowchart}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Trace in Flowchart
            </button>
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Clearance</span>
              <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                {Math.round((approvedCount / totalApprovals) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Approvals</span>
              <Building2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalApprovals}</div>
            <span className="text-[10px] text-slate-500">Across 5 State Departments</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 mb-1">
              <span>Approved & Active</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{approvedCount}</div>
            <span className="text-[10px] text-emerald-600/80">Digital Certificates Available</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 mb-1">
              <span>Action Required (Queries)</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700 dark:text-amber-300">{pendingQueryCount}</div>
            <span className="text-[10px] text-amber-600/80">7-Day SLA Response Window</span>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/50">
            <div className="flex items-center justify-between text-xs text-sky-700 dark:text-sky-400 mb-1">
              <span>Single Document Vault</span>
              <FileCheck className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-sky-700 dark:text-sky-300">{verifiedDocsCount}</div>
            <span className="text-[10px] text-sky-600/80">Pre-Validated Reusable Files</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'approvals', label: 'Application Dashboard', icon: Building2, badge: totalApprovals },
          { id: 'regulatory_engine', label: 'AI Regulatory Engine', icon: Sparkles, badge: 'Smart' },
          { id: 'vault', label: 'Single Document Vault', icon: FileText, badge: verifiedDocsCount },
          { id: 'queries', label: 'Queries & Responses', icon: MessageSquare, badge: pendingQueryCount > 0 ? `${pendingQueryCount} Due` : '0' },
          { id: 'inspections', label: 'Joint Inspection Scheduler', icon: Clock, badge: '1 Visit' },
          { id: 'renewals', label: 'Certificates & Renewals', icon: Calendar, badge: 'Calendar' },
          { id: 'schemes', label: 'Incentive & Scheme Finder', icon: Award, badge: schemes.length },
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: APPLICATION DASHBOARD & PARALLEL WORKFLOWS */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Clearances ({approvals.length})</option>
                <option value="under_scrutiny">Under Scrutiny</option>
                <option value="query_raised">Query Raised (Action Due)</option>
                <option value="approved">Approved & Certificates</option>
                <option value="fast_track">Green Channel Fast-Track</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Parallel Multi-Department Processing Active</span>
            </div>
          </div>

          {/* Approvals Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Approvals List */}
            <div className="lg:col-span-7 space-y-4">
              {filteredApprovals.map((app) => {
                const isSelected = selectedApproval?.id === app.id;
                const isOverdue = app.daysElapsed > app.slaDays;
                const hasPendingQuery = app.queries.some(q => q.status === 'pending');

                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApproval(app)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-md ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">{app.code}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                          {app.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{app.department}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {app.status === 'approved' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Approved
                          </span>
                        )}
                        {app.status === 'query_raised' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            Query Raised
                          </span>
                        )}
                        {app.status === 'under_scrutiny' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                            <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                            Under Scrutiny
                          </span>
                        )}
                        {app.fastTrack && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            ⚡ Green Channel Fast-Track
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Timeline Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                          Current Stage: <strong className="text-slate-800 dark:text-slate-200">{app.stageName}</strong>
                        </span>
                        <span className={`font-mono text-xs ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                          Day {app.daysElapsed} of {app.slaDays} SLA
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            app.status === 'approved' 
                              ? 'bg-emerald-500' 
                              : (isOverdue ? 'bg-rose-500' : 'bg-indigo-500')
                          }`}
                          style={{ width: `${Math.min(100, (app.daysElapsed / app.slaDays) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {hasPendingQuery && (
                      <div className="mt-3 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs flex items-center justify-between">
                        <span className="text-amber-800 dark:text-amber-200 font-medium">
                          Scrutiny officer requested technical clarification.
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveQueryApproval(app);
                            setActiveTab('queries');
                          }}
                          className="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-bold text-xs hover:bg-amber-700 transition-all flex items-center gap-1"
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
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-6 space-y-5">
                  <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-mono text-indigo-600 font-bold uppercase">
                      APPROVAL DOSSIER DETAILS
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {selectedApproval.name}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedApproval.department}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Statutory SLA</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedApproval.slaDays} Days</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Risk Classification</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedApproval.riskTier} Tier</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Application Fee</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">₹{selectedApproval.feeAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Submission Date</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedApproval.submittedDate || 'Pending'}</span>
                    </div>
                  </div>

                  {/* Required Documents from Vault */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Linked Reusable Documents (Single Vault)
                    </h4>
                    <div className="space-y-2">
                      {selectedApproval.requiredDocs.map((docTitle, idx) => {
                        const isUploaded = selectedApproval.submittedDocs.includes(docTitle);
                        return (
                          <div 
                            key={idx}
                            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                          >
                            <span className="text-slate-700 dark:text-slate-300 font-medium truncate pr-2">
                              {docTitle}
                            </span>
                            {isUploaded ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold shrink-0">
                                <CheckCircle className="w-3.5 h-3.5" /> Verified
                              </span>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-bold shrink-0">
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
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          Digital Clearance Certificate Issued
                        </span>
                        <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded font-mono">
                          QR-Signed
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mb-3">
                        Cert No: {selectedApproval.certificateNumber}
                      </p>
                      <button
                        onClick={() => alert(`Certificate ${selectedApproval.certificateNumber} downloaded from Single Document Vault with Cryptographic Seal.`)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <Download className="w-4 h-4" /> Download Official Certificate
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400">
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI Regulatory Knowledge Engine (Powered by Gemini 3.8 Flash)
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Intelligent Approval Identification & Risk Scoring
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Enter or modify project parameters. The AI Regulatory Engine analyzes the Water/Air Acts, Central Pollution Control Board categories, National Building Code, and State Industrial Policies to pinpoint exact approvals, fast-track eligibility, and risk tiers.
              </p>
            </div>

            {/* Interactive Parameter Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enterprise Name
                </label>
                <input
                  type="text"
                  value={engineForm.businessName}
                  onChange={(e) => setEngineForm({ ...engineForm, businessName: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sector / Industry
                </label>
                <select
                  value={engineForm.sector}
                  onChange={(e) => setEngineForm({ ...engineForm, sector: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Pharmaceuticals & APIs">Pharmaceuticals & APIs</option>
                  <option value="Automotive & EV Components">Automotive & EV Components</option>
                  <option value="Food Processing & Agri Logistics">Food Processing & Agri Logistics</option>
                  <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                  <option value="IT, Software & Data Centers">IT, Software & Data Centers</option>
                  <option value="Textiles & Garment Manufacturing">Textiles & Garment Manufacturing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Capital Investment (₹ Crores)
                </label>
                <input
                  type="number"
                  value={engineForm.investmentCrores}
                  onChange={(e) => setEngineForm({ ...engineForm, investmentCrores: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Connected Power Load (kW)
                </label>
                <input
                  type="number"
                  value={engineForm.powerKw}
                  onChange={(e) => setEngineForm({ ...engineForm, powerKw: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  State / Jurisdiction
                </label>
                <input
                  type="text"
                  value={engineForm.state}
                  onChange={(e) => setEngineForm({ ...engineForm, state: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Workforce Count
                </label>
                <input
                  type="number"
                  value={engineForm.workforce}
                  onChange={(e) => setEngineForm({ ...engineForm, workforce: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Land Zone Status
                </label>
                <select
                  value={engineForm.landCategory}
                  onChange={(e) => setEngineForm({ ...engineForm, landCategory: e.target.value as any })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Industrial Park (Allotted)">Industrial Park (Allotted GIDC/MIDC/KIADB)</option>
                  <option value="Agricultural (Requires CLU)">Agricultural (Requires Change of Land Use)</option>
                  <option value="Private Commercial">Private Commercial Zone</option>
                  <option value="SEZ Free Trade Zone">Special Economic Zone (SEZ)</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={engineForm.isHazardous}
                    onChange={(e) => setEngineForm({ ...engineForm, isHazardous: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Handles Hazardous / Inflammable Chemicals
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={handleRunRegulatoryEngine}
              disabled={isAnalyzing}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Querying AI Regulatory Knowledge Base...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Smart Approval Checklist & Risk Score
                </>
              )}
            </button>
          </div>

          {/* AI Regulatory Result Card */}
          {analysisResult && (
            <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500/50 rounded-2xl p-6 shadow-lg space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                    ENGINE EVALUATION REPORT
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    {analysisResult.summary}
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    analysisResult.pollutionCategory?.includes('Red') 
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {analysisResult.pollutionCategory}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    {analysisResult.riskTier}
                  </span>
                  {analysisResult.fastTrackEligible && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
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
                      <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300">Department</th>
                        <th className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300">Approval / NOC Name</th>
                        <th className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300">SLA Days</th>
                        <th className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300">Criticality</th>
                        <th className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300">Statutory Legal Justification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {analysisResult.keyClearances?.map((cl: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{cl.department}</td>
                          <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium">{cl.approvalName}</td>
                          <td className="py-3 px-3 font-mono font-bold text-indigo-600">{cl.slaDays} d</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cl.criticality === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {cl.criticality}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{cl.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Strategic Recommendations */}
              {analysisResult.aiRecommendations && (
                <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    AI Regulatory Acceleration Recommendations
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {analysisResult.aiRecommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-xs font-bold mb-2">
                  <FileCheck className="w-3.5 h-3.5" />
                  Verified Reusable Document Vault (DigiLocker for Business)
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Store Once, Auto-Populate Across All Clearances
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Upload verified deeds, blueprints, and statutory filings once. The vault injects them into PCB, Fire, Factory, and DISCOM dossiers automatically with AI OCR pre-validation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSimulatePrevalidation('Revised_Factory_Site_Plan_Final.pdf', 'Technical Architectural Layout')}
                  disabled={isPrevalidating}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  {isPrevalidating ? 'Running AI Pre-Scrutiny...' : 'Simulate New Upload & Pre-Validate'}
                </button>
              </div>
            </div>

            {/* Prevalidation Live Result Banner */}
            {prevalResult && (
              <div className="mt-6 p-5 rounded-2xl border-2 border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 animate-fadeIn space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
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

                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {prevalResult.fileName} ({prevalResult.docType})
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300">{prevalResult.correctionGuidance}</p>

                {/* Checklist checks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {prevalResult.checklistResults?.map((chk: any, idx: number) => (
                    <div key={idx} className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300">{chk.check}</span>
                      {chk.passed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
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
                          ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {doc.name}
                          </h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isDefective
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {isDefective ? 'Correction Required' : 'Pre-Validated 100%'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                        <span>Category: <strong>{doc.category}</strong></span>
                        <span>Size: <strong>{doc.fileSize}</strong></span>
                        <span>Quality Score: <strong className={isDefective ? 'text-rose-600' : 'text-emerald-600'}>{doc.validationScore}%</strong></span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500">
                        Linked to: {doc.linkedApprovals.join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Document Scrutiny Details Panel */}
              <div className="lg:col-span-6">
                {selectedDoc ? (
                  <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">VAULT ASSET ID: {selectedDoc.id}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                          {selectedDoc.name}
                        </h4>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-white dark:bg-slate-900 rounded border font-semibold">
                        {selectedDoc.type}
                      </span>
                    </div>

                    {/* Pre-validation checklist breakdown */}
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Automated OCR Pre-Scrutiny Verification Matrix
                      </h5>
                      <div className="space-y-2">
                        {selectedDoc.checklistResults?.map((chk, idx) => (
                          <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                            <div className="flex items-center justify-between font-semibold">
                              <span className="text-slate-800 dark:text-slate-200">{chk.check}</span>
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
                      <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
                        <h5 className="text-xs font-bold text-rose-800 dark:text-rose-200 mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Clerical Defect Detected Before Submission
                        </h5>
                        <ul className="list-disc list-inside text-xs text-rose-700 dark:text-rose-300 space-y-1">
                          {selectedDoc.missingOrInvalidItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                        {selectedDoc.correctionGuidance && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 font-medium">
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Transparent Online Query & Clarification Desk
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Resolve Department Scrutiny Inquiries with AI Drafting
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                No physical visits required to explain blueprints or calculations. Government scrutiny inquiries trigger real-time alerts. The AI Assistant formulates legally precise, compliant replies matching statutory rules.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Active Queries List */}
              <div className="lg:col-span-5 space-y-3">
                {approvals.flatMap(a => a.queries.map(q => ({ query: q, approval: a }))).map(({ query, approval }) => {
                  const isSelected = activeQueryApproval?.id === approval.id;
                  return (
                    <div
                      key={query.id}
                      onClick={() => {
                        setActiveQueryApproval(approval);
                        setQueryDraft(query.responseDraft || '');
                      }}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-[10px] text-slate-400">{query.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          query.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {query.status === 'pending' ? 'Action Due' : 'Resolved'}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                        {approval.name}
                      </h4>
                      <p className="text-xs text-slate-500 mb-2">{query.department} • Officer: {query.officerName}</p>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 font-medium">
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
                  <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="pb-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">OFFICIAL RESPONSE WORKBENCH</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {activeQueryApproval.name}
                        </h4>
                      </div>
                      <button
                        onClick={handleGenerateQueryDraft}
                        disabled={isGeneratingDraft}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {isGeneratingDraft ? 'Drafting...' : 'AI Generate Compliant Response'}
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Statutory Formal Response Letter (Editable):
                      </label>
                      <textarea
                        rows={8}
                        value={queryDraft}
                        onChange={(e) => setQueryDraft(e.target.value)}
                        placeholder="Type response or click 'AI Generate Compliant Response' above..."
                        className="w-full text-xs font-mono p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>Attachment: Revised Technical Drawing / Annexure</span>
                      </div>

                      <button
                        onClick={handleSubmitQueryResponse}
                        disabled={!queryDraft.trim()}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Submit Response to Scrutiny Officer
                      </button>
                    </div>

                    {querySubmitted && (
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Response submitted successfully! Scrutiny clock reset; department review resumed.
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs font-bold mb-2">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Joint Synchronized Inspection Protocol
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                One Unified Site Visit Across All Departments
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Replaces 4 uncoordinated visits. Fire, Pollution Control, and Factory Safety inspectors visit the site simultaneously on a pre-notified date with an integrated digital checklist.
              </p>
            </div>

            {/* Scheduled Visit Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white border border-teal-800 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-teal-800/80">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-300 uppercase">INSPECTION ORDER: INSP-2026-08</span>
                  <h4 className="text-xl font-bold text-white mt-1">Joint Synchronized Site Verification</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Plot 448/B, Sanand GIDC Phase II, Ahmedabad</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-teal-300 uppercase block font-semibold">Scheduled Date</span>
                  <span className="text-2xl font-black text-white">29 March 2026</span>
                  <span className="text-xs text-slate-400 block">10:30 AM IST</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Participating Departments</span>
                  <ul className="space-y-1 font-semibold text-slate-200">
                    <li>• State Pollution Control Board (GPCB)</li>
                    <li>• Fire & Emergency Services</li>
                    <li>• Directorate of Industrial Safety (DISH)</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Lead Coordinating Officer</span>
                  <p className="font-bold text-white">Er. Rajesh V. Mehta</p>
                  <p className="text-slate-400">Chief Joint Inspection Officer</p>
                  <p className="text-teal-300 mt-1 font-mono">+91 79 2322 1084</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Post-Approval Compliance & Renewal Calendar
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Never Miss a Statutory Renewal or Environmental Return
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                The lifecycle doesn't end at initial clearance. Track upcoming statutory renewals, annual audit submissions, and environmental returns with multi-channel alerts (90, 60, and 30 days prior).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Electricity HT Sanction (11kV)',
                  dept: 'State DISCOM (UGVCL)',
                  certNo: 'UGVCL/SANAND-II/HT/2026/8892',
                  status: 'Active',
                  expiry: '2029-03-20',
                  action: 'Download Certificate',
                  badge: 'Valid for 3 Years'
                },
                {
                  title: 'Provisional Fire Safety NOC',
                  dept: 'Fire & Emergency Services',
                  certNo: 'AHM-FIRE/NOC/2026/0411',
                  status: 'Renewal Due for Final Occupancy',
                  expiry: '2026-12-31',
                  action: 'Schedule Final Inspection',
                  badge: 'Occupancy Renewal'
                },
                {
                  title: 'Water & Air Act Consent to Operate (CTO)',
                  dept: 'Pollution Control Board',
                  certNo: 'GPCB/CTE/2026/9102',
                  status: 'Scheduled Upon CTE Completion',
                  expiry: '2031-03-31',
                  action: 'View Compliance Roadmap',
                  badge: '5-Year Validity'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-400">QR-Signed</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 mb-2">{item.dept}</p>
                    <p className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                      Cert No: {item.certNo}
                    </p>
                    <div className="text-xs text-slate-500 mt-3">
                      Validity Expires: <strong className="text-slate-900 dark:text-white">{item.expiry}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Certificate ${item.certNo} retrieved with verifiable cryptographic QR seal.`)}
                    className="mt-4 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                AI Incentive & Government Scheme Matcher
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Matched Subsidies, Grants & Capital Concessions
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Beyond approvals: Our engine analyzes your capital investment (₹{profile.investmentCrores} Cr), workforce ({profile.workforce}), and sector to discover eligible Central & State incentive schemes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {schemes.map((sch) => (
                <div
                  key={sch.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                        Match Score: {sch.matchScore}%
                      </span>
                      <span className="text-xs text-rose-600 font-bold">Apply by: {sch.deadline}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                      {sch.name}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">{sch.ministry}</p>

                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 mb-3">
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase block">
                        Estimated Financial Benefit
                      </span>
                      <span className="text-sm font-black text-amber-900 dark:text-amber-100">
                        {sch.financialBenefit}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                      <strong>Eligibility:</strong> {sch.eligibility}
                    </p>
                  </div>

                  <button
                    onClick={() => alert(`Application for ${sch.name} prepared using pre-validated documents from your Single Vault!`)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    Apply with 1-Click Vault Dossier <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
