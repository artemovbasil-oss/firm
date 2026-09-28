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
    <section id="faq" className="py-20 relative border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider mb-3">
            {t.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            {t.desc}
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const question = item.question?.[lang] || item.question?.ru || '';
            const answer = item.answer?.[lang] || item.answer?.ru || '';

            return (
              <div
                key={idx}
                className="card-studio rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-heading font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                    {question}
                  </span>
                  <div className={`w-6 h-6 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-slate-100 dark:bg-slate-800' : ''}`}>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
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
