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
            <stop offset="0%" stopColor="#141414" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>
          <linearGradient id="artxAmberSpark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="artxWhitePillar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>

        {/* Deep Obsidian Container with Refined Micro-Border */}
        <rect width="100" height="100" rx="22" fill="url(#artxObsidianBg)" />
        <rect x="0.75" y="0.75" width="98.5" height="98.5" rx="21.25" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

        {/* Master ARTX Architectural Mark: Letter A with Stellar Astroid Cutout */}
        <path 
          d="M 44,13 L 56,13 L 89,87 L 66,87 C 54,87 50.8,77 50.5,69 C 52,60 58,54 71,52 C 58,50 52,43 50,30 C 48,43 42,50 29,52 C 42,54 48,60 49.5,69 C 49.2,77 46,87 34,87 L 11,87 Z" 
          fill="url(#artxWhitePillar)" 
        />

        {/* Core Solar Amber Diamond Spark */}
        <path 
          d="M 50,44.5 Q 50,51 56,51 Q 50,51 50,57.5 Q 50,51 44,51 Q 50,51 50,44.5 Z" 
          fill="url(#artxAmberSpark)" 
        />
      </svg>

      {showText && (
        <span className={`font-heading font-extrabold tracking-tight text-neutral-950 dark:text-white ${textClassName}`}>
          ARTX
        </span>
      )}
    </div>
  );
}
