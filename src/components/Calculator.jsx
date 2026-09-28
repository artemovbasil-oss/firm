import React, { useState } from 'react';
import { 
  Calculator as CalcIcon, CheckCircle2, Clock, 
  Send, AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Calculator({ 
  lang,
  currency, 
  servicesList = [],
  selectedServices, 
  onToggleService, 
  onSuccessLead 
}) {
  const [scale, setScale] = useState('business');
  const [urgency, setUrgency] = useState('standard');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientComment, setClientComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const t = TRANSLATIONS[lang].calculator;

  const scaleMultipliers = {
    start: 0.8,
    business: 1.0,
    enterprise: 1.65,
  };

  const scaleNames = {
    start: lang === 'en' ? 'Startup / MVP' : (lang === 'kz' ? 'Стартап / MVP' : 'Стартап / MVP'),
    business: lang === 'en' ? 'Business / Standard' : (lang === 'kz' ? 'Бизнес / Стандарт' : 'Бизнес / Стандарт'),
    enterprise: lang === 'en' ? 'Enterprise / Scale' : (lang === 'kz' ? 'Enterprise / Ауқымды' : 'Enterprise / Масштаб')
  };

  const urgencyMultipliers = {
    standard: 1.0,
    express: 1.25,
  };

  // Calculate pricing
  const baseTotal = selectedServices.reduce((sum, serviceId) => {
    const s = servicesList.find(item => item.id === serviceId);
    if (!s) return sum;
    return sum + (s.basePrice[currency] || s.basePrice.rub);
  }, 0);

  let bundleDiscount = 0;
  if (selectedServices.length >= 4) {
    bundleDiscount = 0.15;
  } else if (selectedServices.length >= 2) {
    bundleDiscount = 0.10;
  }

  const calculatedPrice = Math.round(
    baseTotal * scaleMultipliers[scale] * urgencyMultipliers[urgency] * (1 - bundleDiscount)
  );

  const baseDays = selectedServices.length === 0 ? 0 : Math.max(
    ...selectedServices.map(id => {
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
      name: clientName || (lang === 'en' ? 'Not specified' : (lang === 'kz' ? 'Көрсетілмеген' : 'Не указано')),
      contact: clientContact,
      comment: clientComment,
      currency,
      scale: scaleNames[scale],
      urgency: urgency === 'express' 
        ? (lang === 'en' ? 'Express (-35% timeline)' : (lang === 'kz' ? 'Жедел (-35% мерзім)' : 'Срочно (-35% срок)'))
        : (lang === 'en' ? 'Standard' : 'Стандарт'),
      selectedServices: selectedServices.map(id => {
        const s = servicesList.find(item => item.id === id);
        return s ? (s.title?.[lang] || s.title?.ru || id) : id;
      }),
      estimatedPrice: formatCurrency(calculatedPrice),
      estimatedDays: `${estimatedDays} ${t.daysUnit}`,
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
    <section id="calculator" className="py-20 relative bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider mb-3">
            {t.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {t.desc}
          </p>
        </div>

        {/* Calculator Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Configuration Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-6 card-studio p-6 sm:p-8 rounded-3xl">
            
            {/* Step 1: Services Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {t.step1}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {t.selectedCount.replace('{count}', selectedServices.length).replace('{total}', servicesList.length)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {servicesList.map((s) => {
                  const isChecked = selectedServices.includes(s.id);
                  const title = s.title?.[lang] || s.title?.ru || s.id;
                  const price = s.basePrice[currency]?.toLocaleString('ru-RU');
                  const curSymbol = currency === 'rub' ? '₽' : currency === 'usd' ? '$' : '₸';

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onToggleService(s.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-medium'
                          : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">{title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {lang === 'en' ? 'from ' : 'от '}{price} {curSymbol}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-950' : 'border-slate-300 dark:border-slate-700'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Scale selection */}
            <div>
              <div className="mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {t.step2}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'start', title: scaleNames.start, desc: lang === 'en' ? 'MVP & core features' : 'Базовый MVP функционал' },
                  { id: 'business', title: scaleNames.business, desc: lang === 'en' ? 'Full design & integrations' : 'Оптимум, интеграции, CRM' },
                  { id: 'enterprise', title: scaleNames.enterprise, desc: lang === 'en' ? 'Highload & brand system' : 'Highload, микросервисы' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScale(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      scale === item.id
                        ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{item.title}</div>
                    <div className="text-[10px] text-slate-500 leading-tight">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Urgency */}
            <div>
              <div className="mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {t.step3}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setUrgency('standard')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    urgency === 'standard'
                      ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{t.standardSpeed}</div>
                  <div className="text-[10px] text-slate-500">{t.standardSpeedDesc}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('express')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    urgency === 'express'
                      ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{t.expressSpeed}</div>
                  <div className="text-[10px] text-slate-500">{t.expressSpeedDesc}</div>
                </button>
              </div>
            </div>

          </div>

          {/* Right Summary & Proposal Panel (5 cols) */}
          <div className="lg:col-span-5 card-studio p-6 sm:p-8 rounded-3xl sticky top-24">
            
            {/* Top Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-5">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500">{t.summaryTitle}</span>
              {bundleDiscount > 0 && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950">
                  {t.discountBadge.replace('{percent}', bundleDiscount * 100)}
                </span>
              )}
            </div>

            {/* Price Display */}
            <div className="mb-5">
              <div className="text-xs text-slate-500 mb-1">{t.budgetLabel}</div>
              <div className="text-3xl font-heading font-extrabold text-slate-950 dark:text-white">
                {selectedServices.length > 0 ? formatCurrency(calculatedPrice) : (lang === 'en' ? 'Select services' : 'Выберите услуги')}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {t.timelineLabel} <strong className="text-slate-800 dark:text-slate-200">{selectedServices.length > 0 ? `~${estimatedDays} ${t.daysUnit}` : '—'}</strong>
                </span>
                <span>•</span>
                <span>{t.tierLabel} <strong className="text-slate-800 dark:text-slate-200">{scaleNames[scale]}</strong></span>
              </div>
            </div>

            {/* Selected deliverables list */}
            <div className="space-y-1.5 mb-5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400">
              <div className="font-semibold text-slate-900 dark:text-white mb-1.5">{t.includedTitle}</div>
              {selectedServices.length === 0 ? (
                <div className="italic text-slate-400">{t.emptyServices}</div>
              ) : (
                selectedServices.map(id => {
                  const s = servicesList.find(item => item.id === id);
                  const title = s?.title?.[lang] || s?.title?.ru || id;
                  return (
                    <div key={id} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-800 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{title}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitEstimate} className="space-y-3">
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                {t.formTitle}
              </div>

              <div>
                <input
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl input-studio text-xs placeholder-slate-400"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder={t.contactPlaceholder}
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl input-studio text-xs placeholder-slate-400"
                />
              </div>

              <div>
                <textarea
                  rows="2"
                  placeholder={t.commentPlaceholder}
                  value={clientComment}
                  onChange={(e) => setClientComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl input-studio text-xs placeholder-slate-400 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || selectedServices.length === 0}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs btn-studio flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
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

              {submitStatus === 'success' && (
                <div className="p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.successMsg}</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-2.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.errorMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-400 pt-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{t.privacyNote}</span>
              </div>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
}
