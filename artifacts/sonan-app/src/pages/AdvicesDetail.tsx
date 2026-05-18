import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Copy, Share2, Check } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import type { ContentItem } from "@/lib/contentData";

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

function CardActions({
  arabic, source, language,
}: {
  arabic: string; source?: string; language: string;
}) {
  const [copied, setCopied] = useState(false);
  const isRtl = language === "ar";
  const shareText = arabic + (source ? "\n📚 " + source : "");

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /**/ }
  };
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: "نصائح نبوية", text: shareText }); } catch { /**/ } } else handleCopy();
  };

  return (
    <div className="flex items-center gap-1 justify-end pt-3 mt-3" style={{ borderTop: "1px solid var(--gold-border)" }}>
      <motion.button whileTap={{ scale: 0.8 }} onClick={handleCopy} className="p-2 rounded-xl" style={{ background: copied ? "var(--teal-muted)" : "transparent" }} title={isRtl ? "نسخ" : "Copy"}>
        {copied ? <Check className="w-4 h-4" style={{ color: "var(--text-teal)" }} /> : <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
      </motion.button>
      <motion.button whileTap={{ scale: 0.8 }} onClick={handleShare} className="p-2 rounded-xl" title={isRtl ? "مشاركة" : "Share"}>
        <Share2 className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
      </motion.button>
    </div>
  );
}

export default function AdvicesDetail() {
  const { id } = useParams<{ id: string }>();
  const [advice, setAdvice] = useState<AdviceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isRtl = language === "ar";

  useEffect(() => {
    if (!id) return;
    fetch(`${import.meta.env.BASE_URL}data/advices-data.json`)
      .then((r) => r.json())
      .then((data: AdvicesData) => {
        const found = data.advices?.find((a) => String(a.id) === id);
        setAdvice(found ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const fakeItem: ContentItem | null = advice ? {
    id: `advice_${advice.id}`,
    arabic: advice.content.hadith ?? advice.content.intro ?? advice.title,
    source: advice.content.source,
    category: "advices",
  } : null;

  const fav = fakeItem ? isFavorite(fakeItem.id) : false;

  const FIELD_LABELS: Record<string, [string, string]> = {
    intro:       ["مقدمة",   "Introduction"],
    narrator:    ["الراوي",  "Narrator"],
    hadith:      ["الحديث",  "Hadith"],
    source:      ["المصدر",  "Source"],
    explanation: ["الشرح",   "Explanation"],
  };

  return (
    <PageLayout
      title={advice?.title ?? "..."}
      subtitle={isRtl ? "نصيحة نبوية" : "Prophetic Advice"}
      backHref="/advices"
    >
      <div className="pt-6 pb-12">
        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl animate-pulse"
                style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
            ))}
          </div>
        )}

        {!loading && advice && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Number badge */}
            <div className="flex items-center justify-between mb-5">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold"
                style={{ background: "var(--gold-muted)", color: "var(--text-gold)", border: "1px solid var(--gold-border)" }}
              >
                💡 {isRtl ? `النصيحة ${advice.id}` : `Advice #${advice.id}`}
              </span>

              {/* Favorite */}
              {fakeItem && (
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleFavorite(fakeItem)}
                  className="p-2 rounded-xl" style={{ background: fav ? "var(--gold-muted)" : "transparent" }}>
                  <Bookmark className="w-5 h-5" fill={fav ? "var(--gold)" : "none"} style={{ color: fav ? "var(--gold)" : "var(--text-muted)" }} />
                </motion.button>
              )}
            </div>

            {/* Content fields */}
            <div className="space-y-3">
              {Object.entries(FIELD_LABELS).map(([key, [labelAr, labelEn]]) => {
                const val = advice.content[key];
                if (!val) return null;
                const isHadith = key === "hadith" || key === "intro";
                const isSource = key === "source";
                return (
                  <div
                    key={key}
                    className="rounded-2xl p-4"
                    style={{
                      background: isHadith ? "var(--gold-muted)" : isSource ? "var(--teal-muted)" : "hsl(var(--card))",
                      border: `1px solid ${isHadith ? "var(--gold-border)" : isSource ? "var(--teal-border)" : "var(--gold-border)"}`,
                    }}
                  >
                    {/* Field label */}
                    <p className="text-xs font-bold mb-2 flex items-center gap-1.5"
                      style={{ color: isHadith ? "var(--text-gold)" : isSource ? "var(--text-teal)" : "var(--text-muted)" }}>
                      {key === "narrator" && "👤"}
                      {isHadith && "📜"}
                      {isSource && "📚"}
                      {key === "explanation" && "💡"}
                      {isRtl ? labelAr : labelEn}
                    </p>
                    {/* Field value */}
                    <p
                      className={isHadith ? "amiri text-right leading-loose" : "text-sm leading-relaxed"}
                      style={{
                        direction: "rtl",
                        fontSize: isHadith ? "1.08rem" : "0.9rem",
                        lineHeight: isHadith ? "2.1" : "1.8",
                        color: isHadith ? "var(--text-primary)" : isSource ? "var(--text-teal)" : "var(--text-muted)",
                      }}
                    >
                      {val}
                    </p>
                    {/* Actions on hadith block */}
                    {isHadith && fakeItem && (
                      <CardActions arabic={val} source={advice.content.source} language={language} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {!loading && !advice && (
          <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
            <p>{isRtl ? "لا يوجد محتوى" : "Not found"}</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
