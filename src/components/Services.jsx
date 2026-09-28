import React, { useState } from 'react';
import { 
  Globe, Palette, Sparkles, Presentation, Code2, 
  Search, Share2, PackageCheck, Check, Clock, 
  ArrowRight, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

const iconMap = {
  Globe,
  Palette,
  Sparkles,
  Presentation,
  Code2,
  Search,
  Share2,
  PackageCheck
};

export default function Services({ 
  lang, 
  currency, 
  servicesList = [], 
  onSelectForCalculator, 
  onOrderService 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedService, setExpandedService] = useState(null);
  const t = TRANSLATIONS[lang].services;

  const categories = [
    { id: 'all', name: t.all },
    { id: 'dev', name: t.dev },
    { id: 'design', name: t.design },
    { id: 'marketing', name: t.marketing },
    { id: 'packaging', name: t.packaging },
  ];

  const filteredServices = servicesList.filter(service => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'dev') return service.id === 'websites' || service.id === 'software';
    if (selectedCategory === 'design') return service.id === 'branding' || service.id === 'presentations';
    if (selectedCategory === 'marketing') return service.id === 'landings' || service.id === 'seo_audit' || service.id === 'smm';
    if (selectedCategory === 'packaging') return service.id === 'packaging';
    return true;
  });

  const formatPrice = (priceObj) => {
    if (!priceObj) return '';
    const val = priceObj[currency] || priceObj.rub;
    if (lang === 'kz') {
      if (currency === 'kzt') return `${val.toLocaleString('ru-RU')} ₸ бастап`;
      if (currency === 'usd') return `$${val.toLocaleString('en-US')} бастап`;
      return `${val.toLocaleString('ru-RU')} ₽ бастап`;
    }
    const prefix = lang === 'en' ? 'from ' : 'от ';
    if (currency === 'rub') {
      return `${prefix}${val.toLocaleString('ru-RU')} ₽`;
    } else if (currency === 'usd') {
      return `${prefix}$${val.toLocaleString('en-US')}`;
    } else if (currency === 'kzt') {
      return `${prefix}${val.toLocaleString('ru-RU')} ₸`;
    }
    return `${prefix}${val} ₽`;
  };

  const getLocalized = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.ru || '';
  };

  return (
    <section id="services" className="py-20 relative border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider mb-3">
            {t.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {t.desc}
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.icon] || Globe;
            const isExpanded = expandedService === service.id;
            const title = getLocalized(service.title);
            const tagline = getLocalized(service.tagline);
            const description = getLocalized(service.description);
            const badge = getLocalized(service.badge);
            const deliverables = service.deliverables?.[lang] || service.deliverables?.ru || [];
            const timeline = getLocalized(service.timeline);
            const audience = getLocalized(service.targetAudience);

            return (
              <div
                key={service.id}
                className="card-studio rounded-2xl p-6 flex flex-col justify-between relative group"
              >
                <div>
                  {/* Icon & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-slate-200">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {badge && (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                        {badge}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    {getLocalized(service.category)}
                  </span>

                  <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {tagline}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-1.5 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    {deliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-slate-800 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-fadeIn">
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                        {description}
                      </p>
                      {deliverables.slice(3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                      <div className="pt-2 text-[11px] text-slate-500">
                        <strong className="text-slate-700 dark:text-slate-300">{t.forWhom}</strong> {audience}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedService(isExpanded ? null : service.id)}
                    className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-1 mt-1 transition-colors"
                  >
                    <span>{isExpanded ? t.collapseBtn : t.detailsBtn}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Footer of card */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {timeline}
                    </span>
                    <span className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                      {formatPrice(service.basePrice)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectForCalculator(service.id)}
                      className="flex-1 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 btn-studio transition-colors text-center"
                    >
                      {t.calcBtn}
                    </button>
                    <button
                      onClick={() => onOrderService(title)}
                      className="py-2 px-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold btn-studio transition-colors flex items-center justify-center"
                      title={t.orderBtn}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
