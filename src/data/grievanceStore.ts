export interface GrievanceRecord {
  id: string; // e.g. MGV-2026-102458
  type: 'grievance' | 'query';
  
  // Step 1: Business & Application
  businessName: string;
  applicantName: string;
  mobile: string;
  email: string;
  applicationNumber?: string;
  serviceType: string;
  department: string;
  district: string;
  taluka: string;
  midcArea?: string;

  // Step 2: Details
  category: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  subject: string;
  description: string;

  // Step 3: Documents
  documents: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    uploadDate: string;
  }>;

  // Notification Preferences
  notifySms: boolean;
  notifyEmail: boolean;
  notifyPortal: boolean;

  // Lifecycle & Status
  submittedDate: string;
  lastUpdated: string;
  status: 'Submitted' | 'Under Initial Review' | 'Assigned to Department' | 'Department Action' | 'Resolution Provided' | 'Closed';
  assignedOfficer?: string;
  departmentResponse?: string;
  expectedSlaDays: number;
  rtsEscalationLevel?: string;
  resolutionDate?: string;
}

export const DEPARTMENTS_SERVICES_MAP: Record<string, string[]> = {
  'Labour Department, Maharashtra': [
    'Registration under Maharashtra Shops & Establishments Act, 2017',
    'Registration of Principal Employer under Contract Labour (R&A) Act',
    'Factory Building Plan Approval (DISH)',
    'Grant and Renewal of Factory License (DISH)'
  ],
  'Maharashtra Pollution Control Board (MPCB)': [
    'Consent to Establish (CTE) under Water & Air Acts',
    'Consent to Operate (CTO) under Water & Air Acts',
    'Hazardous Waste Authorization (HWM Rules 2016)',
    'Bio-Medical / E-Waste Management Authorization'
  ],
  'Energy Department (MSEDCL / Mahavitaran)': [
    'Sanction and Release of Industrial High Tension (HT) Power Load',
    'Sanction and Release of Industrial Low Tension (LT) Power Load',
    'Electrical Inspectorate Safety Approvals'
  ],
  'Directorate of Industrial Safety and Health (DISH)': [
    'Factory Architectural Building Plan Approval',
    'Grant of License under Factories Act, 1948',
    'Renewal of Factory License'
  ],
  'Maharashtra Fire Services': [
    'Provisional Fire Safety NOC for Factory Construction',
    'Final Fire Safety NOC and Compliance Certificate'
  ],
  'Maharashtra Industrial Development Corporation (MIDC)': [
    'Industrial Plot Allotment & Possession Order',
    'Building Plan Approval in MIDC Area',
    'Industrial Water Supply Connection'
  ],
  'Water Resource Department / MSGWRA': [
    'Ground Water Extraction NOC (Industrial)',
    'Surface River / Dam Water Drawing Permission'
  ],
  'Directorate of Industries (DOI)': [
    'Micro, Small & Medium Enterprise (MSME) Registration Support',
    'Industrial Promotion Subsidy (IPS) under PSI 2019'
  ]
};

export const INITIAL_GRIEVANCES_STORE: GrievanceRecord[] = [
  {
    id: 'MGV-2026-102458',
    type: 'grievance',
    businessName: 'Western Maharashtra Engineering Private Limited',
    applicantName: 'Arya Darshan Shah',
    mobile: '9825204240',
    email: 'arya2007in@gmail.com',
    applicationNumber: 'APP-PCB-01',
    serviceType: 'Consent to Establish (CTE) under Water & Air Acts',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    district: 'Nashik',
    taluka: 'Ambad',
    midcArea: 'Ambad MIDC Sector C',
    category: 'Application Delay',
    priority: 'Urgent',
    subject: 'Procedural Delay in Statutory CTE Application Scrutiny Beyond 21 Days RTS Limit',
    description: 'Our CTE application reference APP-PCB-01 was submitted 24 days ago with complete environmental impact reports and bank challan. The statutory RTS time limit is 21 days. Requesting immediate officer scrutiny and release of consent letter.',
    documents: [
      {
        id: 'doc-1',
        name: 'MPCB_Application_Acknowledgment_Receipt.pdf',
        size: '1.2 MB',
        type: 'application/pdf',
        uploadDate: '2026-09-26'
      }
    ],
    notifySms: true,
    notifyEmail: true,
    notifyPortal: true,
    submittedDate: '26/09/2026, 11:30 AM',
    lastUpdated: '28/09/2026, 04:15 PM',
    status: 'Department Action',
    assignedOfficer: 'Regional Officer (Pollution Scrutiny), MPCB Nashik',
    departmentResponse: 'Application scrutinized by Sub-Regional Officer. Field inspection report verified without remarks. Final consent docket forwarded to Regional Officer for digital signature release.',
    expectedSlaDays: 7,
    rtsEscalationLevel: 'Level 1 (Nodal Officer)'
  },
  {
    id: 'MQY-2026-309114',
    type: 'query',
    businessName: 'Western Maharashtra Engineering Private Limited',
    applicantName: 'Arya Darshan Shah',
    mobile: '9825204240',
    email: 'arya2007in@gmail.com',
    applicationNumber: 'APP-DISH-01',
    serviceType: 'Factory Building Plan Approval under Factories Act, 1948',
    department: 'Directorate of Industrial Safety and Health (DISH)',
    district: 'Nashik',
    taluka: 'Ambad',
    midcArea: 'Ambad MIDC Sector C',
    category: 'Document Issue',
    priority: 'Normal',
    subject: 'Clarification regarding DWG architectural CAD blueprint upload format',
    description: 'We wish to confirm if 2D structural drawings for machine foundations can be submitted as signed PDF or if raw AutoCAD DWG format is strictly required under the Single Window portal.',
    documents: [],
    notifySms: true,
    notifyEmail: true,
    notifyPortal: true,
    submittedDate: '25/09/2026, 02:45 PM',
    lastUpdated: '26/09/2026, 10:00 AM',
    status: 'Resolution Provided',
    assignedOfficer: 'Technical Assistant, DISH Headquarters',
    departmentResponse: 'Signed PDFs generated from CAD drawings along with registered architect/structural engineer digital signatures are fully accepted for online sanction.',
    expectedSlaDays: 3,
    resolutionDate: '26/09/2026, 10:00 AM'
  }
];
