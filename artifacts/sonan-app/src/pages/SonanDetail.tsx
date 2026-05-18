import { useEffect, useState, useMemo } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Copy, Share2, Check } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import type { ContentItem } from "@/lib/contentData";
import type { Language } from "@/lib/translations";

interface SonanContent {
  sonaId?: string;
  title?: string;
  text?: string;
  hadith?: string;
  source?: string;
  explanation?: string;
  narrator?: string;
  evidence?: string | string[];
  note?: string;
  [key: string]: unknown;
}

interface SonanMeta {
  sonaId: string;
  text: string;
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: "rgba(0,0,0,0.1)" }}>
      <motion.div className="h-full" style={{ background: "linear-gradient(90deg, var(--gold), var(--teal))" }}
        initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
    </div>
  );
}

function getMainArabic(c: SonanContent): string {
  return c.hadith || c.text || c.title || "";
}

export default function SonanDetail() {
  const { id } = useParams<{ id: string }>();
  const { language } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [rawContent, setRawContent] = useState<SonanContent | SonanContent[] | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const isArabic = language === "ar";

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}data/sonan-data.json`)
      .then((r) => r.json())
      .then((data: SonanMeta[]) => {
        const found = data.find((d) => d.sonaId === id);
        if (found) setTitle(found.text);
      });
    fetch(`${import.meta.env.BASE_URL}data/sonan-${id}.json`)
      .then((r) => r.json())
      .then((d) => { setRawContent(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  /* Build ContentItem[] from content for translation */
  const contentItems = useMemo<ContentItem[]>(() => {
    if (!rawContent) return [];
    const arr = Array.isArray(rawContent) ? rawContent : [rawContent];
    return arr.map((c, i) => ({
      id: `sonan_${id}_${i}`,
      arabic: getMainArabic(c),
      source: c.source ?? undefined,
      category: "dailySonan",
    })).filter((item) => item.arabic);
  }, [rawContent, id]);

  const { translatedItems, isTranslating, translationProgress } =
    useContentTranslation(contentItems, language as Language);

  const contentArr = useMemo(
    () => (rawContent ? (Array.isArray(rawContent) ? rawContent : [rawContent]) : []),
    [rawContent]
  );

  const LABELS: Record<string, [string, string]> = {
    narrator:    ["الراوي",  "Narrator"],
    explanation: ["الشرح",   "Explanation"],
    evidence:    ["الدليل",  "Evidence"],
    note:        ["ملاحظة",  "Note"],
  };

  const handleCopy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /**/ }
  };
  const handleShare = async (text: string) => {
    if (navigator.share) { try { await navigator.share({ title: "السنن النبوية", text }); } catch { /**/ } } else handleCopy(text);
  };

  return (
    <PageLayout title={title || `السنة ${id}`} subtitle={isArabic ? "سنة نبوية" : "Prophetic Sunnah"} backHref="/sonan">
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

        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl animate-pulse"
              style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
          ))
        ) : !rawContent ? (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <p>{isArabic ? "لا يوجد محتوى" : "No content available"}</p>
          </div>
        ) : (
          contentArr.map((c, idx) => {
            const translated = translatedItems[idx];
            const arabic = getMainArabic(c);
            const evidenceStr = Array.isArray(c.evidence) ? c.evidence.join(" — ") : c.evidence;
            const fakeId = `sonan_${id}_${idx}`;
            const fakeItem: ContentItem = { id: fakeId, arabic, source: c.source, category: "dailySonan" };
            const fav = isFavorite(fakeId);
            const shareText = [arabic, translated?.translatedText !== arabic ? translated?.translatedText : "", c.source].filter(Boolean).join("\n\n📚 ");

            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>

                {idx > 0 && (
                  <div className="px-4 pt-3 pb-0">
                    <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                      {isArabic ? `رواية ${idx + 1}` : `Narration ${idx + 1}`}
                    </span>
                  </div>
                )}

                {/* Narrator */}
                {c.narrator && (
                  <div className="px-4 pt-3 pb-1">
                    <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)", direction: "rtl" }}>
                      <span>👤</span><span>{c.narrator}</span>
                    </p>
                  </div>
                )}

                {/* Main hadith text (Arabic) */}
                {arabic && (
                  <div className="px-4 pt-3 pb-2">
                    <p className="amiri text-right leading-loose"
                      style={{ fontSize: "1.08rem", lineHeight: "2.1", direction: "rtl", color: "var(--text-primary)" }}>
                      {arabic}
                    </p>
                  </div>
                )}

                {/* Translation */}
                {!isArabic && translated?.translatedText && translated.translatedText !== arabic && (
                  <div className="mx-4 mb-2 px-3 py-2 rounded-xl"
                    style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)", direction: "ltr" }}>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-teal)", lineHeight: "1.75" }}>
                      {translated.translatedText}
                    </p>
                  </div>
                )}

                {/* Source */}
                {c.source && (
                  <div className="mx-4 mb-2 px-3 py-2 rounded-xl"
                    style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)" }}>
                    <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-teal)", direction: "rtl" }}>
                      <span>📚</span><span>{c.source}</span>
                    </p>
                  </div>
                )}

                {/* Extra fields (explanation, evidence, note) */}
                {Object.entries(LABELS).map(([key, [labelAr, labelEn]]) => {
                  const val = key === "evidence" ? evidenceStr : c[key] as string | undefined;
                  if (!val) return null;
                  return (
                    <div key={key} className="mx-4 mb-2 px-3 py-2.5 rounded-xl"
                      style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}>
                      <p className="text-xs font-bold mb-1.5" style={{ color: "var(--text-gold)" }}>
                        {isArabic ? labelAr : labelEn}
                      </p>
                      <p className="text-sm leading-relaxed text-right"
                        style={{ direction: "rtl", color: "var(--text-muted)", lineHeight: "1.8" }}>
                        {val}
                      </p>
                    </div>
                  );
                })}

                {/* ── Action bar ── */}
                <div className="flex items-center justify-between px-3 py-2.5"
                  style={{ borderTop: "1px solid var(--gold-border)" }}>
                  <span />
                  <div className="flex items-center gap-0.5">
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleFavorite(fakeItem)}
                      className="p-2 rounded-xl" style={{ background: fav ? "var(--gold-muted)" : "transparent" }}
                      title={isArabic ? "حفظ" : "Save"}>
                      <Bookmark className="w-4 h-4" fill={fav ? "var(--gold)" : "none"} style={{ color: fav ? "var(--gold)" : "var(--text-muted)" }} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleCopy(shareText)}
                      className="p-2 rounded-xl" style={{ background: copied ? "var(--teal-muted)" : "transparent" }}
                      title={isArabic ? "نسخ" : "Copy"}>
                      {copied ? <Check className="w-4 h-4" style={{ color: "var(--text-teal)" }} /> : <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleShare(shareText)}
                      className="p-2 rounded-xl" title={isArabic ? "مشاركة" : "Share"}>
                      <Share2 className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </PageLayout>
  );
}
