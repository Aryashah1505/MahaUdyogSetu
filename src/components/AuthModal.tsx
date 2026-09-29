import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  Mail, 
  FileText, 
  MapPin, 
  Lock,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';

interface AuthModalProps {
  onLoginSuccess: (profile: BusinessProfile) => void;
  currentCompany?: BusinessProfile | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, currentCompany }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'otp'>('register');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form State initialized for seamless fast test/registration
  const [formData, setFormData] = useState({
    name: 'Western Maharashtra Engineering Private Limited',
    businessType: 'Private Limited' as const,
    cin: 'U28990MH2026PTC654321',
    pan: 'FGHIJ5678K',
    gstin: '27FGHIJ5678K1Z8',
    mobile: '9123456780',
    email: 'contact@westernmahaengineering.example',
    state: 'Maharashtra',
    district: 'Nashik',
    address: 'Plot No. 18, Ambad MIDC, Ambad Industrial Estate, Nashik, Maharashtra – 422010',
    sector: 'Engineering & Heavy Manufacturing',
    scale: 'Medium' as const,
    investmentCrores: 18.5,
    workforce: 75,
    connectedPowerKw: 350,
    handlesHazardous: false,
    landType: 'Industrial Park (Allotted)' as const,
    stage: 'Pre-Establishment' as const,
  });

  const handleQuickFillWesternMaha = () => {
    setFormData({
      name: 'Western Maharashtra Engineering Private Limited',
      businessType: 'Private Limited',
      cin: 'U28990MH2026PTC654321',
      pan: 'FGHIJ5678K',
      gstin: '27FGHIJ5678K1Z8',
      mobile: '9123456780',
      email: 'contact@westernmahaengineering.example',
      state: 'Maharashtra',
      district: 'Nashik',
      address: 'Plot No. 18, Ambad MIDC, Ambad Industrial Estate, Nashik, Maharashtra – 422010',
      sector: 'Engineering & Heavy Manufacturing',
      scale: 'Medium',
      investmentCrores: 18.5,
      workforce: 75,
      connectedPowerKw: 350,
      handlesHazardous: false,
      landType: 'Industrial Park (Allotted)',
      stage: 'Pre-Establishment',
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpStep(true);
      setOtpCode('749201'); // Pre-fill mock OTP for smooth verification
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newProfile: BusinessProfile = {
        id: `BIZ-MH-${formData.pan.slice(0, 5)}-${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        businessType: formData.businessType,
        cin: formData.cin,
        pan: formData.pan,
        gstin: formData.gstin,
        mobile: formData.mobile,
        email: formData.email,
        state: formData.state,
        district: formData.district,
        address: formData.address,
        sector: formData.sector,
        scale: formData.scale,
        investmentCrores: Number(formData.investmentCrores),
        workforce: Number(formData.workforce),
        connectedPowerKw: Number(formData.connectedPowerKw),
        handlesHazardous: formData.handlesHazardous,
        landType: formData.landType,
        stage: formData.stage,
        isProfileComplete: true,
      };

      // Save to localStorage for single source of truth across browser refresh
      try {
        localStorage.setItem('mahau_active_company', JSON.stringify(newProfile));
      } catch (err) {}

      onLoginSuccess(newProfile);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8 relative animate-fadeIn">
        
        {/* Header Branding */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              MS
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                MahaUdyogSetu <span className="text-teal-600 text-sm font-semibold">(महाराष्ट्र उद्योग सेतु)</span>
              </h3>
              <p className="text-xs text-slate-500">Government of Maharashtra Single Window Business Approval Platform</p>
            </div>
          </div>

          <button
            onClick={handleQuickFillWesternMaha}
            type="button"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 hover:bg-teal-100 transition-all"
            title="Auto-fill benchmark test enterprise"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Fill Western Maharashtra Eng.
          </button>
        </div>

        {/* OTP Screen */}
        {otpStep ? (
          <form onSubmit={handleVerifyOtp} className="py-6 space-y-6">
            <div className="text-center space-y-2 max-w-md mx-auto">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-slate-900">Aadhaar / Mobile OTP Verification</h4>
              <p className="text-xs text-slate-600">
                A 6-digit one-time statutory verification passcode was sent to authorized director's mobile <strong>+91 {formData.mobile}</strong> and email <strong>{formData.email}</strong>.
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-3">
              <label className="block text-xs font-bold text-slate-700 text-center">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] font-mono text-2xl font-black px-4 py-3 rounded-xl bg-slate-50 border-2 border-teal-600 text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-500/20"
                required
              />
              <p className="text-[11px] text-center text-teal-700 font-medium">Demo OTP auto-filled for immediate testing.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
              >
                Back to Details
              </button>
              <button
                type="submit"
                disabled={isLoading || otpCode.length < 6}
                className="w-2/3 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Activate Company & Launch Clearances
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit} className="py-4 space-y-4">
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-start gap-3">
              <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div className="text-xs text-teal-900">
                <strong>Single Source of Truth:</strong> The registered company profile drives all statutory clearance checklists, CPCB pollution risk scoring, and single document vault pipelines.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Company / Enterprise Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Western Maharashtra Engineering Private Limited"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Business Constitution Type *</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  <option value="Private Limited">Private Limited</option>
                  <option value="Public Limited">Public Limited</option>
                  <option value="Partnership / LLP">Partnership / LLP</option>
                  <option value="Proprietorship">Proprietorship</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Corporate Identification Number (CIN) *</label>
                <input
                  type="text"
                  required
                  value={formData.cin}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                  placeholder="U28990MH2026PTC654321"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company PAN *</label>
                <input
                  type="text"
                  required
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  placeholder="FGHIJ5678K"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">GSTIN *</label>
                <input
                  type="text"
                  required
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  placeholder="27FGHIJ5678K1Z8"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Authorized Mobile (for OTP) *</label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="9123456780"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@westernmahaengineering.example"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State / Jurisdiction *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Maharashtra"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District *</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Nashik"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Registered Plot / Factory Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot No. 18, Ambad MIDC, Ambad Industrial Estate, Nashik, Maharashtra – 422010"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-2">
                  Project & Clearances DNA
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Industry / Sector *</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  <option value="Engineering & Heavy Manufacturing">Engineering & Heavy Manufacturing</option>
                  <option value="Manufacturing (General)">Manufacturing (General)</option>
                  <option value="Automotive & EV Components">Automotive & EV Components</option>
                  <option value="Pharmaceuticals & APIs">Pharmaceuticals & APIs</option>
                  <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                  <option value="Food Processing & Agri Logistics">Food Processing & Agri Logistics</option>
                  <option value="Textiles & Garment Manufacturing">Textiles & Garment Manufacturing</option>
                  <option value="IT, Software & Data Centers">IT, Software & Data Centers</option>
                  <option value="Renewable Energy & Solar">Renewable Energy & Solar</option>
                  <option value="Construction & Building Materials">Construction & Building Materials</option>
                  <option value="Logistics & Warehousing">Logistics & Warehousing</option>
                  <option value="Agriculture / Agro Processing">Agriculture / Agro Processing</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Land Classification *</label>
                <select
                  value={formData.landType}
                  onChange={(e) => setFormData({ ...formData, landType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  <option value="Industrial Park (Allotted)">Industrial Park (Allotted MIDC/GIDC)</option>
                  <option value="Agricultural (Requires CLU)">Agricultural (Requires Change of Land Use)</option>
                  <option value="Private Commercial">Private Commercial Zone</option>
                  <option value="SEZ Free Trade Zone">Special Economic Zone (SEZ)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Capital Investment (₹ Crores) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.investmentCrores}
                  onChange={(e) => setFormData({ ...formData, investmentCrores: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Connected Power Load (kW) *</label>
                <input
                  type="number"
                  required
                  value={formData.connectedPowerKw}
                  onChange={(e) => setFormData({ ...formData, connectedPowerKw: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Workforce Count (Employees) *</label>
                <input
                  type="number"
                  required
                  value={formData.workforce}
                  onChange={(e) => setFormData({ ...formData, workforce: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.handlesHazardous}
                    onChange={(e) => setFormData({ ...formData, handlesHazardous: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-bold text-slate-800 text-xs">
                    Handles Hazardous / Inflammable Materials
                  </span>
                </label>
              </div>

            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                Proceed to OTP Verification <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
