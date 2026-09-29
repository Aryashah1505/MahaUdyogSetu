import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicDashboardHeader, PublicDashboardFooter } from './PublicDashboardHeader';
import { 
  MONTHLY_APPLICATION_TRENDS, 
  DEPARTMENT_PUBLIC_METRICS, 
  DISTRICT_INDUSTRIAL_METRICS, 
  SECTOR_METRICS, 
  SERVICE_PERFORMANCE_METRICS 
} from '../../data/publicDashboardStore';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Filter, 
  Search, 
  Layers, 
  Info, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  FileText,
  PieChart
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getCurrentLocalDate, formatLocalDate } from '../../utils/dateUtils';

export const PublicDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Tab State: 'overview' | 'applications' | 'approvals' | 'departments' | 'districts' | 'industries' | 'grievances' | 'services' | 'reports'
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Filter States
  const [selectedYear, setSelectedYear] = useState(() => `${new Date().getFullYear()}`);
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('ALL');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState('ALL');

  // Interactive Chart Mode: 'applications' | 'approvals' | 'rejections' | 'pending'
  const [trendMetric, setTrendMetric] = useState<'applications' | 'approvals' | 'rejections' | 'pending'>('applications');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // Search in Department & Service Tables
  const [deptSearch, setDeptSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedDistrictDetail, setSelectedDistrictDetail] = useState(DISTRICT_INDUSTRIAL_METRICS[0]);

  // Last Updated Timestamp state
  const [lastUpdatedTime, setLastUpdatedTime] = useState(() => getCurrentLocalDate('with-time'));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdatedTime(getCurrentLocalDate('with-time'));
    }, 400);
  };

  // Filtered Monthly Trends
  const filteredMonthlyTrends = useMemo(() => {
    if (selectedMonth === 'ALL') return MONTHLY_APPLICATION_TRENDS;
    return MONTHLY_APPLICATION_TRENDS.filter(m => m.month.toLowerCase() === selectedMonth.toLowerCase());
  }, [selectedMonth]);

  // Filtered Departments
  const filteredDepartments = useMemo(() => {
    return DEPARTMENT_PUBLIC_METRICS.filter(d => {
      if (selectedDeptFilter !== 'ALL' && d.id !== selectedDeptFilter && d.code !== selectedDeptFilter) return false;
      if (deptSearch.trim()) {
        const q = deptSearch.toLowerCase();
        return d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedDeptFilter, deptSearch]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return SERVICE_PERFORMANCE_METRICS.filter(s => {
      if (serviceSearch.trim()) {
        const q = serviceSearch.toLowerCase();
        return s.serviceName.toLowerCase().includes(q) || s.department.toLowerCase().includes(q);
      }
      return true;
    });
  }, [serviceSearch]);

  // Total Summary Computations
  const totalApplications = MONTHLY_APPLICATION_TRENDS.reduce((acc, curr) => acc + curr.applications, 0);
  const totalApprovals = MONTHLY_APPLICATION_TRENDS.reduce((acc, curr) => acc + curr.approvals, 0);
  const totalRejections = MONTHLY_APPLICATION_TRENDS.reduce((acc, curr) => acc + curr.rejections, 0);
  const activePending = 42850;

  // Max value for bar chart height scaling
  const maxTrendVal = Math.max(...MONTHLY_APPLICATION_TRENDS.map(m => m[trendMetric]));

  // Download Report
  const handleDownloadReport = (format: 'PDF' | 'CSV') => {
    const csvContent = `MAHAUDYOGSETU PUBLIC AGGREGATE PERFORMANCE REPORT
Data Period: January 2026 – September 2026 | Generated: ${new Date().toLocaleDateString('en-GB')}
Filter Year: ${selectedYear} | Filter Month: ${selectedMonth}

SUMMARY METRICS:
Total Services,179
Total Applications Submitted,${totalApplications}
Approvals Processed,${totalApprovals}
Active Pending Scrutiny,${activePending}
Grievances Handled,5881
Queries Resolved,5262
Districts Covered,36

DEPARTMENT-WISE DISPOSALS:
Department,Services,Applications,Approvals,Pending,Avg Turnaround (Days),SLA Rate
${DEPARTMENT_PUBLIC_METRICS.map(d => `"${d.name}",${d.servicesCount},${d.applicationsCount},${d.approvedCount},${d.pendingCount},${d.avgProcessingDays},${d.slaComplianceRate}%`).join('\n')}

DISTRICT-WISE METRICS:
District,Region,Applications,Approvals,Pending,Active Projects,Units Registered,Investment (₹ Cr)
${DISTRICT_INDUSTRIAL_METRICS.map(d => `"${d.district}",${d.region},${d.applicationsCount},${d.approvedCount},${d.pendingCount},${d.activeProjects},${d.registeredUnits},${d.proposedInvestmentCr}`).join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MahaUdyogSetu_Public_Report_${selectedYear}_${selectedMonth}.${format.toLowerCase() === 'pdf' ? 'txt' : 'csv'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Universal GovTech Header with Nav Tabs */}
      <PublicDashboardHeader 
        lastUpdated={lastUpdatedTime}
        onRefresh={handleRefreshData}
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        
        {/* SECTION 00 — PAGE TITLE & TOP FILTER BAR */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-300 uppercase tracking-wide">
                  PUBLIC DATA
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Last Updated: <strong className="text-slate-800">{lastUpdatedTime}</strong>
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Data Period: <strong className="text-slate-800">January 2026 – September 2026</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {t('publicDash.title', 'Public Dashboard')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
                {t('publicDash.subtitle', 'Transparent insights into industrial services, statutory clearances, application flows, and citizen support across Maharashtra.')}
              </p>
            </div>

            {/* Top Right Quick Export Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleDownloadReport('CSV')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>{t('publicDash.downloadCSV', 'Download CSV')}</span>
              </button>
              <button
                onClick={() => handleDownloadReport('PDF')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('publicDash.exportReport', 'Export Report')}</span>
              </button>
            </div>
          </div>

          {/* SECTION 12 — COMPREHENSIVE FILTER BAR */}
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700 uppercase tracking-wide">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('publicDash.filterMetrics', 'Filter Dashboard Metrics')}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50"
                >
                  <option value="2026">2026 (Current Year)</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50"
                >
                  <option value="ALL">All Months (Jan - Sep)</option>
                  {MONTHLY_APPLICATION_TRENDS.map(m => (
                    <option key={m.month} value={m.month}>{m.month}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Department</label>
                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50"
                >
                  <option value="ALL">All Departments (15)</option>
                  {DEPARTMENT_PUBLIC_METRICS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">District</label>
                <select
                  value={selectedDistrictFilter}
                  onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50"
                >
                  <option value="ALL">All Districts (36)</option>
                  {DISTRICT_INDUSTRIAL_METRICS.map(d => (
                    <option key={d.district} value={d.district}>{d.district}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedYear('2026');
                    setSelectedMonth('ALL');
                    setSelectedDeptFilter('ALL');
                    setSelectedDistrictFilter('ALL');
                    setSelectedSectorFilter('ALL');
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 13 — SMART INSIGHT PANEL */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wide mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>MahaUdyogSetu System Insights</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
              <span className="font-bold text-emerald-300 block mb-1">↑ Application Volume Growth</span>
              <p className="text-slate-200 leading-relaxed">
                Industrial clearances surged 48% between January and September 2026, led by manufacturing and automobile sectors.
              </p>
            </div>

            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
              <span className="font-bold text-teal-300 block mb-1">⚡ Faster Disposal SLA Turnaround</span>
              <p className="text-slate-200 leading-relaxed">
                Average state-wide clearance processing time dropped to 14.2 business days, with 94.8% compliance under RTS Act 2015.
              </p>
            </div>

            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
              <span className="font-bold text-blue-300 block mb-1">🌿 Environmental & Safety Scrutiny</span>
              <p className="text-slate-200 leading-relaxed">
                Pollution Control (MPCB) and Factory Safety (DISH) account for 39.4% of total state lodgements with active scrutiny queues.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 01 — KEY PERFORMANCE OVERVIEW (8 CARDS) */}
        {(activeTab === 'overview' || activeTab === 'applications') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Key Performance Overview
              </h2>
              <span className="text-xs text-slate-400">Aggregated Open Data</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Services</span>
                <div className="text-2xl font-black text-slate-900 mt-1">179</div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Across 15 Departments</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Applications Submitted</span>
                <div className="text-2xl font-black text-blue-700 mt-1">650,992</div>
                <span className="text-[10px] text-blue-600 mt-0.5 block">Cumulative Jan–Sep 2026</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Approvals Processed</span>
                <div className="text-2xl font-black text-emerald-700 mt-1">482,360</div>
                <span className="text-[10px] text-emerald-600 mt-0.5 block">74.1% Overall Disposal</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Applications</span>
                <div className="text-2xl font-black text-amber-700 mt-1">42,850</div>
                <span className="text-[10px] text-amber-600 mt-0.5 block">Currently Under Review</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Grievances Registered</span>
                <div className="text-2xl font-black text-rose-700 mt-1">5,881</div>
                <span className="text-[10px] text-rose-600 mt-0.5 block">92.4% Resolution Rate</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Queries Registered</span>
                <div className="text-2xl font-black text-purple-700 mt-1">5,262</div>
                <span className="text-[10px] text-purple-600 mt-0.5 block">3-Day Turnaround</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Services / Depts</span>
                <div className="text-2xl font-black text-slate-900 mt-1">179 / 15</div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">100% Online Clearances</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Districts Covered</span>
                <div className="text-2xl font-black text-teal-700 mt-1">36</div>
                <span className="text-[10px] text-teal-600 mt-0.5 block">All Maharashtra Districts</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 02 & 03 — APPLICATION TRENDS & APPROVAL PERFORMANCE */}
        {(activeTab === 'overview' || activeTab === 'applications' || activeTab === 'approvals') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SECTION 02: APPLICATION TRENDS (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Application Trends (2026)</h3>
                  <p className="text-xs text-slate-400">Monthly trajectory across January to September 2026</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Metric Switcher */}
                  <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    {(['applications', 'approvals', 'rejections', 'pending'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setTrendMetric(m)}
                        className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                          trendMetric === m ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* Chart Type Switcher */}
                  <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-2 py-1 rounded-lg transition-all ${chartType === 'bar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
                      title="Bar Chart"
                    >
                      Bars
                    </button>
                    <button
                      onClick={() => setChartType('line')}
                      className={`px-2 py-1 rounded-lg transition-all ${chartType === 'line' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
                      title="Line Trend"
                    >
                      Line
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Chart Canvas */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 sm:p-6">
                
                {/* Visual SVG Chart Rendering */}
                {chartType === 'bar' ? (
                  <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 border-b border-slate-200 pb-2 relative">
                    
                    {/* Background Gridlines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      <div className="border-b border-dashed border-slate-300 w-full" />
                      <div className="border-b border-dashed border-slate-300 w-full" />
                      <div className="border-b border-dashed border-slate-300 w-full" />
                      <div className="border-b border-dashed border-slate-300 w-full" />
                    </div>

                    {MONTHLY_APPLICATION_TRENDS.map((item, idx) => {
                      const val = item[trendMetric];
                      const heightPercent = Math.max(12, Math.round((val / maxTrendVal) * 90));
                      const isHighlighted = selectedMonth === 'ALL' || selectedMonth.toLowerCase() === item.month.toLowerCase();

                      return (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedMonth(item.month)}
                          className={`flex-1 flex flex-col items-center gap-2 group h-full justify-end cursor-pointer z-10 transition-all ${
                            isHighlighted ? 'opacity-100' : 'opacity-35'
                          }`}
                        >
                          {/* Value Tag Above Bar */}
                          <span className={`text-[10px] font-mono font-bold transition-all px-1.5 py-0.5 rounded ${
                            isHighlighted ? 'text-slate-800 bg-white shadow-2xs' : 'text-slate-400'
                          }`}>
                            {(val / 1000).toFixed(1)}k
                          </span>

                          {/* Bar Element */}
                          <div className="w-full max-w-[42px] flex items-end h-full">
                            <div 
                              className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110 shadow-xs ${
                                trendMetric === 'approvals' ? 'bg-gradient-to-t from-emerald-600 to-teal-400' :
                                trendMetric === 'rejections' ? 'bg-gradient-to-t from-rose-600 to-red-400' :
                                trendMetric === 'pending' ? 'bg-gradient-to-t from-amber-600 to-yellow-400' :
                                'bg-gradient-to-t from-blue-700 to-blue-500'
                              } ${selectedMonth === item.month ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                              style={{ height: `${heightPercent}%` }}
                            />
                          </div>

                          {/* Month Label */}
                          <span className={`text-[11px] font-bold transition-colors truncate ${
                            selectedMonth === item.month ? 'text-blue-700 underline font-black' : 'text-slate-600'
                          }`}>
                            {item.month.slice(0, 3)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* SVG Area & Line Chart */
                  <div className="h-64 relative flex flex-col justify-between pt-4 pb-2 border-b border-slate-200">
                    <svg className="w-full h-48 overflow-visible" viewBox="0 0 900 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <polygon
                        fill="url(#areaGradient)"
                        points={`
                          0,200 
                          ${MONTHLY_APPLICATION_TRENDS.map((item, i) => {
                            const x = (i / (MONTHLY_APPLICATION_TRENDS.length - 1)) * 900;
                            const y = 190 - ((item[trendMetric] / maxTrendVal) * 160);
                            return `${x},${y}`;
                          }).join(' ')} 
                          900,200
                        `}
                      />

                      {/* Line Path */}
                      <polyline
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={MONTHLY_APPLICATION_TRENDS.map((item, i) => {
                          const x = (i / (MONTHLY_APPLICATION_TRENDS.length - 1)) * 900;
                          const y = 190 - ((item[trendMetric] / maxTrendVal) * 160);
                          return `${x},${y}`;
                        }).join(' ')}
                      />

                      {/* Data Point Dots */}
                      {MONTHLY_APPLICATION_TRENDS.map((item, i) => {
                        const x = (i / (MONTHLY_APPLICATION_TRENDS.length - 1)) * 900;
                        const y = 190 - ((item[trendMetric] / maxTrendVal) * 160);
                        return (
                          <g key={i}>
                            <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                            <text x={x} y={y - 12} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e293b">
                              {(item[trendMetric] / 1000).toFixed(1)}k
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Month Labels Under Line */}
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-2">
                      {MONTHLY_APPLICATION_TRENDS.map((m, i) => (
                        <span key={i}>{m.month.slice(0, 3)}</span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Interactive Legend & Filter helper */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    <span>Metric: <strong className="text-slate-900 capitalize">{trendMetric}</strong></span>
                  </span>
                  <span>Total Jan–Sep: <strong className="text-slate-900 font-mono">{(MONTHLY_APPLICATION_TRENDS.reduce((a, c) => a + c[trendMetric], 0)).toLocaleString()}</strong></span>
                </div>

                {selectedMonth !== 'ALL' && (
                  <button
                    onClick={() => setSelectedMonth('ALL')}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Reset Month Filter ({selectedMonth} Selected)
                  </button>
                )}
              </div>
            </div>

            {/* SECTION 03: APPROVAL PERFORMANCE (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Approval Performance</h3>
                <p className="text-xs text-slate-400 mb-6">Outcome distribution across all submitted dockets</p>

                {/* Progress Breakdown Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-emerald-800 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        <span>Approved</span>
                      </span>
                      <span className="text-emerald-700">74.1% (482,360)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '74.1%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-amber-800 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Under Active Scrutiny</span>
                      </span>
                      <span className="text-amber-700">18.2% (118,500)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '18.2%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-blue-800 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span>Returned for Query / Correction</span>
                      </span>
                      <span className="text-blue-700">4.8% (31,240)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '4.8%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-rose-800 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span>Rejected / Withdrawn</span>
                      </span>
                      <span className="text-rose-700">2.9% (18,892)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '2.9%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 mt-6">
                <span className="font-bold text-slate-800 block mb-0.5">Average State-wide SLA:</span>
                94.8% of clearances are processed within the time limits notified under the Maharashtra Right to Public Services Act.
              </div>
            </div>

          </div>
        )}

        {/* SECTION 04 — DEPARTMENT-WISE PERFORMANCE */}
        {(activeTab === 'overview' || activeTab === 'departments') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Department-wise Services & Applications
                </h3>
                <p className="text-xs text-slate-400">Click any department row for full public breakdown</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                  placeholder="Search department..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Services</th>
                    <th className="py-3 px-3">Applications</th>
                    <th className="py-3 px-3">Approved</th>
                    <th className="py-3 px-3">Pending</th>
                    <th className="py-3 px-3">Avg Days</th>
                    <th className="py-3 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDepartments.map((dept) => (
                    <tr 
                      key={dept.id} 
                      onClick={() => navigate(`/public-dashboard/department/${dept.id}`)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {dept.name}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">{dept.servicesCount}</td>
                      <td className="py-3.5 px-3 text-slate-900 font-mono font-bold">{dept.applicationsCount.toLocaleString()}</td>
                      <td className="py-3.5 px-3 text-emerald-700 font-mono font-bold">{dept.approvedCount.toLocaleString()}</td>
                      <td className="py-3.5 px-3 text-amber-700 font-mono">{dept.pendingCount.toLocaleString()}</td>
                      <td className="py-3.5 px-3 text-slate-700 font-semibold">{dept.avgProcessingDays} Days</td>
                      <td className="py-3.5 px-3">
                        <span className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
                          <span>View</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 05 — DISTRICT-WISE INDUSTRIAL ACTIVITY */}
        {(activeTab === 'overview' || activeTab === 'districts') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  District-wise Industrial Activity
                </h3>
                <p className="text-xs text-slate-400">Maharashtra district-level aggregated investment & clearances data</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedDistrictDetail.district}
                  onChange={(e) => {
                    const found = DISTRICT_INDUSTRIAL_METRICS.find(d => d.district === e.target.value);
                    if (found) setSelectedDistrictDetail(found);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  {DISTRICT_INDUSTRIAL_METRICS.map(d => (
                    <option key={d.district} value={d.district}>{d.district}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected District Deep Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-4">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {selectedDistrictDetail.region} Region
                  </span>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    {selectedDistrictDetail.district} District
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Proposed Investment</span>
                  <strong className="text-lg font-black text-teal-700 font-mono">₹ {selectedDistrictDetail.proposedInvestmentCr.toLocaleString()} Cr</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Applications Filed:</span>
                  <strong className="text-slate-900 font-bold">{selectedDistrictDetail.applicationsCount.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Approvals Released:</span>
                  <strong className="text-emerald-700 font-bold">{selectedDistrictDetail.approvedCount.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Active Industrial Units:</span>
                  <strong className="text-slate-800">{selectedDistrictDetail.registeredUnits.toLocaleString()} Units</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Employment Potential:</span>
                  <strong className="text-slate-800">{selectedDistrictDetail.employmentPotential.toLocaleString()} Jobs</strong>
                </div>
              </div>
            </div>

            {/* Districts Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">District</th>
                    <th className="py-3 px-3">Region</th>
                    <th className="py-3 px-3">Applications</th>
                    <th className="py-3 px-3">Approvals</th>
                    <th className="py-3 px-3">Active Projects</th>
                    <th className="py-3 px-3">Investment (₹ Cr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {DISTRICT_INDUSTRIAL_METRICS.map((d, i) => (
                    <tr 
                      key={i}
                      onClick={() => setSelectedDistrictDetail(d)}
                      className={`cursor-pointer transition-colors ${
                        selectedDistrictDetail.district === d.district ? 'bg-blue-50/80 font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-3 text-slate-900">{d.district}</td>
                      <td className="py-3 px-3 text-slate-500">{d.region}</td>
                      <td className="py-3 px-3 font-mono">{d.applicationsCount.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-emerald-700">{d.approvedCount.toLocaleString()}</td>
                      <td className="py-3 px-3">{d.activeProjects.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-slate-900 font-bold">₹ {d.proposedInvestmentCr.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 06 — INDUSTRY SECTOR ANALYTICS */}
        {(activeTab === 'overview' || activeTab === 'industries') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Industrial Sector Overview</h3>
              <p className="text-xs text-slate-400">Share of statutory applications and proposed capital investment by sector</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SECTOR_METRICS.map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-xs font-bold text-slate-900">{s.sector}</strong>
                    <span className="text-xs font-mono font-bold text-blue-700">{s.sharePercent}% Share</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-3">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${s.sharePercent * 2.5}%` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500">
                    <div>Applications: <strong className="text-slate-800">{s.applications.toLocaleString()}</strong></div>
                    <div>Approvals: <strong className="text-emerald-700">{s.approvals.toLocaleString()}</strong></div>
                    <div>Investment: <strong className="text-slate-800">₹{s.proposedInvestmentCr} Cr</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 07 — GRIEVANCE & CITIZEN SUPPORT TRANSPARENCY */}
        {(activeTab === 'overview' || activeTab === 'grievances') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Citizen Support & RTS Redressal Overview</h3>
              <p className="text-xs text-slate-400">Public aggregated records under Maharashtra Right to Public Services Act (RTS Act, 2015)</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">Total Grievances</span>
                <div className="text-xl font-black text-rose-900 mt-1">5,881</div>
                <span className="text-[10px] text-rose-700 mt-0.5 block">State-wide Redressal</span>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Resolved Cases</span>
                <div className="text-xl font-black text-emerald-700 mt-1">5,434</div>
                <span className="text-[10px] text-emerald-600 mt-0.5 block">92.4% Disposal Rate</span>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Under Action</span>
                <div className="text-xl font-black text-amber-700 mt-1">447</div>
                <span className="text-[10px] text-amber-600 mt-0.5 block">Nodal Officer Review</span>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Average Resolution</span>
                <div className="text-xl font-black text-blue-700 mt-1">5.8 Days</div>
                <span className="text-[10px] text-blue-600 mt-0.5 block">Within 7-Day Limit</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 08 — SERVICE PERFORMANCE TABLE */}
        {(activeTab === 'overview' || activeTab === 'services') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Service Performance Insights</h3>
                <p className="text-xs text-slate-400">Turnaround time across major statutory licensing workflows</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Filter services..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Service Name</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Applications</th>
                    <th className="py-3 px-3">Completed</th>
                    <th className="py-3 px-3">Avg Days</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredServices.map(srv => (
                    <tr key={srv.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-3 font-bold text-slate-900">{srv.serviceName}</td>
                      <td className="py-3.5 px-3 text-slate-500">{srv.department}</td>
                      <td className="py-3.5 px-3 font-mono">{srv.applications.toLocaleString()}</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-700 font-bold">{srv.completed.toLocaleString()}</td>
                      <td className="py-3.5 px-3 text-slate-700 font-semibold">{srv.avgDays} Days</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          srv.status === 'High Performance' ? 'bg-emerald-100 text-emerald-800' :
                          srv.status === 'Action Needed' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {srv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 11 — DOCUMENT / DATA TRANSPARENCY REPORTS */}
        {(activeTab === 'overview' || activeTab === 'reports') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Public Data & Reports</h3>
              <p className="text-xs text-slate-400">Download consolidated non-sensitive open data reports</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Annual RTS Performance Report 2026', desc: 'Consolidated clearance disposals across 15 Maharashtra departments' },
                { title: 'District Industrial Activity Dossier', desc: '36-district aggregate investment, unit registrations & jobs potential' },
                { title: 'Statutory Grievance Redressal Audit', desc: 'Summary of 5,881 RTS complaints and resolution benchmarks' }
              ].map((rep, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{rep.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{rep.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadReport('CSV')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
                    >
                      Download CSV
                    </button>
                    <button
                      onClick={() => handleDownloadReport('PDF')}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 14 — PUBLIC TRANSPARENCY NOTICE */}
        <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Public Dashboard & Data Privacy Framework</span>
          </div>
          <p className="leading-relaxed">
            This dashboard provides aggregated information intended to improve transparency and public understanding of industrial services under the Maharashtra Right to Public Services Act (RTS Act, 2015). Individual applicant and business information is not displayed.
          </p>
          <p className="text-[11px] text-slate-400 italic">
            Some figures shown in this prototype are simulated demonstration data for platform showcase and do not represent official Government of Maharashtra gazette statistics.
          </p>
        </div>

      </main>

      <PublicDashboardFooter />
    </div>
  );
};
