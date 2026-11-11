import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Building2,
  CalendarCheck, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  LogOut,
  UserCheck,
  Lock,
  ArrowRightLeft,
  X,
  Globe,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { NavigationTab, AppLanguage, AppUser } from '../types';
import { ROLE_DEFINITIONS } from '../mockUsers';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  language: AppLanguage;
  totalApplicants?: number;
  activeRequisitions?: number;
  departmentsCount?: number;
  currentUser: AppUser;
  onLogout: () => void;
  onOpenRoleSwitcher: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  companyLogo?: string;
  companyName?: string;
  companySubtitle?: string;
  onOpenPublicForm?: () => void;
  onOpenCandidatePortal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  language,
  totalApplicants = 28,
  activeRequisitions = 6,
  departmentsCount = 6,
  currentUser,
  onLogout,
  onOpenRoleSwitcher,
  isMobileOpen = false,
  onCloseMobile,
  companyLogo = '',
  companyName,
  companySubtitle,
  onOpenPublicForm,
  onOpenCandidatePortal,
}) => {
  const isFa = language === 'PERSIAN';
  const roleMeta = ROLE_DEFINITIONS[currentUser.role] || ROLE_DEFINITIONS.SUPER_ADMIN;

  // Determine if a module is allowed for the user
  const canAccessCandidates = currentUser.permissions?.includes('MANAGE_CANDIDATES') || currentUser.permissions?.includes('VIEW_DASHBOARD');
  const canAccessRequisitions = currentUser.permissions?.includes('MANAGE_REQUISITIONS');
  const canAccessInterviews = currentUser.permissions?.includes('SCHEDULE_INTERVIEWS') || currentUser.permissions?.includes('SUBMIT_SCORECARDS');
  const canAccessAnalytics = currentUser.permissions?.includes('VIEW_ANALYTICS');
  const canAccessUsers = currentUser.permissions?.includes('MANAGE_USERS') || currentUser.role === 'SUPER_ADMIN';
  const canAccessSettings = currentUser.permissions?.includes('MANAGE_SYSTEM_SETTINGS') || currentUser.role === 'SUPER_ADMIN';

  const menuItems: {
    id: NavigationTab;
    label: string;
    icon: any;
    badge: string | null;
    isAllowed: boolean;
    lockReason?: string;
  }[] = [
    {
      id: 'DASHBOARD',
      label: isFa ? 'داشبورد کانبان جذب' : 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: null,
      isAllowed: true,
    },
    {
      id: 'CANDIDATES',
      label: isFa ? 'بانک کارجویان' : 'Candidate Pipeline',
      icon: Users,
      badge: totalApplicants.toString(),
      isAllowed: canAccessCandidates,
      lockReason: isFa ? 'نیازمند مجوز متقاضیان' : 'Requires candidate access',
    },
    {
      id: 'REQUISITIONS',
      label: isFa ? 'موقعیت‌های شغلی' : 'Job Requisitions',
      icon: Briefcase,
      badge: activeRequisitions.toString(),
      isAllowed: canAccessRequisitions,
      lockReason: isFa ? 'نیازمند مجوز مدیریت ظرفیت' : 'Requires requisition access',
    },
    {
      id: 'DEPARTMENTS',
      label: isFa ? 'دپارتمان‌های سازمانی' : 'Departments',
      icon: Building2,
      badge: `${departmentsCount}`,
      isAllowed: true,
    },
    {
      id: 'INTERVIEWS',
      label: isFa ? 'مرکز ارزیابی و مصاحبه' : 'Assessment Center',
      icon: CalendarCheck,
      badge: isFa ? '۳ فعال' : '3 Active',
      isAllowed: canAccessInterviews,
      lockReason: isFa ? 'نیازمند مجوز مصاحبه' : 'Requires interview access',
    },
    {
      id: 'ANALYTICS',
      label: isFa ? 'گزارشات و هوش تجاری' : 'BI Talent Analytics',
      icon: BarChart3,
      badge: null,
      isAllowed: canAccessAnalytics,
      lockReason: isFa ? 'نیازمند مجوز گزارشات' : 'Requires analytics access',
    },
    {
      id: 'USERS',
      label: isFa ? 'کاربران و سطوح دسترسی' : 'Users & Permissions',
      icon: UserCheck,
      badge: isFa ? 'RBAC' : 'RBAC',
      isAllowed: canAccessUsers,
      lockReason: isFa ? 'مخصوص راهبر کل' : 'Super Admin Only',
    },
    {
      id: 'SETTINGS',
      label: isFa ? 'تنظیمات سامانه' : 'System Authority',
      icon: Settings,
      badge: null,
      isAllowed: canAccessSettings,
      lockReason: isFa ? 'مخصوص راهبر کل' : 'Super Admin Only',
    },
  ];

  const handleTabClick = (tabId: NavigationTab, isAllowed: boolean) => {
    if (isAllowed) {
      onSelectTab(tabId);
      if (onCloseMobile) {
        onCloseMobile();
      }
    }
  };

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#131B2E] text-slate-200 select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt="Logo"
              className="h-10 max-w-[85px] object-contain rounded-xl p-1 bg-white/10 border border-white/20 shadow-xs shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40 text-white font-bold text-lg shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-white text-base tracking-tight truncate max-w-[150px]" title={companyName || (isFa ? 'سامانه پناپ ATS' : 'Panap ATS System')}>
                {companyName || (isFa ? 'سامانه پناپ ATS' : 'Panap ATS System')}
              </h1>
              <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-500/30 shrink-0">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate max-w-[150px]" title={companySubtitle || (isFa ? 'مدیریت جذب و ارزیابی شایستگی' : 'Talent Authority Platform')}>
              {companySubtitle || (isFa ? 'مدیریت جذب و ارزیابی شایستگی' : 'Talent Authority Platform')}
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Active Role Indicator Card */}
      <div className="mx-3 sm:mx-4 my-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[11px] font-bold text-slate-300">
              {isFa ? 'نقش فعال شما:' : 'Current Role:'}
            </span>
          </div>
          {isSuperAdmin && (
            <button
              onClick={onOpenRoleSwitcher}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
              title={isFa ? 'تغییر نقش تستی' : 'Switch Role'}
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>{isFa ? 'تغییر نقش' : 'Switch'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${roleMeta.badgeBg}`}>
            {currentUser.role}
          </span>
          <span className="text-xs font-bold text-white truncate">
            {isFa ? roleMeta.titleFa.split('(')[0] : roleMeta.titleEn}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-1 pt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {isFa ? 'بخش‌های سامانه' : 'Core Modules'}
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isAllowed = item.isAllowed;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id.toLowerCase()}`}
              onClick={() => handleTabClick(item.id, isAllowed)}
              disabled={!isAllowed}
              title={!isAllowed ? item.lockReason : undefined}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 relative text-right ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/40'
                  : isAllowed
                  ? 'text-slate-300 hover:bg-slate-800/70 hover:text-white cursor-pointer'
                  : 'text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : isAllowed ? 'text-slate-400' : 'text-slate-600'}`} />
                <span>{item.label}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                {!isAllowed && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isAllowed
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Public Career Site Link */}
        {onOpenPublicForm && (
          <div className="pt-2">
            <button
              onClick={onOpenPublicForm}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>فرم ثبت‌نام سایت (وردپرس)</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                Web Form
              </span>
            </button>
          </div>
        )}

        {/* Candidate Self-Service Tracking Portal Preview Link */}
        {onOpenCandidatePortal && (
          <div className="pt-1.5">
            <button
              onClick={onOpenCandidatePortal}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>{isFa ? 'پرتال رهگیری کارجویان' : 'Candidate Portal'}</span>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                Portal
              </span>
            </button>
          </div>
        )}

        {/* System Documentation Excel Download Button */}
        <div className="pt-1.5">
          <a
            href="/panap-ats-system-documentation.xlsx"
            download="panap-ats-system-documentation.xlsx"
            id="btn-sidebar-download-system-docs"
            title={isFa ? 'دانلود مستندات کامل ساختار، فرآیندها و پایگاه داده (فایل اکسل جامع ۶ برگه)' : 'Download Full System & DB Documentation (Excel)'}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/60 transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>{isFa ? 'مستندات سیستم (Excel)' : 'System Docs (Excel)'}</span>
            </div>
            <Download className="w-3.5 h-3.5 text-emerald-400" />
          </a>
        </div>
      </nav>

      {/* User Footer Profile & Actions */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div 
            onClick={isSuperAdmin ? onOpenRoleSwitcher : undefined}
            className={`flex items-center gap-3 group flex-1 ${isSuperAdmin ? 'cursor-pointer' : ''}`}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-2xl object-cover border border-slate-700 group-hover:border-blue-400 transition-colors"
            />
            <div className="text-right overflow-hidden">
              <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                {isFa ? currentUser.name : currentUser.nameEn}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {isFa ? currentUser.department : currentUser.departmentEn}
              </p>
            </div>
          </div>

          <button 
            id="btn-logout"
            onClick={onLogout}
            title={isFa ? 'خروج از حساب کاربری' : 'Logout'} 
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (hidden on screens < lg) */}
      <aside 
        id="sidebar-navigation"
        className="hidden lg:flex w-72 bg-[#131B2E] text-slate-200 flex-col shrink-0 border-l border-slate-800/80 shadow-xl select-none z-30 transition-all duration-300 min-h-screen"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay (visible on screens < lg when isMobileOpen is true) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
          />
          {/* Slide-over drawer */}
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
