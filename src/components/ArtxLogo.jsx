import React from 'react';

export default function ArtxLogo({ className = 'w-8 h-8', showText = false, textClassName = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className.includes('shrink') ? '' : 'shrink-0'}`}>
      <svg 
        viewBox="0 0 100 100" 
        className={`${className} overflow-hidden rounded-[22%] shadow-sm hover:shadow-md transition-shadow`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="artxLogoDarkBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a0c14" />
            <stop offset="100%" stopColor="#020306" />
          </linearGradient>
          <linearGradient id="artxLogoAmber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="40%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="artxLogoWhite" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>

        {/* Deep Obsidian Base with Subtle Border */}
        <rect width="100" height="100" rx="24" fill="url(#artxLogoDarkBg)" />
        <rect x="1" y="1" width="98" height="98" rx="23" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />

        {/* Master ARTX Mark: Architectural A + Kinetic Amber X */}
        {/* Left Ascending Pillar of A */}
        <polygon points="22,82 43,18 57,18 36,82" fill="url(#artxLogoWhite)" />

        {/* Right Descending Pillar of A */}
        <polygon points="43,18 57,18 78,82 64,82 50,40" fill="url(#artxLogoWhite)" />

        {/* Kinetic Solar Amber Blade (Forms X + Crossbar) */}
        {/* Upper Right Wing of Amber Blade */}
        <polygon points="80,20 66,20 48,50 62,50" fill="url(#artxLogoAmber)" />
        {/* Lower Left Wing of Amber Blade */}
        <polygon points="40,64 26,82 12,82 26,64" fill="url(#artxLogoAmber)" />

        {/* Amber Core Floating Crossbar (The A crossbar & X center lock) */}
        <polygon points="36,52 64,52 68,60 32,60" fill="url(#artxLogoAmber)" />
      </svg>

      {showText && (
        <span className={`font-heading font-extrabold tracking-tight text-slate-950 dark:text-white ${textClassName}`}>
          ARTX
        </span>
      )}
    </div>
  );
}
