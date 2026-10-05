import React, { useState } from 'react';
import { 
  AlertCircle, 
  Send, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldAlert, 
  Scale, 
  Landmark, 
  ChevronRight,
  X,
  Building2
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface GrievanceViewProps {
  profile: BusinessProfile;
  onBackToDashboard?: () => void;
}

interface GrievanceRecord {
  id: string;
  grievanceSubject: string;
  department: string;
  actOrService: string;
  description: string;
  submittedDate: string;
  status: 'Submitted' | 'Under Review' | 'Action Taken' | 'Resolved';
  actionTakenDetails?: string;
  rtsEscalationLevel: 'Level 1 (Nodal Officer)' | 'Level 2 (First Appellate Authority)' | 'Level 3 (Right to Services Commission)';
}

export const GrievanceView: React.FC<GrievanceViewProps> = ({
  profile,
  onBackToDashboard
}) => {
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('Labour Department');
  const [actOrService, setActOrService] = useState('Delay in RTS SLA for Form F Registration');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceRecord | null>(null);

  const [grievances, setGrievances] = useState<GrievanceRecord[]>([
    {
      id: 'GRV-RTS-2026-0041',
      grievanceSubject: 'Procedural Delay in Statutory Scrutiny Turnaround',
      department: 'Directorate of Industrial Safety and Health (DISH)',
      actOrService: 'Maharashtra Right to Public Services Act (RTS Act, 2015) - Factory Plan Approval',
      description: 'Factory layout blueprints submitted for Unit 1 expansion. Requesting expedited disposal within the notified 20-day RTS time limit.',
      submittedDate: '23/09/2026, 10:05 AM',
      status: 'Action Taken',
      actionTakenDetails: 'Joint Director of Industrial Safety reviewed the application. Technical scrutiny finalized and plan approval docket released to applicant.',
      rtsEscalationLevel: 'Level 1 (Nodal Officer)'
    }
  ]);

  // Load live grievances from backend API
  React.useEffect(() => {
    let isMounted = true;
    async function fetchLiveGrievances() {
      try {
        const token = 
          sessionStorage.getItem('mahau_session_token') || 
          localStorage.getItem('mahau_session_token') || 
          sessionStorage.getItem('mahau_auth_token') || 
          localStorage.getItem('mahau_auth_token');
        if (!token) return;

        const res = await fetch('/api/grievances', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.grievances && Array.isArray(data.grievances) && data.grievances.length > 0 && isMounted) {
            const mapped: GrievanceRecord[] = data.grievances
              .filter((g: any) => g.type !== 'query')
              .map((g: any) => ({
                id: g.id,
                grievanceSubject: g.subject || g.grievanceSubject || 'Statutory Clearance Inquiry',
                department: g.department || 'Industries Department',
                actOrService: g.serviceRelated || g.service_related || 'Single Window Services',
                description: g.description || '',
                submittedDate: new Date(g.createdAt || g.created_at || Date.now()).toLocaleDateString('en-GB'),
                status: (g.status === 'Resolved' ? 'Resolved' : g.status === 'In Progress' ? 'Action Taken' : 'Submitted') as any,
                actionTakenDetails: g.resolutionNotes || g.resolution_notes || undefined,
                rtsEscalationLevel: 'Level 1 (Nodal Officer)'
              }));
            if (mapped.length > 0) {
              setGrievances(prev => [...mapped, ...prev.filter(p => !mapped.some(m => m.id === p.id))]);
            }
          }
        }
      } catch (err) {
        console.warn('Live grievance fetch notice:', err);
      }
    }
    fetchLiveGrievances();
    return () => { isMounted = false; };
  }, []);

  const handleRegisterGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const generatedId = `GRV-RTS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrv: GrievanceRecord = {
      id: generatedId,
      grievanceSubject: subject.trim(),
      department,
      actOrService,
      description: description.trim(),
      submittedDate: `${new Date().toLocaleDateString('en-GB')}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Submitted',
      rtsEscalationLevel: 'Level 1 (Nodal Officer)'
    };

    // Post to backend database
    const token = 
      sessionStorage.getItem('mahau_session_token') || 
      localStorage.getItem('mahau_session_token') || 
      sessionStorage.getItem('mahau_auth_token') || 
      localStorage.getItem('mahau_auth_token');

    if (token) {
      fetch('/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'grievance',
          subject: subject.trim(),
          department,
          serviceRelated: actOrService,
          description: description.trim(),
          rtsEscalationLevel: 'Level 1 (Nodal Officer)'
        })
      }).catch(err => console.warn('Submit grievance notice:', err));
    }

    setTimeout(() => {
      setGrievances([newGrv, ...grievances]);
      setIsSubmitting(false);
      setShowRegisterModal(false);
      setSubject('');
      setDescription('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#7c1d1d] via-[#991b1b] to-[#7c1d1d] text-white p-5 sm:p-6 rounded-2xl border border-rose-900 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-400/20 text-rose-200 border border-rose-400/40 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-300" />
              <span>Maharashtra Right to Services (RTS) Commission</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
              Statutory Redressal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Investor Grievance Redressal Portal</span>
          </h1>
          <p className="text-xs text-rose-100 max-w-xl">
            Register statutory service grievances under the Maharashtra Right to Public Services Act (RTS Act, 2015). Guaranteed time-bound appeal and resolution mechanism.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-rose-900 hover:bg-rose-50 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Grievance</span>
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
          <span>Grievance ticket lodged successfully under RTS Act. Nodal appellate officer notified.</span>
        </div>
      )}

      {/* 2. Registered Grievances List */}
      <div className="bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm text-slate-900">Active & Resolved Grievances ({grievances.length})</h3>
            <p className="text-[11px] text-slate-500">Official log of statutory grievances lodged for {profile.name}.</p>
          </div>
          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            Toll-Free RTS Helpline: 1800-120-8040
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f4fc] text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Grievance ID</th>
                <th className="py-3 px-3.5">Subject & Cause</th>
                <th className="py-3 px-3.5">Department</th>
                <th className="py-3 px-3.5">Escalation Level</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {grievances.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="py-3.5 px-3.5 font-mono font-bold text-rose-700 whitespace-nowrap">
                    {g.id}
                  </td>
                  <td className="py-3.5 px-3.5 max-w-sm">
                    <div className="font-bold text-slate-900 leading-snug">{g.grievanceSubject}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{g.actOrService}</div>
                  </td>
                  <td className="py-3.5 px-3.5 text-slate-700 font-semibold">
                    {g.department}
                  </td>
                  <td className="py-3.5 px-3.5 text-slate-600 text-[11px] whitespace-nowrap font-medium">
                    {g.rtsEscalationLevel}
                  </td>
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      g.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      g.status === 'Action Taken' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      g.status === 'Under Review' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {g.status === 'Resolved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      <span>{g.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedGrievance(g)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs inline-flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MODAL: REGISTER GRIEVANCE */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900">Lodge Statutory RTS Grievance</h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleRegisterGrievance} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Department *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Labour Department">Labour Department</option>
                  <option value="Maharashtra Pollution Control Board">Maharashtra Pollution Control Board (MPCB)</option>
                  <option value="Directorate of Industrial Safety and Health (DISH)">Directorate of Industrial Safety & Health (DISH)</option>
                  <option value="Energy Department / MSEDCL">Energy Department / MSEDCL</option>
                  <option value="MIDC Special Planning Authority">MIDC Special Planning Authority</option>
                  <option value="Maharashtra Fire Services">Maharashtra Fire Services</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Grievance Subject / Breach of SLA *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Statutory SLA breach in application processing..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Application Reference No. / Service Name</label>
                <input
                  type="text"
                  value={actOrService}
                  onChange={(e) => setActOrService(e.target.value)}
                  placeholder="e.g. SWC/LAB/2026/0094821"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Statement of Grievance *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="State the facts of the delay, officer actions, or procedural violation..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  {isSubmitting ? 'Registering...' : 'Lodge Grievance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: GRIEVANCE BREAKDOWN */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-rose-700 font-bold">{selectedGrievance.id}</span>
                <h3 className="text-base font-black text-slate-900">{selectedGrievance.grievanceSubject}</h3>
              </div>
              <button onClick={() => setSelectedGrievance(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Department & Escalation</div>
                <div className="font-bold text-slate-900">{selectedGrievance.department}</div>
                <div className="text-slate-600 text-[11px]">{selectedGrievance.actOrService} • {selectedGrievance.rtsEscalationLevel}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Statement of Facts</div>
                <p className="text-slate-700 leading-relaxed">{selectedGrievance.description}</p>
                <div className="text-[10px] text-slate-400 pt-1">Lodged: {selectedGrievance.submittedDate}</div>
              </div>

              {selectedGrievance.actionTakenDetails && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 space-y-1 text-emerald-950">
                  <div className="text-[10px] font-extrabold text-emerald-800 uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Appellate Authority Action Taken</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">{selectedGrievance.actionTakenDetails}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedGrievance(null)}
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
