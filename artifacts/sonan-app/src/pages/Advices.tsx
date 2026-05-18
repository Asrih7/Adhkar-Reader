import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Copy, Share2, Check } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import { useFavorites } from "@/hooks/useFavorites";
import { contentData } from "@/lib/contentData";
import type { Language } from "@/lib/translations";

type TabKey = "advices" | "marriageAdvice";

const TABS: { key: TabKey; labelAr: string; labelEn: string; icon: string }[] = [
  { key: "advices",        labelAr: "نصائح الحياة",  labelEn: "Life Advice",     icon: "💡" },
  { key: "marriageAdvice", labelAr: "نصائح الزواج",  labelEn: "Marriage Advice", icon: "💍" },
];

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: "rgba(0,0,0,0.1)" }}>
      <motion.div className="h-full" style={{ background: "linear-gradient(90deg, var(--gold), var(--teal))" }}
        initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
    </div>
  );
}

/* ── Inline actions ── */
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
    if (navigator.share) { try { await navigator.share({ title: "نصائح نبوية", text: shareText }); } catch { /**/ } }
    else handleCopy();
  };

  return (
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
  );
}

export default function Advices() {
  const [activeTab, setActiveTab] = useState<TabKey>("advices");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { language, t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const items = useMemo(() => contentData[activeTab] ?? [], [activeTab]);
  const { translatedItems, isTranslating, translationProgress } =
    useContentTranslation(items, language as Language);

  const isArabic = language === "ar";
  const toggle = (id: string) => setExpanded((p) => (p === id ? null : id));

  return (
    <PageLayout
      title={t("advice")}
      subtitle={isArabic ? "ستون نصيحة نبوية للحياة اليومية" : "Prophetic Wisdom for Daily Life"}
      backHref="/"
    >
      {isTranslating && <ProgressBar progress={translationProgress} />}

      <div className="pt-4 pb-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setExpanded(null); }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: active ? "var(--gold-muted-strong)" : "hsl(var(--card))",
                  border: `${active ? 1.5 : 1}px solid ${active ? "var(--gold)" : "var(--gold-border)"}`,
                  color: active ? "var(--text-gold)" : "var(--text-muted)",
                }}>
                <span>{tab.icon}</span>
                <span>{isArabic ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Translating */}
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

        {/* Accordion cards */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {isTranslating
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
                ))
              : translatedItems.map((item, index) => {
                  const isOpen = expanded === item.id;
                  const fav = isFavorite(item.id);
                  return (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.03, 0.3) }}>
                      <div className="rounded-2xl overflow-hidden"
                        style={{
                          background: isOpen ? "var(--bg-tertiary)" : "hsl(var(--card))",
                          border: `1px solid ${isOpen ? "var(--gold-border-strong)" : "var(--gold-border)"}`,
                          transition: "all 0.2s ease",
                        }}>
                        {/* Header: expand + actions */}
                        <div className="flex items-center gap-2 pr-1">
                          <button onClick={() => toggle(item.id)} className="flex-1 flex items-center gap-3 p-4 pr-2 min-w-0">
                            <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
                              style={{ background: isOpen ? "var(--gold-muted-strong)" : "var(--gold-muted)", border: "1px solid var(--gold-border)", color: "var(--text-gold)" }}>
                              {index + 1}
                            </div>
                            <p className="flex-1 text-sm font-semibold text-right leading-snug line-clamp-2"
                              style={{ direction: "rtl", color: "var(--text-primary)" }}>
                              {item.arabic.length > 70 ? item.arabic.slice(0, 70) + "…" : item.arabic}
                            </p>
                            <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                              <svg className="w-4 h-4 rotate-180" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.div>
                          </button>
                          <CardActions
                            arabic={item.arabic} translatedText={item.translatedText}
                            source={item.source} isFav={fav}
                            onToggleFavorite={() => toggleFavorite(item)} language={language}
                          />
                        </div>

                        {/* Expanded content */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                              <div className="px-4 pb-5 space-y-3" style={{ borderTop: "1px solid var(--gold-border)" }}>
                                {/* Full Arabic */}
                                <div className="pt-4 p-4 rounded-xl" style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }}>
                                  <p className="amiri text-right leading-loose" style={{ fontSize: "1.05rem", lineHeight: "2.1", direction: "rtl", color: "var(--text-primary)" }}>
                                    {item.arabic}
                                  </p>
                                </div>
                                {item.transliteration && (
                                  <p className="text-xs italic px-1" style={{ color: "var(--text-muted)", direction: "ltr" }}>
                                    {item.transliteration}
                                  </p>
                                )}
                                {!isArabic && item.translatedText && item.translatedText !== item.arabic && (
                                  <div className="px-3 py-2.5 rounded-xl" style={{ background: "var(--teal-muted)", border: "1px solid var(--teal-border)", direction: "ltr" }}>
                                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-teal)", lineHeight: "1.75" }}>
                                      {item.translatedText}
                                    </p>
                                  </div>
                                )}
                                {item.source && (
                                  <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                                    <span>📚</span><span>{item.source}</span>
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
