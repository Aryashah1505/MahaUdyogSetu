import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeedbackHeader, FeedbackFooter } from './FeedbackHeader';
import { 
  getStoredFeedback, 
  saveStoredFeedback, 
  generateFeedbackId, 
  FeedbackRecord 
} from '../../data/feedbackStore';
import { BusinessProfile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Star, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  ThumbsUp, 
  AlertTriangle, 
  Lightbulb, 
  MessageSquare, 
  ShieldCheck, 
  FileText, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  ChevronRight, 
  ExternalLink,
  Info,
  Layers,
  Search,
  Reply,
  CornerDownRight
} from 'lucide-react';

interface FeedbackPageProps {
  profile?: BusinessProfile;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Active Tab: 'form' | 'history'
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  // Stored Records
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>(() => getStoredFeedback());
  const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);

  // Load feedback from Backend API on mount
  const fetchFeedback = async () => {
    setIsLoadingFeedback(true);
    try {
      const token = 
        sessionStorage.getItem('mahau_session_token') || 
        localStorage.getItem('mahau_session_token') || 
        sessionStorage.getItem('mahau_auth_token') || 
        localStorage.getItem('mahau_auth_token');
      const response = await fetch('/api/feedback', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.feedback)) {
          setFeedbackList(data.feedback);
          saveStoredFeedback(data.feedback);
          return;
        }
      }
      setFeedbackList(getStoredFeedback());
    } catch (e) {
      setFeedbackList(getStoredFeedback());
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Form State
  const [feedbackType, setFeedbackType] = useState<FeedbackRecord['feedbackType']>('Overall Experience');
  const [relatedModule, setRelatedModule] = useState<FeedbackRecord['relatedModule']>('Applications');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [applicationRef, setApplicationRef] = useState<string>('');
  const [name, setName] = useState<string>(profile?.name || '');
  const [mobile, setMobile] = useState<string>(profile?.mobile || '');
  const [email, setEmail] = useState<string>(profile?.email || '');

  // Validation & Submission State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRecord, setSubmittedRecord] = useState<FeedbackRecord | null>(null);

  // Selected Detail Modal / View for History
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRecord | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isReplying, setIsReplying] = useState<boolean>(false);

  // Quick feedback card selections
  const handleQuickCardSelect = (type: 'well' | 'improved' | 'idea') => {
    setActiveTab('form');
    setSubmittedRecord(null);
    if (type === 'well') {
      setFeedbackType('Overall Experience');
      setRating(5);
      if (!message) setMessage('I had a smooth experience with ');
    } else if (type === 'improved') {
      setFeedbackType('Application Process');
      setRating(2);
      if (!message) setMessage('I encountered difficulties while ');
    } else if (type === 'idea') {
      setFeedbackType('Other');
      setRating(4);
      if (!message) setMessage('I suggest adding a feature to ');
    }
  };

  const getRatingLabel = (score: number) => {
    switch (score) {
      case 1: return '1 — Very Poor';
      case 2: return '2 — Poor';
      case 3: return '3 — Average';
      case 4: return '4 — Good';
      case 5: return '5 — Excellent';
      default: return '';
    }
  };

  const getRatingEmoji = (score: number) => {
    switch (score) {
      case 1: return '😡';
      case 2: return '🙁';
      case 3: return '😐';
      case 4: return '🙂';
      case 5: return '😍';
      default: return '⭐';
    }
  };

  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!message.trim()) {
      errs.message = t('feedback.messagePlaceholder', 'Please enter your feedback message or suggestion.');
    } else if (message.trim().length < 10) {
      errs.message = t('val.messageMinLength', 'Feedback message must be at least 10 characters long.');
    }

    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      errs.email = t('val.enterValidEmail', 'Please provide a valid email address.');
    }

    if (mobile.trim() && !/^[0-9+ ]{10,14}$/.test(mobile.trim())) {
      errs.mobile = t('val.enterValidMobile', 'Please enter a valid 10-digit mobile number.');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const token = 
        sessionStorage.getItem('mahau_session_token') || 
        localStorage.getItem('mahau_session_token') || 
        sessionStorage.getItem('mahau_auth_token') || 
        localStorage.getItem('mahau_auth_token');
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          feedbackType,
          relatedModule,
          rating,
          message: message.trim(),
          applicationRef: applicationRef.trim() || undefined,
          name: name.trim() || undefined,
          mobile: mobile.trim() || undefined,
          email: email.trim() || undefined
        })
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.feedback) {
        const newRecord: FeedbackRecord = resData.feedback;
        const updated = [newRecord, ...feedbackList];
        setFeedbackList(updated);
        saveStoredFeedback(updated);
        setSubmittedRecord(newRecord);
      } else {
        // Fallback
        const newId = generateFeedbackId();
        const fallbackRecord: FeedbackRecord = {
          id: newId,
          date: new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          feedbackType,
          relatedModule,
          rating,
          message: message.trim(),
          applicationRef: applicationRef.trim() || undefined,
          name: name.trim() || undefined,
          mobile: mobile.trim() || undefined,
          email: email.trim() || undefined,
          status: 'Submitted'
        };
        const updated = [fallbackRecord, ...feedbackList];
        setFeedbackList(updated);
        saveStoredFeedback(updated);
        setSubmittedRecord(fallbackRecord);
      }
    } catch (err) {
      const newId = generateFeedbackId();
      const fallbackRecord: FeedbackRecord = {
        id: newId,
        date: new Date().toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        feedbackType,
        relatedModule,
        rating,
        message: message.trim(),
        applicationRef: applicationRef.trim() || undefined,
        name: name.trim() || undefined,
        mobile: mobile.trim() || undefined,
        email: email.trim() || undefined,
        status: 'Submitted'
      };
      const updated = [fallbackRecord, ...feedbackList];
      setFeedbackList(updated);
      saveStoredFeedback(updated);
      setSubmittedRecord(fallbackRecord);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setMessage('');
    setApplicationRef('');
    setRating(5);
    setFeedbackType('Overall Experience');
    setRelatedModule('Applications');
    setErrors({});
    setSubmittedRecord(null);
  };

  const handleAddReply = async (recordId: string) => {
    if (!replyText.trim()) return;
    setIsReplying(true);

    try {
      const token = 
        sessionStorage.getItem('mahau_session_token') || 
        localStorage.getItem('mahau_session_token') || 
        sessionStorage.getItem('mahau_auth_token') || 
        localStorage.getItem('mahau_auth_token');
      const response = await fetch(`/api/feedback/${encodeURIComponent(recordId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          replyText: replyText.trim()
        })
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.feedback) {
          const updatedRecord = resData.feedback;
          const updated = feedbackList.map(item => item.id === recordId ? updatedRecord : item);
          setFeedbackList(updated);
          saveStoredFeedback(updated);
          setSelectedFeedback(updatedRecord);
          setReplyText('');
          return;
        }
      }

      // Fallback
      const updated = feedbackList.map(item => {
        if (item.id === recordId) {
          const currentReplies = item.replies || [];
          return {
            ...item,
            status: item.status === 'Submitted' ? 'Under Review' : item.status,
            replies: [
              ...currentReplies,
              {
                sender: 'user' as const,
                message: replyText.trim(),
                date: new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            ]
          };
        }
        return item;
      });
      setFeedbackList(updated);
      saveStoredFeedback(updated);
      const target = updated.find(i => i.id === recordId) || null;
      setSelectedFeedback(target);
      setReplyText('');
    } catch (e) {
      // ignore
    } finally {
      setIsReplying(false);
    }
  };

  const getStatusBadge = (status: FeedbackRecord['status']) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>{t('status.submitted', 'Submitted')}</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{t('status.underReview', 'Under Review')}</span>
          </span>
        );
      case 'Responded':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{t('status.responded', 'Responded')}</span>
          </span>
        );
      case 'Closed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-slate-500" />
            <span>{t('status.closed', 'Closed')}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      
      {/* Universal MahaUdyogSetu Header */}
      <FeedbackHeader
        title="Feedback & Experience"
        subtitle="Help us improve your industrial approval experience."
        profile={profile}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSubmittedRecord(null);
        }}
        feedbackCount={feedbackList.length}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate('/services-provided')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold border border-blue-200">
              MahaUdyogSetu Quality Framework
            </span>
            <span>• Direct Escalation to Single Window Cell</span>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Investor & Citizen Voice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Feedback & Experience
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Help us improve your industrial approval experience. Your reviews directly impact policy, platform usability, and turnaround SLAs.
          </p>
        </div>

        {/* QUICK FEEDBACK CARDS (Always visible above the form when on 'form' tab) */}
        {activeTab === 'form' && !submittedRecord && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => handleQuickCardSelect('well')}
              className="p-5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  😊
                </div>
                <ThumbsUp className="w-4 h-4 text-emerald-600 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-950">
                What went well?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Quickly mention a feature, fast clearance, or helpful team you appreciated.
              </p>
            </button>

            <button
              onClick={() => handleQuickCardSelect('improved')}
              className="p-5 rounded-2xl bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 shadow-xs transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  ⚠️
                </div>
                <AlertTriangle className="w-4 h-4 text-amber-600 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-950">
                What can be improved?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Report bottlenecks, document confusion, or approval delays you encountered.
              </p>
            </button>

            <button
              onClick={() => handleQuickCardSelect('idea')}
              className="p-5 rounded-2xl bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 shadow-xs transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  💡
                </div>
                <Lightbulb className="w-4 h-4 text-purple-600 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-purple-950">
                Suggest an idea
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Propose a new automated feature, integration, or compliance tool for Maharashtra.
              </p>
            </button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: FEEDBACK FORM / SUCCESS SCREEN
           ========================================================================= */}
        {activeTab === 'form' && (
          <>
            {submittedRecord ? (
              /* SUCCESS SCREEN / CARD */
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs text-center max-w-2xl mx-auto animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h2 className="text-2xl font-black text-slate-900">
                  Thank You for Your Feedback!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Your feedback has been recorded successfully and routed to the Maharashtra Industry Bridge continuous improvement team.
                </p>

                {/* Feedback Reference ID Card */}
                <div className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Feedback Reference ID
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-blue-700 tracking-tight mt-1">
                    {submittedRecord.id}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-600">
                    <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 font-semibold">
                      Type: {submittedRecord.feedbackType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 font-semibold">
                      Module: {submittedRecord.relatedModule}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {submittedRecord.rating}/5
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('history');
                      setSelectedFeedback(submittedRecord);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View My Feedback</span>
                  </button>

                  <button
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Submit Another Feedback</span>
                  </button>

                  <button
                    onClick={() => navigate('/services-provided')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Dashboard</span>
                  </button>
                </div>
              </div>
            ) : (
              /* MAIN FEEDBACK FORM CARD */
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Row 1: Feedback Type & Related Module */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* 1. Feedback Type */}
                    <div>
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5">
                        1. Feedback Type <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value as FeedbackRecord['feedbackType'])}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="Overall Experience">Overall Experience</option>
                        <option value="Application Process">Application Process</option>
                        <option value="Document Verification">Document Verification</option>
                        <option value="Approval/Permission Process">Approval/Permission Process</option>
                        <option value="Dashboard">Dashboard</option>
                        <option value="Investor Services">Investor Services</option>
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* 2. Service/Module */}
                    <div>
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5">
                        2. Service / Module <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={relatedModule}
                        onChange={(e) => setRelatedModule(e.target.value as FeedbackRecord['relatedModule'])}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="Applications">Applications</option>
                        <option value="Services Provided">Services Provided</option>
                        <option value="Document Repository">Document Repository</option>
                        <option value="Business Profile">Business Profile</option>
                        <option value="Investor Wizard">Investor Wizard</option>
                        <option value="Public Dashboard">Public Dashboard</option>
                        <option value="Grievance">Grievance</option>
                        <option value="Query">Query</option>
                        <option value="Permission Verification">Permission Verification</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                  </div>

                  {/* 3. Interactive Star Rating */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5">
                      3. Rating <span className="text-rose-500">*</span>
                    </label>

                    <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      {/* Star buttons */}
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((starVal) => {
                          const isFilled = (hoverRating || rating) >= starVal;
                          return (
                            <button
                              key={starVal}
                              type="button"
                              onClick={() => setRating(starVal)}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="p-1 rounded-lg transition-transform hover:scale-125 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                              title={`${starVal} Star`}
                              aria-label={`Rate ${starVal} out of 5 stars`}
                            >
                              <Star
                                className={`w-8 h-8 transition-colors ${
                                  isFilled
                                    ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                                    : 'text-slate-300 fill-slate-100 hover:text-amber-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Score Label & Emoji */}
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        <span className="text-lg">{getRatingEmoji(hoverRating || rating)}</span>
                        <span className="text-xs font-black text-slate-800">
                          {getRatingLabel(hoverRating || rating)}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* 4. Feedback Message */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                        4. Feedback Message <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {message.length} characters (min 10)
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                      }}
                      placeholder="Tell us about your experience or suggestion in detail..."
                      className={`w-full p-3.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:ring-2 focus:border-transparent outline-none transition-all ${
                        errors.message ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* 5. Optional Application Reference */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5">
                      5. Application / Reference Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={applicationRef}
                        onChange={(e) => setApplicationRef(e.target.value)}
                        placeholder="e.g. APP-MPCB-2026-8812, DOC-REP-MH-994, etc."
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Providing your application reference helps the clearance cell audit the exact transaction logs.
                    </p>
                  </div>

                  {/* 6. Contact Information (Optional) */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                        6. Contact Information <span className="text-slate-400 font-normal">(Optional for Follow-Up)</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Prefilled from your active business profile</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Name / Business
                        </label>
                        <div className="relative">
                          <User className="w-3.5 h-3.5 absolute left-3 top-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 absolute left-3 top-3.5 text-slate-400" />
                          <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => {
                              setMobile(e.target.value);
                              if (errors.mobile) setErrors(prev => ({ ...prev, mobile: '' }));
                            }}
                            placeholder="10-digit mobile"
                            className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:ring-2 outline-none ${
                              errors.mobile ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'
                            }`}
                          />
                        </div>
                        {errors.mobile && (
                          <span className="text-[10px] text-rose-600 mt-0.5 block">{errors.mobile}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 absolute left-3 top-3.5 text-slate-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                            }}
                            placeholder="you@company.com"
                            className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:ring-2 outline-none ${
                              errors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <span className="text-[10px] text-rose-600 mt-0.5 block">{errors.email}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submission Row */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Feedback is audited by the Maharashtra Industrial Quality Board</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        disabled={isSubmitting}
                        className="px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer w-1/2 sm:w-auto text-center"
                      >
                        Reset
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-1/2 sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting Feedback...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Feedback</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </form>

              </div>
            )}
          </>
        )}

        {/* =========================================================================
            TAB 2: FEEDBACK HISTORY (MY FEEDBACK)
           ========================================================================= */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            
            {/* Top Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Submitted</span>
                <div className="text-xl font-black text-slate-900 mt-0.5">{feedbackList.length}</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Responded</span>
                <div className="text-xl font-black text-emerald-700 mt-0.5">
                  {feedbackList.filter(f => f.status === 'Responded').length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Under Review</span>
                <div className="text-xl font-black text-amber-700 mt-0.5">
                  {feedbackList.filter(f => f.status === 'Under Review' || f.status === 'Submitted').length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Average Given</span>
                <div className="text-xl font-black text-blue-700 mt-0.5">
                  {feedbackList.length > 0 
                    ? (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length).toFixed(1)
                    : '0.0'
                  } / 5
                </div>
              </div>
            </div>

            {/* List / Detail Split */}
            {selectedFeedback ? (
              /* DETAILED VIEW OF SINGLE FEEDBACK */
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to All Feedbacks</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    {getStatusBadge(selectedFeedback.status)}
                  </div>
                </div>

                {/* Feedback Meta Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Feedback ID</span>
                    <span className="text-xs font-black text-slate-800">{selectedFeedback.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Submitted Date</span>
                    <span className="text-xs font-semibold text-slate-700">{selectedFeedback.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Rating</span>
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {selectedFeedback.rating} / 5 ({getRatingLabel(selectedFeedback.rating)})
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      Type: {selectedFeedback.feedbackType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      Module: {selectedFeedback.relatedModule}
                    </span>
                    {selectedFeedback.applicationRef && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        Ref: {selectedFeedback.applicationRef}
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Feedback Message
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      "{selectedFeedback.message}"
                    </p>
                  </div>
                </div>

                {/* Department Response Section */}
                {selectedFeedback.departmentResponse && (
                  <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                          MH
                        </div>
                        <span className="text-xs font-black text-emerald-950">
                          Department of Industries Response
                        </span>
                      </div>
                      {selectedFeedback.responseDate && (
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          Responded on {selectedFeedback.responseDate}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-900 pl-8 leading-relaxed font-medium">
                      {selectedFeedback.departmentResponse}
                    </p>
                  </div>
                )}

                {/* Additional Replies Thread if any */}
                {selectedFeedback.replies && selectedFeedback.replies.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Correspondence History ({selectedFeedback.replies.length})</span>
                    </h4>

                    <div className="space-y-2 pl-2 border-l-2 border-slate-200">
                      {selectedFeedback.replies.map((reply, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3.5 rounded-xl border text-xs ${
                            reply.sender === 'user' 
                              ? 'bg-blue-50/50 border-blue-200 ml-4' 
                              : 'bg-emerald-50/40 border-emerald-200 mr-4'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800">
                              {reply.sender === 'user' ? 'Your Reply' : 'Department Desk'}
                            </span>
                            <span className="text-[10px] text-slate-400">{reply.date}</span>
                          </div>
                          <p className="text-slate-700 font-medium">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply / Add More Information Form */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-black text-slate-800 mb-2 flex items-center gap-1.5">
                    <Reply className="w-3.5 h-3.5 text-blue-600" />
                    <span>Reply / Add More Information</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type additional details or response to department..."
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddReply(selectedFeedback.id)}
                      disabled={!replyText.trim() || isReplying}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {isReplying ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* LIST OF FEEDBACKS IN CARD / TABLE FORMAT */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                    Submitted Feedback Log ({feedbackList.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('form')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                  >
                    <span>+ Submit New Feedback</span>
                  </button>
                </div>

                {feedbackList.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-800">No Feedback Submitted Yet</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      Your submitted ratings, reviews, and suggestions will appear here with live resolution status.
                    </p>
                    <button
                      onClick={() => setActiveTab('form')}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                    >
                      Submit Feedback
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3.5">
                    {feedbackList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedFeedback(item)}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                              {item.id}
                            </span>
                            {getStatusBadge(item.status)}
                            <span className="text-[10px] text-slate-400">• {item.date}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {item.feedbackType}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                              {item.relatedModule}
                            </span>
                            {item.applicationRef && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700">
                                Ref: {item.applicationRef}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-1">
                            "{item.message}"
                          </p>
                        </div>

                        {/* Right: Rating and Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{item.rating}/5</span>
                          </div>

                          <span className="text-[11px] font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                            <span>View Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </main>

      {/* Modern GovTech Footer */}
      <FeedbackFooter />

    </div>
  );
};
