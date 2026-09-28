import React from 'react';
import { TRANSLATIONS } from '../data/translations';

export default function Process({ lang }) {
  const steps = lang === 'en' ? [
    {
      num: '01',
      title: 'Deep Research & Architecture',
      desc: 'We dissect your market, analyze competitor blind spots, and map the customer journey before touching design.'
    },
    {
      num: '02',
      title: 'Bespoke Design Systems',
      desc: 'Interactive Figma prototypes, high-conversion visual hierarchy, and refined micro-interactions.'
    },
    {
      num: '03',
      title: 'High-Performance Engineering',
      desc: 'Clean modular code, sub-second page speed, and seamless integrations with CRM and payment gateways.'
    },
    {
      num: '04',
      title: 'Launch & Compounding ROI',
      desc: 'Final stress testing, end-to-end analytics tracking, and continuous support to ensure immediate revenue.'
    }
  ] : lang === 'kz' ? [
    {
      num: '01',
      title: 'Терең зерттеу және архитектура',
      desc: 'Нарықты, бәсекелестерді және сатып алушы жолын (CJM) дизайнды бастамас бұрын толық зерттейміз.'
    },
    {
      num: '02',
      title: 'Жеке дизайн жүйесі',
      desc: 'Figma-дағы интерактивті прототиптер, жоғары конверсиялық визуалды иерархия және микроанимациялар.'
    },
    {
      num: '03',
      title: 'Жоғары жылдамдықты әзірлеу',
      desc: 'Таза модульдік код, 0.8 секундтан жылдам жүктелу және CRM мен төлемдерді мінсіз интеграциялау.'
    },
    {
      num: '04',
      title: 'Іске қосу және сатылым өсімі',
      desc: 'Стресс-тестілеу, толық аналитика баптау және келісімшарттық SLA кепілдікпен техникалық сүйемелдеу.'
    }
  ] : [
    {
      num: '01',
      title: 'Предпроектный анализ и архитектура',
      desc: 'Исследуем рынок, узкие места конкурентов и карту пути клиента (CJM) до первого макета.'
    },
    {
      num: '02',
      title: 'Индивидуальная дизайн-система',
      desc: 'Интерактивные прототипы в Figma, выверенная визуальная иерархия и продуманная микродинамика.'
    },
    {
      num: '03',
      title: 'Чистый производительный код',
      desc: 'Быстрый стек, загрузка страниц до 0.8с, интеграция с CRM, эквайрингом и сквозной аналитикой.'
    },
    {
      num: '04',
      title: 'Релиз и рост продаж',
      desc: 'Финальный стресс-тест, сдача всех прав, настройка целей и гарантийная техническая поддержка.'
    }
  ];

  return (
    <section id="process" className="py-32 sm:py-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 gap-6">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
              {lang === 'en' ? 'Methodology' : (lang === 'kz' ? 'Әдістеме' : 'Как мы работаем')}
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.95]">
              {lang === 'en' ? 'How We Execute.' : (lang === 'kz' ? 'Жұмыс кезеңдері.' : 'Процесс работы.')}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-relaxed font-normal">
            {lang === 'en'
              ? 'Transparent two-week sprints. Constant feedback loops. Predictable timelines and guaranteed results.'
              : lang === 'kz'
              ? 'Екі апталық спринттер, нақты мерзім және келісім-шарт бойынша нәтижеге толық кепілдік.'
              : 'Прозрачные двухнедельные спринты, регулярные демо и четкие дедлайны по договору.'}
          </p>
        </div>

        {/* Typographic Progression Grid (Clean, Breathable, High-End) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="space-y-4 pt-8 border-t border-black/[0.08] dark:border-white/[0.08] group"
            >
              <div className="w-6 h-0.5 bg-slate-300 dark:bg-slate-700 group-hover:w-12 group-hover:bg-slate-950 dark:group-hover:bg-white transition-all duration-300"></div>

              <h3 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-slate-950 dark:text-white leading-snug">
                {step.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
