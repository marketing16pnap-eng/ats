import React, { useState } from 'react';
import { X, Building2, Plus, DollarSign, Users, Briefcase, Mail, FileText, Check } from 'lucide-react';
import { Department, AppLanguage } from '../types';

interface NewDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onAddDepartment: (department: Department) => void;
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

export const NewDepartmentModal: React.FC<NewDepartmentModalProps> = ({
  isOpen,
  onClose,
  language,
  onAddDepartment,
}) => {
  const isFa = language === 'PERSIAN';

  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [code, setCode] = useState('');
  const [headOfDepartment, setHeadOfDepartment] = useState('');
  const [headEmail, setHeadEmail] = useState('');
  const [description, setDescription] = useState('');
  const [budgetTotal, setBudgetTotal] = useState('');
  const [openPositionsCount, setOpenPositionsCount] = useState(1);
  const [activeEmployeesCount, setActiveEmployeesCount] = useState(5);
  const [selectedColor, setSelectedColor] = useState('#0058BE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDept: Department = {
      id: `DEP-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      code: code.trim() || `DEP-${Math.floor(10 + Math.random() * 90)}`,
      headOfDepartment: headOfDepartment.trim() || (isFa ? 'تعیین نشده' : 'Unassigned'),
      headEmail: headEmail.trim() || 'info@panap.ir',
      description: description.trim() || (isFa ? 'شرح ماموریت سازمانی ثبت نشده است.' : 'No description provided.'),
      budgetTotal: budgetTotal.trim() || (isFa ? '۱.۵ میلیارد تومان' : '1.5B Tomans'),
      openPositionsCount: Number(openPositionsCount) || 0,
      activeEmployeesCount: Number(activeEmployeesCount) || 0,
      color: selectedColor,
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };

    onAddDepartment(newDept);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="new-department-dialog"
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#131B2E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isFa ? 'تعریف دپارتمان سازمانی جدید' : 'Create Organizational Department'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFa ? 'ایجاد واحد سازمانی، تخصیص بودجه و تعیین مدیر واحد' : 'Define department unit, budget, and leadership'}
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
                placeholder={isFa ? 'مثال: زیرساخت و شبکه' : 'e.g. Infrastructure'}
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
                placeholder="e.g. Infrastructure & DevOps"
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
                placeholder="INF-07"
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
                placeholder={isFa ? 'دکتر مهران صادقی' : 'Dr. Mehran Sadeghi'}
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
                placeholder="m.sadeghi@panap.ir"
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
                placeholder={isFa ? '۲.۵ میلیارد تومان' : '2.5B Tomans'}
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
              placeholder={isFa ? 'ماموریت اصلی این واحد شامل مدیریت سرورها، نگهداری کلاسترها و ارتقای پایداری سرویس‌هاست...' : 'Department core mission...'}
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
              <span>{isFa ? 'ثبت و تعریف دپارتمان' : 'Create Department'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
