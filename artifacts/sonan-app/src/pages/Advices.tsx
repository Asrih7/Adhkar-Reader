import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useContentTranslation } from "@/hooks/useContentTranslation";
import { contentData } from "@/lib/contentData";
import type { Language } from "@/lib/translations";

type TabKey = "advices" | "marriageAdvice";

const TABS: { key: TabKey; labelAr: string; labelEn: string; icon: string }[] = [
  { key: "advices",        labelAr: "نصائح الحياة",  labelEn: "Life Advice",     icon: "💡" },
  { key: "marriageAdvice", labelAr: "نصائح الزواج", labelEn: "Marriage Advice",  icon: "💍" },
];

function TranslationProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: "rgba(0,0,0,0.15)" }}>
      <motion.div
        className="h-full"
        style={{ background: "linear-gradient(90deg, var(--gold), var(--teal))" }}
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

export default function Advices() {
  const [activeTab, setActiveTab] = useState<TabKey>("advices");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { language, t } = useTranslation();

  const items = useMemo(() => contentData[activeTab] ?? [], [activeTab]);
  const { translatedItems, isTranslating, translationProgress } =
    useContentTranslation(items, language as Language);

  const isArabic = language === "ar";

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <PageLayout
      title={t("advice")}
      subtitle={isArabic ? "ستون نصيحة نبوية للحياة اليومية" : "Prophetic Wisdom for Daily Life"}
      backHref="/"
    >
      {isTranslating && <TranslationProgressBar progress={translationProgress} />}

      <div className="pt-4 pb-10">
        {/* ── Tabs ──────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-5">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setExpanded(null); }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: active
                    ? "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(212,175,55,0.08))"
                    : "rgba(13,35,24,0.6)",
                  border: `${active ? 1.5 : 1}px solid ${active ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.12)"}`,
                  color: active ? "#d4af37" : "rgba(212,175,55,0.5)",
                }}
              >
                <span>{tab.icon}</span>
                <span>{isArabic ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* ── Translation status ──────────────────────────────── */}
        <AnimatePresence>
          {isTranslating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm"
              style={{
                background: "rgba(64,145,108,0.1)",
                border: "1px solid rgba(64,145,108,0.25)",
                color: "var(--teal)",
              }}
            >
              <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
              <span>
                {isArabic ? "جاري الترجمة..." : "Translating content…"}
                {" "}
                <span className="font-bold">{translationProgress}%</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Advice cards ─────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {isTranslating
              ? [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-2xl animate-pulse"
                    style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.08)" }}
                  />
                ))
              : translatedItems.map((item, index) => {
                  const isOpen = expanded === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.3) }}
                    >
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                          background: isOpen ? "rgba(20,55,35,0.9)" : "rgba(13,35,24,0.78)",
                          border: `1px solid ${isOpen ? "rgba(212,175,55,0.28)" : "rgba(212,175,55,0.1)"}`,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {/* Header button */}
                        <button
                          onClick={() => toggle(item.id)}
                          className="w-full flex items-center gap-3 p-4"
                          style={{ textAlign: isArabic ? "right" : "left" }}
                        >
                          <div
                            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
                            style={{
                              background: isOpen
                                ? "linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))"
                                : "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.03))",
                              border: "1px solid rgba(212,175,55,0.22)",
                              color: "#d4af37",
                            }}
                          >
                            {index + 1}
                          </div>

                          {/* Arabic preview text (first ~60 chars) */}
                          <p
                            className="flex-1 text-sm font-semibold text-amber-100/90 text-right leading-snug"
                            style={{ direction: "rtl" }}
                          >
                            {item.arabic.length > 70
                              ? item.arabic.slice(0, 70) + "…"
                              : item.arabic}
                          </p>

                          <motion.div
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0"
                          >
                            <svg
                              className="w-4 h-4 rotate-180"
                              style={{ color: "rgba(212,175,55,0.45)" }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                        </button>

                        {/* Expanded content */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              style={{ overflow: "hidden" }}
                            >
                              <div
                                className="px-4 pb-5 space-y-3"
                                style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
                              >
                                {/* Full Arabic text */}
                                <div
                                  className="pt-4 p-4 rounded-xl"
                                  style={{
                                    background: "rgba(212,175,55,0.06)",
                                    border: "1px solid rgba(212,175,55,0.14)",
                                  }}
                                >
                                  <p
                                    className="amiri text-amber-50/95 leading-loose text-right"
                                    style={{ fontSize: "1.05rem", lineHeight: "2.1", direction: "rtl" }}
                                  >
                                    {item.arabic}
                                  </p>
                                </div>

                                {/* Transliteration */}
                                {item.transliteration && (
                                  <p
                                    className="text-xs italic px-1"
                                    style={{
                                      color: "rgba(212,175,55,0.45)",
                                      direction: "ltr",
                                    }}
                                  >
                                    {item.transliteration}
                                  </p>
                                )}

                                {/* Translation */}
                                {!isArabic && item.translatedText && item.translatedText !== item.arabic && (
                                  <div
                                    className="px-3 py-2.5 rounded-xl"
                                    style={{
                                      background: "rgba(64,145,108,0.08)",
                                      border: "1px solid rgba(64,145,108,0.18)",
                                      direction: "ltr",
                                    }}
                                  >
                                    <p
                                      className="text-sm leading-relaxed"
                                      style={{ color: "rgba(180,230,200,0.85)", lineHeight: "1.75" }}
                                    >
                                      {item.translatedText}
                                    </p>
                                  </div>
                                )}

                                {/* Source */}
                                {item.source && (
                                  <p className="text-xs flex items-center gap-1.5" style={{ color: "rgba(212,175,55,0.55)" }}>
                                    <span>📚</span>
                                    <span>{item.source}</span>
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
