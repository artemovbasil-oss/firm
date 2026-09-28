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
    <section id="services" className="py-28 relative border-t border-slate-200/80 dark:border-white/10 ambient-spotlight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white"></span>
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.08]">
            {t.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.desc}
          </p>

          {/* Category Tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium btn-studio transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-md'
                    : 'border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service, sIndex) => {
            const IconComponent = iconMap[service.icon] || Globe;
            const isExpanded = expandedService === service.id;
            const title = getLocalized(service.title);
            const tagline = getLocalized(service.tagline);
            const description = getLocalized(service.description);
            const badge = getLocalized(service.badge);
            const deliverables = service.deliverables?.[lang] || service.deliverables?.ru || [];
            const timeline = getLocalized(service.timeline);
            const audience = getLocalized(service.targetAudience);
            const ghostIndex = String(sIndex + 1).padStart(2, '0');

            return (
              <div
                key={service.id}
                className="card-studio-hero rounded-3xl p-7 flex flex-col justify-between relative group overflow-hidden"
              >
                {/* Ghost index in top right */}
                <span className="absolute top-5 right-6 text-xl font-mono font-bold text-slate-200 dark:text-slate-800/80 group-hover:text-slate-400 dark:group-hover:text-slate-600 transition-colors pointer-events-none select-none">
                  {ghostIndex}
                </span>

                <div>
                  {/* Icon & Category */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white shadow-sm group-hover:scale-105 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {badge && (
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {badge}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5">
                    {getLocalized(service.category)}
                  </span>

                  <h3 className="text-lg sm:text-xl font-heading font-bold text-slate-950 dark:text-white mb-2 leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                    {tagline}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-2 mb-4 pt-4 border-t border-slate-100 dark:border-white/10">
                    {deliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-slate-900 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 space-y-2.5 animate-fadeIn">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                        {description}
                      </p>
                      {deliverables.slice(3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                      <div className="pt-2 text-xs text-slate-500">
                        <strong className="text-slate-700 dark:text-slate-300">{t.forWhom}</strong> {audience}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedService(isExpanded ? null : service.id)}
                    className="text-xs sm:text-sm text-slate-500 hover:text-slate-950 dark:hover:text-white font-medium flex items-center gap-1.5 mt-2 transition-colors"
                  >
                    <span>{isExpanded ? t.collapseBtn : t.detailsBtn}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Footer of card */}
                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/10">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {timeline}
                    </span>
                    <span className="font-heading font-extrabold text-slate-950 dark:text-white text-base sm:text-lg">
                      {formatPrice(service.basePrice)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectForCalculator(service.id)}
                      className="flex-1 py-2.5 px-3.5 rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 btn-studio transition-colors text-center"
                    >
                      {t.calcBtn}
                    </button>
                    <button
                      onClick={() => onOrderService(title)}
                      className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs sm:text-sm font-bold btn-studio transition-colors flex items-center justify-center shadow-sm"
                      title={t.orderBtn}
                    >
                      <ArrowRight className="w-4 h-4" />
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
