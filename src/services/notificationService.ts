import { AppNotification } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'panap_ats_notifications';

export const getStoredNotifications = (): AppNotification[] => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading notifications:', e);
  }

  // Initial seed notifications if none exist
  const seed: AppNotification[] = [
    {
      id: 'notif-seed-1',
      type: 'INTERVIEW_PHONE',
      title: 'مصاحبه تلفنی هماهنگ شده',
      titleEn: 'Scheduled Phone Interview',
      message: 'مصاحبه تلفنی با کارجو پوریا نیکزاد برای فردا ساعت ۱۰:۳۰ تنظیم شده است.',
      messageEn: 'Phone interview scheduled with Pouria Nikzad tomorrow at 10:30.',
      candidateId: 'CAND-001',
      candidateName: 'پوریا نیکزاد',
      candidateRole: 'توسعه‌دهنده ارشد React / TypeScript',
      interviewDate: '۱۴۰۳/۰۶/۲۵',
      interviewTime: '۱۰:۳۰',
      scheduledAt: '۱۴۰۳/۰۶/۲۴ - ۱۱:۱۵',
      scheduledBy: 'مدیر ارشد سامانه',
      isRead: false,
      createdAt: 'امروز',
    },
    {
      id: 'notif-seed-2',
      type: 'INTERVIEW_IN_PERSON',
      title: 'مصاحبه حضوری در مجتمع سرمد',
      titleEn: 'In-Person Interview at Sarmad Complex',
      message: 'جلسه مصاحبه حضوری با نگین صادقی برای روز چهارشنبه ساعت ۱۴:۰۰ در واحد ۳۰۷ هماهنگ شد.',
      messageEn: 'In-person interview scheduled with Negin Sadeghi Wednesday at 14:00 (Unit 307).',
      candidateId: 'CAND-002',
      candidateName: 'نگین صادقی',
      candidateRole: 'مدیر محصول ارشد (Senior PM)',
      interviewDate: '۱۴۰۳/۰۶/۲۶',
      interviewTime: '۱۴:۰۰',
      scheduledAt: '۱۴۰۳/۰۶/۲۴ - ۰۹:۴۰',
      scheduledBy: 'سارا رضایی',
      isRead: false,
      createdAt: 'امروز',
    }
  ];
  return seed;
};

export const saveNotifications = (notifications: AppNotification[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Error saving notifications:', e);
  }
};

export const addNotification = (
  notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>
): AppNotification => {
  const all = getStoredNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: 'لحظاتی پیش',
    isRead: false,
  };
  const updated = [newNotif, ...all];
  saveNotifications(updated);
  // Dispatch custom window event so all components reactively update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('panap_notification_added', { detail: newNotif }));
  }
  return newNotif;
};
