import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  MapPin, 
  FileText, 
  Briefcase, 
  Zap, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Globe, 
  Award,
  IndianRupee,
  Users
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface BusinessProfileViewProps {
  profile: BusinessProfile;
  onUpdateProfile: (newProfile: BusinessProfile) => void;
  onOpenFullRegistrationForm?: () => void;
  onBackToDashboard?: () => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenFullRegistrationForm,
  onBackToDashboard
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<BusinessProfile>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1b3d] via-[#122b5e] to-[#0b1b3d] text-white p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>MCA & Single Window Verified</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
              Udyam / MSME Registered
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" />
            <span>{formData.name}</span>
          </h1>
          <p className="text-xs text-slate-300">
            CIN: {formData.cin || 'U29253MH2020PTC338912'} • PAN: {formData.pan} • GSTIN: {formData.gstin}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => { setFormData({ ...profile }); setIsEditing(false); }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}

          {onOpenFullRegistrationForm && (
            <button
              onClick={onOpenFullRegistrationForm}
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Full KYC Wizard
            </button>
          )}

          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all cursor-pointer"
            >
              ← Dashboard
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Enterprise profile updated and synchronized across all Single Window clearance dossiers successfully.</span>
        </div>
      )}

      {/* 2. Main Profile Content / Form */}
      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Section A: Enterprise Identity & Registration */}
        <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Corporate Identity & Statutory Registration</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500 font-bold">UID: {formData.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Company / Enterprise Legal Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-bold text-slate-900"
                  required
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-900">{formData.name}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Constitution / Entity Type</label>
              {isEditing ? (
                <select
                  value={formData.businessType || 'Private Limited'}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-medium"
                >
                  <option value="Private Limited">Private Limited Company</option>
                  <option value="Public Limited">Public Limited Company</option>
                  <option value="Partnership / LLP">Partnership / LLP</option>
                  <option value="Proprietorship">Proprietorship</option>
                </select>
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">{formData.businessType || 'Private Limited'}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Entity PAN</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-mono font-bold uppercase"
                  required
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono font-bold text-slate-900">{formData.pan}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">GSTIN Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-mono font-bold uppercase"
                  required
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono font-bold text-slate-900">{formData.gstin}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Corporate Identification Number (CIN)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.cin || ''}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value.toUpperCase() })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-mono"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-slate-800">{formData.cin || 'U29253MH2020PTC338912'}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Udyam MSME Registration</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.udyamRegistration || ''}
                  onChange={(e) => setFormData({ ...formData, udyamRegistration: e.target.value.toUpperCase() })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-mono"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-slate-800">{formData.udyamRegistration || 'UDYAM-MH-23-0091823'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Section B: Authorized Signatory & Contact Details */}
        <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Authorized Representative & Contact Information</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Authorized Person Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.authorizedPersonName || 'Arya Darshan Shah'}
                  onChange={(e) => setFormData({ ...formData, authorizedPersonName: e.target.value })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-bold text-slate-900"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-900">{formData.authorizedPersonName || 'Arya Darshan Shah'}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.authorizedPersonDesignation || 'Managing Director'}
                  onChange={(e) => setFormData({ ...formData, authorizedPersonDesignation: e.target.value })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-medium text-slate-800">{formData.authorizedPersonDesignation || 'Managing Director'}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Official Mobile No.</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.mobile || '9825204240'}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-bold"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-900">+91 {formData.mobile || '9825204240'}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Official Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email || 'arya2007in@gmail.com'}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-medium"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 font-medium truncate">{formData.email || 'arya2007in@gmail.com'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Section C: Factory Location & Physical Parameters */}
        <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Plant Location & Industrial Parameters</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Registered Address & Plot Particulars</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address || 'Plot No. W-42, Ambad Industrial Estate, MIDC'}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-medium">{formData.address || 'Plot No. W-42, Ambad Industrial Estate, MIDC'}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">District & State</label>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-900">{formData.district}, {formData.state}</div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Industrial Sector</label>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-bold text-blue-800">{formData.sector}</div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Capital Investment (Plant & Machinery)</label>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-900">₹ {formData.investmentCrores} Crores ({formData.scale} Enterprise)</div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Workforce & Electric Power</label>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-medium">{formData.workforce} Employees • {formData.connectedPowerKw} kW Power</div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setFormData({ ...profile }); setIsEditing(false); }}
              className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>
        )}

      </form>

    </div>
  );
};
