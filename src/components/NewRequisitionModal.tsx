import React, { useState } from 'react';
import { X, Briefcase, Plus } from 'lucide-react';
import { JobRequisition, Priority, AppLanguage, Department } from '../types';

interface NewRequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onAddRequisition: (req: JobRequisition) => void;
  departments?: Department[];
}

export const NewRequisitionModal: React.FC<NewRequisitionModalProps> = ({
  isOpen,
  onClose,
  language,
  onAddRequisition,
  departments,
}) => {
  const isFa = language === 'PERSIAN';

  const defaultDept = departments && departments.length > 0 ? departments[0].name : 'فنی و مهندسی';
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState(defaultDept);
  const [location, setLocation] = useState('تهران / ترکیبی');
  const [openPositions, setOpenPositions] = useState(1);
  const [priority, setPriority] = useState<Priority>('HIGH');
  const [budgetRange, setBudgetRange] = useState('');
  const [hiringManager, setHiringManager] = useState('دکتر رضا علوی');
  const [skillsStr, setSkillsStr] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newReq: JobRequisition = {
      id: `REQ-${Math.floor(400 + Math.random() * 500)}`,
      title,
      department,
      location,
      employmentType: 'تمام وقت',
      openPositions: Number(openPositions),
      filledPositions: 0,
      status: 'ACTIVE',
      priority,
      budgetRange: budgetRange || '۷۵ - ۹۰ میلیون تومان',
      applicantsCount: 0,
      postedDate: '۱۴۰۳/۰۶/۰۷',
      hiringManager,
      description: description || 'جذب نیروی متخصص و متعهد برای گسترش تیم فنی.',
      requiredSkills: skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
    };

    onAddRequisition(newReq);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="new-requisition-dialog"
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#131B2E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{isFa ? 'ایجاد موقعیت شغلی (Requisition)' : 'Create Job Requisition'}</h3>
              <p className="text-xs text-slate-400">{isFa ? 'ثبت ردیف بودجه و ظرفیت جدید سازمانی' : 'Authorized Headcount & Budget Request'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'عنوان موقعیت شغلی *' : 'Job Title *'}</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مهندس ارشد زیرساخت ابری"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'دپارتمان' : 'Department'}</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              >
                {departments && departments.length > 0 ? (
                  departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {isFa ? d.name : d.nameEn}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="فنی و مهندسی">فنی و مهندسی</option>
                    <option value="طراحی و محصول">طراحی و محصول</option>
                    <option value="هوش مصنوعی">هوش مصنوعی</option>
                    <option value="مارکتینگ و رشد">مارکتینگ و رشد</option>
                    <option value="سرمایه‌های انسانی">سرمایه‌های انسانی</option>
                    <option value="بازرگانی خارجی">بازرگانی خارجی</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'اولویت جذب' : 'Priority'}</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              >
                <option value="URGENT">{isFa ? 'فوری (Urgent)' : 'Urgent'}</option>
                <option value="HIGH">{isFa ? 'بالا (High)' : 'High'}</option>
                <option value="MEDIUM">{isFa ? 'متوسط (Medium)' : 'Medium'}</option>
                <option value="LOW">{isFa ? 'عادی (Low)' : 'Low'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'تعداد ظرفیت باز' : 'Open Positions'}</label>
              <input
                type="number"
                min="1"
                max="20"
                value={openPositions}
                onChange={(e) => setOpenPositions(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'سقف بودجه ناخالص ماهانه' : 'Budget Range'}</label>
              <input
                type="text"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                placeholder="۸۰ - ۱۰۰ میلیون تومان"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'محل کار / شیوه همکاری' : 'Location & Mode'}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="تهران / ترکیبی / دورکاری"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'مدیر استخدام‌کننده (Hiring Manager)' : 'Hiring Manager'}</label>
              <input
                type="text"
                value={hiringManager}
                onChange={(e) => setHiringManager(e.target.value)}
                placeholder="دکتر رضا علوی"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'مهارت‌های ضروری (با ویرگول جدا کنید)' : 'Required Skills'}</label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              placeholder="Kubernetes, Go, Kafka, PostgreSQL"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{isFa ? 'شرح ماموریت شغلی و انتظارات' : 'Job Description'}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شرح وظایف و اهداف اصلی این ردیف شغلی..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white h-20 resize-none transition-all"
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
              {isFa ? 'انتشار موقعیت شغلی' : 'Publish Requisition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
