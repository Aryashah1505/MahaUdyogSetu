import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvestHeader, InvestFooter } from './InvestHeader';
import { DEFAULT_INVESTMENT_PLAN, InvestmentPlanState, PlanItem } from '../../data/investStore';
import { BusinessProfile } from '../../types';
import { 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  FileCheck2, 
  Calculator, 
  FlaskConical, 
  Layers, 
  Download,
  Info,
  Building2,
  MapPin,
  TrendingUp
} from 'lucide-react';

interface InvestmentPlannerPageProps {
  profile?: BusinessProfile;
}

export const InvestmentPlannerPage: React.FC<InvestmentPlannerPageProps> = ({ profile }) => {
  const navigate = useNavigate();

  // Active Plan ID from database if loaded
  const [activePlanId, setActivePlanId] = useState<string>('');

  // Load active plan state or default
  const [planState, setPlanState] = useState<InvestmentPlanState>(() => {
    try {
      const saved = localStorage.getItem('mahau_investment_plan');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      ...DEFAULT_INVESTMENT_PLAN,
      projectName: profile?.name ? `${profile.name} Expansion Project` : DEFAULT_INVESTMENT_PLAN.projectName,
      industrySector: profile?.sector || DEFAULT_INVESTMENT_PLAN.industrySector,
      location: profile?.address || DEFAULT_INVESTMENT_PLAN.location
    };
  });

  // Fetch from backend API on mount
  useEffect(() => {
    const loadPlanFromBackend = async () => {
      try {
        const token = localStorage.getItem('mahau_auth_token') || sessionStorage.getItem('mahau_auth_token');
        const response = await fetch('/api/invest-plans', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && Array.isArray(resData.plans) && resData.plans.length > 0) {
            const latest = resData.plans[0];
            setActivePlanId(latest.id);
            const mappedPlan: InvestmentPlanState = {
              projectName: latest.projectName,
              industrySector: latest.industrySector,
              location: latest.location,
              investmentCr: latest.investmentCr,
              items: latest.items,
              lastUpdated: latest.lastUpdated
            };
            setPlanState(mappedPlan);
            localStorage.setItem('mahau_investment_plan', JSON.stringify(mappedPlan));
          }
        }
      } catch (err) {
        // use fallback state
      }
    };

    loadPlanFromBackend();
  }, []);

  // New Custom Item modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemSubtitle, setNewItemSubtitle] = useState('');
  const [newItemCat, setNewItemCat] = useState<'approval' | 'incentive' | 'testing' | 'document' | 'action'>('approval');

  // Sync to Backend API & localStorage
  const savePlan = async (newPlan: InvestmentPlanState) => {
    setPlanState(newPlan);
    try {
      localStorage.setItem('mahau_investment_plan', JSON.stringify(newPlan));
    } catch (e) {}

    try {
      const token = localStorage.getItem('mahau_auth_token') || sessionStorage.getItem('mahau_auth_token');
      if (activePlanId) {
        await fetch(`/api/invest-plans/${encodeURIComponent(activePlanId)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            projectName: newPlan.projectName,
            industrySector: newPlan.industrySector,
            location: newPlan.location,
            investmentCr: newPlan.investmentCr,
            items: newPlan.items
          })
        });
      } else {
        const response = await fetch('/api/invest-plans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            projectName: newPlan.projectName,
            industrySector: newPlan.industrySector,
            location: newPlan.location,
            investmentCr: newPlan.investmentCr,
            items: newPlan.items
          })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.plan?.id) {
            setActivePlanId(data.plan.id);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const toggleItemComplete = (id: string) => {
    const updatedItems = planState.items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    savePlan({ ...planState, items: updatedItems });
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = planState.items.filter(item => item.id !== id);
    savePlan({ ...planState, items: updatedItems });
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: PlanItem = {
      id: `custom-plan-${Date.now()}`,
      category: newItemCat,
      title: newItemTitle.trim(),
      subtitle: newItemSubtitle.trim() || 'Custom user planning milestone',
      completed: false
    };

    savePlan({ ...planState, items: [...planState.items, newItem] });
    setNewItemTitle('');
    setNewItemSubtitle('');
    setShowAddModal(false);
  };

  // Readiness Calculation
  const totalItems = planState.items.length;
  const completedCount = planState.items.filter(i => i.completed).length;
  const readinessPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // Breakdown counts
  const approvalsCount = planState.items.filter(i => i.category === 'approval').length;
  const incentivesCount = planState.items.filter(i => i.category === 'incentive').length;
  const testingCount = planState.items.filter(i => i.category === 'testing').length;
  const docsCount = planState.items.filter(i => i.category === 'document').length;
  const actionsCount = planState.items.filter(i => i.category === 'action').length;

  const handleDownloadChecklist = () => {
    const text = `========================================================
GOVERNMENT OF MAHARASHTRA • MAHAUDYOGSETU
PERSONALIZED INVESTMENT PLAN & READINESS DOSSIER
========================================================

Project Name:        ${planState.projectName}
Industry Sector:     ${planState.industrySector}
Location:            ${planState.location}
Investment Outlay:   ₹ ${planState.investmentCr} Crores
Investment Readiness Score: ${readinessPercent}% (${completedCount}/${totalItems} Milestones Completed)

--------------------------------------------------------
01 — STATUTORY CLEARANCES & APPROVALS (${approvalsCount}):
--------------------------------------------------------
${planState.items.filter(i => i.category === 'approval').map(i => `[${i.completed ? 'COMPLETED' : 'PENDING'}] ${i.title}\n    ${i.subtitle}`).join('\n\n')}

--------------------------------------------------------
02 — STATE INCENTIVES & SUBSIDIES (${incentivesCount}):
--------------------------------------------------------
${planState.items.filter(i => i.category === 'incentive').map(i => `[${i.completed ? 'COMPLETED' : 'PENDING'}] ${i.title}\n    ${i.subtitle}`).join('\n\n')}

--------------------------------------------------------
03 — TESTING & CERTIFICATION (${testingCount}):
--------------------------------------------------------
${planState.items.filter(i => i.category === 'testing').map(i => `[${i.completed ? 'COMPLETED' : 'PENDING'}] ${i.title}\n    ${i.subtitle}`).join('\n\n')}

--------------------------------------------------------
04 — COMPLIANCE DOCUMENTS & ACTIONS:
--------------------------------------------------------
${planState.items.filter(i => i.category === 'document' || i.category === 'action').map(i => `[${i.completed ? 'COMPLETED' : 'PENDING'}] ${i.title}\n    ${i.subtitle}`).join('\n\n')}

========================================================
Generated via MahaUdyogSetu • Maharashtra Industry Bridge
Date: ${new Date().toLocaleDateString('en-GB')}
========================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${planState.projectName.replace(/\s+/g, '_')}_Investment_Plan.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InvestHeader 
        title="Personalized Investment Plan"
        subtitle="Save approvals, incentives and testing requirements into one personalized investment checklist."
        profile={profile}
        activePath="/invest/planner"
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/invest')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Invest in Maharashtra</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Milestone</span>
          </button>
        </div>

        {/* HERO PROJECT SUMMARY & READINESS SCORE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Active Investment Profile</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                {planState.projectName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {planState.industrySector} • {planState.location} • ₹{planState.investmentCr} Cr Outlay
              </p>
            </div>

            {/* Circular Readiness Widget */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Investment Readiness</span>
                <div className="text-2xl font-black text-blue-700">{readinessPercent}%</div>
                <span className="text-[10px] text-slate-500">{completedCount} of {totalItems} completed</span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 flex items-center justify-center font-bold text-xs text-blue-700">
                {readinessPercent}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-4">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>Next recommended milestone: <strong className="text-slate-800">Complete Environmental Approval Documentation</strong></span>
              <span>Last updated: {planState.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* SUMMARY BADGES OF COMBINED ECOSYSTEM */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div 
            onClick={() => navigate('/invest/know-your-approvals')}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Approvals</span>
              <div className="text-lg font-black text-blue-700">{approvalsCount} Identified</div>
            </div>
            <FileCheck2 className="w-5 h-5 text-blue-600 opacity-80" />
          </div>

          <div 
            onClick={() => navigate('/invest/incentive-calculator')}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 transition-all cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Incentives</span>
              <div className="text-lg font-black text-teal-700">{incentivesCount} Projected</div>
            </div>
            <Calculator className="w-5 h-5 text-teal-600 opacity-80" />
          </div>

          <div 
            onClick={() => navigate('/invest/testing-labs')}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 transition-all cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Testing Facilities</span>
              <div className="text-lg font-black text-purple-700">{testingCount} Linked</div>
            </div>
            <FlaskConical className="w-5 h-5 text-purple-600 opacity-80" />
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Key Actions</span>
              <div className="text-lg font-black text-slate-800">{actionsCount + docsCount} Tasks</div>
            </div>
            <CheckSquare className="w-5 h-5 text-slate-600 opacity-80" />
          </div>
        </div>

        {/* CHECKLIST SECTIONS */}
        <div className="space-y-6 mb-10">
          
          {/* 01 — Approvals */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-black">01</span>
                <span>Statutory Approvals & Clearances ({approvalsCount})</span>
              </h3>
              <button
                onClick={() => navigate('/invest/know-your-approvals')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                + Add Approvals
              </button>
            </div>

            <div className="space-y-2.5">
              {planState.items.filter(i => i.category === 'approval').map(item => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    item.completed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleItemComplete(item.id)}
                      className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-blue-500" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-xs font-bold ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.subtitle}</p>
                      {item.departmentOrAgency && (
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 text-slate-700">
                          {item.departmentOrAgency}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Remove from plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 02 — Incentives */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center text-xs font-black">02</span>
                <span>State Fiscal Incentives & Subsidies ({incentivesCount})</span>
              </h3>
              <button
                onClick={() => navigate('/invest/incentive-calculator')}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                + Calculate Incentives
              </button>
            </div>

            <div className="space-y-2.5">
              {planState.items.filter(i => i.category === 'incentive').map(item => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    item.completed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleItemComplete(item.id)}
                      className="mt-0.5 text-slate-400 hover:text-teal-600 transition-colors"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-teal-500" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-xs font-bold ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 03 — Testing & Certification */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center text-xs font-black">03</span>
                <span>Testing & Certification Facilities ({testingCount})</span>
              </h3>
              <button
                onClick={() => navigate('/invest/testing-labs')}
                className="text-xs font-bold text-purple-700 hover:underline"
              >
                + Find Labs
              </button>
            </div>

            <div className="space-y-2.5">
              {planState.items.filter(i => i.category === 'testing').map(item => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    item.completed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleItemComplete(item.id)}
                      className="mt-0.5 text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-purple-500" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-xs font-bold ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 04 & 05 — Documents & Important Actions */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center text-xs font-black">04</span>
                <span>Mandatory Documents & Important Actions ({docsCount + actionsCount})</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {planState.items.filter(i => i.category === 'document' || i.category === 'action').map(item => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    item.completed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleItemComplete(item.id)}
                      className="mt-0.5 text-slate-400 hover:text-amber-600 transition-colors"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-amber-500" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-xs font-bold ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
          <button
            onClick={handleDownloadChecklist}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Investment Plan Dossier</span>
          </button>

          <button
            onClick={() => navigate('/services-provided')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Proceed to Unified Clearances</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Modal for adding custom milestone */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Add Custom Planning Milestone</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 font-bold">✕</button>
              </div>

              <form onSubmit={handleAddNewItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newItemCat}
                    onChange={(e: any) => setNewItemCat(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="approval">01 — Statutory Approval</option>
                    <option value="incentive">02 — Incentive Milestone</option>
                    <option value="testing">03 — Testing / Quality Audit</option>
                    <option value="document">04 — Compliance Document</option>
                    <option value="action">05 — Important Action</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    placeholder="e.g. Procure Boiler Inspection Certificate"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
                  <input
                    type="text"
                    value={newItemSubtitle}
                    onChange={(e) => setNewItemSubtitle(e.target.value)}
                    placeholder="e.g. Schedule DISH boiler inspector on-site visit"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                  >
                    Add Milestone
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <InvestFooter />
    </div>
  );
};
