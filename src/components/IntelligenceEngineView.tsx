import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Upload, 
  Clock, 
  Eye, 
  Check, 
  X, 
  RefreshCw, 
  Sliders, 
  Layers, 
  IndianRupee, 
  Users, 
  Zap, 
  ChevronRight, 
  Info,
  HelpCircle,
  TrendingUp,
  MapPin,
  Lock,
  Flame,
  CheckCircle
} from 'lucide-react';
import { BusinessProfile, DocumentItem, ApprovalItem } from '../types';
import { 
  calculateApprovalReadiness, 
  checkDocumentConsistency, 
  generateApprovalDependencyMap, 
  simulateProjectImpact, 
  ConsistencyIssue, 
  DependencyNode,
  WhatIfParameters 
} from '../data/readinessEngine';

interface IntelligenceEngineViewProps {
  profile: BusinessProfile;
  documents: DocumentItem[];
  approvals: ApprovalItem[];
  onUpdateProfile: (newProfile: BusinessProfile) => void;
  onUpdateDocuments: (newDocs: DocumentItem[]) => void;
  onNavigateToService?: (serviceCode: string) => void;
  onBackToDashboard?: () => void;
}

export const IntelligenceEngineView: React.FC<IntelligenceEngineViewProps> = ({
  profile,
  documents,
  approvals,
  onUpdateProfile,
  onUpdateDocuments,
  onNavigateToService,
  onBackToDashboard
}) => {
  // Overrides for resolved issues
  const [resolvedIssueIds, setResolvedIssueIds] = useState<Record<string, boolean>>({});
  
  // Selected Dependency Node for Detail Modal
  const [selectedDepNode, setSelectedDepNode] = useState<DependencyNode | null>(null);

  // Selected Consistency Issue for Fix Modal
  const [issueToFix, setIssueToFix] = useState<ConsistencyIssue | null>(null);
  const [fixedValueInput, setFixedValueInput] = useState<string>('');

  // Upload missing document modal
  const [showUploadMissingModal, setShowUploadMissingModal] = useState<boolean>(false);
  const [missingDocTargetName, setMissingDocTargetName] = useState<string>('Fire Safety Plan / Provisional NOC');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // What-If Simulator Parameters State
  const [simulatorParams, setSimulatorParams] = useState<WhatIfParameters>({
    sector: profile.sector || 'Engineering & Heavy Manufacturing',
    investmentCrores: profile.investmentCrores || 18.5,
    district: profile.district || 'Nashik',
    builtUpAreaSqFt: profile.builtUpAreaSqFt || 45000,
    powerKw: profile.connectedPowerKw || 350,
    workforce: profile.workforce || 75,
    stage: profile.stage || 'Pre-Establishment',
    handlesHazardous: profile.handlesHazardous || false
  });

  // Calculate dynamic readiness evaluation
  const evaluation = useMemo(() => {
    return calculateApprovalReadiness(profile, documents, [], resolvedIssueIds);
  }, [profile, documents, resolvedIssueIds]);

  // Calculate What-If simulation results
  const whatIfResults = useMemo(() => {
    return simulateProjectImpact(simulatorParams);
  }, [simulatorParams]);

  // Handle Resolving a Consistency Issue
  const handleResolveIssue = (issue: ConsistencyIssue) => {
    if (issue.id === 'ISSUE-ADDR-01') {
      // Update profile factory address to match document
      onUpdateProfile({
        ...profile,
        district: 'Nashik',
        address: 'Plot No. W-18/2, Ambad MIDC Industrial Estate, Nashik, Maharashtra – 422010'
      });
    } else if (issue.id === 'ISSUE-SIG-02') {
      onUpdateProfile({
        ...profile,
        authorizedPersonName: 'Arya K. Shah (Director & Signatory)'
      });
    }
    setResolvedIssueIds(prev => ({ ...prev, [issue.id]: true, address_match_fixed: true }));
    setIssueToFix(null);
  };

  // Handle Uploading a Missing Document to Vault
  const handleUploadMissingDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setTimeout(() => {
      const sizeMB = (uploadFile.size / (1024 * 1024)).toFixed(1);
      const newDoc: DocumentItem = {
        id: `DOC-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        name: missingDocTargetName,
        type: 'PDF',
        category: 'Factory & Safety',
        fileSize: `${sizeMB} MB`,
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'verified', // Auto verified in readiness flow
        validationScore: 100,
        checklistResults: [
          { check: 'PDF Format Compliance', passed: true, detail: 'Standard searchable PDF document.' },
          { check: 'Signatory & Seal Check', passed: true, detail: 'Compliant digital seal verified.' }
        ],
        missingOrInvalidItems: [],
        correctionGuidance: 'Document verified and attached to vault.',
        linkedApprovals: ['ALL-SWC'],
        usedBy: ['Pre-Establishment Composite Dossier']
      };

      onUpdateDocuments([newDoc, ...documents]);
      setIsUploading(false);
      setShowUploadMissingModal(false);
      setUploadFile(null);
    }, 600);
  };

  // Helper for Circular Score Progress Ring
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (evaluation.overallScore / 100) * circumference;

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-[#0d1b3e] via-[#1a2f6c] to-[#0d1b3e] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider flex items-center gap-1.5 shadow-inner">
                <Brain className="w-3.5 h-3.5 text-blue-400" />
                <span>Flagship SIH Pre-Scrutiny Engine</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-slate-200">
                AI Decision-Support
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Cpu className="w-8 h-8 text-teal-400" />
              <span>Approval Readiness Engine</span>
            </h1>

            <p className="text-sm text-teal-200 font-bold italic tracking-wide">
              “Don't just apply. Know if you're ready to apply.”
            </p>
            
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Automated pre-scrutiny analyzer comparing corporate entity registries, uploaded technical blueprints, prerequisite approval chains, and department rules to identify potential queries before official submission.
            </p>
          </div>

          {/* Quick Stats Pill Header */}
          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-slate-300">Active Entity:</span>
              <span className="font-extrabold text-white">{profile.name}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-slate-300">PAN Record:</span>
              <span className="font-mono font-bold text-teal-300">{profile.pan}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-slate-300">Target Region:</span>
              <span className="font-bold text-white">{profile.district || 'Nashik'} MIDC Zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Circular Score & Five Key Readiness Pillars */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-4 border-b border-slate-100">
          
          {/* Circular Score Gauge */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background track circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Dynamic animated progress stroke */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={evaluation.overallScore >= 80 ? '#059669' : evaluation.overallScore >= 60 ? '#d97706' : '#dc2626'}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {evaluation.overallScore}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Readiness
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                  evaluation.overallScore >= 80 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {evaluation.statusLabel}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Application Readiness
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Score dynamically calculated from document completeness, metadata cross-checks, and statutory prerequisites.
              </p>
            </div>
          </div>

          {/* 5 Dynamic Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full lg:w-auto flex-1">
            
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Docs Verified</span>
              <div className="text-xl font-black text-emerald-900">
                {evaluation.verifiedDocsCount}/{evaluation.totalRequiredDocs}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Validated
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Business Profile</span>
              <div className="text-base font-black text-slate-900">
                {evaluation.businessInfoComplete ? 'Complete' : 'Incomplete'}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block flex items-center gap-1">
                <Check className="w-3 h-3" /> MCA Matched
              </span>
            </div>

            <div className={`p-3.5 rounded-2xl border space-y-1 ${
              evaluation.warningIssuesCount > 0 ? 'bg-amber-50/70 border-amber-200/80 text-amber-900' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Issues to Review</span>
              <div className="text-xl font-black">
                {evaluation.warningIssuesCount}
              </div>
              <span className="text-[10px] font-bold block">
                {evaluation.warningIssuesCount > 0 ? '🟡 Actionable' : '✓ Zero Warnings'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Critical Issues</span>
              <div className={`text-xl font-black ${evaluation.criticalIssuesCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {evaluation.criticalIssuesCount}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block">
                {evaluation.criticalIssuesCount === 0 ? '🟢 None' : '🔴 Blockers'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-1">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Prerequisites</span>
              <div className="text-base font-black text-indigo-950">
                {evaluation.prerequisitesComplete ? 'Complete' : 'Pending'}
              </div>
              <span className="text-[10px] text-indigo-700 font-bold block">
                ✓ Pre-Establishment
              </span>
            </div>

          </div>
        </div>

        {/* Action Required Banner if issues exist */}
        {evaluation.totalIssuesCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wide text-amber-900">
                  Action Required ({evaluation.totalIssuesCount} item{evaluation.totalIssuesCount > 1 ? 's' : ''} to resolve)
                </h4>
                <ol className="text-xs text-amber-800 list-decimal list-inside space-y-0.5 mt-1 font-medium">
                  {evaluation.consistencyIssues.filter(i => !i.resolved).map((issue, idx) => (
                    <li key={idx}>
                      <strong>{issue.title}:</strong> {issue.remediationAdvice}
                    </li>
                  ))}
                  {evaluation.missingDocsCount > 0 && (
                    <li>
                      Upload missing <strong>{missingDocTargetName}</strong> into document repository.
                    </li>
                  )}
                </ol>
              </div>
            </div>

            <button
              onClick={() => {
                const firstIssue = evaluation.consistencyIssues.find(i => !i.resolved);
                if (firstIssue) setIssueToFix(firstIssue);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
            >
              Resolve Discrepancies
            </button>
          </div>
        )}
      </div>

      {/* 3. SECTION: Smart Document Consistency Check & Potential Query Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Smart Consistency Checks */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>Smart Document Consistency Check</span>
              </h2>
              <p className="text-xs text-slate-500">
                Automated cross-check between Master Business Profile + Uploaded Dossiers + Application Parameters.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Cross-Entity OCR
            </span>
          </div>

          {/* Consistency Cards List */}
          <div className="space-y-3 pt-1">
            {evaluation.consistencyIssues.map((issue) => {
              const isResolved = issue.resolved || resolvedIssueIds[issue.id];
              return (
                <div 
                  key={issue.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isResolved 
                      ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                      : issue.severity === 'critical'
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>RESOLVED</span>
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            issue.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            <AlertTriangle className="w-3 h-3" />
                            <span>{issue.severity.toUpperCase()} MISMATCH</span>
                          </span>
                        )}
                        <span className="text-xs font-black text-slate-900">{issue.title}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Business Profile Record</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{issue.profileValue}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Uploaded Document ({issue.documentSource})</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{issue.documentValue}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 pt-1 leading-relaxed">
                        <strong>Impact:</strong> {issue.impact}
                      </p>
                    </div>

                    {!isResolved && (
                      <button
                        onClick={() => {
                          setIssueToFix(issue);
                          setFixedValueInput(issue.documentValue);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
                      >
                        Review & Fix
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Query Risk Pre-validation Indicator */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>Potential Query Risk Indicator</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Pre-Validation</span>
            </div>

            {/* Large Risk Badge */}
            <div className={`p-5 rounded-2xl border text-center space-y-1.5 ${
              evaluation.queryRisk === 'LOW' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : evaluation.queryRisk === 'MEDIUM'
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                Department Scrutiny Risk Level
              </div>
              <div className="text-3xl font-black tracking-tight flex items-center justify-center gap-2">
                <span>{evaluation.queryRisk === 'LOW' ? '🟢' : evaluation.queryRisk === 'MEDIUM' ? '🟡' : '🔴'}</span>
                <span>QUERY RISK: {evaluation.queryRisk}</span>
              </div>
              <p className="text-[11px] opacity-90 font-medium">
                {evaluation.queryRisk === 'LOW' 
                  ? 'High probability of straight-through scrutiny without department queries.'
                  : 'Action recommended to resolve detected items and avoid SLA timeline extensions.'}
              </p>
            </div>

            {/* Checklist items supporting risk calculation */}
            <div className="space-y-1.5 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Pre-Scrutiny Factors</span>
              {evaluation.queryRiskReasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-700 font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Pre-Validation Disclaimer */}
          <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-snug">
            <strong>Decision-Support Notice:</strong> The Pre-Validation Readiness Score & Query Risk Indicator assist applicants in eliminating avoidable errors. Official clearance decisions remain subject to competent authority scrutiny.
          </div>
        </div>

      </div>

      {/* 4. SECTION: Missing Document Detection */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Missing Document Detection & Vault Audit</span>
            </h2>
            <p className="text-xs text-slate-500">
              Automatically comparing statutory clearance requirements with documents uploaded in your Single Document Vault.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              Requirements: {evaluation.totalRequiredDocs}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {evaluation.verifiedDocsCount} Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {[
            { name: 'Company PAN Card', cat: 'Company / Identity', status: 'verified', note: 'PAN matches corporate master record' },
            { name: 'Certificate of Incorporation', cat: 'Company / Identity', status: 'verified', note: 'MCA CIN registration active' },
            { name: 'Authorized Signatory Proof', cat: 'Company / Identity', status: 'verified', note: 'Aadhaar / Passport verified' },
            { name: 'MIDC Land Possession Order', cat: 'Land & Property', status: 'verified', note: 'Plot W-18/2 Ambad MIDC' },
            { name: 'Machinery Layout & Power Drawing', cat: 'Factory & Safety', status: 'verified', note: '350 KW HT load schematic' },
            { name: 'EPF & ESIC Registration', cat: 'Labour & Employees', status: 'verified', note: 'Labour code compliant' },
            { name: 'Effluent Treatment Scheme (ETP)', cat: 'Environmental', status: 'verified', note: 'MPCB CTE required' },
            { 
              name: 'Fire Safety Plan / Provisional NOC', 
              cat: 'Factory & Safety', 
              status: documents.some(d => d.name.toLowerCase().includes('fire')) ? 'verified' : 'missing',
              note: 'Mandatory for industrial plant building approval'
            }
          ].map((item, idx) => {
            const isMissing = item.status === 'missing';
            return (
              <div 
                key={idx}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                  isMissing ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50/70 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white text-slate-700 border border-slate-200 uppercase">
                      {item.cat}
                    </span>
                    {isMissing ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                        🔴 MISSING
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        🟢 VERIFIED
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {item.note}
                  </p>
                </div>

                {isMissing ? (
                  <button
                    onClick={() => {
                      setMissingDocTargetName(item.name);
                      setShowUploadMissingModal(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Missing Document</span>
                  </button>
                ) : (
                  <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Vault Synchronized</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SECTION: Interactive Approval Dependency Map */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Approval Dependency Map</span>
            </h2>
            <p className="text-xs text-slate-500">
              Interactive sequential clearance roadmap showing dependencies, prerequisites, blockers, and regulatory authority flow.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="inline-flex items-center gap-1 text-emerald-700"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed</span>
            <span className="inline-flex items-center gap-1 text-purple-700"><span className="w-2 h-2 rounded-full bg-purple-500" /> In Progress</span>
            <span className="inline-flex items-center gap-1 text-amber-700"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pending</span>
            <span className="inline-flex items-center gap-1 text-rose-700"><span className="w-2 h-2 rounded-full bg-rose-500" /> Blocked</span>
          </div>
        </div>

        {/* Horizontal / Grid Dependency Flow Map */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 pt-2">
          {evaluation.dependencyPipeline.map((node, idx) => {
            const isBlocked = node.status === 'blocked';
            const isCompleted = node.status === 'completed';
            const isInProgress = node.status === 'in_progress';
            const isPending = node.status === 'pending';

            return (
              <div 
                key={node.id}
                onClick={() => setSelectedDepNode(node)}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md relative ${
                  isCompleted 
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                    : isInProgress
                    ? 'bg-purple-50/70 border-purple-300 text-purple-950 ring-2 ring-purple-400/20'
                    : isBlocked
                    ? 'bg-rose-50/70 border-rose-300 text-rose-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                {/* Step indicator tag */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold opacity-60">Step {idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      isCompleted ? 'bg-emerald-200 text-emerald-900' :
                      isInProgress ? 'bg-purple-200 text-purple-900' :
                      isBlocked ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {node.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs leading-snug">
                    {node.name}
                  </h4>
                  
                  <div className="text-[10px] opacity-75 line-clamp-1">
                    {node.department}
                  </div>
                </div>

                {isBlocked && node.blockerReason && (
                  <div className="p-2 rounded-lg bg-rose-100 text-rose-900 text-[10px] font-semibold leading-tight">
                    ⚠ {node.blockerReason}
                  </div>
                )}

                <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[10px] font-bold">
                  <span>SLA: {node.sla}</span>
                  <span className="text-blue-600 flex items-center">Inspect →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. SECTION: “What-If?” Project Simulator */}
      <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/40 rounded-3xl border border-indigo-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3 h-3 text-indigo-600" />
                <span>Regulatory Impact Sandbox</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <span>What-If Project Simulator</span>
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl">
              Modify proposed investment scale, power load, and workforce to instantly evaluate shifts in regulatory thresholds, additional clearances, and subsidy entitlements.
            </p>
          </div>

          <button
            onClick={() => setSimulatorParams({
              sector: profile.sector || 'Engineering & Heavy Manufacturing',
              investmentCrores: profile.investmentCrores || 18.5,
              district: profile.district || 'Nashik',
              builtUpAreaSqFt: profile.builtUpAreaSqFt || 45000,
              powerKw: profile.connectedPowerKw || 350,
              workforce: profile.workforce || 75,
              stage: profile.stage || 'Pre-Establishment',
              handlesHazardous: profile.handlesHazardous || false
            })}
            className="px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Profile</span>
          </button>
        </div>

        {/* Simulator Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Controls Column */}
          <div className="md:col-span-1 space-y-4 bg-white p-5 rounded-2xl border border-indigo-100 shadow-2xs text-xs">
            
            {/* 1. Investment Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Investment Amount</label>
                <span className="font-black text-indigo-700 text-sm">₹ {simulatorParams.investmentCrores} Cr</span>
              </div>
              <input
                type="range"
                min="1"
                max="150"
                step="2.5"
                value={simulatorParams.investmentCrores}
                onChange={(e) => setSimulatorParams({ ...simulatorParams, investmentCrores: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>₹1 Cr (MSME)</span>
                <span>₹50 Cr (Mega)</span>
                <span>₹150 Cr (Ultra)</span>
              </div>
            </div>

            {/* 2. Connected Power Load Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Connected Power Load</label>
                <span className="font-black text-indigo-700 text-sm">{simulatorParams.powerKw} KW</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={simulatorParams.powerKw}
                onChange={(e) => setSimulatorParams({ ...simulatorParams, powerKw: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>50 KW (LT)</span>
                <span>500 KW (Substation)</span>
                <span>1000 KW (HT)</span>
              </div>
            </div>

            {/* 3. Workforce Count */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Workforce (Employees)</label>
                <span className="font-black text-indigo-700 text-sm">{simulatorParams.workforce} Staff</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={simulatorParams.workforce}
                onChange={(e) => setSimulatorParams({ ...simulatorParams, workforce: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>10</span>
                <span>100 (Canteen trigger)</span>
                <span>300</span>
              </div>
            </div>

            {/* 4. Hazardous Materials Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-800 block text-xs">Handles Hazardous Solvents / Chemicals</label>
                <span className="text-[10px] text-slate-500">Triggers MPCB Red category & PESO license</span>
              </div>
              <input
                type="checkbox"
                checked={simulatorParams.handlesHazardous}
                onChange={(e) => setSimulatorParams({ ...simulatorParams, handlesHazardous: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
            </div>

          </div>

          {/* Dynamic Impact Output Column */}
          <div className="md:col-span-2 space-y-4">
            
            <div className="p-4 bg-white rounded-2xl border border-indigo-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Potential Impact Assessment (Simulation)</span>
                </h3>
                {whatIfResults.pollutionCategoryChange && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">
                    {whatIfResults.pollutionCategoryChange}
                  </span>
                )}
              </div>

              {/* Impact Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase block">Additional Approvals Triggered</span>
                  <div className="text-xl font-black text-indigo-900 mt-0.5">
                    +{whatIfResults.additionalApprovals.length} Clearance{whatIfResults.additionalApprovals.length > 1 ? 's' : ''}
                  </div>
                  <span className="text-[10px] text-indigo-700 font-bold block">Potentially Applicable</span>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Fiscal Incentive Entitlement</span>
                  <p className="text-[11px] font-bold text-emerald-950 mt-0.5 line-clamp-2">
                    {whatIfResults.subsidyImpact}
                  </p>
                </div>
              </div>

              {/* Additional Approvals Breakdown */}
              {whatIfResults.additionalApprovals.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Potentially Applicable Clearances:</span>
                  <div className="space-y-2">
                    {whatIfResults.additionalApprovals.map((app, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900">{app.name}</span>
                          <span className="font-mono text-[10px] font-bold text-indigo-600">{app.estimatedSla} SLA</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{app.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regulatory Requirements & Affected Departments */}
              {whatIfResults.regulatoryRequirements.length > 0 && (
                <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Special Regulatory Compliance:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 font-medium">
                    {whatIfResults.regulatoryRequirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 7. MODAL: Fix Consistency Issue */}
      {issueToFix && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-slate-900">Resolve Data Discrepancy</h3>
                <p className="text-[11px] text-slate-500">{issueToFix.title}</p>
              </div>
              <button onClick={() => setIssueToFix(null)} className="text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <div className="text-[11px] font-bold text-amber-900">Detected Mismatch:</div>
                <div className="space-y-1 text-slate-800">
                  <div><strong>Profile Record:</strong> {issueToFix.profileValue}</div>
                  <div><strong>Document Record:</strong> {issueToFix.documentValue}</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Recommended Action:</span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {issueToFix.remediationAdvice}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIssueToFix(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleResolveIssue(issueToFix)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Synchronize & Fix Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: Upload Missing Document */}
      {showUploadMissingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Upload Missing Document</h3>
                <p className="text-[11px] text-slate-500">{missingDocTargetName}</p>
              </div>
              <button onClick={() => setShowUploadMissingModal(false)} className="text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleUploadMissingDoc} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select PDF File (Max 10 MB) *</label>
                <input
                  type="file"
                  required
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                  className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 cursor-pointer"
                />
              </div>

              {uploadFile && (
                <div className="text-[11px] text-emerald-700 font-bold">
                  ✓ Selected: {uploadFile.name} ({(uploadFile.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowUploadMissingModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {isUploading ? 'Validating & Uploading...' : 'Upload & Verify Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL: Dependency Node Details */}
      {selectedDepNode && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">{selectedDepNode.name}</h3>
                <p className="text-[11px] text-slate-500">{selectedDepNode.code} • {selectedDepNode.department}</p>
              </div>
              <button onClick={() => setSelectedDepNode(null)} className="text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Current Stage Status</span>
                <div className="text-sm font-black capitalize flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    selectedDepNode.status === 'completed' ? 'bg-emerald-500' :
                    selectedDepNode.status === 'in_progress' ? 'bg-purple-500' :
                    selectedDepNode.status === 'blocked' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                  <span>{selectedDepNode.status.replace('_', ' ')}</span>
                </div>
                <p className="text-slate-600 text-[11px] pt-1">{selectedDepNode.actionPrompt}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Required Dossier Documents:</span>
                <ul className="list-disc list-inside space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 font-medium">
                  {selectedDepNode.requiredDocs.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>

              {selectedDepNode.prerequisites.length > 0 && (
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px]">
                  <strong>Prerequisite Approvals:</strong> {selectedDepNode.prerequisites.join(', ')}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedDepNode(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
