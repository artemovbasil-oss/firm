import React, { useState, useEffect, useRef } from 'react';

export default function MarqueeTicker({ lang = 'ru', isSticky = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);
  const xPos = useRef(0);
  const currentSpeed = useRef(1);
  const targetSpeed = useRef(1);
  const singleWidth = useRef(0);

  const marqueeItems = lang === 'en' ? [
    'HIGH-LOAD WEB PLATFORMS',
    'BESPOKE BRANDING & PACKAGING',
    'CUSTOM SAAS & CRM ENGINES',
    'VENTURE PITCH DECKS',
    'TECHNICAL SEO DOMINANCE',
    'CONVERSION-FOCUSED ARCHITECTURE',
    '100% NDA & CODE OWNERSHIP',
    'TWO-WEEK RAPID SPRINTS'
  ] : lang === 'kz' ? [
    'ЖОҒАРЫ ЖҮКТЕМЕЛІ ВЕБ-ПЛАТФОРМАЛАР',
    'ПРЕМИУМ БРЕНДИНГ ЖӘНЕ ҚАПТАМА',
    'ЖЕКЕ SAAS ЖӘНЕ CRM ЖҮЙЕЛЕРІ',
    'ИНВЕСТОРЛЫҚ PITCH DECK-ТЕР',
    'SEO ЖӘНЕ ТЕХНИКАЛЫҚ АУДИТ',
    'КОНВЕРСИЯСЫ ЖОҒАРЫ САЙТТАР',
    '100% NDA ЖӘНЕ МЕНШІК ҚҰҚЫҒЫ',
    'ЕКІ АПТАЛЫҚ ЖЫЛДАМ СПРИНТТЕР'
  ] : [
    'ВЫСОКОНАГРУЖЕННЫЕ ВЕБ-ПЛАТФОРМЫ',
    'ПРЕМИАЛЬНЫЙ БРЕНДИНГ И УПАКОВКА',
    'КАСТОМНЫЙ СОФТ, SAAS & CRM',
    'ИНВЕСТИЦИОННЫЕ PITCH DECKS',
    'ТЕХНИЧЕСКИЙ АУДИТ И SEO',
    'ВЫСОКАЯ КОНВЕРСИЯ И ПЕРФОРМАНС',
    '100% NDA И ПЕРЕДАЧА ИСХОДНИКОВ',
    'ДВУХНЕДЕЛЬНЫЕ БЫСТРЫЕ СПРИНТЫ'
  ];

  // Update target speed on hover (0.2x speed = smooth deceleration, no rewind)
  useEffect(() => {
    targetSpeed.current = isHovered ? 0.22 : 1;
  }, [isHovered]);

  // Frame animation loop with requestAnimationFrame
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const updateWidth = () => {
      if (trackRef.current) {
        // We render 3 identical sets, so 1 set is 1/3 of total scrollWidth
        singleWidth.current = trackRef.current.scrollWidth / 3;
      }
    };

    updateWidth();
    // Re-check width after web fonts / layout settle
    const timer = setTimeout(updateWidth, 300);
    window.addEventListener('resize', updateWidth);

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Exponential smoothing (lerp) for silky deceleration & acceleration
      currentSpeed.current += (targetSpeed.current - currentSpeed.current) * 0.08;

      // Base movement ~42 pixels per second
      const basePixelsPerSecond = 44;
      xPos.current -= basePixelsPerSecond * currentSpeed.current * dt;

      // Continuous infinite loop without any visual jump
      if (singleWidth.current > 0 && Math.abs(xPos.current) >= singleWidth.current) {
        xPos.current += singleWidth.current;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${xPos.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full overflow-hidden select-none transition-all duration-300 ${
        isSticky
          ? 'fixed top-0 left-0 right-0 z-40 py-2 sm:py-2.5 bg-white/95 dark:bg-[#07080e]/95 backdrop-blur-xl border-b border-black/[0.08] dark:border-white/10 shadow-sm'
          : 'relative z-20 py-3.5 sm:py-4 bg-slate-100/90 dark:bg-[#07080e]/90 backdrop-blur-md border-y border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-xl'
      }`}
    >
      {/* Edge gradient masks for smooth fade in/out */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-white dark:from-[#07080e] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-white dark:from-[#07080e] to-transparent z-10" />

      {/* Marquee Track Container */}
      <div className="flex items-center">
        <div
          ref={trackRef}
          style={{ willChange: 'transform' }}
          className={`flex items-center whitespace-nowrap font-mono font-semibold uppercase tracking-wider ${
            isSticky
              ? 'text-[11px] sm:text-xs text-slate-800 dark:text-slate-200'
              : 'text-xs sm:text-sm text-slate-900 dark:text-white'
          }`}
        >
          {/* Render 3 identical sets for seamless continuous offset wrapping */}
          {[0, 1, 2].map((setIndex) => (
            <div key={setIndex} className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8">
              {marqueeItems.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-6 sm:gap-8 group/item">
                  <span className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-default">
                    {item}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)] shrink-0" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
