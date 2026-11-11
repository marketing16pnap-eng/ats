import React, { useState, useEffect } from 'react';
import { 
  X, 
  Edit3, 
  User, 
  Briefcase, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  GraduationCap, 
  Award, 
  Star,
  Send,
  Sparkles,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { 
  Candidate, 
  CandidateStatus, 
  AppLanguage, 
  Department, 
  RecruitmentStepNumber, 
  RECRUITMENT_STEPS 
} from '../types';

interface EditCandidateModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onSaveCandidate: (updatedCandidate: Candidate) => void;
  departments?: Department[];
}

export const EditCandidateModal: React.FC<EditCandidateModalProps> = ({
  candidate,
  isOpen,
  onClose,
  language,
  onSaveCandidate,
  departments,
}) => {
  const isFa = language === 'PERSIAN';

  const cleanInitialEmail = (e?: string) => {
    if (!e) return '';
    if (e.includes('@ats.local') || e.includes('@candidate.panap.ir')) return '';
    return e;
  };

  // Step 1: Personal & Identity
  const [name, setName] = useState(candidate?.name || '');
  const [gender, setGender] = useState(candidate?.gender || 'مرد');
  const [nationalId, setNationalId] = useState(candidate?.nationalId || '');
  const [phone, setPhone] = useState(candidate?.phone || '');
  const [email, setEmail] = useState(cleanInitialEmail(candidate?.email));
  const [location, setLocation] = useState(candidate?.location || '');

  // Workflow Stage Selection (1 to 7)
  const [currentStep, setCurrentStep] = useState<RecruitmentStepNumber>(candidate?.currentStep || 1);
  const [status, setStatus] = useState<CandidateStatus>(candidate?.status || 'STAGE_1_APPLIED');

  // Comments and Notes
  const [generalNotes, setGeneralNotes] = useState(candidate?.generalNotes || candidate?.remarks || '');
  const [activeNoteTab, setActiveNoteTab] = useState<RecruitmentStepNumber>(candidate?.currentStep || 1);
  const [stepNotes, setStepNotes] = useState<Record<number, string>>(() => {
    return {
      1: candidate?.stepNotes?.[1] || candidate?.step1?.evaluatorName || '',
      2: candidate?.stepNotes?.[2] || candidate?.step2?.siteIncompletionReason || '',
      3: candidate?.stepNotes?.[3] || (candidate?.step3 as any)?.videoNotes || '',
      4: candidate?.stepNotes?.[4] || candidate?.step4?.workHistorySummary || '',
      5: candidate?.stepNotes?.[5] || (candidate?.step5 as any)?.committeeNotes || '',
      6: candidate?.stepNotes?.[6] || (candidate?.step6 as any)?.backgroundNotes || '',
      7: candidate?.stepNotes?.[7] || candidate?.step7?.committeeNotes || '',
    };
  });

  // Step 2: Role & Source
  const [role, setRole] = useState(candidate?.role || '');
  const [department, setDepartment] = useState(candidate?.department || 'فنی و مهندسی');
  const [source, setSource] = useState(candidate?.source || 'سایت پناپ');
  const [trackingCode, setTrackingCode] = useState(candidate?.trackingCode || '');
  const [assignee, setAssignee] = useState(candidate?.assignee || '');
  const [resumeSubmissionDate, setResumeSubmissionDate] = useState(candidate?.resumeSubmissionDate || candidate?.appliedDate || '');

  // Step 3: Site & Message Follow-up
  const [siteMessageDate, setSiteMessageDate] = useState(candidate?.siteMessageDate || '');
  const [timePassed, setTimePassed] = useState(candidate?.timePassed || '');
  const [isMessageReceived, setIsMessageReceived] = useState(candidate?.isMessageReceived || 'بلی');
  const [isSiteCompleted, setIsSiteCompleted] = useState(candidate?.isSiteCompleted || 'بلی');
  const [siteIncompletionReason, setSiteIncompletionReason] = useState(candidate?.siteIncompletionReason || '');

  // Step 4: Competencies & Evaluation
  const [education, setEducation] = useState(candidate?.education || '');
  const [experienceYears, setExperienceYears] = useState(candidate?.experienceYears || 0);
  const [currentCompany, setCurrentCompany] = useState(candidate?.currentCompany || '');
  const [salaryExpectation, setSalaryExpectation] = useState(candidate?.salaryExpectation || candidate?.requestedSalary || '');
  const [skillsStr, setSkillsStr] = useState((candidate?.skills || []).join(', '));
  const [jobPriorityScore, setJobPriorityScore] = useState<number>(candidate?.jobPriorityScore || candidate?.rating || 3);
  const [siteCompletionScore, setSiteCompletionScore] = useState<number>(candidate?.siteCompletionScore || Math.round((candidate?.matchScore || 70) / 10));
  const [isResumeApproved, setIsResumeApproved] = useState(candidate?.isResumeApproved || 'تایید اولیه');
  const [remarks, setRemarks] = useState(candidate?.remarks || candidate?.summary || '');

  useEffect(() => {
    if (candidate) {
      setName(candidate.name || '');
      setGender(candidate.gender || 'مرد');
      setNationalId(candidate.nationalId || '');
      setPhone(candidate.phone || '');
      setEmail(cleanInitialEmail(candidate.email));
      setLocation(candidate.location || '');

      const initialStep = candidate.currentStep || 1;
      setCurrentStep(initialStep);
      setStatus(candidate.status || 'STAGE_1_APPLIED');
      setActiveNoteTab(initialStep);

      setGeneralNotes(candidate.generalNotes || candidate.remarks || '');
      setStepNotes({
        1: candidate.stepNotes?.[1] || candidate.step1?.evaluatorName || '',
        2: candidate.stepNotes?.[2] || candidate.step2?.siteIncompletionReason || '',
        3: candidate.stepNotes?.[3] || (candidate.step3 as any)?.videoNotes || '',
        4: candidate.stepNotes?.[4] || candidate.step4?.workHistorySummary || '',
        5: candidate.stepNotes?.[5] || (candidate.step5 as any)?.committeeNotes || '',
        6: candidate.stepNotes?.[6] || (candidate.step6 as any)?.backgroundNotes || '',
        7: candidate.stepNotes?.[7] || candidate.step7?.committeeNotes || '',
      });

      setRole(candidate.role || '');
      setDepartment(candidate.department || 'فنی و مهندسی');
      setSource(candidate.source || 'سایت پناپ');
      setTrackingCode(candidate.trackingCode || '');
      setAssignee(candidate.assignee || '');
      setResumeSubmissionDate(candidate.resumeSubmissionDate || candidate.appliedDate || '');

      setSiteMessageDate(candidate.siteMessageDate || '');
      setTimePassed(candidate.timePassed || '');
      setIsMessageReceived(candidate.isMessageReceived || 'بلی');
      setIsSiteCompleted(candidate.isSiteCompleted || 'بلی');
      setSiteIncompletionReason(candidate.siteIncompletionReason || '');

      setEducation(candidate.education || '');
      setExperienceYears(candidate.experienceYears || 0);
      setCurrentCompany(candidate.currentCompany || '');
      setSalaryExpectation(candidate.salaryExpectation || candidate.requestedSalary || '');
      setSkillsStr((candidate.skills || []).join(', '));
      setJobPriorityScore(candidate.jobPriorityScore || candidate.rating || 3);
      setSiteCompletionScore(candidate.siteCompletionScore || Math.round((candidate.matchScore || 70) / 10));
      setIsResumeApproved(candidate.isResumeApproved || 'تایید اولیه');
      setRemarks(candidate.remarks || candidate.summary || '');
    }
  }, [candidate]);

  const sourceOptions = [
    'سایت پناپ',
    'جاب ویژن (JobVision)',
    'ای-استخدام (e-estekhdam)',
    'جابینجا (Jobinja)',
    'لینکدین (LinkedIn)',
    'ایران تلنت (IranTalent)',
    'کوئرا (Quera)',
    'معرفی همکاران',
    'کارآموزی / نمایشگاه کار',
    'سایر'
  ];

  const handleStepChange = (newStepNum: RecruitmentStepNumber) => {
    setCurrentStep(newStepNum);
    setActiveNoteTab(newStepNum);
    const targetStep = RECRUITMENT_STEPS.find(s => s.stepNumber === newStepNum);
    if (targetStep) {
      setStatus(targetStep.status);
    }
  };

  const handleAdvanceStep = () => {
    if (currentStep < 7) {
      handleStepChange((currentStep + 1) as RecruitmentStepNumber);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      handleStepChange((currentStep - 1) as RecruitmentStepNumber);
    }
  };

  const handleStepNoteChange = (stepNum: number, text: string) => {
    setStepNotes(prev => ({
      ...prev,
      [stepNum]: text
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate || !name.trim() || !role.trim()) return;

    const skillsArray = skillsStr
      .split(/[,،]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const calculatedMatch = Math.min(100, Math.max(40, Math.round(siteCompletionScore * 10)));
    const calculatedRating = Math.min(5, Math.max(1, jobPriorityScore));

    const updated: Candidate = {
      ...candidate,
      name: name.trim(),
      role: role.trim(),
      department,
      email: email.trim(),
      phone: phone.trim() || candidate.phone,
      appliedDate: resumeSubmissionDate.trim() || candidate.appliedDate,
      experienceYears: Number(experienceYears) || 0,
      currentCompany: currentCompany.trim(),
      location: location.trim(),
      salaryExpectation: salaryExpectation.trim(),
      currentStep,
      status,
      matchScore: calculatedMatch,
      rating: calculatedRating,
      skills: skillsArray.length > 0 ? skillsArray : candidate.skills,
      education: education.trim(),
      summary: remarks.trim() || generalNotes.trim() || candidate.summary,

      // Step-specific & General notes
      stepNotes,
      generalNotes: generalNotes.trim(),

      // All 21 Excel fields
      trackingCode: trackingCode.trim(),
      assignee: assignee.trim(),
      resumeSubmissionDate: resumeSubmissionDate.trim(),
      gender,
      nationalId: nationalId.trim(),
      source,
      siteMessageDate: siteMessageDate.trim(),
      timePassed: timePassed.trim(),
      isMessageReceived,
      isSiteCompleted,
      siteIncompletionReason: siteIncompletionReason.trim(),
      isResumeApproved,
      jobPriorityScore,
      siteCompletionScore,
      remarks: remarks.trim() || generalNotes.trim(),
      requestedSalary: salaryExpectation.trim(),
    };

    onSaveCandidate(updated);
    onClose();
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="edit-candidate-dialog"
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#131B2E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">
                  {isFa ? `ویرایش پرونده کارجو: ${candidate.name}` : `Edit Candidate: ${candidate.name}`}
                </h3>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-mono">
                  {candidate.trackingCode || candidate.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isFa ? 'بروزرسانی مرحله استخدام، مشخصات فردی، تکمیل فرم سایت و ارزیابی‌ها' : 'Update recruitment step, candidate profile, and assessment records'}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Special Section: Recruitment Step & Workflow Stage Management */}
          <div className="p-4 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-2 border-blue-200 rounded-2xl space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-blue-200 text-blue-950 font-bold text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentStep}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {isFa ? `گام جاری: گام ${currentStep} - ${RECRUITMENT_STEPS.find(s => s.stepNumber === currentStep)?.titleFa}` : `Current Step: ${currentStep}`}
                  </div>
                  <div className="text-[11px] text-blue-700 font-normal">
                    {isFa ? 'امکان تغییر مستقیم، تایید و رفتن به گام بعد یا بازگشت به مراحل قبل' : 'Advance, step back, or freely jump between pipeline stages'}
                  </div>
                </div>
              </div>

              {/* Quick Step Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentStep <= 1}
                  onClick={handlePreviousStep}
                  className="px-3 py-1.5 rounded-xl border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <span>→</span>
                  <span>{isFa ? `برگشت به گام ${currentStep - 1}` : 'Previous Step'}</span>
                </button>
                <button
                  type="button"
                  disabled={currentStep >= 7}
                  onClick={handleAdvanceStep}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>{isFa ? `تایید و انتقال به گام ${currentStep + 1}` : 'Approve & Next'}</span>
                  <span>←</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  {isFa ? 'انتخاب و انتقال مستقیم به گام فرآیند *' : 'Select Step Directly *'}
                </label>
                <select
                  value={currentStep}
                  onChange={(e) => handleStepChange(Number(e.target.value) as RecruitmentStepNumber)}
                  className="w-full bg-white border-2 border-blue-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  {RECRUITMENT_STEPS.map((step) => (
                    <option key={step.stepNumber} value={step.stepNumber}>
                      گام {step.stepNumber}: {step.titleFa}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-600 mt-1">
                  {isFa ? 'برای مثال کارجوی گام ۷ را می‌توانید به گام ۳ بازگردانید و نمایش پرونده مطابق همان گام خواهد بود.' : 'You can revert a candidate from step 7 back to step 3.'}
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  {isFa ? 'وضعیت فرآیندی پرونده' : 'Candidate Status'}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CandidateStatus)}
                  className="w-full bg-white border-2 border-blue-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  <option value="STAGE_1_APPLIED">گام ۱: ثبت در پلتفرم‌ها (در جریان)</option>
                  <option value="STAGE_2_SITE_FORM">گام ۲: فرم سایت پناپ (در جریان)</option>
                  <option value="STAGE_3_VIDEO">گام ۳: ارسال ویدیو رسمی (در جریان)</option>
                  <option value="STAGE_4_PHONE_INTERVIEW">گام ۴: مصاحبه تلفنی (در جریان)</option>
                  <option value="STAGE_5_IN_PERSON">گام ۵: مصاحبه حضوری (در جریان)</option>
                  <option value="STAGE_6_BACKGROUND_CHECK">گام ۶: استعلام و بررسی پیشزمینه (در جریان)</option>
                  <option value="STAGE_7_FINAL_DECISION">گام ۷: تصمیم نهایی و شروع همکاری (در جریان)</option>
                  <option value="HIRED">استخدام قطعی (تکمیل نهایی فرآیند)</option>
                  <option value="REJECTED">عدم تایید / رد شده در این مرحله</option>
                  <option value="WITHDRAWN">انصراف متقاضی از ادامه فرآیند</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dedicated Section: General Candidate Notes & Step-by-Step Comments */}
          <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-200 text-amber-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{isFa ? 'یادداشت‌ها و توضیحات: تفکیکی مراحل و توضیحات کلی متقاضی' : 'Notes & Remarks: Step-by-Step & General Candidate Remarks'}</span>
            </div>

            {/* General Candidate Notes (Outside Steps) */}
            <div>
              <label className="block text-[11px] font-bold text-amber-900 mb-1">
                {isFa ? 'توضیحات و یادداشت کلی متقاضی (خارج از مراحل و عمومی)' : 'General Candidate Remarks (Overall)'}
              </label>
              <textarea
                rows={2}
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder={isFa ? 'توضیحات و ملاحظات عمومی کارجو، خصوصیات رفتاری یا نکات سازمانی خارج از مراحل جذب...' : 'General notes regarding the applicant outside of specific steps...'}
                className="w-full bg-white border border-amber-300/80 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium placeholder:text-slate-400"
              />
            </div>

            {/* Step-by-Step Specific Comments (7 Tabs) */}
            <div className="space-y-2 pt-2 border-t border-amber-200/60">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-amber-950">
                  {isFa ? 'توضیحات و کامنت اختصاصی برای هر یک از ۷ مرحله:' : 'Step-Specific Remarks (7 Steps):'}
                </label>
                <span className="text-[10px] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md font-bold">
                  {isFa ? `در حال ویرایش کامنت گام ${activeNoteTab}` : `Editing Step ${activeNoteTab} Note`}
                </span>
              </div>

              {/* 7 Step Note Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                {RECRUITMENT_STEPS.map((step) => {
                  const hasNote = Boolean(stepNotes[step.stepNumber]?.trim());
                  const isActive = activeNoteTab === step.stepNumber;
                  return (
                    <button
                      key={step.stepNumber}
                      type="button"
                      onClick={() => setActiveNoteTab(step.stepNumber)}
                      className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 border cursor-pointer ${
                        isActive
                          ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                          : hasNote
                          ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200/70'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-[10px]">گام {step.stepNumber}</span>
                      <span className="text-[9px] truncate max-w-full font-normal opacity-90">{step.shortTitle}</span>
                      {hasNote && !isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Step Note Textarea */}
              <div className="mt-2">
                <div className="text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeNoteTab}
                  </span>
                  <span>
                    {isFa 
                      ? `کامنت و توضیحات اختصاصی ${RECRUITMENT_STEPS.find(s => s.stepNumber === activeNoteTab)?.titleFa}:`
                      : `Remarks for Step ${activeNoteTab}`
                    }
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={stepNotes[activeNoteTab] || ''}
                  onChange={(e) => handleStepNoteChange(activeNoteTab, e.target.value)}
                  placeholder={isFa ? `توضیحات و ارزیابی اختصاصی مربوط به گام ${activeNoteTab}...` : `Add remarks specific to step ${activeNoteTab}...`}
                  className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Section 1: Personal & Identity */}
          <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs">
              <User className="w-4 h-4 text-blue-600" />
              <span>{isFa ? 'گام اول: مشخصات هویتی و فردی کارجو' : 'Step 1: Personal & Identity Information'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'نام و نام خانوادگی *' : 'Full Name *'}
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'جنسیت' : 'Gender'}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  <option value="مرد">مرد</option>
                  <option value="خانم">خانم</option>
                  <option value="سایر">سایر / نامشخص</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'کد ملی (۱۰ رقم)' : 'National ID'}
                </label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder={isFa ? 'کد ملی در صورت وجود' : 'National ID if available'}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'شماره تلفن همراه *' : 'Mobile Number *'}
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'آدرس ایمیل' : 'Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isFa ? 'در صورت وجود وارد شود' : 'Enter email if available'}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'محل زندگی / استان و شهر' : 'Location / City'}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={isFa ? 'استان و شهر محل سکونت' : 'Enter city/province if known'}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role, Department & Sourcing */}
          <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>{isFa ? 'گام دوم: ردیف شغلی و منبع دریافت رزومه' : 'Step 2: Position, Department & Sourcing'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'سمت بکارگیری (عنوان شغلی) *' : 'Target Role *'}
                </label>
                <input
                  required
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'دپارتمان سازمانی' : 'Department'}
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  {departments && departments.length > 0 ? (
                    departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="فنی و مهندسی">فنی و مهندسی</option>
                      <option value="تیم محصول">تیم محصول</option>
                      <option value="فروش و بازاریابی">فروش و بازاریابی</option>
                      <option value="منابع انسانی">منابع انسانی</option>
                      <option value="مالی و حقوقی">مالی و حقوقی</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'محل دریافت رزومه' : 'Resume Source'}
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  {sourceOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'کد ارجاع / شناسه پیگیری' : 'Tracking Code'}
                </label>
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'مسئول پیگیری' : 'Assignee'}
                </label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'تاریخ ارسال رزومه' : 'Resume Submission Date'}
                </label>
                <input
                  type="text"
                  value={resumeSubmissionDate}
                  onChange={(e) => setResumeSubmissionDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Site & Message Follow-up */}
          <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs">
              <Send className="w-4 h-4 text-blue-600" />
              <span>{isFa ? 'گام سوم: وضعیت پیامک و تکمیل فرم سایت' : 'Step 3: Site Application & Message Verification'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'تاریخ ارسال پیام تکمیل سایت' : 'Site Message Date'}
                </label>
                <input
                  type="text"
                  value={siteMessageDate}
                  onChange={(e) => setSiteMessageDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'تا کنون (مدت سپری شده)' : 'Time Elapsed'}
                </label>
                <input
                  type="text"
                  value={timePassed}
                  onChange={(e) => setTimePassed(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'اطمینان از اخذ پیام توسط مخاطب' : 'Message Received Confirmation'}
                </label>
                <select
                  value={isMessageReceived}
                  onChange={(e) => setIsMessageReceived(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  <option value="بلی">بلی (تحویل داده شد)</option>
                  <option value="خیر">خیر (عدم وصول)</option>
                  <option value="در حال بررسی">در حال بررسی / ارسال مجدد</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'آیا سایت تکمیل شد؟' : 'Site Form Completed?'}
                </label>
                <select
                  value={isSiteCompleted}
                  onChange={(e) => setIsSiteCompleted(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  <option value="بلی">بلی (تکمیل فرم ثبت شده)</option>
                  <option value="خیر">خیر (عدم تکمیل)</option>
                  <option value="در انتظار تکمیل">در انتظار تکمیل</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'علت عدم تکمیل سایت (در صورت وجود)' : 'Reason for Incompletion'}
                </label>
                <input
                  type="text"
                  value={siteIncompletionReason}
                  onChange={(e) => setSiteIncompletionReason(e.target.value)}
                  placeholder={isFa ? 'مثال: عدم پاسخگویی، نقص مدارک...' : 'Reason...'}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Competencies & Evaluation */}
          <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs">
              <Award className="w-4 h-4 text-blue-600" />
              <span>{isFa ? 'گام چهارم: سوابق تحصیلی، شغلی و ارزیابی ها' : 'Step 4: Background & Qualifications'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'تحصیلات و رشته' : 'Education'}
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'سابقه کاری مرتبط (سال)' : 'Experience (Years)'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'شرکت فعلی / قبلی' : 'Current / Previous Company'}
                </label>
                <input
                  type="text"
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'حقوق درخواستی (تومان)' : 'Requested Salary'}
                </label>
                <input
                  type="text"
                  value={salaryExpectation}
                  onChange={(e) => setSalaryExpectation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'اولویت و اهمیت پست شغلی (۱ تا ۵)' : 'Job Priority (1-5)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={jobPriorityScore}
                  onChange={(e) => setJobPriorityScore(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'امتیاز تکمیل سایت / غربالگری (۱ تا ۱۰)' : 'Screening Score (1-10)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={siteCompletionScore}
                  onChange={(e) => setSiteCompletionScore(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'آیا رزومه در این مرحله مورد تایید است؟' : 'Resume Approved?'}
                </label>
                <select
                  value={isResumeApproved}
                  onChange={(e) => setIsResumeApproved(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                >
                  <option value="تایید اولیه">تایید اولیه (مناسب ادامه مراحل)</option>
                  <option value="در حال بررسی">در حال بررسی و تطبیق</option>
                  <option value="عدم تایید">عدم تایید / رد</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'مهارت‌ها و شایستگی‌ها (با کاما جدا کنید)' : 'Skills'}
                </label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isFa ? 'ملاحظات و توضیحات تکمیلی' : 'Remarks / Evaluation Notes'}
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isFa ? 'انصراف' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isFa ? 'ذخیره تغییرات پرونده' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
