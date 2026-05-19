/**
 * Pre-translation script
 * Reads Arabic source JSON files and outputs language-specific translated versions.
 * Uses Google Translate unofficial API (no key, works reliably).
 *
 * Run: node artifacts/sonan-app/scripts/translate-data.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const DATA  = join(__dir, '../public/data');
const LANGS = ['en', 'fr', 'es', 'tr', 'id'];
const CONCURRENCY = 8;

/* ── Google Translate (unofficial, no key) ─────────────── */
async function gt(text, lang) {
  if (!text || !text.trim()) return text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  // d[0] is array of sentence chunks: [[translated, original, ...], ...]
  return d[0].map(chunk => chunk[0]).join('');
}

/* ── Batch with concurrency ────────────────────────────── */
async function translateAll(texts, lang, label = '') {
  const results = [...texts];
  const todo = texts.map((t, i) => ({ i, t })).filter(x => x.t?.trim());
  let done = 0;

  for (let i = 0; i < todo.length; i += CONCURRENCY) {
    const chunk = todo.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async ({ i: idx, t }) => {
      try {
        results[idx] = await gt(t, lang);
      } catch (e) {
        console.warn(`  ⚠ Failed [${lang}] "${t.slice(0, 30)}": ${e.message}`);
        results[idx] = t; // keep original on failure
      }
      done++;
    }));
    process.stdout.write(`\r  ${label} [${lang}] ${done}/${todo.length} translated`);
    // Small pause between batches to be a good citizen
    if (i + CONCURRENCY < todo.length) await new Promise(r => setTimeout(r, 150));
  }
  console.log();
  return results;
}

/* ── Translate adhkar-data.json ─────────────────────────── */
async function translateAdhkarData() {
  const src = JSON.parse(readFileSync(join(DATA, 'adhkar-data.json'), 'utf8'));
  const texts = src.map(c => c.text);

  for (const lang of LANGS) {
    const out = join(DATA, `adhkar-data.${lang}.json`);
    if (existsSync(out)) { console.log(`  ✓ adhkar-data.${lang}.json already exists, skipping`); continue; }
    console.log(`\nTranslating adhkar-data → ${lang}...`);
    const translated = await translateAll(texts, lang, 'adhkar');
    const result = src.map((c, i) => ({ ...c, text: translated[i] ?? c.text }));
    writeFileSync(out, JSON.stringify(result, null, 2), 'utf8');
    console.log(`  ✅ Saved adhkar-data.${lang}.json`);
  }
}

/* ── Translate sonan-data.json ─────────────────────────── */
async function translateSonanData() {
  const src = JSON.parse(readFileSync(join(DATA, 'sonan-data.json'), 'utf8'));
  const texts = src.map(c => c.text);

  for (const lang of LANGS) {
    const out = join(DATA, `sonan-data.${lang}.json`);
    if (existsSync(out)) { console.log(`  ✓ sonan-data.${lang}.json already exists, skipping`); continue; }
    console.log(`\nTranslating sonan-data → ${lang}...`);
    const translated = await translateAll(texts, lang, 'sonan');
    const result = src.map((c, i) => ({ ...c, text: translated[i] ?? c.text }));
    writeFileSync(out, JSON.stringify(result, null, 2), 'utf8');
    console.log(`  ✅ Saved sonan-data.${lang}.json`);
  }
}

/* ── Translate advices-data.json ────────────────────────── */
async function translateAdvicesData() {
  const src = JSON.parse(readFileSync(join(DATA, 'advices-data.json'), 'utf8'));

  for (const lang of LANGS) {
    const out = join(DATA, `advices-data.${lang}.json`);
    if (existsSync(out)) { console.log(`  ✓ advices-data.${lang}.json already exists, skipping`); continue; }
    console.log(`\nTranslating advices-data → ${lang}...`);

    // Collect all text fields in order
    const FIELDS = ['title', 'narrator', 'hadith', 'source', 'explanation', 'intro', 'note'];
    const textQueue = [];
    const map = []; // {adviceIdx, field}

    const metaTexts = [src.title, src.subtitle];
    textQueue.push(...metaTexts);

    src.advices.forEach((a, ai) => {
      textQueue.push(a.title);
      map.push({ ai, field: 'title', qi: textQueue.length - 1 });
      FIELDS.filter(f => f !== 'title').forEach(f => {
        if (a.content?.[f]) {
          textQueue.push(a.content[f]);
          map.push({ ai, field: f, qi: textQueue.length - 1 });
        }
      });
    });

    const translated = await translateAll(textQueue, lang, 'advices');

    // Rebuild structure
    const result = {
      title: translated[0] ?? src.title,
      subtitle: translated[1] ?? src.subtitle,
      advices: src.advices.map((a, ai) => {
        const newContent = { ...a.content };
        map.filter(m => m.ai === ai).forEach(m => {
          if (m.field === 'title') return;
          newContent[m.field] = translated[m.qi] ?? a.content[m.field];
        });
        const titleEntry = map.find(m => m.ai === ai && m.field === 'title');
        return {
          ...a,
          title: titleEntry ? (translated[titleEntry.qi] ?? a.title) : a.title,
          content: newContent,
        };
      }),
    };

    writeFileSync(out, JSON.stringify(result, null, 2), 'utf8');
    console.log(`  ✅ Saved advices-data.${lang}.json`);
  }
}

/* ── Translate wife-sonan-data.json ─────────────────────── */
async function translateWifeData() {
  const path = join(DATA, 'wife-sonan-data.json');
  if (!existsSync(path)) return;
  const src = JSON.parse(readFileSync(path, 'utf8'));

  for (const lang of LANGS) {
    const out = join(DATA, `wife-sonan-data.${lang}.json`);
    if (existsSync(out)) { console.log(`  ✓ wife-sonan-data.${lang}.json already exists, skipping`); continue; }
    console.log(`\nTranslating wife-sonan-data → ${lang}...`);

    const items = Array.isArray(src) ? src : src.items ?? [];
    const fields = ['text', 'title', 'hadith', 'source', 'explanation'];
    const queue = [];
    const map = [];

    items.forEach((item, ii) => {
      fields.forEach(f => {
        if (item[f]) { queue.push(item[f]); map.push({ ii, f, qi: queue.length - 1 }); }
      });
    });

    const translated = await translateAll(queue, lang, 'wife');
    const result = items.map((item, ii) => {
      const newItem = { ...item };
      map.filter(m => m.ii === ii).forEach(m => { newItem[m.f] = translated[m.qi] ?? item[m.f]; });
      return newItem;
    });

    writeFileSync(out, JSON.stringify(Array.isArray(src) ? result : { ...src, items: result }, null, 2), 'utf8');
    console.log(`  ✅ Saved wife-sonan-data.${lang}.json`);
  }
}

/* ── Main ───────────────────────────────────────────────── */
console.log('🌙 Pre-translating app content into 5 languages...\n');
console.log(`📁 Data directory: ${DATA}\n`);

await translateAdhkarData();
await translateSonanData();
await translateAdvicesData();
await translateWifeData();

console.log('\n✅ All done! Pre-translated JSON files saved to public/data/');
