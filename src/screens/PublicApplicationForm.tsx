import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Upload, 
  Briefcase, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Building2, 
  GraduationCap, 
  DollarSign, 
  Calendar,
  Sparkles,
  ChevronRight,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { Candidate, JobRequisition, Department } from '../types';
import { generateUniqueCandidateId } from '../utils/sanitizeData';

interface PublicApplicationFormProps {
  requisitions: JobRequisition[];
  departments: Department[];
  onSubmitCandidate: (candidate: Candidate) => void;
  companyLogo?: string;
  onBackToAdmin?: () => void;
}

export const PublicApplicationForm: React.FC<PublicApplicationFormProps> = ({
  requisitions,
  departments,
  onSubmitCandidate,
  companyLogo,
  onBackToAdmin,
}) => {
  // Active Requisitions
  const activeRequisitions = requisitions.filter(r => r.status === 'ACTIVE');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    gender: 'مرد',
    nationalId: '',
    phone: '',
    email: '',
    location: 'تهران',
    role: activeRequisitions.length > 0 ? activeRequisitions[0].title : 'توسعه‌دهنده React / TypeScript',
    department: activeRequisitions.length > 0 ? activeRequisitions[0].department : 'فنی و مهندسی',
    experienceYears: 3,
    education: 'کارشناسی مهندسی کامپیوتر',
    currentCompany: '',
    requestedSalary: '۴۰ - ۵۰ میلیون تومان',
    skills: 'React, TypeScript, Tailwind CSS, Git',
    summary: '',
    resumeFileName: '',
    resumeFileUrl: '',
    remarks: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCandidate, setSubmittedCandidate] = useState<Candidate | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // When role changes, update department automatically if available
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    const matched = activeRequisitions.find(r => r.title === selectedTitle);
    setFormData(prev => ({
      ...prev,
      role: selectedTitle,
      department: matched ? matched.department : prev.department,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resumeFileName: file.name,
        resumeFileUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `REF-${randomNum}`;
    const now = new Date();
    const jalaliDate = '۱۴۰۳/۰۶/۰۸';

    const newCand: Candidate = {
      id: generateUniqueCandidateId(trackingCode),
      rowNumber: Date.now() % 10000,
      trackingCode: trackingCode,
      assignee: 'کارشناس جذب سایت',
      resumeSubmissionDate: jalaliDate,
      gender: formData.gender,
      nationalId: formData.nationalId || '---',
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      department: formData.department,
      source: 'سایت پناپ',
      siteMessageDate: jalaliDate,
      timePassed: 'امروز',
      isMessageReceived: 'بله',
      isSiteCompleted: 'بله',
      isResumeApproved: 'در دست بررسی',
      jobPriorityScore: 4.5,
      siteCompletionScore: 10,
      remarks: formData.remarks || 'ارسال شده از طریق فرم آنلاین کارجویان وبسایت پناپ',
      currentStageFa: 'گام ۲: تکمیل فرم سایت',
      appliedDate: jalaliDate,
      experienceYears: Number(formData.experienceYears) || 0,
      currentCompany: formData.currentCompany || '---',
      location: formData.location || 'تهران',
      status: 'STAGE_2_SITE_FORM',
      currentStep: 2,
      militaryStatus: formData.gender === 'زن' ? 'NOT_APPLICABLE' : 'COMPLETED',
      militaryStatusFa: formData.gender === 'زن' ? 'عدم نیاز (بانوان)' : 'کارت پایان خدمت',
      matchScore: 92,
      rating: 4.5,
      skills: formData.skills.split(/[,،]/).map(s => s.trim()).filter(Boolean),
      education: formData.education,
      salaryExpectation: formData.requestedSalary,
      requestedSalary: formData.requestedSalary,
      summary: formData.summary || 'متقاضی تکمیل‌کننده فرم همکاری در وبسایت پناپ',
      notes: [`ارسال شده در ${now.toLocaleTimeString('fa-IR')} از فرم سایت`],
      isBookmarked: false,

      step1: {
        name: formData.name.trim(),
        nationalId: formData.nationalId || '',
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        requestedRole: formData.role,
        department: formData.department,
        militaryStatus: formData.gender === 'زن' ? 'NOT_APPLICABLE' : 'COMPLETED',
        source: 'سایت پناپ',
        initialResumeStatus: 'APPROVED',
        submissionDate: jalaliDate,
        evaluatorName: 'سیستم جذب سایت',
      },

      step2: {
        siteMessageSentDate: jalaliDate,
        siteMessageStatus: 'DELIVERED',
        isSiteCompleted: 'COMPLETED',
        daysElapsed: 0,
        step2Status: 'APPROVED',
      }
    };

    setTimeout(() => {
      onSubmitCandidate(newCand);
      setSubmittedCandidate(newCand);
      setIsSubmitting(false);
    }, 600);
  };

  const handleCopyTrackingCode = () => {
    if (submittedCandidate?.trackingCode) {
      navigator.clipboard.writeText(submittedCandidate.trackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // SUCCESS VIEW
  if (submittedCandidate) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-slate-100 p-4 sm:p-8 flex items-center justify-center font-sans select-none" dir="rtl">
        <div className="w-full max-w-xl bg-[#111C35] rounded-3xl p-8 shadow-2xl border border-slate-800 text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            ثبت موفق اطلاعات در سامانه جذب
          </span>

          <h2 className="text-2xl font-black text-white mt-3">
            رزومه و مشخصات شما با موفقیت دریافت شد
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-md mx-auto">
            کارجوی گرامی <strong className="text-white">{submittedCandidate.name}</strong>، درخواست همکاری شما برای سمت <strong className="text-blue-400">{submittedCandidate.role}</strong> در بانک استعدادها ثبت گردید.
          </p>

          {/* Tracking Code Box */}
          <div className="my-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-bold">کد پیگیری اختصاصی پرونده شما:</div>
              <div className="text-xl font-black font-mono text-emerald-400 mt-0.5 tracking-wider">
                {submittedCandidate.trackingCode}
              </div>
            </div>

            <button
              onClick={handleCopyTrackingCode}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedCode ? 'کپی شد' : 'کپی کد پیگیری'}</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed mb-6 bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
            ✉️ پس از غربالگری اولیه توسط تیم منابع انسانی، نتیجه ارزیابی از طریق پیامک به شماره همراه <strong className="text-slate-200 font-mono">{submittedCandidate.phone}</strong> ارسال خواهد شد.
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedCandidate(null);
                setFormData(prev => ({ ...prev, name: '', nationalId: '', phone: '', email: '', summary: '' }));
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              ارسال درخواست جدید
            </button>

            {onBackToAdmin && (
              <button
                onClick={onBackToAdmin}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                بازگشت به پنل مدیریت
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MAIN PUBLIC FORM VIEW
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 p-4 sm:p-8 font-sans select-none" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Top Header / Brand */}
        <div className="bg-[#111C35] rounded-3xl p-6 sm:p-8 mb-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-right">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="h-14 max-w-[160px] object-contain rounded-2xl p-1.5 bg-white/10 border border-white/20" 
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-600/30">
                P
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">سامانه جذب و استخدام</h1>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-black border border-blue-400/30">
                  همکاری با ما
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-bold">
                فرم رسمی ثبت‌نام و ارسال رزومه متقاضیان استخدام
              </p>
            </div>
          </div>

          {onBackToAdmin && (
            <button
              onClick={onBackToAdmin}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              ورود به پنل مدیریت
            </button>
          )}
        </div>

        {/* Application Form Card */}
        <form onSubmit={handleSubmit} className="bg-[#111C35] rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
          {/* Section 1: Personal Info */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800 text-right">
              <User className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm font-black text-white">۱. اطلاعات فردی و تماس</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  نام و نام خانوادگی <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: آرین تهرانی"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  جنسیت <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="مرد">مرد</option>
                  <option value="زن">زن</option>
                </select>
              </div>

              {/* National ID */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  کد ملی <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  شماره تلفن همراه <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  ایمیل معتبر <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="مثال: candidate@gmail.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* City / Location */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  شهر / استان محل سکونت
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="مثال: تهران"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Position & Career Details */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800 text-right">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-black text-white">۲. موقعیت شغلی و نیازمندی‌ها</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Desired Position */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  موقعیت شغلی درخواستی <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={handleRoleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-bold"
                >
                  {activeRequisitions.map((req) => (
                    <option key={req.id} value={req.title}>
                      {req.title} ({req.department})
                    </option>
                  ))}
                  <option value="سایر موقعیت‌های شغلی">سایر موقعیت‌های استخدامی</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  دپارتمان سازمانی
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-bold"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Experience Years */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  سابقه کار مرتبط (سال) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Education */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  آخرین مدرک و رشته تحصیلی <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="مثال: کارشناسی ارشد مهندسی صنایع - دانشگاه تهران"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Current Company */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  آخرین شرکت یا محل فعالیت
                </label>
                <input
                  type="text"
                  value={formData.currentCompany}
                  onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                  placeholder="مثال: شرکت داده‌پردازی پناپ"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Requested Salary */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                  حقوق درخواستی ماهیانه (تومان)
                </label>
                <input
                  type="text"
                  value={formData.requestedSalary}
                  onChange={(e) => setFormData({ ...formData, requestedSalary: e.target.value })}
                  placeholder="مثال: ۴۵ میلیون تومان"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                مهارت‌های کلیدی و تخصص‌ها (با ویرگول یا کاما جدا کنید) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="مثال: React, TypeScript, Node.js, Docker, UI/UX"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-sans"
              />
            </div>
          </div>

          {/* Section 3: Resume Upload & Bio */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800 text-right">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-black text-white">۳. بارگذاری فایل رزومه و توضیحات</h2>
            </div>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center transition-all bg-slate-900/50 mb-4">
              <input
                type="file"
                id="public-resume-file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="public-resume-file" className="cursor-pointer block">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white mb-1">
                  {formData.resumeFileName ? (
                    <span className="text-emerald-400 font-mono">فایل انتخاب شده: {formData.resumeFileName}</span>
                  ) : (
                    <span>برای بارگذاری فایل رزومه (PDF یا Docx) کلیک کنید یا آن را بکشید و رها کنید</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">حداکثر حجم مجاز: ۱۰ مگابایت</div>
              </label>
            </div>

            {/* Summary / Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                خلاصه سوابق حرفه‌ای یا پیام برای تیم استخدام
              </label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="توضیح مختصری از دستاوردها، انگیزه‌ها و تجارب کاری خود را بنویسید..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>تمامی اطلاعات ارسالی مطابق با قوانین حریم خصوصی بررسی خواهند شد.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ثبت نهایی و ارسال رزومه</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
