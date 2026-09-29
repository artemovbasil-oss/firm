import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [clientContact, setClientContact] = useState('');
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
    business: lang === 'en' ? 'Standard / Growth' : (lang === 'kz' ? 'Бизнес / Стандарт' : 'Бизнес / Стандарт'),
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
      contact: clientContact.trim(),
      currency,
      scale: scaleNames[scale],
      urgency: urgency === 'express' ? 'Express' : 'Standard',
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
        setClientContact('');
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
    <section id="calculator" className="py-20 sm:py-28 lg:py-32 relative w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 lg:mb-20 gap-6">
          <div>
            <div className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-widest mb-3">
              {lang === 'en' ? 'Transparent Pricing' : (lang === 'kz' ? 'Баға калькуляторы' : 'Оценка бюджета')}
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-slate-950 dark:text-white uppercase leading-[0.98]">
              {lang === 'en' ? 'Estimate Scope.' : (lang === 'kz' ? 'Жоба құны.' : 'Расчет сметы.')}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-relaxed font-normal">
            {lang === 'en'
              ? 'Select your disciplines and scale. Get an instant realistic baseline and lock in bundle terms.'
              : lang === 'kz'
              ? 'Қажетті бағыттар мен жоба ауқымын таңдаңыз. Нақты баға мен мерзімді бірден біліңіз.'
              : 'Выберите направления и масштаб бизнеса. Узнайте честную стоимость без скрытых платежей.'}
          </p>
        </div>

        {/* Minimalist 2-Column Cockpit with Healthy Breathing Room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Left Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-12">
            
            {/* 1. Services Chips */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4 sm:mb-5">
                {lang === 'en' ? 'Select Project Disciplines' : (lang === 'kz' ? 'Бағыттарды таңдаңыз' : 'Выберите направления')}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {servicesList.map((s) => {
                  const isChecked = selectedServices.includes(s.id);
                  const title = s.title?.[lang] || s.title?.ru || s.id;
                  const price = s.basePrice[currency]?.toLocaleString('ru-RU');
                  const curSymbol = currency === 'rub' ? '₽' : currency === 'usd' ? '$' : '₸';

                  return (
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      key={s.id}
                      type="button"
                      onClick={() => onToggleService(s.id)}
                      className={`max-w-full px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-heading font-semibold transition-all flex items-center justify-between gap-2.5 sm:gap-4 ${
                        isChecked
                          ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md scale-[1.01]'
                          : 'border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.02] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span className="truncate min-w-0">{title}</span>
                      <span className={`text-[10px] sm:text-[11px] font-mono shrink-0 tabular-nums whitespace-nowrap ${isChecked ? 'text-white/80 dark:text-slate-900/80' : 'text-slate-400'}`}>
                        +{price} {curSymbol}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 2. Scale Selector */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4 sm:mb-5">
                {lang === 'en' ? 'Company Scale' : (lang === 'kz' ? 'Жоба ауқымы' : 'Масштаб проекта')}
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                {[
                  { id: 'start', label: 'Startup' },
                  { id: 'business', label: 'Standard' },
                  { id: 'enterprise', label: 'Enterprise' }
                ].map((item) => (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    key={item.id}
                    type="button"
                    onClick={() => setScale(item.id)}
                    className={`py-3 sm:py-4 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-heading font-bold transition-all text-center truncate ${
                      scale === item.id
                        ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                        : 'border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 3. Speed Toggle */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4 sm:mb-5">
                {lang === 'en' ? 'Launch Velocity' : (lang === 'kz' ? 'Орындау қарқыны' : 'Скорость релиза')}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3.5">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setUrgency('standard')}
                  className={`py-3 sm:py-4 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-heading font-semibold transition-all ${
                    urgency === 'standard'
                      ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                      : 'border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t.standardSpeed}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setUrgency('express')}
                  className={`py-3 sm:py-4 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-heading font-semibold transition-all flex items-center justify-center gap-2 ${
                    urgency === 'express'
                      ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                      : 'border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{t.expressSpeed}</span>
                </motion.button>
              </div>
            </div>

          </div>

          {/* Right Live Estimate Output (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl bg-slate-950 text-white relative overflow-hidden shadow-2xl border border-white/10 space-y-6 sm:space-y-8">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {t.summaryTitle}
              </span>
              {bundleDiscount > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  -{bundleDiscount * 100}% Bundle
                </span>
              )}
            </div>

            {/* Giant Price with robust overflow protection */}
            <div className="min-w-0">
              <div className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight tabular-nums break-words min-w-0 leading-tight">
                {formatCurrency(calculatedPrice)}
              </div>
              <div className="text-xs sm:text-sm font-mono text-slate-400 mt-3">
                {t.timelineLabel} ~{estimatedDays} {t.daysUnit} · {scaleNames[scale]}
              </div>
            </div>

            {/* Fast 1-Click Inquiry with Healthy Margins */}
            <form onSubmit={handleSubmitEstimate} className="space-y-4 pt-6 border-t border-white/10">
              <input
                type="text"
                required
                placeholder={lang === 'en' ? 'Telegram @username or WhatsApp' : (lang === 'kz' ? 'Telegram немесе телефон *' : 'Telegram или телефон *')}
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/10 text-white placeholder-slate-400 text-sm focus:outline-none border border-white/10"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-white text-slate-950 font-heading font-bold text-xs sm:text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl"
              >
                {isSubmitting ? (
                  <span>...</span>
                ) : (
                  <>
                    <span>{t.submitBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              {submitStatus === 'success' && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.successMsg}</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                  <span>{t.errorMsg}</span>
                </div>
              )}
            </form>

            <div className="flex items-center gap-2.5 text-xs font-mono text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{t.privacyNote}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
