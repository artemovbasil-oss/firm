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
    <section id="audit" className="py-28 sm:py-32 relative border-t border-slate-200/80 dark:border-white/10 overflow-hidden">
      {/* Background ambient spotlight */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="card-studio-hero rounded-3xl p-8 sm:p-12 lg:p-14 border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-[#0b0d15]/90 backdrop-blur-2xl shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left explanation column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 text-xs text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                {t.badge}
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-5xl font-heading font-extrabold text-slate-950 dark:text-white tracking-tight sm:tracking-tighter leading-tight">
                {t.title}
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                {t.desc}
              </p>

              {/* What client gets - Studio bento deliverables */}
              <div className="space-y-3.5 pt-2">
                {[
                  {
                    num: '01',
                    icon: <Video className="w-4 h-4" />,
                    title: t.feature1Title,
                    desc: t.feature1Desc
                  },
                  {
                    num: '02',
                    icon: <FileText className="w-4 h-4" />,
                    title: t.feature2Title,
                    desc: t.feature2Desc
                  },
                  {
                    num: '03',
                    icon: <TrendingUp className="w-4 h-4" />,
                    title: t.feature3Title,
                    desc: t.feature3Desc
                  }
                ].map((f) => (
                  <div 
                    key={f.num}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] hover:border-slate-400/50 dark:hover:border-white/20 transition-all flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      {f.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-heading font-bold text-slate-950 dark:text-white">
                          {f.title}
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-400">
                          {f.num}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {f.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Form column */}
            <div className="lg:col-span-6 p-7 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#0c0e18]/80 backdrop-blur-xl shadow-xl">
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-heading font-extrabold text-slate-950 dark:text-white mb-1.5">
                  {t.formHeading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {t.formSubheading}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.urlLabel}
                  </label>
                  <input
                    type="text"
                    placeholder="https://yourcompany.com"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl input-studio text-sm placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.issueLabel}
                  </label>
                  <select
                    value={selectedIssue}
                    onChange={(e) => setSelectedIssue(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl input-studio text-sm bg-white dark:bg-slate-900"
                  >
                    {issues.map(iss => (
                      <option key={iss.id} value={iss.id} className="bg-white dark:bg-slate-900 text-slate-950 dark:text-white">
                        {iss.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.contactLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@telegram_handle, WhatsApp or work email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl input-studio text-sm placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.notesLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'en' ? 'Target markets, metrics or specific goals...' : (lang === 'kz' ? 'Мақсаттар, нарық немесе басты мәселе...' : 'Целевые рынки, задачи или узкие места...')}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl input-studio text-sm placeholder-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 mt-2 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-heading font-bold text-sm tracking-wide shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span>{t.submitting}</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>{t.submitBtn}</span>
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <div className="p-3.5 rounded-xl border border-emerald-400/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{t.successMsg}</span>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-3.5 rounded-xl border border-rose-400/50 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
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
