import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Clock, Layers } from 'lucide-react';
import BlindTextReveal from './BlindTextReveal';

export default function Process({ lang }) {
  const [activeStage, setActiveStage] = useState(null);

  const stages = [
    {
      num: '01',
      sprint: lang === 'en' ? 'Sprint 01' : (lang === 'kz' ? '01 Спринт' : 'Спринт 01'),
      days: lang === 'en' ? 'Days 1–3' : (lang === 'kz' ? '1–3 күн' : 'Дни 1–3'),
      colStart: 1,
      colSpan: 1,
      title: lang === 'en' ? 'CustDev & Research' : (lang === 'kz' ? 'CustDev & Зерттеу' : 'CustDev & Аналитика'),
      deliverable: lang === 'en' ? 'CJM journey, competitor audit & brief' : (lang === 'kz' ? 'CJM картасы, бәсекелестер аудиті' : 'CJM карта пути, аудит ниши и ТЗ')
    },
    {
      num: '02',
      sprint: lang === 'en' ? 'Sprint 01' : (lang === 'kz' ? '01 Спринт' : 'Спринт 01'),
      days: lang === 'en' ? 'Days 4–6' : (lang === 'kz' ? '4–6 күн' : 'Дни 4–6'),
      colStart: 2,
      colSpan: 1,
      title: lang === 'en' ? 'UX Flow & Wireframes' : (lang === 'kz' ? 'UX-құрылым & Wireframe' : 'Архитектура & UX-прототип'),
      deliverable: lang === 'en' ? 'Interactive clickable prototype' : (lang === 'kz' ? 'Интерактивті кликабелді прототип' : 'Интерактивный кликабельный прототип')
    },
    {
      num: '03',
      sprint: lang === 'en' ? 'Sprint 02' : (lang === 'kz' ? '02 Спринт' : 'Спринт 02'),
      days: lang === 'en' ? 'Days 7–11' : (lang === 'kz' ? '7–11 күн' : 'Дни 7–11'),
      colStart: 3,
      colSpan: 2,
      title: lang === 'en' ? 'High-End UI & Design System' : (lang === 'kz' ? 'UI & Дизайн-жүйе' : 'High-End UI & Дизайн-система'),
      deliverable: lang === 'en' ? 'Figma UI-kit, responsive layout' : (lang === 'kz' ? 'Figma UI-kit және адаптивті тор' : 'Figma UI-kit, адаптивная сетка и стиль')
    },
    {
      num: '04',
      sprint: lang === 'en' ? 'Sprint 02–03' : (lang === 'kz' ? '02–03 Спринт' : 'Спринт 02–03'),
      days: lang === 'en' ? 'Days 10–14' : (lang === 'kz' ? '10–14 күн' : 'Дни 10–14'),
      colStart: 4,
      colSpan: 2,
      title: lang === 'en' ? '3D & WebGL Shaders' : (lang === 'kz' ? '3D & WebGL Шейдерлер' : '3D & WebGL Шейдеры'),
      deliverable: lang === 'en' ? 'Kinetic shaders & micro-interactions' : (lang === 'kz' ? 'Интерактивті шейдерлер мен анимация' : 'Шейдеры, микродинамика и физика')
    },
    {
      num: '05',
      sprint: lang === 'en' ? 'Sprint 03' : (lang === 'kz' ? '03 Спринт' : 'Спринт 03'),
      days: lang === 'en' ? 'Days 12–17' : (lang === 'kz' ? '12–17 күн' : 'Дни 12–17'),
      colStart: 5,
      colSpan: 2,
      title: lang === 'en' ? 'Frontend & Performance' : (lang === 'kz' ? 'Frontend & Өнімділік' : 'Frontend & Оптимизация'),
      deliverable: lang === 'en' ? 'React/Next.js, PageSpeed 95+' : (lang === 'kz' ? 'React/Next.js, 95+ PageSpeed' : 'Next.js стек, PageSpeed 95+ и SEO')
    },
    {
      num: '06',
      sprint: lang === 'en' ? 'Sprint 03–04' : (lang === 'kz' ? '03–04 Спринт' : 'Спринт 03–04'),
      days: lang === 'en' ? 'Days 15–19' : (lang === 'kz' ? '15–19 күн' : 'Дни 15–19'),
      colStart: 6,
      colSpan: 2,
      title: lang === 'en' ? 'Backend, APIs & CRM' : (lang === 'kz' ? 'Backend & Интеграция' : 'Бэкенд, API & Интеграции'),
      deliverable: lang === 'en' ? 'Databases, 1C, acquiring & webhooks' : (lang === 'kz' ? 'Деректер қоры, 1С және төлем жүйесі' : 'Базы данных, 1С, эквайринг и CRM')
    },
    {
      num: '07',
      sprint: lang === 'en' ? 'Sprint 04' : (lang === 'kz' ? '04 Спринт' : 'Спринт 04'),
      days: lang === 'en' ? 'Days 20–22' : (lang === 'kz' ? '20–22 күн' : 'Дни 20–22'),
      colStart: 7,
      colSpan: 2,
      title: lang === 'en' ? 'QA, Stress-Test & Release' : (lang === 'kz' ? 'Стресс-тест & Релиз' : 'QA, Стресс-тест & Релиз'),
      deliverable: lang === 'en' ? 'Stress tests, IP handover & SLA' : (lang === 'kz' ? 'Стресс-сынақ, құқықтар беру & SLA' : 'Нагрузочные тесты, передача прав и запуск')
    }
  ];

  const sprintColumns = [
    { label: lang === 'en' ? 'Sprint 01' : 'Спринт 01', range: lang === 'en' ? 'Days 1–6' : 'Дни 1–6' },
    { label: lang === 'en' ? 'Sprint 02' : 'Спринт 02', range: lang === 'en' ? 'Days 7–12' : 'Дни 7–12' },
    { label: lang === 'en' ? 'Sprint 03' : 'Спринт 03', range: lang === 'en' ? 'Days 13–18' : 'Дни 13–18' },
    { label: lang === 'en' ? 'Sprint 04' : 'Спринт 04', range: lang === 'en' ? 'Days 19–22' : 'Дни 19–22' },
  ];

  return (
    <section id="process" className="py-20 sm:py-28 lg:py-32 relative w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 lg:mb-20 gap-6">
          <div>
            <BlindTextReveal delay={0}>
              <div className="text-xs sm:text-sm font-mono text-neutral-500 uppercase tracking-widest mb-3">
                {lang === 'en' ? 'Methodology' : (lang === 'kz' ? 'Әдістеме' : 'Как мы работаем')}
              </div>
            </BlindTextReveal>
            <BlindTextReveal as="h2" delay={0.08}>
              <span className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-[0.98] inline-block">
                {lang === 'en' ? 'How We Execute' : (lang === 'kz' ? 'Жұмыс кезеңдері' : 'Процесс работы')}
              </span>
            </BlindTextReveal>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-lg">
            <BlindTextReveal delay={0.16}>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                {lang === 'en'
                  ? 'Transparent two-week sprints. Constant feedback loops. Predictable timelines and guaranteed results'
                  : lang === 'kz'
                  ? 'Екі апталық спринттер, нақты мерзім және келісім-шарт бойынша нәтижеге толық кепілдік'
                  : 'Прозрачные двухнедельные спринты, регулярные демо и четкие дедлайны по договору'}
              </p>
            </BlindTextReveal>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP GANTT TIMELINE BOARD (Visible on lg+ screens)                      */}
        {/* ========================================================================= */}
        <div className="hidden lg:block bg-white dark:bg-[#0c0c0e] border border-black/[0.08] dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl overflow-hidden">
          
          {/* Gantt Header Axis: Sprints & Timeline Grid Scale */}
          <div className="grid grid-cols-12 gap-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.08] items-center text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <div className="col-span-4 pl-2 font-bold tracking-wider uppercase text-neutral-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>{lang === 'en' ? 'Development Stage' : (lang === 'kz' ? 'Жұмыс кезеңі' : 'Этап разработки')}</span>
            </div>

            {/* 4 Sprint Columns across the remaining 8 grid columns */}
            <div className="col-span-8 grid grid-cols-4 gap-3">
              {sprintColumns.map((sp, spIdx) => (
                <div 
                  key={spIdx} 
                  className="px-3 py-1.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between"
                >
                  <span className="font-bold text-neutral-900 dark:text-white uppercase">{sp.label}</span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 tabular-nums">{sp.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Phase Rows */}
          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04] relative">
            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;

              return (
                <div 
                  key={idx}
                  onMouseEnter={() => setActiveStage(idx)}
                  onMouseLeave={() => setActiveStage(null)}
                  className={`grid grid-cols-12 gap-6 py-3.5 items-center transition-colors duration-200 rounded-xl px-2 ${
                    isActive ? 'bg-black/[0.02] dark:bg-white/[0.02]' : ''
                  }`}
                >
                  {/* Left Column: Stage Info */}
                  <div className="col-span-4 pr-2 flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400 tabular-nums shrink-0">
                      {stage.num}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-heading font-extrabold text-neutral-950 dark:text-white tracking-tight truncate">
                        {stage.title}
                      </h3>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5 font-sans">
                        {stage.deliverable}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Visual Gantt Bar Track (8 Grid Columns) */}
                  <div className="col-span-8 grid grid-cols-8 gap-2 relative items-center h-10">
                    
                    {/* Background Subtle Grid Vertical Guides */}
                    <div className="absolute inset-0 grid grid-cols-4 pointer-events-none divide-x divide-black/[0.03] dark:divide-white/[0.03]">
                      <div /><div /><div /><div />
                    </div>

                    {/* The Gantt Milestone Bar */}
                    <div 
                      style={{
                        gridColumnStart: stage.colStart,
                        gridColumnEnd: `span ${stage.colSpan}`
                      }}
                      className={`relative z-10 h-8 px-3 rounded-lg border flex items-center gap-2 transition-all duration-200 min-w-0 overflow-hidden ${
                        isActive
                          ? 'bg-amber-400/20 dark:bg-amber-400/15 border-amber-400 text-amber-950 dark:text-amber-200 shadow-sm'
                          : 'bg-neutral-100/90 dark:bg-white/[0.04] border-black/[0.06] dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-amber-400/40'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-transform ${
                        isActive 
                          ? 'bg-amber-400 scale-125 shadow-[0_0_6px_rgba(251,191,36,0.9)]' 
                          : 'bg-amber-400/80 shadow-[0_0_3px_rgba(251,191,36,0.5)]'
                      }`} />
                      <span className="text-[11px] font-mono font-bold whitespace-nowrap truncate">
                        {stage.days}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Gantt Footer Milestone Note */}
          <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-500">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'en' ? 'Standard Timeline: 20–22 business days' : (lang === 'kz' ? 'Стандартты мерзім: 20–22 жұмыс күні' : 'Стандартный срок полного цикла: 20–22 рабочих дня')}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'en' ? 'Weekly Live Demos & Deliverables' : (lang === 'kz' ? 'Апта сайынғы демо және есептер' : 'Еженедельные живые демо и передача этапов')}</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET CONNECTED TIMELINE (Visible on < lg screens)               */}
        {/* ========================================================================= */}
        <div className="lg:hidden relative pl-6 sm:pl-8 space-y-4 sm:space-y-5">
          
          {/* Continuous Illuminated Rail */}
          <div className="absolute left-2 sm:left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-amber-400 via-amber-400/40 to-neutral-200 dark:to-white/10" />

          {stages.map((stage, idx) => (
            <div key={idx} className="relative group">
              
              {/* Timeline Node on Rail */}
              <div className="absolute -left-6 sm:-left-8 top-3.5 w-3.5 h-3.5 rounded-full bg-neutral-950 dark:bg-white border-2 border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)] z-10 group-hover:scale-125 transition-transform" />

              {/* Stage Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-black/[0.08] dark:border-white/10 shadow-sm transition-all duration-200 group-hover:border-amber-500/40">
                
                {/* Meta Header Row */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400 tabular-nums">
                      {stage.num}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-2 py-0.5 rounded bg-black/[0.03] dark:bg-white/[0.05]">
                      {stage.sprint}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-neutral-950 dark:text-white tabular-nums px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10">
                    {stage.days}
                  </span>
                </div>

                {/* Stage Title */}
                <h3 className="text-sm sm:text-base font-heading font-extrabold text-neutral-950 dark:text-white tracking-tight leading-snug">
                  {stage.title}
                </h3>

                {/* Deliverable */}
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal mt-0.5 font-sans">
                  {stage.deliverable}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
