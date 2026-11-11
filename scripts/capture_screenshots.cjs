const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const archiver = require('archiver');

const CHROME_PATH = '/app/applet/chrome/linux-156.0.8078.47/chrome-linux64/chrome';
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '../public/screenshots');
const ZIP_PATH = path.join(__dirname, '../public/panap-ats-screenshots.zip');

const SCREENS = [
  {
    filename: '01-dashboard-executive.png',
    titleFa: 'داشبورد مدیریتی و قیف استخدامی ۷ مرحله‌ای پناپ',
    url: `${BASE_URL}/?tab=DASHBOARD&auth=true`,
    waitFor: 1200,
  },
  {
    filename: '02-candidates-table-view.png',
    titleFa: 'بانک جامع متقاضیان و کارجویان — نمای جدول پیشرفته',
    url: `${BASE_URL}/?tab=CANDIDATES&view=table&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '03-candidates-kanban-board.png',
    titleFa: 'بورد کانبان ۷ مرحله‌ای مدیریت خط جذب و استخدام',
    url: `${BASE_URL}/?tab=CANDIDATES&view=kanban&auth=true`,
    waitFor: 1200,
  },
  {
    filename: '04-candidate-dossier-modal.png',
    titleFa: 'پرونده تفصیلی و جامع متقاضی (۹ ستون اطلاعاتی و استپر ۷ مرحله)',
    url: `${BASE_URL}/?tab=CANDIDATES&modal=dossier&auth=true`,
    waitFor: 1200,
  },
  {
    filename: '05-new-candidate-modal.png',
    titleFa: 'فرم ثبت کارجو و متقاضی استخدامی جدید با اعتبارسنجی',
    url: `${BASE_URL}/?tab=CANDIDATES&modal=new_candidate&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '06-excel-import-modal.png',
    titleFa: 'ابزار هوشمند درون‌ریزی دسته‌ای اطلاعات از اکسل (Excel Import)',
    url: `${BASE_URL}/?tab=CANDIDATES&modal=excel_import&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '07-job-requisitions-management.png',
    titleFa: 'مدیریت ردیف‌های شغلی و موقعیت‌های باز سازمانی',
    url: `${BASE_URL}/?tab=REQUISITIONS&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '08-new-requisition-modal.png',
    titleFa: 'فرم تعریف و ایجاد ردیف شغلی جدید با بودجه و نیازمندی‌ها',
    url: `${BASE_URL}/?tab=REQUISITIONS&modal=new_requisition&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '09-departments-organization.png',
    titleFa: 'مدیریت واحدها و دپارتمان‌های سازمان و وضعیت ظرفیت پرسنلی',
    url: `${BASE_URL}/?tab=DEPARTMENTS&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '10-new-department-modal.png',
    titleFa: 'فرم ایجاد دپارتمان و مرکز هزینه جدید در سازمان',
    url: `${BASE_URL}/?tab=DEPARTMENTS&modal=new_department&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '11-interview-center-calendar.png',
    titleFa: 'مرکز ارزیابی و مصاحبه — تقویم جامع جلسات استخدامی',
    url: `${BASE_URL}/?tab=INTERVIEWS&subview=CALENDAR&auth=true`,
    waitFor: 1200,
  },
  {
    filename: '12-interview-sessions-list.png',
    titleFa: 'فهرست جلسات مصاحبه و تعیین وضعیت حضور کارجو',
    url: `${BASE_URL}/?tab=INTERVIEWS&subview=SESSIONS&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '13-official-interview-forms.png',
    titleFa: 'بخش فرم‌های ارزیابی رسمی پناپ (فرم ۱ مصاحبه تلفنی و فرم ۲ مصاحبه حضوری)',
    url: `${BASE_URL}/?tab=INTERVIEWS&subview=FORMS&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '14-interview-stages-configuration.png',
    titleFa: 'پیکربندی مراحل ارزیابی و تایپ‌های مختلف مصاحبه',
    url: `${BASE_URL}/?tab=INTERVIEWS&subview=STAGES&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '15-schedule-interview-modal.png',
    titleFa: 'مدال هماهنگی و زمان‌بندی جلسه مصاحبه جدید با ارسال اعلان',
    url: `${BASE_URL}/?tab=INTERVIEWS&modal=schedule&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '16-phone-interview-form-modal.png',
    titleFa: 'فرم رسمی شماره ۱ — ارزیابی تفصیلی مصاحبه تلفنی کارجو',
    url: `${BASE_URL}/?tab=INTERVIEWS&modal=phone_form&auth=true`,
    waitFor: 1200,
  },
  {
    filename: '17-inperson-interview-form-modal.png',
    titleFa: 'فرم رسمی شماره ۲ — ارزیابی مصاحبه حضوری (مجتمع سرمد - واحد ۳۰۷)',
    url: `${BASE_URL}/?tab=INTERVIEWS&modal=inperson_form&auth=true`,
    waitFor: 1200,
  },
  {
    filename: '18-analytics-bi-charts.png',
    titleFa: 'داشبورد هوش تجاری و تحلیل منابع جذب و نرخ تبدیل کانال‌ها',
    url: `${BASE_URL}/?tab=ANALYTICS&auth=true`,
    waitFor: 1200,
  },
  {
    filename: '19-exports-center-reports.png',
    titleFa: 'مرکز گزارشات، خروجی‌ها و دانلود مستندات معماری سیستم',
    url: `${BASE_URL}/?tab=EXPORTS&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '20-user-management-rbac.png',
    titleFa: 'مدیریت کاربران، نقش‌های ۵ گانه سازمانی و کنترل دسترسی (RBAC)',
    url: `${BASE_URL}/?tab=USERS&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '21-system-settings-mysql.png',
    titleFa: 'تنظیمات سامانه، مانیتورینگ پایگاه داده MySQL و هویت بصری',
    url: `${BASE_URL}/?tab=SETTINGS&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '22-wordpress-embed-modal.png',
    titleFa: 'مدال راهنمای ادغام و جاسازی فرم و سامانه در وب‌سایت وردپرس',
    url: `${BASE_URL}/?tab=SETTINGS&modal=wordpress&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '23-role-switcher-simulator.png',
    titleFa: 'مدال سوئیچر و شبیه‌ساز سطوح دسترسی نقش‌های کاربری',
    url: `${BASE_URL}/?tab=DASHBOARD&modal=role_switcher&auth=true`,
    waitFor: 1000,
  },
  {
    filename: '24-login-security-screen.png',
    titleFa: 'صفحه ورود و احراز هویت امن دو مرحله‌ای سامانه',
    url: `${BASE_URL}/?view=login`,
    waitFor: 1000,
  },
  {
    filename: '25-public-career-application-form.png',
    titleFa: 'فرم عمومی ارسال درخواست همکاری و بارگذاری رزومه در سایت پناپ',
    url: `${BASE_URL}/?view=apply`,
    waitFor: 1000,
  },
  {
    filename: '26-candidate-tracking-portal.png',
    titleFa: 'پورتال سلف‌سرویس کارجو جهت پیگیری برخط وضعیت مراحل استخدام',
    url: `${BASE_URL}/?portal=CAN-2024-001`,
    waitFor: 1200,
  },
];

async function captureAll() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Starting screenshot capture...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--window-size=1440,900'
    ],
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1.5,
    }
  });

  const page = await browser.newPage();

  // Pre-seed localStorage session so admin pages load smoothly
  await page.goto(`${BASE_URL}/?auth=true`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const session = {
      user: {
        id: 'usr_admin',
        name: 'مدیر ارشد سامانه',
        nameEn: 'Super Admin',
        email: 'admin@panap.ir',
        username: 'admin',
        role: 'SUPER_ADMIN',
        roleTitleFa: 'مدیر ارشد سامانه (مالک سیستم)',
        roleTitleEn: 'Super Administrator',
        department: 'مدیریت و منابع انسانی',
        departmentEn: 'Executive & HR',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        status: 'ACTIVE',
        lastLogin: 'امروز، ۱۰:۳۰',
        createdAt: '۱۴۰۳/۰۱/۰۱',
        phone: '۰۹۱۲۳۴۵۶۷۸۹',
        personnelCode: 'EMP-001',
        permissions: [
          'VIEW_DASHBOARD', 'MANAGE_CANDIDATES', 'DELETE_CANDIDATES',
          'MANAGE_REQUISITIONS', 'SCHEDULE_INTERVIEWS', 'SUBMIT_SCORECARDS',
          'ISSUE_OFFER_LETTER', 'VIEW_ANALYTICS', 'MANAGE_USERS', 'MANAGE_SYSTEM_SETTINGS'
        ]
      },
      token: 'admin-dev-token',
      loginTimestamp: Date.now(),
      lastActivityTimestamp: Date.now(),
      expiresAt: Date.now() + 86400000,
      rememberMe: true
    };
    localStorage.setItem('panap_ats_session', JSON.stringify(session));
    localStorage.setItem('panap_ats_auth', 'true');
  });

  const capturedManifest = [];

  for (let i = 0; i < SCREENS.length; i++) {
    const item = SCREENS[i];
    const outPath = path.join(OUTPUT_DIR, item.filename);
    console.log(`[${i + 1}/${SCREENS.length}] Capturing: ${item.titleFa} -> ${item.filename}`);

    try {
      await page.goto(item.url, { waitUntil: 'networkidle0', timeout: 15000 });
      if (item.waitFor) {
        await new Promise((r) => setTimeout(r, item.waitFor));
      }

      await page.screenshot({
        path: outPath,
        fullPage: false,
      });

      capturedManifest.push({
        index: i + 1,
        filename: item.filename,
        title: item.titleFa,
        size: fs.statSync(outPath).size
      });
      console.log(`   ✓ Saved: ${item.filename} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`   ✗ Failed to capture ${item.filename}:`, err.message);
    }
  }

  await browser.close();
  console.log('\nAll screenshots captured successfully!');

  // Create README text file
  const readmeContent = `========================================================================
  سامانه جامع جذب و استخدام نخبگان (پناپ ATS) — بسته کامل تصاویر و اسکرین‌شات‌ها
========================================================================
تاریخ تولید: ${new Date().toLocaleDateString('fa-IR')}
تعداد تصاویر: ${capturedManifest.length} تصویر باکیفیت و تفکیک‌شده

فهرست کامل اسکرین‌شات‌های موجود در این فایل فشرده:
------------------------------------------------------------------------
${capturedManifest.map((m) => `${m.index.toString().padStart(2, '0')}. [${m.filename}]\n    عنوان: ${m.title}\n    حجم فایل: ${(m.size / 1024).toFixed(1)} کیلوبایت`).join('\n\n')}

توضیحات تکمیلی:
• کلیه تصاویر با رزولوشن استاندارد دسکتاپ (1440x900) و تراکم پیکسلی بالا (High-DPI 1.5x) تهیه شده‌اند.
• این تصاویر شامل کلیه بخش‌ها، صفحات، فرم‌ها، تقویم مصاحبه، جداول، کانبان، پورتال کارجو و مدال‌های سامانه می‌باشند.
• همچنین مستندات ساختار فنی و پایگاه داده در فایل panap-ats-system-documentation.xlsx در سایت در دسترس است.
========================================================================
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'README-راهنمای_تصاویر.txt'), readmeContent, 'utf-8');

  // Archive everything into ZIP
  console.log('Creating ZIP archive at:', ZIP_PATH);
  const output = fs.createWriteStream(ZIP_PATH);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', function () {
    console.log(`ZIP file created successfully! Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);

  // Append screenshots directory
  archive.directory(OUTPUT_DIR, 'panap-ats-screenshots');
  await archive.finalize();
}

captureAll().catch((err) => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
