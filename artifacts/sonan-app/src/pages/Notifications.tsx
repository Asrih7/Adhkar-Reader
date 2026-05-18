import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Clock, RefreshCw, Bookmark } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import {
  getTodayItems,
  refreshTodayItems,
  requestPermission,
  getPermissionStatus,
  isNotificationEnabled,
  setNotificationEnabled,
  getNotifHour,
  setNotifHour,
  initDailyNotifications,
  cancelDailyNotifications,
  sendNotifications,
} from "@/lib/notificationService";
import type { Language } from "@/lib/translations";
import type { ContentItem } from "@/lib/contentData";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: "rgba(0,0,0,0.15)" }}>
      <motion.div
        className="h-full"
        style={{ background: "linear-gradient(90deg, var(--gold), var(--teal))" }}
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function formatHour(h: number): string {
  const period = h < 12 ? "AM" : "PM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:00 ${period}`;
}

export default function Notifications() {
  const { language, t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isArabic = language === "ar";

  const [permission, setPermission] = useState<string>(getPermissionStatus());
  const [enabled, setEnabled] = useState(isNotificationEnabled);
  const [hour, setHour] = useState(getNotifHour);
  const [dailyItems, setDailyItems] = useState<ContentItem[]>(getTodayItems);
  const [refreshed, setRefreshed] = useState(false);

  const { translatedItems, isTranslating, translationProgress } =
    useContentTranslation(dailyItems, language as Language);

  useEffect(() => {
    setPermission(getPermissionStatus());
  }, []);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    setPermission(granted ? "granted" : "denied");
    if (granted && enabled) {
      initDailyNotifications();
    }
  };

  const handleToggleEnabled = (val: boolean) => {
    setEnabled(val);
    setNotificationEnabled(val);
    if (val && permission === "granted") {
      initDailyNotifications();
    } else {
      cancelDailyNotifications();
    }
  };

  const handleChangeHour = (h: number) => {
    setHour(h);
    setNotifHour(h);
    if (enabled && permission === "granted") {
      cancelDailyNotifications();
      initDailyNotifications();
    }
  };

  const handleRefresh = () => {
    const newItems = refreshTodayItems();
    setDailyItems(newItems);
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 2000);
  };

  const handleTestNotif = () => {
    sendNotifications(dailyItems.slice(0, 1));
  };

  const permissionLabel = permission === "granted"
    ? (isArabic ? "مفعّل ✓" : "Granted ✓")
    : permission === "denied"
    ? (isArabic ? "محجوب ✗" : "Denied ✗")
    : (isArabic ? "اطلب الإذن" : "Request Permission");

  const permissionColor = permission === "granted" ? "var(--teal)" : permission === "denied" ? "#ef4444" : "#d4af37";

  return (
    <PageLayout
      title={t("notifications")}
      subtitle={isArabic ? "تذكيرات يومية من السنة النبوية" : "Daily Reminders from the Sunnah"}
    >
      {isTranslating && <ProgressBar progress={translationProgress} />}

      <div className="pb-24 mt-4 space-y-6">

        {/* ── Notification Settings ─────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--text-gold)" }}>
            <Bell className="w-4 h-4" style={{ color: "var(--text-teal)" }} />
            {isArabic ? "إعدادات التنبيهات" : "Notification Settings"}
          </h3>

          <div className="space-y-2.5">
            {/* Enable toggle */}
            <div
              className="p-4 rounded-xl flex items-center justify-between"
              style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}
            >
              <div className="flex items-center gap-3">
                {enabled ? (
                  <Bell className="w-5 h-5" style={{ color: "var(--text-teal)" }} />
                ) : (
                  <BellOff className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                )}
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {isArabic ? "تفعيل التنبيهات اليومية" : "Daily Notifications"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {isArabic ? "3 تذكيرات عشوائية كل يوم" : "3 random reminders every day"}
                  </p>
                </div>
              </div>
              <div
                className="w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-all"
                style={{ background: enabled ? "var(--teal)" : "hsl(var(--muted))" }}
                onClick={() => handleToggleEnabled(!enabled)}
              >
                <motion.div
                  animate={{ x: enabled ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-4 h-4 rounded-full bg-white shadow"
                />
              </div>
            </div>

            {/* Permission */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={permission === "default" ? handleRequestPermission : undefined}
              disabled={permission !== "default"}
              className="w-full p-3.5 rounded-xl flex items-center justify-between transition-all"
              style={{
                background: "hsl(var(--card))",
                border: `1px solid ${permission === "granted" ? "rgba(64,145,108,0.3)" : "var(--gold-border)"}`,
                cursor: permission === "default" ? "pointer" : "default",
              }}
            >
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {isArabic ? "إذن المتصفح" : "Browser Permission"}
              </span>
              <span className="text-sm font-bold" style={{ color: permissionColor }}>
                {permissionLabel}
              </span>
            </motion.button>

            {/* Notification hour */}
            <AnimatePresence>
              {enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-xl"
                  style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" style={{ color: "var(--text-teal)" }} />
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {isArabic ? "وقت الإشعار" : "Notification Time"}
                    </span>
                    <span className="ms-auto text-sm font-bold" style={{ color: "var(--text-gold)" }}>
                      {formatHour(hour)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={23}
                    value={hour}
                    onChange={(e) => handleChangeHour(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg"
                    style={{ accentColor: "var(--gold)" }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>12:00 AM</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>11:00 PM</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Test button */}
            {permission === "granted" && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleTestNotif}
                className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.7)" }}
              >
                <Bell className="w-4 h-4" />
                {isArabic ? "إرسال إشعار تجريبي" : "Send Test Notification"}
              </motion.button>
            )}
          </div>
        </motion.section>

        {/* ── Today's Reminders ─────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-gold)" }}>
              <span>✨</span>
              {isArabic ? "تذكيرات اليوم" : "Today's Reminders"}
            </h3>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "rgba(64,145,108,0.1)", border: "1px solid rgba(64,145,108,0.25)", color: "var(--teal)" }}
            >
              <motion.div animate={refreshed ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.5 }}>
                <RefreshCw className="w-3.5 h-3.5" />
              </motion.div>
              <span>{isArabic ? "تحديث" : "Refresh"}</span>
            </motion.button>
          </div>

          <p className="text-xs mb-4" style={{ color: "var(--text-muted)", textAlign: isArabic ? "right" : "left" }}>
            {isArabic
              ? "يتم اختيار ٣ تذكيرات عشوائية كل يوم من جميع المحتوى"
              : "3 random reminders are selected daily from all content"}
          </p>

          {/* Translating indicator */}
          <AnimatePresence>
            {isTranslating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm"
                style={{ background: "rgba(64,145,108,0.1)", border: "1px solid rgba(64,145,108,0.25)", color: "var(--teal)" }}
              >
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
                <span>{isArabic ? "جاري الترجمة..." : "Translating…"} <span className="font-bold">{translationProgress}%</span></span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {isTranslating
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-2xl animate-pulse" style={{ height: "100px", background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.08)" }} />
                ))
              : translatedItems.map((item, idx) => {
                  const fav = isFavorite(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        background: "rgba(13,35,24,0.85)",
                        border: "1px solid rgba(212,175,55,0.18)",
                        boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                      }}
                    >
                      {/* Number badge + bookmark */}
                      <div className="px-4 pt-3 flex items-center justify-between">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: "rgba(212,175,55,0.14)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.22)" }}
                        >
                          <span>✨</span>
                          <span>{isArabic ? `تذكير ${idx + 1}` : `Reminder ${idx + 1}`}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          {item.source && (
                            <span className="text-xs flex items-center gap-1" style={{ color: "rgba(212,175,55,0.45)" }}>
                              <span>📚</span><span>{item.source}</span>
                            </span>
                          )}
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => toggleFavorite(item)}
                            className="p-1.5 rounded-lg"
                            style={{ background: fav ? "rgba(212,175,55,0.15)" : "transparent" }}
                          >
                            <Bookmark className="w-4 h-4" fill={fav ? "#d4af37" : "none"} style={{ color: fav ? "#d4af37" : "rgba(212,175,55,0.35)" }} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Arabic text */}
                      <div className="px-4 pt-3 pb-1">
                        <p className="amiri leading-loose text-amber-50/95 text-right" style={{ fontSize: "1.08rem", lineHeight: "2.1", direction: "rtl" }}>
                          {item.arabic}
                        </p>
                      </div>

                      {item.transliteration && (
                        <div className="px-4 pb-1">
                          <p className="text-xs italic" style={{ color: "rgba(212,175,55,0.45)", direction: "ltr", textAlign: isArabic ? "right" : "left" }}>
                            {item.transliteration}
                          </p>
                        </div>
                      )}

                      {!isArabic && item.translatedText && item.translatedText !== item.arabic && (
                        <div className="mx-4 mb-3 mt-1 px-3 py-2 rounded-xl" style={{ background: "rgba(64,145,108,0.07)", border: "1px solid rgba(64,145,108,0.15)", direction: "ltr" }}>
                          <p className="text-sm leading-relaxed" style={{ color: "rgba(180,230,200,0.85)", lineHeight: "1.75" }}>
                            {item.translatedText}
                          </p>
                        </div>
                      )}

                      {isArabic && <div className="pb-3" />}
                    </motion.div>
                  );
                })}
          </div>
        </motion.section>

        {/* ── Prayer & Adhkar Notification Settings (legacy) ─────── */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--text-gold)" }}>
            <span>🕌</span>
            {isArabic ? "إشعارات الصلاة" : "Prayer Notifications"}
          </h3>
          <div className="space-y-2.5">
            <div className="p-4 rounded-xl" style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {isArabic ? "تنبيه قبل الصلاة بـ 5 دقائق" : "5 min before prayer"}
                </p>
                <input type="checkbox" defaultChecked className="w-4 h-4" style={{ accentColor: "var(--teal)" }} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {isArabic ? "وقت الأذان" : "Adhan time"}
                </p>
                <input type="checkbox" defaultChecked className="w-4 h-4" style={{ accentColor: "var(--teal)" }} />
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}>
              <p className="text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>
                {isArabic ? "أذكار الصباح والمساء" : "Morning & Evening Adhkar"}
              </p>
              <input
                type="time"
                defaultValue="06:00"
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ background: "hsl(var(--muted))", border: "1px solid var(--gold-border)", color: "var(--text-primary)" }}
              />
            </div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  );
}
