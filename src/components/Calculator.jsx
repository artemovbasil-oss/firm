import React, { useState, useId } from 'react';
import { 
  Calculator as CalcIcon, CheckCircle2, Clock, 
  Send, Sparkles, AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { SERVICES } from '../data/agencyData';

export default function Calculator({ 
  currency, 
  selectedServices, 
  onToggleService, 
  onSuccessLead 
}) {
  const [scale, setScale] = useState('business'); // start | business | enterprise
  const [urgency, setUrgency] = useState('standard'); // standard | express
  
  // Lead submission form
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientComment, setClientComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const scaleMultipliers = {
    start: 0.8,
    business: 1.0,
    enterprise: 1.65,
  };

  const scaleNames = {
    start: 'Стартап / MVP',
    business: 'Бизнес / Стандарт',
    enterprise: 'Enterprise / Лидер рынка'
  };

  const urgencyMultipliers = {
    standard: 1.0,
    express: 1.25,
  };

  // Calculate pricing
  const baseTotal = selectedServices.reduce((sum, serviceId) => {
    const s = SERVICES.find(item => item.id === serviceId);
    if (!s) return sum;
    return sum + (s.basePrice[currency] || s.basePrice.rub);
  }, 0);

  // Bundle discount
  let bundleDiscount = 0;
  if (selectedServices.length >= 4) {
    bundleDiscount = 0.15; // 15% discount for 4+ services
  } else if (selectedServices.length >= 2) {
    bundleDiscount = 0.10; // 10% discount for 2-3 services
  }

  const calculatedPrice = Math.round(
    baseTotal * scaleMultipliers[scale] * urgencyMultipliers[urgency] * (1 - bundleDiscount)
  );

  // Calculate estimated days
  const baseDays = selectedServices.length === 0 ? 0 : Math.max(
    ...selectedServices.map(id => {
      const s = SERVICES.find(item => item.id === id);
      if (id === 'packaging') return 28;
      if (id === 'software') return 25;
      if (id === 'websites') return 18;
      if (id === 'branding') return 14;
      if (id === 'smm') return 30;
      if (id === 'seo_audit') return 12;
      if (id === 'landings') return 8;
      if (id === 'presentations') return 6;
      return 10;
    })
  );

  const estimatedDays = urgency === 'express' 
    ? Math.max(4, Math.round(baseDays * 0.65)) 
    : baseDays;

  const formatCurrency = (val) => {
    if (currency === 'rub') return `${val.toLocaleString('ru-RU')} ₽`;
    if (currency === 'usd') return `$${val.toLocaleString('en-US')}`;
    if (currency === 'kzt') return `${val.toLocaleString('ru-RU')} ₸`;
    return `${val} ₽`;
  };

  const handleSubmitEstimate = async (e) => {
    e.preventDefault();
    if (!clientContact.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      type: 'CALCULATOR_ESTIMATE',
      name: clientName || 'Не указано',
      contact: clientContact,
      comment: clientComment,
      currency,
      scale: scaleNames[scale],
      urgency: urgency === 'express' ? 'Срочно (Фаст-трек)' : 'Стандарт',
      selectedServices: selectedServices.map(id => {
        const s = SERVICES.find(item => item.id === id);
        return s ? s.title : id;
      }),
      estimatedPrice: formatCurrency(calculatedPrice),
      estimatedDays: `${estimatedDays} рабочих дней`,
      discount: bundleDiscount > 0 ? `${bundleDiscount * 100}%` : '0%',
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSubmitStatus('success');
        setClientName('');
        setClientContact('');
        setClientComment('');
        if (onSuccessLead) onSuccessLead();
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="calculator" className="py-24 relative overflow-hidden bg-radial-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-xs text-accent-violet font-mono uppercase tracking-wider mb-4">
            Интерактивный расчет проекта
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            Калькулятор стоимости и <span className="text-gradient-primary">сроков реализации</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Соберите нужный стек услуг, выберите масштаб задачи и получите прозрачную смету с детализацией за 1 минуту.
          </p>
        </div>

        {/* Calculator Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Configuration Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-8 glass-panel p-6 sm:p-8 rounded-3xl">
            
            {/* Step 1: Services Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs">1</span>
                  Выберите необходимые услуги:
                </span>
                <span className="text-xs text-slate-400">
                  Выбрано: {selectedServices.length} из {SERVICES.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((s) => {
                  const isChecked = selectedServices.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onToggleService(s.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-primary-600/15 border-primary-500 text-white shadow-md shadow-primary-500/10'
                          : 'bg-dark-900/60 border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-medium truncate">{s.title}</div>
                        <div className="text-[11px] text-slate-400">
                          от {s.basePrice[currency]?.toLocaleString('ru-RU')} {currency === 'rub' ? '₽' : currency === 'usd' ? '$' : '₸'}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-primary-600 border-primary-500 text-white' : 'border-slate-600'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Scale selection */}
            <div>
              <div className="mb-4">
                <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs">2</span>
                  Масштаб и сложность решения:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'start', title: 'Стартап / MVP', desc: 'Базовый функционал, быстрый запуск' },
                  { id: 'business', title: 'Бизнес / Оптимум', desc: 'Комплексный дизайн, интеграции, CRM' },
                  { id: 'enterprise', title: 'Enterprise', desc: 'Highload, микросервисы, бренд-система' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScale(item.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      scale === item.id
                        ? 'bg-accent-violet/15 border-accent-violet text-white shadow-md shadow-accent-violet/10'
                        : 'bg-dark-900/60 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-white mb-1">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Urgency */}
            <div>
              <div className="mb-4">
                <span className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs">3</span>
                  Приоритет срочности:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUrgency('standard')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    urgency === 'standard'
                      ? 'bg-primary-600/15 border-primary-500 text-white'
                      : 'bg-dark-900/60 border-white/5 text-slate-400'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold text-white mb-1">Стандартный темп</div>
                  <div className="text-[11px] text-slate-400">Плановые спринты, максимальная глубина проработки</div>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('express')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    urgency === 'express'
                      ? 'bg-accent-rose/15 border-accent-rose text-white'
                      : 'bg-dark-900/60 border-white/5 text-slate-400'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                    <span>Фаст-трек (Срочно)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-rose/30 text-rose-300 font-mono">-35% дней</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Выделенная команда, параллельные спринты (+25% к стоимости)</div>
                </button>
              </div>
            </div>

          </div>

          {/* Right Summary & Proposal Panel (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border-primary-500/20 relative shadow-2xl">
            
            {/* Top Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Предварительная смета</span>
              {bundleDiscount > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30 animate-pulse">
                  Скидка пакета -{bundleDiscount * 100}%
                </span>
              )}
            </div>

            {/* Big Price Display */}
            <div className="mb-6">
              <div className="text-xs text-slate-400 mb-1">Ориентировочный бюджет:</div>
              <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
                {selectedServices.length > 0 ? formatCurrency(calculatedPrice) : 'Выберите услуги'}
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary-400" />
                  Срок: <strong className="text-white">{selectedServices.length > 0 ? `~${estimatedDays} раб. дней` : '—'}</strong>
                </span>
                <span>•</span>
                <span>Тариф: <strong className="text-white">{scaleNames[scale]}</strong></span>
              </div>
            </div>

            {/* Deliverables summary */}
            <div className="space-y-2 mb-6 p-4 rounded-xl bg-dark-900/70 border border-white/5 text-xs text-slate-300">
              <div className="font-semibold text-white mb-2">Включено в расчет:</div>
              {selectedServices.length === 0 ? (
                <div className="text-slate-500 italic">Пока не выбрано ни одной услуги</div>
              ) : (
                selectedServices.map(id => {
                  const s = SERVICES.find(item => item.id === id);
                  return (
                    <div key={id} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                      <span className="truncate">{s?.title}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Direct Lead Form to Lock Estimate */}
            <form onSubmit={handleSubmitEstimate} className="space-y-3.5">
              <div className="text-xs font-medium text-slate-200">
                Зафиксировать расчет и получить развернутое КП:
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Ваше имя / Компания"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950/80 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Telegram (@username) или Телефон *"
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950/80 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <textarea
                  rows="2"
                  placeholder="Комментарий к задаче или ссылка на текущий проект"
                  value={clientComment}
                  onChange={(e) => setClientComment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-950/80 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || selectedServices.length === 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent-violet hover:from-primary-500 hover:to-accent-violet text-white font-semibold text-xs sm:text-sm shadow-xl shadow-primary-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Отправка данных...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Получить КП и зафиксировать скидку</span>
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="p-3 rounded-xl bg-accent-emerald/20 border border-accent-emerald/30 text-accent-emerald text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Расчет успешно отправлен! Мы свяжемся с вами в течение 20 минут.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3 rounded-xl bg-accent-rose/20 border border-accent-rose/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Ошибка при отправке. Напишите нам напрямую в Telegram @artemov_basil</span>
                </div>
              )}

              <div className="flex items-center gap-2 justify-center text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Конфиденциальность гарантируется. Без спама.</span>
              </div>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
}
