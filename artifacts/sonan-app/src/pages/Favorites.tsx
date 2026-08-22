import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Trash2, Copy, Share2, Check } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import type { Language } from "@/lib/translations";
import { copyText, shareContent } from "@/lib/shareService";

const CATEGORY_LABEL: Record<string, string> = {
  morningAdhkar: "أذكار الصباح",   eveningAdhkar: "أذكار المساء",
  sleepAdhkar: "أذكار النوم",       afterPrayerAdhkar: "أذكار بعد الصلاة",
  dailySonan: "السنن اليومية",      eatingSonan: "سنن الطعام",
  sleepingSonan: "سنن النوم",       homeSonan: "سنن المنزل",
  advices: "نصائح الحياة",          marriageAdvice: "نصائح الزواج",
  wifeTips: "سنن مع الزوجة",
  forgettableSonan: "السنن المنسية",
};

const CATEGORY_LABEL_EN: Record<string, string> = {
  morningAdhkar: "Morning Adhkar",   eveningAdhkar: "Evening Adhkar",
  sleepAdhkar: "Sleep Adhkar",       afterPrayerAdhkar: "After Prayer",
  dailySonan: "Daily Sonan",         eatingSonan: "Eating Sonan",
  sleepingSonan: "Sleeping Sonan",   homeSonan: "Home Sonan",
  advices: "Life Advice",            marriageAdvice: "Marriage Advice",
  wifeTips: "Wife Tips",
  forgettableSonan: "Forgotten Sunnah",
};

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: "rgba(0,0,0,0.1)" }}>
      <motion.div className="h-full" style={{ background: "linear-gradient(90deg, var(--gold), var(--teal))" }}
        initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
    </div>
  );
}

/* ── Item action row ── */
function ItemActions({
  arabic, translatedText, source, onRemove, language,
}: {
  arabic: string; translatedText?: string; source?: string;
  onRemove: () => void; language: string;
}) {
  const [copied, setCopied] = useState(false);
  const isRtl = language === "ar";
  const shareText = arabic + (translatedText && translatedText !== arabic ? "\n\n" + translatedText : "") + (source ? "\n📚 " + source : "");

  const handleCopy = async () => {
    if (await copyText(shareText)) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  const handleShare = async () => {
    await shareContent({ title: "سنن و نصائح الرسول", text: shareText, url: window.location.href });
  };

  return (
    <div className="flex items-center justify-between px-3 py-2" style={{ borderTop: "1px solid var(--gold-border)" }}>
      <div className="flex items-center gap-0.5">
        <motion.button whileTap={{ scale: 0.8 }} onClick={handleCopy} className="p-2 rounded-xl" style={{ background: copied ? "var(--teal-muted)" : "transparent" }} title={isRtl ? "نسخ" : "Copy"}>
          {copied ? <Check className="w-4 h-4" style={{ color: "var(--text-teal)" }} /> : <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
        </motion.button>
        <motion.button whileTap={{ scale: 0.8 }} onClick={handleShare} className="p-2 rounded-xl" title={isRtl ? "مشاركة" : "Share"}>
          <Share2 className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        </motion.button>
      </div>
      <motion.button whileTap={{ scale: 0.85 }} onClick={onRemove} className="p-2 rounded-lg flex items-center gap-1 text-xs font-semibold"
        style={{ color: "rgba(239,68,68,0.6)" }} title={isRtl ? "حذف" : "Remove"}>
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">{isRtl ? "حذف" : "Remove"}</span>
      </motion.button>
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

      <div className="pb-4 mt-4">
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

        {/* Empty state */}
        {favorites.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }}>
              <Bookmark className="w-9 h-9" style={{ color: "var(--text-muted)" }} />
            </div>
            <p className="text-base font-semibold" style={{ color: "var(--text-muted)" }}>
              {isArabic ? "لا توجد عناصر محفوظة" : "No saved items yet"}
            </p>
            <p className="text-sm text-center px-8" style={{ color: "var(--text-muted)" }}>
              {isArabic
                ? "اضغط على أيقونة الإشارة في أي بطاقة لحفظها هنا"
                : "Tap the bookmark icon on any card to save it here"}
            </p>
          </motion.div>
        )}

        {/* List */}
        <AnimatePresence>
          {translatedItems.length > 0 && (
            <div className="space-y-3">
              {translatedItems.map((item, idx) => (
                <motion.div key={item.id} layout
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                  transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

                  {/* Category badge */}
                  <div className="px-4 pt-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: "var(--teal-muted)", color: "var(--text-teal)", border: "1px solid var(--teal-border)" }}>
                      <Bookmark className="w-3 h-3" fill="currentColor" />
                      <span>{isArabic ? (CATEGORY_LABEL[item.category] ?? item.category) : (CATEGORY_LABEL_EN[item.category] ?? item.category)}</span>
                    </span>
                  </div>

                  {/* Arabic */}
                  <div className="px-4 pt-3 pb-1">
                    <p className="amiri leading-loose text-right"
                      style={{ fontSize: "1.08rem", lineHeight: "2.1", direction: "rtl", color: "var(--text-primary)" }}>
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
                    <div className="mx-4 mb-2 mt-1 px-3 py-2 rounded-xl" style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)", direction: "ltr" }}>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-teal)", lineHeight: "1.75" }}>
                        {item.translatedText}
                      </p>
                    </div>
                  )}

                  {/* Actions: copy / share / remove */}
                  <ItemActions
                    arabic={item.arabic} translatedText={item.translatedText}
                    source={item.source} language={language}
                    onRemove={() => removeFavorite(item.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Clear all */}
        {favorites.length > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6">
            <button onClick={() => favorites.forEach((f) => removeFavorite(f.id))}
              className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "rgba(239,68,68,0.7)" }}>
              <Trash2 className="w-4 h-4" />
              <span>{isArabic ? "مسح الكل" : "Clear All"}</span>
            </button>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
