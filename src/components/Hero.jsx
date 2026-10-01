import React, { useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { motion, useTransform, useMotionValue, animate } from 'framer-motion';
import { TRANSLATIONS } from '../data/translations';

export default function Hero({ lang, theme = 'dark', onOpenContact }) {
  const t = TRANSLATIONS[lang].hero;
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Single unified motion value: 0 = collapsed in ARTX mark, 1 = full open screen
  const maskProgress = useMotionValue(0);
  const badgeFade = useMotionValue(1);
  const controlsRef = useRef(null);
  const isIntroPlayingRef = useRef(true);

  // Autoplay video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay fallback if browser requires user gesture
        });
      }
    }
  }, []);

  // Intro reveal on page load + scroll collapse synchronization
  useEffect(() => {
    // If the user already loaded at a scrolled position, skip intro
    if (window.scrollY > 20) {
      isIntroPlayingRef.current = false;
      const progress = Math.max(0, Math.min(1, 1 - window.scrollY / 200));
      maskProgress.set(progress);
      const fade = window.scrollY < 280 ? 1 : Math.max(0, 1 - (window.scrollY - 280) / 90);
      badgeFade.set(fade);
    } else {
      maskProgress.set(0);
      badgeFade.set(1);
      controlsRef.current = animate(maskProgress, 1, {
        duration: 1.9,
        delay: 0.25,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          isIntroPlayingRef.current = false;
          controlsRef.current = null;
        }
      });
    }

    const handleScroll = () => {
      // If user scrolls during intro, cancel intro immediately and tie to scroll
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
        isIntroPlayingRef.current = false;
      }
      const scrollY = window.scrollY;
      const progress = Math.max(0, Math.min(1, 1 - scrollY / 200));
      maskProgress.set(progress);

      // Badge stays pinned at center until ticker approaches it, then dissolves (280px -> 370px)
      const fade = scrollY < 280 ? 1 : Math.max(0, 1 - (scrollY - 280) / 90);
      badgeFade.set(fade);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [maskProgress, badgeFade]);

  // Unified visual transforms derived directly from maskProgress (0 -> 1)
  // 1. Aperture scale: from compact badge (1.5x = ~135px) to fullscreen aperture (18x)
  const apertureScale = useTransform(maskProgress, [0, 1], [1.5, 18]);

  // 2. Circular iris scale: 0 at collapsed badge, blooms outward from center as maskProgress opens
  const irisScale = useTransform(maskProgress, [0, 0.15, 0.8, 1], [0, 0, 1, 1.4]);

  // 3. Central amber diamond spark: ignites in the center when collapsed, dissolves when open
  const sparkOpacity = useTransform(maskProgress, [0, 0.15, 0.28], [1, 0.8, 0]);

  // 4. Badge squircle border: illuminates around the collapsed video mark
  const borderOpacity = useTransform(maskProgress, [0, 0.15, 0.28], [1, 0.7, 0]);

  // 5. Ambient amber glow behind collapsed badge
  const badgeGlowOpacity = useTransform(maskProgress, [0, 0.2, 0.4], [1, 0.6, 0]);

  // 6. Inverted overlay opacity: fully opaque when collapsed, transparent when open
  const overlayOpacity = useTransform(maskProgress, [0, 0.75, 0.95, 1], [1, 1, 0.15, 0]);

  // 7. Hero content: fades out and drifts upward when scrolling down to collapse
  const contentOpacity = useTransform(maskProgress, [0.4, 0.85, 1], [0, 0.7, 1]);
  const contentY = useTransform(maskProgress, [0, 1], [-40, 0]);

  // 8. Interactive pointer events: only enable clicking badge when collapsed
  const badgePointerEvents = useTransform(maskProgress, (p) => (p < 0.25 ? 'auto' : 'none'));

  const isDark = theme !== 'light';
  const overlayBg = isDark ? '#080808' : '#fcfcfd';

  return (
    <section 
      ref={containerRef}
      style={{ minHeight: 'calc(100vh + 380px)' }}
      className="relative w-full max-w-full"
    >
      {/* Pinned 100vh Screen Container */}
      <motion.div 
        style={{ opacity: badgeFade }}
        className="sticky top-0 h-screen w-full max-w-full flex flex-col justify-between overflow-hidden ambient-glow-hero pt-24 sm:pt-28 pb-4 sm:pb-6 lg:pb-8"
      >
        
        {/* Top Ambient Gradient Strip under Menu */}
        <div className="absolute top-0 left-0 right-0 w-full h-32 sm:h-40 bg-gradient-to-b from-white/90 via-white/45 to-transparent dark:from-black/90 dark:via-black/50 dark:to-transparent pointer-events-none z-10" />

        {/* Background Video: Playing behind the mask */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <video
            ref={videoRef}
            key="hero-video-v5"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/videos/hero-poster.jpg"
            className="w-full h-full object-cover scale-105 opacity-95 dark:opacity-90 [mask-image:radial-gradient(ellipse_95%_90%_at_50%_50%,black_65%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_95%_90%_at_50%_50%,black_65%,transparent_100%)]"
          >
            <source src="/videos/hero-bg.webm" type="video/webm" />
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>

          {/* Center Contrast Scrim */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/30 pointer-events-none" />

          {/* Global Edge Fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#fcfcfd] dark:from-black/25 dark:via-transparent dark:to-[#080808] pointer-events-none" />
        </div>

        {/* Ambient Amber Glow behind collapsed badge */}
        <motion.div 
          style={{ opacity: useTransform([badgeGlowOpacity, badgeFade], ([glow, fade]) => glow * fade) }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none z-5 bg-amber-400/25 dark:bg-amber-400/20 blur-3xl"
        />

        {/* Inverted Logo Mask Stage: Reveals video through ARTX mark on load, collapses into mark on scroll */}
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden">
          <svg 
            className="w-full h-full min-w-[100vmax] min-h-[100vmax]"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask id="artxHeroInvertedMask">
                {/* Solid white base: everything is visible (dark overlay covers screen) */}
                <rect x="0" y="0" width="1000" height="1000" fill="white" />

                {/* Dynamic aperture centered at (500, 500): cuts hole in overlay */}
                <g transform="translate(500, 500)">
                  <motion.g style={{ scale: apertureScale }}>
                    <g transform="translate(-50, -50)">
                      {/* Black ARTX architectural A contour */}
                      <path 
                        d="M 44,13 L 56,13 L 89,87 L 66,87 C 54,87 50.8,77 50.5,69 C 52,60 58,54 71,52 C 58,50 52,43 50,30 C 48,43 42,50 29,52 C 42,54 48,60 49.5,69 C 49.2,77 46,87 34,87 L 11,87 Z" 
                        fill="black" 
                      />

                      {/* Expanding circular iris from the amber heart of the A */}
                      <motion.circle 
                        cx="50" 
                        cy="50" 
                        r="80" 
                        fill="black" 
                        style={{ scale: irisScale, transformOrigin: '50px 50px' }} 
                      />
                    </g>
                  </motion.g>
                </g>
              </mask>

              <linearGradient id="heroAmberSpark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Dark/Light Overlay with Mask */}
            <motion.rect 
              x="0" 
              y="0" 
              width="1000" 
              height="1000" 
              fill={overlayBg} 
              mask="url(#artxHeroInvertedMask)" 
              style={{ opacity: overlayOpacity }}
            />

            {/* Foreground Badge Details (Central Amber Spark & Squircle Border) */}
            <motion.g style={{ opacity: badgeFade }}>
              <g transform="translate(500, 500)">
                <motion.g style={{ scale: apertureScale }}>
                  <g transform="translate(-50, -50)">
                    {/* Central Amber Diamond Spark */}
                    <motion.path 
                      style={{ opacity: sparkOpacity }}
                      d="M 50,44.5 Q 50,51 56,51 Q 50,51 50,57.5 Q 50,51 44,51 Q 50,51 50,44.5 Z" 
                      fill="url(#heroAmberSpark)" 
                    />

                    {/* Squircle Border around the badge */}
                    <motion.rect 
                      style={{ opacity: borderOpacity }}
                      x="0.75" 
                      y="0.75" 
                      width="98.5" 
                      height="98.5" 
                      rx="21.25" 
                      fill="none" 
                      stroke={isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.16)'} 
                      strokeWidth="1.5" 
                    />
                  </g>
                </motion.g>
              </g>
            </motion.g>
          </svg>
        </div>

        {/* Interactive Click Area on Collapsed Mark (Scroll to top) */}
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ 
            opacity: useTransform([borderOpacity, badgeFade], ([b, f]) => b * f), 
            pointerEvents: badgePointerEvents 
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-3xl z-30 cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95"
          title="ARTX · Наверх"
          aria-label="Наверх к первому экрану"
        />

        {/* Main Content Area: Headline, Subtitle, Actions, Calibrated Metric Plaques */}
        <motion.div 
          style={{ opacity: contentOpacity, y: contentY }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex-1 flex flex-col justify-between w-full pointer-events-auto"
        >
          {/* Monumental Ultra-Short Headline with Blinds Reveal */}
          <div className="text-center max-w-5xl mx-auto my-auto pt-6 sm:pt-10">
            <div className="overflow-hidden inline-block py-1">
              <motion.h1 
                initial={{ y: '100%', opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight text-neutral-950 dark:text-white leading-[1.05] sm:leading-[1.0] uppercase drop-shadow-sm inline-block"
              >
                <span>{t.titleStart}</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900 dark:from-white dark:via-neutral-400 dark:to-white">
                  {t.titleHighlight}
                </span>
              </motion.h1>
            </div>

            {/* Crisp, High-Contrast Subtitle over Video with Blinds Reveal */}
            <div className="overflow-hidden block py-1 mt-4 sm:mt-6">
              <motion.p 
                initial={{ y: '100%', opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-xl md:text-2xl text-neutral-700 dark:text-neutral-100 font-medium max-w-3xl mx-auto leading-relaxed dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
              >
                {t.desc}
              </motion.p>
            </div>

            {/* 2 Clean Magnetic Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5"
            >
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#calculator"
                className="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-heading font-bold text-xs sm:text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-2xl"
              >
                <span>{t.ctaCalc}</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#cases"
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white font-heading font-semibold text-xs sm:text-base transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{lang === 'en' ? 'Selected Cases' : (lang === 'kz' ? 'Таңдаулы кейстер' : 'Смотреть кейсы')}</span>
                <ArrowDown className="w-4 h-4" />
              </motion.a>
            </motion.div>

          </div>

          {/* Key Performance Metrics: Calibrated Uniform Plaques */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.85 }}
            className="relative z-20 mt-6 sm:mt-10 mb-1 sm:mb-2 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6"
          >
            {[
              { value: t.stats.projects, label: t.stats.projectsDesc, accent: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' },
              { value: t.stats.conversion, label: t.stats.conversionDesc, accent: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' },
              { value: t.stats.capital, label: t.stats.capitalDesc, accent: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' },
              { value: t.stats.sla, label: t.stats.slaDesc, accent: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="h-[96px] sm:h-[104px] p-3 sm:p-4 rounded-2xl backdrop-blur-2xl bg-white/60 dark:bg-[#0c0c0e]/85 border border-black/[0.06] dark:border-white/10 shadow-lg dark:shadow-2xl flex flex-col justify-between group hover:border-amber-400/50 hover:bg-white/75 dark:hover:bg-[#0c0c0e] transition-all duration-300 min-w-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${stat.accent}`}></span>
                    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                      0{idx + 1}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                    METRIC
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl lg:text-[26px] font-heading font-black tracking-tight text-neutral-950 dark:text-white leading-none mb-1 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs font-mono text-neutral-600 dark:text-neutral-300 font-medium leading-snug line-clamp-1 truncate">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </motion.div>
    </section>
  );
}
