import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getDeviceLanguage } from "./deviceLanguage";
import ar from "./ar.json";
import en from "./en.json";

void i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: getDeviceLanguage(),
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
