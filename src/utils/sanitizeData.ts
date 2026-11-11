import { Candidate, JobRequisition, Department, InterviewRound, InterviewStageConfig, AppUser, RecruitmentStepNumber, CandidateStatus } from '../types';

/**
 * Deduplicates and guarantees unique IDs and complete 7-step pipeline structure for candidates array
 */
export function sanitizeCandidates(list: Candidate[]): Candidate[] {
  if (!Array.isArray(list)) return [];
  const seenIds = new Set<string>();
  const sanitized: Candidate[] = [];

  list.forEach((item, index) => {
    if (!item) return;
    let id = (item.id || '').trim();
    if (!id || seenIds.has(id)) {
      id = id ? `${id}-${index + 1}` : `CAN-${Date.now()}-${index + 1}-${Math.random().toString(36).substring(2, 6)}`;
    }
    seenIds.add(id);

    // Map legacy status to step numbers if needed
    let stepNum: RecruitmentStepNumber = item.currentStep || 1;
    let computedStatus: CandidateStatus = item.status || 'STAGE_1_APPLIED';

    if (!item.currentStep) {
      if (item.status === 'HIRED') {
        stepNum = 7;
      } else if (item.status === 'REJECTED' || item.status === 'WITHDRAWN' || item.status === 'CANCELLED') {
        stepNum = item.rejectionStep || 1;
      } else if (item.status === 'OFFER_SENT' || item.status === 'STAGE_7_FINAL_DECISION') {
        stepNum = 7;
      } else if (item.status === 'STAGE_6_BACKGROUND_CHECK') {
        stepNum = 6;
      } else if (item.status === 'TECH_INTERVIEW' || item.status === 'STAGE_5_IN_PERSON') {
        stepNum = 5;
      } else if (item.status === 'SCREENING' || item.status === 'STAGE_4_PHONE_INTERVIEW') {
        stepNum = 4;
      } else if (item.status === 'STAGE_3_VIDEO') {
        stepNum = 3;
      } else if (item.status === 'STAGE_2_SITE_FORM') {
        stepNum = 2;
      } else {
        stepNum = 1;
      }
    }

    const military = item.militaryStatus || (item.gender === 'زن' ? 'NOT_APPLICABLE' : 'COMPLETED');

    const sanitizedCandidate: Candidate = {
      ...item,
      id,
      name: item.name || 'کارجوی بدون نام',
      role: item.role || 'سمت اعلام نشده',
      department: item.department || 'فنی و مهندسی',
      status: computedStatus,
      currentStep: stepNum,
      militaryStatus: military,
      militaryStatusFa: item.militaryStatusFa || (military === 'NOT_APPLICABLE' ? 'عدم نیاز (بانوان)' : military === 'COMPLETED' ? 'کارت پایان خدمت' : 'معافیت دائم'),
      source: item.source || 'جاب ویژن (JobVision)',
      skills: Array.isArray(item.skills) ? item.skills : [],
      notes: Array.isArray(item.notes) ? item.notes : [],
      rating: typeof item.rating === 'number' ? item.rating : 4.0,
      matchScore: typeof item.matchScore === 'number' ? item.matchScore : 85,
      experienceYears: typeof item.experienceYears === 'number' ? item.experienceYears : 2,
      previousApplications: Array.isArray(item.previousApplications) ? item.previousApplications : [],

      // Ensure Step 1 defaults
      step1: item.step1 || {
        name: item.name || '',
        nationalId: item.nationalId || '',
        phone: item.phone || '',
        email: item.email || '',
        requestedRole: item.role || '',
        department: item.department || 'فنی و مهندسی',
        militaryStatus: military,
        source: item.source || 'جاب ویژن (JobVision)',
        initialResumeStatus: item.isResumeApproved === 'خیر' ? 'REJECTED' : 'APPROVED',
        submissionDate: item.resumeSubmissionDate || item.appliedDate || '۱۴۰۳/۰۶/۰۱',
        evaluatorName: item.assignee || 'کارشناس جذب',
      },

      // Ensure Step 2 defaults
      step2: item.step2 || {
        siteMessageSentDate: item.siteMessageDate || item.appliedDate,
        siteMessageStatus: item.isMessageReceived === 'بله' ? 'DELIVERED' : 'SENT',
        isSiteCompleted: item.isSiteCompleted === 'بله' ? 'COMPLETED' : 'PENDING',
        daysElapsed: 2,
        siteIncompletionReason: item.siteIncompletionReason || '',
        step2Status: item.isSiteCompleted === 'بله' ? 'APPROVED' : 'PENDING',
      },

      // Ensure Step 3 defaults
      step3: item.step3 || {
        eitaaMessageSentDate: item.appliedDate,
        videoSubmissionStatus: stepNum >= 3 ? 'RECEIVED' : 'PENDING',
        videoDurationMinutes: 2,
        communicationSkillScore: 4,
        verbalFluencyScore: 4,
        professionalAppearanceScore: 4,
        totalVideoScore: 4,
        step3Status: stepNum >= 4 ? 'APPROVED' : 'PENDING',
      },

      // Ensure Step 4 defaults
      step4: item.step4 || {
        phoneInterviewDate: item.appliedDate,
        interviewerName: 'کارشناس جذب و ارزیابی اولیه',
        workHistorySummary: item.summary || 'سوابق مرتبط و دارای مهارت‌های کلیدی',
        motivation: 'علاقه به توسعه فناوری و همکاری سازمانی پایدار در شرکت پناپ',
        companyKnowledge: 'آشنایی کامل با محصولات پناپ و حوزه فعالیت نرم‌افزاری و بازرگانی',
        keyRoleSkills: (item.skills || []).join('، '),
        currentEmploymentStatus: 'EMPLOYED',
        expectedSalary: item.salaryExpectation || item.requestedSalary || 'توافقی',
        startCondition: 'آمادگی شروع به کار ظرف ۲ هفته پس از تایید نهایی',
        phoneTotalScore: 4,
        step4Status: stepNum >= 5 ? 'APPROVED' : 'PENDING',
      },

      // Ensure Step 5 defaults
      step5: item.step5 || {
        interviewDate: item.appliedDate,
        location: 'خیابان سنایی-میدان صاحب الزمان- نبش سنایی7- ورودی شماره یک مجتمع سرمد- طبقه سوم- واحد 307 شرکت پناپ',
        departmentManagerName: 'مدیر واحد مربوطه',
        hrManagerName: 'مدیر منابع انسانی',
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
        interviewerFeedback: item.remarks || 'عملکرد مطلوب در مصاحبه حضوری و پاسخگویی به سوالات فنی و تخصصی',
        step5Status: stepNum >= 6 ? 'APPROVED' : 'PENDING',
      },

      // Ensure Step 6 defaults
      step6: item.step6 || {
        references: [
          {
            id: 'REF-1',
            contactName: 'مهندس رضایی',
            companyName: item.currentCompany || 'شرکت قبلی',
            roleOrRelation: 'مدیر مستقیم فنی',
            phone: '۰۹۱۲۰۰۰۰۰۹۹',
            feedbackSummary: 'تایید کامل تعهد کاری، اخلاق حرفه‌ای و توان فنی',
            ethicalAndWorkRating: 5,
            isVerified: true,
          }
        ],
        previousWorkplaceCheckNotes: 'سوابق استعلام شده مثبت و بدون سابقه منفی بوده است.',
        hrDirectCheckNotes: 'انطباق مدارک تحصیلی و سوابق بیمه‌ای با ادعاهای کارجو تایید شد.',
        step6Status: stepNum >= 7 ? 'APPROVED' : 'PENDING',
      },

      // Ensure Step 7 defaults
      step7: item.step7 || {
        committeeDecision: item.status === 'HIRED' ? 'APPROVED' : 'PENDING',
        committeeNotes: 'تصویب در کمیته جذب و استخدام پناپ جهت عقد قرارداد رسمی',
        aggregatedTotalScore: 92,
        officialOfferDate: item.appliedDate,
        offeredSalary: item.requestedSalary || item.salaryExpectation || 'مطابق بودجه مصوب',
        hrSystemRegistration: item.status === 'HIRED',
        step7Status: item.status === 'HIRED' ? 'HIRED' : 'PENDING',
      },
    };

    sanitized.push(sanitizedCandidate);
  });

  return sanitized;
}

/**
 * Deduplicates and guarantees unique IDs for any list with an id property
 */
export function sanitizeListWithIds<T extends { id: string }>(list: T[], prefix: string = 'item'): T[] {
  if (!Array.isArray(list)) return [];
  const seenIds = new Set<string>();
  const sanitized: T[] = [];

  list.forEach((item, index) => {
    if (!item) return;
    let id = (item.id || '').trim();
    if (!id || seenIds.has(id)) {
      id = id ? `${id}-${index + 1}` : `${prefix}-${Date.now()}-${index + 1}-${Math.random().toString(36).substring(2, 6)}`;
    }
    seenIds.add(id);
    sanitized.push({
      ...item,
      id,
    });
  });

  return sanitized;
}

/**
 * Generates a collision-resistant unique candidate ID
 */
export function generateUniqueCandidateId(trackingCode?: string): string {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  if (trackingCode && trackingCode.trim()) {
    const clean = trackingCode.replace(/[^a-zA-Z0-9]/g, '');
    return `CAN-${clean}-${randomSuffix}`;
  }
  return `CAN-${timestamp}-${randomSuffix}`;
}

