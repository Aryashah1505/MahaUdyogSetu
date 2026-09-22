import React, { useState } from 'react';
import { 
  INITIAL_BUSINESS_PROFILES, 
  INITIAL_APPROVALS, 
  INITIAL_DOCUMENTS, 
  DEPARTMENT_METRICS, 
  INCENTIVE_SCHEMES 
} from './data/mockData';
import { BusinessProfile } from './types';
import { ExecutiveBriefing } from './components/ExecutiveBriefing';
import { ProcessFlowchartViewer } from './components/ProcessFlowchartViewer';
import { ApplicantDashboard } from './components/ApplicantDashboard';
import { DepartmentDashboard } from './components/DepartmentDashboard';
import { 
  Building2, 
  ShieldCheck, 
  GitBranch, 
  FileText, 
  Sparkles, 
  Bell, 
  Search, 
  ChevronDown, 
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';

export default function App() {
  // Navigation view: 'applicant' | 'department' | 'flowchart' | 'briefing'
  const [currentView, setCurrentView] = useState<'applicant' | 'department' | 'flowchart' | 'briefing'>('applicant');
  
  // Selected enterprise profile
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const activeProfile = INITIAL_BUSINESS_PROFILES[selectedProfileIndex];

  // Global state for live interaction across views
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [departmentMetrics, setDepartmentMetrics] = useState(DEPARTMENT_METRICS);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Universal GovTech Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand & Emblem */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0 font-black text-lg">
                US
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    UdyogSetu <span className="text-indigo-600 text-sm font-semibold">(उद्योग सेतु)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    SIH Innovation
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Next-Gen Single Window Business Clearance & Compliance Intelligence
                </p>
              </div>
            </div>

            {/* View Navigation Switcher */}
            <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
              <button
                onClick={() => setCurrentView('applicant')}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentView === 'applicant'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Applicant Dashboard</span>
              </button>

              <button
                onClick={() => setCurrentView('department')}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentView === 'department'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Government Portal</span>
              </button>

              <button
                onClick={() => setCurrentView('flowchart')}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentView === 'flowchart'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Interactive Flowchart</span>
                <span className="md:hidden">Flow</span>
              </button>

              <button
                onClick={() => setCurrentView('briefing')}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  currentView === 'briefing'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Problem & Solutions</span>
                <span className="md:hidden">Brief</span>
              </button>
            </nav>

            {/* Profile Switcher & Fast Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-400">Profile:</span>
                <select
                  value={selectedProfileIndex}
                  onChange={(e) => setSelectedProfileIndex(Number(e.target.value))}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  {INITIAL_BUSINESS_PROFILES.map((p: BusinessProfile, i: number) => (
                    <option key={p.id} value={i} className="dark:bg-slate-900">
                      {p.name.slice(0, 22)}... ({p.scale})
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Live System Operational Ticker */}
        <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 border-t border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                <strong>NSWS v2 Interoperability Layer:</strong> Synchronized with National Single Window System & State Portals
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-[10px]">
              <span>AI Regulatory Engine: <strong>Gemini 3.8 Flash Online</strong></span>
              <span>•</span>
              <span>DigiLocker Reusable Vault: <strong>Ready</strong></span>
              <span>•</span>
              <span>48h Fast-Track Scrutiny: <strong>Active</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'applicant' && (
          <ApplicantDashboard
            profile={activeProfile}
            approvals={approvals}
            documents={documents}
            schemes={INCENTIVE_SCHEMES}
            onUpdateApprovals={setApprovals}
            onUpdateDocuments={setDocuments}
            onOpenFlowchart={() => setCurrentView('flowchart')}
          />
        )}

        {currentView === 'department' && (
          <DepartmentDashboard
            approvals={approvals}
            departmentMetrics={departmentMetrics}
            activeProfile={activeProfile}
            onUpdateApprovals={setApprovals}
            onOpenFlowchart={() => setCurrentView('flowchart')}
          />
        )}

        {currentView === 'flowchart' && (
          <ProcessFlowchartViewer
            activeProfileName={activeProfile.name}
          />
        )}

        {currentView === 'briefing' && (
          <ExecutiveBriefing
            onExploreFlowchart={() => setCurrentView('flowchart')}
            onLaunchApplicantDemo={() => setCurrentView('applicant')}
            onLaunchDepartmentDemo={() => setCurrentView('department')}
          />
        )}
      </main>

      {/* Modern GovTech Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">UdyogSetu</span>
            <span>— Smart India Hackathon (SIH) Solution</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('briefing')} 
              className="hover:text-indigo-600 transition-colors"
            >
              Problem & 11 Solutions
            </button>
            <span>•</span>
            <button 
              onClick={() => setCurrentView('flowchart')} 
              className="hover:text-indigo-600 transition-colors"
            >
              Architectural Flowchart
            </button>
            <span>•</span>
            <button 
              onClick={() => setCurrentView('department')} 
              className="hover:text-indigo-600 transition-colors"
            >
              Government Scrutiny Portal
            </button>
          </div>
          <div className="text-slate-400 text-[11px]">
            Statutory Compliance: CPCB • NBC 2016 • DISH • State Single Window Clearances Act
          </div>
        </div>
      </footer>

    </div>
  );
}
