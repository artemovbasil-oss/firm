import React from 'react';
import { Star, Quote, Award } from 'lucide-react';
import { TESTIMONIALS } from '../data/agencyData';

export default function Testimonials() {
  return (
    <section className="py-24 relative bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-xs text-accent-emerald font-mono uppercase tracking-wider mb-4">
            Отзывы клиентов
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            О нас говорят цифры <br />
            <span className="text-gradient-primary">и слова основателей бизнеса</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-8 flex flex-col justify-between relative group hover:border-white/20 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Top outcome badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20">
                    {t.outcome}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{t.text}"
                </p>
              </div>

              {/* Author info */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                />
                <div>
                  <div className="text-sm font-heading font-bold text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {t.role}, <span className="text-primary-400">{t.company}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
