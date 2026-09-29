import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader, PublicFooter } from './PublicHeader';
import { MASTER_SERVICE_CATALOGUE, CatalogServiceItem } from '../ApplyVerifyPermissionView';
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Clock, 
  IndianRupee, 
  Layers, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Sliders,
  Send,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const ApplyForServicesPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Step: 1 (Business Info), 2 (Project Info), 3 (Applicable Services Output)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Business Information
  const [bizName, setBizName] = useState('Western Maharashtra Engineering Private Limited');
  const [bizType, setBizType] = useState('Private Limited');
  const [sector, setSector] = useState('Engineering & Heavy Manufacturing');
  const [district, setDistrict] = useState('Nashik');
  const [taluka, setTaluka] = useState('Ambad');
  const [unitLocation, setUnitLocation] = useState('Plot No. 18, Ambad MIDC Industrial Zone, Nashik');

  // Step 2: Project Information
  const [projectType, setProjectType] = useState<'New Unit (Greenfield)' | 'Expansion (Brownfield)' | 'Modernization / Technology Upgrade'>('New Unit (Greenfield)');
  const [investmentRange, setInvestmentRange] = useState<'Micro (< ₹1 Cr)' | 'Small (₹1 Cr - ₹10 Cr)' | 'Medium (₹10 Cr - ₹50 Cr)' | 'Large (> ₹50 Cr)'>('Medium (₹10 Cr - ₹50 Cr)');
  const [numEmployees, setNumEmployees] = useState('85');
  const [landStatus, setLandStatus] = useState<'MIDC Allotted Land' | 'Private Industrial Land / NA Converted' | 'Leased Premises in Industrial Park' | 'Land Yet to be Acquired'>('MIDC Allotted Land');
  const [powerLoadReq, setPowerLoadReq] = useState('350 kVA (HT Connection)');
  const [handlesHazardous, setHandlesHazardous] = useState<'Yes' | 'No'>('No');

  // Step 3: Selected services state
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    'srv-lab-shops',
    'srv-dish-plan',
    'srv-mpcb-cte',
    'srv-pwr-ht',
    'srv-fire-prov',
    'srv-wtr-midc'
  ]);

  const toggleSelectService = (id: string) => {
    setSelectedServiceIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Determine dynamic matched services based on parameters
  const matchedServices = React.useMemo(() => {
    return MASTER_SERVICE_CATALOGUE.filter(s => {
      // If hazardous is no, exclude highly hazardous only if tag requires
      if (handlesHazardous === 'No' && s.requiresHazardous) return false;
      return true;
    });
  }, [handlesHazardous, sector, investmentRange]);

  const handleProceedToApply = (serviceName?: string) => {
    // Navigate to login / CAF submission flow with clear state
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicHeader 
        title="Apply for Services" 
        subtitle="Step-by-Step Business Parameter Assessment & Clearances Generator"
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/apply-verify')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Apply & Verify Hub</span>
          </button>

          <div className="text-xs text-slate-500 font-semibold">
            Stage: <span className="text-blue-600 font-bold">{currentStep === 1 ? 'Step 1 of 3: Business Information' : currentStep === 2 ? 'Step 2 of 3: Project Information' : 'Step 3 of 3: Applicable Clearances'}</span>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            
            <div className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
              currentStep === 1 ? 'bg-blue-50 text-blue-700 font-bold' : currentStep > 1 ? 'text-emerald-700 font-bold' : 'text-slate-400'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 1 ? 'bg-blue-600 text-white' : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className="text-xs hidden sm:inline">Business Information</span>
              <span className="text-[11px] sm:hidden">Business</span>
            </div>

            <div className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
              currentStep === 2 ? 'bg-blue-50 text-blue-700 font-bold' : currentStep > 2 ? 'text-emerald-700 font-bold' : 'text-slate-400'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 2 ? 'bg-blue-600 text-white' : currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span className="text-xs hidden sm:inline">Project Information</span>
              <span className="text-[11px] sm:hidden">Project</span>
            </div>

            <div className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
              currentStep === 3 ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-400'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                3
              </div>
              <span className="text-xs hidden sm:inline">Applicable Clearances</span>
              <span className="text-[11px] sm:hidden">Permissions</span>
            </div>

          </div>
        </div>

        {/* =========================================================================
            STEP 1: BUSINESS INFORMATION
           ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-6 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Step 1 of 2 Questionnaire</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Business & Entity Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Provide your legal enterprise identity to match relevant statutory regulatory frameworks in Maharashtra.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Company / Business Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Company / Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="e.g. Western Maharashtra Engineering Private Limited"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={bizType}
                  onChange={(e) => setBizType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  <option value="Private Limited">Private Limited Company</option>
                  <option value="Public Limited">Public Limited Company</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Partnership Firm">Partnership Firm</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Joint Venture">Joint Venture / Foreign Subsidiary</option>
                </select>
              </div>

              {/* Industry Sector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Industry Sector <span className="text-red-500">*</span>
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
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

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  <option value="Nashik">Nashik</option>
                  <option value="Pune">Pune</option>
                  <option value="Thane">Thane</option>
                  <option value="Mumbai Suburban">Mumbai Suburban</option>
                  <option value="Raigad">Raigad</option>
                  <option value="Aurangabad (Chhatrapati Sambhajinagar)">Aurangabad (Chhatrapati Sambhajinagar)</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Kolhapur">Kolhapur</option>
                  <option value="Solapur">Solapur</option>
                  <option value="Ahmednagar (Ahilyanagar)">Ahmednagar (Ahilyanagar)</option>
                </select>
              </div>

              {/* Taluka */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Taluka <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  placeholder="e.g. Ambad, Haveli, Waluj, Butibori"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Factory / Unit Location */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Factory / Proposed Unit Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={unitLocation}
                  onChange={(e) => setUnitLocation(e.target.value)}
                  placeholder="e.g. Plot No. 18, Ambad MIDC Industrial Zone, Nashik, Maharashtra"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/apply-verify')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Proceed to Project Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: PROJECT INFORMATION
           ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-6 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Step 2 of 2 Questionnaire</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Project Scale & Technical Parameters
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                These project parameters dynamically determine environmental consent categories (Red/Orange/Green), DISH factory plans, power sanctions, and municipal clearances.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Project Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Project Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={projectType}
                  onChange={(e: any) => setProjectType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  <option value="New Unit (Greenfield)">New Unit (Greenfield)</option>
                  <option value="Expansion (Brownfield)">Expansion (Brownfield)</option>
                  <option value="Modernization / Technology Upgrade">Modernization / Technology Upgrade</option>
                </select>
              </div>

              {/* Investment Range */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Proposed Capital Investment <span className="text-red-500">*</span>
                </label>
                <select
                  value={investmentRange}
                  onChange={(e: any) => setInvestmentRange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  <option value="Micro (< ₹1 Cr)">Micro (&lt; ₹1 Crore)</option>
                  <option value="Small (₹1 Cr - ₹10 Cr)">Small (₹1 Crore - ₹10 Crore)</option>
                  <option value="Medium (₹10 Cr - ₹50 Cr)">Medium (₹10 Crore - ₹50 Crore)</option>
                  <option value="Large (> ₹50 Cr)">Large (&gt; ₹50 Crore Mega Project)</option>
                </select>
              </div>

              {/* Number of Employees */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Expected Workforce / Employees <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={numEmployees}
                  onChange={(e) => setNumEmployees(e.target.value)}
                  placeholder="e.g. 85"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  &gt;= 10 workers with power triggers mandatory DISH Factory Act License.
                </span>
              </div>

              {/* Land Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Land / Premises Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={landStatus}
                  onChange={(e: any) => setLandStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  <option value="MIDC Allotted Land">MIDC Allotted Land (Industrial Estate)</option>
                  <option value="Private Industrial Land / NA Converted">Private Industrial Land / NA Converted</option>
                  <option value="Leased Premises in Industrial Park">Leased Premises in Industrial Park</option>
                  <option value="Land Yet to be Acquired">Land Yet to be Acquired</option>
                </select>
              </div>

              {/* Power Requirement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Connected Power Load Requirement <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={powerLoadReq}
                  onChange={(e) => setPowerLoadReq(e.target.value)}
                  placeholder="e.g. 350 kVA (HT Connection)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Handles Hazardous Chemicals */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Handles Hazardous Chemicals / Effluents? <span className="text-red-500">*</span>
                </label>
                <select
                  value={handlesHazardous}
                  onChange={(e: any) => setHandlesHazardous(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  <option value="No">No (Standard Manufacturing & Assembly)</option>
                  <option value="Yes">Yes (Chemicals / Flammables / Hazardous Waste)</option>
                </select>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Step 1</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Applicable Permissions</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: APPLICABLE SERVICES & PERMISSIONS (RESULTS)
           ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            
            {/* Success Summary Header */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Regulatory Assessment Complete</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Applicable Statutory Permissions for {bizName}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
                    Based on your profile ({sector}, {district}, {investmentRange}, {landStatus}), our engine identified <span className="font-bold text-white">{matchedServices.length} statutory clearances</span> required across Maharashtra state departments.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 shrink-0"
                >
                  Edit Parameters
                </button>
              </div>
            </div>

            {/* List of Matched Permissions */}
            <div className="space-y-4">
              {matchedServices.map((service, idx) => {
                const isChecked = selectedServiceIds.includes(service.id);
                return (
                  <div 
                    key={service.id}
                    className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-xs ${
                      isChecked ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      
                      <div className="flex items-start gap-3.5 flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectService(service.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {service.code}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                              {service.department}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
                              {service.stage}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 mb-1">
                            {service.name}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            {service.whyRequired}
                          </p>

                          {/* Meta Tags */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span>{service.docsCount} Mandatory Documents</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>SLA: <strong className="text-slate-800">{service.sla}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                              <span>Statutory Fee: <strong className="text-slate-800">{service.fees}</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleProceedToApply(service.name)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer w-full sm:w-auto justify-center"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Master CTA */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Ready to Submit Unified Combined Application Form (CAF)?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selected {selectedServiceIds.length} clearances will be bundled into your single window application dossier.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/list-of-services')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors w-full sm:w-auto"
                >
                  Explore More Services
                </button>

                <button
                  onClick={() => handleProceedToApply()}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span>Proceed to Unified Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      <PublicFooter />
    </div>
  );
};
