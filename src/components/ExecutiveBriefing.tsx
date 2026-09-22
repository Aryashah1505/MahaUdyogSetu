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
      {/* Hero Executive Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Smart India Hackathon (SIH) Problem Statement Briefing & Solution Blueprint
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Next-Gen Smart Business Approval, Compliance & Clearance Engine
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            Transforming the ease of doing business in India: Moving beyond basic directory portals like NSWS to an intelligent, AI-governed ecosystem with automated pre-validation, single document vaults, risk-based green channels, and synchronized department inspections.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onExploreFlowchart}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <Layers className="w-4 h-4" />
              View Architecture Flowchart
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLaunchApplicantDemo}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <Building2 className="w-4 h-4" />
              Applicant Experience
            </button>
            <button
              onClick={onLaunchDepartmentDemo}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              Department Workbench
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Pill Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('problem')}
          className={`pb-3 font-semibold text-sm sm:text-base transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'problem'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          The Core Problem in Brief
        </button>
        <button
          onClick={() => setActiveTab('nsws_gap')}
          className={`pb-3 font-semibold text-sm sm:text-base transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'nsws_gap'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Scale className="w-4 h-4" />
          Why Existing NSWS Falls Short
        </button>
        <button
          onClick={() => setActiveTab('solutions')}
          className={`pb-3 font-semibold text-sm sm:text-base transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'solutions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          Our 11 Proposed Innovations
        </button>
      </div>

      {/* Tab 1: The Core Problem */}
      {activeTab === 'problem' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                🏢 Approval & Licensing Maze
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                A typical manufacturing or industrial enterprise in India requires between <strong>25 to 45 distinct approvals</strong>, NOCs, environmental clearances, fire licenses, power sanctions, and municipal permits before opening doors.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                📄 Document Redundancy & Errors
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Founders must upload the exact same Company PAN, GST, Land Lease Deed, and Site Layout 15+ separate times. <strong>Over 42% of first-time applications face queries or rejection</strong> due to clerical errors like missing stamps or mismatched dates.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                ⏳ Unpredictable Scrutiny & Delays
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Approvals are stuck in sequential bureaucratic pipelines. One query from a single department halts progress across all parallel clearances, leading to months of idle capital and cost overruns.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                🔄 Department Silos & Duplicate Visits
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Fire services, Pollution Control Board, Factory inspectors, and Power utilities conduct uncoordinated, repetitive on-site inspections, disrupting ongoing civil works without shared findings.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                🏛️ Regulators Overwhelmed by Flawed Dossiers
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Government scrutiny officers spend up to <strong>60% of their working hours manually checking basic document completeness</strong> (e.g. illegible scans, expired certificates) instead of evaluating substantive safety and environmental compliance.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                📊 Zero SLA Visibility & Accountability
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Neither senior administrative heads nor businesses can see <em>which exact desk or officer</em> is holding up an application. Without predictive delay analytics, statutory timelines are routinely exceeded with zero accountability.
              </p>
            </div>
          </div>

          {/* Key Takeaway Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-5 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-200 text-base mb-1">
                The SIH Core Challenge: What is the real solution?
              </h4>
              <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
                The solution is not merely another web form or informational portal. It requires an <strong>intelligent end-to-end orchestration operating system</strong> that pre-validates files with OCR/AI before submission, routes low-risk enterprises through an automated fast-track, synchronizes joint departmental inspections, and flags administrative bottlenecks in real time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Why NSWS Falls Short */}
      {activeTab === 'nsws_gap' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              National Single Window System (NSWS) vs. UdyogSetu Next-Gen
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              India launched the National Single Window System (NSWS) as a pioneering step. However, ground-level industry feedback highlights structural gaps that our proposed innovation solves:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Capability Dimension</th>
                    <th className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">Current NSWS Reality</th>
                    <th className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">UdyogSetu Innovation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">Document Validation</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      Passive file upload. Rejections happen weeks later when officer opens flawed PDF.
                    </td>
                    <td className="py-3.5 px-4 text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50/50 dark:bg-emerald-950/20">
                      <strong>AI Document Pre-Validation</strong>: Instant OCR checks for DSC stamp, entity alignment, expiry & required annexures before submission.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">Risk-Based Fast Tracking</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      Uniform processing queue. A green software lab waits in line with a high-hazard chemical plant.
                    </td>
                    <td className="py-3.5 px-4 text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50/50 dark:bg-emerald-950/20">
                      <strong>Risk-Based Scrutiny & Green Channel</strong>: Automated 48-hour deemed approval for low-risk/white/green industries; focused review for high-risk.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">Inspection Coordination</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      Siloed: Fire, PCB, Labor, and DISCOM schedule independent on-site inspections at random dates.
                    </td>
                    <td className="py-3.5 px-4 text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50/50 dark:bg-emerald-950/20">
                      <strong>Joint Inspection Scheduler</strong>: Synchronized single site visit with consolidated mobile digital checklist and geotagged report.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">Delay & SLA Diagnostics</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      High-level status badges ("Under Process"). No visibility into which desk is stalling.
                    </td>
                    <td className="py-3.5 px-4 text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50/50 dark:bg-emerald-950/20">
                      <strong>Bottleneck & SLA Analytics</strong>: Desk-level cycle time heatmaps, automated statutory deadline escalation, and workload balancing.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">Post-Approval Lifecycle</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      Process ends when certificate is downloaded; renewals and annual compliances are forgotten.
                    </td>
                    <td className="py-3.5 px-4 text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50/50 dark:bg-emerald-950/20">
                      <strong>Dynamic Compliance & Renewal Calendar</strong>: Automatic notifications 90/60/30 days before statutory expiry, plus Incentive & Scheme Matching.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: The 11 Proposed Innovations */}
      {activeTab === 'solutions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                num: '01',
                title: 'Smart Approval Checklist',
                desc: 'Dynamically computes exact clearances required based on 8 parameters: sector, scale, capital investment, power, hazardous material, and land type.',
                icon: CheckCircle2,
                color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400'
              },
              {
                num: '02',
                title: 'AI Document Pre-Validation',
                desc: 'Scans files before submission for digital signatures, valid dates, GST/PAN string matching, and missing technical annexures, eliminating 90% of clerical queries.',
                icon: FileText,
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400'
              },
              {
                num: '03',
                title: 'Single Document Vault',
                desc: 'A verified "DigiLocker for Business" repository where approved documents are linked across multiple department dossiers automatically without re-uploading.',
                icon: ShieldCheck,
                color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400'
              },
              {
                num: '04',
                title: 'Unified Application Dashboard',
                desc: 'Single pane of glass tracking parallel department milestones, query clocks, statutory SLA days, and digital certificate downloads.',
                icon: Layers,
                color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50 dark:text-sky-400'
              },
              {
                num: '05',
                title: 'Automatic Smart Alerts',
                desc: 'Multi-channel notifications (SMS/WhatsApp/Dashboard) alerting founders of pending officer queries, inspection visit dates, and renewal windows.',
                icon: AlertTriangle,
                color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400'
              },
              {
                num: '06',
                title: 'Department Coordination',
                desc: 'Breaks down departmental silos with simultaneous dossier transmission and shared cross-department notes instead of sequential paper routing.',
                icon: RefreshCw,
                color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400'
              },
              {
                num: '07',
                title: 'Joint Inspection Scheduler',
                desc: 'Synchronizes site inspections across Fire, Pollution Control, and Factory Safety into one unified date with a shared digital inspection report.',
                icon: Clock,
                color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/50 dark:text-teal-400'
              },
              {
                num: '08',
                title: 'AI Regulatory Engine',
                desc: 'Understands state and central business acts (Factories Act, Air/Water Act, NBC 2016) and generates plain-language compliance roadmaps.',
                icon: Sparkles,
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400'
              },
              {
                num: '09',
                title: 'Risk-Based Scrutiny',
                desc: 'Classifies ventures into Low, Medium, and High Risk. Clean low-risk MSMEs receive fast-track green channel processing with self-certification.',
                icon: Scale,
                color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/50 dark:text-orange-400'
              },
              {
                num: '10',
                title: 'Delay & Bottleneck Analytics',
                desc: 'Real-time performance telemetry highlighting departmental cycle times, officer backlog queues, and SLA adherence heatmaps.',
                icon: TrendingUp,
                color: 'text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400'
              },
              {
                num: '11',
                title: 'Incentive & Scheme Matcher',
                desc: 'Proactively aligns the business profile with Central & State industrial subsidies, PLI programs, ZED concessions, and green energy rebates.',
                icon: Lightbulb,
                color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/50 dark:text-yellow-400'
              }
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={item.num}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                        INNOVATION #{item.num}
                      </span>
                      <div className={`p-2 rounded-lg ${item.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
