import React, { useState } from 'react';
import { 
  Download, 
  Layers, 
  CheckCircle2, 
  Maximize2, 
  ExternalLink, 
  Sparkles, 
  Palette, 
  FileImage, 
  Eye, 
  Check,
  Archive,
  FileSpreadsheet,
  Calendar,
  Users,
  Shield,
  Briefcase,
  HelpCircle,
  X
} from 'lucide-react';
import { AppLanguage, Candidate, JobRequisition, Department } from '../types';

interface ExportItem {
  id: string;
  number: string;
  nameFa: string;
  nameEn: string;
  filename: string;
  descriptionFa: string;
  descriptionEn: string;
  url: string;
  badgeFa: string;
  badgeEn: string;
  categoryFa: string;
  featuresFa: string[];
}

const UI_SCREENS: ExportItem[] = [
  {
    id: '01',
    number: 'تصویر ۱',
    nameFa: 'داشبورد مدیریتی و قیف استخدامی ۷ مرحله‌ای',
    nameEn: 'Executive Dashboard & 7-Stage Funnel',
    filename: '01-dashboard-executive.png',
    descriptionFa: 'نمای کامل داشبورد فرماندهی جذب شامل ۴ شاخص KPI اصلی با اسپارک‌لاین، قیف تبدیل ۷ مرحله‌ای، ویجت ردیف‌های شغلی فوری و آخرین مصاحبه‌ها.',
    descriptionEn: 'Full executive command center with 4 KPI metrics, 7-stage conversion funnel, urgent jobs and recent interviews.',
    url: '/screenshots/01-dashboard-executive.png',
    badgeFa: 'پیشخوان اصلی',
    badgeEn: 'Dashboard',
    categoryFa: 'داشبورد و گزارش',
    featuresFa: ['قیف تبدیل ۷ مرحله‌ای استخدامی', '۴ شاخص KPI با نمودار روند', 'ردیف‌های شغلی با اولویت بالا', 'لیست مصاحبه‌های پیش‌رو']
  },
  {
    id: '02',
    number: 'تصویر ۲',
    nameFa: 'بانک متقاضیان و کارجویان — نمای جدول پیشرفته',
    nameEn: 'Candidates Directory - Table View',
    filename: '02-candidates-table-view.png',
    descriptionFa: 'جدول کامل اطلاعات کارجویان با قابلیت جستجو، فیلتر چندگانه بر اساس مراحل ۷ گانه، دپارتمان، کانال جذب، ستاره‌گذاری و امتیاز تطابق ATS.',
    descriptionEn: 'Advanced candidates data table with multi-filter bar, 7-stage indicators, match scores and quick actions.',
    url: '/screenshots/02-candidates-table-view.png',
    badgeFa: 'جدول داده‌ها',
    badgeEn: 'Data Table',
    categoryFa: 'مدیریت کارجویان',
    featuresFa: ['فیلترهای ترکیبی مرحله و واحد', 'محاسبه امتیاز تطابق هوشمند', 'عملیات گروهی و حذف دسته‌ای', 'نشان‌دار کردن کارجویان منتخب']
  },
  {
    id: '03',
    number: 'تصویر ۳',
    nameFa: 'بورد کانبان ۷ مرحله‌ای خط جذب و استخدام',
    nameEn: '7-Stage Recruitment Pipeline Kanban',
    filename: '03-candidates-kanban-board.png',
    descriptionFa: 'بورد کانبان مدرن با ستون‌های تفکیک‌شده برای مراحل ۱ تا ۷ و خروجی‌های استخدام/رد/انصراف همراه با هشدار تاخیر زمانی متقاضیان.',
    descriptionEn: 'Full 7-stage interactive Kanban board with candidate cards and stage duration delay alerts.',
    url: '/screenshots/03-candidates-kanban-board.png',
    badgeFa: 'بورد کانبان',
    badgeEn: 'Kanban Board',
    categoryFa: 'مدیریت کارجویان',
    featuresFa: ['۷ ستون مراحل استخدامی', 'کارت‌های متقاضیان با سوابق', 'شمارنده تعداد کارجویان هر ستون', 'سیستم رنگی هشدار تاخیر']
  },
  {
    id: '04',
    number: 'تصویر ۴',
    nameFa: 'پرونده تفصیلی و جامع متقاضی (۹ ستونی و استپر ۷ گام)',
    nameEn: 'Full Candidate Dossier & 7-Stage Timeline',
    filename: '04-candidate-dossier-modal.png',
    descriptionFa: 'پرونده یکپارچه کارجو شامل استپر تعاملی گام‌های ۱ تا ۷، مشخصات فردی و هویتی، سوابق تحصیلی و شغلی، پیش‌نویس ارزیابی و ثبت یادداشت.',
    descriptionEn: 'Comprehensive dossier modal with interactive 7-stage stepper, profile data, education, experience and interview notes.',
    url: '/screenshots/04-candidate-dossier-modal.png',
    badgeFa: 'پرونده کامل',
    badgeEn: 'Full Dossier',
    categoryFa: 'مدیریت کارجویان',
    featuresFa: ['استپر افقی تعاملی ۷ مرحله‌ای', 'تب‌های سوابق، اسناد و رزومه', 'ارزیابی‌های مراحل گذشته', 'دکمه صدور آفر و تغییر مرحله']
  },
  {
    id: '05',
    number: 'تصویر ۵',
    nameFa: 'مدال ثبت کارجو و متقاضی جدید با اعتبارسنجی',
    nameEn: 'New Candidate Registration Form Modal',
    filename: '05-new-candidate-modal.png',
    descriptionFa: 'فرم دومرحله‌ای ثبت متقاضی جدید شامل بارگذاری فایل رزومه، انتخاب ردیف شغلی و واحد سازمانی، تعیین منبع جذب و اعتبارسنجی شماره همراه و کد ملی.',
    descriptionEn: 'New applicant creation modal with resume upload, job assignment, channel picker and real-time validation.',
    url: '/screenshots/05-new-candidate-modal.png',
    badgeFa: 'فرم ثبت کارجو',
    badgeEn: 'New Applicant',
    categoryFa: 'مدیریت کارجویان',
    featuresFa: ['باکس بارگذاری فایل رزومه PDF', 'انتخاب ردیف و دپارتمان', 'فیلدهای مشخصات و تماس', 'اعتبارسنجی خطاها']
  },
  {
    id: '06',
    number: 'تصویر ۶',
    nameFa: 'ابزار درون‌ریزی دسته‌ای اطلاعات از اکسل (Excel Import)',
    nameEn: 'Batch Excel Import Wizard Modal',
    filename: '06-excel-import-modal.png',
    descriptionFa: 'ابزار هوشمند درون‌ریزی فایل‌های اکسل حاوی متقاضیان استخدامی با پیش‌نمایش سطور، نقشه‌برداری فیلدها و پیشگیری از ثبت تکراری.',
    descriptionEn: 'Smart Excel batch import wizard with row parsing, column mapping and duplicate detection.',
    url: '/screenshots/06-excel-import-modal.png',
    badgeFa: 'درون‌ریزی اکسل',
    badgeEn: 'Excel Import',
    categoryFa: 'ابزارها',
    featuresFa: ['درون‌ریزی سریع فایل XLSX/CSV', 'نقشه‌برداری خودکار فیلدها', 'پیش‌نمایش قبل از ذخیره نهایی', 'تطبیق با دیتابیس']
  },
  {
    id: '07',
    number: 'تصویر ۷',
    nameFa: 'مدیریت موقعیت‌ها و ردیف‌های شغلی باز (Requisitions)',
    nameEn: 'Job Requisitions Management',
    filename: '07-job-requisitions-management.png',
    descriptionFa: 'مدیریت کامل موقعیت‌های استخدامی، سهمیه‌های جذب هر عنوان شغلی، تعداد رزومه‌های دریافتی، بودجه مصوب و وضعیت فعال/معلق/بسته.',
    descriptionEn: 'Requisition directory with open vs filled headcounts, budget bounds, priority levels and applicant volume.',
    url: '/screenshots/07-job-requisitions-management.png',
    badgeFa: 'ردیف‌های شغلی',
    badgeEn: 'Job Openings',
    categoryFa: 'ساختار سازمانی',
    featuresFa: ['کارت‌های ردیف شغلی با جزئیات', 'شاخص پیشرفت ظرفیت استخدام', 'مدیریت بودجه و اولویت جذب', 'تغییر وضعیت فوری']
  },
  {
    id: '08',
    number: 'تصویر ۸',
    nameFa: 'مدال تعریف موقعیت شغلی جدید با بودجه و مهارت‌ها',
    nameEn: 'Create New Job Requisition Modal',
    filename: '08-new-requisition-modal.png',
    descriptionFa: 'فرم تعریف ردیف استخدامی جدید با تعیین مدیر استخدام‌کننده، بازه بودجه حقوقی، سقف تعداد جذب، مهارت‌های کلیدی و شرایط احراز.',
    descriptionEn: 'Create requisition modal with hiring manager, budget range, headcounts and skill tags.',
    url: '/screenshots/08-new-requisition-modal.png',
    badgeFa: 'تعریف موقعیت',
    badgeEn: 'New Position',
    categoryFa: 'ساختار سازمانی',
    featuresFa: ['تعیین واحد و مدیر استخدام‌کننده', 'تعیین بودجه حقوق پیشنهادی', 'افزودن برچسب مهارت‌های الزامی', 'تنظیم سطح اولویت فوری/عادی']
  },
  {
    id: '09',
    number: 'تصویر ۹',
    nameFa: 'مدیریت دپارتمان‌ها و واحدهای سازمانی',
    nameEn: 'Departments & Organizational Units',
    filename: '09-departments-organization.png',
    descriptionFa: 'ساختار تشکیلاتی دپارتمان‌های پناپ، تعداد پرسنل فعال، مدیران واحدها، موقعیت‌های استخدامی باز و بودجه تخصیص‌یافته به تفکیک واحد.',
    descriptionEn: 'Department hierarchy, headcount distribution, unit managers and department budget tracking.',
    url: '/screenshots/09-departments-organization.png',
    badgeFa: 'واحدهای سازمان',
    badgeEn: 'Departments',
    categoryFa: 'ساختار سازمانی',
    featuresFa: ['نمایش ساختار درختی واحدها', 'آمار کارمندان و موقعیت‌ها', 'مدیریت بودجه مصوب هر واحد', 'مشخصات مدیر و ایمیل سازمانی']
  },
  {
    id: '10',
    number: 'تصویر ۱۰',
    nameFa: 'مدال ایجاد واحد سازمانی و مرکز هزینه جدید',
    nameEn: 'Create New Department Modal',
    filename: '10-new-department-modal.png',
    descriptionFa: 'فرم ساخت واحد سازمانی جدید با کد مرکز هزینه، تخصیص بودجه سالانه و تعیین مدیر ارشد واحد.',
    descriptionEn: 'New department creation modal with cost center, annual budget and unit leadership.',
    url: '/screenshots/10-new-department-modal.png',
    badgeFa: 'واحد جدید',
    badgeEn: 'New Unit',
    categoryFa: 'ساختار سازمانی',
    featuresFa: ['کد اختصاصی مرکز هزینه', 'تخصیص بودجه سالانه جذب', 'انتخاب پالت رنگی واحد', 'توضیحات و اهداف دپارتمان']
  },
  {
    id: '11',
    number: 'تصویر ۱۱',
    nameFa: 'مرکز ارزیابی و مصاحبه — تقویم جامع جلسات',
    nameEn: 'Assessment Center - Calendar View',
    filename: '11-interview-center-calendar.png',
    descriptionFa: 'تقویم اختصاصی جلسات مصاحبه با تفکیک جلسات تلفنی، ویدئویی و حضوری، پایش تداخل زمانی ارزیابان و تعیین وضعیت حضور کارجو.',
    descriptionEn: 'Interactive interview schedule calendar with round types, assessors and conflict detection.',
    url: '/screenshots/11-interview-center-calendar.png',
    badgeFa: 'تقویم مصاحبه',
    badgeEn: 'Calendar',
    categoryFa: 'مرکز مصاحبه',
    featuresFa: ['تقویم ماهانه و هفتگی مصاحبه‌ها', 'برچسب نوع مصاحبه حضوری/تلفنی', 'نمایش زمان، مصاحبه‌کنندگان و اتاق', 'دسترسی سریع به فرم ارزیابی']
  },
  {
    id: '12',
    number: 'تصویر ۱۲',
    nameFa: 'فهرست جلسات مصاحبه و مدیریت وضعیت‌ها',
    nameEn: 'Interview Sessions List & Status Tracking',
    filename: '12-interview-sessions-list.png',
    descriptionFa: 'لیست تمام جلسات پیش‌رو و برگزارشده مصاحبه با امکان ورود به فرم نمره‌دهی، لینک جلسه آنلاین و ثبت وضعیت تایید/لغو.',
    descriptionEn: 'Upcoming and completed interview sessions directory with quick scorecard access.',
    url: '/screenshots/12-interview-sessions-list.png',
    badgeFa: 'لیست جلسات',
    badgeEn: 'Sessions List',
    categoryFa: 'مرکز مصاحبه',
    featuresFa: ['تفکیک جلسات پیش‌رو و برگزارشده', 'لینک ورود به جلسه آنلاین', 'دکمه سریع فرم ثبت نمره', 'تغییر وضعیت برگزاری جلسه']
  },
  {
    id: '13',
    number: 'تصویر ۱۳',
    nameFa: 'بخش فرم‌های ارزیابی رسمی شرکت پناپ',
    nameEn: 'Official Panap Assessment Forms Hub',
    filename: '13-official-interview-forms.png',
    descriptionFa: 'پیش‌نمایش فرم ۱ (مصاحبه تلفنی) و فرم ۲ (مصاحبه حضوری در مجتمع سرمد) با امکان سفارشی‌سازی قالب و تکمیل فوری برای هر کارجو.',
    descriptionEn: 'Official recruitment forms hub for phone screening and in-person interviews at Sarmad Complex.',
    url: '/screenshots/13-official-interview-forms.png',
    badgeFa: 'فرم‌های رسمی',
    badgeEn: 'Forms Hub',
    categoryFa: 'مرکز مصاحبه',
    featuresFa: ['فرم شماره ۱: ارزیابی مصاحبه تلفنی', 'فرم شماره ۲: مصاحبه حضوری سرمد', 'سفارشی‌سازی سوالات و بخش‌ها', 'تکمیل سریع با انتخاب کارجو']
  },
  {
    id: '14',
    number: 'تصویر ۱۴',
    nameFa: 'پیکربندی مراحل ارزیابی و تایپ‌های مختلف مصاحبه',
    nameEn: 'Interview Stages & Rubrics Configuration',
    filename: '14-interview-stages-configuration.png',
    descriptionFa: 'تنظیمات مراحل مصاحبه‌های فنی، رفتاری، سناریومحور و انطباق فرهنگی همراه با مدت زمان استاندارد و راهنمای ارزیابان.',
    descriptionEn: 'Configurable interview stages, rubric criteria, standard durations and assessor guides.',
    url: '/screenshots/14-interview-stages-configuration.png',
    badgeFa: 'پیکربندی سنجه‌ها',
    badgeEn: 'Stages Config',
    categoryFa: 'مرکز مصاحبه',
    featuresFa: ['تعریف انواع تایپ‌های مصاحبه', 'تنظیم مدت‌زمان استاندارد', 'دستورالعمل و چک‌لیست ارزیابان', 'ویرایش و بازچینی سنجه‌ها']
  },
  {
    id: '15',
    number: 'تصویر ۱۵',
    nameFa: 'مدال هماهنگی و زمان‌بندی جلسه مصاحبه جدید',
    nameEn: 'Schedule New Interview Session Modal',
    filename: '15-schedule-interview-modal.png',
    descriptionFa: 'مدال انتخاب کارجو، تاریخ و ساعت، لینک اتاق جلسه، انتخاب مصاحبه‌کنندگان و ثبت اعلان خودکار برای طرفین.',
    descriptionEn: 'Interview scheduling dialog with candidate selection, date/time pickers and automated reminders.',
    url: '/screenshots/15-schedule-interview-modal.png',
    badgeFa: 'زمان‌بندی مصاحبه',
    badgeEn: 'Scheduler Modal',
    categoryFa: 'مرکز مصاحبه',
    featuresFa: ['انتخاب هوشمند متقاضی', 'تعیین تاریخ، ساعت و مدت جلسه', 'لینک اتاق جلسات آنلاین', 'ارسال اعلان خودکار هماهنگی']
  },
  {
    id: '16',
    number: 'تصویر ۱۶',
    nameFa: 'فرم رسمی شماره ۱ — ارزیابی تفصیلی مصاحبه تلفنی کارجو',
    nameEn: 'Official Form 1 - Phone Interview Assessment',
    filename: '16-phone-interview-form-modal.png',
    descriptionFa: 'فرم مدال استاندارد ارزیابی تلفنی پناپ شامل معرفی سوابق کاری، انگیزه همکاری، آشنایی با پناپ، مهارت‌های کلیدی و محاسبه امتیاز.',
    descriptionEn: 'Official phone interview assessment form modal with work history, motivation and scoring.',
    url: '/screenshots/16-phone-interview-form-modal.png',
    badgeFa: 'فرم شماره ۱',
    badgeEn: 'Phone Form',
    categoryFa: 'فرم‌های ارزیابی',
    featuresFa: ['ثبت سوابق و وضعیت اشتغال فعلی', 'سنجش انگیزه همکاری با پناپ', 'امتیازدهی نهایی ۱ تا ۱۰', 'ثبت نظر دعوت به مصاحبه حضوری']
  },
  {
    id: '17',
    number: 'تصویر ۱۷',
    nameFa: 'فرم رسمی شماره ۲ — مصاحبه حضوری (مجتمع سرمد - واحد ۳۰۷)',
    nameEn: 'Official Form 2 - In-Person Interview (Sarmad Complex)',
    filename: '17-inperson-interview-form-modal.png',
    descriptionFa: 'فرم جامع مصاحبه حضوری پناپ شامل مشخصات کامل، سوابق تحصیلی و معدل، ماتریس نمرات مهارتی، ۳ ردیف سوابق کاری و استعلام معرفین.',
    descriptionEn: 'Detailed in-person assessment form with skill ratings, work histories, questionnaire and references.',
    url: '/screenshots/17-inperson-interview-form-modal.png',
    badgeFa: 'فرم شماره ۲',
    badgeEn: 'In-Person Form',
    categoryFa: 'فرم‌های ارزیابی',
    featuresFa: ['آدرس دقیق مجتمع سرمد - واحد ۳۰۷', 'ماتریس نمره‌دهی مهارت‌های شغلی', 'پرسش‌نامه اخلاقی و رفتاری', 'ثبت مشخصات و تماس ۲ معرف']
  },
  {
    id: '18',
    number: 'تصویر ۱۸',
    nameFa: 'داشبورد هوش تجاری و تحلیل منابع جذب و نرخ تبدیل',
    nameEn: 'Talent Velocity & BI Analytics Dashboard',
    filename: '18-analytics-bi-charts.png',
    descriptionFa: 'تحلیل داده‌محور کانال‌های ورودی رزومه، نمودارهای سهم جذب، نرخ گذر از هر مرحله قیف، زمان متوسط تا استخدام و بهره‌وری دپارتمان‌ها.',
    descriptionEn: 'Talent velocity charts, channel attribution, stage pass rates, time-to-hire velocity and department metrics.',
    url: '/screenshots/18-analytics-bi-charts.png',
    badgeFa: 'هوش تجاری',
    badgeEn: 'BI Analytics',
    categoryFa: 'داشبورد و گزارش',
    featuresFa: ['نمودار میله‌ای کانال‌های ورودی', 'نمودار نرخ ریزش و گذر مراحل', 'پایش شاخص زمان تا استخدام', 'گزارش عملکرد واحدهای سازمان']
  },
  {
    id: '19',
    number: 'تصویر ۱۹',
    nameFa: 'مرکز گزارشات، خروجی‌ها و مستندات سیستم',
    nameEn: 'Exports Hub & System Documentation Downloads',
    filename: '19-exports-center-reports.png',
    descriptionFa: 'صفحه حاضر جهت دانلود بسته جامع اسکرین‌شات‌ها (ZIP)، مستندات اکسل معماری سیستم، خروجی‌های تحلیلی و پیش‌نمایش تمام‌صفحه تصاویر.',
    descriptionEn: 'Exports center with screenshot archive download, Excel system architecture file and UI asset gallery.',
    url: '/screenshots/19-exports-center-reports.png',
    badgeFa: 'مرکز خروجی‌ها',
    badgeEn: 'Exports Hub',
    categoryFa: 'ابزارها',
    featuresFa: ['دانلود فایل فشرده ZIP تصاویر (۹.۴ مگابایت)', 'دانلود فایل اکسل مستندات معماری', 'پیش‌نمایش تعاملی با زوم تصاویر', 'مشخصات فنی و استانداردهای طراحی']
  },
  {
    id: '20',
    number: 'تصویر ۲۰',
    nameFa: 'مدیریت کاربران، نقش‌های ۵ گانه و ماتریس مجوزها (RBAC)',
    nameEn: 'User Directory & RBAC Permission Matrix',
    filename: '20-user-management-rbac.png',
    descriptionFa: 'مدیریت اعضای تیم جذب، نقش‌های ۵ گانه سازمانی، ماتریس مجوزهای دسترسی، لاگ مانیتورینگ امنیتی ورود و فعالیت کاربران.',
    descriptionEn: 'RBAC user management with 5 organizational roles, granular permission matrix and security audit log.',
    url: '/screenshots/20-user-management-rbac.png',
    badgeFa: 'مدیریت RBAC',
    badgeEn: 'User Security',
    categoryFa: 'امنیت و تنظیمات',
    featuresFa: ['تعریف ۵ نقش سازمانی دقیق', 'ماتریس ۱۰ مجوزی دسترسی‌ها', 'ثبت لاگ مانیتورینگ امنیتی', 'ویرایش وضعیت فعال/تعلیق کاربر']
  },
  {
    id: '21',
    number: 'تصویر ۲۱',
    nameFa: 'تنظیمات سامانه، مانیتورینگ دیتابیس MySQL و هویت بصری',
    nameEn: 'System Settings & MySQL Database Sync',
    filename: '21-system-settings-mysql.png',
    descriptionFa: 'تنظیمات برندینگ، نام سازمان، لوگو، مانیتورینگ اتصال و همگام‌سازی دیتابیس MySQL، مشخصات سرور و اطلاعات پشتیبانی.',
    descriptionEn: 'Branding customization, logo upload, MySQL database connectivity status and sync engine.',
    url: '/screenshots/21-system-settings-mysql.png',
    badgeFa: 'تنظیمات سامانه',
    badgeEn: 'Settings & DB',
    categoryFa: 'امنیت و تنظیمات',
    featuresFa: ['وضعیت زنده اتصال به پایگاه داده MySQL', 'شخصی‌سازی لوگو و نام تجاری', 'سیاست‌های امنیتی انقضای نشست', 'لینک دانلود کدهای جاسازی']
  },
  {
    id: '22',
    number: 'تصویر ۲۲',
    nameFa: 'مدال راهنمای ادغام و جاسازی فرم و سامانه در وب‌سایت وردپرس',
    nameEn: 'WordPress IFrame & Embed Code Integration Modal',
    filename: '22-wordpress-embed-modal.png',
    descriptionFa: 'کدهای آماده Iframe، شرت‌کد و راهنمای گام‌به‌گام اتصال فرم استخدام پناپ به قالب‌ها و برگه‌های وب‌سایت وردپرس سازمان.',
    descriptionEn: 'Ready-to-use iframe snippets, shortcode guidance and WordPress integration documentation.',
    url: '/screenshots/22-wordpress-embed-modal.png',
    badgeFa: 'اتصال وردپرس',
    badgeEn: 'WordPress Embed',
    categoryFa: 'ابزارها',
    featuresFa: ['کد HTML استاندارد آی‌فریم رسپانسیو', 'راهنمای المنتور و شرت‌کد وردپرس', 'تنظیمات ارتباط بین‌دامنه‌ای', 'کپی با یک کلیک']
  },
  {
    id: '23',
    number: 'تصویر ۲۳',
    nameFa: 'مدال سوئیچر و شبیه‌ساز سطوح دسترسی نقش‌های کاربری',
    nameEn: 'Role Switcher & Permission Simulator Modal',
    filename: '23-role-switcher-simulator.png',
    descriptionFa: 'ابزار سوئیچ فوری بین نقش‌های مدیر ارشد، مدیر جذب، لید فنی، مصاحبه‌گر منابع انسانی و ناظر جهت تست تجربه کاربری و مجوزها.',
    descriptionEn: 'Interactive role switcher for simulating different permission levels and experiences.',
    url: '/screenshots/23-role-switcher-simulator.png',
    badgeFa: 'شبیه‌ساز نقش‌ها',
    badgeEn: 'Role Switcher',
    categoryFa: 'امنیت و تنظیمات',
    featuresFa: ['سوئیچ سریع بین ۵ نقش کاربری', 'نمایش مجوزهای فعال هر نقش', 'شبیه‌سازی کامل پنل کاربری', 'تست سناریوهای امنیتی']
  },
  {
    id: '24',
    number: 'تصویر ۲۴',
    nameFa: 'صفحه ورود و احراز هویت امن دو مرحله‌ای سامانه',
    nameEn: 'Two-Factor Secure Authentication Login Screen',
    filename: '24-login-security-screen.png',
    descriptionFa: 'صفحه مدرن لاگین سامانه با پشتیبانی از ورود همکاران با نام کاربری/رمزعبور و ورود اختصاصی متقاضیان با کد ملی و شماره موبایل.',
    descriptionEn: 'Modern login screen supporting both corporate staff credentials and candidate portal tracking login.',
    url: '/screenshots/24-login-security-screen.png',
    badgeFa: 'صفحه ورود',
    badgeEn: 'Login Screen',
    categoryFa: 'پورتال عمومی',
    featuresFa: ['طراحی اختصاصی با هویت برند پناپ', 'تب ورود ادمین و ورود متقاضی', 'سیاست انقضای امن نشست‌ها', 'ورود سریع تست با کاربران پیش‌فرض']
  },
  {
    id: '25',
    number: 'تصویر ۲۵',
    nameFa: 'فرم عمومی ارسال رزومه و درخواست همکاری در سایت پناپ',
    nameEn: 'Public Career Application & CV Submission Form',
    filename: '25-public-career-application-form.png',
    descriptionFa: 'فرم سبک و مدرن ارسال رزومه متقاضیان جهت نمایش در وب‌سایت اصلی پناپ همراه با دریافت کد پیگیری اختصاصی.',
    descriptionEn: 'Public-facing job application form for corporate career site embedding with tracking code generator.',
    url: '/screenshots/25-public-career-application-form.png',
    badgeFa: 'فرم استخدام سایت',
    badgeEn: 'Career Form',
    categoryFa: 'پورتال عمومی',
    featuresFa: ['طراحی زیبا و رسپانسیو وب‌سایت', 'انتخاب موقعیت شغلی فعال', 'آپلود مستقیم رزومه کارجو', 'تولید خودکار کد رهگیری']
  },
  {
    id: '26',
    number: 'تصویر ۲۶',
    nameFa: 'پورتال سلف‌سرویس کارجو جهت پیگیری برخط وضعیت مراحل استخدام',
    nameEn: 'Candidate Self-Service Status Tracking Portal',
    filename: '26-candidate-tracking-portal.png',
    descriptionFa: 'پورتال آنلاین کارجو برای مشاهده وضعیت فعلی در مراحل ۷ گانه، مشاهده زمان و لینک مصاحبه‌های هماهنگ‌شده و تکمیل اطلاعات.',
    descriptionEn: 'Candidate status portal showing current pipeline stage, upcoming interview details and next steps.',
    url: '/screenshots/26-candidate-tracking-portal.png',
    badgeFa: 'پورتال کارجو',
    badgeEn: 'Candidate Portal',
    categoryFa: 'پورتال عمومی',
    featuresFa: ['پیگیری زنده وضعیت در ۷ مرحله', 'نمایش زمان جلسه مصاحبه و آدرس سرمد', 'راهنمای آمادگی برای هر مرحله', 'امکان ارسال پیام و تکمیل اسناد']
  }
];

interface ExportsScreenProps {
  language: AppLanguage;
  candidates?: Candidate[];
  requisitions?: JobRequisition[];
  departments?: Department[];
}

export const ExportsScreen: React.FC<ExportsScreenProps> = ({ 
  language,
}) => {
  const isFa = language === 'PERSIAN';
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Record<string, boolean>>({});
  const [previewItem, setPreviewItem] = useState<ExportItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', labelFa: 'همه تصاویر (۲۶)', labelEn: 'All (26)' },
    { id: 'داشبورد و گزارش', labelFa: 'داشبورد و آمار', labelEn: 'Dashboard & BI' },
    { id: 'مدیریت کارجویان', labelFa: 'کارجویان و کانبان', labelEn: 'Candidates' },
    { id: 'مرکز مصاحبه', labelFa: 'تقویم و مصاحبه‌ها', labelEn: 'Interviews' },
    { id: 'فرم‌های ارزیابی', labelFa: 'فرم‌های ۱ و ۲ پناپ', labelEn: 'Evaluation Forms' },
    { id: 'ساختار سازمانی', labelFa: 'ردیف‌ها و واحدها', labelEn: 'Jobs & Depts' },
    { id: 'امنیت و تنظیمات', labelFa: 'امنیت و دیتابیس', labelEn: 'Security & DB' },
    { id: 'پورتال عمومی', labelFa: 'لاگین و پورتال کارجو', labelEn: 'Public & Portal' },
  ];

  const filteredScreens = UI_SCREENS.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.categoryFa === activeCategory;
  });

  const downloadFile = async (item: ExportItem) => {
    try {
      setDownloadingId(item.id);
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadedIds((prev) => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setDownloadedIds((prev) => ({ ...prev, [item.id]: false }));
      }, 3000);
    } catch (err) {
      console.error('Error downloading screenshot:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Primary Hero Banner for ZIP Download */}
      <div className="bg-gradient-to-l from-slate-950 via-slate-900 to-blue-950 rounded-3xl p-6 lg:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{isFa ? 'بسته کامل تصاویر باکیفیت بالا (26 اسکرین‌شات دسکتاپ 1440px)' : 'Official Complete UI Screenshot Archive'}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
              {isFa ? 'دانلود بسته کامل تصاویر و اسکرین‌شات‌های سامانه (ZIP)' : 'Download Full App Screenshots Archive (ZIP)'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isFa
                ? 'تمامی ۲۶ بخش، منو، مدال، فرم‌های ارزیابی رسمی پناپ، کانبان ۷ مرحله‌ای، پورتال کارجو و تقویم مصاحبه با رزولوشن واقعی دسکتاپ (1440x900) تصویربرداری شده و درون یک فایل فشرده ZIP به همراه راهنمای متنی آماده دانلود مستقیم قرار گرفته است.'
                : 'All 26 screens, modals, official evaluation forms, 7-stage Kanban, applicant tracking portal and calendar have been captured in crisp 1440x900 desktop resolution.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>۲۶ تصویر PNG تفکیک‌شده</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <Archive className="w-3.5 h-3.5 text-blue-400" />
                <span>حجم فایل: ۹.۴ مگابایت (فشرده‌سازی حداکثری)</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>فونت وزیرمتن و طراحی ۱۰۰٪ راست‌چین</span>
              </span>
            </div>
          </div>

          {/* Direct Download Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <a
              href="/panap-ats-screenshots.zip"
              download="panap-ats-screenshots.zip"
              id="btn-download-all-screenshots-zip"
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-blue-900/50 hover:shadow-blue-900/70 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Archive className="w-5 h-5" />
              <span className="text-center">{isFa ? 'دانلود بسته فشرده اسکرین‌شات‌ها (ZIP)' : 'Download Screenshots (ZIP)'}</span>
              <Download className="w-4 h-4" />
            </a>

            <a
              href="/panap-ats-system-documentation.xlsx"
              download="panap-ats-system-documentation.xlsx"
              id="btn-download-system-docs-excel-secondary"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-emerald-400 border border-emerald-500/30 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{isFa ? 'دانلود مستندات معماری سیستم (اکسل ۶ برگه)' : 'System Documentation (Excel)'}</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {isFa ? cat.labelFa : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Grid of UI Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScreens.map((item) => {
          const isDownloading = downloadingId === item.id;
          const isDownloaded = downloadedIds[item.id];

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Image Preview Container */}
              <div>
                <div 
                  onClick={() => setPreviewItem(item)}
                  className="relative h-56 bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center border-b border-slate-100 group"
                >
                  <img
                    src={item.url}
                    alt={item.nameFa}
                    className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <span className="px-3.5 py-1.5 bg-white text-slate-900 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xl hover:bg-slate-100 transition-colors">
                      <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isFa ? 'پیش‌نمایش کامل' : 'Full Preview'}</span>
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700/50 shadow-xs">
                    {item.number}
                  </div>
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                    {isFa ? item.badgeFa : item.badgeEn}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {isFa ? item.nameFa : item.nameEn}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                      {isFa ? item.descriptionFa : item.descriptionEn}
                    </p>
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.featuresFa.slice(0, 3).map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer py-1.5 px-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isFa ? 'مشاهده' : 'View'}</span>
                </button>

                <button
                  onClick={() => downloadFile(item)}
                  disabled={isDownloading}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer ${
                    isDownloaded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                  }`}
                >
                  {isDownloaded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isFa ? 'دانلود شد' : 'Downloaded'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>{isFa ? 'دانلود تصویر' : 'Download PNG'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <FileImage className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white leading-tight">
                    {isFa ? previewItem.nameFa : previewItem.nameEn}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {previewItem.filename} — {previewItem.number}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewItem.url}
                  download={previewItem.filename}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>{isFa ? 'دانلود این تصویر' : 'Download Image'}</span>
                </a>

                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable Image */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 flex items-center justify-center">
              <img
                src={previewItem.url}
                alt={previewItem.nameFa}
                className="max-w-full rounded-xl shadow-2xl border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
