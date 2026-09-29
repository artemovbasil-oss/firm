import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudioSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  icon: Icon,
  className = '',
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to { value, label, desc }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return {
      value: opt.value ?? opt.id ?? opt.label,
      label: opt.label ?? opt.name ?? String(opt.value),
      desc: opt.desc,
      badge: opt.badge,
    };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value) || normalizedOptions[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative flex flex-col ${className}`} ref={containerRef}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2"
        >
          {label}
        </label>
      )}

      {/* Modern High-End Trigger Button */}
      <div className="relative group">
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full min-h-[52px] sm:min-h-[56px] px-4 sm:px-5 py-3.5 rounded-2xl bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.08] border text-left transition-all duration-200 flex items-center justify-between gap-3 shadow-sm ${
            isOpen
              ? 'border-amber-400 ring-2 ring-amber-400/20 dark:ring-amber-400/30'
              : 'border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {Icon && (
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-200 group-hover:scale-105 transition-transform">
                <Icon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="block font-heading font-semibold text-sm sm:text-base text-slate-950 dark:text-white truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              {selectedOption?.desc && (
                <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {selectedOption.desc}
                </span>
              )}
            </div>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white shrink-0 ml-1"
          >
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        </button>

        {/* Mobile-Friendly Invisible Native Select Overlay:
            On touch devices (below sm breakpoint), tapping directly triggers the native OS picker wheel/sheet,
            providing 100% native mobile accessibility, haptics, and zero keyboard conflicts, 
            while VISUALLY displaying our large, modern custom trigger. */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label || placeholder}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer sm:hidden"
        >
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Floating Animated Popover Dropdown (for Desktop & larger viewports) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block absolute left-0 right-0 top-full mt-2 z-[60] rounded-2xl bg-white/95 dark:bg-[#0c0e18]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/15 shadow-2xl p-2 space-y-1 max-h-80 overflow-y-auto"
            role="listbox"
          >
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`px-4 py-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-400/10 dark:bg-amber-400/15 text-amber-600 dark:text-amber-300 font-bold border border-amber-400/30'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-heading font-semibold text-sm leading-snug">
                      {opt.label}
                    </div>
                    {opt.desc && (
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        {opt.desc}
                      </div>
                    )}
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
