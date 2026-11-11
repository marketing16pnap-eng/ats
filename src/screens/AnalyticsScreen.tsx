import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  PieChart as PieChartIcon
} from 'lucide-react';
import { AppLanguage, MetricCardData, Candidate, JobRequisition, Department } from '../types';
import { initialMetrics } from '../mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

interface AnalyticsScreenProps {
  language?: AppLanguage;
  metrics?: MetricCardData[];
  candidates?: Candidate[];
  requisitions?: JobRequisition[];
  departments?: Department[];
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  language = 'PERSIAN',
  metrics = initialMetrics,
  candidates = [],
  requisitions = [],
  departments = [],
}) => {
  const isFa = language === 'PERSIAN';

  const channelData = [
    { name: isFa ? 'لینکدین سازمانی' : 'LinkedIn Recruiter', value: 580, color: '#0058BE' },
    { name: isFa ? 'جاب‌بوردها (ایران‌تلنت/جابینجا)' : 'Job Boards', value: 420, color: '#0284C7' },
    { name: isFa ? 'معرفی پرسنل (Referral)' : 'Employee Referral', value: 290, color: '#16A34A' },
    { name: isFa ? 'سایت استخدام و مستقیم' : 'Direct Career Site', value: 138, color: '#7C3AED' },
  ];

  const timeToHireData = [
    { month: 'فروردین', days: 28 },
    { month: 'اردیبهشت', days: 26 },
    { month: 'خرداد', days: 24 },
    { month: 'تیر', days: 21 },
    { month: 'مرداد', days: 19 },
    { month: 'شهریور', days: 17 },
  ];

  const departmentData = [
    { dept: 'فنی و مهندسی', hires: 12, target: 15 },
    { dept: 'طراحی و محصول', hires: 5, target: 6 },
    { dept: 'هوش مصنوعی', hires: 4, target: 4 },
    { dept: 'مارکتینگ و رشد', hires: 2, target: 3 },
    { dept: 'سرمایه‌های انسانی', hires: 1, target: 2 },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-300">
      {/* Top Stat Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{isFa ? 'میانگین زمان جذب (Time-to-Hire)' : 'Avg Time to Hire'}</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">۱۷ <span className="text-sm font-bold text-slate-500">روز</span></p>
          <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            -۳۸٪ بهبود سرعت فرآیند نسبت به فصل قبل
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{isFa ? 'نرخ پذیرش پیشنهاد (Acceptance)' : 'Offer Acceptance Rate'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">۸۸.۴٪</p>
          <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            ۲۲ پذیرش از ۲۵ پیشنهاد صادره
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{isFa ? 'دقت فیلتر هوشمند (ATS Accuracy)' : 'ATS Matching Score'}</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">۹۴.۲٪</p>
          <p className="text-xs text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-md inline-block">
            تطابق معیارهای فنی با مصاحبه‌کنندگان
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{isFa ? 'شاخص رضایت مدیران (HM Sat)' : 'Manager Satisfaction'}</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">۴.۸ <span className="text-sm font-bold text-slate-500">از ۵</span></p>
          <p className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md inline-block">
            بر اساس نظرسنجی از ۱۵ مدیر واحد
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attribution Channels Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                {isFa ? 'سهم کانال‌های جذب کارجو (Attribution)' : 'Candidate Channel Attribution'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">تعداد کل رزومه‌های دریافتی به تفکیک مبدا</p>
            </div>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip 
                  formatter={(value) => [`${value} رزومه`, 'تعداد']}
                  contentStyle={{ backgroundColor: '#131B2E', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time to Hire Velocity Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                {isFa ? 'روند سرعت تکمیل ردیف‌های شغلی (Days to Hire)' : 'Time to Hire Trend (Days)'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">کاهش مدت زمان از انتشار موقعیت تا امضای قرارداد</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeToHireData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} domain={[10, 35]} />
                <Tooltip 
                  formatter={(value) => [`${value} روز`, 'میانگین زمان جذب']}
                  contentStyle={{ backgroundColor: '#131B2E', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="days" 
                  stroke="#0058BE" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#0058BE' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Headcount Fulfillment */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-extrabold text-base text-slate-900">
              {isFa ? 'وضعیت تحقق اهداف جذب به تفکیک دپارتمان' : 'Headcount Fulfillment by Department'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">مقایسه استخدام‌های قطعی شده با سقف مجاز مصوب هیئت مدیره</p>
          </div>
          <Users className="w-5 h-5 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {departmentData.map((d, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">{d.dept}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-blue-900">{d.hires} <span className="text-xs font-medium text-slate-500">نفر</span></span>
                <span className="text-xs text-slate-400 font-medium">هدف: {d.target}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.round((d.hires / d.target) * 100))}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
