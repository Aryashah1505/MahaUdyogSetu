import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvestHeader, InvestFooter } from './InvestHeader';
import { BusinessProfile } from '../../types';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Layers, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Plus, 
  ChevronRight,
  Info,
  CheckSquare
} from 'lucide-react';

interface KnowYourApprovalsPageProps {
  profile?: BusinessProfile;
}

export const KnowYourApprovalsPage: React.FC<KnowYourApprovalsPageProps> = ({ profile }) => {
  const navigate = useNavigate();

  // 4-Step Wizard State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // STEP 1 — INDUSTRY DETAILS
  const [sector, setSector] = useState(profile?.sector || 'Engineering & Heavy Manufacturing');
  const [subSector, setSubSector] = useState('Automotive Precision Components & CNC Tooling');
  const [natureOfBiz, setNatureOfBiz] = useState<'Manufacturing' | 'Service / IT' | 'Agro Processing' | 'Infrastructure'>('Manufacturing');
  const [investmentType, setInvestmentType] = useState<'New Investment (Greenfield)' | 'Expansion (Brownfield)' | 'Existing Unit Regularization'>('New Investment (Greenfield)');

  // STEP 2 — LOCATION
  const [district, setDistrict] = useState(profile?.district || 'Nashik');
  const [taluka, setTaluka] = useState(profile?.taluka || 'Ambad');
  const [industrialArea, setIndustrialArea] = useState('Ambad MIDC Sector C');
  const [midcType, setMidcType] = useState<'MIDC Industrial Area' | 'Non-MIDC Private Land'>('MIDC Industrial Area');
  const [areaCategory, setAreaCategory] = useState<'Urban / Municipal' | 'Rural / Gram Panchayat'>('Urban / Municipal');

  // STEP 3 — INVESTMENT DETAILS
  const [investmentCr, setInvestmentCr] = useState(18.5);
  const [landReqAcres, setLandReqAcres] = useState('2.5 Acres');
  const [builtUpSqFt, setBuiltUpSqFt] = useState('42,000 Sq.Ft');
  const [numEmployees, setNumEmployees] = useState('85 Workers');
  const [powerLoadReq, setPowerLoadReq] = useState('350 kVA (HT Connection)');
  const [waterReqKld, setWaterReqKld] = useState('15 KLD');

  // STEP 4 — PROJECT STAGE
  const [projectStage, setProjectStage] = useState<'Planning' | 'Land Acquisition' | 'Construction' | 'Installation' | 'Production Ready' | 'Expansion'>('Planning');

  // Added approvals state
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [regulatoryResults, setRegulatoryResults] = useState<any[]>([]);
  const [analysisDisclaimer, setAnalysisDisclaimer] = useState<string>('');

  // Fetch analyzed approvals from backend regulatory engine
  const handleGenerateRoadmap = async () => {
    setAnalyzing(true);
    setCurrentStep(5);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("/api/regulatory/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          industry: sector,
          subSector: subSector,
          district: district,
          taluka: taluka,
          midcArea: industrialArea,
          isMIDC: midcType === 'MIDC Industrial Area',
          investment: investmentCr,
          workforce: parseInt(numEmployees) || 85,
          connectedPower: parseInt(powerLoadReq) || 350,
          projectStage: projectStage,
          natureOfBiz: natureOfBiz,
          projectType: investmentType,
          builtUpSqFt: parseInt(builtUpSqFt.replace(/\D/g, '')) || 42000
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRegulatoryResults(data.approvals || []);
        setAnalysisDisclaimer(data.disclaimer || 'Preliminary Guidance: Requirements may vary by project and authority. Verify the latest requirements with the relevant official authority.');
      }
    } catch (err) {
      console.warn("Regulatory analyze API fallback:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Group regulatory results by category or fallback to standard structure
  const groupedApprovals = React.useMemo(() => {
    if (regulatoryResults && regulatoryResults.length > 0) {
      const groups: Record<string, any[]> = {};
      regulatoryResults.forEach((app: any) => {
        const cat = app.category || 'Statutory Approvals & NOCs';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push({
          id: app.id || app.code,
          code: app.code,
          name: app.name,
          department: app.department,
          whyRequired: app.reason,
          docs: Array.isArray(app.documents) ? app.documents.join(', ') : app.documents,
          stage: app.applicability === 'Mandatory' ? 'Mandatory Requirement' : app.applicability,
          sla: app.timeline || '21 Days',
          fee: app.fee || 'Variable / As per statute',
          applicability: app.applicability,
          officialUrl: app.officialUrl,
          source: app.source,
          verificationStatus: app.verificationStatus
        });
      });
      return Object.entries(groups).map(([category, items]) => ({ category, items }));
    }

    // Default static fallback roadmap if network offline
    return [
      {
        category: 'Pre-Establishment Approvals',
        items: [
          {
            id: 'app-kya-1',
            code: 'MPCB-CTE',
            name: 'Consent to Establish (CTE) under Water & Air Acts',
            department: 'Maharashtra Pollution Control Board (MPCB)',
            whyRequired: 'Statutory environmental assessment prior to starting civil construction or machine foundation works.',
            docs: 'Site Layout Plan, Project Report, EIA Scrutiny, Water Balance Diagram, Capital Investment CA Certificate',
            stage: 'Pre-Establishment',
            sla: '21 Days',
            fee: 'Variable based on Capital Investment Slab',
            applicability: 'Mandatory',
            verificationStatus: 'Verified'
          },
          {
            id: 'app-kya-2',
            code: 'DISH-FACT',
            name: 'Factory Architectural Building Plan Approval',
            department: 'Directorate of Industrial Safety & Health (DISH)',
            whyRequired: 'Statutory clearance of factory layout drawings, worker exits, machine clearances and ventilation.',
            docs: 'AutoCAD Blueprint (Form 1), Structural Stability Certificate, Flow Process Chart',
            stage: 'Pre-Establishment',
            sla: '20 Days',
            fee: '₹ 5,000 to ₹ 25,000',
            applicability: 'Mandatory',
            verificationStatus: 'Verified'
          },
          {
            id: 'app-kya-3',
            code: 'FIRE-NOC',
            name: 'Provisional Fire Safety NOC & Building Clearance',
            department: 'Maharashtra Fire Services / MIDC Fire Dept',
            whyRequired: 'Mandatory fire-fighting infrastructure layout approval (hydrants, sprinkler pipes, smoke detectors).',
            docs: 'Architectural Fire Plans, NBC 2016 Compliance Undertaking, Water Tank Capacity Proof',
            stage: 'Pre-Establishment',
            sla: '15 Days',
            fee: '₹ 10,000 to ₹ 20,000',
            applicability: 'Mandatory',
            verificationStatus: 'Verified'
          }
        ]
      },
      {
        category: 'Electricity & Utilities',
        items: [
          {
            id: 'app-kya-4',
            code: 'MSEDCL-PWR',
            name: 'Sanction and Release of Industrial Power Load (350 kVA HT)',
            department: 'Energy Department (MSEDCL / Mahavitaran)',
            whyRequired: 'Dedicated feeder line allocation and industrial HT metering substation commissioning.',
            docs: 'Connected Load List, MIDC Allotment Letter, Electrical Contractor Test Report',
            stage: 'Installation',
            sla: '15 Days',
            fee: 'As per MERC Tariff',
            applicability: 'Mandatory',
            verificationStatus: 'Verified'
          }
        ]
      }
    ];
  }, [regulatoryResults]);

  const approvalRoadmap = groupedApprovals;

  const handleToggleAddPlan = (id: string, name: string) => {
    setAddedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddAllToPlan = () => {
    navigate('/invest/planner');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InvestHeader 
        title="Know Your Approvals"
        subtitle="Identify the approvals required for your proposed investment."
        profile={profile}
        activePath="/invest/know-your-approvals"
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/invest')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Invest in Maharashtra</span>
          </button>

          {currentStep <= 4 && (
            <div className="text-xs text-slate-500 font-semibold">
              Step <span className="text-blue-600 font-bold">{currentStep}</span> of 4: {
                currentStep === 1 ? 'Industry Details' :
                currentStep === 2 ? 'Location Parameters' :
                currentStep === 3 ? 'Investment Details' : 'Project Stage'
              }
            </div>
          )}
        </div>

        {/* Wizard Progress Bar */}
        {currentStep <= 4 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
              
              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                currentStep === 1 ? 'bg-blue-50 text-blue-700' : currentStep > 1 ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 1 ? 'bg-blue-600 text-white' : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className="hidden sm:inline">Industry Details</span>
                <span className="sm:hidden text-[10px]">Industry</span>
              </div>

              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                currentStep === 2 ? 'bg-blue-50 text-blue-700' : currentStep > 2 ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 2 ? 'bg-blue-600 text-white' : currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className="hidden sm:inline">Location</span>
                <span className="sm:hidden text-[10px]">Location</span>
              </div>

              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                currentStep === 3 ? 'bg-blue-50 text-blue-700' : currentStep > 3 ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 3 ? 'bg-blue-600 text-white' : currentStep > 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {currentStep > 3 ? '✓' : '3'}
                </div>
                <span className="hidden sm:inline">Investment Scale</span>
                <span className="sm:hidden text-[10px]">Scale</span>
              </div>

              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                currentStep === 4 ? 'bg-blue-50 text-blue-700' : 'text-slate-400'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 4 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  4
                </div>
                <span className="hidden sm:inline">Project Stage</span>
                <span className="sm:hidden text-[10px]">Stage</span>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 1 — INDUSTRY DETAILS
           ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-6 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Step 1: Activity Classification</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Industry & Activity Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select your industry vertical to map relevant environmental consent tiers (Red/Orange/Green) and factory act mandates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Industry Sector <span className="text-red-500">*</span>
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Engineering & Heavy Manufacturing">Engineering & Heavy Manufacturing</option>
                  <option value="Automobile & Auto Ancillaries">Automobile & Auto Ancillaries</option>
                  <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                  <option value="Pharmaceuticals & Biotechnology">Pharmaceuticals & Biotechnology</option>
                  <option value="Food Processing & Agro Industries">Food Processing & Agro Industries</option>
                  <option value="IT / ITES & Electronics">IT / ITES & Electronics</option>
                  <option value="Textiles & Apparel">Textiles & Apparel</option>
                  <option value="Renewable Energy & Power">Renewable Energy & Power</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Sub-Sector / Line of Activity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subSector}
                  onChange={(e) => setSubSector(e.target.value)}
                  placeholder="e.g. Automotive CNC Tooling & Precision Machining"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Nature of Business <span className="text-red-500">*</span>
                </label>
                <select
                  value={natureOfBiz}
                  onChange={(e: any) => setNatureOfBiz(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Manufacturing">Manufacturing & Assembly</option>
                  <option value="Service / IT">Service / IT / ITES</option>
                  <option value="Agro Processing">Agro Processing & Cold Storage</option>
                  <option value="Infrastructure">Logistics / Warehousing / Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Investment Nature <span className="text-red-500">*</span>
                </label>
                <select
                  value={investmentType}
                  onChange={(e: any) => setInvestmentType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="New Investment (Greenfield)">New Investment (Greenfield)</option>
                  <option value="Expansion (Brownfield)">Expansion (Brownfield)</option>
                  <option value="Existing Unit Regularization">Existing Unit Regularization</option>
                </select>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/invest')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Proceed to Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2 — LOCATION
           ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-6 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Step 2: Geographical Jurisdiction</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Location & Planning Authority
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                MIDC areas benefit from single-point SPA (Special Planning Authority) building sanctions and dedicated water networks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Nashik">Nashik</option>
                  <option value="Pune">Pune</option>
                  <option value="Thane">Thane</option>
                  <option value="Raigad">Raigad</option>
                  <option value="Aurangabad (Chhatrapati Sambhajinagar)">Aurangabad (Chhatrapati Sambhajinagar)</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Kolhapur">Kolhapur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Taluka <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  MIDC vs Non-MIDC Area <span className="text-red-500">*</span>
                </label>
                <select
                  value={midcType}
                  onChange={(e: any) => setMidcType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="MIDC Industrial Area">MIDC Industrial Area (Special Planning Authority)</option>
                  <option value="Non-MIDC Private Land">Non-MIDC Private Land / NA Converted</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Urban / Rural Zone <span className="text-red-500">*</span>
                </label>
                <select
                  value={areaCategory}
                  onChange={(e: any) => setAreaCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Urban / Municipal">Urban / Municipal Corporation Area</option>
                  <option value="Rural / Gram Panchayat">Rural / Gram Panchayat Jurisdiction</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Proposed Industrial Estate / Park Name
                </label>
                <input
                  type="text"
                  value={industrialArea}
                  onChange={(e) => setIndustrialArea(e.target.value)}
                  placeholder="e.g. Ambad MIDC Sector C, Chakan Industrial Park Phase 2"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Step 1</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Proceed to Investment Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3 — INVESTMENT DETAILS
           ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-6 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Step 3: Utility & Resource Sizing</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Investment Scale & Utility Requirements
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Resource commitments determine statutory DISH workforce compliance and MSEDCL power feeder sanction tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Proposed Capital Investment (in ₹ Crores) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={investmentCr}
                  onChange={(e) => setInvestmentCr(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Land Requirement <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={landReqAcres}
                  onChange={(e) => setLandReqAcres(e.target.value)}
                  placeholder="e.g. 2.5 Acres or 10,000 Sq.M"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Proposed Built-up Area
                </label>
                <input
                  type="text"
                  value={builtUpSqFt}
                  onChange={(e) => setBuiltUpSqFt(e.target.value)}
                  placeholder="e.g. 42,000 Sq.Ft"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Expected Workforce / Employment
                </label>
                <input
                  type="text"
                  value={numEmployees}
                  onChange={(e) => setNumEmployees(e.target.value)}
                  placeholder="e.g. 85 Workers"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Power Connection Requirement
                </label>
                <input
                  type="text"
                  value={powerLoadReq}
                  onChange={(e) => setPowerLoadReq(e.target.value)}
                  placeholder="e.g. 350 kVA (HT Connection)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Water Requirement
                </label>
                <input
                  type="text"
                  value={waterReqKld}
                  onChange={(e) => setWaterReqKld(e.target.value)}
                  placeholder="e.g. 15 KLD"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Step 2</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Proceed to Project Stage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4 — PROJECT STAGE
           ========================================================================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-6 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Step 4: Current Execution Phase</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Current Project Lifecycle Stage
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Selecting your exact project readiness stage filters the most immediate approvals required for execution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {([
                { id: 'Planning', title: 'Planning & Feasibility', desc: 'Concept stage, DPR preparation and site evaluation' },
                { id: 'Land Acquisition', title: 'Land Acquisition', desc: 'MIDC plot allotment or private land purchase underway' },
                { id: 'Construction', title: 'Civil Construction', desc: 'Building factory sheds, foundations & structural works' },
                { id: 'Installation', title: 'Plant & Machinery Installation', desc: 'Erecting machinery, electrical transformers and utilities' },
                { id: 'Production Ready', title: 'Production Ready', desc: 'Commissioning trials and commercial rollout' },
                { id: 'Expansion', title: 'Expansion / Modernization', desc: 'Adding new production bays or scaling capacity' }
              ] as const).map(stage => (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setProjectStage(stage.id)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    projectStage === stage.id
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-100 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-sm font-bold">{stage.title}</strong>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      projectStage === stage.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    }`}>
                      {projectStage === stage.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {stage.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Step 3</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateRoadmap}
                disabled={analyzing}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-70"
              >
                <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                <span>{analyzing ? 'Evaluating Regulatory Knowledge Base...' : 'Generate Approval Roadmap'}</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5 — PRELIMINARY APPROVAL ROADMAP (OUTPUT)
           ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Disclaimer & Summary Hero */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Preliminary Regulatory Guidance</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Your Preliminary Approval Roadmap
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl">
                    Tailored for: <strong className="text-white">{sector}</strong> in <strong className="text-white">{district}</strong> ({investmentType}, ₹{investmentCr} Cr investment).
                  </p>
                  {analysisDisclaimer && (
                    <p className="text-[11px] text-blue-200/80 mt-2 italic">
                      {analysisDisclaimer}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20"
                  >
                    Edit Parameters
                  </button>

                  <button
                    onClick={handleAddAllToPlan}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Add to Investment Plan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* VISUAL DEPENDENCY TIMELINE */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-4">
                Sequential Project Execution Lifecycle
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-[10px] font-bold text-blue-600 block">Phase 1</span>
                  <strong className="text-slate-900 text-xs">Business Idea</strong>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-[10px] font-bold text-blue-600 block">Phase 2</span>
                  <strong className="text-slate-900 text-xs">Land & Location</strong>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 block">Phase 3</span>
                  <strong className="text-emerald-950 text-xs font-black">Pre-Establishment</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block">Phase 4</span>
                  <strong className="text-slate-700 text-xs">Construction</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block">Phase 5</span>
                  <strong className="text-slate-700 text-xs">Pre-Operation</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block">Phase 6</span>
                  <strong className="text-slate-700 text-xs">Production</strong>
                </div>
              </div>
            </div>

            {/* CATEGORIZED APPROVALS CARDS */}
            <div className="space-y-6">
              {approvalRoadmap.map((section, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>{section.category} ({section.items.length})</span>
                  </h3>

                  <div className="space-y-3">
                    {section.items.map(app => {
                      const isAdded = addedItems[app.id];
                      return (
                        <div 
                          key={app.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-blue-300 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                  app.applicability === 'Mandatory'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : app.applicability === 'Conditional'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                  {app.applicability ? `${app.applicability} Approval` : app.stage}
                                </span>
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                  {app.department}
                                </span>
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                                  Timeline: {app.sla}
                                </span>
                                {app.verificationStatus && (
                                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                    app.verificationStatus === 'Verified'
                                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                      : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                  }`}>
                                    {app.verificationStatus === 'Verified' ? '✓ Verified Source' : '⚠ Demo / Pending Verification'}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-base font-bold text-slate-900">
                                {app.name}
                              </h4>

                              <p className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-700">Why required:</strong> {app.whyRequired}
                              </p>

                              {app.source && (
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                                  <span className="font-semibold text-slate-600">Source:</span>
                                  <span>{app.source.title || 'Official Maharashtra Single Window'}</span>
                                  {app.officialUrl && (
                                    <a
                                      href={app.officialUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                                    >
                                      <span>Official Portal</span>
                                      <ChevronRight className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              )}

                              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="font-semibold text-slate-700 block mb-0.5">Mandatory Key Documents:</span>
                                {app.docs}
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 w-full sm:w-auto justify-end">
                              <button
                                onClick={() => handleToggleAddPlan(app.id, app.name)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isAdded
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-white border border-slate-200 hover:border-blue-300 text-blue-700'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Added to Plan</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add to My Plan</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Statutory Disclaimer Box */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Statutory Disclaimer — Preliminary Guidance Only:</strong>
                This roadmap is a system-generated indicative guide based on preliminary inputs. Final legal clearances, inspection terms, and statutory conditions are determined by the respective governing authorities under Maharashtra state acts upon formal Common Application Form (CAF) scrutiny.
              </div>
            </div>

            {/* Bottom Floating Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                onClick={() => navigate('/invest/incentive-calculator')}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Explore Incentive Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/invest/planner')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>View Full Investment Plan</span>
                <CheckSquare className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </main>

      <InvestFooter />
    </div>
  );
};
