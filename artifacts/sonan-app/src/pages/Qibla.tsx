import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, MapPin, RefreshCw } from "lucide-react";
import PageLayout from "@/components/PageLayout";

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export default function Qibla() {
  const [location, setLocation] = useState<Location | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [userHeading, setUserHeading] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const kaabahLat = 21.4225;
  const kaabahLong = 39.8264;

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (!location) return;

    const watchId = DeviceOrientationEvent
      ? (window as any).addEventListener("deviceorientation", handleOrientation)
      : null;

    // Fallback to compass heading API
    if ("DeviceOrientationEvent" in window && typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((permission: string) => {
          if (permission === "granted") {
            (window as any).addEventListener("deviceorientation", handleOrientation);
          }
        })
        .catch(() => {
          // Fallback: use generic orientation
          (window as any).addEventListener("deviceorientation", handleOrientation);
        });
    } else {
      (window as any).addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      if (watchId) {
        (window as any).removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, [location]);

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(loc);
          calculateQibla(loc);
          setError(null);
        },
        (err) => {
          setError("تعذر الوصول إلى موقعك. تأكد من تفعيل الموقع.");
          console.error(err);
          setLoading(false);
        }
      );
    } else {
      setError("المتصفح لا يدعم خدمات الموقع.");
      setLoading(false);
    }
  };

  const calculateQibla = (loc: Location) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const lat1 = toRad(loc.latitude);
    const lon1 = toRad(loc.longitude);
    const lat2 = toRad(kaabahLat);
    const lon2 = toRad(kaabahLong);

    const dLon = lon2 - lon1;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let qibla = toDeg(Math.atan2(y, x));
    qibla = (qibla + 360) % 360;

    setQiblaDirection(qibla);
    setLoading(false);
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let heading = 0;

    if (event.alpha !== null) {
      heading = event.alpha; // Compass heading
    }

    // Handle iOS 13+ requirements
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      // Already handled above
    }

    setUserHeading(heading);
  };

  const relativeDirection = ((qiblaDirection - userHeading) + 360) % 360;

  return (
    <PageLayout title="القبلة" subtitle="Qibla Compass">
      <div className="pb-20 md:pb-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {loading && !location ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin mb-4">
              <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full" />
            </div>
            <p className="text-amber-200/60">جاري تحديد موقعك...</p>
          </div>
        ) : location ? (
          <>
            {/* Compass */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 mb-8"
            >
              <div className="relative mx-auto w-80 h-80 flex items-center justify-center">
                {/* Outer circle */}
                <div className="absolute inset-0 rounded-full border-4 border-amber-400/40" />
                <div className="absolute inset-2 rounded-full border border-amber-400/20" />

                {/* Compass directions */}
                <div className="absolute top-4 text-sm font-bold text-amber-400">ش</div>
                <div className="absolute bottom-4 text-sm font-bold text-amber-400">ج</div>
                <div className="absolute left-4 text-sm font-bold text-amber-400">غ</div>
                <div className="absolute right-4 text-sm font-bold text-amber-400">ق</div>

                {/* Rotating compass background */}
                <motion.div
                  animate={{ rotate: -userHeading }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  className="absolute inset-0 rounded-full"
                >
                  {/* Degree markers */}
                  {[...Array(36)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-3 bg-amber-400/50 left-1/2 origin-bottom"
                      style={{
                        top: "10%",
                        transform: `translateX(-50%) rotate(${i * 10}deg)`,
                      }}
                    />
                  ))}
                </motion.div>

                {/* Qibla direction arrow */}
                <motion.div
                  animate={{ rotate: relativeDirection }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  className="absolute inset-1/4 flex items-end justify-center pointer-events-none"
                >
                  <div className="w-2 h-24 bg-gradient-to-t from-green-400 to-green-200 rounded-full shadow-lg shadow-green-500/50" />
                </motion.div>

                {/* Center circle */}
                <div className="absolute inset-1/3 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-400 shadow-lg shadow-amber-500/50" />

                {/* Kaaba icon in center */}
                <div className="absolute text-3xl">🕋</div>
              </div>
            </motion.div>

            {/* Qibla Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <p className="text-amber-200/60 text-sm mb-2">اتجاه القبلة</p>
              <p className="text-4xl font-bold gold-text mb-4">{Math.round(qiblaDirection)}°</p>
              <p className="text-amber-200/70 mb-6">وجه هاتفك بحيث يشير السهم الأخضر نحو الأسفل</p>
            </motion.div>

            {/* Location Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/20 mb-6"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-amber-200/70">موقعك</p>
                  <p className="text-sm font-medium text-amber-300">
                    {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                  </p>
                  <p className="text-xs text-amber-200/50 mt-1">
                    دقة: ±{Math.round(location.accuracy)} متر
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Refresh button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={getLocation}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 text-amber-300 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              تحديث الموقع
            </motion.button>
          </>
        ) : null}

        {/* Offline note */}
        <p className="text-center text-amber-200/40 text-xs mt-6">
          لا تحتاج إلى إنترنت بعد التحميل الأول
        </p>
      </div>
    </PageLayout>
  );
}
