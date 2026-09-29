import React, { useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { TRANSLATIONS } from '../data/translations';

export default function Hero({ lang, onOpenContact }) {
  const t = TRANSLATIONS[lang].hero;
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay fallback if browser requires user gesture
        });
      }
    }
  }, []);

  const marqueeItems = lang === 'en' ? [
    'HIGH-LOAD WEB PLATFORMS',
    'BESPOKE BRANDING & PACKAGING',
    'CUSTOM SAAS & CRM ENGINES',
    'VENTURE PITCH DECKS',
    'TECHNICAL SEO DOMINANCE',
    'CONVERSION-FOCUSED ARCHITECTURE',
    '100% NDA & CODE OWNERSHIP',
    'TWO-WEEK RAPID SPRINTS'
  ] : lang === 'kz' ? [
    'ЖОҒАРЫ ЖҮКТЕМЕЛІ ВЕБ-ПЛАТФОРМАЛАР',
    'ПРЕМИУМ БРЕНДИНГ ЖӘНЕ ҚАПТАМА',
    'ЖЕКЕ SAAS ЖӘНЕ CRM ЖҮЙЕЛЕРІ',
    'ИНВЕСТОРЛЫҚ PITCH DECK-ТЕР',
    'SEO ЖӘНЕ ТЕХНИКАЛЫҚ АУДИТ',
    'КОНВЕРСИЯСЫ ЖОҒАРЫ САЙТТАР',
    '100% NDA ЖӘНЕ МЕНШІК ҚҰҚЫҒЫ',
    '2 АПТАЛЫҚ ЖЕДЕЛ СПРИНТТЕР'
  ] : [
    'ВЫСОКОНАГРУЖЕННЫЕ ВЕБ-ПЛАТФОРМЫ',
    'ПРЕМИАЛЬНЫЙ БРЕНДИНГ И УПАКОВКА',
    'КАСТОМНЫЙ СОФТ, SAAS И CRM',
    'ИНВЕСТИЦИОННЫЕ PITCH DECKS',
    'SEO И ОРГАНИЧЕСКИЙ РОСТ',
    'ПРОДАЮЩИЕ ВОРОНКИ И ЛЕНДИНГИ',
    '100% NDA И ПЕРЕДАЧА ВСЕХ ПРАВ',
    'ДВУХНЕДЕЛЬНЫЕ РЕЛИЗ-СПРИНТЫ'
  ];

  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-44 lg:pb-20 overflow-hidden ambient-glow-hero w-full max-w-full">
      
      {/* Background Surreal Video Portal: Full-bleed seamless radial fade without box borders */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <video
          ref={videoRef}
          key="hero-video-v4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/hero-surreal-v4.jpg"
          className="w-full h-full object-cover scale-105 opacity-80 dark:opacity-75 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_48%,black_20%,transparent_80%)] [-webkit-mask-image:radial-gradient(ellipse_75%_65%_at_50%_48%,black_20%,transparent_80%)]"
        >
          <source src="/videos/hero-surreal-v4.mp4" type="video/mp4" />
        </video>

        {/* Center Contrast Scrim: In dark mode, deep black void; in light mode, soft radiant white scrim */}
        <div className="absolute inset-0 bg-[#fbfbfd]/40 dark:bg-[#06070a]/50 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_45%,rgba(251,251,253,0.65)_0%,rgba(251,251,253,0.3)_60%,rgba(251,251,253,0.95)_100%)] dark:bg-[radial-gradient(ellipse_75%_60%_at_50%_45%,rgba(6,7,11,0.65)_0%,rgba(6,7,11,0.3)_60%,rgba(6,7,11,0.95)_100%)] pointer-events-none"></div>

        {/* Global Edge Fade into Page Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbfbfd]/90 via-transparent to-[#fbfbfd] dark:from-[#06070a]/80 dark:via-transparent dark:to-[#06070a] pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Live Studio Status - Solar Amber Beacon */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-black/[0.06] dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl text-xs font-mono shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] sm:text-xs">
              {t.badge}
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline text-xs">{t.badgeDesc}</span>
          </div>
        </motion.div>

        {/* Monumental Ultra-Short Headline */}
        <div className="text-center max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight text-slate-950 dark:text-white leading-[1.05] sm:leading-[1.0] uppercase drop-shadow-sm"
          >
            <span>{t.titleStart}</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-600 to-slate-900 dark:from-white dark:via-slate-400 dark:to-white">
              {t.titleHighlight}
            </span>
          </motion.h1>

          {/* Crisp, High-Contrast Subtitle over Video */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 text-base sm:text-xl md:text-2xl text-slate-700 dark:text-slate-100 font-medium max-w-3xl mx-auto leading-relaxed dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
          >
            {t.desc}
          </motion.p>

          {/* 2 Clean Magnetic Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#calculator"
              className="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-heading font-bold text-xs sm:text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-2xl"
            >
              <span>{t.ctaCalc}</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#cases"
              className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.02] backdrop-blur-xl text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white font-heading font-semibold text-xs sm:text-base transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{lang === 'en' ? 'Selected Cases' : (lang === 'kz' ? 'Таңдаулы кейстер' : 'Смотреть кейсы')}</span>
              <ArrowDown className="w-4 h-4" />
            </motion.a>
          </motion.div>

        </div>

        {/* Key Performance Metrics: Translucent Frosted Glass on Mobile, Solid Studio on Desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="relative z-20 mt-14 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6"
        >
          {[
            { value: t.stats.projects, label: t.stats.projectsDesc, accent: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' },
            { value: t.stats.conversion, label: t.stats.conversionDesc, accent: 'bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]' },
            { value: t.stats.capital, label: t.stats.capitalDesc, accent: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' },
            { value: t.stats.sla, label: t.stats.slaDesc, accent: 'bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]' }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-black/35 sm:bg-white sm:dark:bg-[#08090f]/90 border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-2xl flex flex-col justify-between group hover:border-amber-400/40 transition-all duration-300 min-w-0"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`w-2 h-2 rounded-full ${stat.accent}`}></span>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  METRIC
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-slate-950 dark:text-white leading-none mb-1.5 tabular-nums truncate">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider font-medium line-clamp-2">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Infinite Running Marquee Ticker with Solar Amber Accent Separators */}
      <div className="relative z-20 mt-12 sm:mt-16 py-3.5 sm:py-4 bg-white dark:bg-[#06070b] text-slate-950 dark:text-white border-y border-slate-200 dark:border-white/15 overflow-hidden select-none shadow-sm dark:shadow-xl w-full max-w-full">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)] shrink-0"></span>
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
