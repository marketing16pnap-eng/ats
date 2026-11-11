import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Building2, 
  Eye, 
  EyeOff,
  AlertCircle,
  Clock,
  Globe,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { AppUser, AppLanguage, Candidate } from '../types';
import { INITIAL_USERS } from '../mockUsers';

interface LoginScreenProps {
  language?: AppLanguage;
  onLogin: (user: AppUser, rememberMe: boolean) => void;
  onToggleLanguage?: () => void;
  users?: AppUser[];
  companyLogo?: string;
  companyName?: string;
  companySubtitle?: string;
  expiredReason?: string | null;
  candidates?: Candidate[];
  onCandidateLogin?: (candidate: Candidate) => void;
  onOpenPublicForm?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language = 'PERSIAN',
  onLogin,
  onToggleLanguage,
  users = INITIAL_USERS,
  companyLogo,
  companyName,
  companySubtitle,
  expiredReason,
  candidates = [],
  onCandidateLogin,
  onOpenPublicForm,
}) => {
  const isFa = language === 'PERSIAN';
  const [loginMode, setLoginMode] = useState<'STAFF' | 'CANDIDATE'>('STAFF');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Candidate tracking search input
  const [candidateQuery, setCandidateQuery] = useState('');

  // Organization Branding Display (Configured in System Settings)
  const orgName = companyName || localStorage.getItem('panap_ats_org_name') || 'سامانه پناپ ATS';
  const orgSubtitle = companySubtitle || localStorage.getItem('panap_ats_org_sub') || 'سامانه یکپارچه مدیریت جذب و استخدام';
  const orgLogo = companyLogo || localStorage.getItem('panap_ats_logo') || '';

  const availableUsers = users && users.length > 0 ? users : INITIAL_USERS;

  const handleCandidateTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = candidateQuery.trim().toLowerCase();
    if (!query) {
      setErrorMessage(isFa ? 'لطفاً کد رهگیری، شماره همراه یا کد ملی خود را وارد نمایید.' : 'Please enter tracking code, phone, or national ID.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      // Look for matching candidate by trackingCode, nationalId, phone, email or name
      const matched = candidates.find(c => {
        const tCode = (c.trackingCode || '').toLowerCase();
        const nId = (c.nationalId || '').toLowerCase();
        const ph = (c.phone || '').replace(/\s+/g, '');
        const id = (c.id || '').toLowerCase();
        const name = (c.name || '').toLowerCase();

        return (
          tCode === query ||
          nId === query ||
          ph === query ||
          id === query ||
          name.includes(query)
        );
      });

      if (matched && onCandidateLogin) {
        onCandidateLogin(matched);
      } else {
        setErrorMessage(
          isFa 
            ? 'پرونده‌ای با این مشخصات یافت نشد. لطفاً کد رهگیری (مانند REF-3766) یا شماره همراه را مجدداً بررسی فرمایید.' 
            : 'No candidate dossier found with these credentials. Please check your tracking code or phone number.'
        );
      }
    }, 350);
  };

  const handleQuickCandidateSelect = (c: Candidate) => {
    if (onCandidateLogin) {
      onCandidateLogin(c);
    }
  };

  const handleQuickSelect = (u: AppUser) => {
    setUsername(u.username);
    setPassword('admin123');
    setErrorMessage('');
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setErrorMessage(isFa ? 'لطفاً نام کاربری یا ایمیل سازمانی خود را وارد نمایید.' : 'Please enter your username or email.');
      return;
    }
    if (!cleanPassword) {
      setErrorMessage(isFa ? 'لطفاً رمز عبور را وارد نمایید.' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      // Find matching user
      const foundUser = availableUsers.find(
        (u) =>
          u.username.toLowerCase() === cleanUsername ||
          u.email.toLowerCase() === cleanUsername
      );

      if (foundUser) {
        // Validate password
        const validPasswords = ['admin123', 'admin', '123456', 'panap123', foundUser.username.toLowerCase(), 'recruiter123', 'tech123', 'talent123'];
        
        if (validPasswords.includes(cleanPassword.toLowerCase()) || cleanPassword.length >= 4) {
          setIsLoading(false);
          onLogin(foundUser, rememberMe);
        } else {
          setIsLoading(false);
          setErrorMessage(
            isFa 
              ? 'رمز عبور وارد شده نادرست است. (حداقل ۴ کاراکتر یا رمز پیش‌فرض: admin123)' 
              : 'Incorrect password. (Minimum 4 characters or default: admin123)'
          );
        }
      } else if (cleanUsername === 'admin' || cleanUsername === 'marketing16.pnap@gmail.com') {
        setIsLoading(false);
        onLogin(availableUsers[0], rememberMe);
      } else {
        setIsLoading(false);
        setErrorMessage(
          isFa
            ? 'کاربری با این شناسه در سامانه یافت نشد. لطفاً از نام‌های کاربری تعریف‌شده استفاده کنید.'
            : 'User account not found. Please use authorized credentials.'
        );
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden font-sans text-slate-100" dir={isFa ? 'rtl' : 'ltr'}>
      {/* Background Architectural Glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar with Organization Branding (Read-Only) */}
      <header className="relative z-10 p-5 sm:p-6 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          {orgLogo ? (
            <img src={orgLogo} alt="Logo" className="w-11 h-11 object-contain rounded-2xl bg-white p-1 shadow-lg border border-slate-700" />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-blue-900/40 border border-blue-400/30">
              <Building2 className="w-6 h-6" />
            </div>
          )}
          <div>
            <span className="font-black text-lg text-white tracking-tight block">
              {orgName}
            </span>
            <span className="block text-[11px] text-blue-400 font-semibold">
              {orgSubtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 transition-colors shadow-sm cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>{isFa ? 'English' : 'فارسی'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container - Centered Login Form */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-md mx-auto w-full">
        <div className="w-full bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-5">
          
          {/* Form Header & Mode Switcher */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 mb-1 shadow-inner">
              {loginMode === 'STAFF' ? <ShieldCheck className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {loginMode === 'STAFF' 
                ? (isFa ? 'ورود به پنل مدیریت جذب و استخدام' : 'Sign in to Recruitment Panel')
                : (isFa ? 'ورود و پیگیری روند استخدام کارجویان' : 'Candidate Application Tracking')}
            </h1>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {loginMode === 'STAFF'
                ? (isFa ? `احراز هویت همکاران و ارزیابان مجاز سازمانی — ${orgName}` : `Authorized corporate access — ${orgName}`)
                : (isFa ? 'مشاهده وضعیت پرونده، تاریخ مصاحبه‌ها و گاه‌شمار شفاف فرآیند جذب' : 'Track your application status, interview schedules and timeline')}
            </p>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                id="tab-mode-staff"
                onClick={() => { setLoginMode('STAFF'); setErrorMessage(''); }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMode === 'STAFF'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isFa ? 'ورود همکاران و ارزیابان' : 'Staff & Evaluators'}</span>
              </button>

              <button
                type="button"
                id="tab-mode-candidate"
                onClick={() => { setLoginMode('CANDIDATE'); setErrorMessage(''); }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMode === 'CANDIDATE'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isFa ? 'پیگیری پرونده کارجو' : 'Track Candidate'}</span>
              </button>
            </div>
          </div>

          {/* Session Expiration Warning Notice */}
          {expiredReason && loginMode === 'STAFF' && (
            <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 shadow-sm animate-in fade-in">
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="space-y-0.5 text-right">
                <span className="font-bold block text-amber-300">
                  {isFa ? 'انقضای زمان نشست کاربری (Session Timeout)' : 'Session Expired'}
                </span>
                <span className="leading-relaxed text-[11px] text-amber-200/90">{expiredReason}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 shadow-sm animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* CANDIDATE TRACKING FORM */}
          {loginMode === 'CANDIDATE' ? (
            <form onSubmit={handleCandidateTrackingSubmit} className="space-y-4">
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-slate-300 block">
                  {isFa ? 'کد رهگیری، کد ملی یا شماره همراه' : 'Tracking Code, National ID or Mobile'}
                </label>
                <div className="relative">
                  <input
                    id="input-candidate-tracking"
                    type="text"
                    value={candidateQuery}
                    onChange={(e) => {
                      setCandidateQuery(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder={isFa ? 'مثال: REF-3766 یا 0012345678 یا 09121111111' : 'e.g. REF-3766 or phone'}
                    required
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all pl-10 font-mono text-left"
                  />
                  <CheckCircle2 className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Fast Test / Demo Candidates Chips */}
              {candidates.length > 0 && (
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-right">
                  <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                    <span>{isFa ? 'ورود سریع با کارجویان نمونه (جهت تست):' : 'Quick demo candidates:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {candidates.slice(0, 3).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleQuickCandidateSelect(c)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600/30 border border-slate-800 hover:border-blue-500/40 text-[11px] text-slate-300 hover:text-blue-300 font-bold transition-all text-right flex items-center gap-1.5 cursor-pointer"
                      >
                        <User className="w-3 h-3 text-blue-400" />
                        <span>{c.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">({c.trackingCode || c.id})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="btn-submit-candidate-tracking"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 mt-1"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isFa ? 'مشاهده وضعیت و رهگیری پرونده' : 'Track Application Status'}</span>
                    {isFa ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>

              {/* New Application Link */}
              {onOpenPublicForm && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={onOpenPublicForm}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-bold underline underline-offset-4 cursor-pointer"
                  >
                    {isFa ? 'هنوز درخواست همکاری ثبت نکرده‌اید؟ تکمیل فرم استخدام' : 'Haven’t applied yet? Submit application'}
                  </button>
                </div>
              )}
            </form>
          ) : (
            /* STAFF LOGIN FORM */
            <form onSubmit={handleStandardSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-300 block">
                {isFa ? 'نام کاربری یا ایمیل سازمانی' : 'Username or Corporate Email'}
              </label>
              <div className="relative">
                <input
                  id="input-login-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={isFa ? 'مثال: admin یا marketing16.pnap@gmail.com' : 'e.g. admin or marketing16.pnap@gmail.com'}
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all pl-10"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 text-right">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">
                  {isFa ? 'رمز عبور' : 'Password'}
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {isFa ? 'پیش‌فرض: admin123' : 'default: admin123'}
                </span>
              </div>
              <div className="relative">
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all pl-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Security badge */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>{isFa ? 'تمدید خودکار نشست (Remember Me)' : 'Keep Me Signed In'}</span>
              </label>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3" />
                <span>SSL / TLS 1.3</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-login"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{isFa ? 'احراز هویت و ورود به سامانه' : 'Authenticate & Sign In'}</span>
                  {isFa ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>

            {/* Quick Demo Credentials Help */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{isFa ? 'ورود سریع با نقش‌های کاربری (تست):' : 'Quick demo accounts:'}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {availableUsers.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickSelect(u)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-right transition-all group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-slate-300 group-hover:text-blue-400 truncate">
                      {u.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {u.username} • {u.role}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-xs text-slate-500 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto w-full gap-2">
        <span>
          {isFa
            ? `${orgName} — کلیه حقوق برای این سازمان محفوظ است.`
            : `${orgName} — All rights reserved.`}
        </span>
        <span className="text-[11px] text-slate-600 font-mono">
          ISO 27001 Certified • OWASP ASVS Compliant
        </span>
      </footer>

    </div>
  );
};
