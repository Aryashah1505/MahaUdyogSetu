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

  const stepsList = [
    { key: 'details', label: '1. Business Registration', icon: Building2 },
    { key: 'profile', label: '2. Profile Verification', icon: Sliders },
    { key: 'rules', label: '3. Approval Mapping', icon: Sparkles },
    { key: 'checklist', label: '4. Dynamic Checklist', icon: CheckCircle2 },
    { key: 'documents', label: '5. Document Vault', icon: FileText },
    { key: 'pre_validate', label: '6. AI Pre-Validation', icon: Search },
    { key: 'submission', label: '7. Parallel Submission', icon: Send },
    { key: 'risk_tier', label: '8. Risk Triage', icon: Layers },
    { key: 'dept_review', label: '9. Officer Scrutiny', icon: ShieldCheck },
    { key: 'inspection', label: '10. Joint Inspection', icon: Clock },
    { key: 'approval', label: '11. Approval Granted', icon: CheckCircle2 },
    { key: 'compliance_renewal', label: '12. Renewals & Schemes', icon: Calendar },
  ];

  const nodeDetails: Record<string, { title: string; subtitle: string; desc: string; inputs: string[]; outputs: string[]; sihInnovation: string }> = {
    details: {
      title: 'Company Registration & Authentication',
      subtitle: 'Single Source of Truth intake',
      desc: 'Company registers with CIN, PAN, GSTIN, and location. This verified entity profile drives all subsequent clearance engines.',
      inputs: ['Company Name', 'State & District', 'Sector / Activity', 'Capital Outlay', 'Power Load', 'Workforce Count'],
      outputs: ['Authenticated Enterprise Profile Object', 'State Jurisdiction Assignment'],
      sihInnovation: 'Parameter-driven intake binds the company identity throughout the entire portal.'
    },
    profile: {
      title: 'Business Profile & DNA Synthesis',
      subtitle: 'Enterprise Classification',
      desc: 'Determines MSME scale (Micro, Small, Medium, Large) and CPCB Pollution categories (White, Green, Orange, Red).',
      inputs: ['Business Parameters', 'Industrial Land Zone status'],
      outputs: ['Validated Business Profile ID', 'Pollution Category Badge'],
      sihInnovation: 'Automatic statutory categorization based on official gazette rules.'
    },
    rules: {
      title: 'Identify Applicable Clearances',
      subtitle: 'Dynamic Statutory Mapping',
      desc: 'The Regulatory Engine queries Air/Water Acts, Factories Act, NBC Fire safety, and Electricity rules to determine exact mandatory clearances.',
      inputs: ['Business Profile', 'Land Classification (MIDC vs Agricultural)'],
      outputs: ['Dynamic Approval Dossiers', 'Statutory SLA days per clearance'],
      sihInnovation: 'Zero missing clearances: eliminates discovering missing licenses months after breaking ground.'
    },
    checklist: {
      title: 'Custom Clearance Roadmap',
      subtitle: 'Tailored statutory sequence',
      desc: 'Checklist organized by department and operational sequence (Pre-establishment vs Pre-operation).',
      inputs: ['Identified Approvals', 'Inter-department dependencies'],
      outputs: ['Dynamic Clearance Action Items', 'Document Attachment Matrix'],
      sihInnovation: 'Clear view of pre-requisites and parallel execution pathways.'
    },
    documents: {
      title: 'Single Document Vault',
      subtitle: 'Store once, auto-populate all dossiers',
      desc: 'Upload deeds and blueprints once. The vault injects them into MPCB, Fire, Factory, and DISCOM dossiers automatically.',
      inputs: ['Land Deeds', 'Architectural Layouts', 'Incorporation PAN'],
      outputs: ['Pre-validated Dossier Attachments', 'Document Health Matrix'],
      sihInnovation: 'Eliminates redundant document submissions across 5+ state departments.'
    },
    pre_validate: {
      title: 'AI Document Pre-Validation',
      subtitle: 'Clerical error prevention',
      desc: 'Automated OCR pre-scrutiny checks blueprints, signatures, and zoning certificates before official submission.',
      inputs: ['Uploaded PDF / Images', 'Statutory Checklist Rules'],
      outputs: ['Quality Score (0-100%)', 'Defect Flag List'],
      sihInnovation: 'Eliminates 90% of clerical scrutiny queries before departmental submission.'
    },
    submission: {
      title: 'Parallel Multi-Department Submission',
      subtitle: 'Simultaneous dossier dispatch',
      desc: 'Submits dossiers simultaneously to all relevant departments rather than linear sequential routing.',
      inputs: ['Completed Dossiers', 'Authorized Signatory DSC'],
      outputs: ['Department Application Numbers', 'SLA Clock Activation'],
      sihInnovation: 'Drastically reduces overall approval lead time through parallel processing.'
    },
    risk_tier: {
      title: 'Risk-Based Scrutiny Triage',
      subtitle: 'Green Channel vs Detailed Scrutiny',
      desc: 'Non-hazardous low-risk enterprises qualify for fast-track deemed approvals; high-risk units route to multi-officer scrutiny.',
      inputs: ['CPCB Category', 'Hazardous Materials Flag', 'Workforce / Power Scale'],
      outputs: ['Fast-Track Green Channel Badge', 'Inspection Priority Level'],
      sihInnovation: 'Government officers focus attention on high-risk industrial units.'
    },
    dept_review: {
      title: 'Department Scrutiny & Query Desk',
      subtitle: 'Online clarification exchange',
      desc: 'Officers review dossiers digitally. Any queries are answered online with AI-drafted responses.',
      inputs: ['Submitted Dossiers', 'Officer Review Findings'],
      outputs: ['Official Queries (if any)', 'Scrutiny Endorsement'],
      sihInnovation: '100% faceless online scrutiny eliminates physical department visits.'
    },
    inspection: {
      title: 'Joint Synchronized Site Inspection',
      subtitle: 'One Unified Visit Protocol',
      desc: 'Fire, Pollution Control, and Factory Safety inspectors visit simultaneously on a single pre-notified date.',
      inputs: ['Inspection Order', 'Synchronized Schedule'],
      outputs: ['Joint Inspection Digital Report', 'GPS-tagged Evidence'],
      sihInnovation: 'One single visit replaces 4 uncoordinated visits.'
    },
    approval: {
      title: 'Digital Clearance Order & QR Seal',
      subtitle: 'Cryptographically verifiable certificates',
      desc: 'Digitally signed certificates with QR verification codes are issued directly to the applicant vault.',
      inputs: ['Officer Digital Signatures', 'Compliance Confirmations'],
      outputs: ['Digital QR Certificates', 'Official Commencement Order'],
      sihInnovation: 'Tamper-proof certificates verifiable by banks and local authorities.'
    },
    compliance_renewal: {
      title: 'Post-Approval Calendar & Scheme Matcher',
      subtitle: 'Continuous lifecycle compliance',
      desc: 'Automated reminders for statutory renewals and matching with state/central fiscal subsidy schemes.',
      inputs: ['Approved Certificates', 'Enterprise Financial Parameters'],
      outputs: ['Renewal Alert Schedule', 'Matched Subsidy Applications'],
      sihInnovation: 'Full lifecycle support beyond initial establishment.'
    }
  };

  const selectedData = nodeDetails[selectedNode || 'pre_validate'] || nodeDetails.pre_validate;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner with Flow Controls (Clean Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              End-to-End Approval Lifecycle & Dual Dashboard Topology
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Clearance Engine Process Architecture
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Active Company: <strong className="text-slate-900">{activeProfileName}</strong>. Click any step below to inspect data inputs, outputs, and innovation mechanics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Filter Path:</span>
            <button
              onClick={() => setSimulatedPath('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                simulatedPath === 'all'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Paths
            </button>
            <button
              onClick={() => setSimulatedPath('low_risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                simulatedPath === 'low_risk'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🟢 Low-Risk Fast-Track
            </button>
            <button
              onClick={() => setSimulatedPath('high_risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                simulatedPath === 'high_risk'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🟡 High-Risk Scrutiny
            </button>
          </div>
        </div>

        {/* Process Stepper Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            12-STAGE CLEARANCE PIPELINE
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {stepsList.map((step) => {
              const StepIcon = step.icon;
              const isCurrent = selectedNode === step.key;
              return (
                <button
                  key={step.key}
                  onClick={() => {
                    setSelectedNode(step.key);
                    if (onStepSelect) onStepSelect(step.key);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2 text-xs font-bold ${
                    isCurrent
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-sm ring-1 ring-teal-500'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <StepIcon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-teal-700' : 'text-slate-400'}`} />
                  <span className="truncate">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Step Deep Dive Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="pb-4 border-b border-slate-100">
          <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">
            STEP ARCHITECTURE INSPECTION
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            {selectedData.title}
          </h3>
          <p className="text-xs text-slate-500">{selectedData.subtitle}</p>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed my-4">
          {selectedData.desc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-700 block mb-2">Input Parameters:</span>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              {selectedData.inputs.map((inp, idx) => (
                <li key={idx}>{inp}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-700 block mb-2">Outputs & Generated Data:</span>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              {selectedData.outputs.map((out, idx) => (
                <li key={idx}>{out}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs">
          <span className="font-bold text-teal-900 block mb-1">Single-Window Innovation:</span>
          <p className="text-teal-800">{selectedData.sihInnovation}</p>
        </div>
      </div>
    </div>
  );
};
