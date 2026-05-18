/**
 * Adhkar Content Translation Utilities
 * Loads Adhkar data and translates all fields dynamically
 */

import type { Language } from '@/lib/translations';
import { translationService } from '@/lib/translationService';

export interface AdhkarData {
  id: string;
  title: string;
  content: string;
  category: string;
  count?: number;
  transliteration?: string;
  explanation?: string;
}

export interface AdhkarWithTranslations {
  id: string;
  translations: Record<Language, AdhkarData>;
}

/**
 * Load and translate single Adhkar
 * @param adhkarId - ID of the Adhkar
 * @returns Adhkar with translations in all languages
 */
export async function loadAndTranslateAdhkar(
  adhkarId: string,
  adhkarData: AdhkarData
): Promise<AdhkarWithTranslations> {
  try {
    const translated = await translationService.translateContent<AdhkarData>(adhkarData, [
      'ar',
      'en',
      'fr',
      'es',
      'tr',
      'id',
    ]);

    return {
      id: adhkarId,
      translations: translated,
    };
  } catch (error) {
    console.error(`Failed to translate Adhkar ${adhkarId}:`, error);
    // Return original data if translation fails
    return {
      id: adhkarId,
      translations: {
        ar: adhkarData,
        en: adhkarData,
        fr: adhkarData,
        es: adhkarData,
        tr: adhkarData,
        id: adhkarData,
      },
    };
  }
}

/**
 * Load and translate all Adhkar from a JSON file
 * @param jsonData - Array of Adhkar data
 * @returns All Adhkar with translations
 */
export async function loadAndTranslateAllAdhkar(
  jsonData: AdhkarData[]
): Promise<AdhkarWithTranslations[]> {
  return Promise.all(
    jsonData.map((adhkar, index) =>
      loadAndTranslateAdhkar(`adhkar-${index}`, adhkar)
    )
  );
}

/**
 * Get Adhkar in specific language
 * @param adhkarWithTrans - Adhkar with translations
 * @param language - Target language
 * @returns Adhkar in specified language
 */
export function getAdhkarInLanguage(
  adhkarWithTrans: AdhkarWithTranslations,
  language: Language
): AdhkarData {
  return adhkarWithTrans.translations[language];
}

/**
 * Search Adhkar by title (translated)
 * @param adhkars - Array of translated Adhkar
 * @param searchTerm - Search term
 * @param language - Language to search in
 * @returns Matching Adhkar
 */
export function searchAdhkar(
  adhkars: AdhkarWithTranslations[],
  searchTerm: string,
  language: Language
): AdhkarWithTranslations[] {
  const lowerSearchTerm = searchTerm.toLowerCase();

  return adhkars.filter((adhkar) => {
    const adhkarData = adhkar.translations[language];
    return (
      adhkarData.title.toLowerCase().includes(lowerSearchTerm) ||
      adhkarData.content.toLowerCase().includes(lowerSearchTerm) ||
      adhkarData.category.toLowerCase().includes(lowerSearchTerm)
    );
  });
}

/**
 * Filter Adhkar by category (translated)
 * @param adhkars - Array of translated Adhkar
 * @param category - Category to filter
 * @param language - Language to use for filtering
 * @returns Filtered Adhkar
 */
export function filterAdhkarByCategory(
  adhkars: AdhkarWithTranslations[],
  category: string,
  language: Language
): AdhkarWithTranslations[] {
  return adhkars.filter(
    (adhkar) =>
      adhkar.translations[language].category.toLowerCase() ===
      category.toLowerCase()
  );
}

/**
 * Get unique categories (translated)
 * @param adhkars - Array of translated Adhkar
 * @param language - Language to use for categories
 * @returns Array of unique categories
 */
export function getCategories(
  adhkars: AdhkarWithTranslations[],
  language: Language
): string[] {
  const categories = new Set<string>();

  adhkars.forEach((adhkar) => {
    categories.add(adhkar.translations[language].category);
  });

  return Array.from(categories);
}

/**
 * Export translations to JSON file
 * @param adhkars - Translated Adhkar
 * @param language - Language to export
 */
export function exportToJSON(
  adhkars: AdhkarWithTranslations[],
  language: Language
): string {
  const data = adhkars.map((adhkar) => {
    const { id, ...rest } = adhkar.translations[language];
    return {
      id: adhkar.id,
      ...rest,
    };
  });

  return JSON.stringify(data, null, 2);
}

/**
 * Example usage:
 *
 * // In a component:
 * const [adhkars, setAdhkars] = useState<AdhkarWithTranslations[]>([]);
 * const [isLoading, setIsLoading] = useState(true);
 *
 * useEffect(() => {
 *   async function loadAdhkar() {
 *     try {
 *       const response = await fetch('/data/adhkar-0.json');
 *       const data: AdhkarData[] = await response.json();
 *       const translated = await loadAndTranslateAllAdhkar(data);
 *       setAdhkars(translated);
 *     } catch (error) {
 *       console.error('Failed to load Adhkar:', error);
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   }
 *
 *   loadAdhkar();
 * }, []);
 *
 * // Display in current language
 * const { language } = useTranslation();
 * const displayAdhkar = adhkars.map(a => getAdhkarInLanguage(a, language as Language));
 *
 * // Search functionality
 * const results = searchAdhkar(adhkars, searchTerm, language as Language);
 *
 * // Filter by category
 * const categories = getCategories(adhkars, language as Language);
 * const filtered = filterAdhkarByCategory(adhkars, selectedCategory, language as Language);
 */
