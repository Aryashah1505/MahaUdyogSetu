export interface DepartmentSlaRow {
  id: string;
  departmentName: string;
  received: number | string;
  pending: number | string;
  approved: number | string;
  disposed: number | string;
  slaBreach: number | string;
  pendingWithDept: number | string;
  complianceCount?: number;
  avgDisposalDays?: number;
}

export const STATE_SWC_DASHBOARD_METRICS = {
  registeredUsers: 0,
  registeredFactoryUnits: 0,
  totalApplicationsReceived: 0,
  applicationsDisposed: 0,
  totalSlaBreach: 0,
  applicationsPending: 0,
  // Live state totals (from the official MAITRI Single Window portal)
  stateWideReceived: 649242,
  stateWidePending: 76730,
  stateWideApproved: 538762,
  stateWideDisposed: 572512,
  stateWideSlaBreach: 946,
  stateWidePendingWithDept: 57659,
};

export const MAITRI_DEPARTMENT_SLA_STATS: DepartmentSlaRow[] = [
  {
    id: 'metrology',
    departmentName: 'Legal Metrology Department',
    received: 119397,
    pending: 33658,
    approved: 78983,
    disposed: 85739,
    slaBreach: 770,
    pendingWithDept: 33658
  },
  {
    id: 'tourism',
    departmentName: 'Maharashtra Tourism',
    received: 511,
    pending: 402,
    approved: 79,
    disposed: 109,
    slaBreach: 2,
    pendingWithDept: 343
  },
  {
    id: 'midc',
    departmentName: 'Maharashtra Industrial Development Corporation',
    received: 6153,
    pending: 2164,
    approved: 3785,
    disposed: 3989,
    slaBreach: 8,
    pendingWithDept: 1228
  },
  {
    id: 'doi',
    departmentName: 'Directorate of Industries',
    received: 50053,
    pending: 12753,
    approved: 34961,
    disposed: 37300,
    slaBreach: 9,
    pendingWithDept: 1610
  },
  {
    id: 'water',
    departmentName: 'Water Resource Department',
    received: 15,
    pending: 13,
    approved: 0,
    disposed: 2,
    slaBreach: 0,
    pendingWithDept: 10
  },
  {
    id: 'revenue',
    departmentName: 'Revenue Department',
    received: '--',
    pending: '--',
    approved: 0,
    disposed: 0,
    slaBreach: 0,
    pendingWithDept: '--'
  },
  {
    id: 'law',
    departmentName: 'Law and Judiciary Department',
    received: '--',
    pending: '--',
    approved: 0,
    disposed: 0,
    slaBreach: 0,
    pendingWithDept: '--'
  },
  {
    id: 'dish',
    departmentName: 'Directorate of Industrial Safety and Health',
    received: 7328,
    pending: 3815,
    approved: 3513,
    disposed: 3513,
    slaBreach: 0,
    pendingWithDept: 3088
  },
  {
    id: 'energy',
    departmentName: 'Energy Department',
    received: 67233,
    pending: 8789,
    approved: 34210,
    disposed: 58444,
    slaBreach: 80,
    pendingWithDept: 6484
  },
  {
    id: 'labour',
    departmentName: 'Labour Department',
    received: 392114,
    pending: 13449,
    approved: 378664,
    disposed: 378665,
    slaBreach: 0,
    pendingWithDept: 10429
  },
  {
    id: 'forest',
    departmentName: 'Forest Department',
    received: 2,
    pending: 2,
    approved: 0,
    disposed: 0,
    slaBreach: 0,
    pendingWithDept: 2
  },
  {
    id: 'mpcb',
    departmentName: 'Maharashtra Pollution Control Board',
    received: 280,
    pending: 163,
    approved: 57,
    disposed: 117,
    slaBreach: 0,
    pendingWithDept: 163
  },
  {
    id: 'urban',
    departmentName: 'Urban Development II',
    received: '--',
    pending: '--',
    approved: 0,
    disposed: 0,
    slaBreach: 0,
    pendingWithDept: '--'
  },
  {
    id: 'excise',
    departmentName: 'Excise Department',
    received: 1395,
    pending: 1037,
    approved: 262,
    disposed: 358,
    slaBreach: 76,
    pendingWithDept: 437
  },
  {
    id: 'pwd',
    departmentName: 'Public Works Department (Electrical)',
    received: '--',
    pending: '--',
    approved: 0,
    disposed: 0,
    slaBreach: 0,
    pendingWithDept: '--'
  },
  {
    id: 'fda',
    departmentName: 'Food and Drug Administration',
    received: '--',
    pending: '--',
    approved: 0,
    disposed: 0,
    slaBreach: 0,
    pendingWithDept: '--'
  },
  {
    id: 'gst',
    departmentName: 'Department of Goods and Services Tax, Maharashtra State (Only for VAT/CST/PTEC/PTRC)',
    received: '--',
    pending: '--',
    approved: 0,
    disposed: 0,
    slaBreach: 0,
    pendingWithDept: '--'
  },
  {
    id: 'boilers',
    departmentName: 'Directorate of Boilers',
    received: 4761,
    pending: 485,
    approved: 4248,
    disposed: 4276,
    slaBreach: 1,
    pendingWithDept: 207
  }
];
