import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { Clock, Compass, BookOpen, Wind, RefreshCw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { getTodayItems } from "@/lib/notificationService";
import type { ContentItem } from "@/lib/contentData";

/* ── Main content cards ── */
const mainCards = [
  { href: "/adhkar",     icon: "🤲", titleKey: "adhkar",          subtitleKey: "adhkarSubtitle",           gradient: "from-amber-500/10 to-yellow-500/5" },
  { href: "/sonan",      icon: "☀️", titleKey: "sonan",           subtitleKey: "sonanSubtitle",            gradient: "from-orange-500/10 to-amber-500/5" },
  { href: "/advices",    icon: "📖", titleKey: "advice",          subtitleKey: "adviceSubtitle",           gradient: "from-teal-500/10 to-emerald-500/5" },
  { href: "/wife",       icon: "💚", titleKey: "wife",            subtitleKey: "wifeSubtitle",             gradient: "from-green-500/10 to-teal-500/5" },
  { href: "/forgettable",icon: "⭐", titleKey: "forgettableSonan",subtitleKey: "forgettableSonanSubtitle", gradient: "from-purple-500/10 to-violet-500/5" },
];

/* ── Quick tool shortcuts ── */
const quickTools = [
  { href: "/prayer-times", icon: <Clock    className="w-5 h-5" />, labelKey: "prayerTimes",  emoji: "🕐" },
  { href: "/qibla",        icon: <Compass  className="w-5 h-5" />, labelKey: "qibla",        emoji: "🧭" },
  { href: "/quran",        icon: <BookOpen className="w-5 h-5" />, labelKey: "quran",        emoji: "📗" },
  { href: "/tasbeeh",      icon: <Wind     className="w-5 h-5" />, labelKey: "tasbeeh",      emoji: "📿" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const cardAnim  = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.38 } } };

/* ── Daily Dhikr widget ── */
function DailyDhikr({ language }: { language: string }) {
  const [item, setItem] = useState<ContentItem | null>(null);
  const [idx, setIdx] = useState(0);
  const [items, setItems] = useState<ContentItem[]>([]);
  const { t } = useTranslation();
  const isRtl = language === "ar";

  useEffect(() => {
    const loaded = getTodayItems();
    setItems(loaded);
    setItem(loaded[0] ?? null);
    setIdx(0);
  }, []);

  const next = () => {
    const nextIdx = (idx + 1) % items.length;
    setIdx(nextIdx);
    setItem(items[nextIdx]);
  };

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mx-4 mb-4 rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--gold-muted), var(--teal-muted))",
        border: "1px solid var(--gold-border)",
      }}
    >
      <div className="px-4 pt-4 pb-1 flex items-center justify-between">
        <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--text-gold)" }}>
          <span>🌟</span>
          <span>{t("todaysDhikr")}</span>
        </span>
        <button
          onClick={next}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "var(--text-muted)" }}
          title={t("next")}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="px-4 pt-2 pb-4">
        <p
          className="amiri text-right leading-loose"
          style={{ fontSize: "1.05rem", lineHeight: 2, color: "var(--text-primary)", direction: "rtl" }}
        >
          {item.arabic}
        </p>
        {item.source && (
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>📚 {item.source}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { t, language } = useTranslation();
  const isRtl = language === "ar";

  /* Live time for greeting */
  const hour = new Date().getHours();
  const greeting =
    hour < 5  ? (isRtl ? "طاب ليلك" : "Good night") :
    hour < 12 ? (isRtl ? "صباح الخير" : "Good morning") :
    hour < 17 ? (isRtl ? "ظهر مبارك" : "Good afternoon") :
    hour < 20 ? (isRtl ? "مساء الخير" : "Good evening") :
                (isRtl ? "ليلة مباركة" : "Blessed evening");

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-6" style={{ background: "var(--bg-primary)" }}>

      {/* ── Hero ── */}
      <div className="relative pt-14 pb-7 px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="relative"
        >
          <div
            className="inline-flex items-center justify-center w-18 h-18 rounded-3xl mb-4 shadow-2xl mx-auto"
            style={{
              width: 72, height: 72,
              background: "linear-gradient(135deg, rgba(212,175,55,0.9), rgba(20,184,166,0.95))",
              border: "2px solid var(--gold-border)",
              boxShadow: "0 0 40px var(--gold-shadow)",
            }}
          >
            <span className="text-3xl">🕌</span>
          </div>

          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            {greeting}
          </p>
          <h1
            className="text-3xl font-black mb-1 amiri"
            style={{
              background: "linear-gradient(135deg, var(--gold), var(--teal), var(--gold-light))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("homeTitle")}
          </h1>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {t("homeDescription")}
          </p>
        </motion.div>

        {/* Bismillah */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-4 inline-block"
        >
          <div
            className="px-5 py-2 rounded-full text-sm amiri"
            style={{
              border: "1px solid var(--gold-border)",
              background: "var(--gold-muted)",
              color: "var(--text-gold)",
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </div>
        </motion.div>
      </div>

      {/* ── Quick Tools ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-4 gap-2.5 mx-4 mb-5"
      >
        {quickTools.map((tool) => (
          <a key={tool.href} href={tool.href}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl cursor-pointer"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid var(--gold-border)",
              }}
            >
              <span className="text-xl">{tool.emoji}</span>
              <span className="text-xs font-semibold text-center leading-tight px-1" style={{ color: "var(--text-muted)" }}>
                {t(tool.labelKey)}
              </span>
            </motion.div>
          </a>
        ))}
      </motion.div>

      {/* ── Daily Dhikr ── */}
      <DailyDhikr language={language} />

      {/* ── Main cards ── */}
      <div className="flex-1 px-4 pb-4 max-w-lg mx-auto w-full">
        <p className="text-xs font-bold mb-3 px-1" style={{ color: "var(--text-muted)" }}>
          {isRtl ? "تصفح المحتوى" : "Browse Content"}
        </p>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2.5">
          {mainCards.map((card) => (
            <motion.div key={card.href} variants={cardAnim}>
              <a href={card.href}>
                <motion.div
                  whileHover={{ scale: 1.01, boxShadow: "0 8px 28px var(--gold-shadow)" }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
                  style={{
                    background: "hsl(var(--card))",
                    border: "1px solid var(--gold-border)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  }}
                >
                  {/* Corner glow */}
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                    style={{ background: "var(--gold)" }}
                  />

                  {/* Icon */}
                  <div
                    className="flex-shrink-0 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background: "var(--gold-muted)",
                      border: "1px solid var(--gold-border)",
                      width: 50, height: 50,
                    }}
                  >
                    {card.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>
                      {t(card.titleKey)}
                    </h2>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {t(card.subtitleKey)}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--gold-muted)", color: "var(--text-gold)" }}
                  >
                    <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              </a>
            
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs mt-6"
          style={{ color: "var(--text-muted)" }}
        >
          اللهم صلِّ وسلم على نبينا محمد ﷺ
        </motion.p>
      </div>
    </div>
  );
}
