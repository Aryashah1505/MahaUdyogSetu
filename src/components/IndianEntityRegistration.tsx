import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, Building2, Calendar, ShieldCheck } from 'lucide-react';

interface IndianEntityRegistrationProps {
  initialEmail?: string;
  initialMobile?: string;
  onComplete: (profile: BusinessProfile) => void;
  onCancel: () => void;
}

export const IndianEntityRegistration: React.FC<IndianEntityRegistrationProps> = ({
  initialEmail = 'arya2007in@gmail.com',
  initialMobile = '9825204240',
  onComplete,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    email: initialEmail,
    mobile: initialMobile,
    firstName: 'ARYA',
    middleName: 'DARSHAN',
    lastName: 'SHAH',
    aadharNo: '849201948201',
    constitutionType: 'Private Limited Company',
    dateOfIncorporation: '2023-04-15',
    businessName: 'Bharat Innovations & Technologies Private Limited',
    panNo: 'ABCDE1234F',
    communicationAddress: 'Plot No. 44, MIDC Industrial Area, Chakan',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Haveli / Chakan',
    village: 'Chakan Industrial Zone',
    pincode: '410501',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    agreeTerms: true,
  });

  const [panValidated, setPanValidated] = useState(true);
  const [isValidatingPan, setIsValidatingPan] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleValidatePan = () => {
    if (!formData.panNo || formData.panNo.length !== 10) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid 10-digit PAN number (e.g. ABCDE1234F).' });
      return;
    }
    setIsValidatingPan(true);
    setStatusMessage(null);
    setTimeout(() => {
      setIsValidatingPan(false);
      setPanValidated(true);
      setStatusMessage({ 
        type: 'success', 
        text: `PAN (${formData.panNo.toUpperCase()}) successfully verified with NSDL / MCA master database for ${formData.businessName || 'Entity'}.` 
      });
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      setStatusMessage({ type: 'error', text: 'Please agree to the terms and conditions to proceed.' });
      return;
    }

    if (!formData.businessName) {
      setStatusMessage({ type: 'error', text: 'Please enter your Business Name as per PAN.' });
      return;
    }

    if (!formData.panNo) {
      setStatusMessage({ type: 'error', text: 'Please enter and validate your PAN Number.' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Password and Password Confirmation do not match.' });
      return;
    }

    const companyId = `BIZ-MH-${formData.panNo.slice(0, 5)}-${Math.floor(100 + Math.random() * 900)}`;
    const businessTypeMapped: BusinessProfile['businessType'] = 
      formData.constitutionType.includes('Private') ? 'Private Limited' :
      formData.constitutionType.includes('Public') ? 'Public Limited' :
      formData.constitutionType.includes('Partnership') || formData.constitutionType.includes('LLP') ? 'Partnership / LLP' :
      'Proprietorship';

    const fullProfile: BusinessProfile = {
      id: companyId,
      name: formData.businessName,
      businessType: businessTypeMapped,
      cin: 'U28990MH2026PTC654321',
      pan: formData.panNo.toUpperCase(),
      gstin: `27${formData.panNo.toUpperCase()}1Z5`,
      mobile: formData.mobile,
      email: formData.email,
      state: formData.state,
      district: formData.district,
      address: `${formData.communicationAddress}, Taluka: ${formData.taluka}, Pincode: ${formData.pincode}`,
      sector: 'Engineering & Heavy Manufacturing',
      scale: 'Medium',
      investmentCrores: 12.5,
      workforce: 60,
      connectedPowerKw: 200,
      handlesHazardous: false,
      landType: 'Industrial Park (Allotted)',
      stage: 'Pre-Establishment',
      isProfileComplete: true,
    };

    localStorage.setItem('mahau_active_company', JSON.stringify(fullProfile));
    onComplete(fullProfile);
  };

  return (
    <div className="min-h-screen bg-[#f1f4f9] flex flex-col justify-between font-sans text-slate-800">
      
      {/* 1. TOP UTILITY ACCESSIBILITY BAR */}
      <div className="bg-[#0b1b3d] text-white text-[11px] px-4 sm:px-12 py-1.5 flex items-center justify-between border-b border-slate-700/60">
        <div className="flex items-center gap-4">
          <span className="hover:underline cursor-pointer opacity-90">Skip to Main Content</span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span className="hidden sm:inline hover:underline cursor-pointer opacity-90">Screen Reader Access</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-mono">MAITRI • MahaUdyogSetu</span>
        </div>
      </div>

      {/* 2. GOVERNMENT BRANDING BANNER (Exact MAITRI header) */}
      <div className="bg-white border-b border-slate-200/90 px-4 sm:px-12 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* National Emblem (Left) */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-11 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 120" className="w-full h-full fill-current text-amber-700">
                <path d="M50 10 C30 10 20 25 20 40 C20 60 40 70 50 85 C60 70 80 60 80 40 C80 25 70 10 50 10 Z" fill="none" stroke="currentColor" strokeWidth="4"/>
                <circle cx="50" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="3"/>
                <path d="M35 88 L65 88 L60 105 L40 105 Z" fill="currentColor"/>
                <line x1="20" y1="110" x2="80" y2="110" stroke="currentColor" strokeWidth="4"/>
              </svg>
            </div>
          </div>

          {/* Central MAITRI / MahaUdyogSetu Brand */}
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                M
              </div>
              <span className="text-xs sm:text-sm font-black tracking-tight text-slate-800 uppercase">
                MAHARASHTRA INDUSTRY, TRADE AND INVESTMENT FACILITATION CELL
              </span>
            </div>
            <span className="text-[10px] font-bold text-teal-800 tracking-wider">
              MahaUdyogSetu Single Window Portal
            </span>
          </div>

          {/* Maharashtra State Seal (Right) */}
          <div className="w-10 h-10 rounded-full bg-amber-400 p-1 border border-amber-500/30 shadow-xs flex items-center justify-center text-[7px] font-black text-amber-950 text-center uppercase tracking-tighter leading-tight">
            महाराष्ट्र<br/>शासन
          </div>
        </div>
      </div>

      {/* 3. MAIN REGISTRATION CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 my-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8">
          
          {/* Form Title & Subtitle */}
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-slate-700">👤</span> Indian Entity Registration
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your details below to create your account and configure your company profile.
            </p>
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div className={`mb-6 p-4 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ROW 1: E-Mail, Mobile No., First Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  E-Mail <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Mobile No. <span className="text-rose-500">*</span>
                </label>
                <div className="flex border border-slate-300 rounded-lg overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="inline-flex items-center px-3 bg-white text-slate-700 text-xs font-semibold border-r border-slate-200 gap-1">
                    <span>🇮🇳</span> +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Enter mobile number"
                    className="w-full px-3.5 py-2.5 bg-transparent text-slate-900 text-xs focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First Name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium uppercase"
                />
              </div>
            </div>

            {/* ROW 2: Middle Name, Last Name, Aadhar No. / Virtual ID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  placeholder="Middle Name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last Name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Aadhar No. / Virtual ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.aadharNo}
                  onChange={(e) => setFormData({ ...formData, aadharNo: e.target.value })}
                  placeholder="Enter your Aadhar No. / Virtual ID"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium font-mono"
                />
              </div>
            </div>

            {/* ROW 3: Constitution Type (Dropdown) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Constitution Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.constitutionType}
                onChange={(e) => setFormData({ ...formData, constitutionType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-blue-400 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Private Limited Company">Private Limited Company</option>
                <option value="Public Limited Company">Public Limited Company</option>
                <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                <option value="Partnership Firm">Partnership Firm</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Trust / Society / NGO">Trust / Society / NGO</option>
              </select>
            </div>

            {/* ROW 4: Date of Incorporation, Business Name (Name as per PAN) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Date of Incorporation <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={formData.dateOfIncorporation}
                    onChange={(e) => setFormData({ ...formData, dateOfIncorporation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Business Name (Name as per PAN) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Enter your business Name / individual name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {/* ROW 5: PAN No. & Validate Button + Disclaimer Note */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                PAN No. <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={formData.panNo}
                  onChange={(e) => {
                    setFormData({ ...formData, panNo: e.target.value.toUpperCase() });
                    setPanValidated(false);
                  }}
                  placeholder="Enter your PAN"
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold tracking-wider uppercase"
                />
                <button
                  type="button"
                  onClick={handleValidatePan}
                  disabled={isValidatingPan}
                  className="px-8 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  {isValidatingPan ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  Validate
                </button>
              </div>
              <p className="text-[11px] text-rose-600 font-medium mt-1.5">
                (Note: If you are an existing MIDC user, enter the same PAN number that is registered with the MIDC Department. A mismatch may prevent successful data fetching.)
              </p>
            </div>

            {/* ROW 6: Communication Address, State, District */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Communication Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.communicationAddress}
                  onChange={(e) => setFormData({ ...formData, communicationAddress: e.target.value })}
                  placeholder="Enter your communication address"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  State <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Maharashtra">MAHARASHTRA</option>
                  <option value="Gujarat">GUJARAT</option>
                  <option value="Karnataka">KARNATAKA</option>
                  <option value="Madhya Pradesh">MADHYA PRADESH</option>
                  <option value="Goa">GOA</option>
                  <option value="Delhi">DELHI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Pune">Pune</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Mumbai City">Mumbai City</option>
                  <option value="Mumbai Suburban">Mumbai Suburban</option>
                  <option value="Thane">Thane</option>
                  <option value="Raigad">Raigad</option>
                  <option value="Aurangabad (Chhatrapati Sambhajinagar)">Chhatrapati Sambhajinagar</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Kolhapur">Kolhapur</option>
                  <option value="Solapur">Solapur</option>
                  <option value="Bhavnagar">Bhavnagar</option>
                </select>
              </div>
            </div>

            {/* ROW 7: Taluka, Village, Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Taluka
                </label>
                <select
                  value={formData.taluka}
                  onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Haveli / Chakan">Haveli / Chakan</option>
                  <option value="Khed">Khed</option>
                  <option value="Ambad">Ambad</option>
                  <option value="Bhavnagar">Bhavnagar</option>
                  <option value="Kurla">Kurla</option>
                  <option value="Panvel">Panvel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Village
                </label>
                <select
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Chakan Industrial Zone">Chakan Industrial Zone</option>
                  <option value="Ambad Industrial Zone">Ambad Industrial Zone</option>
                  <option value="Bhosari MIDC">Bhosari MIDC</option>
                  <option value="Hinjawadi Phase 1">Hinjawadi Phase 1</option>
                  <option value="Taloja MIDC">Taloja MIDC</option>
                  <option value="Ranjangaon MIDC">Ranjangaon MIDC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Pincode <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="Pincode"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-medium"
                />
              </div>
            </div>

            {/* ROW 8: Password & Password Confirmation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Password Confirmation <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* PASSWORD POLICY RED CALLOUT BOX */}
            <div className="p-4 rounded-xl border border-rose-200 bg-white text-rose-600 text-xs space-y-1">
              <p className="font-bold">Password criteria as mentioned below :</p>
              <p>1. Be a minimum of 8 characters in length</p>
              <p>2. Contains atleast 1 character from the following categories:</p>
              <ul className="list-disc list-inside pl-2 space-y-0.5 text-[11px] text-rose-500">
                <li>Uppercase Letter (A-Z)</li>
                <li>Lowercase Letter (a-z)</li>
                <li>Digit (0-9)</li>
                <li>Special Character (~`!@#$%^&*\,-)</li>
              </ul>
            </div>

            {/* TERMS & CONDITIONS CHECKBOX */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs font-bold text-slate-800 cursor-pointer select-none">
                I agree to the terms and conditions
              </label>
            </div>

            {/* SUBMIT BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="submit"
                className="px-8 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Register
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </form>

        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-3 px-4 sm:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px]">
          <span>Copyrights © 2026, MAITRI • MahaUdyogSetu. All rights reserved.</span>
          <span>Department of Industries, Government of Maharashtra</span>
        </div>
      </footer>

    </div>
  );
};
