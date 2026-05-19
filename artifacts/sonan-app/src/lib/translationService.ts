/**
 * Translation Service - LibreTranslate API
 * Uses LibreTranslate open-source API (no auth required)
 * Caches all translations in localStorage per language
 * Implements rate limiting and request deduplication
 */

import type { Language } from '@/lib/translations';

const CACHE_PREFIX = 'tr_cache_';
const LIBRETRANSLATE_URL = 'https://libretranslate.de/translate';

// Language code mapping for LibreTranslate
const LANG_MAP: Record<Language, string> = {
  ar: 'ar',
  en: 'en',
  fr: 'fr',
  es: 'es',
  tr: 'tr',
  id: 'id',
};

/**
 * Get translation cache for a specific language
 */
function getLanguageCacheKey(targetLang: Language): string {
  return `${CACHE_PREFIX}${targetLang}`;
}

/**
 * Get entire translation cache object for a language
 */
function getLanguageCache(targetLang: Language): Record<string, string> {
  if (typeof localStorage === 'undefined') return {};
  const key = getLanguageCacheKey(targetLang);
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
}

/**
 * Save entire translation cache for a language
 */
function saveLanguageCache(targetLang: Language, cache: Record<string, string>): void {
  if (typeof localStorage === 'undefined') return;
  const key = getLanguageCacheKey(targetLang);
  try {
    localStorage.setItem(key, JSON.stringify(cache));
  } catch {
    // Quota exceeded or other storage error
    console.warn(`[TranslationCache] Failed to save cache for ${targetLang}`);
  }
}

/**
 * Get single translation from cache
 */
function getFromCache(text: string, targetLang: Language): string | null {
  const cache = getLanguageCache(targetLang);
  return cache[text] || null;
}

/**
 * Save single translation to cache
 */
function saveToCache(text: string, targetLang: Language, translation: string): void {
  const cache = getLanguageCache(targetLang);
  cache[text] = translation;
  saveLanguageCache(targetLang, cache);
}

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // LibreTranslate is more generous - 1 second between requests
let requestQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;

// Track language-specific rate limiting
const lastLanguageRequestTime = new Map<Language, number>();
const LANGUAGE_MIN_INTERVAL = 500; // 500ms minimum per language

// Track in-flight translation requests to prevent duplicates
// Key: "${text}|${targetLang}", Value: Promise<string | null>
const inFlightRequests = new Map<string, Promise<string | null>>();

function getInFlightKey(text: string, targetLang: Language): string {
  return `${text}|${targetLang}`;
}

/**
 * Add request to queue and process sequentially
 */
async function queueRequest<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
}

/**
 * Process request queue sequentially with aggressive rate limiting
 */
async function processQueue(): Promise<void> {
  if (isProcessingQueue || requestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;
  let requestCount = 0;
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      requestCount++;
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      const waitTime = Math.max(0, MIN_REQUEST_INTERVAL - timeSinceLastRequest);
      
      if (waitTime > 0) {
        console.log(`[RequestQueue] Request #${requestCount}: Waiting ${waitTime}ms before next API call (${requestQueue.length} remaining in queue)`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      console.log(`[RequestQueue] Processing request #${requestCount}...`);
      try {
        await request();
      } catch (error) {
        console.error('[RequestQueue] Error processing request:', error);
      }
      lastRequestTime = Date.now();
    }
  }
  isProcessingQueue = false;
}

/**
 * Translate via LibreTranslate API with retry logic (queued)
 */
async function translateViaLibreTranslate(
  text: string,
  targetLang: Language,
  retries: number = 2
): Promise<string | null> {
  return queueRequest(async () => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const targetLangCode = LANG_MAP[targetLang];
        
        console.log(`[LibreTranslate] Attempt ${attempt + 1}/${retries + 1} - Translating to ${targetLang} for "${text.substring(0, 30)}..."`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(LIBRETRANSLATE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source_language: 'ar',
            target_language: targetLangCode,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          if (response.status === 429) {
            // Rate limited - backoff
            const backoffTime = (attempt + 1) * 2000; // 2s, 4s, 6s...
            console.warn(`[LibreTranslate] Rate limited (429). Attempt ${attempt + 1}/${retries + 1}. Will retry after ${backoffTime}ms`);
            
            if (attempt < retries) {
              await new Promise(resolve => setTimeout(resolve, backoffTime));
              continue;
            }
          }
          console.warn(`[LibreTranslate] HTTP Error ${response.status} for: "${text.substring(0, 50)}..."`);
          lastError = new Error(`HTTP ${response.status}`);
          continue;
        }

        const data = (await response.json()) as {
          translatedText?: string;
          error?: string;
        };

        // Check for API errors
        if (data.error) {
          console.warn(`[LibreTranslate] API Error: ${data.error}`);
          lastError = new Error(data.error);
          continue;
        }

        const translated = data.translatedText;
        if (!translated) {
          console.warn(`[LibreTranslate] No translatedText in response. Full response:`, data);
          lastError = new Error('No translation in response');
          continue;
        }

        console.log(`[LibreTranslate] ✅ Translation succeeded on attempt ${attempt + 1}: "${translated.substring(0, 40)}..."`);
        return translated;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`[LibreTranslate] Attempt ${attempt + 1} caught error:`, lastError.message);

        if (attempt < retries) {
          const backoffTime = (attempt + 1) * 1000; // 1s, 2s, 3s...
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
    }

    console.warn(`[LibreTranslate] All ${retries + 1} retries failed for: "${text.substring(0, 50)}..."`, lastError?.message);
    return null;
  });
}

/**
 * Translate a single text string
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
    console.log(`[Translation] Cache hit for ${targetLang}: ${text.substring(0, 30)}...`);
    return cached;
  }

  // Check if this phrase is already being translated
  const inFlightKey = getInFlightKey(text, targetLang);
  const inFlight = inFlightRequests.get(inFlightKey);
  if (inFlight) {
    console.log(`[Translation] Reusing in-flight request for ${targetLang}: ${text.substring(0, 30)}...`);
    const result = await inFlight;
    return result || text; // Return translated or original
  }

  console.log(`[Translation] Translating to ${targetLang}: ${text.substring(0, 40)}...`);
  
  // Create the translation promise
  const translationPromise = (async () => {
    // Call LibreTranslate API with retries
    const result = await translateViaLibreTranslate(text, targetLang);
    if (result) {
      saveToCache(text, targetLang, result);
      console.log(`[Translation] ✅ Success for ${targetLang}: "${result.substring(0, 40)}..."`);
      return result;
    }

    // API failed, return original Arabic text
    console.error(`[Translation] ❌ Failed to translate to ${targetLang}: "${text.substring(0, 50)}..."`);
    return null;
  })();

  // Track this in-flight request
  inFlightRequests.set(inFlightKey, translationPromise);

  try {
    const result = await translationPromise;
    return result || text;
  } finally {
    // Clean up the in-flight tracker
    inFlightRequests.delete(inFlightKey);
  }
}


/**
 * Translate multiple texts with concurrent processing
 * (Deduplication prevents duplicate API calls)
 */
export async function translateBatch(
  texts: string[],
  targetLang: Language,
  concurrency: number = 10  // Can be higher now since deduplication prevents duplicate requests
): Promise<string[]> {
  // Arabic needs no translation
  if (targetLang === 'ar') {
    return texts;
  }

  const results: (string | null)[] = new Array(texts.length).fill(null);

  // Check cache and identify what needs translation
  const toTranslate: Array<{ index: number; text: string }> = [];
  for (let i = 0; i < texts.length; i++) {
    const cached = getFromCache(texts[i], targetLang);
    if (cached) {
      results[i] = cached;
    } else {
      toTranslate.push({ index: i, text: texts[i] });
    }
  }

  // Translate with controlled concurrency
  // Deduplication prevents duplicate API calls even if the same phrase appears multiple times
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
