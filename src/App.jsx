import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
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
import { INITIAL_SERVICES, INITIAL_CASES } from './data/agencyData';
import { TRANSLATIONS } from './data/translations';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Localization & Theming
  const [lang, setLang] = useState(() => localStorage.getItem('firm_lang') || 'ru');
  const [theme, setTheme] = useState(() => localStorage.getItem('firm_theme') || 'dark');
  const [currency, setCurrency] = useState(() => (lang === 'en' ? 'usd' : 'rub'));

  // Content state (hydrated with backend if available)
  const [servicesList, setServicesList] = useState(INITIAL_SERVICES);
  const [casesList, setCasesList] = useState(INITIAL_CASES);

  // Modals & Panels
  const [selectedServices, setSelectedServices] = useState(['websites', 'landings']);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactInitialService, setContactInitialService] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

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
    document.documentElement.setAttribute('lang', lang);

    if (lang === 'en') {
      document.title = 'FIRM — Digital Production & Growth Agency | Web, Branding, Software, SEO';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Full-cycle digital production agency. We engineer high-converting web platforms, branding, software, investor pitch decks, SEO dominance, and turnkey business packaging.');
      }
    } else {
      document.title = 'FIRM — Агентство цифровых решений | Сайты, Брендинг, ПО, SEO и Упаковка бизнеса';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Создаем высококонверсионные сайты, продающие лендинги, айдентику, презентации и кастомное ПО. Проводим SEO-аудит, упаковываем бизнес и ведем соцсети для взрывного роста продаж.');
      }
    }
  }, [lang]);

  // Check URL hash for admin entry
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }
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
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#090a0f] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Navbar
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        currency={currency}
        setCurrency={setCurrency}
        onOpenContact={handleOpenContact}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero 
          lang={lang}
          onOpenContact={handleOpenContact} 
        />
        
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
          onSuccessLead={() => showToast(lang === 'en' ? 'Estimate saved! Our strategist will reach out within 20 minutes.' : 'Расчет зафиксирован! Менеджер подготовит КП в течение 20 минут.')}
        />

        <Cases 
          lang={lang}
          casesList={casesList}
          onOpenContact={handleOpenContact}
        />

        <ExpressAudit 
          lang={lang}
          onSuccessLead={() => showToast(lang === 'en' ? 'Audit inquiry confirmed! We will deliver it within 24h.' : 'Заявка на экспресс-аудит принята! Отчет будет готов за 24 часа.')}
        />

        <Process 
          lang={lang} 
        />

        <TechStack 
          lang={lang} 
        />

        <Testimonials 
          lang={lang} 
        />

        <Faq 
          lang={lang} 
        />
      </main>

      {/* Footer */}
      <Footer 
        lang={lang}
        servicesList={servicesList}
        onOpenContact={handleOpenContact} 
        onOpenAdmin={() => setIsAdminOpen(true)}
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
          showToast(lang === 'en' ? 'Thank you! We are already analyzing your project.' : 'Спасибо за обращение! Мы уже изучаем ваш проект.');
        }}
      />

      {/* Admin Panel & CRM */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        lang={lang}
      />

    </div>
  );
}
