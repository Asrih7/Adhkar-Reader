/**
 * UI Translations Management
 * Uses pre-defined static translations from translations.ts
 * No need to dynamically translate UI strings since they're already translated
 */

import { translations, Language } from '@/lib/translations';

const UI_CACHE_PREFIX = 'ui_tr_';

/**
 * Get a UI translation (always from static translations)
 * This avoids API calls for UI strings that are already translated
 */
export function getUITranslation(key: string, lang: Language): string {
  const staticTr = translations[lang]?.[key as keyof typeof translations.ar];
  if (staticTr) {
    return staticTr;
  }

  // Fall back to English if key not found in target language
  const fallback = translations.en?.[key as keyof typeof translations.ar];
  return fallback || key;
}

/**
 * Get cached UI translations for a language
 */
export function getUITranslationCache(lang: Language): Record<string, string> {
  if (typeof localStorage === 'undefined') return {};
  const key = `${UI_CACHE_PREFIX}${lang}`;
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
}

/**
 * Clear all UI translation caches
 */
export function clearUITranslationCache(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(UI_CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    console.warn('[UITranslation] Failed to clear cache');
  }
}

