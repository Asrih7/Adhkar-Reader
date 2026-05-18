import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

const cards = [
  {
    href: "/adhkar",
    icon: "🤲",
    titleKey: "adhkar",
    subtitleKey: "adhkarSubtitle",
    gradient: "from-yellow-900/60 to-teal-900/30",
    accent: "#d4af37",
  },
  {
    href: "/sonan",
    icon: "☀️",
    titleKey: "sonan",
    subtitleKey: "sonanSubtitle",
    gradient: "from-yellow-900/60 to-teal-900/30",
    accent: "#d4af37",
  },
  {
    href: "/advices",
    icon: "📖",
    titleKey: "advice",
    subtitleKey: "adviceSubtitle",
    gradient: "from-yellow-900/60 to-teal-900/30",
    accent: "#d4af37",
  },
  {
    href: "/wife",
    icon: "💚",
    titleKey: "wife",
    subtitleKey: "wifeSubtitle",
    gradient: "from-yellow-900/60 to-teal-900/30",
    accent: "#d4af37",
  },
  {
    href: "/forgettable",
    icon: "⭐",
    titleKey: "forgettableSonan",
    subtitleKey: "forgettableSonanSubtitle",
    gradient: "from-yellow-900/60 to-teal-900/30",
    accent: "#d4af37",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Home() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(160deg, hsl(201,30%,8%) 0%, hsl(201,35%,12%) 60%, hsl(201,30%,10%) 100%)",
      }}
    >
      {/* Hero */}
      <div className="relative pt-14 pb-10 px-6 text-center overflow-hidden">
        {/* Decorative circles */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #d4af37 0%, transparent 70%)" }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="relative"
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.9), rgba(20,184,166,0.95))",
              border: "2px solid rgba(212,175,55,0.4)",
              boxShadow: "0 0 40px rgba(212,175,55,0.15)",
            }}
          >
            <span className="text-4xl">🕌</span>
          </div>
          <h1
            className="text-3xl font-black mb-2 amiri"
            style={{
              background: "linear-gradient(135deg, #d4af37, #14b8a6, #fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("homeTitle")}
          </h1>
          <p className="text-yellow-200/70 dark:text-yellow-100/70 text-sm font-medium">
            {t("homeDescription")}
          </p>
        </motion.div>

        {/* Bismillah */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-5 inline-block"
        >
          <div
            className="px-5 py-2 rounded-full text-sm amiri text-yellow-200/80 bg-yellow-500/5"
            style={{ border: "1px solid rgba(212,175,55,0.2)" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </div>
        </motion.div>
      </div>

      {/* Cards */}
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
              variants={item}
              onClick={() => navigate(card.href)}
              className="w-full text-right"
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-4 card-hover"
                style={{
                  background: `linear-gradient(135deg, rgba(10,54,67,0.9) 0%, rgba(13,75,94,0.4) 100%)`,
                  border: "1px solid rgba(20,184,166,0.15)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {/* Glow */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
                  style={{ background: card.accent }}
                />

                {/* Icon */}
                <div
                  className="flex-shrink-0 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    background: `linear-gradient(135deg, rgba(212,175,55,0.2), rgba(0,0,0,0.1))`,
                    border: `1px solid rgba(212,175,55,0.35)`,
                    width: "52px",
                    height: "52px",
                  }}
                >
                  {card.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-yellow-100 mb-0.5">
                    {t(card.titleKey)}
                  </h2>
                  <p className="text-xs text-yellow-200/70 leading-relaxed">
                    {t(card.subtitleKey)}
                  </p>
                </div>

                {/* Arrow */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-yellow-300/60"
                  style={{ background: "rgba(212,175,55,0.08)" }}
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
          className="text-center text-yellow-200/35 dark:text-yellow-100/35 text-xs mt-8"
        >
          اللهم صلِّ وسلم على نبينا محمد
        </motion.p>
      </div>
    </div>
  );
}
