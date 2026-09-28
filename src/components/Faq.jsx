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
    <section id="faq" className="py-32 sm:py-40 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-24">
          <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
            // 08 · {lang === 'en' ? 'Direct Answers' : (lang === 'kz' ? 'Сұрақ-жауап' : 'Частые вопросы')}
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.95]">
            {lang === 'en' ? 'F.A.Q.' : (lang === 'kz' ? 'Жиі қойылатын сұрақтар' : 'Вопросы и ответы')}
          </h2>
        </div>

        {/* Accordion list (Minimalist Clean Luxury) */}
        <div className="divide-y divide-black/[0.08] dark:divide-white/[0.08] border-y border-black/[0.08] dark:border-white/[0.08]">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const question = item.question?.[lang] || item.question?.ru || '';
            const answer = item.answer?.[lang] || item.answer?.ru || '';

            return (
              <div key={idx} className="transition-colors duration-150">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-7 sm:py-8 text-left flex items-center justify-between gap-6 focus:outline-none group"
                >
                  <span className="font-heading font-bold text-lg sm:text-2xl text-slate-950 dark:text-white group-hover:translate-x-1 transition-transform">
                    {question}
                  </span>
                  <div className={`w-8 h-8 rounded-full border border-black/[0.1] dark:border-white/10 flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-slate-950 dark:bg-white text-white dark:text-slate-950' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pb-8 pr-8 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-light animate-fadeIn">
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
