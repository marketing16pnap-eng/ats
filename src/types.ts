export type CandidateStatus =
  | 'STAGE_1_APPLIED'
  | 'STAGE_2_SITE_FORM'
  | 'STAGE_3_VIDEO'
  | 'STAGE_4_PHONE_INTERVIEW'
  | 'STAGE_5_IN_PERSON'
  | 'STAGE_6_BACKGROUND_CHECK'
  | 'STAGE_7_FINAL_DECISION'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'CANCELLED'
  // Legacy aliases for backward compatibility
  | 'APPLIED'
  | 'SCREENING'
  | 'TECH_INTERVIEW'
  | 'HR_INTERVIEW'
  | 'OFFER_SENT';

export type RecruitmentStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface RecruitmentStepDefinition {
  stepNumber: RecruitmentStepNumber;
  titleFa: string;
  shortTitle: string;
  status: CandidateStatus;
  descFa: string;
}

export const RECRUITMENT_STEPS: RecruitmentStepDefinition[] = [
  {
    stepNumber: 1,
    titleFa: 'ثبت اطلاعات اولیه متقاضی در پلتفرم های کاریابی',
    shortTitle: 'ثبت در پلتفرم‌ها',
    status: 'STAGE_1_APPLIED',
    descFa: 'اطلاعات اولیه متقاضی و بررسی رزومه دریافتی',
  },
  {
    stepNumber: 2,
    titleFa: 'تکمیل فرم درخواست همکاری در سایت پناپ',
    shortTitle: 'تکمیل فرم سایت پناپ',
    status: 'STAGE_2_SITE_FORM',
    descFa: 'ارسال پیام و پیگیری تکمیل فرم درخواست همکاری',
  },
  {
    stepNumber: 3,
    titleFa: 'ارسال ویدیو رسمی',
    shortTitle: 'ارسال ویدیو رسمی',
    status: 'STAGE_3_VIDEO',
    descFa: 'ارزیابی ویدیوی معرفی رسمی و مهارت‌های ارتباطی',
  },
  {
    stepNumber: 4,
    titleFa: 'مصاحبه تلفنی',
    shortTitle: 'مصاحبه تلفنی',
    status: 'STAGE_4_PHONE_INTERVIEW',
    descFa: 'سنجش انگیزه، سوابق و فرم شماره ۱ مصاحبه تلفنی',
  },
  {
    stepNumber: 5,
    titleFa: 'مصاحبه حضوری',
    shortTitle: 'مصاحبه حضوری',
    status: 'STAGE_5_IN_PERSON',
    descFa: 'مصاحبه تخصصی و مهارتی در مجتمع سرمد و فرم شماره ۲',
  },
  {
    stepNumber: 6,
    titleFa: 'استعلام و بررسی پیشزمینه',
    shortTitle: 'استعلام و بررسی پیشزمینه',
    status: 'STAGE_6_BACKGROUND_CHECK',
    descFa: 'استعلام از معرفین، اصالت مدارک و سوابق کاری قبلی',
  },
  {
    stepNumber: 7,
    titleFa: 'تصمیم نهایی و شروع همکاری',
    shortTitle: 'تصمیم نهایی و شروع همکاری',
    status: 'STAGE_7_FINAL_DECISION',
    descFa: 'تصویب در کمیته جذب، عقد قرارداد و آغاز همکاری رسمی',
  },
];

export type MilitaryStatus = 
  | 'COMPLETED' // کارت پایان خدمت
  | 'PERMANENT_EXEMPT' // معافیت دائم
  | 'EDUCATIONAL_EXEMPT' // معافیت تحصیلی
  | 'SUBJECT' // مشمول
  | 'NOT_APPLICABLE'; // عدم نیاز (خانم‌ها)

export type JobPlatformSource =
  | 'سایت پناپ'
  | 'ای-استخدام (e-estekhdam)'
  | 'جابینجا (Jobinja)'
  | 'جاب ویژن (JobVision)'
  | 'لینکدین (LinkedIn)'
  | 'ایران تلنت (IranTalent)'
  | 'کوئرا (Quera)'
  | 'معرفی همکاران'
  | 'سایر';

// -------------------------------------------------------------
// Step 1: مشخصات کلی متقاضی در پلتفرم‌های کاریابی
// -------------------------------------------------------------
export interface Step1Data {
  name: string;
  nationalId: string;
  phone: string;
  email?: string;
  requestedRole: string;
  department: string;
  militaryStatus: MilitaryStatus;
  militaryStatusFa?: string;
  source: JobPlatformSource | string;
  initialResumeStatus: 'PENDING' | 'APPROVED' | 'REJECTED'; // تأیید یا رد رزومه اولیه
  rejectionReason?: string;
  submissionDate: string;
  evaluatorName?: string;
  notes?: string;
}

// -------------------------------------------------------------
// Step 2: تکمیل فرم درخواست همکاری در سایت پناپ
// -------------------------------------------------------------
export interface Step2Data {
  siteMessageSentDate?: string;
  siteMessageStatus?: 'SENT' | 'DELIVERED' | 'READ' | 'PENDING' | 'FAILED'; // وضعیت دریافت پیام
  isSiteCompleted: 'COMPLETED' | 'INCOMPLETE' | 'PENDING' | 'NOT_COMPLETED'; // تکمیل یا عدم تکمیل فرم
  daysElapsed?: number; // طی ۳ روز کاری
  siteIncompletionReason?: string; // دلایل احتمالی عدم تکمیل یا رد اطلاعات
  step2Status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  approvalDate?: string;
  evaluatorNotes?: string;
}

// -------------------------------------------------------------
// Step 3: ارسال ویدیو رسمی
// -------------------------------------------------------------
export type VideoPlatform = 
  | 'BALE' 
  | 'EITAA' 
  | 'RUBIKA' 
  | 'TELEGRAM' 
  | 'WHATSAPP' 
  | 'SYSTEM_UPLOAD' 
  | 'EMAIL' 
  | 'OTHER';

export interface Step3Data {
  videoMessageSentDate?: string;
  eitaaMessageSentDate?: string;
  videoSubmissionStatus: 'RECEIVED' | 'PENDING' | 'NOT_SENT' | 'EXPIRED' | 'WAIVED'; // وضعیت دریافت ویدیو
  videoReceivedDate?: string;
  videoDurationMinutes?: number; // ۱ تا ۳ دقیقه
  communicationSkillScore?: number; // مهارت‌های ارتباطی (۰ تا ۵)
  verbalFluencyScore?: number; // تسلط کلامی (۰ تا ۵)
  professionalAppearanceScore?: number; // ظاهر و رفتار حرفه‌ای (۰ تا ۵)
  totalVideoScore?: number; // میانگین یا مجموع
  evaluatorNotes?: string;
  rejectionReason?: string; // در صورت عدم ارسال یا عدم تایید
  step3Status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';

  // مشخصات زمان و محل ارسال ویدیو (بله، ایتا، روبیکا، تلگرام و...)
  videoSubmissionPlatform?: VideoPlatform | string;
  videoSubmissionPlatformOther?: string; // در صورت انتخاب سایر شبکه‌ها
  videoSubmissionDate?: string; // تاریخ ارسال ویدیو (مثال: ۱۴۰۳/۰۶/۱۵)
  videoSubmissionTime?: string; // ساعت ارسال ویدیو (مثال: ۱۴:۳۰)
  videoSenderAccount?: string; // شناسه/شماره ارسال‌کننده در پیام‌رسان
  videoUrlOrFile?: string; // لینک یا آدرس داده ویدیو
  videoFileName?: string; // نام فایل بارگذاری‌شده
}

// -------------------------------------------------------------
// Step 4: مصاحبه تلفنی
// -------------------------------------------------------------
export interface Step4Data {
  phoneInterviewDate?: string;
  phoneInterviewTime?: string;
  scheduledAt?: string; // تاریخ و زمان هماهنگ‌سازی مصاحبه
  scheduledBy?: string; // کاربر ثبت‌کننده مصاحبه
  notificationSent?: boolean; // ثبت وضعیت ارسال اعلان به کاربر
  interviewStatus?: 'SCHEDULED' | 'CONFIRMED' | 'DONE' | 'CANCELLED';
  interviewerName?: string;
  workHistorySummary?: string; // معرفی کوتاه از سوابق کاری
  motivation?: string; // انگیزه همکاری با شرکت پناپ
  companyKnowledge?: string; // آشنایی با حوزه فعالیت شرکت پناپ
  keyRoleSkills?: string; // مهارت‌های کلیدی مرتبط با سمت مورد نظر
  currentEmploymentStatus?: 'EMPLOYED' | 'JOB_SEEKER' | 'PROJECT_BASED' | 'STUDENT'; // وضعیت اشتغال فعلی
  expectedSalary?: string; // حقوق مورد انتظار
  startCondition?: string; // شرایط و زمان آمادگی شروع به کار
  phoneTotalScore?: number; // امتیازدهی کلی (۱ تا ۵)
  rejectionReason?: string;
  step4Status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
}

// -------------------------------------------------------------
// Step 5: مصاحبه حضوری در مجتمع سرمد
// -------------------------------------------------------------
export interface Step5InPersonScores {
  educationAndExperience: number; // سوابق تحصیلی و شغلی (۰ تا ۵)
  technicalCompetence: number; // توان فنی و مهارتی (۰ تا ۵)
  jobMotivationAndStability: number; // انگیزه و ثبات شغلی (۰ تا ۵)
  teamworkSpirit: number; // روحیه کار تیمی (۰ تا ۵)
  culturalAlignment: number; // انطباق فرهنگی با پناپ (۰ تا ۵)
  professionalAppearance: number; // ظاهر و آداب حرفه‌ای (۰ تا ۵)
  problemSolvingSkill: number; // مهارت حل مسئله (۰ تا ۵)
}

export interface Step5Data {
  interviewDate?: string;
  interviewTime?: string;
  scheduledAt?: string; // تاریخ و زمان هماهنگ‌سازی جلسه حضوری
  scheduledBy?: string; // کاربر ثبت‌کننده جلسه حضوری
  notificationSent?: boolean; // ارسال اعلان به کاربر
  interviewStatus?: 'SCHEDULED' | 'CONFIRMED' | 'DONE' | 'CANCELLED';
  location: string; // خیابان سنایی-میدان صاحب الزمان- نبش سنایی7- ورودی شماره یک مجتمع سرمد- طبقه سوم- واحد 307
  departmentManagerName?: string; // مدیر واحد مربوطه
  hrManagerName?: string; // مدیر منابع انسانی
  scores: Step5InPersonScores;
  totalScore: number; // از ۳۵ نمره
  scorePercentage: number; // درصد تطابق
  interviewerFeedback?: string;
  rejectionReason?: string;
  step5Status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
}

// -------------------------------------------------------------
// Step 6: استعلام و بررسی پیش‌زمینه (Background Check)
// -------------------------------------------------------------
export interface ReferenceContact {
  id: string;
  contactName: string;
  companyName: string;
  roleOrRelation: string;
  phone: string;
  feedbackSummary: string;
  ethicalAndWorkRating: number; // ۱ تا ۵
  isVerified: boolean;
}

export interface Step6Data {
  references: ReferenceContact[];
  previousWorkplaceCheckNotes?: string; // بررسی سوابق شغلی و اخلاقی از محل‌های قبلی
  hrDirectCheckNotes?: string; // بررسی مستقیم توسط منابع انسانی برای پر کردن خلاهای اطلاعاتی
  step6Status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  rejectionReason?: string;
}

// -------------------------------------------------------------
// Step 7: تصمیم نهایی و شروع همکاری
// -------------------------------------------------------------
export interface Step7Data {
  committeeDecision: 'APPROVED' | 'REJECTED' | 'TALENT_POOL' | 'PENDING'; // تصویب در کمیته جذب
  committeeNotes?: string;
  aggregatedTotalScore?: number;
  officialOfferDate?: string; // اعلام پیشنهاد همکاری رسمی
  offeredSalary?: string;
  contractSignedDate?: string; // امضای قرارداد استخدام
  employmentStartDate?: string; // تاریخ رسمی شروع به کار
  hrSystemRegistration: boolean; // ثبت در سیستم منابع انسانی
  step7Status: 'PENDING' | 'OFFER_EXTENDED' | 'HIRED' | 'OFFER_REJECTED' | 'WITHDRAWN';
  cancellationReason?: string;
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export type TimelineEventType = 
  | 'APPLIED'
  | 'STEP_CHANGE'
  | 'STATUS_CHANGE'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'SCORE_RECORDED'
  | 'DOCUMENT_UPLOADED'
  | 'NOTE_ADDED'
  | 'STEP_SKIPPED'
  | 'REJECTION'
  | 'HIRED'
  | 'REACTIVATED'
  | 'SYSTEM_EVENT';

export interface CandidateTimelineEvent {
  id: string;
  timestamp: string; // e.g. "1403/06/24 - 10:30"
  date: string; // e.g. "1403/06/24"
  time?: string; // e.g. "10:30"
  title: string;
  titleEn?: string;
  description?: string;
  stepNumber?: RecruitmentStepNumber;
  type: TimelineEventType;
  actor?: string; // e.g. "کارشناس جذب", "سیستم پناپ", "کارجو"
  details?: Record<string, any>;
}

export interface CandidatePreviousApplication {
  id: string;
  jobTitle: string;
  department?: string;
  appliedDate: string; // e.g. "۱۴۰۲/۰۸/۱۴"
  status: string; // e.g. "رد شده در مصاحبه تلفنی", "انصراف کارجو", "استخدام قبلی", "در حال بررسی"
  stepReached?: number;
  stepName?: string;
  source?: string;
  notes?: string;
  rejectionReason?: string;
  matchScore?: number;
  rating?: number;
  salaryExpectation?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  appliedDate: string;
  experienceYears: number;
  currentCompany: string;
  location: string;
  status: CandidateStatus;
  currentStep: RecruitmentStepNumber; // 1 to 7
  matchScore: number;
  rating: number;
  skills: string[];
  education: string;
  salaryExpectation: string;
  summary: string;
  militaryStatus?: MilitaryStatus;
  militaryStatusFa?: string;
  gender?: string;
  nationalId?: string;
  source?: string;
  trackingCode?: string;
  assignee?: string;
  rejectionReason?: string;
  rejectionStep?: RecruitmentStepNumber;
  isBookmarked?: boolean;
  notes?: string[];
  experiences?: Experience[];
  interviewRounds?: InterviewRound[];

  // 7 Detailed Process Steps
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
  step4?: Step4Data;
  step5?: Step5Data;
  step6?: Step6Data;
  step7?: Step7Data;

  // Step-specific comments & General applicant notes
  stepNotes?: {
    1?: string;
    2?: string;
    3?: string;
    4?: string;
    5?: string;
    6?: string;
    7?: string;
    [key: number]: string | undefined;
  };
  generalNotes?: string;
  skippedSteps?: RecruitmentStepNumber[];
  history?: CandidateTimelineEvent[];
  previousApplications?: CandidatePreviousApplication[];

  // Dedicated Official PNAP Assessment Forms (Forms 1 & 2)
  phoneInterviewForm?: PhoneInterviewFormData;
  inPersonInterviewForm?: InPersonInterviewFormData;

  // Legacy/Compatibility fields
  rowNumber?: number;
  resumeSubmissionDate?: string;
  siteMessageDate?: string;
  timePassed?: string;
  isMessageReceived?: string;
  isSiteCompleted?: string;
  siteIncompletionReason?: string;
  isResumeApproved?: string;
  jobPriorityScore?: number;
  siteCompletionScore?: number;
  remarks?: string;
  currentStageFa?: string;
  requestedSalary?: string;
}

export type RequisitionStatus = 'ACTIVE' | 'PAUSED' | 'CLOSED';
export type InterviewStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Recommendation =
  | 'STRONG_HIRE'
  | 'HIRE'
  | 'LEANING_HIRE'
  | 'NEUTRAL'
  | 'LEANING_NO'
  | 'STRONG_NO';

export interface Scorecard {
  technicalScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  cultureAddScore: number;
  recommendation: Recommendation;
  feedback: string;
  interviewerName: string;
}

export interface InterviewRound {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  stageName: string;
  stageConfigId?: string;
  interviewType?: InterviewType;
  interviewers: string[];
  dateTime: string;
  timeOnly: string;
  durationMinutes: number;
  meetUrl: string;
  isCompleted: boolean;
  status?: InterviewStatus;
  scorecard?: Scorecard;
  date?: string;
  notes?: string;
}

export type InterviewType =
  | 'TECHNICAL'
  | 'HR_BEHAVIORAL'
  | 'EXECUTIVE'
  | 'LIVE_CODING'
  | 'CASE_STUDY'
  | 'CULTURE_FIT'
  | 'INITIAL_SCREENING'
  | 'FINAL_OFFER';

export interface InterviewStageConfig {
  id: string;
  title: string;
  titleEn: string;
  type: InterviewType;
  defaultDurationMinutes: number;
  description: string;
  evaluatorsHint?: string;
  color: string;
  createdAt: string;
}

export interface JobRequisition {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  openPositions: number;
  filledPositions: number;
  status: RequisitionStatus;
  priority: Priority;
  budgetRange: string;
  applicantsCount: number;
  postedDate: string;
  hiringManager: string;
  description: string;
  requiredSkills: string[];
}

export interface FunnelStage {
  stepNumber: RecruitmentStepNumber;
  nameFa: string;
  nameEn: string;
  label: string;
  descriptionFa: string;
  count: number;
  percentage: number;
  color: string;
}

export interface MetricCardData {
  id: string;
  titleFa: string;
  titleEn: string;
  value: string;
  changeFa: string;
  changeEn: string;
  isPositive: boolean;
  sparkline: number[];
}

export type AppLanguage = 'PERSIAN' | 'ENGLISH';

export type NavigationTab =
  | 'DASHBOARD'
  | 'CANDIDATES'
  | 'REQUISITIONS'
  | 'DEPARTMENTS'
  | 'INTERVIEWS'
  | 'ANALYTICS'
  | 'EXPORTS'
  | 'USERS'
  | 'SETTINGS';

export interface Department {
  id: string;
  name: string;
  nameEn: string;
  code?: string;
  headOfDepartment: string;
  headEmail?: string;
  description: string;
  budgetTotal?: string;
  budgetAnnual?: string;
  openPositionsCount?: number;
  activeEmployeesCount?: number;
  headcount?: number;
  location?: string;
  costCenter?: string;
  color: string;
  iconName?: string;
  createdAt: string;
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'TALENT_DIRECTOR'
  | 'TECH_LEAD'
  | 'HR_RECRUITER'
  | 'EXECUTIVE_AUDITOR';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'ON_LEAVE';

export type PermissionKey =
  | 'VIEW_DASHBOARD'
  | 'MANAGE_CANDIDATES'
  | 'DELETE_CANDIDATES'
  | 'MANAGE_REQUISITIONS'
  | 'SCHEDULE_INTERVIEWS'
  | 'SUBMIT_SCORECARDS'
  | 'ISSUE_OFFER_LETTER'
  | 'VIEW_ANALYTICS'
  | 'MANAGE_USERS'
  | 'MANAGE_SYSTEM_SETTINGS';

export interface AppUser {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  username: string;
  role: UserRole;
  roleTitleFa: string;
  roleTitleEn: string;
  department: string;
  departmentEn: string;
  avatarUrl: string;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
  phone: string;
  personnelCode: string;
  permissions: PermissionKey[];
}

export interface AuthSession {
  user: AppUser;
  token: string;
  loginTimestamp: number;
  lastActivityTimestamp: number;
  expiresAt: number;
  rememberMe: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  actionEn: string;
  target: string;
  ipAddress: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface AppNotification {
  id: string;
  type: 'INTERVIEW_PHONE' | 'INTERVIEW_IN_PERSON' | 'SYSTEM' | 'SECURITY';
  title: string;
  titleEn?: string;
  message: string;
  messageEn?: string;
  candidateId?: string;
  candidateName?: string;
  candidateRole?: string;
  interviewDate?: string;
  interviewTime?: string;
  scheduledAt?: string;
  scheduledBy?: string;
  isRead: boolean;
  createdAt: string;
}

// =============================================================
// فرم ۱: مصاحبه تلفنی پناپ (Phone Interview Form)
// =============================================================

export interface FormQuestionItem {
  id: string;
  questionNumber: number;
  questionText: string;
  goalDescription: string;
  answerType?: 'text' | 'textarea' | 'score_1_5' | 'score_1_10' | 'select' | 'boolean';
  options?: string[];
  isRequired?: boolean;
}

export interface FormSectionItem {
  id: string;
  sectionNumber: number;
  sectionTitle: string;
  questions: FormQuestionItem[];
}

export interface PhoneInterviewFormTemplate {
  id: string;
  formTitle: string;
  formSubtitle: string;
  instructionText: string;
  sections: FormSectionItem[];
  scoringConfig: {
    maxScore: number;
    showStrengths: boolean;
    showWeaknesses: boolean;
    showOverallEvaluation: boolean;
    recommendationOptions: { value: string; label: string; color: string }[];
  };
}

export interface PhoneInterviewFormData {
  candidateId: string;
  candidateName: string;
  phone: string;
  role: string;
  interviewerName: string;
  interviewerRole: string;
  interviewDate: string;
  answers: Record<string, string>; // question id or questionNumber -> answer text
  totalScore: number; // 1 to 10
  strengths: string;
  weaknesses: string;
  overallEvaluation: string;
  recommendation: 'INVITE_IN_PERSON' | 'REQUEST_MORE_INFO' | 'REJECT';
  updatedAt: string;
}

// =============================================================
// فرم ۲: مصاحبه حضوری پناپ (In-Person Interview Form)
// =============================================================

export interface InPersonWorkHistoryItem {
  id: string;
  role: string;
  companyName: string;
  contactPersonName: string;
  contactPersonRole: string;
  contactPersonPhone: string;
  fromDate: string;
  toDate: string;
  reasonForLeaving: string;
}

export interface InPersonReferenceItem {
  id: string;
  fullName: string;
  job: string;
  phone: string;
  acquaintanceDuration: string;
}

export interface InPersonSkillsRating {
  english: number; // 1 to 10
  word: number;
  excel: number;
  access: number;
  internet: number;
  digitalMarketing: number;
  fastTyping: number;
  accountingBasics: number;
  officeCorrespondence: number;
  otherSkillName?: string;
  otherSkillScore?: number;
}

export interface InPersonInterviewFormData {
  candidateId: string;
  formDate: string;
  interviewDate: string;
  
  // ۱. مشخصات فردی
  fullName: string;
  requestedRole: string;
  birthDate: string;
  personalityType: string;
  bloodGroup: string;
  phone: string;
  maritalStatus: 'SINGLE' | 'MARRIED' | 'MARRIED_WITH_CHILDREN';
  marriagePlanIn3Years?: 'YES' | 'NO';
  militaryStatus: 'COMPLETED' | 'TEMPORARY_EXEMPT' | 'MEDICAL_EXEMPT' | 'NON_MEDICAL_EXEMPT' | 'NOT_APPLICABLE';
  email: string;
  address: string;
  sourceWebsite: string;
  religion: string;
  sect: string;

  // ۲. سوابق تحصیلی
  lastDegree: string;
  gpa: string;
  majorAndUniversity: string;

  // ۳. مهارت‌ها (۱ تا ۱۰)
  skillsRating: InPersonSkillsRating;

  // ۴. سوابق کاری (۳ ردیف)
  workHistories: InPersonWorkHistoryItem[];

  // ۵. توضیحات و پرسش‌ها
  isCurrentlyEmployed: 'YES' | 'NO';
  isStudent: 'YES' | 'NO';
  otherWorkTypes: string[]; // دورکاری، انجام مأموریت، همکاری در فضای مجازی، امور اداری، هرکاری در توان
  personalInterests: string;
  moralStrengths: string;
  areasOfImprovement: string;
  whyPnap: string;
  whyShouldWeHireYou: string;
  fiveYearsVisionInPnap: string;
  bestWorkDayDescription: string;
  worstWorkDayDescription: string;
  challengesAndOvercoming: string;
  lastBookRead: string;
  tenMinutesLateReaction: string;
  coworkersFrictionReaction: string;
  explainInSimpleWordsSubject: string;
  explainInSimpleWordsAnswer: string;
  aboutPnapTwoLines: string;
  teamworkExperience: string;
  successFactorsInOrganization: string;
  emotionControlMethod: string;

  // ۶. معرفین (حداقل ۲ نفر)
  references: InPersonReferenceItem[];

  // ۷. شرایط سلامت و تعهدات
  hasSpecificIllness: 'YES' | 'NO';
  hasCriminalRecord: 'YES' | 'NO';
  criminalRecordDetails?: string;
  usesTobacco: 'YES' | 'NO';
  canProvideGuarantee: 'YES' | 'NO';
  hasRelativesInCompany: 'YES' | 'NO';
  motivatingFactors: string;
  neededTrainings: string;
  earliestStartDate: 'ONE_WEEK' | 'ONE_MONTH' | 'MORE_THAN_MONTH';
  earliestStartDateCustom?: string;
  briefSelfIntroduction: string;
  applicantAgreementConfirmed: boolean;

  // ارزیابی مصاحبه‌کنندگان
  interviewerRating: number; // 1 to 5 or 1 to 10
  interviewerVerdict: 'HIRE' | 'REJECT' | 'HOLD' | 'STAGE_6_BACKGROUND';
  interviewerNotes: string;
  updatedAt: string;
}

export interface InPersonInterviewFormTemplate {
  id: string;
  formTitle: string;
  instructionText: string;
  personalInfoTitles: {
    fullName: string;
    requestedRole: string;
    birthDate: string;
    personalityType: string;
    bloodGroup: string;
    phone: string;
    maritalStatus: string;
    militaryStatus: string;
    email: string;
    address: string;
    sourceWebsite: string;
    religion: string;
    sect: string;
  };
  educationTitles: {
    lastDegree: string;
    gpa: string;
    majorAndUniversity: string;
  };
  skillItems: { key: keyof InPersonSkillsRating; label: string }[];
  questionnaireTitles: { key: string; label: string; helper?: string }[];
  agreementText: string;
}

export interface SystemSpecs {
  systemCode: string;
  supportEmail: string;
  contactPhone: string;
  version: string;
  orgDescription: string;
}



