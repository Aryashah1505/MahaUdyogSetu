import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  Plus, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Paperclip, 
  ChevronRight,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface QueryViewProps {
  profile: BusinessProfile;
  onBackToDashboard?: () => void;
}

interface QueryRecord {
  id: string;
  subject: string;
  department: string;
  serviceRelated: string;
  description: string;
  attachmentName?: string;
  dateRaised: string;
  status: 'Submitted' | 'Under Department Review' | 'Answered' | 'Closed';
  officerResponse?: string;
}

export const QueryView: React.FC<QueryViewProps> = ({
  profile,
  onBackToDashboard
}) => {
  const [showRaiseModal, setShowRaiseModal] = useState<boolean>(false);
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('Labour Department');
  const [serviceRelated, setServiceRelated] = useState('Registration under Shops & Establishments Act');
  const [description, setDescription] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [selectedQueryDetail, setSelectedQueryDetail] = useState<QueryRecord | null>(null);

  const [queries, setQueries] = useState<QueryRecord[]>([
    {
      id: 'QRY-MH-2026-1049',
      subject: 'Clarification on Online Form F Certificate Issuance SLA',
      department: 'Labour Department',
      serviceRelated: 'Registration of Establishments under Shops and Establishments Act, 2017',
      description: 'Our application reference SWC/LAB/2026/0094821 is under scrutiny. We would like to confirm if the QR-coded registration certificate is digitally generated immediately post-scrutiny under 1-day RTS SLA.',
      dateRaised: '26/09/2026, 02:15 PM',
      status: 'Answered',
      officerResponse: 'Yes, under Maharashtra Right to Public Services Act (RTS Act), upon completion of online verification by the Area Labour Officer, the QR-coded Form F certificate is automatically signed and made available for instant download in your Applications dossier.'
    },
    {
      id: 'QRY-MH-2026-0914',
      subject: 'Validity Period for MPCB Consent to Establish (CTE) for Orange Category',
      department: 'Maharashtra Pollution Control Board (MPCB)',
      serviceRelated: 'Consent to Establish (CTE) under Water and Air Acts',
      description: 'Requesting confirmation on whether CTE is issued with 5 years validity for industrial machinery installation.',
      dateRaised: '22/09/2026, 11:40 AM',
      status: 'Closed',
      officerResponse: 'Consent to Establish (CTE) for Orange Category manufacturing units is typically issued for a standard validity period of 5 years or until commissioning of commercial production, whichever is earlier.'
    }
  ]);

  const handleRaiseQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newQuery: QueryRecord = {
        id: `QRY-MH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: subject.trim(),
        department,
        serviceRelated,
        description: description.trim(),
        attachmentName: attachmentFile ? attachmentFile.name : undefined,
        dateRaised: `${new Date().toLocaleDateString('en-GB')}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        status: 'Submitted'
      };

      setQueries([newQuery, ...queries]);
      setIsSubmitting(false);
      setShowRaiseModal(false);
      setSubject('');
      setDescription('');
      setAttachmentFile(null);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1b3d] via-[#122b5e] to-[#0b1b3d] text-white p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-blue-400" />
              <span>Department Query & Clarification Portal</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
              Single Window Helpdesk
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Investor Query & Department Clarifications</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Raise technical or procedural queries directly with reviewing department desk officers. Track ticket status and official answers in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowRaiseModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Raise New Query</span>
          </button>

          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all cursor-pointer"
            >
              ← Dashboard
            </button>
          )}
        </div>
      </div>

      {submitSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your query ticket has been submitted to the department officer. An official notification has been dispatched.</span>
        </div>
      )}

      {/* 2. Queries Table & Records */}
      <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm text-slate-900">Registered Query Tickets ({queries.length})</h3>
            <p className="text-[11px] text-slate-500">Official log of queries raised for {profile.name}.</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f4fc] text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Query ID</th>
                <th className="py-3 px-3.5">Subject & Service</th>
                <th className="py-3 px-3.5">Department</th>
                <th className="py-3 px-3.5">Date Raised</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {queries.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="py-3.5 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {q.id}
                  </td>
                  <td className="py-3.5 px-3.5 max-w-sm">
                    <div className="font-bold text-slate-900 leading-snug">{q.subject}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{q.serviceRelated}</div>
                  </td>
                  <td className="py-3.5 px-3.5 text-slate-700 font-semibold">
                    {q.department}
                  </td>
                  <td className="py-3.5 px-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                    {q.dateRaised}
                  </td>
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      q.status === 'Answered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      q.status === 'Submitted' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {q.status === 'Answered' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      <span>{q.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedQueryDetail(q)}
                      className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                    >
                      <span>View Ticket</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MODAL: RAISE NEW QUERY */}
      {showRaiseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900">Raise Department Query</h3>
              <button onClick={() => setShowRaiseModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleRaiseQuery} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Governing Department *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Labour Department">Labour Department</option>
                  <option value="Maharashtra Pollution Control Board">Maharashtra Pollution Control Board (MPCB)</option>
                  <option value="Directorate of Industrial Safety & Health">Directorate of Industrial Safety & Health (DISH)</option>
                  <option value="Energy Department (MSEDCL)">Energy Department (MSEDCL)</option>
                  <option value="Directorate of Industries">Directorate of Industries</option>
                  <option value="MIDC Special Planning Authority">MIDC Special Planning Authority</option>
                  <option value="Directorate of Boilers">Directorate of Boilers</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject / Query Title *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inquiry regarding document verification timeline..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Related Service / Application</label>
                <input
                  type="text"
                  value={serviceRelated}
                  onChange={(e) => setServiceRelated(e.target.value)}
                  placeholder="e.g. Registration of Establishments"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Query Description *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please specify your query, reference numbers, or procedural clarifications in detail..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Optional Attachment (PDF / Image)</label>
                <input
                  type="file"
                  onChange={(e) => e.target.files && setAttachmentFile(e.target.files[0])}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRaiseModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Query Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: QUERY DETAILS & OFFICER RESPONSE */}
      {selectedQueryDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-700 font-bold">{selectedQueryDetail.id}</span>
                <h3 className="text-base font-black text-slate-900">{selectedQueryDetail.subject}</h3>
              </div>
              <button onClick={() => setSelectedQueryDetail(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Department & Service</div>
                <div className="font-bold text-slate-900">{selectedQueryDetail.department}</div>
                <div className="text-slate-600 text-[11px]">{selectedQueryDetail.serviceRelated}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Applicant Inquiry</div>
                <p className="text-slate-700 leading-relaxed">{selectedQueryDetail.description}</p>
                <div className="text-[10px] text-slate-400 pt-1">Raised: {selectedQueryDetail.dateRaised}</div>
              </div>

              {selectedQueryDetail.officerResponse ? (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 space-y-1 text-emerald-950">
                  <div className="text-[10px] font-extrabold text-emerald-800 uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official Department Answer</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">{selectedQueryDetail.officerResponse}</p>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                  Query is assigned to desk officer. SLA turnaround for query response: 24 to 48 hours.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedQueryDetail(null)}
                className="px-5 py-2 rounded-lg bg-slate-800 text-white font-bold text-xs"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
