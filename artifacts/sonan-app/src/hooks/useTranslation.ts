import { useState, useEffect, useCallback } from "react";
import { Language, getTranslation } from "@/lib/translations";

interface UseTranslationReturn {
  language: Language;
  t: (key: string) => string;
  switchLanguage: (lang: Language) => void;
  isPreTranslating: boolean;
  preProgress: number;
}

export function useTranslation(): UseTranslationReturn {
  const [language, setLang] = useState<Language>(() =>
    (localStorage.getItem("language") || "ar") as Language
  );

  useEffect(() => {
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handler = () => {
      const lang = (localStorage.getItem("language") || "ar") as Language;
      setLang(lang);
      document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      document.documentElement.lang = lang;
    };
    window.addEventListener("storage", handler);
    window.addEventListener("languagechange", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("languagechange", handler);
    };
  }, []);

  const t = useCallback((key: string) => getTranslation(key, language), [language]);

  /* Language switch is now instant — list pages load pre-translated JSON files,
     detail pages use Google Translate on demand (cached after first view). */
  const switchLanguage = useCallback((lang: Language) => {
    localStorage.setItem("language", lang);
    setLang(lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: lang } }));
  }, []);

  return { language, t, switchLanguage, isPreTranslating: false, preProgress: 100 };
}
