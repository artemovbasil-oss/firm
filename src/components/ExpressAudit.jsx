import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, Send, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import CardShaderHover from './CardShaderHover';

export default function ExpressAudit({ lang, onSuccessLead }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);

  const t = TRANSLATIONS[lang].audit;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      setMousePos({ x, y });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setIsSubmitting(true);
    setStatus(null);

    const payload = {
      type: 'EXPRESS_AUDIT_REQUEST',
      targetUrl: targetUrl.trim() || (lang === 'en' ? 'Not specified' : (lang === 'kz' ? 'Көрсетілмеген' : 'Не указан')),
      contact: contact.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setStatus('success');
        setTargetUrl('');
        setContact('');
        if (onSuccessLead) onSuccessLead();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="audit" className="py-32 sm:py-40 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Luxury Studio Diagnostic Card with WebGL Thermal Heatmap & Film Noise on Hover */}
        <div 
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          style={{ borderRadius: '24px' }}
          className="p-8 sm:p-14 lg:p-20 rounded-3xl bg-slate-950 text-white relative overflow-hidden shadow-2xl border border-white/10 isolate transform-gpu"
        >
          {/* Subtle Dynamic WebGL Thermal Heatmap & Film Noise on Hover */}
          <CardShaderHover 
            colorMode="thermal" 
            isHovered={isHovered} 
            mousePos={mousePos} 
            borderRadius={24}
          />
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.04] text-xs font-mono uppercase tracking-wider text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{lang === 'en' ? 'Diagnostic Teardown' : (lang === 'kz' ? 'Экспресс-аудит' : 'Экспресс-аудит')}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white uppercase leading-[1.02]">
              {lang === 'en' ? (
                <>Want to know why your <br className="hidden sm:inline" />platform isn't converting?</>
              ) : lang === 'kz' ? (
                <>Сайтыңыз неліктен <br className="hidden sm:inline" />сатылым әкелмей жатыр?</>
              ) : (
                <>Хотите узнать, почему ваш <br className="hidden sm:inline" />сайт не приносит продажи?</>
              )}
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              {lang === 'en'
                ? 'Send your URL. Our senior partners will record a 10-minute private video breakdown and map out your conversion bottlenecks within 24 hours. 100% free.'
                : lang === 'kz'
                ? 'Сайт немесе парақша сілтемесін жіберіңіз. Бас сарапшыларымыз 24 сағат ішінде жеке 10 минуттық бейне-талдау мен өсу картасын тегін дайындап береді.'
                : 'Пришлите ссылку на сайт. Старшие эксперты разберут UX, скорость и воронку продаж в закрытом 10-минутном видеоразборе за 24 часа. Без воды.'}
            </p>

            {/* Architectural High-Converting Form Console */}
            <form onSubmit={handleSubmit} className="pt-6 max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Field 1: Project / Website URL */}
                <div className="relative flex items-center rounded-2xl bg-white/[0.07] hover:bg-white/[0.1] focus-within:bg-white/[0.12] border border-white/15 focus-within:border-white/40 transition-all backdrop-blur-xl shadow-inner">
                  <div className="pl-4 pr-1 text-slate-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder={lang === 'en' ? 'https://yourwebsite.com' : (lang === 'kz' ? 'Сайт немесе жоба сілтемесі' : 'Ссылка на ваш сайт или проект')}
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full py-4 pr-4 pl-2 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>

                {/* Field 2: Direct Contact Handle */}
                <div className="relative flex items-center rounded-2xl bg-white/[0.07] hover:bg-white/[0.1] focus-within:bg-white/[0.12] border border-white/15 focus-within:border-white/40 transition-all backdrop-blur-xl shadow-inner">
                  <div className="pl-4 pr-1 text-cyan-400 shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'Telegram (@user) or WhatsApp *' : (lang === 'kz' ? 'Telegram (@user) немесе WhatsApp *' : 'Telegram (@user) или WhatsApp *')}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full py-4 pr-4 pl-2 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Button: Centered & Monumental */}
              <div className="pt-2 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white text-slate-950 font-heading font-black text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2.5 shadow-2xl shadow-white/10 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>...</span>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Get Free Teardown' : (lang === 'kz' ? 'Тегін аудит алу' : 'Получить бесплатный аудит')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>

              {status === 'success' && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center justify-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.successMsg}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-4 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-center justify-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{t.errorMsg}</span>
                </div>
              )}
            </form>

            {/* 3 Minimalist Guarantees */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'en' ? 'Senior Review · Zero Bots' : (lang === 'kz' ? 'Ботсыз · Тек сарапшылар' : 'Ручной разбор · Без ботов')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{lang === 'en' ? '24h Turnaround' : (lang === 'kz' ? '24 сағат ішінде' : 'Готовность 24 часа')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>{lang === 'en' ? '100% Confidential' : (lang === 'kz' ? '100% Құпиялық' : '100% Конфиденциально')}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
