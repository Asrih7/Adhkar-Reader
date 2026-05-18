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

type TabKey = "dailySonan" | "eatingSonan" | "sleepingSonan" | "homeSonan";

const TABS: { key: TabKey; labelAr: string; icon: string }[] = [
  { key: "dailySonan",    labelAr: "يومية",  icon: "☀️" },
  { key: "eatingSonan",   labelAr: "الطعام", icon: "🍽" },
  { key: "sleepingSonan", labelAr: "النوم",  icon: "🛌" },
  { key: "homeSonan",     labelAr: "المنزل", icon: "🏠" },
];

const TAB_LABEL_EN: Record<TabKey, string> = {
  dailySonan: "Daily", eatingSonan: "Eating", sleepingSonan: "Sleeping", homeSonan: "Home",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cardAnim  = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: "rgba(0,0,0,0.1)" }}>
      <motion.div className="h-full" style={{ background: "linear-gradient(90deg, var(--gold), var(--teal))" }}
        initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
    </div>
  );
}

export default function SonanList() {
  const [activeTab, setActiveTab] = useState<TabKey>("dailySonan");
  const [, navigate] = useLocation();
  const { language, t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const items = useMemo(() => contentData[activeTab] ?? [], [activeTab]);
  const { translatedItems, isTranslating, translationProgress } =
    useContentTranslation(items, language as Language);

  const isArabic = language === "ar";

  return (
    <PageLayout
      title={t("sonan")}
      subtitle={isArabic ? "مئة سنة نبوية في يومك" : "Prophetic Traditions for Daily Life"}
      backHref="/"
    >
      {isTranslating && <ProgressBar progress={translationProgress} />}

      <div className="pt-4 pb-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 hide-scrollbar">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: active ? "var(--gold-muted-strong)" : "hsl(var(--card))",
                  border: `${active ? 1.5 : 1}px solid ${active ? "var(--gold)" : "var(--gold-border)"}`,
                  color: active ? "var(--text-gold)" : "var(--text-muted)",
                }}>
                <span>{tab.icon}</span>
                <span>{isArabic ? tab.labelAr : TAB_LABEL_EN[tab.key]}</span>
              </button>
            );
          })}
        </div>

        {/* Translating indicator */}
        <AnimatePresence>
          {isTranslating && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mb-4 px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm"
              style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)", color: "var(--text-teal)" }}>
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
                  <div key={i} className="rounded-2xl animate-pulse" style={{ height: "90px", background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
                ))
              : translatedItems.map((item, idx) => {
                  const fav = isFavorite(item.id);
                  return (
                    <motion.div key={item.id} variants={cardAnim} className="rounded-2xl overflow-hidden"
                      style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                      {/* Top row */}
                      <div className="px-4 pt-3 flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: "var(--gold-muted)", color: "var(--text-gold)", border: "1px solid var(--gold-border)" }}>
                          {idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          {item.source && (
                            <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                              <span>📚</span><span>{item.source}</span>
                            </span>
                          )}
                          <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleFavorite(item)}
                            className="p-1.5 rounded-lg" style={{ background: fav ? "var(--gold-muted)" : "transparent" }}>
                            <Bookmark className="w-4 h-4" fill={fav ? "var(--gold)" : "none"} style={{ color: fav ? "var(--gold)" : "var(--text-muted)" }} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Arabic text */}
                      <div className="px-4 pt-3 pb-1">
                        <p className="amiri leading-loose text-right"
                          style={{ fontSize: "1.05rem", lineHeight: "2.1", direction: "rtl", color: "var(--text-primary)" }}>
                          {item.arabic}
                        </p>
                      </div>

                      {item.transliteration && (
                        <div className="px-4 pb-1">
                          <p className="text-xs italic" style={{ color: "var(--text-muted)", direction: "ltr", textAlign: isArabic ? "right" : "left" }}>
                            {item.transliteration}
                          </p>
                        </div>
                      )}

                      {!isArabic && item.translatedText && item.translatedText !== item.arabic && (
                        <div className="mx-4 mb-3 mt-1 px-3 py-2 rounded-xl" style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)", direction: "ltr" }}>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--text-teal)", lineHeight: "1.75" }}>
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6">
          <button onClick={() => navigate("/sonan/1")} className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)", color: "var(--text-gold)" }}>
            <span>🗂</span>
            <span>{isArabic ? "تصفح مئة سنة كاملة" : "Browse All 100 Sonan"}</span>
          </button>
        </motion.div>
      </div>
    </PageLayout>
  );
}
