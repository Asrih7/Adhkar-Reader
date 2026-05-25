import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, Menu } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useMenu } from "@/contexts/MenuContext";

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
  const { setSidebarOpen } = useMenu();
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="app-page-shell" style={{ background: "hsl(var(--background))", color: "var(--text-primary)" }}>
      {/* ── Sticky Header ── */}
      {title && (
        <header
          className="app-page-header"
          style={{ borderBottom: "1px solid var(--gold-border)" }}
        >
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* Menu button on mobile */}
            {isMobile && (
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setSidebarOpen(true)}
                className="p-2 tap-icon-action rounded-xl flex-shrink-0"
                style={{
                  background: "var(--gold-muted)",
                  border: "1px solid var(--gold-border)",
                  color: "var(--text-gold)",
                }}
                aria-label={t("menu") || "Menu"}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            )}

            {/* Back button (if not mobile or if backHref provided) */}
            {backHref && !isMobile && (
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

            {/* Title */}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold gold-text truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Spacer for desktop layout balance */}
            {backHref && !isMobile && <div className="w-9" />}
            {isMobile && <div className="w-9" />}
          </div>
        </header>
      )}

      {/* ── Content ── */}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="app-page-main max-w-2xl mx-auto px-4 pb-28"
      >
        {children}
      </motion.main>
    </div>
  );
}
