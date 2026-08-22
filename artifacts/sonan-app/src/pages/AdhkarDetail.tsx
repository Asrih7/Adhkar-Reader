import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Copy, Share2, Check } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import type { ContentItem } from "@/lib/contentData";
import { copyText, shareContent } from "@/lib/shareService";

interface DhikrItem {
  id: number;
  text: string;
  source: string | null;
}

interface AdhkarMeta {
  adkharId: string;
  text: string;
}

function CardActions({
  itemId, arabic, translatedText, source, language,
}: {
  itemId: string; arabic: string; translatedText?: string;
  source?: string | null; language: string;
}) {
  const [copied, setCopied] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(itemId);
  const isRtl = language === "ar";
  const fakeItem: ContentItem = { id: itemId, arabic, source: source ?? undefined, category: "morningAdhkar" };
  const shareText = arabic + (translatedText && translatedText !== arabic ? "\n\n" + translatedText : "") + (source ? "\n📚 " + source : "");

  const handleCopy = async () => {
    if (await copyText(shareText)) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  const handleShare = async () => {
    await shareContent({ title: "سنن و نصائح الرسول", text: shareText, url: window.location.href });
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
  const [arabicItems, setArabicItems] = useState<DhikrItem[]>([]);
  const [translatedItems, setTranslatedItems] = useState<DhikrItem[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const isArabic = language === "ar";

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setCounts({});
    setArabicItems([]);
    setTranslatedItems([]);
    const base = import.meta.env.BASE_URL;
    const fileIndex = parseInt(id, 10);

    /* Title: load from language-specific list file */
    const titleFile = isArabic ? "adhkar-data.json" : `adhkar-data.${language}.json`;
    fetch(`${base}data/${titleFile}`)
      .then(r => r.ok ? r.json() : fetch(`${base}data/adhkar-data.json`).then(r2 => r2.json()))
      .then((data: AdhkarMeta[]) => {
        const found = data.find(d => d.adkharId === id);
        if (found) setTitle(found.text);
      })
      .catch(() => {});

    /* Always load original Arabic */
    const arabicFetch = fetch(`${base}data/adkar-${fileIndex}.json`).then(r => r.json()) as Promise<DhikrItem[]>;

    if (isArabic) {
      arabicFetch
        .then(d => { setArabicItems(d); setTranslatedItems(d); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      /* Load pre-translated file in parallel with Arabic */
      const translatedFetch = fetch(`${base}data/adkar-${fileIndex}.${language}.json`)
        .then(r => r.ok ? r.json() : null) as Promise<DhikrItem[] | null>;

      Promise.all([arabicFetch, translatedFetch])
        .then(([arabic, translated]) => {
          setArabicItems(arabic ?? []);
          setTranslatedItems(translated ?? arabic ?? []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, language]);

  const increment = (itemId: number) => setCounts(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  const reset     = (itemId: number) => setCounts(prev => ({ ...prev, [itemId]: 0 }));

  return (
    <PageLayout
      title={title || "..."}
      subtitle={isArabic ? "اضغط على الذكر للعد" : t("tapToCount") || "Tap to count"}
      backHref="/adhkar"
    >
      <div className="pt-4 pb-10 space-y-3">
        {loading && [...Array(4)].map((_, i) => (
          <div key={i} className="h-40 rounded-2xl animate-pulse"
            style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
        ))}

        {!loading && arabicItems.length === 0 && (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <p>{isArabic ? "لا يوجد محتوى متاح" : "No content available"}</p>
          </div>
        )}

        {!loading && arabicItems.map((rawItem, index) => {
          const translated = translatedItems[index];
          const countVal = counts[rawItem.id] || 0;
          const itemId = `adkar_${id}_${rawItem.id}`;
          const translatedText = !isArabic && translated ? translated.text : undefined;
          const translatedSource = !isArabic && translated ? translated.source : rawItem.source;

          return (
            <motion.div key={rawItem.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.4 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}
            >
              {/* Header */}
              <div className="px-4 pt-3 pb-0 flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "var(--gold-muted)", color: "var(--text-gold)", border: "1px solid var(--gold-border)" }}>
                  {isArabic ? `ذكر ${index + 1}` : `Dhikr ${index + 1}`}
                </span>
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

              {/* Tappable Arabic text — always shown for recitation */}
              <button onClick={() => increment(rawItem.id)}
                className="w-full px-4 pt-3 pb-2 text-right active:opacity-75 transition-opacity">
                <p className="amiri leading-loose"
                  style={{ fontSize: "1.1rem", lineHeight: "2.2", direction: "rtl", color: "var(--text-primary)" }}>
                  {rawItem.text}
                </p>
              </button>

              {/* Translation box — shown only for non-Arabic languages */}
              {!isArabic && translatedText && translatedText !== rawItem.text && (
                <div className="mx-4 mb-2 px-3 py-2 rounded-xl"
                  style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)", direction: "ltr" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-teal)", lineHeight: "1.75" }}>
                    {translatedText}
                  </p>
                </div>
              )}

              {/* Reset button */}
              {countVal > 0 && (
                <div className="px-4 pb-1 flex justify-end">
                  <button onClick={() => reset(rawItem.id)}
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.07)", color: "rgba(239,68,68,0.6)" }}>
                    {isArabic ? "إعادة" : "Reset"}
                  </button>
                </div>
              )}

              <CardActions
                itemId={itemId}
                arabic={rawItem.text}
                translatedText={translatedText}
                source={translatedSource}
                language={language}
              />
            </motion.div>
          );
        })}

        {!loading && arabicItems.length > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-center text-xs pt-2" style={{ color: "var(--text-muted)" }}>
            {isArabic ? "اضغط على الذكر للعدّ" : "Tap on a dhikr to count"}
          </motion.p>
        )}
      </div>
    </PageLayout>
  );
}
