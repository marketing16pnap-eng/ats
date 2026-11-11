import React, { useState, useMemo } from 'react';
import { 
  Candidate, 
  RecruitmentStepNumber, 
  AppLanguage 
} from '../types';
import { 
  buildCandidateFullTimeline, 
  appendCandidateHistoryEvent, 
  getPersianDateTimeNow 
} from '../utils/candidateHistory';
import { 
  User, 
  Briefcase, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  FileText, 
  Video, 
  Award, 
  Building2, 
  LogOut, 
  Printer, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  AlertCircle, 
  ChevronLeft, 
  HelpCircle,
  Hash,
  Share2,
  ExternalLink,
  Info
} from 'lucide-react';

interface CandidatePortalScreenProps {
  candidate: Candidate;
  companyLogo?: string;
  companyName?: string;
  companySubtitle?: string;
  onLogout: () => void;
  onUpdateCandidate?: (updated: Candidate) => void;
  language?: AppLanguage;
}

export const CandidatePortalScreen: React.FC<CandidatePortalScreenProps> = ({
  candidate,
  companyLogo,
  companyName = 'سامانه پناپ ATS',
  companySubtitle = 'سامانه یکپارچه مدیریت جذب و استخدام',
  onLogout,
  onUpdateCandidate,
  language = 'PERSIAN',
}) => {
  const isFa = language === 'PERSIAN';
  const [selectedStepDetail, setSelectedStepDetail] = useState<RecruitmentStepNumber>(candidate.currentStep || 1);
  const [activeTab, setActiveTab] = useState<'ROADMAP' | 'TIMELINE' | 'MESSAGES'>('ROADMAP');
  
  // Message submission to recruitment team
  const [applicantMessage, setApplicantMessage] = useState('');
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const timelineEvents = useMemo(() => {
    return buildCandidateFullTimeline(candidate);
  }, [candidate]);

  const currentStep = candidate.currentStep || 1;
  const isHired = candidate.status === 'HIRED';
  const isRejected = candidate.status === 'REJECTED';
  const isWithdrawn = candidate.status === 'WITHDRAWN';

  const stepsConfig = [
    {
      num: 1 as RecruitmentStepNumber,
      title: 'غربالگری اولیه رزومه',
      titleEn: 'Resume Screening',
      desc: 'بررسی مدارک تحصیلی، رزومه و تطابق اولیه شایستگی‌ها',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      num: 2 as RecruitmentStepNumber,
      title: 'تکمیل اطلاعات در سایت',
      titleEn: 'Portal Profile Completion',
      desc: 'ثبت اطلاعات تکمیلی و انتظارات شغلی در فرم سامانه',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      num: 3 as RecruitmentStepNumber,
      title: 'ارسال ویدیوی معرفی کوتاه',
      titleEn: 'Video Introduction',
      desc: 'پاسخ ویدیویی ۳ دقیقه‌ای به پرسش‌های ارزیابی شایستگی',
      icon: <Video className="w-4 h-4" />,
    },
    {
      num: 4 as RecruitmentStepNumber,
      title: 'مصاحبه تلفنی شایستگی',
      titleEn: 'Structured Phone Screening',
      desc: 'گفتگوی تلفنی ۲۰ دقیقه‌ای با کارشناس ارزیابی پناپ',
      icon: <Phone className="w-4 h-4" />,
    },
    {
      num: 5 as RecruitmentStepNumber,
      title: 'کانون ارزیابی و مصاحبه حضوری',
      titleEn: 'Assessment Center (Sarmad)',
      desc: 'مصاحبه تخصصی و آزمون عملی در دفتر مرکزی مجتمع سرمد',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      num: 6 as RecruitmentStepNumber,
      title: 'استعلام سوابق و آزمون‌ها',
      titleEn: 'Background & References',
      desc: 'تماس با معرفین پیشین و آزمون‌های رفتاری تکمیلی',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      num: 7 as RecruitmentStepNumber,
      title: 'پیشنهاد کار و قرارداد نهایی',
      titleEn: 'Final Offer & Contract',
      desc: 'تصویب کمیته عالی جذب و عقد قرارداد رسمی همکاری',
      icon: <Award className="w-4 h-4" />,
    },
  ];

  const handleCopyTrackingCode = () => {
    if (candidate.trackingCode) {
      navigator.clipboard.writeText(candidate.trackingCode);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2500);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantMessage.trim()) return;

    if (onUpdateCandidate) {
      const dt = getPersianDateTimeNow();
      const updated = appendCandidateHistoryEvent(candidate, {
        title: 'پیام ارسالی کارجو به تیم جذب',
        titleEn: 'Message Sent by Candidate',
        description: applicantMessage.trim(),
        stepNumber: candidate.currentStep,
        type: 'NOTE_ADDED',
        actor: `کارجو (${candidate.name})`,
      });

      // Also append to notes
      const existingNotes = candidate.notes || [];
      updated.notes = [...existingNotes, `[پیام کارجو ${dt.full}]: ${applicantMessage.trim()}`];

      onUpdateCandidate(updated);
    }

    setMessageSubmitted(true);
    setApplicantMessage('');
    setTimeout(() => setMessageSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 flex flex-col font-sans select-none antialiased" dir="rtl">
      
      {/* Top Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt={companyName} 
              className="h-10 w-auto max-w-[120px] object-contain rounded-lg p-1 bg-white" 
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-white tracking-tight">
                {companyName}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                پرتال پیگیری استخدام
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {companySubtitle}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="چاپ کارنامه فرآیند استخدام"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">چاپ کارنامه</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="خروج از پرتال پیگیری"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Candidate Profile & Status Hero Card */}
        <div className="bg-slate-850/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Candidate Identity */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0">
                {candidate.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {candidate.name}
                  </h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold">
                    متقاضی موقعیت شغلی {candidate.role}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    واحد: {candidate.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    تاریخ ثبت رزومه: {candidate.appliedDate || candidate.resumeSubmissionDate || '۱۴۰۳/۰۶/۰۱'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    تلفن: {candidate.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking Code and Current Status Badge */}
            <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
              {/* Tracking Code */}
              <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-700/80 shadow-xs">
                <div className="text-[11px] text-slate-400">کد رهگیری:</div>
                <span className="font-mono text-sm font-black text-emerald-400">
                  {candidate.trackingCode || 'REF-3766'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTrackingCode}
                  className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
                  title="کپی کد رهگیری"
                >
                  {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Status Pill */}
              <div>
                {isHired && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                    <CheckCircle2 className="w-4 h-4" />
                    استخدام نهایی و تایید شده
                  </span>
                )}
                {isRejected && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black">
                    <AlertCircle className="w-4 h-4" />
                    عدم احراز شرایط در این مرحله
                  </span>
                )}
                {isWithdrawn && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
                    <Info className="w-4 h-4" />
                    انصراف ثبت‌شده توسط کارجو
                  </span>
                )}
                {!isHired && !isRejected && !isWithdrawn && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-black">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                    در جریان ارزیابی (گام {currentStep} از ۷)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('ROADMAP')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ROADMAP'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>نقشه مسیر فرآیند استخدام (گام‌های ۱ تا ۷)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TIMELINE')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'TIMELINE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>گاه‌شمار وقایع و تاریخچه روند ({timelineEvents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MESSAGES')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'MESSAGES'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>ارتباط با تیم جذب و ارسال پیام</span>
          </button>
        </div>

        {/* TAB 1: ROADMAP */}
        {activeTab === 'ROADMAP' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 7-Step Visual Progression Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
              <h3 className="text-sm font-black text-slate-200 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>مراحل شفاف فرآیند جذب و وضعیت هر مرحله:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
                {stepsConfig.map((s) => {
                  const isCompleted = s.num < currentStep || isHired;
                  const isStepCurrent = s.num === currentStep && !isHired && !isRejected;
                  const isSelected = s.num === selectedStepDetail;
                  const isSkipped = candidate.skippedSteps?.includes(s.num);

                  let statusBadge = (
                    <span className="text-[10px] text-slate-500 font-bold">در انتظار</span>
                  );

                  if (isCompleted) {
                    statusBadge = (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> تکمیل شد
                      </span>
                    );
                  } else if (isSkipped) {
                    statusBadge = (
                      <span className="text-[10px] text-amber-400 font-bold">پرش سریع</span>
                    );
                  } else if (isStepCurrent) {
                    statusBadge = (
                      <span className="text-[10px] text-blue-400 font-black flex items-center gap-1 animate-pulse">
                        ● مرحله جاری
                      </span>
                    );
                  }

                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setSelectedStepDetail(s.num)}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                        isSelected
                          ? 'bg-blue-900/30 border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                          : 'bg-slate-850/60 hover:bg-slate-800 border-slate-800'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                            isCompleted 
                              ? 'bg-emerald-500 text-slate-950' 
                              : isStepCurrent 
                              ? 'bg-blue-500 text-white ring-2 ring-blue-400/50' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isCompleted ? '✓' : s.num}
                          </span>
                          {statusBadge}
                        </div>

                        <div className="text-xs font-black text-slate-200 line-clamp-1">
                          {s.title}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 line-clamp-2 mt-2">
                        {s.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Step Detailed Card */}
            {(() => {
              const step = stepsConfig.find(s => s.num === selectedStepDetail) || stepsConfig[0];
              const isPast = step.num < currentStep || isHired;
              const isCurrentActive = step.num === currentStep && !isHired && !isRejected;

              return (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-xl font-black">
                        {step.num}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base sm:text-lg font-black text-white">
                            گام {step.num}: {step.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">({step.titleEn})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isPast && (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          این مرحله با موفقیت سپری شده است
                        </span>
                      )}
                      {isCurrentActive && (
                        <span className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                          <Clock className="w-4 h-4" />
                          پرونده هم‌اکنون در این مرحله قرار دارد
                        </span>
                      )}
                      {!isPast && !isCurrentActive && (
                        <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold">
                          در نوبت بررسی پس از مراحل قبل
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Step 4 Guidance (Phone Interview) */}
                  {step.num === 4 && (
                    <div className="bg-slate-850 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                      <h5 className="text-xs font-black text-slate-200 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-400" />
                        <span>اطلاعات جلسه مصاحبه تلفنی:</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block text-[11px]">تاریخ مصاحبه:</span>
                          <span className="font-black text-slate-200 mt-1 block">
                            {candidate.step4?.phoneInterviewDate || 'در حال هماهنگی با کارجو'}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block text-[11px]">ساعت مصاحبه:</span>
                          <span className="font-black text-slate-200 mt-1 block">
                            {candidate.step4?.phoneInterviewTime || '۱۰:۳۰ صبح'}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block text-[11px]">ارزیاب مسئول:</span>
                          <span className="font-black text-slate-200 mt-1 block">
                            {candidate.step4?.scheduledBy || 'کارشناس ارزیابی پناپ'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        💡 نکته: در زمان تعیین شده، همکاران ما با شماره همراه ثبت‌شده تماس خواهند گرفت. لطفاً در محیطی آرام با پوشش آنتن مناسب حضور داشته باشید.
                      </p>
                    </div>
                  )}

                  {/* Step 5 Guidance (In-Person Interview at Sarmad Complex) */}
                  {step.num === 5 && (
                    <div className="bg-slate-850 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                      <h5 className="text-xs font-black text-slate-200 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span>محل و جزئیات کانون ارزیابی و مصاحبه حضوری:</span>
                      </h5>
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                          <Building2 className="w-4 h-4 text-purple-400" />
                          <span>دفتر مرکزی پناپ - کانون ارزیابی شایستگی</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-mono">
                          {candidate.step5?.location || 'خیابان سنایی-میدان صاحب الزمان- نبش سنایی7- ورودی شماره یک مجتمع سرمد- طبقه سوم- واحد 307'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                          <span>تاریخ جلسه: <strong className="text-white">{candidate.step5?.interviewDate || '۱۴۰۳/۰۶/۱۵'}</strong></span>
                          <span>ساعت حضور: <strong className="text-white">{candidate.step5?.interviewTime || '۱۴:۰۰'}</strong></span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        📄 مدارک لازم جهت همراه داشتن: اصل کارت ملی، کپی آخرین مدرک تحصیلی و در صورت امکان نمونه کارهای اجرایی.
                      </p>
                    </div>
                  )}

                  {/* Step 7 Guidance (Hired) */}
                  {step.num === 7 && isHired && (
                    <div className="bg-emerald-950/40 p-5 rounded-2xl border border-emerald-500/40 space-y-2 text-emerald-200">
                      <div className="flex items-center gap-2 text-sm font-black">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        <span>تبریک! شما در فرآیند جذب پناپ پذیرفته شده‌اید.</span>
                      </div>
                      <p className="text-xs leading-relaxed">
                        کمیته جذب پناپ با اشتیاق درخواست همکاری شما را تصویب نموده است. قرارداد رسمی و هماهنگی‌های ورود به سازمان از طریق کارشناسان منابع انسانی با شما پیگیری خواهد شد.
                      </p>
                    </div>
                  )}

                  {/* General Step Guidance */}
                  <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
                    <p>
                      فرآیند جذب در سامانه پناپ به‌صورت کاملاً ساختاریافته و بر مبنای ارزیابی شایستگی‌های شغلی صورت می‌پذیرد. هر تغییر در وضعیت پرونده شما، بلافاصله در این پرتال به‌روزرسانی شده و از طریق پیامک نیز اطلاع‌رسانی خواهد شد.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: TIMELINE */}
        {activeTab === 'TIMELINE' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>گاه‌شمار لحظه‌ای سوابق پرونده شما</span>
                </h3>
                <p className="text-xs text-slate-400">
                  کلیه مراحل طی شده از زمان ثبت رزومه تا وضعیت فعلی به ترتیب زمانی
                </p>
              </div>

              <div className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl">
                {timelineEvents.length} رویداد ثبت‌شده
              </div>
            </div>

            <div className="relative border-r-2 border-slate-800 pr-6 space-y-6 mr-3">
              {timelineEvents.map((evt, idx) => (
                <div key={evt.id || idx} className="relative group">
                  <div className="absolute -right-[33px] top-1.5 w-6 h-6 rounded-full bg-blue-600 text-white border-2 border-slate-900 flex items-center justify-center text-[10px] font-black shadow-md">
                    {evt.stepNumber || '●'}
                  </div>

                  <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h5 className="text-xs font-black text-slate-200">
                        {evt.title}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                        {evt.timestamp}
                      </span>
                    </div>

                    {evt.description && (
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {evt.description}
                      </p>
                    )}

                    <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                      <span>ثبت توسط: {evt.actor || 'سیستم سامانه'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MESSAGES / SUPPORT */}
        {activeTab === 'MESSAGES' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>ارسال پیام و پیگیری مستقیم با تیم جذب</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                در صورت نیاز به تغییر زمان مصاحبه، ارسال مدارک تکمیلی، یا هرگونه پرسش می‌توانید پیام خود را در این بخش ارسال فرمایید.
              </p>
            </div>

            {messageSubmitted && (
              <div className="p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>پیام شما با موفقیت در پرونده ثبت شد و کارشناسان جذب آن را بررسی خواهند کرد.</span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  متن پیام یا توضیحات کارجو:
                </label>
                <textarea
                  rows={4}
                  required
                  value={applicantMessage}
                  onChange={(e) => setApplicantMessage(e.target.value)}
                  placeholder="مثال: با سلام، در خصوص زمان مصاحبه حضوری روز سه‌شنبه، آیا امکان برگزاری در نوبت صبح وجود دارد؟ با تشکر..."
                  className="w-full p-4 rounded-2xl bg-slate-850 border border-slate-700 text-xs text-white leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  پیام مستقیماً در سوابق و کارتابل ارزیاب پرونده شما درج می‌گردد.
                </span>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ارسال پیام به تیم جذب</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>{companyName} — {companySubtitle}</p>
      </footer>
    </div>
  );
};
