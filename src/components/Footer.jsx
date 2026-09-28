import React from 'react';
import { 
  Send, Mail, Phone, MapPin, ArrowUp, 
  Heart, ShieldCheck, Code2 
} from 'lucide-react';
import { SERVICES } from '../data/agencyData';

export default function Footer({ onOpenContact }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-950 border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan p-0.5">
                <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                  <span className="font-heading font-extrabold text-lg text-white">F</span>
                </div>
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                FIRM Digital Agency
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Агентство комплексного цифрового производства и роста бизнеса. Создаем высококонверсионные сайты, брендинг, софт, презентации и выводим компании в лидеры рынка.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/artemov_basil"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-colors"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/artemovbasil-oss/firm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <button
                onClick={() => onOpenContact('Вопрос из футера')}
                className="w-9 h-9 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 flex items-center justify-center text-accent-emerald transition-colors"
                title="Написать письмо"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Services (8 services list) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Направления
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {SERVICES.slice(0, 4).map(s => (
                <li key={s.id}>
                  <a href="#services" className="hover:text-primary-400 transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Рост & Продвижение
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {SERVICES.slice(4).map(s => (
                <li key={s.id}>
                  <a href="#services" className="hover:text-primary-400 transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts & Working Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Связь с агентством
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <a href="https://t.me/artemov_basil" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  @artemov_basil (24/7)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                <a href="mailto:hello@firm-agency.pro" className="hover:text-white">
                  hello@firm-agency.pro
                </a>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                <span>NDA & Безналичный расчет</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenContact('Консультация')}
                className="w-full py-2 px-3 rounded-lg bg-primary-600/20 hover:bg-primary-600/30 border border-primary-500/30 text-primary-300 text-xs font-medium transition-colors"
              >
                Оставить заявку
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} FIRM Digital Agency. Все права защищены.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Договор оферты</a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 p-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-white transition-colors"
              title="Наверх"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
