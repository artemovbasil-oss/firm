import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck, 
  ExternalLink, Layers, Cpu, TrendingUp, Target, 
  Sparkles, Clock, Globe, Award, Share2, Home
} from 'lucide-react';
import ArtxLogo from './ArtxLogo';

export default function CaseStudyDetail({ 
  caseItem, 
  allCases = [], 
  lang = 'ru', 
  onClose, 
  onSelectCase, 
  onOpenContact 
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [caseItem?.slug]);

  if (!caseItem) return null;

  const getLocalized = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.ru || field.en || '';
  };

  const title = getLocalized(caseItem.title);
  const client = getLocalized(caseItem.client);
  const summary = getLocalized(caseItem.summary);
  const badge = getLocalized(caseItem.badge);
  const challenge = getLocalized(caseItem.challenge);
  const solution = getLocalized(caseItem.solution);

  const currentIndex = allCases.findIndex(c => c.slug === caseItem.slug || c.id === caseItem.id);
  const nextCase = allCases[(currentIndex + 1) % allCases.length];
  const prevCase = allCases[(currentIndex - 1 + allCases.length) % allCases.length];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} · ARTX Digital Case Study`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(lang === 'en' ? 'Link copied to clipboard!' : (lang === 'kz' ? 'Сілтеме көшірілді!' : 'Ссылка скопирована в буфер обмена!'));
    }
  };

  const CASE_HERO_IMAGES = {
    'luxury-furniture-kazakhstan': '/cases/hero/furniture.jpg',
    'italian-eyewear-platform': '/cases/hero/eyewear.jpg',
    'transport-hr-platform': '/cases/hero/transport.jpg',
    'employee-learning-lms': '/cases/hero/lms-team.jpg',
    'nail-cosmetics-brand': '/cases/hero/hero_frame.jpg',
    'automotive-market-launch': '/cases/hero/automotive.jpg'
  };
  const heroImg = caseItem.heroImage || CASE_HERO_IMAGES[caseItem.slug] || '/cases/hero/furniture.jpg';

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#070708] text-neutral-950 dark:text-white pt-24 sm:pt-32 pb-20 selection:bg-amber-400 selection:text-neutral-950">
      
      {/* Case Header Hero */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs Navigation & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <button
              type="button" 
              onClick={() => onClose()}
              className="hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Main' : (lang === 'kz' ? 'Басты бет' : 'Главная')}</span>
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <button 
              type="button"
              onClick={() => onClose('cases')}
              className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer font-medium"
            >
              {lang === 'en' ? 'Cases' : (lang === 'kz' ? 'Кейстер' : 'Кейсы')}
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-neutral-950 dark:text-white font-bold truncate max-w-[200px] sm:max-w-xs md:max-w-sm">
              {title}
            </span>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-xs font-mono text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Share' : (lang === 'kz' ? 'Бөлісу' : 'Поделиться')}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenContact(`${title} Case Discussion`)}
              className="px-4 py-1.5 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-heading font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>{lang === 'en' ? 'Discuss Similar' : (lang === 'kz' ? 'Осыған ұқсас жоба' : 'Обсудить аналогичный')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Meta / Badges */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-5">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-400 text-neutral-950 shadow-sm">
            {badge}
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-mono border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-400">
            {client}
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-mono border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-400">
            {caseItem.year || '2025–2026'}
          </span>
        </div>

        {/* Big Editorial Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-[1.08] max-w-5xl mb-4 sm:mb-6">
          {title}
        </h1>

        {/* Lead Summary */}
        <p className="text-sm sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-4xl font-normal leading-relaxed mb-8 sm:mb-10">
          {summary}
        </p>

        {/* Thematic Graphics & Mockup Showcase Block */}
        <div className="mb-10 sm:mb-14 rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/10 bg-[#0c0c0e] shadow-2xl overflow-hidden relative group">
          {/* Top Window Bar (Browser / App Mockup style) */}
          <div className="px-4 py-3 bg-neutral-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 text-[11px] text-neutral-400 hidden sm:inline font-mono">
                artx.one/cases/{caseItem.slug}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-white/90 border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                {caseItem.tagline || badge}
              </span>
            </div>
          </div>

          {/* Visual Banner Container */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[460px] w-full overflow-hidden bg-neutral-950">
            <img 
              src={heroImg} 
              alt={title}
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 opacity-95"
              loading="eager"
            />
            {/* Subtle Vignette & Frame Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/20 pointer-events-none"></div>

            {/* Overlaid Floating Metadata Chips */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex flex-wrap items-center gap-2 z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-neutral-950/80 text-white border border-white/20 backdrop-blur-md shadow-lg">
                {client}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-400 text-neutral-950 shadow-lg">
                {badge}
              </span>
            </div>
          </div>
        </div>

        {/* Uniform Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {(caseItem.metrics || []).map((m, idx) => (
            <div 
              key={idx}
              className="h-[104px] sm:h-[114px] p-3.5 sm:p-4 rounded-2xl border border-black/[0.08] dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-md shadow-sm flex flex-col justify-between group hover:border-amber-400/40 transition-colors min-w-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"></span>
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                    0{idx + 1}
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  METRIC
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-heading font-black tracking-tight text-neutral-950 dark:text-white tabular-nums leading-none mb-1 truncate">
                  {m.value}
                </div>
                <div className="text-[11px] sm:text-xs font-mono text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-1 truncate">
                  {getLocalized(m.label)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Structured Editorial Case Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-16 items-start pb-16 border-b border-black/[0.06] dark:border-white/[0.08]">
          
          {/* Main Case Narrative (8 cols) */}
          <div className="lg:col-span-8 space-y-12 sm:space-y-16">
            
            {/* 1. Context & Challenge */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 dark:text-amber-400">
                <Target className="w-4 h-4" />
                <span>{lang === 'en' ? 'Challenge & Context' : (lang === 'kz' ? 'Жоба мәселесі мен мақсаты' : 'Контекст и вызовы проекта')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-neutral-950 dark:text-white uppercase">
                {lang === 'en' ? 'The Industry Bottleneck' : (lang === 'kz' ? 'Негізгі қиындықтар' : 'Ключевые барьеры роста')}
              </h2>
              <div className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-4 font-normal">
                <p>{challenge || summary}</p>
                <p>
                  {lang === 'en'
                    ? 'Existing legacy market workflows were generating friction at every touchpoint, reducing organic conversion and creating operational overhead for the team.'
                    : lang === 'kz'
                    ? 'Ескірген процестер мен құралдар әр қадамда кедергі келтіріп, клиенттердің кетуіне және команданың уақытын тиімсіз жұмсауына себеп болды.'
                    : 'Прежние инструменты и процессы создавали избыточное трение на каждом шаге воронки, приводя к потере лидов и перегрузке операционной команды.'}
                </p>
              </div>
            </section>

            {/* 2. Engineering & Design Solution */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 dark:text-amber-400">
                <Cpu className="w-4 h-4" />
                <span>{lang === 'en' ? 'Engineered Solution' : (lang === 'kz' ? 'Инженерлік және дизайн шешім' : 'Инженерно-продуктовое решение')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-neutral-950 dark:text-white uppercase">
                {lang === 'en' ? 'Architecture & Strategy' : (lang === 'kz' ? 'Архитектура мен жүзеге асыру' : 'Архитектура и реализация')}
              </h2>
              <div className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-4 font-normal">
                <p>{solution || summary}</p>
                <p>
                  {lang === 'en'
                    ? 'We developed an end-to-end modular digital infrastructure with custom interaction flows, low-latency microservices, and airtight responsive design verified across all device classes.'
                    : lang === 'kz'
                    ? 'Біз кастомдық өзара әрекеттесу сценарийлері, жоғары жылдамдықтағы микросервистер және барлық құрылғыларда мінсіз бейімделген модульдік жүйе құрдық.'
                    : 'Мы спроектировали модульную систему с бесшовными пользовательскими сценариями, высокой скоростью отклика интерфейса и чистой синхронизацией с бэкенд-сервисами.'}
                </p>
              </div>
            </section>

            {/* 3. Key Phases & Execution */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 dark:text-amber-400">
                <Layers className="w-4 h-4" />
                <span>{lang === 'en' ? 'Execution Roadmap' : (lang === 'kz' ? 'Іске асыру кезеңдері' : 'Этапы реализации проекта')}</span>
              </div>
              <div className="space-y-3">
                {[
                  {
                    step: '01',
                    title: lang === 'en' ? 'Research & System Architecture' : (lang === 'kz' ? 'Зерттеу & Жүйелік архитектура' : 'Аналитика и проектирование архитектуры'),
                    desc: lang === 'en' ? 'Deep audit of user journeys, API specifications, edge cases, and highload requirements.' : (lang === 'kz' ? 'Пайдаланушы сценарийлері мен API талаптарын терең талдау.' : 'Детальный аудит клиентского пути, спецификация интеграций и проектирование CJM.')
                  },
                  {
                    step: '02',
                    title: lang === 'en' ? 'Bespoke UI/UX & Design System' : (lang === 'kz' ? 'Премиум UI/UX және дизайн-жүйе' : 'Премиальный UI/UX и дизайн-система'),
                    desc: lang === 'en' ? 'Interactive prototyping, micro-animations, typography hierarchy, and accessibility.' : (lang === 'kz' ? 'Интерактивті прототиптер, микроанимациялар және қолжетімділік стандарты.' : 'Интерактивное прототипирование в Figma, библиотека токенов и микроанимации.')
                  },
                  {
                    step: '03',
                    title: lang === 'en' ? 'Production Development & Integrations' : (lang === 'kz' ? 'Бағдарламалау & Интеграция' : 'Разработка, интеграции и безопасность'),
                    desc: lang === 'en' ? 'Clean modular code, zero-latency state management, API webhooks, and automated tests.' : (lang === 'kz' ? 'Таза модульдік код, қауіпсіздік және тестілеу.' : 'Чистая компонентная архитектура, шифрование данных и нагрузочное тестирование.')
                  },
                  {
                    step: '04',
                    title: lang === 'en' ? 'Launch, SEO Indexing & Scaling' : (lang === 'kz' ? 'Релиз, SEO және масштабтау' : 'Запуск, вывод в топ поиска и масштабирование'),
                    desc: lang === 'en' ? 'Zero-downtime deployment, technical SEO markup, Core Web Vitals optimization (90+).' : (lang === 'kz' ? 'Үздіксіз деплой, Google Core Web Vitals 90+ және SEO индекстеу.' : 'Бесшовный релиз, оптимизация Core Web Vitals 90+ и передача документации команде.')
                  }
                ].map((s) => (
                  <div key={s.step} className="p-4 sm:p-5 rounded-2xl border border-black/[0.06] dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] flex items-start gap-4">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <div>
                      <div className="text-sm sm:text-base font-heading font-bold text-neutral-950 dark:text-white">
                        {s.title}
                      </div>
                      <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar Deliverables & Technology Specifications (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Deliverables Card */}
            <div className="p-6 rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/10 bg-white/70 dark:bg-white/[0.02] backdrop-blur-md space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                {lang === 'en' ? 'Delivered Scope' : (lang === 'kz' ? 'Тапсырылған нәтижелер' : 'Переданные результаты')}
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
                {(caseItem.deliverables || [
                  'Production Source Code & CI/CD',
                  'Full Figma UI Kit & Design Tokens',
                  'API & Database Architecture Documentation',
                  'Technical SEO Markup & Core Web Vitals 90+',
                  '12 Months Warranty Support & SLA'
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies Card */}
            <div className="p-6 rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/10 bg-white/70 dark:bg-white/[0.02] backdrop-blur-md space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                {lang === 'en' ? 'Technology Stack' : (lang === 'kz' ? 'Технологиялық стек' : 'Технологический стек')}
              </div>
              <div className="flex flex-wrap gap-2">
                {(caseItem.technologies || ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'WebGL', 'Figma']).map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-mono border border-black/[0.08] dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-neutral-700 dark:text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Confidentiality Seal */}
            <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200/90 text-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
              <span>
                {lang === 'en' 
                  ? 'NDA Guaranteed: Specific commercial identifiers and proprietary algorithms anonymized.'
                  : lang === 'kz'
                  ? 'NDA Кепілдігі: Нақты коммерциялық атаулар мен ішкі жүйелер құпия сақталған.'
                  : 'NDA Гарантия: Коммерческие наименования и закрытые базы данных деперсонализированы.'}
              </span>
            </div>

          </aside>

        </div>

        {/* Bottom CTA Banner */}
        <section className="my-14 sm:my-20 p-8 sm:p-12 rounded-3xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-xl space-y-2">
            <h3 className="text-2xl sm:text-3xl font-heading font-black tracking-tight uppercase">
              {lang === 'en' ? 'Need an engineered solution like this?' : (lang === 'kz' ? 'Осыған ұқсас жүйе қажет пе?' : 'Нужно реализовать аналогичное решение?')}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-600 leading-relaxed font-normal">
              {lang === 'en'
                ? 'We prepare a detailed architectural estimate and execution plan within 24 hours under NDA.'
                : lang === 'kz'
                ? 'Біз 24 сағат ішінде NDA аясында нақты техникалық смета мен іс-қимыл жоспарын дайындаймыз.'
                : 'Подготовим детальную смету, покажем еще более глубокие исходники и составим поэтапный роадмап за 24 часа.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenContact(`${title} Case Discussion`)}
            className="px-6 py-4 rounded-2xl bg-amber-400 text-neutral-950 font-heading font-bold text-sm hover:bg-amber-300 transition-all shrink-0 flex items-center justify-center gap-2 shadow-lg"
          >
            <span>{lang === 'en' ? 'Request Consultation' : (lang === 'kz' ? 'Кеңес алу' : 'Обсудить мой проект')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </section>

        {/* Next / Previous Case Navigation */}
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
          {prevCase && (
            <button
              type="button"
              onClick={() => onSelectCase(prevCase.slug || prevCase.id)}
              className="w-full sm:w-auto p-4 rounded-2xl border border-black/[0.08] dark:border-white/10 hover:border-neutral-400 transition-all text-left group"
            >
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                <span>{lang === 'en' ? 'Previous Case' : (lang === 'kz' ? 'Алдыңғы кейс' : 'Предыдущий кейс')}</span>
              </div>
              <div className="text-sm font-heading font-bold text-neutral-950 dark:text-white truncate max-w-xs">
                {getLocalized(prevCase.title)}
              </div>
            </button>
          )}

          {nextCase && (
            <button
              type="button"
              onClick={() => onSelectCase(nextCase.slug || nextCase.id)}
              className="w-full sm:w-auto p-4 rounded-2xl border border-black/[0.08] dark:border-white/10 hover:border-neutral-400 transition-all text-right group ml-auto"
            >
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1 flex items-center justify-end gap-1">
                <span>{lang === 'en' ? 'Next Case' : (lang === 'kz' ? 'Келесі кейс' : 'Следующий кейс')}</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm font-heading font-bold text-neutral-950 dark:text-white truncate max-w-xs">
                {getLocalized(nextCase.title)}
              </div>
            </button>
          )}
        </nav>

      </article>

    </div>
  );
}
