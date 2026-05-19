/**
 * Debug utilities for translation cache
 */

export function inspectCache(): {
  totalEntries: number;
  byLanguage: Record<string, number>;
  sampleKeys: string[];
} {
  if (typeof localStorage === 'undefined') {
    return { totalEntries: 0, byLanguage: {}, sampleKeys: [] };
  }

  const keys = Object.keys(localStorage).filter(k => k.startsWith('tr_cache_'));
  const byLanguage: Record<string, number> = {};
  
  keys.forEach(key => {
    const match = key.match(/tr_cache_([a-z]{2})_/);
    if (match) {
      const lang = match[1];
      byLanguage[lang] = (byLanguage[lang] || 0) + 1;
    }
  });

  return {
    totalEntries: keys.length,
    byLanguage,
    sampleKeys: keys.slice(0, 3)
  };
}

export function clearCache(lang?: string): number {
  if (typeof localStorage === 'undefined') return 0;

  const keys = Object.keys(localStorage).filter(k => k.startsWith('tr_cache_'));
  let cleared = 0;

  keys.forEach(key => {
    if (!lang || key.includes(`tr_cache_${lang}_`)) {
      localStorage.removeItem(key);
      cleared++;
    }
  });

  return cleared;
}

export function getCacheValue(key: string): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(key);
}
