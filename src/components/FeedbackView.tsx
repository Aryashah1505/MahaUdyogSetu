import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle2, 
  User, 
  Building2, 
  Clock, 
  ThumbsUp, 
  Award,
  Sparkles
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface FeedbackViewProps {
  profile: BusinessProfile;
  onBackToDashboard?: () => void;
}

interface FeedbackItem {
  id: string;
  rating: number;
  category: string;
  serviceName: string;
  comments: string;
  submittedDate: string;
  status: 'Published' | 'Reviewed by Department';
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  profile,
  onBackToDashboard
}) => {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<string>('Portal Usability & Ease of Access');
  const [serviceName, setServiceName] = useState<string>('Labour Department - Shops & Establishments Registration');
  const [comments, setComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([
    {
      id: 'FB-MH-2026-8812',
      rating: 5,
      category: 'Single Window Scrutiny & SLA Turnaround',
      serviceName: 'Registration of Establishments under Shops & Establishments Act',
      comments: 'Seamless online submission process with instant receipt generation. Document OCR verification correctly extracted company registration details without duplicate manual entry.',
      submittedDate: '26/09/2026, 11:30 AM',
      status: 'Reviewed by Department'
    },
    {
      id: 'FB-MH-2026-7419',
      rating: 4,
      category: 'Document Vault Experience',
      serviceName: 'Single Source Master Document Repository',
      comments: 'Very helpful feature to store common incorporation & PAN records once and reuse across MPCB and DISH clearance applications.',
      submittedDate: '24/09/2026, 04:15 PM',
      status: 'Reviewed by Department'
    }
  ]);

  // Load live feedback records from backend database
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveFeedback() {
      try {
        const token = 
          sessionStorage.getItem('mahau_session_token') || 
          localStorage.getItem('mahau_session_token') || 
          sessionStorage.getItem('mahau_auth_token') || 
          localStorage.getItem('mahau_auth_token');
        if (!token) return;
        const res = await fetch('/api/feedback', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.feedback && Array.isArray(data.feedback) && data.feedback.length > 0 && isMounted) {
            const mapped: FeedbackItem[] = data.feedback.map((f: any) => ({
              id: f.id,
              rating: f.rating || 5,
              category: f.feedbackType || f.feedback_type || 'Portal Usability & Ease of Access',
              serviceName: f.relatedModule || f.related_module || 'Single Window System',
              comments: f.feedbackText || f.feedback_text || f.comments || '',
              submittedDate: new Date(f.createdAt || f.created_at || Date.now()).toLocaleDateString('en-GB'),
              status: f.status === 'addressed' ? 'Reviewed by Department' : 'Published'
            }));
            setFeedbackList(prev => [...mapped, ...prev.filter(p => !mapped.some(m => m.id === p.id))]);
          }
        }
      } catch (err) {
        console.warn('Live feedback fetch notice:', err);
      }
    }
    fetchLiveFeedback();
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) return;

    setIsSubmitting(true);
    const generatedId = `FB-MH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newFeedback: FeedbackItem = {
      id: generatedId,
      rating,
      category,
      serviceName: serviceName || 'Single Window Services',
      comments: comments.trim(),
      submittedDate: `${new Date().toLocaleDateString('en-GB')}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Reviewed by Department'
    };

    // Post to Supabase backend API
    const token = 
      sessionStorage.getItem('mahau_session_token') || 
      localStorage.getItem('mahau_session_token') || 
      sessionStorage.getItem('mahau_auth_token') || 
      localStorage.getItem('mahau_auth_token');

    if (token) {
      fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          feedbackType: category,
          relatedModule: serviceName || 'Single Window System',
          feedbackText: comments.trim()
        })
      }).catch(err => console.warn('Submit feedback notice:', err));
    }

    setTimeout(() => {
      setFeedbackList([newFeedback, ...feedbackList]);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setComments('');
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
              <MessageSquare className="w-3 h-3 text-blue-400" />
              <span>Investor Feedback Mechanism</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
              Government of Maharashtra
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Investor Experience & Service Feedback</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Help improve Maharashtra Single Window Clearance services. Submit your feedback, rating, and procedural suggestions directly to the Industries Department.
          </p>
        </div>

        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* 2. Feedback Form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="font-black text-sm text-slate-900">Submit Service Feedback</h3>
            <p className="text-[11px] text-slate-500">Rate your experience with statutory approval workflows.</p>
          </div>

          {submitSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your feedback has been recorded and submitted to the review desk.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {/* Star Rating */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Overall Satisfaction Rating *</label>
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= rating 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-slate-300'
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-slate-700">
                  {rating === 5 ? 'Excellent (5/5)' : rating === 4 ? 'Good (4/5)' : rating === 3 ? 'Average (3/5)' : 'Needs Improvement'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Feedback Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Portal Usability & Ease of Access">Portal Usability & Ease of Access</option>
                <option value="Single Window Scrutiny & SLA Turnaround">Single Window Scrutiny & SLA Turnaround</option>
                <option value="Document Vault Experience">Document Vault Experience</option>
                <option value="Department Officer Clarifications / Queries">Department Officer Clarifications / Queries</option>
                <option value="Payment Gateway & GRAS Challan">Payment Gateway & GRAS Challan</option>
                <option value="Other Suggestions">Other Suggestions</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Related Service / Clearance</label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. Consent to Establish / Factory Licence"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Detailed Comments & Suggestions *</label>
              <textarea
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Describe your experience, turnaround time, or any areas for simplification..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting Feedback...' : 'Submit Feedback'}</span>
            </button>
          </form>
        </div>

        {/* 3. Previously Submitted Feedbacks List */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-300/80 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-900">Submitted Feedback Log ({feedbackList.length})</h3>
              <p className="text-[11px] text-slate-500">History of comments and ratings provided by your enterprise.</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Active Feedback Loop
            </span>
          </div>

          <div className="space-y-3">
            {feedbackList.map((fb) => (
              <div key={fb.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-3.5 h-3.5 ${
                            s <= fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                          }`} 
                        />
                      ))}
                      <span className="text-[10px] font-mono text-slate-500 ml-2 font-bold">{fb.id}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">{fb.category}</h4>
                    <p className="text-[10px] text-blue-700 font-semibold">{fb.serviceName}</p>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 shrink-0">
                    {fb.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                  "{fb.comments}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Submitted on: {fb.submittedDate}</span>
                  <span>Enterprise: {profile.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
