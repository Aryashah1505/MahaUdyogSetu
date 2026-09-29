import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Clock, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ChevronDown,
  Layers,
  Search,
  Scale
} from 'lucide-react';

interface ExecutiveBriefingProps {
  onExploreFlowchart: () => void;
  onLaunchApplicantDemo: () => void;
  onLaunchDepartmentDemo: () => void;
}

export const ExecutiveBriefing: React.FC<ExecutiveBriefingProps> = ({
  onExploreFlowchart,
  onLaunchApplicantDemo,
  onLaunchDepartmentDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'nsws_gap' | 'solutions'>('problem');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Executive Card (Light Theme) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            MahaUdyogSetu • Next-Gen Single-Window Clearance & Compliance Engine
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3">
            Intelligent Business Clearance & Compliance Architecture
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Moving beyond passive directory forms into an active, data-driven single source of truth. Features AI regulatory mapping, pre-validation document vaults, risk-based green channels, and synchronized multi-department joint inspections.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onLaunchApplicantDemo}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Building2 className="w-4 h-4" />
              Applicant Clearance Journey
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLaunchDepartmentDemo}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 transition-all border border-slate-200"
            >
              <ShieldCheck className="w-4 h-4" />
              Department Scrutiny Portal
            </button>
            <button
              onClick={onExploreFlowchart}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 transition-all border border-slate-200"
            >
              <Layers className="w-4 h-4" />
              Architecture Flowchart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Pill Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('problem')}
          className={`pb-3 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'problem'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          The Core Challenge
        </button>
        <button
          onClick={() => setActiveTab('nsws_gap')}
          className={`pb-3 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'nsws_gap'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          Single-Window Evolution
        </button>
        <button
          onClick={() => setActiveTab('solutions')}
          className={`pb-3 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'solutions'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          System Innovations
        </button>
      </div>

      {/* Tab 1: Problem */}
      {activeTab === 'problem' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 text-base mb-2">1. Fragmented Scrutiny</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Businesses historically had to interact with 5+ separate departments (MPCB, DISH, Fire, DISCOM, MIDC), resubmitting identical company identity documents to each.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 text-base mb-2">2. Uncoordinated Inspections</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multiple physical visits on different days disrupted factory construction schedules and delayed project commission timelines.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 text-base mb-2">3. Clerical Query Delays</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Minor clerical errors on drawings caused weeks of back-and-forth communication.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: NSWS Gap */}
      {activeTab === 'nsws_gap' && (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs space-y-4">
          <h3 className="text-lg font-black text-slate-900">Closing the Interoperability Gap</h3>
          <p className="text-slate-600 leading-relaxed">
            MahaUdyogSetu connects directly with state and central regulatory frameworks, auto-mapping parameters from verified enterprise profiles to ensure zero compliance omissions.
          </p>
        </div>
      )}

      {/* Tab 3: Solutions */}
      {activeTab === 'solutions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-xl bg-white border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1">Single Document Vault</h4>
            <p className="text-slate-600">Store once, auto-inject into all department dossiers.</p>
          </div>
          <div className="p-5 rounded-xl bg-white border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1">Joint Synchronized Site Visit</h4>
            <p className="text-slate-600">Unified single inspection across Pollution, Fire, and Safety.</p>
          </div>
        </div>
      )}
    </div>
  );
};
