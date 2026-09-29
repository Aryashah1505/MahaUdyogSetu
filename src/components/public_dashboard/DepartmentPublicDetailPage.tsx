import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PublicDashboardHeader, PublicDashboardFooter } from './PublicDashboardHeader';
import { DEPARTMENT_PUBLIC_METRICS } from '../../data/publicDashboardStore';
import { 
  ArrowLeft, 
  Building2, 
  FileText, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  Download,
  Search,
  ExternalLink
} from 'lucide-react';

export const DepartmentPublicDetailPage: React.FC = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const navigate = useNavigate();

  const dept = DEPARTMENT_PUBLIC_METRICS.find(d => d.id === deptId || d.code.toLowerCase() === deptId?.toLowerCase()) 
    || DEPARTMENT_PUBLIC_METRICS[0];

  const [searchService, setSearchService] = useState('');

  const filteredServices = dept.topServices.filter(s => 
    s.name.toLowerCase().includes(searchService.toLowerCase())
  );

  const handleDownloadDeptReport = () => {
    const text = `========================================================
GOVERNMENT OF MAHARASHTRA • MAHAUDYOGSETU
DEPARTMENT AGGREGATE PUBLIC PERFORMANCE REPORT
========================================================

Department:             ${dept.name} (${dept.code})
Statutory Services:     ${dept.servicesCount}
Total Applications:     ${dept.applicationsCount.toLocaleString()}
Approved Disposals:     ${dept.approvedCount.toLocaleString()} (${((dept.approvedCount/dept.applicationsCount)*100).toFixed(1)}%)
Active Under Review:    ${dept.pendingCount.toLocaleString()}
Rejections / Objections:${dept.rejectedCount.toLocaleString()}
Average Processing Time:${dept.avgProcessingDays} Days
SLA Compliance Rate:    ${dept.slaComplianceRate}%

--------------------------------------------------------
KEY SERVICES SCRUTINY SUMMARY:
--------------------------------------------------------
${dept.topServices.map(s => `${s.name}\n  • Total Lodgements: ${s.applications.toLocaleString()}\n  • Approved: ${s.approved.toLocaleString()}\n  • Average Turnaround: ${s.avgDays} Days`).join('\n\n')}

========================================================
Public Data Notice: This report contains strictly anonymized and aggregated statistical records under Maharashtra RTS Act, 2015.
========================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dept.code}_Public_Performance_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicDashboardHeader 
        activeTab="departments"
        onSelectTab={() => navigate('/public-dashboard')}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/public-dashboard')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Dashboard</span>
          </button>

          <span className="text-xs font-bold text-slate-500">
            Department Code: <strong className="text-slate-900 font-mono">{dept.code}</strong>
          </span>
        </div>

        {/* Hero Department Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Maharashtra State Department Public Record</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {dept.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Aggregated statutory licensing, clearance disposals and service delivery metrics under RTS Act 2015.
              </p>
            </div>

            <button
              onClick={handleDownloadDeptReport}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Department Report</span>
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Applications</span>
              <div className="text-xl font-black text-slate-900 mt-1">{dept.applicationsCount.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">{dept.servicesCount} Online Services</span>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Approvals Released</span>
              <div className="text-xl font-black text-emerald-700 mt-1">{dept.approvedCount.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-600 mt-0.5 block">{((dept.approvedCount/dept.applicationsCount)*100).toFixed(1)}% Approval Rate</span>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Under Review</span>
              <div className="text-xl font-black text-amber-700 mt-1">{dept.pendingCount.toLocaleString()}</div>
              <span className="text-[10px] text-amber-600 mt-0.5 block">Active Scrutiny</span>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-800 uppercase block">Avg Processing Time</span>
              <div className="text-xl font-black text-blue-700 mt-1">{dept.avgProcessingDays} Days</div>
              <span className="text-[10px] text-blue-600 mt-0.5 block">{dept.slaComplianceRate}% RTS SLA Adherence</span>
            </div>
          </div>
        </div>

        {/* Detailed Services Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900">
              Statutory Services Breakdown & Disposals
            </h3>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
                placeholder="Filter services..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Service Name</th>
                  <th className="py-3 px-3">Applications</th>
                  <th className="py-3 px-3">Approvals</th>
                  <th className="py-3 px-3">Avg Turnaround</th>
                  <th className="py-3 px-3">Disposal Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredServices.map((srv, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {srv.name}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-mono">
                      {srv.applications.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-emerald-700 font-mono font-bold">
                      {srv.approved.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      {srv.avgDays} Days
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-600 h-full rounded-full" 
                            style={{ width: `${(srv.approved / srv.applications) * 100}%` }}
                          />
                        </div>
                        <span className="font-bold text-[11px] text-slate-800">
                          {((srv.approved / srv.applications) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Public Notice */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-100 text-slate-500 text-xs text-center">
          Public Data Protection: All records are anonymized aggregates. No individual applicant or enterprise names are exposed.
        </div>

      </main>

      <PublicDashboardFooter />
    </div>
  );
};
