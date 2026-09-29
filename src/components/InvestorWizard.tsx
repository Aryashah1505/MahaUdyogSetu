import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Users, 
  Zap, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  RotateCcw,
  Flame,
  AlertTriangle,
  Award
} from 'lucide-react';
import { BusinessProfile, ApprovalItem, IncentiveScheme } from '../types';
import { generateAllPotentialApprovals, getMatchedSchemes, calculatePollutionCategory } from '../data/regulatoryEngine';

interface InvestorWizardProps {
  profile: BusinessProfile;
  onUpdateProfile: (newProfile: BusinessProfile) => void;
  onApplyForService?: (serviceCode: string) => void;
  onBackToDashboard?: () => void;
}

export const InvestorWizard: React.FC<InvestorWizardProps> = ({
  profile,
  onUpdateProfile,
  onApplyForService,
  onBackToDashboard
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [wizardData, setWizardData] = useState<BusinessProfile>({ ...profile });
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Compute results dynamically based on wizard inputs
  const evaluationResults = useMemo(() => {
    const approvals = generateAllPotentialApprovals(wizardData);
    const schemes = getMatchedSchemes(wizardData);
    const pollutionCategory = calculatePollutionCategory(
      wizardData.sector,
      wizardData.handlesHazardous,
      wizardData.connectedPowerKw,
      wizardData.investmentCrores
    );
    return { approvals, schemes, pollutionCategory };
  }, [wizardData]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(s => s + 1);
    } else {
      setIsEvaluating(true);
      setTimeout(() => {
        setIsEvaluating(false);
        setCurrentStep(6);
        onUpdateProfile(wizardData);
      }, 800);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleReset = () => {
    setWizardData({ ...profile });
    setCurrentStep(1);
  };

  const totalSteps = 5;

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#004d40] via-[#00695c] to-[#004d40] text-white p-5 sm:p-6 rounded-2xl border border-teal-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/20 text-teal-200 border border-teal-400/40 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-300" />
              <span>Smart Statutory Clearance Engine</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
              MahaUdyogSetu • AI Guided
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Investor Clearance & Incentive Wizard</span>
          </h1>
          <p className="text-xs text-teal-100 max-w-xl">
            Step-by-step diagnostic to determine exact mandatory licences, environmental clearances, statutory approvals, and fiscal subsidies for your Maharashtra unit.
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

      {/* 2. Step Progress Bar (Only during steps 1-5) */}
      {currentStep <= 5 && (
        <div className="bg-white rounded-xl border border-slate-300/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Step {currentStep} of {totalSteps}: {
              currentStep === 1 ? 'Industry & Activity' :
              currentStep === 2 ? 'Location & Land' :
              currentStep === 3 ? 'Investment & Financials' :
              currentStep === 4 ? 'Workforce & Factory Thresholds' :
              'Power, Boiler & Environmental Parameters'
            }</span>
            <span className="text-blue-600 font-extrabold">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. Wizard Content Area */}
      <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs">
        
        {/* STEP 1: INDUSTRY & ACTIVITY */}
        {currentStep === 1 && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-slate-900">Step 1: Industrial Sector & Activity</h3>
              <p className="text-xs text-slate-500">Select your manufacturing domain to evaluate pollution categorization and applicable acts.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Industrial Sector *</label>
                <select
                  value={wizardData.sector}
                  onChange={(e) => setWizardData({ ...wizardData, sector: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Engineering & Heavy Manufacturing">Engineering & Heavy Manufacturing</option>
                  <option value="Manufacturing (General)">Manufacturing (General)</option>
                  <option value="Automotive & EV Components">Automotive & EV Components</option>
                  <option value="Pharmaceuticals & APIs">Pharmaceuticals & APIs</option>
                  <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                  <option value="Food Processing & Beverages">Food Processing & Beverages</option>
                  <option value="Textiles & Apparel">Textiles & Apparel</option>
                  <option value="Electronics & IT Hardware">Electronics & IT Hardware</option>
                  <option value="Logistics & Warehousing">Logistics & Warehousing</option>
                  <option value="Agriculture / Agro Processing">Agriculture / Agro Processing</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Project Stage *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Pre-Establishment', 'Pre-Operation', 'Expansion'] as const).map(stage => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => setWizardData({ ...wizardData, stage })}
                      className={`p-3 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                        wizardData.stage === stage 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Activity / Manufacturing Description</label>
                <textarea
                  rows={2}
                  value={wizardData.activityDescription || ''}
                  onChange={(e) => setWizardData({ ...wizardData, activityDescription: e.target.value })}
                  placeholder="e.g. Fabrication of CNC machined precision components for automotive gears..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION & LAND */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-slate-900">Step 2: Location & Land Tenure</h3>
              <p className="text-xs text-slate-500">MIDC vs Non-MIDC location determines whether Town Planning or MIDC SPA applies.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">District in Maharashtra *</label>
                  <select
                    value={wizardData.district}
                    onChange={(e) => setWizardData({ ...wizardData, district: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    {['Nashik', 'Pune', 'Thane', 'Aurangabad (Chhatrapati Sambhaji Nagar)', 'Nagpur', 'Kolhapur', 'Raigad', 'Solapur', 'Satara', 'Ahmednagar'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Taluka / Industrial Area</label>
                  <input
                    type="text"
                    value={wizardData.taluka || ''}
                    onChange={(e) => setWizardData({ ...wizardData, taluka: e.target.value })}
                    placeholder="e.g. Ambad / Chakan / Butibori"
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Is the Unit in an MIDC Industrial Area? *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWizardData({ ...wizardData, isMIDC: true, landType: 'Industrial Park (Allotted)' })}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                      wizardData.isMIDC 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Yes (MIDC Allotted Plot)
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardData({ ...wizardData, isMIDC: false, landType: 'Agricultural (Requires CLU)' })}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                      !wizardData.isMIDC 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    No (Private / Agricultural Land)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Plot / Survey Number</label>
                <input
                  type="text"
                  value={wizardData.plotNumber || ''}
                  onChange={(e) => setWizardData({ ...wizardData, plotNumber: e.target.value })}
                  placeholder="e.g. Plot No. W-42, MIDC Industrial Area"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INVESTMENT & FINANCIALS */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-slate-900">Step 3: Capital Investment & Fiscal Thresholds</h3>
              <p className="text-xs text-slate-500">Determines MSME category, Consent fees, and eligibility under Package Scheme of Incentives (PSI).</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Proposed Capital Investment in Plant & Machinery (₹ in Crores) *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={wizardData.investmentCrores}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 1;
                      const scale = val <= 1 ? 'Micro' : val <= 10 ? 'Small' : val <= 50 ? 'Medium' : 'Large';
                      setWizardData({ ...wizardData, investmentCrores: val, scale });
                    }}
                    className="w-48 p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                  />
                  <span className="font-extrabold text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                    MSME Classification: {wizardData.scale} Enterprise
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Built-Up Factory Construction Area (in Sq. Ft)</label>
                <input
                  type="number"
                  value={wizardData.builtUpAreaSqFt || 25000}
                  onChange={(e) => setWizardData({ ...wizardData, builtUpAreaSqFt: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
                <p className="text-[10px] text-slate-500 mt-1">Built-up area &gt; 215,278 sq.ft (20,000 sq.m) triggers Environmental Clearance (EC) requirement.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: WORKFORCE & LABOUR */}
        {currentStep === 4 && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-slate-900">Step 4: Workforce & Safety Thresholds</h3>
              <p className="text-xs text-slate-500">Workforce &gt; 10 triggers the Factories Act 1948; Contract labour &gt; 20 triggers Principal Employer registration.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Total Direct Workforce (Employees) *</label>
                <input
                  type="number"
                  min="1"
                  value={wizardData.workforce}
                  onChange={(e) => setWizardData({ ...wizardData, workforce: parseInt(e.target.value) || 1 })}
                  className="w-48 p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                />
                <div className="mt-1 text-[11px] text-slate-600">
                  {wizardData.workforce >= 10 ? (
                    <span className="text-emerald-700 font-bold">✓ Factories Act 1948 & DISH Plan Approval Mandatory (≥ 10 workers)</span>
                  ) : (
                    <span className="text-amber-700 font-bold">⚠️ Shops & Establishments Registration (Under 10 workers)</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Contract / Manpower Workers Deployable</label>
                <input
                  type="number"
                  min="0"
                  value={wizardData.contractWorkersCount || 0}
                  onChange={(e) => setWizardData({ ...wizardData, contractWorkersCount: parseInt(e.target.value) || 0 })}
                  className="w-48 p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: POWER, BOILER & HAZARDS */}
        {currentStep === 5 && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-slate-900">Step 5: Power, Boilers & Environmental Parameters</h3>
              <p className="text-xs text-slate-500">Evaluates MSEDCL load category, Steam Boilers Act, and hazardous material authorization.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Connected Electric Power Demand (in kW / kVA) *</label>
                <input
                  type="number"
                  min="5"
                  value={wizardData.connectedPowerKw}
                  onChange={(e) => setWizardData({ ...wizardData, connectedPowerKw: parseInt(e.target.value) || 5 })}
                  className="w-48 p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                />
                <p className="text-[10px] text-slate-500 mt-1">Load &gt; 65 kW qualifies for High Tension (HT) industrial tariff and electrical inspectorate clearance.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={wizardData.handlesHazardous}
                      onChange={(e) => setWizardData({ ...wizardData, handlesHazardous: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Handles Hazardous Materials?</span>
                  </label>
                  <p className="text-[10px] text-slate-500 mt-1">Requires MPCB Hazardous Waste Auth & DISH MAH Rule 3-A scrutiny.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={wizardData.hasBoiler || false}
                      onChange={(e) => setWizardData({ ...wizardData, hasBoiler: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Utilizes Steam Boiler / Pipeline?</span>
                  </label>
                  <p className="text-[10px] text-slate-500 mt-1">Requires registration under Indian Boilers Act 1923.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: INTELLIGENCE REPORT & APPLICABLE APPROVALS */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* Header summary of evaluation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                  Diagnostic Generated
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-1">
                  Statutory Clearance Roadmap for {wizardData.name || 'Your Enterprise'}
                </h2>
                <p className="text-xs text-slate-500">
                  {wizardData.sector} • ₹ {wizardData.investmentCrores} Cr ({wizardData.scale}) • {wizardData.district}, Maharashtra
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-black border ${
                  evaluationResults.pollutionCategory.includes('Red') ? 'bg-rose-50 text-rose-800 border-rose-200' :
                  evaluationResults.pollutionCategory.includes('Orange') ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  Pollution: {evaluationResults.pollutionCategory}
                </span>

                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-run Wizard</span>
                </button>
              </div>
            </div>

            {/* Approvals Grid */}
            <div className="space-y-3">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Mandatory Statutory Licences & Clearances ({evaluationResults.approvals.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluationResults.approvals.map((app) => (
                  <div 
                    key={app.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between gap-3 group shadow-2xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                          {app.department}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 font-mono">
                          SLA: {app.slaDays} Days
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                        {app.name}
                      </h4>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 font-medium">
                        <span>Statutory Fee: <strong>₹ {app.feeAmount?.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>Risk: <strong className="text-slate-800">{app.riskTier}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-500">
                        {app.requiredDocs.length} Mandatory Proofs
                      </span>

                      {onApplyForService && (
                        <button
                          onClick={() => onApplyForService(app.code)}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                        >
                          <span>Apply via MAITRI</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incentive Schemes Section */}
            {evaluationResults.schemes.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Eligible Fiscal Subsidies & Schemes ({evaluationResults.schemes.length})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {evaluationResults.schemes.map((sch) => (
                    <div key={sch.id} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-emerald-950">{sch.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800">
                          {sch.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-900 leading-relaxed">{sch.coverage}</p>
                      <div className="text-[11px] font-bold text-emerald-800">
                        Benefit: {sch.financialBenefit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Wizard Footer Controls (Steps 1 to 5) */}
        {currentStep <= 5 && (
          <div className="flex items-center justify-between pt-5 border-t border-slate-200 mt-5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isEvaluating}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
            >
              {isEvaluating ? (
                <span>Evaluating Engine...</span>
              ) : currentStep === 5 ? (
                <>
                  <span>Generate Diagnostic Report</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
