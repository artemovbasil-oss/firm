import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sun, Moon, ArrowUpRight 
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import ArtxLogo from './ArtxLogo';

export default function Navbar({ 
  lang, 
  setLang, 
  theme, 
  setTheme, 
  onOpenContact,
  isTickerSticky = false 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.services, href: '#services' },
    { name: t.cases, href: '#cases' },
    { name: t.audit, href: '#audit' },
    { name: t.faq, href: '#faq' },
  ];

  return (
    <header className={`fixed left-0 right-0 z-50 pointer-events-none transition-all duration-300 ${
      isTickerSticky ? 'top-10 sm:top-11' : 'top-0'
    }`}>
      <div className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 transition-all duration-300 ${
        isTickerSticky ? 'pt-1 sm:pt-2' : 'pt-3 sm:pt-4'
      }`}>
        
        {/* Floating Dock Container: completely transparent without backdrop at start, frosted black/white on scroll */}
        <div 
          className={`pointer-events-auto transition-all duration-300 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between ${
            isScrolled 
              ? 'bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/60' 
              : 'bg-transparent border border-transparent shadow-none backdrop-blur-none'
          }`}
        >
          
          {/* Logo with live status beacon */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <ArtxLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-neutral-950 dark:text-white leading-none">
                  ARTX
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)] animate-pulse" title="Available for projects"></span>
              </div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-400 dark:text-neutral-400 leading-tight">
                Digital
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-150"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Controls Dock */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Language Switcher */}
            <div className={`flex items-center rounded-full border transition-colors ${
              isScrolled 
                ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-100/90 dark:bg-neutral-900/90' 
                : 'border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.04] backdrop-blur-md'
            } p-1 text-xs font-mono shadow-inner`}>
              {['kz', 'ru', 'en'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-full uppercase text-xs font-bold transition-all ${
                    lang === l 
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm' 
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Theme Switcher */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-8 h-8 rounded-full border transition-colors ${
                isScrolled 
                  ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80' 
                  : 'border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.04] backdrop-blur-md'
              } text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white flex items-center justify-center hover:scale-105`}
              title={theme === 'dark' ? t.themeLight : t.themeDark}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-neutral-700" />
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => onOpenContact(t.cta)}
              className="ml-1 px-4 py-2 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-heading font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>{t.cta}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

          </div>

          {/* Mobile controls */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-neutral-700 dark:text-neutral-300 bg-white/40 dark:bg-white/[0.04] backdrop-blur-sm"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                const nextLang = lang === 'kz' ? 'ru' : lang === 'ru' ? 'en' : 'kz';
                setLang(nextLang);
              }}
              className="px-2.5 py-1 rounded-full border border-black/10 dark:border-white/10 text-[11px] font-mono font-bold bg-white/40 dark:bg-white/[0.04] backdrop-blur-sm"
            >
              {lang.toUpperCase()}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-neutral-700 dark:text-neutral-300 bg-white/40 dark:bg-white/[0.04] backdrop-blur-sm"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile menu dropdown: pure neutral monochrome */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto sm:hidden mt-3 p-5 rounded-3xl bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-heading font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-mono font-medium">Тіл / Язык:</span>
              <div className="flex gap-1.5">
                {['kz', 'ru', 'en'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-mono transition-all ${
                      lang === l ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
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
                className="w-full py-3 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-heading font-bold text-center shadow-lg"
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
