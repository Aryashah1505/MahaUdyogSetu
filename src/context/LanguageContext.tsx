import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Language, translations } from '../translations';
import { PHRASE_DICTIONARY } from '../translations/dictionary';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const STORAGE_KEY = 'mahau_preferred_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to translate an English string
export const translateString = (text: string, lang: Language): string => {
  if (!text || lang === 'en') return text;
  
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Direct phrase match
  if (PHRASE_DICTIONARY[trimmed]) {
    const res = PHRASE_DICTIONARY[trimmed][lang];
    if (res) {
      return text.replace(trimmed, res);
    }
  }

  // Key match in translation dictionary
  const dict = translations[lang];
  if (dict && dict[trimmed]) {
    return text.replace(trimmed, dict[trimmed]);
  }

  // Substring phrase replacement for compound sentences
  let result = text;
  const sortedKeys = Object.keys(PHRASE_DICTIONARY).sort((a, b) => b.length - a.length);
  for (const phrase of sortedKeys) {
    if (phrase.length > 3 && result.includes(phrase)) {
      const rep = PHRASE_DICTIONARY[phrase][lang];
      if (rep) {
        result = result.split(phrase).join(rep);
      }
    }
  }

  return result;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved === 'en' || saved === 'mr' || saved === 'hi') {
        return saved;
      }
    } catch (e) {
      console.error('Failed to load language preference', e);
    }
    return 'en'; // Default language = English
  });

  const isTranslatingRef = useRef(false);

  const setLanguage = (newLang: Language) => {
    if (newLang === 'en' || newLang === 'mr' || newLang === 'hi') {
      setLanguageState(newLang);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch (e) {
        console.error('Failed to save language preference', e);
      }
    }
  };

  const t = useCallback((key: string, defaultText?: string): string => {
    if (language === 'en') {
      // Return English version
      if (translations.en && translations.en[key]) {
        return translations.en[key];
      }
      return defaultText || key;
    }

    // 1. Direct key match in language dictionary
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }

    // 2. Direct phrase match in PHRASE_DICTIONARY
    if (PHRASE_DICTIONARY[key] && PHRASE_DICTIONARY[key][language]) {
      return PHRASE_DICTIONARY[key][language];
    }

    // 3. If fallback / defaultText passed, try translating it
    if (defaultText) {
      if (PHRASE_DICTIONARY[defaultText] && PHRASE_DICTIONARY[defaultText][language]) {
        return PHRASE_DICTIONARY[defaultText][language];
      }
      return translateString(defaultText, language);
    }

    // 4. Try translating key itself as a phrase
    return translateString(key, language);
  }, [language]);

  // DOM-wide Auto-Translator Hook
  useEffect(() => {
    document.documentElement.lang = language;

    const translateDOM = () => {
      if (isTranslatingRef.current) return;
      isTranslatingRef.current = true;

      try {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              const tag = parent.tagName.toLowerCase();
              if (
                tag === 'script' ||
                tag === 'style' ||
                tag === 'code' ||
                tag === 'pre' ||
                tag === 'noscript' ||
                parent.hasAttribute('data-no-translate')
              ) {
                return NodeFilter.FILTER_REJECT;
              }
              const txt = node.textContent?.trim();
              if (!txt || txt.length === 0 || /^[0-9\s.,/#!$%^&*;:{}=\-_`~()@+₹|]+$/.test(txt)) {
                return NodeFilter.FILTER_SKIP;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        const nodesToTranslate: Node[] = [];
        let currentNode = walker.nextNode();
        while (currentNode) {
          nodesToTranslate.push(currentNode);
          currentNode = walker.nextNode();
        }

        nodesToTranslate.forEach((node) => {
          const anyNode = node as any;
          if (!anyNode.__originalText) {
            anyNode.__originalText = node.textContent || '';
          }

          if (language === 'en') {
            if (node.textContent !== anyNode.__originalText) {
              node.textContent = anyNode.__originalText;
            }
          } else {
            const original = anyNode.__originalText;
            const translated = translateString(original, language);
            if (node.textContent !== translated) {
              node.textContent = translated;
            }
          }
        });

        // Also translate placeholders on inputs
        const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        inputs.forEach((inputEl) => {
          const el = inputEl as HTMLInputElement;
          const anyEl = el as any;
          if (!anyEl.__originalPlaceholder) {
            anyEl.__originalPlaceholder = el.placeholder;
          }

          if (language === 'en') {
            if (el.placeholder !== anyEl.__originalPlaceholder) {
              el.placeholder = anyEl.__originalPlaceholder;
            }
          } else {
            const translated = translateString(anyEl.__originalPlaceholder, language);
            if (el.placeholder !== translated) {
              el.placeholder = translated;
            }
          }
        });
      } catch (err) {
        console.error('Translation DOM error:', err);
      } finally {
        isTranslatingRef.current = false;
      }
    };

    // Initial translation execution
    translateDOM();

    // Debounced mutation observer to handle dynamic loads, tabs, routes
    let timeoutId: NodeJS.Timeout | null = null;
    const observer = new MutationObserver(() => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        translateDOM();
      }, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false
    });

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
