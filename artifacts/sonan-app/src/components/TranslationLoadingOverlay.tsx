import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-screen overlay shown while pre-translating the whole app on language switch.
 * Listens to custom DOM events fired by useTranslation.
 */
export default function TranslationLoadingOverlay() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lang, setLang] = useState("");

  useEffect(() => {
    const onStart = (e: Event) => {
      const detail = (e as CustomEvent).detail as { lang: string };
      setLang(detail?.lang ?? "");
      setProgress(0);
      setVisible(true);
    };
    const onProgress = (e: Event) => {
      const detail = (e as CustomEvent).detail as { pct: number };
      setProgress(detail?.pct ?? 0);
    };
    const onEnd = () => {
      setProgress(100);
      /* Small delay so the user sees 100% before hiding */
      setTimeout(() => setVisible(false), 400);
    };

    window.addEventListener("translationstart", onStart);
    window.addEventListener("translationprogress", onProgress);
    window.addEventListener("translationend", onEnd);
    return () => {
      window.removeEventListener("translationstart", onStart);
      window.removeEventListener("translationprogress", onProgress);
      window.removeEventListener("translationend", onEnd);
    };
  }, []);

  const LANG_LABELS: Record<string, string> = {
    en: "English", fr: "Français", es: "Español", tr: "Türkçe", id: "Bahasa Indonesia",
  };
  const langLabel = LANG_LABELS[lang] ?? lang;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="trans-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "hsl(var(--background))" }}
        >
          {/* Logo / icon */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="text-5xl mb-6 select-none"
          >
            🌙
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg font-bold mb-1 text-center"
            style={{ color: "var(--text-gold)" }}
          >
            {langLabel ? `Translating to ${langLabel}` : "Translating…"}
          </motion.h2>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm mb-8 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Preparing all content — just a moment
          </motion.p>

          {/* Progress bar */}
          <div
            className="w-64 h-2 rounded-full overflow-hidden mb-3"
            style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--gold), var(--teal))" }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Percentage */}
          <motion.span
            key={progress}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold tabular-nums"
            style={{ color: "var(--text-teal)" }}
          >
            {progress}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
