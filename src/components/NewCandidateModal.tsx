import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  User, 
  Briefcase, 
  Building2, 
  Phone, 
  CreditCard, 
  ShieldCheck, 
  Globe2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { 
  Candidate, 
  CandidateStatus, 
  AppLanguage, 
  Department, 
  MilitaryStatus, 
  JobPlatformSource,
  Step1Data,
  RecruitmentStepNumber
} from '../types';

interface NewCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onAddCandidate: (candidate: Candidate) => void;
  departments?: Department[];
}

export const NewCandidateModal: React.FC<NewCandidateModalProps> = ({
  isOpen,
  onClose,
  language,
  onAddCandidate,
  departments = [],
}) => {
  const isFa = language === 'PERSIAN';
  const defaultDept = departments.length > 0 ? departments[0].name : 'فنی و مهندسی';

  // Step 1: مشخصات کلی متقاضی
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requestedRole, setRequestedRole] = useState('');
  const [department, setDepartment] = useState(defaultDept);
  const [militaryStatus, setMilitaryStatus] = useState<MilitaryStatus>('COMPLETED');
  const [source, setSource] = useState<JobPlatformSource>('جاب ویژن (JobVision)');
  const [customSource, setCustomSource] = useState('');
  const [initialResumeStatus, setInitialResumeStatus] = useState<'APPROVED' | 'PENDING' | 'REJECTED'>('APPROVED');
  const [rejectionReason, setRejectionReason] = useState('');
  const [assignee, setAssignee] = useState('کارشناس جذب و استخدام');
  const [notes, setNotes] = useState('');

  // Quick Role Suggestions
  const roleSuggestions = [
    'مهندس ارشد بک‌اند',
    'توسعه‌دهنده فرانت‌اند',
    'کارشناس بازرگانی خارجی',
    'طراح محصول و UX',
    'مهندس DevOps و زیرساخت',
    'کارشناس منابع انسانی',
    'متخصص هوش مصنوعی',
    'مدیر محصول'
  ];

  const sourceOptions: { label: string; value: JobPlatformSource }[] = [
    { label: 'سایت پناپ (فرم همکاری با ما)', value: 'سایت پناپ' },
    { label: 'ای-استخدام (e-estekhdam)', value: 'ای-استخدام (e-estekhdam)' },
    { label: 'جاب ویژن (JobVision)', value: 'جاب ویژن (JobVision)' },
    { label: 'جابینجا (Jobinja)', value: 'جابینجا (Jobinja)' },
    { label: 'لینکدین (LinkedIn)', value: 'لینکدین (LinkedIn)' },
    { label: 'ایران تلنت (IranTalent)', value: 'ایران تلنت (IranTalent)' },
    { label: 'کوئرا (Quera)', value: 'کوئرا (Quera)' },
    { label: 'معرفی همکاران', value: 'معرفی همکاران' },
    { label: 'سایر مسیرها', value: 'سایر' },
  ];

  const militaryOptions: { label: string; value: MilitaryStatus }[] = [
    { label: 'کارت پایان خدمت', value: 'COMPLETED' },
    { label: 'معافیت دائم (پزشکی / کفالت)', value: 'PERMANENT_EXEMPT' },
    { label: 'معافیت تحصیلی', value: 'EDUCATIONAL_EXEMPT' },
    { label: 'مشمول خدمت', value: 'SUBJECT' },
    { label: 'عدم نیاز (ویژه بانوان)', value: 'NOT_APPLICABLE' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !requestedRole.trim() || !phone.trim()) return;

    const actualSource = source === 'سایر' && customSource.trim() ? customSource.trim() : source;
    const nowPersianDate = '۱۴۰۳/۰۶/' + String(Math.floor(Math.random() * 20) + 10).padStart(2, '۰');
    const trackingCode = `PNAP-${Math.floor(1000 + Math.random() * 9000)}`;

    let targetStep: RecruitmentStepNumber = 1;
    let targetStatus: CandidateStatus = 'STAGE_1_APPLIED';

    if (initialResumeStatus === 'APPROVED') {
      targetStep = 2;
      targetStatus = 'STAGE_2_SITE_FORM';
    } else if (initialResumeStatus === 'REJECTED') {
      targetStep = 1;
      targetStatus = 'REJECTED';
    } else {
      targetStep = 1;
      targetStatus = 'STAGE_1_APPLIED';
    }

    const militaryFaMap: Record<MilitaryStatus, string> = {
      COMPLETED: 'کارت پایان خدمت',
      PERMANENT_EXEMPT: 'معافیت دائم',
      EDUCATIONAL_EXEMPT: 'معافیت تحصیلی',
      SUBJECT: 'مشمول',
      NOT_APPLICABLE: 'عدم نیاز (بانوان)',
    };

    const step1Data: Step1Data = {
      name: name.trim(),
      nationalId: nationalId.trim(),
      phone: phone.trim(),
      email: email.trim(),
      requestedRole: requestedRole.trim(),
      department,
      militaryStatus,
      militaryStatusFa: militaryFaMap[militaryStatus],
      source: actualSource,
      initialResumeStatus,
      rejectionReason: initialResumeStatus === 'REJECTED' ? rejectionReason.trim() : undefined,
      submissionDate: nowPersianDate,
      evaluatorName: assignee,
      notes: notes.trim(),
    };

    const newCandidate: Candidate = {
      id: `CAN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      nationalId: nationalId.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.trim().replace(/\s+/g, '.')}@candidate.panap.ir`,
      role: requestedRole.trim(),
      department,
      appliedDate: nowPersianDate,
      experienceYears: 2,
      currentCompany: 'متقاضی ثبت شده',
      location: 'تهران',
      status: targetStatus,
      currentStep: targetStep,
      militaryStatus,
      militaryStatusFa: militaryFaMap[militaryStatus],
      source: actualSource,
      trackingCode,
      assignee,
      matchScore: initialResumeStatus === 'APPROVED' ? 88 : 50,
      rating: 4.0,
      skills: [requestedRole.trim()],
      education: 'کارشناسی',
      salaryExpectation: 'توافقی',
      summary: notes.trim() || `ثبت مشخصات اولیه متقاضی از طریق پلتفرم ${actualSource}.`,
      notes: notes.trim() ? [`یادداشت اولیه: ${notes.trim()}`] : [],
      isBookmarked: false,

      // Step 1 Payload
      step1: step1Data,

      // Initialize Step 2 default structure ready for completion
      step2: {
        siteMessageSentDate: nowPersianDate,
        siteMessageStatus: 'SENT',
        isSiteCompleted: 'PENDING',
        daysElapsed: 0,
        step2Status: 'PENDING',
      },

      // Legacy compatibility
      isResumeApproved: initialResumeStatus === 'APPROVED' ? 'بله' : 'خیر',
      currentStageFa: targetStep === 2 ? 'گام ۲: تکمیل فرم سایت' : 'گام ۱: ثبت اولیه',
    };

    onAddCandidate(newCandidate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir={isFa ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                  گام اول فرآیند جذب
                </span>
                <h2 className="text-lg font-bold text-white">
                  ثبت مشخصات کلی متقاضی
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                دریافت رزومه از پلتفرم‌های کاریابی (سایت پناپ، ای‌استخدام، جابینجا، جاب‌ویژن)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Guidance Alert */}
        <div className="px-6 py-3 bg-blue-50/80 border-b border-blue-100 flex items-center gap-3 text-xs text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            مطابق رویه ۷ مرحله‌ای پناپ، در این فرم تنها <strong>اطلاعات گام اول</strong> ثبت می‌شود. با تأیید اولیه، پرونده به‌طور خودکار به <strong>گام دوم (تکمیل فرم سایت)</strong> منتقل خواهد شد.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Row 1: Name & National ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                نام و نام خانوادگی متقاضی <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: علی محمدی"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-sm bg-slate-50/50 hover:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                کد ملی متقاضی (۱۰ رقم)
              </label>
              <input 
                type="text"
                maxLength={10}
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-sm bg-slate-50/50 hover:bg-white transition-colors text-left"
              />
            </div>
          </div>

          {/* Row 2: Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                شماره تماس / موبایل <span className="text-rose-500">*</span>
              </label>
              <input 
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-sm bg-slate-50/50 hover:bg-white transition-colors text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                آدرس ایمیل (اختیاری)
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="مثال: ali.mohammadi@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-sm bg-slate-50/50 hover:bg-white transition-colors text-left"
              />
            </div>
          </div>

          {/* Row 3: Role & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                سمت درخواستی <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                required
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                placeholder="مثال: کارشناس بازرگانی خارجی"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-sm bg-slate-50/50 hover:bg-white transition-colors"
              />
              {/* Quick suggestion pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {roleSuggestions.slice(0, 4).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRequestedRole(r)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors border border-slate-200"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                واحد سازمانی / دپارتمان
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-sm bg-slate-50/50 hover:bg-white transition-colors"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
                {departments.length === 0 && (
                  <>
                    <option value="فنی و مهندسی">فنی و مهندسی</option>
                    <option value="بازرگانی خارجی">بازرگانی خارجی</option>
                    <option value="تحقیق و توسعه هوش مصنوعی">تحقیق و توسعه هوش مصنوعی</option>
                    <option value="سرمایه‌های انسانی">سرمایه‌های انسانی</option>
                    <option value="مارکتینگ و رشد">مارکتینگ و رشد</option>
                    <option value="مالی و حقوقی">مالی و حقوقی</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Row 4: Military Status & Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                وضعیت نظام وظیفه <span className="text-rose-500">*</span>
              </label>
              <select
                value={militaryStatus}
                onChange={(e) => setMilitaryStatus(e.target.value as MilitaryStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-sm bg-slate-50/50 hover:bg-white transition-colors"
              >
                {militaryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                منبع دریافت رزومه <span className="text-rose-500">*</span>
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as JobPlatformSource)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-sm bg-slate-50/50 hover:bg-white transition-colors"
              >
                {sourceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {source === 'سایر' && (
                <input
                  type="text"
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  placeholder="نام پلتفرم یا کانال دریافت را بنویسید..."
                  className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                />
              )}
            </div>
          </div>

          {/* Step 1 Decision: Initial Resume Approval */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              تأیید یا رد رزومه اولیه (تصمیم گام اول)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setInitialResumeStatus('APPROVED')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  initialResumeStatus === 'APPROVED'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                تأیید و هدایت به گام ۲
              </button>

              <button
                type="button"
                onClick={() => setInitialResumeStatus('PENDING')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  initialResumeStatus === 'PENDING'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4" />
                در حال بررسی
              </button>

              <button
                type="button"
                onClick={() => setInitialResumeStatus('REJECTED')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  initialResumeStatus === 'REJECTED'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <XCircle className="w-4 h-4" />
                رد رزومه اولیه
              </button>
            </div>

            {initialResumeStatus === 'REJECTED' && (
              <div className="animate-in fade-in space-y-1.5 pt-1">
                <label className="block text-xs font-medium text-rose-700">
                  علت رد رزومه در گام اول:
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="مثال: عدم تطابق مدرک تحصیلی، شرایط نامناسب جغرافیایی..."
                  className="w-full px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>
            )}
          </div>

          {/* Notes & Assignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                مسئول پیگیری پرونده
              </label>
              <input 
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="نام کارشناس جذب"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظات و توضیحات رزومه (اختیاری)
              </label>
              <input 
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="نکات برجسته یا یادداشت‌های اولیه"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              انصراف
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>
                {initialResumeStatus === 'APPROVED'
                  ? 'ثبت متقاضی و انتقال به گام دوم'
                  : initialResumeStatus === 'REJECTED'
                  ? 'ثبت متقاضی با وضعیت رد اولیه'
                  : 'ثبت متقاضی در گام اول'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
