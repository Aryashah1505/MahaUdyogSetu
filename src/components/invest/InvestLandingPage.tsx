import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InvestHeader, InvestFooter } from './InvestHeader';
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Calculator, 
  FlaskConical, 
  CheckSquare, 
  TrendingUp, 
  Layers, 
  IndianRupee, 
  FileCheck2, 
  CheckCircle2, 
  ArrowLeft,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { BusinessProfile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface InvestLandingPageProps {
  profile?: BusinessProfile;
}

export const InvestLandingPage: React.FC<InvestLandingPageProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-blue-50/20 text-slate-900 flex flex-col font-sans">
      <InvestHeader 
        title={t('invest.title', 'Invest in Maharashtra')}
        subtitle={t('invest.subtitle', 'Plan, evaluate and prepare your investment with the right approvals, incentives and testing support.')}
        profile={profile}
        activePath="/invest"
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/services-provided')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('nav.backToDashboard', 'Back to Dashboard')}</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('invest.heroBadge', 'MAHARASHTRA INDUSTRIAL ADVANTAGE')}</span>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 mb-12 shadow-xs relative overflow-hidden text-center max-w-4xl mx-auto">
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-blue-50/80 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-teal-50/80 rounded-full blur-3xl pointer-events-none" />

          {/* Emblem */}
          <div className="mb-4 inline-block">
            <img 
              src="/assets/mahau_logo.jpg" 
              alt="MahaUdyogSetu" 
              className="w-40 sm:w-48 h-auto object-contain mx-auto rounded-xl shadow-2xs"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('brand.name', 'MahaUdyogSetu')} • {t('brand.tagline', 'Maharashtra Industry Bridge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {t('invest.title', 'Invest in Maharashtra')}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            {t('invest.subtitle', 'Plan, evaluate and prepare your investment with the right approvals, incentives and testing support.')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/invest/planner')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>{t('invest.startPlanning', 'Start Investment Planning')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/list-of-services')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              {t('invest.exploreServices', 'Explore Services')}
            </button>
          </div>
        </div>

        {/* SECTION: EVERYTHING YOU NEED BEFORE YOU INVEST */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Everything You Need Before You Invest
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Get approval guidance, incentive estimates and testing support in one place.
          </p>
        </div>

        {/* EXACTLY THREE MAJOR SERVICE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          
          {/* CARD 01: KNOW YOUR APPROVALS */}
          <div 
            onClick={() => navigate('/invest/know-your-approvals')}
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
                {t('card.03.title', 'Know Your Approvals')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                {t('card.03.desc', 'Identify all required clearances and permits based on industry sector, plot location, project scale and investment range.')}
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Interactive 4-step industry wizard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Pre-establishment & Pre-operation split</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Visual stage dependency timeline</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold text-xs">
              <span>{t('qa.checkApprovals', 'Check Approvals')} →</span>
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* CARD 02: INCENTIVE CALCULATOR */}
          <div 
            onClick={() => navigate('/invest/incentive-calculator')}
            className="group bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/60 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-teal-100/70 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black tracking-tighter text-teal-600/70 group-hover:text-teal-600 transition-colors">
                  02
                </span>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                  <Calculator className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-2.5">
                Incentive Calculator
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                Estimate the state incentives and subsidies your investment may be eligible for based on your project details.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Package Scheme of Incentives (PSI 2024)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Gross SGST refunds & electricity duty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Capital & employment subsidy projections</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-teal-700 font-bold text-xs">
              <span>Calculate Incentives →</span>
              <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* CARD 03: TESTING LABS IN MAHARASHTRA */}
          <div 
            onClick={() => navigate('/invest/testing-labs')}
            className="group bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/60 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-100/70 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black tracking-tighter text-purple-600/70 group-hover:text-purple-600 transition-colors">
                  03
                </span>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <FlaskConical className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors mb-2.5">
                Testing Labs in Maharashtra
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                Find testing, certification and laboratory facilities relevant to your industry and proposed project.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>NABL & BIS accredited lab directory</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Material, chemical, EV & safety testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Direct contact & location coordinates</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-purple-700 font-bold text-xs">
              <span>Find Testing Labs →</span>
              <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>

        {/* FOURTH SUPPORTING FEATURE: BUILD MY INVESTMENT PLAN */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold">
              <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Personalized Investment Command Centre</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              Build My Investment Plan
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Save approvals, incentives and testing requirements into one personalized investment checklist with interactive milestone tracking and readiness percentage scoring.
            </p>
          </div>

          <button
            onClick={() => navigate('/invest/planner')}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <span>Create Investment Plan</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>

      </main>

      <InvestFooter />
    </div>
  );
};
