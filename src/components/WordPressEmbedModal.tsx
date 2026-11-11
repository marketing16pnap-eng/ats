import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Code, 
  ExternalLink, 
  Globe, 
  FileCode2, 
  Layers,
  Sparkles,
  Share2
} from 'lucide-react';

interface WordPressEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPreview: () => void;
}

export const WordPressEmbedModal: React.FC<WordPressEmbedModalProps> = ({
  isOpen,
  onClose,
  onOpenPreview,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ats.company.ir';
  const embedUrl = `${currentOrigin}/?view=apply`;
  const iframeCode = `<iframe \n  src="${embedUrl}" \n  width="100%" \n  height="980" \n  frameborder="0" \n  style="border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); width: 100%; min-height: 980px;" \n  title="فرم ثبت‌نام و ارسال رزومه ATS">\n</iframe>`;
  
  const shortcodeCode = `[ats_career_form url="${embedUrl}"]`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none font-sans" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right">
        {/* Modal Header */}
        <div className="bg-[#111C35] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base">کد اختصاصی امبد در وردپرس و وب‌سایت‌ها</h3>
              <p className="text-xs text-slate-400 mt-0.5">دریافت مستقیم رزومه‌های سایت وردپرس در سامانه ATS</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Info Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black mb-1">همگام‌سازی لحظه‌ای با بانک کارجویان ATS:</strong>
              با قرار دادن این کد در برگه «فرصت‌های شغلی / استخدام» در وردپرس (یا صفحه‌ساز المنتور / گوتنبرگ)، هر فرمی که کاربران پر کنند فوراً در بانک کارجویان، دیتابیس MySQL و شیت Site ثبت می‌گردد.
            </div>
          </div>

          {/* 1. Iframe Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-blue-600" />
                <span>۱. کد HTML / آی‌فریم (Iframe Code برای المنتور یا HTML سفارشی)</span>
              </span>
              <button
                onClick={() => copyToClipboard(iframeCode, 'iframe')}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedType === 'iframe' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'iframe' ? 'کپی شد!' : 'کپی کد Iframe'}</span>
              </button>
            </div>

            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto border border-slate-800 dir-ltr text-left leading-relaxed">
              {iframeCode}
            </pre>
          </div>

          {/* 2. Direct Career Portal Link */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-purple-600" />
                <span>۲. آدرس مستقیم صفحه ثبت‌نام کارجویان (Direct URL)</span>
              </span>
              <button
                onClick={() => copyToClipboard(embedUrl, 'url')}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedType === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'url' ? 'کپی شد!' : 'کپی لینک مستقیم'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono dir-ltr text-left break-all">
              {embedUrl}
            </div>
          </div>

          {/* 3. Guide for WordPress */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs text-slate-700">
            <h4 className="font-black text-slate-900">نحوه درج در وردپرس:</h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 pr-2">
              <li>وارد پیشخوان وردپرس شوید و یک برگه جدید به نام <strong>«همکاری با ما»</strong> بسازید.</li>
              <li>المان <strong>HTML سفارشی (Custom HTML)</strong> در المنتور یا گوتنبرگ را به صفحه اضافه کنید.</li>
              <li>کد Iframe بالا را درون آن جای‌گذاری و برگه را منتشر کنید.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenPreview();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>مشاهده و تست زنده فرم ثبت‌نام کارجو</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
