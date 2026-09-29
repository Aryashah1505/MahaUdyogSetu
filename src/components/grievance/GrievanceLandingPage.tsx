import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GrievanceHeader, GrievanceFooter } from './GrievanceHeader';
import { 
  HelpCircle, 
  AlertCircle, 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Sparkles,
  Building2,
  FileText,
  BadgeAlert,
  ArrowLeft
} from 'lucide-react';
import { BusinessProfile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface GrievanceLandingPageProps {
  profile?: BusinessProfile;
}

export const GrievanceLandingPage: React.FC<GrievanceLandingPageProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-blue-50/20 text-slate-900 flex flex-col font-sans">
      <GrievanceHeader 
        title={t('grievance.title', 'Grievance & Support Centre')}
        subtitle={t('grievance.subtitle', 'Raise a concern, ask a question, or track an existing grievance.')}
        profile={profile}
        activePath="/grievance"
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/services-provided')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('nav.backToDashboard', 'Back to Dashboard')}</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
            <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('grievance.desc', 'Maharashtra RTS Act, 2015 Timebound Redressal')}</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('brand.name', 'MahaUdyogSetu')} • {t('brand.tagline', 'Maharashtra Industry Bridge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {t('grievance.title', 'Grievance & Support Centre')}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {t('grievance.subtitle', 'Raise a concern, ask a question, or track an existing grievance.')} Our smart routing connects your request directly to the concerned Maharashtra department nodal officers.
          </p>
        </div>

        {/* 3 Core Interactive Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: REGISTER A QUERY */}
          <div 
            onClick={() => navigate('/grievance/query')}
            className="group bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/60 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-100/70 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Quick Query
                </span>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <HelpCircle className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2.5">
                {t('grievance.raiseQuery', 'Register a Query')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                Ask a question about an application, approval, service, department or process guidelines.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>General process clarifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Document requirement queries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>SLA & fee structure assistance</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold text-xs">
              <span>{t('grievance.raiseQuery', 'Open Query')}</span>
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 2: REGISTER A GRIEVANCE */}
          <div 
            onClick={() => navigate('/grievance/register')}
            className="group bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/60 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-rose-100/70 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  RTS Escalation
                </span>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-rose-700 transition-colors mb-2.5">
                {t('grievance.register', 'Register a Grievance')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                Report a delay, rejection, unresolved service issue, document problem, or other difficulty.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Statutory SLA breach reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Appellate authority escalation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Evidence & document attachments</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-rose-700 font-bold text-xs">
              <span>{t('grievance.register', 'Register Grievance')}</span>
              <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 3: CHECK STATUS */}
          <div 
            onClick={() => navigate('/grievance/status')}
            className="group bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/60 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-100/70 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Live Tracking
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Search className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2.5">
                {t('grievance.checkStatus', 'Check Status')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                Track the current status of a previously submitted query or grievance in real-time.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>6-stage audit trail progression</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Officer remark & resolution notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Official PDF receipt download</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-700 font-bold text-xs">
              <span>{t('grievance.checkStatus', 'Check Status')}</span>
              <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>

        {/* Informational Callout & Helpline */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Direct Single Window Support Helpline
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                For urgent escalation or real-time assistance during business hours (10:00 AM to 6:00 PM IST), contact our dedicated MahaUdyogSetu investor helpdesk.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Toll Free</span>
              <strong className="text-sm font-black text-slate-900 font-mono">1800-120-8040</strong>
            </div>
          </div>
        </div>

      </main>

      <GrievanceFooter />
    </div>
  );
};
