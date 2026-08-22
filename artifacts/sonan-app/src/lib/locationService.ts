import type { CachedLocation } from "@/hooks/useLocationCache";

const REVERSE_CACHE_PREFIX = "adhkar_reverse_geocode:";
const REVERSE_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  city_district?: string;
  county?: string;
  state?: string;
  country?: string;
  country_code?: string;
};

type NominatimResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

function cacheKey(latitude: number, longitude: number): string {
  return `${REVERSE_CACHE_PREFIX}${latitude.toFixed(3)}:${longitude.toFixed(3)}`;
}

function readCachedLabel(latitude: number, longitude: number): string | null {
  try {
    const raw = localStorage.getItem(cacheKey(latitude, longitude));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { label?: string; timestamp?: number };
    if (parsed.label && parsed.timestamp && Date.now() - parsed.timestamp < REVERSE_CACHE_TTL) {
      return parsed.label;
    }
  } catch {
    // Ignore malformed local cache entries.
  }
  return null;
}

function writeCachedLabel(latitude: number, longitude: number, label: string): void {
  try {
    localStorage.setItem(cacheKey(latitude, longitude), JSON.stringify({ label, timestamp: Date.now() }));
  } catch {
    // Ignore storage quota and private-mode errors.
  }
}

function fallbackLabel(language: string): string {
  return language === "ar" ? "موقعك الحالي" : language === "fr" ? "Votre position actuelle" : "Your current location";
}

export async function reverseGeocodeLocation(
  latitude: number,
  longitude: number,
  language: string,
): Promise<string> {
  const cached = readCachedLabel(latitude, longitude);
  if (cached) return cached;

  const locale = language === "ar" ? "ar" : language || "en";
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);

  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(latitude));
    url.searchParams.set("lon", String(longitude));
    url.searchParams.set("zoom", "10");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("accept-language", locale);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Reverse geocoding failed: ${response.status}`);

    const data = (await response.json()) as NominatimResponse;
    const address = data.address || {};
    const city = address.city || address.town || address.village || address.municipality || address.city_district || address.county;
    const country = address.country;
    const label = [city, country].filter(Boolean).join(", ") || data.display_name || fallbackLabel(language);
    writeCachedLabel(latitude, longitude, label);
    return label;
  } catch {
    return fallbackLabel(language);
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function enrichGpsLocation(
  latitude: number,
  longitude: number,
  accuracy: number,
  language: string,
): Promise<CachedLocation> {
  const label = await reverseGeocodeLocation(latitude, longitude, language);
  return {
    lat: latitude,
    lon: longitude,
    accuracy,
    timestamp: Date.now(),
    source: "gps",
    label,
  };
}
