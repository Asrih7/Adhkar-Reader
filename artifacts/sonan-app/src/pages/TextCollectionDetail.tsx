import { useEffect, useMemo, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Bookmark, Check, Copy, Share2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useFavorites } from "@/hooks/useFavorites";
import { useTranslation } from "@/hooks/useTranslation";
import type { ContentItem } from "@/lib/contentData";
import { copyText, shareContent } from "@/lib/shareService";

interface TextItem {
  id: string;
  title: string;
  text: string;
  source?: string;
  category: string;
}

interface TextCollection {
  title: string;
  subtitle: string;
  category: string;
  items: TextItem[];
}

interface Props {
  dataName: "wife-sonan-data" | "forgettable-sonan-data";
  backHref: string;
  fallbackTitleKey: string;
  fallbackSubtitleKey: string;
}

export default function TextCollectionDetail({ dataName, backHref, fallbackTitleKey, fallbackSubtitleKey }: Props) {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [arabicData, setArabicData] = useState<TextCollection | null>(null);
  const [translatedData, setTranslatedData] = useState<TextCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const isArabic = language === "ar";

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const base = `${import.meta.env.BASE_URL}data/`;
    const translatedFile = language === "ar" ? `${dataName}.json` : `${dataName}.${language}.json`;

    Promise.all([
      fetch(`${base}${dataName}.json`).then((r) => r.json()),
      fetch(`${base}${translatedFile}`)
        .then((r) => r.ok ? r.json() : fetch(`${base}${dataName}.json`).then((r2) => r2.json())),
    ])
      .then(([ar, translated]: [TextCollection, TextCollection]) => {
        setArabicData(ar);
        setTranslatedData(translated);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dataName, id, language]);

  const arabicItem = useMemo(() => arabicData?.items.find((item) => item.id === id) ?? null, [arabicData, id]);
  const translatedItem = useMemo(() => translatedData?.items.find((item) => item.id === id) ?? arabicItem, [translatedData, arabicItem, id]);

  const favoriteItem: ContentItem | null = arabicItem ? {
    id: `${arabicItem.category}_${arabicItem.id}`,
    arabic: arabicItem.text,
    source: isArabic ? arabicItem.source : translatedItem?.source ?? arabicItem.source,
    category: arabicItem.category,
  } : null;
  const fav = favoriteItem ? isFavorite(favoriteItem.id) : false;
  const displayedSource = isArabic ? arabicItem?.source : translatedItem?.source ?? arabicItem?.source;
  const shareText = translatedItem && arabicItem
    ? [
        translatedItem.title,
        arabicItem.text,
        !isArabic && translatedItem.text !== arabicItem.text ? translatedItem.text : "",
        displayedSource ?? "",
      ].filter(Boolean).join("\n\n")
    : "";

  const handleCopy = async () => {
    if (await copyText(shareText)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    await shareContent({ title: translatedItem?.title ?? t(fallbackTitleKey), text: shareText, url: window.location.href });
  };

  return (
    <PageLayout
      title={translatedItem?.title ?? t(fallbackTitleKey)}
      subtitle={translatedData?.subtitle ?? t(fallbackSubtitleKey)}
      backHref={backHref}
    >
      <div className="pt-4 pb-12 space-y-3">
        {loading && [...Array(3)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl animate-pulse"
            style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
        ))}

        {!loading && arabicItem && translatedItem && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <div className="px-4 pt-3 pb-0">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{ background: "var(--gold-muted)", color: "var(--text-gold)", border: "1px solid var(--gold-border)" }}
              >
                {isArabic ? `رقم ${arabicItem.id}` : `#${arabicItem.id}`}
              </span>
            </div>

            <div className="px-4 pt-3 pb-2">
              <p
                className="amiri leading-loose text-right"
                style={{ direction: "rtl", fontSize: "1.08rem", lineHeight: "2.1", color: "var(--text-primary)" }}
              >
                {arabicItem.text}
              </p>
            </div>

            {!isArabic && translatedItem.text && translatedItem.text !== arabicItem.text && (
              <div className="mx-4 mb-2 px-3 py-2 rounded-xl" style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)" }}>
                <p className="text-sm leading-relaxed" style={{ direction: "ltr", lineHeight: 1.75, color: "var(--text-teal)" }}>
                  {translatedItem.text}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between px-3 py-2.5" style={{ borderTop: "1px solid var(--gold-border)" }}>
              <span className="text-xs flex items-center gap-1 flex-1 min-w-0" style={{ color: "var(--text-muted)" }}>
                {displayedSource && <><span>📚</span><span className="truncate">{displayedSource}</span></>}
              </span>
              <div className="flex items-center gap-0.5">
                {favoriteItem && (
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleFavorite(favoriteItem)}
                    className="p-2 rounded-xl"
                    style={{ background: fav ? "var(--gold-muted)" : "transparent" }}
                    title={isArabic ? "حفظ" : "Save"}
                  >
                    <Bookmark className="w-4 h-4" fill={fav ? "var(--gold)" : "none"} style={{ color: fav ? "var(--gold)" : "var(--text-muted)" }} />
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleCopy}
                  className="p-2 rounded-xl"
                  style={{ background: copied ? "var(--teal-muted)" : "transparent" }}
                  title={isArabic ? "نسخ" : "Copy"}
                >
                  {copied
                    ? <Check className="w-4 h-4" style={{ color: "var(--text-teal)" }} />
                    : <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
                </motion.button>
                <motion.button whileTap={{ scale: 0.8 }} onClick={handleShare} className="p-2 rounded-xl" title={isArabic ? "مشاركة" : "Share"}>
                  <Share2 className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !arabicItem && (
          <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
            <p>{isArabic ? "لا يوجد محتوى" : "Not found"}</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
