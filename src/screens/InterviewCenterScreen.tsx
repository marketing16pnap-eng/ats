import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Plus, 
  Video, 
  Clock, 
  Users, 
  Award, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Edit3,
  Trash2,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Check,
  FileText,
  Phone,
  Building,
  Settings,
  Printer,
  ChevronRight,
  User,
  Star,
  CheckCircle,
  HelpCircle,
  CalendarDays
} from 'lucide-react';
import { InterviewRound, AppLanguage, InterviewStageConfig, InterviewType, Candidate } from '../types';
import { INTERVIEW_TYPE_OPTIONS } from '../components/NewInterviewStageModal';
import { InterviewCalendarView } from '../components/InterviewCalendarView';

interface InterviewCenterScreenProps {
  interviews: InterviewRound[];
  interviewStages: InterviewStageConfig[];
  candidates?: Candidate[];
  language: AppLanguage;
  onOpenScorecard: (interview: InterviewRound) => void;
  onOpenScheduleModal: () => void;
  onOpenNewStageModal: () => void;
  onEditStage: (stage: InterviewStageConfig) => void;
  onDeleteStage: (stageId: string) => void;
  onOpenPhoneForm?: (candidate: Candidate | null, mode?: 'FILL' | 'CUSTOMIZE_TEMPLATE') => void;
  onOpenInPersonForm?: (candidate: Candidate | null, mode?: 'FILL' | 'CUSTOMIZE_TEMPLATE') => void;
}

export const InterviewCenterScreen: React.FC<InterviewCenterScreenProps> = ({
  interviews,
  interviewStages,
  candidates = [],
  language,
  onOpenScorecard,
  onOpenScheduleModal,
  onOpenNewStageModal,
  onEditStage,
  onDeleteStage,
  onOpenPhoneForm,
  onOpenInPersonForm,
}) => {
  const isFa = language === 'PERSIAN';

  const [mainView, setMainView] = useState<'CALENDAR' | 'SESSIONS' | 'FORMS' | 'STAGES'>(() => {
    if (typeof window !== 'undefined') {
      const sub = (new URLSearchParams(window.location.search).get('subview') || '').toUpperCase();
      if (['CALENDAR', 'SESSIONS', 'FORMS', 'STAGES'].includes(sub)) {
        return sub as 'CALENDAR' | 'SESSIONS' | 'FORMS' | 'STAGES';
      }
    }
    return 'CALENDAR';
  });
  const [sessionsFilter, setSessionsFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const [stageTypeFilter, setStageTypeFilter] = useState<string>('ALL');
  const [stageSearch, setStageSearch] = useState('');

  // Selected candidate for quick form filling in FORMS tab
  const [selectedCandidateForForm, setSelectedCandidateForForm] = useState<string>(candidates[0]?.id || '');

  const filteredInterviews = interviews.filter((i) =>
    sessionsFilter === 'upcoming' ? !i.isCompleted : i.isCompleted
  );

  const filteredStages = interviewStages.filter((s) => {
    const matchesType = stageTypeFilter === 'ALL' || s.type === stageTypeFilter;
    const matchesSearch = 
      s.title.toLowerCase().includes(stageSearch.toLowerCase()) ||
      (s.titleEn && s.titleEn.toLowerCase().includes(stageSearch.toLowerCase())) ||
      s.description.toLowerCase().includes(stageSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeLabel = (type: InterviewType) => {
    const found = INTERVIEW_TYPE_OPTIONS.find((o) => o.type === type);
    return isFa ? (found?.labelFa || type) : (found?.labelEn || type);
  };

  const getCandidateById = (id: string) => candidates.find(c => c.id === id) || null;

  // Candidates who have completed phone or in-person forms
  const evaluatedCandidates = candidates.filter(c => c.phoneInterviewForm || c.inPersonInterviewForm || (c.step4 && c.step4.phoneTotalScore) || (c.step5 && c.step5.totalScore));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Main Navigation Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {/* 1. Full Page Calendar Tab */}
          <button
            onClick={() => setMainView('CALENDAR')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              mainView === 'CALENDAR'
                ? 'bg-white text-blue-700 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-4 h-4 shrink-0 text-blue-600" />
            <span>{isFa ? 'تقویم کل صفحه مصاحبه‌ها' : 'Full Calendar'}</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold">
              {interviews.length}
            </span>
          </button>

          {/* 2. Sessions List Tab */}
          <button
            onClick={() => setMainView('SESSIONS')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              mainView === 'SESSIONS'
                ? 'bg-white text-blue-700 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{isFa ? 'لیست جلسات و ارزیابی‌ها' : 'Sessions List'}</span>
          </button>

          {/* 3. Forms Tab */}
          <button
            onClick={() => setMainView('FORMS')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              mainView === 'FORMS'
                ? 'bg-white text-emerald-700 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{isFa ? 'فرم‌های ارزیابی و مصاحبه' : 'Assessment Forms'}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold">
              ۲ فرم رسمی
            </span>
          </button>

          {/* 4. Stages Tab */}
          <button
            onClick={() => setMainView('STAGES')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              mainView === 'STAGES'
                ? 'bg-white text-purple-700 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>{isFa ? 'مراحل و عناوین' : 'Stages & Types'}</span>
            <span className="bg-purple-100 text-purple-800 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold">
              {interviewStages.length}
            </span>
          </button>
        </div>

        {/* Action buttons matching view */}
        {mainView === 'CALENDAR' || mainView === 'SESSIONS' ? (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setMainView('FORMS')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isFa ? 'فرم‌های رسمی مصاحبه' : 'Official Forms'}</span>
            </button>
            <button
              onClick={onOpenScheduleModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isFa ? 'زمان‌بندی مصاحبه جدید' : 'Schedule Interview'}</span>
            </button>
          </div>
        ) : mainView === 'FORMS' ? (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => onOpenPhoneForm && onOpenPhoneForm(null, 'CUSTOMIZE_TEMPLATE')}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{isFa ? 'طراحی قالب فرم ۱ (تلفنی)' : 'Edit Phone Template'}</span>
            </button>
            <button
              onClick={() => onOpenInPersonForm && onOpenInPersonForm(null, 'CUSTOMIZE_TEMPLATE')}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{isFa ? 'طراحی قالب فرم ۲ (حضوری)' : 'Edit In-Person Template'}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onOpenNewStageModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isFa ? 'تعریف مرحله / عنوان جدید' : 'Create New Stage'}</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 0: FULL PAGE CALENDAR VIEW */}
      {mainView === 'CALENDAR' && (
        <InterviewCalendarView
          interviews={interviews}
          candidates={candidates}
          language={language}
          onOpenScorecard={onOpenScorecard}
          onOpenScheduleModal={onOpenScheduleModal}
        />
      )}

      {/* VIEW 1: SESSIONS */}
      {mainView === 'SESSIONS' && (
        <div className="space-y-6">
          {/* Subfilter for sessions */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSessionsFilter('upcoming')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sessionsFilter === 'upcoming'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isFa ? 'جلسات پیش‌رو و فعال' : 'Upcoming Sessions'} ({interviews.filter(i => !i.isCompleted).length})
              </button>
              <button
                onClick={() => setSessionsFilter('completed')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sessionsFilter === 'completed'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isFa ? 'ارزیابی‌های تکمیل‌شده' : 'Completed & Evaluated'} ({interviews.filter(i => i.isCompleted).length})
              </button>
            </div>

            <p className="text-xs text-slate-500 hidden sm:block">
              {isFa ? 'هماهنگی جلسات، ثبت اسکورکارت و دسترسی به فرم‌های رسمی' : 'Sync Google Meet, calendar & scorecards'}
            </p>
          </div>

          {/* Interviews List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredInterviews.length > 0 ? (
              filteredInterviews.map((round) => {
                const targetCand = candidates.find(c => c.name === round.candidateName || c.id === round.candidateId);

                return (
                  <div
                    key={round.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
                            <Video className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-base text-slate-900">{round.candidateName}</h4>
                            <p className="text-xs text-blue-700 font-semibold">{round.candidateRole}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">{round.id}</span>
                      </div>

                      <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">{round.stageName}</span>
                          <span className="text-slate-500 font-mono">{round.durationMinutes} دقیقه</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{round.dateTime}</span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1 text-xs">
                        <span className="text-slate-400 font-bold block">{isFa ? 'تیم مصاحبه‌کنندگان:' : 'Assessors:'}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {round.interviewers.map((intv, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                              {intv}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Scorecard or Form Status */}
                      {round.scorecard && (
                        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-800">
                              {isFa ? 'نتیجه کارنامه شایستگی:' : 'Scorecard Recommendation:'}
                            </span>
                            <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                              {round.scorecard.recommendation}
                            </span>
                          </div>
                          <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                            "{round.scorecard.feedback}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <a
                        href={round.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{isFa ? 'ورود به جلسه' : 'Join Room'}</span>
                      </a>

                      <div className="flex items-center gap-2">
                        {/* Quick Trigger for Form 1 / Form 2 */}
                        {targetCand && onOpenPhoneForm && (
                          <button
                            onClick={() => onOpenPhoneForm(targetCand, 'FILL')}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            title="تکمیل فرم ۱ مصاحبه تلفنی"
                          >
                            فرم ۱ (تلفنی)
                          </button>
                        )}

                        {targetCand && onOpenInPersonForm && (
                          <button
                            onClick={() => onOpenInPersonForm(targetCand, 'FILL')}
                            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            title="تکمیل فرم ۲ مصاحبه حضوری"
                          >
                            فرم ۲ (حضوری)
                          </button>
                        )}

                        {round.isCompleted ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isFa ? 'ارزیابی شد' : 'Evaluated'}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => onOpenScorecard(round)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>{isFa ? 'ثبت اسکورکارت' : 'Submit Score'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
                <CalendarCheck className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-600">
                  {isFa ? 'هیچ جلسه‌ای در این بخش یافت نشد.' : 'No sessions found in this view.'}
                </p>
                <button
                  onClick={onOpenScheduleModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isFa ? 'تنظیم مصاحبه جدید' : 'Schedule New Interview'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: FORMS HUB (فرم‌های ارزیابی و مصاحبه) */}
      {mainView === 'FORMS' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Quick Select Candidate Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">انتخاب کارجو جهت تکمیل یا بررسی فرم ارزیابی:</h4>
                <p className="text-[11px] text-slate-500">تمامی اطلاعات ثبت‌شده در این فرم‌ها مستقیماً در پرونده کارجو و گام‌های ۴ و ۵ ذخیره می‌شوند.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCandidateForForm}
                onChange={(e) => setSelectedCandidateForForm(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.role} ({c.currentStageFa || `گام ${c.currentStep || 1}`})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2 Official Form Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD 1: فرم ۱ – مصاحبه تلفنی */}
            <div className="bg-white rounded-3xl border-2 border-blue-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                        گام چهارم فرآیند جذب
                      </span>
                      <h3 className="font-black text-base text-slate-900 mt-1">فرم ۱ – مصاحبه تلفنی پناپ</h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  فرم استاندارد غربالگری تلفنی شامل <strong>۱۰ بخش ساختاریافته و ۲۰ سوال تخصصی و روانشناختی</strong> با اهداف ارزیابی مشخص، نقاط قوت و ضعف، امتیازدهی ۱ تا ۱۰ و توصیه نهایی.
                </p>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-700">
                    <span>تعداد سرفصل‌ها:</span>
                    <span className="font-bold text-slate-900">۱۰ سرفصل ارزیابی</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>تعداد سوالات استاندارد:</span>
                    <span className="font-bold text-blue-700 font-mono">۲۰ سوال همراه با هدف طرح</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>سازگاری با پرونده:</span>
                    <span className="font-bold text-emerald-700">همگام‌سازی مستقیم با گام ۴ کارجو</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    const target = getCandidateById(selectedCandidateForForm) || candidates[0] || null;
                    if (onOpenPhoneForm && target) {
                      onOpenPhoneForm(target, 'FILL');
                    }
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  تکمیل فرم تلفنی برای کارجوی انتخابی
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenPhoneForm && onOpenPhoneForm(null, 'CUSTOMIZE_TEMPLATE')}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    ویرایش قالب و عناوین
                  </button>

                  <button
                    onClick={() => {
                      const target = getCandidateById(selectedCandidateForForm) || candidates[0] || null;
                      if (onOpenPhoneForm && target) {
                        onOpenPhoneForm(target, 'FILL');
                      }
                    }}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    چاپ / پیش‌نمایش فرم
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: فرم ۲ – مصاحبه حضوری */}
            <div className="bg-white rounded-3xl border-2 border-purple-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-bold shadow-md shadow-purple-700/20">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-200">
                        گام پنجم فرآیند جذب (سرمد ۳۰۷)
                      </span>
                      <h3 className="font-black text-base text-slate-900 mt-1">فرم ۲ – مصاحبه حضوری پناپ</h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  فرم ۲ صفحه‌ای مصاحبه حضوری شامل <strong>مشخصات کامل فردی و تحصیلی، ماتریس مهارت‌ها (۱ تا ۱۰)، جدول سوابق کاری ۳ ردیفه، پرسش‌های رفتاری و سازمانی، معرفی ۲ معرف و رضایت‌نامه استعلام</strong>.
                </p>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-700">
                    <span>ماتریس مهارت‌ها:</span>
                    <span className="font-bold text-slate-900">۱۰ مهارت نرم‌افزاری و عمومی</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>سوابق کاری و معرفین:</span>
                    <span className="font-bold text-purple-700">۳ سابقه کاری + ۲ معرف معتبر</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>سازگاری با پرونده:</span>
                    <span className="font-bold text-emerald-700">همگام‌سازی مستقیم با گام ۵ و ۶</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    const target = getCandidateById(selectedCandidateForForm) || candidates[0] || null;
                    if (onOpenInPersonForm && target) {
                      onOpenInPersonForm(target, 'FILL');
                    }
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  تکمیل فرم حضوری برای کارجوی انتخابی
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenInPersonForm && onOpenInPersonForm(null, 'CUSTOMIZE_TEMPLATE')}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    ویرایش قالب و عناوین
                  </button>

                  <button
                    onClick={() => {
                      const target = getCandidateById(selectedCandidateForForm) || candidates[0] || null;
                      if (onOpenInPersonForm && target) {
                        onOpenInPersonForm(target, 'FILL');
                      }
                    }}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    چاپ / پیش‌نمایش فرم
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Evaluations List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">سوابق ارزیابی‌ها و فرم‌های تکمیل‌شده کارجویان</h4>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {evaluatedCandidates.length} کارجو با ارزیابی ثبت‌شده
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                    <th className="p-3 font-bold">نام متقاضی</th>
                    <th className="p-3 font-bold">عنوان شغلی</th>
                    <th className="p-3 font-bold">گام جاری</th>
                    <th className="p-3 font-bold">وضعیت فرم ۱ (تلفنی)</th>
                    <th className="p-3 font-bold">وضعیت فرم ۲ (حضوری)</th>
                    <th className="p-3 font-bold text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((cand) => {
                    const hasPhone = !!cand.phoneInterviewForm || !!(cand.step4 && cand.step4.phoneTotalScore);
                    const hasInPerson = !!cand.inPersonInterviewForm || !!(cand.step5 && cand.step5.totalScore);

                    return (
                      <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{cand.name}</td>
                        <td className="p-3 text-blue-700 font-semibold">{cand.role}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                            {cand.currentStageFa || `گام ${cand.currentStep || 1}`}
                          </span>
                        </td>
                        <td className="p-3">
                          {hasPhone ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold text-[11px]">
                              <Check className="w-3 h-3" />
                              تکمیل‌شده (امتیاز: {cand.phoneInterviewForm?.totalScore || (cand.step4?.phoneTotalScore ? cand.step4.phoneTotalScore * 2 : 8)} از ۱۰)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">تکمیل‌نشده</span>
                          )}
                        </td>
                        <td className="p-3">
                          {hasInPerson ? (
                            <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 font-bold text-[11px]">
                              <Check className="w-3 h-3" />
                              تکمیل‌شده (نمره: {cand.inPersonInterviewForm?.interviewerRating || (cand.step5?.totalScore ? (cand.step5.totalScore / 7).toFixed(1) : 4.5)} از ۵)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">تکمیل‌نشده</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onOpenPhoneForm && onOpenPhoneForm(cand, 'FILL')}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              فرم ۱
                            </button>
                            <button
                              onClick={() => onOpenInPersonForm && onOpenInPersonForm(cand, 'FILL')}
                              className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              فرم ۲
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: STAGES & TYPES */}
      {mainView === 'STAGES' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">{isFa ? 'کل عناوین و مراحل' : 'Total Stages'}</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{interviewStages.length}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">{isFa ? 'جلسات مرتبط' : 'Linked Sessions'}</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{interviews.length}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">{isFa ? 'دسته‌بندی‌های استاندارد' : 'Standard Categories'}</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {new Set(interviewStages.map((s) => s.type)).size}{' '}
                  <span className="text-xs font-normal text-slate-500">{isFa ? 'نوع ارزیابی' : 'types'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[260px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={stageSearch}
                  onChange={(e) => setStageSearch(e.target.value)}
                  placeholder={isFa ? 'جستجو در عناوین، توضیحات و مراحل مصاحبه...' : 'Search stages, titles & criteria...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={stageTypeFilter}
                  onChange={(e) => setStageTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:bg-white"
                >
                  <option value="ALL">{isFa ? 'همه انواع مصاحبه' : 'All Interview Types'}</option>
                  {INTERVIEW_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.type} value={opt.type}>
                      {isFa ? opt.labelFa : opt.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={onOpenNewStageModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isFa ? '+ ایجاد مرحله / عنوان جدید' : '+ Create Stage'}</span>
            </button>
          </div>

          {/* Stages Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStages.map((stage) => (
              <div
                key={stage.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color || '#0058BE' }}
                      />
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {getTypeLabel(stage.type)}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{stage.id}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-purple-700 transition-colors">
                      {stage.title}
                    </h4>
                    {stage.titleEn && (
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{stage.titleEn}</p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {stage.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500">{isFa ? 'مدت زمان پیش‌فرض:' : 'Default Duration:'}</span>
                      <span className="font-mono font-bold text-slate-900">{stage.defaultDurationMinutes} {isFa ? 'دقیقه' : 'mins'}</span>
                    </div>
                    {stage.evaluatorsHint && (
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">{isFa ? 'ارزیاب پیشنهادی:' : 'Suggested Assessor:'}</span>
                        <span className="font-medium text-slate-900 truncate max-w-[150px]">{stage.evaluatorsHint}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditStage(stage)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title={isFa ? 'ویرایش مرحله' : 'Edit Stage'}
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{isFa ? 'ویرایش' : 'Edit'}</span>
                    </button>
                    <button
                      onClick={() => onDeleteStage(stage.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title={isFa ? 'حذف مرحله' : 'Delete Stage'}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{isFa ? 'حذف' : 'Delete'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onOpenScheduleModal();
                    }}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                  >
                    {isFa ? 'برنامه‌ریزی با این مرحله' : 'Schedule with this'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredStages.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <Layers className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">
                {isFa ? 'هیچ مرحله یا عنوان مصاحبه‌ای با این مشخصات یافت نشد.' : 'No interview stages found matching filters.'}
              </p>
              <button
                onClick={onOpenNewStageModal}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isFa ? 'تعریف اولین مرحله جدید' : 'Create New Stage'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
