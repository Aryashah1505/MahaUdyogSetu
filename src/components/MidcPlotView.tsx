import React, { useState } from 'react';
import { 
  Landmark, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Droplet, 
  Zap, 
  Building2, 
  Layers, 
  Calendar,
  AlertCircle,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface MidcPlotViewProps {
  profile: BusinessProfile;
  onBackToDashboard?: () => void;
}

export const MidcPlotView: React.FC<MidcPlotViewProps> = ({ profile, onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'allotment' | 'documents' | 'utilities'>('allotment');

  const plotDetails = {
    plotNo: profile.plotNumber || 'Plot No. W-18/2',
    industrialArea: 'Ambad Industrial Area, MIDC',
    district: profile.district || 'Nashik',
    subDivision: 'MIDC Nashik Division',
    totalAreaSqMtr: '4,500 Sq. Mtrs (approx 1.11 Acres)',
    builtUpAreaSqFt: `${(profile.builtUpAreaSqFt || 45000).toLocaleString()} Sq. Ft`,
    allotmentOrderNo: 'MIDC/RO-NSK/ALLOT/2020/4891',
    allotmentDate: '14 Oct 2020',
    possessionDate: '02 Dec 2020',
    leasePeriod: '95 Years Long-term Industrial Lease',
    leaseDeedRegNo: 'BMA-4/8892/2021 (Registered at Sub-Registrar Nashik)',
    currentStatus: 'Possession Handed Over & Operational',
    fsiPermissible: '1.50 (MIDC Standard Industrial FSI)',
    waterQuota: '15,000 Litres/Day (15 KLD) via 50mm MIDC Pipeline',
    powerFeeder: '11 KV Express Industrial Feeder (Ambad Substation)',
    landUseZone: 'Heavy & General Engineering Manufacturing'
  };

  const documents = [
    {
      id: 'DOC-MIDC-01',
      title: 'MIDC Final Land Allotment Order',
      refNo: 'MIDC/RO-NSK/2020/4891',
      date: '14 Oct 2020',
      status: 'Verified',
      fileSize: '1.8 MB'
    },
    {
      id: 'DOC-MIDC-02',
      title: 'Physical Land Possession Handover Receipt & Demarcation Plan',
      refNo: 'POSS/NSK/AMB/18-2',
      date: '02 Dec 2020',
      status: 'Verified',
      fileSize: '3.2 MB'
    },
    {
      id: 'DOC-MIDC-03',
      title: 'Registered 95-Year Industrial Lease Deed',
      refNo: 'REG/SR-NSK/8892/2021',
      date: '18 Jan 2021',
      status: 'Verified',
      fileSize: '4.5 MB'
    },
    {
      id: 'DOC-MIDC-04',
      title: 'Approved Architectural Layout & Building Plan (Special Planning Authority)',
      refNo: 'MIDC/SPA/BP/2021/302',
      date: '10 Mar 2021',
      status: 'Verified',
      fileSize: '8.4 MB'
    },
    {
      id: 'DOC-MIDC-05',
      title: 'Building Completion Certificate (BCC) & Occupancy Certificate (OC)',
      refNo: 'MIDC/SPA/BCC/2022/91',
      date: '15 Sep 2022',
      status: 'Verified',
      fileSize: '2.1 MB'
    }
  ];

  const handleDownloadDoc = (docTitle: string) => {
    const text = `MAHAUDYOGSETU - MIDC LAND VAULT COPY\nDocument: ${docTitle}\nPlot: ${plotDetails.plotNo}, ${plotDetails.industrialArea}\nAllottee: ${profile.name}\nStatus: Officially Verified with MIDC Land Bank Database`;
    const blob = new Blob([text], { type: 'text/plain' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = `${docTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
                <span>MIDC Single Window Land Bank Record</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">{profile.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Landmark className="w-6 h-6 text-blue-600" />
              <span>MIDC Industrial Plot Allotment Details</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
              Official plot demarcation, 95-year lease deeds, utility linkages, and land records registered under Maharashtra Industrial Development Corporation.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Lease Active & Verified</span>
            </span>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Plot Demarcation</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">{plotDetails.plotNo}</span>
            <span className="text-[11px] text-slate-500">{plotDetails.industrialArea}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Land Area</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">{plotDetails.totalAreaSqMtr}</span>
            <span className="text-[11px] text-emerald-600 font-bold">Built-up: {plotDetails.builtUpAreaSqFt}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Lease Tenure</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">95 Years</span>
            <span className="text-[11px] text-slate-500">Exp: Oct 2115</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Water Supply Sanction</span>
            <span className="text-base font-black text-blue-700 mt-0.5 block">15 KLD</span>
            <span className="text-[11px] text-slate-500">MIDC Industrial Pipeline</span>
          </div>
        </div>
      </div>

      {/* 2. Detail Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('allotment')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'allotment'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Plot Allotment & Demarcation
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Statutory Land Documents ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('utilities')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'utilities'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            MIDC Infrastructure & Utilities
          </button>
        </div>

        {/* Tab 1: Allotment Details */}
        {activeTab === 'allotment' && (
          <div className="p-6 space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  Allotment & Ownership Details
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Allottee Entity:</span>
                    <span className="font-bold text-slate-900">{profile.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Allotment Order Number:</span>
                    <span className="font-mono font-bold text-slate-800">{plotDetails.allotmentOrderNo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Allotment Order Date:</span>
                    <span className="font-bold text-slate-800">{plotDetails.allotmentDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Physical Possession Date:</span>
                    <span className="font-bold text-slate-800">{plotDetails.possessionDate}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Registered Lease Deed:</span>
                    <span className="font-mono font-bold text-slate-800">{plotDetails.leaseDeedRegNo}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  Land Specification & Zoning
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">MIDC Industrial Zone:</span>
                    <span className="font-bold text-slate-900">{plotDetails.industrialArea}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">District / Regional Office:</span>
                    <span className="font-bold text-slate-800">{plotDetails.subDivision}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Land Use Category:</span>
                    <span className="font-bold text-slate-800">{plotDetails.landUseZone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Permissible FSI / Ground Coverage:</span>
                    <span className="font-bold text-slate-800">{plotDetails.fsiPermissible}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Current Operating Status:</span>
                    <span className="font-bold text-emerald-700">{plotDetails.currentStatus}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Land Documents */}
        {activeTab === 'documents' && (
          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Official Reference No.</th>
                    <th className="py-3 px-4">Registration Date</th>
                    <th className="py-3 px-4">Verification Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{doc.title}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">{doc.refNo}</td>
                      <td className="py-3.5 px-4 text-slate-600">{doc.date}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{doc.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDownloadDoc(doc.title)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Utilities */}
        {activeTab === 'utilities' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Droplet className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">MIDC Potable & Industrial Water</h4>
                <p className="text-slate-600 text-xs">
                  Sanctioned quota of <strong>15 KLD</strong> via direct dedicated 50mm MIDC distribution main.
                </p>
                <div className="text-[11px] font-mono text-slate-500 pt-1">
                  Consumer No: MIDC-WTR-NSK-4491
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">Industrial Power Connectivity</h4>
                <p className="text-slate-600 text-xs">
                  Connected to 11 KV express industrial feeder with sanctioned load of <strong>{profile.connectedPowerKw || 350} KW (HT)</strong>.
                </p>
                <div className="text-[11px] font-mono text-slate-500 pt-1">
                  MSEDCL Consumer ID: 049012389102
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">CETP / Drainage Connectivity</h4>
                <p className="text-slate-600 text-xs">
                  Connected to Ambad MIDC Common Effluent Treatment Plant (CETP) with treated discharge pipeline.
                </p>
                <div className="text-[11px] font-mono text-slate-500 pt-1">
                  CETP Member ID: CETP-AMB-208
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
