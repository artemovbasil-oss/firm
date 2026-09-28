import React from 'react';
import { TESTIMONIALS } from '../data/agencyData';
import { TRANSLATIONS } from '../data/translations';

export default function Testimonials({ lang }) {
  const t = TRANSLATIONS[lang].testimonials;

  return (
    <section className="py-32 sm:py-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 gap-6">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
              {lang === 'en' ? 'Client Feedback' : (lang === 'kz' ? 'Пікірлер' : 'Доверие клиентов')}
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.95]">
              {lang === 'en' ? 'Trusted by Leaders.' : (lang === 'kz' ? 'Тапсырыс берушілер.' : 'Нам доверяют лидеры.')}
            </h2>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {TESTIMONIALS.map((item, idx) => {
            const name = item.name?.[lang] || item.name?.ru || '';
            const role = item.role?.[lang] || item.role?.ru || '';
            const text = item.text?.[lang] || item.text?.ru || '';
            const outcome = item.outcome?.[lang] || item.outcome?.ru || '';

            return (
              <div
                key={idx}
                className="p-8 sm:p-10 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950">
                      {outcome}
                    </span>
                    <span className="text-xs font-mono text-amber-500 tracking-widest">★★★★★</span>
                  </div>

                  <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-light mb-8 italic">
                    "{text}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-black/[0.06] dark:border-white/[0.06]">
                  <img
                    src={item.avatar}
                    alt={name}
                    className="w-11 h-11 rounded-full object-cover grayscale hover:grayscale-0 transition-all"
                  />
                  <div>
                    <div className="text-sm sm:text-base font-heading font-bold text-slate-950 dark:text-white">
                      {name}
                    </div>
                    <div className="text-xs font-mono text-slate-500 mt-0.5">
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
