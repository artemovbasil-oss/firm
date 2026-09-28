import React, { useState } from 'react';
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
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currency, setCurrency] = useState('rub'); // 'rub' | 'usd' | 'kzt'
  const [selectedServices, setSelectedServices] = useState(['websites', 'landings']);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactInitialService, setContactInitialService] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

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

  const showToast = (msg = 'Заявка успешно отправлена! Скоро свяжемся с вами.') => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-primary-500 selection:text-white">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-dark-900 border border-accent-emerald/40 text-accent-emerald shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-accent-emerald shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        onOpenContact={handleOpenContact}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero 
          onOpenContact={handleOpenContact} 
        />
        
        <Services 
          currency={currency}
          onSelectForCalculator={handleSelectForCalculator}
          onOrderService={handleOpenContact}
        />
        
        <Calculator
          currency={currency}
          selectedServices={selectedServices}
          onToggleService={handleToggleService}
          onSuccessLead={() => showToast('Расчет зафиксирован! Менеджер подготовит КП в течение 20 минут.')}
        />

        <Cases 
          onOpenContact={handleOpenContact}
        />

        <ExpressAudit 
          onSuccessLead={() => showToast('Заявка на экспресс-аудит принята! Отчет будет готов за 24 часа.')}
        />

        <Process />

        <TechStack />

        <Testimonials />

        <Faq />
      </main>

      {/* Footer */}
      <Footer onOpenContact={handleOpenContact} />

      {/* Global Lead Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={handleCloseContact}
        initialService={contactInitialService}
        onSuccessLead={() => {
          handleCloseContact();
          showToast('Спасибо за обращение! Мы уже изучаем ваш проект.');
        }}
      />
    </div>
  );
}
