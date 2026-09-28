import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sparkles, Send, Calculator as CalcIcon, 
  ArrowUpRight, ShieldCheck, PhoneCall 
} from 'lucide-react';

export default function Navbar({ onOpenContact, onOpenCalculator, currency, setCurrency }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Услуги', href: '#services' },
    { name: 'Калькулятор', href: '#calculator' },
    { name: 'Кейсы', href: '#cases' },
    { name: 'Экспресс-аудит', href: '#audit' },
    { name: 'Процесс', href: '#process' },
    { name: 'Стек', href: '#stack' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-950/85 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/50 py-3.5' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-accent-violet to-accent-cyan p-0.5 shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <span className="font-heading font-extrabold text-xl text-white tracking-wider">F</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                FIRM
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Digital Agency</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-primary-500 after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Currency selector */}
            <div className="flex items-center bg-dark-850 border border-white/10 rounded-lg p-1 text-xs font-mono">
              {['rub', 'usd', 'kzt'].map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`px-2 py-1 rounded transition-colors uppercase ${
                    currency === cur
                      ? 'bg-primary-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cur === 'rub' ? '₽' : cur === 'usd' ? '$' : '₸'}
                </button>
              ))}
            </div>

            {/* Telegram Quick Chat */}
            <a
              href="https://t.me/artemov_basil"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 text-cyan-400 hover:text-cyan-300 transition-colors"
              title="Написать в Telegram"
            >
              <Send className="w-4 h-4" />
            </a>

            {/* Primary CTA */}
            <button
              onClick={() => onOpenContact('Обсудить проект')}
              className="relative group px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-violet hover:from-primary-500 hover:to-accent-violet text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all flex items-center gap-2"
            >
              <span>Обсудить проект</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenContact('Экспресс-заявка')}
              className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-medium"
            >
              Заявка
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-dark-850 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 pb-6 border-t border-white/10 bg-dark-900/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-200 hover:text-primary-400 py-1.5 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Валюта расчета:</span>
                <div className="flex gap-1 bg-dark-850 p-1 rounded-lg border border-white/10 text-xs">
                  {['rub', 'usd', 'kzt'].map((cur) => (
                    <button
                      key={cur}
                      onClick={() => setCurrency(cur)}
                      className={`px-2 py-1 rounded uppercase ${
                        currency === cur ? 'bg-primary-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      {cur === 'rub' ? '₽' : cur === 'usd' ? '$' : '₸'}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact('Консультация (Mobile)');
                }}
                className="w-full mt-2 py-3 rounded-xl bg-primary-600 text-white font-semibold text-center flex items-center justify-center gap-2"
              >
                <span>Обсудить задачу</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
