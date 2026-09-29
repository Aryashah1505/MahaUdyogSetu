import React, { useState } from 'react';
import { 
  FileCheck, 
  Building2, 
  ShieldCheck, 
  Edit3, 
  Save, 
  CheckCircle2, 
  Clock, 
  User, 
  MapPin, 
  FileText,
  Briefcase,
  AlertTriangle
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface FirmRegistrationViewProps {
  profile: BusinessProfile;
  onUpdateProfile: (newProfile: BusinessProfile) => void;
  onOpenEntityRegistration?: () => void;
  onBackToDashboard?: () => void;
}

export const FirmRegistrationView: React.FC<FirmRegistrationViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenEntityRegistration,
  onBackToDashboard
}) => {
  const [formData, setFormData] = useState<BusinessProfile>({ ...profile });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1b3d] via-[#122b5e] to-[#0b1b3d] text-white p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider flex items-center gap-1">
              <FileCheck className="w-3 h-3 text-blue-400" />
              <span>Registrar of Firms & MCA21 Synced</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
              Government of Maharashtra
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Firm & Enterprise Registration</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Master legal constitution, partnership deed, and statutory incorporation details governing your single window industrial clearances.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Firm Details</span>
            </button>
          ) : (
            <button
              onClick={() => { setFormData({ ...profile }); setIsEditing(false); }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Cancel
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

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Firm registration details updated successfully.</span>
        </div>
      )}

      {/* 2. Form / Card Layout */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Statutory Firm Master Record</span>
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Active Verified Enterprise
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Firm / Legal Entity Name *</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 font-bold text-slate-900"
                  required
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-900">{formData.name}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Constitution Type *</label>
              {isEditing ? (
                <select
                  value={formData.businessType || 'Private Limited'}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 font-medium"
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
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Entity PAN *</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 font-mono font-bold uppercase"
                  required
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono font-bold text-slate-900">{formData.pan}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">GSTIN Number *</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 font-mono font-bold uppercase"
                  required
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono font-bold text-slate-900">{formData.gstin}</div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Authorized Person Name *</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.authorizedPersonName || 'Arya Darshan Shah'}
                  onChange={(e) => setFormData({ ...formData, authorizedPersonName: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 font-bold text-slate-900"
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
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 font-medium"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-medium">{formData.authorizedPersonDesignation || 'Managing Director'}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Registered Office Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address || 'Ambad Industrial Area, Nashik, Maharashtra - 422010'}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50"
                />
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-medium">{formData.address || 'Ambad Industrial Area, Nashik, Maharashtra - 422010'}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">District & MIDC Status</label>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
                {formData.district}, Maharashtra • {formData.isMIDC ? 'MIDC Industrial Estate' : 'Non-MIDC Zone'}
              </div>
            </div>
          </div>

        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => { setFormData({ ...profile }); setIsEditing(false); }}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Firm Record</span>
            </button>
          </div>
        )}
      </form>

    </div>
  );
};
