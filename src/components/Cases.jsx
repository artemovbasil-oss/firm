import React, { useState } from 'react';
import { ArrowUpRight, TrendingUp, Check, Layers } from 'lucide-react';
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
    <section id="cases" className="py-28 relative border-t border-slate-200/80 dark:border-white/10 ambient-spotlight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white"></span>
              <span>{t.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.08]">
              {t.title}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-mono btn-studio transition-all ${
                  selectedTag === tag
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-md'
                    : 'border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {tag === 'All' ? t.filterAll : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCases.map((item, idx) => {
            const title = getLocalized(item.title);
            const client = getLocalized(item.client);
            const summary = getLocalized(item.summary);
            const badge = getLocalized(item.badge);
            const services = item.services?.[lang] || item.services?.ru || item.services || [];
            
            // Subtle theme gradient based on project index
            const gradientBgs = [
              'from-slate-900/90 via-indigo-950/70 to-slate-900/90 dark:from-indigo-950/50 dark:via-slate-900/80 dark:to-cyan-950/50',
              'from-slate-900/90 via-amber-950/60 to-slate-900/90 dark:from-amber-950/40 dark:via-slate-900/80 dark:to-stone-900/70',
              'from-slate-900/90 via-emerald-950/60 to-slate-900/90 dark:from-emerald-950/40 dark:via-slate-900/80 dark:to-slate-900/70',
              'from-slate-900/90 via-purple-950/60 to-slate-900/90 dark:from-purple-950/40 dark:via-slate-900/80 dark:to-rose-950/40',
              'from-slate-900/90 via-blue-950/60 to-slate-900/90 dark:from-blue-950/40 dark:via-slate-900/80 dark:to-slate-900/70'
            ];
            const activeGradient = gradientBgs[idx % gradientBgs.length];

            return (
              <div
                key={item.id}
                className="card-studio-hero rounded-3xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Visual Project Mockup Header */}
                <div className={`h-48 sm:h-52 bg-gradient-to-br ${activeGradient} p-5 flex flex-col justify-between relative overflow-hidden border-b border-slate-100 dark:border-white/10`}>
                  {/* Browser Chrome Bar */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-white/90 text-slate-950 shadow-md backdrop-blur-md">
                      {badge}
                    </span>
                  </div>

                  {/* Mockup Center Graphic / Typographic Emblem */}
                  <div className="my-auto z-10 transform group-hover:scale-105 transition-transform duration-300">
                    <div className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight drop-shadow-sm">
                      {client}
                    </div>
                    <div className="text-xs font-mono text-slate-300/80 mt-1 uppercase tracking-wider">
                      Case Study #{String(item.id).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Subtle Grid Accent inside banner */}
                  <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none"></div>
                </div>

                {/* Body Content */}
                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-slate-950 dark:text-white mb-3 leading-snug group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                      {title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                      {summary}
                    </p>

                    {/* Quantified Metrics Box (Bold Awwwards Numbers) */}
                    {item.metrics && item.metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/70 mb-6 text-center">
                        {item.metrics.map((m, mIdx) => (
                          <div key={mIdx}>
                            <div className="text-lg sm:text-xl font-heading font-extrabold text-slate-950 dark:text-white tracking-tight">
                              {m.value}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 leading-tight">
                              {getLocalized(m.label)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {services.map((srv, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div className="flex gap-2 text-xs font-mono text-slate-400">
                      {item.tags?.slice(0, 2).map((tTag, tIdx) => (
                        <span key={tIdx}>#{tTag}</span>
                      ))}
                    </div>

                    <button
                      onClick={() => onOpenContact(`${lang === 'en' ? 'Inquiry for' : (lang === 'kz' ? 'Жобаға өтінім:' : 'Хочу проект как')} "${title}"`)}
                      className="text-xs sm:text-sm font-semibold text-slate-950 dark:text-white hover:underline flex items-center gap-1.5 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                    >
                      <span>{t.similarBtn}</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Niche inquiry banner (Monumental Studio Card) */}
        <div className="mt-16 card-studio-hero rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950 dark:text-white mb-2 tracking-tight">
              {t.requestNicheTitle}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {t.requestNicheDesc}
            </p>
          </div>
          <button
            onClick={() => onOpenContact(lang === 'en' ? 'NDA cases request' : (lang === 'kz' ? 'Жабық кейстер сұранысы' : 'Запрос закрытых кейсов под нишу'))}
            className="relative z-10 px-8 py-4 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-heading font-bold text-sm sm:text-base shrink-0 shadow-lg btn-studio hover:shadow-xl"
          >
            {t.requestNicheBtn}
          </button>
          
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-slate-400/10 dark:bg-white/5 blur-3xl pointer-events-none"></div>
        </div>

      </div>
    </section>
  );
}
