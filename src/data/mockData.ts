import { BusinessProfile, ApprovalItem, DocumentItem, IncentiveScheme, DepartmentMetric } from '../types';

/**
 * DEFAULT BENCHMARK COMPANY (Used only as initial template fallback when no user is logged in)
 * Real user data from registration & login overrides this completely.
 */
export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  id: 'BIZ-MH-FGHIJ-001',
  name: 'Western Maharashtra Engineering Private Limited',
  businessType: 'Private Limited',
  cin: 'U28990MH2026PTC654321',
  pan: 'FGHIJ5678K',
  gstin: '27FGHIJ5678K1Z8',
  udyamRegistration: 'UDYAM-MH-26-0048192',
  authorizedPersonName: 'Arya Darshan Shah',
  authorizedPersonDesignation: 'Managing Director',
  mobile: '9825204240',
  email: 'arya2007in@gmail.com',
  sector: 'Engineering & Heavy Manufacturing',
  activityDescription: 'Precision CNC Machining, Heavy Tooling & Automotive Sub-Assemblies',
  rawMaterials: ['Forged Steel Billets', 'Alloy Castings', 'Coolant Concentrates', 'Hydraulic Oils'],
  finishedProducts: ['Precision Automotive Gearboxes', 'Shafts', 'Hydraulic Cylinders'],
  byProducts: ['Ferrous Metal Scrap', 'Spent Oil (Categorized Wastes)'],
  state: 'Maharashtra',
  district: 'Nashik',
  taluka: 'Ambad',
  village: 'Ambad MIDC Industrial Zone',
  plotNumber: 'Plot No. 18, MIDC Sector C',
  pincode: '422010',
  address: 'Plot No. 18, Ambad MIDC, Ambad Industrial Estate, Nashik, Maharashtra – 422010',
  scale: 'Medium',
  investmentCrores: 18.5,
  builtUpAreaSqFt: 42000,
  workforce: 75,
  contractWorkersCount: 30,
  connectedPowerKw: 350,
  isMIDC: true,
  handlesHazardous: false,
  hazardDetails: 'Machine lubrication oils, cutting oils, paint aerosols (Stored in dedicated bunded enclosure)',
  hazardControlMeasures: 'Closed loop CNC coolant extraction, secondary spill containment drums, Class-B Fire Extinguishers',
  hasBoiler: false,
  boilerCapacityTph: 0,
  dgSetKva: 250,
  waterExtractionRequirementKld: 15,
  landType: 'Industrial Park (Allotted)',
  stage: 'Pre-Establishment',
  isProfileComplete: true
};

export const INITIAL_BUSINESS_PROFILES: BusinessProfile[] = [
  DEFAULT_BUSINESS_PROFILE
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [];

export const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'APP-PCB-01',
    code: 'CTE-AIR-WATER',
    name: 'Consent to Establish (CTE) under Water & Air Acts',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    category: 'Environmental & Pollution',
    slaDays: 21,
    daysElapsed: 8,
    riskTier: 'LOW',
    fastTrack: true,
    status: 'under_scrutiny',
    stageName: 'Regional Officer Technical Scrutiny (Nashik)',
    feeAmount: 25000,
    requiredDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'Ambad MIDC Industrial Plot Allotment Letter & Lease Deed',
      'Comprehensive Factory Architectural & Site Layout Plan'
    ],
    submittedDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'Ambad MIDC Industrial Plot Allotment Letter & Lease Deed'
    ],
    submittedDate: '2026-03-20',
    queries: [
      {
        id: 'QRY-MPCB-401',
        approvalId: 'APP-PCB-01',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        officerName: 'Er. S. R. Deshmukh (Sub-Regional Officer)',
        dateRaised: '2026-03-22',
        deadlineDate: '2026-03-29',
        queryText: 'Please submit CNC coolant recycling layout and closed drainage circuit specifications.',
        status: 'pending',
        responseDraft: 'Coolant filtration recovery diagram and zero liquid discharge closed loop specs attached.'
      }
    ],
    inspection: {
      id: 'INSP-2026-MH-01',
      inspectionType: 'Joint Synchronized',
      departments: ['MPCB Pollution Board', 'Directorate of Industrial Safety (DISH)', 'MIDC Fire Services'],
      scheduledDate: '2026-03-30',
      leadOfficer: 'Joint Inspection Team (Coordinator: Er. S. Deshmukh)',
      contactNumber: '+91 253 235 1244',
      status: 'scheduled',
      checklistItems: [
        { item: 'Verification of green belt boundary tree plantation (33% area)', compliant: true },
        { item: 'Inspection of CNC oil & coolant containment trench', compliant: true },
        { item: 'Acoustic enclosure verification for air compressor room', compliant: false }
      ],
      remarks: 'Synchronized joint visit scheduled at Plot 18 Ambad MIDC to prevent multiple disruptions.'
    }
  },
  {
    id: 'APP-FIRE-01',
    code: 'NOC-PROV-FIRE',
    name: 'Provisional Fire Safety No Objection Certificate (NOC)',
    department: 'Maharashtra Fire Services & MIDC Fire Dept',
    category: 'Safety & Hazard',
    slaDays: 14,
    daysElapsed: 6,
    riskTier: 'LOW',
    fastTrack: true,
    status: 'query_raised',
    stageName: 'Awaiting Applicant Query Clarification',
    feeAmount: 15000,
    requiredDocs: [
      'Comprehensive Factory Architectural & Site Layout Plan',
      'Ambad MIDC Industrial Plot Allotment Letter & Lease Deed',
      'Certificate of Incorporation & Company PAN Card'
    ],
    submittedDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'Ambad MIDC Industrial Plot Allotment Letter & Lease Deed'
    ],
    submittedDate: '2026-03-20',
    queries: [
      {
        id: 'QRY-FIRE-202',
        approvalId: 'APP-FIRE-01',
        department: 'Maharashtra Fire Services & MIDC Fire Dept',
        officerName: 'Divisional Fire Officer A. P. Kulkarni',
        dateRaised: '2026-03-22',
        deadlineDate: '2026-03-29',
        queryText: 'Architectural blueprint shows 4.8m driveway along East boundary. Minimum 6.0m heavy fire tender turning access is required under National Building Code Part 4.',
        status: 'pending',
        responseDraft: 'Revised architectural drawing attached showing clear 6.2m driveway and 14m circular turning radius.'
      }
    ]
  },
  {
    id: 'APP-DISCOM-01',
    code: 'PWR-HT-350',
    name: 'Industrial High Tension (11kV) Power Load Sanction (350 kW)',
    department: 'Maharashtra State Electricity Distribution Co. (MSEDCL)',
    category: 'Utility & Infrastructure',
    slaDays: 10,
    daysElapsed: 5,
    riskTier: 'LOW',
    fastTrack: true,
    status: 'approved',
    stageName: 'Sanction Order Executed & Dispatched',
    feeAmount: 35000,
    requiredDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'Ambad MIDC Industrial Plot Allotment Letter & Lease Deed',
      'Single Line Electrical Diagram (SLD) & Transformer Layout'
    ],
    submittedDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'Ambad MIDC Industrial Plot Allotment Letter & Lease Deed',
      'Single Line Electrical Diagram (SLD) & Transformer Layout'
    ],
    submittedDate: '2026-03-19',
    approvalDate: '2026-03-23',
    certificateNumber: 'MSEDCL/NSK-AMBAD/HT/2026/4192',
    validityExpiry: '2029-03-31',
    queries: []
  },
  {
    id: 'APP-FACT-01',
    code: 'DISH-PLN-APP',
    name: 'Factory Building Plan Approval & Registration License',
    department: 'Directorate of Industrial Safety & Health (DISH Maharashtra)',
    category: 'Labor & Factory Safety',
    slaDays: 20,
    daysElapsed: 6,
    riskTier: 'MEDIUM',
    fastTrack: false,
    status: 'under_scrutiny',
    stageName: 'Machinery Layout & Occupational Safety Scrutiny',
    feeAmount: 18500,
    requiredDocs: [
      'Comprehensive Factory Architectural & Site Layout Plan',
      'Certificate of Incorporation & Company PAN Card',
      'Single Line Electrical Diagram (SLD) & Transformer Layout'
    ],
    submittedDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'Single Line Electrical Diagram (SLD) & Transformer Layout'
    ],
    submittedDate: '2026-03-20',
    queries: []
  },
  {
    id: 'APP-TOWN-01',
    code: 'MIDC-DEV-PERM',
    name: 'MIDC Industrial Building Plan Sanction & Commencement Certificate',
    department: 'MIDC Industrial Area Development Authority (Nashik)',
    category: 'Municipal & Land',
    slaDays: 15,
    daysElapsed: 5,
    riskTier: 'LOW',
    fastTrack: true,
    status: 'under_scrutiny',
    stageName: 'Green-Channel Deemed Scrutiny',
    feeAmount: 22000,
    requiredDocs: [
      'Ambad MIDC Industrial Plot Allotment Letter & Lease Deed',
      'Certificate of Incorporation & Company PAN Card'
    ],
    submittedDocs: [
      'Ambad MIDC Industrial Plot Allotment Letter & Lease Deed',
      'Certificate of Incorporation & Company PAN Card'
    ],
    submittedDate: '2026-03-20',
    queries: []
  }
];

export const INCENTIVE_SCHEMES: IncentiveScheme[] = [
  {
    id: 'SCH-MAHA-PSI',
    name: 'Maharashtra Package Scheme of Incentives (PSI 2024)',
    ministry: 'Industries Department, Government of Maharashtra',
    coverage: 'Up to 50% fixed capital investment subsidy for units in Zone C & D (Nashik/Ambad)',
    financialBenefit: 'Lump-sum capital grant up to ₹2.5 Crores + 5% Interest Subsidy',
    eligibility: 'New engineering manufacturing unit established in MIDC with investment in plant & machinery.',
    status: 'Eligible',
    deadline: '2026-12-31',
    matchScore: 98
  },
  {
    id: 'SCH-MSEDCL-PWR',
    name: 'Power Tariff Subsidy for MIDC Industrial Units',
    ministry: 'MSEDCL & Energy Department, Govt of Maharashtra',
    coverage: '₹1.50 per unit electricity tariff concession for 5 years',
    financialBenefit: 'Estimated ₹14.8 Lakhs/Year Operational Cost Savings',
    eligibility: 'Industrial units having connected load > 65 kW in designated MIDC industrial zones.',
    status: 'Eligible',
    deadline: 'Rolling Annual',
    matchScore: 94
  },
  {
    id: 'SCH-ZED-MSME',
    name: 'MSME Zero Defect Zero Effect (ZED) Certification & Subsidy',
    ministry: 'Ministry of Micro, Small and Medium Enterprises, GoI',
    coverage: '80% subsidy on cost of ZED audit and precision manufacturing tooling',
    financialBenefit: '₹5.0 Lakhs per plant + 1% Concessional Interest Rate',
    eligibility: 'Active Udyam registered MSME with precision quality standards.',
    status: 'Applied',
    deadline: '2026-12-31',
    matchScore: 91
  },
  {
    id: 'SCH-SOLAR-IND',
    name: 'Maharashtra Industrial Rooftop Solar Green Power Duty Waiver',
    ministry: 'MEDA (Maharashtra Energy Development Agency)',
    coverage: '100% exemption from Electricity Duty for 5 years on captive green power',
    financialBenefit: 'Estimated ₹8.5 Lakhs/Year Operational Savings',
    eligibility: 'Industrial consumers installing rooftop solar > 50 kW',
    status: 'Eligible',
    deadline: 'Rolling Annual',
    matchScore: 88
  }
];

export const DEPARTMENT_METRICS: DepartmentMetric[] = [
  {
    department: 'Maharashtra Pollution Control Board (MPCB)',
    code: 'PCB',
    iconName: 'ShieldAlert',
    assignedCount: 118,
    underScrutinyCount: 52,
    approvedCount: 58,
    queriesPendingCount: 8,
    avgTurnaroundDays: 16.4,
    slaTargetDays: 21,
    slaAdherenceRate: 86.4,
    criticalBottlenecks: 'Effluent drainage layout verification desk handling surge in Nashik zone.'
  },
  {
    department: 'Maharashtra Fire Services & MIDC Fire',
    code: 'FIRE',
    iconName: 'Flame',
    assignedCount: 84,
    underScrutinyCount: 26,
    approvedCount: 48,
    queriesPendingCount: 10,
    avgTurnaroundDays: 11.2,
    slaTargetDays: 14,
    slaAdherenceRate: 82.1,
    criticalBottlenecks: 'Site inspection scheduling delays due to limited inspector fleet in industrial belts.'
  },
  {
    department: 'Directorate of Industrial Safety (DISH)',
    code: 'DISH',
    iconName: 'HardHat',
    assignedCount: 72,
    underScrutinyCount: 22,
    approvedCount: 46,
    queriesPendingCount: 4,
    avgTurnaroundDays: 14.1,
    slaTargetDays: 20,
    slaAdherenceRate: 91.5,
    criticalBottlenecks: 'Machinery safety certification review for heavy CNC lines.'
  },
  {
    department: 'Electricity Distribution (MSEDCL)',
    code: 'DISCOM',
    iconName: 'Zap',
    assignedCount: 96,
    underScrutinyCount: 12,
    approvedCount: 80,
    queriesPendingCount: 4,
    avgTurnaroundDays: 6.2,
    slaTargetDays: 10,
    slaAdherenceRate: 95.8,
    criticalBottlenecks: 'Low bottleneck; feeder line GIS mapping automated.'
  },
  {
    department: 'MIDC Industrial Area Development Authority',
    code: 'TOWN',
    iconName: 'Building2',
    assignedCount: 64,
    underScrutinyCount: 18,
    approvedCount: 42,
    queriesPendingCount: 4,
    avgTurnaroundDays: 10.5,
    slaTargetDays: 15,
    slaAdherenceRate: 89.2,
    criticalBottlenecks: 'Plot boundary coordination with Ambad Estate Manager.'
  }
];
