import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/agencyData';
import { TRANSLATIONS } from '../data/translations';

export default function Faq({ lang }) {
  const [openIndex, setOpenIndex] = useState(0);
  const t = TRANSLATIONS[lang].faq;

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-28 sm:py-32 relative border-t border-slate-200/80 dark:border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-slate-950 dark:text-white tracking-tight sm:tracking-tighter">
            {t.title}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            {t.desc}
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const question = item.question?.[lang] || item.question?.ru || '';
            const answer = item.answer?.[lang] || item.answer?.ru || '';

            return (
              <div
                key={idx}
                className="card-studio-hero rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0c0e18]/80 backdrop-blur-xl transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-6 focus:outline-none group"
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-slate-950 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    {question}
                  </span>
                  <div className={`w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-slate-100 dark:bg-slate-800' : ''}`}>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/10 animate-fadeIn">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
