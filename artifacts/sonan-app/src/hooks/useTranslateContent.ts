/**
 * useTranslateContent Hook
 * Hook for translating content dynamically using the Translation Service
 */

import { useState, useCallback, useEffect } from 'react';
import type { Language } from '@/lib/translations';
import { translateText, batchTranslateText, translateContentObject } from '@/lib/translationService';

export interface UseTranslateContentOptions {
  languages?: Language[];
  autoTranslate?: boolean;
  cacheResults?: boolean;
}

/**
 * Hook to translate text dynamically
 * @param text - Text to translate
 * @param options - Translation options
 * @returns Translated text in all languages
 *
 * Usage:
 * const { translations, isLoading, error } = useTranslateContent("Hello World");
 * console.log(translations.ar); // Arabic translation
 */
export function useTranslateContent(
  text: string,
  options: UseTranslateContentOptions = {}
) {
  const {
    languages = ['ar', 'en', 'fr', 'es', 'tr', 'id'],
    autoTranslate = true,
  } = options;

  const [translations, setTranslations] = useState<Record<Language, string>>({
    ar: text,
    en: text,
    fr: text,
    es: text,
    tr: text,
    id: text,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (textToTranslate: string) => {
    if (!textToTranslate || textToTranslate.trim().length === 0) {
      setTranslations({
        ar: '',
        en: '',
        fr: '',
        es: '',
        tr: '',
        id: '',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const entries = await Promise.all(languages.map(async (language) => [language, await translateText(textToTranslate, language)] as const));
      setTranslations(Object.fromEntries(entries) as Record<Language, string>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [languages]);

  // Auto-translate on mount if enabled
  useEffect(() => {
    if (autoTranslate && text) {
      translate(text);
    }
  }, [text, autoTranslate, translate]);

  return {
    translations,
    isLoading,
    error,
    translate,
  };
}

/**
 * Hook to translate multiple texts
 * @param texts - Array of texts to translate
 * @param options - Translation options
 * @returns Array of translated texts
 *
 * Usage:
 * const { translations, isLoading } = useBatchTranslate(["Hello", "World"]);
 */
export function useBatchTranslate(
  texts: string[],
  options: UseTranslateContentOptions = {}
) {
  const {
    languages = ['ar', 'en', 'fr', 'es', 'tr', 'id'],
    autoTranslate = true,
  } = options;

  const [translations, setTranslations] = useState<Array<Record<Language, string>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (textsToTranslate: string[]) => {
    if (!textsToTranslate || textsToTranslate.length === 0) {
      setTranslations([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await batchTranslateText(textsToTranslate, languages);
      setTranslations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      console.error('Batch translation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [languages]);

  // Auto-translate on mount if enabled
  useEffect(() => {
    if (autoTranslate && texts.length > 0) {
      translate(texts);
    }
  }, [texts, autoTranslate, translate]);

  return {
    translations,
    isLoading,
    error,
    translate,
  };
}

/**
 * Hook to translate content object (Adhkar, Sonan, etc.)
 * @param content - Content object to translate
 * @param options - Translation options
 * @returns Translated content in all languages
 *
 * Usage:
 * const { translatedContent, isLoading } = useTranslateContentObject(adhkarData);
 * console.log(translatedContent.ar); // Adhkar in Arabic
 */
export function useTranslateContentObject(
  content: Record<string, any>,
  options: UseTranslateContentOptions = {}
) {
  const {
    languages = ['ar', 'en', 'fr', 'es', 'tr', 'id'],
    autoTranslate = true,
  } = options;

  const [translatedContent, setTranslatedContent] = useState<Record<Language, Record<string, any>>>({
    ar: content,
    en: content,
    fr: content,
    es: content,
    tr: content,
    id: content,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (contentToTranslate: Record<string, any>) => {
    if (!contentToTranslate || Object.keys(contentToTranslate).length === 0) {
      setTranslatedContent({
        ar: {},
        en: {},
        fr: {},
        es: {},
        tr: {},
        id: {},
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await translateContentObject(contentToTranslate, languages);
      setTranslatedContent(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      console.error('Content translation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [languages]);

  // Auto-translate on mount if enabled
  useEffect(() => {
    if (autoTranslate && Object.keys(content).length > 0) {
      translate(content);
    }
  }, [content, autoTranslate, translate]);

  return {
    translatedContent,
    isLoading,
    error,
    translate,
  };
}

export default useTranslateContent;
