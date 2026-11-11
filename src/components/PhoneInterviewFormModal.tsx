import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  Award, 
  Save, 
  Edit3, 
  Settings, 
  Printer, 
  Plus, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Building,
  ArrowRight
} from 'lucide-react';
import { 
  Candidate, 
  AppLanguage, 
  PhoneInterviewFormData, 
  PhoneInterviewFormTemplate,
  FormSectionItem,
  FormQuestionItem 
} from '../types';
import { 
  DEFAULT_PHONE_INTERVIEW_TEMPLATE, 
  getPhoneInterviewTemplate, 
  savePhoneInterviewTemplate 
} from '../data/interviewFormDefaults';

interface PhoneInterviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  language: AppLanguage;
  onSaveForm: (candidateId: string, formData: PhoneInterviewFormData) => void;
  mode?: 'FILL' | 'CUSTOMIZE_TEMPLATE';
}

export const PhoneInterviewFormModal: React.FC<PhoneInterviewFormModalProps> = ({
  isOpen,
  onClose,
  candidate,
  language,
  onSaveForm,
  mode = 'FILL',
}) => {
  const isFa = language === 'PERSIAN';

  // Mode: 'FILL' or 'CUSTOMIZE_TEMPLATE'
  const [activeTab, setActiveTab] = useState<'FILL' | 'CUSTOMIZE_TEMPLATE'>(mode);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(mode);
    }
  }, [isOpen, mode]);
  
  // Template State
  const [template, setTemplate] = useState<PhoneInterviewFormTemplate>(() => getPhoneInterviewTemplate());

  // Form Data State
  const [interviewerName, setInterviewerName] = useState('واحد جذب و استخدام');
  const [interviewerRole, setInterviewerRole] = useState('کارشناس ارزیابی منابع انسانی');
  const [interviewDate, setInterviewDate] = useState(() => {
    const d = new Date();
    return new Intl.DateTimeFormat('fa-IR').format(d);
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [totalScore, setTotalScore] = useState<number>(8);
  const [strengths, setStrengths] = useState<string>('');
  const [weaknesses, setWeaknesses] = useState<string>('');
  const [overallEvaluation, setOverallEvaluation] = useState<string>('');
  const [recommendation, setRecommendation] = useState<'INVITE_IN_PERSON' | 'REQUEST_MORE_INFO' | 'REJECT'>('INVITE_IN_PERSON');

  // Load candidate's existing phone form data if available
  useEffect(() => {
    if (candidate) {
      if (candidate.phoneInterviewForm) {
        const saved = candidate.phoneInterviewForm;
        setInterviewerName(saved.interviewerName || 'واحد جذب و استخدام');
        setInterviewerRole(saved.interviewerRole || 'کارشناس ارزیابی منابع انسانی');
        setInterviewDate(saved.interviewDate || new Intl.DateTimeFormat('fa-IR').format(new Date()));
        setAnswers(saved.answers || {});
        setTotalScore(saved.totalScore || 8);
        setStrengths(saved.strengths || '');
        setWeaknesses(saved.weaknesses || '');
        setOverallEvaluation(saved.overallEvaluation || '');
        setRecommendation(saved.recommendation || 'INVITE_IN_PERSON');
      } else {
        // Pre-fill defaults from Step 4 or candidate data
        const initialAnswers: Record<string, string> = {};
        if (candidate.step4) {
          if (candidate.step4.workHistorySummary) initialAnswers['q4'] = candidate.step4.workHistorySummary;
          if (candidate.step4.motivation) initialAnswers['q2'] = candidate.step4.motivation;
          if (candidate.step4.companyKnowledge) initialAnswers['q1'] = candidate.step4.companyKnowledge;
          if (candidate.step4.keyRoleSkills) initialAnswers['q5'] = candidate.step4.keyRoleSkills;
          if (candidate.step4.expectedSalary) initialAnswers['q16'] = candidate.step4.expectedSalary;
        }
        setAnswers(initialAnswers);
        setTotalScore(candidate.step4?.phoneTotalScore ? candidate.step4.phoneTotalScore * 2 : 8);
        setStrengths('');
        setWeaknesses('');
        setOverallEvaluation(candidate.notes?.[0] || '');
        setRecommendation(candidate.currentStep && candidate.currentStep >= 5 ? 'INVITE_IN_PERSON' : 'INVITE_IN_PERSON');
      }
    }
  }, [candidate]);

  if (!isOpen) return null;

  const handleAnswerChange = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleSave = () => {
    if (!candidate) return;

    const payload: PhoneInterviewFormData = {
      candidateId: candidate.id,
      candidateName: candidate.name,
      phone: candidate.phone,
      role: candidate.role,
      interviewerName,
      interviewerRole,
      interviewDate,
      answers,
      totalScore,
      strengths,
      weaknesses,
      overallEvaluation,
      recommendation,
      updatedAt: new Date().toISOString(),
    };

    onSaveForm(candidate.id, payload);
    onClose();
  };

  // Template Customization Handlers
  const handleUpdateTemplateTitle = (title: string) => {
    setTemplate((prev) => ({ ...prev, formTitle: title }));
  };

  const handleUpdateSectionTitle = (sectionIndex: number, newTitle: string) => {
    setTemplate((prev) => {
      const copy = { ...prev };
      copy.sections[sectionIndex].sectionTitle = newTitle;
      return copy;
    });
  };

  const handleUpdateQuestion = (sectionIndex: number, qIndex: number, field: keyof FormQuestionItem, value: any) => {
    setTemplate((prev) => {
      const copy = { ...prev };
      copy.sections[sectionIndex].questions[qIndex] = {
        ...copy.sections[sectionIndex].questions[qIndex],
        [field]: value,
      };
      return copy;
    });
  };

  const handleAddQuestion = (sectionIndex: number) => {
    setTemplate((prev) => {
      const copy = { ...prev };
      const sec = copy.sections[sectionIndex];
      const newNum = sec.questions.length > 0 ? Math.max(...sec.questions.map(q => q.questionNumber)) + 1 : 1;
      sec.questions.push({
        id: `q_custom_${Date.now()}`,
        questionNumber: newNum,
        questionText: 'عنوان سوال جدید ارزیابی...',
        goalDescription: 'هدف از طرح این سوال توسط مصاحبه‌کننده',
        answerType: 'textarea',
        isRequired: false,
      });
      return copy;
    });
  };

  const handleDeleteQuestion = (sectionIndex: number, qIndex: number) => {
    setTemplate((prev) => {
      const copy = { ...prev };
      copy.sections[sectionIndex].questions.splice(qIndex, 1);
      return copy;
    });
  };

  const handleAddSection = () => {
    setTemplate((prev) => {
      const copy = { ...prev };
      const newSecNum = copy.sections.length + 1;
      copy.sections.push({
        id: `sec_custom_${Date.now()}`,
        sectionNumber: newSecNum,
        sectionTitle: `${newSecNum}- عنوان بخش جدید`,
        questions: [
          {
            id: `q_custom_${Date.now()}`,
            questionNumber: 1,
            questionText: 'سوال اول این بخش...',
            goalDescription: 'هدف از طرح سوال',
            answerType: 'textarea',
          }
        ]
      });
      return copy;
    });
  };

  const handleDeleteSection = (secIndex: number) => {
    setTemplate((prev) => {
      const copy = { ...prev };
      copy.sections.splice(secIndex, 1);
      return copy;
    });
  };

  const handleSaveTemplateChanges = () => {
    savePhoneInterviewTemplate(template);
    alert('قالب فرم ۱ (مصاحبه تلفنی) با موفقیت ذخیره و در تمام سیستم اعمال شد.');
    setActiveTab('FILL');
  };

  const handleResetTemplate = () => {
    if (window.confirm('آیا از بازنشانی قالب به فرم استاندارد و پیش‌فرض پناپ مطمئن هستید؟')) {
      setTemplate(DEFAULT_PHONE_INTERVIEW_TEMPLATE);
      savePhoneInterviewTemplate(DEFAULT_PHONE_INTERVIEW_TEMPLATE);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div 
        id="phone-interview-modal"
        className="bg-white rounded-3xl w-full max-w-5xl my-4 shadow-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[92vh]"
        dir={isFa ? 'rtl' : 'ltr'}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-blue-900/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold shadow-xs">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30">
                  سامانه جذب پناپ
                </span>
                <h3 className="font-extrabold text-base sm:text-lg">
                  {template.formTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {candidate ? `پرونده ارزیابی: ${candidate.name} (${candidate.role})` : 'طراحی و تنظیم قالب استاندارد فرم'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('FILL')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'FILL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                تکمیل فرم کارجو
              </button>
              <button
                onClick={() => setActiveTab('CUSTOMIZE_TEMPLATE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'CUSTOMIZE_TEMPLATE'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                ویرایش و شخصی‌سازی عناوین قالب
              </button>
            </div>

            <button
              onClick={handlePrint}
              title="چاپ فرم رسمی"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: FILL FORM FOR CANDIDATE */}
          {activeTab === 'FILL' && (
            <div className="space-y-6">
              {/* Official Document Letterhead */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                    PNAP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{template.formTitle}</h4>
                    <p className="text-xs text-slate-500">{template.formSubtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 block text-[10px]">تاریخ مصاحبه:</span>
                    <input 
                      type="text" 
                      value={interviewDate} 
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="font-bold text-slate-800 font-mono focus:outline-none w-24"
                    />
                  </div>
                </div>
              </div>

              {/* Header Details Table (Candidate & Interviewer) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Candidate Info Box */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-blue-700 font-bold text-xs">
                    <User className="w-4 h-4" />
                    <span>مشخصات مصاحبه‌شونده</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">نام و نام خانوادگی:</span>
                      <span className="font-bold text-slate-800">{candidate?.name || '---'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">شماره تماس:</span>
                      <span className="font-bold text-slate-800 font-mono">{candidate?.phone || '---'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[11px]">عنوان شغلی مورد نظر:</span>
                      <span className="font-bold text-blue-700">{candidate?.role || '---'}</span>
                    </div>
                  </div>
                </div>

                {/* Interviewer Info Box */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-purple-700 font-bold text-xs">
                    <Building className="w-4 h-4" />
                    <span>مشخصات مصاحبه‌کننده</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 block text-[11px] mb-1">نام و نام خانوادگی:</label>
                      <input
                        type="text"
                        value={interviewerName}
                        onChange={(e) => setInterviewerName(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block text-[11px] mb-1">سمت شغلی:</label>
                      <input
                        type="text"
                        value={interviewerRole}
                        onChange={(e) => setInterviewerRole(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections with Structured Questions */}
              <div className="space-y-5">
                {template.sections.map((section, secIdx) => (
                  <div 
                    key={section.id || secIdx}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                  >
                    {/* Section Header */}
                    <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                          {section.sectionNumber}
                        </span>
                        {section.sectionTitle}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {section.questions.length} سوال
                      </span>
                    </div>

                    {/* Questions List */}
                    <div className="p-4 space-y-4 divide-y divide-slate-100">
                      {section.questions.map((q, qIdx) => {
                        const answerKey = q.id || `q${q.questionNumber}`;
                        const currentAnswer = answers[answerKey] || answers[`q${q.questionNumber}`] || '';

                        return (
                          <div key={q.id || qIdx} className={`space-y-2 ${qIdx > 0 ? 'pt-4' : ''}`}>
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                              <label className="text-xs font-bold text-slate-900 leading-snug">
                                سوال {q.questionNumber}: {q.questionText}
                              </label>
                              {q.goalDescription && (
                                <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 font-medium whitespace-nowrap self-start sm:self-auto">
                                  هدف: {q.goalDescription}
                                </span>
                              )}
                            </div>

                            <textarea
                              rows={2}
                              value={currentAnswer}
                              onChange={(e) => handleAnswerChange(answerKey, e.target.value)}
                              placeholder="پاسخ، نکات و توضیحات کارجو در طول مصاحبه تلفنی..."
                              className="w-full p-2.5 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 10: Overall Evaluation & Recommendation */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl border-2 border-blue-200 p-5 space-y-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-blue-200">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span>۱۰- نتیجه و ارزیابی کلی مصاحبه تلفنی</span>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-blue-600 text-white rounded-xl shadow-xs">
                    امتیاز: {totalScore} از ۱۰
                  </span>
                </div>

                {/* Score Slider */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">امتیاز کلی متقاضی (از ۱ تا ۱۰):</span>
                    <span className="font-extrabold text-blue-600 text-sm font-mono">{totalScore} / ۱۰</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={totalScore}
                    onChange={(e) => setTotalScore(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>۱ (ضعیف)</span>
                    <span>۵ (متوسط)</span>
                    <span>۸ (خوب)</span>
                    <span>۱۰ (عالی)</span>
                  </div>
                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                    <label className="block text-xs font-bold text-emerald-800">
                      • نقاط قوت متقاضی:
                    </label>
                    <textarea
                      rows={2}
                      value={strengths}
                      onChange={(e) => setStrengths(e.target.value)}
                      placeholder="فن بیان مناسب، انگیزه بالا، سابقه مرتبط، تسلط به نرم‌افزارها..."
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                    <label className="block text-xs font-bold text-rose-800">
                      • نقاط ضعف / موارد نیازمند بررسی:
                    </label>
                    <textarea
                      rows={2}
                      value={weaknesses}
                      onChange={(e) => setWeaknesses(e.target.value)}
                      placeholder="عدم ثبات شغلی، مسافت طولانی، توقع حقوقی بالاتر از سقف..."
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Overall Assessment Remarks */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    • ارزیابی کلی و شرح تصمیم:
                  </label>
                  <textarea
                    rows={2}
                    value={overallEvaluation}
                    onChange={(e) => setOverallEvaluation(e.target.value)}
                    placeholder="جمع‌بندی نهایی مصاحبه‌کننده درباره شایستگی‌های کاندیدا..."
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Recommendation Radio Options */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    توصیه برای مراحل بعدی (تصمیم مصاحبه تلفنی):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setRecommendation('INVITE_IN_PERSON')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        recommendation === 'INVITE_IN_PERSON'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      دعوت به مصاحبه حضوری
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecommendation('REQUEST_MORE_INFO')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        recommendation === 'REQUEST_MORE_INFO'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      درخواست اطلاعات بیشتر
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecommendation('REJECT')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        recommendation === 'REJECT'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      رد درخواست
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEMPLATE BUILDER / CUSTOMIZER */}
          {activeTab === 'CUSTOMIZE_TEMPLATE' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                <Settings className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-900 space-y-1">
                  <h4 className="font-bold text-amber-950">طراح و ویرایشگر اختصاصی قالب فرم ۱ (مصاحبه تلفنی)</h4>
                  <p>
                    در این بخش می‌توانید عناوین، سرفصل‌ها، متن سوالات، اهداف ارزیابی و دسته‌بندی‌ها را به دلخواه تغییر دهید، سوال جدید اضافه کنید یا موارد غیرضروری را حذف نمایید.
                  </p>
                </div>
              </div>

              {/* Form Metadata Settings */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">عنوان و توضیحات سربرگ فرم:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">عنوان اصلی فرم:</label>
                    <input
                      type="text"
                      value={template.formTitle}
                      onChange={(e) => handleUpdateTemplateTitle(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">زیرعنوان / توضیحات فرم:</label>
                    <input
                      type="text"
                      value={template.formSubtitle}
                      onChange={(e) => setTemplate({ ...template, formSubtitle: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Sections & Questions Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">سرفصل‌ها و سوالات ۱۰ گانه مصاحبه:</h4>
                  <button
                    onClick={handleAddSection}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    افزودن بخش جدید
                  </button>
                </div>

                {template.sections.map((section, sIdx) => (
                  <div key={section.id || sIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {sIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={section.sectionTitle}
                          onChange={(e) => handleUpdateSectionTitle(sIdx, e.target.value)}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddQuestion(sIdx)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          افزودن سوال
                        </button>
                        <button
                          onClick={() => handleDeleteSection(sIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="حذف این بخش"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section Questions */}
                    <div className="space-y-2.5 pl-2">
                      {section.questions.map((question, qIdx) => (
                        <div key={question.id || qIdx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-500 font-mono shrink-0">
                              سوال {question.questionNumber}:
                            </span>
                            <input
                              type="text"
                              value={question.questionText}
                              onChange={(e) => handleUpdateQuestion(sIdx, qIdx, 'questionText', e.target.value)}
                              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                            />
                            <button
                              onClick={() => handleDeleteQuestion(sIdx, qIdx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                              title="حذف سوال"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-blue-600 font-bold shrink-0">هدف ارزیابی:</span>
                            <input
                              type="text"
                              value={question.goalDescription}
                              onChange={(e) => handleUpdateQuestion(sIdx, qIdx, 'goalDescription', e.target.value)}
                              placeholder="هدف از طرح این سوال..."
                              className="w-full p-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Template Action Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetTemplate}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  بازنشانی به فرم پیش‌فرض اولیه
                </button>

                <button
                  type="button"
                  onClick={handleSaveTemplateChanges}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  <Save className="w-4 h-4" />
                  ذخیره تغییرات قالب فرم
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            {candidate ? `کارجو: ${candidate.name} | گام ۴ مصاحبه تلفنی` : 'سامانه مصاحبه پناپ'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              انصراف و بستن
            </button>

            {activeTab === 'FILL' && (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all"
              >
                <Save className="w-4 h-4" />
                ثبت ارزیابی مصاحبه تلفنی
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
