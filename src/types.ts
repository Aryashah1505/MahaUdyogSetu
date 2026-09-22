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
  pan: string;
  gstin: string;
  sector: string;
  state: string;
  district: string;
  scale: 'Micro' | 'Small' | 'Medium' | 'Large';
  investmentCrores: number;
  workforce: number;
  connectedPowerKw: number;
  handlesHazardous: boolean;
  landType: 'Industrial Park (Allotted)' | 'Agricultural (Requires CLU)' | 'Private Commercial' | 'SEZ Free Trade Zone';
  stage: 'Pre-Establishment' | 'Pre-Operation' | 'Expansion';
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  category: 'Statutory' | 'Technical' | 'Financial' | 'Land & Building';
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
  approvalDate?: string;
  certificateNumber?: string;
  validityExpiry?: string;
  queries: QueryItem[];
  inspection?: InspectionDetails;
  feeAmount: number;
  stageName: string;
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
