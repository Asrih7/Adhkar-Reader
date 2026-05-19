import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Copy, Share2, Check } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import { contentData } from "@/lib/contentData";
import type { Language } from "@/lib/translations";

const TOTAL = 30;

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: "rgba(0,0,0,0.1)" }}>
      <motion.div className="h-full" style={{ background: "linear-gradient(90deg, var(--gold), var(--teal))" }}
        initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
    </div>
  );
}

/* ── Card action bar ── */
function CardActions({
  arabic, translatedText, source, isFav, onToggleFavorite, language,
}: {
  arabic: string; translatedText?: string; source?: string;
  isFav: boolean; onToggleFavorite: () => void; language: string;
}) {
  const [copied, setCopied] = useState(false);
  const isRtl = language === "ar";
  const shareText = arabic + (translatedText && translatedText !== arabic ? "\n\n" + translatedText : "") + (source ? "\n📚 " + source : "");

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /**/ }
  };
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: "سنن مع الزوجة", text: shareText }); } catch { /**/ } }
    else handleCopy();
  };

  return (
    <div className="flex items-center justify-between px-3 py-2.5 mt-1" style={{ borderTop: "1px solid var(--gold-border)" }}>
      <span className="text-xs flex-1 min-w-0 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
        {source && <><span>📚</span><span className="truncate">{source}</span></>}
      </span>
      <div className="flex items-center gap-0.5">
        <motion.button whileTap={{ scale: 0.8 }} onClick={onToggleFavorite} className="p-2 rounded-xl" style={{ background: isFav ? "var(--gold-muted)" : "transparent" }} title={isRtl ? "حفظ" : "Save"}>
          <Bookmark className="w-4 h-4" fill={isFav ? "var(--gold)" : "none"} style={{ color: isFav ? "var(--gold)" : "var(--text-muted)" }} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.8 }} onClick={handleCopy} className="p-2 rounded-xl" style={{ background: copied ? "var(--teal-muted)" : "transparent" }} title={isRtl ? "نسخ" : "Copy"}>
          {copied ? <Check className="w-4 h-4" style={{ color: "var(--text-teal)" }} /> : <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
        </motion.button>
        <motion.button whileTap={{ scale: 0.8 }} onClick={handleShare} className="p-2 rounded-xl" title={isRtl ? "مشاركة" : "Share"}>
          <Share2 className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        </motion.button>
      </div>
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

      <div className="pt-4 pb-4">
        {/* Image viewer */}
        <div className="relative rounded-2xl overflow-hidden mb-5"
          style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)", minHeight: "56vw", maxHeight: "65vh" }}>
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
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(0,0,0,0.5)", color: "var(--gold)", backdropFilter: "blur(4px)" }}>
            {current} / {TOTAL}
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button onClick={() => goTo(current + 1)} disabled={current >= TOTAL}
            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-30"
            style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)", color: "var(--text-gold)" }}>
            {isArabic ? "التالي →" : "Next →"}
          </button>

          <div className="flex gap-1 flex-wrap justify-center" style={{ maxWidth: "100px" }}>
            {[...Array(TOTAL)].map((_, i) => (
              <button key={i} onClick={() => goTo(i + 1)} className="rounded-full transition-all"
                style={{ width: i + 1 === current ? "14px" : "4px", height: "4px", background: i + 1 === current ? "var(--gold)" : "var(--gold-muted-strong)" }} />
            ))}
          </div>

          <button onClick={() => goTo(current - 1)} disabled={current <= 1}
            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-30"
            style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)", color: "var(--text-gold)" }}>
            {isArabic ? "← السابق" : "← Prev"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5" style={{ color: "var(--text-muted)" }}>
          <div className="flex-1 h-px" style={{ background: "var(--gold-border)" }} />
          <span className="text-xs font-semibold tracking-wider">{isArabic ? "نصائح الحياة الزوجية" : "Marriage Tips"}</span>
          <div className="flex-1 h-px" style={{ background: "var(--gold-border)" }} />
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

        {/* Wife tips cards */}
        <div className="space-y-3">
          {isTranslating
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl animate-pulse" style={{ height: "110px", background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
              ))
            : translatedItems.map((item, idx) => {
                const fav = isFavorite(item.id);
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.4) }} className="rounded-2xl overflow-hidden"
                    style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}>
                    {/* Index */}
                    <div className="px-4 pt-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: "var(--gold-muted)", color: "var(--text-gold)", border: "1px solid var(--gold-border)" }}>
                        {idx + 1}
                      </span>
                    </div>

                    {/* Arabic */}
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

                    {!isArabic && item.translatedText && ( 
                      <div className="mx-4 mb-2 mt-1 px-3 py-2 rounded-xl" style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)", direction: "ltr" }}>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-teal)", lineHeight: "1.75" }}>
                          {item.translatedText}
                        </p>
                      </div>
                    )}

                    {/* Action bar */}
                    <CardActions
                      arabic={item.arabic} translatedText={item.translatedText}
                      source={item.source} isFav={fav}
                      onToggleFavorite={() => toggleFavorite(item)} language={language}
                    />
                  </motion.div>
                );
              })}
        </div>
      </div>
    </PageLayout>
  );
}
