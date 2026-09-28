import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { WORK_PROCESS } from '../data/agencyData';
import { TRANSLATIONS } from '../data/translations';

export default function Process({ lang }) {
  const t = TRANSLATIONS[lang].process;

  return (
    <section id="process" className="py-28 sm:py-32 relative border-t border-slate-200/80 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-slate-950 dark:text-white tracking-tight sm:tracking-tighter">
            {t.title}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {WORK_PROCESS.map((step) => {
            const title = step.title?.[lang] || step.title?.ru || '';
            const desc = step.desc?.[lang] || step.desc?.ru || '';
            const time = step.time?.[lang] || step.time?.ru || '';
            const artifact = step.artifact?.[lang] || step.artifact?.ru || '';

            return (
              <div
                key={step.step}
                className="card-studio-hero rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0c0e18]/80 backdrop-blur-xl hover:border-slate-400/50 dark:hover:border-white/20 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-heading font-black text-4xl sm:text-5xl text-slate-300 dark:text-slate-800 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-200">
                      {step.step}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/90 px-3 py-1 rounded-full border border-slate-200/60 dark:border-white/5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {time}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-heading font-bold text-slate-950 dark:text-white mb-2 leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">
                    {t.artifactLabel}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-950 dark:text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">{artifact}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
