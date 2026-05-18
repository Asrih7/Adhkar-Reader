import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import { contentData } from "@/lib/contentData";
import type { Language } from "@/lib/translations";

const TOTAL = 30;

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: "rgba(0,0,0,0.15)" }}>
      <motion.div className="h-full" style={{ background: "linear-gradient(90deg, var(--gold), var(--teal))" }}
        initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
    </div>
  );
}

export default function SonanWithWife() {
  const [current, setCurrent] = useState(1);
  const [direction, setDirection] = useState(0);
  const { language, t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { translatedItems, isTranslating, translationProgress } =
    useContentTranslation(contentData.wifeTips, language as Language);

  const isArabic = language === "ar";

  const goTo = (next: number) => {
    if (next < 1 || next > TOTAL) return;
    setDirection(next > current ? -1 : 1);
    setCurrent(next);
  };

  return (
    <PageLayout
      title={t("wife")}
      subtitle={isArabic ? "سنن النبي ﷺ مع زوجاته الكريمات" : "Prophetic Traditions with the Family"}
      backHref="/"
    >
      {isTranslating && <ProgressBar progress={translationProgress} />}

      <div className="pt-4 pb-10">
        {/* Image viewer */}
        <div
          className="relative rounded-2xl overflow-hidden mb-5"
          style={{ background: "rgba(13,35,24,0.8)", border: "1px solid rgba(212,175,55,0.15)", minHeight: "56vw", maxHeight: "65vh" }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={current}
              src={`${import.meta.env.BASE_URL}img/${current}.jpg`}
              alt={`سنة مع الزوجة ${current}`}
              className="w-full h-full object-contain"
              style={{ maxHeight: "65vh" }}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 60 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </AnimatePresence>
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(0,0,0,0.5)", color: "#d4af37", backdropFilter: "blur(4px)" }}>
            {current} / {TOTAL}
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={() => goTo(current + 1)}
            disabled={current >= TOTAL}
            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-30"
            style={{ background: current < TOTAL ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.2)", color: "#d4af37" }}
          >
            {isArabic ? "التالي →" : "Next →"}
          </button>

          <div className="flex gap-1 flex-wrap justify-center" style={{ maxWidth: "100px" }}>
            {[...Array(TOTAL)].map((_, i) => (
              <button key={i} onClick={() => goTo(i + 1)} className="rounded-full transition-all"
                style={{ width: i + 1 === current ? "14px" : "4px", height: "4px", background: i + 1 === current ? "#d4af37" : "rgba(212,175,55,0.25)" }} />
            ))}
          </div>

          <button
            onClick={() => goTo(current - 1)}
            disabled={current <= 1}
            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-30"
            style={{ background: current > 1 ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.2)", color: "#d4af37" }}
          >
            {isArabic ? "← السابق" : "← Prev"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5" style={{ color: "rgba(212,175,55,0.3)" }}>
          <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.12)" }} />
          <span className="text-xs font-semibold tracking-wider">{isArabic ? "نصائح الحياة الزوجية" : "Marriage Tips"}</span>
          <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.12)" }} />
        </div>

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

        {/* Wife tips cards */}
        <div className="space-y-3">
          {isTranslating
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl animate-pulse" style={{ height: "90px", background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.08)" }} />
              ))
            : translatedItems.map((item, idx) => {
                const fav = isFavorite(item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "rgba(13,35,24,0.8)", border: "1px solid rgba(212,175,55,0.13)" }}
                  >
                    {/* Top row */}
                    <div className="px-4 pt-3 flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(212,175,55,0.14)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.22)" }}>
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
                        >
                          <Bookmark className="w-4 h-4" fill={fav ? "#d4af37" : "none"} style={{ color: fav ? "#d4af37" : "rgba(212,175,55,0.35)" }} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Arabic */}
                    <div className="px-4 pt-3 pb-1">
                      <p className="amiri leading-loose text-amber-50/95 text-right" style={{ fontSize: "1.05rem", lineHeight: "2.1", direction: "rtl" }}>
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
      </div>
    </PageLayout>
  );
}
