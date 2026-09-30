import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Send, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import BlindTextReveal from './BlindTextReveal';

export default function ExpressAudit({ lang, onSuccessLead }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  const t = TRANSLATIONS[lang].audit;

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, []);

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
    <section id="audit" className="py-20 sm:py-28 lg:py-32 relative w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Luxury Studio Diagnostic Card with Crisp Web-Optimized Background Video */}
        <div 
          ref={cardRef}
          style={{ 
            borderRadius: '24px',
            transform: 'translateZ(0)',
            isolation: 'isolate'
          }}
          className="p-6 sm:p-12 lg:p-16 rounded-[24px] bg-white/90 dark:bg-[#0c0c0e] text-neutral-950 dark:text-white relative overflow-hidden shadow-xl dark:shadow-2xl"
        >
          {/* Background Video: silent, web-optimized, ambient glowing connection flows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 rounded-[24px]">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/videos/audit-poster.jpg"
              className="w-full h-full object-cover scale-105 opacity-40 dark:opacity-45 [mask-image:radial-gradient(ellipse_95%_90%_at_50%_50%,black_65%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_95%_90%_at_50%_50%,black_65%,transparent_100%)]"
            >
              <source src="/videos/audit-bg.webm" type="video/webm" />
              <source src="/videos/audit-bg.mp4" type="video/mp4" />
            </video>
          </div>
          
          {/* Contrast Protection Scrim Overlay */}
          <div 
            style={{ borderRadius: '24px' }}
            className="absolute inset-0 rounded-[24px] bg-gradient-to-t from-white/95 via-white/80 to-white/75 dark:from-[#0c0c0e]/95 dark:via-[#0c0c0e]/85 dark:to-[#0c0c0e]/75 pointer-events-none z-[2]" 
          />

          {/* Architectural Perimeter Frame Overlay */}
          <div 
            style={{ borderRadius: '24px' }}
            className="absolute inset-0 rounded-[24px] pointer-events-none z-[15] border border-neutral-200 dark:border-white/10 hover:border-amber-400/50 dark:hover:border-amber-400/60 transition-colors duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]" 
          />

          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-[1]"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            
            <BlindTextReveal delay={0}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-200 dark:border-white/15 bg-white dark:bg-white/[0.04] text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>{lang === 'en' ? 'Diagnostic Teardown' : (lang === 'kz' ? 'Экспресс-аудит' : 'Экспресс-аудит')}</span>
              </div>
            </BlindTextReveal>

            <BlindTextReveal as="h2" delay={0.08}>
              <span className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-[1.08] max-w-3xl mx-auto [text-wrap:balance] block">
                {lang === 'en' ? (
                  <>Want to know why your platform <br className="hidden sm:inline" />isn't making sales?</>
                ) : lang === 'kz' ? (
                  <>Сайтыңыз неліктен <br className="hidden sm:inline" />сатылым әкелмей жатыр?</>
                ) : (
                  <>Хотите узнать, почему <br className="hidden sm:inline" />ваш&nbsp;сайт не&nbsp;приносит продажи?</>
                )}
              </span>
            </BlindTextReveal>

            <BlindTextReveal delay={0.16}>
              <p className="text-sm sm:text-base lg:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed font-normal">
                {lang === 'en'
                  ? 'Send your URL. Our senior partners will record a 10-minute private video breakdown and map out your conversion bottlenecks within 24 hours. 100% free.'
                  : lang === 'kz'
                  ? 'Сайт немесе парақша сілтемесін жіберіңіз. Бас сарапшыларымыз 24 сағат ішінде жеке 10 минуттық бейне-талдау мен өсу картасын тегін дайындап береді.'
                  : 'Пришлите ссылку на сайт. Старшие эксперты разберут UX, скорость и воронку продаж в закрытом 10-минутном видеоразборе за 24 часа. Без воды.'}
              </p>
            </BlindTextReveal>

            {/* Architectural High-Converting Form Console */}
            <form onSubmit={handleSubmit} className="pt-6 max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Field 1: Project / Website URL */}
                <div className="relative flex items-center rounded-2xl bg-white dark:bg-white/[0.07] hover:bg-neutral-100 dark:hover:bg-white/[0.1] focus-within:bg-white dark:focus-within:bg-white/[0.12] border border-neutral-200 dark:border-white/15 focus-within:border-neutral-400 dark:focus-within:border-white/40 transition-all shadow-sm">
                  <div className="pl-4 pr-1 text-neutral-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder={lang === 'en' ? 'https://yourwebsite.com' : (lang === 'kz' ? 'Сайт немесе жоба сілтемесі' : 'Ссылка на ваш сайт или проект')}
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full py-4 pr-4 pl-2 bg-transparent text-sm text-neutral-950 dark:text-white placeholder-neutral-400 focus:outline-none"
                  />
                </div>

                {/* Field 2: Direct Contact Handle */}
                <div className="relative flex items-center rounded-2xl bg-white dark:bg-white/[0.07] hover:bg-neutral-100 dark:hover:bg-white/[0.1] focus-within:bg-white dark:focus-within:bg-white/[0.12] border border-neutral-200 dark:border-white/15 focus-within:border-neutral-400 dark:focus-within:border-white/40 transition-all shadow-sm">
                  <div className="pl-4 pr-1 text-amber-500 dark:text-amber-400 shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'Telegram (@user) or WhatsApp *' : (lang === 'kz' ? 'Telegram (@user) немесе WhatsApp *' : 'Telegram (@user) или WhatsApp *')}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full py-4 pr-4 pl-2 bg-transparent text-sm text-neutral-950 dark:text-white placeholder-neutral-400 focus:outline-none"
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
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-heading font-black text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-2.5 shadow-xl disabled:opacity-50"
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
                <div className="mt-4 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-center justify-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
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
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>{lang === 'en' ? 'Senior Review · Zero Bots' : (lang === 'kz' ? 'Ботсыз · Тек сарапшылар' : 'Ручной разбор · Без ботов')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>{lang === 'en' ? '24h Turnaround' : (lang === 'kz' ? '24 сағат ішінде' : 'Готовность 24 часа')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>{lang === 'en' ? '100% Confidential' : (lang === 'kz' ? '100% Құпиялық' : '100% Конфиденциально')}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
