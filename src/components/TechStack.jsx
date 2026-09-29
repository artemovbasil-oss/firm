import React from 'react';
import { ShieldCheck, Zap, Cpu } from 'lucide-react';
import { TECH_STACK } from '../data/agencyData';
import { TRANSLATIONS } from '../data/translations';

export default function TechStack({ lang, techStackList }) {
  const t = TRANSLATIONS[lang].tech;
  const list = Array.isArray(techStackList) && techStackList.length > 0 ? techStackList : TECH_STACK;

  return (
    <section id="stack" className="py-20 sm:py-28 lg:py-32 relative w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 lg:mb-20 gap-6">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
              {lang === 'en' ? 'Stack & Infrastructure' : (lang === 'kz' ? 'Технологиялық стек' : 'Технологический стек')}
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.98]">
              {lang === 'en' ? 'Engineered for Speed' : (lang === 'kz' ? 'Жоғары жылдамдық' : 'Стек без компромиссов')}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-relaxed font-normal">
            {lang === 'en'
              ? 'Modern headless architecture, lightning-fast client runtimes, and scalable backend infrastructure.'
              : lang === 'kz'
              ? 'Заманауи headless архитектура, мінсіз қауіпсіздік және жүктемеге төзімді инфрақұрылым.'
              : 'Современная headless-архитектура, микросервисы и мгновенный отклик интерфейсов.'}
          </p>
        </div>

        {/* Clean Spacious Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {list.map((group, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] space-y-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm sm:text-base text-slate-950 dark:text-white uppercase tracking-wider">
                  {group.category}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {group.items.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1.5 rounded-full text-xs font-mono bg-white dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/10 text-slate-800 dark:text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Guarantees */}
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t.badge1}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{t.badge2}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{t.badge3}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
