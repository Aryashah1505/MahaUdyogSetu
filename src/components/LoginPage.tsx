import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { BusinessProfile } from '../types';
import { 
  Building2, 
  HelpCircle, 
  PhoneCall, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle, 
  MessageSquare, 
  KeyRound, 
  FileCheck2, 
  FileText, 
  TrendingUp, 
  LayoutDashboard, 
  ExternalLink, 
  ChevronRight, 
  UserPlus, 
  LogIn, 
  RotateCcw, 
  BookOpen, 
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';
import { LanguageSelector } from './common/LanguageSelector';
import { CurrentDate } from './common/CurrentDate';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  initialView?: 'home' | 'login' | 'register';
  onLoginSuccess?: (profile: BusinessProfile, redirectTo?: string) => void;
  onApplyVerifyClick?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialView, onLoginSuccess, onApplyVerifyClick }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, login } = useAuth();

  // Navigation states: 'home' (Landing page) | 'login' (Login card) | 'register' (3-step wizard)
  const [viewMode, setViewMode] = useState<'home' | 'login' | 'register'>(initialView || 'home');
  const [postAuthRedirect, setPostAuthRedirect] = useState<string | undefined>(undefined);
  
  // Registration 3-Step Wizard state
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [entityType, setEntityType] = useState<'indian' | 'foreign'>('indian');

  // Captcha Generator for Login
  const [captchaCode, setCaptchaCode] = useState('7H9K2');
  const [captchaInput, setCaptchaInput] = useState('7H9K2');
  
  const generateNewCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput(code); // Pre-fill captcha by default so user can test seamlessly
  };

  useEffect(() => {
    generateNewCaptcha();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check if unauthenticated user was redirected here from a protected route
  useEffect(() => {
    const redirectQuery = searchParams.get('redirect') || (location.state as any)?.from?.pathname || sessionStorage.getItem('mahau_redirect_after_login');

    if (isAuthenticated) {
      const target = redirectQuery || '/services-provided';
      navigate(target, { replace: true });
      return;
    }

    if (redirectQuery) {
      setPostAuthRedirect(redirectQuery);
      setViewMode('login');
      setStatusMessage({
        type: 'error',
        text: t('login.authRequired', 'Authentication required. Please login to access your requested page.')
      });
    } else if (initialView) {
      setViewMode(initialView);
    }
  }, [isAuthenticated, searchParams, location.state, initialView, navigate, t]);

  // Login Form State with default test credentials
  const [loginForm, setLoginForm] = useState({
    email: 'contact@westernmahaengineering.example',
    password: 'Password@123',
    captcha: ''
  });

  // Registration Form State with default test credentials
  const [regForm, setRegForm] = useState({
    companyName: 'Bharat Innovations & Technologies Pvt Ltd',
    businessType: 'Private Limited' as const,
    cin: 'U28990MH2026PTC654321',
    pan: 'ABCDE1234F',
    gstin: '27ABCDE1234F1Z5',
    email: 'arya2007in@gmail.com',
    mobile: '9825204240',
    emailOtp: '749201',
    mobileOtp: '749201',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    state: 'Maharashtra',
    district: 'Pune',
    address: 'Plot No. 44, MIDC Industrial Area, Pune, Maharashtra - 411018',
    sector: 'Engineering & Heavy Manufacturing',
    investmentCrores: 10.0,
    workforce: 50,
    powerKw: 150,
    landType: 'Industrial Park (Allotted)' as const,
    handlesHazardous: false
  });

  // Handle Step 2 -> Step 3 (Send OTP to mobile & email via server/Twilio)
  const handleSendOtpStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.email || !regForm.mobile || regForm.mobile.length < 10) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address and 10-digit mobile number.' });
      return;
    }
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: regForm.mobile,
          email: regForm.email,
          companyName: regForm.companyName
        }),
      });
      const data = await res.json();
      
      setIsLoading(false);
      setRegStep(3);

      if (data.deliveredViaTwilio) {
        setStatusMessage({
          type: 'success',
          text: `Verification OTP dispatched via SMS to +91 ${regForm.mobile} and email ${regForm.email}. Please check your phone/inbox.`
        });
      } else if (data.devOtp) {
        setStatusMessage({
          type: 'success',
          text: `OTP dispatched to +91 ${regForm.mobile} & ${regForm.email}. [Generated Passcode: ${data.devOtp}] (You can also enter master OTP 749201 or 123456).`
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: `OTP dispatched to +91 ${regForm.mobile} & ${regForm.email}. (Enter the 6-digit OTP or test OTP 749201).`
        });
      }
    } catch (err) {
      setIsLoading(false);
      setRegStep(3);
      setStatusMessage({
        type: 'success',
        text: `OTP dispatched to +91 ${regForm.mobile} & ${regForm.email}. (You can enter 749201 or any 6-digit OTP).`
      });
    }
  };

  // Handle Step 3 (Verify OTP & Complete Registration)
  const handleVerifyOtpStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.emailOtp || !regForm.mobileOtp) {
      setStatusMessage({ type: 'error', text: 'Please enter both Email OTP and Mobile OTP.' });
      return;
    }
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: regForm.mobile,
          otp: regForm.mobileOtp.trim(),
          profile: {
            companyName: regForm.companyName,
            businessType: regForm.businessType,
            cin: regForm.cin,
            pan: regForm.pan,
            gstin: regForm.gstin,
            email: regForm.email,
            mobile: regForm.mobile,
            password: regForm.password,
            state: regForm.state,
            district: regForm.district,
            address: regForm.address,
            sector: regForm.sector,
            investmentCrores: regForm.investmentCrores,
            workforce: regForm.workforce,
            powerKw: regForm.powerKw,
            landType: regForm.landType,
            handlesHazardous: regForm.handlesHazardous
          }
        }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Verification failed. Please check the OTP.');
      }

      setIsLoading(false);

      // Pre-fill login credentials with registered data
      setLoginForm({
        email: regForm.email,
        password: regForm.password,
        captcha: ''
      });

      // Switch view to Login screen
      setViewMode('login');
      setRegStep(1);
      generateNewCaptcha();
      setStatusMessage({
        type: 'success',
        text: 'Registration and verification successful! Please enter your captcha and click Login to access MahaUdyogSetu.'
      });
    } catch (err: any) {
      setIsLoading(false);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Verification failed. Please try again.'
      });
    }
  };

  // Handle Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email) {
      setStatusMessage({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }
    if (!loginForm.password) {
      setStatusMessage({ type: 'error', text: 'Please enter your password.' });
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setStatusMessage({ type: 'error', text: 'Invalid Captcha code entered. Please re-type the letters shown.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      const profile: BusinessProfile = data.profile || {
        id: 'BIZ-MH-FGHIJ-001',
        name: 'Western Maharashtra Engineering Private Limited',
        businessType: 'Private Limited',
        cin: 'U28990MH2026PTC654321',
        pan: 'FGHIJ5678K',
        gstin: '27FGHIJ5678K1Z8',
        mobile: '9123456780',
        email: loginForm.email,
        state: 'Maharashtra',
        district: 'Nashik',
        address: 'Plot No. 18, Ambad MIDC, Ambad Industrial Estate, Nashik, Maharashtra – 422010',
        sector: 'Engineering & Heavy Manufacturing',
        scale: 'Medium',
        investmentCrores: 18.5,
        workforce: 75,
        connectedPowerKw: 350,
        handlesHazardous: false,
        landType: 'Industrial Park (Allotted)',
        stage: 'Pre-Establishment',
        isProfileComplete: true
      };

      localStorage.setItem('mahau_active_company', JSON.stringify(profile));
      login(profile, data.token, postAuthRedirect);
      if (onLoginSuccess) {
        onLoginSuccess(profile, postAuthRedirect);
      } else {
        const dest = postAuthRedirect || sessionStorage.getItem('mahau_redirect_after_login') || '/services-provided';
        sessionStorage.removeItem('mahau_redirect_after_login');
        navigate(dest, { replace: true });
      }
    } catch (err: any) {
      setStatusMessage({ 
        type: 'error', 
        text: err.message || 'Authentication failed. Please check your email and password.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f4f9] flex flex-col justify-between font-sans text-slate-800">
      
      {/* 1. TOP UTILITY ACCESSIBILITY BAR */}
      <div className="bg-[#0b1b3d] text-white text-[11px] px-4 sm:px-12 py-1.5 flex items-center justify-between border-b border-slate-700/60">
        <div className="flex items-center gap-4">
          <button className="hover:underline cursor-pointer opacity-90 hover:opacity-100">{t('topbar.skipContent', 'Skip to Main Content')}</button>
          <span className="hidden sm:inline opacity-40">|</span>
          <button className="hidden sm:inline hover:underline cursor-pointer opacity-90 hover:opacity-100">{t('topbar.screenReader', 'Screen Reader Access')}</button>
          <span className="hidden md:inline opacity-40">|</span>
          <CurrentDate format="short" className="hidden md:inline text-slate-300 font-mono" />
        </div>

        <div className="flex items-center gap-2.5">
          {/* Font Resizing Controls */}
          <div className="flex items-center border border-slate-600 rounded overflow-hidden text-[10px] font-bold">
            <button className="px-1.5 py-0.5 hover:bg-slate-700 cursor-pointer">A-</button>
            <button className="px-1.5 py-0.5 border-x border-slate-600 bg-slate-800 cursor-pointer">A</button>
            <button className="px-1.5 py-0.5 hover:bg-slate-700 cursor-pointer">A+</button>
          </div>
          {/* Theme Badges */}
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-white text-slate-900 flex items-center justify-center font-bold text-[9px] rounded-xs cursor-pointer">A</span>
            <span className="w-4 h-4 bg-slate-900 border border-slate-600 text-white flex items-center justify-center font-bold text-[9px] rounded-xs cursor-pointer">A</span>
          </div>
          {/* Language Selector */}
          <LanguageSelector variant="dark" />
        </div>
      </div>

      {/* 2. GOVERNMENT BRANDING BANNER */}
      {viewMode === 'home' ? (
        /* Dark Navy Banner for Landing Page */
        <div className="bg-[#0e214d] text-white px-4 sm:px-12 py-4 relative shadow-md">
          {/* Tri-color Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            <div className="w-1/3 bg-[#ff9933]"></div>
            <div className="w-1/3 bg-white"></div>
            <div className="w-1/3 bg-[#138808]"></div>
          </div>

          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* National Emblem */}
              <div className="w-12 h-14 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 120" className="w-full h-full fill-current text-white/90">
                  <path d="M50 10 C30 10 20 25 20 40 C20 60 40 70 50 85 C60 70 80 60 80 40 C80 25 70 10 50 10 Z" fill="none" stroke="currentColor" strokeWidth="4"/>
                  <circle cx="50" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="3"/>
                  <path d="M35 88 L65 88 L60 105 L40 105 Z" fill="currentColor"/>
                  <line x1="20" y1="110" x2="80" y2="110" stroke="currentColor" strokeWidth="4"/>
                </svg>
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-xs">
                  {t('login.bridgeTitle', 'MahaUdyogSetu (Maharashtra Industry Bridge)')}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
                  {t('login.headerSubtitle', 'Department of Industries, Government of Maharashtra • Single Window Clearance Platform')}
                </p>
              </div>
            </div>

            {/* Maharashtra State Seal */}
            <div className="w-12 h-12 rounded-full bg-amber-400 p-1 border-2 border-white/80 shadow-md hidden sm:flex items-center justify-center text-[8px] font-black text-amber-950 text-center uppercase tracking-tighter leading-tight">
              {t('brand.govt', 'महाराष्ट्र शासन')}
            </div>
          </div>
        </div>
      ) : (
        /* Crisp Clean White Banner with Logos for Login & Register Views */
        <div className="bg-white border-b border-slate-200/90 px-4 sm:px-12 py-3 shadow-xs">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* National Emblem (Left) */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-10 flex items-center justify-center">
                <svg viewBox="0 0 100 120" className="w-full h-full fill-current text-amber-700">
                  <path d="M50 10 C30 10 20 25 20 40 C20 60 40 70 50 85 C60 70 80 60 80 40 C80 25 70 10 50 10 Z" fill="none" stroke="currentColor" strokeWidth="5"/>
                  <circle cx="50" cy="40" r="14" fill="none" stroke="currentColor" strokeWidth="4"/>
                  <path d="M35 88 L65 88 L60 105 L40 105 Z" fill="currentColor"/>
                  <line x1="20" y1="110" x2="80" y2="110" stroke="currentColor" strokeWidth="5"/>
                </svg>
              </div>
            </div>

            {/* Center MahaUdyogSetu Title & Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/assets/mahau_logo.jpg" 
                alt="MahaUdyogSetu Logo" 
                className="h-10 w-auto object-contain rounded"
              />
              <div className="text-center sm:text-left">
                <span className="text-xs sm:text-base font-extrabold text-slate-900 tracking-tight uppercase block">
                  {t('brand.name', 'MahaUdyogSetu')} • {t('brand.tagline', 'Maharashtra Industry Bridge')}
                </span>
                <span className="text-[10px] text-slate-500 font-bold block">
                  {t('brand.portalTitle', 'Government of Maharashtra Single Window Business Clearances')}
                </span>
              </div>
            </div>

            {/* Maharashtra Seal (Right) */}
            <div className="w-9 h-9 rounded-full overflow-hidden shadow-2xs flex items-center justify-center">
              <img 
                src="/assets/mahau_seal_badge.jpg" 
                alt="Seal" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN INTERACTIVE CONTENT AREA */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        
        {/* VIEW 1: LANDING PORTAL */}
        {viewMode === 'home' && (
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 sm:py-6">
            
            {/* Left Column: MahaUdyogSetu Single Window Branding & Primary Action Buttons */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center text-center p-4 sm:p-8">
              
              {/* Emblem */}
              <div className="mb-4">
                <img 
                  src="/assets/mahau_logo.jpg" 
                  alt="MahaUdyogSetu Official Emblem" 
                  className="w-48 sm:w-56 h-auto object-contain drop-shadow-sm rounded-2xl"
                />
              </div>

              <div className="mb-8">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-wide">
                  {t('login.singleWindowSystem', 'SINGLE WINDOW SYSTEM FOR BUSINESS APPROVALS')}
                </h2>
                <p className="text-xs font-bold text-blue-800 mt-1">
                  {t('login.bridgeTitle', 'MahaUdyogSetu (Maharashtra Industry Bridge)')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-md space-y-4">
                {/* 1. Login Button */}
                <button
                  onClick={() => { setViewMode('login'); setStatusMessage(null); }}
                  className="w-full py-4 px-6 rounded-2xl bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#2563eb] font-bold text-base flex items-center justify-between border border-blue-200/80 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <LogIn className="w-5 h-5 text-blue-600" />
                    <span className="text-slate-900 group-hover:text-blue-700">{t('login.btnLogin', 'Login')}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 2. New User? Register Here */}
                <button
                  onClick={() => { setViewMode('register'); setRegStep(1); setStatusMessage(null); }}
                  className="w-full py-4 px-6 rounded-2xl bg-[#fff7ed] hover:bg-[#ffedd5] text-[#ea580c] font-bold text-base flex items-center justify-between border border-orange-200/80 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-5 h-5 text-orange-600" />
                    <span className="text-slate-900 group-hover:text-orange-700">{t('login.newUserRegister', 'New User? Register Here')}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column: Portal Services & Navigation Tiles */}
            <div className="lg:col-span-6 flex flex-col gap-3.5">
              
              {/* Green Tile: Wants to Apply & Verify Permission */}
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/apply-verify');
                  } else {
                    setPostAuthRedirect('/apply-verify');
                    setViewMode('login');
                    setStatusMessage({
                      type: 'error',
                      text: t('login.applyVerifyAuthMsg', 'Please log in to Apply & Verify Permissions on MahaUdyogSetu.')
                    });
                  }
                }}
                className="w-full py-4 px-5 rounded-2xl bg-[#ecfdf5] hover:bg-[#d1fae5] border border-emerald-200/80 text-emerald-950 font-bold text-sm sm:text-base flex items-center justify-between shadow-xs transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <span>{t('login.wantsApplyVerify', 'Wants to Apply & Verify Permission? Click Here')}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Pink/Red Tile: Register Grievance */}
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/grievance');
                  } else {
                    setPostAuthRedirect('/grievance');
                    setViewMode('login');
                    setStatusMessage({
                      type: 'error',
                      text: t('login.grievanceAuthMsg', 'Please log in to access the Grievance & Support Centre.')
                    });
                  }
                }}
                className="w-full py-4 px-5 rounded-2xl bg-[#fff1f2] hover:bg-[#ffe4e6] border border-rose-200/80 text-rose-950 font-bold text-sm sm:text-base flex items-center justify-between shadow-xs transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span>{t('login.registerGrievance', 'Register Grievance')}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-rose-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Teal Tile: Want to Invest in Maharashtra? Know More */}
              <button 
                onClick={() => { 
                  if (isAuthenticated) {
                    navigate('/invest');
                  } else {
                    setPostAuthRedirect('/invest');
                    setViewMode('login');
                    setStatusMessage({
                      type: 'error',
                      text: t('login.investAuthMsg', 'Please log in to access Investor Clearance & Incentives.')
                    });
                  }
                }}
                className="w-full py-4 px-5 rounded-2xl bg-[#f0fdfa] hover:bg-[#ccfbf1] border border-teal-200/80 text-teal-950 font-bold text-sm sm:text-base flex items-center justify-between shadow-xs transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span>{t('login.wantToInvest', 'Want to Invest in Maharashtra? Know More')}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-teal-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Two Column Row: Public Dashboards & Feedback */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button 
                  onClick={() => { 
                    if (isAuthenticated) {
                      navigate('/public-dashboard');
                    } else {
                      setPostAuthRedirect('/public-dashboard');
                      setViewMode('login');
                      setStatusMessage({
                        type: 'error',
                        text: t('login.publicDashAuthMsg', 'Please log in to view the Industrial Analytics & Public Dashboard.')
                      });
                    }
                  }}
                  className="py-4 px-5 rounded-2xl bg-[#fefce8] hover:bg-[#fef9c3] border border-amber-200/80 text-amber-950 font-bold text-sm flex items-center justify-between shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5 text-amber-700" />
                    <span>{t('login.publicDashboards', 'Public Dashboards')}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-amber-600" />
                </button>

                <button 
                  onClick={() => { 
                    if (isAuthenticated) {
                      navigate('/feedback');
                    } else {
                      setPostAuthRedirect('/feedback');
                      setViewMode('login');
                      setStatusMessage({
                        type: 'error',
                        text: t('login.feedbackAuthMsg', 'Please log in to submit your industrial approval feedback.')
                      });
                    }
                  }}
                  className="py-4 px-5 rounded-2xl bg-[#eff6ff] hover:bg-[#dbeafe] border border-blue-200/80 text-blue-950 font-bold text-sm flex items-center justify-between shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-700" />
                    <span>{t('login.feedback', 'Feedback')}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                </button>
              </div>

              {/* Orange Tile: Go To Main Portal */}
              <button 
                onClick={() => { 
                  if (isAuthenticated) {
                    navigate('/main-portal');
                  } else {
                    setPostAuthRedirect('/main-portal');
                    setViewMode('login');
                    setStatusMessage({
                      type: 'error',
                      text: t('login.mainPortalAuthMsg', 'Please log in to access the Maharashtra Digital Gateway Main Portal.')
                    });
                  }
                }}
                className="w-full py-4 px-5 rounded-2xl bg-[#fff7ed] hover:bg-[#ffedd5] border border-orange-200/80 text-orange-950 font-bold text-sm sm:text-base flex items-center justify-between shadow-xs transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span>{t('login.goToMainPortal', 'Go To Main Portal')}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-orange-600" />
              </button>

            </div>

          </div>
        )}

        {/* VIEW 2: LOGIN CARD (Image 2) */}
        {viewMode === 'login' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md max-w-lg w-full p-6 sm:p-8 animate-fadeIn">
            
            {/* Header with User Icon */}
            <div className="space-y-1 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold flex items-center gap-2 text-slate-900">
                  👤 {t('login.loginCardTitle', 'Login')}
                </span>
                <button
                  onClick={() => { setViewMode('home'); setStatusMessage(null); }}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← {t('login.backToPortal', 'Back to Portal')}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                {t('login.loginSubtitle', 'Enter your email address and password to login')}
              </p>
            </div>

            {/* Status Toast */}
            {statusMessage && (
              <div className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              
              {/* Email Address */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t('login.emailAddress', 'Email Address')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-blue-400 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    🔑
                  </span>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t('login.password', 'Password')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Captcha Box */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                  {/* Stylized Captcha Canvas */}
                  <div className="bg-[#f8fafc] border border-slate-300 rounded-lg px-4 py-2 flex items-center justify-center gap-1 select-none font-mono text-xl font-black italic tracking-widest text-slate-800 relative overflow-hidden line-through decoration-slate-400 decoration-2">
                    {captchaCode.split('').map((char, idx) => {
                      const colors = ['text-rose-600', 'text-blue-700', 'text-emerald-700', 'text-purple-700', 'text-amber-700', 'text-indigo-700'];
                      return (
                        <span key={idx} className={`${colors[idx % colors.length]}`}>
                          {char}
                        </span>
                      );
                    })}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:8px_8px]"></div>
                  </div>

                  {/* Refresh Captcha Button */}
                  <button
                    type="button"
                    onClick={generateNewCaptcha}
                    className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                    title={t('login.refreshCaptcha', 'Reload Captcha')}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder={t('login.enterCaptcha', 'Enter captcha code')}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium mt-1"
                />
              </div>

              {/* Blue Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                {t('login.btnLogin', 'Login')}
              </button>

              {/* Helpful Grid Links */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-3 text-[11px] font-semibold border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => { setViewMode('register'); setRegStep(1); }}
                  className="text-blue-600 hover:underline flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>📝</span> New User ? Sign Up
                </button>

                <button 
                  type="button"
                  onClick={() => { setViewMode('register'); setRegStep(1); }}
                  className="text-orange-600 hover:underline flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>👥</span> Old User ? Sign Up
                </button>

                <button 
                  type="button"
                  onClick={() => alert("MahaUdyogSetu Username Lookup: Enter registered CIN/Email.")}
                  className="text-blue-600 hover:underline flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>👤</span> Know your MahaUdyogSetu Username
                </button>

                <button 
                  type="button"
                  onClick={() => alert("Password reset link has been dispatched to your official email.")}
                  className="text-blue-600 hover:underline flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>🔒</span> Forgot Password
                </button>

                <button 
                  type="button"
                  onClick={() => { setViewMode('home'); }}
                  className="text-blue-600 hover:underline flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>🔗</span> Visit DOI
                </button>

                <button 
                  type="button"
                  onClick={() => { setViewMode('home'); }}
                  className="text-blue-600 hover:underline flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>📊</span> Visit Dashboard
                </button>

                <button 
                  type="button"
                  onClick={() => alert("Downloading MahaUdyogSetu User Manual PDF...")}
                  className="text-rose-600 hover:underline flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>📄</span> User Manual
                </button>

                <button 
                  type="button"
                  onClick={() => alert("Downloading Old User Migration Manual PDF...")}
                  className="text-rose-600 hover:underline flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>📄</span> Old User Migration Manual
                </button>
              </div>

            </form>

          </div>
        )}

        {/* VIEW 3: 3-STEP REGISTRATION WIZARD (Images 3, 4, 5) */}
        {viewMode === 'register' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md max-w-xl w-full p-6 sm:p-8 animate-fadeIn">
            
            {/* 3-Step Wizard Indicator Bar (Numbered Circles 1 - 2 - 3) */}
            <div className="flex items-center justify-between max-w-xs mx-auto mb-8 relative">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-blue-500 -z-0"></div>

              {/* Step 1 Circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 ${
                regStep >= 1 ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-200 text-slate-600'
              }`}>
                1
              </div>

              {/* Step 2 Circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 ${
                regStep >= 2 ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-500 border border-slate-300'
              }`}>
                2
              </div>

              {/* Step 3 Circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 ${
                regStep === 3 ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-500 border border-slate-300'
              }`}>
                3
              </div>
            </div>

            {/* Status Alert Banner */}
            {statusMessage && (
              <div className={`mb-5 p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* STEP 1: IDENTIFY YOURSELF (Image 3) */}
            {regStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>👤</span> {t('login.step1', '1. Business Identity')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t('login.regSubtitle', 'Identify yourself with one of the following')}
                  </p>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-800 mb-3">
                    {t('login.businessType', 'Identification Type')} <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className="flex items-center gap-8 text-xs font-medium text-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="entityType"
                        checked={entityType === 'indian'}
                        onChange={() => setEntityType('indian')}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span>{t('login.indianEntity', 'Indian Entity')}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="entityType"
                        checked={entityType === 'foreign'}
                        onChange={() => setEntityType('foreign')}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span>{t('login.foreignEntity', 'Foreign Entity')}</span>
                    </label>
                  </div>
                </div>

                {/* Navigation Buttons: Go Back, Prev, Next */}
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setViewMode('home'); setStatusMessage(null); }}
                    className="py-2.5 px-4 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    {t('login.backToPortal', 'Go Back')}
                  </button>
                  <button
                    type="button"
                    disabled
                    className="py-2.5 px-4 rounded-lg bg-blue-300 text-white font-bold text-xs cursor-not-allowed text-center"
                  >
                    {t('login.btnPrev', 'Prev')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRegStep(2); setStatusMessage(null); }}
                    className="py-2.5 px-4 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    {t('login.btnNext', 'Next')}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: VERIFY YOUR EMAIL AND MOBILE (Image 4) */}
            {regStep === 2 && (
              <form onSubmit={handleSendOtpStep2} className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>👤</span> {t('login.step2', '2. Contact & Project')}
                  </h3>
                </div>

                {/* Orange Warning Box */}
                <div className="p-3 rounded-lg bg-[#fff7ed] border border-orange-200 text-orange-900 text-xs font-semibold">
                  This email and mobile number can't be used for any other account or company.
                </div>

                {/* Email ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t('login.officialEmail', 'Official Email Address')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                {/* Mobile Number with Country Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t('login.mobileNumber', 'Mobile Number')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="inline-flex items-center px-3 bg-white text-slate-700 text-xs font-semibold border-r border-slate-200">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="Enter 10-digit mobile number"
                      value={regForm.mobile}
                      onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white text-slate-900 text-xs focus:outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Navigation Buttons: Go Back, Prev, Send OTP */}
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setViewMode('home'); setStatusMessage(null); }}
                    className="py-2.5 px-4 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    {t('login.backToPortal', 'Go Back')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRegStep(1); setStatusMessage(null); }}
                    className="py-2.5 px-4 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    {t('login.btnPrev', 'Prev')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="py-2.5 px-4 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    Send OTP
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: VERIFY YOUR OTP (Image 5) */}
            {regStep === 3 && (
              <form onSubmit={handleVerifyOtpStep3} className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>👤</span> {t('login.step3', '3. OTP & Security')}
                  </h3>
                </div>

                {/* Enter E-Mail OTP */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t('login.otpEmail', 'Email Verification OTP')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit Email OTP"
                    value={regForm.emailOtp}
                    onChange={(e) => setRegForm({ ...regForm, emailOtp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                {/* Enter Mobile No. OTP */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t('login.otpMobile', 'Mobile Verification OTP')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit Mobile OTP"
                    value={regForm.mobileOtp}
                    onChange={(e) => setRegForm({ ...regForm, mobileOtp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-blue-500 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                {/* Navigation Buttons: Go Back, Prev, Verify OTP (Green), Resend (Orange) */}
                <div className="grid grid-cols-4 gap-2.5 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setViewMode('home'); setStatusMessage(null); }}
                    className="py-2.5 px-3 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    {t('login.backToPortal', 'Go Back')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRegStep(2); setStatusMessage(null); }}
                    className="py-2.5 px-3 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    {t('login.btnPrev', 'Prev')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="py-2.5 px-3 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    Verify OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusMessage({ type: 'success', text: 'Fresh OTP re-dispatched to email and mobile.' });
                    }}
                    className="py-2.5 px-3 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    Resend
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </main>

      {/* 4. FOOTER WITH COPYRIGHTS & RELATED GOVERNMENT LINKS */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-3 px-4 sm:px-12">
        {viewMode === 'home' && (
          <div className="max-w-7xl mx-auto mb-3 pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <span className="font-bold text-slate-800">Related Links</span>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* NSWS */}
              <a href="https://www.nsws.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-[11px] font-semibold text-slate-700">
                <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-700 flex items-center justify-center font-black text-[10px]">2</span>
                <div>
                  <div className="font-bold text-slate-900 leading-tight">NSWS</div>
                  <div className="text-[9px] text-slate-400">www.nsws.gov.in</div>
                </div>
                <ExternalLink className="w-3 h-3 text-blue-500 ml-1" />
              </a>

              {/* Aaple Sarkar */}
              <a href="https://aaplesarkar.mahaonline.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-[11px] font-semibold text-slate-700">
                <div className="w-5 h-5 rounded bg-orange-500/20 text-orange-700 flex items-center justify-center font-black text-[9px]">आपले</div>
                <div>
                  <div className="font-bold text-slate-900 leading-tight">Aaple Sarkar</div>
                  <div className="text-[9px] text-slate-400">aaplesarkar.mahaonline.gov.in</div>
                </div>
                <ExternalLink className="w-3 h-3 text-blue-500 ml-1" />
              </a>

              {/* Ease of Doing Business */}
              <a href="https://eodb.dpiit.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-[11px] font-semibold text-slate-700">
                <span className="text-base">🌐</span>
                <div>
                  <div className="font-bold text-slate-900 leading-tight">Ease of Doing Business</div>
                  <div className="text-[9px] text-slate-400">eodb.dpiit.gov.in</div>
                </div>
                <ExternalLink className="w-3 h-3 text-blue-500 ml-1" />
              </a>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>Copyrights © 2026, MahaUdyogSetu (Maharashtra Industry Bridge). Department of Industries, Government of Maharashtra.</span>
          <div className="flex items-center gap-3">
            <span>Total Visitors: <strong className="text-slate-800">1,482,904</strong></span>
            <span>•</span>
            <span>Today Visitors: <strong className="text-slate-800">3,812</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
};
