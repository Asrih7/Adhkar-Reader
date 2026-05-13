import { ReactNode } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
}

export default function PageLayout({ children, title, subtitle, backHref }: PageLayoutProps) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, hsl(150,35%,5%) 0%, hsl(150,28%,7%) 50%, hsl(150,32%,6%) 100%)" }}>
      {/* Header */}
      {title && (
        <header className="sticky top-0 z-50 glass border-b border-amber-400/10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            {backHref && (
              <button
                onClick={() => navigate(backHref)}
                className="p-2 rounded-xl hover:bg-amber-400/10 transition-colors text-amber-400 flex-shrink-0"
                aria-label="رجوع"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold gold-text truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs text-amber-200/50 mt-0.5">{subtitle}</p>
              )}
            </div>
            {backHref && <div className="w-9" />}
          </div>
        </header>
      )}

      {/* Content */}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl mx-auto px-4 pb-8"
      >
        {children}
      </motion.main>
    </div>
  );
}
