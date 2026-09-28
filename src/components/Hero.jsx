import React from 'react';
import { 
  ArrowRight, Sparkles, Shield, Rocket, 
  TrendingUp, Award, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function Hero({ onOpenContact }) {
  const highlightPills = [
    'Сайты и сервисы',
    'Брендинг & Айдентика',
    'Продающие лендинги',
    'Презентации & Decks',
    'Кастомное ПО & SaaS',
    'SEO & Аудит',
    'SMM & Контент',
    'Упаковка бизнеса 360°'
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Dynamic ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-accent-violet/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[320px] h-[320px] bg-accent-cyan/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top pill badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-850/80 border border-white/10 text-xs sm:text-sm text-slate-300 backdrop-blur-md shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-accent-emerald"></span>
            <span className="font-medium text-white">FIRM Digital Agency</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Сайты · Брендинг · ПО · Упаковка</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white leading-[1.12]">
            Превращаем технологии и смыслы в{' '}
            <span className="text-gradient-primary">
              взрывной рост продаж
            </span>{' '}
            вашего бизнеса
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Создаем технологичные сайты, продающие лендинги, премиальный брендинг, презентации для инвесторов и кастомное ПО. Обеспечиваем поток заявок через аудит, SEO-продвижение и SMM.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#calculator"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent-violet hover:from-primary-500 hover:to-accent-violet text-white font-semibold text-base shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Рассчитать стоимость проекта</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#audit"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-dark-850/90 hover:bg-dark-800 border border-white/10 hover:border-white/20 text-slate-200 hover:text-white font-medium text-base transition-all flex items-center justify-center gap-2"
            >
              <span>Бесплатный экспресс-аудит</span>
            </a>
          </div>

          {/* Quick core service tags */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-3xl mx-auto">
            {highlightPills.map((pill, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-lg bg-dark-900/60 border border-white/5 text-xs text-slate-300 font-mono"
              >
                # {pill}
              </span>
            ))}
          </div>

        </div>

        {/* Stats Grid */}
        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-400">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">150+</div>
                <div className="text-xs sm:text-sm text-slate-400">Успешных проектов</div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-emerald/10 text-accent-emerald">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">x3.4</div>
                <div className="text-xs sm:text-sm text-slate-400">Средний рост конверсии</div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-cyan/10 text-accent-cyan">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">$18M+</div>
                <div className="text-xs sm:text-sm text-slate-400">Привлечено инвест-деками</div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-violet/10 text-accent-violet">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">100%</div>
                <div className="text-xs sm:text-sm text-slate-400">NDA & соблюдение сроков</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
