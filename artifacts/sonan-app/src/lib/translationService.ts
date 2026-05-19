/**
 * Translation Service
 * Primary: MyMemory API (free, no key, Arabic source)
 * Fallback: Lingva Translate (open-source Google Translate proxy)
 * Cache: localStorage  key = trans_{lang}_{hash32(text)}
 */

import type { Language } from '@/lib/translations';

/* ── Language code map ─────────────────────────────────── */
const LANG_MAP: Record<Language, string> = {
  ar: 'ar', en: 'en', fr: 'fr', es: 'es', tr: 'tr', id: 'id',
};

/* ── Simple 32-bit hash (djb2) ─────────────────────────── */
function hash32(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h, 31) + str.charCodeAt(i) | 0;
  }
  return (h >>> 0).toString(36);
}

/* ── Cache helpers ─────────────────────────────────────── */
function cacheKey(text: string, lang: Language): string {
  return `trans_${lang}_${hash32(text)}`;
}

function fromCache(text: string, lang: Language): string | null {
  try { return localStorage.getItem(cacheKey(text, lang)); } catch { return null; }
}

function toCache(text: string, lang: Language, translated: string): void {
  try { localStorage.setItem(cacheKey(text, lang), translated); } catch { /* quota */ }
}

/* ── In-flight deduplication ───────────────────────────── */
const inFlight = new Map<string, Promise<string | null>>();

/* ── MyMemory API ──────────────────────────────────────── */
async function tryMyMemory(text: string, lang: Language): Promise<string | null> {
  // MyMemory limit: 500 chars per request
  const q = text.length > 490 ? text.slice(0, 490) : text;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=ar|${LANG_MAP[lang]}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!r.ok) return null;
    const data = await r.json() as {
      responseStatus: number;
      responseData?: { translatedText?: string };
    };
    if (data.responseStatus !== 200) return null;
    const t = data.responseData?.translatedText?.trim();
    // MyMemory sometimes echoes the input when it can't translate
    if (!t || t === q) return null;
    // If original was truncated, append the rest untranslated (rare edge case)
    return text.length > 490 ? t + ' ' + text.slice(490) : t;
  } catch { return null; }
}

/* ── Lingva Translate (open Google Translate proxy) ──── */
const LINGVA_HOSTS = [
  'https://lingva.ml',
  'https://translate.plausibility.cloud',
  'https://lingva.tiekoetter.com',
];

async function tryLingva(text: string, lang: Language): Promise<string | null> {
  const q = text.length > 1000 ? text.slice(0, 1000) : text;
  for (const host of LINGVA_HOSTS) {
    try {
      const url = `${host}/api/v1/ar/${LANG_MAP[lang]}/${encodeURIComponent(q)}`;
      const r = await fetch(url, { signal: AbortSignal.timeout(8_000) });
      if (!r.ok) continue;
      const data = await r.json() as { translation?: string };
      const t = data.translation?.trim();
      if (t && t !== q) return t;
    } catch { continue; }
  }
  return null;
}

/* ── Core single-text translate ────────────────────────── */
async function doTranslate(text: string, lang: Language): Promise<string | null> {
  // Try MyMemory first, then Lingva
  const result = await tryMyMemory(text, lang) ?? await tryLingva(text, lang);
  return result;
}

/* ── Public: translate one text ────────────────────────── */
export async function translateText(text: string, lang: Language): Promise<string> {
  if (!text || lang === 'ar') return text;

  const cached = fromCache(text, lang);
  if (cached) return cached;

  const key = `${lang}|${hash32(text)}`;
  const existing = inFlight.get(key);
  if (existing) return (await existing) ?? text;

  const promise = doTranslate(text, lang);
  inFlight.set(key, promise);
  try {
    const result = await promise;
    if (result) toCache(text, lang, result);
    return result ?? text;
  } finally {
    inFlight.delete(key);
  }
}

/* ── Public: translate array of texts ─────────────────── */
export async function translateBatch(
  texts: string[],
  lang: Language,
  concurrency = 5,
): Promise<string[]> {
  if (lang === 'ar') return texts;

  const results: string[] = new Array(texts.length).fill('');
  const todo: Array<{ i: number; text: string }> = [];

  for (let i = 0; i < texts.length; i++) {
    const cached = fromCache(texts[i], lang);
    if (cached) results[i] = cached;
    else if (texts[i]) todo.push({ i, text: texts[i] });
    else results[i] = texts[i];
  }

  // Process in parallel batches
  for (let i = 0; i < todo.length; i += concurrency) {
    const chunk = todo.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(async ({ i: idx, text }) => {
        results[idx] = await translateText(text, lang);
      })
    );
  }

  return results;
}

/* ── Cache management ──────────────────────────────────── */
export function clearCache(): void {
  try {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('trans_')) localStorage.removeItem(k);
    }
  } catch { /* ignore */ }
}

export function clearCacheForLanguage(lang: Language): void {
  try {
    const prefix = `trans_${lang}_`;
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith(prefix)) localStorage.removeItem(k);
    }
  } catch { /* ignore */ }
}
