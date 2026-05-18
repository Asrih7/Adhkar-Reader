/**
 * Translation Service
 * Uses LibreTranslate API with MyMemory fallback
 * Caches results in localStorage to minimize API calls
 */

type Language = 'ar' | 'en' | 'fr' | 'es' | 'tr' | 'id';

const CACHE_PREFIX = 'tr_cache_';
const LIBRETRANSLATE_URL = 'https://libretranslate.com/translate';
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

// Language code mapping
const LANG_MAP: Record<Language, string> = {
  ar: 'ar',
  en: 'en',
  fr: 'fr',
  es: 'es',
  tr: 'tr',
  id: 'id',
};

/**
 * Generate cache key for a text-language pair
 */
function getCacheKey(text: string, targetLang: Language): string {
  const hash = btoa(text).slice(0, 16);
  return `${CACHE_PREFIX}${targetLang}_${hash}`;
}

/**
 * Get from cache
 */
function getFromCache(text: string, targetLang: Language): string | null {
  if (typeof localStorage === 'undefined') return null;
  const key = getCacheKey(text, targetLang);
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Save to cache
 */
function saveToCache(text: string, targetLang: Language, translation: string): void {
  if (typeof localStorage === 'undefined') return;
  const key = getCacheKey(text, targetLang);
  try {
    localStorage.setItem(key, translation);
  } catch {
    // Quota exceeded or other storage error
  }
}

/**
 * Translate via LibreTranslate API
 */
async function translateViaLibreTranslate(
  text: string,
  targetLang: Language
): Promise<string | null> {
  try {
    const response = await fetch(LIBRETRANSLATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'ar',
        target: LANG_MAP[targetLang],
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { translatedText?: string };
    return data.translatedText || null;
  } catch {
    return null;
  }
}

/**
 * Translate via MyMemory API (fallback)
 */
async function translateViaMyMemory(
  text: string,
  targetLang: Language
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `ar|${LANG_MAP[targetLang]}`,
    });

    const response = await fetch(`${MYMEMORY_URL}?${params}`);
    if (!response.ok) return null;

    const data = (await response.json()) as {
      responseData?: { translatedText?: string };
    };
    return data.responseData?.translatedText || null;
  } catch {
    return null;
  }
}

/**
 * Translate a single text string
 * Tries LibreTranslate first, falls back to MyMemory
 */
export async function translateText(
  text: string,
  targetLang: Language
): Promise<string> {
  // Arabic needs no translation
  if (!text || targetLang === 'ar') {
    return text;
  }

  // Check cache first
  const cached = getFromCache(text, targetLang);
  if (cached) {
    return cached;
  }

  // Try LibreTranslate
  let result = await translateViaLibreTranslate(text, targetLang);
  if (result) {
    saveToCache(text, targetLang, result);
    return result;
  }

  // Fallback to MyMemory
  result = await translateViaMyMemory(text, targetLang);
  if (result) {
    saveToCache(text, targetLang, result);
    return result;
  }

  // Both failed, return original
  return text;
}

/**
 * Translate multiple texts with concurrency limit
 */
export async function translateBatch(
  texts: string[],
  targetLang: Language,
  concurrency: number = 3
): Promise<string[]> {
  // Arabic needs no translation
  if (targetLang === 'ar') {
    return texts;
  }

  const results: (string | null)[] = new Array(texts.length).fill(null);

  // Check cache for all
  const toTranslate: Array<{ index: number; text: string }> = [];
  for (let i = 0; i < texts.length; i++) {
    const cached = getFromCache(texts[i], targetLang);
    if (cached) {
      results[i] = cached;
    } else {
      toTranslate.push({ index: i, text: texts[i] });
    }
  }

  // Translate with concurrency limit
  for (let i = 0; i < toTranslate.length; i += concurrency) {
    const batch = toTranslate.slice(i, i + concurrency);
    const promises = batch.map(async ({ index, text }) => {
      const result = await translateText(text, targetLang);
      results[index] = result;
    });
    await Promise.all(promises);
  }

  return results.map((r) => r || '');
}

/**
 * Clear all translation cache
 */
export function clearCache(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Storage error
  }
}

/**
 * Clear cache for specific language
 */
export function clearCacheForLanguage(targetLang: Language): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const prefix = `${CACHE_PREFIX}${targetLang}_`;
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Storage error
  }
}
