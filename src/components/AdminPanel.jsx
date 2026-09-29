import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Lock, ShieldCheck, Users, Briefcase, Settings, 
  Plus, Trash2, Edit3, Save, ExternalLink, Download, 
  Search, CheckCircle2, AlertCircle, Clock, ChevronRight, 
  Phone, Send, MessageSquare, ArrowLeft, Eye, EyeOff
} from 'lucide-react';
import StudioSelect from './ui/StudioSelect';

export default function AdminPanel({ isOpen, onClose, lang = 'ru', casesList = [], onUpdateCases }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('crm'); // 'crm' | 'cases' | 'services' | 'settings'

  // Leads CRM state
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadFilter, setLeadFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');

  // Content state
  const [cases, setCases] = useState(() => (Array.isArray(casesList) && casesList.length > 0 ? casesList : []));
  const [services, setServices] = useState([]);
  const [editingCase, setEditingCase] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (Array.isArray(casesList) && casesList.length > 0 && cases.length === 0) {
      setCases(casesList);
    }
  }, [casesList]);

  useEffect(() => {
    const token = localStorage.getItem('firm_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('firm_admin_token', data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setAuthError(data.error || 'Неверный пароль');
      }
    } catch {
      setAuthError('Ошибка подключения к серверу');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('firm_admin_token');
    setIsAuthenticated(false);
    setPassword('');
  };

  const fetchData = async () => {
    try {
      // Fetch leads
      const leadsRes = await fetch('/api/leads');
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
      }

      // Fetch dynamic content
      const contentRes = await fetch('/api/content');
      if (contentRes.ok) {
        const content = await contentRes.json();
        if (Array.isArray(content.cases) && content.cases.length > 0) {
          setCases(content.cases);
          if (onUpdateCases) onUpdateCases(content.cases);
        }
        if (Array.isArray(content.services) && content.services.length > 0) {
          setServices(content.services);
        }
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const addLeadNote = async (leadId) => {
    if (!newNote.trim()) return;
    const noteObj = {
      id: Date.now().toString(),
      text: newNote.trim(),
      createdAt: new Date().toISOString()
    };
    const currentNotes = selectedLead.notes || [];
    const updatedNotes = [noteObj, ...currentNotes];

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes: updatedNotes } : l));
        setSelectedLead(prev => ({ ...prev, notes: updatedNotes }));
        setNewNote('');
      }
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const deleteLead = async (leadId) => {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) return;
    try {
      const res = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(null);
        }
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const saveAllContent = async (updatedCases, updatedServices) => {
    try {
      const casesToSave = updatedCases || cases;
      const servicesToSave = updatedServices || services;

      if (updatedCases && onUpdateCases) {
        onUpdateCases(casesToSave);
      }

      const payload = {
        cases: casesToSave,
        services: servicesToSave,
        updatedAt: new Date().toISOString()
      };
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save content:', err);
    }
  };

  const exportLeadsCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Дата', 'Тип', 'Имя', 'Контакт', 'Услуга', 'Смета', 'Статус'];
    const rows = leads.map(l => [
      l.id,
      new Date(l.createdAt).toLocaleDateString(),
      `"${l.type || ''}"`,
      `"${l.name || ''}"`,
      `"${l.contact || ''}"`,
      `"${l.service || (l.selectedServices ? l.selectedServices.join('; ') : '')}"`,
      `"${l.estimatedPrice || l.budget || ''}"`,
      l.status || 'new'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `firm_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statuses = [
    { id: 'new', label: 'Новая', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    { id: 'in_progress', label: 'В обработке', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    { id: 'proposal_sent', label: 'КП отправлено', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    { id: 'deal', label: 'Сделка / Проект', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    { id: 'archived', label: 'Архив / Отказ', color: 'bg-slate-500/15 text-slate-400 border-slate-500/30' }
  ];

  const filteredLeads = leads.filter(l => {
    const matchesFilter = leadFilter === 'all' || (l.status || 'new') === leadFilter;
    const matchesSearch = !searchQuery.trim() || 
      (l.name && l.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.contact && l.contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.service && l.service.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col overflow-hidden"
        >
      
          {/* Top Navbar */}
          <div className="h-16 px-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться на сайт</span>
          </button>
          <div className="h-4 w-[1px] bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-white text-base tracking-wider">FIRM</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">CRM & Control</span>
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs">
              <button
                onClick={() => setActiveTab('crm')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'crm' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                CRM Заявки ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('cases')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'cases' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Портфолио
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'settings' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Настройки
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono px-3 py-1.5 rounded-lg border border-rose-900/30"
            >
              Выйти
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/40">
        
        {/* Auth Gate Screen */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-300 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-2">
              Вход в панель управления
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Панель CRM и управления портфолио агентства FIRM. Введите пароль администратора.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                required
                placeholder="Пароль администратора (по умолч.: firm2026)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl input-studio text-sm focus:border-slate-400"
              />

              {authError && (
                <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 p-2.5 rounded-lg">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-sm btn-studio transition-colors"
              >
                Войти в CRM
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs */
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* TAB 1: CRM & LEADS */}
            {activeTab === 'crm' && (
              <div className="space-y-6">
                
                {/* CRM Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Status Filters */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setLeadFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        leadFilter === 'all' ? 'bg-white text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      Все ({leads.length})
                    </button>
                    {statuses.map(st => {
                      const count = leads.filter(l => (l.status || 'new') === st.id).length;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setLeadFilter(st.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            leadFilter === st.id ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          {st.label} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* Search & Export */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Поиск по имени, контакту..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                      />
                    </div>
                    <button
                      onClick={exportLeadsCSV}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 shrink-0"
                      title="Экспорт в CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </button>
                  </div>
                </div>

                {/* Leads Grid & Drawer */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left List of Leads (7 or 12 cols) */}
                  <div className={`${selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
                    {filteredLeads.length === 0 ? (
                      <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 text-sm">
                        Заявок по выбранному фильтру не найдено.
                      </div>
                    ) : (
                      filteredLeads.map((lead) => {
                        const st = statuses.find(s => s.id === (lead.status || 'new')) || statuses[0];
                        const isSelected = selectedLead && selectedLead.id === lead.id;

                        return (
                          <div
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className={`p-4 rounded-2xl bg-slate-950 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isSelected ? 'border-slate-500 shadow-lg' : 'border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${st.color}`}>
                                  {st.label}
                                </span>
                                <span className="text-xs font-mono text-slate-500">
                                  {new Date(lead.createdAt).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}
                                </span>
                                <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                                  {lead.type || 'Контакт'}
                                </span>
                              </div>

                              <div className="text-sm font-semibold text-white truncate">
                                {lead.name || 'Без имени'} — <span className="text-cyan-400">{lead.contact}</span>
                              </div>

                              <div className="text-xs text-slate-400 truncate">
                                {lead.service || (lead.selectedServices ? lead.selectedServices.join(', ') : (lead.targetUrl ? `Аудит: ${lead.targetUrl}` : 'Проект'))}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {lead.estimatedPrice && (
                                <span className="text-xs font-mono font-bold text-emerald-400">
                                  {lead.estimatedPrice}
                                </span>
                              )}
                              <ChevronRight className="w-4 h-4 text-slate-600" />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Right Detail Lead Drawer (5 cols) */}
                  {selectedLead && (
                    <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-5 sticky top-6">
                      
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <div className="text-xs font-mono text-slate-500">Детали заявки</div>
                          <h4 className="text-lg font-heading font-bold text-white">
                            {selectedLead.name || 'Контакт'}
                          </h4>
                        </div>
                        <button
                          onClick={() => setSelectedLead(null)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Contact Channels */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2">
                        <div className="text-xs font-mono text-slate-400">Канал связи:</div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white selection:bg-white selection:text-black">
                            {selectedLead.contact}
                          </span>
                          <div className="flex gap-2">
                            {selectedLead.contact.includes('@') ? (
                              <a
                                href={`https://t.me/${selectedLead.contact.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 text-xs font-mono border border-cyan-800 flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" />
                                <span>TG</span>
                              </a>
                            ) : (
                              <a
                                href={`tel:${selectedLead.contact}`}
                                className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 text-xs font-mono border border-emerald-800 flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Вызов</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div>
                        <StudioSelect
                          label="Статус воронки"
                          value={selectedLead.status || 'new'}
                          onChange={(val) => updateLeadStatus(selectedLead.id, val)}
                          options={statuses.map(st => ({ value: st.id, label: st.label }))}
                        />
                      </div>

                      {/* Project info details */}
                      <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                        {selectedLead.service && (
                          <div><strong className="text-white">Услуга:</strong> {selectedLead.service}</div>
                        )}
                        {selectedLead.budget && (
                          <div><strong className="text-white">Планируемый бюджет:</strong> {selectedLead.budget}</div>
                        )}
                        {selectedLead.estimatedPrice && (
                          <div><strong className="text-white">Расчетная смета:</strong> {selectedLead.estimatedPrice} ({selectedLead.estimatedDays})</div>
                        )}
                        {selectedLead.targetUrl && (
                          <div>
                            <strong className="text-white">Сайт для аудита:</strong>{' '}
                            <a href={selectedLead.targetUrl.startsWith('http') ? selectedLead.targetUrl : `https://${selectedLead.targetUrl}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                              {selectedLead.targetUrl}
                            </a>
                          </div>
                        )}
                        {selectedLead.issue && (
                          <div><strong className="text-white">Проблема:</strong> {selectedLead.issue}</div>
                        )}
                        {(selectedLead.comment || selectedLead.message) && (
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 mt-2">
                            <div className="text-[11px] font-mono text-slate-400 mb-1">Комментарий клиента:</div>
                            <div className="text-slate-200">{selectedLead.comment || selectedLead.message}</div>
                          </div>
                        )}
                      </div>

                      {/* Internal Notes / CRM History */}
                      <div className="pt-3 border-t border-slate-800 space-y-3">
                        <div className="text-xs font-mono text-slate-400">Заметки менеджера:</div>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Добавить комментарий..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addLeadNote(selectedLead.id)}
                            className="flex-1 px-3 py-1.5 rounded-lg input-studio text-xs placeholder-slate-500"
                          />
                          <button
                            onClick={() => addLeadNote(selectedLead.id)}
                            className="px-3 py-1.5 rounded-lg bg-white text-slate-950 font-bold text-xs btn-studio"
                          >
                            Записать
                          </button>
                        </div>

                        <div className="space-y-2 max-h-36 overflow-y-auto">
                          {(selectedLead.notes || []).map((n, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                              <div className="text-slate-200">{n.text}</div>
                              <div className="text-[10px] font-mono text-slate-500 mt-1">
                                {new Date(n.createdAt).toLocaleString('ru-RU')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delete Lead Button */}
                      <div className="pt-2 border-t border-slate-800 flex justify-end">
                        <button
                          onClick={() => deleteLead(selectedLead.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Удалить заявку</span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}

            {/* TAB 2: PORTFOLIO & CASES MANAGER */}
            {activeTab === 'cases' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-white">
                      Управление кейсами портфолио
                    </h3>
                    <p className="text-xs text-slate-400">
                      Редактируйте тексты, метрики, теги и видимость кейсов на сайте.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const newId = Date.now();
                      const newC = {
                        id: newId,
                        title: { ru: 'Новый кейс', en: 'New Case Study', kz: 'Жаңа кейс' },
                        client: { ru: 'Клиент', en: 'Client Name', kz: 'Клиент' },
                        badge: { ru: '+300% ROI', en: '+300% ROI', kz: '+300% ROI' },
                        summary: { 
                          ru: 'Краткое описание проекта и достигнутых результатов.', 
                          en: 'Project summary and quantifiable outcomes achieved.',
                          kz: 'Жобаның қысқаша сипаттамасы мен қол жеткізілген нәтижелер.'
                        },
                        metrics: [
                          { label: { ru: 'Рост выручки', en: 'Revenue Surge', kz: 'Табыс өсімі' }, value: '+300%' }
                        ],
                        services: { ru: ['Разработка сайтов'], en: ['Web Development'], kz: ['Сайттар әзірлеу'] },
                        tags: ['SaaS', 'Branding'],
                        colorMode: 'thermal',
                        published: true
                      };
                      setEditingCase(newC);
                    }}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить кейс</span>
                  </button>
                </div>

                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Изменения успешно сохранены на сервере!</span>
                  </div>
                )}

                {/* Cases List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cases.map((c) => {
                    const heroMetric = c.metrics && c.metrics[0];
                    return (
                      <div
                        key={c.id}
                        className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                              {c.badge?.[lang] || c.badge?.ru || 'Результат'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
                                {c.colorMode || 'thermal'}
                              </span>
                              <button
                                onClick={() => {
                                  const updated = cases.map(it => it.id === c.id ? { ...it, published: it.published === false ? true : false } : it);
                                  setCases(updated);
                                  saveAllContent(updated);
                                }}
                                className={`p-1 rounded ${c.published !== false ? 'text-emerald-400' : 'text-slate-600'}`}
                                title={c.published !== false ? 'Опубликован' : 'Черновик'}
                              >
                                {c.published !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                              {c.client?.[lang] || c.client?.ru || 'Клиент'}
                            </div>
                            <h4 className="text-base font-bold text-white mt-0.5">
                              {c.title?.[lang] || c.title?.ru || 'Без названия'}
                            </h4>
                          </div>

                          {/* Hero Metric Pill */}
                          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                            <span className="text-lg font-heading font-black text-white tabular-nums">
                              {heroMetric ? heroMetric.value : '+340%'}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 truncate max-w-[140px]">
                              {heroMetric ? (heroMetric.label?.[lang] || heroMetric.label?.ru || 'Метрика') : 'Рост'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {c.summary?.[lang] || c.summary?.ru || ''}
                          </p>

                          {/* Tags */}
                          {c.tags && c.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {c.tags.map((t, tidx) => (
                                <span key={tidx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          <button
                            onClick={() => setEditingCase(c)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-white flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Редактировать</span>
                          </button>

                          <button
                            onClick={() => {
                              if (!confirm('Удалить этот кейс?')) return;
                              const updated = cases.filter(it => it.id !== c.id);
                              setCases(updated);
                              saveAllContent(updated);
                            }}
                            className="text-xs text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Case Edit Modal */}
                {editingCase && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                        <div>
                          <h4 className="text-lg font-heading font-bold text-white">
                            {editingCase.title?.ru || 'Редактирование кейса'}
                          </h4>
                          <span className="text-xs text-slate-400 font-mono">ID: {editingCase.id}</span>
                        </div>
                        <button onClick={() => setEditingCase(null)} className="text-slate-400 hover:text-white p-1">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* 1. Client & Titles */}
                      <div className="space-y-3">
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">1. Заказчик и Название проекта</div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Клиент (RU):</label>
                            <input
                              type="text"
                              value={editingCase.client?.ru || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                client: { ...editingCase.client, ru: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Client (EN):</label>
                            <input
                              type="text"
                              value={editingCase.client?.en || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                client: { ...editingCase.client, en: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Тапсырыс беруші (KZ):</label>
                            <input
                              type="text"
                              value={editingCase.client?.kz || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                client: { ...editingCase.client, kz: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Название (RU):</label>
                            <input
                              type="text"
                              value={editingCase.title?.ru || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                title: { ...editingCase.title, ru: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Title (EN):</label>
                            <input
                              type="text"
                              value={editingCase.title?.en || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                title: { ...editingCase.title, en: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Атауы (KZ):</label>
                            <input
                              type="text"
                              value={editingCase.title?.kz || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                title: { ...editingCase.title, kz: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. Hero Metric & Badge */}
                      <div className="space-y-3 pt-3 border-t border-slate-800">
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">2. Монументальная метрика и Бейдж</div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-amber-400 mb-1">Главная цифра:</label>
                            <input
                              type="text"
                              placeholder="+340%"
                              value={editingCase.metrics?.[0]?.value || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const curMetrics = editingCase.metrics || [{}];
                                const updatedMetrics = [{ ...curMetrics[0], value: val }, ...curMetrics.slice(1)];
                                setEditingCase({ ...editingCase, metrics: updatedMetrics });
                              }}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Подпись метрики (RU):</label>
                            <input
                              type="text"
                              placeholder="Рост выручки"
                              value={editingCase.metrics?.[0]?.label?.ru || (typeof editingCase.metrics?.[0]?.label === 'string' ? editingCase.metrics[0].label : '')}
                              onChange={(e) => {
                                const val = e.target.value;
                                const curMetrics = editingCase.metrics || [{}];
                                const curLabel = typeof curMetrics[0].label === 'object' ? curMetrics[0].label : {};
                                const updatedMetrics = [{ ...curMetrics[0], label: { ...curLabel, ru: val } }, ...curMetrics.slice(1)];
                                setEditingCase({ ...editingCase, metrics: updatedMetrics });
                              }}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Metric label (EN):</label>
                            <input
                              type="text"
                              placeholder="Revenue Growth"
                              value={editingCase.metrics?.[0]?.label?.en || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const curMetrics = editingCase.metrics || [{}];
                                const curLabel = typeof curMetrics[0].label === 'object' ? curMetrics[0].label : {};
                                const updatedMetrics = [{ ...curMetrics[0], label: { ...curLabel, en: val } }, ...curMetrics.slice(1)];
                                setEditingCase({ ...editingCase, metrics: updatedMetrics });
                              }}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Метрика сипаттамасы (KZ):</label>
                            <input
                              type="text"
                              placeholder="Табыс өсімі"
                              value={editingCase.metrics?.[0]?.label?.kz || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const curMetrics = editingCase.metrics || [{}];
                                const curLabel = typeof curMetrics[0].label === 'object' ? curMetrics[0].label : {};
                                const updatedMetrics = [{ ...curMetrics[0], label: { ...curLabel, kz: val } }, ...curMetrics.slice(1)];
                                setEditingCase({ ...editingCase, metrics: updatedMetrics });
                              }}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Бейдж карточки (RU):</label>
                            <input
                              type="text"
                              value={editingCase.badge?.ru || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                badge: { ...editingCase.badge, ru: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Badge (EN):</label>
                            <input
                              type="text"
                              value={editingCase.badge?.en || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                badge: { ...editingCase.badge, en: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Бейдж (KZ):</label>
                            <input
                              type="text"
                              value={editingCase.badge?.kz || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                badge: { ...editingCase.badge, kz: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. Summary Descriptions */}
                      <div className="space-y-3 pt-3 border-t border-slate-800">
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">3. Описание и результаты</div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Описание (RU):</label>
                            <textarea
                              rows="3"
                              value={editingCase.summary?.ru || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                summary: { ...editingCase.summary, ru: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white resize-none"
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Summary (EN):</label>
                            <textarea
                              rows="3"
                              value={editingCase.summary?.en || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                summary: { ...editingCase.summary, en: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white resize-none"
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Сипаттамасы (KZ):</label>
                            <textarea
                              rows="3"
                              value={editingCase.summary?.kz || ''}
                              onChange={(e) => setEditingCase({
                                ...editingCase,
                                summary: { ...editingCase.summary, kz: e.target.value }
                              })}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white resize-none"
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      {/* 4. Shader Theme & Tags */}
                      <div className="space-y-3 pt-3 border-t border-slate-800">
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">4. Шейдерная тема и Теги фильтрации</div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Shader Color Mode */}
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1.5">Тема шейдера тепловой карты:</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: 'thermal', label: '🔥 Thermal' },
                                { id: 'cyber', label: '⚡ Cyber' },
                                { id: 'ultraviolet', label: '🔮 Ultraviolet' },
                                { id: 'magma', label: '🌋 Magma' }
                              ].map(m => (
                                <button
                                  type="button"
                                  key={m.id}
                                  onClick={() => setEditingCase({ ...editingCase, colorMode: m.id })}
                                  className={`py-2 px-3 rounded-xl text-xs font-mono transition-all text-left flex items-center justify-between ${
                                    (editingCase.colorMode || 'thermal') === m.id
                                      ? 'bg-white text-slate-950 font-bold shadow'
                                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  <span>{m.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Quick Tags Toggle */}
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1.5">Теги рубрикатора (фильтры):</label>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {['SaaS', 'Branding', 'Landing Page', 'SEO Optimization', 'Full Packaging', 'Websites'].map(tag => {
                                const currentTags = editingCase.tags || [];
                                const hasTag = currentTags.includes(tag);
                                return (
                                  <button
                                    type="button"
                                    key={tag}
                                    onClick={() => {
                                      const updatedTags = hasTag
                                        ? currentTags.filter(t => t !== tag)
                                        : [...currentTags, tag];
                                      setEditingCase({ ...editingCase, tags: updatedTags });
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                                      hasTag
                                        ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-bold'
                                        : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-white'
                                    }`}
                                  >
                                    {tag} {hasTag ? '✓' : '+'}
                                  </button>
                                );
                              })}
                            </div>
                            <input
                              type="text"
                              placeholder="Теги через запятую (напр: SaaS, Branding)"
                              value={(editingCase.tags || []).join(', ')}
                              onChange={(e) => {
                                const splitTags = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setEditingCase({ ...editingCase, tags: splitTags });
                              }}
                              className="w-full px-3 py-2 rounded-xl input-studio text-xs text-white"
                            />
                          </div>
                        </div>

                        {/* Published Toggle */}
                        <div className="pt-2 flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingCase.published !== false}
                              onChange={(e) => setEditingCase({ ...editingCase, published: e.target.checked })}
                              className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-900 border-slate-700"
                            />
                            <span className="text-xs font-heading font-semibold text-white">
                              Опубликован на сайте (активен в витрине кейсов)
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                        <button
                          onClick={() => setEditingCase(null)}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-xs text-slate-400 hover:text-white"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={() => {
                            const updated = cases.some(it => it.id === editingCase.id)
                              ? cases.map(it => it.id === editingCase.id ? editingCase : it)
                              : [editingCase, ...cases];
                            setCases(updated);
                            saveAllContent(updated);
                            setEditingCase(null);
                          }}
                          className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-heading font-bold text-xs shadow-lg transition-all"
                        >
                          Сохранить кейс
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: SETTINGS & CHANNELS */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-base font-heading font-bold text-white">
                    Каналы связи и уведомлений агентства
                  </h3>
                  <p className="text-xs text-slate-400">
                    Настройка интеграции с Telegram Bot для мгновенных push-уведомлений при поступлении новых заявок.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Telegram логин менеджера:</label>
                      <input
                        type="text"
                        defaultValue="@artemov_basil"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Telegram Bot Token (для сервера):</label>
                      <input
                        type="text"
                        placeholder="Например: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Telegram Chat ID получателя:</label>
                      <input
                        type="text"
                        placeholder="Например: 582910481"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-500">
                    💡 Переменные `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` также можно указать в панели Railway для автоматической отправки.
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        </div>

      </motion.div>
    )}
  </AnimatePresence>
  );
}
