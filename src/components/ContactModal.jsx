import React, { useState, useEffect } from 'react';
import { 
  X, Send, CheckCircle2, AlertCircle, 
  MessageSquare, ShieldCheck, ArrowRight, Phone 
} from 'lucide-react';
import { SERVICES } from '../data/agencyData';

export default function ContactModal({ isOpen, onClose, initialService, onSuccessLead }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedService, setSelectedService] = useState(initialService || 'Комплексный проект');
  const [budget, setBudget] = useState('150k-300k');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

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
      name: name.trim() || 'Не указано',
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
        className="fixed inset-0 bg-dark-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-xl bg-dark-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-scaleUp">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-white transition-colors border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-mono uppercase mb-2">
            <span>Обсудить задачу</span>
          </div>
          <h3 className="text-2xl font-heading font-extrabold text-white">
            Давайте создадим нечто выдающееся
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Заполните форму, и мы свяжемся с вами в Telegram или по телефону в течение 20 минут.
          </p>
        </div>

        {/* Quick messenger triggers */}
        <div className="mb-6 flex gap-3">
          <a
            href="https://t.me/artemov_basil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Написать в Telegram</span>
          </a>
          <a
            href="https://wa.me/?text=Здравствуйте!%20Хочу%20обсудить%20проект%20в%20агентстве%20FIRM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp диалог</span>
          </a>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Ваше имя / Компания:
            </label>
            <input
              type="text"
              placeholder="Как к вам обращаться"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Telegram / Телефон / Email *:
            </label>
            <input
              type="text"
              required
              placeholder="@username или +7 (999) 000-00-00"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Интересующая услуга:
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white text-xs focus:outline-none focus:border-primary-500"
              >
                <option value="Комплексный проект">Комплексный проект / Упаковка</option>
                {SERVICES.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Планируемый бюджет:
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white text-xs focus:outline-none focus:border-primary-500"
              >
                <option value="до 100 000 ₽">до 100 000 ₽ ($1 000)</option>
                <option value="150 000 – 300 000 ₽">150 000 – 300 000 ₽ ($1 500 – $3 500)</option>
                <option value="300 000 – 600 000 ₽">300 000 – 600 000 ₽ ($3 500 – $7 000)</option>
                <option value="от 600 000 ₽+">от 600 000 ₽+ ($7 000+)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Кратко о задаче (или ссылка):
            </label>
            <textarea
              rows="3"
              placeholder="Расскажите о целях, сроках или пришлите ссылку на текущий сайт / референсы"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent-violet hover:from-primary-500 hover:to-accent-violet text-white font-semibold text-xs sm:text-sm shadow-xl shadow-primary-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Отправляем заявку...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Отправить заявку в агентство</span>
              </>
            )}
          </button>

          {status === 'success' && (
            <div className="p-3 rounded-xl bg-accent-emerald/20 border border-accent-emerald/30 text-accent-emerald text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Заявка успешно отправлена! Скоро свяжемся с вами.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 rounded-xl bg-accent-rose/20 border border-accent-rose/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Не удалось отправить форму. Напишите напрямую в Telegram @artemov_basil</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Конфиденциально · Официальный договор · NDA</span>
          </div>

        </form>

      </div>
    </div>
  );
}
