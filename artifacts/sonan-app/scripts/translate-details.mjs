/**
 * Pre-translate individual Adhkar and Sonan detail JSON files.
 * Generates adkar-{id}.{lang}.json and sonan-{id}.{lang}.json
 * for instant detail page display with zero runtime API calls.
 *
 * Run: node artifacts/sonan-app/scripts/translate-details.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const DATA = '/home/runner/workspace/artifacts/sonan-app/public/data';
const LANGS = ['en', 'fr', 'es', 'tr', 'id'];
const CONCURRENCY = 16;

/* ── Google Translate ─────────────────────── */
async function gt(text, lang) {
  if (!text?.trim()) return text ?? '';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(9000),
    });
    if (!r.ok) return text;
    const d = await r.json();
    return d[0].map(c => c[0]).join('') || text;
  } catch { return text; }
}

/* ── Read JSON safely ─────────────────────── */
function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    // Some files have control characters — strip them
    try {
      const raw = readFileSync(path, 'utf8').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
      return JSON.parse(raw);
    } catch { return null; }
  }
}

/* ── Batch translate texts ────────────────── */
async function batchTranslate(texts, lang) {
  const results = [...texts];
  const todo = texts.map((t, i) => ({ i, t })).filter(x => x.t?.trim());
  for (let i = 0; i < todo.length; i += CONCURRENCY) {
    await Promise.all(todo.slice(i, i + CONCURRENCY).map(async ({ i: idx, t }) => {
      results[idx] = await gt(t, lang);
    }));
  }
  return results;
}

/* ── Translate one set of files ──────────── */
async function translateFiles(prefix, pattern) {
  const files = readdirSync(DATA).filter(f => f.match(pattern));
  files.sort((a, b) => {
    const na = parseInt(a.match(/\d+/)?.[0] ?? '0');
    const nb = parseInt(b.match(/\d+/)?.[0] ?? '0');
    return na - nb;
  });

  for (const lang of LANGS) {
    let translated = 0, skipped = 0;
    for (const file of files) {
      const base = file.replace('.json', '');
      const out = join(DATA, `${base}.${lang}.json`);
      if (existsSync(out)) { skipped++; continue; }

      const src = readJson(join(DATA, file));
      if (!src || !Array.isArray(src)) { skipped++; continue; }

      // Collect text and source
      const textFields = src.map(item => item.text ?? '');
      const srcFields  = src.map(item => item.source ?? '');

      const [tTexts, tSrcs] = await Promise.all([
        batchTranslate(textFields, lang),
        batchTranslate(srcFields,  lang),
      ]);

      const result = src.map((item, i) => ({
        ...item,
        text:   tTexts[i] ?? item.text,
        source: item.source ? (tSrcs[i] ?? item.source) : item.source,
      }));

      writeFileSync(out, JSON.stringify(result, null, 2), 'utf8');
      translated++;
      process.stdout.write(`\r  ${prefix} [${lang}] ${translated + skipped}/${files.length} (${skipped} skipped)`);
    }
    console.log(`\n  ✅ ${prefix} ${lang} done — ${translated} translated, ${skipped} skipped`);
  }
}

/* ── Main ─────────────────────────────────── */
console.log('🌙 Pre-translating detail files...\n');

console.log('📖 Adkar detail files (adkar-*.json)...');
await translateFiles('adkar', /^adkar-\d+\.json$/);

console.log('\n📖 Sonan detail files (sonan-*.json)...');
await translateFiles('sonan', /^sonan-\d+\.json$/);

console.log('\n✅ All detail files pre-translated!');
