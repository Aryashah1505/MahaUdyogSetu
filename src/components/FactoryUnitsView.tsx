import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Zap, 
  Users, 
  Plus, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Activity,
  AlertCircle,
  X,
  Factory
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface FactoryUnit {
  id: string;
  name: string;
  type: string;
  district: string;
  midcArea: string;
  plotNo: string;
  builtUpAreaSqFt: number;
  powerLoadKw: number;
  workforce: number;
  status: 'Operational' | 'Under Expansion' | 'Under Setup';
  licenseNo: string;
  pollutionCategory: 'Red' | 'Orange' | 'Green' | 'White';
  dishApproval: boolean;
  fireNoc: boolean;
  commencementDate: string;
}

interface FactoryUnitsViewProps {
  profile: BusinessProfile;
  onBackToDashboard?: () => void;
}

export const FactoryUnitsView: React.FC<FactoryUnitsViewProps> = ({ profile, onBackToDashboard }) => {
  const [units, setUnits] = useState<FactoryUnit[]>([
    {
      id: 'UNIT-MH-NSK-01',
      name: `${profile.name || 'Western Maharashtra Engineering'} - Plant 1 (Heavy Machining)`,
      type: 'Heavy Machinery & Fabrication',
      district: profile.district || 'Nashik',
      midcArea: 'Ambad Industrial Area, MIDC',
      plotNo: profile.plotNumber || 'Plot No. W-18/2',
      builtUpAreaSqFt: profile.builtUpAreaSqFt || 45000,
      powerLoadKw: profile.connectedPowerKw || 350,
      workforce: profile.workforce || 75,
      status: 'Operational',
      licenseNo: 'MH-NSK-FAC-2024-8921',
      pollutionCategory: 'Orange',
      dishApproval: true,
      fireNoc: true,
      commencementDate: '15 Jan 2021'
    },
    {
      id: 'UNIT-MH-PUN-02',
      name: `${profile.name || 'Western Maharashtra Engineering'} - Plant 2 (Auto Spares Division)`,
      type: 'Automotive Components Pressing',
      district: 'Pune',
      midcArea: 'Chakan Industrial Estate Phase-II, MIDC',
      plotNo: 'Plot No. C-44/1',
      builtUpAreaSqFt: 32000,
      powerLoadKw: 250,
      workforce: 45,
      status: 'Operational',
      licenseNo: 'MH-PUN-FAC-2025-1142',
      pollutionCategory: 'Orange',
      dishApproval: true,
      fireNoc: true,
      commencementDate: '10 Nov 2023'
    },
    {
      id: 'UNIT-MH-AUR-03',
      name: `${profile.name || 'Western Maharashtra Engineering'} - Plant 3 (Tooling & Prototyping)`,
      type: 'Precision Tooling & Prototyping',
      district: 'Chhatrapati Sambhajinagar',
      midcArea: 'Waluj Industrial Area, MIDC',
      plotNo: 'Plot No. L-12',
      builtUpAreaSqFt: 18000,
      powerLoadKw: 150,
      workforce: 30,
      status: 'Under Expansion',
      licenseNo: 'MH-AUR-FAC-2026-0049',
      pollutionCategory: 'Green',
      dishApproval: true,
      fireNoc: false,
      commencementDate: 'Expected Oct 2026'
    }
  ]);

  const [selectedUnit, setSelectedUnit] = useState<FactoryUnit | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newUnitForm, setNewUnitForm] = useState({
    name: '',
    type: 'Engineering & Fabrication',
    district: 'Nashik',
    midcArea: 'Ambad MIDC',
    plotNo: '',
    builtUpAreaSqFt: 25000,
    powerLoadKw: 200,
    workforce: 35,
    pollutionCategory: 'Orange' as const
  });

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitForm.name.trim() || !newUnitForm.plotNo.trim()) return;

    const newUnit: FactoryUnit = {
      id: `UNIT-MH-${newUnitForm.district.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      name: newUnitForm.name,
      type: newUnitForm.type,
      district: newUnitForm.district,
      midcArea: newUnitForm.midcArea,
      plotNo: newUnitForm.plotNo,
      builtUpAreaSqFt: Number(newUnitForm.builtUpAreaSqFt),
      powerLoadKw: Number(newUnitForm.powerLoadKw),
      workforce: Number(newUnitForm.workforce),
      status: 'Under Setup',
      licenseNo: `MH-${newUnitForm.district.slice(0, 3).toUpperCase()}-FAC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      pollutionCategory: newUnitForm.pollutionCategory,
      dishApproval: false,
      fireNoc: false,
      commencementDate: 'Under Planning'
    };

    setUnits([newUnit, ...units]);
    setShowAddModal(false);
    setNewUnitForm({
      name: '',
      type: 'Engineering & Fabrication',
      district: 'Nashik',
      midcArea: 'Ambad MIDC',
      plotNo: '',
      builtUpAreaSqFt: 25000,
      powerLoadKw: 200,
      workforce: 35,
      pollutionCategory: 'Orange'
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Enterprise Production Hubs</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">{profile.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Factory className="w-6 h-6 text-blue-600" />
              <span>Registered Factory & Industrial Units</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
              Manage operational plants, manufacturing premises, and upcoming industrial sites across Maharashtra.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Register Factory Unit</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Units</div>
              <div className="text-2xl font-black text-slate-900">{units.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Operational</div>
              <div className="text-2xl font-black text-emerald-700">
                {units.filter(u => u.status === 'Operational').length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">Total Power Load</div>
              <div className="text-2xl font-black text-indigo-700">
                {units.reduce((acc, u) => acc + u.powerLoadKw, 0)} <span className="text-xs font-bold text-indigo-500">KW</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Total Workforce</div>
              <div className="text-2xl font-black text-amber-700">
                {units.reduce((acc, u) => acc + u.workforce, 0)} <span className="text-xs font-bold text-amber-500">Staff</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Factory Units Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {units.map((unit) => {
          const isOperational = unit.status === 'Operational';
          return (
            <div 
              key={unit.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    isOperational 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {unit.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    {unit.id}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {unit.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{unit.plotNo}, {unit.midcArea}, {unit.district}</span>
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-medium block">Built-up Area</span>
                    <span className="font-bold text-slate-800">{unit.builtUpAreaSqFt.toLocaleString()} sq.ft</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-medium block">Connected Power</span>
                    <span className="font-bold text-slate-800">{unit.powerLoadKw} KW (HT)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-medium block">Workforce</span>
                    <span className="font-bold text-slate-800">{unit.workforce} Employees</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-medium block">MPCB Category</span>
                    <span className="font-bold text-amber-700">{unit.pollutionCategory} Category</span>
                  </div>
                </div>

                {/* Clearances Status Pill */}
                <div className="flex items-center gap-2 text-[11px] pt-1">
                  <span className={`inline-flex items-center gap-1 font-bold ${unit.dishApproval ? 'text-emerald-700' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> DISH Approval
                  </span>
                  <span>•</span>
                  <span className={`inline-flex items-center gap-1 font-bold ${unit.fireNoc ? 'text-emerald-700' : 'text-amber-600'}`}>
                    {unit.fireNoc ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />} 
                    Fire NOC
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedUnit(unit)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => setSelectedUnit(unit)}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  title="Edit Factory Unit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Modal: Add Factory Unit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900">Register New Factory / Industrial Unit</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddUnit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Unit / Plant Name *</label>
                <input
                  type="text"
                  required
                  value={newUnitForm.name}
                  onChange={(e) => setNewUnitForm({ ...newUnitForm, name: e.target.value })}
                  placeholder="e.g. Nashik Die Casting Plant 2"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">District *</label>
                  <select
                    value={newUnitForm.district}
                    onChange={(e) => setNewUnitForm({ ...newUnitForm, district: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Nashik">Nashik</option>
                    <option value="Pune">Pune</option>
                    <option value="Thane">Thane</option>
                    <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Kolhapur">Kolhapur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Plot Number *</label>
                  <input
                    type="text"
                    required
                    value={newUnitForm.plotNo}
                    onChange={(e) => setNewUnitForm({ ...newUnitForm, plotNo: e.target.value })}
                    placeholder="e.g. Plot No. E-21"
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">MIDC Industrial Area / Zone *</label>
                <input
                  type="text"
                  required
                  value={newUnitForm.midcArea}
                  onChange={(e) => setNewUnitForm({ ...newUnitForm, midcArea: e.target.value })}
                  placeholder="e.g. Ambad MIDC, Satpur MIDC, Chakan Phase-2"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Built-up (sq.ft)</label>
                  <input
                    type="number"
                    value={newUnitForm.builtUpAreaSqFt}
                    onChange={(e) => setNewUnitForm({ ...newUnitForm, builtUpAreaSqFt: Number(e.target.value) })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Power (KW)</label>
                  <input
                    type="number"
                    value={newUnitForm.powerLoadKw}
                    onChange={(e) => setNewUnitForm({ ...newUnitForm, powerLoadKw: Number(e.target.value) })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Workforce</label>
                  <input
                    type="number"
                    value={newUnitForm.workforce}
                    onChange={(e) => setNewUnitForm({ ...newUnitForm, workforce: Number(e.target.value) })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Save Factory Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: View Unit Details */}
      {selectedUnit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Factory Unit Dossier</h3>
                <p className="text-[11px] text-slate-500">{selectedUnit.id}</p>
              </div>
              <button onClick={() => setSelectedUnit(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit Name</span>
                <div className="font-extrabold text-slate-900 text-sm">{selectedUnit.name}</div>
                <div className="text-slate-600 text-[11px]">{selectedUnit.type}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Factory License</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">{selectedUnit.licenseNo}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Commencement</span>
                  <span className="font-bold text-slate-800">{selectedUnit.commencementDate}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Statutory Compliance Status</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DISH Approved Plan</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>MPCB CTE / CTO Valid</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>MSEDCL HT Sanction</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>MIDC Water Allotment</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedUnit(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
