import React, { useState } from 'react';
import { ArrowUpRight, Plus, Minus, ArrowRight, Check } from 'lucide-react';
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
              // 01 · {lang === 'en' ? 'Core Capabilities' : (lang === 'kz' ? 'Негізгі бағыттар' : 'Экспертиза и стек')}
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

        {/* Editorial Interactive Studio Index */}
        <div className="divide-y divide-black/[0.08] dark:divide-white/[0.08] border-y border-black/[0.08] dark:border-white/[0.08]">
          {servicesList.map((service, index) => {
            const isSelected = activeService === service.id;
            const title = getLocalized(service.title);
            const tagline = getLocalized(service.tagline);
            const category = getLocalized(service.category);
            const deliverables = service.deliverables?.[lang] || service.deliverables?.ru || [];
            const ghostNum = String(index + 1).padStart(2, '0');

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
                  className="w-full py-8 sm:py-10 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 focus:outline-none group"
                >
                  <div className="flex items-start sm:items-center gap-6 sm:gap-10 min-w-0">
                    <span className="font-mono text-sm sm:text-base font-bold text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {ghostNum}
                    </span>

                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-slate-950 dark:text-white group-hover:translate-x-2 transition-transform duration-200">
                      {title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 shrink-0 pl-12 md:pl-0">
                    <span className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-wider hidden lg:inline">
                      [{category}]
                    </span>

                    <span className="text-sm sm:text-base font-mono font-semibold text-slate-950 dark:text-white">
                      {formatPrice(service.basePrice)}
                    </span>

                    <div className={`w-8 h-8 rounded-full border border-black/[0.1] dark:border-white/15 flex items-center justify-center text-slate-900 dark:text-white transition-transform duration-200 ${isSelected ? 'rotate-45 bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'group-hover:scale-110'}`}>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Details Panel */}
                {isSelected && (
                  <div className="pb-10 pl-12 md:pl-16 pr-4 sm:pr-8 animate-fadeIn">
                    <div className="max-w-4xl space-y-6">
                      <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                        {tagline}
                      </p>

                      {/* Clean Deliverable Tags (No wall of text!) */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {deliverables.slice(0, 4).map((d, dIdx) => (
                          <span 
                            key={dIdx}
                            className="px-3 py-1.5 rounded-full text-xs font-mono bg-white dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/10 text-slate-700 dark:text-slate-300"
                          >
                            {d}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-4 pt-4">
                        <button
                          onClick={() => onOrderService(title)}
                          className="px-6 py-3 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs sm:text-sm font-heading font-bold hover:opacity-90 transition-all flex items-center gap-2 active:scale-95"
                        >
                          <span>{t.orderBtn}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onSelectForCalculator(service.id)}
                          className="px-6 py-3 rounded-full border border-black/[0.1] dark:border-white/15 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs sm:text-sm font-heading font-medium transition-all"
                        >
                          {t.calcBtn}
                        </button>
                      </div>
                    </div>
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
