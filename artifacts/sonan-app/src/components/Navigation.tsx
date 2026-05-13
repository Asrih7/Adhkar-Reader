import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Zap,
  Sun,
  BookOpen,
  Heart,
  Wind,
  Clock,
  Compass,
  Book,
  Headphones,
  Bell,
  Star,
  Share2,
  Settings,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  labelAr: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", labelAr: "الرئيسية", icon: <Home className="w-5 h-5" /> },
  { href: "/adhkar", label: "Adhkar", labelAr: "الأذكار", icon: <Zap className="w-5 h-5" /> },
  { href: "/sonan", label: "Sunnah", labelAr: "السنن اليومية", icon: <Sun className="w-5 h-5" /> },
  { href: "/advices", label: "Advices", labelAr: "النصائح النبوية", icon: <BookOpen className="w-5 h-5" /> },
  { href: "/wife", label: "With Wife", labelAr: "سنن مع الزوجة", icon: <Heart className="w-5 h-5" /> },
  { href: "/tasbeeh", label: "Tasbeeh", labelAr: "مسبحة إلكترونية", icon: <Wind className="w-5 h-5" /> },
  { href: "/prayer-times", label: "Prayer Times", labelAr: "مواقيت الصلاة", icon: <Clock className="w-5 h-5" /> },
  { href: "/qibla", label: "Qibla", labelAr: "القبلة", icon: <Compass className="w-5 h-5" /> },
  { href: "/quran", label: "Quran", labelAr: "القرآن الكريم", icon: <Book className="w-5 h-5" /> },
  { href: "/quran-audio", label: "Quran Audio", labelAr: "الاستماع للقرآن", icon: <Headphones className="w-5 h-5" /> },
  { href: "/notifications", label: "Notifications", labelAr: "الإشعارات", icon: <Bell className="w-5 h-5" /> },
  { href: "/favorites", label: "Favorites", labelAr: "المفضلة", icon: <Star className="w-5 h-5" /> },
  { href: "/share", label: "Share", labelAr: "المشاركة اليومية", icon: <Share2 className="w-5 h-5" /> },
  { href: "/settings", label: "Settings", labelAr: "الإعدادات", icon: <Settings className="w-5 h-5" /> },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.nav
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 w-72 z-50 glass border-r border-amber-400/10 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-amber-400/10">
              <h2 className="text-xl font-bold gold-text">تطبيق الأذكار</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-amber-400/10 transition-colors"
              >
                <X className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="p-3 space-y-1">
              {navItems.map((item, idx) => {
                const isActive = location === item.href;
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-amber-600/40 to-amber-500/20 border border-amber-400/50 text-amber-300"
                        : "text-amber-200/70 hover:bg-amber-400/10"
                    }`}
                  >
                    {item.icon}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.labelAr}</p>
                      <p className="text-xs text-amber-200/40">{item.label}</p>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
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

interface BottomNavProps {
  isMobile: boolean;
}

function BottomNav({ isMobile }: BottomNavProps) {
  const [location] = useLocation();

  if (!isMobile) return null;

  const mainItems = navItems.slice(0, 5); // Show first 5 items in bottom nav

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-amber-400/10 z-40">
      <div className="flex justify-around items-center max-w-screen-lg mx-auto">
        {mainItems.map((item) => {
          const isActive = location === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                isActive ? "text-amber-400" : "text-amber-200/50"
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.labelAr}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 transition-colors"
        >
          <Menu className="w-6 h-6 text-amber-400" />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Desktop Sidebar (always visible on desktop) */}
      {!isMobile && (
        <aside className="fixed inset-y-0 left-0 w-72 glass border-r border-amber-400/10 overflow-y-auto">
          <div className="sticky top-0 p-4 border-b border-amber-400/10">
            <h2 className="text-xl font-bold gold-text text-center">تطبيق الأذكار</h2>
          </div>

          <div className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = window.location.pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-600/40 to-amber-500/20 border border-amber-400/50 text-amber-300"
                      : "text-amber-200/70 hover:bg-amber-400/10"
                  }`}
                >
                  {item.icon}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.labelAr}</p>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                </a>
              );
            })}
          </div>
        </aside>
      )}

      {/* Bottom Navigation */}
      <BottomNav isMobile={isMobile} />
    </>
  );
}
