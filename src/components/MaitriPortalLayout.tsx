import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BusinessProfile, 
  ApprovalItem, 
  DocumentItem, 
  IncentiveScheme 
} from '../types';
import { ImprisonmentProvisionsView } from './ImprisonmentProvisionsView';
import { StateDashboardView } from './StateDashboardView';
import { BusinessProfileView } from './BusinessProfileView';
import { FactoryUnitsView } from './FactoryUnitsView';
import { MidcPlotView } from './MidcPlotView';
import { InvestorWizard } from './InvestorWizard';
import { AppliedWizardListView } from './AppliedWizardListView';
import { SectoralApprovalsView } from './SectoralApprovalsView';
import { DocumentRepositoryView } from './DocumentRepositoryView';
import { FeedbackView } from './FeedbackView';
import { QueryView } from './QueryView';
import { LanguageSelector } from './common/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { GrievanceView } from './GrievanceView';
import { OldApplicationsView } from './OldApplicationsView';
import { FirmRegistrationView } from './FirmRegistrationView';
import { NswsView } from './NswsView';
import { IntelligenceEngineView } from './IntelligenceEngineView';
import { ApplyVerifyPermissionView } from './ApplyVerifyPermissionView';
import { MahaUdyogDashboardView } from './dashboard/MahaUdyogDashboardView';
import { 
  LayoutDashboard, 
  Home,
  Scale, 
  User, 
  Sparkles, 
  FolderOpen, 
  Layers, 
  MessageSquare, 
  HelpCircle, 
  AlertCircle, 
  Archive, 
  FileCheck, 
  ExternalLink, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Zap,
  Briefcase,
  Eye,
  Download,
  IndianRupee,
  CreditCard,
  Menu,
  X,
  FileCheck2,
  CheckCircle,
  Shield,
  Landmark,
  Smartphone,
  ChevronUp,
  Brain,
  Cpu,
  Award
} from 'lucide-react';

interface MaitriPortalLayoutProps {
  profile: BusinessProfile;
  approvals: ApprovalItem[];
  documents: DocumentItem[];
  schemes: IncentiveScheme[];
  onUpdateProfile: (newProfile: BusinessProfile) => void;
  onUpdateApprovals: (newApprovals: ApprovalItem[]) => void;
  onUpdateDocuments: (newDocs: DocumentItem[]) => void;
  onOpenFlowchart: () => void;
  onOpenRegistration: () => void;
  onLogout: () => void;
  onSwitchDepartmentView?: () => void;
}

// Full Department Services Hierarchy matching MAITRI Single Window system
export const MAITRI_DEPARTMENTS_DATA = [
  {
    id: 'labour',
    name: 'Labour Department',
    services: [
      { id: 'lab-1', code: 'LAB-SH-01', name: 'Registration of Establishments under Maharashtra Shops and Establishments Act, 2017', sla: '1 Day', fees: '₹ 1,000', online: true },
      { id: 'lab-2', code: 'LAB-CL-02', name: 'Registration of Principal Employer under Contract Labour (Regulation and Abolition) Act, 1970', sla: '7 Days', fees: '₹ 2,500', online: true },
      { id: 'lab-3', code: 'LAB-LIC-03', name: 'License for Contractors under Contract Labour Act', sla: '7 Days', fees: '₹ 1,500', online: true },
      { id: 'lab-4', code: 'LAB-MW-04', name: 'Registration under Inter-State Migrant Workmen Act, 1979', sla: '15 Days', fees: '₹ 2,000', online: true }
    ]
  },
  {
    id: 'mpcb',
    name: 'Maharashtra Pollution Control Board',
    services: [
      { id: 'mpcb-1', code: 'CTE-AIR-WATER', name: 'Consent to Establish (CTE) under Water (P&CP) Act, 1974 and Air (P&CP) Act, 1981', sla: '21 Days', fees: '₹ 25,000', online: true },
      { id: 'mpcb-2', code: 'CTO-REG-01', name: 'Consent to Operate (CTO) / Renewal of Consent under Water & Air Acts', sla: '30 Days', fees: '₹ 30,000', online: true },
      { id: 'mpcb-3', code: 'HAZ-AUTH-01', name: 'Authorization under Hazardous and Other Wastes Rules, 2016', sla: '30 Days', fees: '₹ 10,000', online: true },
      { id: 'mpcb-4', code: 'BMW-AUTH-02', name: 'Bio-Medical Waste Authorization', sla: '21 Days', fees: '₹ 7,500', online: true },
      { id: 'mpcb-5', code: 'EWASTE-REG', name: 'Registration under E-Waste (Management) Rules', sla: '30 Days', fees: '₹ 15,000', online: true }
    ]
  },
  {
    id: 'doi',
    name: 'Directorate of Industries',
    services: [
      { id: 'doi-1', code: 'DOI-PSI-2019', name: 'Package Scheme of Incentives (PSI) – Industrial Promotion Subsidy (IPS) & Capital Subsidy', sla: '30 Days', fees: 'Nil', online: true },
      { id: 'doi-2', code: 'DOI-STAMP-EX', name: 'Stamp Duty Exemption Certificate for Industrial Land', sla: '15 Days', fees: 'Nil', online: true },
      { id: 'doi-3', code: 'DOI-ELEC-DUTY', name: 'Electricity Duty Exemption for eligible manufacturing units', sla: '15 Days', fees: 'Nil', online: true },
      { id: 'doi-4', code: 'DOI-LARGE-PROJ', name: 'Mega / Ultra-Mega Project Customized Incentive Sanction', sla: '45 Days', fees: 'Nil', online: true }
    ]
  },
  {
    id: 'metrology',
    name: 'Legal Metrology Department',
    services: [
      { id: 'lm-1', code: 'LM-MANUF-01', name: 'Manufacturer License for Weights and Measures', sla: '30 Days', fees: '₹ 5,000', online: true },
      { id: 'lm-2', code: 'LM-DEALER-02', name: 'Dealer License for Weights and Measures', sla: '20 Days', fees: '₹ 2,500', online: true },
      { id: 'lm-3', code: 'LM-REPAIR-03', name: 'Repairer License for Weights and Measures', sla: '20 Days', fees: '₹ 1,500', online: true },
      { id: 'lm-4', code: 'LM-VERIF-04', name: 'Verification and Stamping of Commercial Weights and Measuring Instruments', sla: '7 Days', fees: '₹ 1,000', online: true }
    ]
  },
  {
    id: 'dish',
    name: 'Directorate of Industrial Safety and Health',
    services: [
      { id: 'dish-1', code: 'DISH-PLN-APP', name: 'Factory Building Plan Approval under the Factories Act, 1948', sla: '20 Days', fees: '₹ 18,500', online: true },
      { id: 'dish-2', code: 'DISH-LIC-NEW', name: 'Grant and Renewal of Factory License under Factories Act, 1948', sla: '15 Days', fees: '₹ 12,000', online: true },
      { id: 'dish-3', code: 'DISH-STAB-CERT', name: 'Stability Certificate Registration by Competent Person', sla: '7 Days', fees: '₹ 3,000', online: true }
    ]
  },
  {
    id: 'energy',
    name: 'Energy Department',
    services: [
      { id: 'en-1', code: 'PWR-HT-350', name: 'Sanction and Release of High Tension (HT) / Low Tension (LT) Industrial Power Load (MSEDCL)', sla: '10 Days', fees: '₹ 35,000', online: true },
      { id: 'en-2', code: 'EN-DG-SET', name: 'Electrical Inspectorate Approval for DG Set Installation (Section 54, CEA)', sla: '15 Days', fees: '₹ 6,000', online: true },
      { id: 'en-3', code: 'EN-SOLAR-NET', name: 'Open Access / Rooftop Solar Net Metering Grid Connectivity Permission', sla: '21 Days', fees: '₹ 10,000', online: true }
    ]
  },
  {
    id: 'boilers',
    name: 'Directorate of Boilers',
    services: [
      { id: 'blr-1', code: 'BLR-REG-01', name: 'Registration and Approval of Boilers and Steam Pipelines under Indian Boilers Act, 1923', sla: '15 Days', fees: '₹ 15,000', online: true },
      { id: 'blr-2', code: 'BLR-RENEW-02', name: 'Renewal of Annual Boiler Certificate / Steam Test Inspection', sla: '7 Days', fees: '₹ 8,000', online: true },
      { id: 'blr-3', code: 'BLR-WELDER-03', name: 'Approval of Qualified Boiler Welders and Fabricators', sla: '10 Days', fees: '₹ 3,500', online: true }
    ]
  },
  {
    id: 'midc',
    name: 'Maharashtra Industrial Development Corporation',
    services: [
      { id: 'midc-1', code: 'MIDC-PLOT-ALLOT', name: 'Allotment of Industrial Plot / Land in MIDC Industrial Estates', sla: '30 Days', fees: 'Market Rate', online: true },
      { id: 'midc-2', code: 'MIDC-BLD-PLAN', name: 'Building Plan Approval / Development Permission (Special Planning Authority)', sla: '21 Days', fees: '₹ 22,000', online: true },
      { id: 'midc-3', code: 'MIDC-BCC-OC', name: 'Grant of Building Completion Certificate (BCC) & Occupancy Certificate', sla: '15 Days', fees: '₹ 10,000', online: true },
      { id: 'midc-4', code: 'MIDC-WTR-CONN', name: 'Industrial Water Connection Sanction in MIDC Area', sla: '10 Days', fees: '₹ 5,000', online: true },
      { id: 'midc-5', code: 'MIDC-DRAIN-CONN', name: 'Drainage & Common Effluent Treatment Plant (CETP) Discharge Connection', sla: '15 Days', fees: '₹ 8,500', online: true }
    ]
  },
  {
    id: 'urban',
    name: 'Urban Development II',
    services: [
      { id: 'urb-1', code: 'URB-ZONE-NOC', name: 'Zoning Certificate & Master Plan Land Use Verification', sla: '15 Days', fees: '₹ 3,500', online: true },
      { id: 'urb-2', code: 'URB-CLU-PERM', name: 'Permission for Non-Agricultural (NA) Land Assessment & Conversion (CLU)', sla: '30 Days', fees: '₹ 25,000', online: true },
      { id: 'urb-3', code: 'URB-DEV-PERM', name: 'Municipal Corporation / Town Planning Industrial Layout Approval', sla: '30 Days', fees: '₹ 18,000', online: true }
    ]
  },
  {
    id: 'excise',
    name: 'Excise Department',
    services: [
      { id: 'exc-1', code: 'EXC-DENAT-01', name: 'License for Possession and Use of Specially Denatured Spirit / Industrial Alcohol', sla: '30 Days', fees: '₹ 20,000', online: true },
      { id: 'exc-2', code: 'EXC-RECT-02', name: 'License for Storage of Rectified Spirit for Pharmaceutical / Chemical Units', sla: '30 Days', fees: '₹ 25,000', online: true }
    ]
  },
  {
    id: 'water',
    name: 'Water Resource Department',
    services: [
      { id: 'wtr-1', code: 'WTR-RIV-NOC', name: 'Permission for Surface Water Drawing from River / Dam / Canal for Industry', sla: '45 Days', fees: '₹ 15,000', online: true },
      { id: 'wtr-2', code: 'WTR-GW-NOC', name: 'Ground Water NOC for Industrial Extraction (MSGWRA / CGWA)', sla: '30 Days', fees: '₹ 10,000', online: true }
    ]
  },
  {
    id: 'forest',
    name: 'Forest Department',
    services: [
      { id: 'fst-1', code: 'FST-NOC-01', name: 'NOC for Industrial Setup outside Eco-Sensitive Zone (ESZ) & Forest Boundaries', sla: '30 Days', fees: 'Nil', online: true },
      { id: 'fst-2', code: 'FST-TREE-FELL', name: 'Tree Felling Permission under Maharashtra Felling of Trees Act', sla: '15 Days', fees: '₹ 2,000', online: true }
    ]
  },
  {
    id: 'tourism',
    name: 'Maharashtra Tourism',
    services: [
      { id: 'tour-1', code: 'TOUR-REG-01', name: 'Registration of Tourism Projects & Agro-Tourism Units', sla: '15 Days', fees: '₹ 5,000', online: true },
      { id: 'tour-2', code: 'TOUR-PSI-02', name: 'Fiscal Incentives Sanction under Maharashtra Tourism Policy 2024', sla: '30 Days', fees: 'Nil', online: true }
    ]
  },
  {
    id: 'combined',
    name: 'Combined Services',
    services: [
      { id: 'cmb-1', code: 'CMB-CAF-SWC', name: 'Integrated Common Application Form (CAF) for Pre-Establishment Clearances', sla: 'Single Window', fees: 'Combined', online: true },
      { id: 'cmb-2', code: 'CMB-OP-INSP', name: 'Synchronized Pre-Operation Joint Inspection Protocol', sla: 'Joint Notice', fees: 'Nil', online: true }
    ]
  }
];

import { ApplicationReadiness, ServiceDetail } from './ApplicationReadiness';

// Helper to generate full service readiness details based on clicked service
export function getServiceReadinessDetail(srv: { id: string; code: string; name: string; sla: string; fees: string }, deptName: string, profile: BusinessProfile): ServiceDetail {
  const code = srv.code.toUpperCase();
  const name = srv.name.toLowerCase();

  // 1. MPCB Consent to Establish
  if (code.includes('CTE') || name.includes('consent to establish')) {
    return {
      id: srv.id,
      code: srv.code,
      name: srv.name,
      department: deptName,
      sla: srv.sla,
      fees: srv.fees,
      officialPortalName: 'MPCB e-Consent Portal (Maharashtra Pollution Control Board)',
      officialPortalUrl: 'https://ecmpcb.in/',
      eligibilityCriteria: [
        { criterion: 'Industry Classification', met: true, reason: `${profile.sector} is categorized under MPCB consent criteria.` },
        { criterion: 'Zoning & Land Title', met: true, reason: `Located in ${profile.isMIDC ? 'MIDC Notified Industrial Area' : profile.district + ' Permitted Industrial Zone'}.` },
        { criterion: 'Pollution Control System Design', met: true, reason: 'Effluent Treatment & Chimney Height norms calculated.' },
        { criterion: 'Capital Investment Verification', met: true, reason: `₹ ${profile.investmentCrores} Cr verified via CA certification.` }
      ],
      requiredDocTypes: [
        { docName: 'PAN Card of Company / Entity', category: 'Statutory', mandatory: true, description: 'Permanent statutory entity verification proof.' },
        { docName: 'Certificate of Incorporation & Company Master Data', category: 'Statutory', mandatory: true, description: 'MCA / Registrar of Companies master dossier.' },
        { docName: 'Land Ownership Document / MIDC Allotment Letter', category: 'Land & Building', mandatory: true, description: 'MIDC plot allotment / registered lease agreement.' },
        { docName: 'Detailed Project Report (DPR) & CA Investment Certificate', category: 'Financial', mandatory: true, description: 'CA certified capital investment in plant & machinery.' },
        { docName: 'Factory Architectural Building Plan, Cross Sections & Site Index', category: 'Technical', mandatory: true, description: 'Topographical site index and boundary setbacks.' },
        { docName: 'Manufacturing Process Flow Chart, Raw Materials & Mass Balance Dossier', category: 'Technical', mandatory: true, description: 'Chemical reactions, mass balance, raw material & by-product streams.' },
        { docName: 'Pollution Control System Proposal (ETP/STP & Air Pollution Control APCD)', category: 'Technical', mandatory: true, description: 'ETP hydraulic capacity, zero discharge design, and APCD stack heights.' }
      ]
    };
  }

  // 2. Factory Building Plan Approval / License (DISH Maharashtra)
  if (code.includes('DISH') || name.includes('factory')) {
    const isHazardous = profile.handlesHazardous || profile.sector.includes('Chemical') || profile.sector.includes('Pharma');
    return {
      id: srv.id,
      code: srv.code,
      name: srv.name,
      department: deptName,
      sla: srv.sla,
      fees: srv.fees,
      officialPortalName: 'DISH Maharashtra LMS (Directorate of Industrial Safety & Health)',
      officialPortalUrl: 'https://dish.maharashtra.gov.in/',
      eligibilityCriteria: [
        { criterion: 'Workforce Threshold (Factories Act Sec 2(m))', met: (profile.workforce || 0) >= 10, reason: `${profile.workforce} workers employed with power (> 10 threshold met).` },
        { criterion: 'Occupational Safety Classification', met: true, reason: isHazardous ? 'Major Accident Hazard (MAH) Rule 3-A scrutiny required.' : 'Ordinary Factory under Factories Act 1948.' },
        { criterion: 'Structural Stability Alignment', met: true, reason: 'Architectural blueprints & machine spacing comply with 2024 Maharashtra Factory Rules.' }
      ],
      requiredDocTypes: [
        { docName: 'Certificate of Incorporation & Company Master Data', category: 'Statutory', mandatory: true, description: 'Company incorporation and director list.' },
        { docName: 'Factory Architectural Building Plan, Cross Sections & Site Index', category: 'Technical', mandatory: true, description: 'Ventilation, lighting, sanitation and all-round 6.2m driveway.' },
        { docName: 'Machinery Layout & Material / Worker Movement Pathways Blueprint', category: 'Technical', mandatory: true, description: 'Safe machine spacing, gangway widths and emergency escape routes.' },
        { docName: 'Manufacturing Process Flow Chart, Raw Materials & Mass Balance Dossier', category: 'Technical', mandatory: true, description: 'Detailed process description, raw materials, intermediates and finished goods.' },
        { docName: 'Hazard Identification, Control Measures & On-Site Emergency Plan (Rule 68-O)', category: 'Technical', mandatory: true, description: 'Risk assessment, chemical safety, fire fighting & mock drill schedules.' },
        { docName: 'Single Line Electrical Diagram (SLD) & Transformer Substation Layout', category: 'Technical', mandatory: true, description: 'Chartered electrical engineer approved SLD.' }
      ]
    };
  }

  // 3. Fire Safety NOC
  if (code.includes('FIRE') || name.includes('fire')) {
    return {
      id: srv.id,
      code: srv.code,
      name: srv.name,
      department: deptName,
      sla: srv.sla,
      fees: srv.fees,
      officialPortalName: 'Maharashtra Fire Services Online Portal',
      officialPortalUrl: 'https://nsws.gov.in',
      eligibilityCriteria: [
        { criterion: 'Building Occupancy & Height', met: true, reason: 'Industrial manufacturing occupancy with peripheral driveway.' },
        { criterion: 'Emergency Evacuation Pathways', met: true, reason: 'Direct unhindered access to external assembly points.' }
      ],
      requiredDocTypes: [
        { docName: 'Factory Architectural Building Plan, Cross Sections & Site Index', category: 'Technical', mandatory: true, description: 'Architectural blueprint with fire exits marked.' },
        { docName: 'Land Ownership Document / MIDC Allotment Letter', category: 'Land & Building', mandatory: true, description: 'Proof of plot possession and approved layout.' },
        { docName: 'Hazard Identification, Control Measures & On-Site Emergency Plan (Rule 68-O)', category: 'Technical', mandatory: true, description: 'Fire extinguisher placement & emergency preparedness.' },
        { docName: 'Single Line Electrical Diagram (SLD) & Transformer Substation Layout', category: 'Technical', mandatory: true, description: 'Electrical safety and transformer isolation layout.' }
      ]
    };
  }

  // 4. Power Load Sanction (MSEDCL)
  if (code.includes('PWR') || name.includes('power') || name.includes('electricity') || deptName.includes('Energy')) {
    return {
      id: srv.id,
      code: srv.code,
      name: srv.name,
      department: deptName,
      sla: srv.sla,
      fees: srv.fees,
      officialPortalName: 'MSEDCL Industrial Connection Portal (Mahavitaran)',
      officialPortalUrl: 'https://www.mahadiscom.in/',
      eligibilityCriteria: [
        { criterion: 'Connected Load Requirement', met: true, reason: `${profile.connectedPowerKw} kW load requirement specified.` },
        { criterion: 'Premises Ownership Verification', met: true, reason: 'MIDC plot allotment and valid address proof available.' }
      ],
      requiredDocTypes: [
        { docName: 'PAN Card of Company / Entity', category: 'Statutory', mandatory: true, description: 'Entity PAN for electricity billing setup.' },
        { docName: 'Land Ownership Document / MIDC Allotment Letter', category: 'Land & Building', mandatory: true, description: 'Registered lease / ownership document.' },
        { docName: 'Single Line Electrical Diagram (SLD) & Transformer Substation Layout', category: 'Technical', mandatory: true, description: 'BEE certified consultant approved SLD and transformer room drawing.' }
      ]
    };
  }

  // 5. Labour Department Services
  if (deptName.includes('Labour') || code.includes('LAB')) {
    return {
      id: srv.id,
      code: srv.code,
      name: srv.name,
      department: deptName,
      sla: srv.sla,
      fees: srv.fees,
      officialPortalName: 'Maharashtra Labour Department Online Portal (LMS)',
      officialPortalUrl: 'https://mahakamgar.maharashtra.gov.in/',
      eligibilityCriteria: [
        { criterion: 'Employer Identification', met: true, reason: 'Principal employer KYC and CIN active in MCA database.' },
        { criterion: 'Worker Scale Compliance', met: true, reason: `${profile.workforce} regular staff & ${profile.contractWorkersCount || 0} contract workers recorded.` }
      ],
      requiredDocTypes: [
        { docName: 'PAN Card of Company / Entity', category: 'Statutory', mandatory: true, description: 'Company PAN.' },
        { docName: 'Certificate of Incorporation & Company Master Data', category: 'Statutory', mandatory: true, description: 'Certificate of Incorporation.' },
        { docName: 'Authorized Signatory ID & Board Authorization Resolution', category: 'Statutory', mandatory: true, description: 'Signatory Aadhaar/PAN & authorization letter.' },
        { docName: 'Land Ownership Document / MIDC Allotment Letter', category: 'Land & Building', mandatory: true, description: 'Proof of commercial address.' }
      ]
    };
  }

  // Default Standard Service Detail
  return {
    id: srv.id,
    code: srv.code,
    name: srv.name,
    department: deptName,
    sla: srv.sla,
    fees: srv.fees,
    officialPortalName: `Government of Maharashtra Single Window Portal (${deptName})`,
    officialPortalUrl: 'https://nsws.gov.in',
    eligibilityCriteria: [
      { criterion: 'Entity Registration', met: true, reason: 'Valid Indian Business Entity registered in Maharashtra.' },
      { criterion: 'Compliance Alignment', met: true, reason: 'Standard statutory pre-conditions satisfied.' }
    ],
    requiredDocTypes: [
      { docName: 'PAN Card of Company / Entity', category: 'Statutory', mandatory: true, description: 'Permanent statutory entity verification proof.' },
      { docName: 'Certificate of Incorporation & Company Master Data', category: 'Statutory', mandatory: true, description: 'MCA / Registrar of Companies master dossier.' },
      { docName: 'Authorized Signatory ID & Board Authorization Resolution', category: 'Statutory', mandatory: true, description: 'Board resolution and ID proof of authorized signatory.' },
      { docName: 'Land Ownership Document / MIDC Allotment Letter', category: 'Land & Building', mandatory: true, description: 'Proof of industrial plot possession or registered lease.' }
    ]
  };
}

export const MaitriPortalLayout: React.FC<MaitriPortalLayoutProps> = ({
  profile,
  approvals,
  documents,
  schemes,
  onUpdateProfile,
  onUpdateApprovals,
  onUpdateDocuments,
  onOpenFlowchart,
  onOpenRegistration,
  onLogout,
  onSwitchDepartmentView,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  // Map route pathname to sidebar nav id
  const getNavFromPath = (pathname: string): string => {
    switch (pathname) {
      case '/':
      case '/dashboard':
      case '/my-dashboard':
        return 'dashboard';
      case '/apply-verify':
      case '/apply-and-verify':
        return 'apply_verify';
      case '/services-provided':
        return 'services_provided';
      case '/applications':
      case '/services-applied':
        return 'applications';
      case '/imprisonment-provisions':
        return 'imprisonment_provisions';
      case '/intelligence-engine':
        return 'intelligence_engine';
      case '/business-profile':
      case '/business-profile/show':
        return 'business_profile';
      case '/business-profile/factory-units':
        return 'factory_units';
      case '/business-profile/midc-plot':
        return 'midc_plot';
      case '/investor-wizard':
      case '/investor-wizard/run':
        return 'investor_wizard';
      case '/investor-wizard/applied-list':
        return 'applied_wizard_list';
      case '/investor-wizard/sectoral-approvals':
        return 'sectoral_approvals';
      case '/document-repository':
        return 'document_repository';
      case '/feedback':
        return 'feedback';
      case '/query':
        return 'query';
      case '/grievance':
        return 'grievance';
      case '/old-applications':
        return 'old_applications';
      case '/firm-registration':
        return 'firm_registration';
      case '/nsws':
        return 'nsws';
      case '/caf':
        return 'caf';
      case '/payment-history':
        return 'payment_history';
      default:
        return 'dashboard';
    }
  };

  // Map sidebar nav id to route path
  const getPathFromNav = (nav: string): string => {
    switch (nav) {
      case 'dashboard':
        return '/dashboard';
      case 'apply_verify':
        return '/apply-verify';
      case 'services_provided':
        return '/services-provided';
      case 'applications':
        return '/applications';
      case 'intelligence_engine':
        return '/intelligence-engine';
      case 'imprisonment_provisions':
        return '/imprisonment-provisions';
      case 'business_profile':
        return '/business-profile';
      case 'factory_units':
        return '/business-profile/factory-units';
      case 'midc_plot':
        return '/business-profile/midc-plot';
      case 'investor_wizard':
        return '/investor-wizard';
      case 'applied_wizard_list':
        return '/investor-wizard/applied-list';
      case 'sectoral_approvals':
        return '/investor-wizard/sectoral-approvals';
      case 'document_repository':
        return '/document-repository';
      case 'feedback':
        return '/feedback';
      case 'query':
        return '/query';
      case 'grievance':
        return '/grievance';
      case 'old_applications':
        return '/old-applications';
      case 'firm_registration':
        return '/firm-registration';
      case 'nsws':
        return '/nsws';
      case 'caf':
        return '/caf';
      case 'payment_history':
        return '/payment-history';
      default:
        return '/services-provided';
    }
  };

  // Left Sidebar active menu synced with URL pathname
  const [selectedNav, setSelectedNav] = useState<string>(() => getNavFromPath(location.pathname));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Expandable Sidebar Dropdowns ('business_profile' | 'investor_wizard' | null)
  const [openDropdown, setOpenDropdown] = useState<'business_profile' | 'investor_wizard' | null>(() => {
    if (location.pathname.startsWith('/business-profile')) return 'business_profile';
    if (location.pathname.startsWith('/investor-wizard')) return 'investor_wizard';
    return null;
  });

  // Top Tabs: 'dashboard' | 'services_applied' | 'services_available' | 'caf' | 'payment_history'
  const [activeTopTab, setActiveTopTab] = useState<'dashboard' | 'services_applied' | 'services_available' | 'caf' | 'payment_history'>(() => {
    if (location.pathname === '/applications' || location.pathname === '/services-applied') return 'services_applied';
    if (location.pathname === '/services-provided') return 'services_available';
    if (location.pathname === '/caf') return 'caf';
    if (location.pathname === '/payment-history') return 'payment_history';
    return 'dashboard';
  });

  // Sync state when URL pathname changes (e.g. back/forward or direct load)
  useEffect(() => {
    const nav = getNavFromPath(location.pathname);
    setSelectedNav(nav);
    if (location.pathname.startsWith('/business-profile')) {
      setOpenDropdown('business_profile');
    } else if (location.pathname.startsWith('/investor-wizard')) {
      setOpenDropdown('investor_wizard');
    }
    if (location.pathname === '/applications' || location.pathname === '/services-applied') {
      setActiveTopTab('services_applied');
    } else if (location.pathname === '/services-provided') {
      setActiveTopTab('services_available');
    } else if (location.pathname === '/caf') {
      setActiveTopTab('caf');
    } else if (location.pathname === '/payment-history') {
      setActiveTopTab('payment_history');
    } else if (location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/my-dashboard') {
      setActiveTopTab('dashboard');
    }
  }, [location.pathname]);

  // Navigate helper
  const handleNavClick = (nav: string, tab?: 'dashboard' | 'services_applied' | 'services_available' | 'caf' | 'payment_history') => {
    setSelectedNav(nav);
    setMobileSidebarOpen(false);
    if (tab) {
      setActiveTopTab(tab);
    } else if (nav === 'dashboard') {
      setActiveTopTab('dashboard');
    }
    const path = getPathFromNav(nav);
    navigate(path);
  };

  // Top tab click helper
  const handleTopTabClick = (tab: 'dashboard' | 'services_applied' | 'services_available' | 'caf' | 'payment_history') => {
    setActiveTopTab(tab);
    if (tab === 'dashboard') {
      setSelectedNav('dashboard');
      navigate('/dashboard');
    } else if (tab === 'services_applied') {
      setSelectedNav('applications');
      navigate('/applications');
    } else if (tab === 'services_available') {
      setSelectedNav('services_provided');
      navigate('/services-provided');
    } else if (tab === 'caf') {
      setSelectedNav('caf');
      navigate('/caf');
    } else if (tab === 'payment_history') {
      setSelectedNav('payment_history');
      navigate('/payment-history');
    }
  };

  // Active Service Readiness Inspection state
  const [selectedServiceReadiness, setSelectedServiceReadiness] = useState<ServiceDetail | null>(null);

  // Application Details Modal State
  const [selectedAppForDetails, setSelectedAppForDetails] = useState<ApprovalItem | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<'timeline' | 'documents' | 'payment' | 'enterprise'>('timeline');
  const [applicationsFilterQuery, setApplicationsFilterQuery] = useState('');

  // Expanded Accordion Departments (Default open first 2)
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({
    'labour': false,
    'mpcb': false,
    'doi': false,
    'energy': false
  });

  // Search filter for services
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [appliedServiceMessage, setAppliedServiceMessage] = useState<string | null>(null);

  const toggleDept = (id: string) => {
    setExpandedDepts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    MAITRI_DEPARTMENTS_DATA.forEach(d => { allOpen[d.id] = true; });
    setExpandedDepts(allOpen);
  };

  const collapseAll = () => {
    setExpandedDepts({});
  };

  const handleOpenServiceReadiness = (srv: { id: string; code: string; name: string; sla: string; fees: string }, deptName: string) => {
    const detail = getServiceReadinessDetail(srv, deptName, profile);
    setSelectedServiceReadiness(detail);
  };

  const handleDownloadAppReceipt = (app: ApprovalItem) => {
    const receiptContent = `=====================================================
GOVERNMENT OF MAHARASHTRA • SINGLE WINDOW PORTAL
MAHAUDYOGSETU OFFICIAL PAYMENT ACKNOWLEDGMENT RECEIPT
=====================================================

Application Reference No: ${app.applicationRefNumber || app.id}
Transaction ID:          ${app.transactionId || 'TXN-MH-2026-948217'}
Payment Date:            ${app.appliedDate || '26/09/2026'}
Payment Status:          SUCCESS (PAID)

Applicant Details:
------------------
Enterprise Name:         ${profile.name}
Authorized Signatory:    ${profile.authorizedPersonName || 'Arya Darshan Shah'}
Entity PAN:              ${profile.pan}
GSTIN:                   ${profile.gstin}
Registered Address:      ${profile.address || 'Ambad Industrial Estate, Nashik, Maharashtra - 422010'}

Service & Clearance:
--------------------
Service Name:            ${app.name}
Governing Department:    ${app.department}
Statutory SLA:           ${app.slaDays} Days
Amount Paid:             ₹ ${app.feeAmount?.toLocaleString() || '1,000'}
Payment Mode:            ${app.paymentMode || 'UPI / MahaOnline Payment Gateway'}

Application Status:      Payment Completed -> Application Submitted -> Under Scrutiny

=====================================================
This is a computer-generated digital receipt.
=====================================================`;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = `Receipt_${app.applicationRefNumber || app.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadFullDossier = (app: ApprovalItem) => {
    const dossierText = `=====================================================
MAHAUDYOGSETU STATUTORY APPLICATION DOSSIER
GOVERNMENT OF MAHARASHTRA • MAITRI SINGLE WINDOW PORTAL
=====================================================

Application ID:          ${app.id}
Application Ref No:      ${app.applicationRefNumber || app.id}
Service Name:            ${app.name}
Department:              ${app.department}
Statutory SLA:           ${app.slaDays} Days
Application Date:        ${app.appliedDate || '26/09/2026'}
Current Status:          ${app.status.replace('_', ' ').toUpperCase()} (${app.stageName})

Applicant Entity:
-----------------
Enterprise Name:         ${profile.name}
CIN / Registration:      ${profile.cin || 'U29253MH2020PTC338912'}
Entity PAN:              ${profile.pan}
GSTIN:                   ${profile.gstin}
Authorized Signatory:    ${profile.authorizedPersonName || 'Arya Darshan Shah'} (${profile.authorizedPersonDesignation || 'Managing Director'})
Unit Location:           ${profile.plotNumber || 'Plot No. W-42'}, ${profile.isMIDC ? 'MIDC Ambad' : profile.taluka || 'Industrial Area'}, ${profile.district}, Maharashtra

Attached & Verified Documents:
------------------------------
${(app.verifiedDocDetails || []).map((doc, idx) => `${idx + 1}. [VERIFIED] ${doc.name} (${doc.size}) - ${doc.docType} [Verified at ${doc.verifiedAt}]`).join('\n') || (app.submittedDocs || []).map((d, i) => `${i + 1}. [VERIFIED] ${d}`).join('\n')}

Fee & Treasury Settlement:
--------------------------
Statutory Fee:           ₹ ${app.feeAmount?.toLocaleString() || '1,000'}
Payment Status:          ${app.paymentStatus || 'Paid'}
Payment Mode:            ${app.paymentMode || 'UPI / MahaOnline'}
Transaction ID:          ${app.transactionId || 'TXN-MH-2026-948217'}

Statutory Timeline & Status Log:
--------------------------------
${(app.statusHistory || []).map(st => `• [${st.status.toUpperCase()}] ${st.date} - ${st.title}: ${st.description}`).join('\n') || '• Application Submitted & Under Scrutiny.'}

=====================================================
Digitally Generated via MahaUdyogSetu GovTech Platform
=====================================================`;

    const blob = new Blob([dossierText], { type: "text/plain" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = `Application_Dossier_${app.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filtered departments based on search query
  const filteredDepartments = MAITRI_DEPARTMENTS_DATA.map(dept => {
    const matchingServices = dept.services.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...dept,
      matchingServices,
      hasMatch: matchingServices.length > 0
    };
  }).filter(dept => searchQuery.trim() === '' || dept.hasMatch);

  return (
    <div 
      className="min-h-screen flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/assets/maha_industry_bridge.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Subtle translucent dark layer so the background image remains visible behind the UI with optimal readability */}
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px] pointer-events-none z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
      
      {/* 1. TOP ACCESS BAR */}
      <div className="bg-[#0b1b3d]/90 backdrop-blur-md text-white text-[11px] px-4 sm:px-8 py-1.5 flex items-center justify-between border-b border-slate-700/60 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="opacity-95 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Government of Maharashtra • Single Window Clearance System
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector variant="dark" />
          <button
            onClick={() => navigate('/main-portal')}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-blue-200 hover:text-white px-2.5 py-0.5 rounded font-bold transition-all border border-slate-700 flex items-center gap-1 cursor-pointer"
          >
            <span>🌐 Go to Main Portal</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row p-2.5 sm:p-3 gap-3 max-w-[1720px] w-full mx-auto">
        
        {/* Mobile Navigation Bar (Toggles 15-button sidebar on phone/tablet) */}
        <div className="lg:hidden flex items-center justify-between p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              MU
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {selectedNav === 'dashboard' ? 'Dashboard Overview' : selectedNav.replace(/_/g, ' ').toUpperCase()}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">MahaUdyogSetu • Single Window</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer min-h-[38px]"
          >
            {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>{mobileSidebarOpen ? 'Hide Menu' : 'Menu & Services'}</span>
          </button>
        </div>

        {/* =========================================================================
            LEFT SIDEBAR NAVIGATION
           ========================================================================= */}
        <aside className={`w-full lg:w-72 shrink-0 ${mobileSidebarOpen ? 'flex' : 'hidden lg:flex'} flex-col gap-2`}>
          
          {/* Official MahaUdyogSetu Emblem Box */}
          <div className="bg-white/92 backdrop-blur-md rounded-2xl border border-white/80 p-3.5 shadow-lg shadow-slate-950/5 flex flex-col items-center justify-center text-center">
            <img 
              src="/assets/mahau_logo.jpg" 
              alt="MahaUdyogSetu - Maharashtra Industry Bridge" 
              className="w-40 h-auto object-contain rounded-lg"
            />
          </div>

          {/* Nav Buttons List */}
          <div className="bg-white/92 backdrop-blur-md rounded-xl border border-white/80 p-2 shadow-lg shadow-slate-950/5 flex flex-col gap-1.5 text-xs font-semibold">
            
            {/* 0. Dashboard / Home */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'dashboard'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                  : 'bg-white/80 hover:bg-white text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4" />
                <span>{t('sidebar.dashboardHome', 'Dashboard / Home')}</span>
              </div>
            </button>


            {/* 1. Applications */}
            <button
              onClick={() => handleNavClick('applications', 'services_applied')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'applications'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>{t('sidebar.applications', 'Applications')}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${selectedNav === 'applications' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {approvals.length}
              </span>
            </button>

            {/* 1.5. 🧠 Intelligence Engine (Approval Readiness) */}
            <button
              onClick={() => handleNavClick('intelligence_engine')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'intelligence_engine'
                  ? 'bg-gradient-to-r from-indigo-700 to-blue-700 text-white border-indigo-800 shadow-sm font-black'
                  : 'bg-indigo-50/50 hover:bg-indigo-50 text-indigo-950 border-indigo-200/80 font-bold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Brain className={`w-4 h-4 ${selectedNav === 'intelligence_engine' ? 'text-cyan-300 animate-pulse' : 'text-indigo-600'}`} />
                <span>🧠 {t('sidebar.intelligenceEngine', 'Intelligence Engine')}</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                selectedNav === 'intelligence_engine' ? 'bg-indigo-900 text-cyan-300' : 'bg-indigo-100 text-indigo-800'
              }`}>
                Flagship
              </span>
            </button>

            {/* 2. Imprisonment Provisions */}
            <button
              onClick={() => handleNavClick('imprisonment_provisions')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'imprisonment_provisions'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4" />
                <span>{t('sidebar.imprisonmentProvisions', 'Imprisonment Provisions')}</span>
              </div>
            </button>

            {/* 3. Business Profile (Expandable Dropdown) */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  if (openDropdown === 'business_profile') {
                    setOpenDropdown(null);
                  } else {
                    setOpenDropdown('business_profile');
                    if (!location.pathname.startsWith('/business-profile')) {
                      handleNavClick('business_profile');
                    }
                  }
                }}
                className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedNav === 'business_profile' || selectedNav === 'factory_units' || selectedNav === 'midc_plot' || openDropdown === 'business_profile'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>{t('sidebar.businessProfile', 'Business Profile')}</span>
                </div>
                {openDropdown === 'business_profile' ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4 opacity-70" />
                )}
              </button>

              {/* Submenu white container */}
              {openDropdown === 'business_profile' && (
                <div className="bg-white rounded-xl border border-slate-200/90 p-1.5 shadow-2xs space-y-1 ml-2 transition-all animate-fadeIn">
                  <button
                    onClick={() => handleNavClick('business_profile')}
                    className={`w-full py-2 px-3 rounded-lg text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                      selectedNav === 'business_profile'
                        ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{t('nav.viewFullProfile', 'Show Profile')}</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('factory_units')}
                    className={`w-full py-2 px-3 rounded-lg text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                      selectedNav === 'factory_units'
                        ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{t('sidebar.factoryUnits', 'Factory Units')}</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('midc_plot')}
                    className={`w-full py-2 px-3 rounded-lg text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                      selectedNav === 'midc_plot'
                        ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{t('sidebar.midcPlot', 'MIDC Plot')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Investor Wizard (Expandable Dropdown) */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  if (openDropdown === 'investor_wizard') {
                    setOpenDropdown(null);
                  } else {
                    setOpenDropdown('investor_wizard');
                    if (!location.pathname.startsWith('/investor-wizard')) {
                      handleNavClick('investor_wizard');
                    }
                  }
                }}
                className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedNav === 'investor_wizard' || selectedNav === 'applied_wizard_list' || selectedNav === 'sectoral_approvals' || openDropdown === 'investor_wizard'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4" />
                  <span>{t('sidebar.investorWizard', 'Investor Wizard')}</span>
                </div>
                {openDropdown === 'investor_wizard' ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4 opacity-70" />
                )}
              </button>

              {/* Submenu white container */}
              {openDropdown === 'investor_wizard' && (
                <div className="bg-white rounded-xl border border-slate-200/90 p-1.5 shadow-2xs space-y-1 ml-2 transition-all animate-fadeIn">
                  <button
                    onClick={() => handleNavClick('investor_wizard')}
                    className={`w-full py-2 px-3 rounded-lg text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                      selectedNav === 'investor_wizard'
                        ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{t('sidebar.investorWizard', 'Run Wizard')}</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('applied_wizard_list')}
                    className={`w-full py-2 px-3 rounded-lg text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                      selectedNav === 'applied_wizard_list'
                        ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{t('sidebar.appliedWizardList', 'Applied Wizard List')}</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('sectoral_approvals')}
                    className={`w-full py-2 px-3 rounded-lg text-left text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                      selectedNav === 'sectoral_approvals'
                        ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{t('sidebar.sectoralApprovals', 'Sectoral Approval')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. Document Repository */}
            <button
              onClick={() => handleNavClick('document_repository')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'document_repository'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-4 h-4" />
                <span>{t('sidebar.documentRepository', 'Document Repository')}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${selectedNav === 'document_repository' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {documents.length}
              </span>
            </button>

            {/* 6. Services Provided */}
            <button
              onClick={() => handleNavClick('services_provided', 'services_available')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'services_provided' && activeTopTab === 'services_available'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>{t('sidebar.servicesProvided', 'Services Provided')}</span>
              </div>
            </button>

            {/* 7. Feedback */}
            <button
              onClick={() => handleNavClick('feedback')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'feedback'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>{t('sidebar.feedback', 'Feedback')}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* 8. Query */}
            <button
              onClick={() => handleNavClick('query')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'query'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4" />
                <span>{t('sidebar.query', 'Query')}</span>
              </div>
            </button>

            {/* 9. Grievance */}
            <button
              onClick={() => handleNavClick('grievance')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'grievance'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4" />
                <span>{t('sidebar.grievance', 'Grievance')}</span>
              </div>
            </button>

            {/* 10. Old Applications */}
            <button
              onClick={() => handleNavClick('old_applications')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'old_applications'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Archive className="w-4 h-4" />
                <span>{t('sidebar.oldApplications', 'Old Applications')}</span>
              </div>
            </button>

            {/* 11. Firm Registration */}
            <button
              onClick={() => handleNavClick('firm_registration')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'firm_registration'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4" />
                <span>{t('sidebar.firmRegistration', 'Firm Registration')}</span>
              </div>
            </button>

            {/* 12. Login to NSWS */}
            <button
              onClick={() => handleNavClick('nsws')}
              className={`w-full py-2.5 px-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedNav === 'nsws'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4" />
                <span>{t('sidebar.nsws', 'Login to NSWS')}</span>
              </div>
            </button>

          </div>

          {/* User Profile Card (Bottom of Sidebar) */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-full bg-[#2563eb] text-white p-3 rounded-xl flex items-center justify-between shadow-xs hover:bg-[#1d4ed8] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <div className="font-extrabold text-xs tracking-wider uppercase truncate">
                    {profile.name ? profile.name.split(' ')[0] : 'ARYA'}
                  </div>
                  <div className="text-[10px] text-blue-100 truncate">
                    {profile.email || 'arya2007in@gmail.com'}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-blue-200 shrink-0" />
            </button>

            {userDropdownOpen && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-50 animate-fadeIn text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-800 truncate">{profile.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{profile.pan} • {profile.district}, {profile.state}</p>
                </div>
                <button
                  onClick={() => { setSelectedNav('business_profile'); setUserDropdownOpen(false); }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 rounded-lg text-slate-700 font-medium flex items-center gap-2 cursor-pointer mt-1"
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Full Profile</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full px-3 py-2 text-left hover:bg-rose-50 rounded-lg text-rose-600 font-medium flex items-center gap-2 cursor-pointer mt-1 border-t border-slate-100"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

        </aside>

        {/* =========================================================================
            MAIN CONTENT AREA
           ========================================================================= */}
        <main className="flex-1 flex flex-col gap-3 min-w-0">
          
          {/* Top 5 Tabs Navigation Bar (Shown on Dashboard & Application / Services tabs) */}
          {(selectedNav === 'dashboard' || selectedNav === 'services_provided' || selectedNav === 'applications' || selectedNav === 'caf' || selectedNav === 'payment_history') && (
            <div className="bg-white/92 backdrop-blur-md rounded-2xl border border-white/80 p-1.5 shadow-md shadow-slate-950/5">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs font-bold text-center">
                
                {/* Tab 0: Dashboard Workspace */}
                <button
                  onClick={() => handleTopTabClick('dashboard')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTopTab === 'dashboard' && selectedNav === 'dashboard'
                      ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                      : 'text-slate-700 hover:bg-white/80'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>

                {/* Tab 1: Services Applied */}
                <button
                  onClick={() => handleTopTabClick('services_applied')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTopTab === 'services_applied' && selectedNav === 'applications'
                      ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                      : 'text-slate-700 hover:bg-white/80'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{t('tab.servicesApplied', 'Applications')} ({approvals.length})</span>
                </button>

                {/* Tab 2: Services Available */}
                <button
                  onClick={() => handleTopTabClick('services_available')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTopTab === 'services_available' && selectedNav === 'services_provided'
                      ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                      : 'text-slate-700 hover:bg-white/80'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('tab.servicesAvailable', 'Services Directory')}</span>
                </button>

                {/* Tab 3: CAF (Common Application Form) */}
                <button
                  onClick={() => handleTopTabClick('caf')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTopTab === 'caf' || selectedNav === 'caf'
                      ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                      : 'text-slate-700 hover:bg-white/80'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('tab.caf', 'Common Form (CAF)')}</span>
                </button>

                {/* Tab 4: Payment History */}
                <button
                  onClick={() => handleTopTabClick('payment_history')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTopTab === 'payment_history' || selectedNav === 'payment_history'
                      ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                      : 'text-slate-700 hover:bg-white/80'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{t('tab.paymentHistory', 'Payment History')}</span>
                </button>

              </div>
            </div>
          )}

          {/* Feedback notification toast if service clicked */}
          {appliedServiceMessage && (
            <div className="bg-emerald-50/95 backdrop-blur-md border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{appliedServiceMessage}</span>
              </div>
              <button onClick={() => setAppliedServiceMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-black">✕</button>
            </div>
          )}

          {/* =========================================================================
              ROUTE VIEW 0: MAHAUDYOGSETU WORKSPACE DASHBOARD
             ========================================================================= */}
          {selectedNav === 'dashboard' && (
            <MahaUdyogDashboardView
              profile={profile}
              approvals={approvals}
              documents={documents}
              schemes={schemes}
              onNavigateTab={handleNavClick}
              onOpenServiceReadiness={handleOpenServiceReadiness}
              onOpenApplicationDetails={(app) => {
                handleNavClick('applications', 'services_applied');
                setSelectedAppForDetails(app);
                setModalActiveTab('timeline');
              }}
              onDownloadReceipt={handleDownloadAppReceipt}
              onDownloadDossier={handleDownloadFullDossier}
              onOpenRegistration={onOpenRegistration}
              onUpdateApprovals={onUpdateApprovals}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 1: APPLICATIONS (Services Applied)
             ========================================================================= */}
          {selectedNav === 'applications' && (
            <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Applications ({approvals.length})
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      Live Applications Dossier
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time statutory timelines, scrutinies, verified documents, and payment receipts
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={applicationsFilterQuery}
                      onChange={(e) => setApplicationsFilterQuery(e.target.value)}
                      placeholder="Search applied services..."
                      className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-56"
                    />
                    {applicationsFilterQuery && (
                      <button
                        onClick={() => setApplicationsFilterQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={() => handleNavClick('services_provided', 'services_available')}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Apply New Service</span>
                  </button>
                </div>
              </div>

              {/* Applications Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-3.5">Application ID & Service</th>
                      <th className="py-3 px-3.5">Department</th>
                      <th className="py-3 px-3.5">Statutory SLA</th>
                      <th className="py-3 px-3.5">Applied Date</th>
                      <th className="py-3 px-3.5">Payment Status</th>
                      <th className="py-3 px-3.5">Current Status</th>
                      <th className="py-3 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {approvals
                      .filter(app => {
                        if (!applicationsFilterQuery.trim()) return true;
                        const q = applicationsFilterQuery.toLowerCase();
                        return (
                          app.name.toLowerCase().includes(q) ||
                          app.code.toLowerCase().includes(q) ||
                          app.department.toLowerCase().includes(q) ||
                          app.id.toLowerCase().includes(q)
                        );
                      })
                      .map((app) => {
                        const isUnderScrutiny = app.status === 'under_scrutiny' || app.status === 'submitted';
                        const isApproved = app.status === 'approved';
                        const isQuery = app.status === 'query_raised';

                        return (
                          <tr key={app.id} className="hover:bg-slate-50/90 transition-colors">
                            <td className="py-3.5 px-3.5 max-w-sm">
                              <div className="font-bold text-slate-900 leading-snug">{app.name}</div>
                              <div className="text-[11px] font-mono text-slate-500 mt-0.5 flex items-center gap-1.5">
                                <span className="text-blue-700 font-bold">{app.code}</span>
                                <span>•</span>
                                <span>ID: <strong className="text-slate-800">{app.id}</strong></span>
                              </div>
                            </td>

                            <td className="py-3.5 px-3.5 text-slate-700">
                              <div className="font-semibold text-slate-800">{app.department}</div>
                              <div className="text-[10px] text-slate-500">{app.category}</div>
                            </td>

                            <td className="py-3.5 px-3.5 whitespace-nowrap">
                              <div className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 text-[11px]">
                                <Clock className="w-3 h-3 text-blue-600" />
                                <span>{app.slaDays} Day{app.slaDays > 1 ? 's' : ''} SLA</span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">Elapsed: {app.daysElapsed} Day(s)</div>
                            </td>

                            <td className="py-3.5 px-3.5 whitespace-nowrap font-medium text-slate-700 text-[11px]">
                              {app.appliedDate || app.submittedDate || '26/09/2026'}
                            </td>

                            <td className="py-3.5 px-3.5 whitespace-nowrap">
                              {app.paymentStatus && app.paymentStatus.toLowerCase().includes('paid') ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>{app.paymentStatus}</span>
                                </span>
                              ) : app.paymentStatus && app.paymentStatus.toLowerCase().includes('exempt') ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                                  <span>Exempt (Nil Fee)</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  <span>Pending</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3.5 whitespace-nowrap">
                              {isUnderScrutiny ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
                                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                                  <span>Submitted / Under Scrutiny</span>
                                </span>
                              ) : isApproved ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>Approved</span>
                                </span>
                              ) : isQuery ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                                  <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                                  <span>Query Raised</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  <span>{app.status.replace('_', ' ').toUpperCase()}</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                              <button 
                                onClick={() => {
                                  setSelectedAppForDetails(app);
                                  setModalActiveTab('timeline');
                                }}
                                className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600" />
                                <span>View Details</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {approvals.length === 0 && (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">No Applications Submitted Yet</h3>
                    <p className="text-xs text-slate-500">Go to "Services Available" tab to apply for statutory clearances and permits.</p>
                  </div>
                  <button
                    onClick={() => handleNavClick('services_provided', 'services_available')}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs"
                  >
                    Explore & Apply for Services
                  </button>
                </div>
              )}

              {/* Online Single Window System Metrics & Department SLA Statistics */}
              <div className="pt-4 border-t border-slate-200">
                <StateDashboardView 
                  approvals={approvals}
                  profile={profile}
                  onNavigateToServices={() => handleNavClick('services_provided', 'services_available')}
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              ROUTE VIEW 2: SERVICES PROVIDED / SERVICES AVAILABLE
             ========================================================================= */}
          {selectedNav === 'services_provided' && (
            selectedServiceReadiness ? (
              <ApplicationReadiness
                service={selectedServiceReadiness}
                profile={profile}
                vaultDocuments={documents}
                onBack={() => setSelectedServiceReadiness(null)}
                onCompleteRequirements={() => {
                  setSelectedServiceReadiness(null);
                  handleNavClick('document_repository');
                }}
                onUpdateVaultDocuments={onUpdateDocuments}
                onSubmitApplication={(newApp) => {
                  const existingIndex = approvals.findIndex(a => a.code === newApp.code || a.name === newApp.name);
                  let updated: ApprovalItem[];
                  if (existingIndex >= 0) {
                    updated = [...approvals];
                    updated[existingIndex] = newApp;
                  } else {
                    updated = [newApp, ...approvals];
                  }
                  onUpdateApprovals(updated);
                  setAppliedServiceMessage(`Application submitted successfully for "${newApp.name}"! Reference ID: ${newApp.id}`);
                }}
                onViewApplicationDetails={(app) => {
                  setSelectedServiceReadiness(null);
                  handleNavClick('applications', 'services_applied');
                  setSelectedAppForDetails(app);
                  setModalActiveTab('timeline');
                }}
                onViewApplicationStatus={() => {
                  setSelectedServiceReadiness(null);
                  handleNavClick('applications', 'services_applied');
                }}
              />
            ) : (
            <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
              
              {/* Header: Apply for Services */}
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Apply for Services
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span>👆</span> Click on a department name below to view its offered services
                </p>
              </div>

              {/* Quick Search and Expand/Collapse Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Department or Service (e.g., Boiler, CTE, MIDC, MSEDCL)..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <button 
                    onClick={expandAll}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer shadow-2xs"
                  >
                    Expand All
                  </button>
                  <button 
                    onClick={collapseAll}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer shadow-2xs"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Department Accordion List */}
              <div className="space-y-2.5 pt-2">
                {filteredDepartments.map((dept) => {
                  const isOpen = searchQuery.trim() !== '' ? true : !!expandedDepts[dept.id];
                  const displayServices = searchQuery.trim() !== '' ? dept.matchingServices : dept.services;

                  return (
                    <div 
                      key={dept.id} 
                      className="border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs transition-all"
                    >
                      {/* Accordion Row Header */}
                      <button
                        onClick={() => toggleDept(dept.id)}
                        className={`w-full py-3.5 px-4 text-left font-semibold text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                          isOpen 
                            ? 'bg-[#f0f4fc] text-blue-900 border-b border-slate-200 font-bold' 
                            : 'bg-[#f8fafc] hover:bg-[#f1f5f9] text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-blue-600' : 'bg-slate-400'}`} />
                          <span>{dept.name}</span>
                          <span className="text-[11px] font-normal text-slate-500">
                            ({dept.services.length} {dept.services.length === 1 ? 'service' : 'services'})
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                      </button>

                      {/* Accordion Content (Services List) */}
                      {isOpen && (
                        <div className="bg-white p-3 divide-y divide-slate-100 animate-fadeIn">
                          {displayServices.length === 0 ? (
                            <p className="text-xs text-slate-400 p-2 italic">No matching services in this department.</p>
                          ) : (
                            displayServices.map((srv) => (
                              <div 
                                key={srv.id} 
                                className="py-3 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/90 rounded-lg transition-colors"
                              >
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-slate-900">
                                      {srv.name}
                                    </span>
                                    {srv.online && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                        ONLINE
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                                    <span>Code: <strong className="font-mono text-slate-700">{srv.code}</strong></span>
                                    <span>•</span>
                                    <span>Statutory SLA: <strong className="text-slate-800">{srv.sla}</strong></span>
                                    <span>•</span>
                                    <span>Govt Fees: <strong className="text-slate-800">{srv.fees}</strong></span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => handleOpenServiceReadiness(srv, dept.name)}
                                    className="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <span>Apply Now</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenServiceReadiness(srv, dept.name)}
                                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
                                  >
                                    Guidelines
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
            )
          )}

          {/* =========================================================================
              ROUTE VIEW 3: CAF (Common Application Form)
             ========================================================================= */}
          {/* =========================================================================
              ROUTE VIEW 3: CAF (Common Application Form)
             ========================================================================= */}
          {selectedNav === 'caf' && (
            <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-5 animate-fadeIn">
              <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Unified Common Application Form (CAF)</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Single Window Verified</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Central statutory master dataset powering all Departmental clearances (MPCB, DISH, MSEDCL, Labour, MIDC) under Maharashtra Single Window Act
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print / Export CAF</span>
                  </button>

                  <button
                    onClick={onOpenRegistration}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Edit Common Application Form</span>
                  </button>
                </div>
              </div>

              {/* 4 Key Pillars of the CAF */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* 1. Legal Entity & Incorporation */}
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>1. Enterprise Legal Identity</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Legal Entity Name</span>
                      <strong className="text-slate-900">{profile.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Constitution of Firm</span>
                      <strong className="text-slate-900">{profile.businessType || 'Private Limited'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Corporate PAN</span>
                      <strong className="text-slate-900 font-mono">{profile.pan}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">CIN Number</span>
                      <strong className="text-slate-900 font-mono">{profile.cin || 'U28990MH2026PTC654321'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">GSTIN</span>
                      <strong className="text-slate-900 font-mono">{profile.gstin || '27FGHIJ5678K1Z8'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Udyam Registration</span>
                      <strong className="text-slate-900 font-mono">{profile.udyamRegistration || 'UDYAM-MH-26-0081294'}</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Industrial Scope & Scale */}
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>2. Industrial Scope & Proposed Scale</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Primary Sector</span>
                      <strong className="text-slate-900">{profile.sector}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Investment in Plant & Machinery</span>
                      <strong className="text-slate-900">₹ {profile.investmentCrores} Crores ({profile.scale})</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Total Proposed Workforce</span>
                      <strong className="text-slate-900">{profile.workforce} Regular Employees</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Sanctioned Connected Power</span>
                      <strong className="text-slate-900">{profile.connectedPowerKw} kW (HT Load)</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Project Stage</span>
                      <strong className="text-slate-900">{profile.stage || 'Pre-Establishment'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Profile Completion Status</span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>100% Statutory Ready</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Geographic Location & Land */}
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Home className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>3. Location & Plot Infrastructure</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Revenue District</span>
                      <strong className="text-slate-900">{profile.district || 'Nashik'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Taluka / Sub-Division</span>
                      <strong className="text-slate-900">{profile.taluka || 'Ambad'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Industrial Area Type</span>
                      <strong className="text-slate-900">{profile.isMIDC ? 'MIDC Industrial Estate' : 'Non-MIDC Zone'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Postal Pincode</span>
                      <strong className="text-slate-900 font-mono">{profile.pincode || '422010'}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Full Registered Site Address</span>
                      <strong className="text-slate-900">{profile.address || 'Plot No. 18, Ambad MIDC, Ambad Industrial Estate, Nashik, Maharashtra – 422010'}</strong>
                    </div>
                  </div>
                </div>

                {/* 4. Environmental & Utility Parameters */}
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Zap className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>4. Utilities & Environmental Scope</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Hazardous Substances Handling</span>
                      <strong className="text-slate-900">{profile.handlesHazardous ? 'Yes (Hazardous)' : 'No (Non-Hazardous)'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Industrial Boiler Installation</span>
                      <strong className="text-slate-900">{profile.hasBoiler ? 'Yes (Boiler Included)' : 'No Boiler'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Water Extraction Requirement</span>
                      <strong className="text-slate-900">{profile.waterExtractionRequirementKld || 0} KLD</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">DG Set Standby Capacity</span>
                      <strong className="text-slate-900">{profile.dgSetKva || 250} kVA</strong>
                    </div>
                    <div className="col-span-2 bg-blue-50 border border-blue-200 p-2 rounded-lg text-[10px] text-blue-900 font-medium">
                      ℹ️ Common Application Form (CAF) synchronizes auto-generated application dossiers with 14 statutory departments without manual re-typing.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              ROUTE VIEW 4: PAYMENT HISTORY (/payment-history)
             ========================================================================= */}
          {selectedNav === 'payment_history' && (
            <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4 animate-fadeIn">
              <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Statutory Fee Payment Gateway Receipts (GRAS)
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      e-Challan Treasury Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official Government Receipt Accounting System (GRAS Maharashtra) transaction ledger & statutory receipts
                  </p>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
                  Verified GRAS Merchant Code: <strong className="font-mono text-slate-900">MH-GOV-IND-2026</strong>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">GRN / Transaction No</th>
                      <th className="py-2.5 px-3">Department & Service</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Payment Status</th>
                      <th className="py-2.5 px-3 text-right">Official Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {/* Live approvals from backend merged with GRAS ledger records */}
                    {approvals
                      .filter(a => (a.feeAmount && a.feeAmount > 0) || (a.paymentStatus && a.paymentStatus.toLowerCase().includes('paid')))
                      .map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/90 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            {app.transactionId || `MH-GRAS-2026-${(app.id || '').replace(/\D/g, '').slice(-4) || '8124'}`}
                          </td>
                          <td className="py-3 px-3 max-w-xs">
                            <div className="font-bold text-slate-900">{app.department}</div>
                            <div className="text-[11px] text-slate-500 truncate">{app.name}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                            {app.appliedDate || app.submittedDate || '26 Mar 2026'}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                            ₹ {Number(app.feeAmount || 15000).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              SUCCESS
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                const grn = app.transactionId || `MH-GRAS-2026-${(app.id || '').replace(/\D/g, '').slice(-4) || '8124'}`;
                                const printWindow = window.open('', '_blank');
                                if (printWindow) {
                                  printWindow.document.write(`
                                    <html>
                                      <head>
                                        <title>GRAS Payment Challan Receipt - ${grn}</title>
                                        <style>
                                          body { font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; max-width: 650px; margin: 0 auto; }
                                          .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
                                          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
                                          .stamp { margin-top: 24px; text-align: right; font-weight: bold; color: #047857; }
                                        </style>
                                      </head>
                                      <body>
                                        <div class="header">
                                          <h2>Government of Maharashtra</h2>
                                          <h3>Government Receipt Accounting System (GRAS) - Payment Challan</h3>
                                        </div>
                                        <div class="row"><span>GRN:</span><strong>${grn}</strong></div>
                                        <div class="row"><span>Department:</span><strong>${app.department}</strong></div>
                                        <div class="row"><span>Service:</span><strong>${app.name}</strong></div>
                                        <div class="row"><span>Enterprise:</span><strong>${profile.name}</strong></div>
                                        <div class="row"><span>Amount Paid:</span><strong>₹ ${Number(app.feeAmount || 15000).toLocaleString('en-IN')}</strong></div>
                                        <div class="row"><span>Date:</span><strong>${app.appliedDate || app.submittedDate || '26 Mar 2026'}</strong></div>
                                        <div class="row"><span>Payment Status:</span><strong style="color: #059669;">SUCCESS (VERIFIED)</strong></div>
                                        <div class="stamp">✓ Digitally Signed & Treasury Reconciled</div>
                                      </body>
                                    </html>
                                  `);
                                  printWindow.document.close();
                                  printWindow.focus();
                                  setTimeout(() => printWindow.print(), 300);
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors cursor-pointer"
                            >
                              Challan PDF
                            </button>
                          </td>
                        </tr>
                      ))}

                    {/* Benchmark statutory payment records */}
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">MH-GRAS-2026-9812</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">Maharashtra Pollution Control Board</div>
                        <div className="text-[11px] text-slate-500">Consent to Establish (CTE) - Orange Category</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">20 Mar 2026</td>
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">₹ 25,000</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          SUCCESS
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button 
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            if (printWindow) {
                              printWindow.document.write(`
                                <html>
                                  <head>
                                    <title>GRAS Payment Challan Receipt - MH-GRAS-2026-9812</title>
                                    <style>
                                      body { font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; max-width: 650px; margin: 0 auto; }
                                      .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
                                      .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
                                      .stamp { margin-top: 24px; text-align: right; font-weight: bold; color: #047857; }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="header">
                                      <h2>Government of Maharashtra</h2>
                                      <h3>Government Receipt Accounting System (GRAS) - Payment Challan</h3>
                                    </div>
                                    <div class="row"><span>GRN:</span><strong>MH-GRAS-2026-9812</strong></div>
                                    <div class="row"><span>Department:</span><strong>Maharashtra Pollution Control Board</strong></div>
                                    <div class="row"><span>Service:</span><strong>Consent to Establish (CTE)</strong></div>
                                    <div class="row"><span>Enterprise:</span><strong>${profile.name}</strong></div>
                                    <div class="row"><span>Amount Paid:</span><strong>₹ 25,000</strong></div>
                                    <div class="row"><span>Date:</span><strong>20 Mar 2026</strong></div>
                                    <div class="row"><span>Payment Status:</span><strong style="color: #059669;">SUCCESS (VERIFIED)</strong></div>
                                    <div class="stamp">✓ Digitally Signed & Treasury Reconciled</div>
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                              printWindow.focus();
                              setTimeout(() => printWindow.print(), 300);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors cursor-pointer"
                        >
                          Challan PDF
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">MH-GRAS-2026-4410</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">MSEDCL Power Distribution</div>
                        <div className="text-[11px] text-slate-500">Power Load Sanction (350 kW HT Load)</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">19 Mar 2026</td>
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">₹ 35,000</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          SUCCESS
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button 
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            if (printWindow) {
                              printWindow.document.write(`
                                <html>
                                  <head>
                                    <title>GRAS Payment Challan Receipt - MH-GRAS-2026-4410</title>
                                    <style>
                                      body { font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; max-width: 650px; margin: 0 auto; }
                                      .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
                                      .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
                                      .stamp { margin-top: 24px; text-align: right; font-weight: bold; color: #047857; }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="header">
                                      <h2>Government of Maharashtra</h2>
                                      <h3>Government Receipt Accounting System (GRAS) - Payment Challan</h3>
                                    </div>
                                    <div class="row"><span>GRN:</span><strong>MH-GRAS-2026-4410</strong></div>
                                    <div class="row"><span>Department:</span><strong>MSEDCL Power Distribution</strong></div>
                                    <div class="row"><span>Service:</span><strong>Power Load Sanction (350 kW)</strong></div>
                                    <div class="row"><span>Enterprise:</span><strong>${profile.name}</strong></div>
                                    <div class="row"><span>Amount Paid:</span><strong>₹ 35,000</strong></div>
                                    <div class="row"><span>Date:</span><strong>19 Mar 2026</strong></div>
                                    <div class="row"><span>Payment Status:</span><strong style="color: #059669;">SUCCESS (VERIFIED)</strong></div>
                                    <div class="stamp">✓ Digitally Signed & Treasury Reconciled</div>
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                              printWindow.focus();
                              setTimeout(() => printWindow.print(), 300);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors cursor-pointer"
                        >
                          Challan PDF
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              ROUTE VIEW 5: BUSINESS PROFILE (/business-profile)
             ========================================================================= */}
          {selectedNav === 'business_profile' && (
            <BusinessProfileView 
              profile={profile}
              onUpdateProfile={onUpdateProfile}
              onOpenFullRegistrationForm={onOpenRegistration}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 5.1: FACTORY UNITS (/business-profile/factory-units)
             ========================================================================= */}
          {selectedNav === 'factory_units' && (
            <FactoryUnitsView 
              profile={profile}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 5.2: MIDC PLOT (/business-profile/midc-plot)
             ========================================================================= */}
          {selectedNav === 'midc_plot' && (
            <MidcPlotView 
              profile={profile}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 6: DOCUMENT REPOSITORY (/document-repository)
             ========================================================================= */}
          {selectedNav === 'document_repository' && (
            <DocumentRepositoryView 
              documents={documents}
              profile={profile}
              onUpdateDocuments={onUpdateDocuments}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 7: INVESTOR WIZARD (/investor-wizard)
             ========================================================================= */}
          {selectedNav === 'investor_wizard' && (
            <InvestorWizard 
              profile={profile}
              onUpdateProfile={onUpdateProfile}
              onApplyForService={(serviceCode) => {
                handleOpenServiceReadiness(
                  { id: serviceCode, code: serviceCode, name: serviceCode, sla: '15 Days', fees: 'Standard' },
                  'Department'
                );
                handleNavClick('services_provided', 'services_available');
              }}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 7.1: APPLIED WIZARD LIST (/investor-wizard/applied-list)
             ========================================================================= */}
          {selectedNav === 'applied_wizard_list' && (
            <AppliedWizardListView 
              profile={profile}
              onRunNewWizard={() => handleNavClick('investor_wizard')}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 7.2: SECTORAL APPROVALS (/investor-wizard/sectoral-approvals)
             ========================================================================= */}
          {selectedNav === 'sectoral_approvals' && (
            <SectoralApprovalsView 
              profile={profile}
              onApplyForService={(serviceName) => {
                handleNavClick('services_provided', 'services_available');
              }}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 8: FEEDBACK (/feedback)
             ========================================================================= */}
          {selectedNav === 'feedback' && (
            <FeedbackView 
              profile={profile}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 9: QUERY (/query)
             ========================================================================= */}
          {selectedNav === 'query' && (
            <QueryView 
              profile={profile}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 10: GRIEVANCE (/grievance)
             ========================================================================= */}
          {selectedNav === 'grievance' && (
            <GrievanceView 
              profile={profile}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 11: OLD APPLICATIONS (/old-applications)
             ========================================================================= */}
          {selectedNav === 'old_applications' && (
            <OldApplicationsView 
              profile={profile}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 12: FIRM REGISTRATION (/firm-registration)
             ========================================================================= */}
          {selectedNav === 'firm_registration' && (
            <FirmRegistrationView 
              profile={profile}
              onUpdateProfile={onUpdateProfile}
              onOpenEntityRegistration={onOpenRegistration}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 13: LOGIN TO NSWS (/nsws)
             ========================================================================= */}
          {selectedNav === 'nsws' && (
            <NswsView 
              profile={profile}
              onBackToDashboard={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 14: IMPRISONMENT PROVISIONS (/imprisonment-provisions)
             ========================================================================= */}
          {selectedNav === 'imprisonment_provisions' && (
            <ImprisonmentProvisionsView 
              approvals={approvals}
              profile={profile}
              onBackToApplications={() => handleNavClick('applications', 'services_applied')}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 15: 🧠 INTELLIGENCE ENGINE (FLAGSHIP APPROVAL READINESS)
             ========================================================================= */}
          {selectedNav === 'intelligence_engine' && (
            <IntelligenceEngineView 
              profile={profile}
              documents={documents}
              approvals={approvals}
              onUpdateProfile={onUpdateProfile}
              onUpdateDocuments={onUpdateDocuments}
              onNavigateToService={(_serviceCode) => {
                handleNavClick('services_provided', 'services_available');
              }}
              onBackToDashboard={() => {
                handleNavClick('applications', 'services_applied');
              }}
            />
          )}

          {/* =========================================================================
              ROUTE VIEW 16: APPLY & VERIFY PERMISSION (/apply-verify)
             ========================================================================= */}
          {selectedNav === 'apply_verify' && (
            <ApplyVerifyPermissionView 
              profile={profile}
              documents={documents}
              approvals={approvals}
              onUpdateProfile={onUpdateProfile}
              onUpdateDocuments={onUpdateDocuments}
              onUpdateApprovals={onUpdateApprovals}
              onBackToDashboard={() => handleNavClick('services_provided', 'services_available')}
              onViewApplications={() => handleNavClick('applications', 'services_applied')}
            />
          )}

        </main>

      </div>

      {/* =========================================================================
          APPLICATION DETAILS MODAL (TIMELINE, VERIFIED DOCS, PAYMENT, STATUS)
         ========================================================================= */}
      {selectedAppForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] my-auto">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 relative">
              <button 
                onClick={() => setSelectedAppForDetails(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wide">
                  Application Dossier & Scrutiny
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
                  Ref: {selectedAppForDetails.applicationRefNumber || selectedAppForDetails.id}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white pr-8">
                {selectedAppForDetails.name}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{selectedAppForDetails.department}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>SLA: {selectedAppForDetails.slaDays} Day{selectedAppForDetails.slaDays > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 font-bold">
                    {selectedAppForDetails.status === 'under_scrutiny' ? 'Submitted / Under Scrutiny' : selectedAppForDetails.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip (4-Col Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 bg-slate-50 border-b border-slate-200 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Application Date</div>
                <div className="font-extrabold text-slate-900 mt-0.5">
                  {selectedAppForDetails.appliedDate || selectedAppForDetails.submittedDate || '26/09/2026'}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Statutory SLA</div>
                <div className="font-extrabold text-slate-900 mt-0.5">
                  {selectedAppForDetails.slaDays} Day{selectedAppForDetails.slaDays > 1 ? 's' : ''} Time Limit
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Government Fee</div>
                <div className="font-extrabold text-slate-900 mt-0.5 flex items-center gap-1">
                  <span>₹ {selectedAppForDetails.feeAmount?.toLocaleString() || '1,000'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {selectedAppForDetails.paymentStatus || 'Paid'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Transaction ID</div>
                <div className="font-mono text-[11px] font-bold text-slate-800 mt-0.5 truncate" title={selectedAppForDetails.transactionId || 'TXN-MH-2026-948217'}>
                  {selectedAppForDetails.transactionId || 'TXN-MH-2026-948217'}
                </div>
              </div>
            </div>

            {/* Modal Nav Tabs */}
            <div className="flex border-b border-slate-200 px-4 sm:px-6 bg-white gap-2 sm:gap-4 text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setModalActiveTab('timeline')}
                className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  modalActiveTab === 'timeline'
                    ? 'border-blue-600 text-blue-700 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Application Timeline & History</span>
              </button>

              <button
                onClick={() => setModalActiveTab('documents')}
                className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  modalActiveTab === 'documents'
                    ? 'border-blue-600 text-blue-700 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Verified Documents Dossier</span>
              </button>

              <button
                onClick={() => setModalActiveTab('payment')}
                className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  modalActiveTab === 'payment'
                    ? 'border-blue-600 text-blue-700 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Payment & Treasury Receipt</span>
              </button>

              <button
                onClick={() => setModalActiveTab('enterprise')}
                className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  modalActiveTab === 'enterprise'
                    ? 'border-blue-600 text-blue-700 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Enterprise Master Profile</span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              
              {/* TAB 1: TIMELINE & STATUS HISTORY */}
              {modalActiveTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-blue-900 text-xs">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      <span>Current Processing Stage: {selectedAppForDetails.stageName}</span>
                    </div>
                    <p className="text-[11px] text-blue-800 mt-1">
                      Statutory SLA is strictly governed under Maharashtra Right to Public Services Act (RTS Act, 2015). Target turnaround: {selectedAppForDetails.slaDays} Day(s).
                    </p>
                  </div>

                  <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {(selectedAppForDetails.statusHistory || [
                      {
                        title: 'Payment Completed',
                        date: `${selectedAppForDetails.appliedDate || '26/09/2026'}, 10:20 AM`,
                        stage: 'Payment',
                        status: 'completed',
                        description: selectedAppForDetails.feeAmount > 0 ? `₹ ${selectedAppForDetails.feeAmount?.toLocaleString()} paid via ${selectedAppForDetails.paymentMode || 'UPI'} (Txn ID: ${selectedAppForDetails.transactionId || 'TXN-MH-2026-948217'}).` : 'Statutory service covered under Zero-Fee / Nil regime.'
                      },
                      {
                        title: 'Application Submitted',
                        date: `${selectedAppForDetails.appliedDate || '26/09/2026'}, 10:21 AM`,
                        stage: 'Submission',
                        status: 'completed',
                        description: `Statutory application lodged via Single Window Portal with reference ID ${selectedAppForDetails.applicationRefNumber || selectedAppForDetails.id}.`
                      },
                      {
                        title: 'Under Scrutiny',
                        date: `${selectedAppForDetails.appliedDate || '26/09/2026'}, In Progress`,
                        stage: 'Scrutiny',
                        status: 'current',
                        description: `Application under active scrutiny by Area Desk Officer at ${selectedAppForDetails.department}.`
                      },
                      {
                        title: 'Query Raised — only if required',
                        date: 'Only if required',
                        stage: 'Query',
                        status: 'pending',
                        description: 'Department clarification/query will appear here if sought by the reviewing officer.'
                      },
                      {
                        title: 'Inspection — only if required',
                        date: 'Only if required',
                        stage: 'Inspection',
                        status: 'pending',
                        description: 'Physical/site compliance inspection if mandated under statute.'
                      },
                      {
                        title: 'Approved',
                        date: `Target: within SLA (${selectedAppForDetails.slaDays} Day${selectedAppForDetails.slaDays > 1 ? 's' : ''})`,
                        stage: 'Approval',
                        status: 'pending',
                        description: 'Final statutory approval by competent authority.'
                      },
                      {
                        title: 'Certificate / License Issued',
                        date: 'Post Approval',
                        stage: 'Issuance',
                        status: 'pending',
                        description: 'Digitally signed clearance certificate / license with verification QR code.'
                      }
                    ]).map((step, idx) => {
                      const isCompleted = step.status === 'completed';
                      const isCurrent = step.status === 'current';
                      const isPending = step.status === 'pending' || (!isCompleted && !isCurrent);

                      return (
                        <div key={idx} className="relative">
                          {/* Dot / Icon indicator */}
                          <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCompleted ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' :
                            isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse' :
                            'bg-slate-100 text-slate-400 border border-slate-300 ring-2 ring-white'
                          }`}>
                            {isCompleted ? '🟢' : isCurrent ? '🔵' : '⚪'}
                          </div>

                          <div className={`p-3.5 rounded-xl border transition-all ${
                            isCurrent ? 'bg-blue-50/60 border-blue-300 shadow-2xs' :
                            isCompleted ? 'bg-white border-slate-200' :
                            'bg-slate-50/50 border-slate-200/80 text-slate-500'
                          }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <span className={`font-bold text-xs sm:text-sm flex items-center gap-1.5 ${
                                isCompleted ? 'text-emerald-950' :
                                isCurrent ? 'text-blue-950 font-black' :
                                'text-slate-600'
                              }`}>
                                <span>{isCompleted ? '🟢' : isCurrent ? '🔵' : '⚪'}</span>
                                <span>{step.title}</span>
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500">{step.date}</span>
                            </div>
                            <p className={`text-xs mt-1 leading-relaxed ${isPending ? 'text-slate-500' : 'text-slate-700'}`}>
                              {step.description}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                isCompleted ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                isCurrent ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}>
                                {isCompleted ? 'Completed' : isCurrent ? 'Active Stage (Under Scrutiny)' : 'Pending / Not Required'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">Stage: {step.stage}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: VERIFIED DOCUMENTS */}
              {modalActiveTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-900">Mandatory Statutory Documents Dossier</h4>
                      <p className="text-[11px] text-slate-500">All attached files verified against company master data.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified & Validated</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(selectedAppForDetails.verifiedDocDetails || (selectedAppForDetails.submittedDocs || []).map(name => ({
                      name: name,
                      size: '1.8 MB',
                      verifiedAt: `${selectedAppForDetails.appliedDate || '26/09/2026'} 10:18 AM`,
                      docType: 'Statutory Verification Dossier'
                    }))).map((doc, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-2xs space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              PDF
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 leading-snug">{doc.name}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{doc.docType} • {doc.size}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          <span className="text-emerald-700 font-bold flex items-center gap-1 text-[10px]">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Verified on {doc.verifiedAt}</span>
                          </span>

                          <button
                            onClick={() => {
                              const blob = new Blob([`MahaUdyogSetu Verified Document Dossier\nDocument: ${doc.name}\nEntity: ${profile.name}\nPAN: ${profile.pan}\nStatus: VERIFIED`], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${doc.name.replace(/[^A-Za-z0-9]/g, '_')}_Verified.txt`;
                              a.click();
                            }}
                            className="text-blue-600 hover:text-blue-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>View / Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PAYMENT & RECEIPT DETAILS */}
              {modalActiveTab === 'payment' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300/80 rounded-2xl p-5 text-emerald-950 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-emerald-950">Statutory Treasury Fee Settled</h4>
                          <p className="text-[11px] text-emerald-800">MahaOnline Unified Treasury Receipt Confirmed</p>
                        </div>
                      </div>
                      <span className="text-lg font-black text-emerald-950">
                        ₹ {selectedAppForDetails.feeAmount?.toLocaleString() || '1,000'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-emerald-200 text-xs">
                      <div className="flex justify-between bg-white/70 p-2 rounded-lg">
                        <span className="text-slate-600">Transaction ID:</span>
                        <strong className="font-mono text-slate-900">{selectedAppForDetails.transactionId || 'TXN-MH-2026-948217'}</strong>
                      </div>
                      <div className="flex justify-between bg-white/70 p-2 rounded-lg">
                        <span className="text-slate-600">Payment Date:</span>
                        <strong className="text-slate-900">{selectedAppForDetails.appliedDate || '26/09/2026'}</strong>
                      </div>
                      <div className="flex justify-between bg-white/70 p-2 rounded-lg">
                        <span className="text-slate-600">Payment Gateway / Mode:</span>
                        <strong className="text-slate-900">{selectedAppForDetails.paymentMode || 'UPI / MahaOnline'}</strong>
                      </div>
                      <div className="flex justify-between bg-white/70 p-2 rounded-lg">
                        <span className="text-slate-600">Treasury Head Code:</span>
                        <strong className="font-mono text-slate-900">MH-REV-0875-LAB-01</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleDownloadAppReceipt(selectedAppForDetails)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Official Payment Receipt (.txt)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ENTERPRISE MASTER DATA */}
              {modalActiveTab === 'enterprise' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                      Registered Enterprise Master Parameters
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">Legal Enterprise Name:</span>
                        <div className="font-bold text-slate-900 mt-0.5">{profile.name}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Entity PAN:</span>
                        <div className="font-mono font-bold text-slate-900 mt-0.5">{profile.pan}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">GSTIN Registration:</span>
                        <div className="font-mono font-bold text-slate-900 mt-0.5">{profile.gstin}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Authorized Signatory:</span>
                        <div className="font-bold text-slate-900 mt-0.5">{profile.authorizedPersonName || 'Arya Darshan Shah'}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Industrial Sector:</span>
                        <div className="font-bold text-slate-900 mt-0.5">{profile.sector}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Unit Address & District:</span>
                        <div className="font-bold text-slate-900 mt-0.5">{profile.address || 'Ambad Industrial Area, Nashik, Maharashtra - 422010'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleDownloadFullDossier(selectedAppForDetails)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export Application Dossier</span>
              </button>

              <button
                onClick={() => setSelectedAppForDetails(null)}
                className="w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modern Compact Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200/80 py-3 px-6 text-[11px] text-slate-600 mt-auto">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Copyrights © 2026, MAITRI • MahaUdyogSetu. Department of Industries, Government of Maharashtra.</span>
          <span>Technical Support: 1800-120-8040 | maitri-support@maharashtra.gov.in</span>
        </div>
      </footer>

      </div>
    </div>
  );
};
