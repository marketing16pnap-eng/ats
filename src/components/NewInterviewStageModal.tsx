import React, { useState } from 'react';
import { X, Layers, Check, Clock, ShieldCheck, Tag } from 'lucide-react';
import { InterviewStageConfig, InterviewType, AppLanguage } from '../types';

interface NewInterviewStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onAddStage: (stage: InterviewStageConfig) => void;
}

export const INTERVIEW_TYPE_OPTIONS: { type: InterviewType; labelFa: string; labelEn: string; defaultMinutes: number; badgeColor: string }[] = [
  { type: 'TECHNICAL', labelFa: 'تخصصی و فنی (Technical)', labelEn: 'Technical Deep-Dive', defaultMinutes: 60, badgeColor: 'bg-blue-600' },
  { type: 'HR_BEHAVIORAL', labelFa: 'شایستگی رفتاری و منابع انسانی (HR)', labelEn: 'HR & Behavioral', defaultMinutes: 45, badgeColor: 'bg-purple-600' },
  { type: 'LIVE_CODING', labelFa: 'کدنویسی زنده و مسئله (Live Coding)', labelEn: 'Live Coding & Algorithms', defaultMinutes: 60, badgeColor: 'bg-emerald-600' },
  { type: 'CASE_STUDY', labelFa: 'دفاع از تسک و کیس‌استادی (Case Study)', labelEn: 'Case Study Defense', defaultMinutes: 60, badgeColor: 'bg-amber-600' },
  { type: 'EXECUTIVE', labelFa: 'مدیریتی و هیئت مدیره (Executive / C-Level)', labelEn: 'Executive & C-Level', defaultMinutes: 45, badgeColor: 'bg-rose-600' },
  { type: 'INITIAL_SCREENING', labelFa: 'غربالگری اولیه تلفنی (Screening)', labelEn: 'Initial Screening', defaultMinutes: 20, badgeColor: 'bg-sky-600' },
  { type: 'CULTURE_FIT', labelFa: 'تناسب فرهنگی و ارزش‌های سازمان', labelEn: 'Culture & Values Fit', defaultMinutes: 30, badgeColor: 'bg-indigo-600' },
  { type: 'FINAL_OFFER', labelFa: 'جلسه حقوق و پیشنهاد نهایی (Offer)', labelEn: 'Job Offer & Compensation', defaultMinutes: 30, badgeColor: 'bg-teal-600' },
];

const COLOR_OPTIONS = [
  { label: 'آبی فنی', value: '#0058BE', bg: 'bg-blue-600' },
  { label: 'بنفش منابع انسانی', value: '#7C3AED', bg: 'bg-purple-600' },
  { label: 'زمردی ارزیابی عملی', value: '#059669', bg: 'bg-emerald-600' },
  { label: 'کهربایی کیس‌استادی', value: '#D97706', bg: 'bg-amber-600' },
  { label: 'سرخ مدیریتی', value: '#E11D48', bg: 'bg-rose-600' },
  { label: 'فیروزه‌ای غربالگری', value: '#0284C7', bg: 'bg-sky-600' },
  { label: 'نیلی فرهنگ', value: '#4F46E5', bg: 'bg-indigo-600' },
];

export const NewInterviewStageModal: React.FC<NewInterviewStageModalProps> = ({
  isOpen,
  onClose,
  language,
  onAddStage,
}) => {
  const isFa = language === 'PERSIAN';

  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [selectedType, setSelectedType] = useState<InterviewType>('TECHNICAL');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [description, setDescription] = useState('');
  const [evaluatorsHint, setEvaluatorsHint] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0058BE');

  const handleTypeChange = (newType: InterviewType) => {
    setSelectedType(newType);
    const opt = INTERVIEW_TYPE_OPTIONS.find((o) => o.type === newType);
    if (opt) {
      setDurationMinutes(opt.defaultMinutes);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newStage: InterviewStageConfig = {
      id: `STG-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      titleEn: titleEn.trim() || title.trim(),
      type: selectedType,
      defaultDurationMinutes: Number(durationMinutes) || 45,
      description: description.trim() || (isFa ? 'بررسی شایستگی‌ها و مهارت‌های مصوب مرحله استخدامی.' : 'Evaluation criteria defined for this stage.'),
      evaluatorsHint: evaluatorsHint.trim() || (isFa ? 'ارزیاب تخصصی و نماینده منابع انسانی' : 'Assessor & HR Representative'),
      color: selectedColor,
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };

    onAddStage(newStage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="new-interview-stage-dialog"
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#131B2E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isFa ? 'تعریف مرحله و عنوان مصاحبه جدید' : 'Create Interview Stage / Type'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFa ? 'تنظیم عنوان مصاحبه، دسته‌بندی نوع ارزیابی و مدت زمان پیش‌فرض' : 'Define interview stage title, category & default duration'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'عنوان و موضوع مصاحبه (فارسی) *' : 'Interview Stage Title (FA) *'}
              </label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isFa ? 'مثال: مصاحبه تخصصی معماری سیستم و میکروسرویس' : 'e.g. System Architecture Technical Interview'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'عنوان انگلیسی مرحله' : 'Stage Title (EN)'}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. System Architecture Deep-Dive"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'نوع و دسته‌بندی مصاحبه *' : 'Interview Category *'}
              </label>
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value as InterviewType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:bg-white font-bold"
              >
                {INTERVIEW_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.type} value={opt.type}>
                    {isFa ? opt.labelFa : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'مدت زمان استاندارد جلسه (دقیقه)' : 'Default Duration (Mins)'}
              </label>
              <input
                type="number"
                min="10"
                max="180"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'نقش ارزیابان پیشنهادی' : 'Recommended Assessors'}
              </label>
              <input
                type="text"
                value={evaluatorsHint}
                onChange={(e) => setEvaluatorsHint(e.target.value)}
                placeholder={isFa ? 'مثال: تک‌لید، معمار ارشد، مدیر فنی' : 'e.g. Tech Lead, Senior Architect'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {isFa ? 'رنگ نشان مرحله در تقویم و ارزیابی' : 'Stage Color Identifier'}
            </label>
            <div className="flex flex-wrap gap-2.5 items-center">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    selectedColor === c.value
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${c.bg}`}></span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description & Competencies */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isFa ? 'شرح اهداف، سنجه‌های ارزیابی و سرفصل‌های مصاحبه' : 'Stage Objectives & Evaluation Focus'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isFa ? 'محورهای ارزیابی، مهارت‌های کلیدی مورد انتظار، مباحث فنی و معیارهای امتیازدهی...' : 'Evaluation criteria, expected outcomes and scoring guidelines...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:bg-white h-20 resize-none transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              {isFa ? 'انصراف' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-xs font-bold text-white shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isFa ? 'ثبت و تعریف مرحله مصاحبه' : 'Create Interview Stage'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
