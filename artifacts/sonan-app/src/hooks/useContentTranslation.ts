/**
 * useContentTranslation Hook
 * Translates Islamic content while keeping Arabic text visible
 * Provides progress tracking and efficient caching
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
 * Hook to translate content items
 * Handles caching, batch translation, and progress tracking
 */
export function useContentTranslation(
  items: ContentItem[] | null | undefined,
  targetLang: Language
): UseContentTranslationResult {
  const [translatedItems, setTranslatedItems] = useState<TranslatedContentItem[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);

  useEffect(() => {
    if (!items || targetLang === 'ar') {
      setTranslatedItems(
        items?.map((item) => ({
          ...item,
          translatedText: item.arabic,
        })) || []
      );
      setIsTranslating(false);
      setTranslationProgress(100);
      return;
    }

    const translateContent = async (): Promise<void> => {
      setIsTranslating(true);
      setTranslationProgress(0);

      try {
        const arabicTexts = items.map((item) => item.arabic);
        const batchSize = 5;
        const translations: string[] = [];

        for (let i = 0; i < arabicTexts.length; i += batchSize) {
          const batch = arabicTexts.slice(i, i + batchSize);
          const batchResults = await translateBatch(batch, targetLang, 3);
          translations.push(...batchResults);

          const progress = Math.min(100, Math.round(((i + batchSize) / arabicTexts.length) * 100));
          setTranslationProgress(progress);
        }

        const result = items.map((item, index) => ({
          ...item,
          translatedText: translations[index] || item.arabic,
        }));

        setTranslatedItems(result);
        setTranslationProgress(100);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedItems(
          items.map((item) => ({
            ...item,
            translatedText: item.arabic,
          }))
        );
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [items, targetLang]);

  return {
    translatedItems,
    isTranslating,
    translationProgress,
  };
}
