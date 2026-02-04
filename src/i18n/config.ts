import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations directly for bundling
import enCommon from './locales/en/common.json';
import svCommon from './locales/sv/common.json';

export const supportedLanguages = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  sv: { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  sw: { name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

export const defaultLanguage: SupportedLanguage = 'en';

const resources = {
  en: { common: enCommon },
  sv: { common: svCommon },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: defaultLanguage,
    supportedLngs: Object.keys(supportedLanguages),
    
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'dissg-language',
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    react: {
      useSuspense: false, // Avoid hydration issues
    },
  });

export default i18n;
