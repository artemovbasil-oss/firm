import React from 'react';
import { ArrowRight, ChevronRight, CheckCircle2, Shield, TrendingUp, Award, Layers, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Hero({ lang, onOpenContact }) {
  const t = TRANSLATIONS[lang].hero;

  const marqueeItems = lang === 'en' ? [
    'AWWWARDS WINNER INSPIRATION',
    'HIGH-CONVERTING WEB PLATFORMS',
    'BESPOKE BRANDING & PACKAGING',
    'CUSTOM SAAS & CRM ENGINEERING',
    'TOP-TIER INVESTOR PITCH DECKS',
    'SEO & TECHNICAL DOMINANCE',
    '100% NDA & CODE OWNERSHIP',
    'RAPID TWO-WEEK SPRINTS'
  ] : lang === 'kz' ? [
    'AWWWARDS СТИЛІНДЕГІ ДИЗАЙН',
    'КОНВЕРСИЯСЫ ЖОҒАРЫ САЙТТАР',
    'ПРЕМИУМ БРЕНДИНГ ЖӘНЕ ҚАПТАМА',
    'ЖЕКЕ SAAS ЖӘНЕ CRM ӘЗІРЛЕУ',
    'ИНВЕСТОРЛЫҚ PITCH DECK-ТЕР',
    'SEO ЖӘНЕ ТЕХНИКАЛЫҚ АУДИТ',
    '100% NDA ЖӘНЕ АВТОРЛЫҚ ҚҰҚЫҚ',
    'ЖЕДЕЛ 2 АПТАЛЫҚ СПРИНТТЕР'
  ] : [
    'ДИЗАЙН УРОВНЯ AWWWARDS',
    'ВЫСОКОКОНВЕРСИОННЫЕ САЙТЫ',
    'ПРЕМИАЛЬНЫЙ БРЕНДИНГ И УПАКОВКА',
    'РАЗРАБОТКА SAAS И CRM СИСТЕМ',
    'ИНВЕСТИЦИОННЫЕ ПРЕЗЕНТАЦИИ',
    'SEO И ТЕХНИЧЕСКИЙ АУДИТ',
    '100% NDA И АВТОРСКИЕ ПРАВА',
    'БЫСТРЫЕ 2-НЕДЕЛЬНЫЕ СПРИНТЫ'
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-grid-subtle ambient-glow-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Minimal Beacon Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-950 dark:text-white tracking-wide">{t.badge}</span>
            <span className="text-slate-300 dark:text-slate-700 font-light">|</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs hidden sm:inline">{t.badgeDesc}</span>
          </div>
        </div>

        {/* Main Grand Monumental Heading */}
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.5rem] font-heading font-extrabold tracking-tight sm:tracking-tighter text-slate-950 dark:text-white leading-[1.04] sm:leading-[0.98]">
            {t.titleStart}{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400">
              {t.titleHighlight}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-slate-300/80 dark:text-white/20" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-8 text-base sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {t.desc}
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#calculator"
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-heading font-bold text-sm sm:text-base hover:bg-slate-800 dark:hover:bg-slate-100 btn-studio flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl"
            >
              <span>{t.ctaCalc}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#audit"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl text-slate-800 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white font-medium text-sm sm:text-base btn-studio flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{t.ctaAudit}</span>
            </a>
          </div>

          {/* Interactive Core Discipline Pills */}
          <div className="mt-12 flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-4xl mx-auto">
            {t.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono transition-colors hover:border-slate-400 dark:hover:border-white/30"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>

        {/* Quantified Track Record Cards (Monumental Editorial Grid) */}
        <div className="mt-20 pt-10 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card-studio-hero p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
            <span className="absolute top-4 right-5 text-xs font-mono font-bold text-slate-300 dark:text-slate-800 group-hover:text-slate-500 transition-colors">
              01
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.stats.projects}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {t.stats.projectsDesc}
            </div>
          </div>

          <div className="card-studio-hero p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
            <span className="absolute top-4 right-5 text-xs font-mono font-bold text-slate-300 dark:text-slate-800 group-hover:text-slate-500 transition-colors">
              02
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.stats.conversion}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {t.stats.conversionDesc}
            </div>
          </div>

          <div className="card-studio-hero p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
            <span className="absolute top-4 right-5 text-xs font-mono font-bold text-slate-300 dark:text-slate-800 group-hover:text-slate-500 transition-colors">
              03
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.stats.capital}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {t.stats.capitalDesc}
            </div>
          </div>

          <div className="card-studio-hero p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
            <span className="absolute top-4 right-5 text-xs font-mono font-bold text-slate-300 dark:text-slate-800 group-hover:text-slate-500 transition-colors">
              04
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.stats.sla}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {t.stats.slaDesc}
            </div>
          </div>
        </div>

      </div>

      {/* Infinite Horizontal Running Marquee Ticker */}
      <div className="mt-16 sm:mt-20 border-y border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-slate-950/60 backdrop-blur-md py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-8 shrink-0">
              <span className="text-xs sm:text-sm font-mono font-semibold tracking-widest uppercase text-slate-600 dark:text-slate-400">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-700"></span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

