import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building, 
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
  User,
  GraduationCap,
  Briefcase,
  Users,
  ShieldCheck,
  Heart,
  Scale,
  Calendar,
  MapPin,
  FileText,
  Check
} from 'lucide-react';
import { 
  Candidate, 
  AppLanguage, 
  InPersonInterviewFormData, 
  InPersonInterviewFormTemplate,
  InPersonWorkHistoryItem,
  InPersonReferenceItem,
  InPersonSkillsRating 
} from '../types';
import { 
  DEFAULT_IN_PERSON_INTERVIEW_TEMPLATE, 
  getInPersonInterviewTemplate, 
  saveInPersonInterviewTemplate 
} from '../data/interviewFormDefaults';

interface InPersonInterviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  language: AppLanguage;
  onSaveForm: (candidateId: string, formData: InPersonInterviewFormData) => void;
  mode?: 'FILL' | 'CUSTOMIZE_TEMPLATE';
}

export const InPersonInterviewFormModal: React.FC<InPersonInterviewFormModalProps> = ({
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
  const [template, setTemplate] = useState<InPersonInterviewFormTemplate>(() => getInPersonInterviewTemplate());

  // Form State
  const [formDate, setFormDate] = useState(() => new Intl.DateTimeFormat('fa-IR').format(new Date()));
  const [interviewDate, setInterviewDate] = useState(() => new Intl.DateTimeFormat('fa-IR').format(new Date()));

  // 1. Personal Info
  const [fullName, setFullName] = useState('');
  const [requestedRole, setRequestedRole] = useState('');
  const [birthDate, setBirthDate] = useState('1375/01/01');
  const [personalityType, setPersonalityType] = useState('ENFJ');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<'SINGLE' | 'MARRIED' | 'MARRIED_WITH_CHILDREN'>('SINGLE');
  const [marriagePlanIn3Years, setMarriagePlanIn3Years] = useState<'YES' | 'NO'>('NO');
  const [militaryStatus, setMilitaryStatus] = useState<'COMPLETED' | 'TEMPORARY_EXEMPT' | 'MEDICAL_EXEMPT' | 'NON_MEDICAL_EXEMPT' | 'NOT_APPLICABLE'>('COMPLETED');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [sourceWebsite, setSourceWebsite] = useState('سایت پناپ / ای‌استخدام');
  const [religion, setReligion] = useState('اسلام');
  const [sect, setSect] = useState('تشیع');

  // 2. Education
  const [lastDegree, setLastDegree] = useState('کارشناسی');
  const [gpa, setGpa] = useState('17.50');
  const [majorAndUniversity, setMajorAndUniversity] = useState('مهندسی کامپیوتر - دانشگاه فردوسی');

  // 3. Skills Rating (1-10)
  const [skillsRating, setSkillsRating] = useState<InPersonSkillsRating>({
    english: 8,
    word: 9,
    excel: 8,
    access: 5,
    internet: 10,
    digitalMarketing: 7,
    fastTyping: 8,
    accountingBasics: 6,
    officeCorrespondence: 8,
    otherSkillName: '',
    otherSkillScore: 8,
  });

  // 4. Work Histories (3 rows)
  const [workHistories, setWorkHistories] = useState<InPersonWorkHistoryItem[]>([
    {
      id: 'w1',
      role: '',
      companyName: '',
      contactPersonName: '',
      contactPersonRole: '',
      contactPersonPhone: '',
      fromDate: '1400',
      toDate: '1402',
      reasonForLeaving: 'ارتقای موقعیت شغلی و یادگیری بیشتر',
    },
    {
      id: 'w2',
      role: '',
      companyName: '',
      contactPersonName: '',
      contactPersonRole: '',
      contactPersonPhone: '',
      fromDate: '',
      toDate: '',
      reasonForLeaving: '',
    },
    {
      id: 'w3',
      role: '',
      companyName: '',
      contactPersonName: '',
      contactPersonRole: '',
      contactPersonPhone: '',
      fromDate: '',
      toDate: '',
      reasonForLeaving: '',
    }
  ]);

  // 5. Questionnaire Answers
  const [isCurrentlyEmployed, setIsCurrentlyEmployed] = useState<'YES' | 'NO'>('NO');
  const [isStudent, setIsStudent] = useState<'YES' | 'NO'>('NO');
  const [otherWorkTypes, setOtherWorkTypes] = useState<string[]>(['دورکاری', 'امور اداری']);
  const [personalInterests, setPersonalInterests] = useState('');
  const [moralStrengths, setMoralStrengths] = useState('');
  const [areasOfImprovement, setAreasOfImprovement] = useState('');
  const [whyPnap, setWhyPnap] = useState('');
  const [whyShouldWeHireYou, setWhyShouldWeHireYou] = useState('');
  const [fiveYearsVisionInPnap, setFiveYearsVisionInPnap] = useState('');
  const [bestWorkDayDescription, setBestWorkDayDescription] = useState('');
  const [worstWorkDayDescription, setWorstWorkDayDescription] = useState('');
  const [challengesAndOvercoming, setChallengesAndOvercoming] = useState('');
  const [lastBookRead, setLastBookRead] = useState('');
  const [tenMinutesLateReaction, setTenMinutesLateReaction] = useState('');
  const [coworkersFrictionReaction, setCoworkersFrictionReaction] = useState('');
  const [explainInSimpleWordsSubject, setExplainInSimpleWordsSubject] = useState('');
  const [explainInSimpleWordsAnswer, setExplainInSimpleWordsAnswer] = useState('');
  const [aboutPnapTwoLines, setAboutPnapTwoLines] = useState('');
  const [teamworkExperience, setTeamworkExperience] = useState('');
  const [successFactorsInOrganization, setSuccessFactorsInOrganization] = useState('');
  const [emotionControlMethod, setEmotionControlMethod] = useState('');

  // 6. References
  const [references, setReferences] = useState<InPersonReferenceItem[]>([
    {
      id: 'ref1',
      fullName: 'مهندس رضایی',
      job: 'مدیر فنی شرکت سابق',
      phone: '09123456789',
      acquaintanceDuration: '۳ سال',
    },
    {
      id: 'ref2',
      fullName: 'دکتر علوی',
      job: 'استاد راهنما / مدیر پروژه',
      phone: '09159876543',
      acquaintanceDuration: '۴ سال',
    }
  ]);

  // 7. Health, Commitments, Agreements
  const [hasSpecificIllness, setHasSpecificIllness] = useState<'YES' | 'NO'>('NO');
  const [hasCriminalRecord, setHasCriminalRecord] = useState<'YES' | 'NO'>('NO');
  const [criminalRecordDetails, setCriminalRecordDetails] = useState('');
  const [usesTobacco, setUsesTobacco] = useState<'YES' | 'NO'>('NO');
  const [canProvideGuarantee, setCanProvideGuarantee] = useState<'YES' | 'NO'>('YES');
  const [hasRelativesInCompany, setHasRelativesInCompany] = useState<'YES' | 'NO'>('NO');
  const [motivatingFactors, setMotivatingFactors] = useState('محیط پویا، فرصت رشد و ارتقای شایستگی‌ها');
  const [neededTrainings, setNeededTrainings] = useState('دوره‌های مدیریت پیشرفته و متدولوژی چابک');
  const [earliestStartDate, setEarliestStartDate] = useState<'ONE_WEEK' | 'ONE_MONTH' | 'MORE_THAN_MONTH'>('ONE_WEEK');
  const [briefSelfIntroduction, setBriefSelfIntroduction] = useState('');
  const [applicantAgreementConfirmed, setApplicantAgreementConfirmed] = useState(true);

  // Evaluation by Assessors
  const [interviewerRating, setInterviewerRating] = useState<number>(4.5);
  const [interviewerVerdict, setInterviewerVerdict] = useState<'HIRE' | 'REJECT' | 'HOLD' | 'STAGE_6_BACKGROUND'>('STAGE_6_BACKGROUND');
  const [interviewerNotes, setInterviewerNotes] = useState('');

  // Load from candidate
  useEffect(() => {
    if (candidate) {
      setFullName(candidate.name || '');
      setRequestedRole(candidate.role || '');
      setPhone(candidate.phone || '');
      setEmail(candidate.email || '');
      setAddress(candidate.location || '');
      setMajorAndUniversity(candidate.education || '');
      setBriefSelfIntroduction(candidate.summary || '');

      if (candidate.inPersonInterviewForm) {
        const f = candidate.inPersonInterviewForm;
        setFormDate(f.formDate || formDate);
        setInterviewDate(f.interviewDate || interviewDate);
        setBirthDate(f.birthDate || birthDate);
        setPersonalityType(f.personalityType || personalityType);
        setBloodGroup(f.bloodGroup || bloodGroup);
        setMaritalStatus(f.maritalStatus || 'SINGLE');
        setMarriagePlanIn3Years(f.marriagePlanIn3Years || 'NO');
        setMilitaryStatus(f.militaryStatus || 'COMPLETED');
        setSourceWebsite(f.sourceWebsite || 'سایت پناپ');
        setReligion(f.religion || 'اسلام');
        setSect(f.sect || 'تشیع');
        setLastDegree(f.lastDegree || 'کارشناسی');
        setGpa(f.gpa || '18.00');
        setSkillsRating(f.skillsRating || skillsRating);
        if (f.workHistories && f.workHistories.length > 0) setWorkHistories(f.workHistories);
        setIsCurrentlyEmployed(f.isCurrentlyEmployed || 'NO');
        setIsStudent(f.isStudent || 'NO');
        setOtherWorkTypes(f.otherWorkTypes || ['دورکاری']);
        setPersonalInterests(f.personalInterests || '');
        setMoralStrengths(f.moralStrengths || '');
        setAreasOfImprovement(f.areasOfImprovement || '');
        setWhyPnap(f.whyPnap || '');
        setWhyShouldWeHireYou(f.whyShouldWeHireYou || '');
        setFiveYearsVisionInPnap(f.fiveYearsVisionInPnap || '');
        setBestWorkDayDescription(f.bestWorkDayDescription || '');
        setWorstWorkDayDescription(f.worstWorkDayDescription || '');
        setChallengesAndOvercoming(f.challengesAndOvercoming || '');
        setLastBookRead(f.lastBookRead || '');
        setTenMinutesLateReaction(f.tenMinutesLateReaction || '');
        setCoworkersFrictionReaction(f.coworkersFrictionReaction || '');
        setExplainInSimpleWordsSubject(f.explainInSimpleWordsSubject || '');
        setExplainInSimpleWordsAnswer(f.explainInSimpleWordsAnswer || '');
        setAboutPnapTwoLines(f.aboutPnapTwoLines || '');
        setTeamworkExperience(f.teamworkExperience || '');
        setSuccessFactorsInOrganization(f.successFactorsInOrganization || '');
        setEmotionControlMethod(f.emotionControlMethod || '');
        if (f.references && f.references.length > 0) setReferences(f.references);
        setHasSpecificIllness(f.hasSpecificIllness || 'NO');
        setHasCriminalRecord(f.hasCriminalRecord || 'NO');
        setCriminalRecordDetails(f.criminalRecordDetails || '');
        setUsesTobacco(f.usesTobacco || 'NO');
        setCanProvideGuarantee(f.canProvideGuarantee || 'YES');
        setHasRelativesInCompany(f.hasRelativesInCompany || 'NO');
        setMotivatingFactors(f.motivatingFactors || '');
        setNeededTrainings(f.neededTrainings || '');
        setEarliestStartDate(f.earliestStartDate || 'ONE_WEEK');
        setApplicantAgreementConfirmed(f.applicantAgreementConfirmed ?? true);
        setInterviewerRating(f.interviewerRating || 4.5);
        setInterviewerVerdict(f.interviewerVerdict || 'STAGE_6_BACKGROUND');
        setInterviewerNotes(f.interviewerNotes || '');
      } else {
        // Pre-fill from experiences and step5
        if (candidate.experiences && candidate.experiences.length > 0) {
          const filled = candidate.experiences.slice(0, 3).map((exp, i) => ({
            id: `w${i + 1}`,
            role: exp.role || '',
            companyName: exp.company || '',
            contactPersonName: 'مسئول مستقیم',
            contactPersonRole: 'مدیر واحد',
            contactPersonPhone: '---',
            fromDate: exp.duration?.split(' - ')[0] || '',
            toDate: exp.duration?.split(' - ')[1] || '',
            reasonForLeaving: 'تغییر مسیر شغلی و فرصت همکاری با پناپ',
          }));
          while (filled.length < 3) {
            filled.push({
              id: `w${filled.length + 1}`,
              role: '',
              companyName: '',
              contactPersonName: '',
              contactPersonRole: '',
              contactPersonPhone: '',
              fromDate: '',
              toDate: '',
              reasonForLeaving: '',
            });
          }
          setWorkHistories(filled);
        }
        if (candidate.step5?.interviewerFeedback) {
          setInterviewerNotes(candidate.step5.interviewerFeedback);
        }
      }
    }
  }, [candidate]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!candidate) return;

    const payload: InPersonInterviewFormData = {
      candidateId: candidate.id,
      formDate,
      interviewDate,
      fullName,
      requestedRole,
      birthDate,
      personalityType,
      bloodGroup,
      phone,
      maritalStatus,
      marriagePlanIn3Years,
      militaryStatus,
      email,
      address,
      sourceWebsite,
      religion,
      sect,
      lastDegree,
      gpa,
      majorAndUniversity,
      skillsRating,
      workHistories,
      isCurrentlyEmployed,
      isStudent,
      otherWorkTypes,
      personalInterests,
      moralStrengths,
      areasOfImprovement,
      whyPnap,
      whyShouldWeHireYou,
      fiveYearsVisionInPnap,
      bestWorkDayDescription,
      worstWorkDayDescription,
      challengesAndOvercoming,
      lastBookRead,
      tenMinutesLateReaction,
      coworkersFrictionReaction,
      explainInSimpleWordsSubject,
      explainInSimpleWordsAnswer,
      aboutPnapTwoLines,
      teamworkExperience,
      successFactorsInOrganization,
      emotionControlMethod,
      references,
      hasSpecificIllness,
      hasCriminalRecord,
      criminalRecordDetails,
      usesTobacco,
      canProvideGuarantee,
      hasRelativesInCompany,
      motivatingFactors,
      neededTrainings,
      earliestStartDate,
      briefSelfIntroduction,
      applicantAgreementConfirmed,
      interviewerRating,
      interviewerVerdict,
      interviewerNotes,
      updatedAt: new Date().toISOString(),
    };

    onSaveForm(candidate.id, payload);
    onClose();
  };

  const handleWorkHistoryChange = (index: number, field: keyof InPersonWorkHistoryItem, value: string) => {
    setWorkHistories((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleReferenceChange = (index: number, field: keyof InPersonReferenceItem, value: string) => {
    setReferences((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSkillChange = (key: keyof InPersonSkillsRating, value: number) => {
    setSkillsRating((prev) => ({ ...prev, [key]: value }));
  };

  const toggleOtherWorkType = (type: string) => {
    setOtherWorkTypes((prev) => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSaveTemplateChanges = () => {
    saveInPersonInterviewTemplate(template);
    alert('قالب فرم ۲ (مصاحبه حضوری) با موفقیت ذخیره شد.');
    setActiveTab('FILL');
  };

  const handleResetTemplate = () => {
    if (window.confirm('آیا از بازنشانی قالب به فرم استاندارد اولیه پناپ مطمئن هستید؟')) {
      setTemplate(DEFAULT_IN_PERSON_INTERVIEW_TEMPLATE);
      saveInPersonInterviewTemplate(DEFAULT_IN_PERSON_INTERVIEW_TEMPLATE);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div 
        id="in-person-interview-modal"
        className="bg-white rounded-3xl w-full max-w-5xl my-4 shadow-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[92vh]"
        dir={isFa ? 'rtl' : 'ltr'}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-purple-900/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 font-bold shadow-xs">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-400/30">
                  سرمد - طبقه ۳ واحد ۳۰۷
                </span>
                <h3 className="font-extrabold text-base sm:text-lg">
                  {template.formTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {candidate ? `پرونده کاندیدا: ${candidate.name} (${candidate.role})` : 'طراحی و تکمیل فرم رسمی مصاحبه حضوری'}
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
                تکمیل فرم حضوری
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
                شخصی‌سازی عناوین و قالب
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

              {/* Official Header with PNAP Logo & Date */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-xl shadow-md">
                    PNAP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{template.formTitle}</h4>
                    <p className="text-xs text-purple-700 font-semibold">{template.instructionText}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 block text-[10px]">تاریخ تکمیل:</span>
                    <input 
                      type="text" 
                      value={formDate} 
                      onChange={(e) => setFormDate(e.target.value)}
                      className="font-bold text-slate-800 font-mono focus:outline-none w-24"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 1: مشخصات فردی */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-purple-700 font-bold text-xs sm:text-sm">
                  <User className="w-4 h-4" />
                  <span>مشخصات فردی</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.fullName}:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.requestedRole}:</label>
                    <input
                      type="text"
                      value={requestedRole}
                      onChange={(e) => setRequestedRole(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-purple-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.phone}:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.birthDate}:</label>
                    <input
                      type="text"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      placeholder="مثال: ۱۳۷۵/۰۶/۱۵"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.personalityType}:</label>
                    <input
                      type="text"
                      value={personalityType}
                      onChange={(e) => setPersonalityType(e.target.value)}
                      placeholder="MBTI (مثال: INTJ, ENFP...)"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.bloodGroup}:</label>
                    <input
                      type="text"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      placeholder="مثال: +A, +O..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.maritalStatus}:</label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    >
                      <option value="SINGLE">مجرد</option>
                      <option value="MARRIED">متأهل</option>
                      <option value="MARRIED_WITH_CHILDREN">متأهل دارای فرزند</option>
                    </select>
                  </div>

                  {maritalStatus === 'SINGLE' && (
                    <div>
                      <label className="text-slate-500 block mb-1 font-medium">برنامه ازدواج تا ۳ سال آینده:</label>
                      <select
                        value={marriagePlanIn3Years}
                        onChange={(e) => setMarriagePlanIn3Years(e.target.value as any)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                      >
                        <option value="NO">خیر</option>
                        <option value="YES">بله</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.militaryStatus}:</label>
                    <select
                      value={militaryStatus}
                      onChange={(e) => setMilitaryStatus(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    >
                      <option value="COMPLETED">پایان خدمت</option>
                      <option value="TEMPORARY_EXEMPT">معافیت موقت</option>
                      <option value="MEDICAL_EXEMPT">معافیت دائم پزشکی</option>
                      <option value="NON_MEDICAL_EXEMPT">معافیت دائم غیر پزشکی</option>
                      <option value="NOT_APPLICABLE">عدم نیاز (بانوان)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.email}:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.sourceWebsite}:</label>
                    <input
                      type="text"
                      value={sourceWebsite}
                      onChange={(e) => setSourceWebsite(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.religion} و {template.personalInfoTitles.sect}:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={religion}
                        onChange={(e) => setReligion(e.target.value)}
                        placeholder="دین"
                        className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                      <input
                        type="text"
                        value={sect}
                        onChange={(e) => setSect(e.target.value)}
                        placeholder="مذهب"
                        className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-slate-500 block mb-1 font-medium">{template.personalInfoTitles.address}:</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="شهر، خیابان، پلاک، طبقه..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: سوابق تحصیلی */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-purple-700 font-bold text-xs sm:text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>سوابق تحصیلی</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.educationTitles.lastDegree}:</label>
                    <input
                      type="text"
                      value={lastDegree}
                      onChange={(e) => setLastDegree(e.target.value)}
                      placeholder="کارشناسی / کارشناسی ارشد..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.educationTitles.gpa}:</label>
                    <input
                      type="text"
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      placeholder="مثال: ۱۸.۵۰"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">{template.educationTitles.majorAndUniversity}:</label>
                    <input
                      type="text"
                      value={majorAndUniversity}
                      onChange={(e) => setMajorAndUniversity(e.target.value)}
                      placeholder="رشته تحصیلی و نام دانشگاه..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: مهارت‌ها (نمره ۱ تا ۱۰) */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-xs sm:text-sm">
                    <Award className="w-4 h-4" />
                    <span>مهارت‌ها (به مهارت خود در برنامه‌های زیر از ۱ تا ۱۰ نمره دهید)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
                  {template.skillItems.map((skill) => (
                    <div key={skill.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700 text-[11px]">{skill.label}</span>
                        <span className="font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-[11px]">
                          {(skillsRating as any)[skill.key] || 5}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={(skillsRating as any)[skill.key] || 5}
                        onChange={(e) => handleSkillChange(skill.key, Number(e.target.value))}
                        className="w-full accent-purple-600 cursor-pointer"
                      />
                    </div>
                  ))}

                  {/* Other Skill Field */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 col-span-2 sm:col-span-1">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        placeholder="سایر مهارت‌ها..."
                        value={skillsRating.otherSkillName || ''}
                        onChange={(e) => setSkillsRating({ ...skillsRating, otherSkillName: e.target.value })}
                        className="p-1 bg-white rounded text-[11px] font-bold w-24 border border-slate-200"
                      />
                      <span className="font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-[11px]">
                        {skillsRating.otherSkillScore || 5}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={skillsRating.otherSkillScore || 5}
                      onChange={(e) => setSkillsRating({ ...skillsRating, otherSkillScore: Number(e.target.value) })}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: سوابق کاری و علت قطع همکاری (جدول ۳ ردیفه) */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-purple-700 font-bold text-xs sm:text-sm">
                  <Briefcase className="w-4 h-4" />
                  <span>سوابق کاری خود و دلیل قطع همکاری خود را مرقوم نمایید (۳ ردیف):</span>
                </div>

                <div className="space-y-3">
                  {workHistories.map((work, idx) => (
                    <div key={work.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[11px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span>سابقه کاری {idx + 1}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-1">عنوان شغلی:</label>
                          <input
                            type="text"
                            value={work.role}
                            onChange={(e) => handleWorkHistoryChange(idx, 'role', e.target.value)}
                            placeholder="مثال: کارشناس بازرگانی..."
                            className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 block mb-1">نام مجموعه / شرکت:</label>
                          <input
                            type="text"
                            value={work.companyName}
                            onChange={(e) => handleWorkHistoryChange(idx, 'companyName', e.target.value)}
                            placeholder="نام شرکت سابق..."
                            className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 block mb-1">فرد مرتبط (مسئول یا مدیر):</label>
                          <input
                            type="text"
                            value={work.contactPersonName}
                            onChange={(e) => handleWorkHistoryChange(idx, 'contactPersonName', e.target.value)}
                            placeholder="نام و نام خانوادگی مسئول..."
                            className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 block mb-1">شماره تماس مدیر مستقیم:</label>
                          <input
                            type="text"
                            value={work.contactPersonPhone}
                            onChange={(e) => handleWorkHistoryChange(idx, 'contactPersonPhone', e.target.value)}
                            placeholder="۰۹۱۲..."
                            className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 block mb-1">از تاریخ - تا تاریخ:</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={work.fromDate}
                              onChange={(e) => handleWorkHistoryChange(idx, 'fromDate', e.target.value)}
                              placeholder="از"
                              className="w-1/2 p-2 bg-white border border-slate-200 rounded-xl font-mono"
                            />
                            <input
                              type="text"
                              value={work.toDate}
                              onChange={(e) => handleWorkHistoryChange(idx, 'toDate', e.target.value)}
                              placeholder="تا"
                              className="w-1/2 p-2 bg-white border border-slate-200 rounded-xl font-mono"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2 md:col-span-3">
                          <label className="text-[11px] text-slate-500 block mb-1">علت قطع همکاری:</label>
                          <input
                            type="text"
                            value={work.reasonForLeaving}
                            onChange={(e) => handleWorkHistoryChange(idx, 'reasonForLeaving', e.target.value)}
                            placeholder="پایان پروژه، ارتقای مسیر شغلی، تغییر محل سکونت..."
                            className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: توضیحات و سوالات عمیق شخصیتی/انگیزشی */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-purple-700 font-bold text-xs sm:text-sm">
                  <FileText className="w-4 h-4" />
                  <span>توضیحات و پرسش‌های رفتاری و سازمانی</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Status Question 1 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800">* آیا در حال حاضر مشغول به کار هستید؟</span>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="isCurrentlyEmployed"
                          checked={isCurrentlyEmployed === 'YES'}
                          onChange={() => setIsCurrentlyEmployed('YES')}
                        />
                        <span>بله</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="isCurrentlyEmployed"
                          checked={isCurrentlyEmployed === 'NO'}
                          onChange={() => setIsCurrentlyEmployed('NO')}
                        />
                        <span>خیر</span>
                      </label>
                    </div>
                  </div>

                  {/* Status Question 2 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800">* آیا در حال حاضر دانشجو هستید؟</span>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="isStudent"
                          checked={isStudent === 'YES'}
                          onChange={() => setIsStudent('YES')}
                        />
                        <span>بله</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="isStudent"
                          checked={isStudent === 'NO'}
                          onChange={() => setIsStudent('NO')}
                        />
                        <span>خیر</span>
                      </label>
                    </div>
                  </div>

                  {/* Other work type */}
                  <div className="md:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block">
                      * غیر از همکاری تمام وقت در رده شغلی خود، قادر به چه نوع همکاری دیگری هستید؟
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {['دورکاری', 'انجام مأموریت', 'همکاری در فضای مجازی', 'امور اداری', 'هرکاری که در توانم باشد یا آموزش ببینم'].map((t) => (
                        <label key={t} className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]">
                          <input
                            type="checkbox"
                            checked={otherWorkTypes.includes(t)}
                            onChange={() => toggleOtherWorkType(t)}
                          />
                          <span>{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Open Questions */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* چند مورد از علاقه‌مندی‌های شخصی خود را نام ببرید:</label>
                    <input
                      type="text"
                      value={personalInterests}
                      onChange={(e) => setPersonalInterests(e.target.value)}
                      placeholder="مطالعه، ورزش، کوهنوردی، تکنولوژی..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* مهم‌ترین خصوصیات مثبت و نقاط قوت اخلاقی خود را بنویسید:</label>
                    <input
                      type="text"
                      value={moralStrengths}
                      onChange={(e) => setMoralStrengths(e.target.value)}
                      placeholder="صداقت، مسئولیت‌پذیری، نظم و پیگیری..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* چه ویژگی‌هایی را در خود نیازمند بهبود می‌بینید؟</label>
                    <input
                      type="text"
                      value={areasOfImprovement}
                      onChange={(e) => setAreasOfImprovement(e.target.value)}
                      placeholder="مدیریت زمان در پروژه‌های فشرده، صبوری بیشتر..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* چرا می‌خواهید با پناپ کار کنید؟</label>
                    <input
                      type="text"
                      value={whyPnap}
                      onChange={(e) => setWhyPnap(e.target.value)}
                      placeholder="شناخت از اعتبار پناپ، زمینه پیشرفت و تیم حرفه‌ای..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* به نظر شما، چرا باید با شما همکاری کنیم؟</label>
                    <input
                      type="text"
                      value={whyShouldWeHireYou}
                      onChange={(e) => setWhyShouldWeHireYou(e.target.value)}
                      placeholder="انگیزه بالا، انطباق مهارت‌ها، ارزش‌آفرینی سریع..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* چطور خود را در پنج سال آینده در پناپ می‌بینید؟</label>
                    <input
                      type="text"
                      value={fiveYearsVisionInPnap}
                      onChange={(e) => setFiveYearsVisionInPnap(e.target.value)}
                      placeholder="هدایت پروژه‌های کلان و مدیریت تیم..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* بهترین روز کاری که داشتید را توصیف کنید:</label>
                    <textarea
                      rows={2}
                      value={bestWorkDayDescription}
                      onChange={(e) => setBestWorkDayDescription(e.target.value)}
                      placeholder="روزی که پروژه موفقی با تحویل به موقع تمام شد..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* بدترین روز کاری که داشتید چه روزی بوده است؟</label>
                    <textarea
                      rows={2}
                      value={worstWorkDayDescription}
                      onChange={(e) => setWorstWorkDayDescription(e.target.value)}
                      placeholder="روزی که با ناهماهنگی بین اعضا مواجه شدیم و نحوه حل آن..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* چالش‌هایی که با آن مواجه شدید و چگونه از آن‌ها عبور کردید؟</label>
                    <textarea
                      rows={2}
                      value={challengesAndOvercoming}
                      onChange={(e) => setChallengesAndOvercoming(e.target.value)}
                      placeholder="تعریف چالش فنی یا مدیریتی و راه‌حل اتخاذ شده..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* آخرین بار چه کتابی را خوانده‌اید؟</label>
                    <input
                      type="text"
                      value={lastBookRead}
                      onChange={(e) => setLastBookRead(e.target.value)}
                      placeholder="نام کتاب و موضوع اصلی آن..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* آیا با ۱۰ دقیقه تأخیر حاضر شدید و مدیر سخت‌گیری کرده است؟</label>
                    <input
                      type="text"
                      value={tenMinutesLateReaction}
                      onChange={(e) => setTenMinutesLateReaction(e.target.value)}
                      placeholder="توضیح نگرش و واکنش نسبت به مقررات و انضباط سازمانی..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* آیا همکاران بی‌جهت شما را ناراحت یا اذیت کرده‌اند؟</label>
                    <input
                      type="text"
                      value={coworkersFrictionReaction}
                      onChange={(e) => setCoworkersFrictionReaction(e.target.value)}
                      placeholder="نحوه تعامل و حل تعارضات بین فردی..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="font-bold text-slate-800 block">* درباره شرکت پناپ، دو خط توضیح دهید:</label>
                    <textarea
                      rows={2}
                      value={aboutPnapTwoLines}
                      onChange={(e) => setAboutPnapTwoLines(e.target.value)}
                      placeholder="شناخت از محصولات، ساختار و جایگاه بازار پناپ..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* چقدر مایل به کار گروهی هستید و در چه گروه‌هایی کار کرده‌اید؟</label>
                    <input
                      type="text"
                      value={teamworkExperience}
                      onChange={(e) => setTeamworkExperience(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">* هیجانات خود را چگونه کنترل می‌کنید؟</label>
                    <input
                      type="text"
                      value={emotionControlMethod}
                      onChange={(e) => setEmotionControlMethod(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 6: معرفین (۲ نفر معرف) */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-xs sm:text-sm">
                    <Users className="w-4 h-4" />
                    <span>حداقل دو نفر معرف که بیش از ۲ سال شما را بشناسند و اطلاعات دقیقی ارائه کنند:</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {references.map((ref, idx) => (
                    <div key={ref.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[11px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span>معرف شماره {idx + 1}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-1">نام و نام خانوادگی:</label>
                          <input
                            type="text"
                            value={ref.fullName}
                            onChange={(e) => handleReferenceChange(idx, 'fullName', e.target.value)}
                            placeholder="نام معرف..."
                            className="w-full p-1.5 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-1">شغل و سمت سازمانی:</label>
                          <input
                            type="text"
                            value={ref.job}
                            onChange={(e) => handleReferenceChange(idx, 'job', e.target.value)}
                            placeholder="مدیر، استاد، همکار..."
                            className="w-full p-1.5 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-1">تلفن تماس:</label>
                          <input
                            type="text"
                            value={ref.phone}
                            onChange={(e) => handleReferenceChange(idx, 'phone', e.target.value)}
                            placeholder="۰۹..."
                            className="w-full p-1.5 bg-white border border-slate-200 rounded-xl font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-1">مدت آشنایی:</label>
                          <input
                            type="text"
                            value={ref.acquaintanceDuration}
                            onChange={(e) => handleReferenceChange(idx, 'acquaintanceDuration', e.target.value)}
                            placeholder="مثال: ۳ سال..."
                            className="w-full p-1.5 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 7: سلامت، تعهدات و اقرارنامه */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-purple-700 font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>تعهدات، سلامت و رضایت‌نامه رسمی استعلام</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span>* ابتلا به بیماری خاص نیازمند مراقبت:</span>
                    <select
                      value={hasSpecificIllness}
                      onChange={(e) => setHasSpecificIllness(e.target.value as any)}
                      className="p-1 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="NO">خیر</option>
                      <option value="YES">بله</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span>* سابقه محکومیت کیفری:</span>
                    <select
                      value={hasCriminalRecord}
                      onChange={(e) => setHasCriminalRecord(e.target.value as any)}
                      className="p-1 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="NO">خیر</option>
                      <option value="YES">بله</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span>* استعمال دخانیات (اختیاری):</span>
                    <select
                      value={usesTobacco}
                      onChange={(e) => setUsesTobacco(e.target.value as any)}
                      className="p-1 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="NO">خیر</option>
                      <option value="YES">بله</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span>* امکان ارائه تضمین معتبر و قابل قبول:</span>
                    <select
                      value={canProvideGuarantee}
                      onChange={(e) => setCanProvideGuarantee(e.target.value as any)}
                      className="p-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-emerald-700"
                    >
                      <option value="YES">بله</option>
                      <option value="NO">خیر</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span>* سابقه اشتغال اقوام/دوستان در پناپ:</span>
                    <select
                      value={hasRelativesInCompany}
                      onChange={(e) => setHasRelativesInCompany(e.target.value as any)}
                      className="p-1 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="NO">خیر</option>
                      <option value="YES">بله</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span>* تاریخ آمادگی جهت شروع همکاری:</span>
                    <select
                      value={earliestStartDate}
                      onChange={(e) => setEarliestStartDate(e.target.value as any)}
                      className="p-1 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    >
                      <option value="ONE_WEEK">طی یک هفته آینده</option>
                      <option value="ONE_MONTH">طی یک ماه آینده</option>
                      <option value="MORE_THAN_MONTH">بیشتر از یک ماه</option>
                    </select>
                  </div>
                </div>

                {/* Agreement & Signature Box */}
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-xs">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applicantAgreementConfirmed}
                      onChange={(e) => setApplicantAgreementConfirmed(e.target.checked)}
                      className="mt-0.5 accent-purple-600 rounded"
                    />
                    <span className="text-purple-950 font-medium leading-relaxed">
                      {template.agreementText}
                    </span>
                  </label>
                  <div className="pt-2 flex justify-between items-center text-[11px] text-purple-800 font-bold border-t border-purple-200/60">
                    <span>تأییدیه دیجیتال متقاضی و امضای ارزیاب</span>
                    <span>مجتمع سرمد - واحد ۳۰۷ پناپ</span>
                  </div>
                </div>
              </div>

              {/* SECTION 8: ارزیابی مصاحبه‌کنندگان (Assessors Feedback) */}
              <div className="p-5 bg-gradient-to-br from-slate-50 to-purple-50/50 rounded-3xl border-2 border-purple-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-purple-200">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Scale className="w-5 h-5 text-purple-600" />
                    <span>نتیجه و ارزیابی کمیته جذب و مصاحبه حضوری</span>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-purple-600 text-white rounded-xl shadow-xs">
                    امتیاز: {interviewerRating} از ۵
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">تصمیم نهایی جلسه مصاحبه حضوری:</label>
                    <select
                      value={interviewerVerdict}
                      onChange={(e) => setInterviewerVerdict(e.target.value as any)}
                      className="w-full p-2.5 bg-white border border-purple-200 rounded-xl font-bold text-slate-900"
                    >
                      <option value="STAGE_6_BACKGROUND">تأیید و ارجاع به گام ۶ (استعلام معرفین)</option>
                      <option value="HIRE">تأیید قاطع جهت استخدام مستقیم (گام ۷)</option>
                      <option value="HOLD">در حالت انتظار / بررسی مجدد (Hold)</option>
                      <option value="REJECT">عدم پذیرش / رد در مصاحبه حضوری</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">امتیاز کلی شایستگی (۱ تا ۵):</label>
                    <div className="flex items-center gap-3 bg-white p-2 border border-purple-200 rounded-xl">
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={0.5}
                        value={interviewerRating}
                        onChange={(e) => setInterviewerRating(Number(e.target.value))}
                        className="flex-1 accent-purple-600 cursor-pointer"
                      />
                      <span className="font-mono font-black text-purple-700 text-sm">{interviewerRating} / ۵</span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-bold text-slate-800 block mb-1">یادداشت نهایی مصاحبه‌کنندگان (مدیر واحد و منابع انسانی):</label>
                    <textarea
                      rows={3}
                      value={interviewerNotes}
                      onChange={(e) => setInterviewerNotes(e.target.value)}
                      placeholder="تسلط بر مبانی تخصصی، تعهد به ساعات کاری، انطباق با فرهنگ سازمانی پناپ..."
                      className="w-full p-2.5 bg-white border border-purple-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEMPLATE CUSTOMIZER */}
          {activeTab === 'CUSTOMIZE_TEMPLATE' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                <Settings className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-900 space-y-1">
                  <h4 className="font-bold text-amber-950">ویرایشگر و سفارشی‌سازی عناوین قالب فرم ۲ (مصاحبه حضوری)</h4>
                  <p>
                    تمامی عناوین، سرفصل‌ها، برچسب فیلدها و متن اقرارنامه در این بخش قابل ویرایش هستند تا دقیقاً با ساختار مد نظر سازمان شما مطابقت پیدا کنند.
                  </p>
                </div>
              </div>

              {/* Title & Agreement Editor */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">عنوان اصلی فرم ۲:</label>
                  <input
                    type="text"
                    value={template.formTitle}
                    onChange={(e) => setTemplate({ ...template, formTitle: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">متن راهنمای بالای فرم:</label>
                  <input
                    type="text"
                    value={template.instructionText}
                    onChange={(e) => setTemplate({ ...template, instructionText: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">متن رضایت‌نامه و تاییدیه استعلام:</label>
                  <textarea
                    rows={3}
                    value={template.agreementText}
                    onChange={(e) => setTemplate({ ...template, agreementText: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Skills Items Editor */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">عناوین مهارتی در ماتریس نمره‌دهی (۱ تا ۱۰):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {template.skillItems.map((item, idx) => (
                    <div key={item.key} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-400 font-mono w-4">{idx + 1}</span>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const copy = { ...template };
                          copy.skillItems[idx].label = e.target.value;
                          setTemplate(copy);
                        }}
                        className="w-full p-1 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetTemplate}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  بازنشانی به فرم اولیه
                </button>

                <button
                  type="button"
                  onClick={handleSaveTemplateChanges}
                  className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md"
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
            {candidate ? `کارجو: ${candidate.name} | گام ۵ مصاحبه حضوری` : 'سامانه مصاحبه پناپ'}
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all"
              >
                <Save className="w-4 h-4" />
                ثبت فرم مصاحبه حضوری
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
