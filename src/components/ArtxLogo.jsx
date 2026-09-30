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
          <linearGradient id="artxObsidianBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d0f18" />
            <stop offset="100%" stopColor="#030408" />
          </linearGradient>
          <linearGradient id="artxAmberBeacon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="artxWhiteDelta" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        {/* Deep Obsidian Container with Refined Micro-Border */}
        <rect width="100" height="100" rx="22" fill="url(#artxObsidianBg)" />
        <rect x="0.75" y="0.75" width="98.5" height="98.5" rx="21.25" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

        {/* Swiss Architectural Delta Chevron (A) */}
        <polygon points="50,20 26,78 38,78 50,44 62,78 74,78" fill="url(#artxWhiteDelta)" />

        {/* Solar Amber Core Beacon */}
        <circle cx="50" cy="62" r="5.5" fill="url(#artxAmberBeacon)" />
      </svg>

      {showText && (
        <span className={`font-heading font-extrabold tracking-tight text-slate-950 dark:text-white ${textClassName}`}>
          ARTX
        </span>
      )}
    </div>
  );
}
