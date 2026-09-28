import React from 'react';
import { ArrowRight, ChevronRight, CheckCircle2, Shield, TrendingUp, Award, Layers } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Hero({ lang, onOpenContact }) {
  const t = TRANSLATIONS[lang].hero;

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-grid-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Minimal Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md text-xs text-slate-600 dark:text-slate-400 font-mono shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-emerald-400"></span>
            <span className="font-semibold text-slate-900 dark:text-slate-200">{t.badge}</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>{t.badgeDesc}</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.12]">
            {t.titleStart}{' '}
            <span className="underline decoration-slate-300 dark:decoration-slate-700 decoration-2 underline-offset-8">
              {t.titleHighlight}
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.desc}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#calculator"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{t.ctaCalc}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#audit"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{t.ctaAudit}</span>
            </a>
          </div>

          {/* Service tags */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {t.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>

        {/* Quantified Track Record Cards */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card-studio p-5 rounded-2xl">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.stats.projects}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.stats.projectsDesc}
            </div>
          </div>

          <div className="card-studio p-5 rounded-2xl">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.stats.conversion}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.stats.conversionDesc}
            </div>
          </div>

          <div className="card-studio p-5 rounded-2xl">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.stats.capital}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.stats.capitalDesc}
            </div>
          </div>

          <div className="card-studio p-5 rounded-2xl">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.stats.sla}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.stats.slaDesc}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
