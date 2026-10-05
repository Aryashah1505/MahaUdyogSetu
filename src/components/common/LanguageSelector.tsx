import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../translations';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'light' | 'dark' | 'header';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '',
  variant = 'header'
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Array<{ code: Language; name: string }> = [
    { code: 'en', name: 'English' },
    { code: 'mr', name: 'मराठी' },
    { code: 'hi', name: 'हिन्दी' }
  ];

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef} data-no-translate="true">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select website language"
        className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs border ${
          variant === 'dark'
            ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="hidden sm:inline">🌐 Language</span>
        <span className="sm:hidden">🌐</span>
        <span className="px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">
          {currentLanguage.name}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-1.5 w-40 rounded-2xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-fadeIn"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Select Language
          </div>

          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                role="menuitem"
                className={`w-full px-3.5 py-2 text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-50/80 text-blue-900 font-black' 
                    : 'text-slate-700 hover:bg-slate-50 font-semibold'
                }`}
              >
                <span>{lang.name}</span>
                {isSelected && (
                  <span className="text-blue-600 font-black flex items-center gap-0.5">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
