// i18n.js
import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';

const TRANSLATION_FALLBACK = process.env.NEXT_PUBLIC_TRANSLATION_FALLBACK || 'fr'
const storedLanguage = Cookies.get('appLanguage') || 'fr';

i18n.use(HttpBackend).use(initReactI18next).init({
    lng: storedLanguage, // Default language
    fallbackLng: TRANSLATION_FALLBACK, // Fallback language if the translation is missing in the current language
    supportedLngs: ['ar', 'en', 'fr', 'es'], // List of supported languages
});

export default i18n;
