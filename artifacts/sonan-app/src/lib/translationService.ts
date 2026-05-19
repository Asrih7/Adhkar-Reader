/**
 * Translation Service
 * Primary: MyMemory API (free, no key)
 * Fallback: Lingva Translate (open Google Translate proxy)
 *
 * Strategy: pre-warm the entire cache on language switch
 * so all content shows translated instantly after one loading screen.
 */

import type { Language } from '@/lib/translations';

const LANG_MAP: Record<Language, string> = {
  ar: 'ar', en: 'en', fr: 'fr', es: 'es', tr: 'tr', id: 'id',
};

/* ── djb2 hash ─────────────────────────────────────────── */
function hash32(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/* ── localStorage cache (key = trans_{lang}_{hash}) ────── */
function ck(text: string, lang: Language)  { return `trans_${lang}_${hash32(text)}`; }
function hit(text: string, lang: Language): string | null {
  try { return localStorage.getItem(ck(text, lang)); } catch { return null; }
}
function put(text: string, lang: Language, val: string): void {
  try { localStorage.setItem(ck(text, lang), val); } catch { /* quota */ }
}

/* ── in-flight dedup ───────────────────────────────────── */
const inflight = new Map<string, Promise<string | null>>();

/* ── MyMemory single request ───────────────────────────── */
async function myMemory(text: string, lang: Language): Promise<string | null> {
  const q = text.length > 480 ? text.slice(0, 480) : text;
  try {
    const r = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=ar|${LANG_MAP[lang]}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!r.ok) return null;
    const d = await r.json() as { responseStatus: number; responseData?: { translatedText?: string } };
    if (d.responseStatus !== 200) return null;
    const t = d.responseData?.translatedText?.trim();
    if (!t || t === q || t.toLowerCase().includes('mymemory')) return null;
    return text.length > 480 ? t + ' ' + text.slice(480) : t;
  } catch { return null; }
}

/* ── Lingva fallback ───────────────────────────────────── */
const LINGVA = ['https://lingva.ml', 'https://translate.plausibility.cloud', 'https://lingva.tiekoetter.com'];
async function lingva(text: string, lang: Language): Promise<string | null> {
  const q = text.length > 900 ? text.slice(0, 900) : text;
  for (const host of LINGVA) {
    try {
      const r = await fetch(`${host}/api/v1/ar/${LANG_MAP[lang]}/${encodeURIComponent(q)}`,
        { signal: AbortSignal.timeout(6000) });
      if (!r.ok) continue;
      const d = await r.json() as { translation?: string };
      const t = d.translation?.trim();
      if (t && t !== q) return t;
    } catch { continue; }
  }
  return null;
}

/* ── Core: translate one text (cached + deduped) ────────── */
export async function translateText(text: string, lang: Language): Promise<string> {
  if (!text || lang === 'ar') return text;
  const cached = hit(text, lang);
  if (cached) return cached;
  const key = `${lang}|${hash32(text)}`;
  const pending = inflight.get(key);
  if (pending) return (await pending) ?? text;
  const p = (async () => {
    const result = (await myMemory(text, lang)) ?? (await lingva(text, lang));
    if (result) put(text, lang, result);
    return result;
  })();
  inflight.set(key, p);
  try { return (await p) ?? text; } finally { inflight.delete(key); }
}

/* ── Batch with high concurrency ───────────────────────── */
export async function translateBatch(
  texts: string[],
  lang: Language,
  concurrency = 25,
  onProgress?: (pct: number) => void,
): Promise<string[]> {
  if (lang === 'ar') { onProgress?.(100); return texts; }

  const results: string[] = [...texts];
  const todo: Array<{ i: number; text: string }> = [];

  for (let i = 0; i < texts.length; i++) {
    const c = hit(texts[i], lang);
    if (c) results[i] = c;
    else if (texts[i]) todo.push({ i, text: texts[i] });
  }

  let done = 0;
  const total = todo.length || 1;
  onProgress?.(Math.round(((texts.length - total) / texts.length) * 100));

  for (let i = 0; i < todo.length; i += concurrency) {
    const chunk = todo.slice(i, i + concurrency);
    await Promise.all(chunk.map(async ({ i: idx, text }) => {
      results[idx] = await translateText(text, lang);
      done++;
      onProgress?.(Math.round(((texts.length - total + done) / texts.length) * 100));
    }));
  }

  onProgress?.(100);
  return results;
}

/* ── Pre-warm: fetch all data + translate everything ─────
   Called once when the user switches language.
   After this, every page loads from cache (instant).           */
export async function preTranslateAll(
  lang: Language,
  baseUrl: string,
  onProgress?: (pct: number) => void,
): Promise<void> {
  if (lang === 'ar') { onProgress?.(100); return; }

  onProgress?.(0);

  /* 1. Fetch all three data files in parallel */
  const [adhkarData, sonanData, advicesData] = await Promise.allSettled([
    fetch(`${baseUrl}data/adhkar-data.json`).then(r => r.json()),
    fetch(`${baseUrl}data/sonan-data.json`).then(r => r.json()),
    fetch(`${baseUrl}data/advices-data.json`).then(r => r.json()),
  ]);

  onProgress?.(10);

  const allTexts: string[] = [];

  /* 2. Collect Arabic texts from list titles */
  if (adhkarData.status === 'fulfilled') {
    const cats = adhkarData.value as Array<{ text: string }>;
    cats.forEach(c => c.text && allTexts.push(c.text));
  }
  if (sonanData.status === 'fulfilled') {
    const cats = sonanData.value as Array<{ text: string }>;
    cats.forEach(c => c.text && allTexts.push(c.text));
  }
  if (advicesData.status === 'fulfilled') {
    const data = advicesData.value as { advices?: Array<{ title: string }> };
    data.advices?.forEach(a => a.title && allTexts.push(a.title));
  }

  onProgress?.(15);

  /* 3. Translate everything in parallel (25 at a time) */
  const uncached = allTexts.filter(t => !hit(t, lang));
  if (uncached.length === 0) { onProgress?.(100); return; }

  let done = 0;
  const concurrency = 25;
  for (let i = 0; i < uncached.length; i += concurrency) {
    const chunk = uncached.slice(i, i + concurrency);
    await Promise.all(chunk.map(async (text) => {
      await translateText(text, lang);
      done++;
      const pct = 15 + Math.round((done / uncached.length) * 85);
      onProgress?.(pct);
    }));
  }

  onProgress?.(100);
}

/* ── Cache helpers ─────────────────────────────────────── */
export function clearCache(): void {
  try { Object.keys(localStorage).filter(k => k.startsWith('trans_')).forEach(k => localStorage.removeItem(k)); } catch { /**/ }
}
export function clearCacheForLanguage(lang: Language): void {
  try { Object.keys(localStorage).filter(k => k.startsWith(`trans_${lang}_`)).forEach(k => localStorage.removeItem(k)); } catch { /**/ }
}
