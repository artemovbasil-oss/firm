import React from 'react';
import { Cpu, Layers, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { TECH_STACK } from '../data/agencyData';

export default function TechStack() {
  return (
    <section id="stack" className="py-20 relative bg-dark-900/60 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-xs text-accent-cyan font-mono uppercase tracking-wider mb-4">
            Технологический арсенал
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Стек индустриального уровня <br />
            <span className="text-gradient-primary">для скорости и масштабирования</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Используем только проверенные, современные решения, которые не устареют через год и легко поддерживаются любой командой.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH_STACK.map((group, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-primary-400" />
                <h3 className="font-heading font-bold text-white text-base">
                  {group.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.items.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1.5 rounded-lg bg-dark-900 border border-white/5 text-xs text-slate-300 font-mono hover:text-white hover:border-primary-500/30 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Security & Reliability Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-400 text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-emerald" />
            <span>ISO / GDPR Соответствие</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-cyan" />
            <span>90+ Google PageSpeed Core Web Vitals</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent-violet" />
            <span>Zero-Downtime деплой в облако</span>
          </div>
        </div>

      </div>
    </section>
  );
}
