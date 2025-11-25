import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import sq from './sq.json';

const savedLanguage = typeof window !== 'undefined' 
  ? localStorage.getItem('preferredLanguage') || 'en'
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sq: { translation: sq },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
