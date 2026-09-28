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
  const [activeService, setActiveService] = useState('websites');
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
    <section id="services" className="py-32 sm:py-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 gap-6">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
              {lang === 'en' ? 'Core Capabilities' : (lang === 'kz' ? 'Негізгі бағыттар' : 'Экспертиза и стек')}
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.95]">
              {lang === 'en' ? 'What We Build.' : (lang === 'kz' ? 'Біз не жасаймыз.' : 'Что мы создаем.')}
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
                  className="w-full py-8 sm:py-10 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 focus:outline-none group px-2 sm:px-4"
                >
                  <div className="flex items-center gap-6 sm:gap-10 min-w-0 flex-1">
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-slate-950 dark:text-white group-hover:translate-x-2 transition-transform duration-200 truncate sm:whitespace-normal">
                      {title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 shrink-0 pl-10 md:pl-0">
                    <span className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-wider hidden lg:inline">
                      [{category}]
                    </span>

                    <span className="text-sm sm:text-base font-mono font-bold text-slate-950 dark:text-white whitespace-nowrap">
                      {formatPrice(service.basePrice)}
                    </span>

                    <motion.div 
                      animate={{ rotate: isSelected ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`w-8 h-8 rounded-full border border-black/[0.1] dark:border-white/15 flex items-center justify-center text-slate-900 dark:text-white shrink-0 ${isSelected ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'group-hover:scale-110'}`}
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
                      <div className="pb-10 pl-10 sm:pl-16 pr-4 sm:pr-8 space-y-6 pt-2">
                        <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-light max-w-4xl">
                          {tagline}
                        </p>

                        {/* Clean Deliverable Tags with Healthy Gaps */}
                        <div className="flex flex-wrap gap-2.5 pt-2">
                          {deliverables.slice(0, 4).map((d, dIdx) => (
                            <span 
                              key={dIdx}
                              className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-sm"
                            >
                              {d}
                            </span>
                          ))}
                        </div>

                        {/* Action buttons with proper margins */}
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onOrderService(title)}
                            className="px-6 py-3.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 shadow-lg"
                          >
                            <span>{t.orderBtn}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onSelectForCalculator(service.id)}
                            className="px-6 py-3.5 rounded-full border border-black/[0.1] dark:border-white/15 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs sm:text-sm font-heading font-medium transition-all"
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
