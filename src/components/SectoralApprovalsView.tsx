import React, { useState } from 'react';
import { 
  Award, 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  IndianRupee, 
  Layers, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Search,
  AlertTriangle
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface SectorApprovalData {
  id: string;
  name: string;
  category: 'Automotive & EV' | 'Engineering & Machinery' | 'Pharmaceuticals & Biotech' | 'Chemicals & Petrochemicals' | 'Food Processing & Agro' | 'Textiles & Garments' | 'IT & Data Centers' | 'Renewable Energy';
  description: string;
  pollutionCategory: 'Red Category' | 'Orange Category' | 'Green Category' | 'White Category';
  nodalDepartment: string;
  policyName: string;
  preEstablishmentApprovals: {
    name: string;
    dept: string;
    sla: string;
    fees: string;
    mandatoryDocs: string[];
  }[];
  preOperationApprovals: {
    name: string;
    dept: string;
    sla: string;
    fees: string;
    mandatoryDocs: string[];
  }[];
  fiscalIncentives: {
    title: string;
    benefit: string;
    authority: string;
  }[];
}

const SECTOR_DATA: SectorApprovalData[] = [
  {
    id: 'sec-auto',
    name: 'Automotive, Auto Components & Electric Vehicles (EV)',
    category: 'Automotive & EV',
    description: 'Manufacturing of automobiles, chassis, electric powertrains, battery packs, transmission gears, and auto-ancillary sub-assemblies.',
    pollutionCategory: 'Orange Category',
    nodalDepartment: 'Industries, Energy & Labour Department',
    policyName: 'Maharashtra Electric Vehicle Policy 2025 & PSI 2019',
    preEstablishmentApprovals: [
      {
        name: 'Consent to Establish (CTE) under Water & Air Acts',
        dept: 'Maharashtra Pollution Control Board',
        sla: '21 Days',
        fees: '₹ 25,000 - ₹ 75,000',
        mandatoryDocs: ['Project DPR & Layout Plan', 'Effluent Treatment Scheme', 'Stack Emission Details', 'Land Allotment Letter']
      },
      {
        name: 'Factory Building Plan Approval',
        dept: 'Directorate of Industrial Safety & Health (DISH)',
        sla: '20 Days',
        fees: '₹ 18,500',
        mandatoryDocs: ['Architectural Plant Blueprint', 'Machinery Layout Drawing', 'Ventilation & Lighting Plan']
      },
      {
        name: 'High Tension (HT) Industrial Power Load Sanction',
        dept: 'Maharashtra State Electricity Distribution Co. (MSEDCL)',
        sla: '10 Days',
        fees: '₹ 35,000',
        mandatoryDocs: ['Electrical Single Line Diagram', 'Connected Load Breakdown', 'Ownership Document']
      },
      {
        name: 'Provisional Fire Safety NOC',
        dept: 'Maharashtra Fire Services / MIDC Fire',
        sla: '15 Days',
        fees: '₹ 12,000',
        mandatoryDocs: ['Fire Fighting System Layout', 'Hydrant Network Plan', 'Site Elevation Drawing']
      }
    ],
    preOperationApprovals: [
      {
        name: 'Consent to Operate (CTO) under Water & Air Acts',
        dept: 'Maharashtra Pollution Control Board',
        sla: '30 Days',
        fees: '₹ 30,000',
        mandatoryDocs: ['CTE Compliance Report', 'ETP / STP Commissioning Proof', 'Hazardous Waste Storage Details']
      },
      {
        name: 'Grant of Factory License',
        dept: 'Directorate of Industrial Safety & Health (DISH)',
        sla: '15 Days',
        fees: '₹ 15,000',
        mandatoryDocs: ['Stability Certificate by Competent Person', 'Safety Officer Appointment', 'Notice of Occupation Form 2']
      },
      {
        name: 'DG Set Installation & Energization Approval',
        dept: 'Electrical Inspectorate, Energy Dept',
        sla: '15 Days',
        fees: '₹ 6,000',
        mandatoryDocs: ['Acoustic Enclosure Certificate', 'Earthing Test Certificate', 'Single Line Diagram']
      }
    ],
    fiscalIncentives: [
      {
        title: 'Industrial Promotion Subsidy (IPS)',
        benefit: 'Up to 100% of Fixed Capital Investment (FCI) refunded via SGST for eligible units.',
        authority: 'Directorate of Industries'
      },
      {
        title: 'EV Pioneer & Mega Project Special Capital Subsidy',
        benefit: '15% to 25% Capital Subsidy on EV components & battery manufacturing equipment.',
        authority: 'State Investment Promotion Board'
      },
      {
        title: 'Electricity Duty Exemption',
        benefit: '100% waiver of electricity duty for 7 to 10 years from COD.',
        authority: 'Energy Department'
      }
    ]
  },
  {
    id: 'sec-eng',
    name: 'Engineering, Heavy Machinery & Metal Fabrication',
    category: 'Engineering & Machinery',
    description: 'Industrial machinery, CNC tooling, machine tools, structural steel fabrication, casting, forging, and heavy metal components.',
    pollutionCategory: 'Orange Category',
    nodalDepartment: 'Directorate of Industries, Maharashtra',
    policyName: 'Maharashtra Industrial Policy & Package Scheme of Incentives (PSI 2019)',
    preEstablishmentApprovals: [
      {
        name: 'Consent to Establish (CTE) for Engineering Fabrication',
        dept: 'Maharashtra Pollution Control Board',
        sla: '21 Days',
        fees: '₹ 25,000',
        mandatoryDocs: ['Manufacturing Flowchart', 'Fume Extraction System Design', 'Paint Booth Filter Details']
      },
      {
        name: 'DISH Factory Plan & Structural Stability Clearance',
        dept: 'Directorate of Industrial Safety and Health',
        sla: '20 Days',
        fees: '₹ 18,500',
        mandatoryDocs: ['Crane & Heavy Gantry Load Calculations', 'Shop Floor Clearance Chart', 'Emergency Exits Plan']
      },
      {
        name: 'Sanction and Release of HT/LT Industrial Power Load',
        dept: 'MSEDCL',
        sla: '10 Days',
        fees: '₹ 35,000',
        mandatoryDocs: ['Transformer Specification', 'Connected Motor Rating List', 'MIDC Lease Deed']
      }
    ],
    preOperationApprovals: [
      {
        name: 'Consent to Operate (CTO)',
        dept: 'Maharashtra Pollution Control Board',
        sla: '30 Days',
        fees: '₹ 30,000',
        mandatoryDocs: ['Solid & Hazardous Waste Storage Compliance', 'Noise Level Assessment Report']
      },
      {
        name: 'Registration and Approval of Boilers / Pressure Vessels',
        dept: 'Directorate of Boilers',
        sla: '15 Days',
        fees: '₹ 15,000',
        mandatoryDocs: ['Manufacturer Test Certificate', 'IBR Pipe Welder Qualification', 'Hydraulic Test Record']
      },
      {
        name: 'Registration under Maharashtra Shops & Establishments Act, 2017',
        dept: 'Labour Department',
        sla: '1 Day',
        fees: '₹ 1,000',
        mandatoryDocs: ['Employer Identity Proof', 'PAN & GSTIN', 'Worker List']
      }
    ],
    fiscalIncentives: [
      {
        title: 'Interest Subvention Subsidy',
        benefit: '5% interest subsidy on term loans for MSME capital investments for 5 years.',
        authority: 'Directorate of Industries'
      },
      {
        title: 'Power Tariff Subsidy',
        benefit: '₹ 1.20 to ₹ 1.50 per unit electricity tariff subsidy for 5 years in backward talukas.',
        authority: 'Energy Department'
      },
      {
        title: 'Stamp Duty Exemption',
        benefit: '100% exemption on stamp duty for land acquisition and term loan hypothecation.',
        authority: 'Revenue & Stamps Dept'
      }
    ]
  },
  {
    id: 'sec-pharma',
    name: 'Pharmaceuticals, Active Ingredients (API) & Medical Devices',
    category: 'Pharmaceuticals & Biotech',
    description: 'Bulk drug synthesis, API manufacturing, sterile formulations, injectables, biotech reagents, and medical diagnostic instruments.',
    pollutionCategory: 'Red Category',
    nodalDepartment: 'Food & Drugs Administration (FDA) & MPCB',
    policyName: 'Maharashtra Bulk Drug & Pharma Hub Policy 2025',
    preEstablishmentApprovals: [
      {
        name: 'Environmental Clearance (EC) / Red Category CTE',
        dept: 'SEIAA & Maharashtra Pollution Control Board',
        sla: '45 Days',
        fees: '₹ 75,000',
        mandatoryDocs: ['Environmental Impact Assessment (EIA)', 'Zero Liquid Discharge (ZLD) Scheme', 'Solvent Recovery Blueprint']
      },
      {
        name: 'Drug Manufacturing Premise Layout Approval',
        dept: 'Food and Drugs Administration (FDA Maharashtra)',
        sla: '30 Days',
        fees: '₹ 20,000',
        mandatoryDocs: ['Clean Room Class Classification', 'HVAC Air Flow Diagram', 'Form 24 / 25 Layout']
      }
    ],
    preOperationApprovals: [
      {
        name: 'Grant of Drug Manufacturing License (Form 25 / Form 28)',
        dept: 'Food and Drugs Administration (FDA)',
        sla: '30 Days',
        fees: '₹ 25,000',
        mandatoryDocs: ['Validation Master Plan', 'Qualified Chemist Bio-Data', 'Water Testing Report (USP Grade)']
      },
      {
        name: 'Hazardous Chemical Storage & PESO License',
        dept: 'Petroleum & Explosives Safety Organization (PESO)',
        sla: '30 Days',
        fees: '₹ 15,000',
        mandatoryDocs: ['Solvent Tank Farm Layout', 'Flame-proof Electrical Certificate', 'Vapour Recovery System']
      }
    ],
    fiscalIncentives: [
      {
        title: 'Zero Liquid Discharge (ZLD) Green Subsidy',
        benefit: '50% Capital Grant up to ₹ 5.0 Crores for ETP / ZLD effluent recycling installation.',
        authority: 'Environment & Climate Change Dept'
      },
      {
        title: 'Special Pharma Bulk Drug Park Incentives',
        benefit: 'Subsidized steam, CETP, and solvent recovery access with 100% SGST refund.',
        authority: 'MIDC & Directorate of Industries'
      }
    ]
  },
  {
    id: 'sec-food',
    name: 'Food Processing, Agro-Industries & Cold Chain',
    category: 'Food Processing & Agro',
    description: 'Fruit processing, dairy, grain milling, packaged food manufacturing, spices, cold storage, and agro-export facilities.',
    pollutionCategory: 'Orange Category',
    nodalDepartment: 'Agriculture & Food Processing Department',
    policyName: 'Maharashtra Agro-Industrial & Food Processing Policy 2024',
    preEstablishmentApprovals: [
      {
        name: 'Consent to Establish (CTE) for Agro-Food Processing',
        dept: 'Maharashtra Pollution Control Board',
        sla: '21 Days',
        fees: '₹ 15,000',
        mandatoryDocs: ['Organic Waste Disposal Scheme', 'BOD/COD Load Calculation', 'Site Plan']
      },
      {
        name: 'Cold Storage / Food Facility Building Plan Approval',
        dept: 'DISH & Local Planning Authority',
        sla: '15 Days',
        fees: '₹ 12,000',
        mandatoryDocs: ['Refrigeration System Diagram', 'Food Grade Floor Specs', 'Hygienic Flow Layout']
      }
    ],
    preOperationApprovals: [
      {
        name: 'FSSAI Central / State Manufacturing License',
        dept: 'Food Safety and Standards Authority of India (FDA)',
        sla: '20 Days',
        fees: '₹ 7,500',
        mandatoryDocs: ['Food Safety Management System (FSMS) Plan', 'Water Potability Report', 'Food Recall Procedure']
      },
      {
        name: 'Legal Metrology Packaging Commodity Registration',
        dept: 'Legal Metrology Department',
        sla: '15 Days',
        fees: '₹ 5,000',
        mandatoryDocs: ['Label Sample Artwork', 'Weight Stamping Certificate', 'Net Quantity Declaration']
      }
    ],
    fiscalIncentives: [
      {
        title: 'Agro-Processing Capital Subsidy (PMKSY / State Scheme)',
        benefit: '35% to 50% Capital Grant on machinery and cold chain infrastructure up to ₹ 10 Cr.',
        authority: 'Agriculture Department'
      },
      {
        title: 'Mandi / APMC Cess Waiver',
        benefit: '100% waiver on market committee cess on primary agricultural produce purchase.',
        authority: 'Marketing Board'
      }
    ]
  },
  {
    id: 'sec-it',
    name: 'Information Technology (IT), ITeS & Hyperscale Data Centers',
    category: 'IT & Data Centers',
    description: 'Software development, SaaS platforms, AI compute centers, enterprise data hubs, and BPO operations.',
    pollutionCategory: 'White Category',
    nodalDepartment: 'Information Technology & Industries Department',
    policyName: 'Maharashtra IT & ITES Policy 2023 & Data Center Policy',
    preEstablishmentApprovals: [
      {
        name: 'White Category Pollution Exemption Certificate',
        dept: 'Maharashtra Pollution Control Board',
        sla: '1 Day',
        fees: 'Nil (Self-Certification)',
        mandatoryDocs: ['Online Intimation Form', 'Power & DG Set Declaration']
      },
      {
        name: 'High Voltage Dual Power Grid Sanction (Dual Feeder)',
        dept: 'MSEDCL / MSETCL',
        sla: '15 Days',
        fees: '₹ 50,000',
        mandatoryDocs: ['Substation Load Study', 'Battery Storage Plan', 'Redundancy Architecture']
      }
    ],
    preOperationApprovals: [
      {
        name: 'Essential Services & 24x7 Continuous Operations Permission',
        dept: 'Labour Department',
        sla: '3 Days',
        fees: '₹ 2,000',
        mandatoryDocs: ['Women Night Shift Safety Protocol', 'Transport Arrangement Proof']
      }
    ],
    fiscalIncentives: [
      {
        title: 'Electricity Duty Exemption for 10 to 15 Years',
        benefit: '100% waiver of electricity duty and open access power surcharge.',
        authority: 'Energy & IT Dept'
      },
      {
        title: 'Additional FSI up to 100% with Zero Premium',
        benefit: 'Double permissible Floor Space Index (FSI) for registered IT parks and data centers.',
        authority: 'Urban Development Department'
      }
    ]
  }
];

interface SectoralApprovalsViewProps {
  profile: BusinessProfile;
  onApplyForService?: (serviceName: string) => void;
  onBackToDashboard?: () => void;
}

export const SectoralApprovalsView: React.FC<SectoralApprovalsViewProps> = ({
  profile,
  onApplyForService,
  onBackToDashboard
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('sec-auto');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentSector = SECTOR_DATA.find(s => s.id === selectedSectorId) || SECTOR_DATA[0];

  const filteredSectors = SECTOR_DATA.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>Maharashtra Sectoral Policy Matrix</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Departmental Compliance Directory</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" />
              <span>Sector-Specific Regulatory Approvals & Incentives</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
              Select any industrial sector to discover statutory clearances, SLA timelines, pollution classifications, and special state subsidies.
            </p>
          </div>
        </div>

        {/* Sector Selector Buttons Bar */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {SECTOR_DATA.map((sector) => (
            <button
              key={sector.id}
              onClick={() => setSelectedSectorId(sector.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                selectedSectorId === sector.id
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span>{sector.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Active Sector Overview Card */}
      <div className="bg-gradient-to-r from-[#0b1b3d] via-[#122b5e] to-[#0b1b3d] text-white rounded-2xl p-6 shadow-md border border-slate-700 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
              {currentSector.nodalDepartment}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {currentSector.name}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              {currentSector.description}
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
            <span className={`px-3 py-1 rounded-xl text-xs font-black border ${
              currentSector.pollutionCategory.includes('Red') 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : currentSector.pollutionCategory.includes('Orange')
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : currentSector.pollutionCategory.includes('Green')
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
            }`}>
              {currentSector.pollutionCategory}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Policy: {currentSector.policyName}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pre-Establishment Clearances */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Stage 1: Pre-Establishment Approvals ({currentSector.preEstablishmentApprovals.length})</span>
            </h3>
            <p className="text-xs text-slate-500">Mandatory approvals required before commencing construction or installation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentSector.preEstablishmentApprovals.map((app, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-extrabold text-xs text-slate-900 leading-snug">{app.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0 font-mono">
                  {app.sla} SLA
                </span>
              </div>

              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div><strong>Department:</strong> {app.dept}</div>
                <div><strong>Statutory Fee:</strong> {app.fees}</div>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mandatory Documents:</span>
                <div className="flex flex-wrap gap-1">
                  {app.mandatoryDocs.map((doc, docIdx) => (
                    <span key={docIdx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-700 font-medium">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Pre-Operation Clearances */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Stage 2: Pre-Operation Approvals ({currentSector.preOperationApprovals.length})</span>
            </h3>
            <p className="text-xs text-slate-500">Mandatory approvals required before commercial production or trial run.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentSector.preOperationApprovals.map((app, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-extrabold text-xs text-slate-900 leading-snug">{app.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0 font-mono">
                  {app.sla} SLA
                </span>
              </div>

              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div><strong>Department:</strong> {app.dept}</div>
                <div><strong>Statutory Fee:</strong> {app.fees}</div>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mandatory Documents:</span>
                <div className="flex flex-wrap gap-1">
                  {app.mandatoryDocs.map((doc, docIdx) => (
                    <span key={docIdx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-700 font-medium">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Sector Fiscal Subsidies & Benefits */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span>Sectoral Incentives & Government Subsidies</span>
          </h3>
          <p className="text-xs text-slate-500">Applicable fiscal packages under Government of Maharashtra Industrial Policy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {currentSector.fiscalIncentives.map((inc, i) => (
            <div key={i} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{inc.authority}</span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">{inc.title}</h4>
              <p className="text-[11px] text-slate-700 leading-relaxed">{inc.benefit}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
