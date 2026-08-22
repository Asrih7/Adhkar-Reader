import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, RefreshCw } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { getCachedLocation, setCachedLocation, clearLocationCache } from "@/hooks/useLocationCache";
import { reverseGeocodeLocation } from "@/lib/locationService";

interface PrayerTime {
  nameKey: string;
  nameAr: string;
  time: string;
  isNext?: boolean;
}

const PRAYER_KEYS: Array<{ key: string; nameAr: string; apiKey: string }> = [
  { key: "fajr",    nameAr: "الفجر",   apiKey: "Fajr" },
  { key: "sunrise", nameAr: "الشروق",  apiKey: "Sunrise" },
  { key: "dhuhr",   nameAr: "الظهر",   apiKey: "Dhuhr" },
  { key: "asr",     nameAr: "العصر",   apiKey: "Asr" },
  { key: "maghrib", nameAr: "المغرب",  apiKey: "Maghrib" },
  { key: "isha",    nameAr: "العشاء",  apiKey: "Isha" },
];

function formatTime(raw: string): string {
  const [h, m] = raw.replace(/\s*(IST|GMT|UTC|BST|EDT|PDT).*/i, "").trim().split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}

function computeCountdown(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const diff = target.getTime() - now.getTime();
  const hh = Math.floor(diff / 3_600_000);
  const mm = Math.floor((diff % 3_600_000) / 60_000);
  return `${hh}:${String(mm).padStart(2, "0")}`;
}

function markNext(prayers: PrayerTime[]): PrayerTime[] {
  const now = new Date();
  const cur = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  let marked = false;
  return prayers.map((p) => {
    if (!marked && p.time > cur) {
      marked = true;
      return { ...p, isNext: true };
    }
    return { ...p, isNext: false };
  });
}

export default function PrayerTimes() {
  const { t, language } = useTranslation();
  const isRtl = language === "ar";

  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [cityLabel, setCityLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState("");

  const buildPrayers = useCallback((timings: Record<string, string>): PrayerTime[] => {
    return PRAYER_KEYS.map(({ key, nameAr, apiKey }) => ({
      nameKey: key,
      nameAr,
      time: formatTime(timings[apiKey] || "00:00"),
    }));
  }, []);

  const loadByCoords = useCallback(
    async (latitude: number, longitude: number, accuracy: number, label?: string) => {
      const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await res.json();
      if (data.code !== 200 || !data.data?.timings) {
        throw new Error("Prayer timings unavailable");
      }

      const locationLabel = label || await reverseGeocodeLocation(latitude, longitude, language);

      setCachedLocation({
        lat: latitude,
        lon: longitude,
        accuracy,
        timestamp: Date.now(),
        source: "gps",
        label: locationLabel,
      });
      setPrayers(markNext(buildPrayers(data.data.timings)));
      setCityLabel(locationLabel);
    },
    [buildPrayers, isRtl, language]
  );

  const loadByGPS = useCallback(() => {
    setLoading(true);
    setError(false);

    if (!navigator.geolocation) {
      setError(true);
      setLoading(false);
      return;
    }

    // Ask for a fresh position so travel from Tetouan to London or Alicante is detected.
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await loadByCoords(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
        } catch {
          const cached = getCachedLocation();
          if (cached?.source === "gps") {
            await loadByCoords(cached.lat, cached.lon, cached.accuracy, cached.label);
          } else {
            clearLocationCache();
            setError(true);
          }
        } finally {
          setLoading(false);
        }
      },
      async () => {
        const cached = getCachedLocation();
        if (cached?.source === "gps") {
          try {
            await loadByCoords(cached.lat, cached.lon, cached.accuracy, cached.label);
          } catch {
            clearLocationCache();
            setError(true);
          }
        } else {
          setError(true);
        }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [loadByCoords]);

  useEffect(() => {
    loadByGPS();
  }, [loadByGPS]);

  const nextPrayer = prayers.find((p) => p.isNext) || null;

  useEffect(() => {
    if (!nextPrayer) return;
    setCountdown(computeCountdown(nextPrayer.time));
    const id = setInterval(() => setCountdown(computeCountdown(nextPrayer.time)), 30_000);
    return () => clearInterval(id);
  }, [nextPrayer]);

  const getPrayerName = (p: PrayerTime) =>
    language === "ar" ? p.nameAr : t(p.nameKey) || p.nameAr;

  return (
    <PageLayout
      title={t("prayerTimes")}
      subtitle={t("location") || "Location"}
    >
      <div className="pb-24 mt-4 space-y-5">

        {/* ── Location Display & Refresh ── */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1"
            style={{
              background: "var(--gold-muted)",
              border: "1px solid var(--gold-border)",
              color: "var(--text-gold)",
            }}>
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium truncate">
              {cityLabel || (isRtl ? "جاري تحديد الموقع..." : "Detecting location...")}
            </span>
          </div>
          <button
            onClick={loadByGPS}
            className="p-2 rounded-xl transition-all flex-shrink-0"
            style={{
              background: "var(--gold-muted)",
              border: "1px solid var(--gold-border)",
              color: "var(--text-gold)",
            }}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-full"
              style={{ border: "4px solid var(--gold-muted)", borderTopColor: "var(--gold)" }}
            />
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div
            className="p-5 rounded-2xl text-center space-y-3"
            style={{ background: "hsl(var(--card))", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {isRtl ? "تعذّر تحديد الموقع" : "Could not detect location"}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {isRtl
                ? "تأكد من تفعيل خدمة الموقع في هاتفك أو اختر مدينتك يدويًا"
                : "Please enable location services on your device or select your city manually below"}
            </p>
            <button
              onClick={loadByGPS}
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{
                background: "var(--gold-muted)",
                border: "1px solid var(--gold-border)",
                color: "var(--text-gold)",
              }}
            >
              {isRtl ? "إعادة المحاولة" : "Retry"}
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {!loading && !error && prayers.length > 0 && (
          <>
            {/* Next Prayer Card */}
            {nextPrayer && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, var(--gold-muted), var(--teal-muted))",
                  border: "1px solid var(--gold-border)",
                }}
              >
                <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                  {t("nextPrayer")}
                </p>
                <h2 className="text-4xl font-bold amiri mb-1" style={{ color: "var(--text-gold)" }}>
                  {getPrayerName(nextPrayer)}
                </h2>
                <p className="text-xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                  {nextPrayer.time}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {t("until") || (isRtl ? "يتبقى" : "Remaining")}
                  </span>
                  <span className="text-3xl font-black" style={{ color: "var(--teal-light, #5eead4)" }}>
                    {countdown}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Prayer List */}
            <div className="space-y-2">
              {prayers.map((prayer, idx) => (
                <motion.div
                  key={prayer.nameKey}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{
                    background: prayer.isNext
                      ? "linear-gradient(135deg, var(--gold-muted), var(--teal-muted))"
                      : "hsl(var(--card))",
                    border: prayer.isNext
                      ? "2px solid var(--gold)"
                      : "1px solid var(--gold-border)",
                  }}
                >
                  <p
                    className="font-semibold text-base"
                    style={{
                      color: prayer.isNext ? "var(--text-gold)" : "var(--text-primary)",
                    }}
                  >
                    {getPrayerName(prayer)}
                  </p>
                  <p
                    className="text-lg font-bold tabular-nums"
                    style={{
                      color: prayer.isNext ? "var(--text-teal)" : "var(--text-secondary)",
                    }}
                  >
                    {prayer.time}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-xs py-2" style={{ color: "var(--text-muted)" }}>
              {isRtl ? "طريقة الحساب: إمام الشافعي" : "Calculation method: Imam Shafi'i"}
            </p>
          </>
        )}
      </div>
    </PageLayout>
  );
}
