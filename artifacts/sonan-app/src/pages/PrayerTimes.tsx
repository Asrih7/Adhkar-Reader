import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, RefreshCw, Volume2, Settings } from "lucide-react";
import PageLayout from "@/components/PageLayout";

interface PrayerTime {
  name: string;
  nameAr: string;
  time: string;
  nextTime?: boolean;
}

interface PrayerData {
  city: string;
  country: string;
  date: string;
  prayers: PrayerTime[];
  hijriDate: string;
}

export default function PrayerTimes() {
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [city, setCity] = useState("Current Location");
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Using Aladhan API (free, no authentication needed)
            const response = await fetch(
              `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
            );
            const data = await response.json();
            formatPrayerTimes(data.data.timings);
          },
          () => {
            // Fallback to a default city
            fetchPrayerTimesByCity("Cairo");
          }
        );
      } else {
        fetchPrayerTimesByCity("Cairo");
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  };

  const fetchPrayerTimesByCity = async (cityName: string) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${cityName}&country=EG&method=2`
      );
      const data = await response.json();
      setCity(cityName);
      formatPrayerTimes(data.data.timings);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatPrayerTimes = (timings: any) => {
    const prayersList: PrayerTime[] = [
      { name: "Fajr", nameAr: "الفجر", time: timings.Fajr },
      { name: "Sunrise", nameAr: "الشروق", time: timings.Sunrise },
      { name: "Dhuhr", nameAr: "الظهر", time: timings.Dhuhr },
      { name: "Asr", nameAr: "العصر", time: timings.Asr },
      { name: "Sunset", nameAr: "الغروب", time: timings.Sunset },
      { name: "Maghrib", nameAr: "المغرب", time: timings.Maghrib },
      { name: "Isha", nameAr: "العشاء", time: timings.Isha },
    ];

    // Identify next prayer
    const now = new Date();
    const currentTime = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");

    for (let i = 0; i < prayersList.length; i++) {
      if (prayersList[i].time > currentTime) {
        prayersList[i].nextTime = true;
        break;
      }
    }

    setPrayers(prayersList);
    setNextPrayer(prayersList.find((p) => p.nextTime) || null);
    setLoading(false);
  };

  // Calculate countdown to next prayer
  useEffect(() => {
    if (!nextPrayer) return;

    const updateCountdown = () => {
      const [hours, minutes] = nextPrayer.time.split(":").map(Number);
      const now = new Date();
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0);

      if (prayerTime < now) {
        prayerTime.setDate(prayerTime.getDate() + 1);
      }

      const diff = prayerTime.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`${h}:${String(m).padStart(2, "0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [nextPrayer]);

  return (
    <PageLayout title="مواقيت الصلاة" subtitle="Prayer Times">
      <div className="pb-20 md:pb-8">
        {/* Location */}
        <div className="flex items-center justify-between mb-8 mt-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span className="text-amber-200">{city}</span>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchPrayerTimes()}
              className="p-2 rounded-lg hover:bg-amber-400/10 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-amber-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-amber-400/10 transition-colors"
            >
              <Settings className="w-5 h-5 text-amber-400" />
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full" />
            </div>
          </div>
        ) : (
          <>
            {/* Next Prayer */}
            {nextPrayer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-900/40 to-emerald-900/20 border border-green-500/40"
              >
                <p className="text-amber-200/60 text-sm mb-2">الصلاة القادمة</p>
                <h2 className="text-3xl font-bold gold-text mb-2">{nextPrayer.nameAr}</h2>
                <p className="text-amber-200/80 text-lg mb-4">{nextPrayer.time}</p>
                <div className="flex items-center justify-between">
                  <p className="text-amber-200/60">يتبقى</p>
                  <p className="text-2xl font-bold text-green-300">{countdown}</p>
                </div>
              </motion.div>
            )}

            {/* Prayer Times Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {prayers.map((prayer, idx) => (
                <motion.div
                  key={prayer.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-4 rounded-xl transition-all ${
                    prayer.nextTime
                      ? "bg-gradient-to-br from-amber-600/30 to-yellow-500/10 border border-amber-400/50"
                      : "bg-amber-900/20 border border-amber-500/20"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className={prayer.nextTime ? "font-bold gold-text" : "text-amber-200/70"}>
                      {prayer.nameAr}
                    </p>
                    <p className={`text-lg font-medium ${prayer.nextTime ? "text-amber-300" : "text-amber-200"}`}>
                      {prayer.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Hijri Date */}
            <div className="text-center text-amber-200/50 text-sm">
              <p>استخدام طريقة الحساب: الإمام الشافعي</p>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
