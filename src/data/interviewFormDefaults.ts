import { PhoneInterviewFormTemplate, InPersonInterviewFormTemplate } from '../types';

export const DEFAULT_PHONE_INTERVIEW_TEMPLATE: PhoneInterviewFormTemplate = {
  id: 'phone-template-v1',
  formTitle: 'فرم ۱ – مصاحبه تلفنی',
  formSubtitle: 'ارزیابی جامع تلفنی متقاضیان استخدام پناپ',
  instructionText: 'لطفاً در طول تماس تلفنی، پاسخ‌های کاندیدا را با دقت در بخش‌های زیر ثبت نموده و در پایان امتیاز و توصیه نهایی را مشخص فرمایید.',
  sections: [
    {
      id: 'sec-1',
      sectionNumber: 1,
      sectionTitle: '۱- ارزیابی اولیه از شغل و انگیزه',
      questions: [
        {
          id: 'q1',
          questionNumber: 1,
          questionText: 'چطور از شغل مورد نظر مطلع شدید؟',
          goalDescription: 'بررسی آشنایی متقاضی با شرکت و انگیزه او برای جستجوی این شغل',
          answerType: 'textarea',
          isRequired: true,
        },
        {
          id: 'q2',
          questionNumber: 2,
          questionText: 'چه چیزی شما را به این شغل و سازمان جذب کرد؟',
          goalDescription: 'سنجش انگیزه و تطابق با نیازهای شرکت',
          answerType: 'textarea',
          isRequired: true,
        },
        {
          id: 'q3',
          questionNumber: 3,
          questionText: 'چه چیزی در شغل قبلی شما را بیشتر از همه راضی کرده بود؟',
          goalDescription: 'درک ترجیحات شغلی و تطابق آن با شرایط فعلی',
          answerType: 'textarea',
          isRequired: false,
        }
      ]
    },
    {
      id: 'sec-2',
      sectionNumber: 2,
      sectionTitle: '۲- ارزیابی مهارت‌ها و تجربه‌های شغلی',
      questions: [
        {
          id: 'q4',
          questionNumber: 4,
          questionText: 'لطفاً خلاصه‌ای از تجربه کاری خود در حوزه این شغل بیان کنید.',
          goalDescription: 'ارزیابی سوابق کاری مرتبط و توانایی‌ها',
          answerType: 'textarea',
          isRequired: true,
        },
        {
          id: 'q5',
          questionNumber: 5,
          questionText: 'آیا تجربه‌ای در انجام [مورد خاص شغل موردنظر] دارید؟',
          goalDescription: 'ارزیابی مهارت‌های تخصصی',
          answerType: 'textarea',
          isRequired: true,
        },
        {
          id: 'q6',
          questionNumber: 6,
          questionText: 'چه نرم‌افزارها یا ابزارهایی را در شغل‌های قبلی خود استفاده کرده‌اید؟',
          goalDescription: 'ارزیابی مهارت‌های فنی و آشنایی با ابزارهای مرتبط',
          answerType: 'textarea',
          isRequired: true,
        }
      ]
    },
    {
      id: 'sec-3',
      sectionNumber: 3,
      sectionTitle: '۳- ارزیابی مهارت‌های ارتباطی و رفتاری',
      questions: [
        {
          id: 'q7',
          questionNumber: 7,
          questionText: 'چطور با تیم‌های مختلف در سازمان قبلی خود کار می‌کردید؟',
          goalDescription: 'ارزیابی توانایی کار تیمی و همکاری با افراد مختلف',
          answerType: 'textarea',
          isRequired: false,
        },
        {
          id: 'q8',
          questionNumber: 8,
          questionText: 'چه زمانی و چطور با یک مشکل چالش‌برانگیز مواجه شدید و چگونه آن را حل کردید؟',
          goalDescription: 'ارزیابی مهارت‌های حل مسئله و مدیریت چالش‌ها',
          answerType: 'textarea',
          isRequired: false,
        },
        {
          id: 'q9',
          questionNumber: 9,
          questionText: 'چطور با شرایط پر استرس و فشار کاری برخورد می‌کنید؟',
          goalDescription: 'ارزیابی توانایی کنترل استرس و مدیریت شرایط بحرانی',
          answerType: 'textarea',
          isRequired: false,
        }
      ]
    },
    {
      id: 'sec-4',
      sectionNumber: 4,
      sectionTitle: '۴- ارزیابی تطابق با فرهنگ سازمانی',
      questions: [
        {
          id: 'q10',
          questionNumber: 10,
          questionText: 'چطور محیط کاری ایده‌آل خود را توصیف می‌کنید؟',
          goalDescription: 'سنجش تطابق فرهنگی متقاضی با محیط کاری شرکت',
          answerType: 'textarea',
          isRequired: false,
        },
        {
          id: 'q11',
          questionNumber: 11,
          questionText: 'معتقدید چه ویژگی‌هایی در یک تیم برای موفقیت ضروری است؟',
          goalDescription: 'بررسی توانایی کار گروهی و نگرش به همکاری',
          answerType: 'textarea',
          isRequired: false,
        }
      ]
    },
    {
      id: 'sec-5',
      sectionNumber: 5,
      sectionTitle: '۵- ارزیابی انتظارات و اهداف شغلی',
      questions: [
        {
          id: 'q12',
          questionNumber: 12,
          questionText: 'چطور خود را در پنج سال آینده در این شرکت می‌بینید؟',
          goalDescription: 'ارزیابی اهداف بلند مدت متقاضی و تطابق با مسیر شغلی شرکت',
          answerType: 'textarea',
          isRequired: false,
        },
        {
          id: 'q13',
          questionNumber: 13,
          questionText: 'در نظر دارید در این شغل چه مهارت‌هایی را بهبود ببخشید؟',
          goalDescription: 'ارزیابی تمایل به یادگیری و توسعه فردی',
          answerType: 'textarea',
          isRequired: false,
        }
      ]
    },
    {
      id: 'sec-6',
      sectionNumber: 6,
      sectionTitle: '۶- پرسش‌های فنی و تخصصی',
      questions: [
        {
          id: 'q14',
          questionNumber: 14,
          questionText: 'چگونه در شغل قبلی خود [مورد خاص] را انجام می‌دادید؟',
          goalDescription: 'ارزیابی توانایی‌های فنی در زمینه کاری خاص',
          answerType: 'textarea',
          isRequired: false,
        },
        {
          id: 'q15',
          questionNumber: 15,
          questionText: 'آیا با ابزارهای خاصی که در این شغل استفاده می‌شوند آشنا هستید؟',
          goalDescription: 'بررسی آشنایی کاندیدا با ابزارهای مرتبط',
          answerType: 'textarea',
          isRequired: false,
        }
      ]
    },
    {
      id: 'sec-7',
      sectionNumber: 7,
      sectionTitle: '۷- ارزیابی شرایط کاری و قابلیت انعطاف',
      questions: [
        {
          id: 'q16',
          questionNumber: 16,
          questionText: 'آیا آماده‌اید که به‌طور حضوری یا در شیفت‌های خاصی کار کنید؟',
          goalDescription: 'بررسی تطابق با نیازهای کاری سازمان',
          answerType: 'textarea',
          isRequired: true,
        },
        {
          id: 'q17',
          questionNumber: 17,
          questionText: 'آیا تمایلی به انجام کارهای دورکاری یا پروژه‌های موقت دارید؟',
          goalDescription: 'بررسی انعطاف‌پذیری در نوع همکاری',
          answerType: 'textarea',
          isRequired: false,
        }
      ]
    },
    {
      id: 'sec-8',
      sectionNumber: 8,
      sectionTitle: '۸- پاسخ به سوالات متقاضی',
      questions: [
        {
          id: 'q18',
          questionNumber: 18,
          questionText: 'آیا سوالی از من یا از شرکت دارید؟',
          goalDescription: 'ارزیابی علاقه‌مندی و آگاهی کاندیدا از شرکت و شغل',
          answerType: 'textarea',
          isRequired: false,
        }
      ]
    },
    {
      id: 'sec-9',
      sectionNumber: 9,
      sectionTitle: '۹- ارزیابی نهایی و تصمیم‌گیری',
      questions: [
        {
          id: 'q19',
          questionNumber: 19,
          questionText: 'چرا شما فکر می‌کنید که بهترین گزینه برای این موقعیت شغلی هستید؟',
          goalDescription: 'ارزیابی اعتماد به نفس و توانایی کاندیدا در بیان دلایل انتخاب خود',
          answerType: 'textarea',
          isRequired: true,
        },
        {
          id: 'q20',
          questionNumber: 20,
          questionText: 'چطور از این فرصت استفاده خواهید کرد تا خود را در این شغل ثابت کنید؟',
          goalDescription: 'سنجش انگیزه و نقشه کاندیدا برای موفقیت در شغل',
          answerType: 'textarea',
          isRequired: false,
        }
      ]
    }
  ],
  scoringConfig: {
    maxScore: 10,
    showStrengths: true,
    showWeaknesses: true,
    showOverallEvaluation: true,
    recommendationOptions: [
      { value: 'INVITE_IN_PERSON', label: 'دعوت به مصاحبه حضوری', color: 'emerald' },
      { value: 'REQUEST_MORE_INFO', label: 'درخواست اطلاعات بیشتر', color: 'amber' },
      { value: 'REJECT', label: 'رد درخواست', color: 'rose' }
    ]
  }
};

export const DEFAULT_IN_PERSON_INTERVIEW_TEMPLATE: InPersonInterviewFormTemplate = {
  id: 'in-person-template-v1',
  formTitle: 'فرم ۲ – مصاحبه حضوری',
  instructionText: 'لطفاً فیلدهای زیر را به طور کامل تکمیل کنید',
  personalInfoTitles: {
    fullName: 'نام و نام خانوادگی',
    requestedRole: 'عنوان شغلی مورد نظر',
    birthDate: 'تاریخ تولد',
    personalityType: 'تیپ شخصیتی',
    bloodGroup: 'گروه خونی',
    phone: 'شماره تماس',
    maritalStatus: 'وضعیت تأهل',
    militaryStatus: 'وضعیت خدمت',
    email: 'پست الکترونیکی',
    address: 'آدرس',
    sourceWebsite: 'نحوه آشنایی با ما (نام سایت)',
    religion: 'دین',
    sect: 'مذهب',
  },
  educationTitles: {
    lastDegree: 'آخرین مقطع',
    gpa: 'معدل',
    majorAndUniversity: 'رشته و دانشگاه',
  },
  skillItems: [
    { key: 'english', label: 'زبان انگلیسی' },
    { key: 'word', label: 'ورد (Word)' },
    { key: 'excel', label: 'اکسل (Excel)' },
    { key: 'access', label: 'اکسس (Access)' },
    { key: 'internet', label: 'اینترنت و سرچ' },
    { key: 'digitalMarketing', label: 'دیجیتال مارکتینگ' },
    { key: 'fastTyping', label: 'تایپ سریع' },
    { key: 'accountingBasics', label: 'مبانی حسابداری' },
    { key: 'officeCorrespondence', label: 'مکاتبات اداری' },
  ],
  questionnaireTitles: [
    { key: 'isCurrentlyEmployed', label: 'آیا در حال حاضر مشغول به کار هستید؟' },
    { key: 'isStudent', label: 'آیا در حال حاضر دانشجو هستید؟' },
    { key: 'otherWorkTypes', label: 'غیر از همکاری تمام وقت در رده شغلی خود، قادر به چه نوع همکاری دیگری هستید؟' },
    { key: 'personalInterests', label: 'چند مورد از علاقه‌مندی‌های شخصی خود را نام ببرید:' },
    { key: 'moralStrengths', label: 'مهم‌ترین خصوصیات مثبت و نقاط قوت اخلاقی خود را بنویسید.' },
    { key: 'areasOfImprovement', label: 'چه ویژگی‌هایی را در خود نیازمند بهبود می‌بینید؟' },
    { key: 'whyPnap', label: 'چرا می‌خواهید با پناپ کار کنید؟' },
    { key: 'whyShouldWeHireYou', label: 'به نظر شما، چرا باید با شما همکاری کنیم؟' },
    { key: 'fiveYearsVisionInPnap', label: 'چطور خود را در پنج سال آینده در پناپ می‌بینید؟' },
    { key: 'bestWorkDayDescription', label: 'بهترین روز کاری که داشتید را توصیف کنید:' },
    { key: 'worstWorkDayDescription', label: 'بدترین روز کاری که داشتید چه روزی بوده است؟' },
    { key: 'challengesAndOvercoming', label: 'چالش‌هایی که با آن مواجه شدید و چگونه از آن‌ها عبور کردید؟' },
    { key: 'lastBookRead', label: 'آخرین بار چه کتابی را خوانده‌اید؟' },
    { key: 'tenMinutesLateReaction', label: 'آیا تا کنون پیش آمده که با ۱۰ دقیقه تأخیر حاضر شوید و مدیرتان با سخت‌گیری با شما برخورد کند؟' },
    { key: 'coworkersFrictionReaction', label: 'آیا تا کنون پیش آمده که همکاران شما، در مواردی بی‌جهت، شما را ناراحت یا اذیت کنند؟' },
    { key: 'explainInSimpleWords', label: 'به زبان ساده یک موضوع تخصصی را در چند کلمه توضیح دهید:' },
    { key: 'aboutPnapTwoLines', label: 'درباره شرکت پناپ، دو خط توضیح دهید.' },
    { key: 'teamworkExperience', label: 'چقدر مایل به کار گروهی هستید؟ در تجربه سازمانی خود با چه گروه‌هایی کار کرده‌اید؟' },
    { key: 'successFactorsInOrganization', label: 'برای فعالیت‌های سازمانی خود که به موفقیت منجر می‌شود چه عواملی را دخیل می‌دانید؟' },
    { key: 'emotionControlMethod', label: 'هیجانات خود را چگونه کنترل می‌کنید؟' },
  ],
  agreementText: 'و بدین وسیله صحت کلیه اطلاعات فوق را تایید می کنم. اینجانب در صورت نیاز با استعلام و تحقیق از سوابق شغلی و شخصی خود از طریق معرفین و سایر افراد و یا نهادهای مرتبط و معرفی شده موافقت دارم.'
};

// Storage Helpers
const PHONE_TEMPLATE_STORAGE_KEY = 'pnap_phone_interview_template_v1';
const IN_PERSON_TEMPLATE_STORAGE_KEY = 'pnap_in_person_interview_template_v1';

export function getPhoneInterviewTemplate(): PhoneInterviewFormTemplate {
  try {
    const saved = localStorage.getItem(PHONE_TEMPLATE_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse saved phone template', e);
  }
  return DEFAULT_PHONE_INTERVIEW_TEMPLATE;
}

export function savePhoneInterviewTemplate(template: PhoneInterviewFormTemplate): void {
  try {
    localStorage.setItem(PHONE_TEMPLATE_STORAGE_KEY, JSON.stringify(template));
  } catch (e) {
    console.error('Failed to save phone template', e);
  }
}

export function getInPersonInterviewTemplate(): InPersonInterviewFormTemplate {
  try {
    const saved = localStorage.getItem(IN_PERSON_TEMPLATE_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse saved in-person template', e);
  }
  return DEFAULT_IN_PERSON_INTERVIEW_TEMPLATE;
}

export function saveInPersonInterviewTemplate(template: InPersonInterviewFormTemplate): void {
  try {
    localStorage.setItem(IN_PERSON_TEMPLATE_STORAGE_KEY, JSON.stringify(template));
  } catch (e) {
    console.error('Failed to save in-person template', e);
  }
}
