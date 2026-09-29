import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, AlertCircle, MessageSquare, ShieldCheck, Sparkles, DollarSign, User, Phone, Check } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import StudioSelect from './ui/StudioSelect';

export default function ContactModal({ 
  lang,
  servicesList = [],
  isOpen, 
  onClose, 
  initialService, 
  onSuccessLead 
}) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedService, setSelectedService] = useState(
    initialService || (lang === 'en' ? 'Turnkey Packaging 360°' : (lang === 'kz' ? '360° Кешенді қаптама' : 'Комплексный проект / Упаковка 360°'))
  );
  const [budget, setBudget] = useState('$1,500 – $3,500');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const t = TRANSLATIONS[lang].modal;

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Dynamic service options
  const defaultTurnkeyTitle = lang === 'en' 
    ? 'Turnkey Packaging 360°' 
    : (lang === 'kz' ? '360° Кешенді қаптама' : 'Комплексный проект / Упаковка 360°');

  const serviceOptions = [
    {
      value: defaultTurnkeyTitle,
      label: defaultTurnkeyTitle,
      desc: lang === 'en' 
        ? 'Web, branding, custom software & customer funnel' 
        : (lang === 'kz' ? 'Толық циклды сандық өндіріс және маркетинг' : 'Сайт, брендинг, софт и воронка продаж под ключ')
    },
    ...servicesList.map(s => {
      const title = s.title?.[lang] || s.title?.ru || s.id;
      const tagline = s.tagline?.[lang] || s.tagline?.ru || '';
      return {
        value: title,
        label: title,
        desc: tagline
      };
    })
  ];

  // Dynamic budget options
  const budgetOptions = [
    {
      value: '< $1,500',
      label: '< $1,500 (до 150k ₽ / 700k ₸)',
      desc: lang === 'en' ? 'MVP, fast landing or targeted audit' : (lang === 'kz' ? 'MVP, жедел лендинг немесе аудит' : 'MVP, точечный аудит или срочный запуск')
    },
    {
      value: '$1,500 – $3,500',
      label: '$1,500 – $3,500 (150k – 350k ₽ / 1.5M ₸)',
      desc: lang === 'en' ? 'Corporate website or turnkey brand identity' : (lang === 'kz' ? 'Корпоративтік сайт немесе айдентика' : 'Сайт компании или брендинг под ключ')
    },
    {
      value: '$3,500 – $7,000',
      label: '$3,500 – $7,000 (350k – 700k ₽ / 3M ₸)',
      desc: lang === 'en' ? 'E-commerce, web platform or custom software' : (lang === 'kz' ? 'E-commerce немесе арнайы бағдарлама' : 'E-commerce, сложная веб-платформа или софт')
    },
    {
      value: '>$7,000+',
      label: '>$7,000+ (от 700k ₽ / 3.5M ₸+)',
      desc: lang === 'en' ? 'Enterprise ecosystem or multi-market expansion' : (lang === 'kz' ? 'Enterprise экожүйе немесе ауқымды өнім' : 'Enterprise проект, экосистема или 360° упаковка')
    }
  ];

  // Quick 1-tap topics
  const quickTopics = lang === 'en' ? [
    'Turnkey Web Platform',
    'Platform Redesign',
    'Custom Software / CRM',
    'Brand Identity & Deck',
    'Urgent Fast-Track'
  ] : lang === 'kz' ? [
    'Сайтты нөлден жасау',
    'Платформа редизайны',
    'Жеке софт және CRM',
    'Брендинг және Pitch Deck',
    'Шұғыл іске қосу'
  ] : [
    'Сайт под ключ',
    'Редизайн платформы',
    'Кастомный софт / CRM',
    'Брендинг и Pitch Deck',
    'Срочный запуск'
  ];

  const handleToggleTopic = (topic) => {
    setMessage(prev => {
      if (!prev) return topic;
      if (prev.includes(topic)) return prev;
      return `${prev} · ${topic}`;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setIsSubmitting(true);
    setStatus(null);

    const payload = {
      type: 'GENERAL_CONTACT_REQUEST',
      name: name.trim() || (lang === 'en' ? 'Not specified' : (lang === 'kz' ? 'Көрсетілмеген' : 'Не указано')),
      contact: contact.trim(),
      service: selectedService,
      budget,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setStatus('success');
        setName('');
        setContact('');
        setMessage('');
        if (onSuccessLead) onSuccessLead();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/65 dark:bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Dialog Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white/95 dark:bg-[#0c0e18]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl z-10 my-auto"
          >
            
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Modal Header */}
            <div className="mb-6 sm:mb-8 pr-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 text-xs font-mono uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>{t.badge}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-950 dark:text-white tracking-tight uppercase leading-tight">
                {t.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {t.desc}
              </p>
            </div>

            {/* Quick 1-Click Messengers */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://t.me/artemov_basil"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-white/[0.03] text-slate-900 dark:text-slate-100 hover:border-slate-400 dark:hover:border-white/25 text-xs sm:text-sm font-heading font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Send className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span>{t.tgDirect}</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/?text=Hello!%20I%20would%20like%20to%20discuss%20a%20project%20with%20FIRM%20agency"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-white/[0.03] text-slate-900 dark:text-slate-100 hover:border-slate-400 dark:hover:border-white/25 text-xs sm:text-sm font-heading font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>{t.waDirect}</span>
              </motion.a>
            </div>

            {/* Simplified High-Converting Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              {/* Field 1: Contact (Required, prominent) */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {lang === 'en' ? 'Contact Handle / Phone *' : (lang === 'kz' ? 'Байланыс телефоны немесе мессенджер *' : 'Контакты для связи (Telegram, WhatsApp или тел.) *')}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="@username, phone or email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full min-h-[52px] sm:min-h-[56px] px-4 sm:px-5 py-3.5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-slate-950 dark:text-white placeholder-slate-400 text-sm sm:text-base font-medium shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Field 2: Name / Company */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'John Doe / Company' : (lang === 'kz' ? 'Есіміңіз немесе компания' : 'Как вас зовут / Компания')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-[52px] sm:min-h-[56px] px-4 sm:px-5 py-3.5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-slate-950 dark:text-white placeholder-slate-400 text-sm sm:text-base font-medium shadow-sm transition-all"
                />
              </div>

              {/* Modern Studio Selects: Service & Budget in a spacious grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StudioSelect
                  label={t.serviceLabel}
                  value={selectedService}
                  onChange={setSelectedService}
                  options={serviceOptions}
                  icon={Sparkles}
                  placeholder={lang === 'en' ? 'Select Service' : (lang === 'kz' ? 'Қызметті таңдаңыз' : 'Выберите услугу')}
                />

                <StudioSelect
                  label={t.budgetLabel}
                  value={budget}
                  onChange={setBudget}
                  options={budgetOptions}
                  icon={DollarSign}
                  placeholder={lang === 'en' ? 'Select Budget' : (lang === 'kz' ? 'Бюджетті таңдаңыз' : 'Выберите бюджет')}
                />
              </div>

              {/* Field 5: Brief description + 1-Tap Quick Tags */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t.messageLabel}
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {lang === 'en' ? 'Optional' : (lang === 'kz' ? 'Қосымша' : 'Опционально')}
                  </span>
                </div>

                <textarea
                  rows="2"
                  placeholder={lang === 'en' ? 'Tell us briefly about your goals or paste current website link...' : (lang === 'kz' ? 'Жобаңыз туралы қысқаша немесе сайт сілтемесі...' : 'Расскажите в двух словах о задаче или пришлите ссылку...')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 sm:px-5 py-3.5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-slate-950 dark:text-white placeholder-slate-400 text-sm sm:text-base resize-none shadow-sm transition-all"
                ></textarea>

                {/* 1-Tap Quick Topic Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {quickTopics.map((topic, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleTopic(topic)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-white/[0.04] hover:bg-amber-400/15 dark:hover:bg-amber-400/20 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 border border-slate-200 dark:border-white/10 transition-colors"
                    >
                      + {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 sm:py-4.5 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-heading font-black text-sm sm:text-base shadow-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>{t.submitting}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.submitBtn}</span>
                  </>
                )}
              </motion.button>

              {status === 'success' && (
                <div className="p-4 rounded-2xl border border-amber-400/50 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{t.successMsg}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-2xl border border-rose-400/50 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{t.errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>{t.footerNote}</span>
              </div>

            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
