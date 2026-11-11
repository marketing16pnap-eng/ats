import { Candidate, CandidateTimelineEvent, RecruitmentStepNumber, TimelineEventType } from '../types';

/**
 * Returns current date and time in Persian format
 */
export function getPersianDateTimeNow(): { date: string; time: string; full: string } {
  try {
    const now = new Date();
    const date = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);

    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return {
      date,
      time,
      full: `${date} - ${time}`,
    };
  } catch {
    return {
      date: '۱۴۰۳/۰۶/۲۴',
      time: '۱۰:۰۰',
      full: '۱۴۰۳/۰۶/۲۴ - ۱۰:۰۰',
    };
  }
}

/**
 * Derives a complete, sorted chronological timeline for a candidate from both their
 * explicitly logged history events and their step records, dates, and status fields.
 */
export function buildCandidateFullTimeline(candidate: Candidate): CandidateTimelineEvent[] {
  const events: CandidateTimelineEvent[] = [];
  const appliedDate = candidate.appliedDate || candidate.resumeSubmissionDate || '۱۴۰۳/۰۶/۰۱';

  // 1. Initial Application & Step 1
  events.push({
    id: `evt-app-${candidate.id}`,
    timestamp: `${appliedDate} - ۰۹:۰۰`,
    date: appliedDate,
    time: '۰۹:۰۰',
    title: 'ثبت رزومه و پرونده در سامانه جذب پناپ',
    titleEn: 'Application Submitted & Step 1 Started',
    description: `پرونده کارجو با عنوان شغلی «${candidate.role}» از طریق ${candidate.source || 'فرم وب‌سایت'} در واحد ${candidate.department} ثبت شد.`,
    stepNumber: 1,
    type: 'APPLIED',
    actor: 'کارجو',
  });

  // Step 1 Screening Outcome
  if (candidate.currentStep > 1 || candidate.step1?.initialResumeStatus === 'APPROVED') {
    events.push({
      id: `evt-s1-pass-${candidate.id}`,
      timestamp: `${appliedDate} - ۱۱:۳۰`,
      date: appliedDate,
      time: '۱۱:۳۰',
      title: 'تأیید غربالگری اولیه رزومه (گام ۱)',
      titleEn: 'Initial Resume Screening Approved',
      description: `رزومه بر اساس شاخص‌های شایستگی، مدرک تحصیلی (${candidate.education}) و سابقه کار (${candidate.experienceYears} سال) تأیید شد. امتیاز تطابق: %${candidate.matchScore || 85}.`,
      stepNumber: 1,
      type: 'STEP_CHANGE',
      actor: candidate.assignee || 'کارشناس غربالگری',
    });
  }

  // 2. Step 2: Site Form
  const siteDate = candidate.step2?.siteMessageSentDate || candidate.siteMessageDate || appliedDate;
  if (
    candidate.step2?.siteMessageStatus === 'SENT' ||
    candidate.step2?.siteMessageStatus === 'DELIVERED' ||
    candidate.isMessageReceived === 'بله' ||
    candidate.currentStep >= 2
  ) {
    events.push({
      id: `evt-s2-msg-${candidate.id}`,
      timestamp: `${siteDate} - ۱۴:۱۵`,
      date: siteDate,
      time: '۱۴:۱۵',
      title: 'ارسال پیام دعوت به تکمیل فرم سایت (گام ۲)',
      titleEn: 'Step 2 Site Form Notification Sent',
      description: `پیامک و اطلاع‌رسانی تکمیل فرم تکمیلی در سایت pnap.ir/employment برای متقاضی ارسال شد.`,
      stepNumber: 2,
      type: 'SYSTEM_EVENT',
      actor: 'سیستم خودکار جذب',
    });
  }

  if (
    candidate.step2?.step2Status === 'APPROVED' ||
    candidate.step2?.isSiteCompleted === 'COMPLETED' ||
    candidate.isSiteCompleted === 'بله' ||
    candidate.currentStep > 2
  ) {
    events.push({
      id: `evt-s2-done-${candidate.id}`,
      timestamp: `${siteDate} - ۱۸:۴۰`,
      date: siteDate,
      time: '۱۸:۴۰',
      title: 'تکمیل فرم جامع وبسایت توسط کارجو',
      titleEn: 'Step 2 Form Completed by Applicant',
      description: `فرم اطلاعات تکمیلی، تجارب کاری و انتظارات حقوقی (${candidate.salaryExpectation || 'مطابق عرف'}) با موفقیت توسط کارجو ثبت شد.`,
      stepNumber: 2,
      type: 'DOCUMENT_UPLOADED',
      actor: 'کارجو',
    });
  }

  // 3. Step 3: Video Introduction
  if (candidate.step3?.videoSubmissionStatus === 'RECEIVED' || candidate.currentStep >= 3) {
    const videoDate = candidate.step3?.videoReceivedDate || candidate.step3?.videoSubmissionDate || appliedDate;
    events.push({
      id: `evt-s3-video-${candidate.id}`,
      timestamp: `${videoDate} - ۱۶:۲۰`,
      date: videoDate,
      time: '۱۶:۲۰',
      title: 'دریافت و بارگذاری ویدیوی معرفی کارجو (گام ۳)',
      titleEn: 'Step 3 Introduction Video Received',
      description: `ویدیوی پاسخ به سوالات ارزیابی شایستگی در بستر ${candidate.step3?.videoSubmissionPlatform || 'بارگذاری مستقیم'} ثبت شد. وضعیت ارزیابی: ${candidate.step3?.step3Status === 'APPROVED' ? 'تأیید شده توسط تیم ارزیاب' : 'در دست بررسی ارزیابان'}.`,
      stepNumber: 3,
      type: 'DOCUMENT_UPLOADED',
      actor: 'کارجو',
    });
  }

  // 4. Step 4: Phone Interview
  if (candidate.step4?.phoneInterviewDate || candidate.phoneInterviewForm || candidate.currentStep >= 4) {
    const phoneDate = candidate.step4?.phoneInterviewDate || '۱۴۰۳/۰۶/۰۸';
    const phoneTime = candidate.step4?.phoneInterviewTime || '۱۰:۳۰';
    events.push({
      id: `evt-s4-sched-${candidate.id}`,
      timestamp: `${phoneDate} - ۰۹:۰۰`,
      date: phoneDate,
      time: '۰۹:۰۰',
      title: 'هماهنگی و برنامه‌ریزی مصاحبه تلفنی (گام ۴)',
      titleEn: 'Phone Interview Scheduled',
      description: `جلسه مصاحبه تلفنی برای تاریخ ${phoneDate} ساعت ${phoneTime} با هماهنگی کارشناس جذب زمان‌بندی شد.`,
      stepNumber: 4,
      type: 'INTERVIEW_SCHEDULED',
      actor: candidate.step4?.scheduledBy || 'کارشناس جذب',
    });

    if (candidate.currentStep > 4 || candidate.step4?.step4Status === 'APPROVED' || candidate.phoneInterviewForm) {
      events.push({
        id: `evt-s4-done-${candidate.id}`,
        timestamp: `${phoneDate} - ${phoneTime}`,
        date: phoneDate,
        time: phoneTime,
        title: 'انجام مصاحبه تلفنی و ثبت کارنامه ارزیابی',
        titleEn: 'Phone Interview Completed & Scored',
        description: `مصاحبه ساختاریافته تلفنی با موفقیت انجام شد. امتیاز کل ارزیابی: ${candidate.step4?.phoneTotalScore || 4.2} از ۵. کارنامه فرم ۱ تکمیل گردید.`,
        stepNumber: 4,
        type: 'INTERVIEW_COMPLETED',
        actor: 'کارشناس ارشد ارزیابی',
      });
    }
  }

  // 5. Step 5: In-Person Interview at Sarmad Complex
  if (candidate.step5?.interviewDate || candidate.inPersonInterviewForm || candidate.currentStep >= 5) {
    const inPersonDate = candidate.step5?.interviewDate || '۱۴۰۳/۰۶/۱۵';
    const inPersonTime = candidate.step5?.interviewTime || '۱۴:۰۰';
    events.push({
      id: `evt-s5-sched-${candidate.id}`,
      timestamp: `${inPersonDate} - ۱۰:۰۰`,
      date: inPersonDate,
      time: '۱۰:۰۰',
      title: 'دعوت به مصاحبه حضوری کانون ارزیابی پناپ (گام ۵)',
      titleEn: 'In-Person Assessment Interview Scheduled',
      description: `دعوت‌نامه حضور در کانون ارزیابی پناپ (مجتمع سرمد، طبقه ۳، واحد ۳۰۷) برای ${inPersonDate} ساعت ${inPersonTime} صادر شد.`,
      stepNumber: 5,
      type: 'INTERVIEW_SCHEDULED',
      actor: 'کمیته ارزیابی حضوری',
    });

    if (candidate.currentStep > 5 || candidate.step5?.step5Status === 'APPROVED' || candidate.inPersonInterviewForm) {
      events.push({
        id: `evt-s5-done-${candidate.id}`,
        timestamp: `${inPersonDate} - ${inPersonTime}`,
        date: inPersonDate,
        time: inPersonTime,
        title: 'برگزاری مصاحبه حضوری و ثبت فرم ۲ کانون ارزیابی',
        titleEn: 'In-Person Interview Completed',
        description: `جلسه ارزیابی تخصصی و شایستگی‌های رفتاری با حضور مدیر واحد و منابع انسانی برگزار گردید. میانگین امتیاز ارزیابی: ${candidate.step5?.scores ? ((candidate.step5.scores.technicalCompetence + candidate.step5.scores.educationAndExperience) / 2).toFixed(1) : '۴.۵'} از ۵.`,
        stepNumber: 5,
        type: 'INTERVIEW_COMPLETED',
        actor: 'مدیر واحد و مدیر منابع انسانی',
      });
    }
  }

  // 6. Step 6: Background & Psychometric Assessment
  if (candidate.step6?.references?.length || candidate.currentStep >= 6) {
    const s6Date = candidate.step5?.interviewDate || appliedDate;
    events.push({
      id: `evt-s6-${candidate.id}`,
      timestamp: `${s6Date} - ۱۱:۰۰`,
      date: s6Date,
      time: '۱۱:۰۰',
      title: 'استعلام سوابق کاری و معرفین شغلی (گام ۶)',
      titleEn: 'Reference & Background Checks',
      description: `استعلام سوابق از معرفین پیشین و راستی‌آزمایی مدارک تحصیلی و تجارب کاری. تعداد معرف‌های بررسی‌شده: ${candidate.step6?.references?.length || 2} معرف. وضعیت: ${candidate.step6?.step6Status || 'تأیید سوابق'}.`,
      stepNumber: 6,
      type: 'SCORE_RECORDED',
      actor: 'تیم نظارت و سوابق',
    });
  }

  // 7. Step 7: Final Offer & Hiring
  if (candidate.step7 || candidate.currentStep >= 7 || candidate.status === 'HIRED') {
    const s7Date = candidate.step7?.contractSignedDate || '۱۴۰۳/۰۶/۲۰';
    events.push({
      id: `evt-s7-${candidate.id}`,
      timestamp: `${s7Date} - ۱۲:۰۰`,
      date: s7Date,
      time: '۱۲:۰۰',
      title: 'تصویب کمیته جذب و صدور پیشنهاد همکاری (گام ۷)',
      titleEn: 'Committee Approval & Offer Letter',
      description: `تصمیم کمیته جذب: تأیید نهایی استخدام. پیشنهاد همکاری (Job Offer) با توافق حقوقی نهایی صادر و امضا شد.`,
      stepNumber: 7,
      type: candidate.status === 'HIRED' ? 'HIRED' : 'STEP_CHANGE',
      actor: 'کمیته عالی جذب و منابع انسانی',
    });
  }

  // Skipped steps
  if (candidate.skippedSteps && candidate.skippedSteps.length > 0) {
    candidate.skippedSteps.forEach((s) => {
      events.push({
        id: `evt-skip-${candidate.id}-${s}`,
        timestamp: `${appliedDate} - ۱۲:۰۰`,
        date: appliedDate,
        time: '۱۲:۰۰',
        title: `پرش سریع (Fast-Track) از گام ${s}`,
        titleEn: `Step ${s} Fast-Tracked / Skipped`,
        description: `ارزیاب ارشد این گام را بدون لزوم تکمیل جزئیات، به صورت Fast-Track گذرانده است.`,
        stepNumber: s,
        type: 'STEP_SKIPPED',
        actor: 'مدیر ارشد جذب',
      });
    });
  }

  // Rejection
  if (candidate.status === 'REJECTED') {
    events.push({
      id: `evt-reject-${candidate.id}`,
      timestamp: `${appliedDate} - ۱۶:۰۰`,
      date: appliedDate,
      time: '۱۶:۰۰',
      title: `عدم احراز شرایط در گام ${candidate.rejectionStep || candidate.currentStep}`,
      titleEn: 'Application Not Proceeded',
      description: `علت ثبت شده در سیستم: ${candidate.rejectionReason || 'عدم تطابق مهارت‌های کلیدی با الزامات موقعیت شغلی'}. پیام محترمانه همکاری‌های آتی صادر گردید.`,
      stepNumber: candidate.rejectionStep || candidate.currentStep,
      type: 'REJECTION',
      actor: 'کمیته ارزیابی',
    });
  } else if (candidate.status === 'WITHDRAWN') {
    events.push({
      id: `evt-withdraw-${candidate.id}`,
      timestamp: `${appliedDate} - ۱۶:۰۰`,
      date: appliedDate,
      time: '۱۶:۰۰',
      title: 'انصراف متقاضی از ادامه فرآیند استخدام',
      titleEn: 'Candidate Withdrew Application',
      description: candidate.rejectionReason || 'کارجو به دلیل دریافت پیشنهاد دیگر یا دلایل شخصی از فرآیند انصراف داد.',
      stepNumber: candidate.currentStep,
      type: 'STATUS_CHANGE',
      actor: 'کارجو',
    });
  }

  // Step Notes as events
  if (candidate.stepNotes) {
    Object.entries(candidate.stepNotes).forEach(([stepStr, note]) => {
      if (note && note.trim()) {
        const stepNum = Number(stepStr) as RecruitmentStepNumber;
        events.push({
          id: `evt-note-${candidate.id}-${stepNum}`,
          timestamp: `${appliedDate} - ۱۵:۳۰`,
          date: appliedDate,
          time: '۱۵:۳۰',
          title: `یادداشت کارشناس برای گام ${stepNum}`,
          titleEn: `Evaluator Note for Step ${stepNum}`,
          description: note,
          stepNumber: stepNum,
          type: 'NOTE_ADDED',
          actor: 'کارشناس ارزیابی',
        });
      }
    });
  }

  // Merge explicit custom history events if any
  if (candidate.history && Array.isArray(candidate.history)) {
    candidate.history.forEach((h) => {
      // Avoid duplicate IDs
      if (!events.some((e) => e.id === h.id)) {
        events.push(h);
      }
    });
  }

  // Return sorted chronologically (newest first or chronological)
  // Let's do a reliable sort using timestamp strings
  return events.sort((a, b) => {
    return (b.timestamp || '').localeCompare(a.timestamp || '');
  });
}

/**
 * Appends a new event to a candidate's history
 */
export function appendCandidateHistoryEvent(
  candidate: Candidate,
  eventData: {
    title: string;
    titleEn?: string;
    description?: string;
    stepNumber?: RecruitmentStepNumber;
    type: TimelineEventType;
    actor?: string;
    details?: Record<string, any>;
  }
): Candidate {
  const dt = getPersianDateTimeNow();
  const newEvent: CandidateTimelineEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: dt.full,
    date: dt.date,
    time: dt.time,
    title: eventData.title,
    titleEn: eventData.titleEn,
    description: eventData.description,
    stepNumber: eventData.stepNumber,
    type: eventData.type,
    actor: eventData.actor || 'کارشناس جذب',
    details: eventData.details,
  };

  const existingHistory = candidate.history || [];
  return {
    ...candidate,
    history: [newEvent, ...existingHistory],
  };
}
