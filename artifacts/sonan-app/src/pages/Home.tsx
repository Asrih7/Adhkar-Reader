import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

const cards = [
  { href: "/adhkar",    icon: "🤲", titleKey: "adhkar",          subtitleKey: "adhkarSubtitle" },
  { href: "/sonan",     icon: "☀️", titleKey: "sonan",           subtitleKey: "sonanSubtitle" },
  { href: "/advices",   icon: "📖", titleKey: "advice",          subtitleKey: "adviceSubtitle" },
  { href: "/wife",      icon: "💚", titleKey: "wife",            subtitleKey: "wifeSubtitle" },
  { href: "/forgettable",icon: "⭐", titleKey: "forgettableSonan",subtitleKey: "forgettableSonanSubtitle" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const cardAnim  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Home() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>

      {/* ── Hero ── */}
      <div className="relative pt-16 pb-10 px-6 text-center overflow-hidden">
        {/* Decorative glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: "backOut" }}
          className="relative"
        >
          {/* App icon */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 shadow-2xl mx-auto"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.9), rgba(20,184,166,0.95))",
              border: "2px solid var(--gold-border)",
              boxShadow: "0 0 40px var(--gold-shadow)",
            }}
          >
            <span className="text-4xl">🕌</span>
          </div>

          <h1
            className="text-3xl font-black mb-2 amiri"
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

        {/* Bismillah pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-5 inline-block"
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

      {/* ── Feature Cards ── */}
      <div className="flex-1 px-4 pb-10 max-w-lg mx-auto w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {cards.map((card) => (
            <motion.button
              key={card.href}
              variants={cardAnim}
              onClick={() => navigate(card.href)}
              className="w-full text-right"
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-4"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid var(--gold-border)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Top-right glow */}
                <div
                  className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl opacity-15 pointer-events-none"
                  style={{ background: "var(--gold)" }}
                />

                {/* Icon */}
                <div
                  className="flex-shrink-0 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    background: "var(--gold-muted)",
                    border: "1px solid var(--gold-border)",
                    width: "52px",
                    height: "52px",
                  }}
                >
                  {card.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h2
                    className="text-base font-bold mb-0.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t(card.titleKey)}
                  </h2>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {t(card.subtitleKey)}
                  </p>
                </div>

                {/* Arrow */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--gold-muted)", color: "var(--text-gold)" }}
                >
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs mt-8"
          style={{ color: "var(--text-muted)" }}
        >
          اللهم صلِّ وسلم على نبينا محمد ﷺ
        </motion.p>
      </div>
    </div>
  );
}
