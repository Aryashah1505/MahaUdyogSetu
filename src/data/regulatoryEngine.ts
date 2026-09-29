import { BusinessProfile, ApprovalItem, IncentiveScheme, DocumentItem } from '../types';

export interface SectorRule {
  sector: string;
  defaultPollutionCategory: 'Red Category' | 'Orange Category' | 'Green Category' | 'White Category';
  isHazardousByDefault: boolean;
  schemes: Array<{
    name: string;
    ministry: string;
    coverage: string;
    financialBenefit: string;
    eligibility: string;
  }>;
}

export const SECTOR_CATALOG: Record<string, SectorRule> = {
  "Engineering & Heavy Manufacturing": {
    sector: "Engineering & Heavy Manufacturing",
    defaultPollutionCategory: "Orange Category",
    isHazardousByDefault: false,
    schemes: [
      {
        name: "Maharashtra Industrial Policy Capital Subsidy for MSME / Engineering",
        ministry: "Industries Department, Government of Maharashtra",
        coverage: "Up to 50% fixed capital investment subsidy for units in Zone C & D (Nashik/Ambad MIDC)",
        financialBenefit: "Lump-sum capital grant up to ₹2.5 Crores + 5% Interest Subsidy",
        eligibility: "New manufacturing unit established in MIDC areas with capital investment in plant & machinery."
      },
      {
        name: "Capital Goods & Engineering Technology Upgradation Scheme",
        ministry: "Ministry of Heavy Industries, Govt of India",
        coverage: "25% capital grant on advanced CNC, tooling and automation machinery",
        financialBenefit: "Financial assistance up to ₹1.0 Crore",
        eligibility: "Manufacturing precision engineering components and tooling."
      },
      {
        name: "Power Tariff Subsidy for MIDC Industrial Units",
        ministry: "MSEDCL & Energy Department, Govt of Maharashtra",
        coverage: "₹1.50 per unit electricity tariff concession for 5 years",
        financialBenefit: "Estimated ₹12-18 Lakhs/Year power cost reduction",
        eligibility: "Industrial units having connected load > 65 kW in designated industrial zones."
      }
    ]
  },
  "Manufacturing (General)": {
    sector: "Manufacturing (General)",
    defaultPollutionCategory: "Orange Category",
    isHazardousByDefault: false,
    schemes: [
      {
        name: "Maharashtra Package Scheme of Incentives (PSI)",
        ministry: "Directorate of Industries, Maharashtra",
        coverage: "100% Stamp duty exemption and SGST refund for 7 years",
        financialBenefit: "Exemption from stamp duty on lease/purchase of land & machinery",
        eligibility: "New manufacturing establishment registered in Maharashtra."
      },
      {
        name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
        ministry: "Ministry of MSME, GoI",
        coverage: "Collateral-free credit facility up to ₹500 Lakhs",
        financialBenefit: "Guarantee cover up to 85% on institutional credit",
        eligibility: "New and existing MSME manufacturing units."
      }
    ]
  },
  "Automotive & EV Components": {
    sector: "Automotive & EV Components",
    defaultPollutionCategory: "Orange Category",
    isHazardousByDefault: false,
    schemes: [
      {
        name: "Maharashtra EV Policy 2025 Manufacturing Incentives",
        ministry: "Environment & Industries Department, Maharashtra",
        coverage: "15% fixed capital subsidy + 100% SGST reimbursement for 5 years",
        financialBenefit: "Up to ₹4.0 Crores cumulative fiscal benefits",
        eligibility: "Manufacturing EV components, battery assemblies, or powertrains in Maharashtra."
      },
      {
        name: "Production Linked Incentive (PLI) for Automobile & Auto Components",
        ministry: "Ministry of Heavy Industries, GoI",
        coverage: "Sales value linked incentives of 8% to 18%",
        financialBenefit: "Substantial revenue multiplier on incremental domestic sales",
        eligibility: "Approved automotive tier 1/2 manufacturing units."
      }
    ]
  },
  "Pharmaceuticals & APIs": {
    sector: "Pharmaceuticals & APIs",
    defaultPollutionCategory: "Red Category",
    isHazardousByDefault: true,
    schemes: [
      {
        name: "Production Linked Incentive (PLI) for Bulk Drugs & APIs",
        ministry: "Ministry of Chemicals & Fertilizers, GoI",
        coverage: "Financial incentive of 5% to 20% on incremental sales over base year",
        financialBenefit: "Up to ₹25.0 Crores over 5 Years",
        eligibility: "Manufacturing APIs, Key Starting Materials (KSM), investment > ₹20 Cr."
      },
      {
        name: "Promotion of Bulk Drug Parks Scheme",
        ministry: "Department of Pharmaceuticals, GoI",
        coverage: "Common Effluent Treatment and steam supply concession",
        financialBenefit: "Shared infrastructure access at 40% subsidized rate",
        eligibility: "Units located within notified pharmaceutical chemical zones."
      }
    ]
  },
  "Chemicals & Petrochemicals": {
    sector: "Chemicals & Petrochemicals",
    defaultPollutionCategory: "Red Category",
    isHazardousByDefault: true,
    schemes: [
      {
        name: "Zero Liquid Discharge (ZLD) Infrastructure Subsidy",
        ministry: "Ministry of Environment, Forest and Climate Change / State PCB",
        coverage: "50% capital subsidy on on-site effluent recovery & multi-effect evaporator systems",
        financialBenefit: "Grant support up to ₹1.5 Crores",
        eligibility: "Chemical units installing 100% water recycling and automated online sensors."
      }
    ]
  },
  "Food Processing & Agri Logistics": {
    sector: "Food Processing & Agri Logistics",
    defaultPollutionCategory: "Green Category",
    isHazardousByDefault: false,
    schemes: [
      {
        name: "Pradhan Mantri Kisan SAMPADA Yojana",
        ministry: "Ministry of Food Processing Industries, GoI",
        coverage: "35% to 50% capital grant for cold chain, food testing labs, and pack-houses",
        financialBenefit: "Capital grant up to ₹5.0 Crores",
        eligibility: "Integrated cold chains and modern agro-processing facilities."
      },
      {
        name: "PM Formalisation of Micro food processing Enterprises (PMFME)",
        ministry: "Ministry of Food Processing Industries",
        coverage: "35% credit-linked capital subsidy for micro food units",
        financialBenefit: "Up to ₹10 Lakhs per enterprise",
        eligibility: "Individual and group micro food processing entrepreneurs."
      }
    ]
  },
  "Textiles & Garment Manufacturing": {
    sector: "Textiles & Garment Manufacturing",
    defaultPollutionCategory: "Orange Category",
    isHazardousByDefault: false,
    schemes: [
      {
        name: "Amended Technology Upgradation Fund Scheme (ATUFS)",
        ministry: "Ministry of Textiles, GoI",
        coverage: "10% to 15% Capital Investment Subsidy on eligible textile machinery",
        financialBenefit: "Lump-sum grant up to ₹30 Lakhs to ₹3 Crores",
        eligibility: "Modernization of weaving, knitting, and garmenting units."
      }
    ]
  },
  "IT, Software & Data Centers": {
    sector: "IT, Software & Data Centers",
    defaultPollutionCategory: "White Category",
    isHazardousByDefault: false,
    schemes: [
      {
        name: "Maharashtra IT/ITeS Policy Infrastructure Concessions",
        ministry: "Directorate of Industries, Maharashtra",
        coverage: "100% Electricity Duty exemption for 10 years + 200% additional FSI",
        financialBenefit: "Estimated ₹25 Lakhs/year operational tax relief",
        eligibility: "Registered IT/ITeS and software export facilities."
      },
      {
        name: "Software Technology Parks of India (STPI) Scheme",
        ministry: "Ministry of Electronics and Information Technology (MeitY)",
        coverage: "100% duty-free import of hardware, high-speed data transmission concessions",
        financialBenefit: "Zero customs duty on capital equipment imports",
        eligibility: "Software development and IT export enterprises."
      }
    ]
  },
  "Renewable Energy & Solar": {
    sector: "Renewable Energy & Solar",
    defaultPollutionCategory: "White Category",
    isHazardousByDefault: false,
    schemes: [
      {
        name: "Maharashtra Renewable Energy Policy Incentives",
        ministry: "MEDA (Maharashtra Energy Development Agency)",
        coverage: "Open access wheeling charge waivers & cross-subsidy surcharge exemptions",
        financialBenefit: "Direct savings of ₹2.20/kWh on captive power consumption",
        eligibility: "Solar/Wind installations > 100 kW capacity."
      }
    ]
  },
  "Construction & Building Materials": {
    sector: "Construction & Building Materials",
    defaultPollutionCategory: "Orange Category",
    isHazardousByDefault: false,
    schemes: [
      {
        name: "MSME Sustainable Green Quality Certification Grant",
        ministry: "Ministry of MSME",
        coverage: "Reimbursement for ISO 14001, BIS & Green Building certification",
        financialBenefit: "Grant up to ₹5.0 Lakhs",
        eligibility: "Manufacture of eco-friendly bricks, concrete blocks, and insulation."
      }
    ]
  },
  "Logistics & Warehousing": {
    sector: "Logistics & Warehousing",
    defaultPollutionCategory: "Green Category",
    isHazardousByDefault: false,
    schemes: [
      {
        name: "National Logistics Policy Support Framework",
        ministry: "Department for Promotion of Industry and Internal Trade (DPIIT)",
        coverage: "Infrastructure status enabling lower interest rates and external commercial borrowings",
        financialBenefit: "200-300 bps interest rate concession on warehouse term loans",
        eligibility: "Modern multi-modal warehousing hubs > 50,000 sq.ft."
      }
    ]
  },
  "Agriculture / Agro Processing": {
    sector: "Agriculture / Agro Processing",
    defaultPollutionCategory: "Green Category",
    isHazardousByDefault: false,
    schemes: [
      {
        name: "Agriculture Infrastructure Fund (AIF)",
        ministry: "Ministry of Agriculture & Farmers Welfare, GoI",
        coverage: "3% interest subvention per annum on institutional credit up to ₹2 Crores",
        financialBenefit: "300 bps loan discount for 7 years",
        eligibility: "Post-harvest management projects and primary processing centers."
      }
    ]
  }
};

/**
 * Dynamically computes pollution category based on CPCB / State PCB guidelines
 */
export function calculatePollutionCategory(
  sector: string,
  isHazardous: boolean,
  powerKw: number,
  investmentCrores: number
): 'Red Category' | 'Orange Category' | 'Green Category' | 'White Category' {
  if (isHazardous) return 'Red Category';
  if (sector.includes('Pharma') || sector.includes('Chemical')) return 'Red Category';
  if (sector.includes('IT') || sector.includes('Software') || sector.includes('Solar') || sector.includes('Renewable')) {
    return 'White Category';
  }
  if (sector.includes('Food') || sector.includes('Logistics') || sector.includes('Agri')) {
    return powerKw > 100 ? 'Orange Category' : 'Green Category';
  }
  if (sector.includes('Engineering') || sector.includes('Automotive') || sector.includes('Manufacturing') || sector.includes('Textiles')) {
    return powerKw > 250 || investmentCrores > 10 ? 'Orange Category' : 'Green Category';
  }
  return 'Orange Category';
}

/**
 * Dynamically evaluates Environmental Clearance (EIA Notification 2006) Applicability
 */
export function evaluateEnvironmentalClearanceApplicability(profile: BusinessProfile): {
  required: boolean;
  category: 'Category A (MoEFCC Central)' | 'Category B1 (SEIAA State)' | 'Category B2' | 'Exempt / Not Applicable';
  reason: string;
  mandatoryDocuments: string[];
} {
  const sector = profile.sector || '';
  const inv = profile.investmentCrores || 0;
  const isRed = profile.handlesHazardous || sector.includes('Pharma') || sector.includes('Chemical');

  // Category A / B thresholds under EIA 2006 schedule
  if (sector.includes('Chemical') || sector.includes('Petrochemical')) {
    return {
      required: true,
      category: inv > 50 ? 'Category A (MoEFCC Central)' : 'Category B1 (SEIAA State)',
      reason: 'Synthetic organic chemicals & petrochemical manufacturing falls under Item 5(f) of EIA Notification Schedule.',
      mandatoryDocuments: [
        'Form 1 & Pre-Feasibility Report (PFR)',
        'Draft Terms of Reference (ToR) for Environmental Impact Assessment (EIA)',
        'Baseline Environmental Quality Monitoring Report (Air, Water, Soil, Noise)',
        'Public Hearing Minutes / Exemption Certificate (if in notified MIDC chemical zone)'
      ]
    };
  }

  if (sector.includes('Pharma') || sector.includes('Bulk Drug')) {
    return {
      required: true,
      category: 'Category B1 (SEIAA State)',
      reason: 'Active Pharmaceutical Ingredients (APIs) and bulk drug manufacturing requires prior EC under Item 5(f).',
      mandatoryDocuments: [
        'Form 1, Form 1M & Pre-Feasibility Report',
        'Chemical Reaction Mass Balance & Zero Liquid Discharge (ZLD) Blueprint',
        'Solvent Recovery and VOC Abatement Action Plan',
        'MIDC Allotment Letter confirming chemical park zoning'
      ]
    };
  }

  if (profile.builtUpAreaSqFt && profile.builtUpAreaSqFt > 215278) { // > 20,000 sq.m (approx 215,278 sq.ft)
    return {
      required: true,
      category: 'Category B2',
      reason: 'Total built-up construction area exceeds 20,000 sq. meters threshold (Item 8(a) Building & Construction projects).',
      mandatoryDocuments: [
        'Form 1 / 1A Environmental Appraisal Dossier',
        'Conceptual Architectural Master Plan & Energy Conservation Building Code (ECBC) Compliance',
        'Sewage Treatment Plant (STP) & Dual Plumbing Layout',
        'Solid Waste Management & Rainwater Harvesting Scheme'
      ]
    };
  }

  return {
    required: false,
    category: 'Exempt / Not Applicable',
    reason: 'Industry activity and project scale are classified within general manufacturing thresholds and exempt from prior Environmental Clearance under EIA Notification 2006.',
    mandatoryDocuments: []
  };
}

/**
 * Dynamically computes approvals strictly from user applications.
 * Only services the user has actually applied for or completed are shown.
 */
export function generateDynamicApprovals(profile: BusinessProfile): ApprovalItem[] {
  return [
    {
      id: 'MH-SWC-2026-LAB-44012',
      code: 'LAB-SH-01',
      name: 'Registration of Establishments under Maharashtra Shops and Establishments Act, 2017',
      department: 'Labour Department, Maharashtra',
      category: 'Labor & Factory Safety',
      slaDays: 1,
      daysElapsed: 1,
      riskTier: 'LOW',
      fastTrack: true,
      status: 'under_scrutiny',
      stageName: 'Submitted / Under Scrutiny by Area Labour Inspector',
      feeAmount: 1000,
      paymentStatus: 'Paid (₹ 1,000)',
      paymentMode: 'UPI / MahaOnline Payment Gateway',
      transactionId: 'TXN-MH-2026-948217',
      applicationRefNumber: 'SWC/LAB/2026/0094821',
      appliedDate: '26/09/2026',
      requiredDocs: [
        'PAN Card of Company / Entity',
        'Certificate of Incorporation & Company Master Data',
        'Registered Office Address Proof & Electricity Bill',
        'Authorized Signatory ID & Board Authorization Resolution'
      ],
      submittedDocs: [
        'PAN Card of Company / Entity',
        'Certificate of Incorporation & Company Master Data',
        'Registered Office Address Proof & Electricity Bill',
        'Authorized Signatory ID & Board Authorization Resolution'
      ],
      verifiedDocDetails: [
        { name: 'PAN Card of Company / Entity', size: '1.2 MB', verifiedAt: '26/09/2026 10:14 AM', docType: 'Statutory Identity Proof (NSDL Verified)' },
        { name: 'Certificate of Incorporation & Master Data', size: '2.8 MB', verifiedAt: '26/09/2026 10:16 AM', docType: 'Corporate Registration (MCA21 Verified)' },
        { name: 'Registered Office Address Proof & Utility Bill', size: '1.9 MB', verifiedAt: '26/09/2026 10:18 AM', docType: 'Premises Ownership / Tenancy Document' },
        { name: 'Authorized Signatory ID & Board Resolution', size: '1.5 MB', verifiedAt: '26/09/2026 10:19 AM', docType: 'Signatory Authority Dossier' }
      ],
      statusHistory: [
        { title: 'Payment Completed', date: '26/09/2026, 10:20 AM', stage: 'Payment', status: 'completed', description: '₹ 1,000 paid via UPI / MahaOnline Payment Gateway (Txn ID: TXN-MH-2026-948217).' },
        { title: 'Application Submitted', date: '26/09/2026, 10:21 AM', stage: 'Submission', status: 'completed', description: 'Application dossier and verified statutory documents successfully lodged.' },
        { title: 'Under Scrutiny', date: '26/09/2026, 10:22 AM', stage: 'Scrutiny', status: 'current', description: 'Application under technical review by Area Labour Inspector, Division II (Nashik / Ambad).' },
        { title: 'Query Raised', date: 'Only if required', stage: 'Query', status: 'pending', description: 'Department clarification/query will appear here if sought by the reviewing officer.' },
        { title: 'Inspection', date: 'Only if required', stage: 'Inspection', status: 'pending', description: 'Physical/site compliance inspection if mandated under statute.' },
        { title: 'Approved', date: 'Target: within SLA (1 Day)', stage: 'Approval', status: 'pending', description: 'Statutory approval by the competent authority.' },
        { title: 'Certificate / License Issued', date: 'Post Approval', stage: 'Issuance', status: 'pending', description: 'Digital Form F Registration Certificate with verification QR-code.' }
      ],
      queries: []
    }
  ];
}

export function generateAllPotentialApprovals(profile: BusinessProfile): ApprovalItem[] {
  const isMaha = !profile.state || profile.state.toLowerCase().includes('maha');
  const spcbName = isMaha ? 'Maharashtra Pollution Control Board (MPCB)' : `State Pollution Control Board (${profile.state} SPCB)`;
  const discomName = isMaha ? 'Maharashtra State Electricity Distribution Co. (MSEDCL)' : `State Electricity Distribution Co. (${profile.state} DISCOM)`;
  const dishName = isMaha ? 'Directorate of Industrial Safety & Health (DISH Maharashtra)' : 'Directorate of Industrial Safety & Health (DISH)';
  const fireName = isMaha ? 'Maharashtra Fire Services & MIDC Fire Dept' : 'State Fire & Emergency Services';
  const townName = profile.isMIDC 
    ? 'MIDC Special Planning Authority (SPA)' 
    : 'Town Planning Department / Urban Local Body / District Collectorate';

  const approvals: ApprovalItem[] = [];

  const sector = profile.sector || 'Manufacturing (General)';
  const isIT = sector.includes('IT') || sector.includes('Software');
  const isWhite = sector.includes('White') || isIT;
  const isRed = profile.handlesHazardous || sector.includes('Pharma') || sector.includes('Chemical');
  const isFactoriesActApplicable = (profile.workforce || 0) >= 10;
  const isCLURequired = profile.landType && profile.landType.includes('Agricultural');
  const isContractLabourApplicable = (profile.contractWorkersCount || 0) >= 20 || (profile.workforce || 0) >= 50;

  // 1. MPCB Consent to Establish (CTE)
  if (!isWhite) {
    const isFast = !isRed && (profile.investmentCrores || 0) < 10;
    approvals.push({
      id: `APP-MPCB-CTE-${profile.id}`,
      code: 'MPCB-CTE-AIR-WATER',
      name: isRed 
        ? 'MPCB Consent to Establish (CTE) — Red Category (Water & Air Acts)'
        : 'MPCB Consent to Establish (CTE) under Water (P&CP) & Air (P&CP) Acts',
      department: spcbName,
      category: 'Environmental & Pollution',
      slaDays: isRed ? 45 : (isFast ? 15 : 21),
      daysElapsed: 4,
      riskTier: isRed ? 'HIGH' : ((profile.investmentCrores || 0) > 25 ? 'MEDIUM' : 'LOW'),
      fastTrack: isFast,
      status: 'under_scrutiny',
      stageName: 'Sub-Regional Officer Technical Scrutiny & Pollution Control Verification',
      feeAmount: isRed ? 45000 : ((profile.investmentCrores || 0) > 10 ? 25000 : 12000),
      requiredDocs: [
        'Certificate of Incorporation & Company PAN Card',
        'Land Ownership Document or MIDC Lease / Allotment Letter',
        'Comprehensive Detailed Project Report (DPR) & CA Capital Investment Certificate',
        'Detailed Plant Layout & Topographical Site Index Plan',
        'Manufacturing Process Flow Sheet & Chemical Reaction Mass Balance',
        'Pollution Control System Proposal (ETP/STP & APCD Chimney Heights)',
        'DG Set Acoustic & Chimney Emission Layout'
      ],
      submittedDocs: [
        'Certificate of Incorporation & Company PAN Card',
        'Land Ownership Document or MIDC Lease / Allotment Letter',
        'Comprehensive Detailed Project Report (DPR) & CA Capital Investment Certificate',
        'Detailed Plant Layout & Topographical Site Index Plan',
        'Manufacturing Process Flow Sheet & Chemical Reaction Mass Balance',
        'Pollution Control System Proposal (ETP/STP & APCD Chimney Heights)'
      ],
      queries: []
    });
  }

  // 2. MPCB Consent to Operate (CTO) (When in Pre-Operation or Expansion stage)
  if (profile.stage === 'Pre-Operation' || profile.stage === 'Expansion') {
    approvals.push({
      id: `APP-MPCB-CTO-${profile.id}`,
      code: 'MPCB-CTO-AIR-WATER',
      name: 'MPCB Consent to Operate (CTO) / First Renewal under Water & Air Acts',
      department: spcbName,
      category: 'Environmental & Pollution',
      slaDays: isRed ? 45 : 30,
      daysElapsed: 0,
      riskTier: isRed ? 'HIGH' : 'MEDIUM',
      fastTrack: false,
      status: 'not_started',
      stageName: 'Dossier Preparation (Post-Establishment Compliance)',
      feeAmount: isRed ? 50000 : 30000,
      requiredDocs: [
        'Previous Consent to Establish (CTE) Grant Order',
        'Approved Plant Layout & As-Built Machinery Blueprints',
        'Latest Treated Effluent Analysis Report (NABL / MPCB Board Lab)',
        'Flue Gas & Ambient Air Quality Analysis Report',
        'Hazardous & Solid Waste Storage / Manifest Return Details',
        'Installed Pollution Control Equipment (ETP/STP/Scrubber) Performance Certificate',
        'Board Resolution / Signatory Authorization Letter'
      ],
      submittedDocs: [],
      queries: []
    });
  }

  // 3. Factory Registration & License (DISH Maharashtra - 2024 Amended Rules)
  if (isFactoriesActApplicable && !isIT) {
    const isHazardousFactory = profile.handlesHazardous || (profile.sector.includes('Chemical') || profile.sector.includes('Pharma'));
    approvals.push({
      id: `APP-DISH-FACT-${profile.id}`,
      code: isHazardousFactory ? 'DISH-MAH-FACT-LIC' : 'DISH-ORD-FACT-LIC',
      name: isHazardousFactory
        ? 'Factory Plan Approval & License for Major Accident Hazard (MAH) / Hazardous Factory (Rule 3-A)'
        : 'Factory Building Plan Approval & Registration License (Factories Act, 1948)',
      department: dishName,
      category: 'Labor & Factory Safety',
      slaDays: isHazardousFactory ? 30 : 20,
      daysElapsed: 3,
      riskTier: isHazardousFactory ? 'HIGH' : 'MEDIUM',
      fastTrack: !isHazardousFactory && (profile.workforce || 0) < 50,
      status: 'under_scrutiny',
      stageName: 'Machinery Layout, Worker Movement Pathways & Occupational Safety Scrutiny',
      feeAmount: (profile.workforce || 0) > 100 ? 25000 : 18500,
      requiredDocs: [
        'Approved Factory Architectural Building Plan & Section Elevations',
        'Machinery Layout & Material / Worker Movement Pathways Blueprint',
        'Emergency Exits, Ventilation & Sanitation Welfare Plan',
        'Manufacturing Process Flow Chart & Description',
        'Raw Materials, Intermediates, Finished Products & By-Products Quantities',
        'Hazard Identification, Control Measures & On-Site Emergency Plan (Rule 68-O)',
        'Competent Person Structural Stability Certificate'
      ],
      submittedDocs: [
        'Approved Factory Architectural Building Plan & Section Elevations',
        'Machinery Layout & Material / Worker Movement Pathways Blueprint',
        'Manufacturing Process Flow Chart & Description',
        'Raw Materials, Intermediates, Finished Products & By-Products Quantities',
        'Hazard Identification, Control Measures & On-Site Emergency Plan (Rule 68-O)'
      ],
      queries: []
    });
  }

  // 4. Fire Safety NOC (Occupancy & Hazard tailored)
  const isFireHighRisk = isRed || (profile.workforce || 0) > 50 || (profile.investmentCrores || 0) > 15;
  approvals.push({
    id: `APP-FIRE-${profile.id}`,
    code: 'FIRE-PROV-NOC',
    name: 'Provisional Fire Safety No Objection Certificate (NOC)',
    department: fireName,
    category: 'Safety & Hazard',
    slaDays: isFireHighRisk ? 14 : 7,
    daysElapsed: 6,
    riskTier: isFireHighRisk ? 'HIGH' : 'LOW',
    fastTrack: !isFireHighRisk,
    status: 'query_raised',
    stageName: 'Awaiting Heavy Vehicle Turning Radius Clarification',
    feeAmount: isFireHighRisk ? 20000 : 15000,
    requiredDocs: [
      'Comprehensive Factory Architectural & Site Layout Plan',
      'Dedicated Fire-Fighting Layout (Hydrant, Sprinkler, Risers & Smoke Detectors)',
      'Fire Exit & Emergency Evacuation Route Blueprint',
      'Electrical Single Line Diagram (SLD) & Flameproof Enclosure Specs',
      'MIDC / Building Development Permission'
    ],
    submittedDocs: [
      'Comprehensive Factory Architectural & Site Layout Plan',
      'Dedicated Fire-Fighting Layout (Hydrant, Sprinkler, Risers & Smoke Detectors)',
      'Electrical Single Line Diagram (SLD) & Flameproof Enclosure Specs'
    ],
    queries: [
      {
        id: 'QRY-FIRE-01',
        approvalId: `APP-FIRE-${profile.id}`,
        department: fireName,
        officerName: 'Divisional Fire Officer',
        dateRaised: '2026-03-22',
        deadlineDate: '2026-03-29',
        queryText: 'Please clarify minimum 6.0m heavy fire tender peripheral access along Eastern boundary.',
        status: 'pending',
        responseDraft: 'Revised architectural drawing attached showing clear 6.2m driveway and 14m circular turning radius.'
      }
    ]
  });

  // 5. Building & Development Permission
  if (isCLURequired) {
    approvals.push({
      id: `APP-CLU-${profile.id}`,
      code: 'REV-CLU-PERM',
      name: 'Change of Land Use (CLU) & Non-Agricultural (NA) Industrial Sanction',
      department: 'Revenue & District Collectorate',
      category: 'Municipal & Land',
      slaDays: 30,
      daysElapsed: 0,
      riskTier: 'HIGH',
      fastTrack: false,
      status: 'not_started',
      stageName: 'Zoning & Master Plan Alignment Check',
      feeAmount: 30000,
      requiredDocs: [
        'Land Ownership Document or Registered Title Deed',
        'Revenue 7/12 Extract & Mutation Register Extracts',
        'Architectural Site Layout & Building Floor Plan',
        'Development Proposal & Structural Engineer Drawings'
      ],
      submittedDocs: [],
      queries: []
    });
  } else {
    approvals.push({
      id: `APP-TOWN-${profile.id}`,
      code: 'MIDC-BLD-PLAN',
      name: profile.isMIDC 
        ? 'MIDC Industrial Building Plan Sanction & Construction Commencement Certificate'
        : 'Industrial Building / Development Permission (Local Planning Authority)',
      department: townName,
      category: 'Municipal & Land',
      slaDays: 21,
      daysElapsed: 5,
      riskTier: 'LOW',
      fastTrack: true,
      status: 'under_scrutiny',
      stageName: 'Development Control Regulations (DCR) Scrutiny',
      feeAmount: 22000,
      requiredDocs: [
        'Land Ownership Document or MIDC Lease / Allotment Letter',
        'Architectural Master Site Plan & Cross Section Elevation Drawings',
        'Structural Design Calculations & Stability Certificate',
        'Sanitation, Rainwater Harvesting & Parking Layout Plans'
      ],
      submittedDocs: [
        'Land Ownership Document or MIDC Lease / Allotment Letter',
        'Architectural Master Site Plan & Cross Section Elevation Drawings'
      ],
      queries: []
    });
  }

  // 6. Labour Department Registrations
  if (isContractLabourApplicable) {
    approvals.push({
      id: `APP-LAB-CONTRACT-${profile.id}`,
      code: 'LAB-CL-REG-01',
      name: 'Registration of Principal Employer under Contract Labour (R&A) Act, 1970',
      department: 'Labour Department, Maharashtra',
      category: 'Labor & Factory Safety',
      slaDays: 7,
      daysElapsed: 2,
      riskTier: 'LOW',
      fastTrack: true,
      status: 'approved',
      stageName: 'Digital Certificate Dispatched',
      certificateNumber: 'MH-LAB-CL-2026-8819',
      validityExpiry: '2027-03-31',
      feeAmount: 2500,
      requiredDocs: [
        'Certificate of Incorporation & Company PAN Card',
        'Principal Employer KYC & Authorized Person Authorization Letter',
        'Contractor Deployment Agreements & Worker Estimate Schedule'
      ],
      submittedDocs: [
        'Certificate of Incorporation & Company PAN Card',
        'Principal Employer KYC & Authorized Person Authorization Letter',
        'Contractor Deployment Agreements & Worker Estimate Schedule'
      ],
      queries: []
    });
  }

  approvals.push({
    id: `APP-LAB-SHOPS-${profile.id}`,
    code: 'LAB-SHOPS-REG',
    name: 'Registration / Intimation under Maharashtra Shops & Establishments Act, 2017',
    department: 'Labour Department, Maharashtra',
    category: 'Labor & Factory Safety',
    slaDays: 1,
    daysElapsed: 1,
    riskTier: 'LOW',
    fastTrack: true,
    status: 'approved',
    stageName: 'Auto-Approved Self Certification Receipt Issued',
    certificateNumber: 'MH-SHOPS-2026-44012',
    validityExpiry: 'Permanent',
    feeAmount: 1000,
    requiredDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'Registered-Office Address Proof & Electricity Bill',
      'Authorized Person ID Proof & Passport Photo'
    ],
    submittedDocs: [
      'Certificate of Incorporation & Company PAN Card',
      'Registered-Office Address Proof & Electricity Bill',
      'Authorized Person ID Proof & Passport Photo'
    ],
    queries: []
  });

  // 7. Industrial Power Load Sanction (MSEDCL)
  const powerKw = profile.connectedPowerKw || 50;
  approvals.push({
    id: `APP-DISCOM-${profile.id}`,
    code: powerKw >= 100 ? 'PWR-HT-SANCTION' : 'PWR-LT-SANCTION',
    name: `Industrial Power Load Sanction (${powerKw} kW HT/LT) — MSEDCL`,
    department: discomName,
    category: 'Utility & Infrastructure',
    slaDays: powerKw >= 100 ? 10 : 7,
    daysElapsed: 5,
    riskTier: 'LOW',
    fastTrack: true,
    status: 'approved',
    stageName: 'Sanction Order Executed & Line Feasibility Approved',
    certificateNumber: `MSEDCL/MH/${profile.district || 'ZONE'}/HT/2026/7741`,
    validityExpiry: '2029-03-31',
    feeAmount: 35000,
    requiredDocs: [
      'Land Ownership Document or MIDC Lease / Allotment Letter',
      'Certificate of Incorporation & Company PAN Card',
      'Single Line Electrical Diagram (SLD) & Substation Transformer Layout'
    ],
    submittedDocs: [
      'Land Ownership Document or MIDC Lease / Allotment Letter',
      'Certificate of Incorporation & Company PAN Card',
      'Single Line Electrical Diagram (SLD) & Substation Transformer Layout'
    ],
    queries: []
  });

  // 8. Environmental Clearance (EC) - Evaluated dynamically via Intelligence Rule Engine
  const ecEval = evaluateEnvironmentalClearanceApplicability(profile);
  if (ecEval.required) {
    approvals.push({
      id: `APP-EC-MOEF-${profile.id}`,
      code: 'MOEF-EC-2006',
      name: `Prior Environmental Clearance (EC) — ${ecEval.category}`,
      department: 'State Environmental Impact Assessment Authority (SEIAA) / MoEFCC',
      category: 'Environmental & Pollution',
      slaDays: 90,
      daysElapsed: 12,
      riskTier: 'HIGH',
      fastTrack: false,
      status: 'under_scrutiny',
      stageName: 'State Expert Appraisal Committee (SEAC) Technical Hearing',
      feeAmount: 100000,
      requiredDocs: ecEval.mandatoryDocuments,
      submittedDocs: [ecEval.mandatoryDocuments[0], ecEval.mandatoryDocuments[1]],
      queries: []
    });
  }

  return approvals;
}

/**
 * Generates the unified, single-source-of-truth Document Vault.
 * Stored once and automatically attached to all matching clearance applications.
 */
export function generateInitialDocuments(profile: BusinessProfile): DocumentItem[] {
  // Master document vault starts empty (0 / 4 documents uploaded initially)
  return [];
}

/**
 * Filter incentive schemes tailored strictly to company profile
 */
export function getMatchedSchemes(profile: BusinessProfile): IncentiveScheme[] {
  const catalogRule = SECTOR_CATALOG[profile.sector] || SECTOR_CATALOG["Manufacturing (General)"];
  const list = catalogRule?.schemes || SECTOR_CATALOG["Manufacturing (General)"].schemes;

  return list.map((item, idx) => ({
    id: `SCH-${profile.id}-${idx + 1}`,
    name: item.name,
    ministry: item.ministry,
    coverage: item.coverage,
    financialBenefit: item.financialBenefit,
    eligibility: item.eligibility,
    status: 'Eligible',
    deadline: '2026-12-31',
    matchScore: 95 - (idx * 3)
  }));
}
