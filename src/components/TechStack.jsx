import React from 'react';
import { Terminal, ShieldCheck, Zap, Cpu } from 'lucide-react';
import { TECH_STACK } from '../data/agencyData';
import { TRANSLATIONS } from '../data/translations';

export default function TechStack({ lang }) {
  const t = TRANSLATIONS[lang].tech;

  return (
    <section id="stack" className="py-28 sm:py-32 relative border-t border-slate-200/80 dark:border-white/10 bg-slate-50/40 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-slate-950 dark:text-white tracking-tight sm:tracking-tighter">
            {t.title}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH_STACK.map((group, idx) => (
            <div
              key={idx}
              className="card-studio-hero rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0c0e18]/80 backdrop-blur-xl flex flex-col justify-between hover:border-slate-400/50 dark:hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>
                  <h3 className="font-heading font-extrabold text-slate-950 dark:text-white text-base sm:text-lg">
                    {group.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {group.items.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono hover:border-slate-400 dark:hover:border-white/30 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Guarantees Badges */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c0e18]/80 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t.badge1}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c0e18]/80 shadow-sm">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t.badge2}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c0e18]/80 shadow-sm">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>{t.badge3}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
