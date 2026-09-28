import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Cases({ lang, casesList = [], onOpenContact }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const t = TRANSLATIONS[lang].cases;

  const tags = ['All', 'SaaS', 'Branding', 'Landing Page', 'SEO Optimization', 'Full Packaging'];
  const publishedCases = casesList.filter(c => c.published !== false);

  const filteredCases = selectedTag === 'All' 
    ? publishedCases 
    : publishedCases.filter(c => c.tags?.includes(selectedTag));

  const getLocalized = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.ru || '';
  };

  return (
    <section id="cases" className="py-32 sm:py-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 gap-6">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
              // 02 · {lang === 'en' ? 'Proof of Work' : (lang === 'kz' ? 'Нәтижелер' : 'Кейсы и цифры')}
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.95]">
              {lang === 'en' ? 'Selected Cases.' : (lang === 'kz' ? 'Таңдаулы жобалар.' : 'Избранные кейсы.')}
            </h2>
          </div>

          {/* Minimalist Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
                  selectedTag === tag
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold'
                    : 'border border-black/[0.08] dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {tag === 'All' ? t.filterAll : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Grand 2-Column Showcase (Spacious, Breathable, High-Impact) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14">
          {filteredCases.map((item, idx) => {
            const title = getLocalized(item.title);
            const client = getLocalized(item.client);
            const summary = getLocalized(item.summary);
            const badge = getLocalized(item.badge);
            const heroMetric = item.metrics && item.metrics[0];
            
            // Atmospheric dark gradients
            const gradients = [
              'from-slate-900 via-indigo-950 to-slate-950',
              'from-slate-900 via-emerald-950 to-slate-950',
              'from-slate-900 via-purple-950 to-slate-950',
              'from-slate-900 via-stone-900 to-slate-950'
            ];
            const activeGrad = gradients[idx % gradients.length];

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between"
              >
                {/* Visual Showcase Card */}
                <div className={`w-full aspect-[16/10] rounded-3xl bg-gradient-to-br ${activeGrad} p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl border border-black/[0.06] dark:border-white/10 transition-transform duration-300 group-hover:scale-[1.01]`}>
                  
                  {/* Top Bar with category tag & status */}
                  <div className="flex items-center justify-between z-10">
                    <span className="font-mono text-xs text-white/70 uppercase tracking-widest">
                      {client} // 2026
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/95 text-slate-950 shadow-lg">
                      {badge}
                    </span>
                  </div>

                  {/* Monumental Hero Metric (Awwwards Proof of Value) */}
                  <div className="my-auto z-10 py-6">
                    <div className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black text-white tracking-tighter">
                      {heroMetric ? heroMetric.value : '+340%'}
                    </div>
                    <div className="text-xs sm:text-sm font-mono text-white/70 uppercase tracking-wider mt-2">
                      {heroMetric ? getLocalized(heroMetric.label) : 'Organic Revenue Surge'}
                    </div>
                  </div>

                  {/* Bottom client mark */}
                  <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10">
                    <span className="text-sm font-heading font-bold text-white tracking-wide">
                      {title}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Subtle Grid Pattern Accent */}
                  <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none"></div>
                </div>

                {/* Minimalist Bottom Info */}
                <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-relaxed font-normal">
                    {summary}
                  </p>

                  <button
                    onClick={() => onOpenContact(`${title} Case Discussion`)}
                    className="text-xs sm:text-sm font-heading font-bold text-slate-950 dark:text-white hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>{t.similarBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Confidential NDA Advisory Strip */}
        <div className="mt-20 sm:mt-28 p-8 sm:p-12 rounded-3xl border border-black/[0.08] dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-950 dark:text-white tracking-tight">
              {t.requestNicheTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {t.requestNicheDesc}
            </p>
          </div>

          <button
            onClick={() => onOpenContact('Confidential Portfolio Request')}
            className="px-8 py-3.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-heading font-bold text-xs sm:text-sm hover:opacity-90 transition-all shrink-0 active:scale-95"
          >
            {t.requestNicheBtn}
          </button>
        </div>

      </div>
    </section>
  );
}
