/**
 * useContentTranslation Hook
 * Translates all content (titles, cards, text) with efficient caching
 * Shows progress bar and handles loading states
 * Uses rate limiting to avoid API errors (429)
 * 
 * KEY: This hook MUST re-translate when language changes, even if items haven't changed
 */

import { useState, useEffect } from 'react';
import type { ContentItem } from '@/lib/contentData';
import { translateBatch } from '@/lib/translationService';
import type { Language } from '@/lib/translations';

export interface TranslatedContentItem extends ContentItem {
  translatedText: string;
}

interface UseContentTranslationResult {
  translatedItems: TranslatedContentItem[];
  isTranslating: boolean;
  translationProgress: number;
}

/**
 * Hook to translate content items (titles, body text, explanations, etc.)
 * Handles caching, batch translation, and progress tracking
 * Implements rate limiting to avoid API rate limit errors
 * 
 * IMPORTANT: Re-translates whenever items OR language changes
 */
export function useContentTranslation(
  items: ContentItem[] | null | undefined,
  targetLang: Language
): UseContentTranslationResult {
  const [translatedItems, setTranslatedItems] = useState<TranslatedContentItem[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  // Track previous language to detect changes
  const [prevLang, setPrevLang] = useState<Language>(targetLang);

  useEffect(() => {
    if (!items || items.length === 0) {
      setTranslatedItems([]);
      setIsTranslating(false);
      setTranslationProgress(100);
      return;
    }

    // Arabic needs no translation
    if (targetLang === 'ar') {
      setTranslatedItems(
        items.map((item) => ({
          ...item,
          translatedText: item.arabic,
        }))
      );
      setIsTranslating(false);
      setTranslationProgress(100);
      setPrevLang(targetLang);
      return;
    }

    const translateContent = async (): Promise<void> => {
      setIsTranslating(true);
      setTranslationProgress(5);
      console.log(`📝 Starting translation to ${targetLang} for ${items.length} items`);

      try {
        const arabicTexts = items.map((item) => item.arabic);
        const batchSize = 3; // Reduced batch size to avoid rate limiting
        const translations: string[] = [];

        // Translate in batches with progress updates
        for (let i = 0; i < arabicTexts.length; i += batchSize) {
          const batch = arabicTexts.slice(i, i + batchSize);
          const batchNum = Math.floor(i / batchSize) + 1;
          const totalBatches = Math.ceil(arabicTexts.length / batchSize);
          
          console.log(`📦 Translating batch ${batchNum}/${totalBatches} (${batch.length} items)`);

          // Translate with low concurrency (1 parallel request) to avoid rate limiting
          const batchResults = await translateBatch(batch, targetLang, 1);
          translations.push(...batchResults);

          // Update progress
          const progress = Math.min(95, Math.round(5 + ((i + batchSize) / arabicTexts.length) * 90));
          setTranslationProgress(progress);

          // Add significant delay between batches to avoid API rate limiting (429 errors)
          // MyMemory has rate limits, so we space out requests
          if (i + batchSize < arabicTexts.length) {
            await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
          }
        }

        // Build final translated items
        const result = items.map((item, index) => {
          const translated = translations[index]?.trim();
          return {
            ...item,
            // Always show something: translated text, or fallback to Arabic
            translatedText: translated && translated.length > 0 ? translated : item.arabic,
          };
        });

        setTranslatedItems(result);
        setTranslationProgress(100);
        console.log(`✅ Translation complete: ${targetLang} - ${result.length} items`);
        
        // Log a sample for debugging
        if (result.length > 0) {
          console.log('Sample translation:', {
            arabic: result[0].arabic.substring(0, 50),
            translated: result[0].translatedText.substring(0, 50),
          });
        }
      } catch (error) {
        console.error(`❌ Translation error for ${targetLang}:`, error);
        
        // On error, fall back to showing Arabic text
        setTranslatedItems(
          items.map((item) => ({
            ...item,
            translatedText: item.arabic,
          }))
        );
      } finally {
        setIsTranslating(false);
        setTranslationProgress(100);
        setPrevLang(targetLang);
      }
    };

    translateContent();
    // CRITICAL: Include targetLang in dependency array to re-translate when language changes
    // Do NOT remove targetLang from this array
  }, [items, targetLang]); // <-- Both items AND targetLang are dependencies

  return { translatedItems, isTranslating, translationProgress };
}
