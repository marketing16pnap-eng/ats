import React, { useState } from 'react';
import { X, Award, Star, CheckCircle, Save } from 'lucide-react';
import { Candidate, AppLanguage } from '../types';

interface ScorecardModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onSaveScorecard: (candidateId: string, score: number, feedback: string) => void;
}

export const ScorecardModal: React.FC<ScorecardModalProps> = ({
  candidate,
  isOpen,
  onClose,
  language,
  onSaveScorecard,
}) => {
  const isFa = language === 'PERSIAN';

  const [score, setScore] = useState(candidate?.rating || 4.5);
  const [feedback, setFeedback] = useState('');
  const [recommendation, setRecommendation] = useState<'STRONG_YES' | 'YES' | 'NEUTRAL' | 'NO'>('STRONG_YES');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate) return;
    onSaveScorecard(candidate.id, score, feedback);
    onClose();
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="scorecard-dialog"
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
      >
        <div className="bg-[#131B2E] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{isFa ? 'فرم ارزیابی و امتیازدهی مصاحبه' : 'Interview Scorecard'}</h3>
              <p className="text-xs text-slate-400">{candidate.name} ({candidate.role})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">امتیاز شایستگی کلی (از ۵ ستاره):</label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setScore(star)}
                  className="p-1 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Star className={`w-8 h-8 ${score >= star ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              ))}
              <span className="text-sm font-bold text-slate-700 mr-2 font-mono">{score} / 5</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">توصیه نهایی استخدام:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRecommendation('STRONG_YES')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  recommendation === 'STRONG_YES'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                تایید قاطع (Strong Hire)
              </button>
              <button
                type="button"
                onClick={() => setRecommendation('YES')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  recommendation === 'YES'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                تایید مشروط (Hire)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">شرح ارزیابی و بازخورد مصاحبه‌کننده:</label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="نقاط قوت، نقاط قابل بهبود، تسلط تخصصی و تطابق با فرهنگ تیمی..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              ثبت ارزیابی نهایی
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
