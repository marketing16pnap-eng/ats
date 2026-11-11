import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Bookmark, 
  Star, 
  Sparkles, 
  Eye, 
  Plus, 
  SlidersHorizontal,
  ArrowUpDown,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Edit3,
  Trash2,
  AlertTriangle,
  FileSpreadsheet,
  LayoutGrid,
  List,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronRight,
  ChevronLeft,
  Send,
  Video,
  Building,
  Award,
  CheckSquare,
  Square,
  MinusSquare,
  RotateCcw,
  Layers
} from 'lucide-react';
import { 
  Candidate, 
  CandidateStatus, 
  AppLanguage, 
  Department, 
  AppUser,
  RecruitmentStepNumber,
  RECRUITMENT_STEPS
} from '../types';
import { sanitizeCandidates } from '../utils/sanitizeData';
import { CandidateApplicationBadge } from '../components/CandidateApplicationBadge';
import { getCandidateApplicationHistory } from '../utils/candidateApplications';

interface CandidatesScreenProps {
  candidates: Candidate[];
  language?: AppLanguage;
  searchQuery?: string;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onToggleBookmark?: (id: string) => void;
  onOpenNewCandidateModal?: () => void;
  onOpenNewCandidate?: () => void;
  onOpenExcelImport?: () => void;
  onEditCandidate?: (candidate: Candidate) => void;
  onDeleteCandidate?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onBulkUpdateStep?: (ids: string[], newStep: RecruitmentStepNumber) => void;
  onOpenScorecard?: (candidate: Candidate) => void;
  departments?: Department[];
  currentUser?: AppUser;
}

export const CandidatesScreen: React.FC<CandidatesScreenProps> = ({
  candidates,
  language = 'PERSIAN',
  searchQuery = '',
  searchTerm = '',
  onSearchChange,
  onSelectCandidate,
  onToggleBookmark,
  onOpenNewCandidateModal,
  onOpenNewCandidate,
  onOpenExcelImport,
  onEditCandidate,
  onDeleteCandidate,
  onBulkDelete,
  onBulkUpdateStep,
  onOpenScorecard,
  departments = [],
  currentUser,
}) => {
  const isFa = language === 'PERSIAN';

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>(() => {
    if (typeof window !== 'undefined') {
      const v = new URLSearchParams(window.location.search).get('view');
      if (v === 'kanban') return 'kanban';
      if (v === 'table') return 'table';
    }
    return 'table';
  });
  const [selectedStepFilter, setSelectedStepFilter] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [onlyMultipleApps, setOnlyMultipleApps] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'step' | 'match' | 'rating' | 'appliedDate'>('step');
  
  // Selection state for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);
  const [bulkStepToSet, setBulkStepToSet] = useState<RecruitmentStepNumber | ''>('');

  const activeSearch = (searchTerm || searchQuery || '').toLowerCase().trim();

  const handleOpenNew = () => {
    if (onOpenNewCandidate) onOpenNewCandidate();
    else if (onOpenNewCandidateModal) onOpenNewCandidateModal();
  };

  const stepsConfig: { stepNumber: RecruitmentStepNumber; titleFa: string; shortTitle: string; color: string; icon: any }[] = [
    { stepNumber: 1, titleFa: 'گام ۱: ثبت در پلتفرم‌ها', shortTitle: 'ثبت اولیه', color: 'border-slate-300 bg-slate-50 text-slate-700', icon: Briefcase },
    { stepNumber: 2, titleFa: 'گام ۲: فرم سایت پناپ', shortTitle: 'فرم سایت', color: 'border-sky-300 bg-sky-50 text-sky-700', icon: Send },
    { stepNumber: 3, titleFa: 'گام ۳: ارسال ویدیو', shortTitle: 'ارسال ویدیو', color: 'border-purple-300 bg-purple-50 text-purple-700', icon: Video },
    { stepNumber: 4, titleFa: 'گام ۴: مصاحبه تلفنی', shortTitle: 'مصاحبه تلفنی', color: 'border-blue-300 bg-blue-50 text-blue-700', icon: Phone },
    { stepNumber: 5, titleFa: 'گام ۵: مصاحبه حضوری', shortTitle: 'مصاحبه حضوری', color: 'border-amber-300 bg-amber-50 text-amber-700', icon: Building },
    { stepNumber: 6, titleFa: 'گام ۶: استعلام پیشزمینه', shortTitle: 'استعلام سوابق', color: 'border-emerald-300 bg-emerald-50 text-emerald-700', icon: ShieldCheck },
    { stepNumber: 7, titleFa: 'گام ۷: تصمیم و استخدام', shortTitle: 'شروع همکاری', color: 'border-green-400 bg-green-50 text-green-800', icon: Award },
  ];

  // Sanitized Candidate List
  const sanitizedList = useMemo(() => sanitizeCandidates(candidates), [candidates]);

  // Unique sources and roles for dropdown filter options
  const uniqueSources = useMemo(() => {
    const defaultSources = [
      'سایت پناپ',
      'جاب ویژن (JobVision)',
      'ای-استخدام (e-estekhdam)',
      'جابینجا (Jobinja)',
      'لینکدین (LinkedIn)',
      'ایران تلنت (IranTalent)',
      'کوئرا (Quera)',
      'معرفی همکاران',
      'کارآموزی / نمایشگاه کار',
    ];
    const extracted = Array.from(new Set(sanitizedList.map(c => c.source).filter(Boolean)));
    return Array.from(new Set([...defaultSources, ...extracted]));
  }, [sanitizedList]);

  const uniqueRoles = useMemo(() => {
    return Array.from(new Set(sanitizedList.map(c => c.role).filter(Boolean))).sort();
  }, [sanitizedList]);

  // Filtering candidates
  const filteredCandidates = useMemo(() => {
    return sanitizedList.filter((candidate) => {
      const matchesSearch = 
        candidate.name.toLowerCase().includes(activeSearch) ||
        candidate.role.toLowerCase().includes(activeSearch) ||
        (candidate.nationalId && candidate.nationalId.includes(activeSearch)) ||
        candidate.phone.includes(activeSearch) ||
        (candidate.trackingCode && candidate.trackingCode.toLowerCase().includes(activeSearch)) ||
        (candidate.source && candidate.source.toLowerCase().includes(activeSearch));

      const matchesDept = selectedDept === 'ALL' || candidate.department === selectedDept;
      const matchesSource = selectedSource === 'ALL' || candidate.source === selectedSource;
      const matchesRole = selectedRole === 'ALL' || candidate.role === selectedRole;
      const matchesBookmark = !onlyBookmarked || candidate.isBookmarked;

      // Status filter
      let matchesStatus = true;
      if (selectedStatusFilter === 'HIRED') {
        matchesStatus = candidate.status === 'HIRED';
      } else if (selectedStatusFilter === 'REJECTED') {
        matchesStatus = candidate.status === 'REJECTED';
      } else if (selectedStatusFilter === 'WITHDRAWN') {
        matchesStatus = candidate.status === 'WITHDRAWN';
      } else if (selectedStatusFilter === 'IN_PROGRESS') {
        matchesStatus = candidate.status !== 'HIRED' && candidate.status !== 'REJECTED' && candidate.status !== 'WITHDRAWN';
      }

      // Step filter
      let matchesStep = true;
      if (selectedStepFilter === 'HIRED') {
        matchesStep = candidate.status === 'HIRED';
      } else if (selectedStepFilter === 'REJECTED') {
        matchesStep = candidate.status === 'REJECTED';
      } else if (selectedStepFilter === 'WITHDRAWN') {
        matchesStep = candidate.status === 'WITHDRAWN';
      } else if (selectedStepFilter !== 'ALL') {
        const stepNum = Number(selectedStepFilter);
        matchesStep = candidate.currentStep === stepNum && candidate.status !== 'REJECTED' && candidate.status !== 'WITHDRAWN' && candidate.status !== 'HIRED';
      }

      // Multiple applications filter
      let matchesMultipleApps = true;
      if (onlyMultipleApps) {
        matchesMultipleApps = getCandidateApplicationHistory(candidate, sanitizedList).length > 0;
      }

      return matchesSearch && matchesDept && matchesSource && matchesRole && matchesStatus && matchesBookmark && matchesStep && matchesMultipleApps;
    });
  }, [sanitizedList, activeSearch, selectedDept, selectedSource, selectedRole, selectedStatusFilter, onlyBookmarked, selectedStepFilter, onlyMultipleApps]);

  // Sorting
  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => {
      if (sortBy === 'step') {
        return (b.currentStep || 1) - (a.currentStep || 1);
      }
      if (sortBy === 'match') {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return (b.appliedDate || '').localeCompare(a.appliedDate || '');
    });
  }, [filteredCandidates, sortBy]);

  // Bulk Selection Handlers
  const isAllSelected = sortedCandidates.length > 0 && selectedIds.length === sortedCandidates.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < sortedCandidates.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedCandidates.map(c => c.id));
    }
  };

  const toggleSelectCandidate = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleExecuteBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (onBulkDelete) {
      onBulkDelete(selectedIds);
    } else if (onDeleteCandidate) {
      selectedIds.forEach(id => onDeleteCandidate(id));
    }
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  const handleExecuteBulkStepUpdate = (newStep: RecruitmentStepNumber) => {
    if (selectedIds.length === 0) return;
    if (onBulkUpdateStep) {
      onBulkUpdateStep(selectedIds, newStep);
    }
    setBulkStepToSet('');
  };

  const hasActiveCustomFilters = 
    selectedDept !== 'ALL' || 
    selectedSource !== 'ALL' || 
    selectedRole !== 'ALL' || 
    selectedStatusFilter !== 'ALL' || 
    selectedStepFilter !== 'ALL' || 
    onlyBookmarked || 
    onlyMultipleApps ||
    Boolean(activeSearch);

  const handleResetFilters = () => {
    setSelectedDept('ALL');
    setSelectedSource('ALL');
    setSelectedRole('ALL');
    setSelectedStatusFilter('ALL');
    setSelectedStepFilter('ALL');
    setOnlyBookmarked(false);
    setOnlyMultipleApps(false);
    if (onSearchChange) onSearchChange('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" dir={isFa ? 'rtl' : 'ltr'}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              فرآیند ۷ مرحله‌ای پناپ
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              بانک کارجوها و مدیریت چرخه جذب
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            پایش مرحله‌به‌مرحله کارجویان از ثبت رزومه در پلتفرم‌ها تا تصمیم نهایی و استخدام قطعی
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              نمای جدولی
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              کانبان ۷ مرحله‌ای
            </button>
          </div>

          {onOpenExcelImport && (
            <button
              onClick={onOpenExcelImport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              ورود اکسل
            </button>
          )}

          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            ثبت متقاضی جدید (گام اول)
          </button>
        </div>
      </div>

      {/* 7-Step Quick Funnel Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedStepFilter('ALL')}
          className={`px-3 py-2 rounded-2xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
            selectedStepFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          همه کارجویان ({sanitizedList.length})
        </button>

        {stepsConfig.map((s) => {
          const count = sanitizedList.filter(
            (c) => c.currentStep === s.stepNumber && c.status !== 'REJECTED' && c.status !== 'WITHDRAWN' && c.status !== 'HIRED'
          ).length;
          const Icon = s.icon;
          return (
            <button
              key={s.stepNumber}
              onClick={() => setSelectedStepFilter(String(s.stepNumber))}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
                selectedStepFilter === String(s.stepNumber)
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.titleFa}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedStepFilter === String(s.stepNumber) ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => setSelectedStepFilter('HIRED')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
            selectedStepFilter === 'HIRED'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>استخدام شده</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
            {sanitizedList.filter((c) => c.status === 'HIRED').length}
          </span>
        </button>

        <button
          onClick={() => setSelectedStepFilter('REJECTED')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
            selectedStepFilter === 'REJECTED'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>رد شده</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800">
            {sanitizedList.filter((c) => c.status === 'REJECTED').length}
          </span>
        </button>

        {/* Filter: Multiple Previous Applications */}
        <button
          onClick={() => setOnlyMultipleApps(!onlyMultipleApps)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
            onlyMultipleApps
              ? 'bg-purple-700 text-white border-purple-700 shadow-xs ring-2 ring-purple-300'
              : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
          }`}
          title="فیلتر متقاضیانی که چندین بار برای پناپ رزومه ارسال کرده‌اند"
        >
          <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
          <span>سوابق ارسال مکرر</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            onlyMultipleApps ? 'bg-purple-800 text-purple-100' : 'bg-purple-100 text-purple-800'
          }`}>
            {sanitizedList.filter((c) => getCandidateApplicationHistory(c, sanitizedList).length > 0).length}
          </span>
        </button>
      </div>

      {/* Advanced Filter Bar (Source, Role, Status, Dept, Search) */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm || searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="جستجو با نام، کد ملی، شماره تماس، سمت شغلی یا کد پیگیری..."
              className="w-full pl-3 pr-10 py-2 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 hover:bg-white transition-colors"
            />
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter: Source */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none font-medium cursor-pointer"
              title="محل دریافت رزومه"
            >
              <option value="ALL">همه منابع رزومه</option>
              {uniqueSources.map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>

            {/* Filter: Role */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none font-medium cursor-pointer"
              title="پست شغلی"
            >
              <option value="ALL">همه سمت‌های شغلی</option>
              {uniqueRoles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {/* Filter: Status */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none font-medium cursor-pointer"
              title="وضعیت پرونده"
            >
              <option value="ALL">همه وضعیت‌ها</option>
              <option value="IN_PROGRESS">در جریان گردش کار</option>
              <option value="HIRED">استخدام قطعی</option>
              <option value="REJECTED">عدم تایید / رد شده</option>
              <option value="WITHDRAWN">انصراف متقاضی</option>
            </select>

            {/* Filter: Department */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none font-medium cursor-pointer"
              title="واحد سازمانی"
            >
              <option value="ALL">همه دپارتمان‌ها</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-2xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none font-medium cursor-pointer"
            >
              <option value="step">مرتب‌سازی: پیشرفت در گام‌ها</option>
              <option value="match">مرتب‌سازی: درصد تطابق</option>
              <option value="rating">مرتب‌سازی: امتیاز ارزیابی</option>
              <option value="appliedDate">مرتب‌سازی: جدیدترین ثبت</option>
            </select>

            {/* Bookmark Filter */}
            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`p-2 rounded-2xl border transition-colors cursor-pointer ${
                onlyBookmarked 
                  ? 'bg-amber-50 border-amber-300 text-amber-600' 
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              title="فقط نشان‌شده‌ها"
            >
              <Bookmark className={`w-4 h-4 ${onlyBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Reset Filters */}
            {hasActiveCustomFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
                title="پاک کردن فیلترها"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>حذف فیلترها</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating / Sticky Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 border border-slate-800 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs">
              {selectedIds.length} نفر انتخاب شده
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              امکان حذف دسته‌جمعی یا تغییر گام برای افراد انتخاب‌شده
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Bulk Step Change Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-slate-300">انتقال گروهی:</span>
              <select
                value={bulkStepToSet}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    handleExecuteBulkStepUpdate(Number(val) as RecruitmentStepNumber);
                  }
                }}
                className="bg-slate-900 text-white text-xs rounded-lg px-2 py-1 border border-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="">انتخاب گام...</option>
                {RECRUITMENT_STEPS.map((s) => (
                  <option key={s.stepNumber} value={s.stepNumber}>
                    گام {s.stepNumber}: {s.shortTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Delete Button */}
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف دسته‌جمعی ({selectedIds.length})</span>
            </button>

            {/* Clear Selection */}
            <button
              onClick={clearSelection}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              لغو انتخاب
            </button>
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 text-[11px] font-bold">
                  {/* Select All Checkbox Column */}
                  <th className="py-3.5 px-4 w-12 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="p-1 rounded-md text-slate-500 hover:text-blue-600 focus:outline-none cursor-pointer flex items-center justify-center"
                      title={isAllSelected ? "لغو انتخاب همه" : "انتخاب همه موارد این صفحه"}
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : isPartiallySelected ? (
                        <MinusSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">متقاضی و مشخصات</th>
                  <th className="py-3.5 px-4">سمت و واحد سازمانی</th>
                  <th className="py-3.5 px-4">منبع و نظام وظیفه</th>
                  <th className="py-3.5 px-4 text-center">گام فعلی در فرآیند پناپ</th>
                  <th className="py-3.5 px-4 text-center">امتیاز تطابق</th>
                  <th className="py-3.5 px-4 text-center">وضعیت</th>
                  <th className="py-3.5 px-4 text-center">اقدامات پرونده</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {sortedCandidates.map((c) => {
                  const stepNum = c.currentStep || 1;
                  const stepObj = stepsConfig.find((s) => s.stepNumber === stepNum);
                  const isHired = c.status === 'HIRED';
                  const isRejected = c.status === 'REJECTED';
                  const isWithdrawn = c.status === 'WITHDRAWN';
                  const isSelected = selectedIds.includes(c.id);

                  return (
                    <tr 
                      key={c.id}
                      onClick={() => onSelectCandidate(c)}
                      className={`cursor-pointer transition-colors group ${
                        isSelected ? 'bg-blue-50/70 hover:bg-blue-50/90' : 'hover:bg-blue-50/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td 
                        className="py-3.5 px-4 text-center" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectCandidate(c.id);
                        }}
                      >
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            className="p-1 rounded-md text-slate-500 hover:text-blue-600 focus:outline-none cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Name & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {c.name}
                              </span>
                              {c.isBookmarked && (
                                <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              )}
                              <CandidateApplicationBadge 
                                candidate={c} 
                                allCandidates={sanitizedList} 
                              />
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="font-mono">{c.phone}</span>
                              {c.nationalId && <span>کد ملی: {c.nationalId}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Dept */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{c.role}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{c.department}</span>
                        </div>
                      </td>

                      {/* Source & Military */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                          {c.source || 'سایت پناپ'}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-slate-400" />
                          <span>{c.militaryStatusFa || 'کارت پایان خدمت'}</span>
                        </div>
                      </td>

                      {/* Step Progress Chip */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                              {stepNum}
                            </span>
                            <span className="font-bold text-[11px]">
                              {stepObj?.shortTitle || `گام ${stepNum}`}
                            </span>
                          </div>
                          {c.skippedSteps && c.skippedSteps.length > 0 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-medium">
                              پرش از گام {c.skippedSteps.join('، ')}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Match Score */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-800 font-mono">
                          {c.matchScore || 85}٪
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isHired ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                            استخدام قطعی
                          </span>
                        ) : isRejected ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                            رد شده (گام {c.rejectionStep || stepNum})
                          </span>
                        ) : isWithdrawn ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[11px]">
                            انصراف
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">
                            در گردش
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectCandidate(c)}
                            className="p-1.5 rounded-xl text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors cursor-pointer"
                            title="مشاهده پرونده و گردش کار"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {onEditCandidate && (
                            <button
                              onClick={() => onEditCandidate(c)}
                              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="ویرایش اطلاعات"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {onDeleteCandidate && (
                            <button
                              onClick={() => setCandidateToDelete(c)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {sortedCandidates.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      متقاضی با مشخصات جستجو شده یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7-STAGE KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {stepsConfig.map((step) => {
            const stepCandidates = sortedCandidates.filter(
              (c) => c.currentStep === step.stepNumber && c.status !== 'REJECTED' && c.status !== 'WITHDRAWN' && c.status !== 'HIRED'
            );
            const Icon = step.icon;

            return (
              <div 
                key={step.stepNumber}
                className="bg-slate-50/80 rounded-3xl p-3 border border-slate-200/80 flex flex-col min-w-[210px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {step.stepNumber}
                    </div>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {step.shortTitle}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                    {stepCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                  {stepCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      onClick={() => onSelectCandidate(cand)}
                      className="p-3 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {cand.name}
                          </span>
                          <CandidateApplicationBadge candidate={cand} allCandidates={sanitizedList} compact />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {cand.trackingCode || cand.id.slice(-4)}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 line-clamp-1">
                        {cand.role}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span className="text-blue-600 font-bold">{cand.source}</span>
                        <span className="font-mono">{cand.phone}</span>
                      </div>
                    </div>
                  ))}

                  {stepCandidates.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-[11px]">
                      پرونده‌ای در این گام نیست
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      {candidateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">حذف پرونده کارجو</h4>
                <p className="text-xs text-slate-500">آیا از حذف متقاضی «{candidateToDelete.name}» مطمئن هستید؟</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCandidateToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  if (onDeleteCandidate && candidateToDelete) {
                    onDeleteCandidate(candidateToDelete.id);
                    setCandidateToDelete(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                حذف قطعی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">حذف دسته‌جمعی کارجوها</h4>
                <p className="text-xs text-slate-500">
                  آیا از حذف دائم <span className="font-bold text-rose-600">{selectedIds.length}</span> پرونده انتخاب شده اطمینان دارید؟
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={handleExecuteBulkDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-rose-600/20"
              >
                تایید و حذف {selectedIds.length} کارجو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
