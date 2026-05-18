import { useState, useEffect, useCallback } from "react";
import { Language, getTranslation } from "@/lib/translations";

export function useTranslation() {
  const [language, setLang] = useState<Language>(() =>
    (localStorage.getItem("language") || "ar") as Language
  );

  // Apply direction on language change
  useEffect(() => {
    const dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = (localStorage.getItem("language") || "ar") as Language;
      setLang(newLang);
      const dir = newLang === "ar" ? "rtl" : "ltr";
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.lang = newLang;
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languagechange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languagechange", handleStorageChange);
    };
  }, []);

  const t = useCallback(
    (key: string): string => getTranslation(key, language),
    [language]
  );

  const switchLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    setLang(lang);
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: lang } }));
  };

  return { language, t, switchLanguage };
}
