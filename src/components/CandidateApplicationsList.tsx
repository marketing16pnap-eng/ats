import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Building2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Star, 
  FileText, 
  Sparkles, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Layers,
  ArrowDown,
  Info,
  Check
} from 'lucide-react';
import { Candidate, CandidatePreviousApplication, RECRUITMENT_STEPS } from '../types';
import { getCandidateApplicationHistory, getApplicationStatusColor } from '../utils/candidateApplications';

interface CandidateApplicationsListProps {
  candidate: Candidate;
  allCandidates?: Candidate[];
  onUpdateCandidate?: (updated: Candidate) => void;
  isFa?: boolean;
}

export const CandidateApplicationsList: React.FC<CandidateApplicationsListProps> = ({
  candidate,
  allCandidates = [],
  onUpdateCandidate,
  isFa = true,
}) => {
  const previousApps = getCandidateApplicationHistory(candidate, allCandidates);

  // New application record modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState(candidate.department || 'فنی و مهندسی');
  const [newDate, setNewDate] = useState('۱۴۰۲/۰۹/۱۵');
  const [newStatus, setNewStatus] = useState('رد شده در گام ۴ (مصاحبه تلفنی)');
  const [newSource, setNewSource] = useState('جابینجا');
  const [newStep, setNewStep] = useState<number>(4);
  const [newReason, setNewReason] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleSaveNewApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim() || !onUpdateCandidate) return;

    const newRecord: CandidatePreviousApplication = {
      id: `prev-app-${Date.now()}`,
      jobTitle: newRole.trim(),
      department: newDept.trim(),
      appliedDate: newDate.trim(),
      status: newStatus.trim(),
      stepReached: newStep,
      stepName: RECRUITMENT_STEPS.find(s => s.stepNumber === newStep)?.shortTitle,
      source: newSource.trim(),
      rejectionReason: newReason.trim() || undefined,
      notes: newNotes.trim() || undefined,
    };

    const currentApps = candidate.previousApplications || [];
    const updatedCandidate: Candidate = {
      ...candidate,
      previousApplications: [newRecord, ...currentApps],
    };

    onUpdateCandidate(updatedCandidate);
    setIsAddModalOpen(false);
    // Reset form
    setNewRole('');
    setNewReason('');
    setNewNotes('');
  };

  const handleDeleteApplication = (idToDelete: string) => {
    if (!onUpdateCandidate || !candidate.previousApplications) return;
    const updatedApps = candidate.previousApplications.filter(a => a.id !== idToDelete);
    onUpdateCandidate({
      ...candidate,
      previousApplications: updatedApps,
    });
  };

  const totalApplicationsCount = previousApps.length + 1; // current + previous

  return (
    <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
      {/* Header Summary Statistics Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-3xl border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-inner">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  سوابق ارسال رزومه متقاضی ({candidate.name})
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                  {totalApplicationsCount} مرتبه ارسال
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                تاریخچه کامل درخواست‌های همکاری و رزومه‌های ارسالی این کارجو برای موقعیت‌های شغلی مختلف در گروه پناپ. سوابق به ترتیب توالی زمانی و به صورت کارت‌های متصل به هم دسته‌بندی شده‌اند.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onUpdateCandidate && (
              <button
                type="button"
                id="btn-add-past-application"
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت سابقه ارسال رزومه قدیمی</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">مجموع درخواست‌ها:</span>
            <span className="text-base font-bold text-white font-mono">{totalApplicationsCount} مرتبه</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">موقعیت شغلی جاری:</span>
            <span className="text-sm font-bold text-blue-300 truncate block" title={candidate.role}>
              {candidate.role}
            </span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">تعداد سوابق قبلی:</span>
            <span className="text-base font-bold text-purple-300 font-mono">{previousApps.length} موقعیت</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">وضعیت تکرار رزومه:</span>
            <span className="text-xs font-bold text-amber-300">
              {previousApps.length > 0 ? 'کارجوی مستمر (ارسال چندباره)' : 'نخستین بار در پناپ'}
            </span>
          </div>
        </div>
      </div>

      {/* SEQUENTIAL CARDS (پشت سر هم) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>توالی زمانی درخواست‌های همکاری (از جدیدترین به قدیمی‌ترین)</span>
          </span>
          <span>تعداد: {totalApplicationsCount} پرونده</span>
        </div>

        {/* 1. CARD #1: CURRENT ACTIVE APPLICATION */}
        <div className="relative">
          <div className="p-5 bg-white rounded-3xl border-2 border-blue-500/80 shadow-md space-y-4 transition-all hover:shadow-lg">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  ۱
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-extrabold text-slate-900">
                      {candidate.role}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3 h-3" />
                      پرونده فعال جاری
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                      {candidate.trackingCode || candidate.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      واحد: {candidate.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      تاریخ ارسال رزومه: <strong className="font-mono text-slate-700">{candidate.appliedDate}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  گام {candidate.currentStep} از ۷ ({RECRUITMENT_STEPS.find(s => s.stepNumber === candidate.currentStep)?.shortTitle})
                </span>
              </div>
            </div>

            {/* Current Application Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
              <div>
                <span className="text-slate-400 block text-[11px]">بستر دریافت رزومه:</span>
                <span className="font-bold text-slate-800">{candidate.source || 'سایت پناپ'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">حقوق پیشنهادی کارجو:</span>
                <span className="font-bold text-slate-800">{candidate.requestedSalary || candidate.salaryExpectation || 'ثبت نشده'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">امتیاز تطابق اولیه:</span>
                <span className="font-bold text-emerald-600 font-mono">%{candidate.matchScore || 90}</span>
              </div>
            </div>

            {candidate.remarks && (
              <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">یادداشت ارزیابی پرونده جاری: </span>
                {candidate.remarks}
              </div>
            )}
          </div>

          {/* Sequential Connector Arrow if there are previous cards */}
          {previousApps.length > 0 && (
            <div className="flex items-center justify-center my-2">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-purple-300"></div>
                <div className="w-6 h-6 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-600 text-xs shadow-2xs">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
                <div className="w-0.5 h-4 bg-purple-300"></div>
              </div>
            </div>
          )}
        </div>

        {/* 2..N. PREVIOUS SUBMISSION CARDS (سوابق قبلی) */}
        {previousApps.map((app, index) => {
          const cardSequenceNum = index + 2;
          const statusColors = getApplicationStatusColor(app.status);

          return (
            <div key={app.id || index} className="relative">
              <div className="p-5 bg-white rounded-3xl border border-purple-200/90 hover:border-purple-300 shadow-xs hover:shadow-md transition-all space-y-4">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {cardSequenceNum}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900">
                          {app.jobTitle}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3 text-purple-600" />
                          ارسال قبلی (موقعیت دیگر)
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${statusColors.badgeBg} ${statusColors.badgeText} border ${statusColors.badgeBorder}`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        {app.department && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            واحد: {app.department}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          تاریخ ارسال: <strong className="font-mono text-purple-800 font-bold">{app.appliedDate}</strong>
                        </span>
                        {app.source && (
                          <span className="text-slate-400">
                            (از طریق {app.source})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {app.stepName && (
                      <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
                        آخرین گام: {app.stepName}
                      </span>
                    )}
                    {onUpdateCandidate && candidate.previousApplications?.some(a => a.id === app.id) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteApplication(app.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="حذف این سابقه از پرونده"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Details / Reasons */}
                {(app.rejectionReason || app.notes || app.salaryExpectation) && (
                  <div className="space-y-2 text-xs">
                    {app.rejectionReason && (
                      <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">علت خاتمه یا رد در این موقعیت: </span>
                          <span>{app.rejectionReason}</span>
                        </div>
                      </div>
                    )}

                    {app.notes && (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2">
                        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">توضیحات و بازخورد ارزیابی قبلی: </span>
                          <span>{app.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Connecting line between subsequent cards */}
              {index < previousApps.length - 1 && (
                <div className="flex items-center justify-center my-2">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-slate-300"></div>
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-500 text-[10px]">
                      <ArrowDown className="w-3 h-3" />
                    </div>
                    <div className="w-0.5 h-3 bg-slate-300"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state if candidate only has 1 application */}
        {previousApps.length === 0 && (
          <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-slate-800 text-sm">
              هیچ سابقه ارسال رزومه قبلی دیگری یافت نشد
            </h5>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              این کارجو تاکنون فقط برای موقعیت فعلی ({candidate.role}) رزومه ارسال کرده است. در صورت تمایل می‌توانید سوابق قدیمی خارج از سیستم را به صورت دستی ثبت نمایید.
            </p>
          </div>
        )}
      </div>

      {/* Modal: Add Past Application Record */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95" dir="rtl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-purple-700">
                <Briefcase className="w-5 h-5" />
                <h4 className="font-bold text-sm text-slate-900">
                  ثبت سابقه ارسال رزومه قبلی برای {candidate.name}
                </h4>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewApplication} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  عنوان موقعیت شغلی ارسالی قبلی *
                </label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="مثلاً کارشناس بازرگانی خارجی، مهندس ارشد فرانت‌اند..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    واحد سازمانی مربوطه
                  </label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    تاریخ ارسال رزومه *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="۱۴۰۲/۰۸/۱۴"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    وضعیت فرآیند در آن ارسال
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="رد شده در گام ۱ (رزومه اولیه)">رد شده در گام ۱ (رزومه اولیه)</option>
                    <option value="رد شده در گام ۲ (عدم تکمیل فرم)">رد شده در گام ۲ (عدم تکمیل فرم)</option>
                    <option value="رد شده در گام ۳ (ویدیو معرفی)">رد شده در گام ۳ (ویدیو معرفی)</option>
                    <option value="رد شده در گام ۴ (مصاحبه تلفنی)">رد شده در گام ۴ (مصاحبه تلفنی)</option>
                    <option value="رد شده در گام ۵ (مصاحبه حضوری)">رد شده در گام ۵ (مصاحبه حضوری)</option>
                    <option value="انصراف کارجو (عدم توافق)">انصراف کارجو (عدم توافق)</option>
                    <option value="استخدام شده در دوره آزمایشی">استخدام شده در دوره آزمایشی</option>
                    <option value="خاتمه همکاری قبلی">خاتمه همکاری قبلی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    بستر / منبع ارسال
                  </label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="جابینجا">جابینجا</option>
                    <option value="ای-استخدام">ای-استخدام</option>
                    <option value="سایت پناپ">سایت پناپ</option>
                    <option value="جاب ویژن">جاب ویژن</option>
                    <option value="لینکدین">لینکدین</option>
                    <option value="معرفی همکاران">معرفی همکاران</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  علت رد یا توضیحات عدم پذیرش (اختیاری)
                </label>
                <textarea
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="دلیل رد یا بازخورد مصاحبه‌کنندگان در آن زمان..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors cursor-pointer shadow-xs"
                >
                  ذخیره سابقه ارسال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
