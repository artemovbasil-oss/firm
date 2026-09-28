import React from 'react';
import { TESTIMONIALS } from '../data/agencyData';
import { TRANSLATIONS } from '../data/translations';

export default function Testimonials({ lang }) {
  const t = TRANSLATIONS[lang].testimonials;

  return (
    <section className="py-20 relative border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider mb-3">
            {t.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => {
            const name = item.name?.[lang] || item.name?.ru || '';
            const role = item.role?.[lang] || item.role?.ru || '';
            const text = item.text?.[lang] || item.text?.ru || '';
            const outcome = item.outcome?.[lang] || item.outcome?.ru || '';

            return (
              <div
                key={idx}
                className="card-studio rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                      {outcome}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">★★★★★</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                    "{text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {role}, {item.company}
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
