import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarqueeTicker from './components/MarqueeTicker';
import Services from './components/Services';
import Calculator from './components/Calculator';
import Cases from './components/Cases';
import ExpressAudit from './components/ExpressAudit';
import Process from './components/Process';
import TechStack from './components/TechStack';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import AdminPanel from './components/AdminPanel';
import CaseStudyDetail from './components/CaseStudyDetail';
import { INITIAL_SERVICES, INITIAL_CASES, TECH_STACK, TESTIMONIALS } from './data/agencyData';
import { TRANSLATIONS } from './data/translations';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Localization & Theming
  const [lang, setLang] = useState(() => localStorage.getItem('firm_lang') || 'ru');
  const [theme, setTheme] = useState(() => localStorage.getItem('firm_theme') || 'dark');
  
  // Currency strictly tied to language: KZ -> KZT, RU -> RUB, EN -> USD
  const currency = lang === 'kz' ? 'kzt' : lang === 'en' ? 'usd' : 'rub';

  // Content state (hydrated with backend if available)
  const [servicesList, setServicesList] = useState(INITIAL_SERVICES);
  const [casesList, setCasesList] = useState(INITIAL_CASES);
  const [techStackList, setTechStackList] = useState(TECH_STACK);
  const [testimonialsList, setTestimonialsList] = useState(TESTIMONIALS);

  // Modals & Panels
  const [selectedServices, setSelectedServices] = useState(['websites', 'landings']);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactInitialService, setContactInitialService] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isTickerSticky, setIsTickerSticky] = useState(false);

  // Case Study Routing state (/cases/:slug or #/cases/:slug)
  const getSlugFromUrl = () => {
    if (typeof window === 'undefined') return null;
    const path = window.location.pathname;
    if (path.startsWith('/cases/')) {
      const slug = path.replace('/cases/', '').replace(/\/$/, '');
      if (slug) return slug;
    }
    const hash = window.location.hash;
    if (hash.startsWith('#/cases/')) {
      const slug = hash.replace('#/cases/', '');
      if (slug) return slug;
    }
    return null;
  };

  const [activeCaseSlug, setActiveCaseSlug] = useState(getSlugFromUrl);

  useEffect(() => {
    const handlePopState = () => {
      setActiveCaseSlug(getSlugFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenCase = (slugOrId) => {
    const targetCase = casesList.find(c => c.slug === slugOrId || String(c.id) === String(slugOrId));
    const slug = targetCase?.slug || slugOrId;
    setActiveCaseSlug(slug);
    window.history.pushState(null, '', `/cases/${slug}`);
  };

  const handleCloseCase = () => {
    setActiveCaseSlug(null);
    window.history.pushState(null, '', '/#cases');
    setTimeout(() => {
      const el = document.getElementById('cases');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const activeCaseItem = casesList.find(c => c.slug === activeCaseSlug || String(c.id) === String(activeCaseSlug));

  // Monitor scroll for sticky ticker & navbar adjustment
  useEffect(() => {
    const handleScroll = () => {
      setIsTickerSticky(window.scrollY > 480);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    localStorage.setItem('firm_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  // Update lang & SEO title/meta
  useEffect(() => {
    localStorage.setItem('firm_lang', lang);
    document.documentElement.setAttribute('lang', lang === 'kz' ? 'kk' : lang);

    if (lang === 'en') {
      document.title = 'ARTX — Digital Production & Growth Agency | Web, Branding, Software, SEO';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Full-cycle digital production agency. We engineer high-converting web platforms, branding, software, investor pitch decks, SEO dominance, and turnkey business packaging.');
      }
    } else if (lang === 'kz') {
      document.title = 'ARTX — Сандық шешімдер агенттігі | Сайттар, Брендинг, Бағдарламалық қамтамасыз ету, SEO';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Конверсиясы жоғары сайттар, сатушы лендингтер, айдентика, презентациялар және жеке бағдарламалық қамтамасыз ету. Бизнесті 360° орап, SEO мен SMM арқылы сатылымды еселейміз.');
      }
    } else {
      document.title = 'ARTX — Агентство цифровых решений | Сайты, Брендинг, ПО, SEO и Упаковка бизнеса';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Создаем высококонверсионные сайты, продающие лендинги, айдентику, презентации и кастомное ПО. Проводим SEO-аудит, упаковываем бизнес и ведем соцсети для взрывного роста продаж.');
      }
    }
  }, [lang]);

  // Check URL hash, path, and hotkey for admin entry
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setIsAdminOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Hydrate content from backend API if available
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.cases) && data.cases.length > 0) {
            setCasesList(data.cases);
          }
          if (Array.isArray(data.services) && data.services.length > 0) {
            setServicesList(data.services);
          }
          if (Array.isArray(data.techStack) && data.techStack.length > 0) {
            setTechStackList(data.techStack);
          }
          if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
            setTestimonialsList(data.testimonials);
          }
        }
      } catch {
        // Fallback to static initial data
      }
    };
    fetchContent();
  }, []);

  const handleOpenContact = (serviceTitle = '') => {
    setContactInitialService(serviceTitle);
    setIsContactOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactOpen(false);
    setContactInitialService('');
  };

  const handleToggleService = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectForCalculator = (serviceId) => {
    if (!selectedServices.includes(serviceId)) {
      setSelectedServices(prev => [...prev, serviceId]);
    }
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#080808] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      {!activeCaseItem && (
        <Navbar
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
          onOpenContact={handleOpenContact}
          onOpenAdmin={() => setIsAdminOpen(true)}
          isTickerSticky={isTickerSticky}
        />
      )}

      {/* Main Content */}
      {activeCaseItem ? (
        <CaseStudyDetail 
          caseItem={activeCaseItem}
          allCases={casesList}
          lang={lang}
          onClose={handleCloseCase}
          onSelectCase={handleOpenCase}
          onOpenContact={handleOpenContact}
        />
      ) : (
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          <Hero 
            lang={lang}
            onOpenContact={handleOpenContact} 
          />

          {/* Running Marquee Ticker: sits directly below the Hero fold and docks stickily when scrolled */}
          <div className="relative w-full max-w-full z-20">
            {isTickerSticky && (
              <div className="h-12 sm:h-14 w-full" aria-hidden="true" />
            )}
            <MarqueeTicker lang={lang} isSticky={isTickerSticky} />
          </div>
          
          <Services 
            lang={lang}
            currency={currency}
            servicesList={servicesList}
            onSelectForCalculator={handleSelectForCalculator}
            onOrderService={handleOpenContact}
          />
          
          <Calculator
            lang={lang}
            currency={currency}
            servicesList={servicesList}
            selectedServices={selectedServices}
            onToggleService={handleToggleService}
            onSuccessLead={() => showToast(lang === 'en' ? 'Estimate saved! Our strategist will reach out within 20 minutes.' : (lang === 'kz' ? 'Есеп сақталды! Маман 20 минут ішінде хабарласады.' : 'Расчет зафиксирован! Менеджер подготовит КП в течение 20 минут.'))}
          />

          <Cases 
            lang={lang}
            casesList={casesList}
            onOpenContact={handleOpenContact}
            onSelectCase={handleOpenCase}
          />

          <ExpressAudit 
            lang={lang}
            onSuccessLead={() => showToast(lang === 'en' ? 'Audit inquiry confirmed! We will deliver it within 24h.' : (lang === 'kz' ? 'Өтінім қабылданды! Аудит 24 сағат ішінде дайын болады.' : 'Заявка на экспресс-аудит принята! Отчет будет готов за 24 часа.'))}
          />

        <Process 
          lang={lang} 
        />

        <TechStack 
          lang={lang} 
          techStackList={techStackList}
        />

        <Testimonials 
          lang={lang} 
          testimonialsList={testimonialsList}
        />

        <Faq 
          lang={lang} 
        />
      </main>
    )}

      {/* Footer */}
      <Footer 
        lang={lang}
        servicesList={servicesList}
        onOpenContact={handleOpenContact} 
      />

      {/* Global Contact Modal */}
      <ContactModal
        lang={lang}
        servicesList={servicesList}
        isOpen={isContactOpen}
        onClose={handleCloseContact}
        initialService={contactInitialService}
        onSuccessLead={() => {
          handleCloseContact();
          showToast(lang === 'en' ? 'Thank you! We are already analyzing your project.' : (lang === 'kz' ? 'Рақмет! Біз сіздің жобаңызды қарастырып жатырмыз.' : 'Спасибо за обращение! Мы уже изучаем ваш проект.'));
        }}
      />

      {/* Admin Panel & CRM */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        lang={lang}
        casesList={casesList}
        onUpdateCases={(newCases) => setCasesList(newCases)}
        techStackList={techStackList}
        onUpdateTechStack={(newStack) => setTechStackList(newStack)}
        testimonialsList={testimonialsList}
        onUpdateTestimonials={(newTestimonials) => setTestimonialsList(newTestimonials)}
      />

    </div>
  );
}
