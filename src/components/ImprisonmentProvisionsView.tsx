import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Search, 
  Filter, 
  AlertTriangle, 
  Building2, 
  ChevronRight, 
  Landmark, 
  CheckCircle2, 
  Clock, 
  X,
  ChevronLeft,
  ChevronRight as ChevronNext,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  ShieldAlert,
  BookOpen,
  FileCheck
} from 'lucide-react';
import { 
  ImprisonmentProvision, 
  MAHARASHTRA_IMPRISONMENT_PROVISIONS 
} from '../data/imprisonmentProvisionsData';
import { ApprovalItem, BusinessProfile } from '../types';

interface ImprisonmentProvisionsViewProps {
  approvals?: ApprovalItem[];
  profile?: BusinessProfile;
  onBackToApplications?: () => void;
  onOpenServiceReadiness?: (serviceCode: string) => void;
}

export interface ServiceComplianceRow {
  srNo: number;
  applicationId: string;
  serviceName: string;
  departmentName: string;
  factory: string;
  actRule: string;
  applicableProvision: string;
  imprisonmentTerm: string;
  finePenalty: string;
  responsibleAuthority: string;
  complianceRemedy: string;
  bailable: string;
  cognizable: string;
  keyRiskLevel: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  rawProvision?: ImprisonmentProvision;
}

export const ImprisonmentProvisionsView: React.FC<ImprisonmentProvisionsViewProps> = ({
  approvals = [],
  profile,
  onBackToApplications,
  onOpenServiceReadiness
}) => {
  // Factory unit dropdown filter
  const factoryUnitOptions = useMemo(() => {
    const defaultUnitName = profile?.name 
      ? `${profile.name} - Unit 1 (${profile.plotNumber || 'Plot No. W-42'}, ${profile.district || 'Nashik'})` 
      : 'Apex Precision Engineering Works - Unit 1 (Ambad MIDC, Nashik)';
    return ['ALL', defaultUnitName];
  }, [profile]);

  const [selectedFactoryUnit, setSelectedFactoryUnit] = useState<string>('ALL');
  const [departmentWiseFilter, setDepartmentWiseFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowDetails, setSelectedRowDetails] = useState<ServiceComplianceRow | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  const defaultFactoryName = profile?.name 
    ? `${profile.name} (Unit 1)` 
    : 'Apex Precision Engineering Works (Unit 1)';

  // Build compliance rows linked to actual user applications and Maharashtra statutory landscape
  const complianceRows: ServiceComplianceRow[] = useMemo(() => {
    const rows: ServiceComplianceRow[] = [];

    // 1. Map user's actual applications if present
    if (approvals && approvals.length > 0) {
      approvals.forEach((app) => {
        // Find matching statutory provisions in Maharashtra catalog
        const matchingProvisions = MAHARASHTRA_IMPRISONMENT_PROVISIONS.filter(p => 
          p.department.toLowerCase().includes(app.department.toLowerCase()) ||
          app.name.toLowerCase().includes(p.actName.toLowerCase()) ||
          (app.code.includes('LAB') && p.departmentCode === 'LABOUR') ||
          (app.code.includes('MPCB') && p.departmentCode === 'MPCB') ||
          (app.code.includes('CTE') && p.departmentCode === 'MPCB') ||
          (app.code.includes('DISH') && p.departmentCode === 'DISH') ||
          (app.code.includes('BLR') && p.departmentCode === 'BOILER') ||
          (app.code.includes('PWR') && p.departmentCode === 'MSEDCL') ||
          (app.code.includes('FIRE') && p.departmentCode === 'FIRE')
        );

        if (matchingProvisions.length > 0) {
          matchingProvisions.forEach((prov) => {
            rows.push({
              srNo: rows.length + 1,
              applicationId: app.applicationRefNumber || app.id,
              serviceName: app.name,
              departmentName: app.department,
              factory: defaultFactoryName,
              actRule: prov.actName,
              applicableProvision: `${prov.ruleOrSection} (${prov.imprisonmentTerm})`,
              imprisonmentTerm: prov.imprisonmentTerm,
              finePenalty: prov.finePenalty,
              responsibleAuthority: prov.responsibleAuthority,
              complianceRemedy: prov.complianceRemedy,
              bailable: prov.bailable,
              cognizable: prov.cognizable,
              keyRiskLevel: prov.keyRiskLevel,
              rawProvision: prov
            });
          });
        } else {
          // General mapping for the applied service
          rows.push({
            srNo: rows.length + 1,
            applicationId: app.applicationRefNumber || app.id,
            serviceName: app.name,
            departmentName: app.department,
            factory: defaultFactoryName,
            actRule: `${app.department} Statutory Compliance Rules`,
            applicableProvision: `Section 92 / Penal Provision for unapproved operation (Up to 2 Years Imprisonment / Civil Compounding)`,
            imprisonmentTerm: 'Up to 2 Years Imprisonment',
            finePenalty: 'Civil compounding fine up to ₹1,00,000 under Jan Vishwas Act',
            responsibleAuthority: app.department,
            complianceRemedy: 'Complete mandatory statutory scrutiny and obtain digital QR-coded registration certificate.',
            bailable: 'Bailable',
            cognizable: 'Non-Cognizable',
            keyRiskLevel: 'HIGH'
          });
        }
      });
    }

    // 2. Also append relevant industrial provisions applicable to registered industry profile
    MAHARASHTRA_IMPRISONMENT_PROVISIONS.forEach((prov) => {
      const alreadyMapped = rows.some(r => r.actRule === prov.actName && r.applicableProvision.includes(prov.ruleOrSection));
      if (!alreadyMapped) {
        rows.push({
          srNo: rows.length + 1,
          applicationId: `MH-REG-${prov.departmentCode}-${Math.floor(1000 + rows.length * 77)}`,
          serviceName: prov.offenceTitle,
          departmentName: prov.department,
          factory: defaultFactoryName,
          actRule: prov.actName,
          applicableProvision: `${prov.ruleOrSection} (${prov.imprisonmentTerm})`,
          imprisonmentTerm: prov.imprisonmentTerm,
          finePenalty: prov.finePenalty,
          responsibleAuthority: prov.responsibleAuthority,
          complianceRemedy: prov.complianceRemedy,
          bailable: prov.bailable,
          cognizable: prov.cognizable,
          keyRiskLevel: prov.keyRiskLevel,
          rawProvision: prov
        });
      }
    });

    // Re-index srNo
    return rows.map((r, i) => ({ ...r, srNo: i + 1 }));
  }, [approvals, defaultFactoryName]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return complianceRows.filter(row => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        row.serviceName.toLowerCase().includes(q) ||
        row.applicationId.toLowerCase().includes(q) ||
        row.actRule.toLowerCase().includes(q) ||
        row.departmentName.toLowerCase().includes(q) ||
        row.applicableProvision.toLowerCase().includes(q)
      );

      const matchesDept = departmentWiseFilter === 'ALL' || row.departmentName.toLowerCase().includes(departmentWiseFilter.toLowerCase());

      return matchesSearch && matchesDept;
    });
  }, [complianceRows, searchQuery, departmentWiseFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* =========================================================================
          1. MAIN WHITE CONTAINER CARD (Matching official reference layout)
         ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
        
        {/* Header Title with "Go Back" button */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              View services falling under imprisonment provisions
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              View services and compliance provisions applicable to your registered industry, ensuring full regulatory transparency.
            </p>
          </div>

          {onBackToApplications && (
            <button
              onClick={onBackToApplications}
              className="px-4 py-2 rounded-lg bg-[#1a56db] hover:bg-[#1e429f] text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap self-start"
            >
              Go Back
            </button>
          )}
        </div>

        {/* Filter Bar: Select Factory Unit & Department Wise Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3 pt-1">
          
          {/* Select Factory Unit Dropdown */}
          <div className="space-y-1 max-w-sm w-full">
            <label className="text-[11px] font-bold text-slate-700 block">
              Factory Unit
            </label>
            <div className="relative">
              <select
                value={selectedFactoryUnit}
                onChange={(e) => setSelectedFactoryUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              >
                <option value="ALL">Select Factory Unit (All Registered Units)</option>
                {factoryUnitOptions.filter(f => f !== 'ALL').map((unit, i) => (
                  <option key={i} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search & Department Wise Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search service, act, or ID..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setDepartmentWiseFilter(prev => prev === 'ALL' ? 'Labour' : prev === 'Labour' ? 'MPCB' : prev === 'MPCB' ? 'DISH' : 'ALL');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap ${
                departmentWiseFilter !== 'ALL'
                  ? 'bg-[#1a56db] text-white'
                  : 'bg-[#1a56db] hover:bg-[#1e429f] text-white'
              }`}
            >
              {departmentWiseFilter === 'ALL' ? 'Department Wise' : `Dept: ${departmentWiseFilter}`}
            </button>
          </div>

        </div>

        {/* =========================================================================
            2. STRUCTURED TABLE (Matching layout of reference image)
           ========================================================================= */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl mt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f4fc] text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 text-center w-14">Sr No.</th>
                <th className="py-3 px-3.5 min-w-[140px]">Application ID</th>
                <th className="py-3 px-3.5 min-w-[200px]">Service Name</th>
                <th className="py-3 px-3.5 min-w-[160px]">Factory</th>
                <th className="py-3 px-3.5 min-w-[180px]">Act / Rule</th>
                <th className="py-3 px-3.5 min-w-[240px]">Compliance / Imprisonment Provision</th>
                <th className="py-3 px-3.5 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row) => (
                  <tr key={row.srNo} className="hover:bg-slate-50/90 transition-colors">
                    
                    {/* Sr No. */}
                    <td className="py-3 px-3 text-center text-slate-500 font-semibold">
                      {row.srNo}
                    </td>

                    {/* Application ID */}
                    <td className="py-3.5 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {row.applicationId}
                    </td>

                    {/* Service Name */}
                    <td className="py-3.5 px-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 leading-snug">{row.serviceName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{row.departmentName}</div>
                    </td>

                    {/* Factory */}
                    <td className="py-3.5 px-3.5 text-slate-700 font-medium">
                      {row.factory}
                    </td>

                    {/* Act / Rule */}
                    <td className="py-3.5 px-3.5 text-slate-800 font-semibold">
                      {row.actRule}
                    </td>

                    {/* Compliance / Imprisonment Provision */}
                    <td className="py-3.5 px-3.5 max-w-sm">
                      <div className="font-bold text-rose-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span>{row.applicableProvision}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        Fine: {row.finePenalty}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRowDetails(row)}
                        className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>View Details</span>
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                /* Empty state row if no record found */
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium text-xs">
                    No record found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            3. PAGINATION CONTROLS (Matching << < > >> layout)
           ========================================================================= */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <div className="text-slate-500 font-medium">
            Showing <strong>{paginatedRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to <strong>{Math.min(currentPage * pageSize, filteredRows.length)}</strong> of <strong>{filteredRows.length}</strong> provisions
          </div>

          <div className="flex items-center gap-1 text-slate-600 font-bold">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-800 text-[11px] font-bold">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white cursor-pointer"
              title="Next Page"
            >
              <ChevronNext className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          4. STATUTORY LEGAL DISCLAIMER
         ========================================================================= */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300/80 text-amber-950 text-xs flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-black text-amber-900">Official Statutory Disclaimer</h4>
          <p className="text-amber-800 leading-relaxed font-medium">
            Penalties and imprisonment provisions depend on the applicable law and facts of the case. Refer to the current official notification/Act. Information presented on MahaUdyogSetu is for regulatory guidance and compliance readiness only.
          </p>
        </div>
      </div>

      {/* =========================================================================
          5. MODAL: DETAILED PROVISION BREAKDOWN
         ========================================================================= */}
      {selectedRowDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh] my-auto">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 relative">
              <button 
                onClick={() => setSelectedRowDetails(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-400/30 uppercase tracking-wide">
                  Compliance & Penal Liability
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-slate-300">
                  Ref: {selectedRowDetails.applicationId}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white pr-8">
                {selectedRowDetails.actRule}
              </h2>

              <p className="text-xs text-blue-200 mt-1 font-semibold">
                Service: {selectedRowDetails.serviceName} • {selectedRowDetails.departmentName}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Offence Detail */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Applicable Provision & Scope</div>
                <h4 className="font-bold text-sm text-slate-900">{selectedRowDetails.applicableProvision}</h4>
                <p className="text-slate-600 leading-relaxed text-xs pt-1">
                  Enforceable under {selectedRowDetails.actRule} across Maharashtra industrial jurisdictions.
                </p>
              </div>

              {/* 3-Col Liability Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-rose-700 uppercase flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>Imprisonment Term</span>
                  </div>
                  <div className="font-black text-rose-950 text-sm">
                    {selectedRowDetails.imprisonmentTerm}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Fine / Penalty</div>
                  <div className="font-bold text-slate-900 text-xs">
                    {selectedRowDetails.finePenalty}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Legal Categorization</div>
                  <div className="font-bold text-slate-900 text-xs">
                    {selectedRowDetails.bailable} • {selectedRowDetails.cognizable}
                  </div>
                </div>

              </div>

              {/* Responsible Authority & Adjudication */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Responsible Enforcement Authority / Jurisdiction</div>
                <div className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{selectedRowDetails.responsibleAuthority}</span>
                </div>
              </div>

              {/* Compliance Remedy & Mitigation */}
              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-300 text-emerald-950 space-y-1.5">
                <div className="text-[10px] font-extrabold text-emerald-800 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Compliance Remedy & Safeguards</span>
                </div>
                <p className="text-emerald-900 font-medium leading-relaxed text-xs">
                  {selectedRowDetails.complianceRemedy}
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-medium">
                MahaUdyogSetu Industrial Regulatory Guide
              </span>

              <button
                onClick={() => setSelectedRowDetails(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Close Breakdown
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
