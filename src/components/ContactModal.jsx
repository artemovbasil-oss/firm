import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, AlertCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

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
  const [selectedService, setSelectedService] = useState(initialService || (lang === 'en' ? 'Full Packaging 360°' : (lang === 'kz' ? '360° Кешенді қаптама' : 'Комплексный проект / Упаковка')));
  const [budget, setBudget] = useState('150k-300k');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-white/95 dark:bg-[#0c0e18]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 rounded-3xl p-7 sm:p-10 shadow-2xl z-10 my-auto"
          >
            
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-mono uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{t.badge}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950 dark:text-white tracking-tight">
                {t.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                {t.desc}
              </p>
            </div>

            {/* Quick Messengers */}
            <div className="mb-6 flex gap-3">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://t.me/artemov_basil"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 hover:border-slate-400 dark:hover:border-white/20 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4 text-cyan-500" />
                <span>{t.tgDirect}</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/?text=Hello!%20I%20would%20like%20to%20discuss%20a%20project%20with%20FIRM%20agency"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 hover:border-slate-400 dark:hover:border-white/20 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>{t.waDirect}</span>
              </motion.a>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'John Doe / Acme Corp' : (lang === 'kz' ? 'Есіміңіз немесе Компания атауы' : 'Как к вам обращаться')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl input-studio text-sm placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.contactLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder="@username, phone or email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl input-studio text-sm placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.serviceLabel}
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-3.5 rounded-xl input-studio text-xs sm:text-sm bg-white dark:bg-slate-900"
                  >
                    <option value={lang === 'en' ? 'Full Packaging 360°' : (lang === 'kz' ? '360° Кешенді қаптама' : 'Комплексный проект / Упаковка')}>
                      {lang === 'en' ? 'Turnkey Packaging 360°' : (lang === 'kz' ? '360° Кешенді қаптама' : 'Комплексный проект / Упаковка')}
                    </option>
                    {servicesList.map(s => {
                      const title = s.title?.[lang] || s.title?.ru || s.id;
                      return <option key={s.id} value={title}>{title}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.budgetLabel}
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-3.5 rounded-xl input-studio text-xs sm:text-sm bg-white dark:bg-slate-900"
                  >
                    <option value="<$1,000">&lt; $1,000 (до 100k ₽ / 500k ₸)</option>
                    <option value="$1,500 - $3,500">$1,500 – $3,500 (150k – 300k ₽ / 1.5M ₸)</option>
                    <option value="$3,500 - $7,000">$3,500 – $7,000 (300k – 600k ₽ / 3M ₸)</option>
                    <option value=">$7,000+">&gt; $7,000+ (от 600k ₽ / 3.5M ₸+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.messageLabel}
                </label>
                <textarea
                  rows="3"
                  placeholder={lang === 'en' ? 'Describe your challenge, timeline or send website link...' : (lang === 'kz' ? 'Мақсатыңыз, мерзім немесе қазіргі сайт сілтемесі...' : 'Расскажите о целях, сроках или пришлите ссылку на текущий сайт...')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl input-studio text-sm placeholder-slate-400 resize-none"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-heading font-bold text-sm shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
                <div className="p-3.5 rounded-xl border border-amber-400/50 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{t.successMsg}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-3.5 rounded-xl border border-rose-400/50 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{t.errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.footerNote}</span>
              </div>

            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
