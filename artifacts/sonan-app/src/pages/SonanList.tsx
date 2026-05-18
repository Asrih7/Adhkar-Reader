import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";

interface SonanCategory {
  sonaId: string;
  text: string;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const rowAnim   = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function SonanList() {
  const [, navigate] = useLocation();
  const [categories, setCategories] = useState<SonanCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();
  const isRtl = language === "ar";

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/sonan-data.json`)
      .then((r) => r.json())
      .then((data: SonanCategory[]) => { setCategories(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      title={t("sonan")}
      subtitle={isRtl ? "مئة سنة نبوية في يومك" : "100 Prophetic Traditions"}
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
              {isRtl ? `${categories.length} سنة` : `${categories.length} Sonan`}
            </span>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse"
                style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
            ))}
          </div>
        )}

        {/* Category list */}
        {!loading && (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
            {categories.map((cat, idx) => (
              <motion.div key={cat.sonaId} variants={rowAnim}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/sonan/${cat.sonaId}`)}
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
                      {idx + 1}
                    </span>

                    {/* Title */}
                    <p
                      className="flex-1 text-right font-semibold text-sm leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {cat.text}
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
            ))}
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
