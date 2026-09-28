import React from 'react';
import { ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { WORK_PROCESS } from '../data/agencyData';

export default function Process() {
  return (
    <section id="process" className="py-24 relative bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs text-primary-400 font-mono uppercase tracking-wider mb-4">
            Прозрачный пайплайн
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            Как мы ведем ваш проект <br />
            <span className="text-gradient-primary">от идеи до первого миллиона</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Никакого хаоса и размытых сроков. Четкие спринты, регулярные демо-созвоны и материальные артефакты на каждом этапе.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {WORK_PROCESS.map((step, idx) => (
            <div
              key={step.step}
              className="glass-panel rounded-3xl p-6 flex flex-col justify-between relative group hover:border-primary-500/40 transition-all duration-300 shadow-lg"
            >
              {/* Connector line for desktop */}
              {idx < WORK_PROCESS.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 h-[2px] bg-gradient-to-r from-primary-500/40 to-transparent z-20"></div>
              )}

              <div>
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-accent-cyan/30">
                    {step.step}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-dark-900 px-2 py-0.5 rounded border border-white/5">
                    <Clock className="w-3 h-3 text-primary-400" />
                    {step.time}
                  </span>
                </div>

                <h3 className="text-base font-heading font-bold text-white mb-2 leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {step.desc}
                </p>
              </div>

              {/* Step Result Artifact */}
              <div className="pt-3 border-t border-white/10">
                <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                  Артефакт этапа:
                </div>
                <div className="text-xs font-semibold text-accent-cyan flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-accent-emerald" />
                  <span className="truncate">{step.artifact}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
