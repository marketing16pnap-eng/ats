import React, { useState } from 'react';
import { X, Calendar, Video, Clock, Users, Plus, Layers, Info } from 'lucide-react';
import { Candidate, InterviewRound, AppLanguage, InterviewStageConfig } from '../types';

interface ScheduleInterviewModalProps {
  candidates: Candidate[];
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onSchedule: (interview: InterviewRound) => void;
  interviewStages?: InterviewStageConfig[];
  onOpenNewStageModal?: () => void;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  candidates,
  isOpen,
  onClose,
  language,
  onSchedule,
  interviewStages,
  onOpenNewStageModal,
}) => {
  const isFa = language === 'PERSIAN';

  const defaultStage = interviewStages && interviewStages.length > 0 ? interviewStages[0].title : 'مصاحبه تخصصی معماری سیستم';
  const defaultDuration = interviewStages && interviewStages.length > 0 ? interviewStages[0].defaultDurationMinutes : 60;

  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || '');
  const [selectedStageId, setSelectedStageId] = useState(interviewStages && interviewStages.length > 0 ? interviewStages[0].id : '');
  const [stageName, setStageName] = useState(defaultStage);
  const [interviewers, setInterviewers] = useState('مهندس کیوان رادمنش، دکتر احسان صابری');
  const [dateTime, setDateTime] = useState('فردا - ساعت ۱۴:۰۰');
  const [timeOnly, setTimeOnly] = useState('۱۴:۰۰');
  const [durationMinutes, setDurationMinutes] = useState(defaultDuration);
  const [meetUrl, setMeetUrl] = useState('https://meet.google.com/rec-auth-sync');

  // Handle stage selection
  const handleStageSelectChange = (stageIdOrTitle: string) => {
    const foundStage = interviewStages?.find((s) => s.id === stageIdOrTitle || s.title === stageIdOrTitle);
    if (foundStage) {
      setSelectedStageId(foundStage.id);
      setStageName(foundStage.title);
      setDurationMinutes(foundStage.defaultDurationMinutes);
      if (foundStage.evaluatorsHint && !interviewers) {
        setInterviewers(foundStage.evaluatorsHint);
      }
    } else {
      setSelectedStageId('');
      setStageName(stageIdOrTitle);
    }
  };

  const activeStageConfig = interviewStages?.find((s) => s.id === selectedStageId || s.title === stageName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];
    if (!candidate) return;

    const round: InterviewRound = {
      id: `INT-${Math.floor(200 + Math.random() * 800)}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateRole: candidate.role,
      stageName: stageName || 'مصاحبه ارزیابی تخصصی',
      stageConfigId: activeStageConfig?.id,
      interviewType: activeStageConfig?.type,
      interviewers: interviewers.split('،').map((s) => s.trim()).filter(Boolean),
      dateTime,
      timeOnly,
      durationMinutes: Number(durationMinutes),
      meetUrl: meetUrl || 'https://meet.google.com/rec-auth-exec',
      isCompleted: false,
    };

    onSchedule(round);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="schedule-interview-dialog"
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#131B2E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{isFa ? 'برنامه‌ریزی جلسه مصاحبه جدید' : 'Schedule Interview Round'}</h3>
              <p className="text-xs text-slate-400">{isFa ? 'تنظیم تاریخ، لینک گوگل میت، مرحله ارزیابی و ارزیابان' : 'Sync calendars, Google Meet & assessors'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'انتخاب کارجو *' : 'Candidate *'}</label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
            >
              {candidates.map((cand) => (
                <option key={cand.id} value={cand.id}>
                  {cand.name} — {cand.role} ({cand.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">{isFa ? 'مرحله و عنوان مصاحبه *' : 'Interview Stage & Title *'}</label>
                {onOpenNewStageModal && (
                  <button
                    type="button"
                    onClick={onOpenNewStageModal}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isFa ? '+ ایجاد مرحله / عنوان جدید' : '+ Create New Stage'}</span>
                  </button>
                )}
              </div>
              <select
                value={selectedStageId || stageName}
                onChange={(e) => handleStageSelectChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
              >
                {interviewStages && interviewStages.length > 0 ? (
                  interviewStages.map((stg) => (
                    <option key={stg.id} value={stg.id}>
                      {stg.title} ({isFa ? `${stg.defaultDurationMinutes} دقیقه` : `${stg.defaultDurationMinutes} mins`})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="مصاحبه تخصصی معماری سیستم">مصاحبه تخصصی معماری سیستم</option>
                    <option value="ارزیابی کدنویسی زنده (Live Coding)">ارزیابی کدنویسی زنده (Live Coding)</option>
                    <option value="مصاحبه شایستگی رفتاری و منابع انسانی">مصاحبه شایستگی رفتاری و منابع انسانی</option>
                    <option value="مصاحبه نهایی هیئت مدیره و C-Level">مصاحبه نهایی هیئت مدیره و C-Level</option>
                  </>
                )}
              </select>

              {activeStageConfig && (
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">{activeStageConfig.titleEn}</span>
                    <p>{activeStageConfig.description}</p>
                    {activeStageConfig.evaluatorsHint && (
                      <p className="mt-1 text-slate-500 font-medium">{isFa ? 'ارزیاب پیشنهادی:' : 'Suggested Assessor:'} <span className="text-slate-800">{activeStageConfig.evaluatorsHint}</span></p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'مدت جلسه (دقیقه)' : 'Duration (Mins)'}</label>
              <input
                type="number"
                min="10"
                max="180"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'زمان و تاریخ' : 'Date & Time'}</label>
              <input
                type="text"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                placeholder="امروز - ساعت ۱۶:۰۰"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'ساعت دقیق' : 'Exact Time'}</label>
              <input
                type="text"
                value={timeOnly}
                onChange={(e) => setTimeOnly(e.target.value)}
                placeholder="۱۶:۰۰"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'مصاحبه‌کنندگان (با ویرگول جدا کنید)' : 'Assessors (Comma separated)'}</label>
            <input
              type="text"
              value={interviewers}
              onChange={(e) => setInterviewers(e.target.value)}
              placeholder="دکتر رضا علوی، مهندس پریسا خسروی"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'لینک جلسه آنلاین (Google Meet / Zoom)' : 'Meeting URL'}</label>
            <input
              type="text"
              value={meetUrl}
              onChange={(e) => setMeetUrl(e.target.value)}
              placeholder="https://meet.google.com/xyz-abcd-efg"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white text-left font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              {isFa ? 'انصراف' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold text-white shadow-md shadow-blue-600/20 cursor-pointer transition-all"
            >
              {isFa ? 'ثبت و ارسال دعوت‌نامه مصاحبه' : 'Schedule & Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
