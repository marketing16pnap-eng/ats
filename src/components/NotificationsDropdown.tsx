import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  Clock, 
  Phone, 
  Building, 
  User, 
  X,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { AppNotification, AppLanguage } from '../types';
import { getStoredNotifications, saveNotifications } from '../services/notificationService';

interface NotificationsDropdownProps {
  language: AppLanguage;
  onSelectCandidate?: (candidateId: string) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  language,
  onSelectCandidate,
}) => {
  const isFa = language === 'PERSIAN';
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifs = () => {
    setNotifications(getStoredNotifications());
  };

  useEffect(() => {
    loadNotifs();

    const handleNotifAdded = () => {
      loadNotifs();
    };

    window.addEventListener('panap_notification_added', handleNotifAdded);
    return () => {
      window.removeEventListener('panap_notification_added', handleNotifAdded);
    };
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.isRead) {
      const updated = notifications.map((n) =>
        n.id === notif.id ? { ...n, isRead: true } : n
      );
      setNotifications(updated);
      saveNotifications(updated);
    }
    if (notif.candidateId && onSelectCandidate) {
      onSelectCandidate(notif.candidateId);
      setIsOpen(false);
    }
  };

  const handleDeleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveNotifications(updated);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="btn-header-notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
        title={isFa ? 'اعلان‌های سیستم و مصاحبه‌ها' : 'Notifications'}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '+9' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-right"
          dir={isFa ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold">
                  {isFa ? 'اعلان‌ها و یادآوری مصاحبه‌ها' : 'Interview & System Alerts'}
                </h4>
                <span className="text-[10px] text-slate-400">
                  {unreadCount > 0 
                    ? isFa ? `${unreadCount} اعلان خوانده‌نشده` : `${unreadCount} unread` 
                    : isFa ? 'تمام اعلان‌ها خوانده شده' : 'All caught up'}
                </span>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{isFa ? 'خوانده شد همه' : 'Mark all read'}</span>
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 text-xs">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium">
                  {isFa ? 'هیچ اعلانی ثبت نشده است' : 'No notifications yet'}
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isPhone = notif.type === 'INTERVIEW_PHONE';
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3 sm:p-3.5 hover:bg-slate-50 transition-colors cursor-pointer relative group ${
                      !notif.isRead ? 'bg-blue-50/40' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                          isPhone
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {isPhone ? <Phone className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="font-bold text-slate-900 text-xs truncate">
                            {isFa ? notif.title : notif.titleEn || notif.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {notif.createdAt}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {isFa ? notif.message : notif.messageEn || notif.message}
                        </p>

                        {/* Interview Details Badge */}
                        {(notif.interviewDate || notif.interviewTime) && (
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-600" />
                              <span>{notif.interviewDate}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{notif.interviewTime}</span>
                            </span>
                            {notif.candidateName && (
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 truncate max-w-[150px]">
                                <User className="w-3 h-3 text-indigo-500" />
                                <span>{notif.candidateName}</span>
                              </span>
                            )}
                          </div>
                        )}

                        {notif.scheduledBy && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            {isFa ? `ثبت شده توسط: ${notif.scheduledBy}` : `By: ${notif.scheduledBy}`}
                            {notif.scheduledAt && ` (${notif.scheduledAt})`}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleDeleteNotification(e, notif.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-rose-500 transition-opacity"
                        title={isFa ? 'حذف اعلان' : 'Dismiss'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {!notif.isRead && (
                      <span className="absolute top-3 left-3 w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
