import React, { useState, useMemo } from 'react';
import { 
  Candidate, 
  CandidateTimelineEvent, 
  TimelineEventType, 
  RecruitmentStepNumber, 
  AppUser 
} from '../types';
import { 
  buildCandidateFullTimeline, 
  appendCandidateHistoryEvent, 
  getPersianDateTimeNow 
} from '../utils/candidateHistory';
import { 
  Clock, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Award, 
  FastForward, 
  XCircle, 
  Trophy, 
  UserCheck, 
  Layers, 
  Plus, 
  ArrowUpDown, 
  Printer, 
  Send, 
  ShieldCheck, 
  Filter,
  Check
} from 'lucide-react';

interface CandidateHistoryTimelineProps {
  candidate: Candidate;
  onUpdateCandidate: (updated: Candidate) => void;
  currentUser?: AppUser;
  isFa?: boolean;
}

export const CandidateHistoryTimeline: React.FC<CandidateHistoryTimelineProps> = ({
  candidate,
  onUpdateCandidate,
  currentUser,
  isFa = true,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form for adding custom timeline event
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<TimelineEventType>('NOTE_ADDED');
  const [newStep, setNewStep] = useState<RecruitmentStepNumber>(candidate.currentStep || 1);

  // Compute full chronological timeline
  const fullTimeline = useMemo(() => {
    return buildCandidateFullTimeline(candidate);
  }, [candidate]);

  // Filtered and sorted events
  const displayedEvents = useMemo(() => {
    let list = [...fullTimeline];

    if (filterType === 'STEPS') {
      list = list.filter(e => e.type === 'STEP_CHANGE' || e.type === 'STEP_SKIPPED' || e.type === 'APPLIED');
    } else if (filterType === 'INTERVIEWS') {
      list = list.filter(e => e.type === 'INTERVIEW_SCHEDULED' || e.type === 'INTERVIEW_COMPLETED');
    } else if (filterType === 'SCORES') {
      list = list.filter(e => e.type === 'SCORE_RECORDED' || e.type === 'DOCUMENT_UPLOADED');
    } else if (filterType === 'NOTES') {
      list = list.filter(e => e.type === 'NOTE_ADDED');
    } else if (filterType === 'OUTCOMES') {
      list = list.filter(e => e.type === 'REJECTION' || e.type === 'HIRED' || e.type === 'STATUS_CHANGE');
    }

    if (sortOrder === 'OLDEST') {
      list.reverse();
    }

    return list;
  }, [fullTimeline, filterType, sortOrder]);

  const handleAddNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const actorName = currentUser?.name || 'کارشناس ارزیابی جذب';
    const updated = appendCandidateHistoryEvent(candidate, {
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      stepNumber: newStep,
      type: newType,
      actor: actorName,
    });

    onUpdateCandidate(updated);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
    setToastMessage(isFa ? 'رویداد جدید با موفقیت به تاریخچه پرونده افزوده شد.' : 'Event added to timeline.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrintTimeline = () => {
    window.print();
  };

  const getEventVisuals = (type: TimelineEventType) => {
    switch (type) {
      case 'APPLIED':
        return {
          icon: <FileText className="w-4 h-4 text-blue-600" />,
          bg: 'bg-blue-100 border-blue-300',
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          labelFa: 'ثبت پرونده اولیه',
        };
      case 'STEP_CHANGE':
        return {
          icon: <Layers className="w-4 h-4 text-indigo-600" />,
          bg: 'bg-indigo-100 border-indigo-300',
          badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          labelFa: 'ارتقای گام فرآیند',
        };
      case 'STATUS_CHANGE':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-sky-600" />,
          bg: 'bg-sky-100 border-sky-300',
          badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
          labelFa: 'تغییر وضعیت',
        };
      case 'INTERVIEW_SCHEDULED':
        return {
          icon: <Calendar className="w-4 h-4 text-cyan-600" />,
          bg: 'bg-cyan-100 border-cyan-300',
          badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          labelFa: 'هماهنگی مصاحبه',
        };
      case 'INTERVIEW_COMPLETED':
        return {
          icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
          bg: 'bg-emerald-100 border-emerald-300',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          labelFa: 'انجام مصاحبه و ارزیابی',
        };
      case 'SCORE_RECORDED':
        return {
          icon: <Award className="w-4 h-4 text-amber-600" />,
          bg: 'bg-amber-100 border-amber-300',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          labelFa: 'ثبت کارنامه و امتیاز',
        };
      case 'DOCUMENT_UPLOADED':
        return {
          icon: <FileText className="w-4 h-4 text-teal-600" />,
          bg: 'bg-teal-100 border-teal-300',
          badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
          labelFa: 'بارگذاری مستندات / ویدیو',
        };
      case 'NOTE_ADDED':
        return {
          icon: <MessageSquare className="w-4 h-4 text-slate-600" />,
          bg: 'bg-slate-200 border-slate-300',
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          labelFa: 'یادداشت ارزیاب',
        };
      case 'STEP_SKIPPED':
        return {
          icon: <FastForward className="w-4 h-4 text-orange-600" />,
          bg: 'bg-orange-100 border-orange-300',
          badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
          labelFa: 'پرش مرحله (Fast-Track)',
        };
      case 'REJECTION':
        return {
          icon: <XCircle className="w-4 h-4 text-rose-600" />,
          bg: 'bg-rose-100 border-rose-300',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          labelFa: 'عدم احراز شرایط',
        };
      case 'HIRED':
        return {
          icon: <Trophy className="w-4 h-4 text-emerald-600" />,
          bg: 'bg-emerald-200 border-emerald-400',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          labelFa: 'استخدام نهایی',
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-slate-600" />,
          bg: 'bg-slate-100 border-slate-300',
          badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
          labelFa: 'رویداد سیستمی',
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white shadow-md flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary KPI Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-5 rounded-2xl border border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
            <h4 className="font-extrabold text-sm sm:text-base text-white">
              {isFa ? 'گاه‌شمار جامع و تاریخچه وقایع پرونده کارجو' : 'Candidate Complete Chronological Timeline'}
            </h4>
          </div>
          <p className="text-xs text-slate-300">
            {isFa 
              ? `ثبت شفاف کلیه گام‌های استخدامی، تغییرات وضعیت، جلسات مصاحبه و نظرات ارزیابان برای «${candidate.name}» (${candidate.role})`
              : `Audit log and timeline of recruitment stages, interviews and status updates for ${candidate.name}`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isFa ? 'ثبت رویداد جدید' : 'Add Event'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintTimeline}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title={isFa ? 'چاپ گزارش تاریخچه' : 'Print'}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isFa ? 'چاپ سوابق' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-bold">{isFa ? 'تعداد کل وقایع ثبت‌شده' : 'Total Events'}</div>
          <div className="text-lg font-black text-slate-900 mt-0.5 font-mono">{fullTimeline.length}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-bold">{isFa ? 'گام جاری پرونده' : 'Current Step'}</div>
          <div className="text-lg font-black text-blue-600 mt-0.5">
            گام {candidate.currentStep || 1} از ۷
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-bold">{isFa ? 'تاریخ ثبت درخواست' : 'Applied Date'}</div>
          <div className="text-sm font-black text-slate-800 mt-1 font-mono">
            {candidate.appliedDate || candidate.resumeSubmissionDate || '۱۴۰۳/۰۶/۰۱'}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-bold">{isFa ? 'وضعیت پرونده' : 'Status'}</div>
          <div className="text-xs font-black mt-1">
            {candidate.status === 'HIRED' && <span className="text-emerald-600">✓ استخدام قطعی</span>}
            {candidate.status === 'REJECTED' && <span className="text-rose-600">✕ عدم احراز شرایط</span>}
            {candidate.status === 'WITHDRAWN' && <span className="text-amber-600">⊘ انصراف کارجو</span>}
            {!['HIRED', 'REJECTED', 'WITHDRAWN'].includes(candidate.status) && (
              <span className="text-blue-600">⏳ در جریان فرآیند</span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{isFa ? 'فیلتر وقایع:' : 'Filter:'}</span>
          </span>
          {[
            { id: 'ALL', label: isFa ? 'همه وقایع' : 'All' },
            { id: 'STEPS', label: isFa ? 'تغییرات گام' : 'Steps' },
            { id: 'INTERVIEWS', label: isFa ? 'جلسات مصاحبه' : 'Interviews' },
            { id: 'SCORES', label: isFa ? 'ارزیابی و مدارک' : 'Assessments' },
            { id: 'NOTES', label: isFa ? 'یادداشت‌های ارزیاب' : 'Notes' },
            { id: 'OUTCOMES', label: isFa ? 'نتایج نهایی' : 'Outcomes' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort order toggle */}
        <button
          type="button"
          onClick={() => setSortOrder(prev => prev === 'NEWEST' ? 'OLDEST' : 'NEWEST')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>
            {sortOrder === 'NEWEST' 
              ? (isFa ? 'جدیدترین در ابتدا' : 'Newest First') 
              : (isFa ? 'قدیمی‌ترین در ابتدا' : 'Oldest First')}
          </span>
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        {displayedEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold">
              {isFa ? 'هیچ رویدادی با فیلتر انتخابی یافت نشد.' : 'No events found.'}
            </p>
          </div>
        ) : (
          <div className="relative border-r-2 border-slate-200 pr-6 space-y-6 mr-3">
            {displayedEvents.map((evt, idx) => {
              const visuals = getEventVisuals(evt.type);

              return (
                <div key={evt.id || idx} className="relative group">
                  {/* Timeline Dot on line */}
                  <div className={`absolute -right-[33px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${visuals.bg}`}>
                    {visuals.icon}
                  </div>

                  {/* Event Content Card */}
                  <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-4 transition-all shadow-2xs space-y-2">
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${visuals.badgeBg}`}>
                          {visuals.labelFa}
                        </span>

                        {evt.stepNumber && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                            گام {evt.stepNumber}
                          </span>
                        )}

                        <h5 className="font-extrabold text-sm text-slate-900">
                          {evt.title}
                        </h5>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{evt.timestamp}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {evt.description && (
                      <p className="text-xs text-slate-600 leading-relaxed pr-0.5">
                        {evt.description}
                      </p>
                    )}

                    {/* Footer / Actor */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span>{isFa ? 'ثبت‌کننده / مجری:' : 'Actor:'}</span>
                        <span className="font-bold text-slate-700">{evt.actor || 'سیستم سامانه'}</span>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">
                        شناسه: {evt.id}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Custom Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {isFa ? 'ثبت رویداد یا یادداشت جدید در تاریخچه پرونده' : 'Add Event to Timeline'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewEvent} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {isFa ? 'عنوان رویداد یا تغییر وضعیت:' : 'Event Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isFa ? 'مثال: تماس تلفنی با معرف اول - تأیید تعهد کاری' : 'e.g. Reference verified'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    {isFa ? 'نوع رویداد:' : 'Event Type:'}
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as TimelineEventType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="NOTE_ADDED">یادداشت ارزیاب</option>
                    <option value="INTERVIEW_SCHEDULED">هماهنگی مصاحبه</option>
                    <option value="INTERVIEW_COMPLETED">انجام مصاحبه و نتیجه</option>
                    <option value="SCORE_RECORDED">ثبت امتیاز یا کارنامه</option>
                    <option value="DOCUMENT_UPLOADED">بارگذاری مدرک یا استعلام</option>
                    <option value="STEP_CHANGE">تغییر گام فرآیند</option>
                    <option value="STATUS_CHANGE">تغییر وضعیت اداری</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    {isFa ? 'مرتبط با گام:' : 'Related Step:'}
                  </label>
                  <select
                    value={newStep}
                    onChange={(e) => setNewStep(Number(e.target.value) as RecruitmentStepNumber)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={1}>گام ۱: غربالگری رزومه</option>
                    <option value={2}>گام ۲: فرم سایت پناپ</option>
                    <option value={3}>گام ۳: ویدیوی معرفی</option>
                    <option value={4}>گام ۴: مصاحبه تلفنی</option>
                    <option value={5}>گام ۵: مصاحبه حضوری (سرمد)</option>
                    <option value={6}>گام ۶: استعلام سوابق</option>
                    <option value={7}>گام ۷: تصمیم نهایی و قرارداد</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {isFa ? 'شرح و جزئیات رویداد:' : 'Description:'}
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder={isFa ? 'جزئیات جلسه، مکالمه تلفنی، توافقات یا نظرات مصاحبه‌کننده...' : 'Details...'}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ثبت در تاریخچه</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
