import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvestHeader, InvestFooter } from './InvestHeader';
import { INITIAL_TESTING_LABS, TestingLabItem } from '../../data/investStore';
import { BusinessProfile } from '../../types';
import { 
  FlaskConical, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Filter, 
  ShieldCheck, 
  ExternalLink,
  Plus,
  CheckSquare,
  Navigation
} from 'lucide-react';

interface TestingLabsPageProps {
  profile?: BusinessProfile;
}

export const TestingLabsPage: React.FC<TestingLabsPageProps> = ({ profile }) => {
  const navigate = useNavigate();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedAccreditation, setSelectedAccreditation] = useState('ALL');

  // Selected Lab modal detail
  const [selectedLabDetail, setSelectedLabDetail] = useState<TestingLabItem | null>(null);

  // Added Labs in Plan state
  const [addedLabs, setAddedLabs] = useState<Record<string, boolean>>({});

  const testingCategories = [
    'ALL',
    'Material Testing',
    'Chemical Testing',
    'Environmental Testing',
    'Food Testing',
    'Pharmaceutical Testing',
    'Electrical Testing',
    'Mechanical Testing',
    'Product Certification',
    'Calibration'
  ];

  // Filtered Labs
  const filteredLabs = useMemo(() => {
    return INITIAL_TESTING_LABS.filter(lab => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = lab.name.toLowerCase().includes(q);
        const matchCity = lab.city.toLowerCase().includes(q);
        const matchServices = lab.services.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchServices) return false;
      }

      if (selectedDistrict !== 'ALL' && lab.district !== selectedDistrict) {
        return false;
      }

      if (selectedCategory !== 'ALL' && !lab.categories.includes(selectedCategory)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedDistrict, selectedCategory]);

  const handleToggleAddLab = (id: string, name: string) => {
    setAddedLabs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InvestHeader 
        title="Testing Labs in Maharashtra"
        subtitle="Find relevant testing and certification facilities for your industry."
        profile={profile}
        activePath="/invest/testing-labs"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/invest')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-purple-700 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Invest in Maharashtra</span>
          </button>

          <span className="text-xs font-bold text-slate-500">
            Showing <strong className="text-purple-700">{filteredLabs.length}</strong> of {INITIAL_TESTING_LABS.length} Accredited Facilities
          </span>
        </div>

        {/* Hero Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>NABL & BIS Accredited Testing Directory</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Accredited Testing & Certification Laboratories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find certified testing infrastructure for material tensile tests, chemical composition, environmental effluent audits, and product homologation across Maharashtra.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 mb-8 shadow-xs space-y-4">
          
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by laboratory name, specialized test (e.g. CMM, NDT, Emission, Heavy Metal) or city..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Testing Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white"
              >
                {testingCategories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'ALL' ? 'All Testing Categories' : cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">District / City</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white"
              >
                <option value="ALL">All Maharashtra Districts</option>
                <option value="Mumbai Suburban">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Nashik">Nashik</option>
                <option value="Thane">Navi Mumbai / Thane</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Aurangabad">Aurangabad (Chhatrapati Sambhajinagar)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDistrict('ALL');
                  setSelectedCategory('ALL');
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all"
              >
                Reset All Filters
              </button>
            </div>

          </div>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLabs.map(lab => {
            const isAdded = addedLabs[lab.id];
            return (
              <div 
                key={lab.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {lab.categories.map((c, i) => (
                        <span key={i} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                          {c}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                      {lab.city}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {lab.name}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{lab.address}</span>
                  </p>

                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-bold text-slate-600 block uppercase">Key Testing Services:</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {lab.services.slice(0, 3).map((srv, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span>{srv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Accreditation</span>
                      <strong className="text-slate-800">{lab.accreditation.join(' • ')}</strong>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => setSelectedLabDetail(lab)}
                    className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    View Full Services
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(lab.name + ' ' + lab.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                      title="Get Directions"
                    >
                      <Navigation className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleToggleAddLab(lab.id, lab.name)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isAdded 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>In Plan</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Modal for Lab Details */}
        {selectedLabDetail && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                    {selectedLabDetail.city} Facility
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    {selectedLabDetail.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLabDetail(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Facility Address:</span>
                  <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700">
                    {selectedLabDetail.address}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block mb-1">Complete Scope of Testing Services:</span>
                  <div className="space-y-1.5">
                    {selectedLabDetail.services.map((srv, idx) => (
                      <div key={idx} className="p-2 bg-purple-50/50 rounded-lg border border-purple-100 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="text-slate-900 font-medium">{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Email Contact</span>
                    <strong className="text-slate-800">{selectedLabDetail.contact}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Phone Desk</span>
                    <strong className="text-slate-800">{selectedLabDetail.phone}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedLabDetail(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    handleToggleAddLab(selectedLabDetail.id, selectedLabDetail.name);
                    setSelectedLabDetail(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700"
                >
                  Add Testing Requirement to Plan
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <InvestFooter />
    </div>
  );
};
