import React, { useState } from 'react';
import { 
  Archive, 
  Search, 
  Eye, 
  FileText, 
  CheckCircle2, 
  Download, 
  Clock, 
  Building2, 
  ChevronRight, 
  X,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface OldApplicationsViewProps {
  profile: BusinessProfile;
  onBackToDashboard?: () => void;
}

interface ArchivedApplication {
  id: string;
  referenceNumber: string;
  serviceName: string;
  department: string;
  applicationDate: string;
  disposalDate: string;
  certificateNumber: string;
  feePaid: string;
  status: 'Approved & Certificate Issued' | 'Deemed Approval Granted' | 'Archived';
  validityExpiry: string;
  statutoryAct: string;
}

export const OldApplicationsView: React.FC<OldApplicationsViewProps> = ({
  profile,
  onBackToDashboard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchivedApp, setSelectedArchivedApp] = useState<ArchivedApplication | null>(null);

  const archivedList: ArchivedApplication[] = [
    {
      id: 'OLD-MH-2025-DOI-0881',
      referenceNumber: 'SWC/DOI/2025/0019283',
      serviceName: 'Stamp Duty Exemption Certificate for Industrial Land Allotment',
      department: 'Directorate of Industries, Maharashtra',
      applicationDate: '15/10/2025',
      disposalDate: '28/10/2025',
      certificateNumber: 'MH/STAMP-EX/2025/08172',
      feePaid: '₹ 0 (Exempt under PSI 2019)',
      status: 'Approved & Certificate Issued',
      validityExpiry: 'Permanent / Co-terminus with Lease',
      statutoryAct: 'Maharashtra Stamp Act & Package Scheme of Incentives (PSI)'
    },
    {
      id: 'OLD-MH-2025-MIDC-4421',
      referenceNumber: 'SWC/MIDC/2025/0048192',
      serviceName: 'Provisional Allotment of Industrial Plot in Ambad MIDC Area',
      department: 'Maharashtra Industrial Development Corporation (MIDC)',
      applicationDate: '02/08/2025',
      disposalDate: '21/08/2025',
      certificateNumber: 'MIDC/NSK/ALLOT/2025/441',
      feePaid: '₹ 25,000 (Earnest Scrutiny)',
      status: 'Approved & Certificate Issued',
      validityExpiry: '95-Year Registered Lease Agreement',
      statutoryAct: 'MIDC Act 1961 & Land Disposal Regulations'
    },
    {
      id: 'OLD-MH-2024-MSEDCL-1102',
      referenceNumber: 'SWC/EN/2024/0081721',
      serviceName: 'Low Tension (LT) Industrial Construction Power Sanction (65 kW)',
      department: 'Energy Department / MSEDCL',
      applicationDate: '10/11/2024',
      disposalDate: '19/11/2024',
      certificateNumber: 'MSEDCL/NSK-II/LT/2024/9182',
      feePaid: '₹ 15,000',
      status: 'Approved & Certificate Issued',
      validityExpiry: 'Active Connection',
      statutoryAct: 'Electricity Act 2003 & Maharashtra Electricity Regulatory Commission'
    }
  ];

  const filtered = archivedList.filter(a => {
    const q = searchQuery.toLowerCase().trim();
    return !q || a.serviceName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.department.toLowerCase().includes(q) || a.referenceNumber.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1b3d] via-[#122b5e] to-[#0b1b3d] text-white p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider flex items-center gap-1">
              <Archive className="w-3 h-3 text-blue-400" />
              <span>Historical Single Window Record</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
              Government of Maharashtra
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Historical & Completed Applications Archive</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Access previous statutory applications, issued licences, deemed approval orders, and historical certificates filed under your enterprise profile.
          </p>
        </div>

        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* 2. Applications Table */}
      <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">Archived Clearance Applications ({filtered.length})</h3>
            <p className="text-[11px] text-slate-500">Historical records for {profile.name} (PAN: {profile.pan}).</p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search historical records..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f4fc] text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Application ID & Reference</th>
                <th className="py-3 px-3.5">Service Name</th>
                <th className="py-3 px-3.5">Department</th>
                <th className="py-3 px-3.5">Disposal Date</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <div className="font-mono font-bold text-blue-700">{app.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{app.referenceNumber}</div>
                  </td>

                  <td className="py-3.5 px-3.5 max-w-sm">
                    <div className="font-bold text-slate-900 leading-snug">{app.serviceName}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{app.statutoryAct}</div>
                  </td>

                  <td className="py-3.5 px-3.5 text-slate-700 font-semibold">
                    {app.department}
                  </td>

                  <td className="py-3.5 px-3.5 text-slate-600 text-[11px] whitespace-nowrap">
                    {app.disposalDate}
                  </td>

                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{app.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedArchivedApp(app)}
                      className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MODAL: ARCHIVED APPLICATION DETAILS */}
      {selectedArchivedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-700 font-bold">{selectedArchivedApp.id}</span>
                <h3 className="text-base font-black text-slate-900">{selectedArchivedApp.serviceName}</h3>
              </div>
              <button onClick={() => setSelectedArchivedApp(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Department</div>
                <div className="font-bold text-slate-900">{selectedArchivedApp.department}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Certificate / Sanction No</div>
                <div className="font-mono font-bold text-emerald-800">{selectedArchivedApp.certificateNumber}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Application Date</div>
                <div className="text-slate-800 font-semibold">{selectedArchivedApp.applicationDate}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Approval & Disposal Date</div>
                <div className="text-slate-800 font-semibold">{selectedArchivedApp.disposalDate}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 col-span-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Statutory Validity</div>
                <div className="text-slate-800 font-bold">{selectedArchivedApp.validityExpiry}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => alert(`Downloading signed certificate copy: ${selectedArchivedApp.certificateNumber}`)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sanction Order PDF</span>
              </button>
              <button
                onClick={() => setSelectedArchivedApp(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs"
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
