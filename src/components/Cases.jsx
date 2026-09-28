import React, { useState } from 'react';
import { 
  ArrowUpRight, TrendingUp, Sparkles, Check, 
  Layers, ExternalLink, Calendar 
} from 'lucide-react';
import { CASES } from '../data/agencyData';

export default function Cases({ onOpenContact }) {
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = ['All', 'SaaS', 'Branding', 'Landing Page', 'SEO Optimization', 'Full Packaging'];

  const filteredCases = selectedTag === 'All' 
    ? CASES 
    : CASES.filter(c => c.tags.includes(selectedTag));

  return (
    <section id="cases" className="py-24 relative bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-xs text-accent-cyan font-mono uppercase tracking-wider mb-4">
              Портфолио & Результаты
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
              Кейсы, где дизайн и код <br />
              <span className="text-gradient-primary">приносят реальные деньги</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedTag === tag
                    ? 'bg-primary-600 text-white font-semibold'
                    : 'bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCases.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-primary-500/30 transition-all duration-300 shadow-xl"
            >
              {/* Card visual header */}
              <div className={`p-6 sm:p-7 bg-gradient-to-br ${item.gradient} border-b border-white/5 relative`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-dark-900/80 text-white border border-white/10 shadow-sm">
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Кейс #{item.id}</span>
                </div>

                <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                  {item.title}
                </h3>
                <div className="text-xs text-slate-300 font-medium">{item.client}</div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {item.summary}
                  </p>

                  {/* Quantified Metrics Box */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-dark-900/80 border border-white/5 mb-6 text-center">
                    {item.metrics.map((m, idx) => (
                      <div key={idx} className="p-1">
                        <div className="text-sm sm:text-base font-heading font-bold text-white tracking-tight">
                          {m.value}
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Services tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-dark-850 text-slate-300 text-[11px] border border-white/5"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-500">
                    {item.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx}>#{t} </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenContact(`Хочу проект как в кейсе "${item.title}"`)}
                    className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Хочу такой же</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 glass-panel rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-primary-500/20">
          <div>
            <div className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">
              Нужно решить нестандартную или амбициозную задачу?
            </div>
            <p className="text-sm text-slate-300 max-w-2xl">
              Покажем еще более 40 закрытых кейсов под NDA в вашей нише и подготовим стратегический план запуска за 24 часа.
            </p>
          </div>
          <button
            onClick={() => onOpenContact('Запрос релевантных кейсов под нишу')}
            className="px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm shrink-0 shadow-lg shadow-primary-500/25 transition-all flex items-center gap-2"
          >
            <span>Подобрать кейсы под мою нишу</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
