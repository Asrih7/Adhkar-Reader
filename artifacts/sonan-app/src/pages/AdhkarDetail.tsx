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

interface DhikrItem {
  id: number;
  text: string;
  source: string | null;
}

interface AdhkarMeta {
  adkharId: string;
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

/* ── Action bar ── */
function CardActions({
  itemId, arabic, translatedText, source, language,
}: {
  itemId: string; arabic: string; translatedText?: string; source?: string | null; language: string;
}) {
  const [copied, setCopied] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(itemId);
  const isRtl = language === "ar";

  const fakeItem: ContentItem = { id: itemId, arabic, source: source ?? undefined, category: "morningAdhkar" };
  const shareText = arabic + (translatedText && translatedText !== arabic ? "\n\n" + translatedText : "") + (source ? "\n📚 " + source : "");

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /**/ }
  };
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: "تطبيق الأذكار", text: shareText }); } catch { /**/ } } else handleCopy();
  };

  return (
    <div className="flex items-center justify-between px-3 py-2.5" style={{ borderTop: "1px solid var(--gold-border)" }}>
      <span className="text-xs flex items-center gap-1 flex-1 min-w-0" style={{ color: "var(--text-muted)" }}>
        {source && <><span>📚</span><span className="truncate">{source}</span></>}
      </span>
      <div className="flex items-center gap-0.5">
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleFavorite(fakeItem)} className="p-2 rounded-xl"
          style={{ background: fav ? "var(--gold-muted)" : "transparent" }} title={isRtl ? "حفظ" : "Save"}>
          <Bookmark className="w-4 h-4" fill={fav ? "var(--gold)" : "none"} style={{ color: fav ? "var(--gold)" : "var(--text-muted)" }} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.8 }} onClick={handleCopy} className="p-2 rounded-xl"
          style={{ background: copied ? "var(--teal-muted)" : "transparent" }} title={isRtl ? "نسخ" : "Copy"}>
          {copied ? <Check className="w-4 h-4" style={{ color: "var(--text-teal)" }} /> : <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
        </motion.button>
        <motion.button whileTap={{ scale: 0.8 }} onClick={handleShare} className="p-2 rounded-xl" title={isRtl ? "مشاركة" : "Share"}>
          <Share2 className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        </motion.button>
      </div>
    </div>
  );
}

export default function AdhkarDetail() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useTranslation();
  const [rawItems, setRawItems] = useState<DhikrItem[]>([]);
  const [title, setTitle] = useState("");
  const [translatedTitle, setTranslatedTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const isArabic = language === "ar";

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setCounts({});
    fetch(`${import.meta.env.BASE_URL}data/adhkar-data.json`)
      .then((r) => r.json())
      .then((data: AdhkarMeta[]) => {
        const found = data.find((d) => d.adkharId === id);
        if (found) setTitle(found.text);
      });
    const fileIndex = parseInt(id, 10);
    fetch(`${import.meta.env.BASE_URL}data/adkar-${fileIndex}.json`)
      .then((r) => r.json())
      .then((d) => { setRawItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  // Translate page title
  const titleItems = useMemo<ContentItem[]>(() => {
    if (!title) return [];
    return [{ id: `adhkar_title_${id}`, arabic: title, category: "morningAdhkar" }];
  }, [title, id, language]);

  const { translatedItems: titleTranslated } = useContentTranslation(titleItems, language as Language);

  useEffect(() => {
    if (titleTranslated.length > 0) {
      setTranslatedTitle(titleTranslated[0]?.translatedText || title);
    }
  }, [titleTranslated, title]);

  /* Convert raw items → ContentItem[] for translation */
  const contentItems = useMemo<ContentItem[]>(
    () => rawItems.map((d) => ({
      id: `adkar_${id}_${d.id}`,
      arabic: d.text,
      source: d.source ?? undefined,
      category: "morningAdhkar",
    })),
    [rawItems, id, language]
  );

  const { translatedItems, isTranslating, translationProgress } =
    useContentTranslation(contentItems, language as Language);

  const increment = (itemId: number) => setCounts((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  const reset     = (itemId: number) => setCounts((prev) => ({ ...prev, [itemId]: 0 }));

  const displayTitle = isArabic ? title : (translatedTitle || title);

  return (
    <PageLayout title={displayTitle || "..."} subtitle={isArabic ? "اضغط على الذكر للعد" : "Tap to count"} backHref="/adhkar">
      {isTranslating && <ProgressBar progress={translationProgress} />}

      <div className="pt-4 pb-10 space-y-3">
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
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl animate-pulse"
              style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
          ))
        ) : translatedItems.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <p>{isArabic ? "لا يوجد محتوى متاح" : "No content available"}</p>
          </div>
        ) : (
          translatedItems.map((item, index) => {
            const rawItem = rawItems[index];
            const countVal = rawItem ? (counts[rawItem.id] || 0) : 0;
            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.4 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}
              >
                {/* Header row */}
                <div className="px-4 pt-3 pb-0 flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: "var(--gold-muted)", color: "var(--text-gold)", border: "1px solid var(--gold-border)" }}>
                    {isArabic ? `ذكر ${index + 1}` : `Dhikr ${index + 1}`}
                  </span>
                  {/* Count badge */}
                  <AnimatePresence mode="wait">
                    <motion.span key={countVal}
                      initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: countVal > 0 ? "var(--teal-muted)" : "transparent",
                        color: countVal > 0 ? "var(--text-teal)" : "var(--text-muted)",
                        border: `1px solid ${countVal > 0 ? "var(--teal-border)" : "transparent"}`,
                      }}>
                      {countVal > 0 ? (isArabic ? `${countVal} مرة` : `×${countVal}`) : ""}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Tappable Arabic text */}
                <button onClick={() => rawItem && increment(rawItem.id)}
                  className="w-full px-4 pt-3 pb-2 text-right active:opacity-75 transition-opacity">
                  <p className="amiri leading-loose"
                    style={{ fontSize: "1.1rem", lineHeight: "2.2", direction: "rtl", color: "var(--text-primary)" }}>
                    {item.arabic}
                  </p>
                </button>

                {/* Translation box */}
                {!isArabic && item.translatedText && (
                  <div className="mx-4 mb-2 px-3 py-2 rounded-xl"
                    style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)", direction: "ltr" }}>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-teal)", lineHeight: "1.75", minHeight: "20px" }}>
                      {item.translatedText}
                    </p>
                  </div>
                )}

                {/* Reset button */}
                {rawItem && countVal > 0 && (
                  <div className="px-4 pb-1 flex justify-end">
                    <button onClick={() => reset(rawItem.id)}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ background: "rgba(239,68,68,0.07)", color: "rgba(239,68,68,0.6)" }}>
                      {isArabic ? "إعادة" : "Reset"}
                    </button>
                  </div>
                )}

                {/* ── Action bar ── */}
                <CardActions
                  itemId={item.id} arabic={item.arabic}
                  translatedText={!isArabic ? item.translatedText : undefined}
                  source={item.source} language={language}
                />
              </motion.div>
            );
          })
        )}

        {translatedItems.length > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-center text-xs pt-2" style={{ color: "var(--text-muted)" }}>
            {isArabic ? "اضغط على الذكر للعدّ" : "Tap on a dhikr to count"}
          </motion.p>
        )}
      </div>
    </PageLayout>
  );
}
