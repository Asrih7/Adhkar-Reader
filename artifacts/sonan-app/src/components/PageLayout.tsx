import { ReactNode } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
}

export default function PageLayout({
  children,
  title,
  subtitle,
  backHref,
}: PageLayoutProps) {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))", color: "var(--text-primary)" }}>
      {/* ── Sticky Header ── */}
      {title && (
        <header
          className="sticky top-0 z-50 glass"
          style={{ borderBottom: "1px solid var(--gold-border)" }}
        >
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            {backHref && (
              <button
                onClick={() => navigate(backHref)}
                className="p-2 rounded-xl transition-colors flex-shrink-0"
                style={{ color: "var(--text-gold)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--gold-muted)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                aria-label={t("back") || "Back"}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold gold-text truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {subtitle}
                </p>
              )}
            </div>
            {backHref && <div className="w-9" />}
          </div>
        </header>
      )}

      {/* ── Content ── */}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="max-w-2xl mx-auto px-4 pb-28"
      >
        {children}
      </motion.main>
    </div>
  );
}
