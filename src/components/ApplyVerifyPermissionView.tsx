import React, { useState, useMemo } from 'react';
import { BusinessProfile, DocumentItem, ApprovalItem } from '../types';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  FileText, 
  Clock, 
  IndianRupee, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Eye, 
  Upload, 
  AlertCircle,
  ChevronRight,
  RefreshCw,
  FolderOpen,
  Award,
  Zap,
  Briefcase,
  CheckCircle,
  XCircle,
  BadgeCheck,
  FileCheck2,
  Sliders,
  CheckSquare,
  Square,
  Shield,
  Send,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { getServiceReadinessDetail } from './MaitriPortalLayout';
import { ApplicationReadiness, ServiceDetail } from './ApplicationReadiness';

export interface CatalogServiceItem {
  id: string;
  code: string;
  name: string;
  department: string;
  category: string;
  applicationType: string; // e.g. Consent, Registration, License, Plan Approval, NOC
  whyRequired: string;
  docsCount: number;
  requiredDocsList: string[];
  sla: string;
  fees: string;
  stage: 'Pre-Establishment' | 'Pre-Operation' | 'Expansion' | 'Post-Commissioning';
  locationScope: string;
  district: string;
  sectorTag: string;
  isMandatory: boolean;
  isRenewal: boolean;
  minInvestmentCr?: number;
  minEmployees?: number;
  requiresHazardous?: boolean;
}

// Master Maharashtra Service Catalogue with metadata for smart matching
export const MASTER_SERVICE_CATALOGUE: CatalogServiceItem[] = [
  {
    id: 'srv-lab-shops',
    code: 'LAB-SH-01',
    name: 'Registration under Maharashtra Shops & Establishments Act, 2017',
    department: 'Labour Department, Maharashtra',
    category: 'Labour & Establishment',
    applicationType: 'Registration / Intimation',
    whyRequired: 'Mandatory statutory establishment registration for all commercial, manufacturing & corporate entities operating in Maharashtra.',
    docsCount: 4,
    requiredDocsList: [
      'Certificate of Incorporation & Company Master Data',
      'PAN Card of Company / Entity',
      'Authorized Signatory ID & Board Authorization Resolution',
      'Registered Office / Factory Address Proof'
    ],
    sla: '1 Day',
    fees: '₹ 1,000',
    stage: 'Pre-Establishment',
    locationScope: 'All Maharashtra',
    district: 'Statewide',
    sectorTag: 'All Sectors',
    isMandatory: true,
    isRenewal: false
  },
  {
    id: 'srv-dish-plan',
    code: 'DISH-PLN-APP',
    name: 'Factory Building Plan Approval under Factories Act, 1948',
    department: 'Directorate of Industrial Safety and Health (DISH)',
    category: 'Industrial Safety & Building',
    applicationType: 'Plan Approval / Sanction',
    whyRequired: 'Statutory approval of architectural plans, machine pathways, ventilation, and emergency exits before factory construction.',
    docsCount: 6,
    requiredDocsList: [
      'Factory Architectural Building Plan & Cross Sections',
      'Machinery Layout & Material Movement Pathways',
      'Certificate of Incorporation & Company Master Data',
      'Detailed Manufacturing Process Flow & Mass Balance',
      'Electrical Single Line Diagram (SLD)',
      'Hazard Control & Safety Measures Blueprint'
    ],
    sla: '20 Days',
    fees: '₹ 18,500',
    stage: 'Pre-Establishment',
    locationScope: 'Industrial & MIDC Zones',
    district: 'Statewide',
    sectorTag: 'Manufacturing & Heavy Engineering',
    isMandatory: true,
    isRenewal: false,
    minEmployees: 10
  },
  {
    id: 'srv-dish-lic',
    code: 'DISH-LIC-NEW',
    name: 'Grant and Renewal of Factory License under Factories Act, 1948',
    department: 'Directorate of Industrial Safety and Health (DISH)',
    category: 'Industrial Safety & Factory',
    applicationType: 'License / Registration',
    whyRequired: 'Authorizes industrial manufacturing operations, worker occupational safety and compliance with 2024 Maharashtra Factory Rules.',
    docsCount: 6,
    requiredDocsList: [
      'Form 2 Notice of Occupation',
      'Certificate of Stability by Competent Person',
      'Factory Building Plan Approval Copy',
      'Safety Officer Appointment Order',
      'Machinery Single Line Layout',
      'Emergency Preparedness Plan'
    ],
    sla: '15 Days',
    fees: '₹ 12,000',
    stage: 'Pre-Operation',
    locationScope: 'All Industrial Units',
    district: 'Statewide',
    sectorTag: 'Manufacturing & Heavy Engineering',
    isMandatory: true,
    isRenewal: true,
    minEmployees: 10
  },
  {
    id: 'srv-mpcb-cte',
    code: 'CTE-AIR-WATER',
    name: 'Consent to Establish (CTE) under Water (P&CP) Act & Air (P&CP) Act',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    category: 'Environmental & Pollution Control',
    applicationType: 'Consent / Clearance',
    whyRequired: 'Mandatory environmental pollution clearance before breaking ground, erecting plant or installing machinery.',
    docsCount: 7,
    requiredDocsList: [
      'PAN Card of Company / Entity',
      'Certificate of Incorporation & Company Master Data',
      'Land Ownership Document / MIDC Allotment Letter',
      'Detailed Project Report (DPR) & CA Investment Certificate',
      'Factory Architectural Building Plan & Site Index',
      'Manufacturing Process Flow Chart & Mass Balance',
      'Pollution Control System Proposal (ETP/STP & APCD)'
    ],
    sla: '21 Days',
    fees: '₹ 25,000',
    stage: 'Pre-Establishment',
    locationScope: 'Statewide',
    district: 'Statewide',
    sectorTag: 'Chemical, Pharma, Engineering, Food & Agro',
    isMandatory: true,
    isRenewal: false
  },
  {
    id: 'srv-fire-noc',
    code: 'FIRE-NOC-PROV',
    name: 'Provisional Fire Safety No Objection Certificate (Fire NOC)',
    department: 'Maharashtra Fire Services (MIDC Fire Dept)',
    category: 'Safety & Hazard Control',
    applicationType: 'NOC / Permission',
    whyRequired: 'Validation of fire fighting hydrant systems, smoke detection, emergency evacuation corridors and tender turning radiuses.',
    docsCount: 4,
    requiredDocsList: [
      'Factory Architectural Building Plan & Fire Exit Routes',
      'Land Ownership Document / MIDC Allotment Letter',
      'Hazard Identification & Emergency Response Plan',
      'Electrical Single Line Diagram (SLD)'
    ],
    sla: '14 Days',
    fees: '₹ 15,000',
    stage: 'Pre-Establishment',
    locationScope: 'MIDC & Non-MIDC Estates',
    district: 'Statewide',
    sectorTag: 'All Industrial Occupancies',
    isMandatory: true,
    isRenewal: false
  },
  {
    id: 'srv-midc-plan',
    code: 'MIDC-BLD-PLAN',
    name: 'Industrial Building / Development Permission & Commencement Certificate',
    department: 'Maharashtra Industrial Development Corporation (MIDC)',
    category: 'Land & Infrastructure',
    applicationType: 'Development Permission',
    whyRequired: 'Special Planning Authority sanction for industrial plot building elevations, setbacks, and construction commencement.',
    docsCount: 5,
    requiredDocsList: [
      'MIDC Plot Allotment Order & Lease Agreement',
      'Architectural Master Site Plan & Cross Sections',
      'Structural Stability & Load Calculations',
      'Rainwater Harvesting & Parking Layout Plan',
      'Demarcation & Possession Handover Receipt'
    ],
    sla: '21 Days',
    fees: '₹ 22,000',
    stage: 'Pre-Establishment',
    locationScope: 'MIDC Notified Areas',
    district: 'Statewide',
    sectorTag: 'Industrial Plots',
    isMandatory: true,
    isRenewal: false
  },
  {
    id: 'srv-lab-cl',
    code: 'LAB-CL-REG-01',
    name: 'Contract Labour Registration for Principal Employer (R&A Act 1970)',
    department: 'Labour Department, Maharashtra',
    category: 'Labour & Factory Safety',
    applicationType: 'Registration',
    whyRequired: 'Required for employing or engaging 20 or more contract workmen through licensed contractors.',
    docsCount: 4,
    requiredDocsList: [
      'Certificate of Incorporation & Company PAN Card',
      'Principal Employer KYC & Board Resolution',
      'Contractor Deployment Agreement & Worker Schedule',
      'Proof of Factory Location'
    ],
    sla: '7 Days',
    fees: '₹ 2,500',
    stage: 'Pre-Operation',
    locationScope: 'All Units with Contract Workers',
    district: 'Statewide',
    sectorTag: 'All Sectors',
    isMandatory: false,
    isRenewal: true,
    minEmployees: 20
  },
  {
    id: 'srv-pwr-sanct',
    code: 'PWR-HT-350',
    name: 'Sanction and Release of Industrial Power Load (HT / LT Connection)',
    department: 'Energy Department (MSEDCL / Mahavitaran)',
    category: 'Utility & Infrastructure',
    applicationType: 'Power Sanction & Energization',
    whyRequired: 'High Tension (HT) / Low Tension (LT) electricity load sanction, transformer substation line feasibility, and meter energization.',
    docsCount: 3,
    requiredDocsList: [
      'PAN Card of Company / Entity',
      'Land Ownership / MIDC Allotment Letter',
      'BEE Approved Single Line Electrical Diagram (SLD)'
    ],
    sla: '10 Days',
    fees: '₹ 35,000',
    stage: 'Pre-Establishment',
    locationScope: 'All Maharashtra',
    district: 'Statewide',
    sectorTag: 'Manufacturing, IT, Engineering',
    isMandatory: true,
    isRenewal: false
  },
  {
    id: 'srv-midc-plot',
    code: 'MIDC-PLOT-ALLOT',
    name: 'Allotment of Industrial Plot / Land in MIDC Industrial Estates',
    department: 'Maharashtra Industrial Development Corporation (MIDC)',
    category: 'Land & Property',
    applicationType: 'Land Allotment / Lease',
    whyRequired: '95-year leasehold allotment of developed industrial plots in designated MIDC industrial parks with water, power & CETP infrastructure.',
    docsCount: 5,
    requiredDocsList: [
      'Company Profile & Detailed Project Report (DPR)',
      'CA Certified Investment & Net Worth Certificate',
      'Certificate of Incorporation & PAN Card',
      'Pollution Load & Water Requirement Estimates',
      'Machinery List & Power Demand Forecast'
    ],
    sla: '30 Days',
    fees: 'Market Rate (₹ 15,000 Processing)',
    stage: 'Pre-Establishment',
    locationScope: 'MIDC Industrial Zones',
    district: 'Statewide',
    sectorTag: 'All Sectors',
    isMandatory: true,
    isRenewal: false
  },
  {
    id: 'srv-midc-wtr',
    code: 'MIDC-WTR-CONN',
    name: 'Industrial Water Supply Sanction in MIDC Industrial Areas',
    department: 'Maharashtra Industrial Development Corporation (MIDC)',
    category: 'Utility & Infrastructure',
    applicationType: 'Water Connection Sanction',
    whyRequired: 'Statutory industrial water connection pipeline connection agreement from MIDC water supply network.',
    docsCount: 3,
    requiredDocsList: [
      'MIDC Plot Possession Order',
      'Approved Plumbing & Drainage Layout',
      'Water Balance Flow Diagram'
    ],
    sla: '10 Days',
    fees: '₹ 5,000',
    stage: 'Pre-Operation',
    locationScope: 'MIDC Areas',
    district: 'Statewide',
    sectorTag: 'Industrial Units',
    isMandatory: true,
    isRenewal: false
  },
  {
    id: 'srv-doi-psi',
    code: 'DOI-PSI-2019',
    name: 'Package Scheme of Incentives (PSI) – Industrial Promotion Subsidy (IPS)',
    department: 'Directorate of Industries, Maharashtra',
    category: 'Fiscal Incentives & Subsidies',
    applicationType: 'Incentive Sanction / Eligibility Cert',
    whyRequired: 'Grants capital investment subsidies, electricity duty exemptions, and SGST reimbursement under Maharashtra Industrial Policy.',
    docsCount: 6,
    requiredDocsList: [
      'CA Certified Fixed Capital Investment Certificate',
      'First Sale Invoice & Commercial Production Proof',
      'Consent to Operate (CTO) from MPCB',
      'Factory License Copy',
      'Bank Loan Sanction & Disbursement Letter',
      'Electricity Energization Bill'
    ],
    sla: '30 Days',
    fees: 'Nil (Free)',
    stage: 'Post-Commissioning',
    locationScope: 'Zone B, C, D, D+ Areas',
    district: 'Nashik, Pune, Aurangabad, Nagpur, Solapur, Kolhapur',
    sectorTag: 'MSME, Large & Mega Units',
    isMandatory: false,
    isRenewal: false
  },
  {
    id: 'srv-blr-reg',
    code: 'BLR-REG-01',
    name: 'Registration and Approval of Boilers and Steam Pipelines (Indian Boilers Act)',
    department: 'Directorate of Boilers, Maharashtra',
    category: 'Boilers & Pressure Vessels',
    applicationType: 'Registration & Inspection',
    whyRequired: 'Statutory safety registration and hydrostatic hydraulic testing of steam boilers and high pressure piping.',
    docsCount: 5,
    requiredDocsList: [
      'IBR Boiler Manufacturer Certificate (Form II/III)',
      'Steam Pipeline Fabrication & Welding Drawing',
      'Erection & Foundation Stability Blueprint',
      'Boiler Attendant / Engineer Competency Certificate',
      'Safety Valve Testing & Inspection Certificate'
    ],
    sla: '15 Days',
    fees: '₹ 15,000',
    stage: 'Pre-Operation',
    locationScope: 'Statewide',
    district: 'Statewide',
    sectorTag: 'Pharma, Chemical, Food Processing, Power',
    isMandatory: false,
    isRenewal: true
  }
];

// Sample Verified Demo Permissions for Tab 03
export interface VerifiedPermissionRecord {
  id: string;
  permissionNumber: string;
  certificateNumber: string;
  businessName: string;
  serviceName: string;
  department: string;
  issueDate: string;
  validUntil: string;
  status: 'ACTIVE / VALID' | 'EXPIRED' | 'SUSPENDED';
  qrVerificationCode: string;
  premisesAddress: string;
}

export const DEMO_VERIFIED_RECORDS: VerifiedPermissionRecord[] = [
  {
    id: 'APP-PCB-01',
    permissionNumber: 'MPCB/RO-NSK/CTE/2026/0084',
    certificateNumber: 'MH-PCB-CTE-2026-9812',
    businessName: 'Western Maharashtra Engineering Private Limited',
    serviceName: 'Consent to Establish (CTE) under Water & Air Acts',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    issueDate: '2026-03-20',
    validUntil: '2031-03-19 (5 Years)',
    status: 'ACTIVE / VALID',
    qrVerificationCode: 'QR-MPCB-MH-948217',
    premisesAddress: 'Plot No. 18, Ambad MIDC, Nashik, Maharashtra – 422010'
  },
  {
    id: 'APP-LAB-SHOPS-01',
    permissionNumber: 'MH/LAB/SHOPS/2026/44012',
    certificateNumber: 'MH-SHOPS-2026-44012',
    businessName: 'Western Maharashtra Engineering Private Limited',
    serviceName: 'Registration under Maharashtra Shops & Establishments Act, 2017',
    department: 'Labour Department, Maharashtra',
    issueDate: '2026-01-15',
    validUntil: 'Permanent (Self-Certified)',
    status: 'ACTIVE / VALID',
    qrVerificationCode: 'QR-LAB-MH-118833',
    premisesAddress: 'Ambad Industrial Estate, Nashik, Maharashtra'
  },
  {
    id: 'APP-PWR-01',
    permissionNumber: 'MSEDCL/NSK/HT-350KW/7741',
    certificateNumber: 'MH-PWR-HT-2026-7741',
    businessName: 'Western Maharashtra Engineering Private Limited',
    serviceName: 'Sanction and Release of Industrial Power Load (350 kW HT)',
    department: 'Energy Department (MSEDCL / Mahavitaran)',
    issueDate: '2026-02-10',
    validUntil: '2029-03-31',
    status: 'ACTIVE / VALID',
    qrVerificationCode: 'QR-PWR-MH-552091',
    premisesAddress: 'Plot No. 18, Ambad MIDC, Sector C, Nashik'
  },
  {
    id: 'APP-DISH-01',
    permissionNumber: 'DISH/MH/NSK/LIC/2025/119',
    certificateNumber: 'MH-DISH-LIC-2025-119',
    businessName: 'Bharat Innovations & Technologies Pvt Ltd',
    serviceName: 'Grant and Renewal of Factory License under Factories Act, 1948',
    department: 'Directorate of Industrial Safety and Health (DISH)',
    issueDate: '2025-04-01',
    validUntil: '2026-03-31 (Renewal Due)',
    status: 'ACTIVE / VALID',
    qrVerificationCode: 'QR-DISH-MH-881204',
    premisesAddress: 'MIDC Chakan Industrial Zone, Pune, Maharashtra'
  }
];

interface ApplyVerifyPermissionViewProps {
  profile: BusinessProfile;
  documents: DocumentItem[];
  approvals: ApprovalItem[];
  onUpdateProfile: (newProfile: BusinessProfile) => void;
  onUpdateDocuments: (newDocs: DocumentItem[]) => void;
  onUpdateApprovals: (newApprovals: ApprovalItem[]) => void;
  onBackToDashboard: () => void;
  onViewApplications: () => void;
  initialSelectedService?: ServiceDetail | null;
}

export const ApplyVerifyPermissionView: React.FC<ApplyVerifyPermissionViewProps> = ({
  profile,
  documents,
  approvals,
  onUpdateProfile,
  onUpdateDocuments,
  onUpdateApprovals,
  onBackToDashboard,
  onViewApplications,
  initialSelectedService
}) => {
  // Main Top Mode: 'hub' (3 Cards) | 'wizard' (01 Apply) | 'catalogue' (02 List) | 'verify' (03 Verify)
  const [activeMode, setActiveMode] = useState<'hub' | 'wizard' | 'catalogue' | 'verify'>('hub');

  // Active selected service for full Application Readiness flow
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<ServiceDetail | null>(initialSelectedService || null);

  // =========================================================================
  // 01. STEP-BY-STEP APPLICATION WIZARD STATE
  // =========================================================================
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Step 1: Business Info
  const [wizardBizName, setWizardBizName] = useState(profile.name || 'Western Maharashtra Engineering Private Limited');
  const [wizardBizType, setWizardBizType] = useState(profile.businessType || 'Private Limited');
  const [wizardSector, setWizardSector] = useState(profile.sector || 'Engineering & Heavy Manufacturing');
  const [wizardDistrict, setWizardDistrict] = useState(profile.district || 'Nashik');
  const [wizardTaluka, setWizardTaluka] = useState(profile.taluka || 'Ambad');
  const [wizardLocation, setWizardLocation] = useState(profile.address || 'Plot No. 18, Ambad MIDC, Nashik');

  // Step 2: Project Info
  const [wizardProjectType, setWizardProjectType] = useState<'New' | 'Existing' | 'Expansion'>('New');
  const [wizardInvestmentCr, setWizardInvestmentCr] = useState<number>(profile.investmentCrores || 18.5);
  const [wizardEmployees, setWizardEmployees] = useState<number>(profile.workforce || 75);
  const [wizardLandStatus, setWizardLandStatus] = useState<string>('MIDC Allotted Plot');
  const [wizardProjectStage, setWizardProjectStage] = useState<'Pre-Establishment' | 'Pre-Operation' | 'Expansion'>('Pre-Establishment');

  // Step 3: Requirement Type
  const [wizardRequirementTypes, setWizardRequirementTypes] = useState<string[]>(['Establishment', 'New Permission']);

  // Selected Applicable Services checklist
  const [selectedApplicableServiceIds, setSelectedApplicableServiceIds] = useState<string[]>([]);

  // Dynamically generated Applicable Services checklist based on Step 1, 2, 3 inputs
  const matchedApplicableServices = useMemo(() => {
    return MASTER_SERVICE_CATALOGUE.filter(srv => {
      // If Stage is Pre-Establishment
      if (wizardProjectStage === 'Pre-Establishment' && srv.stage === 'Pre-Establishment') {
        return true;
      }
      // If Stage is Pre-Operation
      if (wizardProjectStage === 'Pre-Operation' && (srv.stage === 'Pre-Operation' || srv.code === 'LAB-SH-01')) {
        return true;
      }
      // If Employee threshold met
      if (srv.minEmployees && wizardEmployees < srv.minEmployees) {
        return false;
      }
      // If Sector aligns
      if (srv.sectorTag !== 'All Sectors' && !srv.sectorTag.toLowerCase().includes(wizardSector.split(' ')[0].toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [wizardProjectStage, wizardSector, wizardEmployees]);

  // Toggle selection for multiple services in wizard
  const toggleSelectService = (id: string) => {
    setSelectedApplicableServiceIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllApplicable = () => {
    setSelectedApplicableServiceIds(matchedApplicableServices.map(s => s.id));
  };

  const deselectAllApplicable = () => {
    setSelectedApplicableServiceIds([]);
  };

  // Launch single or primary service readiness flow from wizard
  const handleLaunchServiceReadiness = (srv: CatalogServiceItem) => {
    const detail = getServiceReadinessDetail(
      {
        id: srv.id,
        code: srv.code,
        name: srv.name,
        sla: srv.sla,
        fees: srv.fees
      },
      srv.department,
      {
        ...profile,
        name: wizardBizName,
        businessType: wizardBizType as any,
        sector: wizardSector,
        district: wizardDistrict,
        taluka: wizardTaluka,
        investmentCrores: wizardInvestmentCr,
        workforce: wizardEmployees
      }
    );
    setSelectedServiceDetail(detail);
  };

  // =========================================================================
  // 02. LIST OF SERVICES (SEARCHABLE CATALOGUE) STATE
  // =========================================================================
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [catDepartment, setCatDepartment] = useState('All');
  const [catSector, setCatSector] = useState('All');
  const [catDistrict, setCatDistrict] = useState('All');
  const [catServiceType, setCatServiceType] = useState('All');
  const [catAppOrRenewal, setCatAppOrRenewal] = useState<'All' | 'New Application' | 'Renewal'>('All');
  const [catMandatoryFilter, setCatMandatoryFilter] = useState<'All' | 'Mandatory' | 'Conditional'>('All');

  // Filter lists derived from catalog
  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    MASTER_SERVICE_CATALOGUE.forEach(s => set.add(s.department));
    return ['All', ...Array.from(set)];
  }, []);

  const serviceTypesList = ['All', 'Consent / Clearance', 'Plan Approval / Sanction', 'Registration / Intimation', 'NOC / Permission', 'Development Permission', 'Power Sanction & Energization', 'Land Allotment / Lease', 'Incentive Sanction / Eligibility Cert'];
  const districtsList = ['All', 'Statewide', 'Nashik', 'Pune', 'Aurangabad', 'Nagpur', 'Thane', 'Kolhapur'];
  const sectorsList = ['All', 'Manufacturing & Heavy Engineering', 'Chemical, Pharma, Engineering, Food & Agro', 'All Sectors'];

  const filteredCatalogue = useMemo(() => {
    return MASTER_SERVICE_CATALOGUE.filter(item => {
      // Search query
      if (catSearchQuery.trim()) {
        const q = catSearchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchDept = item.department.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchWhy = item.whyRequired.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchDept && !matchCat && !matchWhy) return false;
      }

      // Department filter
      if (catDepartment !== 'All' && item.department !== catDepartment) return false;

      // Service Type filter
      if (catServiceType !== 'All' && !item.applicationType.toLowerCase().includes(catServiceType.toLowerCase())) return false;

      // New vs Renewal filter
      if (catAppOrRenewal === 'New Application' && item.isRenewal) return false;
      if (catAppOrRenewal === 'Renewal' && !item.isRenewal) return false;

      // Mandatory vs Conditional filter
      if (catMandatoryFilter === 'Mandatory' && !item.isMandatory) return false;
      if (catMandatoryFilter === 'Conditional' && item.isMandatory) return false;

      return true;
    });
  }, [catSearchQuery, catDepartment, catServiceType, catAppOrRenewal, catMandatoryFilter]);

  // =========================================================================
  // 03. VERIFY A PERMISSION STATE
  // =========================================================================
  const [verifySearchType, setVerifySearchType] = useState<'permission_no' | 'app_id' | 'cert_no'>('permission_no');
  const [verifyInputNumber, setVerifyInputNumber] = useState('MPCB/RO-NSK/CTE/2026/0084');
  const [verifyBusinessName, setVerifyBusinessName] = useState('Western Maharashtra Engineering Private Limited');
  const [verifyDepartment, setVerifyDepartment] = useState('All');
  const [verificationResult, setVerificationResult] = useState<{
    searched: boolean;
    found: boolean;
    record?: VerifiedPermissionRecord;
    searchedQuery?: string;
  }>({ searched: false, found: false });

  const handleExecuteVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInputNumber.trim()) {
      alert("Please enter a Permission Number, Application ID or Certificate Number to verify.");
      return;
    }

    const query = verifyInputNumber.trim().toLowerCase();
    const matched = DEMO_VERIFIED_RECORDS.find(rec => {
      const matchPerm = rec.permissionNumber.toLowerCase().includes(query);
      const matchCert = rec.certificateNumber.toLowerCase().includes(query);
      const matchId = rec.id.toLowerCase().includes(query);
      return matchPerm || matchCert || matchId;
    });

    if (matched) {
      setVerificationResult({
        searched: true,
        found: true,
        record: matched,
        searchedQuery: verifyInputNumber.trim()
      });
    } else {
      setVerificationResult({
        searched: true,
        found: false,
        searchedQuery: verifyInputNumber.trim()
      });
    }
  };

  // If a specific service has been clicked into, render the dedicated Service Details & Document Readiness flow
  if (selectedServiceDetail) {
    return (
      <ApplicationReadiness
        service={selectedServiceDetail}
        profile={profile}
        vaultDocuments={documents}
        onBack={() => setSelectedServiceDetail(null)}
        onCompleteRequirements={() => {
          setSelectedServiceDetail(null);
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
        }}
        onViewApplicationDetails={(app) => {
          setSelectedServiceDetail(null);
          onViewApplications();
        }}
        onViewApplicationStatus={() => {
          setSelectedServiceDetail(null);
          onViewApplications();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Universal Page Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                MahaUdyogSetu • Permission Gateway
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                Single Window Clearance
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Apply & Verify Permission
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Find permissions applicable to your industry, verify statutory requirements, and validate existing licences with Government of Maharashtra authorities.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="self-start sm:self-center px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* 3 Interactive Mode Cards Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* 01 — Apply for Services */}
          <div
            onClick={() => { setActiveMode('wizard'); setWizardStep(1); }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 text-left relative overflow-hidden group ${
              activeMode === 'wizard'
                ? 'bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/30 border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-indigo-300 shadow-xs'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black font-mono px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  01
                </span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Step Wizard ➔
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                Apply for Services
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit applications for licences, registrations, NOCs and other approvals using your business profile.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-indigo-700">
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              <span>Smart Approval Checklist</span>
            </div>
          </div>

          {/* 02 — List of Services */}
          <div
            onClick={() => setActiveMode('catalogue')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 text-left relative overflow-hidden group ${
              activeMode === 'catalogue'
                ? 'bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-blue-300 shadow-xs'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black font-mono px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  02
                </span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Catalogue ➔
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                List of Services
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explore all available services and filter them according to your department, sector, and business stage.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-700">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Searchable Master Catalogue</span>
            </div>
          </div>

          {/* 03 — Verify a Permission */}
          <div
            onClick={() => setActiveMode('verify')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 text-left relative overflow-hidden group ${
              activeMode === 'verify'
                ? 'bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-emerald-300 shadow-xs'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  03
                </span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Verification ➔
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                Verify a Permission
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Verify an existing licence, approval, NOC or certificate authenticity issued by Maharashtra departments.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Validity Checker</span>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: STEP-BY-STEP APPLICATION WIZARD (01 - APPLY FOR SERVICES)
         ========================================================================= */}
      {activeMode === 'wizard' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6 animate-fadeIn">
          
          {/* Wizard Stepper Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-xs font-bold">
              
              <button
                onClick={() => setWizardStep(1)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  wizardStep === 1
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : wizardStep > 1 ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">1</span>
                <span>Step 1 — Business Info</span>
              </button>

              <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />

              <button
                onClick={() => setWizardStep(2)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  wizardStep === 2
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : wizardStep > 2 ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">2</span>
                <span>Step 2 — Project Info</span>
              </button>

              <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />

              <button
                onClick={() => setWizardStep(3)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  wizardStep === 3
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : wizardStep > 3 ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">3</span>
                <span>Step 3 — Requirements</span>
              </button>

              <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />

              <button
                onClick={() => setWizardStep(4)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  wizardStep === 4
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">4</span>
                <span>Applicable Services Checklist</span>
              </button>

            </div>
          </div>

          {/* STEP 1: BUSINESS INFORMATION */}
          {wizardStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-900">
                  Step 1 — Business Information
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your registered enterprise details in Maharashtra to tailor statutory requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Company / Business Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={wizardBizName}
                    onChange={(e) => setWizardBizName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Western Maharashtra Engineering Pvt Ltd"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Business Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={wizardBizType}
                    onChange={(e) => setWizardBizType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Private Limited">Private Limited Company</option>
                    <option value="Public Limited">Public Limited Company</option>
                    <option value="Partnership">Partnership Firm / LLP</option>
                    <option value="Proprietorship">Sole Proprietorship</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Industry Sector <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={wizardSector}
                    onChange={(e) => setWizardSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Engineering & Heavy Manufacturing">Engineering & Heavy Manufacturing</option>
                    <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                    <option value="Pharmaceuticals & Bulk Drugs">Pharmaceuticals & Bulk Drugs</option>
                    <option value="Food Processing & Agro Industries">Food Processing & Agro Industries</option>
                    <option value="Textiles, Apparels & Garments">Textiles, Apparels & Garments</option>
                    <option value="Information Technology (IT / ITeS)">Information Technology (IT / ITeS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    District <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={wizardDistrict}
                    onChange={(e) => setWizardDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Nashik">Nashik</option>
                    <option value="Pune">Pune</option>
                    <option value="Aurangabad">Chhatrapati Sambhajinagar (Aurangabad)</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Thane">Thane</option>
                    <option value="Kolhapur">Kolhapur</option>
                    <option value="Solapur">Solapur</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Taluka <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={wizardTaluka}
                    onChange={(e) => setWizardTaluka(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Ambad, Haveli, Chakan, Butibori"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Factory / Unit Location Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={wizardLocation}
                    onChange={(e) => setWizardLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Plot No. 18, Ambad MIDC Industrial Estate"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Proceed to Step 2 — Project Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PROJECT INFORMATION */}
          {wizardStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-900">
                  Step 2 — Project Information
                </h2>
                <p className="text-xs text-slate-500">
                  Specify investment, scale and infrastructure setup to accurately trigger environmental & factory approvals.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Project Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['New', 'Existing', 'Expansion'] as const).map(pType => (
                      <button
                        key={pType}
                        type="button"
                        onClick={() => setWizardProjectType(pType)}
                        className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                          wizardProjectType === pType
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pType}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Proposed Capital Investment in Plant & Machinery <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="150"
                      step="0.5"
                      value={wizardInvestmentCr}
                      onChange={(e) => setWizardInvestmentCr(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 text-xs shrink-0">
                      ₹ {wizardInvestmentCr} Cr
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Number of Employees / Workforce <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={wizardEmployees}
                    onChange={(e) => setWizardEmployees(parseInt(e.target.value) || 10)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 75 Employees"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    (Threshold &gt; 10 triggers Factories Act 1948 DISH building approvals)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Land Possession & Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={wizardLandStatus}
                    onChange={(e) => setWizardLandStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="MIDC Allotted Plot">MIDC Allotted Industrial Plot</option>
                    <option value="Private Industrial Zone (NA Approved)">Private Industrial Zone (NA Approved)</option>
                    <option value="Agricultural Land (CLU Required)">Agricultural Land (Change of Land Use Required)</option>
                    <option value="Rented Industrial Shed">Rented / Leased Industrial Shed</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">
                    Project Stage <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Pre-Establishment', 'Pre-Operation', 'Expansion'] as const).map(stage => (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => setWizardProjectStage(stage)}
                        className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                          wizardProjectStage === stage
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  ← Back to Step 1
                </button>

                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Proceed to Step 3 — Requirement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REQUIREMENT SELECTION */}
          {wizardStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-900">
                  Step 3 — Requirement Type
                </h2>
                <p className="text-xs text-slate-500">
                  Select all the regulatory actions and clearances your project requires today.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'Establishment', title: 'Establishment / Green-Field Sanctions', desc: 'Pre-construction clearances, Land, MPCB CTE, DISH Plan & Fire NOC.' },
                  { id: 'Expansion', title: 'Expansion / Capacity Enhancement', desc: 'Additional power load, line expansions, amended environmental CTE.' },
                  { id: 'Renewal', title: 'Renewal of Licences / Consents', desc: 'Periodic renewals for Factory License, MPCB CTO, Boilers.' },
                  { id: 'Modification', title: 'Modification / Change of Product Mix', desc: 'Amendments to industrial products, raw materials, or building layouts.' },
                  { id: 'New Permission', title: 'New Permissions & Utility Connections', desc: 'Water sanction, grid solar net metering, hazardous waste auth.' }
                ].map((req) => {
                  const isChecked = wizardRequirementTypes.includes(req.id);
                  return (
                    <div
                      key={req.id}
                      onClick={() => {
                        setWizardRequirementTypes(prev => 
                          prev.includes(req.id) ? prev.filter(x => x !== req.id) : [...prev, req.id]
                        );
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                        isChecked
                          ? 'bg-indigo-50/70 border-indigo-600 text-slate-900 shadow-xs ring-1 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-black text-xs text-slate-900">{req.title}</span>
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {req.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  ← Back to Step 2
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // Auto select all generated applicable services
                    setSelectedApplicableServiceIds(matchedApplicableServices.map(s => s.id));
                    setWizardStep(4);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Applicable Services & Permissions ➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: AUTOMATICALLY GENERATED APPLICABLE SERVICES CHECKLIST */}
          {wizardStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Personalized Regulatory Engine
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {wizardBizName} • ₹ {wizardInvestmentCr} Cr ({wizardSector})
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Applicable Services & Permissions
                  </h2>
                  <p className="text-xs text-slate-500">
                    The engine has customized {matchedApplicableServices.length} statutory permissions matching your project stage ({wizardProjectStage}).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllApplicable}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={deselectAllApplicable}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Deselect
                  </button>
                </div>
              </div>

              {/* Checklist Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-black border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">Select</th>
                      <th className="py-3 px-3">Service Name</th>
                      <th className="py-3 px-3">Department</th>
                      <th className="py-3 px-3">Why Required</th>
                      <th className="py-3 px-3">Required Documents</th>
                      <th className="py-3 px-3">SLA</th>
                      <th className="py-3 px-3">Fee</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {matchedApplicableServices.map((srv) => {
                      const isSelected = selectedApplicableServiceIds.includes(srv.id);
                      return (
                        <tr key={srv.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                          <td className="py-3.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectService(srv.id)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-black text-slate-900 text-xs">{srv.name}</div>
                            <span className="font-mono text-[10px] text-slate-400 font-bold">{srv.code}</span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-700 font-semibold text-[11px]">
                            {srv.department}
                          </td>
                          <td className="py-3.5 px-3 text-[11px] text-slate-500 max-w-[220px]">
                            {srv.whyRequired}
                          </td>
                          <td className="py-3.5 px-3 text-[11px]">
                            <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              <FileText className="w-3 h-3" />
                              {srv.docsCount} Docs
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-800 text-[11px]">
                            {srv.sla}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-emerald-800 text-[11px]">
                            {srv.fees}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Pending Upload
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleLaunchServiceReadiness(srv)}
                              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0 ml-auto"
                            >
                              <span>Apply Now</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom navigation from Wizard Step 4 to Document Verification */}
              <div className="p-4 bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="font-black text-sm">
                    {selectedApplicableServiceIds.length} Services Selected for Single Window Verification
                  </div>
                  <p className="text-xs text-indigo-200">
                    Proceed to upload required dossiers and calculate your Application Readiness score.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    ← Edit Inputs
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // Open the first selected service
                      const firstSrvId = selectedApplicableServiceIds[0] || matchedApplicableServices[0]?.id;
                      const srv = MASTER_SERVICE_CATALOGUE.find(s => s.id === firstSrvId) || MASTER_SERVICE_CATALOGUE[0];
                      handleLaunchServiceReadiness(srv);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-black text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Document Upload & Verification ➔</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: LIST OF SERVICES (02 - SEARCHABLE CATALOGUE)
         ========================================================================= */}
      {activeMode === 'catalogue' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Searchable Service Catalogue
                </h2>
                <p className="text-xs text-slate-500">
                  Explore all clearances and industrial permissions available under Maharashtra Single Window System.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                {filteredCatalogue.length} Services Available
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catSearchQuery}
                onChange={(e) => setCatSearchQuery(e.target.value)}
                placeholder="Search service name, department, or keyword (e.g. Boilers, CTE, DISH, Fire NOC, Water)..."
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              />
              {catSearchQuery && (
                <button
                  onClick={() => setCatSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
              
              {/* Department */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</label>
                <select
                  value={catDepartment}
                  onChange={(e) => setCatDepartment(e.target.value)}
                  className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Service Type */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Type</label>
                <select
                  value={catServiceType}
                  onChange={(e) => setCatServiceType(e.target.value)}
                  className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {serviceTypesList.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* New / Renewal */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">App / Renewal</label>
                <select
                  value={catAppOrRenewal}
                  onChange={(e) => setCatAppOrRenewal(e.target.value as any)}
                  className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="All">All Applications</option>
                  <option value="New Application">New Application</option>
                  <option value="Renewal">Renewal Available</option>
                </select>
              </div>

              {/* Mandatory / Conditional */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Obligation</label>
                <select
                  value={catMandatoryFilter}
                  onChange={(e) => setCatMandatoryFilter(e.target.value as any)}
                  className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="All">All Services</option>
                  <option value="Mandatory">Mandatory Statutory</option>
                  <option value="Conditional">Conditional / Optional</option>
                </select>
              </div>

              {/* District */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">District</label>
                <select
                  value={catDistrict}
                  onChange={(e) => setCatDistrict(e.target.value)}
                  className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {districtsList.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                </select>
              </div>

              {/* Sector */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Industry Sector</label>
                <select
                  value={catSector}
                  onChange={(e) => setCatSector(e.target.value)}
                  className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {sectorsList.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                </select>
              </div>

            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCatalogue.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                      {srv.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {srv.code}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {srv.name}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <strong className="text-slate-800">{srv.department}</strong>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 pt-0.5">
                      {srv.whyRequired}
                    </p>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Docs</span>
                    <span className="font-extrabold text-slate-800 text-xs flex items-center justify-center gap-0.5 mt-0.5">
                      <FileText className="w-3 h-3 text-blue-500" />
                      {srv.docsCount}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">SLA</span>
                    <span className="font-extrabold text-slate-800 text-xs flex items-center justify-center gap-0.5 mt-0.5">
                      <Clock className="w-3 h-3 text-blue-500" />
                      {srv.sla}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Fee</span>
                    <span className="font-extrabold text-emerald-800 text-[11px] truncate block mt-0.5">
                      {srv.fees}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: View Details & Apply */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleLaunchServiceReadiness(srv)}
                    className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchServiceReadiness(srv)}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Apply Now ➔</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 3: VERIFY A PERMISSION (03 - PERMISSION VERIFICATION)
         ========================================================================= */}
      {activeMode === 'verify' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Verification Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Official Validity & QR Verification
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Permission & Certificate Verification
              </h2>
              <p className="text-xs text-slate-500">
                Verify the digital validity and authenticity of clearances, licences and NOCs issued across Maharashtra departments.
              </p>
            </div>

            {/* Verification Type Radio Selector */}
            <form onSubmit={handleExecuteVerification} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  Choose Search Method:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'permission_no', label: 'Permission Number' },
                    { id: 'app_id', label: 'Application ID' },
                    { id: 'cert_no', label: 'Certificate Number' }
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setVerifySearchType(method.id as any)}
                      className={`py-2.5 px-3 rounded-xl border font-black text-xs transition-all cursor-pointer ${
                        verifySearchType === method.id
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* ID / Certificate Input */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">
                    Enter {verifySearchType === 'permission_no' ? 'Permission Number' : verifySearchType === 'app_id' ? 'Application ID' : 'Certificate Number'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={verifyInputNumber}
                    onChange={(e) => setVerifyInputNumber(e.target.value)}
                    placeholder="e.g. MPCB/RO-NSK/CTE/2026/0084, MH-SHOPS-2026-44012..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Issuing Department (Optional) */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Issuing Department (Optional)
                  </label>
                  <select
                    value={verifyDepartment}
                    onChange={(e) => setVerifyDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="All">All Departments</option>
                    <option value="MPCB">Maharashtra Pollution Control Board</option>
                    <option value="Labour">Labour Department</option>
                    <option value="DISH">Directorate of Industrial Safety (DISH)</option>
                    <option value="Energy">Energy Department (MSEDCL)</option>
                    <option value="MIDC">MIDC</option>
                  </select>
                </div>

              </div>

              {/* Sample Quick Demo Tags */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1.5">
                <span className="font-bold text-slate-600 block">💡 Try Sample Verified Records:</span>
                <div className="flex flex-wrap gap-2">
                  {DEMO_VERIFIED_RECORDS.map(demo => (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => {
                        setVerifyInputNumber(demo.permissionNumber);
                        setVerifyBusinessName(demo.businessName);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 font-mono text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      {demo.permissionNumber} ({demo.department.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Permission</span>
                </button>
              </div>
            </form>
          </div>

          {/* VERIFICATION OUTCOME RESULT */}
          {verificationResult.searched && (
            verificationResult.found && verificationResult.record ? (
              /* VALID RECORD CARD */
              <div className="bg-white rounded-2xl border-2 border-emerald-400 p-6 sm:p-7 shadow-lg space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300 shrink-0">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Government Verified Record
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-0.5">
                        ✓ Permission Verified
                      </h3>
                    </div>
                  </div>

                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                    {verificationResult.record.status}
                  </span>
                </div>

                {/* Structured Attributes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Business Name</span>
                    <strong className="text-slate-900 text-sm mt-0.5 block">{verificationResult.record.businessName}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Permission / Consent Number</span>
                    <strong className="font-mono text-slate-900 text-xs mt-0.5 block">{verificationResult.record.permissionNumber}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Service / Approval Name</span>
                    <strong className="text-slate-900 text-xs mt-0.5 block">{verificationResult.record.serviceName}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Issuing Department</span>
                    <strong className="text-slate-900 text-xs mt-0.5 block">{verificationResult.record.department}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Issue Date</span>
                    <strong className="text-slate-900 text-xs mt-0.5 block">{verificationResult.record.issueDate}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Valid Until</span>
                    <strong className="text-emerald-800 text-xs mt-0.5 block font-bold">{verificationResult.record.validUntil}</strong>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-slate-600">Unit Premises: <strong>{verificationResult.record.premisesAddress}</strong></span>
                    <div className="text-[11px] text-slate-500 font-mono">Digital Signature ID: {verificationResult.record.qrVerificationCode} • Verified on {new Date().toLocaleDateString('en-GB')}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Downloading verified digital certificate copy for ${verificationResult.record?.permissionNumber}...`)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-2xs"
                  >
                    Download Digital Copy
                  </button>
                </div>
              </div>
            ) : (
              /* INVALID RECORD NOT FOUND */
              <div className="bg-white rounded-2xl border-2 border-rose-300 p-6 sm:p-7 shadow-lg space-y-4 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-300 shrink-0">
                    <AlertCircle className="w-7 h-7 text-rose-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                      Scrutiny Check Failed
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">
                      ⚠ Permission Not Found
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  No registered licence, clearance or certificate matching <strong>"{verificationResult.searchedQuery}"</strong> was found in the Government of Maharashtra digital repository.
                </p>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                  <span className="font-bold">Possible Causes:</span>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5">
                    <li>The number was typed incorrectly.</li>
                    <li>The clearance application is still under scrutiny and not yet officially issued.</li>
                    <li>The certificate was issued before digital single-window migration.</li>
                  </ul>
                </div>
              </div>
            )
          )}

        </div>
      )}

    </div>
  );
};
