import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ArrowLeft, 
  Filter, 
  Search, 
  Trash2, 
  Check, 
  RefreshCw,
  Users,
  Briefcase,
  Layers,
  FileCheck,
  ShieldAlert,
  ChevronDown,
  Sliders,
  Sparkles,
  MapPin,
  Calendar,
  Phone,
  Edit3
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Candidate, CandidateStatus, AppLanguage, Department } from '../types';
import { generateUniqueCandidateId } from '../utils/sanitizeData';
import { formatExcelDate } from '../utils/excelDateHelper';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  departments: Department[];
  onImportCandidates: (candidates: Candidate[]) => void;
}

interface ParsedCandidateRow {
  selected: boolean;
  isValid: boolean;
  errors: string[];
  candidate: Candidate;
  rawRow: Record<string, any>;
}

// Definition of standard target fields
const TARGET_FIELDS = [
  { key: 'name', label: 'نام و نام خانوادگی', required: true, priorityKeywords: ['نام و نام خانوادگی', 'نام و نام‌خانوادگی', 'نام متقاضی', 'نام داوطلب', 'نام کارجو', 'نام فرد', 'نام و فامیل', 'نام کامل', 'نام خانوادگی'], fallbackKeywords: ['نام'] },
  { key: 'gender', label: 'جنسیت', required: false, priorityKeywords: ['جنسیت', 'جنس'], fallbackKeywords: [] },
  { key: 'nationalId', label: 'کد ملی', required: false, priorityKeywords: ['کد ملی', 'کدملی', 'شناسه ملی', 'شماره ملی', 'کدملّی'], fallbackKeywords: ['ملی'] },
  { key: 'phone', label: 'شماره تلفن همراه', required: true, priorityKeywords: ['شماره همراه', 'تلفن همراه', 'شماره تماس', 'موبایل', 'تلفن', 'شماره موبایل', 'شماره تلفن', 'تلفن ثابت'], fallbackKeywords: ['همراه', 'موبایل'] },
  { key: 'email', label: 'آدرس ایمیل', required: false, priorityKeywords: ['ایمیل', 'پست الکترونیک', 'پست الکترونیکی', 'رایانامه', 'Email', 'E-mail', 'mail'], fallbackKeywords: ['email', 'mail'] },
  { key: 'role', label: 'سمت بکارگیری', required: true, priorityKeywords: ['سمت بکارگیری', 'عنوان شغلی', 'عنوان شغل', 'ردیف شغلی', 'سمت انتخابی', 'پست شغلی', 'شغل درخواستی', 'عنوان پست', 'عنوان سمت', 'سمت مورد تقاضا', 'شغل مورد تقاضا'], fallbackKeywords: ['سمت', 'شغل'] },
  { key: 'source', label: 'محل دریافت رزومه', required: false, priorityKeywords: ['محل دریافت رزومه', 'محل دریافت', 'منبع دریافت رزومه', 'منبع رزومه', 'منبع دریافت', 'منبع جذب', 'کانال جذب', 'کانال دریافت', 'پلتفرم دریافت', 'پلتفرم کاریابی', 'مرجع رزومه', 'نحوه ارسال رزومه', 'درگاه دریافت', 'منبع ارسال', 'ارسال از طریق', 'نحوه آشنایی', 'درگاه ارسال', 'سایت / کاریابی', 'پلتفرم', 'کاریابی'], fallbackKeywords: ['منبع', 'کانال', 'مرجع'] },
  { key: 'trackingCode', label: 'کد ارجاع / پیگیری', required: false, priorityKeywords: ['کد ارجاع', 'کد پیگیری', 'شماره ارجاع', 'شناسه ارجاع', 'کد پرونده', 'شناسه داوطلب', 'شماره پیگیری', 'کد رهگیری'], fallbackKeywords: ['ارجاع', 'پیگیری', 'رهگیری'] },
  { key: 'assignee', label: 'مسئول پیگیری', required: false, priorityKeywords: ['مسئول پیگیری', 'مسئول پرونده', 'کارشناس پیگیری', 'کارشناس جذب', 'مسئول بررسی', 'ارزیاب'], fallbackKeywords: ['مسئول', 'کارشناس'] },
  { key: 'resumeSubmissionDate', label: 'تاریخ ارسال رزومه', required: false, priorityKeywords: ['تاریخ ارسال رزومه', 'تاریخ ثبت رزومه', 'تاریخ ارسال', 'تاریخ دریافت رزومه', 'تاریخ درخواست'], fallbackKeywords: ['تاریخ ارسال', 'تاریخ ثبت'] },
  { key: 'siteMessageDate', label: 'تاریخ ارسال پیام تکمیل سایت', required: false, priorityKeywords: ['تاریخ ارسال پیام تکمیل سایت', 'تاریخ پیام تکمیل سایت', 'تاریخ ارسال پیام', 'تاریخ پیام سایت', 'پیام تکمیل سایت', 'تاریخ ارسال پیامک'], fallbackKeywords: ['پیام سایت', 'پیامک سایت'] },
  { key: 'timePassed', label: 'تا کنون (مدت سپری شده)', required: false, priorityKeywords: ['تا کنون (مدت سپری شده)', 'تا کنون', 'تاکنون', 'مدت سپری شده', 'روز سپری شده', 'مدت زمان سپری شده'], fallbackKeywords: ['سپری'] },
  { key: 'isMessageReceived', label: 'اطمینان از اخذ پیام توسط مخاطب', required: false, priorityKeywords: ['اطمینان از اخذ پیام توسط مخاطب', 'اطمینان از اخذ پیام', 'اخذ پیام', 'دریافت پیامک', 'وصول پیام', 'تحویل پیام'], fallbackKeywords: ['اخذ پیام', 'وصول'] },
  { key: 'isSiteCompleted', label: 'آیا سایت تکمیل شد؟', required: false, priorityKeywords: ['آیا سایت تکمیل شد؟', 'آیا سایت تکمیل شد', 'تکمیل سایت', 'تکمیل فرم سایت', 'تکمیل فرم درخواست همکاری', 'وضعیت فرم سایت'], fallbackKeywords: ['تکمیل سایت', 'فرم سایت'] },
  { key: 'siteIncompletionReason', label: 'علت عدم تکمیل سایت', required: false, priorityKeywords: ['علت عدم تکمیل سایت', 'علت عدم تکمیل', 'دلیل عدم تکمیل', 'دلیل عدم تکمیل سایت', 'علت نقص فرم'], fallbackKeywords: ['عدم تکمیل'] },
  { key: 'isResumeApproved', label: 'آیا رزومه در این مرحله مورد تایید است؟', required: false, priorityKeywords: ['آیا رزومه در این مرحله مورد تایید است؟', 'آیا رزومه در این مرحله مورد تایید است', 'مورد تایید', 'تایید رزومه', 'تایید اولیه رزومه', 'وضعیت تایید رزومه'], fallbackKeywords: ['تایید رزومه'] },
  { key: 'jobPriorityScore', label: 'اولویت و اهمیت پست شغلی (۱ تا ۵)', required: false, priorityKeywords: ['اولویت و اهمیت پست شغلی (۱ تا ۵)', 'اولویت و اهمیت پست شغلی', 'اولویت و اهمیت', 'اولویت پست', 'اولویت شغل', 'اولویت شغلی', 'اهمیت شغل'], fallbackKeywords: ['اولویت'] },
  { key: 'siteCompletionScore', label: 'امتیاز تکمیل سایت (۱ تا ۱۰)', required: false, priorityKeywords: ['امتیاز تکمیل سایت (۱ تا ۱۰)', 'امتیاز تکمیل سایت', 'امتیاز غربالگری', 'امتیاز سایت', 'نمره تکمیل سایت', 'نمره غربالگری'], fallbackKeywords: ['امتیاز سایت', 'نمره سایت'] },
  { key: 'remarks', label: 'ملاحظات و توضیحات تکمیلی', required: false, priorityKeywords: ['ملاحظات و توضیحات تکمیلی', 'ملاحظات و توضیحات', 'ملاحظات', 'توضیحات تکمیلی', 'توضیحات', 'یادداشت', 'شرح'], fallbackKeywords: ['ملاحظات', 'توضیحات', 'یادداشت'] },
  { key: 'currentStageFa', label: 'مرحله قرارگیری پرونده', required: false, priorityKeywords: ['در حال حاضر در کدام مرحله قرار دارد', 'کدام مرحله قرار دارد', 'مرحله فعلی', 'مرحله فرآیند', 'مرحله جذب', 'گام فعلی', 'وضعیت گام', 'مرحله قرارگیری پرونده'], fallbackKeywords: ['مرحله فرآیند', 'مرحله قرارگیری'] },
  { key: 'requestedSalary', label: 'حقوق درخواستی', required: false, priorityKeywords: ['حقوق درخواستی', 'حقوق پیشنهادی', 'حقوق مدنظر', 'میزان حقوق', 'حقوق مورد انتظار', 'مبلغ درخواستی'], fallbackKeywords: ['حقوق'] },
  { key: 'location', label: 'محل زندگی / استان و شهر', required: false, priorityKeywords: ['محل زندگی / استان و شهر', 'محل زندگی', 'شهر سکونت', 'محل سکونت', 'استان و شهر', 'محل اقامت', 'آدرس سکونت', 'شهر محل سکونت', 'شهر سکونت کارجو'], fallbackKeywords: ['سکونت', 'اقامت', 'محل زندگی'] },
  { key: 'education', label: 'تحصیلات و رشته', required: false, priorityKeywords: ['تحصیلات و رشته', 'تحصیلات', 'مدرک تحصیلی', 'رشته تحصیلی', 'آخرین مدرک', 'مقطع تحصیلی'], fallbackKeywords: ['تحصیلات', 'مدرک'] },
  { key: 'experienceYears', label: 'سابقه کاری (سال)', required: false, priorityKeywords: ['سابقه کاری (سال)', 'سابقه کاری', 'سابقه کار', 'سوابق کاری', 'سال سابقه', 'میزان سابقه'], fallbackKeywords: ['سابقه کار', 'سال سابقه'] },
  { key: 'currentCompany', label: 'شرکت فعلی / قبلی', required: false, priorityKeywords: ['شرکت فعلی / قبلی', 'شرکت فعلی', 'محل کار فعلی', 'شرکت قبلی', 'آخرین شرکت', 'سازمان فعلی'], fallbackKeywords: ['شرکت فعلی', 'محل کار'] },
  { key: 'rowNumber', label: 'ردیف', required: false, priorityKeywords: ['ردیف', '#', 'شماره ردیف'], fallbackKeywords: ['ردیف'] },
];

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  language,
  departments,
  onImportCandidates,
}) => {
  const isFa = language === 'PERSIAN';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('Site');
  const [defaultDepartment, setDefaultDepartment] = useState<string>(
    departments && departments.length > 0 ? departments[0].name : 'فنی و مهندسی'
  );

  const [rawSheetData, setRawSheetData] = useState<any[][]>([]);
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [headerRowIdx, setHeaderRowIdx] = useState<number>(0);
  const [columnMapping, setColumnMapping] = useState<Record<string, number>>({});
  const [showMappingPanel, setShowMappingPanel] = useState<boolean>(false);

  const [parsedRows, setParsedRows] = useState<ParsedCandidateRow[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeFilterTab, setActiveFilterTab] = useState<'ALL' | 'VALID' | 'WARNINGS'>('ALL');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  // Clean string helper
  const cleanStr = (val: any): string => {
    if (val === null || val === undefined) return '';
    return String(val)
      .trim()
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ');
  };

  // Map Persian stage text to CandidateStatus enum and 1-7 step number accurately
  const mapPersianStageToStatus = (stageText: string): { status: CandidateStatus; stageFa: string; stepNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 } => {
    if (!stageText) return { status: 'STAGE_1_APPLIED', stageFa: 'گام ۱: ثبت اطلاعات اولیه متقاضی در پلتفرم های کاریابی', stepNumber: 1 };
    const text = stageText.trim();

    // Rejection or cancellation
    if (text.includes('رد') || text.includes('عدم تایید') || text.includes('بایگانی') || text.includes('عدم همکاری') || text.includes('انصراف')) {
      return { status: 'REJECTED', stageFa: 'رد شده', stepNumber: 1 };
    }

    // Step 7: تصمیم نهایی و شروع همکاری / استخدام قطعی
    if (
      /^(7|۷|گام\s*(7|۷)|مرحله\s*(7|۷))/.test(text) ||
      text.includes('گام ۷') || text.includes('گام 7') ||
      text.includes('مرحله ۷') || text.includes('مرحله 7') ||
      text.includes('تصمیم نهایی') || text.includes('شروع همکاری') ||
      text.includes('استخدام قطعی') || text.includes('عقد قرارداد') ||
      text.includes('پذیرش نهایی')
    ) {
      return { status: 'STAGE_7_FINAL_DECISION', stageFa: 'گام ۷: تصمیم نهایی و شروع همکاری', stepNumber: 7 };
    }

    // Step 6: استعلام و بررسی پیشزمینه
    if (
      /^(6|۶|گام\s*(6|۶)|مرحله\s*(6|۶))/.test(text) ||
      text.includes('گام ۶') || text.includes('گام 6') ||
      text.includes('مرحله ۶') || text.includes('مرحله 6') ||
      text.includes('استعلام') || text.includes('پیشزمینه') ||
      text.includes('پیش‌زمینه') || text.includes('معرفین') ||
      text.includes('سوء پیشینه') || text.includes('احراز هویت')
    ) {
      return { status: 'STAGE_6_BACKGROUND_CHECK', stageFa: 'گام ۶: استعلام و بررسی پیشزمینه', stepNumber: 6 };
    }

    // Step 5: مصاحبه حضوری
    if (
      /^(5|۵|گام\s*(5|۵)|مرحله\s*(5|۵))/.test(text) ||
      text.includes('گام ۵') || text.includes('گام 5') ||
      text.includes('مرحله ۵') || text.includes('مرحله 5') ||
      text.includes('حضوری') || text.includes('سرمد') ||
      text.includes('مصاحبه تخصصی') || text.includes('ارزیابی حضوری')
    ) {
      return { status: 'STAGE_5_IN_PERSON', stageFa: 'گام ۵: مصاحبه حضوری', stepNumber: 5 };
    }

    // Step 4: مصاحبه تلفنی
    if (
      /^(4|۴|گام\s*(4|۴)|مرحله\s*(4|۴))/.test(text) ||
      text.includes('گام ۴') || text.includes('گام 4') ||
      text.includes('مرحله ۴') || text.includes('مرحله 4') ||
      text.includes('تلفنی') || text.includes('تماس') ||
      text.includes('سنجش تلفنی')
    ) {
      return { status: 'STAGE_4_PHONE_INTERVIEW', stageFa: 'گام ۴: مصاحبه تلفنی', stepNumber: 4 };
    }

    // Step 3: ارسال ویدیو رسمی
    if (
      /^(3|۳|گام\s*(3|۳)|مرحله\s*(3|۳))/.test(text) ||
      text.includes('گام ۳') || text.includes('گام 3') ||
      text.includes('مرحله ۳') || text.includes('مرحله 3') ||
      text.includes('ویدیو') || text.includes('ویدئو') ||
      text.includes('ایتا') || text.includes('فیلم')
    ) {
      return { status: 'STAGE_3_VIDEO', stageFa: 'گام ۳: ارسال ویدیو رسمی', stepNumber: 3 };
    }

    // Step 2: تکمیل فرم درخواست همکاری در سایت پناپ
    if (
      /^(2|۲|گام\s*(2|۲)|مرحله\s*(2|۲))/.test(text) ||
      text.includes('گام ۲') || text.includes('گام 2') ||
      text.includes('مرحله ۲') || text.includes('مرحله 2') ||
      text.includes('فرم سایت') || text.includes('سایت پناپ') ||
      text.includes('تکمیل فرم') || text.includes('فرم همکاری') ||
      text.includes('پرتال')
    ) {
      return { status: 'STAGE_2_SITE_FORM', stageFa: 'گام ۲: تکمیل فرم درخواست همکاری در سایت پناپ', stepNumber: 2 };
    }

    // Step 1: ثبت اطلاعات اولیه متقاضی در پلتفرم های کاریابی
    return { status: 'STAGE_1_APPLIED', stageFa: 'گام ۱: ثبت اطلاعات اولیه متقاضی در پلتفرم های کاریابی', stepNumber: 1 };
  };

  // Automated Header and Column Recognition
  const detectHeadersAndMapping = (rawData: any[][]) => {
    if (!rawData || rawData.length === 0) return { hRow: 0, headers: [], mapping: {} };

    // Search top 8 rows for the row with the most keyword matches
    let bestRowIdx = 0;
    let maxMatches = -1;

    const allKeywords = TARGET_FIELDS.flatMap(f => f.priorityKeywords);

    for (let r = 0; r < Math.min(rawData.length, 8); r++) {
      const row = rawData[r];
      if (!Array.isArray(row)) continue;
      let matches = 0;
      row.forEach(cell => {
        const text = cleanStr(cell);
        if (text && allKeywords.some(kw => text.includes(kw))) {
          matches++;
        }
      });
      if (matches > maxMatches) {
        maxMatches = matches;
        bestRowIdx = r;
      }
    }

    const headers = (rawData[bestRowIdx] || []).map((cell, idx) => {
      const text = cleanStr(cell);
      return text || `ستون ${idx + 1}`;
    });

    // Smart 2-Pass Mapping Algorithm
    const mapping: Record<string, number> = {};
    const usedColumns = new Set<number>();

    // Pass 1: Exact / High-Priority matches
    TARGET_FIELDS.forEach(field => {
      headers.forEach((h, colIdx) => {
        if (usedColumns.has(colIdx)) return;
        const matched = field.priorityKeywords.some(kw => {
          if (kw === 'ردیف' || kw === '#') return h === kw || h.includes(kw);
          return h.includes(kw);
        });

        // Special exclusions
        if (field.key === 'name' && (h.includes('سمت') || h.includes('شغل') || h.includes('محل') || h.includes('منبع') || h.includes('سازمان') || h.includes('شرکت') || h.includes('پدر') || h.includes('معرف'))) {
          return;
        }
        if (field.key === 'source' && (h.includes('سکونت') || h.includes('زندگی') || h.includes('اقامت') || h.includes('پیام سایت') || h.includes('شرکت فعلی'))) {
          return;
        }
        if (field.key === 'location' && (h.includes('دریافت') || h.includes('رزومه') || h.includes('منبع') || h.includes('کانال') || h.includes('پلتفرم') || h.includes('پیام') || h.includes('شرکت'))) {
          return;
        }
        if (field.key === 'role' && (h.includes('نام و') || h.includes('محل دریافت') || h.includes('منبع') || h.includes('سکونت') || h.includes('شرکت فعلی'))) {
          return;
        }
        if (field.key === 'currentStageFa' && (h.includes('تاریخ') || h.includes('تلفن') || h.includes('حقوق') || h.includes('ایمیل') || h.includes('نام') || h.includes('محل'))) {
          return;
        }

        if (matched && mapping[field.key] === undefined) {
          mapping[field.key] = colIdx;
          usedColumns.add(colIdx);
        }
      });
    });

    // Pass 2: Fallback matches for unmatched fields
    TARGET_FIELDS.forEach(field => {
      if (mapping[field.key] !== undefined) return;
      headers.forEach((h, colIdx) => {
        if (usedColumns.has(colIdx)) return;
        const matched = field.fallbackKeywords.some(kw => h.includes(kw));

        if (field.key === 'name' && (h.includes('سمت') || h.includes('شغل') || h.includes('محل') || h.includes('منبع') || h.includes('پیام') || h.includes('سایت') || h.includes('پدر') || h.includes('معرف'))) {
          return;
        }
        if (field.key === 'source' && (h.includes('سکونت') || h.includes('زندگی') || h.includes('اقامت') || h.includes('پیام') || h.includes('شرکت'))) {
          return;
        }
        if (field.key === 'location' && (h.includes('دریافت') || h.includes('رزومه') || h.includes('منبع') || h.includes('کانال') || h.includes('پلتفرم') || h.includes('پیام') || h.includes('شرکت'))) {
          return;
        }
        if (field.key === 'role' && (h.includes('نام') || h.includes('محل') || h.includes('منبع') || h.includes('سکونت'))) {
          return;
        }
        if (field.key === 'currentStageFa' && (h.includes('تاریخ') || h.includes('تلفن') || h.includes('حقوق') || h.includes('ایمیل') || h.includes('نام') || h.includes('محل'))) {
          return;
        }

        if (matched && mapping[field.key] === undefined) {
          mapping[field.key] = colIdx;
          usedColumns.add(colIdx);
        }
      });
    });

    return { hRow: bestRowIdx, headers, mapping };
  };

  // Process rows using rawSheetData, headerRowIdx and columnMapping
  const reparseRowsWithMapping = (data: any[][], hRow: number, mapping: Record<string, number>, headers: string[]) => {
    if (!data || data.length === 0) {
      setParsedRows([]);
      return;
    }

    const parsed: ParsedCandidateRow[] = [];

    for (let r = hRow + 1; r < data.length; r++) {
      const row = data[r];
      if (!Array.isArray(row) || row.length === 0) continue;

      // Check if row has any non-empty cell
      const hasContent = row.some(cell => cell !== '' && cell !== null && cell !== undefined);
      if (!hasContent) continue;

      const getVal = (fieldKey: string): string => {
        const colIdx = mapping[fieldKey];
        if (colIdx !== undefined && row[colIdx] !== undefined && row[colIdx] !== null) {
          return cleanStr(row[colIdx]);
        }
        return '';
      };

      const name = getVal('name');
      const role = getVal('role') || 'کارشناس';
      let phone = getVal('phone');
      if (phone && phone.length === 10 && phone.startsWith('9')) {
        phone = '0' + phone;
      }
      const rawEmail = getVal('email');
      const email = rawEmail && rawEmail.includes('@') ? rawEmail.trim() : '';
      const nationalId = getVal('nationalId');
      const gender = getVal('gender') || 'مرد';
      const trackingCode = getVal('trackingCode');
      const assignee = getVal('assignee');
      const appliedDate = formatExcelDate(getVal('resumeSubmissionDate')) || '۱۴۰۳/۰۶/۰۱';
      const source = getVal('source') || 'سایت پناپ';
      const siteMessageDate = formatExcelDate(getVal('siteMessageDate'));
      const timePassed = getVal('timePassed');
      const isMessageReceived = getVal('isMessageReceived') || 'بلی';
      const isSiteCompleted = getVal('isSiteCompleted') || 'بلی';
      const siteIncompletionReason = getVal('siteIncompletionReason');
      const isResumeApproved = getVal('isResumeApproved') || 'تایید اولیه';
      const remarks = getVal('remarks');
      const currentStageFa = getVal('currentStageFa');
      const requestedSalary = getVal('requestedSalary');
      const location = getVal('location'); // Do NOT default to Tehran; leave empty if not provided in Excel
      const education = getVal('education') || 'کارشناسی';
      const expYearsRaw = getVal('experienceYears');
      const experienceYears = expYearsRaw ? (parseInt(expYearsRaw, 10) || 2) : 2;
      const currentCompany = getVal('currentCompany') || 'مطابق رزومه پیوست';

      const rowNumberRaw = getVal('rowNumber');
      const rowNumber = rowNumberRaw ? parseInt(rowNumberRaw, 10) : (r - hRow);

      const jobPriorityScoreRaw = getVal('jobPriorityScore');
      const jobPriorityScore = jobPriorityScoreRaw ? parseFloat(jobPriorityScoreRaw) : 3.5;

      const siteCompletionScoreRaw = getVal('siteCompletionScore');
      const siteCompletionScore = siteCompletionScoreRaw ? parseFloat(siteCompletionScoreRaw) : 8;

      const errors: string[] = [];
      if (!name) errors.push('نام کارجو الزامی است');
      if (!phone && !nationalId) errors.push('شماره تلفن یا کد ملی وارد نشده');

      const { status: calculatedStatus, stageFa, stepNumber: calculatedStepNumber } = mapPersianStageToStatus(currentStageFa);

      // Guess department from role or use defaultDepartment
      let derivedDept = defaultDepartment;
      if (role.includes('توسعه') || role.includes('برنامه‌نویس') || role.includes('فرانت') || role.includes('بک') || role.includes('فنی') || role.includes('DevOps') || role.includes('React') || role.includes('Node')) {
        derivedDept = 'فنی و مهندسی';
      } else if (role.includes('محصول') || role.includes('Product') || role.includes('طراح') || role.includes('UI')) {
        derivedDept = 'تیم محصول';
      } else if (role.includes('فروش') || role.includes('بازاریابی') || role.includes('مارکتینگ') || role.includes('CRM') || role.includes('تامین')) {
        derivedDept = 'فروش و بازاریابی';
      } else if (role.includes('منابع انسانی') || role.includes('اداری') || role.includes('جذب')) {
        derivedDept = 'منابع انسانی';
      }

      // Generate skills tags
      const skillsArray = [role];
      if (source) skillsArray.push(`منبع: ${source}`);
      if (isSiteCompleted) skillsArray.push(`تکمیل سایت: ${isSiteCompleted}`);

      const candidateObj: Candidate = {
        id: generateUniqueCandidateId(trackingCode),
        name: name || `کارجو ردیف ${rowNumber}`,
        email: email || '',
        phone: phone || '---',
        role,
        department: derivedDept,
        appliedDate,
        experienceYears,
        currentCompany,
        location: location || '',
        status: calculatedStatus,
        currentStep: calculatedStepNumber,
        matchScore: Math.min(100, Math.round(siteCompletionScore * 10)),
        rating: Math.min(5, Math.max(1, +(jobPriorityScore).toFixed(1))),
        skills: skillsArray,
        education,
        salaryExpectation: requestedSalary || 'مطابق توافق و ردیف بودجه',
        summary: remarks ? `ملاحظات: ${remarks}` : `رزومه دریافتی از طریق ${source} - مسئول پیگیری: ${assignee || 'ثبت در فرآیند'}`,
        notes: [
          `ورود خودکار از شیت Site فایل اکسل (ردیف ${rowNumber})`,
          remarks ? `ملاحظات اولیه: ${remarks}` : '',
          siteIncompletionReason ? `علت عدم تکمیل فرم سایت: ${siteIncompletionReason}` : ''
        ].filter(Boolean),
        isBookmarked: false,

        // 21 Excel fields
        rowNumber,
        trackingCode: trackingCode || `REF-${rowNumber}`,
        assignee: assignee || '',
        resumeSubmissionDate: appliedDate,
        gender: gender || 'مرد',
        nationalId: nationalId || '',
        source,
        siteMessageDate,
        timePassed,
        isMessageReceived,
        isSiteCompleted,
        siteIncompletionReason,
        isResumeApproved,
        jobPriorityScore,
        siteCompletionScore,
        remarks,
        currentStageFa: stageFa || currentStageFa,
        requestedSalary,
        generalNotes: remarks || '',
        stepNotes: remarks ? { [calculatedStepNumber]: remarks } : {},
      };

      parsed.push({
        selected: errors.length === 0,
        isValid: errors.length === 0,
        errors,
        candidate: candidateObj,
        rawRow: row.reduce((acc, cell, i) => {
          const h = headers[i] || `ستون ${i + 1}`;
          acc[h] = cell;
          return acc;
        }, {}),
      });
    }

    setParsedRows(parsed);
  };

  const processWorkbookSheet = (wb: XLSX.WorkBook, sheetName: string) => {
    const ws = wb.Sheets[sheetName];
    if (!ws) {
      setParsedRows([]);
      setRawSheetData([]);
      return;
    }

    const rawData = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '' });
    if (!rawData || rawData.length === 0) {
      setParsedRows([]);
      setRawSheetData([]);
      return;
    }

    setRawSheetData(rawData);
    const { hRow, headers, mapping } = detectHeadersAndMapping(rawData);
    setDetectedHeaders(headers);
    setHeaderRowIdx(hRow);
    setColumnMapping(mapping);

    reparseRowsWithMapping(rawData, hRow, mapping, headers);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      loadFile(selectedFile);
    }
  };

  const loadFile = (uploadedFile: File) => {
    setIsProcessing(true);
    setFile(uploadedFile);
    setImportSuccessCount(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        setWorkbook(wb);
        setAvailableSheets(wb.SheetNames);

        // Auto-select 'Site' or 'site' or 'سایت' if found
        const siteSheet = wb.SheetNames.find(
          s => s.trim().toLowerCase() === 'site' || s.trim() === 'سایت' || s.trim().toLowerCase().includes('site')
        ) || wb.SheetNames[0];

        setSelectedSheet(siteSheet);
        processWorkbookSheet(wb, siteSheet);
      } catch (err) {
        console.error('Error reading excel file:', err);
        alert('خطا در خواندن فایل اکسل. لطفاً از صحت فرمت .xlsx یا .xls اطمینان حاصل نمایید.');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleSheetChange = (newSheet: string) => {
    setSelectedSheet(newSheet);
    if (workbook) {
      processWorkbookSheet(workbook, newSheet);
    }
  };

  const handleMappingChange = (fieldKey: string, newColIdx: number) => {
    const updated = { ...columnMapping, [fieldKey]: newColIdx };
    setColumnMapping(updated);
    reparseRowsWithMapping(rawSheetData, headerRowIdx, updated, detectedHeaders);
  };

  const handleToggleSelectAll = (checked: boolean) => {
    setParsedRows(prev => prev.map(r => ({ ...r, selected: checked })));
  };

  const handleToggleRow = (index: number) => {
    setParsedRows(prev => prev.map((r, idx) => idx === index ? { ...r, selected: !r.selected } : r));
  };

  const handleImport = () => {
    const selectedCandidates = parsedRows.filter(r => r.selected).map(r => r.candidate);
    if (selectedCandidates.length === 0) {
      alert('هیچ کارجویی برای ورود انتخاب نشده است.');
      return;
    }

    onImportCandidates(selectedCandidates);
    setImportSuccessCount(selectedCandidates.length);

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      loadFile(droppedFile);
    }
  };

  const filteredDisplayRows = parsedRows.filter(row => {
    if (activeFilterTab === 'VALID' && !row.isValid) return false;
    if (activeFilterTab === 'WARNINGS' && row.isValid) return false;

    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      row.candidate.name.toLowerCase().includes(q) ||
      row.candidate.role.toLowerCase().includes(q) ||
      (row.candidate.nationalId && row.candidate.nationalId.includes(q)) ||
      (row.candidate.phone && row.candidate.phone.includes(q)) ||
      (row.candidate.trackingCode && row.candidate.trackingCode.toLowerCase().includes(q)) ||
      (row.candidate.source && row.candidate.source.toLowerCase().includes(q))
    );
  });

  const selectedCount = parsedRows.filter(r => r.selected).length;
  const validCount = parsedRows.filter(r => r.isValid).length;
  const warningsCount = parsedRows.filter(r => !r.isValid).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="excel-import-dialog"
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[94vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#131B2E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">{isFa ? 'ورود هوشمند کارجویان از فایل اکسل' : 'Import Candidates from Excel'}</h3>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-mono font-bold">
                  تطبیق دقیق ۲۱ ستون شیت Site
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isFa 
                  ? 'تفکیک دقیق نام و نام خانوادگی، سمت شغلی، منبع، جنسیت، کد ملی و پیگیری پیامک تکمیل سایت' 
                  : 'High-precision mapping of candidate names, target roles, sources, national IDs and site follow-up status'}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Success Message Banner */}
          {importSuccessCount !== null && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">ورود پرونده‌ها با موفقیت انجام شد!</h4>
                <p className="text-xs text-emerald-700">
                  تعداد {importSuccessCount} کارجو با مشخصات کامل وارد سامانه شدند.
                </p>
              </div>
            </div>
          )}

          {/* Upload Area if no file uploaded yet */}
          {!file && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
                isDragging 
                  ? 'border-blue-600 bg-blue-50/50 scale-[0.99]' 
                  : 'border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-base text-slate-800">
                  فایل اکسل کارجویان را اینجا بکشید یا برای انتخاب کلیک کنید
                </h4>
                <p className="text-xs text-slate-500">
                  فرمت‌های مجاز: <code className="text-blue-700 font-mono font-bold">.xlsx</code> و <code className="text-blue-700 font-mono font-bold">.xls</code> — سیستم به‌صورت کاملاً مجزا ستون‌های نام، سمت، منبع و کد ملی را شناسایی می‌کند.
                </p>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-xs font-medium">
                  گام ۱: مشخصات فردی، جنسیت و کد ملی
                </span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-xs font-medium">
                  گام ۲: سمت بکارگیری و محل دریافت رزومه
                </span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-xs font-medium">
                  گام ۳: وضعیت پیام و تکمیل سایت
                </span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-xs font-medium">
                  گام ۴: حقوق درخواستی و اولویت
                </span>
              </div>
            </div>
          )}

          {/* Configuration & Parsed Summary Bar */}
          {file && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    XLSX
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      {file.name}
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      تعداد کل ردیف‌های شناسایی شده: <span className="font-bold text-slate-700">{parsedRows.length} کارجو</span> (ردیف سرفصل: {headerRowIdx + 1})
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Sheet Selector */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-slate-600 font-bold">شیت انتخابی:</label>
                    <select
                      value={selectedSheet}
                      onChange={(e) => handleSheetChange(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
                    >
                      {availableSheets.map(s => (
                        <option key={s} value={s}>
                          {s} {s.toLowerCase() === 'site' ? '(پیش‌فرض کارجویان)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Toggle Column Mapping Panel */}
                  <button
                    type="button"
                    onClick={() => setShowMappingPanel(prev => !prev)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                      showMappingPanel 
                        ? 'bg-blue-50 text-blue-700 border-blue-300' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{showMappingPanel ? 'بستن تنظیم تطبیق ستون‌ها' : 'بررسی و تغییر تطبیق ستون‌ها'}</span>
                  </button>

                  {/* Change File Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setWorkbook(null);
                      setParsedRows([]);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>تغییر فایل</span>
                  </button>
                </div>
              </div>

              {/* Column Mapping Customization Panel */}
              {showMappingPanel && (
                <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold text-blue-950">
                        تطبیق و بررسی ستون‌های فایل اکسل با فیلدهای سیستم
                      </h4>
                    </div>
                    <span className="text-[11px] text-blue-700 font-medium">
                      سیستم ستون‌ها را خودکار تشخیص داده است؛ در صورت تمایل می‌توانید هر ستون را تغییر دهید.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {TARGET_FIELDS.slice(0, 16).map(field => {
                      const currentMappedIdx = columnMapping[field.key];
                      return (
                        <div key={field.key} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                            <span>{field.label} {field.required && <span className="text-rose-500">*</span>}</span>
                          </label>
                          <select
                            value={currentMappedIdx !== undefined ? currentMappedIdx : -1}
                            onChange={(e) => handleMappingChange(field.key, parseInt(e.target.value, 10))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-medium"
                          >
                            <option value={-1}>-- تشخیص خودکار / خالی --</option>
                            {detectedHeaders.map((headerName, idx) => (
                              <option key={idx} value={idx}>
                                ستون {idx + 1}: {headerName}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stats & Search Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveFilterTab('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeFilterTab === 'ALL'
                        ? 'bg-[#131B2E] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    همه ردیف‌ها ({parsedRows.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilterTab('VALID')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeFilterTab === 'VALID'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    آماده ورود ({validCount})
                  </button>
                  {warningsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveFilterTab('WARNINGS')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeFilterTab === 'WARNINGS'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      نیازمند بازبینی ({warningsCount})
                    </button>
                  )}
                </div>

                <div className="relative w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="جستجو در ردیف‌ها (نام، کد ملی، سمت، منبع)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Data Table Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                <div className="max-h-[380px] overflow-y-auto overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#131B2E] text-white sticky top-0 z-10">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={selectedCount > 0 && selectedCount === parsedRows.length}
                            onChange={(e) => handleToggleSelectAll(e.target.checked)}
                            className="rounded-sm border-slate-400 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="p-3 font-bold">ردیف</th>
                        <th className="p-3 font-bold">نام و نام خانوادگی</th>
                        <th className="p-3 font-bold">جنسیت</th>
                        <th className="p-3 font-bold">کد ملی</th>
                        <th className="p-3 font-bold">شماره همراه</th>
                        <th className="p-3 font-bold">سمت بکارگیری</th>
                        <th className="p-3 font-bold">محل دریافت رزومه</th>
                        <th className="p-3 font-bold">مسئول پیگیری</th>
                        <th className="p-3 font-bold">کد ارجاع</th>
                        <th className="p-3 font-bold">تاریخ ثبت</th>
                        <th className="p-3 font-bold">پیام تکمیل سایت</th>
                        <th className="p-3 font-bold">وضعیت تایید</th>
                        <th className="p-3 font-bold">وضعیت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDisplayRows.map((row, index) => {
                        const c = row.candidate;
                        return (
                          <tr
                            key={index}
                            onClick={() => handleToggleRow(index)}
                            className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                              row.selected ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={row.selected}
                                onChange={() => handleToggleRow(index)}
                                className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            <td className="p-3 text-slate-500 font-mono">{c.rowNumber || index + 1}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                  {c.name.split(' ')[0][0] || 'ک'}
                                </div>
                                <span className="font-bold text-slate-900">{c.name}</span>
                              </div>
                            </td>
                            <td className="p-3 text-slate-700">{c.gender || '—'}</td>
                            <td className="p-3 font-mono text-slate-700 font-semibold">{c.nationalId || '—'}</td>
                            <td className="p-3 font-mono text-slate-700">{c.phone}</td>
                            <td className="p-3">
                              <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                {c.role}
                              </span>
                            </td>
                            <td className="p-3 text-slate-700 font-medium">{c.source || '—'}</td>
                            <td className="p-3 text-slate-700">{c.assignee || '—'}</td>
                            <td className="p-3 font-mono text-slate-600 text-[11px]">{c.trackingCode || '—'}</td>
                            <td className="p-3 text-slate-600 text-[11px]">{c.appliedDate}</td>
                            <td className="p-3">
                              <div className="text-[11px]">
                                <span className="block font-bold text-slate-800">{c.isSiteCompleted === 'بلی' ? 'تکمیل شد' : 'عدم تکمیل'}</span>
                                {c.siteMessageDate && <span className="text-[10px] text-slate-500">{c.siteMessageDate}</span>}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                c.isResumeApproved === 'تایید اولیه' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {c.isResumeApproved || 'در حال بررسی'}
                              </span>
                            </td>
                            <td className="p-3">
                              {row.isValid ? (
                                <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                                  <Check className="w-3.5 h-3.5" />
                                  صحیح
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-amber-600 font-bold text-[11px]" title={row.errors.join('، ')}>
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  هشدار
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Controls */}
          {file && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-600">
                <span>تعداد کارجویان انتخاب شده برای ورود: </span>
                <span className="font-bold text-blue-700">{selectedCount}</span>
                <span> از </span>
                <span className="font-bold text-slate-800">{parsedRows.length} کارجو</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  انصراف
                </button>

                <button
                  type="button"
                  onClick={handleImport}
                  disabled={selectedCount === 0}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                    selectedCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                      : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>تایید و ورود {selectedCount} پرونده به سامانه</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
