import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import { contentData } from "@/lib/contentData";
import type { Language } from "@/lib/translations";

type TabKey = "morningAdhkar" | "eveningAdhkar" | "sleepAdhkar" | "afterPrayerAdhkar";

const TABS: { key: TabKey; labelAr: string; icon: string }[] = [
  { key: "morningAdhkar",      labelAr: "الصباح",      icon: "🌅" },
  { key: "eveningAdhkar",      labelAr: "المساء",      icon: "🌙" },
  { key: "sleepAdhkar",        labelAr: "النوم",       icon: "😴" },
  { key: "afterPrayerAdhkar",  labelAr: "بعد الصلاة",  icon: "🕌" },
];

const TAB_LABEL_EN: Record<TabKey, string> = {
  morningAdhkar:     "Morning",
  eveningAdhkar:     "Evening",
  sleepAdhkar:       "Sleep",
  afterPrayerAdhkar: "After Prayer",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cardAnim  = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

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

export default function AdhkarList() {
  const [activeTab, setActiveTab] = useState<TabKey>("morningAdhkar");
  const [, navigate] = useLocation();
  const { language, t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const items = useMemo(() => contentData[activeTab] ?? [], [activeTab]);
  const { translatedItems, isTranslating, translationProgress } =
    useContentTranslation(items, language as Language);

  const isArabic = language === "ar";

  return (
    <PageLayout
      title={t("adhkar")}
      subtitle={isArabic ? "أذكار وأدعية مأثورة" : "Daily Remembrance & Supplications"}
      backHref="/"
    >
      {isTranslating && <ProgressBar progress={translationProgress} />}

      <div className="pt-4 pb-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 hide-scrollbar">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: active
                    ? "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(212,175,55,0.08))"
                    : "rgba(13,35,24,0.6)",
                  border: `${active ? 1.5 : 1}px solid ${active ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.12)"}`,
                  color: active ? "#d4af37" : "rgba(212,175,55,0.5)",
                }}
              >
                <span>{tab.icon}</span>
                <span>{isArabic ? tab.labelAr : TAB_LABEL_EN[tab.key]}</span>
              </button>
            );
          })}
        </div>

        {/* Translating indicator */}
        <AnimatePresence>
          {isTranslating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm"
              style={{ background: "rgba(64,145,108,0.1)", border: "1px solid rgba(64,145,108,0.25)", color: "var(--teal)" }}
            >
              <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
              <span>{isArabic ? "جاري الترجمة..." : "Translating…"} <span className="font-bold">{translationProgress}%</span></span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={container} initial="hidden" animate="show" className="space-y-3">
            {isTranslating
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="rounded-2xl animate-pulse" style={{ height: "100px", background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.08)" }} />
                ))
              : translatedItems.map((item, idx) => {
                  const fav = isFavorite(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      variants={cardAnim}
                      className="rounded-2xl overflow-hidden"
                      style={{ background: "rgba(13,35,24,0.8)", border: "1px solid rgba(212,175,55,0.14)", boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}
                    >
                      {/* Top row */}
                      <div className="px-4 pt-3 flex items-center justify-between">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: "rgba(212,175,55,0.14)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.22)" }}
                        >
                          {idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          {item.source && (
                            <span className="text-xs flex items-center gap-1" style={{ color: "rgba(212,175,55,0.5)" }}>
                              <span>📚</span><span>{item.source}</span>
                            </span>
                          )}
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => toggleFavorite(item)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ background: fav ? "rgba(212,175,55,0.15)" : "transparent" }}
                            title={fav ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Bookmark
                              className="w-4 h-4"
                              fill={fav ? "#d4af37" : "none"}
                              style={{ color: fav ? "#d4af37" : "rgba(212,175,55,0.35)" }}
                            />
                          </motion.button>
                        </div>
                      </div>

                      {/* Arabic text */}
                      <div className="px-4 pt-3 pb-1">
                        <p className="amiri leading-loose text-amber-50/95 text-right" style={{ fontSize: "1.08rem", lineHeight: "2.1", direction: "rtl" }}>
                          {item.arabic}
                        </p>
                      </div>

                      {/* Transliteration */}
                      {item.transliteration && (
                        <div className="px-4 pb-1">
                          <p className="text-xs italic" style={{ color: "rgba(212,175,55,0.45)", direction: "ltr", textAlign: isArabic ? "right" : "left" }}>
                            {item.transliteration}
                          </p>
                        </div>
                      )}

                      {/* Translation */}
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
          </motion.div>
        </AnimatePresence>

        {/* Browse all link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6">
          <button
            onClick={() => navigate("/adhkar/1")}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.7)" }}
          >
            <span>🗂</span>
            <span>{isArabic ? "تصفح جميع الأذكار" : "Browse All Adhkar"}</span>
          </button>
        </motion.div>
      </div>
    </PageLayout>
  );
}
