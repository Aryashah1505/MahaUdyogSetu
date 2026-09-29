import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader, PublicFooter } from './PublicHeader';
import { DEMO_VERIFIED_RECORDS } from '../ApplyVerifyPermissionView';
import { 
  Search, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Calendar, 
  MapPin, 
  BadgeCheck, 
  Sparkles,
  QrCode,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

export const VerifyPermissionPage: React.FC = () => {
  const navigate = useNavigate();

  // Search Verification Form State
  const [searchMethod, setSearchMethod] = useState<'APP_NO' | 'PERM_NO' | 'CERT_NO'>('PERM_NO');
  const [searchValue, setSearchValue] = useState('MPCB/CONSENT/CTE/2026/0091');
  const [businessName, setBusinessName] = useState('Western Maharashtra Engineering Private Limited');
  const [issuingDept, setIssuingDept] = useState('Maharashtra Pollution Control Board');

  // Outcome Verification State
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setIsSearching(true);
    setHasSearched(false);

    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);

      const match = DEMO_VERIFIED_RECORDS.find(r => 
        r.id.toLowerCase() === searchValue.trim().toLowerCase() ||
        r.permissionNumber.toLowerCase() === searchValue.trim().toLowerCase() ||
        r.certificateNumber.toLowerCase() === searchValue.trim().toLowerCase()
      );

      if (match) {
        setVerificationResult(match);
      } else {
        setVerificationResult(null);
      }
    }, 500);
  };

  const handleFillDemo = (permNo: string, dept: string) => {
    setSearchMethod('PERM_NO');
    setSearchValue(permNo);
    setIssuingDept(dept);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicHeader 
        title="Verify a Permission" 
        subtitle="Real-time Statutory Clearance Authenticity & Validity Verification"
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/apply-verify')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-purple-700 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Apply & Verify Hub</span>
          </button>

          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Official QR & Hash Verification
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Verify a Statutory Permission
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Validate the authenticity, issue status, and validity period of any licence, NOC, or certificate issued by Maharashtra state departments.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleVerify} className="space-y-6">
            
            {/* Search Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Verification Identifier Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSearchMethod('PERM_NO')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    searchMethod === 'PERM_NO' 
                      ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-100' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Permission Number</span>
                  <span className="text-[10px] opacity-75">MPCB/DISH</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchMethod('CERT_NO')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    searchMethod === 'CERT_NO' 
                      ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-100' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Certificate Number</span>
                  <span className="text-[10px] opacity-75">MH-SHOPS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchMethod('APP_NO')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    searchMethod === 'APP_NO' 
                      ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-100' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Application Reference ID</span>
                  <span className="text-[10px] opacity-75">APP-CTE-01</span>
                </button>
              </div>
            </div>

            {/* Input for Identifier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Enter {searchMethod === 'PERM_NO' ? 'Permission / License Number' : searchMethod === 'CERT_NO' ? 'Certificate Number' : 'Application Tracking Number'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="e.g. MPCB/CONSENT/CTE/2026/0091 or MH/LAB/SHOPS/2026/44012"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Optional Business Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Business / Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Western Maharashtra Engineering"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Issuing Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Issuing Department
                </label>
                <select
                  value={issuingDept}
                  onChange={(e) => setIssuingDept(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Maharashtra Pollution Control Board">Maharashtra Pollution Control Board</option>
                  <option value="Labour Department, Maharashtra">Labour Department, Maharashtra</option>
                  <option value="Energy Department (MSEDCL / Mahavitaran)">Energy Department (MSEDCL / Mahavitaran)</option>
                  <option value="Directorate of Industrial Safety and Health (DISH)">Directorate of Industrial Safety and Health (DISH)</option>
                  <option value="Maharashtra Fire Services">Maharashtra Fire Services</option>
                  <option value="MIDC (Maharashtra Industrial Development Corporation)">MIDC</option>
                </select>
              </div>
            </div>

            {/* Quick Demo Test Buttons */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 block mb-2">
                Quick Test Samples (Click to Autofill):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('MPCB/CONSENT/CTE/2026/0091', 'Maharashtra Pollution Control Board')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-purple-700 font-semibold"
                >
                  MPCB Consent: MPCB/CONSENT/CTE/2026/0091
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('MH/LAB/SHOPS/2026/44012', 'Labour Department, Maharashtra')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-purple-700 font-semibold"
                >
                  Shops & Est: MH/LAB/SHOPS/2026/44012
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('MSEDCL/NSK/HT-350KW/7741', 'Energy Department (MSEDCL / Mahavitaran)')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-purple-700 font-semibold"
                >
                  Power Sanction: MSEDCL/NSK/HT-350KW/7741
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-3.5 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying with Department Database...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Permission Validity</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Verification Result Output */}
        {hasSearched && (
          <div className="animate-in fade-in duration-300">
            {verificationResult ? (
              <div className="bg-white rounded-3xl border border-emerald-300 shadow-md p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10" />

                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <BadgeCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>GENUINE & ACTIVE STATUTORY RECORD</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mt-1">
                        {verificationResult.serviceName}
                      </h3>
                    </div>
                  </div>

                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                    VALID
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Registered Enterprise</span>
                    <strong className="text-slate-900 text-sm font-bold">{verificationResult.businessName}</strong>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Issuing Department</span>
                    <strong className="text-slate-900 text-sm font-bold">{verificationResult.department}</strong>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Permission / Order No.</span>
                    <strong className="text-purple-700 font-bold">{verificationResult.permissionNumber}</strong>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Certificate No.</span>
                    <strong className="text-slate-900 font-bold">{verificationResult.certificateNumber}</strong>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Issue Date</span>
                    <strong className="text-slate-800 font-semibold">{verificationResult.issueDate}</strong>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Validity Period</span>
                    <strong className="text-emerald-700 font-bold">{verificationResult.validUntil}</strong>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Authorized Premises Location</span>
                    <span className="text-slate-800 font-medium">{verificationResult.premisesAddress}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <QrCode className="w-4 h-4 text-slate-400" />
                    <span>Digital Security Hash: <strong>{verificationResult.qrVerificationCode}</strong></span>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                  >
                    Print Verification Slip
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-red-200 shadow-xs p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No Verified Statutory Record Found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                  No official clearance or certificate matches the identifier <strong className="text-slate-800">"{searchValue}"</strong> under the selected department. Please verify the number from your physical document or receipt.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchValue('');
                      setHasSearched(false);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    Try Another Number
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <PublicFooter />
    </div>
  );
};
