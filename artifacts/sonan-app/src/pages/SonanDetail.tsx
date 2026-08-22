import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Bookmark, Copy, Share2, Check } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import type { ContentItem } from "@/lib/contentData";
import { copyText, shareContent } from "@/lib/shareService";

interface SonanItem {
  id?: number;
  text?: string;
  source?: string | null;
  [key: string]: unknown;
}

interface SonanMeta {
  sonaId: string;
  text: string;
}

export default function SonanDetail() {
  const { id } = useParams<{ id: string }>();
  const { language } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [arabicItems, setArabicItems] = useState<SonanItem[]>([]);
  const [translatedItems, setTranslatedItems] = useState<SonanItem[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const isArabic = language === "ar";

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setArabicItems([]);
    setTranslatedItems([]);
    const base = import.meta.env.BASE_URL;

    /* Title from language-specific list file */
    const titleFile = isArabic ? "sonan-data.json" : `sonan-data.${language}.json`;
    fetch(`${base}data/${titleFile}`)
      .then(r => r.ok ? r.json() : fetch(`${base}data/sonan-data.json`).then(r2 => r2.json()))
      .then((data: SonanMeta[]) => {
        const found = data.find(d => d.sonaId === id);
        if (found) setTitle(found.text);
      })
      .catch(() => {});

    /* Load Arabic original */
    const arabicFetch = fetch(`${base}data/sonan-${id}.json`).then(r => r.json()) as Promise<SonanItem | SonanItem[]>;

    if (isArabic) {
      arabicFetch
        .then(d => {
          const arr = Array.isArray(d) ? d : [d];
          setArabicItems(arr);
          setTranslatedItems(arr);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      /* Load pre-translated file in parallel */
      const transFetch = fetch(`${base}data/sonan-${id}.${language}.json`)
        .then(r => r.ok ? r.json() : null) as Promise<SonanItem[] | null>;

      Promise.all([arabicFetch, transFetch])
        .then(([arabic, translated]) => {
          const arabicArr = Array.isArray(arabic) ? arabic : [arabic];
          const transArr  = translated ? (Array.isArray(translated) ? translated : [translated]) : arabicArr;
          setArabicItems(arabicArr);
          setTranslatedItems(transArr);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, language]);

  const handleCopy = async (text: string) => {
    if (await copyText(text)) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  const handleShare = async (text: string) => {
    await shareContent({ title: "السنن النبوية", text, url: window.location.href });
  };

  return (
    <PageLayout title={title || `السنة ${id}`} subtitle={isArabic ? "سنة نبوية" : "Prophetic Sunnah"} backHref="/sonan">
      <div className="pt-4 pb-12 space-y-3">
        {loading && [...Array(2)].map((_, i) => (
          <div key={i} className="h-36 rounded-2xl animate-pulse"
            style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
        ))}

        {!loading && arabicItems.length === 0 && (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <p>{isArabic ? "لا يوجد محتوى" : "No content available"}</p>
          </div>
        )}

        {!loading && arabicItems.map((arabicItem, idx) => {
          const translated = translatedItems[idx] ?? arabicItem;
          const arabicText = arabicItem.text ?? "";
          const translatedText = !isArabic ? (translated.text ?? arabicText) : arabicText;
          const translatedSource = !isArabic ? (translated.source ?? arabicItem.source) : arabicItem.source;
          const fakeId = `sonan_${id}_${idx}`;
          const fakeItem: ContentItem = { id: fakeId, arabic: arabicText, source: arabicItem.source ?? undefined, category: "dailySonan" };
          const fav = isFavorite(fakeId);
          const shareText = [
            arabicText,
            !isArabic && translatedText !== arabicText ? translatedText : "",
            translatedSource
          ].filter(Boolean).join("\n\n📚 ");

          return (
            <motion.div key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
            >
              {idx > 0 && (
                <div className="px-4 pt-3 pb-0">
                  <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                    {isArabic ? `رواية ${idx + 1}` : `Narration ${idx + 1}`}
                  </span>
                </div>
              )}

              {/* Main hadith text — Arabic (for recitation) */}
              {arabicText && (
                <div className="px-4 pt-3 pb-2">
                  <p className="amiri text-right leading-loose"
                    style={{ fontSize: "1.08rem", lineHeight: "2.1", direction: "rtl", color: "var(--text-primary)" }}>
                    {arabicText}
                  </p>
                </div>
              )}

              {/* Translation — shown for non-Arabic, only when different from original */}
              {!isArabic && translatedText && translatedText !== arabicText && (
                <div className="mx-4 mb-2 px-3 py-2 rounded-xl"
                  style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)", direction: "ltr" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-teal)", lineHeight: "1.75" }}>
                    {translatedText}
                  </p>
                </div>
              )}

              {/* Source */}
              {translatedSource && (
                <div className="mx-4 mb-2 px-3 py-2 rounded-xl"
                  style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)" }}>
                  <p className="text-xs flex items-center gap-1.5"
                    style={{ color: "var(--text-teal)", direction: isArabic ? "rtl" : "ltr", textAlign: isArabic ? "right" : "left" }}>
                    <span>📚</span><span>{translatedSource}</span>
                  </p>
                </div>
              )}

              {/* Action bar */}
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
        })}
      </div>
    </PageLayout>
  );
}
