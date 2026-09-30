import React from 'react';
import { Send, Mail, ShieldCheck, ArrowUp } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Footer({ lang, servicesList = [], onOpenContact }) {
  const t = TRANSLATIONS[lang].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-[#07080b] pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 transition-colors w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-black/[0.06] dark:border-white/[0.06]">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-heading font-black text-base shadow-sm">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl text-slate-950 dark:text-white tracking-tight leading-none">
                  ARTX
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-0.5">
                  Digital Production & Growth
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              {t.desc}
            </p>

            {/* Social & Messenger Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://t.me/artemov_basil"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-cyan-500 hover:border-cyan-500/50 transition-all hover:scale-105"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/artemovbasil-oss/firm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-slate-400 transition-all hover:scale-105"
                title="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <button
                onClick={() => onOpenContact('Direct Email Inquiry')}
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-amber-400 hover:border-amber-400/50 transition-all hover:scale-105"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-950 dark:text-white uppercase tracking-wider">
              {t.directions}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {servicesList.slice(0, 4).map(s => {
                const title = s.title?.[lang] || s.title?.ru || s.id;
                return (
                  <li key={s.id}>
                    <a href="#services" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                      {title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Growth & Audit */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-950 dark:text-white uppercase tracking-wider">
              {t.growth}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {servicesList.slice(4).map(s => {
                const title = s.title?.[lang] || s.title?.ru || s.id;
                return (
                  <li key={s.id}>
                    <a href="#services" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                      {title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contacts & Fast Action */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-mono font-bold text-slate-950 dark:text-white uppercase tracking-wider">
              {t.contacts}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div>
                <a href="https://t.me/artemov_basil" target="_blank" rel="noopener noreferrer" className="hover:text-slate-950 dark:hover:text-white flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-cyan-500" />
                  <span>@artemov_basil</span>
                </a>
              </div>
              <div>
                <a href="mailto:hello@artx.one" className="hover:text-slate-950 dark:hover:text-white flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>hello@artx.one</span>
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>NDA & Direct Invoicing</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenContact(t.leaveRequest)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-heading font-bold transition-all shadow-sm"
              >
                {t.leaveRequest}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} ARTX Digital Agency. {t.rights}
          </div>

          <div className="flex items-center gap-5 text-xs">
            <a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">{t.privacy}</a>
            <a href="#" className="hover:text-slate-950 dark:hover:text-white transition-colors">{t.terms}</a>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-950 dark:hover:text-white hover:border-slate-400 transition-all"
              title="Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
