import React from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  SlidersHorizontal, 
  Plus, 
  Sparkles, 
  Download,
  FileSpreadsheet,
  Calendar,
  ShieldCheck,
  Menu,
  Database,
  RefreshCw,
  LogOut,
  User,
  Camera
} from 'lucide-react';
import { AppLanguage, NavigationTab, AppUser } from '../types';
import { ROLE_DEFINITIONS } from '../mockUsers';
import { DbSyncStatus } from '../services/dbService';
import { NotificationsDropdown } from './NotificationsDropdown';

interface TopHeaderProps {
  currentTab?: NavigationTab;
  language: AppLanguage;
  onToggleLanguage: () => void;
  searchQuery?: string;
  searchTerm?: string;
  onSearchChange?: (q: string) => void;
  onOpenNewCandidateModal?: () => void;
  onOpenNewCandidate?: () => void;
  onOpenNewRequisitionModal?: () => void;
  onOpenNewDepartmentModal?: () => void;
  currentUser: AppUser;
  onOpenRoleSwitcher?: () => void;
  onOpenMobileMenu?: () => void;
  dbStatus?: DbSyncStatus;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  companyLogo?: string;
  onLogout?: () => void;
  onSelectCandidate?: (candidateId: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab = 'CANDIDATES',
  language,
  onToggleLanguage,
  searchQuery,
  searchTerm,
  onSearchChange,
  onOpenNewCandidateModal,
  onOpenNewCandidate,
  onOpenNewRequisitionModal,
  onOpenNewDepartmentModal,
  currentUser,
  onOpenRoleSwitcher,
  onOpenMobileMenu,
  dbStatus = 'CONNECTED',
  onRefreshData,
  isRefreshing = false,
  companyLogo = '',
  onLogout,
  onSelectCandidate,
}) => {
  const isFa = language === 'PERSIAN';
  const roleMeta = ROLE_DEFINITIONS[currentUser.role] || ROLE_DEFINITIONS.SUPER_ADMIN;
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const effectiveSearch = searchQuery !== undefined ? searchQuery : (searchTerm || '');
  const handleSearch = (val: string) => {
    if (onSearchChange) onSearchChange(val);
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case 'DASHBOARD':
        return isFa ? 'میز کار و داشبورد تصمیم‌گیری' : 'Executive Command Center';
      case 'CANDIDATES':
        return isFa ? 'بانک جامع کارجویان' : 'Candidate Pipeline & Dossiers';
      case 'REQUISITIONS':
        return isFa ? 'مدیریت ردیف‌های شغلی' : 'Job Requisitions & Headcount';
      case 'DEPARTMENTS':
        return isFa ? 'مدیریت دپارتمان‌ها و ساختار' : 'Organizational Departments';
      case 'INTERVIEWS':
        return isFa ? 'مرکز ارزیابی و مصاحبه' : 'Assessment Center & Scorecards';
      case 'ANALYTICS':
        return isFa ? 'گزارشات و هوش تجاری' : 'Talent Velocity & BI';
      case 'USERS':
        return isFa ? 'مدیریت کاربران و دسترسی (RBAC)' : 'User Directory & Permissions';
      case 'SETTINGS':
        return isFa ? 'تنظیمات و سیاست‌های سامانه' : 'Authority Governance & ATS';
      default:
        return isFa ? 'سامانه پناپ ATS' : 'Panap ATS';
    }
  };

  return (
    <header 
      id="top-header"
      className="h-16 md:h-20 bg-white border-b border-slate-200/90 px-3 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs"
    >
      {/* Left side: Mobile Menu Button + Page Title & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0"
            title={isFa ? 'منوی اصلی' : 'Toggle Navigation'}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 tracking-tight truncate">
            {getPageTitle()}
          </h2>
          <div className="hidden sm:flex items-center gap-1.5 md:gap-2 text-[11px] md:text-xs text-slate-500 font-medium mt-0.5">
            <span>{isFa ? 'سامانه پناپ ATS' : 'Panap ATS'}</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold truncate">{getPageTitle().split(' ')[0]}</span>
            <span>/</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {isFa ? 'دسترسی فعال' : 'Active RBAC'}
            </span>
            <span>/</span>
            {dbStatus === 'CONNECTED' ? (
              <span className="inline-flex items-center gap-1 text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-200 text-[10px]">
                <Database className="w-3 h-3 text-teal-600" />
                <span>{isFa ? 'دیتابیس MySQL: متصل' : 'MySQL: Connected'}</span>
              </span>
            ) : dbStatus === 'CONNECTING' ? (
              <span className="inline-flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200 text-[10px] animate-pulse">
                <Database className="w-3 h-3 text-blue-600" />
                <span>{isFa ? 'اتصال به دیتابیس...' : 'MySQL Sync...'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200 text-[10px]">
                <Database className="w-3 h-3 text-amber-600" />
                <span>{isFa ? 'حالت آفلاین (LocalStorage)' : 'Local Storage'}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Controls & Search */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        {/* Global Search Input */}
        <div className="relative w-40 sm:w-56 md:w-64 hidden md:block">
          <input
            id="global-search-input"
            type="text"
            value={effectiveSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={isFa ? 'جستجوی کارجو، مهارت...' : 'Search candidate, role...'}
            className="w-full bg-slate-100/90 border border-slate-200 rounded-xl px-3 py-1.5 md:py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all pl-8"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 md:top-3" />
        </div>

        {/* System Documentation Excel Download Button */}
        <a
          href="/panap-ats-system-documentation.xlsx"
          download="panap-ats-system-documentation.xlsx"
          id="btn-header-download-system-docs"
          title={isFa ? 'دانلود مستندات کامل ساختار سامانه، فرآیندها و پایگاه داده (فایل اکسل جامع ۶ برگه)' : 'Download Full System Architecture & Database Documentation (Excel)'}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 md:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">{isFa ? 'مستندات سیستم (Excel)' : 'System Docs (Excel)'}</span>
          <Download className="w-3.5 h-3.5 text-emerald-600" />
        </a>

        {/* System Screenshots ZIP Download Button */}
        <a
          href="/panap-ats-screenshots.zip"
          download="panap-ats-screenshots.zip"
          id="btn-header-download-screenshots-zip"
          title={isFa ? 'دانلود تصاویر و اسکرین‌شات‌های باکیفیت کلیه بخش‌ها و منوهای سامانه (فایل ZIP)' : 'Download Full App UI Screenshots (ZIP Archive)'}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 md:py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group shrink-0"
        >
          <Camera className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">{isFa ? 'اسکرین‌شات‌ها (ZIP)' : 'Screenshots (ZIP)'}</span>
          <Download className="w-3.5 h-3.5 text-blue-600" />
        </a>

        {/* Database Refresh Button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className={`p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
            title={isFa ? 'تازه‌سازی داده‌ها از سرور' : 'Refresh Server Data'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* User Identity Display Badge (Role switcher removed as requested) */}
        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover border border-white shadow-2xs shrink-0"
              onError={(e) => {
                // Fallback to initial circle if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${roleMeta.badgeBg?.includes('rose') ? 'bg-rose-500' : roleMeta.badgeBg?.includes('blue') ? 'bg-blue-500' : roleMeta.badgeBg?.includes('purple') ? 'bg-purple-500' : roleMeta.badgeBg?.includes('amber') ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          )}
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-black text-slate-900 leading-tight truncate max-w-[90px] sm:max-w-[130px]">
              {currentUser.name}
            </span>
            <span className="text-[9px] text-blue-700 font-bold leading-none mt-0.5">
              {isFa ? (currentUser.roleTitleFa || roleMeta.titleFa.split('(')[0]) : (currentUser.roleTitleEn || currentUser.role)}
            </span>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <NotificationsDropdown
          language={language}
          onSelectCandidate={onSelectCandidate}
        />

        {/* Language Switcher */}
        <button
          id="btn-language-toggle"
          onClick={onToggleLanguage}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
          <span className="hidden xs:inline">{isFa ? 'EN' : 'فا'}</span>
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button
            id="btn-header-logout"
            onClick={onLogout}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition-colors cursor-pointer"
            title={isFa ? 'خروج امن از حساب کاربری' : 'Sign Out'}
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden md:inline">{isFa ? 'خروج' : 'Logout'}</span>
          </button>
        )}

        {/* Action Button: Add Candidate */}
        {(onOpenNewCandidateModal || onOpenNewCandidate) && (
          <button
            onClick={() => {
              if (onOpenNewCandidate) onOpenNewCandidate();
              else if (onOpenNewCandidateModal) onOpenNewCandidateModal();
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{isFa ? 'افزودن کارجو' : 'Add Candidate'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
