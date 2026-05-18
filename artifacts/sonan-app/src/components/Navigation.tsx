import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Zap, Sun, BookOpen, Heart, Wind, Clock, Compass,
  Book, Headphones, Bell, Star, Share2, Settings, Menu, X,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/",             labelKey: "home",         icon: <Home      className="w-5 h-5" /> },
  { href: "/adhkar",       labelKey: "adhkar",       icon: <Zap       className="w-5 h-5" /> },
  { href: "/sonan",        labelKey: "sonan",        icon: <Sun       className="w-5 h-5" /> },
  { href: "/advices",      labelKey: "advice",       icon: <BookOpen  className="w-5 h-5" /> },
  { href: "/wife",         labelKey: "wife",         icon: <Heart     className="w-5 h-5" /> },
  { href: "/tasbeeh",      labelKey: "tasbeeh",      icon: <Wind      className="w-5 h-5" /> },
  { href: "/prayer-times", labelKey: "prayerTimes",  icon: <Clock     className="w-5 h-5" /> },
  { href: "/qibla",        labelKey: "qibla",        icon: <Compass   className="w-5 h-5" /> },
  { href: "/quran",        labelKey: "quran",        icon: <Book      className="w-5 h-5" /> },
  { href: "/quran-audio",  labelKey: "quranAudio",   icon: <Headphones className="w-5 h-5" /> },
  { href: "/notifications",labelKey: "notifications",icon: <Bell      className="w-5 h-5" /> },
  { href: "/favorites",    labelKey: "favorites",    icon: <Star      className="w-5 h-5" /> },
  { href: "/share",        labelKey: "share",        icon: <Share2    className="w-5 h-5" /> },
  { href: "/settings",     labelKey: "settings",     icon: <Settings  className="w-5 h-5" /> },
];

/* ── Shared nav item renderer ── */
function NavLink({
  item,
  isActive,
  onClick,
  delay = 0,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
  delay?: number;
}) {
  return (
    <motion.a
      key={item.href}
      href={item.href}
      onClick={onClick}
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all"
      style={{
        background: isActive ? "var(--gold-muted)" : "transparent",
        border: isActive ? "1px solid var(--gold-border)" : "1px solid transparent",
        color: isActive ? "var(--text-gold)" : "var(--text-secondary)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "var(--teal-muted)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-teal)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
        }
      }}
    >
      <span style={{ color: isActive ? "var(--text-gold)" : "inherit" }}>
        {item.icon}
      </span>
      <span className="flex-1 text-sm font-medium">{}</span>
      {isActive && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--gold)" }}
        />
      )}
    </motion.a>
  );
}

/* ── Sidebar (mobile overlay) ── */
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const { t, language } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.nav
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-72 z-50 glass overflow-y-auto"
            style={{ borderRight: "1px solid var(--gold-border)" }}
          >
            {/* Header */}
            <div
              className="sticky top-0 flex items-center justify-between p-4"
              style={{
                borderBottom: "1px solid var(--gold-border)",
                background: "hsl(var(--card)/80%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h2 className="text-lg font-bold gold-text">
                {language === "ar" ? "تطبيق الأذكار" : "Adhkar App"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl transition-colors"
                style={{ color: "var(--text-gold)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "var(--gold-muted)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="p-3 space-y-0.5">
              {navItems.map((item, i) => {
                const isActive = location === item.href;
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all"
                    style={{
                      background: isActive ? "var(--gold-muted)" : "transparent",
                      border: `1px solid ${isActive ? "var(--gold-border)" : "transparent"}`,
                      color: isActive ? "var(--text-gold)" : "var(--text-secondary)",
                    }}
                  >
                    <span>{item.icon}</span>
                    <span className="flex-1 text-sm font-medium">{t(item.labelKey)}</span>
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--gold)" }}
                      />
                    )}
                  </motion.a>
                );
              })}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Bottom Nav (mobile) ── */
function BottomNav() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const mainItems = navItems.slice(0, 5);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 glass safe-bottom"
      style={{ borderTop: "1px solid var(--gold-border)" }}
    >
      <div className="flex justify-around items-center max-w-screen-lg mx-auto">
        {mainItems.map((item) => {
          const isActive = location === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
              style={{
                color: isActive ? "var(--text-gold)" : "var(--text-muted)",
                minHeight: "56px",
              }}
            >
              <span style={{ color: isActive ? "var(--text-gold)" : "var(--text-muted)" }}>
                {item.icon}
              </span>
              <span
                className="text-xs font-medium"
                style={{
                  fontSize: "10px",
                  color: isActive ? "var(--text-gold)" : "var(--text-muted)",
                }}
              >
                {t(item.labelKey)}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

/* ── Desktop Sidebar (always visible) ── */
function DesktopSidebar() {
  const [location] = useLocation();
  const { t, language } = useTranslation();

  return (
    <aside
      className="fixed inset-y-0 left-0 w-64 glass overflow-y-auto"
      style={{ borderRight: "1px solid var(--gold-border)" }}
    >
      <div
        className="sticky top-0 p-4 text-center"
        style={{
          borderBottom: "1px solid var(--gold-border)",
          background: "hsl(var(--card)/80%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h2 className="text-lg font-bold gold-text">
          {language === "ar" ? "تطبيق الأذكار" : "Adhkar App"}
        </h2>
      </div>
      <div className="p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all"
              style={{
                background: isActive ? "var(--gold-muted)" : "transparent",
                border: `1px solid ${isActive ? "var(--gold-border)" : "transparent"}`,
                color: isActive ? "var(--text-gold)" : "var(--text-secondary)",
              }}
            >
              <span>{item.icon}</span>
              <span className="flex-1 text-sm font-medium">{t(item.labelKey)}</span>
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--gold)" }}
                />
              )}
            </a>
          );
        })}
      </div>
    </aside>
  );
}

/* ── Main export ── */
export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          {/* Hamburger */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed top-3.5 left-4 z-30 p-2 rounded-xl"
            style={{
              background: "var(--gold-muted)",
              border: "1px solid var(--gold-border)",
              color: "var(--text-gold)",
            }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <BottomNav />
        </>
      ) : (
        <DesktopSidebar />
      )}
    </>
  );
}
