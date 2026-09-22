import React, { useState } from 'react';
import { 
  ApprovalItem, 
  DepartmentMetric, 
  BusinessProfile 
} from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  FileText, 
  ChevronRight, 
  TrendingUp, 
  AlertCircle, 
  Layers, 
  Building2, 
  Calendar, 
  Send,
  Zap,
  Sparkles,
  Award,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';

interface DepartmentDashboardProps {
  approvals: ApprovalItem[];
  departmentMetrics: DepartmentMetric[];
  activeProfile: BusinessProfile;
  onUpdateApprovals: (newApprovals: ApprovalItem[]) => void;
  onOpenFlowchart: () => void;
}

export const DepartmentDashboard: React.FC<DepartmentDashboardProps> = ({
  approvals,
  departmentMetrics,
  activeProfile,
  onUpdateApprovals,
  onOpenFlowchart,
}) => {
  const [selectedDeptCode, setSelectedDeptCode] = useState<string>('PCB');
  const [activeTab, setActiveTab] = useState<'queue' | 'scrutiny' | 'inspections' | 'bottlenecks'>('queue');
  const [riskFilter, setRiskFilter] = useState<'all' | 'LOW' | 'HIGH'>('all');
  const [selectedApp, setSelectedApp] = useState<ApprovalItem | null>(approvals[0] || null);
  
  // Scrutiny modal / action state
  const [queryInput, setQueryInput] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const currentMetric = departmentMetrics.find(m => m.code === selectedDeptCode) || departmentMetrics[0];

  // Filter applications for selected department or all
  const deptApprovals = approvals.filter(app => {
    const matchesDept = 
      selectedDeptCode === 'PCB' ? app.department.includes('Pollution') :
      selectedDeptCode === 'FIRE' ? app.department.includes('Fire') :
      selectedDeptCode === 'DISH' ? app.department.includes('Safety') || app.department.includes('DISH') :
      selectedDeptCode === 'DISCOM' ? app.department.includes('Electricity') || app.department.includes('UGVCL') :
      true;

    if (!matchesDept) return false;
    if (riskFilter === 'all') return true;
    return app.riskTier === riskFilter;
  });

  // Officer action: Raise Query
  const handleRaiseQuery = () => {
    if (!selectedApp || !queryInput.trim()) return;
    const newQuery = {
      id: `QRY-${selectedDeptCode}-${Math.floor(100 + Math.random() * 900)}`,
      approvalId: selectedApp.id,
      department: selectedApp.department,
      officerName: 'Authorized Scrutiny Officer',
      dateRaised: new Date().toISOString().split('T')[0],
      deadlineDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      queryText: queryInput,
      status: 'pending' as const,
    };

    const updated = approvals.map(a => {
      if (a.id === selectedApp.id) {
        return {
          ...a,
          status: 'query_raised' as const,
          stageName: 'Statutory Query Raised (Awaiting Applicant Clarification)',
          queries: [...a.queries, newQuery],
        };
      }
      return a;
    });

    onUpdateApprovals(updated);
    setQueryInput('');
    setActionMessage('Official query recorded with 7-day statutory clock. Applicant notified via automated alert.');
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Officer action: Grant Approval
  const handleGrantApproval = () => {
    if (!selectedApp) return;
    const certNum = `${selectedDeptCode}/GOI-SIH/2026/${Math.floor(1000 + Math.random() * 9000)}`;
    const updated = approvals.map(a => {
      if (a.id === selectedApp.id) {
        return {
          ...a,
          status: 'approved' as const,
          stageName: 'Approval Order Executed & Certificate Sealed',
          approvalDate: new Date().toISOString().split('T')[0],
          certificateNumber: certNum,
          validityExpiry: '2029-03-31',
        };
      }
      return a;
    });

    onUpdateApprovals(updated);
    setActionMessage(`Approval granted! Digitally signed certificate ${certNum} generated and dispatched to business vault.`);
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Department Header & Identity Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Government Regulatory Authority Portal (Department View)
            </div>
            <h2 className="text-2xl font-black text-white">
              Unified Regulatory Workbench & Scrutiny Engine
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Active Jurisdiction: State Single Window Clearances • Current Enterprise under review: <strong className="text-white">{activeProfile.name}</strong>
            </p>
          </div>

          {/* Department Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            {[
              { code: 'PCB', label: 'Pollution (CPCB/GPCB)' },
              { code: 'FIRE', label: 'Fire & Emergency' },
              { code: 'DISH', label: 'Factory Safety (DISH)' },
              { code: 'DISCOM', label: 'Electricity (DISCOM)' },
              { code: 'TOWN', label: 'Town Planning (ULB)' },
            ].map(dept => (
              <button
                key={dept.code}
                onClick={() => setSelectedDeptCode(dept.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDeptCode === dept.code
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Department Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Queue</span>
            <span className="text-2xl font-black text-white">{currentMetric.assignedCount}</span>
            <span className="text-[11px] text-slate-400">Applications pending</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">SLA Adherence Rate</span>
            <span className={`text-2xl font-black ${currentMetric.slaAdherenceRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {currentMetric.slaAdherenceRate}%
            </span>
            <span className="text-[11px] text-slate-400">Within statutory SLA</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Turnaround Time</span>
            <span className="text-2xl font-black text-indigo-300">{currentMetric.avgTurnaroundDays} Days</span>
            <span className="text-[11px] text-slate-400">Target SLA: {currentMetric.slaTargetDays} d</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Action Due (Queries)</span>
            <span className="text-2xl font-black text-amber-400">{currentMetric.queriesPendingCount}</span>
            <span className="text-[11px] text-slate-400">Applicant responses</span>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'queue'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Assigned Queue & Risk-Based Triage
        </button>

        <button
          onClick={() => setActiveTab('scrutiny')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'scrutiny'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Officer Scrutiny & Seal Execution
        </button>

        <button
          onClick={() => setActiveTab('bottlenecks')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'bottlenecks'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Delay & Bottleneck Analytics
        </button>
      </div>

      {/* TAB 1: ASSIGNED QUEUE & RISK-BASED TRIAGE */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {/* Risk Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Risk-Based Scrutiny Filter:</span>
              <button
                onClick={() => setRiskFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  riskFilter === 'all' ? 'bg-slate-900 text-white dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                All Applications ({deptApprovals.length})
              </button>
              <button
                onClick={() => setRiskFilter('LOW')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  riskFilter === 'LOW' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                🟢 Green Channel (Low Risk - Fast Track)
              </button>
              <button
                onClick={() => setRiskFilter('HIGH')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  riskFilter === 'HIGH' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                🔴 High Risk (Multi-Officer Scrutiny)
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Department Queue: <strong>{currentMetric.department}</strong>
            </div>
          </div>

          {/* Queue List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-3">
              {deptApprovals.map(app => {
                const isSelected = selectedApp?.id === app.id;
                const isGreenChannel = app.fastTrack;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/20 dark:bg-purple-950/20 shadow-md ring-1 ring-purple-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{app.code}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {app.name}
                        </h4>
                        <p className="text-xs text-slate-500">Applicant: <strong>{activeProfile.name}</strong></p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isGreenChannel 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {isGreenChannel ? '🟢 Green Channel' : '🔴 High Risk Tier'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Day {app.daysElapsed} of {app.slaDays} SLA
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Status: <strong className="text-slate-900 dark:text-white">{app.stageName}</strong></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApp(app);
                          setActiveTab('scrutiny');
                        }}
                        className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all flex items-center gap-1"
                      >
                        Open Scrutiny Workbench <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Summary Drawer */}
            <div className="lg:col-span-5">
              {selectedApp ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-mono font-bold text-purple-600 uppercase">OFFICER ASSESSMENT CARD</span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{selectedApp.name}</h4>
                    <p className="text-xs text-slate-500">Applicant: {activeProfile.name} • Scale: {activeProfile.scale}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border flex justify-between">
                      <span className="text-slate-500">Hazardous Materials:</span>
                      <strong className={activeProfile.handlesHazardous ? 'text-rose-600' : 'text-emerald-600'}>
                        {activeProfile.handlesHazardous ? 'YES (Detailed Scrutiny)' : 'NO (Safe)'}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border flex justify-between">
                      <span className="text-slate-500">Connected Power Load:</span>
                      <strong className="text-slate-900 dark:text-white">{activeProfile.connectedPowerKw} kW</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border flex justify-between">
                      <span className="text-slate-500">Document Pre-Validation:</span>
                      <strong className="text-emerald-600 font-bold">Passed (Zero Clerical Defects)</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('scrutiny')}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    Launch Scrutiny & Seal Execution <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border">
                  Select an application from the queue.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCRUTINY WORKBENCH & DECISION DESK */}
      {activeTab === 'scrutiny' && (
        <div className="space-y-6">
          {selectedApp ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-600 uppercase">
                    SCRUTINY DOSSIER: {selectedApp.code}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedApp.name}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedApp.department} • Days in Department: {selectedApp.daysElapsed} of {selectedApp.slaDays} d</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedApp.status === 'approved' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {selectedApp.status === 'approved' ? 'Active Clearance' : 'Ready for Decision'}
                  </span>
                </div>
              </div>

              {/* Dossier Document Verification Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Pre-Validated Dossier Files (From Single Document Vault)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedApp.requiredDocs.map((doc, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Pre-Validated
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white block truncate">{doc}</span>
                        <span className="text-[11px] text-slate-500">Valid DSC & Land Cadastral Match</span>
                      </div>
                      <button
                        onClick={() => alert(`Reviewing pre-validated digital PDF: ${doc}`)}
                        className="mt-3 py-1 bg-white dark:bg-slate-900 border rounded font-semibold text-[11px] text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      >
                        Inspect Full Blueprint
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision Actions Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                {/* Raise Query Action */}
                <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Raise Official Scrutiny Query / Ask for Clarification
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Specify statutory query. Triggers an automated multi-channel alert to the entrepreneur with a strict 7-day clock.
                  </p>
                  <textarea
                    rows={3}
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Enter statutory observation or required revised drawing sheet..."
                    className="w-full text-xs p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleRaiseQuery}
                    disabled={!queryInput.trim()}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Dispatch Official Query to Applicant
                  </button>
                </div>

                {/* Grant Approval Action */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Grant Statutory Approval & Execute Digital Seal
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                      Executing approval triggers the cryptographic digital certificate generation, updates the enterprise compliance calendar, and registers the permit on the state portal.
                    </p>
                  </div>

                  <button
                    onClick={handleGrantApproval}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Award className="w-4 h-4" />
                    Apply Digital Signature & Issue Certificate
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border">
              Select an application from the queue to start scrutiny.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DELAY & BOTTLENECK ANALYTICS */}
      {activeTab === 'bottlenecks' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                Inter-Departmental SLA Delay & Bottleneck Diagnostics
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Eliminate Silent Administrative Delays & Backlogs
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Real-time telemetry pinpoints which department, desk, or inspector queue is exceeding statutory timelines, enabling administrative intervention before deadlines are missed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {departmentMetrics.map(metric => {
                const isOverSLA = metric.avgTurnaroundDays > metric.slaTargetDays;
                return (
                  <div
                    key={metric.code}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{metric.code}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          metric.slaAdherenceRate >= 80 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {metric.slaAdherenceRate}% On-Time
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                        {metric.department}
                      </h4>

                      <div className="flex items-center justify-between text-xs my-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cycle Time</span>
                          <span className={`text-sm font-bold ${isOverSLA ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                            {metric.avgTurnaroundDays} d
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Statutory SLA</span>
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                            {metric.slaTargetDays} d
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 mb-2">
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase block mb-0.5">
                          Bottleneck Diagnostic:
                        </span>
                        {metric.criticalBottlenecks}
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Escalation notice dispatched to ${metric.department} Chief Officer for priority resolution.`)}
                      className="mt-3 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-all"
                    >
                      Trigger Automated SLA Escalation
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
