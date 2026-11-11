import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Globe, 
  Bell, 
  Database, 
  Key, 
  UserCheck, 
  Lock, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  Server, 
  Zap, 
  CheckCircle, 
  ExternalLink, 
  Code, 
  Image, 
  Upload,
  Building2,
  Sparkles,
  Trash2,
  RotateCcw,
  Mail,
  Phone,
  Hash,
  FileText,
  FileSpreadsheet,
  Download,
  Layers,
  Info,
  Check,
  FileImage
} from 'lucide-react';
import { AppLanguage, AppUser, SystemSpecs } from '../types';
import { DbService, DbHealthResult, DbSyncStatus } from '../services/dbService';

interface SettingsScreenProps {
  language?: AppLanguage;
  onToggleLanguage?: () => void;
  currentUser?: AppUser;
  dbStatus?: DbSyncStatus;
  onRefreshData?: () => void;
  onOpenWordPressModal?: () => void;
  companyLogo?: string;
  onUpdateLogo?: (logoUrl: string) => void;
  onUpdateCompanyLogo?: (logoUrl: string) => void;
  companyName?: string;
  onUpdateCompanyName?: (name: string) => void;
  companySubtitle?: string;
  onUpdateCompanySubtitle?: (sub: string) => void;
  systemSpecs?: SystemSpecs;
  onUpdateSystemSpecs?: (specs: SystemSpecs) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  language = 'PERSIAN',
  onToggleLanguage,
  currentUser,
  dbStatus,
  onRefreshData,
  onOpenWordPressModal,
  companyLogo,
  onUpdateLogo,
  onUpdateCompanyLogo,
  companyName,
  onUpdateCompanyName,
  companySubtitle,
  onUpdateCompanySubtitle,
  systemSpecs,
  onUpdateSystemSpecs,
}) => {
  const isFa = language === 'PERSIAN';

  // -------------------------------------------------------------
  // Organization Branding & Specifications States
  // -------------------------------------------------------------
  const [formOrgName, setFormOrgName] = useState<string>(() => {
    return companyName || localStorage.getItem('panap_ats_org_name') || 'سامانه پناپ ATS';
  });

  const [formOrgSubtitle, setFormOrgSubtitle] = useState<string>(() => {
    return companySubtitle || localStorage.getItem('panap_ats_org_sub') || 'سامانه یکپارچه مدیریت جذب و استخدام';
  });

  const [formOrgLogo, setFormOrgLogo] = useState<string>(() => {
    return companyLogo || localStorage.getItem('panap_ats_logo') || '';
  });

  const [directLogoUrl, setDirectLogoUrl] = useState<string>('');

  const [formSpecs, setFormSpecs] = useState<SystemSpecs>(() => {
    if (systemSpecs) return systemSpecs;
    try {
      const saved = localStorage.getItem('panap_ats_system_specs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      systemCode: 'PANAP-ATS-ENTERPRISE',
      supportEmail: 'marketing16.pnap@gmail.com',
      contactPhone: '۰۲۱-۸۸۴۵۶۰۰۰',
      version: 'v2.4.0 (ویرایش سازمانی)',
      orgDescription: 'سامانه استاندارد مدیریت یکپارچه جذب، ارزیابی چندمرحله‌ای و مصاحبه‌های شایستگی سازمانی پناپ.',
    };
  });

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [showBrandingSavedToast, setShowBrandingSavedToast] = useState(false);

  // Sync if props change
  useEffect(() => {
    if (companyName) setFormOrgName(companyName);
  }, [companyName]);

  useEffect(() => {
    if (companySubtitle) setFormOrgSubtitle(companySubtitle);
  }, [companySubtitle]);

  useEffect(() => {
    if (companyLogo !== undefined) setFormOrgLogo(companyLogo);
  }, [companyLogo]);

  // Handle Logo Upload via File
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(isFa ? 'حجم فایل لوگو نباید بیش از ۲ مگابایت باشد.' : 'Logo size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setFormOrgLogo(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply Direct URL
  const handleApplyDirectUrl = () => {
    if (directLogoUrl.trim()) {
      setFormOrgLogo(directLogoUrl.trim());
      setDirectLogoUrl('');
    }
  };

  // Reset to default
  const handleResetDefaults = () => {
    setFormOrgName('سامانه پناپ ATS');
    setFormOrgSubtitle('سامانه یکپارچه مدیریت جذب و استخدام');
    setFormOrgLogo('');
    setFormSpecs({
      systemCode: 'PANAP-ATS-ENTERPRISE',
      supportEmail: 'marketing16.pnap@gmail.com',
      contactPhone: '۰۲۱-۸۸۴۵۶۰۰۰',
      version: 'v2.4.0 (ویرایش سازمانی)',
      orgDescription: 'سامانه استاندارد مدیریت یکپارچه جذب، ارزیابی چندمرحله‌ای و مصاحبه‌های شایستگی سازمانی پناپ.',
    });
  };

  // Save Branding and Specifications
  const handleSaveBrandingAndSpecs = () => {
    // 1. Update localStorage
    localStorage.setItem('panap_ats_org_name', formOrgName);
    localStorage.setItem('panap_ats_org_sub', formOrgSubtitle);
    localStorage.setItem('panap_ats_logo', formOrgLogo);
    localStorage.setItem('panap_ats_system_specs', JSON.stringify(formSpecs));

    // 2. Call parent callbacks
    onUpdateCompanyName?.(formOrgName);
    onUpdateCompanySubtitle?.(formOrgSubtitle);
    onUpdateCompanyLogo?.(formOrgLogo);
    onUpdateLogo?.(formOrgLogo);
    onUpdateSystemSpecs?.(formSpecs);

    // 3. Show notification
    setShowBrandingSavedToast(true);
    setTimeout(() => setShowBrandingSavedToast(false), 4000);
  };

  // -------------------------------------------------------------
  // System General Settings
  // -------------------------------------------------------------
  const [atsAutoMatch, setAtsAutoMatch] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [confidentialMode, setConfidentialMode] = useState(true);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Database Connection State
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  const [isSettingUpDb, setIsSettingUpDb] = useState(false);
  const [dbHealth, setDbHealth] = useState<DbHealthResult | null>(null);
  const [setupMessage, setSetupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    handleCheckDb();
  }, []);

  const handleCheckDb = async () => {
    setIsCheckingDb(true);
    setSetupMessage(null);
    const res = await DbService.checkHealth();
    setDbHealth(res);
    setIsCheckingDb(false);
  };

  const handleRunAutoSetup = async () => {
    setIsSettingUpDb(true);
    setSetupMessage(null);
    const res = await DbService.runAutoSetup();
    setIsSettingUpDb(false);
    if (res.success) {
      setSetupMessage({ type: 'success', text: isFa ? 'پایگاه داده و تمام جداول با موفقیت نصب و مقداردهی اولیه شدند.' : 'Database tables installed and ready.' });
      handleCheckDb();
    } else {
      setSetupMessage({ type: 'error', text: res.message });
    }
  };

  const handleSave = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Toast Notification: Branding Saved */}
      {showBrandingSavedToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
            <span className="text-xs font-bold">
              {isFa 
                ? 'نام سامانه، لوگوی رسمی و مشخصات سازمانی با موفقیت ذخیره و در تمام بخش‌های پنل و صفحه ورود اعمال شد.' 
                : 'System branding, name, logo and specifications were updated successfully.'}
            </span>
          </div>
          <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-lg font-mono">
            LIVE SYNCED
          </span>
        </div>
      )}

      {/* Toast Notification: General Settings */}
      {showSavedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-bold text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{isFa ? 'تنظیمات کلی سامانه با موفقیت بروزرسانی شد.' : 'Settings updated successfully.'}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. BRANDING, NAME & LOGO MANAGEMENT (REQUESTED BY USER) */}
      {/* ========================================================= */}
      <div id="section-system-branding" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {isFa ? 'تنظیمات هویت بصری، نام سامانه و لوگوی رسمی' : 'System Identity, Name & Official Logo'}
              </h3>
              <p className="text-xs text-slate-500">
                {isFa 
                  ? 'نام سامانه، لوگو و زیرعنوان را در اینجا تغییر دهید. تغییرات به صورت یکپارچه در سایدبار، صفحه ورود و سربرگ‌ها اعمال می‌گردد.' 
                  : 'Customize official system name, logo and tagline across all admin screens and login.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-all cursor-pointer"
            title={isFa ? 'بازنشانی به مقادیر پیش‌فرض پناپ' : 'Reset Defaults'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isFa ? 'بازنشانی پیش‌فرض' : 'Reset Defaults'}</span>
          </button>
        </div>

        {/* Dual Live Preview Cards */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{isFa ? 'پیش‌نمایش زنده در محیط‌های سامانه:' : 'Live Environment Preview:'}</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dark Mode Preview (Sidebar & Login Header) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white flex items-center gap-3.5 shadow-inner">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shrink-0 p-1">
                {formOrgLogo ? (
                  <img src={formOrgLogo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <ShieldCheck className="w-7 h-7 text-blue-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-white text-sm truncate">
                    {formOrgName || (isFa ? 'نام سامانه' : 'System Name')}
                  </h4>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-500/30">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {formOrgSubtitle || (isFa ? 'زیرعنوان سامانه' : 'System Subtitle')}
                </p>
                <span className="text-[9px] text-slate-500 font-mono block mt-1">
                  [نمای هدر سایدبار و صفحه ورود - Dark Theme]
                </span>
              </div>
            </div>

            {/* Light Mode Preview (Documents & Modals) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-1 shadow-xs">
                {formOrgLogo ? (
                  <img src={formOrgLogo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="w-7 h-7 text-blue-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm truncate">
                    {formOrgName || (isFa ? 'نام سامانه' : 'System Name')}
                  </h4>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-200">
                    رسمی
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {formOrgSubtitle || (isFa ? 'زیرعنوان سامانه' : 'System Subtitle')}
                </p>
                <span className="text-[9px] text-slate-400 font-mono block mt-1">
                  [نمای فرم عمومی و اسناد استخدام - Light Theme]
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Name Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 block">
            {isFa ? 'نام رسمی سامانه یا سازمان:' : 'Official Organization / System Name:'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              id="input-settings-org-name"
              type="text"
              value={formOrgName}
              onChange={(e) => setFormOrgName(e.target.value)}
              placeholder={isFa ? 'مثال: سامانه پناپ ATS' : 'e.g. Panap ATS System'}
              className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-xs"
            />
          </div>

          {/* Quick Presets for Name */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-slate-500">{isFa ? 'پیشنهادهای سریع:' : 'Quick Presets:'}</span>
            <button
              type="button"
              onClick={() => {
                setFormOrgName('سامانه پناپ ATS');
                setFormOrgSubtitle('سامانه یکپارچه مدیریت جذب و استخدام');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
            >
              سامانه پناپ ATS
            </button>
            <button
              type="button"
              onClick={() => {
                setFormOrgName('هلدینگ فناوران پیشرو');
                setFormOrgSubtitle('پرتال جذب استعداد و سرمایه انسانی');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
            >
              هلدینگ فناوران
            </button>
            <button
              type="button"
              onClick={() => {
                setFormOrgName('شرکت مهندسی داده‌پردازی نوین');
                setFormOrgSubtitle('مرکز سنجش و ارزیابی شایستگی شغلی');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
            >
              داده‌پردازی نوین
            </button>
          </div>
        </div>

        {/* Subtitle Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 block">
            {isFa ? 'زیرعنوان یا شعار سامانه (نمایش زیر نام سامانه):' : 'System Subtitle / Tagline:'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <input
              id="input-settings-org-sub"
              type="text"
              value={formOrgSubtitle}
              onChange={(e) => setFormOrgSubtitle(e.target.value)}
              placeholder={isFa ? 'مثال: سامانه یکپارچه مدیریت جذب و ارزیابی شایستگی' : 'Talent Acquisition & Assessment Platform'}
              className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Logo Upload & Configuration */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-800 block">
            {isFa ? 'لوگوی رسمی سامانه / سازمان:' : 'Official System Logo:'}
          </label>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={logoFileInputRef}
                  onChange={handleLogoFileUpload}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  id="btn-upload-logo-settings"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isFa ? 'انتخاب و آپلود فایل لوگو' : 'Upload Logo File'}</span>
                </button>

                {formOrgLogo && (
                  <button
                    type="button"
                    onClick={() => setFormOrgLogo('')}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isFa ? 'حذف لوگوی اختصاصی' : 'Remove Custom Logo'}</span>
                  </button>
                )}
              </div>

              <span className="text-[11px] text-slate-500">
                {isFa 
                  ? 'فرمت‌های مجاز: PNG (پیشنهادی با پس‌زمینه شفاف)، SVG یا WebP • حداکثر ۲ مگابایت' 
                  : 'Supported formats: PNG, SVG, WebP (Max 2MB)'}
              </span>
            </div>

            {/* Direct URL input option */}
            <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
              <span className="text-[11px] text-slate-600 shrink-0">
                {isFa ? 'یا درج لینک اینترنتی لوگو:' : 'Or Image URL:'}
              </span>
              <input
                type="text"
                value={directLogoUrl}
                onChange={(e) => setDirectLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-left outline-none focus:border-blue-500"
                dir="ltr"
              />
              <button
                type="button"
                onClick={handleApplyDirectUrl}
                disabled={!directLogoUrl.trim()}
                className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isFa ? 'اعمال لینک' : 'Apply'}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. SYSTEM SPECIFICATIONS & METADATA */}
        {/* ========================================================= */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h4 className="font-extrabold text-sm text-slate-900">
              {isFa ? 'مشخصات فنی و اداری سامانه' : 'System Specifications & Administrative Info'}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* System Code */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                {isFa ? 'کد یا شناسه مرجع سامانه:' : 'System Authority Code:'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Hash className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={formSpecs.systemCode}
                  onChange={(e) => setFormSpecs({ ...formSpecs, systemCode: e.target.value })}
                  placeholder="PANAP-ATS-ENTERPRISE"
                  className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-left focus:ring-2 focus:ring-blue-500 outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Version */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                {isFa ? 'نسخه نرم‌افزاری سامانه:' : 'Software Version / Build:'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={formSpecs.version}
                  onChange={(e) => setFormSpecs({ ...formSpecs, version: e.target.value })}
                  placeholder="v2.4.0 (Enterprise)"
                  className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Support Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                {isFa ? 'ایمیل پشتیبانی و منابع انسانی:' : 'Support / HR Email:'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  value={formSpecs.supportEmail}
                  onChange={(e) => setFormSpecs({ ...formSpecs, supportEmail: e.target.value })}
                  placeholder="marketing16.pnap@gmail.com"
                  className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-left focus:ring-2 focus:ring-blue-500 outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                {isFa ? 'شماره تماس یا داخلی پشتیبانی:' : 'Support Phone / Hotline:'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={formSpecs.contactPhone}
                  onChange={(e) => setFormSpecs({ ...formSpecs, contactPhone: e.target.value })}
                  placeholder="۰۲۱-۸۸۴۵۶۰۰۰"
                  className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Organization Mission & Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block">
              {isFa ? 'توضیحات رسمی یا معرفی مأموریت سازمان:' : 'Organization Mission & Description:'}
            </label>
            <textarea
              rows={2}
              value={formSpecs.orgDescription}
              onChange={(e) => setFormSpecs({ ...formSpecs, orgDescription: e.target.value })}
              placeholder={isFa ? 'توضیحات رسمی سازمان...' : 'Official description...'}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Action Button: Save Branding & Specs */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {isFa 
              ? 'تغییرات فوق بلافاصله در تمام پنجره‌ها و صفحه ورود ذخیره و اعمال می‌شود.' 
              : 'Changes apply immediately across all modules and login.'}
          </span>
          <button
            type="button"
            id="btn-save-branding-specs"
            onClick={handleSaveBrandingAndSpecs}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer hover:scale-101 active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isFa ? 'ذخیره نام، لوگو و مشخصات سامانه' : 'Save System Branding & Specs'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. DATABASE MANAGEMENT & MYSQL STATUS */}
      {/* ========================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                {isFa ? 'پیکربندی و وضعیت پایگاه داده MySQL' : 'MySQL Database Management'}
              </h4>
              <p className="text-xs text-slate-500">
                {isFa ? 'مدیریت ذخیره‌سازی داده‌های سامانه در هاست اشتراکی لینوکس (cPanel)' : 'Manage shared host database sync & persistence'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCheckDb}
            disabled={isCheckingDb}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
            <span>{isFa ? 'بررسی مجدد اتصال' : 'Re-check'}</span>
          </button>
        </div>

        {/* Database Status Box */}
        <div className={`p-4 rounded-xl border transition-all ${
          dbHealth?.isConnected 
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                dbHealth?.isConnected ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
              }`}>
                {dbHealth?.isConnected ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm">
                    {dbHealth?.isConnected 
                      ? (isFa ? 'اتصال به دیتابیس MySQL هاست: فعال و متصل' : 'MySQL Connection: Live & Connected')
                      : (isFa ? 'وضعیت فعلی: حالت حافظه محلی (LocalStorage)' : 'Current Status: LocalStorage Mode')
                    }
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    dbHealth?.isConnected ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {dbHealth?.isConnected ? 'MySQL Live' : 'Offline / Standalone'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {dbHealth?.message}
                </p>
                {dbHealth?.database && (
                  <p className="text-[11px] font-mono text-slate-500">
                    Database: <span className="font-bold text-slate-800">{dbHealth.database}</span> | Tables: <span className="font-bold text-slate-800">{dbHealth.tablesCount ?? 0}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Auto-setup button if not setup */}
            <button
              onClick={handleRunAutoSetup}
              disabled={isSettingUpDb}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isSettingUpDb ? 'animate-bounce' : ''}`} />
              <span>{isFa ? 'راه‌اندازی خودکار جداول' : '1-Click Auto Setup'}</span>
            </button>
          </div>

          {setupMessage && (
            <div className={`mt-3 p-3 rounded-lg text-xs font-medium ${
              setupMessage.type === 'success' ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
            }`}>
              {setupMessage.text}
            </div>
          )}
        </div>

        {/* Instructions for cPanel config */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-blue-600" />
            <span>{isFa ? 'نحوه اتصال دیتابیس MySQL در هاست اشتراکی cPanel:' : 'cPanel Setup Guide:'}</span>
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600 leading-relaxed pr-1">
            <li>
              {isFa 
                ? 'در cPanel از منوی MySQL Database Wizard، یک دیتابیس و یوزر بسازید و دسترسی ALL PRIVILEGES را فعال کنید.' 
                : 'Create a database & user in cPanel MySQL Wizard with ALL PRIVILEGES.'}
            </li>
            <li>
              {isFa 
                ? 'فایل api/config.php را در هاست باز کرده و نام دیتابیس، نام کاربری و رمز دیتابیس خود را در آن وارد فرمایید.' 
                : 'Edit api/config.php in File Manager and enter your DB credentials.'}
            </li>
            <li>
              {isFa 
                ? 'روی دکمه «راه‌اندازی خودکار جداول» کلیک کنید تا تمام ساختار جداول به صورت خودکار ایجاد گردد.' 
                : 'Click "1-Click Auto Setup" to automatically create all required ATS tables.'}
            </li>
          </ol>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3.5. SYSTEM ARCHITECTURE & FULL DOCUMENTATION (EXCEL)   */}
      {/* ========================================================= */}
      <div id="section-system-documentation-excel" className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 rounded-2xl border border-emerald-800/60 shadow-xl text-white space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-800/50 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base text-white">
                  {isFa ? 'مستند جامع ساختار فنی، فرآیندها و پایگاه داده (فایل اکسل)' : 'Complete System Architecture & Database Documentation (Excel)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  XLSX • ۶ برگه تخصصی
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isFa 
                  ? 'تمامی جزئیات ساختار نرم‌افزار، زبان‌های برنامه‌نویسی، کتابخانه‌ها، منطق ۷ گام فرآیند جذب، ساختار کامل جداول MySQL، نحوه اتصال و تاریخچه تغییرات در یک فایل اکسل کامل دسته‌بندی شده است.'
                  : 'Full architectural blueprints, tech stacks, 7-step hiring logic, MySQL schemas, and persistence models in a multi-sheet spreadsheet.'}
              </p>
            </div>
          </div>

          <a
            href="/panap-ats-system-documentation.xlsx"
            download="panap-ats-system-documentation.xlsx"
            id="btn-settings-download-docs-excel"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition-all cursor-pointer hover:scale-[1.02] shrink-0"
          >
            <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>{isFa ? 'دانلود فایل اکسل مستندات' : 'Download Documentation (.xlsx)'}</span>
          </a>
        </div>

        {/* 6 Sheets Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">برگه ۱: مشخصات فنی و معماری</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Sheet 1</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              پشته فناوری کامل (React 18, TypeScript, Vite, Tailwind CSS v4, PHP PDO, MySQL) و ساختار پوشه‌ها و نقش هر فایل.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">برگه ۲: فرآیند ۷ گانه استخدام</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Sheet 2</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              تشریح کامل گام‌های ۱ تا ۷ (پلتفرم‌ها، فرم سایت، ویدیو، مصاحبه تلفنی، مصاحبه حضوری سرمد، استعلام معرفین، آفر و استخدام).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">برگه ۳: ساختار پایگاه داده MySQL</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Sheet 3</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              معماری کلیه جداول ats_candidates، ats_departments، ats_requisitions، ats_interview_rounds با انواع داده و کلیدها.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">برگه ۴: منطق ذخیره‌سازی و پایداری</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Sheet 4</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              مکانیزم پایداری دوگانه هیبریدی (LocalStorage + Async MySQL Sync)، اندپوینت‌های PHP و راه‌اندازی خودکار بدون خطا.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">برگه ۵: ماژول‌ها و امکانات سیستم</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Sheet 5</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              بانک کارجویان (جدول و کانبان)، پرونده الکترونیک ۹ ستونه، فرم‌های ارزیابی، پورتال عمومی کارجو، امبد وردپرس و ایمپورت اکسل ۲۱ فیلدی.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">برگه ۶: تاریخچه اقدامات و بهینه‌سازی‌ها</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Sheet 6</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              جزئیات کامل تغییرات اخیر، از جمله پیاده‌سازی تشخیص کارجویان تکراری، نشانگر و تولتیپ سوابق، و پایداری کامل سیستم.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. SECURITY & AUTOMATION */}
      {/* ========================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-slate-900">
              {isFa ? 'امنیت و اتوماسیون فرآیند جذب' : 'Security & Automation Policies'}
            </h4>
            <p className="text-xs text-slate-500">پیکربندی هوشمند دسترسی و انقضای نشست کاربران</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {isFa ? 'انطباق خودکار رزومه با ماتریس شایستگی شغلی (ATS Matching)' : 'Automated Resume-Job Matching'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isFa ? 'محاسبه درصد تطابق مهارت‌های کلیدی متقاضی با ردیف شغلی مورد نظر' : 'Auto score candidate skills based on job criteria'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={atsAutoMatch}
              onChange={(e) => setAtsAutoMatch(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {isFa ? 'اعلان‌های ایمیلی و تقویم به مصاحبه‌کنندگان' : 'Calendar & Email Sync for Assessors'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isFa ? 'ارسال خودکار لینک جلسه و یادآوری ۱۰ دقیقه قبل از مصاحبه' : 'Send automatic invite links and scorecard reminders'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div>
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isFa ? 'اعتبارسنجی اجباری و انقضای خودکار نشست (Session Timeout)' : 'Mandatory Authentication & Session Timeout'}</span>
              </span>
              <span className="text-[11px] text-emerald-800/90 block mt-0.5">
                {isFa 
                  ? 'ورود به سامانه بدون احراز هویت مسدود است. نشست کاربر پس از ۲۰ دقیقه عدم فعالیت به صورت خودکار منقضی می‌شود.' 
                  : 'Zero-trust authentication enforced. Active sessions automatically terminate after 20 minutes of inactivity.'}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]">
              {isFa ? 'فعال (۲۰ دقیقه)' : 'Active (20m)'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. WORDPRESS CAREER EMBED */}
      {/* ========================================================= */}
      {onOpenWordPressModal && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  {isFa ? 'اتصال به وب‌سایت سازمان و فرم استخدام وردپرس' : 'WordPress & Career Form Embed'}
                </h4>
                <p className="text-xs text-slate-500">دریافت خودکار رزومه‌های متقاضیان از وب‌سایت به پایپ‌لاین ATS</p>
              </div>
            </div>

            <button
              onClick={onOpenWordPressModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isFa ? 'دریافت کد امبد و راهنما' : 'Get Embed Code'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5.5. SYSTEM SCREENSHOTS & DOCUMENTATION DOWNLOADS */}
      {/* ========================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-slate-900">
              {isFa ? 'دانلود مستقیم فایل‌های مستندات و تصاویر سامانه' : 'Direct Downloads: Documentation & UI Screenshots'}
            </h4>
            <p className="text-xs text-slate-500">
              {isFa ? 'دسترسی سریع به بسته فشرده اسکرین‌شات‌های کامل نرم‌افزار و فایل اکسل معماری سیستم' : 'Download complete high-res screenshots archive (ZIP) and architecture Excel sheet'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Full Screenshots ZIP */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <FileImage className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-extrabold text-blue-950">
                  {isFa ? 'بسته کامل تصاویر و اسکرین‌شات‌ها (ZIP)' : 'All UI Screenshots (ZIP)'}
                </h5>
                <p className="text-[11px] text-blue-900/80 mt-1 leading-relaxed">
                  {isFa 
                    ? 'شامل ۲۶ اسکرین‌شات باکیفیت بالا (1440px) از کلیه بخش‌ها، منوها، فرم‌ها، کانبان، تقویم و پورتال کارجو به همراه فایل متنی راهنما.' 
                    : '26 high-resolution screenshots covering every screen, modal and official form with guide.'}
                </p>
                <div className="text-[10px] text-blue-700 font-bold mt-1.5 flex items-center gap-2">
                  <span>فرمت: ZIP</span>
                  <span>•</span>
                  <span>حجم: ۹.۴ مگابایت</span>
                </div>
              </div>
            </div>

            <a
              href="/panap-ats-screenshots.zip"
              download="panap-ats-screenshots.zip"
              id="btn-settings-download-screenshots-zip"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isFa ? 'دانلود بسته فشرده اسکرین‌شات‌ها (ZIP)' : 'Download Screenshots (ZIP)'}</span>
            </a>
          </div>

          {/* Card 2: System Documentation Excel */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-extrabold text-emerald-950">
                  {isFa ? 'مستندات معماری، فرآیندها و دیتابیس (Excel)' : 'System Architecture Docs (Excel)'}
                </h5>
                <p className="text-[11px] text-emerald-900/80 mt-1 leading-relaxed">
                  {isFa 
                    ? 'سند جامع اکسل در ۶ شیت تفکیک‌شده شامل مشخصات فنی، چرخه حیات متقاضی، اسکیما کامل دیتابیس MySQL و کاتالوگ قابلیت‌ها.' 
                    : '6-sheet workbook covering tech stack, 7-stage workflow lifecycle, MySQL schema and permissions.'}
                </p>
                <div className="text-[10px] text-emerald-700 font-bold mt-1.5 flex items-center gap-2">
                  <span>فرمت: XLSX</span>
                  <span>•</span>
                  <span>۶ برگه تفکیک‌شده</span>
                </div>
              </div>
            </div>

            <a
              href="/panap-ats-system-documentation.xlsx"
              download="panap-ats-system-documentation.xlsx"
              id="btn-settings-download-excel-docs"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isFa ? 'دانلود مستندات جامع سیستم (Excel)' : 'Download Excel Documentation'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. LANGUAGE & LOCALIZATION */}
      {/* ========================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-slate-900">
              {isFa ? 'زبان و جهت‌بندی محیط کاربری' : 'Language & Localization'}
            </h4>
            <p className="text-xs text-slate-500">انتخاب زبان فارسی (راست‌چین) یا انگلیسی (چپ‌چین)</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              {isFa ? 'زبان پیش‌فرض سامانه' : 'Default Language'}
            </span>
            <span className="text-[11px] text-slate-500">
              {isFa ? 'فارسی (تقویم شمسی و اعداد فارسی)' : 'Persian (RTL layout)'}
            </span>
          </div>
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            >
              {isFa ? 'تغییر به English (LTR)' : 'تغییر به فارسی (RTL)'}
            </button>
          )}
        </div>
      </div>

      {/* Global Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isFa ? 'ذخیره تنظیمات سامانه' : 'Save System Settings'}</span>
        </button>
      </div>
    </div>
  );
};
