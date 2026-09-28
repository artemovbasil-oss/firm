import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { WORK_PROCESS } from '../data/agencyData';
import { TRANSLATIONS } from '../data/translations';

export default function Process({ lang }) {
  const t = TRANSLATIONS[lang].process;

  return (
    <section id="process" className="py-20 relative border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider mb-3">
            {t.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {t.desc}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {WORK_PROCESS.map((step) => {
            const title = step.title?.[lang] || step.title?.ru || '';
            const desc = step.desc?.[lang] || step.desc?.ru || '';
            const time = step.time?.[lang] || step.time?.ru || '';
            const artifact = step.artifact?.[lang] || step.artifact?.ru || '';

            return (
              <div
                key={step.step}
                className="card-studio rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                      {step.step}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3" />
                      {time}
                    </span>
                  </div>

                  <h3 className="text-sm font-heading font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[9px] uppercase font-mono text-slate-400 mb-0.5">
                    {t.artifactLabel}
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-emerald-400 shrink-0" />
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
