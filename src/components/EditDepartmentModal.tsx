import React, { useState, useEffect } from 'react';
import { X, Building2, Check, Edit3 } from 'lucide-react';
import { Department, AppLanguage } from '../types';

interface EditDepartmentModalProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onSaveDepartment: (department: Department) => void;
}

const COLOR_OPTIONS = [
  { label: 'آبی پناپ', value: '#0058BE', bg: 'bg-blue-600' },
  { label: 'بنفش هوش مصنوعی', value: '#7C3AED', bg: 'bg-purple-600' },
  { label: 'کهربایی محصول', value: '#D97706', bg: 'bg-amber-600' },
  { label: 'فیروزه‌ای اچ‌آر', value: '#0284C7', bg: 'bg-sky-600' },
  { label: 'سرخ مارکتینگ', value: '#E11D48', bg: 'bg-rose-600' },
  { label: 'زمردی مالی', value: '#059669', bg: 'bg-emerald-600' },
  { label: 'نیلی عملیات', value: '#4F46E5', bg: 'bg-indigo-600' },
  { label: 'زغالی امنیت', value: '#334155', bg: 'bg-slate-700' },
];

export const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({
  department,
  isOpen,
  onClose,
  language,
  onSaveDepartment,
}) => {
  const isFa = language === 'PERSIAN';

  const [name, setName] = useState(department?.name || '');
  const [nameEn, setNameEn] = useState(department?.nameEn || '');
  const [code, setCode] = useState(department?.code || '');
  const [headOfDepartment, setHeadOfDepartment] = useState(department?.headOfDepartment || '');
  const [headEmail, setHeadEmail] = useState(department?.headEmail || '');
  const [description, setDescription] = useState(department?.description || '');
  const [budgetTotal, setBudgetTotal] = useState(department?.budgetTotal || '');
  const [openPositionsCount, setOpenPositionsCount] = useState(department?.openPositionsCount || 0);
  const [activeEmployeesCount, setActiveEmployeesCount] = useState(department?.activeEmployeesCount || 0);
  const [selectedColor, setSelectedColor] = useState(department?.color || '#0058BE');

  useEffect(() => {
    if (department) {
      setName(department.name || '');
      setNameEn(department.nameEn || '');
      setCode(department.code || '');
      setHeadOfDepartment(department.headOfDepartment || '');
      setHeadEmail(department.headEmail || '');
      setDescription(department.description || '');
      setBudgetTotal(department.budgetTotal || '');
      setOpenPositionsCount(department.openPositionsCount || 0);
      setActiveEmployeesCount(department.activeEmployeesCount || 0);
      setSelectedColor(department.color || '#0058BE');
    }
  }, [department]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !name.trim()) return;

    const updated: Department = {
      ...department,
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      code: (code || '').trim(),
      headOfDepartment: headOfDepartment.trim(),
      headEmail: (headEmail || '').trim(),
      description: description.trim(),
      budgetTotal: (budgetTotal || '').trim(),
      openPositionsCount: Number(openPositionsCount) || 0,
      activeEmployeesCount: Number(activeEmployeesCount) || 0,
      color: selectedColor,
    };

    onSaveDepartment(updated);
    onClose();
  };

  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="edit-department-dialog"
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#131B2E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isFa ? `ویرایش واحد سازمانی: ${department.name}` : `Edit Department: ${department.name}`}
              </h3>
              <p className="text-xs text-slate-400">
                {isFa ? 'بروزرسانی مشخصات سازمانی، بودجه، مدیر و ظرفیت' : 'Update department settings, budget, and leadership'}
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
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'نام دپارتمان (فارسی) *' : 'Department Name (FA) *'}
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'نام انگلیسی واحد' : 'Department Name (EN)'}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'کد واحد سازمانی' : 'Department Code'}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'مدیر / سرپرست دپارتمان *' : 'Head of Department *'}
              </label>
              <input
                required
                type="text"
                value={headOfDepartment}
                onChange={(e) => setHeadOfDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'ایمیل کاری مدیر' : 'Manager Work Email'}
              </label>
              <input
                type="email"
                value={headEmail}
                onChange={(e) => setHeadEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'بودجه مصوب جذب و استخدام' : 'Hiring & Operations Budget'}
              </label>
              <input
                type="text"
                value={budgetTotal}
                onChange={(e) => setBudgetTotal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'تعداد پرسنل فعال فعلی' : 'Current Active Personnel'}
              </label>
              <input
                type="number"
                min="0"
                max="500"
                value={activeEmployeesCount}
                onChange={(e) => setActiveEmployeesCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isFa ? 'ظرفیت استخدامی هدف (موقعیت‌های باز)' : 'Open Headcount Target'}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={openPositionsCount}
                onChange={(e) => setOpenPositionsCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Color Tag Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {isFa ? 'رنگ نشان سازمانی دپارتمان' : 'Department Theme Tag'}
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

          {/* Mission & Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isFa ? 'شرح وظایف و اهداف استراتژیک دپارتمان' : 'Mission & Strategic Scope'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white h-20 resize-none transition-all"
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold text-white shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isFa ? 'ذخیره تغییرات' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
