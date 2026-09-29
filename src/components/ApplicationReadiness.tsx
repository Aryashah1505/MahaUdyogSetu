import React, { useState, useRef, useMemo } from 'react';
import { BusinessProfile, DocumentItem, ApprovalItem } from '../types';
import { 
  calculateApprovalReadiness, 
  checkDocumentConsistency, 
  ConsistencyIssue, 
  ReadinessEvaluation 
} from '../data/readinessEngine';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Building2, 
  ShieldCheck, 
  FileText, 
  ArrowLeft, 
  Clock, 
  IndianRupee, 
  Upload, 
  Trash2, 
  Eye, 
  Download, 
  RefreshCw, 
  X, 
  FileCheck2, 
  AlertCircle, 
  SearchCheck, 
  Check, 
  XCircle, 
  Sparkles, 
  Info, 
  Send, 
  ArrowRight, 
  CheckCircle, 
  FileCheck,
  CreditCard,
  Smartphone,
  Landmark,
  Shield,
  Receipt,
  Cpu,
  HelpCircle,
  TrendingUp,
  Sliders,
  CheckCheck
} from 'lucide-react';

export interface ServiceDetail {
  id: string;
  code: string;
  name: string;
  department: string;
  sla: string;
  fees: string;
  officialPortalName: string;
  officialPortalUrl: string;
  eligibilityCriteria: { criterion: string; met: boolean; reason: string }[];
  requiredDocTypes: {
    docName: string;
    category: 'Statutory' | 'Technical' | 'Financial' | 'Land & Building';
    mandatory: boolean;
    description: string;
  }[];
}

interface ApplicationReadinessProps {
  service: ServiceDetail;
  profile: BusinessProfile;
  vaultDocuments: DocumentItem[];
  onBack: () => void;
  onCompleteRequirements: () => void;
  onUpdateVaultDocuments?: (docs: DocumentItem[]) => void;
  onSubmitApplication?: (newApproval: ApprovalItem) => void;
  onViewApplicationStatus?: () => void;
  onViewApplicationDetails?: (app: ApprovalItem) => void;
}

export type VerificationState = 'not_uploaded' | 'not_verified' | 'verifying' | 'verified';

export interface UploadedFileRecord {
  file: File;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: VerificationState;
}

// Helper to determine if a government fee is applicable and parse its numeric display
export function parseGovernmentFee(feeString: string): { hasFee: boolean; feeAmountFormatted: string; feeRaw: number } {
  if (!feeString) return { hasFee: false, feeAmountFormatted: '₹ 0 (Nil)', feeRaw: 0 };
  const lower = feeString.toLowerCase().trim();
  if (lower.includes('nil') || lower.includes('free') || lower === '0' || lower === '₹ 0' || lower === 'rs 0' || lower === 'rs. 0') {
    return { hasFee: false, feeAmountFormatted: '₹ 0 (Nil)', feeRaw: 0 };
  }
  
  // Extract number if present
  const match = feeString.match(/[\d,]+/);
  if (match) {
    const rawVal = parseInt(match[0].replace(/,/g, ''), 10);
    if (rawVal > 0) {
      return { hasFee: true, feeAmountFormatted: feeString.startsWith('₹') ? feeString : `₹ ${feeString}`, feeRaw: rawVal };
    }
  }

  // If text has non-zero indicator
  return { hasFee: true, feeAmountFormatted: feeString.startsWith('₹') ? feeString : `₹ ${feeString}`, feeRaw: 2500 };
}

export const ApplicationReadiness: React.FC<ApplicationReadinessProps> = ({
  service,
  profile,
  vaultDocuments,
  onBack,
  onCompleteRequirements,
  onUpdateVaultDocuments,
  onSubmitApplication,
  onViewApplicationStatus,
  onViewApplicationDetails,
}) => {
  // Local state mapping document name to uploaded file data and verification state
  const [docRecords, setDocRecords] = useState<Record<string, UploadedFileRecord>>(() => {
    const initial: Record<string, UploadedFileRecord> = {};
    vaultDocuments.forEach(doc => {
      // Only include documents if they have real uploaded records or are verified
      const s = doc.status as any;
      if (s === 'verified' || s === 'not_verified' || s === 'uploaded') {
        const isVerified = s === 'verified';
        initial[doc.name] = {
          file: new File([""], `${doc.name}.pdf`, { type: "application/pdf" }),
          fileName: `${doc.name}.pdf`,
          fileSize: doc.fileSize || '1.5 MB',
          uploadDate: doc.uploadDate || new Date().toISOString().split('T')[0],
          status: isVerified ? 'verified' : 'not_verified'
        };
      }
    });
    return initial;
  });

  // Uploading state per document name
  const [uploadStates, setUploadStates] = useState<Record<string, { isUploading: boolean; progress: number; error: string | null }>>({});

  // Delete confirmation modal state
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  // Preview Document Modal state
  const [previewDoc, setPreviewDoc] = useState<{ 
    name: string; 
    fileName: string; 
    size: string; 
    uploadDate: string; 
    status: VerificationState; 
  } | null>(null);

  // Ready to Proceed Confirmation Modal
  const [showProceedModal, setShowProceedModal] = useState<boolean>(false);

  // Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mock Official Application Portal Step:
  // 'application_form' -> 'payment_summary' -> 'payment_gateway' -> 'submitted_success'
  const [showMockOfficialPortal, setShowMockOfficialPortal] = useState<boolean>(false);
  const [portalStep, setPortalStep] = useState<'application_form' | 'payment_summary' | 'payment_gateway' | 'submitted_success'>('application_form');

  const [applicationRefNumber, setApplicationRefNumber] = useState<string>(() => {
    return `MH-SWC-2026-${service.code.slice(0, 4)}-${Math.floor(100000 + Math.random() * 900000)}`;
  });
  const [transactionId, setTransactionId] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [generatedApprovalItem, setGeneratedApprovalItem] = useState<ApprovalItem | null>(null);
  
  // Payment Gateway method selection
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('arya.enterprise@okaxis');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // File input refs map
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Approval Readiness Engine State & Dynamic Calculation
  const [fixedIssueIds, setFixedIssueIds] = useState<Record<string, boolean>>({});
  const [selectedReviewIssue, setSelectedReviewIssue] = useState<ConsistencyIssue | null>(null);
  const [showAttentionProceedWarningModal, setShowAttentionProceedWarningModal] = useState<boolean>(false);

  // Derive dynamic required doc names for readiness calculation
  const requiredServiceDocNames = useMemo(() => {
    return service.requiredDocTypes.map(d => d.docName);
  }, [service]);

  // Real-time dynamic evaluation using the engine
  const readinessData = useMemo(() => {
    // Merge local docRecords with vaultDocuments for real-time responsiveness
    const currentLiveDocs: DocumentItem[] = service.requiredDocTypes.map(rt => {
      const rec = docRecords[rt.docName];
      const existing = vaultDocuments.find(v => v.name.toLowerCase() === rt.docName.toLowerCase());
      return {
        id: existing?.id || `DOC-${rt.docName.slice(0, 4)}`,
        name: rt.docName,
        type: 'PDF',
        category: rt.category === 'Statutory' ? 'Statutory' : rt.category === 'Land & Building' ? 'Land & Property' : rt.category === 'Technical' ? 'Technical' : 'Financial',
        fileSize: rec?.fileSize || existing?.fileSize || '1.5 MB',
        uploadDate: rec?.uploadDate || existing?.uploadDate || '2026-09-28',
        status: (rec ? (rec.status === 'not_verified' ? 'pending' : rec.status) : (existing?.status || 'pending')) as any,
        validationScore: rec?.status === 'verified' ? 100 : 0,
        linkedApprovals: existing?.linkedApprovals || []
      };
    });

    const overrides: Record<string, boolean> = {};
    if (fixedIssueIds['ISSUE-ADDR-01']) overrides['address_match_fixed'] = true;
    if (fixedIssueIds['ISSUE-SIG-02']) overrides['signatory_match_fixed'] = true;

    return calculateApprovalReadiness(profile, currentLiveDocs, requiredServiceDocNames, overrides);
  }, [profile, vaultDocuments, docRecords, service, requiredServiceDocNames, fixedIssueIds]);

  // Evaluate document counts
  const totalMandatory = service.requiredDocTypes.filter(d => d.mandatory).length;
  
  // Count of uploaded documents
  const totalUploaded = service.requiredDocTypes.filter(d => {
    const record = docRecords[d.docName];
    return record && (record.status === 'not_verified' || record.status === 'verifying' || record.status === 'verified');
  }).length;

  // Count of verified documents
  const totalVerified = service.requiredDocTypes.filter(d => {
    const record = docRecords[d.docName];
    return record && record.status === 'verified';
  }).length;

  const allDocsUploaded = totalUploaded === totalMandatory;
  const allDocsVerified = totalVerified === totalMandatory;
  const allEligibilityMet = service.eligibilityCriteria.every(c => c.met);
  const isApplication100Ready = allDocsUploaded && allDocsVerified && allEligibilityMet;
  const missingOrUnverifiedCount = totalMandatory - totalVerified;

  // Fee calculation for this service
  const feeInfo = parseGovernmentFee(service.fees);

  // Perform Prototype Demo Verification on Click
  const performDocumentVerification = (reqDocName: string) => {
    const record = docRecords[reqDocName];
    if (!record) return;

    // 1. Set temporary verifying state
    setDocRecords(prev => ({
      ...prev,
      [reqDocName]: {
        ...prev[reqDocName],
        status: 'verifying'
      }
    }));

    // 2. Demo verification delay to simulate processing, then turn green verified
    setTimeout(() => {
      setDocRecords(prev => ({
        ...prev,
        [reqDocName]: {
          ...prev[reqDocName],
          status: 'verified'
        }
      }));

      // Synchronize with master vault documents
      if (onUpdateVaultDocuments) {
        const docId = `DOC-${reqDocName.slice(0, 4).toUpperCase()}-${profile.id}-${Math.floor(100 + Math.random() * 900)}`;
        const newVaultItem: DocumentItem = {
          id: docId,
          name: reqDocName,
          type: 'PDF',
          category: 'Statutory',
          fileSize: record.fileSize,
          uploadDate: record.uploadDate,
          status: 'verified',
          validationScore: 100,
          checklistResults: [
            { check: 'Document Type Detection', passed: true, detail: `${reqDocName} recognized` },
            { check: 'Enterprise Alignment', passed: true, detail: `100% matched with ${profile.name}` }
          ],
          missingOrInvalidItems: [],
          correctionGuidance: 'Document Verified Successfully.',
          linkedApprovals: [service.code]
        };

        const currentVault = vaultDocuments.filter(d => d.name.toLowerCase() !== reqDocName.toLowerCase());
        onUpdateVaultDocuments([...currentVault, newVaultItem]);
      }
    }, 600);
  };

  // Handle PDF file upload (PDF only, max 10 MB, sets status to 'not_verified')
  const handleFileUpload = (reqDocName: string, file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadStates(prev => ({
        ...prev,
        [reqDocName]: { isUploading: false, progress: 0, error: 'Only PDF files are allowed.' }
      }));
      return;
    }

    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setUploadStates(prev => ({
        ...prev,
        [reqDocName]: { isUploading: false, progress: 0, error: 'File size must be 10 MB or less.' }
      }));
      return;
    }

    setUploadStates(prev => ({
      ...prev,
      [reqDocName]: { isUploading: true, progress: 20, error: null }
    }));

    const fileSizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    let currentProgress = 25;
    const interval = setInterval(() => {
      currentProgress += 35;
      if (currentProgress < 95) {
        setUploadStates(prev => ({
          ...prev,
          [reqDocName]: { isUploading: true, progress: currentProgress, error: null }
        }));
      } else {
        clearInterval(interval);

        setDocRecords(prev => ({
          ...prev,
          [reqDocName]: {
            file: file,
            fileName: file.name,
            fileSize: fileSizeFormatted,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'not_verified'
          }
        }));

        setUploadStates(prev => ({
          ...prev,
          [reqDocName]: { isUploading: false, progress: 100, error: null }
        }));
      }
    }, 100);
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (!docToDelete) return;

    setDocRecords(prev => {
      const next = { ...prev };
      delete next[docToDelete];
      return next;
    });

    if (onUpdateVaultDocuments) {
      const updatedVault = vaultDocuments.filter(d => d.name.toLowerCase() !== docToDelete.toLowerCase());
      onUpdateVaultDocuments(updatedVault);
    }

    setUploadStates(prev => {
      const next = { ...prev };
      delete next[docToDelete];
      return next;
    });

    setDocToDelete(null);
  };

  // Download simulation
  const handleDownloadDoc = (reqDocName: string, record: UploadedFileRecord) => {
    const element = document.createElement("a");
    const fileContent = `MahaUdyogSetu Document Dossier\nDocument: ${reqDocName}\nFilename: ${record.fileName}\nEntity: ${profile.name}\nPAN: ${profile.pan}\nVerification Status: ${record.status.toUpperCase()}\nDate: ${record.uploadDate}`;
    const blob = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(blob);
    element.download = record.fileName.endsWith('.pdf') ? record.fileName : `${record.fileName}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Click on "Proceed to Official Application ↗" button -> checks if there are issues needing attention
  const handleInitiateProceed = () => {
    // If there are unresolved consistency issues or critical alerts, open the Attention Warning Modal
    const unresolvedIssues = readinessData.consistencyIssues.filter(i => !i.resolved);
    if (unresolvedIssues.length > 0 || readinessData.criticalIssuesCount > 0) {
      setShowAttentionProceedWarningModal(true);
    } else {
      setShowProceedModal(true);
    }
  };

  const handleFixIssueInline = (issueId: string) => {
    setFixedIssueIds(prev => ({ ...prev, [issueId]: true }));
    setSelectedReviewIssue(null);
    setToastMessage("Document & profile mismatch updated and aligned ✓");
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Confirmation modal: when "Proceed ↗" is clicked
  const handleConfirmProceed = () => {
    setShowProceedModal(false);
    setShowAttentionProceedWarningModal(false);
    
    // Show toast message
    setToastMessage("Application data prepared successfully. Redirecting to the official portal…");

    setTimeout(() => {
      setToastMessage(null);
      
      if (service.officialPortalUrl && service.officialPortalUrl.startsWith('http')) {
        try {
          window.open(service.officialPortalUrl, '_blank', 'noopener,noreferrer');
        } catch (e) {}
      }
      
      // Open Mock Official Application initial view
      setPortalStep('application_form');
      setShowMockOfficialPortal(true);
    }, 1000);
  };

  // Helper to register new approval in parent state
  const registerNewSubmittedApproval = (customTxnId?: string, customPaymentDate?: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB');
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isPaid = feeInfo.hasFee;
    const txId = customTxnId || (isPaid ? `TXN-MH-2026-${Math.floor(100000 + Math.random() * 900000)}` : 'N/A');
    const pDate = customPaymentDate || `${dateStr}, ${timeStr}`;
    const generatedId = `MH-SWC-2026-${service.code.replace(/[^A-Z0-9]/gi, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApproval: ApprovalItem = {
      id: generatedId,
      code: service.code,
      name: service.name,
      department: service.department,
      category: 'Statutory Single Window Service',
      slaDays: parseInt(service.sla) || 15,
      daysElapsed: 0,
      riskTier: 'MEDIUM',
      fastTrack: service.sla.toLowerCase().includes('1 day') || service.sla.toLowerCase().includes('7 day'),
      status: 'under_scrutiny',
      stageName: `Under Scrutiny by ${service.department} Officer`,
      feeAmount: feeInfo.feeRaw || 0,
      paymentStatus: isPaid ? `Paid (${feeInfo.feeAmountFormatted})` : 'Exempt (Nil Fee)',
      paymentMode: isPaid ? (paymentMethod === 'upi' ? 'UPI / QR Code' : paymentMethod === 'card' ? 'Credit / Debit Card' : 'Net Banking (MahaOnline)') : 'Nil',
      transactionId: txId,
      applicationRefNumber: applicationRefNumber,
      appliedDate: dateStr,
      requiredDocs: service.requiredDocTypes.map(d => d.docName),
      submittedDocs: service.requiredDocTypes.map(d => d.docName),
      verifiedDocDetails: service.requiredDocTypes.map(doc => {
        const rec = docRecords[doc.docName];
        return {
          name: doc.docName,
          size: rec?.fileSize || '1.8 MB',
          verifiedAt: `${dateStr} ${timeStr}`,
          docType: `${doc.category} Verification Dossier`
        };
      }),
      statusHistory: [
        {
          title: 'Payment Completed',
          date: pDate,
          stage: 'Payment',
          status: 'completed',
          description: isPaid ? `${feeInfo.feeAmountFormatted} paid via ${paymentMethod.toUpperCase()} (Txn ID: ${txId}).` : 'Statutory service covered under Zero-Fee / Nil regime.'
        },
        {
          title: 'Application Submitted',
          date: `${dateStr}, ${timeStr}`,
          stage: 'Submission',
          status: 'completed',
          description: `Official statutory application dossier lodged for ${service.name}. Single Window CAF ID: ${generatedId}.`
        },
        {
          title: 'Under Scrutiny',
          date: `${dateStr}, In Progress`,
          stage: 'Scrutiny',
          status: 'current',
          description: `Application under active scrutiny by desk officer at ${service.department}. Verification SLA: ${service.sla}.`
        },
        {
          title: 'Query Raised',
          date: 'Only if required',
          stage: 'Query',
          status: 'pending',
          description: 'Department clarification/query will appear here if sought by the reviewing officer.'
        },
        {
          title: 'Inspection',
          date: 'Only if required',
          stage: 'Inspection',
          status: 'pending',
          description: 'Physical/site compliance inspection if mandated under statute.'
        },
        {
          title: 'Approved',
          date: `Target: within SLA (${service.sla})`,
          stage: 'Approval',
          status: 'pending',
          description: 'Final statutory approval by competent authority.'
        },
        {
          title: 'Certificate / License Issued',
          date: 'Post Approval',
          stage: 'Issuance',
          status: 'pending',
          description: 'Digitally signed clearance certificate / license with verification QR code.'
        }
      ],
      queries: []
    };

    setGeneratedApprovalItem(newApproval);
    if (onSubmitApplication) {
      onSubmitApplication(newApproval);
    }

    // Persist submitted application into Supabase PostgreSQL backend
    try {
      const storedToken = sessionStorage.getItem('mahau_session_token');
      if (storedToken) {
        fetch('/api/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          body: JSON.stringify(newApproval)
        }).catch(err => console.warn('Application registration API notice:', err));
      }
    } catch (e) {}
  };

  // When user clicks "Submit Application" inside the Mock Portal:
  // Check if government fee is applicable.
  const handleClickSubmitApplication = () => {
    if (feeInfo.hasFee) {
      // Open Payment Summary page
      setPortalStep('payment_summary');
    } else {
      // Directly submit application if zero fee / Nil
      registerNewSubmittedApproval();
      setPortalStep('submitted_success');
    }
  };

  // Process Mock Payment
  const handleExecutePayment = () => {
    setIsProcessingPayment(true);
    const txId = `TXN-MAHA-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;
    const curDate = new Date().toLocaleString();

    setTimeout(() => {
      setIsProcessingPayment(false);
      setTransactionId(txId);
      setPaymentDate(curDate);
      registerNewSubmittedApproval(txId, curDate);
      setPortalStep('submitted_success');
    }, 1200);
  };

  // Download Payment Receipt
  const handleDownloadPaymentReceipt = () => {
    const receiptContent = `=====================================================
GOVERNMENT OF MAHARASHTRA • SINGLE WINDOW PORTAL
MAHAUDYOGSETU OFFICIAL PAYMENT ACKNOWLEDGMENT RECEIPT
=====================================================

Application Reference No: ${applicationRefNumber}
Transaction ID:          ${transactionId || `TXN-MH-${Math.floor(10000000 + Math.random() * 90000000)}`}
Payment Date:            ${paymentDate || new Date().toLocaleString()}
Payment Status:          SUCCESS (PAID)

Applicant Details:
------------------
Enterprise Name:         ${profile.name}
Authorized Signatory:    ${profile.authorizedPersonName || 'Arya Darshan Shah'}
Entity PAN:              ${profile.pan}
GSTIN:                   ${profile.gstin}

Service & Clearance:
--------------------
Service Name:            ${service.name}
Governing Department:    ${service.department}
Statutory SLA:           ${service.sla}
Amount Paid:             ${feeInfo.feeAmountFormatted}

Payment Gateway:         MahaUdyogSetu Government Treasury Pool (Mock)
Application Status:      Payment Completed -> Application Submitted -> Under Scrutiny

=====================================================
This is a computer-generated digital receipt.
=====================================================`;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = `Receipt_${applicationRefNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Return list of verified documents for the mock official application
  const verifiedDocList = service.requiredDocTypes.map(item => {
    const rec = docRecords[item.docName];
    return {
      name: item.docName,
      category: item.category,
      fileName: rec?.fileName || `${item.docName}.pdf`,
      size: rec?.fileSize || '1.5 MB',
      isVerified: rec?.status === 'verified'
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-300/80 shadow-md p-6 sm:p-8 space-y-6 animate-fadeIn relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn text-xs sm:text-sm font-bold">
          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation / Breadcrumb Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services Available</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Service Code: <strong className="font-mono text-slate-800">{service.code}</strong>
          </span>
        </div>
      </div>

      {/* 1. Header Card: Service Name, Department, SLA & Fees */}
      <div className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
                {service.department}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Single Window Clearance
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {service.name}
            </h1>

            <p className="text-xs text-slate-600 flex items-center gap-1">
              <span>Governing Authority:</span>
              <strong className="text-slate-800">{service.department}, Govt of Maharashtra</strong>
            </p>
          </div>

          {/* SLA & Fee Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center min-w-[120px] shadow-2xs">
              <div className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Statutory SLA</span>
              </div>
              <div className="text-base font-black text-slate-900 mt-0.5">
                {service.sla}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center min-w-[120px] shadow-2xs">
              <div className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                <span>Government Fee</span>
              </div>
              <div className="text-base font-black text-slate-900 mt-0.5">
                {service.fees}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. APPROVAL READINESS ENGINE: CIRCULAR SCORE & DETAILED PRE-SCRUTINY BREAKDOWN */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl text-white p-6 sm:p-7 shadow-xl border border-blue-800/40 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left: Circular Score Gauge & Tagline */}
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke={readinessData.overallScore >= 90 ? '#10b981' : readinessData.overallScore >= 70 ? '#3b82f6' : '#f59e0b'}
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * readinessData.overallScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {readinessData.overallScore}%
                </span>
                <span className="text-[9px] font-bold text-blue-300 uppercase tracking-widest">
                  Score
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  Approval Readiness Engine
                </span>
                <span className="text-xs text-blue-200/70 font-medium hidden sm:inline">•</span>
                <span className="text-[11px] text-blue-200/90 font-medium italic hidden sm:inline">
                  "Don't just apply. Know if you're ready to apply."
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white">
                {readinessData.statusLabel}
              </h2>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                Pre-validation scrutiny across statutory documents, corporate profile cross-verification, and Departmental prerequisites before official CAF lodgement.
              </p>
            </div>
          </div>

          {/* Right: Potential Query Risk Badge */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 flex flex-col justify-between min-w-[210px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-wide">
                Potential Query Risk
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                readinessData.queryRisk === 'LOW' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                  : readinessData.queryRisk === 'MEDIUM' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
              }`}>
                {readinessData.queryRisk} RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">
              {readinessData.queryRisk === 'LOW'
                ? 'High probability of first-pass direct approval with zero department clarification queries.'
                : readinessData.queryRisk === 'MEDIUM'
                  ? 'Moderate risk of location/signatory clarification. Review flagged consistency notices.'
                  : 'High likelihood of objection. Please resolve critical discrepancies before applying.'}
            </p>
          </div>
        </div>

        {/* 5 Key Indicator Bullets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${readinessData.verifiedDocsCount === readinessData.totalRequiredDocs ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold">Documents Verified</div>
              <div className="font-bold text-white text-xs">{totalVerified} / {totalMandatory}</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${readinessData.businessInfoComplete ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold">Business Info</div>
              <div className="font-bold text-white text-xs">{readinessData.businessInfoComplete ? 'Complete ✓' : 'Incomplete'}</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${readinessData.warningIssuesCount > 0 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold">Issues to Review</div>
              <div className="font-bold text-white text-xs">{readinessData.warningIssuesCount} Flagged</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${readinessData.criticalIssuesCount === 0 ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'}`} />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold">Critical Issues</div>
              <div className="font-bold text-white text-xs">{readinessData.criticalIssuesCount} Blockers</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2.5 col-span-2 sm:col-span-1">
            <div className={`w-2.5 h-2.5 rounded-full ${readinessData.prerequisitesComplete ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold">Prerequisites</div>
              <div className="font-bold text-white text-xs">{readinessData.prerequisitesComplete ? 'Satisfied ✓' : 'In Progress'}</div>
            </div>
          </div>
        </div>

        {/* Dynamic Consistency Mismatch Warning Cards */}
        {readinessData.consistencyIssues.filter(i => !i.resolved).length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Smart Consistency Checks: Data Alignment Needed
              </span>
              <span className="text-[10px] text-slate-300 font-normal">
                Cross-checking Profile vs Uploaded Documents
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {readinessData.consistencyIssues.filter(i => !i.resolved).map((issue) => (
                <div 
                  key={issue.id}
                  className="bg-white/95 text-slate-900 rounded-xl p-3.5 border border-amber-300/80 shadow-md space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wide text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {issue.field}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                        {issue.id}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900">
                      {issue.title}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-500 block text-[9px] font-bold">Master Profile:</span>
                        <strong className="text-slate-800 text-[10px] line-clamp-2">{issue.profileValue}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] font-bold">Uploaded Document:</span>
                        <strong className="text-amber-900 text-[10px] line-clamp-2">{issue.documentValue}</strong>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-600 leading-tight">
                      <strong>Impact:</strong> {issue.impact}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[9px] text-slate-500 font-medium truncate">
                      Source: {issue.documentSource}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedReviewIssue(issue)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Review & Fix</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Two Column Layout: Eligibility Criteria & Company Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Eligibility Evaluation */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Statutory Eligibility Assessment</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-500">
              Rule-Engine Checked
            </span>
          </div>

          <div className="space-y-2.5">
            {service.eligibilityCriteria.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                  item.met 
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' 
                    : 'bg-rose-50/50 border-rose-200 text-slate-800'
                }`}
              >
                {item.met ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{item.criterion}</div>
                  <div className="text-[11px] text-slate-600">{item.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pre-Filled Company Application Summary */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Pre-Filled CAF Enterprise Data</span>
            </h3>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Auto-Synchronized
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Enterprise Name</span>
              <div className="font-bold text-slate-900 truncate">{profile.name}</div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">PAN / GSTIN</span>
              <div className="font-mono font-bold text-slate-900">{profile.pan} • {profile.gstin?.slice(0, 10)}...</div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sector & Activity</span>
              <div className="font-bold text-slate-900 truncate">{profile.sector}</div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Investment & Workforce</span>
              <div className="font-bold text-slate-900">₹ {profile.investmentCrores} Cr • {profile.workforce} Staff</div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Location</span>
              <div className="font-medium text-slate-800 truncate">{profile.address}, {profile.district}, {profile.state}</div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Required Documents Dossier */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Required Statutory & Technical Documents Dossier</span>
            </h3>
            <p className="text-xs text-slate-500">
              Upload PDF files (Max 10 MB per document). Every uploaded file stays "Not Verified" until you click Verify Document.
            </p>
          </div>
          
          {/* Dynamic Attached & Verified Counter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
              allDocsVerified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : totalUploaded > 0
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <strong>{totalUploaded} / {totalMandatory}</strong> Attached • <strong>{totalVerified} / {totalMandatory}</strong> Verified
            </span>
          </div>
        </div>

        {/* Prototype Demo Banner */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>AI / System Document Verification:</strong> Document passed system-level verification. Official verification may be required during government submission.
          </span>
        </div>

        {/* Documents Rows */}
        <div className="divide-y divide-slate-100">
          {service.requiredDocTypes.map((item, idx) => {
            const uploadState = uploadStates[item.docName] || { isUploading: false, progress: 0, error: null };
            const record = docRecords[item.docName];
            const state: VerificationState = record ? record.status : 'not_uploaded';

            return (
              <div key={idx} className="py-4 space-y-2.5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  
                  {/* Document Title, Badges & Verification Status */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {item.docName}
                      </span>
                      {item.mandatory ? (
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          *Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200">
                          Optional
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-500 px-1.5 py-0.2 bg-slate-100 rounded">
                        {item.category}
                      </span>

                      {/* Status Badges */}
                      {state === 'not_verified' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>Not Verified</span>
                        </span>
                      )}

                      {state === 'verifying' && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200 animate-pulse">
                          <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
                          <span>Verifying Document...</span>
                        </span>
                      )}

                      {state === 'verified' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>🟢 Verified</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500">
                      {item.description}
                    </p>

                    {/* Show File Details if Uploaded */}
                    {record && (
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 font-mono pt-0.5 flex-wrap">
                        <span className="font-semibold text-blue-700">📄 {record.fileName}</span>
                        <span>•</span>
                        <span>Size: {record.fileSize}</span>
                        <span>•</span>
                        <span>Uploaded: {record.uploadDate}</span>
                        {state === 'verified' ? (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Document Verified Successfully
                            </span>
                          </>
                        ) : (
                          <>
                            <span>•</span>
                            <span className="text-amber-700 font-semibold">
                              Pending Verification
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Verified Result Indicator Box */}
                    {state === 'verified' && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs space-y-1 mt-1.5 animate-fadeIn">
                        <div className="font-bold text-[11px] text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Document Verified Successfully</span>
                        </div>
                        <p className="text-[11px] text-emerald-700">
                          Validated and matched with registered enterprise profile ({profile.name}).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    ref={el => { fileInputRefs.current[item.docName] = el; }}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(item.docName, e.target.files[0]);
                        e.target.value = '';
                      }
                    }}
                  />

                  {/* Action Buttons */}
                  <div className="shrink-0 flex items-center gap-2">
                    {uploadState.isUploading ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading ({uploadState.progress}%)...</span>
                      </div>
                    ) : state === 'not_uploaded' ? (
                      /* 1. NOT UPLOADED: Show ONLY Upload PDF */
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[item.docName]?.click()}
                        className="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload PDF</span>
                      </button>
                    ) : state === 'not_verified' ? (
                      /* 2. NOT VERIFIED: Show Verify Document | View | Replace | Delete */
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => performDocumentVerification(item.docName)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                          title="Verify Document"
                        >
                          <SearchCheck className="w-3.5 h-3.5" />
                          <span>Verify Document</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPreviewDoc({
                            name: item.docName,
                            fileName: record.fileName,
                            size: record.fileSize,
                            uploadDate: record.uploadDate,
                            status: record.status
                          })}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="View Document Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[item.docName]?.click()}
                          className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Replace with new PDF"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                          <span>Replace</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDocToDelete(item.docName)}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Remove Document"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    ) : state === 'verifying' ? (
                      /* 3. VERIFYING: Show Verifying Document... */
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold shadow-xs">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        <span>Verifying Document...</span>
                      </div>
                    ) : (
                      /* 4. VERIFIED: Show 🟢 Verified badge / button + View | Download | Replace | Delete */
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 font-extrabold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>🟢 Verified</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => setPreviewDoc({
                            name: item.docName,
                            fileName: record.fileName,
                            size: record.fileSize,
                            uploadDate: record.uploadDate,
                            status: record.status
                          })}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadDoc(item.docName, record)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Download</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[item.docName]?.click()}
                          className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Replace with new PDF"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                          <span>Replace</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDocToDelete(item.docName)}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Remove Document"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Progress Bar */}
                {uploadState.isUploading && (
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-150"
                      style={{ width: `${uploadState.progress}%` }}
                    />
                  </div>
                )}

                {/* Error Message if Validation Failed */}
                {uploadState.error && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{uploadState.error}</span>
                    <button 
                      onClick={() => setUploadStates(prev => ({ ...prev, [item.docName]: { isUploading: false, progress: 0, error: null } }))}
                      className="ml-auto text-rose-500 hover:text-rose-800 font-bold text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Bottom Action Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer text-center"
        >
          Cancel & Return
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isApplication100Ready ? (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                disabled
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-200 text-slate-400 font-extrabold text-xs cursor-not-allowed flex items-center justify-center gap-2"
                title="All 4 documents must be uploaded and verified to proceed"
              >
                <span>Proceed to Official Application ↗</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleInitiateProceed}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Official Application ↗</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* 1.1 ATTENTION WARNING MODAL: REVIEW BEFORE SUBMITTING */}
      {showAttentionProceedWarningModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-amber-300 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Readiness Attention Required
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {readinessData.overallScore}% Readiness Score • {readinessData.warningIssuesCount + readinessData.criticalIssuesCount} Items Flagged
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
              <p className="font-bold leading-relaxed">
                Your application has items that may require attention before official scrutiny.
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-[11px] text-amber-900">
                {readinessData.consistencyIssues.filter(i => !i.resolved).map(i => (
                  <li key={i.id}>
                    <strong>{i.field}:</strong> {i.title}
                  </li>
                ))}
                {readinessData.criticalIssuesCount > 0 && (
                  <li className="text-rose-700 font-bold">
                    {readinessData.criticalIssuesCount} critical blocker issue(s) detected.
                  </li>
                )}
              </ul>
              <p className="text-[11px] text-amber-800 pt-1">
                Would you like to review and fix these items before continuing to the official portal?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAttentionProceedWarningModal(false);
                  const firstUnresolved = readinessData.consistencyIssues.find(i => !i.resolved);
                  if (firstUnresolved) {
                    setSelectedReviewIssue(firstUnresolved);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Review Issues</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleConfirmProceed}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1.2 SMART CONSISTENCY ISSUE REVIEW & FIX MODAL */}
      {selectedReviewIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  selectedReviewIssue.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedReviewIssue.severity} Notice
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">{selectedReviewIssue.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReviewIssue(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-900">
                {selectedReviewIssue.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Approval Readiness Engine detected a discrepancy between your master profile information and the text scanned in your uploaded documents.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-500">Field Under Review:</span>
                <div className="font-bold text-slate-900">{selectedReviewIssue.field}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Master Profile Value:</span>
                  <span className="text-xs font-semibold text-slate-800">{selectedReviewIssue.profileValue}</span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 block">Scanned Doc Value:</span>
                  <span className="text-xs font-semibold text-amber-950">{selectedReviewIssue.documentValue}</span>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-600">
                <strong className="text-slate-800">Scanned Document:</strong> {selectedReviewIssue.documentSource}
              </div>
            </div>

            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Recommended Remediation:</span>
              </div>
              <p className="text-[11px] text-blue-900 leading-relaxed">
                {selectedReviewIssue.remediationAdvice}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReviewIssue(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => handleFixIssueInline(selectedReviewIssue.id)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Auto-Align & Fix</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. CONFIRMATION MODAL: READY TO PROCEED? */}
      {showProceedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Ready to Proceed?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your required documents have been uploaded and verified. Do you want to continue to the official application?
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Service Name:</span>
                <strong className="text-slate-900 truncate max-w-[200px]">{service.name}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Enterprise:</span>
                <strong className="text-slate-900 truncate max-w-[200px]">{profile.name}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Verified Dossiers:</span>
                <strong className="text-emerald-700">{totalVerified} / {totalMandatory} Complete ✓</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowProceedModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmProceed}
                className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Proceed ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MOCK OFFICIAL APPLICATION / PAYMENT / CONFIRMATION MODAL */}
      {showMockOfficialPortal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-3xl w-full max-h-[94vh] flex flex-col overflow-hidden my-auto">
            
            {/* Government Portal Header */}
            <div className="bg-[#0f172a] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-white to-green-600 p-0.5 shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center text-[10px] font-black text-amber-400">
                    MH
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      Official Government Single Window Portal • Maharashtra
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-black text-white mt-0.5">
                    {service.officialPortalName || `${service.department} Online LMS`}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowMockOfficialPortal(false);
                  setPortalStep('application_form');
                }}
                className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer p-1.5 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Step Navigation Progress Indicator */}
            <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
              <div className={`flex items-center gap-1.5 ${portalStep === 'application_form' ? 'text-blue-700 font-black' : 'text-slate-700'}`}>
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Application Details</span>
              </div>
              <span>→</span>
              <div className={`flex items-center gap-1.5 ${portalStep === 'payment_summary' || portalStep === 'payment_gateway' ? 'text-blue-700 font-black' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${portalStep === 'payment_summary' || portalStep === 'payment_gateway' ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'}`}>2</span>
                <span>Fee Payment {feeInfo.hasFee ? `(${feeInfo.feeAmountFormatted})` : '(Nil)'}</span>
              </div>
              <span>→</span>
              <div className={`flex items-center gap-1.5 ${portalStep === 'submitted_success' ? 'text-emerald-700 font-black' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${portalStep === 'submitted_success' ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>3</span>
                <span>Official Acknowledgment</span>
              </div>
            </div>

            {/* Portal Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* =========================================================================
                  STEP 1: APPLICATION FORM & VERIFIED DOSSIERS
                 ========================================================================= */}
              {portalStep === 'application_form' && (
                <>
                  {/* Status Banner */}
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-blue-950">
                          Application Status: <span className="text-blue-700 uppercase font-black tracking-wide">Ready for Submission</span>
                        </div>
                        <div className="text-[11px] text-blue-700">
                          Pre-filled & verified from MahaUdyogSetu Common Application Form (CAF)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Application Ref</span>
                      <strong className="font-mono text-slate-900 text-xs">{applicationRefNumber}</strong>
                    </div>
                  </div>

                  {/* Service & Statutory Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service / Application Name</span>
                      <h3 className="font-extrabold text-sm text-slate-900">{service.name}</h3>
                      <div className="text-[11px] text-slate-600">
                        Department: <strong className="text-slate-800">{service.department}</strong>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Service Code: <strong className="font-mono text-slate-800">{service.code}</strong>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Statutory SLA & Fee</span>
                      <div className="flex items-center justify-between pt-1">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 block">Statutory Processing SLA:</span>
                          <strong className="text-sm font-bold text-slate-900 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>{service.sla}</span>
                          </strong>
                        </div>
                        <div className="space-y-0.5 text-right">
                          <span className="text-[10px] text-slate-500 block">Government Fee:</span>
                          <strong className="text-sm font-bold text-emerald-700 flex items-center gap-1 justify-end">
                            <IndianRupee className="w-3.5 h-3.5" />
                            <span>{service.fees}</span>
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company & Applicant Details */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>Company & Applicant Details</span>
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        KYC Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Company / Enterprise</span>
                        <strong className="text-slate-900 block truncate">{profile.name}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Applicant / Signatory</span>
                        <strong className="text-slate-900 block truncate">{profile.authorizedPersonName || 'Arya Darshan Shah'}</strong>
                        <span className="text-[10px] text-slate-500">{profile.authorizedPersonDesignation || 'Managing Director'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Entity PAN & GSTIN</span>
                        <strong className="font-mono text-slate-900 block">{profile.pan} • {profile.gstin?.slice(0, 8)}...</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Mobile & Email</span>
                        <span className="text-slate-800 block">{profile.mobile} • {profile.email}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Plant Location</span>
                        <span className="text-slate-800 block truncate">{profile.address}, {profile.district}, {profile.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attached Verified Documents Dossier */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Attached Verified Statutory Documents ({verifiedDocList.length})</span>
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-700">
                        100% Verified ✓
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {verifiedDocList.map((doc, dIdx) => (
                        <div key={dIdx} className="py-2.5 flex items-center justify-between gap-3">
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="font-bold text-slate-900 truncate">{doc.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                              <span>📄 {doc.fileName}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span className="text-slate-600">{doc.category}</span>
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* =========================================================================
                  STEP 2: PAYMENT SUMMARY PAGE (If fee is applicable)
                 ========================================================================= */}
              {portalStep === 'payment_summary' && (
                <div className="space-y-5 animate-fadeIn max-w-xl mx-auto">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      Government Application Payment Summary
                    </h3>
                    <p className="text-xs text-slate-500">
                      Review statutory fee calculation before proceeding to the government payment gateway.
                    </p>
                  </div>

                  {/* Payment Breakdown Card */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                    <div className="flex justify-between pb-2.5 border-b border-slate-200">
                      <span className="text-slate-500">Service / Application:</span>
                      <strong className="text-slate-900 text-right max-w-[280px]">{service.name}</strong>
                    </div>

                    <div className="flex justify-between pb-2.5 border-b border-slate-200">
                      <span className="text-slate-500">Applicant / Company:</span>
                      <strong className="text-slate-900 text-right">{profile.name}</strong>
                    </div>

                    <div className="flex justify-between pb-2.5 border-b border-slate-200">
                      <span className="text-slate-500">Application Reference No:</span>
                      <strong className="font-mono text-blue-700 font-bold">{applicationRefNumber}</strong>
                    </div>

                    <div className="flex justify-between pb-2.5 border-b border-slate-200">
                      <span className="text-slate-500">Statutory Department Fee:</span>
                      <span className="text-slate-900 font-semibold">{feeInfo.feeAmountFormatted}</span>
                    </div>

                    <div className="flex justify-between pb-2.5 border-b border-slate-200">
                      <span className="text-slate-500">Processing & Portal Charges:</span>
                      <span className="text-emerald-700 font-bold">₹ 0 (Waived under Single Window Act)</span>
                    </div>

                    <div className="flex justify-between pt-1 text-sm font-black bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-slate-900">Total Amount Payable:</span>
                      <span className="text-emerald-700 text-base">{feeInfo.feeAmountFormatted}</span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-[11px] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Transactions are secured via 256-bit encryption. (Mock/Demo payment flow enabled for prototype).</span>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STEP 3: SECURE PAYMENT GATEWAY UI (UPI, Card, Net Banking)
                 ========================================================================= */}
              {portalStep === 'payment_gateway' && (
                <div className="space-y-5 animate-fadeIn max-w-xl mx-auto">
                  <div className="text-center space-y-1">
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold border border-amber-200">
                      Demo Mock Payment Gateway
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      Select Payment Method
                    </h3>
                    <p className="text-xs text-slate-500">
                      Amount Payable: <strong className="text-emerald-700 font-black">{feeInfo.feeAmountFormatted}</strong>
                    </p>
                  </div>

                  {/* Payment Tabs: UPI, Card, NetBanking */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'upi' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>UPI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'card' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Cards</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'netbanking' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Net Banking</span>
                    </button>
                  </div>

                  {/* Method Content */}
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
                    {paymentMethod === 'upi' && (
                      <div className="space-y-3">
                        <label className="block text-[11px] font-bold text-slate-700">Enter Virtual Payment Address (VPA / UPI ID)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. mobile@upi or username@okbank"
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          <span className="px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs flex items-center">
                            Verified ✓
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Supports Google Pay, PhonePe, BHIM, Paytm and all Indian banks.</p>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Card Number</label>
                          <input
                            type="text"
                            defaultValue="4532 •••• •••• 8921"
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry</label>
                            <input
                              type="text"
                              defaultValue="12/29"
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CVV</label>
                            <input
                              type="password"
                              defaultValue="888"
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'netbanking' && (
                      <div className="space-y-3">
                        <label className="block text-[11px] font-bold text-slate-700">Select Popular Indian Bank</label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Bank of Maharashtra', 'Bank of Baroda'].map((bank, bIdx) => (
                            <label key={bIdx} className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="bank" defaultChecked={bIdx === 0} />
                              <span className="font-semibold text-slate-800">{bank}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STEP 4: SUBMITTED SUCCESS & PAYMENT ACKNOWLEDGMENT
                 ========================================================================= */}
              {portalStep === 'submitted_success' && (
                <div className="py-6 px-4 text-center space-y-6 animate-fadeIn max-w-xl mx-auto">
                  
                  {/* Green Success Badge */}
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-300 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Payment Successful</span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black text-slate-900">
                      Application Submitted Successfully
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Your clearance application for <strong>{service.name}</strong> has been received by <strong>{service.department}</strong> and assigned for officer scrutiny.
                    </p>
                  </div>

                  {/* Lifecycle Status Stepper: Payment Completed -> Application Submitted -> Under Scrutiny */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Application Scrutiny Lifecycle</span>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Payment Completed</span>
                      </div>
                      <span className="text-slate-300">➔</span>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Application Submitted</span>
                      </div>
                      <span className="text-slate-300">➔</span>
                      <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span>Under Scrutiny</span>
                      </div>
                    </div>
                  </div>

                  {/* Official Transaction & Application Receipt Card */}
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs font-medium shadow-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold">Payment Status:</span>
                      <strong className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Payment Successful</span>
                      </strong>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold">Transaction ID:</span>
                      <strong className="font-mono text-slate-900 font-bold">
                        {transactionId || generatedApprovalItem?.transactionId || `TXN-MH-2026-948217`}
                      </strong>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold">Amount Paid:</span>
                      <strong className="text-emerald-700 font-extrabold text-sm">
                        {feeInfo.hasFee ? feeInfo.feeAmountFormatted : '₹ 0 (Nil / Fee Exempt)'}
                      </strong>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold">Payment Date:</span>
                      <strong className="text-slate-800 font-semibold">
                        {paymentDate || generatedApprovalItem?.appliedDate || new Date().toLocaleString()}
                      </strong>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold">Application ID:</span>
                      <strong className="font-mono text-blue-700 font-extrabold text-sm">
                        {generatedApprovalItem?.id || applicationRefNumber}
                      </strong>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold">Service Name:</span>
                      <strong className="text-slate-900 font-bold max-w-[280px] sm:max-w-xs text-right">
                        {service.name}
                      </strong>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold">Department:</span>
                      <strong className="text-slate-900 font-bold">{service.department}</strong>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-500 font-semibold">Current Status:</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span>Under Scrutiny</span>
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: View Application | Download Receipt | Go to Applications */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMockOfficialPortal(false);
                        setPortalStep('application_form');
                        if (generatedApprovalItem && onViewApplicationDetails) {
                          onViewApplicationDetails(generatedApprovalItem);
                        } else if (onViewApplicationStatus) {
                          onViewApplicationStatus();
                        } else {
                          onBack();
                        }
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Application</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadPaymentReceipt}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Download Receipt</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowMockOfficialPortal(false);
                        setPortalStep('application_form');
                        if (onViewApplicationStatus) {
                          onViewApplicationStatus();
                        } else {
                          onBack();
                        }
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Go to Applications</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Mock Portal Action Footer */}
            {portalStep === 'application_form' && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowMockOfficialPortal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Close & Return
                </button>

                <button
                  type="button"
                  onClick={handleClickSubmitApplication}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </button>
              </div>
            )}

            {portalStep === 'payment_summary' && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPortalStep('application_form')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Back to Details
                </button>

                <button
                  type="button"
                  onClick={() => setPortalStep('payment_gateway')}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment ({feeInfo.feeAmountFormatted})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {portalStep === 'payment_gateway' && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPortalStep('payment_summary')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Back to Summary
                </button>

                <button
                  type="button"
                  onClick={handleExecutePayment}
                  disabled={isProcessingPayment}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Secure Payment...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Pay {feeInfo.feeAmountFormatted} Now</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 3. DELETE CONFIRMATION MODAL */}
      {docToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Delete Document?
              </h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>"{docToDelete}"</strong>? You can upload it again later.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEW DOCUMENT DETAILS MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {previewDoc.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Document Metadata */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">File Name:</span>
                <strong className="text-slate-900 font-mono truncate max-w-[240px]">{previewDoc.fileName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">File Size:</span>
                <strong className="text-slate-900">{previewDoc.size}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Upload Date:</span>
                <strong className="text-slate-900">{previewDoc.uploadDate}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Status:</span>
                <strong className={previewDoc.status === 'verified' ? 'text-emerald-700' : 'text-amber-700'}>
                  {previewDoc.status === 'verified' ? 'VERIFIED' : 'NOT VERIFIED'}
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
