import React, { useState } from 'react';
import { 
  Globe, Palette, Sparkles, Presentation, Code2, 
  Search, Share2, PackageCheck, Check, Clock, 
  ArrowRight, ShieldCheck, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { SERVICES } from '../data/agencyData';

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

export default function Services({ currency, onSelectForCalculator, onOrderService }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedService, setExpandedService] = useState(null);

  const categories = [
    { id: 'all', name: 'Все услуги (8)' },
    { id: 'dev', name: 'Сайты & ПО' },
    { id: 'design', name: 'Брендинг & Презентации' },
    { id: 'marketing', name: 'Маркетинг, SEO & SMM' },
    { id: 'packaging', name: 'Упаковка 360°' },
  ];

  const filteredServices = SERVICES.filter(service => {
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
    if (currency === 'rub') {
      return `от ${val.toLocaleString('ru-RU')} ₽`;
    } else if (currency === 'usd') {
      return `от $${val.toLocaleString('en-US')}`;
    } else if (currency === 'kzt') {
      return `от ${val.toLocaleString('ru-RU')} ₸`;
    }
    return `от ${val} ₽`;
  };

  return (
    <section id="services" className="py-24 relative bg-dark-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs text-primary-400 font-mono uppercase tracking-wider mb-4">
            Полный цикл digital-услуг
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            Экспертиза, которая двигает <span className="text-gradient-primary">бизнес вперед</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Закрываем все цифровые задачи в режиме одного окна: от стратегии и логотипа до сложных IT-систем и взрывного трафика.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                    : 'bg-dark-850 hover:bg-dark-800 border border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.icon] || Globe;
            const isExpanded = expandedService === service.id;

            return (
              <div
                key={service.id}
                className={`glass-panel rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative group ${
                  service.popular ? 'border-primary-500/30 shadow-lg shadow-primary-500/10' : ''
                }`}
              >
                {/* Badge if popular */}
                {service.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-primary-500/20 border border-primary-500/30 text-primary-300">
                      {service.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Icon & Title */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600/20 to-accent-cyan/20 border border-white/10 flex items-center justify-center text-primary-400 group-hover:scale-110 group-hover:text-cyan-300 transition-all mb-5">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    {service.category}
                  </span>

                  <h3 className="text-lg font-heading font-bold text-white mb-2 leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {service.tagline}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-2 mb-4 pt-3 border-t border-white/5">
                    {service.deliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-accent-emerald shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable details */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2 animate-fadeIn">
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {service.description}
                      </p>
                      <div className="text-[11px] font-semibold text-slate-300 mb-1">Что входит дополнительно:</div>
                      {service.deliverables.slice(3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                      <div className="pt-2 text-[11px] text-slate-400">
                        <strong className="text-slate-300">Для кого:</strong> {service.targetAudience}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedService(isExpanded ? null : service.id)}
                    className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 mt-2"
                  >
                    <span>{isExpanded ? 'Свернуть состав' : 'Подробный состав'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Footer of card */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {service.timeline}
                    </span>
                    <span className="font-heading font-bold text-white text-sm">
                      {formatPrice(service.basePrice)}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => onSelectForCalculator(service.id)}
                      className="flex-1 py-2 px-3 rounded-lg bg-dark-850 hover:bg-dark-800 border border-white/10 hover:border-primary-500/30 text-xs font-medium text-slate-200 transition-colors text-center"
                    >
                      В калькулятор
                    </button>
                    <button
                      onClick={() => onOrderService(service.title)}
                      className="py-2 px-3 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold transition-colors flex items-center justify-center"
                      title="Заказать услугу"
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
