import React from 'react';
import { X, Check, Shield, User } from 'lucide-react';
import { AppUser, AppLanguage } from '../types';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AppUser[];
  currentUser: AppUser;
  onSelectUser: (user: AppUser) => void;
  language: AppLanguage;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser,
  language,
}) => {
  if (!isOpen) return null;
  const isFa = language === 'PERSIAN';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="role-switcher-dialog"
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
      >
        <div className="bg-[#131B2E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{isFa ? 'تغییر نقش و حساب کاربری' : 'Switch User Role'}</h3>
              <p className="text-[11px] text-slate-400">{isFa ? 'مشاهده سامانه با دسترسی‌های مختلف' : 'Test RBAC permissions'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {users.map((user) => {
            const isSelected = user.id === currentUser.id;
            return (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{user.name}</span>
                      {isSelected && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded-full font-bold">
                          فعال
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-blue-700 font-bold">{user.roleTitleFa}</div>
                    <div className="text-[10px] text-slate-500">{user.department}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-blue-600 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
