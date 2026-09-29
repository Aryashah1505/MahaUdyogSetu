import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Calendar, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Download, 
  ArrowRight, 
  Plus, 
  ShieldCheck, 
  Building2, 
  FileText,
  TrendingUp,
  X
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface WizardSession {
  id: string;
  projectName: string;
  sector: string;
  district: string;
  investmentCrores: number;
  workforce: number;
  powerKw: number;
  dateEvaluated: string;
  identifiedApprovalsCount: number;
  appliedApprovalsCount: number;
  projectedSubsidyCrores: number;
  pollutionCategory: 'Red' | 'Orange' | 'Green' | 'White';
  status: 'Active (Applied)' | 'Evaluation Complete' | 'Draft Planning';
  approvalsList: string[];
  schemesList: string[];
}

interface AppliedWizardListViewProps {
  profile: BusinessProfile;
  onRunNewWizard?: () => void;
  onBackToDashboard?: () => void;
}

export const AppliedWizardListView: React.FC<AppliedWizardListViewProps> = ({
  profile,
  onRunNewWizard,
  onBackToDashboard
}) => {
  const [sessions, setSessions] = useState<WizardSession[]>([
    {
      id: 'WIZ-2026-09-8421',
      projectName: `${profile.name || 'Western Maharashtra Engineering'} - Phase 2 Heavy Fabrication & CNC Machining Expansion`,
      sector: profile.sector || 'Engineering & Heavy Manufacturing',
      district: profile.district || 'Nashik',
      investmentCrores: profile.investmentCrores || 18.5,
      workforce: profile.workforce || 75,
      powerKw: profile.connectedPowerKw || 350,
      dateEvaluated: '18 Sep 2026',
      identifiedApprovalsCount: 9,
      appliedApprovalsCount: 3,
      projectedSubsidyCrores: 4.5,
      pollutionCategory: 'Orange',
      status: 'Active (Applied)',
      approvalsList: [
        'Registration under Shops & Establishments Act, 2017 (Labour)',
        'Consent to Establish (CTE) under Water & Air Acts (MPCB)',
        'Factory Building Plan Approval (DISH)',
        'Industrial Power Load Sanction 350 KW (MSEDCL)',
        'Fire Department Provisional NOC'
      ],
      schemesList: [
        'Package Scheme of Incentives (PSI 2019) – Industrial Promotion Subsidy (IPS)',
        'Electricity Duty Exemption for 7 Years',
        'Stamp Duty Exemption on Land Lease'
      ]
    },
    {
      id: 'WIZ-2026-08-3190',
      projectName: 'Chakan Precision Transmission Components & EV Gearbox Line',
      sector: 'Automobile & EV Components',
      district: 'Pune',
      investmentCrores: 42.0,
      workforce: 120,
      powerKw: 600,
      dateEvaluated: '04 Aug 2026',
      identifiedApprovalsCount: 12,
      appliedApprovalsCount: 0,
      projectedSubsidyCrores: 12.6,
      pollutionCategory: 'Orange',
      status: 'Evaluation Complete',
      approvalsList: [
        'Consent to Establish (CTE) under Water & Air Acts',
        'MIDC Building Development Permission',
        'Factory License Grant under Factories Act 1948',
        'Electrical Inspectorate Approval for DG Set',
        'Weights & Measures Manufacturer License'
      ],
      schemesList: [
        'Maharashtra EV Policy 2025 – Capital Subsidy @ 15%',
        'Interest Subvention Scheme @ 5% p.a.',
        'Green Energy & Rooftop Solar Incentive'
      ]
    },
    {
      id: 'WIZ-2026-06-1104',
      projectName: 'Nagpur Multi-Modal Warehouse & Distribution Hub',
      sector: 'Logistics, Warehousing & Supply Chain',
      district: 'Nagpur',
      investmentCrores: 15.0,
      workforce: 50,
      powerKw: 100,
      dateEvaluated: '12 Jun 2026',
      identifiedApprovalsCount: 6,
      appliedApprovalsCount: 0,
      projectedSubsidyCrores: 2.2,
      pollutionCategory: 'Green',
      status: 'Draft Planning',
      approvalsList: [
        'Local Gram Panchayat / Municipal Corporation NOC',
        'Fire Safety Provisional NOC',
        'Commercial Power Connection Sanction'
      ],
      schemesList: [
        'Logistics Parks Incentive Scheme – 100% Stamp Duty Exemption',
        'Power Tariff Subsidy of ₹1.50 per Unit for 5 Years'
      ]
    }
  ]);

  const [selectedSession, setSelectedSession] = useState<WizardSession | null>(null);

  const totalRuns = sessions.length;
  const totalIdentified = sessions.reduce((acc, s) => acc + s.identifiedApprovalsCount, 0);
  const totalSubsidy = sessions.reduce((acc, s) => acc + s.projectedSubsidyCrores, 0);

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Smart Statutory Clearance Engine</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">{profile.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-teal-600" />
              <span>Applied Investor Wizard Evaluations</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
              Review previously diagnosed investment projects, generated statutory approval checklists, and estimated state subsidies.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {onRunNewWizard && (
              <button
                onClick={onRunNewWizard}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Run New Wizard</span>
              </button>
            )}
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completed Wizard Runs</div>
              <div className="text-2xl font-black text-slate-900">{totalRuns}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Identified Clearances</div>
              <div className="text-2xl font-black text-blue-700">{totalIdentified} Approvals</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Identified Subsidies</div>
              <div className="text-2xl font-black text-emerald-700">₹{totalSubsidy.toFixed(1)} Crores</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>

      {/* 2. Wizard Sessions List */}
      <div className="space-y-3.5">
        {sessions.map((session) => {
          const isActive = session.status === 'Active (Applied)';
          return (
            <div 
              key={session.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {session.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-bold">
                      {session.id}
                    </span>
                  </div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 pt-1">
                    {session.projectName}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Evaluated on {session.dateEvaluated}</span>
                </div>
              </div>

              {/* Evaluation Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Proposed Investment</span>
                  <span className="font-extrabold text-slate-900 text-sm">₹{session.investmentCrores} Cr</span>
                  <span className="text-[10px] text-slate-500 block">{session.district} District</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Sector Classification</span>
                  <span className="font-bold text-slate-800 text-xs line-clamp-1">{session.sector}</span>
                  <span className="text-[10px] text-amber-700 font-bold block">{session.pollutionCategory} Category</span>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-blue-800 font-bold uppercase block">Required Approvals</span>
                  <span className="font-black text-blue-900 text-sm">{session.identifiedApprovalsCount} Clearances</span>
                  <span className="text-[10px] text-blue-700 font-bold block">
                    {session.appliedApprovalsCount} Submitted
                  </span>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Govt Incentive Scheme</span>
                  <span className="font-black text-emerald-900 text-sm">₹{session.projectedSubsidyCrores} Cr</span>
                  <span className="text-[10px] text-emerald-700 font-bold block">PSI 2019 / Package</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  Identified clearances across <strong>Labour, MPCB, DISH, MIDC & Energy</strong> departments.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSession(session)}
                    className="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Identified Clearances</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Modal: View Session Details */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Wizard Evaluation Dossier</h3>
                <p className="text-[11px] text-slate-500">{selectedSession.id} • {selectedSession.dateEvaluated}</p>
              </div>
              <button onClick={() => setSelectedSession(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Project</span>
                <div className="font-extrabold text-slate-900 text-sm">{selectedSession.projectName}</div>
                <div className="text-slate-600 text-[11px]">
                  ₹{selectedSession.investmentCrores} Cr Investment • {selectedSession.district} • {selectedSession.powerKw} KW Power
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Identified Mandatory Licences & Approvals ({selectedSession.approvalsList.length})</span>
                </h4>
                <ul className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedSession.approvalsList.map((app, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 font-medium">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span>Eligible Maharashtra Fiscal Incentives ({selectedSession.schemesList.length})</span>
                </h4>
                <ul className="space-y-1.5 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                  {selectedSession.schemesList.map((sch, i) => (
                    <li key={i} className="flex items-start gap-2 text-emerald-950 font-medium">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{sch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
