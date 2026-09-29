export interface MonthlyTrendData {
  month: string;
  applications: number;
  approvals: number;
  rejections: number;
  pending: number;
}

export interface DepartmentPublicMetric {
  id: string;
  name: string;
  code: string;
  servicesCount: number;
  applicationsCount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  avgProcessingDays: number;
  slaComplianceRate: number;
  topServices: Array<{
    name: string;
    applications: number;
    approved: number;
    avgDays: number;
  }>;
}

export interface DistrictIndustrialMetric {
  district: string;
  region: 'Konkan' | 'Pune' | 'Nashik' | 'Marathwada' | 'Vidarbha' | 'North Maharashtra';
  applicationsCount: number;
  approvedCount: number;
  pendingCount: number;
  activeProjects: number;
  registeredUnits: number;
  proposedInvestmentCr: number;
  employmentPotential: number;
  topSectors: string[];
}

export interface SectorMetric {
  sector: string;
  applications: number;
  approvals: number;
  activeProjects: number;
  sharePercent: number;
  proposedInvestmentCr: number;
}

export interface ServicePerformanceMetric {
  id: string;
  serviceName: string;
  department: string;
  applications: number;
  completed: number;
  pending: number;
  avgDays: number;
  status: 'High Performance' | 'Normal' | 'Action Needed';
}

export const MONTHLY_APPLICATION_TRENDS: MonthlyTrendData[] = [
  { month: 'January', applications: 62450, approvals: 45100, rejections: 1820, pending: 15530 },
  { month: 'February', applications: 68900, approvals: 51200, rejections: 2010, pending: 15690 },
  { month: 'March', applications: 78500, approvals: 58900, rejections: 2450, pending: 17150 },
  { month: 'April', applications: 71200, approvals: 53800, rejections: 2190, pending: 15210 },
  { month: 'May', applications: 74800, approvals: 56200, rejections: 2310, pending: 16290 },
  { month: 'June', applications: 80400, approvals: 61100, rejections: 2580, pending: 16720 },
  { month: 'July', applications: 85200, approvals: 64900, rejections: 2710, pending: 17590 },
  { month: 'August', applications: 89100, approvals: 68400, rejections: 2890, pending: 17810 },
  { month: 'September', applications: 92442, approvals: 72760, rejections: 3120, pending: 16562 }
];

export const DEPARTMENT_PUBLIC_METRICS: DepartmentPublicMetric[] = [
  {
    id: 'mpcb',
    name: 'Maharashtra Pollution Control Board (MPCB)',
    code: 'MPCB',
    servicesCount: 18,
    applicationsCount: 142850,
    approvedCount: 108420,
    pendingCount: 28910,
    rejectedCount: 5520,
    avgProcessingDays: 19.4,
    slaComplianceRate: 94.2,
    topServices: [
      { name: 'Consent to Establish (CTE) under Water & Air Acts', applications: 64200, approved: 49800, avgDays: 18.2 },
      { name: 'Consent to Operate (CTO) under Water & Air Acts', applications: 58100, approved: 44200, avgDays: 20.8 },
      { name: 'Hazardous Waste Management Authorization (HWM)', applications: 20550, approved: 14420, avgDays: 19.1 }
    ]
  },
  {
    id: 'dish',
    name: 'Directorate of Industrial Safety & Health (DISH)',
    code: 'DISH',
    servicesCount: 14,
    applicationsCount: 118400,
    approvedCount: 91500,
    pendingCount: 22100,
    rejectedCount: 4800,
    avgProcessingDays: 14.8,
    slaComplianceRate: 96.1,
    topServices: [
      { name: 'Factory Architectural Building Plan Approval', applications: 48900, approved: 38200, avgDays: 14.2 },
      { name: 'Grant and Renewal of Factory License (Form 4)', applications: 52100, approved: 41800, avgDays: 13.9 },
      { name: 'Safety Officer & Boiler Certificate Approval', applications: 17400, approved: 11500, avgDays: 16.5 }
    ]
  },
  {
    id: 'labour',
    name: 'Labour Department, Maharashtra',
    code: 'LABOUR',
    servicesCount: 22,
    applicationsCount: 135200,
    approvedCount: 112400,
    pendingCount: 19400,
    rejectedCount: 3400,
    avgProcessingDays: 3.2,
    slaComplianceRate: 98.7,
    topServices: [
      { name: 'Registration under Shops & Establishments Act, 2017', applications: 84500, approved: 78900, avgDays: 1.0 },
      { name: 'Registration of Principal Employer (Contract Labour Act)', applications: 32100, approved: 22400, avgDays: 5.4 },
      { name: 'Inter-State Migrant Workmen Establishment License', applications: 18600, approved: 11100, avgDays: 4.8 }
    ]
  },
  {
    id: 'energy',
    name: 'Energy Department (MSEDCL / Mahavitaran)',
    code: 'MSEDCL',
    servicesCount: 12,
    applicationsCount: 94500,
    approvedCount: 68200,
    pendingCount: 21800,
    rejectedCount: 4500,
    avgProcessingDays: 13.6,
    slaComplianceRate: 92.4,
    topServices: [
      { name: 'Sanction and Release of Industrial HT Power Load', applications: 41200, approved: 29800, avgDays: 14.2 },
      { name: 'Sanction and Release of Industrial LT Power Load', applications: 38900, approved: 29100, avgDays: 11.5 },
      { name: 'Electrical Inspectorate Safety Approvals', applications: 14400, approved: 9300, avgDays: 15.1 }
    ]
  },
  {
    id: 'fire',
    name: 'Maharashtra Fire Services',
    code: 'MFS',
    servicesCount: 8,
    applicationsCount: 62400,
    approvedCount: 44800,
    pendingCount: 14200,
    rejectedCount: 3400,
    avgProcessingDays: 12.1,
    slaComplianceRate: 95.3,
    topServices: [
      { name: 'Provisional Fire Safety Building NOC', applications: 34200, approved: 24500, avgDays: 13.4 },
      { name: 'Final Fire Safety Occupancy Certificate', applications: 28200, approved: 20300, avgDays: 10.8 }
    ]
  },
  {
    id: 'midc',
    name: 'Maharashtra Industrial Development Corporation (MIDC)',
    code: 'MIDC',
    servicesCount: 26,
    applicationsCount: 78600,
    approvedCount: 56900,
    pendingCount: 17800,
    rejectedCount: 3900,
    avgProcessingDays: 16.5,
    slaComplianceRate: 93.8,
    topServices: [
      { name: 'Building Plan Approval in MIDC Industrial Parks', applications: 36200, approved: 26400, avgDays: 15.2 },
      { name: 'Industrial Water Connection Sanction', applications: 24100, approved: 18200, avgDays: 9.4 },
      { name: 'Plot Transfer & Subletting Permission', applications: 18300, approved: 12300, avgDays: 24.1 }
    ]
  },
  {
    id: 'industries',
    name: 'Directorate of Industries (DOI)',
    code: 'DOI',
    servicesCount: 19,
    applicationsCount: 68900,
    approvedCount: 52100,
    pendingCount: 14200,
    rejectedCount: 2600,
    avgProcessingDays: 21.3,
    slaComplianceRate: 91.5,
    topServices: [
      { name: 'Eligibility Certificate under Package Scheme of Incentives (PSI 2019)', applications: 28400, approved: 21100, avgDays: 24.8 },
      { name: 'Industrial Promotion Subsidy (IPS) Disbursement Claim', applications: 25200, approved: 19400, avgDays: 22.1 },
      { name: 'Stamp Duty & Electricity Duty Exemption Certificate', applications: 15300, approved: 11600, avgDays: 14.5 }
    ]
  }
];

export const DISTRICT_INDUSTRIAL_METRICS: DistrictIndustrialMetric[] = [
  {
    district: 'Pune',
    region: 'Pune',
    applicationsCount: 142600,
    approvedCount: 109800,
    pendingCount: 26400,
    activeProjects: 4820,
    registeredUnits: 18450,
    proposedInvestmentCr: 84500,
    employmentPotential: 340000,
    topSectors: ['Automobile & Auto Ancillaries', 'IT / ITES', 'Engineering & Heavy Machinery']
  },
  {
    district: 'Thane & Navi Mumbai',
    region: 'Konkan',
    applicationsCount: 118400,
    approvedCount: 89600,
    pendingCount: 22800,
    activeProjects: 3910,
    registeredUnits: 15200,
    proposedInvestmentCr: 71200,
    employmentPotential: 285000,
    topSectors: ['Chemicals & Petrochemicals', 'Pharmaceuticals', 'Logistics & Warehousing']
  },
  {
    district: 'Nashik',
    region: 'Nashik',
    applicationsCount: 84200,
    approvedCount: 64100,
    pendingCount: 16200,
    activeProjects: 2640,
    registeredUnits: 9850,
    proposedInvestmentCr: 38400,
    employmentPotential: 165000,
    topSectors: ['Engineering & Tooling', 'Food Processing & Wineries', 'Electrical & Electronics']
  },
  {
    district: 'Chhatrapati Sambhajinagar (Aurangabad)',
    region: 'Marathwada',
    applicationsCount: 76500,
    approvedCount: 57400,
    pendingCount: 15400,
    activeProjects: 2180,
    registeredUnits: 8200,
    proposedInvestmentCr: 42100,
    employmentPotential: 148000,
    topSectors: ['Automobile Manufacturing', 'Pharmaceuticals', 'Brewing & Food Processing']
  },
  {
    district: 'Nagpur',
    region: 'Vidarbha',
    applicationsCount: 68900,
    approvedCount: 51200,
    pendingCount: 14600,
    activeProjects: 1950,
    registeredUnits: 7400,
    proposedInvestmentCr: 34500,
    employmentPotential: 125000,
    topSectors: ['Logistics (MIHAN)', 'Defense & Aerospace', 'Thermal Power & Minerals']
  },
  {
    district: 'Raigad',
    region: 'Konkan',
    applicationsCount: 58200,
    approvedCount: 42900,
    pendingCount: 12400,
    activeProjects: 1620,
    registeredUnits: 6100,
    proposedInvestmentCr: 48900,
    employmentPotential: 110000,
    topSectors: ['Heavy Steel & Metallurgy', 'Petrochemicals', 'Port-based Logistics']
  },
  {
    district: 'Kolhapur',
    region: 'Pune',
    applicationsCount: 44200,
    approvedCount: 33800,
    pendingCount: 8900,
    activeProjects: 1240,
    registeredUnits: 5800,
    proposedInvestmentCr: 18200,
    employmentPotential: 85000,
    topSectors: ['Foundry & Castings', 'Textiles & Sugar', 'Dairy Processing']
  },
  {
    district: 'Solapur',
    region: 'Pune',
    applicationsCount: 34800,
    approvedCount: 26100,
    pendingCount: 7200,
    activeProjects: 980,
    registeredUnits: 4300,
    proposedInvestmentCr: 14100,
    employmentPotential: 62000,
    topSectors: ['Textiles (Terry Towel & Chaddar)', 'Renewable Solar Power', 'Beedi & Sugar']
  }
];

export const SECTOR_METRICS: SectorMetric[] = [
  { sector: 'Manufacturing & Engineering', applications: 184500, approvals: 139200, activeProjects: 5410, sharePercent: 28.3, proposedInvestmentCr: 124500 },
  { sector: 'Automobile & Auto Components', applications: 98400, approvals: 74800, activeProjects: 2840, sharePercent: 15.1, proposedInvestmentCr: 88200 },
  { sector: 'Chemicals & Petrochemicals', applications: 76200, approvals: 56100, activeProjects: 2120, sharePercent: 11.7, proposedInvestmentCr: 69400 },
  { sector: 'Pharmaceuticals & Biotech', applications: 64800, approvals: 48900, activeProjects: 1890, sharePercent: 10.0, proposedInvestmentCr: 54200 },
  { sector: 'IT / ITES & Data Centres', applications: 58200, approvals: 45600, activeProjects: 1650, sharePercent: 8.9, proposedInvestmentCr: 78500 },
  { sector: 'Food Processing & Agro', applications: 52100, approvals: 39800, activeProjects: 1480, sharePercent: 8.0, proposedInvestmentCr: 24800 },
  { sector: 'Textiles & Apparel', applications: 44500, approvals: 33400, activeProjects: 1180, sharePercent: 6.8, proposedInvestmentCr: 19600 },
  { sector: 'Renewable Energy & Power', applications: 38200, approvals: 27900, activeProjects: 980, sharePercent: 5.9, proposedInvestmentCr: 41200 },
  { sector: 'Other MSME Activities', applications: 34092, approvals: 16660, activeProjects: 820, sharePercent: 5.3, proposedInvestmentCr: 12200 }
];

export const SERVICE_PERFORMANCE_METRICS: ServicePerformanceMetric[] = [
  { id: 'srv-1', serviceName: 'Registration under Shops & Establishments Act, 2017', department: 'Labour Department', applications: 84500, completed: 78900, pending: 4200, avgDays: 1.0, status: 'High Performance' },
  { id: 'srv-2', serviceName: 'Consent to Establish (CTE) under Water & Air Acts', department: 'Pollution Control (MPCB)', applications: 64200, completed: 49800, pending: 11400, avgDays: 18.2, status: 'Normal' },
  { id: 'srv-3', serviceName: 'Factory Architectural Building Plan Approval', department: 'Directorate of Industrial Safety & Health', applications: 48900, completed: 38200, pending: 8800, avgDays: 14.2, status: 'High Performance' },
  { id: 'srv-4', serviceName: 'Sanction of Industrial High Tension (HT) Power Load', department: 'Energy Department (MSEDCL)', applications: 41200, completed: 29800, pending: 9500, avgDays: 14.2, status: 'Normal' },
  { id: 'srv-5', serviceName: 'Provisional Fire Safety Building NOC', department: 'Maharashtra Fire Services', applications: 34200, completed: 24500, pending: 7600, avgDays: 13.4, status: 'Normal' },
  { id: 'srv-6', serviceName: 'Eligibility Certificate under PSI 2019 Scheme', department: 'Directorate of Industries', applications: 28400, completed: 21100, pending: 5900, avgDays: 24.8, status: 'Action Needed' },
  { id: 'srv-7', serviceName: 'Industrial Water Connection Allotment', department: 'MIDC Water Works', applications: 24100, completed: 18200, pending: 4900, avgDays: 9.4, status: 'High Performance' },
  { id: 'srv-8', serviceName: 'Ground Water Extraction NOC for Industrial Use', department: 'Water Resources Department (MSGWRA)', applications: 18200, completed: 12400, pending: 4700, avgDays: 28.5, status: 'Action Needed' }
];
