import React, { useState, useRef } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TRANSLATIONS } from '../data/translations';
import CardShaderHover from './CardShaderHover';

function CaseCard({ item, idx, lang, onOpenContact, t, getLocalized }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);

  const title = getLocalized(item.title);
  const client = getLocalized(item.client);
  const summary = getLocalized(item.summary);
  const badge = getLocalized(item.badge);
  const heroMetric = item.metrics && item.metrics[0];

  const colorModes = ['thermal', 'cyber', 'ultraviolet', 'magma'];
  const colorMode = item.colorMode || colorModes[idx % colorModes.length];

  const gradients = [
    'from-slate-900 via-indigo-950/70 to-slate-950',
    'from-slate-900 via-emerald-950/70 to-slate-950',
    'from-slate-900 via-purple-950/70 to-slate-950',
    'from-slate-900 via-amber-950/70 to-slate-950'
  ];
  const activeGrad = gradients[idx % gradients.length];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      setMousePos({ x, y });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="group flex flex-col justify-between"
    >
      {/* Visual Showcase Card with Motion Hover & WebGL Thermal Heatmap */}
      <motion.div 
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={() => onOpenContact(`${title} Case Discussion`)}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{ borderRadius: '24px' }}
        className={`w-full aspect-[16/10] rounded-3xl bg-gradient-to-br ${activeGrad} p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl border border-black/[0.06] dark:border-white/10 cursor-pointer isolate transform-gpu`}
      >
        {/* Dynamic WebGL Thermal Heatmap + Analog Film Grain Noise on Hover */}
        <CardShaderHover 
          colorMode={colorMode}
          isHovered={isHovered}
          mousePos={mousePos}
          borderRadius={24}
        />

        {/* Top Bar with category tag & status */}
        <div className="flex items-center justify-between z-10 gap-3">
          <span className="font-mono text-xs text-white/70 uppercase tracking-widest truncate">
            {client} · 2026
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/95 text-slate-950 shadow-lg shrink-0">
            {badge}
          </span>
        </div>

        {/* Monumental Hero Metric */}
        <div className="my-auto z-10 py-6">
          <div className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black text-white tracking-tighter">
            {heroMetric ? heroMetric.value : '+340%'}
          </div>
          <div className="text-xs sm:text-sm font-mono text-white/70 uppercase tracking-wider mt-2">
            {heroMetric ? getLocalized(heroMetric.label) : (lang === 'en' ? 'Organic Revenue Surge' : (lang === 'kz' ? 'Органикалық өсім' : 'Рост выручки'))}
          </div>
        </div>

        {/* Bottom client mark */}
        <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10 gap-4">
          <span className="text-sm font-heading font-bold text-white tracking-wide truncate">
            {title}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 transition-colors shrink-0">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Subtle Grid Pattern Accent */}
        <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none z-[1]"></div>
      </motion.div>

      {/* Minimalist Bottom Info with Proper Margins */}
      <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-relaxed font-normal">
          {summary}
        </p>

        <button
          onClick={() => onOpenContact(`${title} Case Discussion`)}
          className="text-xs sm:text-sm font-heading font-bold text-slate-950 dark:text-white hover:underline flex items-center gap-1.5 shrink-0"
        >
          <span>{t.similarBtn}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </motion.div>
  );
}

export default function Cases({ lang, casesList = [], onOpenContact }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const t = TRANSLATIONS[lang].cases;

  const tags = ['All', 'SaaS', 'Branding', 'Landing Page', 'SEO Optimization', 'Full Packaging'];
  const publishedCases = casesList.filter(c => c.published !== false);

  const filteredCases = selectedTag === 'All' 
    ? publishedCases 
    : publishedCases.filter(c => c.tags?.includes(selectedTag));

  const getLocalized = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.ru || '';
  };

  return (
    <section id="cases" className="py-32 sm:py-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 gap-6">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
              {lang === 'en' ? 'Proof of Work' : (lang === 'kz' ? 'Нәтижелер' : 'Кейсы и цифры')}
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.95]">
              {lang === 'en' ? 'Selected Cases.' : (lang === 'kz' ? 'Таңдаулы жобалар.' : 'Избранные кейсы.')}
            </h2>
          </div>

          {/* Minimalist Filter Pills */}
          <div className="flex flex-wrap gap-2.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
                  selectedTag === tag
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold shadow-sm'
                    : 'border border-black/[0.08] dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {tag === 'All' ? t.filterAll : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Grand 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          {filteredCases.map((item, idx) => (
            <CaseCard
              key={item.id}
              item={item}
              idx={idx}
              lang={lang}
              onOpenContact={onOpenContact}
              t={t}
              getLocalized={getLocalized}
            />
          ))}
        </div>

        {/* Confidential NDA Advisory Strip with Healthy Breathing Room */}
        <div className="mt-20 sm:mt-28 p-8 sm:p-12 rounded-3xl border border-black/[0.08] dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          <div className="max-w-xl">
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-950 dark:text-white tracking-tight">
              {t.requestNicheTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
              {t.requestNicheDesc}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenContact('Confidential Portfolio Request')}
            className="px-8 py-4 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-heading font-bold text-xs sm:text-sm hover:opacity-90 transition-all shrink-0 shadow-lg"
          >
            {t.requestNicheBtn}
          </motion.button>
        </div>

      </div>
    </section>
  );
}
