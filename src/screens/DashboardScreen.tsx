import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  CalendarCheck, 
  Award, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
  Compass,
  Layers,
  Video,
  Phone,
  Building,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  HelpCircle,
  ArrowRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { 
  Candidate, 
  JobRequisition, 
  InterviewRound, 
  MetricCardData, 
  FunnelStage, 
  AppLanguage,
  NavigationTab,
  Department,
  AppUser
} from '../types';
import { initialMetrics, initialFunnelStages, initialInterviews } from '../mockData';

interface DashboardScreenProps {
  candidates?: Candidate[];
  requisitions?: JobRequisition[];
  interviews?: InterviewRound[];
  upcomingInterviews?: InterviewRound[];
  departments?: Department[];
  currentUser?: AppUser;
  language?: AppLanguage;
  onNavigateTab?: (tab: NavigationTab) => void;
  onNavigate?: (tab: NavigationTab) => void;
  onOpenExcelImport?: () => void;
  onSelectCandidate?: (c: Candidate) => void;
  metrics?: MetricCardData[];
  funnelStages?: FunnelStage[];
  onOpenScorecard?: (interview: InterviewRound) => void;
  onOpenNewCandidate?: () => void;
  onOpenNewRequisition?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  candidates = [],
  requisitions = [],
  interviews,
  upcomingInterviews,
  departments = [],
  currentUser,
  language = 'PERSIAN',
  onNavigateTab,
  onNavigate,
  onOpenExcelImport,
  onSelectCandidate,
  metrics = initialMetrics,
  funnelStages = initialFunnelStages,
  onOpenScorecard,
  onOpenNewCandidate,
  onOpenNewRequisition,
}) => {
  const isFa = language === 'PERSIAN';

  // Toggle between simple operational desk and advanced analytics
  const [dashboardMode, setDashboardMode] = useState<'OPERATIONAL' | 'ANALYTICAL'>('OPERATIONAL');
  const [showQuickHelp, setShowQuickHelp] = useState(false);

  const handleNav = (tab: NavigationTab) => {
    if (onNavigateTab) onNavigateTab(tab);
    else if (onNavigate) onNavigate(tab);
  };

  const sessions = upcomingInterviews || interviews || initialInterviews;

  // Calculate distribution across the 7 recruitment steps
  const stepCounts = {
    step1: candidates.filter(c => (c.currentStep || 1) === 1).length,
    step2: candidates.filter(c => c.currentStep === 2).length,
    step3: candidates.filter(c => c.currentStep === 3).length,
    step4: candidates.filter(c => c.currentStep === 4).length,
    step5: candidates.filter(c => c.currentStep === 5).length,
    step6: candidates.filter(c => c.currentStep === 6).length,
    step7: candidates.filter(c => c.currentStep === 7).length,
  };

  // Immediate pending action items for users
  const pendingVideos = candidates.filter(
    c => c.currentStep === 3 && (c.step3?.videoSubmissionStatus === 'PENDING' || !c.step3?.videoSubmissionStatus)
  ).length;
  const receivedVideosToReview = candidates.filter(
    c => c.currentStep === 3 && c.step3?.videoSubmissionStatus === 'RECEIVED'
  ).length;
  const unreviewedPhone = candidates.filter(c => c.currentStep === 4).length;

  // SVG mini-sparkline component
  const renderSparkline = (data: number[], isPositive: boolean) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 28;
    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={isPositive ? '#16A34A' : '#E11D48'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Welcome & Primary Command Header */}
      <div className="bg-gradient-to-l from-slate-900 via-blue-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              {isFa ? 'سامانه یکپارچه جذب و استخدام پناپ' : 'PANAP Talent Management Platform'}
            </span>
            <button
              onClick={() => setShowQuickHelp(!showQuickHelp)}
              className="text-xs text-blue-300 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/15 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showQuickHelp ? 'بستن راهنما' : 'راهنمای کاربری قدم اول'}</span>
            </button>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {isFa ? 'میز کار هوشمند جذب و ارزیابی شایستگی‌ها' : 'Talent Acquisition & Assessment Workspace'}
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 max-w-2xl font-medium leading-relaxed">
            {isFa 
              ? `دسترسی سریع به بانک کارجویان، پیگیری گام‌های ۷ گانه جذب، دریافت ویدیوها و هماهنگی مصاحبه‌های استخدامی شرکت پناپ.`
              : `Fast access to candidates pool, 7-step hiring lifecycle, video submissions, and interview rounds.`}
          </p>
        </div>

        {/* View Switcher & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto">
          {/* View Mode Toggle */}
          <div className="bg-slate-800/90 p-1 rounded-2xl border border-slate-700 flex items-center self-start sm:self-auto">
            <button
              onClick={() => setDashboardMode('OPERATIONAL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                dashboardMode === 'OPERATIONAL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isFa ? 'میز کار روزانه (ساده)' : 'Action Desk'}</span>
            </button>
            <button
              onClick={() => setDashboardMode('ANALYTICAL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                dashboardMode === 'ANALYTICAL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isFa ? 'داشبورد تحلیلی' : 'Analytics'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenNewCandidate && (
              <button
                onClick={onOpenNewCandidate}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isFa ? 'ثبت متقاضی جدید' : 'New Candidate'}</span>
              </button>
            )}
            {onOpenExcelImport && (
              <button
                onClick={onOpenExcelImport}
                className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{isFa ? 'ورود اکسل' : 'Excel Import'}</span>
              </button>
            )}

            {/* System Documentation Excel Download Button */}
            <a
              href="/panap-ats-system-documentation.xlsx"
              download="panap-ats-system-documentation.xlsx"
              id="btn-dashboard-download-system-docs"
              title={isFa ? 'دانلود مستندات کامل ساختار سامانه، فرآیندها و پایگاه داده (فایل اکسل جامع ۶ برگه)' : 'Download Full System & DB Documentation (Excel)'}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600/90 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">{isFa ? 'مستندات سیستم (Excel)' : 'System Docs (Excel)'}</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Interactive Quick Start Guide for New Users */}
      {showQuickHelp && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white p-5 rounded-3xl border border-blue-200 shadow-sm space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-blue-100">
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              راهنمای شروع به کار سریع با سامانه (قدم اول):
            </h3>
            <button
              onClick={() => setShowQuickHelp(false)}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
            >
              متوجه شدم ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100/80 shadow-2xs space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">۱</div>
              <h4 className="text-xs font-bold text-slate-900">ثبت اطلاعات یا ورود اکسل</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                با دکمه «ورود اکسل» یا «ثبت متقاضی جدید» اطلاعات کارجویان را وارد کنید. رزومه‌ها به صورت خودکار در گام اول قرار می‌گیرند.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-blue-100/80 shadow-2xs space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">۲</div>
              <h4 className="text-xs font-bold text-slate-900">بانک کارجویان و پرونده ۷ مرحله‌ای</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                در منوی «بانک کارجویان»، با کلیک روی نام هر فرد پرونده او باز می‌شود. مراحل شامل فرم سایت، ارسال ویدیو و مصاحبه‌ها به ترتیب قابل پیگیری است.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-blue-100/80 shadow-2xs space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">۳</div>
              <h4 className="text-xs font-bold text-slate-900">ثبت ویدیو و برنامه‌ریزی مصاحبه</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                در گام ۳، زمان و پیام‌رسان ارسال ویدیو (بله، ایتا، روبیکا، تلگرام) را ثبت کنید و در گام‌های ۴ و ۵ زمان مصاحبه‌ها را هماهنگ فرمایید.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Four Core Action Gateways (میز کار اقدام سریع) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gateway 1: Candidates Pool */}
        <div 
          onClick={() => handleNav('CANDIDATES')}
          className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                {isFa ? 'بانک کارجویان' : 'Candidate Pool'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {isFa 
                  ? `مشاهده، غربالگری و مدیریت پرونده‌های استخدامی (${candidates.length} متقاضی فعال)`
                  : `Browse and evaluate all active candidates across all stages.`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-blue-600 border-t border-slate-100 pt-3">
            <span>{candidates.length} کارجو در جریان</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Gateway 2: Video Submission Review (گام ۳) */}
        <div 
          onClick={() => handleNav('CANDIDATES')}
          className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-400 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-600 transition-colors">
                {isFa ? 'ارزیابی ویدیوها (گام ۳)' : 'Video Submissions'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {isFa 
                  ? `بررسی ویدیوهای دریافتی از پیام‌رسان‌ها (بله، ایتا، روبیکا، تلگرام)`
                  : `Review and score introductory candidate videos from messengers.`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-purple-600 border-t border-slate-100 pt-3">
            <span>{stepCounts.step3} نفر در مرحله ویدیو</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Gateway 3: Interviews & Calendar */}
        <div 
          onClick={() => handleNav('INTERVIEWS')}
          className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                {isFa ? 'مرکز و تقویم مصاحبه‌ها' : 'Interviews Calendar'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {isFa 
                  ? `تقویم جلسات مصاحبه تلفنی و حضوری با متقاضیان برگزیده`
                  : `Schedule and record phone and in-person interviews.`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-amber-600 border-t border-slate-100 pt-3">
            <span>{sessions.length} مصاحبه تنظیم شده</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Gateway 4: Strategic Requisitions */}
        <div 
          onClick={() => handleNav('REQUISITIONS')}
          className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
                {isFa ? 'ردیف‌های شغلی باز' : 'Open Requisitions'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {isFa 
                  ? `مدیریت نیازهای استخدامی فعال و ظرفیت واحدهای سازمانی`
                  : `Strategic hiring requisitions and capacity planning.`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 border-t border-slate-100 pt-3">
            <span>{requisitions.length} موقعیت شغلی</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 4. Visual 7-Step Recruitment Roadmap (نقشه راهنمای گام‌به‌گام فرآیند جذب پناپ) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              {isFa ? 'نقشه راه گردش کار ۷ گام استخدام شرکت پناپ' : '7-Step Recruitment Lifecycle Roadmap'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isFa 
                ? 'برای مشاهده متقاضیان هر مرحله، می‌توانید مستقیماً روی هر گام کلیک کنید:'
                : 'Click any stage to filter candidates in that specific step:'}
            </p>
          </div>
          <button
            onClick={() => handleNav('CANDIDATES')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>مشاهده همه پرونده‌ها</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* 7 Interactive Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {[
            { step: 1, title: 'ثبت اولیه', desc: 'جابینجا / ایران‌تلنت', count: stepCounts.step1, color: 'border-slate-300 bg-slate-50/80 text-slate-800 hover:border-slate-400', badge: 'bg-slate-200 text-slate-800', icon: Briefcase },
            { step: 2, title: 'فرم سایت', desc: 'اطلاعات پرتال پناپ', count: stepCounts.step2, color: 'border-sky-200 bg-sky-50/70 text-sky-900 hover:border-sky-400', badge: 'bg-sky-200 text-sky-800', icon: Send },
            { step: 3, title: 'ارسال ویدیو', desc: 'بله، ایتا، تلگرام...', count: stepCounts.step3, color: 'border-purple-200 bg-purple-50/70 text-purple-900 hover:border-purple-400', badge: 'bg-purple-200 text-purple-800', icon: Video },
            { step: 4, title: 'مصاحبه تلفنی', desc: 'غربالگری مهارت‌ها', count: stepCounts.step4, color: 'border-blue-200 bg-blue-50/70 text-blue-900 hover:border-blue-400', badge: 'bg-blue-200 text-blue-800', icon: Phone },
            { step: 5, title: 'مصاحبه حضوری', desc: 'ارزیابی تخصصی', count: stepCounts.step5, color: 'border-amber-200 bg-amber-50/70 text-amber-900 hover:border-amber-400', badge: 'bg-amber-200 text-amber-800', icon: Building },
            { step: 6, title: 'استعلام سوابق', desc: 'پیشزمینه و معرف‌ها', count: stepCounts.step6, color: 'border-emerald-200 bg-emerald-50/70 text-emerald-900 hover:border-emerald-400', badge: 'bg-emerald-200 text-emerald-800', icon: ShieldCheck },
            { step: 7, title: 'استخدام قطعی', desc: 'قرارداد و جذب نهایی', count: stepCounts.step7, color: 'border-green-300 bg-green-50/80 text-green-900 hover:border-green-400', badge: 'bg-green-200 text-green-800', icon: Award },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                onClick={() => handleNav('CANDIDATES')}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 hover:shadow-sm ${item.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black font-mono">گام {item.step}</span>
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs leading-snug">{item.title}</h4>
                  <p className="text-[10px] opacity-75 mt-0.5 truncate">{item.desc}</p>
                </div>
                <div className="pt-1 flex items-center justify-between border-t border-current/10">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${item.badge}`}>
                    {item.count} نفر
                  </span>
                  <ChevronLeft className="w-3 h-3 opacity-60" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Conditional View: Operational Actions vs Analytics */}
      {dashboardMode === 'ANALYTICAL' ? (
        /* ANALYTICAL KPI VIEW */
        <div className="space-y-6 animate-in fade-in">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m: any, mIdx: number) => (
              <div
                key={`${m.id || 'metric'}-${mIdx}`}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {isFa ? m.titleFa : m.titleEn}
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    {renderSparkline(m.sparkline || [10, 15, 20], m.isPositive)}
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                    {m.value}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      m.isPositive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {m.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{isFa ? m.changeFa : m.changeEn}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Funnel Stage Distribution & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recruitment Funnel */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    {isFa ? 'قیف تبدیل و جریان مراحل استخدام (Recruitment Funnel)' : 'Recruitment Conversion Funnel'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isFa ? 'نرخ ریزش و گذار از رزومه اولیه تا قرارداد استخدام قطعی' : 'Stage progression from initial application to offer signed'}
                  </p>
                </div>
                <button
                  onClick={() => handleNav('ANALYTICS')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>{isFa ? 'تحلیل تفصیلی' : 'Deep Analytics'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {funnelStages.map((stage: any, idx: number) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: stage.color }}
                        ></span>
                        <span className="text-slate-800">{isFa ? (stage.nameFa || stage.label) : (stage.nameEn || stage.label)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono">{stage.count} نفر</span>
                        <span className="text-slate-900 font-black w-10 text-left font-mono">{stage.percentage}٪</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${stage.percentage}%`,
                          backgroundColor: stage.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Requisitions Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-extrabold text-base text-slate-900">
                    {isFa ? 'موقعیت‌های شغلی کلیدی' : 'Urgent Requisitions'}
                  </h4>
                  <button
                    onClick={() => handleNav('REQUISITIONS')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    {isFa ? 'مشاهده همه' : 'View All'}
                  </button>
                </div>

                <div className="space-y-3 mt-4">
                  {requisitions.slice(0, 3).map((req, rIdx) => (
                    <div
                      key={`${req.id || 'req'}-${rIdx}`}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{req.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          req.priority === 'URGENT' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{req.department}</span>
                        <span className="font-bold text-slate-700">{req.filledPositions} از {req.openPositions} جذب شده</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleNav('REQUISITIONS')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-slate-600" />
                  <span>{isFa ? 'مدیریت کلیه ردیف‌های شغلی' : 'Manage Requisitions'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* OPERATIONAL ACTION DESK (سهولت استفاده روزانه) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          {/* Scheduled Assessment Interviews */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-blue-600" />
                <h4 className="font-extrabold text-base text-slate-900">
                  {isFa ? 'جلسات مصاحبه و ارزیابی پیش‌رو' : 'Upcoming Assessment Sessions'}
                </h4>
              </div>
              <button
                onClick={() => handleNav('INTERVIEWS')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
              >
                <span>{isFa ? 'تقویم مصاحبه‌ها' : 'Calendar'}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {sessions.slice(0, 3).map((round, sIdx) => (
                <div
                  key={`${round.id || 'round'}-${sIdx}`}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{round.candidateName}</span>
                      <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-semibold border border-blue-100">
                        {round.candidateRole}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{round.stageName}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1 font-mono font-bold text-slate-600">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {round.dateTime}
                      </span>
                      <span>({round.durationMinutes} دقیقه)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {round.isCompleted ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isFa ? 'ارزیابی ثبت شد' : 'Evaluated'}
                      </span>
                    ) : (
                      onOpenScorecard && (
                        <button
                          onClick={() => onOpenScorecard(round)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>{isFa ? 'ثبت کارنامه' : 'Scorecard'}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Candidates Highlight */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h4 className="font-extrabold text-base text-slate-900">
                  {isFa ? 'پرونده‌های فعال جهت ارزیابی' : 'Active Candidates to Review'}
                </h4>
              </div>
              <button
                onClick={() => handleNav('CANDIDATES')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
              >
                <span>{isFa ? 'مشاهده همه' : 'View All'}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {candidates.slice(0, 3).map((cand, cIdx) => (
                <div
                  key={`${cand.id || 'cand'}-${cIdx}`}
                  onClick={() => onSelectCandidate && onSelectCandidate(cand)}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {cand.name[0]}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{cand.name}</h5>
                      <p className="text-[11px] text-slate-500 font-medium">{cand.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                          گام {cand.currentStep || 1}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {cand.experienceYears} سال سابقه
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-600 font-bold hidden sm:inline">مشاهده پرونده</span>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
