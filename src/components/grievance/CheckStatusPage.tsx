import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GrievanceHeader, GrievanceFooter } from './GrievanceHeader';
import { INITIAL_GRIEVANCES_STORE, GrievanceRecord } from '../../data/grievanceStore';
import { BusinessProfile } from '../../types';
import { 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Download, 
  AlertCircle, 
  XCircle,
  Building2,
  Calendar,
  MessageSquare,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface CheckStatusPageProps {
  profile?: BusinessProfile;
}

export const CheckStatusPage: React.FC<CheckStatusPageProps> = ({ profile }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search inputs
  const [searchGrievanceId, setSearchGrievanceId] = useState(searchParams.get('id') || 'MGV-2026-102458');
  const [mobileOrEmail, setMobileOrEmail] = useState('9825204240');

  // Search results & state
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedRecord, setMatchedRecord] = useState<GrievanceRecord | null>(null);

  // Load from storage + initial mock
  const getAllRecords = (): GrievanceRecord[] => {
    try {
      const stored = localStorage.getItem('mahau_grievances');
      const list: GrievanceRecord[] = stored ? JSON.parse(stored) : [];
      return [...list, ...INITIAL_GRIEVANCES_STORE];
    } catch (e) {
      return INITIAL_GRIEVANCES_STORE;
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchGrievanceId.trim()) return;

    setIsSearching(true);
    setHasSearched(false);

    try {
      const token = 
        sessionStorage.getItem('mahau_session_token') || 
        localStorage.getItem('mahau_session_token') || 
        sessionStorage.getItem('mahau_auth_token') || 
        localStorage.getItem('mahau_auth_token');
      const response = await fetch(`/api/grievances/status/${encodeURIComponent(searchGrievanceId.trim())}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.grievance) {
          setMatchedRecord(data.grievance);
          setHasSearched(true);
          return;
        }
      }

      // Fallback to local storage
      const all = getAllRecords();
      const match = all.find(r => 
        r.id.toLowerCase() === searchGrievanceId.trim().toLowerCase() ||
        (r.applicationNumber && r.applicationNumber.toLowerCase() === searchGrievanceId.trim().toLowerCase())
      );
      setMatchedRecord(match || null);
      setHasSearched(true);
    } catch (err) {
      const all = getAllRecords();
      const match = all.find(r => 
        r.id.toLowerCase() === searchGrievanceId.trim().toLowerCase()
      );
      setMatchedRecord(match || null);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('id')) {
      handleSearch();
    }
  }, [searchParams]);

  // Stage steps for 6-step timeline
  const timelineStages = [
    { title: 'Grievance Submitted', desc: 'Dossier registered and digitally logged on portal' },
    { title: 'Under Initial Review', desc: 'Scrutinized by Helpdesk Nodal Coordinator' },
    { title: 'Assigned to Department', desc: 'Transferred to Concerned Departmental Appellate Officer' },
    { title: 'Department Action', desc: 'Field inquiry / technical verification in progress' },
    { title: 'Resolution Provided', desc: 'Official order / clearance update issued' },
    { title: 'Closed', desc: 'Applicant confirmed satisfaction and case closed' }
  ];

  const getStageIndex = (status: GrievanceRecord['status']): number => {
    switch (status) {
      case 'Submitted': return 0;
      case 'Under Initial Review': return 1;
      case 'Assigned to Department': return 2;
      case 'Department Action': return 3;
      case 'Resolution Provided': return 4;
      case 'Closed': return 5;
      default: return 0;
    }
  };

  const handleDownloadSlip = (rec: GrievanceRecord) => {
    const text = `========================================================
GOVERNMENT OF MAHARASHTRA • MAHAUDYOGSETU
STATUTORY GRIEVANCE AUDIT TRAIL & STATUS SLIP
========================================================

Reference ID:         ${rec.id}
Date Submitted:       ${rec.submittedDate}
Last Updated:         ${rec.lastUpdated}
Current Stage:        ${rec.status}

1. ENTITY DETAILS:
Business Name:        ${rec.businessName}
Authorized Person:    ${rec.applicantName}
Contact Mobile:       ${rec.mobile}

2. JURISDICTION & CLEARANCE:
Department:           ${rec.department}
Service:              ${rec.serviceType}
Linked App ID:        ${rec.applicationNumber || 'N/A'}
District / Zone:      ${rec.district} (${rec.midcArea || 'Statewide'})

3. GRIEVANCE SUMMARY:
Category:             ${rec.category}
Priority:             ${rec.priority}
Subject:              ${rec.subject}

Description:
${rec.description}

4. OFFICIAL DEPARTMENT RESPONSE:
${rec.departmentResponse || 'Departmental action currently underway under RTS Act time limit.'}
========================================================
MahaUdyogSetu • Maharashtra Industry Bridge • Toll-Free: 1800-120-8040`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rec.id}_Status_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <GrievanceHeader 
        title="Track Grievance / Query"
        subtitle="Real-time audit trail and departmental resolution tracker under Maharashtra RTS Act."
        profile={profile}
        activePath="/grievance/status"
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/grievance')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Grievance & Support</span>
          </button>

          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Live Departmental Audit Trail
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Track Grievance or Query Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Enter your unique Grievance Reference ID (e.g. MGV-2026-XXXXXX) or Query ID (MQY-2026-XXXXXX) to view live investigation remarks.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Enter Grievance / Query Reference ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchGrievanceId}
                    onChange={(e) => setSearchGrievanceId(e.target.value)}
                    placeholder="e.g. MGV-2026-102458 or MQY-2026-309114"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Registered Mobile / Email
                </label>
                <input
                  type="text"
                  value={mobileOrEmail}
                  onChange={(e) => setMobileOrEmail(e.target.value)}
                  placeholder="Optional verification"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

            </div>

            {/* Quick Demo Pre-fill Chips */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">Sample Records:</span>
              <button
                type="button"
                onClick={() => { setSearchGrievanceId('MGV-2026-102458'); }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-rose-700 font-bold hover:bg-rose-50 transition-colors"
              >
                Grievance: MGV-2026-102458 (MPCB Delay)
              </button>
              <button
                type="button"
                onClick={() => { setSearchGrievanceId('MQY-2026-309114'); }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-blue-700 font-bold hover:bg-blue-50 transition-colors"
              >
                Query: MQY-2026-309114 (DISH Plan)
              </button>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Fetching RTS Audit Dossier...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Status</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search Results Display */}
        {hasSearched && (
          <div className="animate-in fade-in duration-300">
            {matchedRecord ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
                
                {/* Status Card Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        matchedRecord.type === 'grievance' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {matchedRecord.type.toUpperCase()}
                      </span>
                      <span className="font-mono font-bold text-sm text-slate-800">
                        {matchedRecord.id}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900">
                      {matchedRecord.subject}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {matchedRecord.department} • {matchedRecord.serviceType}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs">
                      {matchedRecord.status}
                    </span>
                  </div>
                </div>

                {/* 6-STAGE TIMELINE AUDIT TRAIL */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-6">
                    Statutory Grievance Lifecycle Progression
                  </h3>

                  <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {timelineStages.map((stage, idx) => {
                      const activeIdx = getStageIndex(matchedRecord.status);
                      const isCompleted = idx < activeIdx;
                      const isCurrent = idx === activeIdx;

                      return (
                        <div key={idx} className="relative flex items-start gap-4">
                          {/* Dot / Indicator */}
                          <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${
                            isCompleted ? 'bg-emerald-600 text-white' :
                            isCurrent ? 'bg-blue-600 text-white animate-pulse' :
                            'bg-slate-200 text-slate-400'
                          }`}>
                            {isCompleted ? '✓' : idx + 1}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-xs font-bold ${
                                isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                              }`}>
                                {stage.title}
                              </h4>
                              {isCurrent && (
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                  Current Stage
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {stage.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Date Submitted:</span>
                    <strong className="text-slate-800 font-semibold">{matchedRecord.submittedDate}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Priority Level:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      matchedRecord.priority === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {matchedRecord.priority}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Linked Application:</span>
                    <strong className="text-slate-800 font-mono">{matchedRecord.applicationNumber || 'N/A'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">RTS SLA Escalation:</span>
                    <strong className="text-teal-700 font-bold">{matchedRecord.rtsEscalationLevel || 'Level 1 (Nodal Officer)'}</strong>
                  </div>
                </div>

                {/* Department Resolution Note (if any) */}
                {matchedRecord.departmentResponse && (
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-700" />
                      <span>Official Departmental Scrutiny Action & Resolution:</span>
                    </div>
                    <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                      {matchedRecord.departmentResponse}
                    </p>
                    {matchedRecord.assignedOfficer && (
                      <div className="text-[11px] text-emerald-800 font-semibold mt-2 pt-2 border-t border-emerald-200/60">
                        Officer: {matchedRecord.assignedOfficer}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleDownloadSlip(matchedRecord)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official Status Slip</span>
                  </button>

                  <button
                    onClick={() => navigate('/grievance/register')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Register New Grievance
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-red-200 shadow-xs p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No Grievance or Query Found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                  No registered record matches ID <strong className="text-slate-800 font-mono">"{searchGrievanceId}"</strong>. Please verify the reference number received in your acknowledgement SMS/Email.
                </p>
                <button
                  onClick={() => setSearchGrievanceId('')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Clear and Try Again
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      <GrievanceFooter />
    </div>
  );
};
