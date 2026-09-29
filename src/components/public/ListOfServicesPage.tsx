import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader, PublicFooter } from './PublicHeader';
import { MASTER_SERVICE_CATALOGUE, CatalogServiceItem } from '../ApplyVerifyPermissionView';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  FileText, 
  Clock, 
  IndianRupee, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Layers, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const ListOfServicesPage: React.FC = () => {
  const navigate = useNavigate();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  // Modal State for View Requirements
  const [activeReqService, setActiveReqService] = useState<CatalogServiceItem | null>(null);

  // Departments List
  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    MASTER_SERVICE_CATALOGUE.forEach(s => set.add(s.department));
    return Array.from(set);
  }, []);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return MASTER_SERVICE_CATALOGUE.filter(srv => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = srv.name.toLowerCase().includes(q);
        const matchDept = srv.department.toLowerCase().includes(q);
        const matchCode = srv.code.toLowerCase().includes(q);
        const matchCat = srv.category.toLowerCase().includes(q);
        if (!matchName && !matchDept && !matchCode && !matchCat) return false;
      }

      // Department filter
      if (selectedDept !== 'ALL' && srv.department !== selectedDept) {
        return false;
      }

      // Stage filter
      if (selectedStage !== 'ALL' && srv.stage !== selectedStage) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedDept, selectedIndustry, selectedStage, selectedDistrict]);

  const handleApplyClick = (service: CatalogServiceItem) => {
    // Navigate to unified portal / login
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PublicHeader 
        title="List of Services" 
        subtitle="Searchable Master Service Catalogue across Maharashtra Departments"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/apply-verify')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Apply & Verify Hub</span>
          </button>

          <span className="text-xs font-bold text-slate-500">
            Showing <strong className="text-emerald-700">{filteredServices.length}</strong> of {MASTER_SERVICE_CATALOGUE.length} Available Services
          </span>
        </div>

        {/* Hero Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Master Service Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore all statutory clearances, NOCs, licenses, registrations and utility connection permissions offered under Government of Maharashtra single window ecosystem.
          </p>
        </div>

        {/* Search & Multi-Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 mb-8 shadow-xs space-y-4">
          
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search permission, department, statutory keyword, license code (e.g. MPCB, DISH, Fire NOC, Water)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            
            {/* Department Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wide">
                Filter by Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="ALL">All Departments (14 Departments)</option>
                {departmentsList.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Approval Stage */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wide">
                Clearance Stage
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="ALL">All Lifecycle Stages</option>
                <option value="Pre-Establishment">Pre-Establishment (Before Construction)</option>
                <option value="Pre-Operation">Pre-Operation (Before Commissioning)</option>
                <option value="Expansion">Expansion / Modifications</option>
                <option value="Post-Commissioning">Post-Commissioning & Renewals</option>
              </select>
            </div>

            {/* Industry Focus */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wide">
                Industry Category
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="ALL">All Industry Sectors</option>
                <option value="Manufacturing">Manufacturing & Engineering</option>
                <option value="Chemical">Chemicals & Hazardous</option>
                <option value="Pharma">Pharmaceuticals</option>
                <option value="Food">Food Processing</option>
                <option value="IT">IT & Electronics</option>
              </select>
            </div>

          </div>

          {(searchQuery || selectedDept !== 'ALL' || selectedStage !== 'ALL') && (
            <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100">
              <span className="text-slate-500">Active filters applied</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDept('ALL');
                  setSelectedStage('ALL');
                  setSelectedIndustry('ALL');
                }}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {service.code}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {service.stage}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                  {service.name}
                </h3>
                <p className="text-xs font-semibold text-teal-700 mb-3">
                  {service.department}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                  {service.whyRequired}
                </p>

                {/* Service Specs */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50 rounded-2xl text-xs text-slate-600 mb-4">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Documents</span>
                    <span className="font-bold text-slate-800">{service.docsCount} Mandatory</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Statutory SLA</span>
                    <span className="font-bold text-slate-800">{service.sla}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Fee</span>
                    <span className="font-bold text-slate-800">{service.fees}</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom CTA Actions */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveReqService(service)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Requirements</span>
                </button>

                <button
                  onClick={() => handleApplyClick(service)}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No Services Found</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try adjusting your search query or department filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('ALL');
                setSelectedStage('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* View Requirements Modal */}
        {activeReqService && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {activeReqService.code}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    {activeReqService.name}
                  </h3>
                  <p className="text-xs text-teal-700 font-semibold">
                    {activeReqService.department}
                  </p>
                </div>
                <button
                  onClick={() => setActiveReqService(null)}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Scope & Objective:</h4>
                  <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {activeReqService.whyRequired}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Mandatory Document Checklist ({activeReqService.requiredDocsList.length}):</h4>
                  <div className="space-y-2">
                    {activeReqService.requiredDocsList.map((doc, i) => (
                      <div key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-800 font-medium">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">Statutory SLA</span>
                    <strong className="text-slate-800 text-sm">{activeReqService.sla}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">Govt Fee</span>
                    <strong className="text-slate-800 text-sm">{activeReqService.fees}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveReqService(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setActiveReqService(null);
                    handleApplyClick(activeReqService);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
                >
                  <span>Apply for This Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
