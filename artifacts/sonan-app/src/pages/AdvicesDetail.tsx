import { useState, useEffect, useMemo } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Copy, Share2, Check } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import type { ContentItem } from "@/lib/contentData";
import type { Language } from "@/lib/translations";

interface AdviceContent {
  intro?: string;
  narrator?: string;
  hadith?: string;
  source?: string;
  explanation?: string;
  [key: string]: string | undefined;
}

interface AdviceItem {
  id: number;
  title: string;
  content: AdviceContent;
}

interface AdvicesData {
  advices: AdviceItem[];
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: "rgba(0,0,0,0.1)" }}>
      <motion.div className="h-full" style={{ background: "linear-gradient(90deg, var(--gold), var(--teal))" }}
        initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
    </div>
  );
}

const FIELD_ORDER = ["intro", "narrator", "hadith", "source", "explanation"] as const;

const FIELD_META: Record<string, { labelAr: string; labelEn: string; icon: string; style: "gold" | "teal" | "card" }> = {
  intro:       { labelAr: "مقدمة",  labelEn: "Introduction", icon: "✨", style: "card" },
  narrator:    { labelAr: "الراوي", labelEn: "Narrator",     icon: "👤", style: "card" },
  hadith:      { labelAr: "الحديث", labelEn: "Hadith",       icon: "📜", style: "gold" },
  source:      { labelAr: "المصدر", labelEn: "Source",       icon: "📚", style: "teal" },
  explanation: { labelAr: "الشرح",  labelEn: "Explanation",  icon: "💡", style: "card" },
};

export default function AdvicesDetail() {
  const { id } = useParams<{ id: string }>();
  const { language } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [advice, setAdvice] = useState<AdviceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const isArabic = language === "ar";

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}data/advices-data.json`)
      .then((r) => r.json())
      .then((data: AdvicesData) => {
        const found = data.advices?.find((a) => String(a.id) === id);
        setAdvice(found ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  /* Build ContentItem[] for each translatable text field */
  const contentItems = useMemo<ContentItem[]>(() => {
    if (!advice) return [];
    const fields = ["intro", "hadith", "explanation"];
    return fields
      .map((key, i) => ({
        id: `advice_${id}_${key}`,
        arabic: advice.content[key] ?? "",
        source: key === "hadith" ? advice.content.source : undefined,
        category: "advices",
      }))
      .filter((item) => item.arabic);
  }, [advice, id]);

  const { translatedItems, isTranslating, translationProgress } =
    useContentTranslation(contentItems, language as Language);

  /* Map back key → translated text */
  const translationMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (!advice) return map;
    const fields = ["intro", "hadith", "explanation"];
    fields.forEach((key, i) => {
      const t = translatedItems[i];
      if (t) map[key] = t.translatedText;
    });
    return map;
  }, [translatedItems, advice]);

  const fakeItem: ContentItem | null = advice ? {
    id: `advice_${advice.id}`,
    arabic: advice.content.hadith ?? advice.content.intro ?? advice.title,
    source: advice.content.source,
    category: "advices",
  } : null;
  const fav = fakeItem ? isFavorite(fakeItem.id) : false;

  const shareText = advice
    ? [
        advice.title,
        advice.content.hadith ?? advice.content.intro ?? "",
        !isArabic && translationMap["hadith"] && translationMap["hadith"] !== (advice.content.hadith ?? advice.content.intro)
          ? translationMap["hadith"] : "",
        advice.content.source ?? "",
      ].filter(Boolean).join("\n\n")
    : "";

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /**/ }
  };
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: "نصائح نبوية", text: shareText }); } catch { /**/ } } else handleCopy();
  };

  return (
    <PageLayout
      title={advice?.title ?? "..."}
      subtitle={isArabic ? "نصيحة نبوية" : "Prophetic Advice"}
      backHref="/advices"
    >
      {isTranslating && <ProgressBar progress={translationProgress} />}

      <div className="pt-4 pb-12 space-y-3">
        {/* Translating banner */}
        <AnimatePresence>
          {isTranslating && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm"
              style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)", color: "var(--text-teal)" }}>
              <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
              <span>{isArabic ? "جاري الترجمة..." : "Translating…"} <span className="font-bold">{translationProgress}%</span></span>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && [...Array(3)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl animate-pulse"
            style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
        ))}

        {!loading && advice && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Header: number + favorite */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold"
                style={{ background: "var(--gold-muted)", color: "var(--text-gold)", border: "1px solid var(--gold-border)" }}>
                💡 {isArabic ? `النصيحة ${advice.id}` : `Advice #${advice.id}`}
              </span>
              {fakeItem && (
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleFavorite(fakeItem)}
                  className="p-2 rounded-xl" style={{ background: fav ? "var(--gold-muted)" : "transparent" }}
                  title={isArabic ? "حفظ" : "Save"}>
                  <Bookmark className="w-5 h-5" fill={fav ? "var(--gold)" : "none"} style={{ color: fav ? "var(--gold)" : "var(--text-muted)" }} />
                </motion.button>
              )}
            </div>

            {/* Content fields */}
            <div className="space-y-3">
              {FIELD_ORDER.map((key) => {
                const val = advice.content[key];
                if (!val) return null;
                const meta = FIELD_META[key];
                const bgStyle = meta.style === "gold"
                  ? { background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }
                  : meta.style === "teal"
                  ? { background: "var(--teal-muted)", border: "1px solid var(--teal-border)" }
                  : { background: "hsl(var(--card))", border: "1px solid var(--gold-border)" };
                const textColor = meta.style === "gold" ? "var(--text-primary)"
                  : meta.style === "teal" ? "var(--text-teal)" : "var(--text-muted)";
                const labelColor = meta.style === "gold" ? "var(--text-gold)"
                  : meta.style === "teal" ? "var(--text-teal)" : "var(--text-muted)";
                const isHadith = key === "hadith" || key === "intro";
                const translatedVal = translationMap[key];
                const showTranslation = !isArabic && translatedVal && translatedVal !== val;

                return (
                  <div key={key} className="rounded-2xl p-4" style={bgStyle}>
                    {/* Label */}
                    <p className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: labelColor }}>
                      <span>{meta.icon}</span>
                      <span>{isArabic ? meta.labelAr : meta.labelEn}</span>
                    </p>

                    {/* Arabic value */}
                    <p className={isHadith ? "amiri text-right leading-loose" : "text-sm leading-relaxed text-right"}
                      style={{
                        direction: "rtl",
                        fontSize: isHadith ? "1.08rem" : "0.9rem",
                        lineHeight: isHadith ? "2.1" : "1.8",
                        color: textColor,
                      }}>
                      {val}
                    </p>

                    {/* Translation */}
                    {showTranslation && (
                      <div className="mt-2 pt-2 border-t" style={{ borderColor: "var(--gold-border)", direction: "ltr" }}>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-teal)", lineHeight: "1.75", minHeight: "20px" }}>
                          {translatedVal && translatedVal !== val ? translatedVal : <span style={{ opacity: 0.5, fontSize: "0.85rem" }}>⏳ Translation loading...</span>}
                        </p>
                      </div>
                    )}
                    {/* Always show translation box if not Arabic and translation attempted */}
                    {!isArabic && !showTranslation && translatedVal && (
                      <div className="mt-2 pt-2 border-t" style={{ borderColor: "var(--gold-border)", direction: "ltr" }}>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-teal)", lineHeight: "1.75", minHeight: "20px", opacity: 0.6 }}>
                          جاري تحميل الترجمة...
                        </p>
                      </div>
                    )}

                    {/* Share/Copy on hadith block */}
                    {isHadith && (
                      <div className="flex items-center gap-0.5 justify-end mt-2 pt-2 border-t" style={{ borderColor: "var(--gold-border)" }}>
                        <motion.button whileTap={{ scale: 0.8 }} onClick={handleCopy} className="p-2 rounded-xl"
                          style={{ background: copied ? "var(--teal-muted)" : "transparent" }} title={isArabic ? "نسخ" : "Copy"}>
                          {copied ? <Check className="w-4 h-4" style={{ color: "var(--text-teal)" }} /> : <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.8 }} onClick={handleShare} className="p-2 rounded-xl"
                          title={isArabic ? "مشاركة" : "Share"}>
                          <Share2 className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                        </motion.button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {!loading && !advice && (
          <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
            <p>{isArabic ? "لا يوجد محتوى" : "Not found"}</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
