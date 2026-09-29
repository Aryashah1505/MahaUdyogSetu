import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader, PublicFooter } from './PublicHeader';
import { 
  FileCheck2, 
  ArrowRight, 
  ListFilter, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle2,
  Zap,
  Info
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ApplyVerifyHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-blue-50/20 text-slate-900 flex flex-col font-sans">
      <PublicHeader 
        title={t('applyVerify.hubTitle', 'Apply & Verify Permission')} 
        subtitle={t('applyVerify.hubSubtitle', 'Government of Maharashtra Single Window Clearances & Verification Portal')}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('applyVerify.hubBadge', 'MahaUdyogSetu Unified Service Discovery & Verification')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {t('applyVerify.hubTitle', 'Apply & Verify Permission')}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {t('applyVerify.hubSubtitle', 'Find the permissions applicable to your industry, verify statutory requirements, explore government departments, and validate existing certificates before official submission.')}
          </p>
        </div>

        {/* 3 Core Selection Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 01: Apply for Services */}
          <div 
            onClick={() => navigate('/apply-for-services')}
            className="group bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/60 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-100/70 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black tracking-tighter text-blue-600/70 group-hover:text-blue-600 transition-colors">
                  01
                </span>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <FileCheck2 className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2.5">
                {t('applyVerify.c1Title', 'Apply for Services')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                {t('applyVerify.c1Desc', 'Submit applications for licences, registrations, consent letters, NOCs and industry approvals through an automated questionnaire.')}
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{t('applyVerify.c1Badge', 'Business & Project profiling')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{t('card.01.badge', '179 Services Online')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{t('navigator.bullet3', 'Calculates RTS Act statutory SLA timelines')}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold text-xs">
              <span>{t('applyVerify.c1Btn', 'Start Application Wizard')}</span>
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 02: List of Services */}
          <div 
            onClick={() => navigate('/list-of-services')}
            className="group bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/60 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-100/70 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black tracking-tighter text-emerald-600/70 group-hover:text-emerald-600 transition-colors">
                  02
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <ListFilter className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2.5">
                {t('applyVerify.c2Title', 'List of Services')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                {t('applyVerify.c2Desc', 'Explore all available Maharashtra government services, filter by department, industry sector, stage, and download document requirements.')}
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>14+ Maharashtra state departments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>SLA timelines & official fees schedule</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant search & multi-sector filters</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-700 font-bold text-xs">
              <span>{t('applyVerify.c2Btn', 'Explore Master Catalogue')}</span>
              <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 03: Verify a Permission */}
          <div 
            onClick={() => navigate('/verify-permission')}
            className="group bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/60 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-100/70 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black tracking-tighter text-purple-600/70 group-hover:text-purple-600 transition-colors">
                  03
                </span>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors mb-2.5">
                {t('applyVerify.c3Title', 'Verify a Permission')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                {t('applyVerify.c3Desc', 'Verify the authenticity and validity of an existing licence, approval, NOC, or certificate issued across Maharashtra departments.')}
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Verify by Application / Certificate No.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Live validity & expiry verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Digitally signed QR verification hash</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-purple-700 font-bold text-xs">
              <span>{t('applyVerify.c3Btn', 'Open Verification Portal')}</span>
              <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>

        {/* Informational GovTech Callout */}
        <div className="mt-12 bg-blue-50/70 rounded-2xl border border-blue-200/80 p-5 flex items-start gap-4">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">Statutory Compliance Note:</span> {t('footer.statutory', 'Statutory Single Window Facilitation under Maharashtra Right to Services Act, 2015.')}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
