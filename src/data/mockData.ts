import { BusinessProfile, ApprovalItem, DocumentItem, IncentiveScheme, DepartmentMetric } from '../types';

export const INITIAL_BUSINESS_PROFILES: BusinessProfile[] = [
  {
    id: 'BIZ-2026-IND-01',
    name: 'Bharat Precision BioTech Pvt Ltd',
    pan: 'AABCB1294F',
    gstin: '24AABCB1294F1Z3',
    sector: 'Pharmaceuticals & APIs',
    state: 'Gujarat',
    district: 'Ahmedabad (Sanand GIDC)',
    scale: 'Medium',
    investmentCrores: 48.5,
    workforce: 185,
    connectedPowerKw: 850,
    handlesHazardous: true,
    landType: 'Industrial Park (Allotted)',
    stage: 'Pre-Establishment',
  },
  {
    id: 'BIZ-2026-IND-02',
    name: 'Garuda Clean Energy & EV Systems',
    pan: 'AABCG5582K',
    gstin: '29AABCG5582K1ZD',
    sector: 'Automotive & EV Components',
    state: 'Karnataka',
    district: 'Bengaluru Rural (Doddaballapur)',
    scale: 'Small',
    investmentCrores: 14.2,
    workforce: 65,
    connectedPowerKw: 220,
    handlesHazardous: false,
    landType: 'Industrial Park (Allotted)',
    stage: 'Pre-Establishment',
  },
  {
    id: 'BIZ-2026-IND-03',
    name: 'Kisan Shakti Organic Agro Mills',
    pan: 'AACCK9914P',
    gstin: '27AACCK9914P1ZE',
    sector: 'Food Processing & Agri Logistics',
    state: 'Maharashtra',
    district: 'Nashik Industrial Zone',
    scale: 'Small',
    investmentCrores: 8.5,
    workforce: 42,
    connectedPowerKw: 110,
    handlesHazardous: false,
    landType: 'Agricultural (Requires CLU)',
    stage: 'Pre-Operation',
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'DOC-PAN-01',
    name: 'Certificate of Incorporation & Company PAN Card',
    type: 'PDF',
    category: 'Statutory',
    fileSize: '1.4 MB',
    uploadDate: '2026-03-10',
    expiryDate: 'Permanent',
    status: 'verified',
    validationScore: 99,
    checklistResults: [
      { check: 'Corporate Identification Number (CIN) Check', passed: true, detail: 'MCA registry verified: U24230GJ2024PTC148821' },
      { check: 'PAN Name and GSTIN match', passed: true, detail: '100% string alignment with registered applicant' },
      { check: 'Authorized Director DSC', passed: true, detail: 'Valid Class-3 Digital Signature detected' },
    ],
    missingOrInvalidItems: [],
    correctionGuidance: 'Document is digitally verified and permanently active in the Single Document Vault.',
    linkedApprovals: ['APP-PCB-01', 'APP-FIRE-01', 'APP-FACT-01', 'APP-DISCOM-01']
  },
  {
    id: 'DOC-LAND-02',
    name: 'GIDC Industrial Plot Allotment Letter & Lease Deed',
    type: 'PDF',
    category: 'Land & Building',
    fileSize: '3.8 MB',
    uploadDate: '2026-03-12',
    expiryDate: '2099-12-31',
    status: 'verified',
    validationScore: 95,
    checklistResults: [
      { check: 'Cadastral Survey & Plot Coordinates', passed: true, detail: 'Sanand Industrial Phase II, Plot No. 448/B mapped' },
      { check: 'Sub-Registrar Stamp Duty Endorsement', passed: true, detail: 'Registered with e-Stamping receipt verified' },
      { check: 'Zoning & Master Plan Clearance', passed: true, detail: 'Industrial General (Zone I-G) approved' }
    ],
    missingOrInvalidItems: [],
    linkedApprovals: ['APP-PCB-01', 'APP-TOWN-01', 'APP-DISCOM-01']
  },
  {
    id: 'DOC-ARCH-03',
    name: 'Comprehensive Factory Architectural & Site Layout Plan',
    type: 'PDF',
    category: 'Technical',
    fileSize: '8.2 MB',
    uploadDate: '2026-03-14',
    expiryDate: 'N/A',
    status: 'needs_correction',
    validationScore: 68,
    checklistResults: [
      { check: 'Architect CoA License Validity', passed: true, detail: 'Architect license valid till 2028' },
      { check: 'Emergency Evacuation & Fire Hydrant Pathways', passed: false, detail: '6-meter peripheral setback drive-way obstructed on East boundary' },
      { check: 'Effluent Treatment Plant (ETP) Demarcation', passed: true, detail: 'Zero Liquid Discharge (ZLD) unit marked clearly' }
    ],
    missingOrInvalidItems: [
      'Fire tender turning radius (12.5m) missing on north-east corner blueprint.',
      'Annexure IV: Structural Engineer Wind & Seismic certificate stamp missing.'
    ],
    correctionGuidance: 'Revise drawing to maintain uninterrupted 6m driveway clearance and get structural engineer seal on page 4.',
    linkedApprovals: ['APP-FIRE-01', 'APP-FACT-01']
  },
  {
    id: 'DOC-ENV-04',
    name: 'Comprehensive Environmental Management Plan (EMP) & ZLD Specs',
    type: 'PDF',
    category: 'Technical',
    fileSize: '5.6 MB',
    uploadDate: '2026-03-15',
    expiryDate: '2031-03-15',
    status: 'verified',
    validationScore: 92,
    checklistResults: [
      { check: 'Pollution Control Board Category Mapping', passed: true, detail: 'Red Category chemical synthesis compliant' },
      { check: 'Air Emission Chimney Stack Calculations', passed: true, detail: 'Bag filter and wet scrubber height standards satisfied' },
      { check: 'Hazardous Waste Storage Area (TSDF tie-up)', passed: true, detail: 'MoU with Gujarat Enviro TSDF attached' }
    ],
    missingOrInvalidItems: [],
    linkedApprovals: ['APP-PCB-01']
  },
  {
    id: 'DOC-ELEC-05',
    name: 'Single Line Electrical Diagram (SLD) & Transformer Layout',
    type: 'PDF',
    category: 'Technical',
    fileSize: '2.1 MB',
    uploadDate: '2026-03-16',
    expiryDate: 'N/A',
    status: 'verified',
    validationScore: 96,
    checklistResults: [
      { check: 'BEE Grade Certified Electrical Consultant Seal', passed: true, detail: 'Chartered Electrical Engineer seal verified' },
      { check: 'Connected Load (850 kW) vs Substation Capacity', passed: true, detail: '1000 kVA step-down 11kV/415V configured with dual bus coupler' }
    ],
    missingOrInvalidItems: [],
    linkedApprovals: ['APP-DISCOM-01', 'APP-FACT-01']
  }
];

export const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'APP-PCB-01',
    code: 'CTE-AIR-WATER',
    name: 'Consent to Establish (CTE) under Water & Air Acts',
    department: 'State Pollution Control Board (GPCB)',
    category: 'Environmental & Pollution',
    slaDays: 30,
    daysElapsed: 12,
    riskTier: 'HIGH',
    fastTrack: false,
    status: 'under_scrutiny',
    stageName: 'Department Technical Committee Review',
    feeAmount: 65000,
    requiredDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'GIDC Industrial Plot Allotment Letter & Lease Deed',
      'Comprehensive Environmental Management Plan (EMP) & ZLD Specs'
    ],
    submittedDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'GIDC Industrial Plot Allotment Letter & Lease Deed',
      'Comprehensive Environmental Management Plan (EMP) & ZLD Specs'
    ],
    submittedDate: '2026-03-18',
    queries: [
      {
        id: 'QRY-PCB-992',
        approvalId: 'APP-PCB-01',
        department: 'State Pollution Control Board (GPCB)',
        officerName: 'Er. Rajesh V. Mehta (Sr. Env. Engineer)',
        dateRaised: '2026-03-20',
        deadlineDate: '2026-03-27',
        queryText: 'Please submit solvent recovery balance sheet and mass balance calculation for batch synthesis unit 2.',
        status: 'pending',
        responseDraft: 'Mass balance data sheets and 98.2% condenser solvent recovery audit attached from certified chemical engineer.'
      }
    ],
    inspection: {
      id: 'INSP-2026-08',
      inspectionType: 'Joint Synchronized',
      departments: ['GPCB Pollution Board', 'Directorate of Industrial Safety (DISH)', 'Fire Emergency'],
      scheduledDate: '2026-03-29',
      leadOfficer: 'Joint Inspection Team (Coordinator: Er. R. Mehta)',
      contactNumber: '+91 79 2322 1084',
      status: 'scheduled',
      checklistItems: [
        { item: 'Verification of green belt boundary tree plantation (33% area)', compliant: true },
        { item: 'Inspection of hazardous waste covered staging shed', compliant: true },
        { item: 'ETP effluent monitoring online TOC/COD sensor installation', compliant: false }
      ],
      remarks: 'Scheduled jointly with Fire department to minimize business disruption.'
    }
  },
  {
    id: 'APP-FIRE-01',
    code: 'NOC-PROV-FIRE',
    name: 'Provisional Fire Safety No Objection Certificate (NOC)',
    department: 'Fire & Emergency Services',
    category: 'Safety & Hazard',
    slaDays: 15,
    daysElapsed: 8,
    riskTier: 'HIGH',
    fastTrack: false,
    status: 'query_raised',
    stageName: 'Awaiting Applicant Query Response',
    feeAmount: 25000,
    requiredDocs: [
      'Comprehensive Factory Architectural & Site Layout Plan',
      'GIDC Industrial Plot Allotment Letter & Lease Deed',
      'Certificate of Incorporation & Company PAN Card'
    ],
    submittedDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'GIDC Industrial Plot Allotment Letter & Lease Deed'
    ],
    submittedDate: '2026-03-18',
    queries: [
      {
        id: 'QRY-FIRE-104',
        approvalId: 'APP-FIRE-01',
        department: 'Fire & Emergency Services',
        officerName: 'Divisional Fire Officer K. S. Solanki',
        dateRaised: '2026-03-21',
        deadlineDate: '2026-03-28',
        queryText: 'Architectural blueprint shows 4.5m driveway along East wing. Minimum 6.0m heavy fire tender turning radius is mandatory under National Building Code Part 4.',
        status: 'pending',
        responseDraft: 'Revised architectural drawing attached showing clear 6.2m driveway and 14m circular turning radius.'
      }
    ]
  },
  {
    id: 'APP-DISCOM-01',
    code: 'PWR-HT-850',
    name: 'Industrial High Tension (11kV) Power Load Sanction',
    department: 'State Electricity Distribution Co. (UGVCL)',
    category: 'Utility & Infrastructure',
    slaDays: 10,
    daysElapsed: 5,
    riskTier: 'LOW',
    fastTrack: true,
    status: 'approved',
    stageName: 'Approval Order Dispatched',
    feeAmount: 42000,
    requiredDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'GIDC Industrial Plot Allotment Letter & Lease Deed',
      'Single Line Electrical Diagram (SLD) & Transformer Layout'
    ],
    submittedDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'GIDC Industrial Plot Allotment Letter & Lease Deed',
      'Single Line Electrical Diagram (SLD) & Transformer Layout'
    ],
    submittedDate: '2026-03-17',
    approvalDate: '2026-03-21',
    certificateNumber: 'UGVCL/SANAND-II/HT/2026/8892',
    validityExpiry: '2029-03-20',
    queries: []
  },
  {
    id: 'APP-FACT-01',
    code: 'DISH-PLN-APP',
    name: 'Factory Building Plan Approval & Registration',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    category: 'Labor & Factory Safety',
    slaDays: 20,
    daysElapsed: 7,
    riskTier: 'MEDIUM',
    fastTrack: false,
    status: 'under_scrutiny',
    stageName: 'Scrutiny of Machine Layout & Ventilation',
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
    submittedDate: '2026-03-19',
    queries: []
  },
  {
    id: 'APP-TOWN-01',
    code: 'ULB-DEV-PERM',
    name: 'Industrial Layout Development & Construction Permission',
    department: 'Urban Development Authority / GIDC Estate Manager',
    category: 'Municipal & Land',
    slaDays: 21,
    daysElapsed: 6,
    riskTier: 'LOW',
    fastTrack: true,
    status: 'under_scrutiny',
    stageName: 'Green-Channel Deemed Scrutiny',
    feeAmount: 32000,
    requiredDocs: [
      'GIDC Industrial Plot Allotment Letter & Lease Deed',
      'Certificate of Incorporation & Company PAN Card'
    ],
    submittedDocs: [
      'GIDC Industrial Plot Allotment Letter & Lease Deed',
      'Certificate of Incorporation & Company PAN Card'
    ],
    submittedDate: '2026-03-19',
    queries: []
  }
];

export const INCENTIVE_SCHEMES: IncentiveScheme[] = [
  {
    id: 'SCH-PLI-PHARMA',
    name: 'Production Linked Incentive (PLI) for Bulk Drugs & APIs',
    ministry: 'Ministry of Chemicals & Fertilizers, GoI',
    coverage: 'Financial incentive of 5% to 20% on incremental sales over base year',
    financialBenefit: 'Up to ₹25.0 Crores over 5 Years',
    eligibility: 'Manufacturing APIs, Key Starting Materials (KSM), investment > ₹20 Cr',
    status: 'Eligible',
    deadline: '2026-06-30',
    matchScore: 98
  },
  {
    id: 'SCH-GUJ-CAPSUB',
    name: 'Gujarat Industrial Policy Capital Investment Subsidy',
    ministry: 'Industries & Mines Department, Govt. of Gujarat',
    coverage: '12% Capital Investment Subsidy on eligible fixed capital investment',
    financialBenefit: 'Up to ₹5.8 Crores Lump-Sum Grant',
    eligibility: 'New manufacturing enterprise in notified Taluka Category 1/2',
    status: 'Eligible',
    deadline: '2026-09-15',
    matchScore: 94
  },
  {
    id: 'SCH-ZED-MSME',
    name: 'MSME Zero Defect Zero Effect (ZED) Certification & Subsidy',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    coverage: '80% subsidy on cost of ZED audit and clean technology installation',
    financialBenefit: '₹5.0 Lakhs per plant + 1% Concessional Interest Rate',
    eligibility: 'Active Udyam registered MSME with clean discharge commitments',
    status: 'Applied',
    deadline: '2026-12-31',
    matchScore: 88
  },
  {
    id: 'SCH-SOLAR-IND',
    name: 'State Rooftop Solar & Green Power Duty Exemption',
    ministry: 'Energy & Petrochemicals Department',
    coverage: '100% exemption from Electricity Duty for 5 years on captive green power',
    financialBenefit: 'Estimated ₹18.4 Lakhs/Year Operational Savings',
    eligibility: 'Industrial consumers installing rooftop solar > 100 kW',
    status: 'Eligible',
    deadline: 'Rolling Annual',
    matchScore: 91
  }
];

export const DEPARTMENT_METRICS: DepartmentMetric[] = [
  {
    department: 'State Pollution Control Board (GPCB)',
    code: 'PCB',
    iconName: 'ShieldAlert',
    assignedCount: 142,
    underScrutinyCount: 68,
    approvedCount: 54,
    queriesPendingCount: 20,
    avgTurnaroundDays: 24.6,
    slaTargetDays: 30,
    slaAdherenceRate: 78.2,
    criticalBottlenecks: 'Effluent mass balance verification desk experiencing 6.2 day queue delay.'
  },
  {
    department: 'Fire & Emergency Services',
    code: 'FIRE',
    iconName: 'Flame',
    assignedCount: 98,
    underScrutinyCount: 34,
    approvedCount: 46,
    queriesPendingCount: 18,
    avgTurnaroundDays: 16.8,
    slaTargetDays: 15,
    slaAdherenceRate: 64.5,
    criticalBottlenecks: 'Site inspection scheduling delays due to limited inspector fleet.'
  },
  {
    department: 'Directorate of Industrial Safety (DISH)',
    code: 'DISH',
    iconName: 'HardHat',
    assignedCount: 84,
    underScrutinyCount: 28,
    approvedCount: 50,
    queriesPendingCount: 6,
    avgTurnaroundDays: 15.2,
    slaTargetDays: 20,
    slaAdherenceRate: 88.1,
    criticalBottlenecks: 'Boiler safety certified inspector shortage in chemical industrial belts.'
  },
  {
    department: 'Electricity Distribution (DISCOM)',
    code: 'DISCOM',
    iconName: 'Zap',
    assignedCount: 112,
    underScrutinyCount: 14,
    approvedCount: 94,
    queriesPendingCount: 4,
    avgTurnaroundDays: 6.8,
    slaTargetDays: 10,
    slaAdherenceRate: 94.6,
    criticalBottlenecks: 'Low bottleneck; feeder availability mapping automated via GIS.'
  },
  {
    department: 'Town Planning & Urban Local Body',
    code: 'TOWN',
    iconName: 'Building2',
    assignedCount: 76,
    underScrutinyCount: 22,
    approvedCount: 48,
    queriesPendingCount: 6,
    avgTurnaroundDays: 14.1,
    slaTargetDays: 21,
    slaAdherenceRate: 84.2,
    criticalBottlenecks: 'Revenue boundary physical verification with village survey records.'
  }
];
