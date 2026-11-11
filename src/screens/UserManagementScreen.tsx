import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Lock, 
  KeyRound, 
  Edit3, 
  Trash2, 
  ShieldAlert, 
  Clock, 
  Activity,
  Check,
  X,
  Sparkles,
  Building,
  UserCheck,
  Ban,
  RefreshCw,
  Eye,
  LogIn,
  Camera,
  Upload,
  User
} from 'lucide-react';
import { AppUser, UserRole, PermissionKey, AuditLog, AppLanguage } from '../types';
import { ROLE_DEFINITIONS, ALL_PERMISSIONS, INITIAL_AUDIT_LOGS, INITIAL_USERS } from '../mockUsers';

interface UserManagementScreenProps {
  language?: AppLanguage;
  currentUser?: AppUser;
  users?: AppUser[];
  onAddUser?: (user: AppUser) => void;
  onUpdateUser?: (user: AppUser) => void;
  onDeleteUser?: (userId: string) => void;
  onSwitchUser?: (user: AppUser) => void;
}

export const UserManagementScreen: React.FC<UserManagementScreenProps> = ({
  language = 'PERSIAN',
  currentUser,
  users: initialUsersProp,
  onAddUser: onAddUserProp,
  onUpdateUser: onUpdateUserProp,
  onDeleteUser: onDeleteUserProp,
  onSwitchUser,
}) => {
  const isFa = language === 'PERSIAN';
  const [internalUsers, setInternalUsers] = useState<AppUser[]>(initialUsersProp || INITIAL_USERS);
  const users = initialUsersProp || internalUsers;

  useEffect(() => {
    if (initialUsersProp) {
      setInternalUsers(initialUsersProp);
    }
  }, [initialUsersProp]);

  const onAddUser = (user: AppUser) => {
    if (onAddUserProp) onAddUserProp(user);
    setInternalUsers((prev) => [user, ...prev]);
  };

  const onUpdateUser = (user: AppUser) => {
    if (onUpdateUserProp) onUpdateUserProp(user);
    setInternalUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
  };

  const onDeleteUser = (userId: string) => {
    if (onDeleteUserProp) onDeleteUserProp(userId);
    setInternalUsers((prev) => prev.filter((u) => u.id !== userId));
  };
  const [activeSubTab, setActiveSubTab] = useState<'USERS' | 'MATRIX' | 'AUDIT'>('USERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  
  // Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<AppUser | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for User Modal
  const [formData, setFormData] = useState<{
    name: string;
    nameEn: string;
    email: string;
    username: string;
    role: UserRole;
    department: string;
    phone: string;
    personnelCode: string;
    permissions: PermissionKey[];
    avatarUrl: string;
  }>({
    name: '',
    nameEn: '',
    email: '',
    username: '',
    role: 'HR_RECRUITER',
    department: 'منابع انسانی و جذب',
    phone: '',
    personnelCode: '',
    permissions: ROLE_DEFINITIONS.HR_RECRUITER.defaultPermissions,
    avatarUrl: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast(isFa ? 'حجم تصویر نباید بیشتر از ۲ مگابایت باشد.' : 'Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, avatarUrl: event.target!.result as string }));
          showToast(isFa ? 'عکس پروفایل با موفقیت بارگذاری شد.' : 'Profile photo uploaded successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      nameEn: '',
      email: '',
      username: '',
      role: 'HR_RECRUITER',
      department: 'منابع انسانی و جذب',
      phone: '',
      personnelCode: `PNP-${Math.floor(1000 + Math.random() * 9000)}`,
      permissions: ROLE_DEFINITIONS.HR_RECRUITER.defaultPermissions,
      avatarUrl: '',
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (user: AppUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      nameEn: user.nameEn || '',
      email: user.email || '',
      username: user.username || '',
      role: user.role,
      department: user.department || 'منابع انسانی و جذب',
      phone: user.phone || '',
      personnelCode: user.personnelCode || '',
      permissions: user.permissions || ROLE_DEFINITIONS[user.role].defaultPermissions,
      avatarUrl: user.avatarUrl || '',
    });
    setIsUserModalOpen(true);
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
      permissions: ROLE_DEFINITIONS[role].defaultPermissions,
    }));
  };

  const handleTogglePermission = (permKey: PermissionKey) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permKey);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter((k) => k !== permKey) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permKey] };
      }
    });
  };

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      const updated: AppUser = {
        ...editingUser,
        name: formData.name,
        nameEn: formData.nameEn || formData.name,
        email: formData.email,
        username: formData.username || formData.email.split('@')[0],
        role: formData.role,
        roleTitleFa: ROLE_DEFINITIONS[formData.role].titleFa,
        roleTitleEn: ROLE_DEFINITIONS[formData.role].titleEn,
        department: formData.department,
        departmentEn: formData.department,
        phone: formData.phone,
        personnelCode: formData.personnelCode,
        permissions: formData.permissions,
        avatarUrl: formData.avatarUrl || editingUser.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      };
      onUpdateUser(updated);
      showToast(isFa ? `اطلاعات کاربر ${updated.name} با موفقیت ویرایش شد.` : 'User updated successfully');
    } else {
      const newUser: AppUser = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        nameEn: formData.nameEn || formData.name,
        email: formData.email,
        username: formData.username || formData.email.split('@')[0],
        role: formData.role,
        roleTitleFa: ROLE_DEFINITIONS[formData.role].titleFa,
        roleTitleEn: ROLE_DEFINITIONS[formData.role].titleEn,
        department: formData.department,
        departmentEn: formData.department,
        avatarUrl: formData.avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        status: 'ACTIVE',
        lastLogin: 'تاکنون وارد نشده',
        createdAt: 'امروز',
        phone: formData.phone,
        personnelCode: formData.personnelCode || `PNP-${Math.floor(1000 + Math.random() * 9000)}`,
        permissions: formData.permissions,
      };
      onAddUser(newUser);
      showToast(isFa ? `حساب کاربری جدید برای ${newUser.name} با موفقیت ایجاد شد.` : 'New user created successfully');
    }
    setIsUserModalOpen(false);
  };

  const handleToggleStatus = (user: AppUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    onUpdateUser({ ...user, status: newStatus });
    showToast(
      isFa
        ? `وضعیت کاربر ${user.name} به ${newStatus === 'ACTIVE' ? 'فعال' : 'معلق'} تغییر یافت.`
        : `User status changed to ${newStatus}`
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.personnelCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    return matchSearch && matchRole;
  });

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-l from-[#131B2E] via-slate-900 to-blue-950 rounded-3xl p-6 lg:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isFa ? 'مدیریت احراز هویت و دسترسی سازمانی (RBAC)' : 'Role-Based Access Control'}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              {isFa ? 'مدیریت کاربران و سطوح دسترسی' : 'Users & Access Permissions'}
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {isFa
                ? 'تعریف کاربران سازمانی، تخصیص سطوح دسترسی ۵ گانه، ماتریس مجوزهای ریزدانه، لاگ‌های امنیتی و مانیتورینگ نشست‌های فعال.'
                : 'Manage enterprise user accounts, assign 5 role tiers, configure granular permissions matrix, and review audit logs.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isSuperAdmin && (
              <button
                id="btn-create-user"
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/50 transition-all cursor-pointer hover:scale-102"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isFa ? 'تعریف کاربر جدید سازمانی' : 'New User Account'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Stats Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-white">{users.length} نفر</span>
              <p className="text-[11px] text-slate-400">{isFa ? 'کاربران ثبت‌شده' : 'Registered Users'}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-emerald-400">
                {users.filter((u) => u.status === 'ACTIVE').length} فعال
              </span>
              <p className="text-[11px] text-slate-400">{isFa ? 'حساب‌های مجاز' : 'Active Accounts'}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-purple-400">۵ نقش</span>
              <p className="text-[11px] text-slate-400">{isFa ? 'سطوح دسترسی مصوب' : 'RBAC Roles'}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-amber-400">۲۵۶-Bit</span>
              <p className="text-[11px] text-slate-400">{isFa ? 'رمزنگاری داده‌ها' : 'Security Standard'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('USERS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'USERS'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isFa ? 'فهرست کاربران سازمانی' : 'User Directory'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
              {filteredUsers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('MATRIX')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'MATRIX'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isFa ? 'ماتریس دسترسی‌ها و مجوزها' : 'Permissions Matrix'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('AUDIT')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'AUDIT'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{isFa ? 'لاگ‌های امنیتی و رویدادها' : 'Security Audit Trail'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeSubTab === 'USERS' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFa ? 'جستجو بر اساس نام، کد، دپارتمان یا ایمیل...' : 'Search users...'}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 shrink-0">
                {isFa ? 'فیلتر نقش:' : 'Role Filter:'}
              </span>
              {['ALL', 'SUPER_ADMIN', 'TALENT_DIRECTOR', 'TECH_LEAD', 'HR_RECRUITER', 'EXECUTIVE_AUDITOR'].map(
                (roleKey) => (
                  <button
                    key={roleKey}
                    onClick={() => setSelectedRoleFilter(roleKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      selectedRoleFilter === roleKey
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {roleKey === 'ALL'
                      ? isFa
                        ? 'همه نقش‌ها'
                        : 'All Roles'
                      : roleKey}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4 px-6">{isFa ? 'نام و مشخصات کاربر' : 'User Profile'}</th>
                    <th className="p-4">{isFa ? 'کد پرسنلی' : 'Personnel ID'}</th>
                    <th className="p-4">{isFa ? 'نقش و سطح دسترسی' : 'Role Tier'}</th>
                    <th className="p-4">{isFa ? 'دپارتمان' : 'Department'}</th>
                    <th className="p-4">{isFa ? 'وضعیت حساب' : 'Status'}</th>
                    <th className="p-4">{isFa ? 'آخرین ورود' : 'Last Login'}</th>
                    <th className="p-4 px-6 text-center">{isFa ? 'عملیات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u, uIdx) => {
                    const roleMeta = ROLE_DEFINITIONS[u.role] || ROLE_DEFINITIONS.HR_RECRUITER;
                    const isSelf = currentUser ? u.id === currentUser.id : false;

                    return (
                      <tr key={`${u.id || 'user'}-${uIdx}`} className="hover:bg-slate-50/80 transition-colors">
                        {/* Profile Info */}
                        <td className="p-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatarUrl}
                              alt={u.name}
                              className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-slate-900 text-sm">
                                  {isFa ? u.name : u.nameEn}
                                </span>
                                {isSelf && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
                                    {isFa ? 'شما' : 'You'}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 block font-mono">
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Personnel Code */}
                        <td className="p-4 font-mono font-bold text-slate-700">
                          {u.personnelCode}
                        </td>

                        {/* Role Badge */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-bold border ${roleMeta.badgeBg}`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{isFa ? u.roleTitleFa : u.roleTitleEn}</span>
                          </span>
                        </td>

                        {/* Department */}
                        <td className="p-4 text-slate-600 font-medium">
                          {isFa ? u.department : u.departmentEn}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          {u.status === 'ACTIVE' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isFa ? 'فعال' : 'Active'}</span>
                            </span>
                          )}
                          {u.status === 'SUSPENDED' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl">
                              <Ban className="w-3.5 h-3.5" />
                              <span>{isFa ? 'معلق / مسدود' : 'Suspended'}</span>
                            </span>
                          )}
                          {u.status === 'ON_LEAVE' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{isFa ? 'مرخصی' : 'On Leave'}</span>
                            </span>
                          )}
                        </td>

                        {/* Last Login */}
                        <td className="p-4 text-slate-500 font-medium text-[11px]">
                          {u.lastLogin}
                        </td>

                        {/* Actions */}
                        <td className="p-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {/* Super Admin Enter User Panel Button */}
                            {!isSelf && onSwitchUser && (
                              <button
                                onClick={() => onSwitchUser(u)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 hover:text-indigo-950 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
                                title={isFa ? `ورود مستقیم به پنل کاربری ${u.name}` : `Login to ${u.name}'s panel`}
                              >
                                <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                                <span>{isFa ? 'ورود به پنل' : 'Enter Panel'}</span>
                              </button>
                            )}

                            {isSuperAdmin && (
                              <>
                                <button
                                  onClick={() => handleOpenEditModal(u)}
                                  className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                  title={isFa ? 'ویرایش اطلاعات و دسترسی‌ها' : 'Edit User & Permissions'}
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedUserForPassword(u);
                                    setIsPasswordModalOpen(true);
                                  }}
                                  className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                                  title={isFa ? 'تغییر رمز عبور' : 'Reset Password'}
                                >
                                  <KeyRound className="w-4 h-4" />
                                </button>

                                {!isSelf && (
                                  <button
                                    onClick={() => handleToggleStatus(u)}
                                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                      u.status === 'ACTIVE'
                                        ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                                        : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                    title={
                                      u.status === 'ACTIVE'
                                        ? isFa
                                          ? 'مسدودسازی موقت'
                                          : 'Suspend'
                                        : isFa
                                        ? 'فعال‌سازی مجدد'
                                        : 'Activate'
                                    }
                                  >
                                    {u.status === 'ACTIVE' ? (
                                      <Ban className="w-4 h-4" />
                                    ) : (
                                      <CheckCircle2 className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                              </>
                            )}

                            {!isSuperAdmin && (
                              <span className="text-[11px] text-slate-400 italic">
                                {isFa ? 'مشاهده فقط' : 'Read Only'}
                              </span>
                            )}
                          </div>
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

      {/* TAB 2: PERMISSIONS MATRIX */}
      {activeSubTab === 'MATRIX' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs text-blue-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-sm block">
                {isFa ? 'ماتریس دسترسی‌های سازمانی پناپ ATS (RBAC Security Model)' : 'Panap ATS RBAC Matrix'}
              </span>
              <p className="mt-0.5 leading-relaxed text-blue-800">
                {isFa
                  ? 'این جدول شفاف نشان‌دهنده مجوزهای فعال هر یک از ۵ نقش سازمانی است. برای تغییر این مجوزها می‌توانید روی دکمه ویرایش هر کاربر کلیک نمایید.'
                  : 'Displays mapped granular permissions across each of the 5 standard corporate roles.'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold">
                    <th className="p-4 px-6">{isFa ? 'عنوان مجوز و شرح عملکرد' : 'Permission & Scope'}</th>
                    <th className="p-4 text-center">{isFa ? 'راهبر کل (Super Admin)' : 'Super Admin'}</th>
                    <th className="p-4 text-center">{isFa ? 'مدیر ارشد جذب (Talent Dir)' : 'Talent Dir'}</th>
                    <th className="p-4 text-center">{isFa ? 'مدیر فنی (Tech Lead)' : 'Tech Lead'}</th>
                    <th className="p-4 text-center">{isFa ? 'کارشناس جذب (Recruiter)' : 'HR Recruiter'}</th>
                    <th className="p-4 text-center">{isFa ? 'ناظر ارشد (Auditor)' : 'Auditor'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ALL_PERMISSIONS.map((perm) => (
                    <tr key={perm.key} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 px-6">
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-slate-900 block text-xs">
                            {isFa ? perm.nameFa : perm.nameEn}
                          </span>
                          <span className="text-[11px] text-slate-400 block leading-tight">
                            {isFa ? perm.descriptionFa : perm.descriptionEn}
                          </span>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 font-mono text-[10px] rounded-md font-bold">
                            {isFa ? perm.categoryFa : perm.categoryEn}
                          </span>
                        </div>
                      </td>

                      {/* Super Admin */}
                      <td className="p-4 text-center">
                        {ROLE_DEFINITIONS.SUPER_ADMIN.defaultPermissions.includes(perm.key) ? (
                          <div className="inline-flex p-1 rounded-lg bg-emerald-100 text-emerald-700">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex p-1 rounded-lg bg-slate-100 text-slate-300">
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </td>

                      {/* Talent Director */}
                      <td className="p-4 text-center">
                        {ROLE_DEFINITIONS.TALENT_DIRECTOR.defaultPermissions.includes(perm.key) ? (
                          <div className="inline-flex p-1 rounded-lg bg-emerald-100 text-emerald-700">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex p-1 rounded-lg bg-slate-100 text-slate-300">
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </td>

                      {/* Tech Lead */}
                      <td className="p-4 text-center">
                        {ROLE_DEFINITIONS.TECH_LEAD.defaultPermissions.includes(perm.key) ? (
                          <div className="inline-flex p-1 rounded-lg bg-emerald-100 text-emerald-700">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex p-1 rounded-lg bg-slate-100 text-slate-300">
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </td>

                      {/* Recruiter */}
                      <td className="p-4 text-center">
                        {ROLE_DEFINITIONS.HR_RECRUITER.defaultPermissions.includes(perm.key) ? (
                          <div className="inline-flex p-1 rounded-lg bg-emerald-100 text-emerald-700">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex p-1 rounded-lg bg-slate-100 text-slate-300">
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </td>

                      {/* Executive Auditor */}
                      <td className="p-4 text-center">
                        {ROLE_DEFINITIONS.EXECUTIVE_AUDITOR.defaultPermissions.includes(perm.key) ? (
                          <div className="inline-flex p-1 rounded-lg bg-emerald-100 text-emerald-700">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex p-1 rounded-lg bg-slate-100 text-slate-300">
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeSubTab === 'AUDIT' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {isFa ? 'رویدادهای امنیتی و ردپای دسترسی‌ها (Audit Trail)' : 'Security Audit Log'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isFa ? 'ثبت زنده کلیه لاگین‌ها، تغییر سطوح دسترسی و صدور پیشنهادهای استخدامی' : 'Live logging of security actions and permission changes'}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isFa ? 'مانیتورینگ فعال' : 'Active Logging'}</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4 px-6">{isFa ? 'کاربر اقدام‌کننده' : 'User / Identity'}</th>
                    <th className="p-4">{isFa ? 'نوع اقدام / رویداد' : 'Action Performed'}</th>
                    <th className="p-4">{isFa ? 'هدف / ماژول' : 'Target Module'}</th>
                    <th className="p-4">{isFa ? 'آدرس IP' : 'IP Address'}</th>
                    <th className="p-4">{isFa ? 'زمان ثبت' : 'Timestamp'}</th>
                    <th className="p-4 px-6 text-center">{isFa ? 'وضعیت' : 'Result'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INITIAL_AUDIT_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-4 px-6 font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-700">
                          {log.userName.slice(0, 1)}
                        </div>
                        <span>{log.userName}</span>
                      </td>

                      <td className="p-4 font-medium text-slate-700">
                        {isFa ? log.action : log.actionEn}
                      </td>

                      <td className="p-4 font-mono text-[11px] text-slate-500">
                        {log.target}
                      </td>

                      <td className="p-4 font-mono text-[11px] text-slate-500">
                        {log.ipAddress}
                      </td>

                      <td className="p-4 text-slate-400 font-medium">
                        {log.timestamp}
                      </td>

                      <td className="p-4 px-6 text-center">
                        {log.status === 'SUCCESS' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            <Check className="w-3 h-3" />
                            <span>{isFa ? 'موفق' : 'Success'}</span>
                          </span>
                        )}
                        {log.status === 'FAILED' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                            <X className="w-3 h-3" />
                            <span>{isFa ? 'ناموفق' : 'Failed'}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingUser
                      ? isFa
                        ? `ویرایش کاربر: ${editingUser.name}`
                        : `Edit User: ${editingUser.name}`
                      : isFa
                      ? 'تعریف حساب کاربری جدید سازمانی'
                      : 'Create New Corporate User'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isFa ? 'تعیین نقش، مشخصات پرسنلی و مجوزهای دسترسی' : 'Assign role, personnel code & granular permissions'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitUser} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Profile Photo Upload & Preview Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group shrink-0">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-600 shadow-md ring-4 ring-blue-50"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">
                      {formData.name ? formData.name.slice(0, 1) : <User className="w-8 h-8" />}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
                    title={isFa ? 'تغییر عکس پروفایل' : 'Change Profile Picture'}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 text-right space-y-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-slate-800 text-xs">
                      {isFa ? 'عکس پرسنلی / پروفایل کاربر' : 'User Profile Photo'}
                    </label>
                    {formData.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                      >
                        {isFa ? 'حذف تصویر' : 'Remove'}
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isFa
                      ? 'می‌توانید فایل تصویر (JPG, PNG) را از سیستم خود آپلود نمایید یا آدرس اینترنتی تصویر را وارد کنید.'
                      : 'Upload a portrait photo or paste an image URL.'}
                  </p>
                  
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isFa ? 'بارگذاری از کامپیوتر' : 'Upload File'}</span>
                    </button>
                    <input
                      type="url"
                      value={formData.avatarUrl}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      placeholder={isFa ? 'یا لینک عکس (URL)...' : 'or image URL...'}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    {isFa ? 'نام و نام خانوادگی' : 'Full Name (Fa)'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder={isFa ? 'مثال: مهندس علی احمدی' : 'Ali Ahmadi'}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    {isFa ? 'نام انگلیسی (لاتین)' : 'English Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Ali Ahmadi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    {isFa ? 'نام کاربری جهت ورود (Username)' : 'Login Username'}
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    placeholder={isFa ? 'مثال: ahmadi یا admin' : 'username'}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    {isFa ? 'پست الکترونیک سازمانی' : 'Corporate Email'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="a.ahmadi@panap.ir"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    {isFa ? 'شماره پرسنلی' : 'Personnel Code'}
                  </label>
                  <input
                    type="text"
                    value={formData.personnelCode}
                    onChange={(e) => setFormData({ ...formData, personnelCode: e.target.value })}
                    placeholder="PNP-4050"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    {isFa ? 'دپارتمان سازمانی' : 'Department'}
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="منابع انسانی و جذب">{isFa ? 'منابع انسانی و جذب' : 'People & HR'}</option>
                    <option value="مهندسی نرم‌افزار و معماری">{isFa ? 'مهندسی نرم‌افزار و معماری' : 'Software Engineering'}</option>
                    <option value="فناوری اطلاعات و راهبری">{isFa ? 'فناوری اطلاعات و راهبری' : 'IT & Infrastructure'}</option>
                    <option value="مدیریت محصول و طراحی">{isFa ? 'مدیریت محصول و طراحی' : 'Product & Design'}</option>
                    <option value="نظارت راهبردی و حسابرسی">{isFa ? 'نظارت راهبردی و حسابرسی' : 'Executive Audit'}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    {isFa ? 'شماره همراه' : 'Mobile Number'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="۰۹۱۲..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-black text-slate-900 block text-xs">
                  {isFa ? 'انتخاب نقش و سطح دسترسی سازمانی (Role Tier):' : 'Select RBAC Role Tier:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(['SUPER_ADMIN', 'TALENT_DIRECTOR', 'TECH_LEAD', 'HR_RECRUITER', 'EXECUTIVE_AUDITOR'] as UserRole[]).map(
                    (roleKey) => {
                      const meta = ROLE_DEFINITIONS[roleKey];
                      const isSelected = formData.role === roleKey;
                      return (
                        <div
                          key={roleKey}
                          onClick={() => handleRoleChange(roleKey)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs">
                              {isFa ? meta.titleFa : meta.titleEn}
                            </span>
                            <input
                              type="radio"
                              name="roleSelection"
                              checked={isSelected}
                              onChange={() => handleRoleChange(roleKey)}
                              className="text-blue-600"
                            />
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                            {isFa ? meta.descriptionFa : meta.descriptionEn}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Custom Permission Checkboxes */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-900 block text-xs">
                    {isFa ? 'مجوزهای اختصاصی این کاربر:' : 'Assigned Granular Permissions:'}
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {formData.permissions.length} {isFa ? 'مجوز فعال' : 'Active Permissions'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 max-h-48 overflow-y-auto">
                  {ALL_PERMISSIONS.map((perm) => {
                    const isChecked = formData.permissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        className="flex items-start gap-2 p-2 rounded-xl bg-white border border-slate-200/60 cursor-pointer hover:border-blue-300 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.key)}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px]">
                            {isFa ? perm.nameFa : perm.nameEn}
                          </span>
                          <span className="text-[10px] text-slate-400 block leading-tight">
                            {isFa ? perm.categoryFa : perm.categoryEn}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md transition-colors cursor-pointer"
                >
                  {editingUser
                    ? isFa
                      ? 'ذخیره تغییرات'
                      : 'Save Changes'
                    : isFa
                    ? 'ایجاد و ثبت کاربر'
                    : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isPasswordModalOpen && selectedUserForPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {isFa ? 'تغییر رمز عبور امنیتی' : 'Reset User Password'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isFa ? `برای کاربر: ${selectedUserForPassword.name}` : `For: ${selectedUserForPassword.name}`}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {isFa ? 'رمز عبور موقت جدید:' : 'New Temporary Password:'}
              </label>
              <input
                type="text"
                value={newPasswordValue}
                onChange={(e) => setNewPasswordValue(e.target.value)}
                placeholder="Panap@2026Secure"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                {isFa ? 'کاربر در اولین ورود ملزم به تغییر این رمز خواهد بود.' : 'User must change this password on next login.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                {isFa ? 'انصراف' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  showToast(isFa ? `رمز عبور کاربر ${selectedUserForPassword.name} با موفقیت بازنشانی شد.` : 'Password reset successfully');
                  setIsPasswordModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {isFa ? 'ثبت رمز جدید' : 'Set Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
