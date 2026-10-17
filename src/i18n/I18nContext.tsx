import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { SupportedLanguage, LanguageInfo, TranslationDictionary } from './types.ts';
import { SUPPORTED_LANGUAGES } from './types.ts';
import { TRANSLATIONS } from './translations.ts';
import { CURRENCY_SYMBOLS } from '../utils/financialEngine';

interface I18nContextType {
  language: SupportedLanguage;
  languageInfo: LanguageInfo;
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof TranslationDictionary, fallback?: string) => string;
  formatDate: (date: number | Date) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrencyLocale: (amount: number, currency?: string) => string;
}

const STORAGE_KEY = 'mg_finora_language';

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    if (saved && TRANSLATIONS[saved]) return saved;
    // Check browser language
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith('ur')) return 'ur';
    if (navLang.startsWith('ar')) return 'ar';
    if (navLang.startsWith('hi')) return 'hi';
    if (navLang.startsWith('bn')) return 'bn';
    if (navLang.startsWith('zh')) return 'zh-CN';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('fr')) return 'fr';
    return 'en';
  });

  const languageInfo = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const dir = languageInfo.dir;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    if (dir === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [language, dir]);

  const setLanguage = (lang: SupportedLanguage) => {
    if (TRANSLATIONS[lang]) {
      setLanguageState(lang);
    }
  };

  const t = (key: keyof TranslationDictionary, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (dict[key]) return dict[key];
    if (TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return fallback || key;
  };

  const formatDate = (date: number | Date): string => {
    const d = typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat(languageInfo.locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(d);
  };

  const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(languageInfo.locale, options).format(num);
  };

  const formatCurrencyLocale = (amount: number, currency: string = 'PKR'): string => {
    const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] || currency;
    const formattedNum = new Intl.NumberFormat(languageInfo.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
    
    // In RTL, handle symbol placement
    if (dir === 'rtl') {
      return `${formattedNum} ${symbol}`;
    }
    return `${symbol} ${formattedNum}`;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        languageInfo,
        dir,
        setLanguage,
        t,
        formatDate,
        formatNumber,
        formatCurrencyLocale
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
