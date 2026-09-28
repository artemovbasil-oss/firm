import React from 'react';
import { TESTIMONIALS } from '../data/agencyData';
import { TRANSLATIONS } from '../data/translations';

export default function Testimonials({ lang }) {
  const t = TRANSLATIONS[lang].testimonials;

  return (
    <section className="py-28 sm:py-32 relative border-t border-slate-200/80 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-slate-950 dark:text-white tracking-tight sm:tracking-tighter">
            {t.title}
          </h2>
        </div>

        {/* Testimonials Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((item, idx) => {
            const name = item.name?.[lang] || item.name?.ru || '';
            const role = item.role?.[lang] || item.role?.ru || '';
            const text = item.text?.[lang] || item.text?.ru || '';
            const outcome = item.outcome?.[lang] || item.outcome?.ru || '';

            return (
              <div
                key={idx}
                className="card-studio-hero rounded-3xl p-8 sm:p-9 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0c0e18]/80 backdrop-blur-xl hover:border-slate-400/50 dark:hover:border-white/20 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 shadow-sm">
                      {outcome}
                    </span>
                    <span className="text-sm text-amber-400 font-mono tracking-widest">★★★★★</span>
                  </div>

                  <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic mb-8">
                    "{text}"
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-100 dark:border-white/10 flex items-center gap-3.5">
                  <img
                    src={item.avatar}
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-white/20 shadow-sm"
                  />
                  <div>
                    <div className="text-sm sm:text-base font-heading font-bold text-slate-950 dark:text-white">
                      {name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {role}, <span className="font-semibold text-slate-700 dark:text-slate-300">{item.company}</span>
                    </div>
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
