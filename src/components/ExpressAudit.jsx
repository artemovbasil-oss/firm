import React, { useState } from 'react';
import { 
  Search, ShieldAlert, CheckCircle2, Send, 
  Sparkles, FileText, Video, TrendingUp, AlertCircle 
} from 'lucide-react';

export default function ExpressAudit({ onSuccessLead }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('conversion');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const issues = [
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
      targetUrl: targetUrl.trim() || 'Не указан',
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
    <section id="audit" className="py-24 relative bg-dark-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border-primary-500/20 overflow-hidden relative">
          
          {/* Ambient blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left explanation column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-xs text-accent-emerald font-mono uppercase tracking-wider">
                Бесплатно за 24 часа
              </div>

              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                Получите персональный <br />
                <span className="text-gradient-primary">экспресс-аудит проекта</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Отправьте ссылку на ваш действующий сайт, соцсети или продукт. Наши ведущие эксперты разберут узкие места, которые сливают ваш бюджет, и покажут, где спрятаны +100-300% к прибыли.
              </p>

              {/* What client gets */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400 mt-0.5">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Видео-разбор экрана (10–15 минут)</div>
                    <div className="text-xs text-slate-400">Наглядно покажем ошибки в UX, текстах, коде или позиционировании.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent-emerald/10 text-accent-emerald mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">PDF-отчет с 10+ точками роста</div>
                    <div className="text-xs text-slate-400">Конкретные рекомендации по SEO-оптимизации, конверсии и офферам.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Пошаговая дорожная карта внедрения</div>
                    <div className="text-xs text-slate-400">План действий и смета без скрытых переплат и навязанных услуг.</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Form column */}
            <div className="lg:col-span-6 bg-dark-950/80 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
              <h3 className="text-lg font-heading font-bold text-white mb-2">
                Заполните форму для проведения аудита
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Аудит проводится вручную senior-специалистами агентства.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Ссылка на сайт, профиль в соцсети или проект:
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com или @username"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Главная проблема или приоритетная задача:
                  </label>
                  <select
                    value={selectedIssue}
                    onChange={(e) => setSelectedIssue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    {issues.map(iss => (
                      <option key={iss.id} value={iss.id} className="bg-dark-900 text-white">
                        {iss.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Куда прислать готовый аудит (Telegram / Телефон / Email) *:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@telegram_login или +7 (999) 000-00-00"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Дополнительные пожелания (опционально):
                  </label>
                  <input
                    type="text"
                    placeholder="Например: смотрим выход на рынок ОАЭ / запуск нового B2B тарифа"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-emerald via-teal-500 to-accent-cyan hover:opacity-95 text-dark-950 font-bold text-xs sm:text-sm shadow-xl shadow-accent-emerald/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Анализируем данные...</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Получить бесплатный экспресс-аудит</span>
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <div className="p-3 rounded-xl bg-accent-emerald/20 border border-accent-emerald/30 text-accent-emerald text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Заявка принята! Подготовим и пришлем аудит в течение 24 часов.</span>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-3 rounded-xl bg-accent-rose/20 border border-accent-rose/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Произошла ошибка. Напишите нам в Telegram @artemov_basil</span>
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
