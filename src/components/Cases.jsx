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
    <section id="cases" className="py-20 relative border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider mb-3">
              {t.badge}
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.title}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedTag === tag
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tag === 'All' ? t.filterAll : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((item) => {
            const title = getLocalized(item.title);
            const client = getLocalized(item.client);
            const summary = getLocalized(item.summary);
            const badge = getLocalized(item.badge);
            const services = item.services?.[lang] || item.services?.ru || item.services || [];

            return (
              <div
                key={item.id}
                className="card-studio rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200">
                      {badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">#{item.id}</span>
                  </div>

                  <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white mb-1 leading-snug">
                    {title}
                  </h3>
                  <div className="text-xs text-slate-500">{client}</div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {summary}
                    </p>

                    {/* Quantified Metrics Box */}
                    {item.metrics && item.metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 mb-4 text-center">
                        {item.metrics.map((m, idx) => (
                          <div key={idx}>
                            <div className="text-sm font-heading font-bold text-slate-900 dark:text-white">
                              {m.value}
                            </div>
                            <div className="text-[9px] text-slate-500 leading-tight mt-0.5">
                              {getLocalized(m.label)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-1">
                      {services.map((srv, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex gap-1 text-[10px] font-mono text-slate-400">
                      {item.tags?.slice(0, 2).map((t, idx) => (
                        <span key={idx}>#{t} </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onOpenContact(`${lang === 'en' ? 'Inquiry for' : 'Хочу проект как'} "${title}"`)}
                      className="text-xs font-semibold text-slate-900 dark:text-white hover:underline flex items-center gap-1"
                    >
                      <span>{t.similarBtn}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Niche inquiry banner */}
        <div className="mt-12 card-studio rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-lg font-heading font-bold text-slate-900 dark:text-white mb-1">
              {t.requestNicheTitle}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {t.requestNicheDesc}
            </p>
          </div>
          <button
            onClick={() => onOpenContact(lang === 'en' ? 'NDA cases request' : 'Запрос закрытых кейсов под нишу')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shrink-0 shadow-sm"
          >
            {t.requestNicheBtn}
          </button>
        </div>

      </div>
    </section>
  );
}
