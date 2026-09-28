import React, { useState } from 'react';
import { Search, CheckCircle2, FileText, Video, TrendingUp, AlertCircle } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function ExpressAudit({ lang, onSuccessLead }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('conversion');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const t = TRANSLATIONS[lang].audit;

  const issues = lang === 'en' ? [
    { id: 'conversion', label: 'Low conversion rate (traffic exists, few inquiries)' },
    { id: 'seo', label: 'Poor organic search visibility (Google / Search SEO)' },
    { id: 'design', label: 'Outdated design & unconvincing visual identity' },
    { id: 'smm', label: 'Social media not driving sales (weak engagement funnels)' },
    { id: 'software', label: 'Need custom software, CRM, SaaS or Telegram Web App' },
    { id: 'presentation', label: 'Weak investor pitch deck / B2B sales presentation' },
  ] : lang === 'kz' ? [
    { id: 'conversion', label: 'Төмен конверсия (кірушілер бар, өтінім аз)' },
    { id: 'seo', label: 'Іздеуде төмен орын (Google / Яндекс SEO)' },
    { id: 'design', label: 'Ескірген дизайн және әлсіз визуалды қаптама' },
    { id: 'smm', label: 'Әлеуметтік желілер сатпайды (воронка жоқ)' },
    { id: 'software', label: 'Жеке бағдарлама, CRM, SaaS немесе Telegram Web App қажет' },
    { id: 'presentation', label: 'Инвесторлар немесе B2B үшін әлсіз презентация' },
  ] : [
    { id: 'conversion', label: 'Низкая конверсия (трафик есть, заявок мало)' },
    { id: 'seo', label: 'Нет позиций в поиске (Яндекс / Google SEO)' },
    { id: 'design', label: 'Устаревший дизайн и слабая визуальная упаковка' },
    { id: 'smm', label: 'Соцсети не продают (нет воронки и вовлечения)' },
    { id: 'software', label: 'Нужен софт, CRM, SaaS или Telegram Web App' },
    { id: 'presentation', label: 'Слабая презентация для инвесторов / B2B' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setIsSubmitting(true);
    setStatus(null);

    const payload = {
      type: 'EXPRESS_AUDIT_REQUEST',
      targetUrl: targetUrl.trim() || (lang === 'en' ? 'Not specified' : (lang === 'kz' ? 'Көрсетілмеген' : 'Не указан')),
      issue: issues.find(i => i.id === selectedIssue)?.label || selectedIssue,
      contact: contact.trim(),
      notes: notes.trim(),
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
        setTargetUrl('');
        setContact('');
        setNotes('');
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
    <section id="audit" className="py-20 relative border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="card-studio rounded-3xl p-6 sm:p-10 border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left explanation column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider">
                {t.badge}
              </div>

              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t.title}
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                {t.desc}
              </p>

              {/* What client gets */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white mt-0.5">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{t.feature1Title}</div>
                    <div className="text-[11px] text-slate-500">{t.feature1Desc}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white mt-0.5">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{t.feature2Title}</div>
                    <div className="text-[11px] text-slate-500">{t.feature2Desc}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{t.feature3Title}</div>
                    <div className="text-[11px] text-slate-500">{t.feature3Desc}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Form column */}
            <div className="lg:col-span-6 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
              <h3 className="text-sm font-heading font-bold text-slate-900 dark:text-white mb-1">
                {t.formHeading}
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">
                {t.formSubheading}
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1">
                    {t.urlLabel}
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-studio text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1">
                    {t.issueLabel}
                  </label>
                  <select
                    value={selectedIssue}
                    onChange={(e) => setSelectedIssue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-studio text-xs"
                  >
                    {issues.map(iss => (
                      <option key={iss.id} value={iss.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {iss.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1">
                    {t.contactLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@telegram_login, WhatsApp or email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-studio text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1">
                    {t.notesLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'en' ? 'Any specific goals...' : (lang === 'kz' ? 'Мысалы: жаңа тарифті іске қосу...' : 'Например: запуск нового тарифа...')}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl input-studio text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs btn-studio shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t.submitting}</span>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
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

              </form>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
