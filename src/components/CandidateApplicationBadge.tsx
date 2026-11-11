import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Briefcase, Calendar, Building2, CheckCircle2, XCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { Candidate, CandidatePreviousApplication } from '../types';
import { getCandidateApplicationHistory, getApplicationStatusColor } from '../utils/candidateApplications';

interface CandidateApplicationBadgeProps {
  candidate: Candidate;
  allCandidates?: Candidate[];
  compact?: boolean;
  onSelectHistoryTab?: () => void;
  className?: string;
}

export const CandidateApplicationBadge: React.FC<CandidateApplicationBadgeProps> = ({
  candidate,
  allCandidates = [],
  compact = false,
  onSelectHistoryTab,
  className = '',
}) => {
  const history = getCandidateApplicationHistory(candidate, allCandidates);
  const [isOpen, setIsOpen] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; right: number } | null>(null);

  if (history.length === 0) {
    return null;
  }

  const handleMouseEnter = () => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      // Position above or below depending on viewport
      const showBelow = rect.top < 260;
      setTooltipPos({
        top: showBelow ? rect.bottom + 6 : rect.top - 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div 
      ref={badgeRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectHistoryTab) {
          onSelectHistoryTab();
        } else {
          setIsOpen(!isOpen);
        }
      }}
    >
      {/* Visual Badge Indicator */}
      <div
        id={`badge-candidate-prev-apps-${candidate.id}`}
        className={`inline-flex items-center gap-1 font-bold rounded-full transition-all cursor-pointer select-none shadow-2xs ${
          compact
            ? 'px-1.5 py-0.5 text-[9px] bg-purple-100/90 hover:bg-purple-200 text-purple-800 border border-purple-300/80'
            : 'px-2 py-0.5 text-[10px] bg-purple-50 hover:bg-purple-100/90 text-purple-700 border border-purple-200/90'
        }`}
        title={`ارسال مکرر رزومه: ${history.length} سابقه قبلی`}
      >
        <RotateCcw className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-purple-600 shrink-0`} />
        <span>
          {compact ? `${history.length}` : `سابقه ارسال (${history.length})`}
        </span>
      </div>

      {/* Rich Fixed Tooltip Popup (renders outside overflow constraints) */}
      {isOpen && tooltipPos && (
        <div
          style={{
            position: 'fixed',
            top: tooltipPos.top,
            right: tooltipPos.right,
            zIndex: 9999,
          }}
          className="-translate-y-full mb-1 w-80 sm:w-96 p-3.5 bg-slate-900/98 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 text-right text-xs animate-in fade-in zoom-in-95 pointer-events-auto"
          dir="rtl"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tooltip Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <RotateCcw className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block">
                  سوابق ارسال قبلی رزومه
                </span>
                <span className="text-[10px] text-purple-300">
                  {candidate.name} ({history.length} موقعیت قبلی)
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/60 font-mono font-bold">
              +{history.length} سابقه
            </span>
          </div>

          {/* Current Job Reference */}
          <div className="mb-2.5 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">موقعیت فعلی:</span>
            <span className="font-bold text-blue-300 truncate max-w-[180px]">
              {candidate.role} ({candidate.appliedDate || 'جاری'})
            </span>
          </div>

          {/* Previous Applications List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            <div className="text-[10px] text-slate-400 font-semibold mb-1">
              رزومه‌های ارسال‌شده قبلی برای سایر موقعیت‌ها:
            </div>
            {history.map((app, idx) => {
              const statusColors = getApplicationStatusColor(app.status);
              return (
                <div
                  key={app.id || idx}
                  className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/70 hover:border-purple-500/40 transition-colors space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Briefcase className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="font-bold text-white text-xs truncate">
                        {app.jobTitle}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${statusColors.badgeBg} ${statusColors.badgeText} border ${statusColors.badgeBorder}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/50">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>ارسال: <strong className="text-slate-300 font-mono">{app.appliedDate}</strong></span>
                    </div>
                    {app.department && (
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[110px]">{app.department}</span>
                      </div>
                    )}
                  </div>

                  {app.rejectionReason && (
                    <div className="text-[10px] text-rose-300/90 bg-rose-950/40 px-2 py-1 rounded-lg border border-rose-900/40 mt-1">
                      علت رد: {app.rejectionReason}
                    </div>
                  )}

                  {app.notes && !app.rejectionReason && (
                    <div className="text-[10px] text-slate-300/90 bg-slate-900/60 px-2 py-1 rounded-lg mt-1">
                      {app.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Call to Action */}
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>برای بررسی کارتی، پرونده کارجو را باز کنید</span>
            {onSelectHistoryTab && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHistoryTab();
                }}
                className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span>مشاهده سوابق</span>
                <ChevronLeft className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
