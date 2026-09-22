import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  Sparkles, 
  Layers, 
  Search, 
  Send, 
  RefreshCw, 
  ArrowDown, 
  ArrowRight,
  Eye,
  Sliders,
  Play,
  RotateCcw
} from 'lucide-react';

interface ProcessFlowchartViewerProps {
  onStepSelect?: (stepKey: string) => void;
  activeProfileName: string;
}

export const ProcessFlowchartViewer: React.FC<ProcessFlowchartViewerProps> = ({
  onStepSelect,
  activeProfileName,
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>('pre_validate');
  const [simulatedPath, setSimulatedPath] = useState<'low_risk' | 'high_risk' | 'all'>('all');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(4);

  const stepsList = [
    { key: 'details', label: '1. Business Details', icon: Building2 },
    { key: 'profile', label: '2. Business Profile', icon: Sliders },
    { key: 'rules', label: '3. Approval Rules', icon: Sparkles },
    { key: 'checklist', label: '4. Custom Checklist', icon: CheckCircle2 },
    { key: 'documents', label: '5. Document Vault', icon: FileText },
    { key: 'pre_validate', label: '6. AI Pre-Validation', icon: Search },
    { key: 'submission', label: '7. Parallel Submission', icon: Send },
    { key: 'risk_tier', label: '8. Risk Assessment', icon: Layers },
    { key: 'dept_review', label: '9. Department Scrutiny', icon: ShieldCheck },
    { key: 'inspection', label: '10. Joint Inspection', icon: Clock },
    { key: 'approval', label: '11. Approval Granted', icon: CheckCircle2 },
    { key: 'compliance_renewal', label: '12. Renewal & Incentives', icon: Calendar },
  ];

  const nodeDetails: Record<string, { title: string; subtitle: string; desc: string; inputs: string[]; outputs: string[]; sihInnovation: string }> = {
    details: {
      title: 'Enter Business Details',
      subtitle: 'Sector, Location, Scale, Stage, Connected Power, Hazardous materials',
      desc: 'Applicant inputs 8 key regulatory parameters. The engine uses these parameters instead of forcing the entrepreneur to guess applicable Acts.',
      inputs: ['Sector / Industry Type', 'State & District', 'Capital Investment (₹ Cr)', 'Workforce Count', 'Power Load (kW)', 'Hazardous Material Flag'],
      outputs: ['Structured Enterprise Meta-Object', 'State Jurisdiction Map'],
      sihInnovation: 'Parameter-driven intake eliminates the need for business owners to study hundreds of legal gazettes.'
    },
    profile: {
      title: 'Generate Business Profile',
      subtitle: 'Enterprise Classification & Regulatory DNA',
      desc: 'Synthesizes MSME scale (Micro, Small, Medium, Large) and maps to CPCB Pollution categories (White, Green, Orange, Red) and statutory thresholds.',
      inputs: ['Business Parameters', 'Industrial Land Zone status'],
      outputs: ['Validated Business Profile Profile ID', 'Pollution Category Badge'],
      sihInnovation: 'Automatic CPCB classification and MSME scale categorization.'
    },
    rules: {
      title: 'Identify Applicable Approvals',
      subtitle: 'Licences, NOCs, Registrations, Environmental Clearances, Utility Sanctions',
      desc: 'The AI Regulatory Engine queries central and state rulebooks (Air/Water Act, Factories Act, NBC Fire safety, Electricity Act) to determine mandatory clearances.',
      inputs: ['Business Profile', 'Land Classification (Industrial vs Agricultural)'],
      outputs: ['List of 4-12 Mandatory Approvals', 'Statutory SLA days per clearance'],
      sihInnovation: 'Zero missing clearances: eliminates discovering missing licenses months after breaking ground.'
    },
    checklist: {
      title: 'Generate Custom Approval Checklist',
      subtitle: 'Personalized statutory clearance roadmap',
      desc: 'Customized checklist organized by department and operational sequence (Pre-establishment vs Pre-operation).',
      inputs: ['Identified Approvals', 'Inter-department dependencies'],
      outputs: ['Consolidated Document Matrix', 'Estimated total statutory fee & timeline'],
      sihInnovation: 'Single window roadmap with total transparency on required documentation.'
    },
    documents: {
      title: 'Check & Upload Documents (Document Vault)',
      subtitle: 'DigiLocker for Business & Reusable Repository',
      desc: 'Applicant uploads statutory documents (PAN, GST, Plot Deed, Architectural Drawings, SLD). Uploaded files are securely tagged and reusable across all departments.',
      inputs: ['Statutory PDFs', 'Digital Signature Token'],
      outputs: ['Secure Document Vault IDs', 'Multi-department dossier links'],
      sihInnovation: 'Upload once, link to 6 departments. Completely solves document redundancy.'
    },
    pre_validate: {
      title: 'AI Document Pre-Validation Engine',
      subtitle: 'OCR & Clerical Defect Detection BEFORE Submission',
      desc: 'Automated AI/OCR engine inspects uploaded PDFs in seconds: checks for Digital Signature Certificate (DSC), authorized signatory alignment, validity dates, legible drawings, and mandatory annexures.',
      inputs: ['Uploaded Document Bytes', 'Company Registration Records'],
      outputs: ['Validation Score (0-100%)', 'Pass/Fail Checklist', 'Specific Correction Guidance if defect found'],
      sihInnovation: 'Prevents 42% of first-round clerical rejections and officer queries before human scrutiny begins.'
    },
    submission: {
      title: 'Parallel Department Processing',
      subtitle: 'Simultaneous Multi-Department Dossier Dispatch',
      desc: 'Applications are broadcast concurrently to Pollution Control, Fire Emergency, Labor/Factories, and Electricity DISCOM rather than moving in sequential order.',
      inputs: ['Pre-Validated Dossiers', 'Consolidated Online Fee Payment'],
      outputs: ['Application Reference Numbers (ARN)', 'SLA Countdown Clock per Department'],
      sihInnovation: 'Parallel workflows reduce overall project gestation cycle from 180 days to 28 days.'
    },
    risk_tier: {
      title: 'Risk-Based Scrutiny Engine',
      subtitle: 'Low-Risk Green Channel vs High-Risk Scrutiny',
      desc: 'The system computes an objective composite risk score based on pollution category, structural complexity, and hazardous chemical presence. Clean low-risk cases go to Green Channel.',
      inputs: ['Hazardous Flag', 'Investment Scale', 'Pollution Category (Red vs Green)'],
      outputs: ['GREEN CHANNEL: Fast-Track 48h Deemed Approval', 'HIGH RISK: Multi-Officer Detailed Scrutiny & On-Site Inspection'],
      sihInnovation: 'Focuses government regulatory manpower where actual public safety/environmental risk exists.'
    },
    dept_review: {
      title: 'Department Scrutiny & Query Resolution',
      subtitle: 'Transparent Online Interaction Desk',
      desc: 'If an officer raises an inquiry, the applicant is instantly notified via SMS/Dashboard. The AI Query Assistant drafts legally sound, compliant responses with requested attachments.',
      inputs: ['Department Query Note', 'Applicant Explanations & Revised Drawings'],
      outputs: ['Revalidated Dossier', 'Officer Recommendation / Approval Order'],
      sihInnovation: 'Online time-stamped query clock prevents indefinite desk stagnation.'
    },
    inspection: {
      title: 'Joint Synchronized Inspection Scheduler',
      subtitle: 'Unified Single-Visit Site Assessment',
      desc: 'Instead of separate uncoordinated visits, Fire, SPCB, and Factory inspectors conduct a single synchronized physical or drone-assisted inspection with a shared digital checklist.',
      inputs: ['Inspection Readiness Declaration', 'GPS Geotagged Site Coordinates'],
      outputs: ['Joint Inspection Field Report', 'Compliance / Corrective Action Notice'],
      sihInnovation: 'Replaces 4 disruptive site inspections with a single transparent joint evaluation.'
    },
    approval: {
      title: 'Approval Granted & Digital Certificate',
      subtitle: 'QR-Coded Cryptographic Approvals',
      desc: 'Once approved, tamper-proof digitally signed certificates are generated, stored in the vault, and made publicly verifiable via QR code.',
      inputs: ['Digital Officer Seal', 'Department Sanction Order'],
      outputs: ['Signed Certificate PDF', 'Active License Status in Registry'],
      sihInnovation: 'Instant verifiable certificate issuance without in-person office visits.'
    },
    compliance_renewal: {
      title: 'Compliance Calendar & Incentive Matcher',
      subtitle: 'Automated Renewal Alerts & Scheme Matching',
      desc: 'The platform updates the enterprise compliance calendar with annual return deadlines and renewal dates (e.g. Fire NOC renewal in 3 years). Matches venture with central/state subsidies (PLI, MSME grants).',
      inputs: ['Certificate Validity Terms', 'Venture Investment Profile'],
      outputs: ['30/60/90 Day Renewal Reminders', 'Matched Subsidies & Apply Links'],
      sihInnovation: 'Keeps enterprises continuously compliant and unlocks capital subsidies post-clearance.'
    }
  };

  const selectedData = nodeDetails[selectedNode || 'pre_validate'] || nodeDetails.pre_validate;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner with Flow Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              Full Process Architecture & Operational Blueprint (Direct SIH Flowchart)
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              End-to-End Approval Lifecycle & Dual Dashboard Topology
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Active Simulation Target: <strong className="text-slate-800 dark:text-slate-200">{activeProfileName}</strong>. Click any node below to inspect data inputs, outputs, and innovation mechanics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Path:</span>
            <button
              onClick={() => setSimulatedPath('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                simulatedPath === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Paths
            </button>
            <button
              onClick={() => setSimulatedPath('low_risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                simulatedPath === 'low_risk'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              🟢 Low-Risk Fast-Track
            </button>
            <button
              onClick={() => setSimulatedPath('high_risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                simulatedPath === 'high_risk'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              🟣 High-Risk Scrutiny
            </button>
          </div>
        </div>

        {/* Process Summary Horizontal Stepper Bar */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            PROCESS SUMMARY PIPELINE
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {stepsList.map((step, idx) => {
              const StepIcon = step.icon;
              const isCurrent = selectedNode === step.key;
              return (
                <button
                  key={step.key}
                  onClick={() => {
                    setSelectedNode(step.key);
                    setActiveStepIndex(idx);
                    if (onStepSelect) onStepSelect(step.key);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2 text-xs font-semibold ${
                    isCurrent
                      ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <StepIcon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main 3-Column Architecture Canvas (Matching Diagram layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: APPLICANT DASHBOARD WIDGET */}
        <div className="xl:col-span-3 bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-900/80 border-2 border-sky-300 dark:border-sky-800/60 rounded-2xl p-5 shadow-md">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-sky-200 dark:border-sky-800">
            <div className="p-2.5 rounded-xl bg-sky-600 text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                USER PERSPECTIVE
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                APPLICANT DASHBOARD
              </h3>
              <p className="text-[11px] text-slate-500">Business / Entrepreneur</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { title: 'Application Status', desc: 'Real-time multi-department milestone tracker', badge: 'Active: 5', key: 'submission' },
              { title: 'Approvals & Licences', desc: 'Digital QR-verified permits & conditions', badge: '1 Issued', key: 'approval' },
              { title: 'Renewals & Due Dates', desc: 'Auto-calendar alerting 90/60/30 days before', badge: '1 Upcoming', key: 'compliance_renewal' },
              { title: 'Document Vault', desc: 'Upload once, reuse across 6 departments', badge: '5 Verified', key: 'documents' },
              { title: 'Queries & Support', desc: 'AI-assisted response drafting & resubmission', badge: '2 Queries', key: 'dept_review' },
              { title: 'Incentives / Schemes', desc: 'Automated eligibility matching for subsidies', badge: '4 Matches', key: 'compliance_renewal' },
            ].map((card, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedNode(card.key)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedNode === card.key
                    ? 'border-sky-500 bg-sky-100/60 dark:bg-sky-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:border-sky-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">{card.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
                    {card.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-sky-200 dark:border-sky-800 text-center">
            <span className="text-xs text-sky-700 dark:text-sky-300 font-medium">
              ↔ Continuous two-way synchronization
            </span>
          </div>
        </div>

        {/* Center Column: OPERATIONAL FLOW PIPELINE */}
        <div className="xl:col-span-6 space-y-4">
          
          {/* Start Pill */}
          <div className="text-center">
            <span className="inline-block px-6 py-1.5 rounded-full bg-emerald-600 text-white font-extrabold text-xs tracking-wider shadow-md">
              START
            </span>
          </div>
          <div className="flex justify-center text-slate-400"><ArrowDown className="w-4 h-4" /></div>

          {/* Node: Business Details */}
          <div 
            onClick={() => setSelectedNode('details')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedNode === 'details'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-400'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Enter Business Details</h4>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">Step 1</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Sector, Location, Project Size, Stage, Power, Hazardous material flag</p>
          </div>
          <div className="flex justify-center text-slate-400"><ArrowDown className="w-4 h-4" /></div>

          {/* Node: Generate Business Profile */}
          <div 
            onClick={() => setSelectedNode('profile')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedNode === 'profile'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-400'
                : 'border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 hover:border-indigo-400'
            }`}
          >
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Generate Business Profile</h4>
            <p className="text-xs text-slate-500 mt-1">Automated MSME classification & CPCB pollution category mapping (Red/Orange/Green/White)</p>
          </div>
          <div className="flex justify-center text-slate-400"><ArrowDown className="w-4 h-4" /></div>

          {/* Node: Identify Applicable Approvals */}
          <div 
            onClick={() => setSelectedNode('rules')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedNode === 'rules'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-400'
                : 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-indigo-400'
            }`}
          >
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Identify Applicable Approvals (AI Regulatory Engine)</h4>
            <p className="text-xs text-slate-500 mt-1">Licenses, NOCs, Registrations, Environmental Clearances, Utility Connections</p>
          </div>
          <div className="flex justify-center text-slate-400"><ArrowDown className="w-4 h-4" /></div>

          {/* Node: Generate Custom Approval Checklist */}
          <div 
            onClick={() => setSelectedNode('checklist')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedNode === 'checklist'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-400'
                : 'border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 hover:border-indigo-400'
            }`}
          >
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Generate Custom Approval Checklist</h4>
            <p className="text-xs text-slate-500 mt-1">Single-window consolidated checklist based on business profile and location</p>
          </div>
          <div className="flex justify-center text-slate-400"><ArrowDown className="w-4 h-4" /></div>

          {/* LOOP BOX: For EACH Approval Container */}
          <div className="p-4 rounded-2xl border-2 border-indigo-400 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-200 dark:border-indigo-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                For EACH Approval (Document Scrutiny Loop)
              </span>
              <span className="text-[10px] font-semibold bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded">
                Iterative Quality Gate
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div 
                onClick={() => setSelectedNode('documents')}
                className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center cursor-pointer hover:border-indigo-400"
              >
                <FileText className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                <span className="font-semibold block">Check Required Docs</span>
              </div>
              <div 
                onClick={() => setSelectedNode('documents')}
                className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center cursor-pointer hover:border-indigo-400"
              >
                <Send className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                <span className="font-semibold block">Upload Docs (Vault)</span>
              </div>
              <div 
                onClick={() => setSelectedNode('pre_validate')}
                className="p-2.5 rounded-lg border border-indigo-500 bg-indigo-100/50 dark:bg-indigo-950/60 text-center cursor-pointer font-bold text-indigo-900 dark:text-indigo-200"
              >
                <Search className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                <span className="block">Pre-Validate AI/OCR</span>
              </div>
            </div>

            {/* Decision diamond: Missing or Invalid? */}
            <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/80 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Decision: Any Missing or Invalid Items?
                </span>
                <span className="text-[10px] text-slate-500">Automated Pre-Check</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-3">
                {/* YES branch */}
                <div 
                  onClick={() => setSelectedNode('pre_validate')}
                  className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 cursor-pointer text-xs"
                >
                  <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">
                    YES → Defect Found
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Show exact missing/invalid items → Applicant corrects file → Validate again
                  </p>
                </div>

                {/* NO branch */}
                <div 
                  onClick={() => setSelectedNode('submission')}
                  className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 cursor-pointer text-xs"
                >
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                    NO → Ready to Submit
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Prepare unified dossier → Submit to relevant department(s)
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center text-slate-400"><ArrowDown className="w-4 h-4" /></div>

          {/* Node: Parallel Department Processing */}
          <div 
            onClick={() => setSelectedNode('submission')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedNode === 'submission'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-400'
                : 'border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 hover:border-indigo-400'
            }`}
          >
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Parallel Department Processing</h4>
            <p className="text-xs text-slate-500 mt-1">Simultaneous routing to Fire, Pollution, Factories & DISCOM without sequential halts</p>
          </div>
          <div className="flex justify-center text-slate-400"><ArrowDown className="w-4 h-4" /></div>

          {/* Decision Node: Risk Assessment (Low vs High) */}
          <div 
            onClick={() => setSelectedNode('risk_tier')}
            className="p-4 rounded-xl border-2 border-amber-400 dark:border-amber-600 bg-white dark:bg-slate-900 cursor-pointer shadow-sm"
          >
            <div className="text-center mb-3">
              <span className="font-extrabold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">
                RISK ASSESSMENT
              </span>
              <p className="text-xs text-slate-500">Automated classification based on environmental & hazard score</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border text-center transition-all ${
                simulatedPath === 'low_risk' || simulatedPath === 'all'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 shadow-sm'
                  : 'opacity-40 border-slate-200'
              }`}>
                <span className="font-bold text-xs block mb-0.5">LOW RISK</span>
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">Fast Review / Green Channel</span>
                <p className="text-[10px] text-slate-500 mt-1">48-hour deemed clearance</p>
              </div>

              <div className={`p-3 rounded-xl border text-center transition-all ${
                simulatedPath === 'high_risk' || simulatedPath === 'all'
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 text-purple-900 dark:text-purple-200 shadow-sm'
                  : 'opacity-40 border-slate-200'
              }`}>
                <span className="font-bold text-xs block mb-0.5">HIGHER RISK</span>
                <span className="text-[11px] font-medium text-purple-700 dark:text-purple-300">Detailed Review & Scrutiny</span>
                <p className="text-[10px] text-slate-500 mt-1">Multi-officer technical board</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center text-slate-400"><ArrowDown className="w-4 h-4" /></div>

          {/* Parallel Decision Tracks: Query Raised? & Inspection Required? */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Query Raised Track */}
            <div 
              onClick={() => setSelectedNode('dept_review')}
              className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer hover:border-indigo-400 text-xs"
            >
              <div className="font-bold text-slate-900 dark:text-white mb-1">Query Raised?</div>
              <p className="text-[11px] text-slate-500 mb-2">If YES: Notify applicant → Applicant responds with AI assistant → Revalidate → Department Review</p>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Strict 7-day query SLA clock</span>
            </div>

            {/* Inspection Required Track */}
            <div 
              onClick={() => setSelectedNode('inspection')}
              className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer hover:border-indigo-400 text-xs"
            >
              <div className="font-bold text-slate-900 dark:text-white mb-1">Inspection Required?</div>
              <p className="text-[11px] text-slate-500 mb-2">If YES: Schedule joint visit → Conduct inspection → If compliant → Approved (If non-compliant → Corrective action loop)</p>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Joint single site visit</span>
            </div>
          </div>
          <div className="flex justify-center text-slate-400"><ArrowDown className="w-4 h-4" /></div>

          {/* Node: Approval Granted */}
          <div 
            onClick={() => setSelectedNode('approval')}
            className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all ${
              selectedNode === 'approval'
                ? 'border-emerald-600 bg-emerald-100/60 dark:bg-emerald-950/60 ring-2 ring-emerald-400 shadow-md'
                : 'border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30'
            }`}
          >
            <span className="font-extrabold text-sm text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              APPROVAL GRANTED
            </span>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">Cryptographic Digital Certificate Generated with QR Code</p>
          </div>
          <div className="flex justify-center text-slate-400"><ArrowDown className="w-4 h-4" /></div>

          {/* Post-Approval Pipeline Bar */}
          <div 
            onClick={() => setSelectedNode('compliance_renewal')}
            className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 cursor-pointer hover:border-indigo-400"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <span className="p-1.5 bg-white dark:bg-slate-900 rounded border">Generate Certificate</span>
              <span className="p-1.5 bg-white dark:bg-slate-900 rounded border">Compliance Calendar</span>
              <span className="p-1.5 bg-white dark:bg-slate-900 rounded border">Renewal Deadline</span>
              <span className="p-1.5 bg-white dark:bg-slate-900 rounded border">Incentive Matcher</span>
            </div>
          </div>
          <div className="flex justify-center text-slate-400"><ArrowDown className="w-4 h-4" /></div>

          {/* End Pill */}
          <div className="text-center">
            <span className="inline-block px-6 py-1.5 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-xs tracking-wider shadow-md">
              END
            </span>
          </div>
        </div>

        {/* Right Column: DEPARTMENT DASHBOARD WIDGET */}
        <div className="xl:col-span-3 bg-gradient-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-900/80 border-2 border-purple-300 dark:border-purple-800/60 rounded-2xl p-5 shadow-md">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-purple-200 dark:border-purple-800">
            <div className="p-2.5 rounded-xl bg-purple-700 text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                REGULATOR PERSPECTIVE
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                DEPARTMENT DASHBOARD
              </h3>
              <p className="text-[11px] text-slate-500">Government Officials</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { title: 'Assigned Applications', desc: 'Department-wise scrutiny queues', badge: '142 in queue', key: 'submission' },
              { title: 'Scrutiny & Approval', desc: 'Dossier inspection & digital seal execution', badge: '98% clean files', key: 'dept_review' },
              { title: 'Inspection Scheduling', desc: 'Joint inspection planning with Fire & Labor', badge: 'Next: 29 Mar', key: 'inspection' },
              { title: 'SLA Monitoring', desc: 'Real-time countdown per statutory mandate', badge: '78% within SLA', key: 'dept_review' },
              { title: 'Bottleneck Analytics', desc: 'Identifies desk-level delays & cycle times', badge: '3 Desks flagged', key: 'dept_review' },
            ].map((card, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedNode(card.key)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedNode === card.key
                    ? 'border-purple-500 bg-purple-100/60 dark:bg-purple-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">{card.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300">
                    {card.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-purple-200 dark:border-purple-800 text-center">
            <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">
              ⚖️ Risk-based triage accelerates reviews
            </span>
          </div>
        </div>
      </div>

      {/* Selected Node Deep-Dive Inspector Card */}
      {selectedData && (
        <div className="bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
                ACTIVE WORKFLOW STATION INSPECTOR
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {selectedData.title}
              </h3>
              <p className="text-sm text-slate-500">{selectedData.subtitle}</p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              SIH Innovation Highlight
            </div>
          </div>

          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-5">
            {selectedData.desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                📥 System Inputs
              </h4>
              <ul className="space-y-1.5">
                {selectedData.inputs.map((inp, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    {inp}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                📤 Operational Outputs
              </h4>
              <ul className="space-y-1.5">
                {selectedData.outputs.map((out, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {out}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-2">
                💡 Why This Solves The Hackathon Problem
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {selectedData.sihInnovation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
