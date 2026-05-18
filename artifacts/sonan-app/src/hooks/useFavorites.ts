import { useState, useCallback, useEffect } from 'react';
import type { ContentItem } from '@/lib/contentData';

const FAVORITES_KEY = 'favorite_items';
const FAVORITES_EVENT = 'favoriteschange';

export type FavoriteItem = ContentItem & { savedAt: number };

function readFavorites(): FavoriteItem[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? (JSON.parse(stored) as FavoriteItem[]) : [];
  } catch {
    return [];
  }
}

function writeFavorites(items: FavoriteItem[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
  } catch {
    // Storage error
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(readFavorites);

  useEffect(() => {
    const sync = () => setFavorites(readFavorites());
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((item: ContentItem) => {
    const current = readFavorites();
    const exists = current.some((f) => f.id === item.id);
    const next: FavoriteItem[] = exists
      ? current.filter((f) => f.id !== item.id)
      : [...current, { ...item, savedAt: Date.now() }];
    writeFavorites(next);
    setFavorites(next);
  }, []);

  const removeFavorite = useCallback((id: string) => {
    const next = readFavorites().filter((f) => f.id !== id);
    writeFavorites(next);
    setFavorites(next);
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
