import React, { useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { TRANSLATIONS } from '../data/translations';

export default function Hero({ lang, onOpenContact }) {
  const t = TRANSLATIONS[lang].hero;
  const videoRef = useRef(null);

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

  return (
    <section className="relative min-h-[100dvh] pt-24 sm:pt-28 pb-4 sm:pb-6 lg:pb-8 flex flex-col justify-between overflow-hidden ambient-glow-hero w-full max-w-full">
      
      {/* Background Video: Crisp, vivid, clearly visible without heavy scrims */}
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

        {/* Center Contrast Scrim: Delicate and restrained - ensures text contrast without washing out the video */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/30 pointer-events-none"></div>

        {/* Global Edge Fade: Smoothly dissolves video into background only at outer boundaries */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#fcfcfd] dark:from-black/25 dark:via-transparent dark:to-[#080808] pointer-events-none"></div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex flex-col justify-between w-full">
        
        {/* Monumental Ultra-Short Headline with Blinds Reveal */}
        <div className="text-center max-w-5xl mx-auto my-auto pt-6 sm:pt-10">
          <div className="overflow-hidden inline-block py-1">
            <motion.h1 
              initial={{ y: '100%', opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
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
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-xl md:text-2xl text-neutral-700 dark:text-neutral-100 font-medium max-w-3xl mx-auto leading-relaxed dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
            >
              {t.desc}
            </motion.p>
          </div>

          {/* 2 Clean Magnetic Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
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

        {/* Key Performance Metrics: At the bottom of the first screen, sitting comfortably above the bottom edge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28 }}
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
              className="p-3 sm:p-4 lg:p-5 rounded-2xl sm:rounded-3xl backdrop-blur-2xl bg-white/50 dark:bg-[#0c0c0e]/85 border border-black/[0.06] dark:border-white/10 shadow-lg dark:shadow-2xl flex flex-col justify-between group hover:border-amber-400/50 hover:bg-white/70 dark:hover:bg-[#0c0c0e] transition-all duration-300 min-w-0"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-2 h-2 rounded-full ${stat.accent}`}></span>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  METRIC
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold tracking-tight text-neutral-950 dark:text-white leading-none mb-1 tabular-nums truncate">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-neutral-600 dark:text-neutral-300 uppercase tracking-wider font-medium line-clamp-2">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

      </div>

    </section>
  );
}
