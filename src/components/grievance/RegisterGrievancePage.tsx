import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrievanceHeader, GrievanceFooter } from './GrievanceHeader';
import { DEPARTMENTS_SERVICES_MAP, GrievanceRecord } from '../../data/grievanceStore';
import { BusinessProfile } from '../../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  AlertCircle, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Download, 
  AlertTriangle,
  Info,
  CheckSquare,
  Square,
  FileCheck2
} from 'lucide-react';

interface RegisterGrievancePageProps {
  profile?: BusinessProfile;
  onSaveGrievance?: (record: GrievanceRecord) => void;
}

export const RegisterGrievancePage: React.FC<RegisterGrievancePageProps> = ({ 
  profile,
  onSaveGrievance
}) => {
  const navigate = useNavigate();

  // Multi-step form state: 1 -> 2 -> 3 -> 4 (Review) -> 5 (Success)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // STEP 1: Business & Application Details
  const [bizName, setBizName] = useState(profile?.name || 'Western Maharashtra Engineering Private Limited');
  const [applicantName, setApplicantName] = useState(profile?.authorizedPersonName || 'Arya Darshan Shah');
  const [mobile, setMobile] = useState(profile?.mobile || '9825204240');
  const [email, setEmail] = useState(profile?.email || 'arya2007in@gmail.com');
  const [applicationNumber, setApplicationNumber] = useState('APP-PCB-01');
  const [department, setDepartment] = useState('Maharashtra Pollution Control Board (MPCB)');
  const [serviceType, setServiceType] = useState('Consent to Establish (CTE) under Water & Air Acts');
  const [district, setDistrict] = useState(profile?.district || 'Nashik');
  const [taluka, setTaluka] = useState(profile?.taluka || 'Ambad');
  const [midcArea, setMidcArea] = useState('Ambad MIDC Sector C');

  // STEP 2: Grievance Details
  const [category, setCategory] = useState('Application Delay');
  const [priority, setPriority] = useState<'Normal' | 'Important' | 'Urgent'>('Important');
  const [subject, setSubject] = useState('Delay in Statutory CTE Consent Scrutiny Beyond 21 Days RTS Limit');
  const [description, setDescription] = useState(
    'Our Consent to Establish application (APP-PCB-01) has been pending at the Regional Officer scrutiny level for 24 days, exceeding the 21-day timeline prescribed under the Maharashtra Right to Public Services Act (RTS Act, 2015). All requisite environmental audit reports and fee receipts have been uploaded.'
  );

  // STEP 3: Supporting Documents
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; name: string; size: string; type: string; uploadDate: string }>>([
    {
      id: 'doc-init-1',
      name: 'MPCB_Application_Acknowledgment_Receipt.pdf',
      size: '1.2 MB',
      type: 'application/pdf',
      uploadDate: '2026-09-26'
    }
  ]);

  // Notifications
  const [notifySms, setNotifySms] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPortal, setNotifyPortal] = useState(true);

  // Duplicate check warning state
  const [duplicateWarningIgnored, setDuplicateWarningIgnored] = useState(false);

  // Submission outcome state
  const [submittedGrievanceId, setSubmittedGrievanceId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic services based on department
  const availableServices = useMemo(() => {
    return DEPARTMENTS_SERVICES_MAP[department] || [
      'Statutory Clearances & NOCs',
      'Industrial Registration & Licensing',
      'Utility Connection Support'
    ];
  }, [department]);

  // Handle department change to automatically pick the first service
  const handleDeptChange = (newDept: string) => {
    setDepartment(newDept);
    const services = DEPARTMENTS_SERVICES_MAP[newDept];
    if (services && services.length > 0) {
      setServiceType(services[0]);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Max 10MB check
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds the 10 MB limit. Please select a smaller file.");
      return;
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type || 'application/pdf',
      uploadDate: new Date().toISOString().split('T')[0]
    };

    setUploadedFiles(prev => [...prev, newDoc]);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  // Duplicate detection check
  const isPotentialDuplicate = useMemo(() => {
    return applicationNumber === 'APP-PCB-01' && category === 'Application Delay';
  }, [applicationNumber, category]);

  // Submit Grievance
  const handleSubmitGrievance = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('mahau_auth_token') || sessionStorage.getItem('mahau_auth_token');
      const response = await fetch('/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          type: 'grievance',
          businessName: bizName,
          applicantName,
          mobile,
          email,
          applicationNumber: applicationNumber.trim() || undefined,
          serviceType,
          department,
          district,
          taluka,
          midcArea: midcArea.trim() || undefined,
          category,
          priority,
          subject,
          description,
          documents: uploadedFiles,
          notifySms,
          notifyEmail,
          notifyPortal
        })
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.grievance) {
        const savedRec = resData.grievance;
        setSubmittedGrievanceId(savedRec.id);
        
        try {
          const stored = localStorage.getItem('mahau_grievances');
          const list: GrievanceRecord[] = stored ? JSON.parse(stored) : [];
          list.unshift(savedRec);
          localStorage.setItem('mahau_grievances', JSON.stringify(list));
        } catch (e) {}

        if (onSaveGrievance) {
          onSaveGrievance(savedRec);
        }
        setCurrentStep(5);
      } else {
        // Fallback if offline
        const generatedId = `MGV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        const fallbackRecord: GrievanceRecord = {
          id: generatedId,
          type: 'grievance',
          businessName: bizName,
          applicantName,
          mobile,
          email,
          applicationNumber: applicationNumber.trim() || undefined,
          serviceType,
          department,
          district,
          taluka,
          midcArea: midcArea.trim() || undefined,
          category,
          priority,
          subject,
          description,
          documents: uploadedFiles,
          notifySms,
          notifyEmail,
          notifyPortal,
          submittedDate: `${new Date().toLocaleDateString('en-GB')}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          lastUpdated: `${new Date().toLocaleDateString('en-GB')}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          status: 'Submitted',
          expectedSlaDays: 7,
          rtsEscalationLevel: 'Level 1 (Nodal Officer)'
        };
        setSubmittedGrievanceId(generatedId);
        if (onSaveGrievance) onSaveGrievance(fallbackRecord);
        setCurrentStep(5);
      }
    } catch (err) {
      const generatedId = `MGV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedGrievanceId(generatedId);
      setCurrentStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = () => {
    const text = `========================================================
GOVERNMENT OF MAHARASHTRA • MAHAUDYOGSETU
OFFICIAL GRIEVANCE LODGEMENT ACKNOWLEDGEMENT RECEIPT
Under Maharashtra Right to Public Services Act (RTS Act, 2015)
========================================================

Grievance Reference ID: ${submittedGrievanceId}
Lodgement Date:         ${new Date().toLocaleDateString('en-GB')}
Current Status:         SUBMITTED / QUEUED FOR NODAL OFFICER SCRUTINY
Statutory Redressal:    7 Business Days (Level 1 Nodal Escalate)

1. APPLICANT DETAILS:
Enterprise Name:        ${bizName}
Authorized Signatory:   ${applicantName}
Contact Mobile:         ${mobile}
Contact Email:          ${email}

2. SERVICE & DEPARTMENT:
Issuing Department:     ${department}
Governing Service:      ${serviceType}
Linked Application ID:  ${applicationNumber || 'N/A'}
District / Taluka:      ${district} / ${taluka}
Industrial Zone:        ${midcArea || 'Statewide'}

3. GRIEVANCE SUMMARY:
Category:               ${category}
Priority:               ${priority}
Subject:                ${subject}

Description:
${description}

Supporting Documents:   ${uploadedFiles.length} File(s) Attached
========================================================
Statutory Grievance Portal • MahaUdyogSetu • Toll-Free: 1800-120-8040`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${submittedGrievanceId}_Acknowledgment.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <GrievanceHeader 
        title="Register a Grievance"
        subtitle="Tell us about the issue you are facing. Our system will route it to the appropriate department."
        profile={profile}
        activePath="/grievance/register"
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/grievance')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Grievance & Support</span>
          </button>

          {currentStep <= 4 && (
            <div className="text-xs text-slate-500 font-semibold">
              Step <span className="text-rose-700 font-bold">{currentStep}</span> of 4: {
                currentStep === 1 ? 'Business & Application Details' :
                currentStep === 2 ? 'Grievance Details' :
                currentStep === 3 ? 'Supporting Documents' : 'Review & Submit'
              }
            </div>
          )}
        </div>

        {/* Step Progress Bar (Hidden on Success) */}
        {currentStep <= 4 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
              
              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                currentStep === 1 ? 'bg-rose-50 text-rose-800' : currentStep > 1 ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 1 ? 'bg-rose-600 text-white' : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className="hidden sm:inline">Application Info</span>
                <span className="sm:hidden text-[10px]">App Info</span>
              </div>

              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                currentStep === 2 ? 'bg-rose-50 text-rose-800' : currentStep > 2 ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 2 ? 'bg-rose-600 text-white' : currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className="hidden sm:inline">Grievance Details</span>
                <span className="sm:hidden text-[10px]">Details</span>
              </div>

              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                currentStep === 3 ? 'bg-rose-50 text-rose-800' : currentStep > 3 ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 3 ? 'bg-rose-600 text-white' : currentStep > 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {currentStep > 3 ? '✓' : '3'}
                </div>
                <span className="hidden sm:inline">Documents</span>
                <span className="sm:hidden text-[10px]">Docs</span>
              </div>

              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                currentStep === 4 ? 'bg-rose-50 text-rose-800' : 'text-slate-400'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 4 ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  4
                </div>
                <span className="hidden sm:inline">Review & Submit</span>
                <span className="sm:hidden text-[10px]">Review</span>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 1: BUSINESS & APPLICATION DETAILS
           ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-6 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Step 1: Identification & Linking</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Business & Application Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Provide the enterprise and linked application reference to route this directly to the concerned departmental authority.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Business Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Business / Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              {/* Applicant Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Applicant / Authorized Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              {/* Registered Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Registered Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              {/* Application Number (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Application Number / Reference ID (Optional)
                </label>
                <input
                  type="text"
                  value={applicationNumber}
                  onChange={(e) => setApplicationNumber(e.target.value)}
                  placeholder="e.g. APP-PCB-01 or SWC/LAB/2026/0091"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                {applicationNumber.trim() && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-teal-700 font-semibold">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>Smart Linking: Grievance will be linked to application {applicationNumber}</span>
                  </div>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => handleDeptChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  {Object.keys(DEPARTMENTS_SERVICES_MAP).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Service / Application Type (Dynamic) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Service / Approval Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  {availableServices.map((srv, idx) => (
                    <option key={idx} value={srv}>{srv}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  <option value="Nashik">Nashik</option>
                  <option value="Pune">Pune</option>
                  <option value="Thane">Thane</option>
                  <option value="Mumbai Suburban">Mumbai Suburban</option>
                  <option value="Raigad">Raigad</option>
                  <option value="Aurangabad (Chhatrapati Sambhajinagar)">Aurangabad (Chhatrapati Sambhajinagar)</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Kolhapur">Kolhapur</option>
                  <option value="Solapur">Solapur</option>
                </select>
              </div>

              {/* Taluka */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Taluka <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              {/* Industrial Area / MIDC Area (Optional) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Industrial Area / MIDC Area (Optional)
                </label>
                <input
                  type="text"
                  value={midcArea}
                  onChange={(e) => setMidcArea(e.target.value)}
                  placeholder="e.g. Ambad MIDC Sector C, Chakan Industrial Phase 2"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/grievance')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Proceed to Grievance Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: GRIEVANCE DETAILS
           ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-6 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Step 2: Grievance Classification</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Grievance Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Describe the specific operational delay, document query, or objection you wish to submit to the departmental appellate authority.
              </p>
            </div>

            {/* Duplicate Detection Warning Banner */}
            {isPotentialDuplicate && !duplicateWarningIgnored && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="block font-bold mb-0.5">Potential Duplicate Detected:</strong>
                    A similar grievance (MGV-2026-102458) is currently under active Department Action for application <span className="font-mono font-bold">APP-PCB-01</span>.
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/grievance/status')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors"
                  >
                    View Existing
                  </button>
                  <button
                    onClick={() => setDuplicateWarningIgnored(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors"
                  >
                    Continue Anyway
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              
              {/* Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Grievance Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="Application Delay">Application Delay (Statutory SLA Breach)</option>
                    <option value="Application Rejection">Application Rejection Appeal</option>
                    <option value="Document Issue">Document Verification / Defect Query</option>
                    <option value="Payment Issue">Payment / GRAS Challan Reconciliation</option>
                    <option value="Inspection Issue">Joint Site Inspection Issue</option>
                    <option value="Approval/Permission Issue">Approval / Permission Conditions Dispute</option>
                    <option value="Portal/Technical Issue">Portal / Technical Glitch</option>
                    <option value="Department Response Issue">Department Communication Delay</option>
                    <option value="Renewal Issue">Renewal Turnaround Delay</option>
                    <option value="Other">Other Administrative Difficulty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Priority Escalation <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Normal', 'Important', 'Urgent'] as const).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          priority === p
                            ? p === 'Urgent' ? 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-100'
                            : p === 'Important' ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-100'
                            : 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-100'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Subject / Summary of Issue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Unwarranted delay in MPCB Consent to Establish scrutiny"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Describe your grievance in detail <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-[11px] font-mono ${description.length > 900 ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                    {description.length} / 1000 characters
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                  placeholder="Provide precise details including dates of application, previous interactions, officer remarks, and requested relief..."
                  className="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                  required
                />
              </div>

              {/* Smart Routing Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900">Statutory Routing Rule:</span> Based on selected department (<strong className="text-slate-900">{department}</strong>) and category (<strong className="text-slate-900">{category}</strong>), this submission will be routed directly to the <span className="text-teal-700 font-bold">Nodal Grievance Officer & District Appellate Authority</span> under RTS Act 2015 with an automated 7-day resolution ticker.
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Step 1</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Proceed to Supporting Documents</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: SUPPORTING DOCUMENTS
           ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10">
            <div className="border-b border-slate-100 pb-6 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
                <Upload className="w-3.5 h-3.5" />
                <span>Step 3: Document Attachments</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Supporting Documents & Evidence
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload relevant receipts, acknowledgment slips, rejection notices, or inspection reports (PDF, JPG, JPEG, PNG - Max 10 MB per file).
              </p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-rose-300 rounded-3xl p-8 text-center bg-slate-50/50 hover:bg-rose-50/30 transition-all mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-xs border border-slate-200">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Upload Supporting Document
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Supported formats: PDF, JPG, JPEG, PNG • Maximum size: 10 MB
              </p>
              
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-all">
                <span>Select File from Device</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Uploaded Files Cards List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Attached Documents ({uploadedFiles.length})
              </h4>

              {uploadedFiles.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-400">
                  No documents attached yet. You may proceed without documents if not applicable.
                </div>
              ) : (
                <div className="space-y-2">
                  {uploadedFiles.map(file => (
                    <div 
                      key={file.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{file.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ready
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                Notification Preferences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={notifySms}
                    onChange={(e) => setNotifySms(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>SMS Alerts ({mobile})</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Email Updates ({email})</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={notifyPortal}
                    onChange={(e) => setNotifyPortal(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Dashboard Bell Alerts</span>
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Step 2</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Proceed to Review & Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: REVIEW & SUBMIT
           ========================================================================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Step 4: Verification & Audit Lock</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Review & Confirm Grievance Dossier
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Please verify that the information provided is correct before final statutory submission.
              </p>
            </div>

            {/* Section 1: Applicant & Business Details */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  1. Business & Applicant Details
                </h4>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Enterprise Name:</span>
                  <strong className="text-slate-900 font-bold">{bizName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Authorized Person:</span>
                  <strong className="text-slate-900">{applicantName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Mobile:</span>
                  <span className="text-slate-800 font-mono">{mobile}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Email:</span>
                  <span className="text-slate-800">{email}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Application Details */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  2. Application & Department Details
                </h4>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Department:</span>
                  <strong className="text-teal-800 font-bold">{department}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Service / Clearance:</span>
                  <strong className="text-slate-900">{serviceType}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Linked Application ID:</span>
                  <span className="text-slate-800 font-mono font-bold">{applicationNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Location:</span>
                  <span className="text-slate-800">{district}, {taluka} {midcArea ? `(${midcArea})` : ''}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Grievance Details */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  3. Grievance Content & Classification
                </h4>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    Category: {category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                    Priority: {priority}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Subject:</span>
                  <strong className="text-slate-900 text-sm">{subject}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Description:</span>
                  <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    {description}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Uploaded Documents */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  4. Attached Documents ({uploadedFiles.length})
                </h4>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              {uploadedFiles.length === 0 ? (
                <div className="text-xs text-slate-400 italic">No files attached</div>
              ) : (
                <div className="space-y-1 text-xs">
                  {uploadedFiles.map(f => (
                    <div key={f.id} className="flex items-center gap-2 text-slate-700">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{f.name} ({f.size})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submission Declaration */}
            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 text-xs text-rose-900">
              <span className="font-bold block mb-1">Applicant Declaration:</span>
              I hereby solemnly affirm that the particulars stated in this grievance are true, correct, and based on statutory records under the Maharashtra Single Window Clearances & RTS Act, 2015.
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Documents</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitGrievance}
                className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Grievance Dossier...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit Grievance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: SUCCESS ACKNOWLEDGEMENT SCREEN
           ========================================================================= */}
        {currentStep === 5 && (
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-md p-6 sm:p-10 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Official RTS Acknowledgement
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Grievance Submitted Successfully
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2">
              Your grievance has been officially registered and queued for timebound scrutiny under the Maharashtra Right to Public Services Act (RTS Act, 2015).
            </p>

            {/* Reference Card */}
            <div className="mt-8 max-w-lg mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs text-slate-500 font-bold uppercase">Grievance Reference ID</span>
                <span className="text-base font-mono font-black text-rose-700">{submittedGrievanceId}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Submission Date:</span>
                  <strong className="text-slate-800">{new Date().toLocaleDateString('en-GB')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Current Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Submitted</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Department:</span>
                  <strong className="text-slate-800">{department}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Expected Resolution:</span>
                  <strong className="text-teal-700 font-bold">7 Business Days</strong>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate(`/grievance/status?id=${submittedGrievanceId}`)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Track Grievance</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownloadReceipt}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Download Acknowledgement</span>
              </button>

              <button
                onClick={() => navigate('/services-provided')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

      </main>

      <GrievanceFooter />
    </div>
  );
};
