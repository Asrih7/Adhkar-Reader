import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Bookmark, Copy, Share2, Check } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import type { ContentItem } from "@/lib/contentData";
import { copyText, shareContent } from "@/lib/shareService";

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

  /* Load from pre-translated JSON file for the current language */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const file = language === "ar" ? "advices-data.json" : `advices-data.${language}.json`;
    fetch(`${import.meta.env.BASE_URL}data/${file}`)
      .then(r => r.ok ? r.json() : fetch(`${import.meta.env.BASE_URL}data/advices-data.json`).then(r2 => r2.json()))
      .then((data: AdvicesData) => {
        setAdvice(data.advices?.find(a => String(a.id) === id) ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, language]);

  const fakeItem: ContentItem | null = advice ? {
    id: `advice_${advice.id}`,
    arabic: advice.content.hadith ?? advice.content.intro ?? advice.title,
    source: advice.content.source,
    category: "advices",
  } : null;
  const fav = fakeItem ? isFavorite(fakeItem.id) : false;

  const shareText = advice
    ? [advice.title, advice.content.hadith ?? advice.content.intro ?? "", advice.content.source ?? ""]
        .filter(Boolean).join("\n\n")
    : "";

  const handleCopy = async () => {
    if (await copyText(shareText)) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  const handleShare = async () => {
    await shareContent({ title: advice?.title ?? "نصيحة نبوية", text: shareText, url: window.location.href });
  };

  return (
    <PageLayout
      title={advice?.title ?? "..."}
      subtitle={isArabic ? "نصيحة نبوية" : "Prophetic Advice"}
      backHref="/advices"
    >
      <div className="pt-4 pb-12 space-y-3">
        {loading && [...Array(3)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl animate-pulse"
            style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
        ))}

        {!loading && advice && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold"
                style={{ background: "var(--gold-muted)", color: "var(--text-gold)", border: "1px solid var(--gold-border)" }}>
                💡 {isArabic ? `النصيحة ${advice.id}` : `Advice #${advice.id}`}
              </span>
              {fakeItem && (
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleFavorite(fakeItem)}
                  className="p-2 rounded-xl" style={{ background: fav ? "var(--gold-muted)" : "transparent" }}>
                  <Bookmark className="w-5 h-5" fill={fav ? "var(--gold)" : "none"}
                    style={{ color: fav ? "var(--gold)" : "var(--text-muted)" }} />
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

                return (
                  <div key={key} className="rounded-2xl p-4" style={bgStyle}>
                    <p className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: labelColor }}>
                      <span>{meta.icon}</span>
                      <span>{isArabic ? meta.labelAr : meta.labelEn}</span>
                    </p>
                    <p
                      className={isHadith ? "amiri leading-loose" : "text-sm leading-relaxed"}
                      style={{
                        direction: isArabic ? "rtl" : "ltr",
                        textAlign: isArabic ? "right" : "left",
                        fontSize: isHadith ? "1.08rem" : "0.9rem",
                        lineHeight: isHadith ? "2.1" : "1.8",
                        color: textColor,
                      }}
                    >
                      {val}
                    </p>

                    {/* Action buttons on hadith block */}
                    {isHadith && (
                      <div className="flex items-center gap-0.5 justify-end mt-2 pt-2 border-t"
                        style={{ borderColor: "var(--gold-border)" }}>
                        <motion.button whileTap={{ scale: 0.8 }} onClick={handleCopy} className="p-2 rounded-xl"
                          style={{ background: copied ? "var(--teal-muted)" : "transparent" }}>
                          {copied
                            ? <Check className="w-4 h-4" style={{ color: "var(--text-teal)" }} />
                            : <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.8 }} onClick={handleShare} className="p-2 rounded-xl">
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
