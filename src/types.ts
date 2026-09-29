export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH';

export type ApprovalStatus = 
  | 'not_started' 
  | 'documents_pending' 
  | 'pre_validating' 
  | 'submitted' 
  | 'under_scrutiny' 
  | 'query_raised' 
  | 'inspection_scheduled' 
  | 'approved' 
  | 'rejected';

export type PollutionCategory = 'Red Category' | 'Orange Category' | 'Green Category' | 'White Category';

export interface BusinessProfile {
  id: string;
  name: string;
  businessType?: 'Private Limited' | 'Public Limited' | 'Partnership / LLP' | 'Proprietorship';
  cin?: string;
  pan: string;
  gstin: string;
  udyamRegistration?: string;
  authorizedPersonName?: string;
  authorizedPersonDesignation?: string;
  mobile?: string;
  email?: string;
  sector: string;
  activityDescription?: string;
  rawMaterials?: string[];
  finishedProducts?: string[];
  byProducts?: string[];
  state: string;
  district: string;
  taluka?: string;
  village?: string;
  plotNumber?: string;
  pincode?: string;
  address?: string;
  scale: 'Micro' | 'Small' | 'Medium' | 'Large';
  investmentCrores: number;
  builtUpAreaSqFt?: number;
  workforce: number;
  contractWorkersCount?: number;
  connectedPowerKw: number;
  isMIDC?: boolean;
  handlesHazardous: boolean;
  hazardDetails?: string;
  hazardControlMeasures?: string;
  hasBoiler?: boolean;
  boilerCapacityTph?: number;
  dgSetKva?: number;
  waterExtractionRequirementKld?: number;
  landType: 'Industrial Park (Allotted)' | 'Agricultural (Requires CLU)' | 'Private Commercial' | 'SEZ Free Trade Zone';
  stage: 'Pre-Establishment' | 'Pre-Operation' | 'Expansion';
  isProfileComplete?: boolean;
}

export type DocumentCategory = 
  | 'Company / Identity' 
  | 'Land & Property' 
  | 'Labour & Employees' 
  | 'Environmental' 
  | 'Factory & Safety' 
  | 'Utilities & Other Approvals'
  | 'Statutory' 
  | 'Technical' 
  | 'Financial' 
  | 'Land & Building';

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  category: DocumentCategory;
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'verified' | 'needs_correction' | 'pending';
  validationScore: number;
  checklistResults?: {
    check: string;
    passed: boolean;
    detail: string;
  }[];
  missingOrInvalidItems?: string[];
  correctionGuidance?: string;
  linkedApprovals: string[];
  usedBy?: string[];
}

export interface QueryItem {
  id: string;
  approvalId: string;
  department: string;
  officerName: string;
  dateRaised: string;
  deadlineDate: string;
  queryText: string;
  status: 'pending' | 'resolved';
  responseDraft?: string;
  responseText?: string;
  attachedDocs?: string[];
}

export interface InspectionDetails {
  id: string;
  inspectionType: 'Joint Synchronized' | 'Department Single';
  departments: string[];
  scheduledDate: string;
  leadOfficer: string;
  contactNumber: string;
  status: 'scheduled' | 'completed' | 're_inspection_required';
  checklistItems: { item: string; compliant: boolean }[];
  remarks?: string;
  digitalReportId?: string;
}

export interface ApprovalItem {
  id: string;
  code: string;
  name: string;
  department: string;
  category: string;
  slaDays: number;
  daysElapsed: number;
  riskTier: RiskTier;
  fastTrack: boolean;
  status: ApprovalStatus;
  requiredDocs: string[];
  submittedDocs: string[];
  submittedDate?: string;
  appliedDate?: string;
  paymentStatus?: string;
  paymentMode?: string;
  transactionId?: string;
  applicationRefNumber?: string;
  approvalDate?: string;
  certificateNumber?: string;
  validityExpiry?: string;
  queries: QueryItem[];
  inspection?: InspectionDetails;
  feeAmount: number;
  stageName: string;
  statusHistory?: Array<{
    title: string;
    date: string;
    stage: string;
    status: 'completed' | 'current' | 'pending';
    description?: string;
  }>;
  verifiedDocDetails?: Array<{
    name: string;
    size: string;
    verifiedAt: string;
    docType: string;
  }>;
}

export interface IncentiveScheme {
  id: string;
  name: string;
  ministry: string;
  coverage: string;
  financialBenefit: string;
  eligibility: string;
  status: 'Eligible' | 'Applied' | 'Approved' | 'Disbursed';
  deadline: string;
  matchScore: number;
}

export interface DepartmentMetric {
  department: string;
  code: string;
  iconName: string;
  assignedCount: number;
  underScrutinyCount: number;
  approvedCount: number;
  queriesPendingCount: number;
  avgTurnaroundDays: number;
  slaTargetDays: number;
  slaAdherenceRate: number; // percentage
  criticalBottlenecks: string;
}
