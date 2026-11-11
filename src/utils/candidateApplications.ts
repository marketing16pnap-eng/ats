import { Candidate, CandidatePreviousApplication, RECRUITMENT_STEPS } from '../types';

/**
 * Normalizes Persian/Arabic digits to standard English ASCII digits
 */
export function toAsciiDigits(str?: string): string {
  if (!str) return '';
  return str
    .replace(/[۰٠]/g, '0')
    .replace(/[۱١]/g, '1')
    .replace(/[۲٢]/g, '2')
    .replace(/[۳٣]/g, '3')
    .replace(/[۴٤]/g, '4')
    .replace(/[۵٥]/g, '5')
    .replace(/[۶٦]/g, '6')
    .replace(/[۷٧]/g, '7')
    .replace(/[۸٨]/g, '8')
    .replace(/[۹٩]/g, '9');
}

/**
 * Normalizes a phone number for comparison (strips non-digits, normalizes +98/0)
 */
export function normalizePhone(phone?: string): string {
  if (!phone) return '';
  const ascii = toAsciiDigits(phone).replace(/\D/g, '');
  if (ascii.startsWith('98')) {
    return '0' + ascii.slice(2);
  }
  return ascii;
}

/**
 * Normalizes national ID
 */
export function normalizeNationalId(nid?: string): string {
  if (!nid) return '';
  return toAsciiDigits(nid).replace(/\D/g, '').trim();
}

/**
 * Extracts human-readable status for a candidate in Persian
 */
export function getCandidateStatusTitleFa(candidate: Candidate): string {
  if (candidate.status === 'HIRED') return 'استخدام شده در پناپ';
  if (candidate.status === 'REJECTED') {
    return `رد شده در گام ${candidate.rejectionStep || candidate.currentStep || 1}`;
  }
  if (candidate.status === 'WITHDRAWN') return 'انصراف کارجو';
  if (candidate.status === 'CANCELLED') return 'لغو شده';
  
  const stepObj = RECRUITMENT_STEPS.find(s => s.stepNumber === candidate.currentStep);
  if (stepObj) {
    return `در حال ارزیابی (${stepObj.shortTitle})`;
  }
  return 'در جریان بررسی';
}

/**
 * Determines whether two candidate records belong to the same person
 */
export function isSamePerson(candA: Candidate, candB: Candidate): boolean {
  if (candA.id === candB.id) return false;

  // 1. National ID match
  const nidA = normalizeNationalId(candA.nationalId);
  const nidB = normalizeNationalId(candB.nationalId);
  if (nidA && nidB && nidA.length >= 8 && nidA === nidB) {
    return true;
  }

  // 2. Phone match
  const phoneA = normalizePhone(candA.phone);
  const phoneB = normalizePhone(candB.phone);
  if (phoneA && phoneB && phoneA.length >= 10 && phoneA === phoneB) {
    return true;
  }

  // 3. Email match
  const emailA = (candA.email || '').trim().toLowerCase();
  const emailB = (candB.email || '').trim().toLowerCase();
  if (emailA && emailB && emailA.includes('@') && emailA === emailB) {
    return true;
  }

  // 4. Exact full name match if name is detailed (> 2 words)
  const nameA = candA.name.trim().toLowerCase();
  const nameB = candB.name.trim().toLowerCase();
  if (nameA && nameB && nameA === nameB && nameA.split(' ').length >= 2) {
    return true;
  }

  return false;
}

/**
 * Retrieves the full list of past application submissions for a candidate,
 * combining explicit `candidate.previousApplications` with any duplicate records found in `allCandidates`.
 */
export function getCandidateApplicationHistory(
  candidate: Candidate,
  allCandidates: Candidate[] = []
): CandidatePreviousApplication[] {
  const result: CandidatePreviousApplication[] = [];
  const seenKeys = new Set<string>();

  // 1. Add explicit previousApplications on the candidate record
  if (candidate.previousApplications && Array.isArray(candidate.previousApplications)) {
    for (const app of candidate.previousApplications) {
      const key = `${app.jobTitle.trim().toLowerCase()}_${(app.appliedDate || '').trim()}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        result.push(app);
      }
    }
  }

  // 2. Find matching records across all other candidates in the system
  if (Array.isArray(allCandidates) && allCandidates.length > 0) {
    for (const other of allCandidates) {
      if (other.id === candidate.id) continue;

      if (isSamePerson(candidate, other)) {
        const key = `${other.role.trim().toLowerCase()}_${(other.appliedDate || other.resumeSubmissionDate || '').trim()}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          const stepObj = RECRUITMENT_STEPS.find(s => s.stepNumber === other.currentStep);
          result.push({
            id: other.id,
            jobTitle: other.role,
            department: other.department,
            appliedDate: other.appliedDate || other.resumeSubmissionDate || '۱۴۰۳/۰۱/۱۵',
            status: getCandidateStatusTitleFa(other),
            stepReached: other.currentStep,
            stepName: stepObj ? `گام ${other.currentStep}: ${stepObj.shortTitle}` : undefined,
            source: other.source,
            notes: other.remarks || (other.notes && other.notes[0]) || '',
            rejectionReason: other.rejectionReason,
            matchScore: other.matchScore,
            rating: other.rating,
            salaryExpectation: other.requestedSalary || other.salaryExpectation,
          });
        }
      }
    }
  }

  // Sort descending by appliedDate (supports Shamsi dates e.g. 1403/06/01)
  return result.sort((a, b) => (b.appliedDate || '').localeCompare(a.appliedDate || ''));
}

/**
 * Returns visual color classes for a past application status
 */
export function getApplicationStatusColor(status: string): {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
} {
  if (status.includes('استخدام') || status.includes('HIRED') || status.includes('موفق')) {
    return {
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
    };
  }
  if (status.includes('رد') || status.includes('REJECTED') || status.includes('عدم تأیید')) {
    return {
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-700',
      badgeBorder: 'border-rose-200',
      dotColor: 'bg-rose-500',
    };
  }
  if (status.includes('انصراف') || status.includes('WITHDRAWN') || status.includes('لغو')) {
    return {
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      badgeBorder: 'border-amber-200',
      dotColor: 'bg-amber-500',
    };
  }
  return {
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    dotColor: 'bg-blue-500',
  };
}
