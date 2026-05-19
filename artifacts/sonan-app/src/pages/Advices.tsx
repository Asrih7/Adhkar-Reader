import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import type { ContentItem } from "@/lib/contentData";
import type { Language } from "@/lib/translations";

interface AdviceItem {
  id: number;
  title: string;
  content: Record<string, string | undefined>;
}

interface AdvicesData {
  title: string;
  subtitle: string;
  advices: AdviceItem[];
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const rowAnim   = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function Advices() {
  const [, navigate] = useLocation();
  const [advices, setAdvices] = useState<AdviceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();
  const isRtl = language === "ar";
  
  // Create ContentItem[] for translation with useMemo
  const contentItems = useMemo<ContentItem[]>(() =>
    advices.map((advice) => ({
      id: `advice_list_${advice.id}`,
      arabic: advice.title,
      category: "advices",
    })),
    [advices]
  );
  
  const { translatedItems } = useContentTranslation(contentItems, language as Language);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/advices-data.json`)
      .then((r) => r.json())
      .then((data: AdvicesData) => { setAdvices(data.advices ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      title={t("advice")}
      subtitle={isRtl ? "ستون نصيحة نبوية للحياة اليومية" : "60 Prophetic Life Advices"}
      backHref="/"
    >
      <div className="pt-4 pb-10">
        {/* Count badge */}
        {!loading && (
          <div className="mb-4 flex items-center justify-end">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "var(--gold-muted)", color: "var(--text-gold)", border: "1px solid var(--gold-border)" }}
            >
              {isRtl ? `${advices.length} نصيحة` : `${advices.length} Advices`}
            </span>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse"
                style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
            ))}
          </div>
        )}

        {/* Advice list */}
        {!loading && (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
            {advices.map((advice, idx) => {
              const translated = translatedItems[idx];
              const displayText = translated ? translated.translatedText : advice.title;
              return (
              <motion.div key={advice.id} variants={rowAnim}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/advices/${advice.id}`)}
                  className="w-full"
                >
                  <div
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl"
                    style={{
                      background: "hsl(var(--card))",
                      border: "1px solid var(--gold-border)",
                      direction: "rtl",
                    }}
                  >
                    {/* Number badge */}
                    <span
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        background: "var(--gold-muted)",
                        border: "1px solid var(--gold-border)",
                        color: "var(--text-gold)",
                      }}
                    >
                      {advice.id}
                    </span>

                    {/* Title */}
                    <p
                      className="flex-1 text-right font-semibold text-sm leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {displayText}
                    </p>

                    {/* Arrow */}
                    <span style={{ color: "var(--text-gold)" }}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                  </div>
                </motion.button>
              </motion.div>
            );
            })}
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
