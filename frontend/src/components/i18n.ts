import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "../locales/en/translation.json";
import translationES from "../locales/es/translation.json";
import translationFR from "../locales/fr/translation.json";
import translationHT from "../locales/ht/translation.json";

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  fr: {
    translation: translationFR,
  },
  ht: {
    translation: translationHT,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es", // Idioma por defecto si la detección falla
    interpolation: {
      escapeValue: false, // React ya se encarga del XSS
    },
  });

export default i18n;