import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, RefreshCw, Navigation2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8264;

function calcQibla(lat: number, lon: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const lat1 = toRad(lat);
  const lat2 = toRad(KAABA_LAT);
  const dLon = toRad(KAABA_LON - lon);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

type Stage =
  | "locating"
  | "needs_permission"
  | "active"
  | "permission_denied"
  | "no_sensor"
  | "location_error";

const CARDINALS = [
  { label: "ش", deg: 0 },
  { label: "NE", deg: 45 },
  { label: "ق", deg: 90 },
  { label: "SE", deg: 135 },
  { label: "ج", deg: 180 },
  { label: "SW", deg: 225 },
  { label: "غ", deg: 270 },
  { label: "NW", deg: 315 },
];

export default function Qibla() {
  const { language } = useTranslation();
  const isArabic = language === "ar";

  const [stage, setStage] = useState<Stage>("locating");
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
    accuracy: number;
  } | null>(null);
  const [qibla, setQibla] = useState(0);
  const [heading, setHeading] = useState<number | null>(null);

  const listenerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  // iOS 13+ requires DeviceOrientationEvent.requestPermission() from a user gesture
  const isIOS =
    typeof window !== "undefined" &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
      .requestPermission === "function";

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    // iOS: webkitCompassHeading = clockwise from magnetic north
    const webkitHeading = (e as unknown as { webkitCompassHeading?: number })
      .webkitCompassHeading;

    if (webkitHeading !== null && webkitHeading !== undefined) {
      setHeading(webkitHeading);
    } else if (e.alpha !== null) {
      // Android: alpha is CCW from north → convert to CW compass bearing
      setHeading((360 - e.alpha) % 360);
    }
  }, []);

  const startListener = useCallback(() => {
    if (listenerRef.current) {
      window.removeEventListener("deviceorientation", listenerRef.current, true);
    }
    listenerRef.current = handleOrientation;
    window.addEventListener("deviceorientation", listenerRef.current, true);
    setStage("active");
  }, [handleOrientation]);

  const getLocation = useCallback(() => {
    setStage("locating");
    setHeading(null);

    if (!navigator.geolocation) {
      setStage("location_error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setLocation(loc);
        setQibla(calcQibla(loc.lat, loc.lon));

        if (!("DeviceOrientationEvent" in window)) {
          setStage("no_sensor");
          return;
        }
        if (isIOS) {
          setStage("needs_permission");
        } else {
          startListener();
        }
      },
      () => setStage("location_error"),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, [isIOS, startListener]);

  useEffect(() => {
    getLocation();
    return () => {
      if (listenerRef.current) {
        window.removeEventListener("deviceorientation", listenerRef.current, true);
      }
    };
  }, []);

  const requestIOSPermission = async () => {
    try {
      const permFn = (
        DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<string>;
        }
      ).requestPermission;
      const result = await permFn();
      if (result === "granted") {
        startListener();
      } else {
        setStage("permission_denied");
      }
    } catch {
      setStage("permission_denied");
    }
  };

  // Needle angle = direction user must rotate to face Mecca
  const needleAngle = heading !== null ? ((qibla - heading + 360) % 360) : 0;
  // Compass rose rotates opposite to heading
  const roseAngle = heading !== null ? -heading : 0;

  const compassSize = "min(80vw, 300px)";

  return (
    <PageLayout
      title={isArabic ? "القبلة" : "Qibla"}
      subtitle={isArabic ? "اتجاه الكعبة المشرفة" : "Direction of the Holy Kaaba"}
      backHref="/"
    >
      <div className="pb-28 mt-4 flex flex-col items-center gap-6">

        {/* ── Loading ── */}
        {stage === "locating" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-16"
          >
            <div
              className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }}
            />
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              {isArabic ? "جاري تحديد الموقع…" : "Locating you…"}
            </p>
          </motion.div>
        )}

        {/* ── Location Error ── */}
        {stage === "location_error" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center p-6 rounded-2xl space-y-4"
            style={{ background: "hsl(var(--card))", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <div className="text-4xl">📍</div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {isArabic ? "تعذّر تحديد الموقع" : "Location unavailable"}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {isArabic
                ? "تأكد من تفعيل خدمة الموقع وأن المتصفح لديه الإذن"
                : "Enable location services and allow browser access"}
            </p>
            <button
              onClick={getLocation}
              className="mx-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
              style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)", color: "var(--text-gold)" }}
            >
              <RefreshCw className="w-4 h-4" />
              {isArabic ? "إعادة المحاولة" : "Try Again"}
            </button>
          </motion.div>
        )}

        {/* ── iOS Permission Request ── */}
        {stage === "needs_permission" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center p-6 rounded-2xl space-y-4"
            style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}
          >
            <div className="text-5xl">🧭</div>
            <p className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
              {isArabic ? "إذن البوصلة" : "Compass Access"}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {isArabic
                ? "يحتاج التطبيق للوصول إلى مستشعر الاتجاه لتحديد القبلة بدقة"
                : "The app needs access to your device orientation sensor to find Qibla"}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={requestIOSPermission}
              className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 text-base"
              style={{
                background: "linear-gradient(135deg, var(--gold), var(--teal))",
                boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
              }}
            >
              <Navigation2 className="w-5 h-5" />
              {isArabic ? "تشغيل البوصلة" : "Enable Compass"}
            </motion.button>
          </motion.div>
        )}

        {/* ── Permission Denied ── */}
        {stage === "permission_denied" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center p-6 rounded-2xl space-y-3"
            style={{ background: "hsl(var(--card))", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <div className="text-4xl">🔒</div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {isArabic ? "تم رفض الإذن" : "Permission Denied"}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {isArabic
                ? "اذهب إلى إعدادات الهاتف > الخصوصية > حركة وتوجيه، وفعّل الوصول"
                : "Go to Settings > Privacy > Motion & Orientation Access and enable it"}
            </p>
          </motion.div>
        )}

        {/* ── No Sensor ── */}
        {stage === "no_sensor" && location && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center p-6 rounded-2xl space-y-3"
            style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}
          >
            <div className="text-4xl">🕌</div>
            <p className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
              {isArabic ? "اتجاه القبلة" : "Qibla Direction"}
            </p>
            <p className="text-4xl font-black" style={{ color: "var(--text-gold)" }}>
              {Math.round(qibla)}°
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {isArabic
                ? "جهاز البوصلة غير متوفر. استخدم بوصلة خارجية بالدرجة أعلاه"
                : "Compass sensor not available. Use an external compass with the degree above"}
            </p>
          </motion.div>
        )}

        {/* ── Active Compass ── */}
        {(stage === "active") && location && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 w-full"
          >
            {/* Compass circle */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: compassSize, height: compassSize }}
            >
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, rgba(212,175,55,0.03), rgba(32,201,151,0.07), rgba(212,175,55,0.03))",
                  boxShadow: "0 0 40px rgba(212,175,55,0.12), inset 0 0 40px rgba(0,0,0,0.2)",
                  border: "2px solid var(--gold-border)",
                  borderRadius: "50%",
                }}
              />

              {/* Rotating compass rose */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: roseAngle }}
                transition={{ type: "spring", stiffness: 60, damping: 22 }}
              >
                {/* Cardinal labels */}
                {CARDINALS.map(({ label, deg }) => {
                  const rad = ((deg - 90) * Math.PI) / 180;
                  const r = 42; // percent from center
                  const x = 50 + r * Math.cos(rad);
                  const y = 50 + r * Math.sin(rad);
                  const isMain = deg % 90 === 0;
                  return (
                    <span
                      key={deg}
                      className="absolute font-bold"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)",
                        fontSize: isMain ? "clamp(10px, 3vw, 14px)" : "clamp(8px, 2vw, 10px)",
                        color: deg === 0 ? "var(--text-gold)" : "var(--text-muted)",
                      }}
                    >
                      {label}
                    </span>
                  );
                })}

                {/* Tick marks */}
                {[...Array(72)].map((_, i) => {
                  const isMajor = i % 9 === 0;
                  const rad = ((i * 5 - 90) * Math.PI) / 180;
                  const r1 = isMajor ? 47 : 49;
                  const r2 = 51;
                  return (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        width: isMajor ? "2px" : "1px",
                        height: `${(r2 - r1) * 1.5}%`,
                        left: `${50 + r1 * Math.cos(rad)}%`,
                        top: `${50 + r1 * Math.sin(rad)}%`,
                        transform: `translate(-50%, -50%) rotate(${i * 5}deg)`,
                        background: isMajor ? "var(--text-muted)" : "var(--border-subtle)",
                        borderRadius: "1px",
                      }}
                    />
                  );
                })}
              </motion.div>

              {/* Mecca needle — rotates by relativeQibla angle */}
              <motion.div
                className="absolute inset-0 flex justify-center pointer-events-none"
                style={{ paddingBottom: "10%" }}
                animate={{ rotate: needleAngle }}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
              >
                <div className="flex flex-col items-center" style={{ height: "50%" }}>
                  {/* Arrow head */}
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "7px solid transparent",
                      borderRight: "7px solid transparent",
                      borderBottom: "14px solid var(--gold)",
                    }}
                  />
                  {/* Arrow shaft */}
                  <div
                    className="flex-1 w-2 rounded-b-full"
                    style={{ background: "linear-gradient(to bottom, var(--gold), rgba(212,175,55,0.4))" }}
                  />
                </div>
              </motion.div>

              {/* Center circle with Kaaba */}
              <div
                className="absolute rounded-full flex items-center justify-center z-10"
                style={{
                  width: "30%",
                  height: "30%",
                  background: "hsl(var(--card))",
                  border: "2px solid var(--gold-border)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  fontSize: "clamp(16px, 6vw, 28px)",
                }}
              >
                🕋
              </div>
            </div>

            {/* Degree display */}
            <div className="text-center">
              <p className="text-5xl font-black" style={{ color: "var(--text-gold)" }}>
                {Math.round(qibla)}°
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                {isArabic ? "من الشمال" : "from North"}
              </p>
            </div>

            {/* Instruction */}
            <div
              className="w-full p-4 rounded-2xl flex items-center gap-3"
              style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)" }}
            >
              <span className="text-2xl flex-shrink-0">👆</span>
              <p className="text-sm" style={{ color: "var(--text-teal)" }}>
                {isArabic
                  ? "وجّه هاتفك حتى يشير السهم الذهبي إلى الأعلى — عندها تكون مواجهاً للقبلة"
                  : "Rotate your phone until the gold arrow points up — then you're facing Qibla"}
              </p>
            </div>

            {/* Heading indicator */}
            {heading !== null && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {isArabic ? "اتجاهك الحالي:" : "Your heading:"} {Math.round(heading)}°
              </p>
            )}
          </motion.div>
        )}

        {/* ── Location Info (when active or no_sensor) ── */}
        {location && (stage === "active" || stage === "no_sensor") && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-4 rounded-2xl flex items-start gap-3"
            style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}
          >
            <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--text-teal)" }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-muted)" }}>
                {isArabic ? "موقعك" : "Your location"}
              </p>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}°
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                ±{Math.round(location.accuracy)} {isArabic ? "متر" : "m"}
              </p>
            </div>
            <button
              onClick={getLocation}
              className="p-2 rounded-xl flex-shrink-0"
              style={{ background: "var(--gold-muted)", color: "var(--text-gold)" }}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
