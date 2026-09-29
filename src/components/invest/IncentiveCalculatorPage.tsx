import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvestHeader, InvestFooter } from './InvestHeader';
import { BusinessProfile } from '../../types';
import { 
  Calculator, 
  IndianRupee, 
  MapPin, 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Info, 
  CheckSquare, 
  TrendingUp,
  Percent,
  Zap,
  Briefcase
} from 'lucide-react';

interface IncentiveCalculatorPageProps {
  profile?: BusinessProfile;
}

export const IncentiveCalculatorPage: React.FC<IncentiveCalculatorPageProps> = ({ profile }) => {
  const navigate = useNavigate();

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // STEP 1: INDUSTRY SECTOR
  const [sector, setSector] = useState(profile?.sector || 'Engineering & Heavy Manufacturing');
  const [subSector, setSubSector] = useState('Automotive Precision Components & CNC Tooling');

  // STEP 2: LOCATION & DISTRICT TALUKA
  const [district, setDistrict] = useState(profile?.district || 'Nashik');
  const [locationType, setLocationType] = useState<'Developing Taluka (Group D)' | 'Less Developed (Group D+)' | 'Underdeveloped (Group C)' | 'Developed (Group A/B)'>('Developing Taluka (Group D)');
  const [midcType, setMidcType] = useState<'MIDC Industrial Area' | 'Non-MIDC Private Land'>('MIDC Industrial Area');

  // STEP 3: INVESTMENT & EMPLOYMENT
  const [totalInvestmentCr, setTotalInvestmentCr] = useState(18.5);
  const [fciAmountCr, setFciAmountCr] = useState(14.0); // Eligible Fixed Capital Investment
  const [employmentGenerated, setEmploymentGenerated] = useState(85);

  // STEP 4: ENTERPRISE SIZE & PROJECT TYPE
  const [enterpriseSize, setEnterpriseSize] = useState<'Medium Enterprise' | 'Small Enterprise' | 'Micro Enterprise' | 'Large / Mega Project'>('Medium Enterprise');
  const [projectNature, setProjectNature] = useState<'New Unit (Greenfield)' | 'Expansion / Modernization (Brownfield)'>('New Unit (Greenfield)');

  // STEP 5: SPECIAL CATEGORY
  const [specialCategory, setSpecialCategory] = useState<'Standard General Category' | 'Women Entrepreneurs (100% Owned)' | 'SC/ST Entrepreneurs' | 'Green / Zero Effluent Discharge Unit'>('Standard General Category');

  // Calculated estimates
  const ipsSubsidyEstimate = (fciAmountCr * 0.65).toFixed(2); // 65% of FCI via SGST refund
  const electricityDutyBenefit = (0.09 * totalInvestmentCr).toFixed(2); // Est electricity duty relief
  const interestSubvention = (fciAmountCr * 0.05 * 5).toFixed(2); // 5% p.a. for 5 years
  const totalIncentiveCap = (fciAmountCr * 0.85).toFixed(2);

  const handleDownloadSummary = () => {
    const text = `========================================================
GOVERNMENT OF MAHARASHTRA • MAHAUDYOGSETU
INDICATIVE STATE INCENTIVE ELIGIBILITY ESTIMATE
Under Maharashtra Package Scheme of Incentives (PSI 2019)
========================================================

Project Summary:
Sector:                 ${sector}
Location / District:    ${district} (${locationType})
MIDC Classification:    ${midcType}
Total Project Outlay:   ₹ ${totalInvestmentCr} Crores
Eligible FCI:           ₹ ${fciAmountCr} Crores
Direct Employment:      ${employmentGenerated} Personnel
Enterprise Scale:       ${enterpriseSize}

--------------------------------------------------------
INDICATIVE INCENTIVE ESTIMATES (PSI 2019):
--------------------------------------------------------
1. Industrial Promotion Subsidy (IPS):    ₹ ${ipsSubsidyEstimate} Crores (Gross SGST Refund for 7 Years)
2. Electricity Duty Exemption:           100% Exemption for 7 Years (~₹ ${electricityDutyBenefit} Cr benefit)
3. Power Tariff Subsidy:                 ₹ 1.00 per unit reduction for 3 Years
4. Interest Subvention (MSME):           5% p.a. on term loans (~₹ ${interestSubvention} Cr)
5. Stamp Duty Exemption:                 100% Waiver on Land / Shed Lease Agreement

Estimated Total Cumulative Benefit Cap:  ₹ ${totalIncentiveCap} Crores

========================================================
IMPORTANT STATUTORY NOTICE:
This summary is a computer-generated indicative estimate. Final eligibility, duration and disbursement are subject to formal Eligibility Certificate (EC) scrutiny by the Directorate of Industries under PSI 2019 / Maharashtra Industrial Policy 2024.
========================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Maharashtra_Incentive_Summary_${district}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InvestHeader 
        title="Incentive Calculator"
        subtitle="Get an indicative estimate of potential incentives for your investment."
        profile={profile}
        activePath="/invest/incentive-calculator"
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/invest')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Invest in Maharashtra</span>
          </button>

          {currentStep <= 5 && (
            <div className="text-xs text-slate-500 font-semibold">
              Step <span className="text-teal-700 font-bold">{currentStep}</span> of 5
            </div>
          )}
        </div>

        {/* Multi-step Header */}
        {currentStep <= 5 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
              {['Sector', 'Location', 'Investment', 'Enterprise', 'Special'].map((st, i) => (
                <div key={i} className={`p-2 rounded-xl transition-all ${
                  currentStep === i + 1 ? 'bg-teal-50 text-teal-800' : currentStep > i + 1 ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-1 ${
                    currentStep === i + 1 ? 'bg-teal-600 text-white' : currentStep > i + 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {currentStep > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:inline">{st}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 1: SECTOR
           ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-bold text-teal-700 uppercase">Step 1 of 5</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Industry Sector & Sub-Sector</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Industry Sector</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
                >
                  <option value="Engineering & Heavy Manufacturing">Engineering & Heavy Manufacturing (Thrust Sector)</option>
                  <option value="Electric Vehicles & Battery Storage">Electric Vehicles & Battery Storage (Mega Thrust)</option>
                  <option value="Automobile & Auto Ancillaries">Automobile & Auto Ancillaries</option>
                  <option value="Pharmaceuticals & Biotechnology">Pharmaceuticals & Biotechnology</option>
                  <option value="Food Processing & Cold Chain">Food Processing & Cold Chain</option>
                  <option value="Textiles & Technical Textiles">Textiles & Technical Textiles</option>
                  <option value="IT / ITES & Electronic Systems (ESDM)">IT / ITES & Electronic Systems (ESDM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Sub-Sector / Activity Focus</label>
                <input
                  type="text"
                  value={subSector}
                  onChange={(e) => setSubSector(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
                  placeholder="e.g. Precision CNC Tooling & EV Sub-Assemblies"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2"
              >
                <span>Next: Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: LOCATION
           ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-bold text-teal-700 uppercase">Step 2 of 5</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">District & Taluka Classification</h2>
              <p className="text-xs text-slate-500 mt-1">Under PSI 2019, Group D/D+ and Naxal-affected areas qualify for higher subsidy caps (up to 80-100% of FCI).</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="Nashik">Nashik</option>
                    <option value="Pune">Pune</option>
                    <option value="Aurangabad (Chhatrapati Sambhajinagar)">Aurangabad (Chhatrapati Sambhajinagar)</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Solapur">Solapur</option>
                    <option value="Kolhapur">Kolhapur</option>
                    <option value="Amravati">Amravati</option>
                    <option value="Nanded">Nanded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Location Classification</label>
                  <select
                    value={locationType}
                    onChange={(e: any) => setLocationType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="Developing Taluka (Group D)">Developing Taluka (Group D - 65% FCI Cap)</option>
                    <option value="Less Developed (Group D+)">Less Developed (Group D+ - 80% FCI Cap)</option>
                    <option value="Underdeveloped (Group C)">Underdeveloped (Group C - 50% FCI Cap)</option>
                    <option value="Developed (Group A/B)">Developed (Group A/B - 30% FCI Cap)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Premises Type</label>
                <select
                  value={midcType}
                  onChange={(e: any) => setMidcType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="MIDC Industrial Area">MIDC Industrial Area / Industrial Estate</option>
                  <option value="Non-MIDC Private Land">Non-MIDC Private Industrial Land</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2"
              >
                <span>Next: Investment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: INVESTMENT & FCI
           ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-bold text-teal-700 uppercase">Step 3 of 5</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Investment & Employment Scale</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Total Project Investment (₹ Cr)</label>
                <input
                  type="number"
                  step="0.5"
                  value={totalInvestmentCr}
                  onChange={(e) => setTotalInvestmentCr(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Eligible Fixed Capital Investment (FCI in ₹ Cr)</label>
                <input
                  type="number"
                  step="0.5"
                  value={fciAmountCr}
                  onChange={(e) => setFciAmountCr(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Plant & Machinery, Factory Building, Quality Test Equipment.</span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Expected Direct Employment (Workers)</label>
                <input
                  type="number"
                  value={employmentGenerated}
                  onChange={(e) => setEmploymentGenerated(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2"
              >
                <span>Next: Enterprise Scale</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: ENTERPRISE & PROJECT TYPE
           ========================================================================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-bold text-teal-700 uppercase">Step 4 of 5</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Enterprise Scale & Project Nature</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Enterprise Scale</label>
                <select
                  value={enterpriseSize}
                  onChange={(e: any) => setEnterpriseSize(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="Medium Enterprise">Medium Enterprise (FCI up to ₹50 Cr)</option>
                  <option value="Small Enterprise">Small Enterprise (FCI up to ₹10 Cr)</option>
                  <option value="Micro Enterprise">Micro Enterprise (FCI up to ₹1 Cr)</option>
                  <option value="Large / Mega Project">Large / Mega Project (FCI &gt; ₹50 Cr)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Project Nature</label>
                <select
                  value={projectNature}
                  onChange={(e: any) => setProjectNature(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="New Unit (Greenfield)">New Unit (Greenfield)</option>
                  <option value="Expansion / Modernization (Brownfield)">Expansion / Modernization (Brownfield)</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2"
              >
                <span>Next: Special Category</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: SPECIAL CATEGORY
           ========================================================================= */}
        {currentStep === 5 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-bold text-teal-700 uppercase">Step 5 of 5</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Special Category Enhancements</h2>
              <p className="text-xs text-slate-500 mt-1">Women & SC/ST entrepreneurs receive an additional 10-15% FCI subsidy enhancement and extended eligibility years.</p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { id: 'Standard General Category', desc: 'Standard Package Scheme of Incentives guidelines' },
                { id: 'Women Entrepreneurs (100% Owned)', desc: '+10% Extra IPS subsidy & +2 additional eligibility years' },
                { id: 'SC/ST Entrepreneurs', desc: '+15% Extra FCI subsidy & prioritized venture fund capital' },
                { id: 'Green / Zero Effluent Discharge Unit', desc: 'Special environmental ETP capital subsidy up to ₹50 Lakhs' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSpecialCategory(cat.id as any)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    specialCategory === cat.id
                      ? 'bg-teal-50 border-teal-500 text-teal-950 ring-2 ring-teal-100'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <strong className="text-sm block">{cat.id}</strong>
                  <span className="text-xs text-slate-500">{cat.desc}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(6)}
                className="px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Calculate Indicative Incentives</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 6: INDICATIVE INCENTIVE SUMMARY DASHBOARD
           ========================================================================= */}
        {currentStep === 6 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Result Card */}
            <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800 text-teal-200 text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                    <span>PSI 2019 Scheme Analysis</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black">
                    Indicative Incentive Summary
                  </h2>
                  <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
                    Estimated for <strong className="text-white">{sector}</strong> in <strong className="text-white">{district}</strong> ({locationType}).
                  </p>
                </div>

                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20"
                >
                  Recalculate
                </button>
              </div>
            </div>

            {/* KEY NUMERICAL SUMMARY METRIC TILES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Total Cap</span>
                <div className="text-2xl font-black text-teal-700 mt-1">₹ {totalIncentiveCap} Cr</div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Up to 85% of Fixed Capital</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Gross SGST Refund</span>
                <div className="text-2xl font-black text-slate-900 mt-1">₹ {ipsSubsidyEstimate} Cr</div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Disbursed over 7-year term</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Electricity Duty</span>
                <div className="text-2xl font-black text-emerald-700 mt-1">100% Exemption</div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">7 Years zero duty on MSEDCL bill</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Interest Relief</span>
                <div className="text-2xl font-black text-blue-700 mt-1">5% Subvention</div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">~₹ {interestSubvention} Cr on Term Loans</span>
              </div>
            </div>

            {/* DETAILED POTENTIAL INCENTIVE COMPONENTS */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="text-base font-bold text-slate-900">
                Potential Incentive Components
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Incentive Component</th>
                      <th className="py-3 px-3">Eligibility Basis</th>
                      <th className="py-3 px-3">Indicative Benefit</th>
                      <th className="py-3 px-3">Applicable Conditions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        Industrial Promotion Subsidy (IPS)
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        Gross SGST paid on final sales of manufactured goods
                      </td>
                      <td className="py-3.5 px-3 font-bold text-teal-700">
                        65% to 80% of Eligible FCI (₹ {ipsSubsidyEstimate} Cr)
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        Unit must maintain minimum 80% local employment quota.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        Electricity Duty Exemption
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        HT/LT Power Connection in Group D zone
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-700">
                        100% Waiver for 7 Years
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        Subject to timely monthly power bill settlements.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        Power Tariff Subsidy
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        MSEDCL industrial energy consumption
                      </td>
                      <td className="py-3.5 px-3 font-bold text-blue-700">
                        ₹ 1.00 per unit for 3 Years
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        Applicable to MSME units in Vidarbha, Marathwada & North Maharashtra.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        Stamp Duty Exemption
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        Land / Shed purchase or MIDC lease deed
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        100% Exemption at registration
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        Valid for lease agreements signed within 3 years of LOI.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statutory Disclaimer Callout */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Indicative Estimate Only:</strong>
                Final eligibility and benefit amounts are subject to applicable government policies, conditions, budget allocations, and formal departmental approval by the Directorate of Industries upon issuance of the Eligibility Certificate (EC).
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={handleDownloadSummary}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Download Incentive Summary</span>
              </button>

              <button
                onClick={() => navigate('/invest/planner')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Add Summary to My Investment Plan</span>
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
