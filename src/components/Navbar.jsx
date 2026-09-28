import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sun, Moon, Globe, Shield, 
  ArrowUpRight, Send, LayoutDashboard, SlidersHorizontal 
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Navbar({ 
  lang, 
  setLang, 
  theme, 
  setTheme, 
  currency, 
  setCurrency, 
  onOpenContact,
  onOpenAdmin 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.services, href: '#services' },
    { name: t.calculator, href: '#calculator' },
    { name: t.cases, href: '#cases' },
    { name: t.audit, href: '#audit' },
    { name: t.process, href: '#process' },
    { name: t.stack, href: '#stack' },
    { name: t.faq, href: '#faq' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/85 dark:bg-[#090a0f]/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm py-3' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-heading font-extrabold text-sm tracking-widest transition-transform group-hover:scale-105">
              F
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                FIRM
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">
                Digital Agency
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Controls: Language + Theme + Currency + CRM + CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-0.5 text-xs font-mono">
              <button
                onClick={() => setLang('ru')}
                className={`px-2 py-1 rounded transition-colors ${
                  lang === 'ru' 
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-bold shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  lang === 'en' 
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-bold shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              title={theme === 'dark' ? t.themeLight : t.themeDark}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Currency selector */}
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-0.5 text-xs font-mono">
              {['rub', 'usd', 'kzt'].map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`px-2 py-1 rounded transition-colors uppercase ${
                    currency === cur
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-bold shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cur === 'rub' ? '₽' : cur === 'usd' ? '$' : '₸'}
                </button>
              ))}
            </div>

            {/* CRM Admin Button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              title={t.admin}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => onOpenContact(t.cta)}
              className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>{t.cta}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
            >
              {lang.toUpperCase()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white py-1"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Валюта:</span>
              <div className="flex gap-1">
                {['rub', 'usd', 'kzt'].map(cur => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-2 py-1 rounded text-xs uppercase font-mono ${
                      currency === cur ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {cur === 'rub' ? '₽' : cur === 'usd' ? '$' : '₸'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{t.admin}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact(t.cta);
                }}
                className="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold text-center"
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
