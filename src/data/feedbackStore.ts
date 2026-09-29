export interface FeedbackRecord {
  id: string; // e.g. MUS-FB-2026-000124
  date: string;
  feedbackType: 'Overall Experience' | 'Application Process' | 'Document Verification' | 'Approval/Permission Process' | 'Dashboard' | 'Investor Services' | 'Technical Issue' | 'Other';
  relatedModule: 'Applications' | 'Services Provided' | 'Document Repository' | 'Business Profile' | 'Investor Wizard' | 'Public Dashboard' | 'Grievance' | 'Query' | 'Permission Verification' | 'Other';
  rating: number; // 1 - 5
  message: string;
  applicationRef?: string;
  name?: string;
  mobile?: string;
  email?: string;
  status: 'Submitted' | 'Under Review' | 'Responded' | 'Closed';
  responseDate?: string;
  departmentResponse?: string;
  replies?: Array<{
    sender: 'user' | 'department';
    message: string;
    date: string;
  }>;
}

export const INITIAL_FEEDBACK_ITEMS: FeedbackRecord[] = [
  {
    id: 'MUS-FB-2026-000124',
    date: '28 Sep 2026, 03:45 PM',
    feedbackType: 'Application Process',
    relatedModule: 'Applications',
    rating: 5,
    message: 'The Single Window Auto-Readiness engine verified our pollution consent papers before actual submission. It highlighted our missing site survey plan beforehand, which saved us at least 15 days of back-and-forth query cycles with MPCB.',
    applicationRef: 'APP-MPCB-2026-8812',
    name: 'Arya Enterprise Solutions',
    mobile: '+91 9825204240',
    email: 'arya2007in@gmail.com',
    status: 'Responded',
    responseDate: '29 Sep 2026, 09:15 AM',
    departmentResponse: 'Thank you for your valuable feedback. The Single Window Clearance Cell continuously enhances pre-scrutiny algorithms to eliminate delays under the Maharashtra Right to Services Act, 2015.',
    replies: [
      {
        sender: 'department',
        message: 'Thank you for your valuable feedback. The Single Window Clearance Cell continuously enhances pre-scrutiny algorithms to eliminate delays under the Maharashtra Right to Services Act, 2015.',
        date: '29 Sep 2026, 09:15 AM'
      }
    ]
  },
  {
    id: 'MUS-FB-2026-000098',
    date: '24 Sep 2026, 11:20 AM',
    feedbackType: 'Document Verification',
    relatedModule: 'Document Repository',
    rating: 4,
    message: 'Master Document Vault is very intuitive for storing common CIN, Factory Layout plans, and GST certificates across departments. Adding bulk download of approved certificates in one zip would be even better.',
    applicationRef: 'DOC-REP-MH-994',
    name: 'Arya Enterprise Solutions',
    mobile: '+91 9825204240',
    email: 'arya2007in@gmail.com',
    status: 'Under Review',
    departmentResponse: 'We have logged your feature request for Bulk Certificate ZIP Export. The IT infrastructure team is scheduling this in the upcoming Q4 platform update.',
    responseDate: '25 Sep 2026, 02:00 PM',
    replies: [
      {
        sender: 'department',
        message: 'We have logged your feature request for Bulk Certificate ZIP Export. The IT infrastructure team is scheduling this in the upcoming Q4 platform update.',
        date: '25 Sep 2026, 02:00 PM'
      }
    ]
  },
  {
    id: 'MUS-FB-2026-000062',
    date: '18 Sep 2026, 04:10 PM',
    feedbackType: 'Approval/Permission Process',
    relatedModule: 'Permission Verification',
    rating: 5,
    message: 'Instant QR code certificate verification on the public portal worked flawlessly during our vendor bank audit. Transparent statutory status tracking is commendable.',
    applicationRef: 'VER-MPCB-9021',
    name: 'Arya Enterprise Solutions',
    mobile: '+91 9825204240',
    email: 'arya2007in@gmail.com',
    status: 'Closed',
    responseDate: '19 Sep 2026, 10:30 AM',
    departmentResponse: 'Glad to know the instant verification fulfilled your banking compliance needs. Thank you for utilizing MahaUdyogSetu digital credentials.',
    replies: [
      {
        sender: 'department',
        message: 'Glad to know the instant verification fulfilled your banking compliance needs. Thank you for utilizing MahaUdyogSetu digital credentials.',
        date: '19 Sep 2026, 10:30 AM'
      }
    ]
  }
];

const STORAGE_KEY = 'mahau_feedback_records';

export function getStoredFeedback(): FeedbackRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse feedback records', e);
  }
  return INITIAL_FEEDBACK_ITEMS;
}

export function saveStoredFeedback(records: FeedbackRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save feedback records', e);
  }
}

export function generateFeedbackId(): string {
  const existing = getStoredFeedback();
  const nextNum = (existing.length + 125).toString().padStart(6, '0');
  return `MUS-FB-2026-${nextNum}`;
}
