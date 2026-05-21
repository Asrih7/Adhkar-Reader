import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";

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
  items: TextItem[];
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const rowAnim = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function ForgettableSonan() {
  const [, navigate] = useLocation();
  const { language, t } = useTranslation();
  const [data, setData] = useState<TextCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const isRtl = language === "ar";

  useEffect(() => {
    setLoading(true);
    const file = language === "ar" ? "forgettable-sonan-data.json" : `forgettable-sonan-data.${language}.json`;

    fetch(`${import.meta.env.BASE_URL}data/${file}`)
      .then((r) => r.ok ? r.json() : fetch(`${import.meta.env.BASE_URL}data/forgettable-sonan-data.json`).then((r2) => r2.json()))
      .then((json: TextCollection) => { setData(json); setLoading(false); })
      .catch(() => setLoading(false));
  }, [language]);

  return (
    <PageLayout title={t("forgettableSonan")} subtitle={data?.subtitle ?? t("forgettableSonanSubtitle")} backHref="/">
      <div className="pt-4 pb-10">
        {!loading && data && (
          <div className="mb-4 flex items-center justify-end">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "var(--gold-muted)", color: "var(--text-gold)", border: "1px solid var(--gold-border)" }}
            >
              {isRtl ? `${data.items.length} سنة` : `${data.items.length} Sunnahs`}
            </span>
          </div>
        )}

        <AnimatePresence>
          {loading && (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl animate-pulse"
                    style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && data && (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
            {data.items.map((item, idx) => (
              <motion.div key={item.id} variants={rowAnim}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate(`/forgettable/${item.id}`)} className="w-full">
                  <div
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl"
                    style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)", direction: isRtl ? "rtl" : "ltr" }}
                  >
                    <span
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)", color: "var(--text-gold)" }}
                    >
                      {idx + 1}
                    </span>
                    <div className={`flex-1 min-w-0 ${isRtl ? "text-right" : "text-left"}`}>
                      <p className="font-semibold text-sm leading-snug" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>{item.text}</p>
                    </div>
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
