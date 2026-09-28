import React from 'react';
import { ShieldCheck, Zap, Cpu } from 'lucide-react';
import { TECH_STACK } from '../data/agencyData';
import { TRANSLATIONS } from '../data/translations';

export default function TechStack({ lang }) {
  const t = TRANSLATIONS[lang].tech;

  return (
    <section id="stack" className="py-32 sm:py-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 gap-6">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
              // 06 · {lang === 'en' ? 'Stack & Infrastructure' : (lang === 'kz' ? 'Технологиялық стек' : 'Технологический стек')}
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.95]">
              {lang === 'en' ? 'Engineered for Speed.' : (lang === 'kz' ? 'Жоғары жылдамдық.' : 'Стек без компромиссов.')}
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
          {TECH_STACK.map((group, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] space-y-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400">
                  0{idx + 1}
                </span>
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
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t.badge1}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t.badge2}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>{t.badge3}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
