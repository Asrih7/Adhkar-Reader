import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";

interface AdhkarCategory {
  adkharId: string;
  text: string;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const rowAnim   = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function AdhkarList() {
  const [, navigate] = useLocation();
  const [categories, setCategories] = useState<AdhkarCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();
  const isRtl = language === "ar";

  useEffect(() => {
    setLoading(true);
    const file = language === "ar"
      ? "adhkar-data.json"
      : `adhkar-data.${language}.json`;

    fetch(`${import.meta.env.BASE_URL}data/${file}`)
      .then(r => r.ok ? r.json() : fetch(`${import.meta.env.BASE_URL}data/adhkar-data.json`).then(r2 => r2.json()))
      .then((data: AdhkarCategory[]) => { setCategories(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [language]);

  return (
    <PageLayout
      title={t("adhkar")}
      subtitle={isRtl ? "أذكار وأدعية مأثورة" : "Daily Remembrance & Supplications"}
      backHref="/"
    >
      <div className="pt-4 pb-10">
        <AnimatePresence>
          {loading && (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl animate-pulse"
                    style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
            {categories.map((cat, idx) => (
              <motion.div key={cat.adkharId} variants={rowAnim}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/adhkar/${cat.adkharId}`)}
                  className="w-full"
                >
                  <div
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl"
                    style={{
                      background: "hsl(var(--card))",
                      border: "1px solid var(--gold-border)",
                      direction: isRtl ? "rtl" : "ltr",
                    }}
                  >
                    <span
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)", color: "var(--text-gold)" }}
                    >
                      {idx + 1}
                    </span>
                    <p
                      className={`flex-1 font-semibold text-sm leading-snug ${isRtl ? "text-right" : "text-left"}`}
                      style={{ color: "var(--text-primary)" }}
                    >
                      {cat.text}
                    </p>
                    <span style={{ color: "var(--text-gold)", transform: isRtl ? "none" : "scaleX(-1)" }}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
