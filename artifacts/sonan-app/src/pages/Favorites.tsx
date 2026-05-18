import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Trash2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import type { Language } from "@/lib/translations";

const CATEGORY_LABEL: Record<string, string> = {
  morningAdhkar:     "أذكار الصباح",
  eveningAdhkar:     "أذكار المساء",
  sleepAdhkar:       "أذكار النوم",
  afterPrayerAdhkar: "أذكار بعد الصلاة",
  dailySonan:        "السنن اليومية",
  eatingSonan:       "سنن الطعام",
  sleepingSonan:     "سنن النوم",
  homeSonan:         "سنن المنزل",
  advices:           "نصائح الحياة",
  marriageAdvice:    "نصائح الزواج",
  wifeTips:          "سنن مع الزوجة",
};

const CATEGORY_LABEL_EN: Record<string, string> = {
  morningAdhkar:     "Morning Adhkar",
  eveningAdhkar:     "Evening Adhkar",
  sleepAdhkar:       "Sleep Adhkar",
  afterPrayerAdhkar: "After Prayer",
  dailySonan:        "Daily Sonan",
  eatingSonan:       "Eating Sonan",
  sleepingSonan:     "Sleeping Sonan",
  homeSonan:         "Home Sonan",
  advices:           "Life Advice",
  marriageAdvice:    "Marriage Advice",
  wifeTips:          "Wife Tips",
};

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

export default function Favorites() {
  const { t, language } = useTranslation();
  const { favorites, removeFavorite } = useFavorites();
  const isArabic = language === "ar";

  const { translatedItems, isTranslating, translationProgress } =
    useContentTranslation(favorites, language as Language);

  return (
    <PageLayout
      title={t("favorites")}
      subtitle={isArabic ? `${favorites.length} عنصر محفوظ` : `${favorites.length} saved items`}
    >
      {isTranslating && <ProgressBar progress={translationProgress} />}

      <div className="pb-24 mt-4">
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
              <span>
                {isArabic ? "جاري الترجمة..." : "Translating…"}
                {" "}<span className="font-bold">{translationProgress}%</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {favorites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}
            >
              <Bookmark className="w-9 h-9" style={{ color: "rgba(212,175,55,0.35)" }} />
            </div>
            <p className="text-base font-semibold" style={{ color: "rgba(212,175,55,0.5)" }}>
              {isArabic ? "لا توجد عناصر محفوظة" : "No saved items yet"}
            </p>
            <p className="text-sm text-center px-8" style={{ color: "rgba(212,175,55,0.3)" }}>
              {isArabic
                ? "اضغط على أيقونة الإشارة في أي بطاقة لحفظها هنا"
                : "Tap the bookmark icon on any card to save it here"}
            </p>
          </motion.div>
        )}

        {/* Favorites list */}
        {translatedItems.length > 0 && (
          <div className="space-y-3">
            {translatedItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(13,35,24,0.85)",
                  border: "1px solid rgba(212,175,55,0.16)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                }}
              >
                {/* Top row — category badge + remove */}
                <div className="px-4 pt-3 flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(64,145,108,0.15)", color: "var(--teal)", border: "1px solid rgba(64,145,108,0.25)" }}
                  >
                    <Bookmark className="w-3 h-3" fill="currentColor" />
                    <span>
                      {isArabic
                        ? (CATEGORY_LABEL[item.category] ?? item.category)
                        : (CATEGORY_LABEL_EN[item.category] ?? item.category)}
                    </span>
                  </span>

                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => removeFavorite(item.id)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: "rgba(239,68,68,0.5)" }}
                    title={isArabic ? "إزالة من المفضلة" : "Remove from favorites"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Arabic text */}
                <div className="px-4 pt-3 pb-1">
                  <p
                    className="amiri leading-loose text-amber-50/95 text-right"
                    style={{ fontSize: "1.08rem", lineHeight: "2.1", direction: "rtl" }}
                  >
                    {item.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                {item.transliteration && (
                  <div className="px-4 pb-1">
                    <p
                      className="text-xs italic"
                      style={{ color: "rgba(212,175,55,0.45)", direction: "ltr", textAlign: isArabic ? "right" : "left" }}
                    >
                      {item.transliteration}
                    </p>
                  </div>
                )}

                {/* Translation */}
                {!isArabic && item.translatedText && item.translatedText !== item.arabic && (
                  <div
                    className="mx-4 mb-3 mt-1 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(64,145,108,0.07)", border: "1px solid rgba(64,145,108,0.15)", direction: "ltr" }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(180,230,200,0.85)", lineHeight: "1.75" }}>
                      {item.translatedText}
                    </p>
                  </div>
                )}

                {/* Source */}
                {item.source && (
                  <div className="px-4 pb-3">
                    <span className="text-xs flex items-center gap-1" style={{ color: "rgba(212,175,55,0.45)" }}>
                      <span>📚</span><span>{item.source}</span>
                    </span>
                  </div>
                )}

                {!item.source && <div className="pb-3" />}
              </motion.div>
            ))}
          </div>
        )}

        {/* Clear all */}
        {favorites.length > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6">
            <button
              onClick={() => {
                favorites.forEach((f) => removeFavorite(f.id));
              }}
              className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "rgba(239,68,68,0.6)" }}
            >
              <Trash2 className="w-4 h-4" />
              <span>{isArabic ? "مسح الكل" : "Clear All"}</span>
            </button>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
