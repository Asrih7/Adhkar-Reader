/**
 * Location Caching Hook
 * Stores user's location in localStorage to avoid repeated GPS requests
 */

export interface CachedLocation {
  lat: number;
  lon: number;
  accuracy: number;
  timestamp: number;
  source: "gps" | "city";
  label: string;
}

const LOCATION_CACHE_KEY = "adhkar_user_location";
const CACHE_VALIDITY_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getCachedLocation(): CachedLocation | null {
  try {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!cached) return null;

    const location: CachedLocation = JSON.parse(cached);
    const age = Date.now() - location.timestamp;

    // Only use cache if less than 24 hours old
    if (age < CACHE_VALIDITY_MS) {
      return location;
    }

    // Clear expired cache
    localStorage.removeItem(LOCATION_CACHE_KEY);
  } catch {
    // Ignore parsing errors
  }

  return null;
}

export function setCachedLocation(location: CachedLocation): void {
  try {
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(location));
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

export function clearLocationCache(): void {
  try {
    localStorage.removeItem(LOCATION_CACHE_KEY);
  } catch {
    // Ignore errors
  }
}

export function getDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}
