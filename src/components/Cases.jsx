import React, { useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TRANSLATIONS } from '../data/translations';
import CardShaderHover from './CardShaderHover';

const CASE_PRESETS = [
  // 1. Casa Italia (ID 1): Luxury Italian furniture — Topographic elevation contour lines
  {
    variant: 'isothermal',
    anchor: { x: 0.80, y: 0.25 }, // Top-Right radiant warmth
    seed: 0.42,
    colorMode: 'thermal',
    grad: 'from-[#0b0e19] via-[#1e1308]/90 to-[#07090f]',
    hoverBorder: 'group-hover:border-amber-400/50 dark:group-hover:border-amber-400/60'
  },
  // 2. Ottica Milano (ID 2): Optical lenses — Prismatic chromatic dispersion
  {
    variant: 'prismatic',
    anchor: { x: 0.20, y: 0.78 }, // Bottom-Left optical focal point
    seed: 1.85,
    colorMode: 'cyber',
    grad: 'from-[#080d19] via-[#091a2e]/90 to-[#060810]',
    hoverBorder: 'group-hover:border-cyan-400/50 dark:group-hover:border-cyan-400/60'
  },
  // 3. Astraea (ID 3): European astrology — Swirling coronal plasma vortex
  {
    variant: 'plasma',
    anchor: { x: 0.75, y: 0.38 }, // Center-Right celestial vortex
    seed: 3.14,
    colorMode: 'ultraviolet',
    grad: 'from-[#0c0919] via-[#1d0e2e]/90 to-[#07050e]',
    hoverBorder: 'group-hover:border-purple-400/50 dark:group-hover:border-purple-400/60'
  },
  // 4. Bazarum (ID 4): Azerbaijan marketplace — Radar telemetry & sonar pulse
  {
    variant: 'radar',
    anchor: { x: 0.22, y: 0.28 }, // Top-Left logistics radar beacon
    seed: 4.62,
    colorMode: 'cyber',
    grad: 'from-[#080d1a] via-[#081a29]/90 to-[#060810]',
    hoverBorder: 'group-hover:border-cyan-400/50 dark:group-hover:border-cyan-400/60'
  },
  // 5. Français Pro (ID 5): Executive EdTech — Fluid laminar knowledge convection
  {
    variant: 'convective',
    anchor: { x: 0.50, y: 0.82 }, // Bottom-Center ascending thermal plume
    seed: 5.91,
    colorMode: 'thermal',
    grad: 'from-[#0b0e19] via-[#1e1409]/90 to-[#07090f]',
    hoverBorder: 'group-hover:border-amber-400/50 dark:group-hover:border-amber-400/60'
  },
  // 6. FinCore DS (ID 6): Tier-1 Bank design system — FLIR industrial thermography
  {
    variant: 'infrared',
    anchor: { x: 0.20, y: 0.50 }, // Center-Left structural node
    seed: 7.28,
    colorMode: 'cyber',
    grad: 'from-[#080e1c] via-[#08182b]/90 to-[#060810]',
    hoverBorder: 'group-hover:border-cyan-400/50 dark:group-hover:border-cyan-400/60'
  },
  // 7. Pure Esthétique (ID 7): Luxury beauty flagship — Quantum cellular dispersion
  {
    variant: 'quantum',
    anchor: { x: 0.80, y: 0.75 }, // Bottom-Right dermal radiance
    seed: 8.75,
    colorMode: 'magma',
    grad: 'from-[#100b14] via-[#241018]/90 to-[#08060b]',
    hoverBorder: 'group-hover:border-amber-400/50 dark:group-hover:border-amber-400/60'
  }
];

function CaseCard({ item, idx, lang, onOpenContact, t, getLocalized }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);

  const title = getLocalized(item.title);
  const client = getLocalized(item.client);
  const badge = getLocalized(item.badge);
  const heroMetric = item.metrics && item.metrics[0];

  const preset = CASE_PRESETS[idx % CASE_PRESETS.length];
  const variant = item.shaderVariant || preset.variant;
  const anchor = item.anchor || preset.anchor;
  const seed = item.seed !== undefined ? item.seed : preset.seed;
  const colorMode = item.colorMode || preset.colorMode;
  const activeGrad = preset.grad;
  const hoverBorderClass = preset.hoverBorder;

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
      className="group w-full"
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
        style={{ 
          borderRadius: '24px',
          transform: 'translateZ(0)',
          isolation: 'isolate'
        }}
        className={`w-full aspect-[16/10] rounded-[24px] bg-gradient-to-br ${activeGrad} p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl dark:shadow-2xl cursor-pointer`}
      >
        {/* Dynamic WebGL Thermal Heatmap + Analog Film Grain Noise on Hover */}
        <CardShaderHover 
          colorMode={colorMode}
          variant={variant}
          anchor={anchor}
          seed={seed}
          isHovered={isHovered}
          mousePos={mousePos}
          borderRadius={24}
        />

        {/* Contrast Scrim Protection Overlay: guarantees strong AAA contrast for all text */}
        <div 
          style={{ borderRadius: '24px' }}
          className="absolute inset-0 rounded-[24px] bg-gradient-to-t from-slate-950/85 via-black/35 to-slate-950/60 pointer-events-none z-[2]" 
        />

        {/* Subtle Grid Pattern Accent */}
        <div 
          style={{ borderRadius: '24px' }}
          className="absolute inset-0 rounded-[24px] bg-grid-subtle opacity-15 pointer-events-none z-[3]" 
        />

        {/* Pixel-Perfect Perimeter Architectural Frame Overlay (matching 24px radius, crisp on both light and dark backgrounds) */}
        <div 
          style={{ borderRadius: '24px' }}
          className={`absolute inset-0 rounded-[24px] pointer-events-none z-[15] border border-black/[0.08] dark:border-white/15 ${hoverBorderClass} transition-colors duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]`} 
        />

        {/* Top Bar with category tag & status */}
        <div className="flex items-center justify-between z-10 gap-3 relative">
          <span className="font-mono text-xs font-semibold text-white uppercase tracking-widest truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            {client} · 2026
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-white text-slate-950 shadow-xl shrink-0">
            {badge}
          </span>
        </div>

        {/* Monumental Hero Metric */}
        <div className="my-auto z-10 py-4 sm:py-6 relative min-w-0">
          <div className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight tabular-nums truncate drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
            {heroMetric ? heroMetric.value : '+340%'}
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-white/95 uppercase tracking-wider mt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] line-clamp-2">
            {heroMetric ? getLocalized(heroMetric.label) : (lang === 'en' ? 'Organic Revenue Surge' : (lang === 'kz' ? 'Органикалық өсім' : 'Рост выручки'))}
          </div>
        </div>

        {/* Bottom client mark */}
        <div className="flex items-center justify-between z-10 pt-4 border-t border-white/15 gap-4 relative">
          <span className="text-sm sm:text-base font-heading font-bold text-white tracking-wide leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] line-clamp-2">
            {title}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 transition-all shrink-0 shadow-lg">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Cases({ lang, casesList = [], onOpenContact }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const t = TRANSLATIONS[lang].cases;

  const tags = ['All', 'Websites', 'Branding', 'SaaS', 'SEO Optimization', 'Full Packaging'];
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
    <section id="cases" className="py-20 sm:py-28 lg:py-32 relative w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 lg:mb-20 gap-6">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
              {lang === 'en' ? 'Proof of Work' : (lang === 'kz' ? 'Нәтижелер' : 'Кейсы и цифры')}
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.98]">
              {lang === 'en' ? 'Selected Cases' : (lang === 'kz' ? 'Таңдаулы жобалар' : 'Избранные кейсы')}
            </h2>
          </div>

          {/* Minimalist Filter Pills */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-mono transition-all ${
                  selectedTag === tag
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'border border-black/[0.08] dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {tag === 'All' ? t.filterAll : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Grand 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
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
        <div className="mt-12 sm:mt-16 p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
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
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-heading font-bold text-xs sm:text-sm hover:opacity-90 transition-all shrink-0 shadow-lg"
          >
            {t.requestNicheBtn}
          </motion.button>
        </div>

      </div>
    </section>
  );
}
