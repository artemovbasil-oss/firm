import React from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { TRANSLATIONS } from '../data/translations';

export default function Hero({ lang, onOpenContact }) {
  const t = TRANSLATIONS[lang].hero;

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
    <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden ambient-glow-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Live Studio Status */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-black/[0.06] dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl text-xs font-mono shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              {t.badge}
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">{t.badgeDesc}</span>
          </div>
        </motion.div>

        {/* Monumental Ultra-Short Headline */}
        <div className="text-center max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black tracking-tighter text-slate-950 dark:text-white leading-[0.96] sm:leading-[0.92] uppercase"
          >
            {t.titleStart} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-600 to-slate-900 dark:from-white dark:via-slate-400 dark:to-white">
              {t.titleHighlight}
            </span>
          </motion.h1>

          {/* Crisp 1-sentence manifesto */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 text-base sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            {t.desc}
          </motion.p>

          {/* 2 Clean Magnetic Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#calculator"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-heading font-bold text-sm sm:text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-2xl"
            >
              <span>{t.ctaCalc}</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#cases"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-black/[0.08] dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white font-heading font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
            >
              <span>{lang === 'en' ? 'Selected Cases' : (lang === 'kz' ? 'Таңдаулы кейстер' : 'Смотреть кейсы')}</span>
              <ArrowDown className="w-4 h-4" />
            </motion.a>
          </motion.div>

        </div>

        {/* Minimalist Pure Counter Strip (Zero Clutter, Pure Typography) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-24 sm:mt-32 pt-12 border-t border-black/[0.06] dark:border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center md:text-left"
        >
          <div>
            <div className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-slate-950 dark:text-white">
              {t.stats.projects}
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              {t.stats.projectsDesc}
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-slate-950 dark:text-white">
              {t.stats.conversion}
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              {t.stats.conversionDesc}
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-slate-950 dark:text-white">
              {t.stats.capital}
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              {t.stats.capitalDesc}
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-slate-950 dark:text-white">
              {t.stats.sla}
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              {t.stats.slaDesc}
            </div>
          </div>
        </motion.div>

      </div>

      {/* Infinite Running Marquee Ticker */}
      <div className="mt-20 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 overflow-hidden select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
