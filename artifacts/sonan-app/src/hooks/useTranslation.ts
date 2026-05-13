import { useState, useEffect, useCallback } from "react";
import { Language, getTranslation } from "@/lib/translations";

export function useTranslation() {
  const [language, setLang] = useState<Language>(() => 
    (localStorage.getItem("language") || "ar") as Language
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = (localStorage.getItem("language") || "ar") as Language;
      setLang(newLang);
      // Update document direction
      if (newLang === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
      } else {
        document.documentElement.setAttribute("dir", "ltr");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languagechange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languagechange", handleStorageChange);
    };
  }, []);

  const t = useCallback((key: string): string => {
    return getTranslation(key, language);
  }, [language]);

  const switchLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    setLang(lang);
    if (lang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.lang = lang;
    }
    window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: lang } }));
  };

  return { language, t, switchLanguage };
}

export function useTheme() {
  const [theme, setThemeState] = useState<"dark" | "light">(() => 
    (localStorage.getItem("theme") || "dark") as "dark" | "light"
  );

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = (localStorage.getItem("theme") || "dark") as "dark" | "light";
      setThemeState(newTheme);
    };

    window.addEventListener("storage", handleThemeChange);
    window.addEventListener("themechange", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("themechange", handleThemeChange);
    };
  }, []);

  const setTheme = useCallback((newTheme: "dark" | "light") => {
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
    
    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
      html.style.backgroundColor = "#001a0f";
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
      html.style.backgroundColor = "#ffffff";
    }
    
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: newTheme } }));
  }, []);

  return { theme, setTheme };
}

    setLang(lang);
  };

  return {
    language,
    t,
    switchLanguage,
  };
}

// Type-safe translation object
const translations = {
  ar: {} as any,
  en: {} as any,
};
