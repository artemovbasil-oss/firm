import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { CheckCircle2, Calendar, Clock, Layers, Sparkles } from 'lucide-react';

export default function Process({ lang }) {
  const [activeStage, setActiveStage] = useState(null);

  const stages = [
    {
      num: '01',
      sprint: lang === 'en' ? 'Sprint 01' : (lang === 'kz' ? '01 Спринт' : 'Спринт 01'),
      days: lang === 'en' ? 'Days 1–3' : (lang === 'kz' ? '1–3 күн' : 'Дни 1–3'),
      colStart: 1,
      colSpan: 1,
      title: lang === 'en' 
        ? 'Research & Architecture' 
        : (lang === 'kz' ? 'Зерттеу & Архитектура' : 'Аналитика & Архитектура'),
      desc: lang === 'en'
        ? 'CustDev interviews, competitor gap analysis & CJM user journey'
        : (lang === 'kz'
        ? 'CustDev сұхбаттары, бәсекелестер аудиті және CJM картасы'
        : 'Глубинный CustDev, карта пути клиента и фиксация ТЗ'),
      tags: ['CustDev', 'CJM Flow', 'ТЗ & Смета']
    },
    {
      num: '02',
      sprint: lang === 'en' ? 'Sprint 01' : (lang === 'kz' ? '01 Спринт' : 'Спринт 01'),
      days: lang === 'en' ? 'Days 4–6' : (lang === 'kz' ? '4–6 күн' : 'Дни 4–6'),
      colStart: 2,
      colSpan: 1,
      title: lang === 'en'
        ? 'Wireframing & UX Flow'
        : (lang === 'kz' ? 'UX-құрылым & Wireframe' : 'Прототипирование & UX'),
      desc: lang === 'en'
        ? 'Clickable prototype, conversion wireframes & persuasive copywriting'
        : (lang === 'kz'
        ? 'Интерактивті логика, басылатын wireframe және мәтіндер'
        : 'Кликабельный прототип, UX-структура и продающий копирайтинг'),
      tags: ['Wireframe', 'User Story', 'Копирайтинг']
    },
    {
      num: '03',
      sprint: lang === 'en' ? 'Sprint 02' : (lang === 'kz' ? '02 Спринт' : 'Спринт 02'),
      days: lang === 'en' ? 'Days 7–12' : (lang === 'kz' ? '7–12 күн' : 'Дни 7–12'),
      colStart: 3,
      colSpan: 2, // spans cols 3 & 4
      title: lang === 'en'
        ? 'High-End UI & Design System'
        : (lang === 'kz' ? 'UI & Дизайн-жүйе' : 'High-End UI & Дизайн-система'),
      desc: lang === 'en'
        ? 'Bespoke design system in Figma, micro-animations & responsive layouts'
        : (lang === 'kz'
        ? 'Премиум визуал, Figma UI-kit және бейімді дизайн'
        : 'Премиальный визуал, Figma UI-kit, 3D и адаптивная сетка'),
      tags: ['Figma UI-Kit', 'Mobile First', 'Микродинамика']
    },
    {
      num: '04',
      sprint: lang === 'en' ? 'Sprint 02–03' : (lang === 'kz' ? '02–03 Спринт' : 'Спринт 02–03'),
      days: lang === 'en' ? 'Days 10–16' : (lang === 'kz' ? '10–16 күн' : 'Дни 10–16'),
      colStart: 4,
      colSpan: 2, // overlaps with UI and Backend
      title: lang === 'en'
        ? 'Frontend & WebGL Shaders'
        : (lang === 'kz' ? 'Frontend & Шейдерлер' : 'Frontend & WebGL шейдеры'),
      desc: lang === 'en'
        ? 'Next.js 15, responsive Tailwind, shaders & 95+ Core Web Vitals'
        : (lang === 'kz'
        ? 'React/Next.js, интерактив және 95+ PageSpeed жылдамдық'
        : 'React/Next.js стек, шейдеры, оптимизация PageSpeed 95+'),
      tags: ['Next.js 15', 'Tailwind', 'PageSpeed 95+']
    },
    {
      num: '05',
      sprint: lang === 'en' ? 'Sprint 03' : (lang === 'kz' ? '03 Спринт' : 'Спринт 03'),
      days: lang === 'en' ? 'Days 13–19' : (lang === 'kz' ? '13–19 күн' : 'Дни 13–19'),
      colStart: 5,
      colSpan: 2, // spans cols 5 & 6
      title: lang === 'en'
        ? 'Backend, APIs & CRM Sync'
        : (lang === 'kz' ? 'Backend & Интеграция' : 'Бэкенд, API & Интеграции'),
      desc: lang === 'en'
        ? 'Scalable database, ERP/1C integrations, payment gates & webhooks'
        : (lang === 'kz'
        ? 'Деректер қоры, 1С, төлем жүйелері және Telegram боттар'
        : 'Базы данных, 1С, эквайринг, CRM, Telegram боты и вебхуки'),
      tags: ['Fast API', 'CRM & Эквайринг', 'Docker CI/CD']
    },
    {
      num: '06',
      sprint: lang === 'en' ? 'Sprint 04' : (lang === 'kz' ? '04 Спринт' : 'Спринт 04'),
      days: lang === 'en' ? 'Days 20–22' : (lang === 'kz' ? '20–22 күн' : 'Дни 20–22'),
      colStart: 7,
      colSpan: 2, // cols 7 & 8
      title: lang === 'en'
        ? 'QA, Stress-Test & Release'
        : (lang === 'kz' ? 'Стресс-тест & Сәтті Релиз' : 'QA, Стресс-тест & Релиз'),
      desc: lang === 'en'
        ? 'Load testing, full IP rights handover, analytics & SLA warranty'
        : (lang === 'kz'
        ? 'Қауіпсіздік сынағы, аналитика баптау және салтанатты старт'
        : 'Нагрузочные тесты, сквозная аналитика, передача прав и запуск'),
      tags: ['100% NDA', 'Передача прав', 'Гарантия SLA']
    }
  ];

  const sprintColumns = [
    { label: lang === 'en' ? 'Sprint 01' : 'Спринт 01', range: lang === 'en' ? 'Days 1–6' : 'Дни 1–6', span: 2 },
    { label: lang === 'en' ? 'Sprint 02' : 'Спринт 02', range: lang === 'en' ? 'Days 7–12' : 'Дни 7–12', span: 2 },
    { label: lang === 'en' ? 'Sprint 03' : 'Спринт 03', range: lang === 'en' ? 'Days 13–18' : 'Дни 13–18', span: 2 },
    { label: lang === 'en' ? 'Sprint 04' : 'Спринт 04', range: lang === 'en' ? 'Days 19–22' : 'Дни 19–22', span: 2 },
  ];

  return (
    <section id="process" className="py-20 sm:py-28 lg:py-32 relative w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 lg:mb-20 gap-6">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
              {lang === 'en' ? 'Methodology' : (lang === 'kz' ? 'Әдістеме' : 'Как мы работаем')}
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.98]">
              {lang === 'en' ? 'How We Execute' : (lang === 'kz' ? 'Жұмыс кезеңдері' : 'Процесс работы')}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-lg">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              {lang === 'en'
                ? 'Transparent two-week sprints. Constant feedback loops. Predictable timelines and guaranteed results'
                : lang === 'kz'
                ? 'Екі апталық спринттер, нақты мерзім және келісім-шарт бойынша нәтижеге толық кепілдік'
                : 'Прозрачные двухнедельные спринты, регулярные демо и четкие дедлайны по договору'}
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP GANTT TIMELINE BOARD (Visible on lg+ screens)                      */}
        {/* ========================================================================= */}
        <div className="hidden lg:block bg-white dark:bg-[#07090e] border border-black/[0.08] dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl overflow-hidden">
          
          {/* Gantt Header Axis: Sprints & Timeline Grid Scale */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.08] items-center text-xs font-mono text-slate-500 dark:text-slate-400">
            <div className="col-span-4 pl-2 font-bold tracking-wider uppercase text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>{lang === 'en' ? 'Stage / Phase' : (lang === 'kz' ? 'Кезең / Тапсырма' : 'Этап разработки')}</span>
            </div>

            {/* 4 Sprint Columns across the remaining 8 grid columns */}
            <div className="col-span-8 grid grid-cols-4 gap-2">
              {sprintColumns.map((sp, spIdx) => (
                <div 
                  key={spIdx} 
                  className="px-3 py-1.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between"
                >
                  <span className="font-bold text-slate-900 dark:text-white uppercase">{sp.label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">{sp.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Phase Rows */}
          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05] relative">
            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;

              return (
                <div 
                  key={idx}
                  onMouseEnter={() => setActiveStage(idx)}
                  onMouseLeave={() => setActiveStage(null)}
                  className={`grid grid-cols-12 gap-4 py-4.5 items-center transition-colors duration-200 rounded-xl px-2 ${
                    isActive ? 'bg-black/[0.02] dark:bg-white/[0.02]' : ''
                  }`}
                >
                  {/* Left Column: Stage Info & Details */}
                  <div className="col-span-4 pr-4">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400 tabular-nums">
                        {stage.num}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        [{stage.days}]
                      </span>
                    </div>

                    <h3 className="text-sm font-heading font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug">
                      {stage.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {stage.desc}
                    </p>
                  </div>

                  {/* Right Column: Visual Gantt Bar Track (8 Grid Columns) */}
                  <div className="col-span-8 grid grid-cols-8 gap-2 relative items-center h-12">
                    
                    {/* Background Subtle Grid Guides */}
                    <div className="absolute inset-0 grid grid-cols-4 pointer-events-none divide-x divide-black/[0.03] dark:divide-white/[0.03]">
                      <div /><div /><div /><div />
                    </div>

                    {/* The Gantt Milestone Bar */}
                    <div 
                      style={{
                        gridColumnStart: stage.colStart,
                        gridColumnEnd: `span ${stage.colSpan}`
                      }}
                      className={`relative z-10 h-10 px-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                        isActive
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                          : 'bg-slate-100/90 dark:bg-white/[0.04] border-black/[0.06] dark:border-white/10'
                      }`}
                    >
                      {/* Left side: Node + Duration */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 transition-transform ${
                          isActive 
                            ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(251,191,36,0.9)]' 
                            : 'bg-amber-400/80 shadow-[0_0_4px_rgba(251,191,36,0.5)]'
                        }`} />
                        <span className="text-xs font-mono font-bold text-slate-950 dark:text-white whitespace-nowrap">
                          {stage.days}
                        </span>
                      </div>

                      {/* Right side: Deliverable Chips */}
                      <div className="hidden sm:flex items-center gap-1.5 ml-2 overflow-hidden">
                        {stage.tags.slice(0, 2).map((tag, tIdx) => (
                          <span 
                            key={tIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-white/10 border border-black/[0.05] dark:border-white/10 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Gantt Footer Milestone Note */}
          <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'en' ? 'Standard Timeline: 20–22 business days' : (lang === 'kz' ? 'Стандартты мерзім: 20–22 жұмыс күні' : 'Стандартный срок полного цикла: 20–22 рабочих дня')}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'en' ? 'Weekly Live Demos & Deliverables' : (lang === 'kz' ? 'Апта сайынғы демо және есептер' : 'Еженедельные живые демо и передача этапов')}</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET CONNECTED TIMELINE (Visible on < lg screens)               */}
        {/* ========================================================================= */}
        <div className="lg:hidden relative pl-6 sm:pl-8 space-y-6 sm:space-y-8">
          
          {/* Continuous Illuminated Rail */}
          <div className="absolute left-2 sm:left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-amber-400 via-amber-400/40 to-slate-200 dark:to-white/10" />

          {stages.map((stage, idx) => (
            <div key={idx} className="relative group">
              
              {/* Timeline Node on Rail */}
              <div className="absolute -left-6 sm:-left-8 top-3.5 w-3.5 h-3.5 rounded-full bg-slate-950 dark:bg-white border-2 border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)] z-10 group-hover:scale-125 transition-transform" />

              {/* Stage Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#07090e] border border-black/[0.08] dark:border-white/10 shadow-sm transition-all duration-200 group-hover:border-amber-500/40">
                
                {/* Meta Header Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400 tabular-nums">
                      {stage.num}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-black/[0.03] dark:bg-white/[0.05]">
                      {stage.sprint}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-slate-950 dark:text-white tabular-nums px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10">
                    {stage.days}
                  </span>
                </div>

                {/* Stage Title */}
                <h3 className="text-base sm:text-lg font-heading font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug">
                  {stage.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal mt-1 mb-3">
                  {stage.desc}
                </p>

                {/* Deliverables Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-black/[0.05] dark:border-white/[0.05]">
                  {stage.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-white/[0.05] border border-black/[0.05] dark:border-white/10 text-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
