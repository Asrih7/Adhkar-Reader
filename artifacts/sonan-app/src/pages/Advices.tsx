import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";

interface AdviceContent {
  intro?: string;
  narrator?: string;
  hadith?: string;
  source?: string;
  explanation?: string;
}

interface Advice {
  id: number;
  title: string;
  content: AdviceContent;
}

interface AdvicesData {
  title: string;
  subtitle: string;
  advices: Advice[];
}

export default function Advices() {
  const [data, setData] = useState<AdvicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/advices-data.json`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggle = (id: number) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <PageLayout title="النصائح النبوية" subtitle="ستون نصيحة للحياة اليومية" backHref="/">
      <div className="pt-6 pb-10 space-y-2">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "rgba(26,71,42,0.3)" }} />
          ))
        ) : !data ? null : (
          data.advices.map((advice, index) => (
            <motion.div
              key={advice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: expanded === advice.id
                    ? "rgba(20,55,35,0.9)"
                    : "rgba(13,35,24,0.75)",
                  border: `1px solid ${expanded === advice.id ? "rgba(212,175,55,0.25)" : "rgba(212,175,55,0.1)"}`,
                  transition: "all 0.2s ease",
                }}
              >
                {/* Header */}
                <button
                  onClick={() => toggle(advice.id)}
                  className="w-full flex items-center gap-4 p-4 text-right"
                >
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{
                      background: expanded === advice.id
                        ? "linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))"
                        : "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.03))",
                      border: "1px solid rgba(212,175,55,0.2)",
                      color: "#d4af37",
                    }}
                  >
                    {index + 1}
                  </div>
                  <span className="flex-1 font-semibold text-amber-100/95 text-sm">
                    {advice.title}
                  </span>
                  <motion.div
                    animate={{ rotate: expanded === advice.id ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <svg className="w-4 h-4 text-amber-400/50 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </button>

                {/* Content */}
                <AnimatePresence>
                  {expanded === advice.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        className="px-4 pb-5 space-y-4"
                        style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
                      >
                        {advice.content.intro && (
                          <p
                            className="text-amber-300/80 text-sm font-medium pt-4 italic"
                            style={{ borderRight: "2px solid rgba(212,175,55,0.3)", paddingRight: "12px" }}
                          >
                            {advice.content.intro}
                          </p>
                        )}

                        {advice.content.narrator && (
                          <p className="text-amber-200/50 text-xs pt-3">
                            {advice.content.narrator}
                          </p>
                        )}

                        {advice.content.hadith && (
                          <div
                            className="p-4 rounded-xl"
                            style={{
                              background: "rgba(212,175,55,0.06)",
                              border: "1px solid rgba(212,175,55,0.15)",
                            }}
                          >
                            <p
                              className="amiri text-amber-50/95 leading-loose"
                              style={{ fontSize: "1.05rem", lineHeight: "2.1" }}
                            >
                              « {advice.content.hadith} »
                            </p>
                          </div>
                        )}

                        {advice.content.source && (
                          <p className="text-xs text-amber-400/60 flex items-center gap-1.5">
                            <span>📚</span>
                            <span>{advice.content.source}</span>
                          </p>
                        )}

                        {advice.content.explanation && (
                          <div className="pt-1">
                            <p className="text-xs font-bold text-amber-400/70 mb-2 flex items-center gap-1.5">
                              <span>💡</span> الشرح
                            </p>
                            <p className="text-amber-100/75 text-sm leading-relaxed" style={{ lineHeight: "1.9" }}>
                              {advice.content.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </PageLayout>
  );
}
