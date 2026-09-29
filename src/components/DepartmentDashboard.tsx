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
      selectedDeptCode === 'PCB' ? app.department.includes('Pollution') || app.department.includes('MPCB') :
      selectedDeptCode === 'FIRE' ? app.department.includes('Fire') :
      selectedDeptCode === 'DISH' ? app.department.includes('Safety') || app.department.includes('DISH') :
      selectedDeptCode === 'DISCOM' ? app.department.includes('Electricity') || app.department.includes('MSEDCL') || app.department.includes('UGVCL') :
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
          queries: [...(a.queries || []), newQuery],
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
    const certNum = `${selectedDeptCode}/MH-GOV/2026/${Math.floor(1000 + Math.random() * 9000)}`;
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
      {/* Department Header & Identity Banner (Clean Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Government Regulatory Authority Portal (Department Scrutiny View)
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Unified Regulatory Workbench & Scrutiny Engine
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Active Jurisdiction: {activeProfile.district}, {activeProfile.state} • Reviewing: <strong className="text-slate-900">{activeProfile.name}</strong>
            </p>
          </div>

          {/* Department Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            {[
              { code: 'PCB', label: 'Pollution (MPCB)' },
              { code: 'FIRE', label: 'Fire & Emergency' },
              { code: 'DISH', label: 'Factory Safety (DISH)' },
              { code: 'DISCOM', label: 'Electricity (MSEDCL)' },
              { code: 'TOWN', label: 'MIDC / Town Planning' },
            ].map(dept => (
              <button
                key={dept.code}
                onClick={() => setSelectedDeptCode(dept.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDeptCode === dept.code
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Department Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Queue</span>
            <span className="text-2xl font-black text-slate-900">{currentMetric.assignedCount}</span>
            <span className="text-[11px] text-slate-500">Applications in queue</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">SLA Adherence</span>
            <span className={`text-2xl font-black ${currentMetric.slaAdherenceRate >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {currentMetric.slaAdherenceRate}%
            </span>
            <span className="text-[11px] text-slate-500">Within statutory SLA</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Turnaround</span>
            <span className="text-2xl font-black text-teal-700">{currentMetric.avgTurnaroundDays} Days</span>
            <span className="text-[11px] text-slate-500">Target SLA: {currentMetric.slaTargetDays} d</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Action Due (Queries)</span>
            <span className="text-2xl font-black text-amber-700">{currentMetric.queriesPendingCount}</span>
            <span className="text-[11px] text-slate-500">Applicant responses</span>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="p-4 rounded-xl bg-teal-600 text-white font-bold text-sm shadow-md flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'queue'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          Assigned Queue & Risk-Based Triage
        </button>

        <button
          onClick={() => setActiveTab('scrutiny')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'scrutiny'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Officer Scrutiny & Seal Execution
        </button>

        <button
          onClick={() => setActiveTab('bottlenecks')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'bottlenecks'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Delay & Bottleneck Analytics
        </button>
      </div>

      {/* TAB 1: ASSIGNED QUEUE & RISK-BASED TRIAGE */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Risk Filter:</span>
              <button
                onClick={() => setRiskFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  riskFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                All Applications
              </button>
              <button
                onClick={() => setRiskFilter('LOW')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  riskFilter === 'LOW' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                🟢 Low-Risk (Green Channel)
              </button>
              <button
                onClick={() => setRiskFilter('HIGH')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  riskFilter === 'HIGH' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                🔴 High-Risk (Scrutiny)
              </button>
            </div>
            <span className="text-xs text-slate-500">
              Showing {deptApprovals.length} applications for {currentMetric.department}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              {deptApprovals.map(app => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-teal-600 shadow-md ring-1 ring-teal-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-slate-400">{app.code}</span>
                        <h4 className="font-bold text-slate-900 text-base">{app.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Applicant: <strong>{activeProfile.name}</strong></p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        app.riskTier === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {app.riskTier} RISK
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-slate-600">
                      Current Stage: <strong className="text-slate-800">{app.stageName}</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scrutiny Action Center */}
            <div className="lg:col-span-5">
              {selectedApp ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6 space-y-5 text-xs">
                  <div className="pb-3 border-b border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-teal-700">SCRUTINY ACTION DESK</span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">{selectedApp.name}</h3>
                    <p className="text-slate-500">Applicant: {activeProfile.name}</p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Raise Official Query to Applicant:
                    </label>
                    <textarea
                      rows={4}
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                      placeholder="Specify technical drawing defect, missing annexure, or calculation requirement..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleRaiseQuery}
                      disabled={!queryInput.trim()}
                      className="w-1/2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Raise Query
                    </button>
                    <button
                      onClick={handleGrantApproval}
                      className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Issue Seal & Grant
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                  Select an application to inspect.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCRUTINY & AUDIT */}
      {activeTab === 'scrutiny' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xl font-black text-slate-900">Digital Scrutiny Protocol</h3>
          <p className="text-xs text-slate-600">
            Pre-validated documents from {activeProfile.name} are cryptographically anchored. Scrutiny officers perform zero-duplicate verification against state gazette standards.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <div className="font-bold text-slate-800">Verified Dossier Assets:</div>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li>Certificate of Incorporation & Company PAN: <strong className="text-emerald-700">MCA Verified</strong></li>
              <li>Plot Allotment & Land Title: <strong className="text-emerald-700">{activeProfile.district} Registrar Endorsed</strong></li>
              <li>Connected Load Application: <strong className="text-slate-800">{activeProfile.connectedPowerKw} kW</strong></li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 3: BOTTLENECK ANALYTICS */}
      {activeTab === 'bottlenecks' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xl font-black text-slate-900">Department SLA Performance & Bottleneck Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {departmentMetrics.map((dm, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-900">{dm.department}</h4>
                  <span className="font-mono text-teal-700 font-bold">{dm.slaAdherenceRate}% SLA</span>
                </div>
                <p className="text-slate-600 mt-1"><strong>Bottleneck Desk:</strong> {dm.criticalBottlenecks}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
