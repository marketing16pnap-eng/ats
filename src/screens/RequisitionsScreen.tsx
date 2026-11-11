import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  PauseCircle, 
  AlertCircle, 
  ChevronLeft,
  DollarSign
} from 'lucide-react';
import { JobRequisition, RequisitionStatus, Priority, AppLanguage } from '../types';

interface RequisitionsScreenProps {
  requisitions: JobRequisition[];
  language: AppLanguage;
  onToggleStatus: (id: string) => void;
  onOpenNewModal: () => void;
}

export const RequisitionsScreen: React.FC<RequisitionsScreenProps> = ({
  requisitions,
  language,
  onToggleStatus,
  onOpenNewModal,
}) => {
  const isFa = language === 'PERSIAN';

  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const filteredRequisitions = requisitions.filter(
    (r) => selectedDept === 'ALL' || r.department === selectedDept
  );

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'URGENT':
        return { label: isFa ? 'فوری' : 'Urgent', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'HIGH':
        return { label: isFa ? 'بالا' : 'High', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'MEDIUM':
        return { label: isFa ? 'متوسط' : 'Medium', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'LOW':
        return { label: isFa ? 'عادی' : 'Low', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const getStatusBadge = (st: RequisitionStatus) => {
    switch (st) {
      case 'ACTIVE':
        return { label: isFa ? 'فعال' : 'Active', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'PAUSED':
        return { label: isFa ? 'متوقف' : 'Paused', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'CLOSED':
        return { label: isFa ? 'تکمیل شده' : 'Closed', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['ALL', 'فنی و مهندسی', 'طراحی و محصول', 'هوش مصنوعی', 'سرمایه‌های انسانی', 'بازرگانی خارجی'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDept === dept
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {dept === 'ALL' ? (isFa ? 'تمام دپارتمان‌ها' : 'All Departments') : dept}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isFa ? 'ایجاد ردیف شغلی جدید' : 'New Job Requisition'}</span>
        </button>
      </div>

      {/* Requisitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRequisitions.map((req, rIdx) => {
          const pBadge = getPriorityBadge(req.priority);
          const sBadge = getStatusBadge(req.status);
          const percentFilled = Math.round((req.filledPositions / req.openPositions) * 100);

          return (
            <div
              key={`${req.id || 'req'}-${rIdx}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${pBadge.bg}`}>
                        {pBadge.label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${sBadge.bg}`}>
                        {sBadge.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{req.id}</span>
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900">{req.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{req.department} — {req.location}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {req.description}
                </p>

                {/* Headcount Progress */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">{isFa ? 'پیشرفت تکمیل ظرفیت سازمانی' : 'Headcount Fulfillment'}</span>
                    <span className="text-slate-900 font-mono">{req.filledPositions} از {req.openPositions} نفر ({percentFilled}٪)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${percentFilled}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">{isFa ? 'بودجه ماهانه' : 'Monthly Budget'}</span>
                    <span className="text-xs font-black text-slate-800">{req.budgetRange}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">{isFa ? 'رزومه‌های دریافتی' : 'Total Applicants'}</span>
                    <span className="text-xs font-black text-blue-700 font-mono">{req.applicantsCount} متقاضی</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {req.requiredSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {isFa ? `مسئول: ${req.hiringManager}` : `Manager: ${req.hiringManager}`}
                </span>

                <button
                  onClick={() => onToggleStatus(req.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  {req.status === 'ACTIVE' ? (isFa ? 'توقف موقت' : 'Pause') : (isFa ? 'فعال‌سازی' : 'Activate')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
