import React from 'react';
import { 
  X, 
  Briefcase, 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  Star, 
  Sparkles, 
  Eye, 
  Award, 
  Clock, 
  CheckCircle2, 
  UserPlus,
  Plus
} from 'lucide-react';
import { JobRequisition, Candidate, AppLanguage, CandidateStatus } from '../types';

interface RequisitionCandidatesModalProps {
  requisition: JobRequisition | null;
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  language?: AppLanguage;
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenNewCandidate?: () => void;
  onOpenScorecard?: (candidate: Candidate) => void;
}

export const RequisitionCandidatesModal: React.FC<RequisitionCandidatesModalProps> = ({
  requisition,
  isOpen,
  onClose,
  candidates,
  language = 'PERSIAN',
  onSelectCandidate,
  onOpenNewCandidate,
  onOpenScorecard,
}) => {
  if (!isOpen || !requisition) return null;
  const isFa = language === 'PERSIAN';

  // Filter candidates matching this requisition by title or department, and whose status is in-progress / active (not REJECTED)
  const activeCandidates = candidates.filter((c) => {
    const matchesTitle = 
      c.role.toLowerCase().includes(requisition.title.toLowerCase()) ||
      requisition.title.toLowerCase().includes(c.role.toLowerCase()) ||
      c.department === requisition.department;
    
    const isActiveStatus = c.status !== 'REJECTED';
    return matchesTitle && isActiveStatus;
  });

  const getStageBadge = (cand: Candidate) => {
    if (cand.status === 'HIRED' || cand.currentStageFa === 'استخدام شده') {
      return { label: isFa ? 'استخدام شده' : 'Hired', class: 'bg-emerald-50 text-emerald-700 border-emerald-300' };
    }
    if (cand.status === 'OFFER_SENT' || cand.currentStageFa === 'پیشنهاد شغلی') {
      return { label: isFa ? 'پیشنهاد شغلی' : 'Offer Sent', class: 'bg-amber-50 text-amber-700 border-amber-300' };
    }
    if (cand.status === 'HR_INTERVIEW' || cand.currentStageFa === 'مصاحبه مدیریت' || cand.currentStageFa === 'مصاحبه منابع انسانی') {
      return { label: isFa ? 'مصاحبه مدیریت' : 'HR Interview', class: 'bg-purple-50 text-purple-700 border-purple-300' };
    }
    if (cand.status === 'TECH_INTERVIEW' || cand.currentStageFa === 'مصاحبه فنی') {
      return { label: isFa ? 'مصاحبه فنی' : 'Tech Interview', class: 'bg-blue-50 text-blue-700 border-blue-300' };
    }
    if (cand.status === 'SCREENING' || cand.currentStageFa === 'تکمیل فرم سایت' || cand.currentStageFa === 'بررسی رزومه') {
      return { label: isFa ? 'ارزیابی اولیه' : 'Screening', class: 'bg-sky-50 text-sky-700 border-sky-300' };
    }
    return { label: cand.currentStageFa || (isFa ? 'ثبت اولیه' : 'Applied'), class: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div 
        id="requisition-candidates-modal"
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111C35] p-6 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-xl shadow-inner">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                  {requisition.department}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{requisition.id}</span>
              </div>
              <h3 className="text-lg font-black text-white">{requisition.title}</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isFa 
                  ? `کارجویان فعال در پایپ‌لاین ارزیابی (${activeCandidates.length} متقاضی در جریان)`
                  : `Active candidate pipeline (${activeCandidates.length} applicants)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenNewCandidate && (
              <button
                onClick={() => {
                  onClose();
                  onOpenNewCandidate();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isFa ? 'افزودن کارجو' : 'Add Candidate'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Requisition Meta Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium">
              {isFa ? 'ظرفیت کل:' : 'Target:'} <strong className="text-slate-900 font-bold">{requisition.openPositions} نفر</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">
              {isFa ? 'جذب‌شده:' : 'Filled:'} <strong className="text-emerald-700 font-bold">{requisition.filledPositions} نفر</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">
              {isFa ? 'بودجه ماهانه:' : 'Budget:'} <strong className="text-slate-900 font-mono">{requisition.budgetRange}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">{isFa ? 'مدیر استخدام:' : 'Hiring Manager:'}</span>
            <span className="font-bold text-slate-800">{requisition.hiringManager}</span>
          </div>
        </div>

        {/* Candidates List Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeCandidates.length > 0 ? (
            <div className="space-y-3">
              {activeCandidates.map((cand) => {
                const stage = getStageBadge(cand);
                return (
                  <div
                    key={cand.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-base flex items-center justify-center shrink-0 shadow-sm">
                        {cand.name[0]}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                            {cand.name}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${stage.class}`}>
                            {stage.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          {cand.phone && (
                            <span className="flex items-center gap-1 font-mono text-slate-600">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {cand.phone}
                            </span>
                          )}
                          {cand.experienceYears > 0 && (
                            <span>{cand.experienceYears} سال سابقه</span>
                          )}
                          {cand.trackingCode && (
                            <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                              کد ارجاع: {cand.trackingCode}
                            </span>
                          )}
                        </div>

                        {cand.skills && cand.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {cand.skills.slice(0, 3).map((sk, idx) => (
                              <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      {/* ATS Score */}
                      <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100 text-center px-3">
                        <span className="text-[9px] text-blue-600 font-bold block">ATS Match</span>
                        <span className="text-xs font-black text-blue-900">{cand.matchScore}٪</span>
                      </div>

                      {/* Score */}
                      <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 text-center px-3">
                        <span className="text-[9px] text-amber-600 font-bold block">امتیاز</span>
                        <span className="text-xs font-black text-amber-900">{cand.rating} / ۵</span>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => onSelectCandidate(cand)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isFa ? 'پرونده کارجو' : 'Dossier'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Users className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">
                {isFa 
                  ? 'در حال حاضر هیچ کارجوی فعالی در پایپ‌لاین این ردیف شغلی ثبت نشده است.'
                  : 'No active candidates currently in the pipeline for this requisition.'}
              </p>
              {onOpenNewCandidate && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenNewCandidate();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isFa ? 'ثبت اولین کارجو در این موقعیت' : 'Add First Candidate'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            {isFa 
              ? 'با کلیک روی «پرونده کارجو» مشخصات، سوابق ۲۱ گانه شیت سایت و ارزیابی‌ها باز می‌شود.'
              : 'Clicking Dossier opens complete 21-field data sheet and interview scorecards.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
          >
            {isFa ? 'بستن' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
