import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Video, 
  User, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  Eye, 
  CalendarDays, 
  Layers, 
  Sparkles,
  Phone,
  Briefcase,
  X,
  Award
} from 'lucide-react';
import { InterviewRound, InterviewType, AppLanguage, Candidate } from '../types';
import { INTERVIEW_TYPE_OPTIONS } from './NewInterviewStageModal';

interface InterviewCalendarViewProps {
  interviews: InterviewRound[];
  candidates?: Candidate[];
  language: AppLanguage;
  onOpenScorecard: (interview: InterviewRound) => void;
  onOpenScheduleModal: () => void;
  onToggleComplete?: (interviewId: string) => void;
}

// Persian Month Names
const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const WEEK_DAYS_FA = [
  { key: 6, name: 'شنبه', short: 'ش' },
  { key: 0, name: 'یکشنبه', short: 'ی' },
  { key: 1, name: 'دوشنبه', short: 'د' },
  { key: 2, name: 'سه‌شنبه', short: 'س' },
  { key: 3, name: 'چهارشنبه', short: 'چ' },
  { key: 4, name: 'پنج‌شنبه', short: 'پ' },
  { key: 5, name: 'جمعه', short: 'ج' },
];

export const InterviewCalendarView: React.FC<InterviewCalendarViewProps> = ({
  interviews,
  candidates = [],
  language,
  onOpenScorecard,
  onOpenScheduleModal,
  onToggleComplete,
}) => {
  const isFa = language === 'PERSIAN';

  // Calendar State
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'DAY'>('MONTH');
  const [selectedPersianMonthIndex, setSelectedPersianMonthIndex] = useState(5); // 5 = شهریور (Current active demo month)
  const [persianYear, setPersianYear] = useState(1403);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(15); // Default selected day 15th
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');
  
  // Selected interview for modal inspection
  const [activeInterview, setActiveInterview] = useState<InterviewRound | null>(null);

  // Parse day number from interview round
  const getInterviewDay = (round: InterviewRound): number => {
    if (round.date) {
      const parts = round.date.split('/');
      if (parts.length === 3) {
        const d = parseInt(parts[2], 10);
        if (!isNaN(d)) return d;
      }
    }
    // Fallback based on id
    const num = parseInt(round.id.replace(/\D/g, ''), 10);
    return !isNaN(num) ? ((num % 28) + 1) : 15;
  };

  // Filtered interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const matchesSearch = 
        item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.candidateRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.stageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.interviewers && item.interviewers.some(inv => inv.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesType = typeFilter === 'ALL' || item.interviewType === typeFilter;
      
      const matchesStatus = 
        statusFilter === 'ALL' ? true :
        statusFilter === 'UPCOMING' ? !item.isCompleted :
        item.isCompleted;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [interviews, searchQuery, typeFilter, statusFilter]);

  // Group interviews by day of current month (1..31)
  const interviewsByDay = useMemo(() => {
    const map: Record<number, InterviewRound[]> = {};
    for (let d = 1; d <= 31; d++) {
      map[d] = [];
    }
    filteredInterviews.forEach((item) => {
      const day = getInterviewDay(item);
      if (map[day]) {
        map[day].push(item);
      }
    });
    return map;
  }, [filteredInterviews]);

  const handlePrevMonth = () => {
    if (selectedPersianMonthIndex === 0) {
      setSelectedPersianMonthIndex(11);
      setPersianYear((y) => y - 1);
    } else {
      setSelectedPersianMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedPersianMonthIndex === 11) {
      setSelectedPersianMonthIndex(0);
      setPersianYear((y) => y + 1);
    } else {
      setSelectedPersianMonthIndex((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    setSelectedPersianMonthIndex(5); // شهریور
    setPersianYear(1403);
    setSelectedDayNumber(15);
  };

  // Month days count (Farvardin-Shahrivar have 31 days, Mehr-Bahman 30, Esfand 29)
  const daysInCurrentMonth = selectedPersianMonthIndex < 6 ? 31 : selectedPersianMonthIndex < 11 ? 30 : 29;
  // Starting day offset for demonstration (e.g. 1st of Shahrivar 1403 was Thursday)
  const monthStartOffset = (selectedPersianMonthIndex * 2 + 5) % 7;

  // Type badge style
  const getTypeStyle = (type?: InterviewType) => {
    switch (type) {
      case 'TECHNICAL':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'LIVE_CODING':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'EXECUTIVE':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'CASE_STUDY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CULTURE_FIT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'FINAL_OFFER':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const currentMonthName = PERSIAN_MONTHS[selectedPersianMonthIndex];

  // Total statistics for calendar view
  const totalThisMonth = filteredInterviews.length;
  const completedThisMonth = filteredInterviews.filter(i => i.isCompleted).length;
  const upcomingThisMonth = totalThisMonth - completedThisMonth;

  return (
    <div className="space-y-4">
      {/* CALENDAR HEADER & CONTROLS */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Row 1: Title, Month Navigation, View Switcher & Action */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Calendar Month Selector */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
              <CalendarIcon className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {currentMonthName} {persianYear}
                </h2>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  (September - October)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isFa 
                  ? `تقویم جلسات مصاحبه و ارزیابی شایستگی • ${totalThisMonth} جلسه ثبت‌شده` 
                  : `Interview sessions calendar • ${totalThisMonth} sessions scheduled`}
              </p>
            </div>

            <div className="flex items-center gap-1 mr-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title={isFa ? 'ماه قبل' : 'Previous Month'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleGoToday}
                className="px-2.5 py-1 rounded-lg hover:bg-white text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                {isFa ? 'امروز' : 'Today'}
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title={isFa ? 'ماه بعد' : 'Next Month'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Controls: View Tabs & Schedule Button */}
          <div className="flex items-center gap-2.5 flex-wrap justify-end">
            {/* View Mode Toggle: Month, Week, Day */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/80">
              <button
                onClick={() => setViewMode('MONTH')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'MONTH'
                    ? 'bg-white text-blue-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isFa ? 'نمای ماهانه' : 'Month'}
              </button>
              <button
                onClick={() => setViewMode('WEEK')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'WEEK'
                    ? 'bg-white text-blue-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isFa ? 'نمای هفتگی' : 'Week'}
              </button>
              <button
                onClick={() => setViewMode('DAY')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'DAY'
                    ? 'bg-white text-blue-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isFa ? 'نمای روزانه' : 'Day'}
              </button>
            </div>

            {/* Quick Schedule Interview Button */}
            <button
              onClick={onOpenScheduleModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isFa ? 'زمان‌بندی مصاحبه جدید' : 'Schedule Interview'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Search, Filters & Summary Badges */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search and Filters */}
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFa ? 'جستجوی متقاضی، مصاحبه‌کننده، مرحله...' : 'Search candidate, assessor...'}
                className="w-full pr-9 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2" />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-bold focus:outline-none"
            >
              <option value="ALL">{isFa ? 'تمامی نوع مصاحبه‌ها' : 'All Types'}</option>
              {INTERVIEW_TYPE_OPTIONS.map((opt) => (
                <option key={opt.type} value={opt.type}>
                  {isFa ? opt.labelFa : opt.labelEn}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-bold focus:outline-none"
            >
              <option value="ALL">{isFa ? 'وضعیت: همه' : 'Status: All'}</option>
              <option value="UPCOMING">{isFa ? 'در انتظار برگزاری' : 'Upcoming'}</option>
              <option value="COMPLETED">{isFa ? 'برگزار شده / ارزیابی‌شده' : 'Completed'}</option>
            </select>
          </div>

          {/* Summary Stats Badges */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
              {upcomingThisMonth} {isFa ? 'جلسه پیش‌رو' : 'Upcoming'}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              {completedThisMonth} {isFa ? 'پایان‌یافته' : 'Completed'}
            </span>
          </div>
        </div>
      </div>

      {/* VIEW 1: MONTHLY CALENDAR GRID */}
      {viewMode === 'MONTH' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Weekday Columns Header (Saturday to Friday) */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-black text-slate-700 py-3">
            {WEEK_DAYS_FA.map((day) => (
              <div key={day.key} className="flex items-center justify-center gap-1">
                <span>{day.name}</span>
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 bg-slate-100">
            {/* Empty slots for month start offset */}
            {Array.from({ length: monthStartOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="min-h-[110px] sm:min-h-[130px] p-2 bg-slate-50/40 opacity-40"></div>
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isToday = dayNum === 15; // Demo today
              const isSelected = selectedDayNumber === dayNum;
              const dayInterviews = interviewsByDay[dayNum] || [];

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDayNumber(dayNum)}
                  className={`min-h-[110px] sm:min-h-[130px] p-2 bg-white transition-all flex flex-col justify-between group cursor-pointer hover:bg-blue-50/20 ${
                    isSelected ? 'ring-2 ring-blue-500 ring-inset z-10' : ''
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black transition-colors ${
                        isToday
                          ? 'bg-blue-600 text-white shadow-xs'
                          : isSelected
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-700 group-hover:text-blue-600'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {dayInterviews.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {dayInterviews.length} {isFa ? 'جلسه' : 'sess'}
                      </span>
                    )}
                  </div>

                  {/* Interview Cards List inside day cell */}
                  <div className="space-y-1.5 overflow-y-auto max-h-[85px] flex-1">
                    {dayInterviews.map((round) => (
                      <div
                        key={round.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveInterview(round);
                        }}
                        className={`p-1.5 rounded-xl border text-right transition-all hover:scale-102 hover:shadow-sm cursor-pointer ${
                          round.isCompleted
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-blue-50/90 border-blue-200 text-blue-950'
                        }`}
                        title={`${round.candidateName} — ${round.stageName}`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-[10px] font-black text-slate-700 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5 text-blue-600" />
                            {round.timeOnly}
                          </span>
                          {round.isCompleted ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          ) : (
                            <Video className="w-3 h-3 text-blue-600 shrink-0" />
                          )}
                        </div>

                        <p className="font-bold text-[11px] truncate leading-tight mt-0.5">
                          {round.candidateName}
                        </p>
                        <p className="text-[9px] text-slate-500 truncate leading-tight">
                          {round.candidateRole}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add Interview Quick Link on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-1 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenScheduleModal();
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isFa ? 'رزرو' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: WEEKLY CALENDAR VIEW */}
      {viewMode === 'WEEK' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-700">
              {isFa ? `جلسات مصاحبه هفته جاری (شهریور ۱۴۰۳)` : 'Interviews for Current Week'}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Sat 15 - Fri 21
            </span>
          </div>

          <div className="grid grid-cols-7 divide-x divide-slate-200 min-h-[420px]">
            {WEEK_DAYS_FA.map((day, idx) => {
              const dayNum = 15 + idx; // 15 to 21
              const dayInterviews = interviewsByDay[dayNum] || [];

              return (
                <div key={day.key} className="p-3 bg-white flex flex-col space-y-3">
                  <div className="text-center pb-2 border-b border-slate-100">
                    <span className="block text-xs font-bold text-slate-500">{day.name}</span>
                    <span className="inline-block mt-0.5 text-sm font-black text-slate-800">{dayNum}</span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {dayInterviews.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center p-2 text-[11px] text-slate-400">
                        {isFa ? 'جلسه‌ای رزرو نشده' : 'No sessions'}
                      </div>
                    ) : (
                      dayInterviews.map((round) => (
                        <div
                          key={round.id}
                          onClick={() => setActiveInterview(round)}
                          className="p-2.5 rounded-2xl bg-blue-50 border border-blue-200 hover:bg-blue-100/70 transition-all text-right cursor-pointer space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold text-blue-800">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              {round.timeOnly}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-200/70 text-blue-900 font-mono">
                              {round.durationMinutes}m
                            </span>
                          </div>
                          <p className="font-black text-xs text-slate-900 truncate">
                            {round.candidateName}
                          </p>
                          <p className="text-[10px] text-slate-600 truncate">
                            {round.stageName}
                          </p>
                          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                            <span className="truncate">{round.interviewers[0] || 'ارزیاب'}</span>
                            <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: DAY SCHEDULE TIMELINE VIEW */}
      {viewMode === 'DAY' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-black text-base text-slate-900">
                {isFa ? `برنامه روزانه مصاحبه‌ها — ${selectedDayNumber} ${currentMonthName} ${persianYear}` : `Day Schedule — ${selectedDayNumber} ${currentMonthName}`}
              </h3>
              <p className="text-xs text-slate-500">
                {isFa ? 'جدول زمان‌بندی ساعات کاری (۰۸:۰۰ الی ۱۸:۰۰)' : 'Work hours timeline (08:00 to 18:00)'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDayNumber((d) => Math.max(1, d - 1))}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 rounded-xl bg-slate-100 font-bold text-xs text-slate-800 font-mono">
                {selectedDayNumber} {currentMonthName}
              </span>
              <button
                onClick={() => setSelectedDayNumber((d) => Math.min(daysInCurrentMonth, d + 1))}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day Timeline Hours */}
          <div className="space-y-3">
            {['۰۹:۰۰', '۱۰:۰۰', '۱۱:۰۰', '۱۲:۰۰', '۱۳:۰۰', '۱۴:۰۰', '۱۴:۳۰', '۱۵:۰۰', '۱۶:۰۰', '۱۷:۰۰'].map((hourStr) => {
              const matched = (interviewsByDay[selectedDayNumber] || []).filter(
                (i) => i.timeOnly.startsWith(hourStr.slice(0, 2)) || i.timeOnly === hourStr
              );

              return (
                <div key={hourStr} className="flex items-start gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-16 font-mono font-bold text-xs text-slate-400 pt-2 text-left">
                    {hourStr}
                  </div>

                  <div className="flex-1 min-h-[46px] border-r-2 border-blue-500/40 pr-4 space-y-2">
                    {matched.length === 0 ? (
                      <div className="text-[11px] text-slate-300 pt-2 italic">
                        {isFa ? 'زمان آزاد — آماده برای رزرو' : 'Available slot'}
                      </div>
                    ) : (
                      matched.map((round) => (
                        <div
                          key={round.id}
                          onClick={() => setActiveInterview(round)}
                          className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-right flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm text-slate-900">
                                {round.candidateName}
                              </span>
                              <span className="text-xs text-slate-500">
                                ({round.candidateRole})
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getTypeStyle(round.interviewType)}`}>
                                {round.stageName}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-blue-600" />
                                {round.interviewers.join('، ')}
                              </span>
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="w-3.5 h-3.5 text-blue-600" />
                                {round.durationMinutes} دقیقه
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={round.meetUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>{isFa ? 'ورود به جلسه' : 'Join'}</span>
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenScorecard(round);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              {isFa ? 'کارت امتیاز' : 'Scorecard'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: INTERVIEW DETAIL INSPECTION */}
      {activeInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 text-right">
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {isFa ? 'جزئیات جلسه مصاحبه' : 'Interview Session Details'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    ID: {activeInterview.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveInterview(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Candidate Info Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {activeInterview.candidateName.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">
                      {activeInterview.candidateName}
                    </h4>
                    <p className="text-slate-500 font-medium">
                      {activeInterview.candidateRole}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${getTypeStyle(activeInterview.interviewType)}`}>
                  {activeInterview.stageName}
                </span>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-bold">
                    {isFa ? 'زمان و تاریخ' : 'Date & Time'}
                  </span>
                  <div className="font-bold flex items-center gap-1.5 text-slate-900">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{activeInterview.dateTime}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-bold">
                    {isFa ? 'مدت زمان مصاحبه' : 'Duration'}
                  </span>
                  <div className="font-bold flex items-center gap-1.5 text-slate-900 font-mono">
                    <span>{activeInterview.durationMinutes} دقیقه</span>
                  </div>
                </div>

                <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-bold">
                    {isFa ? 'تیم مصاحبه‌کنندگان' : 'Interviewers'}
                  </span>
                  <div className="font-bold flex items-center gap-1.5 text-slate-900">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>{activeInterview.interviewers.join('، ')}</span>
                  </div>
                </div>

                {activeInterview.notes && (
                  <div className="col-span-2 p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                    <span className="text-[11px] font-bold text-amber-700 block">
                      {isFa ? 'یادداشت هماهنگی جلسه' : 'Meeting Notes'}
                    </span>
                    <p className="leading-relaxed">{activeInterview.notes}</p>
                  </div>
                )}
              </div>

              {/* Online Meeting URL */}
              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-bold text-blue-950 block">
                      {isFa ? 'لینک کنفرانس ویدیویی آنلاین' : 'Online Video Conference'}
                    </span>
                    <span className="text-[11px] text-blue-700 font-mono truncate max-w-[200px] block">
                      {activeInterview.meetUrl}
                    </span>
                  </div>
                </div>

                <a
                  href={activeInterview.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>{isFa ? 'پیوستن' : 'Join'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleComplete) onToggleComplete(activeInterview.id);
                    setActiveInterview((prev) => prev ? { ...prev, isCompleted: !prev.isCompleted } : null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    activeInterview.isCompleted
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {activeInterview.isCompleted
                    ? (isFa ? 'علامت‌گذاری به عنوان در انتظار' : 'Mark as Upcoming')
                    : (isFa ? 'علامت‌گذاری به عنوان پایان‌یافته' : 'Mark as Completed')}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenScorecard(activeInterview);
                      setActiveInterview(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md transition-colors cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>{isFa ? 'ثبت کارت امتیاز' : 'Open Scorecard'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
