import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Users, 
  Briefcase, 
  DollarSign, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  ArrowUpDown,
  Mail,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Department, AppLanguage, Candidate, JobRequisition, NavigationTab } from '../types';

interface DepartmentManagementScreenProps {
  departments: Department[];
  candidates: Candidate[];
  requisitions: JobRequisition[];
  language: AppLanguage;
  onOpenNewDepartmentModal: () => void;
  onEditDepartment: (department: Department) => void;
  onDeleteDepartment: (departmentId: string) => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const DepartmentManagementScreen: React.FC<DepartmentManagementScreenProps> = ({
  departments,
  candidates,
  requisitions,
  language,
  onOpenNewDepartmentModal,
  onEditDepartment,
  onDeleteDepartment,
  onNavigateTab,
}) => {
  const isFa = language === 'PERSIAN';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'positions' | 'employees' | 'name'>('positions');
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  // Filtered & Sorted
  const filteredDepartments = departments
    .filter((d) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.nameEn.toLowerCase().includes(q) ||
        (d.code && d.code.toLowerCase().includes(q)) ||
        d.headOfDepartment.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'positions') return (b.openPositionsCount || 0) - (a.openPositionsCount || 0);
      if (sortBy === 'employees') return (b.activeEmployeesCount || 0) - (a.activeEmployeesCount || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'fa');
      return 0;
    });

  // Aggregated Stats
  const totalDepartments = departments.length;
  const totalOpenPositions = departments.reduce((sum, d) => sum + (d.openPositionsCount || 0), 0);
  const totalActiveEmployees = departments.reduce((sum, d) => sum + (d.activeEmployeesCount || 0), 0);

  const handleConfirmDelete = () => {
    if (departmentToDelete) {
      onDeleteDepartment(departmentToDelete.id);
      setDepartmentToDelete(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Delete Confirmation Modal */}
      {departmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div 
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-4 text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">
                {isFa ? 'حذف دپارتمان سازمانی' : 'Delete Department'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {isFa 
                  ? `آیا از حذف دپارتمان «${departmentToDelete.name}» (کد: ${departmentToDelete.code}) اطمینان دارید؟ موقعیت‌های شغلی و رزومه‌های مرتبط باید بازتخصیص شوند.`
                  : `Are you sure you want to delete department "${departmentToDelete.name}" (${departmentToDelete.code})?`}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDepartmentToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {isFa ? 'انصراف' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                {isFa ? 'تایید و حذف دپارتمان' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner & KPI Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">{isFa ? 'تعداد دپارتمان‌های فعال' : 'Active Departments'}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalDepartments}</p>
            <span className="text-[11px] text-blue-600 font-bold mt-0.5 block">{isFa ? 'ساختار مصوب سازمانی' : 'Authorized Org Units'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">{isFa ? 'کل ظرفیت استخدامی مصوب' : 'Open Headcount Target'}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalOpenPositions}</p>
            <span className="text-[11px] text-amber-600 font-bold mt-0.5 block">{isFa ? 'ردیف شغلی باز' : 'Open Requisitions'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">{isFa ? 'تعداد پرسنل فعال سازمان' : 'Active Employees'}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalActiveEmployees}</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">{isFa ? 'نیروی انسانی مستقر' : 'Headcount Total'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">{isFa ? 'کل بودجه تخصیصی جذب' : 'Total Hiring Budget'}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">۱۴.۱ م.ت</p>
            <span className="text-[11px] text-purple-600 font-bold mt-0.5 block">{isFa ? 'میلیارد تومان سال ۱۴۰۳' : 'Approved Budget'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Action Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isFa ? 'جستجوی دپارتمان، کد، مدیر واحد...' : 'Search department, code, manager...'}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all pl-9"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Sort and Create Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-slate-800 font-bold text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="positions">{isFa ? 'مرتب‌سازی: بیشترین موقعیت باز' : 'Sort: Open Positions'}</option>
              <option value="employees">{isFa ? 'مرتب‌سازی: بیشترین پرسنل' : 'Sort: Headcount'}</option>
              <option value="name">{isFa ? 'مرتب‌سازی: نام دپارتمان' : 'Sort: Name'}</option>
            </select>
          </div>

          <button
            onClick={onOpenNewDepartmentModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isFa ? 'تعریف دپارتمان سازمانی جدید' : 'New Department'}</span>
          </button>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((dept) => {
          // Count linked candidates & requisitions
          const linkedCandidatesCount = candidates.filter((c) => c.department === dept.name).length;
          const linkedRequisitionsCount = requisitions.filter((r) => r.department === dept.name).length;

          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-5 relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div 
                className="absolute top-0 right-0 left-0 h-1.5"
                style={{ backgroundColor: dept.color || '#0058BE' }}
              ></div>

              {/* Department Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm"
                      style={{ backgroundColor: dept.color || '#0058BE' }}
                    >
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-slate-900">{dept.name}</h4>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{dept.nameEn}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 font-mono">
                    {dept.code}
                  </span>
                </div>

                {/* Mission / Description */}
                <p className="text-xs text-slate-600 leading-relaxed font-normal mt-4 line-clamp-2">
                  {dept.description}
                </p>

                {/* Manager Card */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">{isFa ? 'مدیر واحد:' : 'Head of Dept:'}</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{dept.headOfDepartment}</span>
                  </div>
                  <a 
                    href={`mailto:${dept.headEmail}`}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                    title={dept.headEmail}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>

                {/* Metrics Stats Row */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                    <span className="text-[10px] text-blue-700 font-bold block">{isFa ? 'ظرفیت باز' : 'Open'}</span>
                    <span className="text-base font-black text-blue-950 mt-0.5 block">{dept.openPositionsCount}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 font-bold block">{isFa ? 'پرسنل' : 'Staff'}</span>
                    <span className="text-base font-black text-emerald-950 mt-0.5 block">{dept.activeEmployeesCount}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="text-[10px] text-purple-700 font-bold block">{isFa ? 'بودجه جذب' : 'Budget'}</span>
                    <span className="text-xs font-black text-purple-950 mt-1 block truncate" title={dept.budgetTotal || '—'}>
                      {(dept.budgetTotal || '—').split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Linked Entities Quick Info */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-3 px-1">
                  <span>{isFa ? `رزومه‌های ثبت‌شده: ${linkedCandidatesCount}` : `Applicants: ${linkedCandidatesCount}`}</span>
                  <span>{isFa ? `ردیف‌های فعال: ${linkedRequisitionsCount}` : `Requisitions: ${linkedRequisitionsCount}`}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 font-mono">
                  {dept.createdAt}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditDepartment(dept)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    title={isFa ? 'ویرایش دپارتمان' : 'Edit Department'}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isFa ? 'ویرایش' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={() => setDepartmentToDelete(dept)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title={isFa ? 'حذف دپارتمان' : 'Delete Department'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
