import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sun, Moon, ArrowUpRight, LayoutDashboard, Sparkles
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Navbar({ 
  lang, 
  setLang, 
  theme, 
  setTheme, 
  onOpenContact,
  onOpenAdmin 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.services, href: '#services' },
    { name: t.cases, href: '#cases' },
    { name: t.audit, href: '#audit' },
    { name: t.faq, href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        
        {/* Floating Dock Container */}
        <div 
          className={`pointer-events-auto transition-all duration-300 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-xl ${
            isScrolled 
              ? 'bg-white/90 dark:bg-[#0a0c13]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-2xl shadow-slate-900/5 dark:shadow-black/40' 
              : 'bg-white/80 dark:bg-[#0d0f18]/80 backdrop-blur-xl border border-slate-200/70 dark:border-white/10'
          }`}
        >
          
          {/* Logo with live status beacon */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-heading font-black text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-slate-950 dark:text-white leading-none">
                  ARTX
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)] animate-pulse" title="Available for projects"></span>
              </div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-400 leading-tight">
                Digital
              </span>
            </div>
          </a>

          {/* Desktop Nav Links: Curated 4 core sections */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 rounded-full text-xs font-heading font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-150"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Controls Dock */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Language Switcher */}
            <div className="flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/90 p-1 text-xs font-mono shadow-inner">
              {['kz', 'ru', 'en'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-full uppercase text-xs font-bold transition-all ${
                    lang === l 
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Theme Switcher */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-all hover:scale-105"
              title={theme === 'dark' ? t.themeLight : t.themeDark}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => onOpenContact(t.cta)}
              className="ml-1 px-4 py-2 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-heading font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>{t.cta}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

          </div>

          {/* Mobile controls */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                const nextLang = lang === 'kz' ? 'ru' : lang === 'ru' ? 'en' : 'kz';
                setLang(nextLang);
              }}
              className="px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold"
            >
              {lang.toUpperCase()}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto sm:hidden mt-3 p-5 rounded-3xl bg-white/95 dark:bg-[#0e101b]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-heading font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono font-medium">Тіл / Язык:</span>
              <div className="flex gap-1.5">
                {['kz', 'ru', 'en'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-mono transition-all ${
                      lang === l ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact(t.cta);
                }}
                className="w-full py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-heading font-bold text-center shadow-lg"
              >
                {t.cta}
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
