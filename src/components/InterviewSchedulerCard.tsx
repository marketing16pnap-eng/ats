import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Bell, CheckCircle2, UserCheck, Check, Sparkles } from 'lucide-react';

interface InterviewSchedulerCardProps {
  interviewType: 'PHONE' | 'IN_PERSON';
  currentDate?: string;
  currentTime?: string;
  scheduledAt?: string;
  scheduledBy?: string;
  notificationSent?: boolean;
  onSaveSchedule: (date: string, time: string) => void;
  isFa?: boolean;
}

export const InterviewSchedulerCard: React.FC<InterviewSchedulerCardProps> = ({
  interviewType,
  currentDate = '',
  currentTime = '',
  scheduledAt,
  scheduledBy,
  notificationSent,
  onSaveSchedule,
  isFa = true,
}) => {
  const [date, setDate] = useState(currentDate);
  const [time, setTime] = useState(currentTime);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setDate(currentDate || '');
    setTime(currentTime || '');
  }, [currentDate, currentTime]);

  const handleSave = () => {
    onSaveSchedule(date, time);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const isPhone = interviewType === 'PHONE';
  const title = isPhone ? 'هماهنگی و زمان‌بندی مصاحبه تلفنی' : 'هماهنگی و زمان‌بندی مصاحبه حضوری (مجتمع سرمد)';
  const subtitle = isPhone
    ? 'تعیین روز و ساعت مصاحبه جهت تماس ارزیاب و ارسال نوتیفیکیشن سیستمی به کاربر'
    : 'تعیین روز و ساعت مراجعه کارجو به دفتر مرکزی سرمد ۳۰۷ و ارسال اعلان هوشمند';

  const defaultDates = [
    '۱۴۰۳/۰۶/۲۵',
    '۱۴۰۳/۰۶/۲۶',
    '۱۴۰۳/۰۶/۲۷',
    '۱۴۰۳/۰۶/۲۸',
    '۱۴۰۳/۰۶/۲۹',
    '۱۴۰۳/۰۶/۳۰',
    '۱۴۰۳/۰۷/۰۱'
  ];

  const defaultTimes = [
    '۰۹:۰۰',
    '۱۰:۰۰',
    '۱۰:۳۰',
    '۱۱:۰۰',
    '۱۱:۳۰',
    '۱۲:۰۰',
    '۱۴:۰۰',
    '۱۴:۳۰',
    '۱۵:۰۰',
    '۱۶:۰۰',
    '۱۶:۳۰'
  ];

  const hasScheduledData = Boolean(date && time);

  return (
    <div
      id={`scheduler-card-${interviewType.toLowerCase()}`}
      className={`p-4 rounded-2xl border transition-all ${
        isPhone
          ? 'bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-white border-blue-200'
          : 'bg-gradient-to-r from-purple-50/90 via-amber-50/40 to-white border-purple-200'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
              isPhone ? 'bg-blue-600' : 'bg-purple-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-slate-900">{title}</h4>
              {hasScheduledData && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  هماهنگ‌شده
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Audit status badge */}
        {scheduledAt && (
          <div className="text-[11px] text-slate-600 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>ثبت شده در: <strong className="text-slate-800 font-mono">{scheduledAt}</strong></span>
            {scheduledBy && (
              <span className="text-slate-500">| ثبت‌کننده: <strong className="text-slate-800">{scheduledBy}</strong></span>
            )}
          </div>
        )}
      </div>

      {/* Input controls */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        {/* Date input */}
        <div className="sm:col-span-4 space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            روز مصاحبه (تاریخ شمسی):
          </label>
          <div className="relative">
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="مثال: ۱۴۰۳/۰۶/۲۶"
              list={`dates-list-${interviewType}`}
              className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <datalist id={`dates-list-${interviewType}`}>
              {defaultDates.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Time input */}
        <div className="sm:col-span-3 space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            ساعت مصاحبه:
          </label>
          <div className="relative">
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="مثال: ۱۰:۳۰"
              list={`times-list-${interviewType}`}
              className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium font-mono"
            />
            <datalist id={`times-list-${interviewType}`}>
              {defaultTimes.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Action button */}
        <div className="sm:col-span-5 flex items-center gap-2">
          <button
            id={`btn-save-schedule-${interviewType.toLowerCase()}`}
            onClick={handleSave}
            disabled={!date || !time}
            className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : date && time
                ? isPhone
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                هماهنگ و اعلان ارسال شد
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                ثبت زمان و ارسال اعلان به کاربر
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scheduled Highlight Banner */}
      {date && time && (
        <div className="mt-2.5 p-2 bg-white/90 rounded-xl border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              زمان هماهنگ‌شده: <strong>{date}</strong> در ساعت <strong className="font-mono">{time}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-medium">
            <Bell className="w-3 h-3 text-blue-600" />
            اعلان در مرکز پیام‌ها و تاریخچه کاربر فعال است
          </div>
        </div>
      )}
    </div>
  );
};
