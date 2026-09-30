import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_ITEMS } from '../data/agencyData';
import { TRANSLATIONS } from '../data/translations';
import BlindTextReveal from './BlindTextReveal';

export default function Faq({ lang }) {
  const [openIndex, setOpenIndex] = useState(0);
  const t = TRANSLATIONS[lang].faq;

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 lg:py-32 relative w-full max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <BlindTextReveal delay={0}>
            <div className="text-xs sm:text-sm font-mono text-neutral-500 uppercase tracking-widest mb-3">
              {lang === 'en' ? 'Direct Answers' : (lang === 'kz' ? 'Сұрақ-жауап' : 'Частые вопросы')}
            </div>
          </BlindTextReveal>
          <BlindTextReveal as="h2" delay={0.08}>
            <span className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-[0.98] inline-block">
              {lang === 'en' ? 'FAQ' : (lang === 'kz' ? 'Жиі қойылатын сұрақтар' : 'Вопросы и ответы')}
            </span>
          </BlindTextReveal>
        </div>

        {/* Accordion list with Framer Motion */}
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
                  className="w-full py-6 sm:py-8 text-left flex items-center justify-between gap-4 sm:gap-6 focus:outline-none group px-1 sm:px-4"
                >
                  <span className="font-heading font-bold text-base sm:text-xl lg:text-2xl text-neutral-950 dark:text-white group-hover:translate-x-1.5 transition-transform duration-200">
                    {question}
                  </span>
                  <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`w-9 h-9 rounded-full border border-black/[0.1] dark:border-white/10 flex items-center justify-center shrink-0 ${isOpen ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950' : 'text-neutral-600 dark:text-neutral-400'}`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="faq-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pt-1 pl-2 sm:pl-4 pr-6 sm:pr-12 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-light max-w-3xl">
                        {answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
