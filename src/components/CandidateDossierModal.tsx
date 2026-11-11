import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  DollarSign, 
  Star, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  Sparkles,
  Edit3,
  Trash2,
  AlertTriangle,
  Building2,
  Calendar,
  Send,
  Award,
  Hash,
  ShieldCheck,
  HelpCircle,
  Video,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  XCircle,
  ExternalLink,
  Users,
  Building,
  Scale,
  FastForward,
  Plus,
  RotateCcw,
  Bell,
  CheckCheck,
  Upload,
  Play,
  FileVideo,
  Share2,
  MessageCircle,
  Layers,
  History
} from 'lucide-react';
import { 
  Candidate, 
  CandidateStatus, 
  AppLanguage, 
  RecruitmentStepNumber,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step5Data,
  Step6Data,
  Step7Data,
  ReferenceContact,
  MilitaryStatus,
  AppUser,
  VideoPlatform
} from '../types';
import { addNotification } from '../services/notificationService';
import { InterviewSchedulerCard } from './InterviewSchedulerCard';
import { CandidateHistoryTimeline } from './CandidateHistoryTimeline';
import { buildCandidateFullTimeline } from '../utils/candidateHistory';
import { CandidateApplicationBadge } from './CandidateApplicationBadge';
import { CandidateApplicationsList } from './CandidateApplicationsList';
import { getCandidateApplicationHistory } from '../utils/candidateApplications';

const VIDEO_PLATFORMS: { id: VideoPlatform; labelFa: string; color: string; activeColor: string; iconLabel: string }[] = [
  { id: 'BALE', labelFa: 'پیام‌رسان بله (Bale)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400', activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200', iconLabel: 'بله' },
  { id: 'EITAA', labelFa: 'پیام‌رسان ایتا (Eitaa)', color: 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-400', activeColor: 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-200', iconLabel: 'ایتا' },
  { id: 'RUBIKA', labelFa: 'روبیکا (Rubika)', color: 'bg-purple-50 text-purple-800 border-purple-200 hover:border-purple-400', activeColor: 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200', iconLabel: 'روبیکا' },
  { id: 'TELEGRAM', labelFa: 'تلگرام (Telegram)', color: 'bg-sky-50 text-sky-800 border-sky-200 hover:border-sky-400', activeColor: 'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-200', iconLabel: 'تلگرام' },
  { id: 'WHATSAPP', labelFa: 'واتس‌اپ (WhatsApp)', color: 'bg-green-50 text-green-800 border-green-200 hover:border-green-400', activeColor: 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-200', iconLabel: 'واتس‌اپ' },
  { id: 'SYSTEM_UPLOAD', labelFa: 'بارگذاری مستقیم در سامانه', color: 'bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-400', activeColor: 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200', iconLabel: 'سامانه پناپ' },
  { id: 'EMAIL', labelFa: 'ایمیل متقاضی', color: 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:border-indigo-400', activeColor: 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200', iconLabel: 'ایمیل' },
  { id: 'OTHER', labelFa: 'سایر بسترها...', color: 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-400', activeColor: 'bg-slate-700 text-white border-slate-700 shadow-sm shadow-slate-200', iconLabel: 'سایر' },
];

interface CandidateDossierModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onToggleBookmark: (id: string) => void;
  onEditCandidate?: (candidate: Candidate) => void;
  onDeleteCandidate?: (id: string) => void;
  onUpdateCandidate?: (candidate: Candidate) => void;
  onOpenPhoneForm?: (candidate: Candidate, mode?: 'FILL' | 'CUSTOMIZE_TEMPLATE') => void;
  onOpenInPersonForm?: (candidate: Candidate, mode?: 'FILL' | 'CUSTOMIZE_TEMPLATE') => void;
  currentUser?: AppUser;
  onOpenCandidatePortal?: (candidate: Candidate) => void;
  allCandidates?: Candidate[];
}

export const CandidateDossierModal: React.FC<CandidateDossierModalProps> = ({
  candidate,
  isOpen,
  onClose,
  language,
  onToggleBookmark,
  onEditCandidate,
  onDeleteCandidate,
  onUpdateCandidate,
  onOpenPhoneForm,
  onOpenInPersonForm,
  currentUser,
  onOpenCandidatePortal,
  allCandidates,
}) => {
  const isFa = language === 'PERSIAN';

  // Active step in the dossier viewer
  const [selectedStep, setSelectedStep] = useState<RecruitmentStepNumber>(1);
  // View mode: 'STEPS' (1-7 interactive roadmap), 'HISTORY' (chronological timeline), or 'APPLICATIONS' (previous applications history)
  const [activeViewMode, setActiveViewMode] = useState<'STEPS' | 'HISTORY' | 'APPLICATIONS'>('STEPS');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [scheduleNotice, setScheduleNotice] = useState<string | null>(null);

  // Step 3 Video player & upload state
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const getTodayShamsi = () => {
    try {
      const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date());
      return parts;
    } catch {
      return '1403/06/24';
    }
  };

  const getCurrentTimeStr = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Local state for step edits
  const [localCandidate, setLocalCandidate] = useState<Candidate | null>(candidate);
  const prevCandidateIdRef = useRef<string | null>(null);

  // Chronological timeline events count
  const timelineEventsCount = useMemo(() => {
    if (!localCandidate) return 0;
    return buildCandidateFullTimeline(localCandidate).length;
  }, [localCandidate]);

  // Previous applications list & count
  const applicationHistoryList = useMemo(() => {
    if (!localCandidate) return [];
    return getCandidateApplicationHistory(localCandidate, allCandidates);
  }, [localCandidate, allCandidates]);

  const applicationsHistoryCount = applicationHistoryList.length;

  useEffect(() => {
    if (candidate) {
      setLocalCandidate(candidate);
      // ONLY change selectedStep when opening a different candidate!
      if (prevCandidateIdRef.current !== candidate.id) {
        prevCandidateIdRef.current = candidate.id;
        setSelectedStep(candidate.currentStep || 1);
      }
    }
  }, [candidate]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const updateAndSaveCandidate = (updated: Candidate) => {
    setLocalCandidate(updated);
    if (onUpdateCandidate) {
      onUpdateCandidate(updated);
    } else if (onEditCandidate) {
      onEditCandidate(updated);
    }
  };

  const handleSavePhoneInterviewSchedule = (date: string, time: string) => {
    if (!localCandidate) return;
    const nowPersian = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    const userName = currentUser?.name || 'مدیر ارشد سامانه';
    const updatedStep4: Step4Data = {
      ...(localCandidate.step4 || {
        phoneTotalScore: 4,
        step4Status: 'PENDING',
      }),
      phoneInterviewDate: date,
      phoneInterviewTime: time,
      scheduledAt: nowPersian,
      scheduledBy: userName,
      notificationSent: true,
      interviewStatus: 'SCHEDULED',
    };

    const updated: Candidate = {
      ...localCandidate,
      step4: updatedStep4,
    };

    updateAndSaveCandidate(updated);

    // Register notification in notification center
    addNotification({
      type: 'INTERVIEW_PHONE',
      title: 'هماهنگی مصاحبه تلفنی جدید',
      titleEn: 'Scheduled Phone Interview',
      message: `مصاحبه تلفنی برای کارجو «${localCandidate.name}» (${localCandidate.role}) در تاریخ ${date || 'نامشخص'} و ساعت ${time || 'نامشخص'} ثبت و هماهنگ شد.`,
      messageEn: `Phone interview scheduled for candidate ${localCandidate.name} on ${date} at ${time}.`,
      candidateId: localCandidate.id,
      candidateName: localCandidate.name,
      candidateRole: localCandidate.role,
      interviewDate: date,
      interviewTime: time,
      scheduledAt: nowPersian,
      scheduledBy: userName,
    });

    setScheduleNotice(`زمان مصاحبه تلفنی در سامانه ثبت و اعلان به کاربران ارسال شد (${date} ساعت ${time})`);
    setTimeout(() => setScheduleNotice(null), 4000);
  };

  const handleSaveInPersonInterviewSchedule = (date: string, time: string) => {
    if (!localCandidate) return;
    const nowPersian = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    const userName = currentUser?.name || 'مدیر ارشد سامانه';
    const updatedStep5: Step5Data = {
      ...(localCandidate.step5 || {
        location: 'خیابان سنایی-میدان صاحب الزمان- نبش سنایی7- ورودی شماره یک مجتمع سرمد- طبقه سوم- واحد 307',
        scores: {
          educationAndExperience: 4,
          technicalCompetence: 4,
          jobMotivationAndStability: 4,
          teamworkSpirit: 4,
          culturalAlignment: 4,
          professionalAppearance: 4,
          problemSolvingSkill: 4,
        },
        totalScore: 28,
        scorePercentage: 80,
        step5Status: 'PENDING',
      }),
      interviewDate: date,
      interviewTime: time,
      scheduledAt: nowPersian,
      scheduledBy: userName,
      notificationSent: true,
      interviewStatus: 'SCHEDULED',
    };

    const updated: Candidate = {
      ...localCandidate,
      step5: updatedStep5,
    };

    updateAndSaveCandidate(updated);

    // Register notification in notification center
    addNotification({
      type: 'INTERVIEW_IN_PERSON',
      title: 'هماهنگی مصاحبه حضوری در مجتمع سرمد',
      titleEn: 'Scheduled In-Person Interview (Sarmad 307)',
      message: `مصاحبه حضوری کارجو «${localCandidate.name}» (${localCandidate.role}) در مجتمع سرمد واحد ۳۰۷ برای تاریخ ${date || 'نامشخص'} ساعت ${time || 'نامشخص'} ثبت و هماهنگ گردید.`,
      messageEn: `In-person interview scheduled for ${localCandidate.name} on ${date} at ${time} at Sarmad Complex, Unit 307.`,
      candidateId: localCandidate.id,
      candidateName: localCandidate.name,
      candidateRole: localCandidate.role,
      interviewDate: date,
      interviewTime: time,
      scheduledAt: nowPersian,
      scheduledBy: userName,
    });

    setScheduleNotice(`زمان مصاحبه حضوری در مجتمع سرمد ثبت و نوتیفیکیشن صادر شد (${date} ساعت ${time})`);
    setTimeout(() => setScheduleNotice(null), 4000);
  };

  // Explicitly change candidate's active recruitment step
  const handleSetCandidateActiveStep = (targetStep: RecruitmentStepNumber) => {
    if (!localCandidate) return;
    const statusMap: Record<RecruitmentStepNumber, CandidateStatus> = {
      1: 'STAGE_1_APPLIED',
      2: 'STAGE_2_SITE_FORM',
      3: 'STAGE_3_VIDEO',
      4: 'STAGE_4_PHONE_INTERVIEW',
      5: 'STAGE_5_IN_PERSON',
      6: 'STAGE_6_BACKGROUND_CHECK',
      7: 'STAGE_7_FINAL_DECISION',
    };

    const updated: Candidate = {
      ...localCandidate,
      currentStep: targetStep,
      status: targetStep === 7 && localCandidate.status === 'HIRED' ? 'HIRED' : statusMap[targetStep],
      rejectionReason: undefined,
      rejectionStep: undefined,
    };

    updateAndSaveCandidate(updated);
    setSelectedStep(targetStep);
  };

  const handleAdvanceToNextStep = () => {
    if (!localCandidate) return;
    const current = localCandidate.currentStep || 1;
    if (current >= 7) {
      // Mark as Hired
      const updated: Candidate = {
        ...localCandidate,
        status: 'HIRED',
        currentStep: 7,
        step7: {
          ...(localCandidate.step7 || {
            committeeDecision: 'APPROVED',
            hrSystemRegistration: true,
            step7Status: 'HIRED',
          }),
          committeeDecision: 'APPROVED',
          hrSystemRegistration: true,
          step7Status: 'HIRED',
          contractSignedDate: localCandidate.step7?.contractSignedDate || '۱۴۰۳/۰۶/۲۰',
        }
      };
      updateAndSaveCandidate(updated);
      setSelectedStep(7);
      return;
    }

    const nextStep = (current + 1) as RecruitmentStepNumber;
    const statusMap: Record<RecruitmentStepNumber, CandidateStatus> = {
      1: 'STAGE_1_APPLIED',
      2: 'STAGE_2_SITE_FORM',
      3: 'STAGE_3_VIDEO',
      4: 'STAGE_4_PHONE_INTERVIEW',
      5: 'STAGE_5_IN_PERSON',
      6: 'STAGE_6_BACKGROUND_CHECK',
      7: 'STAGE_7_FINAL_DECISION',
    };

    const updated: Candidate = {
      ...localCandidate,
      currentStep: nextStep,
      status: statusMap[nextStep],
    };

    updateAndSaveCandidate(updated);
    setSelectedStep(nextStep);
  };

  const handleSkipCurrentStep = () => {
    if (!localCandidate) return;
    const current = localCandidate.currentStep || 1;
    if (current >= 7) {
      handleAdvanceToNextStep();
      return;
    }

    const nextStep = (current + 1) as RecruitmentStepNumber;
    const statusMap: Record<RecruitmentStepNumber, CandidateStatus> = {
      1: 'STAGE_1_APPLIED',
      2: 'STAGE_2_SITE_FORM',
      3: 'STAGE_3_VIDEO',
      4: 'STAGE_4_PHONE_INTERVIEW',
      5: 'STAGE_5_IN_PERSON',
      6: 'STAGE_6_BACKGROUND_CHECK',
      7: 'STAGE_7_FINAL_DECISION',
    };

    const currentSkipped = localCandidate.skippedSteps || [];
    const newSkipped = currentSkipped.includes(current)
      ? currentSkipped
      : [...currentSkipped, current];

    const currentStepNotes = localCandidate.stepNotes || {};
    const updatedNotes = {
      ...currentStepNotes,
      [current]: currentStepNotes[current] 
        ? currentStepNotes[current] 
        : `[پرش از گام ${current} بدون الزام تکمیل اطلاعات این مرحله]`,
    };

    const updated: Candidate = {
      ...localCandidate,
      currentStep: nextStep,
      status: statusMap[nextStep],
      skippedSteps: newSkipped,
      stepNotes: updatedNotes,
    };

    updateAndSaveCandidate(updated);
    setSelectedStep(nextStep);
  };

  const handleToggleSkipForStep = (stepNum: RecruitmentStepNumber) => {
    if (!localCandidate) return;
    const currentSkipped = localCandidate.skippedSteps || [];
    const isCurrentlySkipped = currentSkipped.includes(stepNum);
    const newSkipped = isCurrentlySkipped
      ? currentSkipped.filter((s) => s !== stepNum)
      : [...currentSkipped, stepNum];

    const updated: Candidate = {
      ...localCandidate,
      skippedSteps: newSkipped,
    };

    updateAndSaveCandidate(updated);
  };

  // Step 6 Reference Helpers
  const handleAddReference = () => {
    if (!localCandidate) return;
    const currentRefs = localCandidate.step6?.references || [];
    const newRef: ReferenceContact = {
      id: `ref-${Date.now()}`,
      contactName: '',
      companyName: '',
      roleOrRelation: '',
      phone: '',
      feedbackSummary: '',
      ethicalAndWorkRating: 5,
      isVerified: true,
    };
    const updated: Candidate = {
      ...localCandidate,
      step6: {
        ...(localCandidate.step6 || {
          references: [],
          step6Status: 'APPROVED'
        }),
        references: [...currentRefs, newRef],
      }
    };
    updateAndSaveCandidate(updated);
  };

  const handleUpdateReference = (index: number, field: keyof ReferenceContact, val: any) => {
    if (!localCandidate) return;
    const currentRefs = [...(localCandidate.step6?.references || [])];
    if (!currentRefs[index]) return;
    currentRefs[index] = { ...currentRefs[index], [field]: val };
    const updated: Candidate = {
      ...localCandidate,
      step6: {
        ...(localCandidate.step6 || {
          references: [],
          step6Status: 'APPROVED'
        }),
        references: currentRefs,
      }
    };
    updateAndSaveCandidate(updated);
  };

  const handleDeleteReference = (index: number) => {
    if (!localCandidate) return;
    const currentRefs = (localCandidate.step6?.references || []).filter((_, i) => i !== index);
    const updated: Candidate = {
      ...localCandidate,
      step6: {
        ...(localCandidate.step6 || {
          references: [],
          step6Status: 'APPROVED'
        }),
        references: currentRefs,
      }
    };
    updateAndSaveCandidate(updated);
  };

  const handleRejectCandidate = () => {
    if (!localCandidate) return;
    const updated: Candidate = {
      ...localCandidate,
      status: 'REJECTED',
      rejectionStep: localCandidate.currentStep,
      rejectionReason: rejectionReasonInput || 'عدم احراز شرایط لازم در این مرحله',
    };
    updateAndSaveCandidate(updated);
    setShowRejectModal(false);
    setRejectionReasonInput('');
  };

  const handleWithdrawCandidate = () => {
    if (!localCandidate) return;
    const updated: Candidate = {
      ...localCandidate,
      status: 'WITHDRAWN',
      rejectionStep: localCandidate.currentStep,
      rejectionReason: 'انصراف خود کارجو از ادامه فرآیند',
    };
    updateAndSaveCandidate(updated);
  };

  const handleReactivateCandidate = () => {
    if (!localCandidate) return;
    const step = localCandidate.currentStep || 1;
    const statusMap: Record<RecruitmentStepNumber, CandidateStatus> = {
      1: 'STAGE_1_APPLIED',
      2: 'STAGE_2_SITE_FORM',
      3: 'STAGE_3_VIDEO',
      4: 'STAGE_4_PHONE_INTERVIEW',
      5: 'STAGE_5_IN_PERSON',
      6: 'STAGE_6_BACKGROUND_CHECK',
      7: 'STAGE_7_FINAL_DECISION',
    };
    const updated: Candidate = {
      ...localCandidate,
      status: statusMap[step],
      rejectionReason: undefined,
      rejectionStep: undefined,
    };
    updateAndSaveCandidate(updated);
  };

  if (!isOpen || !candidate || !localCandidate) return null;

  const currentStep = localCandidate.currentStep || 1;
  const isRejected = localCandidate.status === 'REJECTED';
  const isWithdrawn = localCandidate.status === 'WITHDRAWN';
  const isHired = localCandidate.status === 'HIRED';

  // 7 Steps definitions
  const stepsConfig: { stepNumber: RecruitmentStepNumber; titleFa: string; shortTitle: string; descFa: string }[] = [
    { stepNumber: 1, titleFa: 'گام اول: ثبت اطلاعات در پلتفرم‌ها', shortTitle: 'ثبت اولیه', descFa: 'اطلاعات اولیه و تأیید رزومه' },
    { stepNumber: 2, titleFa: 'گام دوم: تکمیل فرم سایت پناپ', shortTitle: 'فرم سایت', descFa: 'پیگیری ارسال پیام و تکمیل فرم ۳ روزه' },
    { stepNumber: 3, titleFa: 'گام سوم: ارسال ویدیو رسمی', shortTitle: 'ارسال ویدیو', descFa: 'ارزیابی مهارت ارتباطی و کلامی' },
    { stepNumber: 4, titleFa: 'گام چهارم: مصاحبه تلفنی', shortTitle: 'مصاحبه تلفنی', descFa: 'سنجش ۶ معیار انگیزش و تناسب' },
    { stepNumber: 5, titleFa: 'گام پنجم: مصاحبه حضوری (مجتمع سرمد)', shortTitle: 'مصاحبه حضوری', descFa: 'امتیازدهی ۷ معیار تخصصی ۰ تا ۵' },
    { stepNumber: 6, titleFa: 'گام ششم: استعلام پیش‌زمینه', shortTitle: 'استعلام معرفین', descFa: 'بررسی معرفین و سوابق قبلی' },
    { stepNumber: 7, titleFa: 'گام هفتم: تصمیم نهایی و استخدام', shortTitle: 'تصمیم و قرارداد', descFa: 'تصویب کمیته و امضای قرارداد' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir={isFa ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold text-lg">
              {localCandidate.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {localCandidate.name}
                </h2>
                <CandidateApplicationBadge 
                  candidate={localCandidate} 
                  allCandidates={allCandidates} 
                  onSelectHistoryTab={() => setActiveViewMode('APPLICATIONS')}
                />
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {localCandidate.role}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-900/50 text-blue-300 border border-blue-700/50 font-mono">
                  {localCandidate.trackingCode || localCandidate.id}
                </span>

                {/* Status Badge */}
                {isHired && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    استخدام شده در پناپ
                  </span>
                )}
                {isRejected && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    رد شده در گام {localCandidate.rejectionStep || currentStep}
                  </span>
                )}
                {isWithdrawn && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    انصراف کارجو
                  </span>
                )}
                {!isHired && !isRejected && !isWithdrawn && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
                    در جریان (گام {currentStep} از ۷)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                <span>واحد: {localCandidate.department}</span>
                <span>تلفن: {localCandidate.phone}</span>
                <span>منبع: {localCandidate.source}</span>
                <span>نظام وظیفه: {localCandidate.militaryStatusFa || 'کارت پایان خدمت'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenPhoneForm && (
              <button
                onClick={() => onOpenPhoneForm(localCandidate, 'FILL')}
                className="px-2.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="تکمیل فرم ۱ مصاحبه تلفنی در مرکز ارزیابی"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>فرم ۱ (تلفنی)</span>
              </button>
            )}

            {onOpenInPersonForm && (
              <button
                onClick={() => onOpenInPersonForm(localCandidate, 'FILL')}
                className="px-2.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="تکمیل فرم ۲ مصاحبه حضوری در مرکز ارزیابی"
              >
                <Building className="w-3.5 h-3.5" />
                <span>فرم ۲ (حضوری)</span>
              </button>
            )}

            {onOpenCandidatePortal && (
              <button
                onClick={() => onOpenCandidatePortal(localCandidate)}
                className="px-2.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="مشاهده پرتال اختصاصی رهگیری کارجو"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">پرتال کارجو</span>
              </button>
            )}

            <button
              onClick={() => onToggleBookmark(localCandidate.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                localCandidate.isBookmarked 
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="نشان‌کردن"
            >
              <Bookmark className={`w-4 h-4 ${localCandidate.isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {onDeleteCandidate && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                title="حذف پرونده"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Navigation Tabs: Steps (1-7) vs Applications History vs History Timeline */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              id="tab-candidate-view-steps"
              onClick={() => setActiveViewMode('STEPS')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeViewMode === 'STEPS'
                  ? 'border-blue-500 text-blue-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isFa ? 'گام‌های فرآیند استخدامی (۱ تا ۷)' : 'Recruitment Steps (1-7)'}</span>
            </button>

            {/* سوابق ارسال رزومه (Application Submissions History) */}
            <button
              type="button"
              id="tab-candidate-view-applications"
              onClick={() => setActiveViewMode('APPLICATIONS')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeViewMode === 'APPLICATIONS'
                  ? 'border-purple-500 text-purple-300 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span>{isFa ? 'سوابق ارسال رزومه' : 'Application History'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                applicationsHistoryCount > 0 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {applicationsHistoryCount > 0 ? `${applicationsHistoryCount} سابقه` : '۱ درخواست فعلی'}
              </span>
            </button>

            <button
              type="button"
              id="tab-candidate-view-history"
              onClick={() => setActiveViewMode('HISTORY')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeViewMode === 'HISTORY'
                  ? 'border-blue-500 text-blue-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{isFa ? 'تاریخچه و گاه‌شمار پرونده (History)' : 'Candidate History & Timeline'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {timelineEventsCount} {isFa ? 'رویداد' : 'events'}
              </span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{isFa ? 'کد رهگیری:' : 'Tracking:'} <strong className="font-mono text-emerald-300">{localCandidate.trackingCode || localCandidate.id}</strong></span>
          </div>
        </div>

        {/* 9-Column Interactive Stepper Header (7 Steps + Applications + History) */}
        <div className="px-2 sm:px-4 py-2.5 bg-slate-50 border-b border-slate-200 w-full shrink-0">
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1 sm:gap-2 w-full">
            {stepsConfig.map((step) => {
              const isCurrent = step.stepNumber === currentStep;
              const isPast = step.stepNumber < currentStep || isHired;
              const isSelected = step.stepNumber === selectedStep && activeViewMode === 'STEPS';
              const isStepRejected = isRejected && localCandidate.rejectionStep === step.stepNumber;
              const isStepSkipped = localCandidate.skippedSteps?.includes(step.stepNumber);

              let badgeBg = 'bg-slate-200 text-slate-600';
              let badgeText = `${step.stepNumber}`;

              if (isStepRejected) {
                badgeBg = 'bg-rose-600 text-white';
                badgeText = '✕';
              } else if (isStepSkipped) {
                badgeBg = 'bg-amber-500 text-white';
                badgeText = '⏭';
              } else if (isPast) {
                badgeBg = 'bg-emerald-600 text-white';
                badgeText = '✓';
              } else if (isCurrent) {
                badgeBg = 'bg-blue-600 text-white ring-2 ring-blue-300';
              }

              return (
                <button
                  key={step.stepNumber}
                  onClick={() => {
                    setSelectedStep(step.stepNumber);
                    setActiveViewMode('STEPS');
                  }}
                  title={`${step.titleFa}${isStepSkipped ? ' (پرش شده)' : ''}`}
                  className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl sm:rounded-2xl transition-all text-center relative cursor-pointer min-w-0 ${
                    isSelected 
                      ? 'bg-white shadow-xs border border-blue-300 ring-2 ring-blue-500/20' 
                      : 'hover:bg-slate-200/60 border border-transparent'
                  }`}
                >
                  {/* Skipped Badge Pill */}
                  {isStepSkipped && (
                    <span className="absolute -top-1.5 right-1 px-1 py-0.2 bg-amber-500 text-white text-[8px] font-bold rounded-full shadow-2xs">
                      پرش
                    </span>
                  )}

                  <div className="flex items-center justify-center gap-1 mb-0.5 max-w-full">
                    <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${badgeBg}`}>
                      {badgeText}
                    </span>
                    <span className={`text-[10px] sm:text-xs font-bold truncate ${isSelected ? 'text-blue-900 font-extrabold' : 'text-slate-700'}`}>
                      {step.shortTitle}
                    </span>
                  </div>

                  <span className="hidden md:block text-[9px] text-slate-500 truncate max-w-full text-center">
                    {step.descFa}
                  </span>
                </button>
              );
            })}

            {/* 8th Column: Applications Tab shortcut button */}
            <button
              id="btn-stepper-applications-tab"
              onClick={() => setActiveViewMode('APPLICATIONS')}
              title={isFa ? 'سوابق و موقعیت‌های ارسالی قبلی کارجو' : 'Application History'}
              className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl sm:rounded-2xl transition-all text-center relative cursor-pointer min-w-0 ${
                activeViewMode === 'APPLICATIONS'
                  ? 'bg-purple-900 text-white shadow-xs border border-purple-700 ring-2 ring-purple-500/30'
                  : 'hover:bg-slate-200/60 border border-transparent text-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5 max-w-full">
                <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${
                  activeViewMode === 'APPLICATIONS' ? 'bg-purple-600 text-white' : applicationsHistoryCount > 0 ? 'bg-purple-200 text-purple-800' : 'bg-slate-300 text-slate-700'
                }`}>
                  <RotateCcw className="w-3 h-3" />
                </span>
                <span className={`text-[10px] sm:text-xs font-bold truncate ${activeViewMode === 'APPLICATIONS' ? 'text-white font-extrabold' : 'text-slate-700'}`}>
                  {isFa ? 'سوابق ارسال' : 'Applications'}
                </span>
              </div>
              <span className={`hidden md:block text-[9px] truncate max-w-full text-center ${activeViewMode === 'APPLICATIONS' ? 'text-purple-200' : 'text-slate-500'}`}>
                {applicationsHistoryCount > 0 ? `${applicationsHistoryCount} سابقه` : 'درخواست فعلی'}
              </span>
            </button>

            {/* 9th Column: History Tab shortcut button */}
            <button
              id="btn-stepper-history-tab"
              onClick={() => setActiveViewMode('HISTORY')}
              title={isFa ? 'گاه‌شمار وقایع و تغییرات وضعیت پرونده' : 'Candidate Timeline & History'}
              className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl sm:rounded-2xl transition-all text-center relative cursor-pointer min-w-0 ${
                activeViewMode === 'HISTORY'
                  ? 'bg-slate-900 text-white shadow-xs border border-slate-700 ring-2 ring-blue-500/30'
                  : 'hover:bg-slate-200/60 border border-transparent text-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5 max-w-full">
                <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${
                  activeViewMode === 'HISTORY' ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}>
                  <Clock className="w-3 h-3" />
                </span>
                <span className={`text-[10px] sm:text-xs font-bold truncate ${activeViewMode === 'HISTORY' ? 'text-white font-extrabold' : 'text-slate-700'}`}>
                  {isFa ? 'تاریخچه' : 'History'}
                </span>
              </div>
              <span className={`hidden md:block text-[9px] truncate max-w-full text-center ${activeViewMode === 'HISTORY' ? 'text-blue-300' : 'text-slate-500'}`}>
                {timelineEventsCount} {isFa ? 'رویداد' : 'events'}
              </span>
            </button>
          </div>
        </div>

        {/* Main Workspace for Selected Step OR History Timeline OR Applications List */}
        {activeViewMode === 'APPLICATIONS' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
            <CandidateApplicationsList 
              candidate={localCandidate}
              allCandidates={allCandidates}
              onUpdateCandidate={updateAndSaveCandidate}
              isFa={isFa}
            />
          </div>
        ) : activeViewMode === 'HISTORY' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
            <CandidateHistoryTimeline 
              candidate={localCandidate}
              onUpdateCandidate={updateAndSaveCandidate}
              currentUser={currentUser}
              isFa={isFa}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Informative banner if viewed step differs from candidate's current active step */}
          {selectedStep !== currentStep && !isRejected && !isWithdrawn && !isHired && (
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 text-blue-900">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>
                  شما در حال بررسی <strong>{stepsConfig.find(s => s.stepNumber === selectedStep)?.titleFa}</strong> هستید. (مرحله فعال پرونده این کارجو: <strong>گام {currentStep}</strong>)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSetCandidateActiveStep(selectedStep)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>انتقال کارجو به این گام (گام {selectedStep})</span>
              </button>
            </div>
          )}

          {/* If the current selected step is marked as skipped */}
          {localCandidate.skippedSteps?.includes(selectedStep) && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 flex items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                  ⏭
                </div>
                <div>
                  <div className="font-bold text-amber-900">
                    این مرحله ({stepsConfig.find(s => s.stepNumber === selectedStep)?.titleFa}) پرش شده است (Fast-Tracked)
                  </div>
                  <div className="text-[11px] text-amber-700">
                    متقاضی بدون الزام به ثبت اطلاعات یا ارسال مدارک این مرحله، به گام‌های بعدی هدایت شده است.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleSkipForStep(selectedStep)}
                className="px-3 py-1.5 bg-white hover:bg-amber-100 border border-amber-400 text-amber-900 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 shadow-2xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>لغو پرش</span>
              </button>
            </div>
          )}

          {/* STEP 1 WORKSPACE */}
          {selectedStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    گام اول: مشخصات کلی متقاضی و رزومه اولیه
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    اطلاعات دریافتی از پلتفرم‌های کاریابی، بررسی تطابق اولیه و هدایت به گام دوم
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  وضعیت رزومه: {localCandidate.step1?.initialResumeStatus === 'APPROVED' ? 'تأیید شده' : 'در حال بررسی'}
                </span>
              </div>

              {/* Alert / Notice for repeat applicant if exists */}
              {applicationsHistoryCount > 0 && (
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-3 flex-wrap animate-in fade-in">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                        <span>این کارجو سابقه ارسال رزومه برای {applicationsHistoryCount} موقعیت دیگر در سامانه دارد</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-200 text-purple-900 font-bold">
                          ارسال مکرر
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-800 mt-0.5">
                        آخرین سابقه: {applicationHistoryList[0]?.jobTitle} ({applicationHistoryList[0]?.appliedDate || 'نامشخص'}) — وضعیت: {applicationHistoryList[0]?.status}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveViewMode('APPLICATIONS')}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>مشاهده سوابق ارسال کارتی</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 block">نام و نام خانوادگی</span>
                  <span className="text-xs font-bold text-slate-800">{localCandidate.name}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 block">کد ملی</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">{localCandidate.nationalId || 'ثبت نشده'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 block">شماره تماس</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">{localCandidate.phone}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 block">سمت درخواستی</span>
                  <span className="text-xs font-bold text-slate-800">{localCandidate.role}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 block">واحد سازمانی</span>
                  <span className="text-xs font-bold text-slate-800">{localCandidate.department}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 block">وضعیت نظام وظیفه</span>
                  <span className="text-xs font-bold text-slate-800">{localCandidate.militaryStatusFa || 'کارت پایان خدمت'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 block">منبع دریافت رزومه</span>
                  <span className="text-xs font-bold text-blue-700">{localCandidate.source}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 block">تاریخ ثبت اولیه</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">{localCandidate.appliedDate}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 block">کارشناس پیگیری</span>
                  <span className="text-xs font-bold text-slate-800">{localCandidate.assignee || 'کارشناس جذب'}</span>
                </div>
              </div>

              {localCandidate.summary && (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <span className="text-xs font-bold text-blue-900 block mb-1">ملاحظات و خلاصه پرونده:</span>
                  <p className="text-xs text-blue-800 leading-relaxed">{localCandidate.summary}</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 WORKSPACE */}
          {selectedStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Send className="w-4 h-4 text-sky-600" />
                    گام دوم: تکمیل فرم درخواست همکاری در سایت پناپ
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ارسال پیام رسمی تکمیل فرم در وبسایت pnap.ir/employment/ و پیگیری ظرف ۳ روز کاری
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${
                  localCandidate.step2?.isSiteCompleted === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  وضعیت فرم سایت: {localCandidate.step2?.isSiteCompleted === 'COMPLETED' ? 'تکمیل شده' : 'در انتظار تکمیل (مهلت ۳ روز)'}
                </span>
              </div>

              {/* Official Step 2 Message Template Box */}
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <Copy className="w-4 h-4 text-sky-600" />
                    متن پیام رسمی ارسال به متقاضی (سایت پناپ):
                  </span>
                  <button
                    onClick={() => copyToClipboard(`سلام وقت بخیر
در راستای فرآیند جذب و استخدام نیرو، لطفاً به وبسایت شرکت به آدرس: https://pnap.ir/employment/ مراجعه کرده و فرم مربوط به "همکاری با ما " را تکمیل کرده و نسبت به حوزه فعالیت شرکت سایت را مطالعه فرمائید.
اطلاعات ثبت‌شده شما در ادامه مراحل بررسی و هماهنگی‌های لازم با جنابعالی انجام خواهد شد.
با تشکر
شرکت پناپ`, 'step2')}
                    className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {copiedText === 'step2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText === 'step2' ? 'کپی شد!' : 'کپی پیام رسمی سایت'}
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-sky-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line">
                  {`سلام وقت بخیر
در راستای فرآیند جذب و استخدام نیرو، لطفاً به وبسایت شرکت به آدرس: https://pnap.ir/employment/ مراجعه کرده و فرم مربوط به "همکاری با ما " را تکمیل کرده و نسبت به حوزه فعالیت شرکت سایت را مطالعه فرمائید.
اطلاعات ثبت‌شده شما در ادامه مراحل بررسی و هماهنگی‌های لازم با جنابعالی انجام خواهد شد.
با تشکر
شرکت پناپ`}
                </div>
              </div>

              {/* Step 2 Status Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    وضعیت وصول پیام و تکمیل فرم سایت:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="step2_site_complete"
                        checked={localCandidate.step2?.isSiteCompleted === 'COMPLETED'}
                        onChange={() => {
                          const updated: Candidate = {
                            ...localCandidate,
                            step2: {
                              ...localCandidate.step2!,
                              isSiteCompleted: 'COMPLETED',
                              step2Status: 'APPROVED',
                            }
                          };
                          updateAndSaveCandidate(updated);
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>فرم در سایت تکمیل شده است (تأیید اطلاعات تکمیلی)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="step2_site_complete"
                        checked={localCandidate.step2?.isSiteCompleted === 'PENDING'}
                        onChange={() => {
                          const updated: Candidate = {
                            ...localCandidate,
                            step2: {
                              ...localCandidate.step2!,
                              isSiteCompleted: 'PENDING',
                              step2Status: 'PENDING',
                            }
                          };
                          updateAndSaveCandidate(updated);
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>در انتظار تکمیل فرم (طی مهلت ۳ روز کاری)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="step2_site_complete"
                        checked={localCandidate.step2?.isSiteCompleted === 'NOT_COMPLETED'}
                        onChange={() => {
                          const updated: Candidate = {
                            ...localCandidate,
                            step2: {
                              ...localCandidate.step2!,
                              isSiteCompleted: 'NOT_COMPLETED',
                              step2Status: 'REJECTED',
                            }
                          };
                          updateAndSaveCandidate(updated);
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>عدم تکمیل فرم / انصراف کارجو در این مرحله</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    علت عدم تکمیل یا دلایل رد (در صورت وجود):
                  </label>
                  <textarea
                    rows={3}
                    value={localCandidate.step2?.siteIncompletionReason || ''}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step2: {
                          ...localCandidate.step2!,
                          siteIncompletionReason: e.target.value,
                        }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    placeholder="عدم پاسخ به پیام، انصراف یا رد اطلاعات وارد شده در فرم سایت..."
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 WORKSPACE */}
          {selectedStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" />
                    گام سوم: ارسال ویدیو معرفی متقاضی
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ارسال پیام به متقاضی، دریافت ویدیوی ۱ الی ۳ دقیقه‌ای معرفی و ارزیابی شایستگی‌های کلامی و رفتاری
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={localCandidate.step3?.videoSubmissionStatus || 'PENDING'}
                    onChange={(e) => {
                      const val = e.target.value as 'PENDING' | 'RECEIVED' | 'NOT_SENT' | 'WAIVED';
                      const updated: Candidate = {
                        ...localCandidate,
                        step3: {
                          ...(localCandidate.step3 || {
                            videoSubmissionStatus: 'PENDING',
                            communicationSkillScore: 4,
                            verbalFluencyScore: 4,
                            professionalAppearanceScore: 4,
                            overallVideoScore: 12,
                            step3Status: 'PENDING',
                          }),
                          videoSubmissionStatus: val,
                          step3Status: val === 'RECEIVED' || val === 'WAIVED' ? 'APPROVED' : val === 'NOT_SENT' ? 'REJECTED' : 'PENDING',
                        }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-xl font-bold bg-white border border-purple-200 text-purple-900 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="PENDING">⏳ در انتظار ارسال ویدیو</option>
                    <option value="RECEIVED">✓ ویدیو دریافت و تأیید شد</option>
                    <option value="WAIVED">⏭ بدون نیاز به ویدیو (معاف/پرش)</option>
                    <option value="NOT_SENT">✕ عدم ارسال ویدیو / انصراف</option>
                  </select>
                </div>
              </div>

              {/* ۱. فیلد ارسال ویدئو متقاضی */}
              <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-purple-50">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileVideo className="w-4 h-4 text-purple-600" />
                    فیلد ارسال ویدئو متقاضی:
                  </span>
                  <div className="flex items-center gap-2">
                    {localCandidate.step3?.videoUrlOrFile && (
                      <button
                        type="button"
                        onClick={() => setIsPlayingVideo(true)}
                        className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 text-purple-700 fill-purple-700" />
                        مشاهده / پخش ویدیو
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {localCandidate.step3?.videoFileName ? 'تغییر فایل ویدیوی کارجو' : 'بارگذاری فایل ویدیوی کارجو'}
                    </button>
                    <input
                      type="file"
                      ref={videoFileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && localCandidate) {
                          const url = URL.createObjectURL(file);
                          const updated: Candidate = {
                            ...localCandidate,
                            step3: {
                              ...(localCandidate.step3 || {
                                videoSubmissionStatus: 'RECEIVED',
                                communicationSkillScore: 4,
                                verbalFluencyScore: 4,
                                professionalAppearanceScore: 4,
                                overallVideoScore: 12,
                                step3Status: 'APPROVED',
                              }),
                              videoSubmissionStatus: 'RECEIVED',
                              step3Status: 'APPROVED',
                              videoFileName: file.name,
                              videoUrlOrFile: url,
                              videoSubmissionPlatform: localCandidate.step3?.videoSubmissionPlatform || 'SYSTEM_UPLOAD',
                              videoSubmissionDate: localCandidate.step3?.videoSubmissionDate || getTodayShamsi(),
                              videoSubmissionTime: localCandidate.step3?.videoSubmissionTime || getCurrentTimeStr(),
                            }
                          };
                          updateAndSaveCandidate(updated);
                        }
                      }}
                      accept="video/*,.mp4,.mov,.webm,.mkv"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* File / URL inputs */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="block text-xs font-medium text-slate-600">
                      لینک یا آدرس فایل ویدیوی ارسالی متقاضی:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={localCandidate.step3?.videoUrlOrFile || ''}
                        onChange={(e) => {
                          const updated: Candidate = {
                            ...localCandidate,
                            step3: {
                              ...(localCandidate.step3 || {
                                videoSubmissionStatus: 'RECEIVED',
                                communicationSkillScore: 4,
                                verbalFluencyScore: 4,
                                professionalAppearanceScore: 4,
                                overallVideoScore: 12,
                                step3Status: 'APPROVED',
                              }),
                              videoUrlOrFile: e.target.value,
                              videoSubmissionStatus: e.target.value ? 'RECEIVED' : (localCandidate.step3?.videoSubmissionStatus || 'PENDING'),
                            }
                          };
                          updateAndSaveCandidate(updated);
                        }}
                        placeholder="لینک مستقیم ویدیو، آدرس فایل ذخیره‌شده یا شناسه پیام در پیام‌رسان..."
                        className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-purple-500 font-mono text-left dir-ltr"
                      />
                      {localCandidate.step3?.videoUrlOrFile && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated: Candidate = {
                              ...localCandidate,
                              step3: {
                                ...localCandidate.step3!,
                                videoUrlOrFile: '',
                                videoFileName: '',
                              }
                            };
                            updateAndSaveCandidate(updated);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="حذف فایل یا لینک"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-1.5">
                    <label className="block text-xs font-medium text-slate-600">
                      مدت زمان تقریبی ویدیو (دقیقه):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        step={0.5}
                        value={localCandidate.step3?.videoDurationMinutes || 2}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const updated: Candidate = {
                            ...localCandidate,
                            step3: {
                              ...(localCandidate.step3 || {
                                videoSubmissionStatus: 'PENDING',
                                communicationSkillScore: 4,
                                verbalFluencyScore: 4,
                                professionalAppearanceScore: 4,
                                overallVideoScore: 12,
                                step3Status: 'PENDING',
                              }),
                              videoDurationMinutes: val,
                            }
                          };
                          updateAndSaveCandidate(updated);
                        }}
                        className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-purple-500 text-center font-bold"
                      />
                      <span className="text-xs text-slate-500 whitespace-nowrap">دقیقه (مجاز: ۱ تا ۳)</span>
                    </div>
                  </div>
                </div>

                {localCandidate.step3?.videoFileName && (
                  <div className="flex items-center justify-between p-2.5 bg-purple-50/70 rounded-xl border border-purple-200/80 text-xs text-purple-900">
                    <div className="flex items-center gap-2 truncate">
                      <FileVideo className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="font-semibold">فایل بارگذاری شده:</span>
                      <span className="font-mono text-purple-800 truncate dir-ltr">{localCandidate.step3.videoFileName}</span>
                    </div>
                    <span className="text-[11px] bg-white px-2 py-0.5 rounded-md font-bold text-emerald-700 border border-emerald-200">
                      ✓ آماده ارزیابی
                    </span>
                  </div>
                )}
              </div>

              {/* ۲. بخش ویژه زمان و محل ارسال ویدیو (شبکه اجتماعی / پیام‌رسان) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/40 via-white to-slate-50 border border-purple-200/90 space-y-4 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-purple-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-purple-600" />
                      گزینه‌های زمان و محل ارسال ویدئو متقاضی (شبکه اجتماعی / پیام‌رسان):
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      ثبت دقیق پیام‌رسانی که کارجو ویدیو را در آن ارسال کرده است (بله، ایتا، روبیکا، تلگرام و...) به همراه زمان ارسال
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step3: {
                          ...(localCandidate.step3 || {
                            videoSubmissionStatus: 'RECEIVED',
                            communicationSkillScore: 4,
                            verbalFluencyScore: 4,
                            professionalAppearanceScore: 4,
                            overallVideoScore: 12,
                            step3Status: 'APPROVED',
                          }),
                          videoSubmissionDate: getTodayShamsi(),
                          videoSubmissionTime: getCurrentTimeStr(),
                        }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-purple-700" />
                    ثبت زمان اکنون (الان)
                  </button>
                </div>

                {/* محل ارسال ویدیو: شبکه‌های اجتماعی */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    محل ارسال ویدیو (در کدام شبکه اجتماعی ارسال کرده است؟):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {VIDEO_PLATFORMS.map((platform) => {
                      const isSelected = (localCandidate.step3?.videoSubmissionPlatform || 'EITAA') === platform.id;
                      return (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => {
                            const updated: Candidate = {
                              ...localCandidate,
                              step3: {
                                ...(localCandidate.step3 || {
                                  videoSubmissionStatus: 'RECEIVED',
                                  communicationSkillScore: 4,
                                  verbalFluencyScore: 4,
                                  professionalAppearanceScore: 4,
                                  overallVideoScore: 12,
                                  step3Status: 'APPROVED',
                                }),
                                videoSubmissionPlatform: platform.id,
                                videoSubmissionDate: localCandidate.step3?.videoSubmissionDate || getTodayShamsi(),
                                videoSubmissionTime: localCandidate.step3?.videoSubmissionTime || getCurrentTimeStr(),
                              }
                            };
                            updateAndSaveCandidate(updated);
                          }}
                          className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                            isSelected ? platform.activeColor : platform.color
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
                          <span className="truncate">{platform.labelFa.replace(/پیام‌رسان /g, '')}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {localCandidate.step3?.videoSubmissionPlatform === 'OTHER' && (
                    <div className="pt-2 animate-in fade-in">
                      <input
                        type="text"
                        value={localCandidate.step3?.videoSubmissionPlatformOther || ''}
                        onChange={(e) => {
                          const updated: Candidate = {
                            ...localCandidate,
                            step3: {
                              ...localCandidate.step3!,
                              videoSubmissionPlatformOther: e.target.value,
                            }
                          };
                          updateAndSaveCandidate(updated);
                        }}
                        placeholder="نام شبکه اجتماعی یا بستر ارسال ویدیو را بنویسید (مثلاً: بله سازمانی، سروش، دیسکورد...)"
                        className="w-full p-2.5 text-xs bg-white rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                </div>

                {/* زمان ارسال ویدیو و حساب کاربری کارجو */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      زمان ارسال: تاریخ ارسال ویدیو (شمسی):
                    </label>
                    <input
                      type="text"
                      value={localCandidate.step3?.videoSubmissionDate || ''}
                      onChange={(e) => {
                        const updated: Candidate = {
                          ...localCandidate,
                          step3: {
                            ...(localCandidate.step3 || {
                              videoSubmissionStatus: 'RECEIVED',
                              communicationSkillScore: 4,
                              verbalFluencyScore: 4,
                              professionalAppearanceScore: 4,
                              overallVideoScore: 12,
                              step3Status: 'APPROVED',
                            }),
                            videoSubmissionDate: e.target.value,
                          }
                        };
                        updateAndSaveCandidate(updated);
                      }}
                      placeholder="مثال: ۱۴۰۳/۰۶/۱۵"
                      className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 text-center font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      زمان ارسال: ساعت ارسال ویدیو:
                    </label>
                    <input
                      type="text"
                      value={localCandidate.step3?.videoSubmissionTime || ''}
                      onChange={(e) => {
                        const updated: Candidate = {
                          ...localCandidate,
                          step3: {
                            ...(localCandidate.step3 || {
                              videoSubmissionStatus: 'RECEIVED',
                              communicationSkillScore: 4,
                              verbalFluencyScore: 4,
                              professionalAppearanceScore: 4,
                              overallVideoScore: 12,
                              step3Status: 'APPROVED',
                            }),
                            videoSubmissionTime: e.target.value,
                          }
                        };
                        updateAndSaveCandidate(updated);
                      }}
                      placeholder="مثال: ۱۴:۳۰"
                      className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 text-center font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700 flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-purple-600" />
                      آیدی یا شماره متقاضی در پیام‌رسان:
                    </label>
                    <input
                      type="text"
                      value={localCandidate.step3?.videoSenderAccount || ''}
                      onChange={(e) => {
                        const updated: Candidate = {
                          ...localCandidate,
                          step3: {
                            ...(localCandidate.step3 || {
                              videoSubmissionStatus: 'RECEIVED',
                              communicationSkillScore: 4,
                              verbalFluencyScore: 4,
                              professionalAppearanceScore: 4,
                              overallVideoScore: 12,
                              step3Status: 'APPROVED',
                            }),
                            videoSenderAccount: e.target.value,
                          }
                        };
                        updateAndSaveCandidate(updated);
                      }}
                      placeholder="مثال: @username یا 0912..."
                      className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 font-mono text-left dir-ltr"
                    />
                  </div>
                </div>

                {/* خلاصه ثبتی */}
                {(localCandidate.step3?.videoSubmissionPlatform || localCandidate.step3?.videoSubmissionDate) && (
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>
                      ویدیو از طریق بستر{' '}
                      <strong className="text-purple-950 font-bold">
                        {VIDEO_PLATFORMS.find(p => p.id === localCandidate.step3?.videoSubmissionPlatform)?.labelFa || localCandidate.step3?.videoSubmissionPlatform || 'پیام‌رسان'}
                      </strong>{' '}
                      {localCandidate.step3?.videoSubmissionDate && `در تاریخ ${localCandidate.step3.videoSubmissionDate}`}
                      {localCandidate.step3?.videoSubmissionTime && ` ساعت ${localCandidate.step3.videoSubmissionTime}`}
                      {localCandidate.step3?.videoSenderAccount && ` (حساب کاربری: ${localCandidate.step3.videoSenderAccount})`}
                      {' '}ثبت گردیده است.
                    </span>
                  </div>
                )}
              </div>

              {/* Official Step 3 Video Request Message Template */}
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <Copy className="w-4 h-4 text-purple-600" />
                    متن پیام رسمی درخواست ارسال ویدیو:
                  </span>
                  <button
                    onClick={() => copyToClipboard(`با سلام و احترام

پیرو رزومه ارسالی، خواهشمند است در یک ویدئو حداکثر دو دقیقه‌ای به صورت مختصر *هدفتان از همکاری با پناپ* را شرح داده، قید بفرمایید *متقاضی همکاری در چه بخشی هستید؟*، همچنین *نقاط قوت خود را برشمرده* و ارسال فرمایید.
با تشکر
شرکت پناپ`, 'step3')}
                    className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {copiedText === 'step3' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText === 'step3' ? 'کپی شد!' : 'کپی متن پیام ویدیو'}
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line">
                  {`با سلام و احترام

پیرو رزومه ارسالی، خواهشمند است در یک ویدئو حداکثر دو دقیقه‌ای به صورت مختصر *هدفتان از همکاری با پناپ* را شرح داده، قید بفرمایید *متقاضی همکاری در چه بخشی هستید؟*، همچنین *نقاط قوت خود را برشمرده* و ارسال فرمایید.
با تشکر
شرکت پناپ`}
                </div>
              </div>

              {/* Video Assessment Scorecard */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  معیارهای ارزیابی ویدیوی متقاضی (امتیاز ۱ تا ۵):
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">مهارت‌های ارتباطی</span>
                      <span className="text-purple-600 font-bold">{localCandidate.step3?.communicationSkillScore || 4} از ۵</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={localCandidate.step3?.communicationSkillScore || 4}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updated: Candidate = {
                          ...localCandidate,
                          step3: {
                            ...localCandidate.step3!,
                            communicationSkillScore: val,
                          }
                        };
                        updateAndSaveCandidate(updated);
                      }}
                      className="w-full accent-purple-600"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">تسلط کلامی و بیان</span>
                      <span className="text-purple-600 font-bold">{localCandidate.step3?.verbalFluencyScore || 4} از ۵</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={localCandidate.step3?.verbalFluencyScore || 4}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updated: Candidate = {
                          ...localCandidate,
                          step3: {
                            ...localCandidate.step3!,
                            verbalFluencyScore: val,
                          }
                        };
                        updateAndSaveCandidate(updated);
                      }}
                      className="w-full accent-purple-600"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">ظاهر و رفتار حرفه‌ای</span>
                      <span className="text-purple-600 font-bold">{localCandidate.step3?.professionalAppearanceScore || 4} از ۵</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={localCandidate.step3?.professionalAppearanceScore || 4}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updated: Candidate = {
                          ...localCandidate,
                          step3: {
                            ...localCandidate.step3!,
                            professionalAppearanceScore: val,
                          }
                        };
                        updateAndSaveCandidate(updated);
                      }}
                      className="w-full accent-purple-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">توضیحات ارزیاب درباره ویدیو:</label>
                  <input
                    type="text"
                    value={localCandidate.step3?.evaluatorNotes || ''}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step3: {
                          ...localCandidate.step3!,
                          evaluatorNotes: e.target.value,
                        }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    placeholder="کیفیت پاسخ‌ها، زبان بدن، انگیزه و ارزیابی کلی ویدیوی ارسالی متقاضی..."
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Schedule notice banner if saved */}
          {scheduleNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{scheduleNotice}</span>
              </div>
              <button 
                onClick={() => setScheduleNotice(null)}
                className="text-emerald-700 hover:text-emerald-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* STEP 4 WORKSPACE */}
          {selectedStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              {/* INTERVIEW SCHEDULER CARD AT THE TOP OF STEP 4 */}
              <InterviewSchedulerCard
                interviewType="PHONE"
                currentDate={localCandidate.step4?.phoneInterviewDate}
                currentTime={localCandidate.step4?.phoneInterviewTime}
                scheduledAt={localCandidate.step4?.scheduledAt}
                scheduledBy={localCandidate.step4?.scheduledBy}
                notificationSent={localCandidate.step4?.notificationSent}
                onSaveSchedule={handleSavePhoneInterviewSchedule}
                isFa={isFa}
              />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    گام چهارم: ارزیابی مصاحبه تلفنی (۱۰ سرفصل ساختاریافته)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    فرم ۱ ارزیابی تلفنی: سنجش انگیزه، آشنایی با پناپ، مهارت‌های کلیدی و شرایط حقوقی
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {onOpenPhoneForm && (
                    <button
                      onClick={() => onOpenPhoneForm(localCandidate, 'FILL')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      تکمیل فرم جامع مصاحبه تلفنی (مرکز ارزیابی)
                    </button>
                  )}
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                    امتیاز تلفنی: {localCandidate.phoneInterviewForm?.totalScore || (localCandidate.step4?.phoneTotalScore ? localCandidate.step4.phoneTotalScore * 2 : 8)} از ۱۰
                  </span>
                </div>
              </div>

              {/* Quick Callout for Form 1 */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {localCandidate.phoneInterviewForm ? 'فرم ۱ مصاحبه تلفنی تکمیل شده است' : 'فرم رسمی مصاحبه تلفنی پناپ آماده تکمیل است'}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      شامل ۱۰ بخش استاندارد، ۲۰ سوال تخصصی با اهداف ارزیابی، نقاط قوت و ضعف، امتیازدهی و تصمیم نهایی.
                    </p>
                  </div>
                </div>

                {onOpenPhoneForm && (
                  <button
                    onClick={() => onOpenPhoneForm(localCandidate, 'FILL')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {localCandidate.phoneInterviewForm ? 'مشاهده و ویرایش فرم ۱' : 'تکمیل فرم در مرکز مصاحبه'}
                  </button>
                )}
              </div>

              {/* 6 Structured Phone Interview Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ۱. معرفی کوتاه از سوابق کاری
                  </label>
                  <textarea
                    rows={2}
                    value={localCandidate.step4?.workHistorySummary || ''}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step4: { ...localCandidate.step4!, workHistorySummary: e.target.value }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    placeholder="خلاصه تجارب کلیدی و پروژه‌های قبلی..."
                    className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ۲. انگیزه همکاری با شرکت پناپ
                  </label>
                  <textarea
                    rows={2}
                    value={localCandidate.step4?.motivation || ''}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step4: { ...localCandidate.step4!, motivation: e.target.value }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    placeholder="چرا شرکت پناپ را انتخاب کرده است؟"
                    className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ۳. آشنایی با حوزه فعالیت شرکت پناپ
                  </label>
                  <textarea
                    rows={2}
                    value={localCandidate.step4?.companyKnowledge || ''}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step4: { ...localCandidate.step4!, companyKnowledge: e.target.value }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    placeholder="میزان شناخت کارجو از محصولات و ماموریت پناپ..."
                    className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ۴. مهارت‌های کلیدی مرتبط با سمت
                  </label>
                  <textarea
                    rows={2}
                    value={localCandidate.step4?.keyRoleSkills || ''}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step4: { ...localCandidate.step4!, keyRoleSkills: e.target.value }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    placeholder="تخصص‌های فنی و ابزارهای مسلط..."
                    className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ۵. وضعیت اشتغال فعلی
                  </label>
                  <select
                    value={localCandidate.step4?.currentEmploymentStatus || 'EMPLOYED'}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step4: { 
                          ...localCandidate.step4!, 
                          currentEmploymentStatus: e.target.value as any 
                        }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200"
                  >
                    <option value="EMPLOYED">شاغل در شرکت دیگر</option>
                    <option value="JOB_SEEKER">آماده به کار و بدون اشتغال</option>
                    <option value="PROJECT_BASED">فریلنسر / پروژه‌ای</option>
                    <option value="STUDENT">دانشجو / در حال تحصیل</option>
                  </select>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ۶. حقوق مورد انتظار و زمان شروع
                  </label>
                  <input
                    type="text"
                    value={localCandidate.step4?.expectedSalary || ''}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step4: { ...localCandidate.step4!, expectedSalary: e.target.value }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    placeholder="مثال: ۳۵ تا ۴۰ میلیون تومان - شروع ظرف ۲ هفته"
                    className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 WORKSPACE */}
          {selectedStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              {/* INTERVIEW SCHEDULER CARD AT THE TOP OF STEP 5 */}
              <InterviewSchedulerCard
                interviewType="IN_PERSON"
                currentDate={localCandidate.step5?.interviewDate}
                currentTime={localCandidate.step5?.interviewTime}
                scheduledAt={localCandidate.step5?.scheduledAt}
                scheduledBy={localCandidate.step5?.scheduledBy}
                notificationSent={localCandidate.step5?.notificationSent}
                onSaveSchedule={handleSaveInPersonInterviewSchedule}
                isFa={isFa}
              />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-600" />
                    گام پنجم: مصاحبه حضوری در مجتمع سرمد (سرمد ۳۰۷)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    فرم ۲ مصاحبه حضوری: مشخصات فردی، ماتریس مهارت‌ها، سوابق کاری ۳ ردیفه و معرفی ۲ معرف
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {onOpenInPersonForm && (
                    <button
                      onClick={() => onOpenInPersonForm(localCandidate, 'FILL')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      تکمیل فرم جامع مصاحبه حضوری (مرکز ارزیابی)
                    </button>
                  )}
                  <div className="text-left">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                      امتیاز ارزیاب: {localCandidate.inPersonInterviewForm?.interviewerRating || (localCandidate.step5?.totalScore ? (localCandidate.step5.totalScore / 7).toFixed(1) : 4)} از ۵
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Callout for Form 2 */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50/50 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {localCandidate.inPersonInterviewForm ? 'فرم ۲ مصاحبه حضوری تکمیل شده است' : 'فرم رسمی مصاحبه حضوری پناپ آماده تکمیل است'}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      شامل ۲ صفحه استاندارد، ماتریس ۱۰ مهارتی، ۳ سابقه کاری تفصیلی، پرسش‌های رفتاری و رضایت‌نامه استعلام.
                    </p>
                  </div>
                </div>

                {onOpenInPersonForm && (
                  <button
                    onClick={() => onOpenInPersonForm(localCandidate, 'FILL')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {localCandidate.inPersonInterviewForm ? 'مشاهده و ویرایش فرم ۲' : 'تکمیل فرم در مرکز مصاحبه'}
                  </button>
                )}
              </div>

              {/* Official Address Box */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    آدرس رسمی جهت ارسال به کارجو (مصاحبه حضوری):
                  </span>
                  <button
                    onClick={() => copyToClipboard(`خیابان سنایی-میدان صاحب الزمان- نبش سنایی7- ورودی شماره یک مجتمع سرمد- طبقه سوم- واحد 307
شرکت پناپ`, 'step5')}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {copiedText === 'step5' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText === 'step5' ? 'کپی شد!' : 'کپی آدرس مجتمع سرمد'}
                  </button>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-800 font-mono">
                  خیابان سنایی-میدان صاحب الزمان- نبش سنایی7- ورودی شماره یک مجتمع سرمد- طبقه سوم- واحد 307
                  شرکت پناپ
                </div>
              </div>

              {/* 7 Scoring Criteria (0 to 5) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-600" />
                  فرم ارزشیابی ۷ گانه مصاحبه حضوری (۰ تا ۵):
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {[
                    { key: 'educationAndExperience', label: '۱. سوابق تحصیلی و شغلی' },
                    { key: 'technicalCompetence', label: '۲. توان فنی و مهارتی' },
                    { key: 'jobMotivationAndStability', label: '۳. انگیزه و ثبات شغلی' },
                    { key: 'teamworkSpirit', label: '۴. روحیه کار تیمی' },
                    { key: 'culturalAlignment', label: '۵. انطباق فرهنگی با پناپ' },
                    { key: 'professionalAppearance', label: '۶. ظاهر و آداب حرفه‌ای' },
                    { key: 'problemSolvingSkill', label: '۷. مهارت حل مسئله' },
                  ].map((criterion) => {
                    const score = (localCandidate.step5?.scores as any)?.[criterion.key] ?? 4;
                    return (
                      <div key={criterion.key} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-700">{criterion.label}</span>
                          <span className="font-bold text-amber-600">{score} از ۵</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={5}
                          value={score}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const prevScores = localCandidate.step5?.scores || {
                              educationAndExperience: 4,
                              technicalCompetence: 4,
                              jobMotivationAndStability: 4,
                              teamworkSpirit: 4,
                              culturalAlignment: 4,
                              professionalAppearance: 4,
                              problemSolvingSkill: 4,
                            };
                            const newScores = { ...prevScores, [criterion.key]: val };
                            const sum = Object.values(newScores).reduce((a, b) => a + b, 0);
                            const percentage = Math.round((sum / 35) * 100);

                            const updated: Candidate = {
                              ...localCandidate,
                              step5: {
                                ...localCandidate.step5!,
                                scores: newScores,
                                totalScore: sum,
                                scorePercentage: percentage,
                              }
                            };
                            updateAndSaveCandidate(updated);
                          }}
                          className="w-full accent-amber-600"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">جمع‌بندی و نظر مدیران مصاحبه‌کننده:</label>
                  <textarea
                    rows={2}
                    value={localCandidate.step5?.interviewerFeedback || ''}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step5: {
                          ...localCandidate.step5!,
                          interviewerFeedback: e.target.value,
                        }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    placeholder="خلاصه نقاط قوت، موارد نیازمند بررسی و نتیجه‌گیری جلسه حضوری..."
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 WORKSPACE */}
          {selectedStep === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    گام ششم: استعلام و بررسی پیش‌زمینه (Background Check)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    بررسی معرفین، راستی‌آزمایی سوابق کاری و اخلاقی در محل‌های قبلی و رفع خلأهای احتمالی
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">وضعیت استعلام:</label>
                  <select
                    value={localCandidate.step6?.step6Status || 'APPROVED'}
                    onChange={(e) => {
                      const val = e.target.value as 'APPROVED' | 'PENDING' | 'REJECTED' | 'WITHDRAWN';
                      const updated: Candidate = {
                        ...localCandidate,
                        step6: {
                          ...(localCandidate.step6 || {
                            references: [],
                            step6Status: 'APPROVED'
                          }),
                          step6Status: val,
                        }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    className={`text-xs px-2.5 py-1.5 rounded-xl font-bold border focus:ring-2 ${
                      (localCandidate.step6?.step6Status || 'APPROVED') === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 focus:ring-emerald-500'
                        : (localCandidate.step6?.step6Status || 'APPROVED') === 'PENDING'
                        ? 'bg-amber-50 text-amber-700 border-amber-300 focus:ring-amber-500'
                        : 'bg-rose-50 text-rose-700 border-rose-300 focus:ring-rose-500'
                    }`}
                  >
                    <option value="APPROVED">✓ استعلام کامل و تأیید شد</option>
                    <option value="PENDING">⏳ در حال پیگیری و استعلام</option>
                    <option value="REJECTED">✕ استعلام ناموفق / رد صلاحیت</option>
                    <option value="WITHDRAWN">🚫 انصراف کارجو در این مرحله</option>
                  </select>
                </div>
              </div>

              {/* Reference Contacts Editable List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    لیست معرفین و ثبت نتایج استعلام:
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddReference}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن معرف جدید</span>
                  </button>
                </div>

                {(!localCandidate.step6?.references || localCandidate.step6.references.length === 0) ? (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
                    <p className="text-xs text-slate-500">هیچ معرف یا تماسی هنوز ثبت نشده است.</p>
                    <button
                      type="button"
                      onClick={handleAddReference}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      ثبت اولین معرف
                    </button>
                  </div>
                ) : (
                  localCandidate.step6.references.map((ref, idx) => (
                    <div key={ref.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {ref.contactName || `معرف شماره ${idx + 1}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ref.isVerified}
                              onChange={(e) => handleUpdateReference(idx, 'isVerified', e.target.checked)}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="font-semibold">استعلام انجام و تأیید شد</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleDeleteReference(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف این معرف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inputs grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                        <div>
                          <label className="text-[11px] text-slate-600 font-semibold block mb-1">نام معرف:</label>
                          <input
                            type="text"
                            value={ref.contactName}
                            onChange={(e) => handleUpdateReference(idx, 'contactName', e.target.value)}
                            placeholder="نام و نام خانوادگی..."
                            className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 font-semibold block mb-1">شرکت / سازمان:</label>
                          <input
                            type="text"
                            value={ref.companyName}
                            onChange={(e) => handleUpdateReference(idx, 'companyName', e.target.value)}
                            placeholder="نام شرکت قبلی..."
                            className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 font-semibold block mb-1">سمت / نسبت کاری:</label>
                          <input
                            type="text"
                            value={ref.roleOrRelation}
                            onChange={(e) => handleUpdateReference(idx, 'roleOrRelation', e.target.value)}
                            placeholder="مدیر مستقیم، همکار..."
                            className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 font-semibold block mb-1">شماره تماس:</label>
                          <input
                            type="text"
                            value={ref.phone}
                            onChange={(e) => handleUpdateReference(idx, 'phone', e.target.value)}
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            dir="ltr"
                            className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-mono text-right"
                          />
                        </div>
                      </div>

                      {/* Rating and Feedback */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700">امتیاز صلاحیت اخلاقی و کاری:</span>
                            <span className="text-emerald-600 font-bold">{ref.ethicalAndWorkRating || 5} از ۵</span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={5}
                            value={ref.ethicalAndWorkRating || 5}
                            onChange={(e) => handleUpdateReference(idx, 'ethicalAndWorkRating', Number(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-[11px] text-slate-600 font-semibold block mb-1">خلاصه اظهارات و بازخورد معرف:</label>
                          <textarea
                            rows={2}
                            value={ref.feedbackSummary}
                            onChange={(e) => handleUpdateReference(idx, 'feedbackSummary', e.target.value)}
                            placeholder="نظرات معرف در خصوص تعهد، تخصص، دلایل خروج و ویژگی‌های اخلاقی..."
                            className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* HR Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    یادداشت‌های بررسی مستقیم منابع انسانی (HR Background Report):
                  </label>
                  <textarea
                    rows={2}
                    value={localCandidate.step6?.hrDirectCheckNotes || ''}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step6: { 
                          ...(localCandidate.step6 || {
                            references: [],
                            step6Status: 'APPROVED'
                          }),
                          hrDirectCheckNotes: e.target.value 
                        }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    placeholder="انطباق مدارک، بیمه، سوءپیشینه و استعلامات تخصصی..."
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    بررسی سوابق شغلی و اخلاقی از محل‌های قبلی:
                  </label>
                  <textarea
                    rows={2}
                    value={localCandidate.step6?.previousWorkplaceCheckNotes || ''}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step6: { 
                          ...(localCandidate.step6 || {
                            references: [],
                            step6Status: 'APPROVED'
                          }),
                          previousWorkplaceCheckNotes: e.target.value 
                        }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    placeholder="استعلامات تکمیلی از مدیران و کارفرمایان سابق..."
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7 WORKSPACE */}
          {selectedStep === 7 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    گام هفتم: تصمیم نهایی کمیته، پیشنهاد کار و امضای قرارداد
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    جمع‌بندی امتیازات، تصویب در کمیته جذب پناپ، صدور پیشنهاد و ثبت در سامانه منابع انسانی
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${
                  isHired 
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {isHired ? '✓ استخدام قطعی در پناپ' : 'آماده صدور آفر و قرارداد'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    تصمیم کمیته جذب و استخدام پناپ:
                  </label>
                  <select
                    value={localCandidate.step7?.committeeDecision || 'APPROVED'}
                    onChange={(e) => {
                      const updated: Candidate = {
                        ...localCandidate,
                        step7: {
                          ...localCandidate.step7!,
                          committeeDecision: e.target.value as any,
                        }
                      };
                      updateAndSaveCandidate(updated);
                    }}
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200"
                  >
                    <option value="APPROVED">تأیید استخدام و صدور پیشنهاد شغلی (Offer)</option>
                    <option value="TALENT_POOL">ذخیره در بانک استعدادها برای فرصت‌های آتی</option>
                    <option value="REJECTED">عدم تصویب نهایی در کمیته جذب</option>
                    <option value="PENDING">در حال بررسی در جلسه کمیته</option>
                  </select>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 block">حقوق مصوب پیشنهادی:</label>
                    <input
                      type="text"
                      value={localCandidate.step7?.offeredSalary || localCandidate.salaryExpectation || ''}
                      onChange={(e) => {
                        const updated: Candidate = {
                          ...localCandidate,
                          step7: { ...localCandidate.step7!, offeredSalary: e.target.value }
                        };
                        updateAndSaveCandidate(updated);
                      }}
                      placeholder="مثال: ۳۸,۰۰۰,۰۰۰ تومان + پاداش عملکردی"
                      className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    وضعیت قرارداد و ثبت سیستم:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localCandidate.step7?.hrSystemRegistration ?? false}
                        onChange={(e) => {
                          const updated: Candidate = {
                            ...localCandidate,
                            step7: {
                              ...localCandidate.step7!,
                              hrSystemRegistration: e.target.checked,
                            }
                          };
                          updateAndSaveCandidate(updated);
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>ثبت پرونده در سامانه منابع انسانی پناپ انجام شد</span>
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 block">ملاحظات و بندهای ویژه قرارداد:</label>
                    <textarea
                      rows={2}
                      value={localCandidate.step7?.committeeNotes || ''}
                      onChange={(e) => {
                        const updated: Candidate = {
                          ...localCandidate,
                          step7: { ...localCandidate.step7!, committeeNotes: e.target.value }
                        };
                        updateAndSaveCandidate(updated);
                      }}
                      placeholder="دوره آزمایشی ۳ ماهه، بیمه تکمیلی، تعهدات آموزشی و..."
                      className="w-full p-2 text-xs bg-white rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step Remarks and General Dossier Notes */}
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>توضیحات و ملاحظات گام {selectedStep} ({stepsConfig.find(s => s.stepNumber === selectedStep)?.shortTitle}):</span>
              </label>
              <textarea
                rows={2}
                value={localCandidate.stepNotes?.[selectedStep] || ''}
                onChange={(e) => {
                  const updated: Candidate = {
                    ...localCandidate,
                    stepNotes: {
                      ...(localCandidate.stepNotes || {}),
                      [selectedStep]: e.target.value,
                    },
                  };
                  updateAndSaveCandidate(updated);
                }}
                placeholder={`یادداشت یا نکته ارزیاب برای گام ${selectedStep}...`}
                className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                توضیحات و ملاحظات کلی پرونده:
              </label>
              <textarea
                rows={2}
                value={localCandidate.generalNotes || ''}
                onChange={(e) => {
                  const updated: Candidate = {
                    ...localCandidate,
                    generalNotes: e.target.value,
                  };
                  updateAndSaveCandidate(updated);
                }}
                placeholder="توضیحات کلی راجع به متقاضی، وضعیت هماهنگی، بازخورد تیم..."
                className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

        </div>
        )}

        {/* Action Controls & Progression Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap">
          {activeViewMode === 'HISTORY' ? (
            <div className="flex items-center justify-between w-full flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>
                  {isFa 
                    ? `گاه‌شمار کلیه وقایع و اقدامات ثبت‌شده برای این کارجو (${timelineEventsCount} رویداد)` 
                    : `Full chronological recruitment events and status transitions (${timelineEventsCount} events)`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-history-return-to-step"
                  onClick={() => {
                    setSelectedStep(currentStep);
                    setActiveViewMode('STEPS');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>{isFa ? `مشاهده گام‌های استخدامی (گام ${currentStep}: ${stepsConfig[currentStep - 1]?.shortTitle})` : `Return to Steps (Step ${currentStep})`}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Reject or Reactivate Buttons */}
              <div className="flex items-center gap-2">
                {isRejected || isWithdrawn ? (
                  <button
                    onClick={handleReactivateCandidate}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    بازگردانی و فعال‌سازی مجدد پرونده در گام {currentStep}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      رد کارجو در گام {currentStep}
                    </button>
                    <button
                      onClick={handleWithdrawCandidate}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      ثبت انصراف کارجو
                    </button>
                  </>
                )}
              </div>

              {/* Advance Step / Next Step CTA */}
              <div className="flex items-center gap-3">
                {selectedStep > 1 && (
                  <button
                    onClick={() => setSelectedStep((prev) => (prev - 1) as RecruitmentStepNumber)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                    گام قبلی
                  </button>
                )}

                {selectedStep < 7 && (
                  <button
                    onClick={() => setSelectedStep((prev) => (prev + 1) as RecruitmentStepNumber)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    گام بعدی
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {!isRejected && !isWithdrawn && (
                  <>
                    {currentStep < 7 && (
                      <button
                        type="button"
                        onClick={handleSkipCurrentStep}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title={`پرش از گام ${currentStep} بدون الزام تکمیل اطلاعات و ورود مستقیم به گام ${currentStep + 1}`}
                      >
                        <FastForward className="w-4 h-4" />
                        <span>پرش از این گام (Skip)</span>
                      </button>
                    )}

                    <button
                      onClick={handleAdvanceToNextStep}
                      className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                        currentStep >= 7
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                          : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {currentStep >= 7
                          ? 'تأیید نهایی و ثبت استخدام قطعی'
                          : `تأیید و ارتقا به گام ${currentStep + 1} (${stepsConfig[currentStep]?.shortTitle})`}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Reject Reason Confirmation Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">ثبت رد متقاضی در گام {currentStep}</h4>
                  <p className="text-xs text-slate-500">لطفاً علت رد یا عدم تطابق شرایط را ثبت کنید.</p>
                </div>
              </div>

              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="مثال: عدم ارائه ویدیو در مهلت مقرر، عدم تسلط فنی کافی در مصاحبه، عدم توافق مالی..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  انصراف
                </button>
                <button
                  onClick={handleRejectCandidate}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
                >
                  تأیید و خروج از فرآیند
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        {isPlayingVideo && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-5 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      پخش ویدیوی معرفی متقاضی ({localCandidate?.name})
                    </h4>
                    <p className="text-xs text-slate-500">
                      {localCandidate?.step3?.videoFileName || 'فایل ویدیوی متقاضی'}
                      {localCandidate?.step3?.videoSubmissionPlatform && ` • ارسالی از: ${localCandidate.step3.videoSubmissionPlatform}`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                {localCandidate?.step3?.videoUrlOrFile ? (
                  <video
                    src={localCandidate.step3.videoUrlOrFile}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    مرورگر شما از تگ پخش ویدیو پشتیبانی نمی‌کند.
                  </video>
                ) : (
                  <div className="text-center text-slate-400 text-xs p-6 space-y-2">
                    <FileVideo className="w-8 h-8 mx-auto opacity-50" />
                    <p>آدرس یا فایل ویدیو در دسترس نیست.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  مدت زمان ویدیو: {localCandidate?.step3?.videoDurationMinutes || 2} دقیقه
                </span>
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  بستن پنجره پخش
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">حذف پرونده کارجو</h4>
                  <p className="text-xs text-slate-500">آیا از حذف دائم این متقاضی اطمینان دارید؟</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  انصراف
                </button>
                <button
                  onClick={() => {
                    if (onDeleteCandidate && localCandidate) {
                      onDeleteCandidate(localCandidate.id);
                      setShowDeleteConfirm(false);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  حذف دائم
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
