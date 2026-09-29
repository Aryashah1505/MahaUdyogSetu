export interface PlanItem {
  id: string;
  category: 'approval' | 'incentive' | 'testing' | 'document' | 'action';
  title: string;
  subtitle: string;
  departmentOrAgency?: string;
  completed: boolean;
}

export interface InvestmentPlanState {
  projectName: string;
  industrySector: string;
  location: string;
  investmentCr: number;
  items: PlanItem[];
  lastUpdated: string;
}

export interface TestingLabItem {
  id: string;
  name: string;
  city: string;
  district: string;
  categories: string[];
  accreditation: string[];
  services: string[];
  contact: string;
  phone: string;
  address: string;
  coordinates: { lat: number; lng: number };
}

export const INITIAL_TESTING_LABS: TestingLabItem[] = [
  {
    id: 'lab-1',
    name: 'National Test House (NTH - Western Region)',
    city: 'Mumbai',
    district: 'Mumbai Suburban',
    categories: ['Material Testing', 'Chemical Testing', 'Mechanical Testing', 'Electrical Testing'],
    accreditation: ['NABL Accredited (ISO/IEC 17025)', 'BIS Recognized', 'Govt of India'],
    services: [
      'Tensile & Impact Testing of Metallic Billets',
      'Spectroscopic Chemical Composition Analysis',
      'Transformer Oil Dielectric Breakdown Testing',
      'Cement & Concrete Compressive Testing'
    ],
    contact: 'nthwr-mum@nic.in',
    phone: '+91 22 2822 7140',
    address: 'Plot No. F-10, MIDC Marol, Andheri East, Mumbai, Maharashtra 400093',
    coordinates: { lat: 19.1176, lng: 72.8783 }
  },
  {
    id: 'lab-2',
    name: 'Automotive Research Association of India (ARAI)',
    city: 'Pune',
    district: 'Pune',
    categories: ['Mechanical Testing', 'Product Certification', 'Environmental Testing', 'Calibration'],
    accreditation: ['NABL Accredited', 'MoRTH Designated Testing Agency', 'ISO 9001:2015'],
    services: [
      'Automotive Components Homologation & Type Approval',
      'Engine Emissions Testing (BS-VI & EV Battery Safety)',
      'Crash Safety & Structural Fatigue Testing',
      'Acoustic & Vibration NVH Profiling'
    ],
    contact: 'director@araiindia.com',
    phone: '+91 20 6762 1000',
    address: 'Survey No. 102, Vetal Hill, Off Paud Road, Kothrud, Pune, Maharashtra 411038',
    coordinates: { lat: 18.5173, lng: 73.8152 }
  },
  {
    id: 'lab-3',
    name: 'CSIR - National Chemical Laboratory (NCL Innovations & Analytical Centre)',
    city: 'Pune',
    district: 'Pune',
    categories: ['Chemical Testing', 'Pharmaceutical Testing', 'Material Testing'],
    accreditation: ['CSIR Premier Research Lab', 'NABL Accredited', 'DSIR Recognized'],
    services: [
      'Polymer & Composite Characterization (NMR, XRD, SEM)',
      'Specialty Chemical Purity & Chromatographic Assay',
      'Effluent & Hazardous Sludge Elemental Analysis',
      'Catalyst & Advanced Material Testing'
    ],
    contact: 'analytical@ncl.res.in',
    phone: '+91 20 2590 2000',
    address: 'Dr. Homi Bhabha Road, Pashan, Pune, Maharashtra 411008',
    coordinates: { lat: 18.5362, lng: 73.8055 }
  },
  {
    id: 'lab-4',
    name: 'Maharashtra Pollution Control Board (Central Environmental Laboratory)',
    city: 'Navi Mumbai',
    district: 'Thane',
    categories: ['Environmental Testing', 'Chemical Testing'],
    accreditation: ['EPA Recognized', 'NABL Accredited', 'State Statutory Lab'],
    services: [
      'Industrial Effluent COD / BOD / Heavy Metal Analysis',
      'Ambient Air Quality & Stack Emission Monitoring',
      'Hazardous Waste TCLP Toxicity Testing',
      'Soil & Ground Water Contamination Scrutiny'
    ],
    contact: 'so-lab@mpcb.gov.in',
    phone: '+91 22 2757 2739',
    address: 'Plot No. A-2, MIDC Mahape, TTC Industrial Area, Navi Mumbai, Maharashtra 400710',
    coordinates: { lat: 19.1075, lng: 73.0135 }
  },
  {
    id: 'lab-5',
    name: 'Nashik Engineering Cluster (NEC Testing & Calibration Laboratory)',
    city: 'Nashik',
    district: 'Nashik',
    categories: ['Mechanical Testing', 'Calibration', 'Material Testing', 'Product Certification'],
    accreditation: ['NABL Accredited', 'Ministry of MSME Special Purpose Vehicle'],
    services: [
      'Precision Coordinate Measuring Machine (CMM) Inspection',
      'Metallurgical Microstructure & Hardness Testing (Rockwell/Brinell)',
      'Pressure Gauge & Temperature Sensor Calibration',
      'Dynamic Balancing & Non-Destructive Testing (NDT/UT/MPI)'
    ],
    contact: 'info@necnashik.com',
    phone: '+91 253 661 5000',
    address: 'Plot No. C-10, MIDC Ambad, Industrial Estate, Nashik, Maharashtra 422010',
    coordinates: { lat: 19.9547, lng: 73.7423 }
  },
  {
    id: 'lab-6',
    name: 'Central Food Technological Research Institute (CFTRI Resource Centre)',
    city: 'Mumbai',
    district: 'Mumbai City',
    categories: ['Food Testing', 'Chemical Testing', 'Product Certification'],
    accreditation: ['FSSAI Notified National Referral Lab', 'NABL Accredited', 'CSIR'],
    services: [
      'Nutritional Profiling & Heavy Metal Screening in Packaged Foods',
      'Microbiological Safety & Pathogen Detection (E. Coli, Salmonella)',
      'Pesticide Residue & Aflatoxin Quantification',
      'Shelf Life Evaluation & Packaging Integrity Testing'
    ],
    contact: 'cftrimumbai@cftri.res.in',
    phone: '+91 22 2414 4293',
    address: 'Bhavan\'s College Campus, Munshi Nagar, Andheri West, Mumbai, Maharashtra 400058',
    coordinates: { lat: 19.1254, lng: 72.8398 }
  }
];

export const DEFAULT_INVESTMENT_PLAN: InvestmentPlanState = {
  projectName: 'Western Precision Engineering Expansion Unit',
  industrySector: 'Engineering & Heavy Manufacturing',
  location: 'Plot No. 18, Ambad MIDC, Nashik',
  investmentCr: 18.5,
  lastUpdated: '29/09/2026',
  items: [
    {
      id: 'app-plan-1',
      category: 'approval',
      title: 'Consent to Establish (CTE) under Water & Air Acts',
      subtitle: 'Mandatory environmental clearance prior to civil construction',
      departmentOrAgency: 'Maharashtra Pollution Control Board (MPCB)',
      completed: true
    },
    {
      id: 'app-plan-2',
      category: 'approval',
      title: 'Factory Architectural Building Plan Approval',
      subtitle: 'Statutory approval for machine layouts and worker safety pathways',
      departmentOrAgency: 'Directorate of Industrial Safety & Health (DISH)',
      completed: true
    },
    {
      id: 'app-plan-3',
      category: 'approval',
      title: 'Sanction and Release of Industrial Power Load (350 kVA HT)',
      subtitle: 'Dedicated high-tension substation and feeder line energization',
      departmentOrAgency: 'Energy Department (MSEDCL)',
      completed: false
    },
    {
      id: 'inc-plan-1',
      category: 'incentive',
      title: 'Industrial Promotion Subsidy (IPS) under PSI 2019',
      subtitle: 'Eligible for 60% of Gross SGST refund on manufactured output for 7 years',
      departmentOrAgency: 'Directorate of Industries (Govt of Maharashtra)',
      completed: false
    },
    {
      id: 'inc-plan-2',
      category: 'incentive',
      title: 'Electricity Duty Exemption (100% for 7 Years)',
      subtitle: 'Zero electricity duty on monthly industrial MSEDCL billings in Group D/D+ Zone',
      departmentOrAgency: 'Energy Department & Industries Directorate',
      completed: false
    },
    {
      id: 'test-plan-1',
      category: 'testing',
      title: 'Precision CMM Inspection & Metallurgical Hardness Audit',
      subtitle: 'Mandatory tier-1 OEM quality conformance certification',
      departmentOrAgency: 'Nashik Engineering Cluster (NABL Lab)',
      completed: false
    },
    {
      id: 'doc-plan-1',
      category: 'document',
      title: 'Chartered Engineer Certified Plant & Machinery Valuation',
      subtitle: 'Required for fixed capital investment incentive sanction dossier',
      departmentOrAgency: 'Statutory Compliance Audit',
      completed: true
    },
    {
      id: 'act-plan-1',
      category: 'action',
      title: 'Submit Joint Environmental Scrutiny Dossier on MahaUdyogSetu Single Window',
      subtitle: 'Next recommended milestone for statutory establishment clearance',
      departmentOrAgency: 'Single Window Executive Workbench',
      completed: false
    }
  ]
};
