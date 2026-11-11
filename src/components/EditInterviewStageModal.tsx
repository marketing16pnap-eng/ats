import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, Clock, Layers, Trash2 } from 'lucide-react';
import { InterviewStageConfig, InterviewType, AppLanguage } from '../types';
import { INTERVIEW_TYPE_OPTIONS } from './NewInterviewStageModal';

interface EditInterviewStageModalProps {
  stage: InterviewStageConfig | null;
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onSaveStage: (updatedStage: InterviewStageConfig) => void;
  onDeleteStage?: (stageId: string) => void;
}

const COLOR_OPTIONS = [
  { label: 'آبی فنی', value: '#0058BE', bg: 'bg-blue-600' },
  { label: 'بنفش منابع انسانی', value: '#7C3AED', bg: 'bg-purple-600' },
  { label: 'زمردی ارزیابی عملی', value: '#059669', bg: 'bg-emerald-600' },
  { label: 'کهربایی کیس‌استادی', value: '#D97706', bg: 'bg-amber-600' },
  { label: 'سرخ مدیریتی', value: '#E11D48', bg: 'bg-rose-600' },
  { label: 'فیروزه‌ای غربالگری', value: '#0284C7', bg: 'bg-sky-600' },
  { label: 'نیلی فرهنگ', value: '#4F46E5', bg: 'bg-indigo-600' },
];

export const EditInterviewStageModal: React.FC<EditInterviewStageModalProps> = ({
  stage,
  isOpen,
  onClose,
  language,
  onSaveStage,
  onDeleteStage,
}) => {
  const isFa = language === 'PERSIAN';

  const [title, setTitle] = useState(stage?.title || '');
  const [titleEn, setTitleEn] = useState(stage?.titleEn || '');
  const [selectedType, setSelectedType] = useState<InterviewType>(stage?.type || 'TECHNICAL');
  const [durationMinutes, setDurationMinutes] = useState(stage?.defaultDurationMinutes || 60);
  const [description, setDescription] = useState(stage?.description || '');
  const [evaluatorsHint, setEvaluatorsHint] = useState(stage?.evaluatorsHint || '');
  const [selectedColor, setSelectedColor] = useState(stage?.color || '#0058BE');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (stage) {
      setTitle(stage.title || '');
      setTitleEn(stage.titleEn || '');
      setSelectedType(stage.type || 'TECHNICAL');
      setDurationMinutes(stage.defaultDurationMinutes || 60);
      setDescription(stage.description || '');
      setEvaluatorsHint(stage.evaluatorsHint || '');
      setSelectedColor(stage.color || '#0058BE');
      setShowConfirmDelete(false);
    }
  }, [stage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stage || !title.trim()) return;

    const updated: InterviewStageConfig = {
      ...stage,
      title: title.trim(),
      titleEn: titleEn.trim() || title.trim(),
      type: selectedType,
      defaultDurationMinutes: Number(durationMinutes) || 45,
      description: description.trim(),
      evaluatorsHint: evaluatorsHint.trim(),
      color: selectedColor,
    };

    onSaveStage(updated);
    onClose();
  };

  const handleDelete = () => {
    if (stage && onDeleteStage) {
      onDeleteStage(stage.id);
      onClose();
    }
  };

  if (!isOpen || !stage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="edit-interview-stage-dialog"
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#131B2E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isFa ? 'ویرایش مرحله و عنوان مصاحبه' : 'Edit Interview Stage'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFa ? `شناسه سیستمی: ${stage.id}` : `Stage ID: ${stage.id}`}
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

        {/* Delete Confirmation Alert if active */}
        {showConfirmDelete && (
          <div className="bg-rose-50 border-b border-rose-200 p-4 text-rose-900 text-xs flex items-center justify-between">
            <div>
              <p className="font-bold">{isFa ? 'آیا از حذف این عنوان مرحله اطمینان دارید؟' : 'Are you sure you want to delete this stage?'}</p>
              <p className="text-[11px] text-rose-700 mt-0.5">{isFa ? 'این مرحله از لیست مراحل در دسترس برای برنامه‌ریزی مصاحبه حذف خواهد شد.' : 'This stage will be removed from future scheduling options.'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1.5 bg-white border border-rose-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {isFa ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
              >
                {isFa ? 'تایید و حذف' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        )}

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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'نوع و دسته‌بندی مصاحبه *' : 'Interview Category *'}
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as InterviewType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {isFa ? 'رنگ نشان مرحله' : 'Stage Color Identifier'}
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white h-20 resize-none transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {onDeleteStage ? (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isFa ? 'حذف مرحله' : 'Delete Stage'}</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                {isFa ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold text-white shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>{isFa ? 'ذخیره تغییرات' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
