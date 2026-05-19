import { useState, useEffect, useCallback } from "react";
import { Language, getTranslation } from "@/lib/translations";
import { preTranslateAll } from "@/lib/translationService";

interface UseTranslationReturn {
  language: Language;
  t: (key: string) => string;
  switchLanguage: (lang: Language) => Promise<void>;
  isPreTranslating: boolean;
  preProgress: number;
}

/* Shared in-memory state so all hook instances see the same value */
let _isTranslating = false;
const _listeners = new Set<() => void>();
function notify() { _listeners.forEach(fn => fn()); }

export function useTranslation(): UseTranslationReturn {
  const [language, setLang] = useState<Language>(() =>
    (localStorage.getItem("language") || "ar") as Language
  );
  const [isPreTranslating, setIsPreTranslating] = useState(false);
  const [preProgress, setPreProgress] = useState(0);

  /* Keep component in sync with shared translating flag */
  useEffect(() => {
    const sync = () => setIsPreTranslating(_isTranslating);
    _listeners.add(sync);
    return () => { _listeners.delete(sync); };
  }, []);

  /* Apply dir/lang on mount and change */
  useEffect(() => {
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    document.documentElement.lang = language;
  }, [language]);

  /* Listen for other tabs or components changing language */
  useEffect(() => {
    const handler = () => {
      const newLang = (localStorage.getItem("language") || "ar") as Language;
      setLang(newLang);
      document.documentElement.setAttribute("dir", newLang === "ar" ? "rtl" : "ltr");
      document.documentElement.lang = newLang;
    };
    window.addEventListener("storage", handler);
    window.addEventListener("languagechange", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("languagechange", handler);
    };
  }, []);

  const t = useCallback(
    (key: string): string => getTranslation(key, language),
    [language]
  );

  const switchLanguage = useCallback(async (lang: Language) => {
    /* Apply direction immediately */
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.lang = lang;

    if (lang === "ar") {
      /* Arabic = instant, no translation needed */
      localStorage.setItem("language", lang);
      setLang(lang);
      window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: lang } }));
      return;
    }

    /* Fire overlay start */
    window.dispatchEvent(new CustomEvent("translationstart", { detail: { lang } }));
    _isTranslating = true;
    notify();
    setIsPreTranslating(true);
    setPreProgress(0);

    try {
      const base = (import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL ?? "/";
      await preTranslateAll(lang, base, (pct) => {
        setPreProgress(pct);
        window.dispatchEvent(new CustomEvent("translationprogress", { detail: { pct } }));
      });
    } catch { /* still switch even if translation fails */ } finally {
      localStorage.setItem("language", lang);
      setLang(lang);
      window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: lang } }));
      _isTranslating = false;
      notify();
      setIsPreTranslating(false);
      setPreProgress(0);
      window.dispatchEvent(new CustomEvent("translationend"));
    }
  }, []);

  return { language, t, switchLanguage, isPreTranslating, preProgress };
}
