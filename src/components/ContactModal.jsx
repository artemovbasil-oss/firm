import React, { useState, useEffect } from 'react';
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-scaleUp">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-mono uppercase mb-2">
            <span>{t.badge}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-950 dark:text-white">
            {t.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.desc}
          </p>
        </div>

        {/* Quick Messengers */}
        <div className="mb-5 flex gap-2.5">
          <a
            href="https://t.me/artemov_basil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-slate-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-cyan-500" />
            <span>{t.tgDirect}</span>
          </a>
          <a
            href="https://wa.me/?text=Hello!%20I%20would%20like%20to%20discuss%20a%20project%20with%20FIRM%20agency"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-slate-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.waDirect}</span>
          </a>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1">
              {t.nameLabel}
            </label>
            <input
              type="text"
              placeholder={lang === 'en' ? 'John Doe / Acme Corp' : (lang === 'kz' ? 'Есіміңіз немесе Компания атауы' : 'Как к вам обращаться')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl input-studio text-xs placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1">
              {t.contactLabel}
            </label>
            <input
              type="text"
              required
              placeholder="@username, phone or email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3 py-2 rounded-xl input-studio text-xs placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1">
                {t.serviceLabel}
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl input-studio text-xs"
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
              <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1">
                {t.budgetLabel}
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl input-studio text-xs"
              >
                <option value="<$1,000">&lt; $1,000 (до 100k ₽ / 500k ₸)</option>
                <option value="$1,500 - $3,500">$1,500 – $3,500 (150k – 300k ₽ / 1.5M ₸)</option>
                <option value="$3,500 - $7,000">$3,500 – $7,000 (300k – 600k ₽ / 3M ₸)</option>
                <option value=">$7,000+">&gt; $7,000+ (от 600k ₽ / 3.5M ₸+)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1">
              {t.messageLabel}
            </label>
            <textarea
              rows="3"
              placeholder={lang === 'en' ? 'Describe your challenge, timeline or send website link...' : (lang === 'kz' ? 'Мақсатыңыз, мерзім немесе қазіргі сайт сілтемесі...' : 'Расскажите о целях, сроках или пришлите ссылку на текущий сайт...')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl input-studio text-xs placeholder-slate-400 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-sm btn-studio flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>{t.submitting}</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{t.submitBtn}</span>
              </>
            )}
          </button>

          {status === 'success' && (
            <div className="p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{t.successMsg}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="p-2.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{t.errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
            <ShieldCheck className="w-3 h-3" />
            <span>{t.footerNote}</span>
          </div>

        </form>

      </div>
    </div>
  );
}
