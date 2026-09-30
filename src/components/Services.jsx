import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSLATIONS } from '../data/translations';

export default function Services({ 
  lang, 
  currency, 
  servicesList = [], 
  onSelectForCalculator, 
  onOrderService 
}) {
  const [activeService, setActiveService] = useState(null);
  const t = TRANSLATIONS[lang].services;

  const formatPrice = (priceObj) => {
    if (!priceObj) return '';
    const val = priceObj[currency] || priceObj.rub;
    const prefix = lang === 'en' ? 'From ' : (lang === 'kz' ? 'Бастап ' : 'от ');
    if (currency === 'rub') {
      return `${prefix}${val.toLocaleString('ru-RU')} ₽`;
    } else if (currency === 'usd') {
      return `${prefix}$${val.toLocaleString('en-US')}`;
    } else if (currency === 'kzt') {
      return `${prefix}${val.toLocaleString('ru-RU')} ₸`;
    }
    return `${prefix}${val} ₽`;
  };

  const getLocalized = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.ru || '';
  };

  return (
    <section id="services" className="py-20 sm:py-28 lg:py-32 relative w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 lg:mb-20 gap-6">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
              {lang === 'en' ? 'Core Capabilities' : (lang === 'kz' ? 'Негізгі бағыттар' : 'Экспертиза и стек')}
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.98]">
              {lang === 'en' ? 'What We Build' : (lang === 'kz' ? 'Біз не жасаймыз' : 'Что мы создаем')}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-relaxed font-normal">
            {lang === 'en' 
              ? 'Complete digital engineering from brand strategy to high-load code. No templates, no agency bloat.'
              : lang === 'kz'
              ? 'Брендтен бастап күрделі IT-жүйелерге дейін. Барлық цифрлық міндеттер бір терезеде.'
              : 'Полный цикл цифрового производства: от визуальной стратегии до масштабируемого софта. Без шаблонов и воды.'}
          </p>
        </div>

        {/* Editorial Interactive Studio Index with Framer Motion Accordion */}
        <div className="divide-y divide-black/[0.08] dark:divide-white/[0.08] border-y border-black/[0.08] dark:border-white/[0.08]">
          {servicesList.map((service) => {
            const isSelected = activeService === service.id;
            const title = getLocalized(service.title);
            const tagline = getLocalized(service.tagline);
            const category = getLocalized(service.category);
            const deliverables = service.deliverables?.[lang] || service.deliverables?.ru || [];

            return (
              <div 
                key={service.id}
                className={`transition-colors duration-200 ${
                  isSelected ? 'bg-black/[0.02] dark:bg-white/[0.02]' : 'hover:bg-black/[0.01] dark:hover:bg-white/[0.01]'
                }`}
              >
                {/* Clickable Row Header */}
                <button
                  type="button"
                  onClick={() => setActiveService(isSelected ? null : service.id)}
                  className="w-full py-5 sm:py-7 lg:py-8 text-left flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-6 focus:outline-none group px-1 sm:px-4"
                >
                  <div className="flex items-center gap-4 sm:gap-8 min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-slate-950 dark:text-white group-hover:translate-x-2 transition-transform duration-200 truncate sm:whitespace-normal">
                      {title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-8 shrink-0 w-full md:w-auto">
                    <span className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-wider hidden lg:inline">
                      [{category}]
                    </span>

                    <span className="text-xs sm:text-sm md:text-base font-mono font-bold text-slate-950 dark:text-white whitespace-nowrap tabular-nums">
                      {formatPrice(service.basePrice)}
                    </span>

                    <motion.div 
                      animate={{ rotate: isSelected ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`w-8 h-8 rounded-full border border-black/[0.1] dark:border-white/15 flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isSelected 
                          ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm' 
                          : 'text-slate-900 dark:text-white group-hover:scale-110 group-hover:border-slate-400 dark:group-hover:border-white/40'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </button>

                {/* Animated Height Expansion via Framer Motion */}
                <AnimatePresence initial={false}>
                  {isSelected && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 sm:pb-8 pl-1 sm:pl-4 lg:pl-4 pr-1 sm:pr-4 space-y-4 pt-1">
                        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-3xl">
                          {tagline}
                        </p>

                        {/* Compact Deliverable Tags with Accent Dot */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {deliverables.slice(0, 6).map((d, dIdx) => (
                            <span 
                              key={dIdx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-mono bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/10 text-slate-700 dark:text-slate-200 transition-colors hover:border-black/25 dark:hover:border-white/25"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 dark:bg-amber-400 shrink-0" />
                              {d}
                            </span>
                          ))}
                        </div>

                        {/* Action buttons with proper margins */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onOrderService(title)}
                            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg"
                          >
                            <span>{t.orderBtn}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectForCalculator(service.id)}
                            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-black/[0.1] dark:border-white/15 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 text-xs sm:text-sm font-heading font-medium transition-all"
                          >
                            {t.calcBtn}
                          </motion.button>
                        </div>
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
