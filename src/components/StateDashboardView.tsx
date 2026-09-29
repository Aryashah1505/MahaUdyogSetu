import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  Search, 
  Filter, 
  ChevronRight, 
  Layers, 
  ArrowUpRight, 
  ShieldCheck, 
  ExternalLink,
  ChevronLeft,
  ChevronRight as ChevronNext,
  ChevronsLeft,
  ChevronsRight,
  Info
} from 'lucide-react';
import { 
  MAITRI_DEPARTMENT_SLA_STATS, 
  DepartmentSlaRow 
} from '../data/maitriDashboardStats';
import { ApprovalItem, BusinessProfile } from '../types';
import { getCurrentLocalDate, getDateNDaysAgo } from '../utils/dateUtils';

interface StateDashboardViewProps {
  approvals: ApprovalItem[];
  profile: BusinessProfile;
  onNavigateToServices?: () => void;
  onSelectDepartmentFilter?: (deptName: string) => void;
}

export const StateDashboardView: React.FC<StateDashboardViewProps> = ({
  approvals,
  profile,
  onNavigateToServices,
  onSelectDepartmentFilter
}) => {
  const [fromDate, setFromDate] = useState(() => getDateNDaysAgo(10));
  const [toDate, setToDate] = useState(() => getCurrentLocalDate('iso'));
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedDeptDrilldown, setSelectedDeptDrilldown] = useState<DepartmentSlaRow | null>(null);

  // 6 Metric Cards Counts (User Enterprise Live vs State)
  const registeredUsersCount = 1; // Current verified user
  const registeredUnitsCount = profile.isProfileComplete || profile.name ? 1 : 0;
  const userApplicationsCount = approvals.length;
  const disposedCount = approvals.filter(a => a.status === 'approved' || a.status === 'rejected').length;
  const slaBreachCount = approvals.filter(a => a.daysElapsed > a.slaDays).length;
  const pendingCount = approvals.filter(a => a.status === 'under_scrutiny' || a.status === 'submitted' || a.status === 'query_raised').length;

  // Filter department rows
  const filteredDepartments = useMemo(() => {
    return MAITRI_DEPARTMENT_SLA_STATS.filter(d => 
      !searchFilter.trim() || 
      d.departmentName.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [searchFilter]);

  // Grand totals computation
  const totals = useMemo(() => {
    let rec = 0;
    let pend = 0;
    let app = 0;
    let disp = 0;
    let breach = 0;
    let pendDept = 0;

    MAITRI_DEPARTMENT_SLA_STATS.forEach(d => {
      if (typeof d.received === 'number') rec += d.received;
      if (typeof d.pending === 'number') pend += d.pending;
      if (typeof d.approved === 'number') app += d.approved;
      if (typeof d.disposed === 'number') disp += d.disposed;
      if (typeof d.slaBreach === 'number') breach += d.slaBreach;
      if (typeof d.pendingWithDept === 'number') pendDept += d.pendingWithDept;
    });

    return { rec, pend, app, disp, breach, pendDept };
  }, []);

  const handleExportCSV = () => {
    const headers = "Department,Received,Pending,Approved,Disposed,SLA Breach,Pending with Department\n";
    const rows = MAITRI_DEPARTMENT_SLA_STATS.map(d => 
      `"${d.departmentName}",${d.received},${d.pending},${d.approved},${d.disposed},${d.slaBreach},${d.pendingWithDept}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MAITRI_Single_Window_Dashboard_${fromDate}_to_${toDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* =========================================================================
          1. TOP 6 METRICS CARDS (Exact MAITRI single window layout)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        
        {/* 1. REGISTERED USERS */}
        <div className="bg-white rounded-xl border border-slate-300/80 p-4 shadow-xs flex items-center justify-between hover:border-blue-400 transition-all">
          <div className="space-y-1">
            <div className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
              REGISTERED USERS
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {registeredUsersCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* 2. REGISTERED FACTORY UNITS */}
        <div className="bg-white rounded-xl border border-slate-300/80 p-4 shadow-xs flex items-center justify-between hover:border-teal-400 transition-all">
          <div className="space-y-1">
            <div className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
              REGISTERED FACTORY UNITS
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {registeredUnitsCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* 3. TOTAL APPLICATIONS RECEIVED */}
        <div className="bg-white rounded-xl border border-slate-300/80 p-4 shadow-xs flex items-center justify-between hover:border-purple-400 transition-all">
          <div className="space-y-1">
            <div className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
              TOTAL APPLICATIONS RECEIVED
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {userApplicationsCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* 4. APPLICATIONS DISPOSED */}
        <div className="bg-white rounded-xl border border-slate-300/80 p-4 shadow-xs flex items-center justify-between hover:border-emerald-400 transition-all">
          <div className="space-y-1">
            <div className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
              APPLICATIONS DISPOSED
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {disposedCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* 5. TOTAL SLA BREACH */}
        <div className="bg-white rounded-xl border border-slate-300/80 p-4 shadow-xs flex items-center justify-between hover:border-rose-400 transition-all">
          <div className="space-y-1">
            <div className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
              TOTAL SLA BREACH
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {slaBreachCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* 6. APPLICATIONS PENDING */}
        <div className="bg-white rounded-xl border border-slate-300/80 p-4 shadow-xs flex items-center justify-between hover:border-amber-400 transition-all">
          <div className="space-y-1">
            <div className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
              APPLICATIONS PENDING
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {pendingCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* =========================================================================
          2. ONLINE SINGLE WINDOW SYSTEM DASHBOARD TABLE CONTAINER
         ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-300/80 shadow-xs overflow-hidden space-y-3 p-5">
        
        {/* Header Title & Export Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Online Single Window System Dashboard
          </h2>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <span>Export</span>
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Orange Explainer Alert Bar */}
        <div className="bg-[#fff8eb] border border-[#fbd38d] text-[#744210] px-4 py-2.5 rounded-lg text-xs font-medium">
          Explore further by clicking on department details for comprehensive insights.
        </div>

        {/* Filters Bar: From Date, To Date, Reset, Apply */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-600" />
            <span>Filters</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 text-xs">
            
            {/* From Date */}
            <div className="flex-1 max-w-xs space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">From Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-[#f0f4f9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* To Date */}
            <div className="flex-1 max-w-xs space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">To Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-[#f0f4f9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Department search filter input */}
            <div className="flex-1 max-w-xs space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Search Department</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter departments..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Reset & Apply Buttons */}
            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => { setFromDate(getDateNDaysAgo(10)); setToDate(getCurrentLocalDate('iso')); setSearchFilter(''); }}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Reset
              </button>

              <button
                type="button"
                className="px-5 py-2 rounded-lg bg-[#1a56db] hover:bg-[#1e429f] text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
              >
                Apply
              </button>
            </div>

          </div>
        </div>

        {/* Data Table matching official MAITRI screenshot */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl mt-3">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f4fc] text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5 min-w-[280px]">Department</th>
                <th className="py-3 px-3.5 text-right">Received</th>
                <th className="py-3 px-3.5 text-right">Pending</th>
                <th className="py-3 px-3.5 text-right">Approved</th>
                <th className="py-3 px-3.5 text-right">Disposed</th>
                <th className="py-3 px-3.5 text-right">SLA Breach</th>
                <th className="py-3 px-3.5 text-right min-w-[140px]">Pending with department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDepartments.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedDeptDrilldown(row)}
                >
                  {/* Clickable Blue Department Name */}
                  <td className="py-3 px-3.5 text-blue-600 group-hover:underline font-semibold flex items-center justify-between gap-2">
                    <span>{row.departmentName}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>

                  <td className="py-3 px-3.5 text-right font-mono text-slate-800">
                    {typeof row.received === 'number' ? row.received.toLocaleString() : row.received}
                  </td>

                  <td className="py-3 px-3.5 text-right font-mono text-slate-800">
                    {typeof row.pending === 'number' ? row.pending.toLocaleString() : row.pending}
                  </td>

                  <td className="py-3 px-3.5 text-right font-mono text-slate-800">
                    {typeof row.approved === 'number' ? row.approved.toLocaleString() : row.approved}
                  </td>

                  <td className="py-3 px-3.5 text-right font-mono text-slate-800">
                    {typeof row.disposed === 'number' ? row.disposed.toLocaleString() : row.disposed}
                  </td>

                  <td className="py-3 px-3.5 text-right font-mono text-slate-800">
                    {typeof row.slaBreach === 'number' ? (
                      row.slaBreach > 0 ? (
                        <span className="text-rose-600 font-bold">{row.slaBreach.toLocaleString()}</span>
                      ) : (
                        '0'
                      )
                    ) : row.slaBreach}
                  </td>

                  <td className="py-3 px-3.5 text-right font-mono text-slate-800">
                    {typeof row.pendingWithDept === 'number' ? row.pendingWithDept.toLocaleString() : row.pendingWithDept}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Grand Total Footer */}
            <tfoot className="bg-[#f0f4fc] font-extrabold border-t-2 border-slate-300 text-slate-900">
              <tr>
                <td className="py-3.5 px-3.5">Grand Total</td>
                <td className="py-3.5 px-3.5 text-right font-mono">{totals.rec.toLocaleString()}</td>
                <td className="py-3.5 px-3.5 text-right font-mono">{totals.pend.toLocaleString()}</td>
                <td className="py-3.5 px-3.5 text-right font-mono">{totals.app.toLocaleString()}</td>
                <td className="py-3.5 px-3.5 text-right font-mono">{totals.disp.toLocaleString()}</td>
                <td className="py-3.5 px-3.5 text-right font-mono text-rose-600">{totals.breach.toLocaleString()}</td>
                <td className="py-3.5 px-3.5 text-right font-mono">{totals.pendDept.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-end gap-1 pt-2 text-slate-500 text-xs">
          <button className="p-1 rounded hover:bg-slate-100 border border-slate-200 cursor-pointer disabled:opacity-40" disabled title="First Page">
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-slate-100 border border-slate-200 cursor-pointer disabled:opacity-40" disabled title="Previous Page">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 font-bold text-slate-700">1 of 1</span>
          <button className="p-1 rounded hover:bg-slate-100 border border-slate-200 cursor-pointer disabled:opacity-40" disabled title="Next Page">
            <ChevronNext className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-slate-100 border border-slate-200 cursor-pointer disabled:opacity-40" disabled title="Last Page">
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* =========================================================================
          3. DEPARTMENT DRILLDOWN MODAL
         ========================================================================= */}
      {selectedDeptDrilldown && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] my-auto">
            
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase">
                  Department Insights
                </span>
                <button 
                  onClick={() => setSelectedDeptDrilldown(null)}
                  className="text-slate-400 hover:text-white p-1 rounded font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-lg font-black text-white mt-1">
                {selectedDeptDrilldown.departmentName}
              </h3>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Received</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {selectedDeptDrilldown.received}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Disposed</div>
                  <div className="text-base font-extrabold text-emerald-700 mt-0.5">
                    {selectedDeptDrilldown.disposed}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Approved</div>
                  <div className="text-base font-extrabold text-blue-700 mt-0.5">
                    {selectedDeptDrilldown.approved}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Pending Total</div>
                  <div className="text-base font-extrabold text-amber-700 mt-0.5">
                    {selectedDeptDrilldown.pending}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">SLA Breach</div>
                  <div className="text-base font-extrabold text-rose-700 mt-0.5">
                    {selectedDeptDrilldown.slaBreach}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Pending with Dept</div>
                  <div className="text-base font-extrabold text-purple-700 mt-0.5">
                    {selectedDeptDrilldown.pendingWithDept}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center justify-between">
                <span>Want to apply for clearances offered by this department?</span>
                {onNavigateToServices && (
                  <button
                    onClick={() => {
                      setSelectedDeptDrilldown(null);
                      onNavigateToServices();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-2xs"
                  >
                    View Offered Services
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedDeptDrilldown(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
