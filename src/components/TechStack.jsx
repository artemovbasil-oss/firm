import React from 'react';
import { Terminal, ShieldCheck, Zap, Cpu } from 'lucide-react';
import { TECH_STACK } from '../data/agencyData';
import { TRANSLATIONS } from '../data/translations';

export default function TechStack({ lang }) {
  const t = TRANSLATIONS[lang].tech;

  return (
    <section id="stack" className="py-20 relative border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider mb-3">
            {t.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {t.desc}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TECH_STACK.map((group, idx) => (
            <div
              key={idx}
              className="card-studio rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                  {group.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {group.items.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.badge1}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>{t.badge2}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>{t.badge3}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
