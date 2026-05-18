import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Globe,
  Volume2,
  Type,
  Download,
  Check,
  Star,
  MessageSquare,
  Info,
  ChevronLeft,
  Smartphone,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import type { Language } from "@/lib/translations";

/* ─────────────────────────────────────────
   Reusable styled components
───────────────────────────────────────── */

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3
      className="text-base font-bold mb-3 flex items-center gap-2"
      style={{ color: "var(--text-gold)" }}
    >
      <span style={{ color: "var(--text-teal)" }}>{icon}</span>
      {children}
    </h3>
  );
}

function OptionCard({
  active,
  onClick,
  children,
  disabled,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.015 }}
      whileTap={disabled ? {} : { scale: 0.985 }}
      onClick={onClick}
      disabled={disabled}
      className="w-full p-4 rounded-xl transition-all flex items-center gap-3"
      style={{
        background: active ? "var(--gold-muted)" : "hsl(var(--card))",
        border: `${active ? 2 : 1}px solid ${active ? "var(--gold)" : "var(--gold-border)"}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────────────────
   Star rating component
───────────────────────────────────────── */
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="p-1"
        >
          <Star
            className="w-7 h-7"
            fill={(hovered || value) >= star ? "var(--gold)" : "none"}
            style={{ color: (hovered || value) >= star ? "var(--gold)" : "var(--text-muted)" }}
          />
        </motion.button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Settings Page
───────────────────────────────────────── */
export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { t, language, switchLanguage } = useTranslation();
  const { toast } = useToast();

  const handleSwitchLanguage = (lang: Language) => {
    if (lang === language) return;
    switchLanguage(lang);
    if (lang !== "ar") {
      toast({
        title: "جاري الترجمة... Translating content",
        description: lang === "en"
          ? "Content is being translated in the background"
          : lang === "fr"
          ? "Le contenu est en cours de traduction"
          : lang === "es"
          ? "El contenido se está traduciendo"
          : lang === "tr"
          ? "İçerik çevriliyor"
          : "Konten sedang diterjemahkan",
        duration: 4000,
      });
    }
  };

  const [fontSize, setFontSize] = useState(() =>
    parseInt(localStorage.getItem("fontSize") || "16")
  );
  const [soundEnabled, setSoundEnabled] = useState(() =>
    localStorage.getItem("soundEnabled") !== "false"
  );
  const [offlineMode, setOfflineMode] = useState(() =>
    localStorage.getItem("offlineMode") === "true"
  );

  // Review state
  const [rating, setRating] = useState(() =>
    parseInt(localStorage.getItem("appRating") || "0")
  );
  const [reviewText, setReviewText] = useState(() =>
    localStorage.getItem("appReview") || ""
  );
  const [reviewSent, setReviewSent] = useState(() =>
    localStorage.getItem("reviewSent") === "true"
  );

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize.toString());
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("soundEnabled", soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem("offlineMode", offlineMode.toString());
  }, [offlineMode]);

  const handleSubmitReview = () => {
    if (!rating) return;
    localStorage.setItem("appRating", rating.toString());
    localStorage.setItem("appReview", reviewText);
    localStorage.setItem("reviewSent", "true");
    setReviewSent(true);
  };

  const languages: { code: Language; name: string; native: string; flag: string }[] = [
    { code: "ar", name: "Arabic",     native: "العربية",           flag: "🇸🇦" },
    { code: "en", name: "English",    native: "English",            flag: "🇬🇧" },
    { code: "fr", name: "French",     native: "Français",           flag: "🇫🇷" },
    { code: "es", name: "Spanish",    native: "Español",            flag: "🇪🇸" },
    { code: "tr", name: "Turkish",    native: "Türkçe",             flag: "🇹🇷" },
    { code: "id", name: "Indonesian", native: "Bahasa Indonesia",   flag: "🇮🇩" },
  ];

  const sectionDelay = [0, 0.07, 0.14, 0.21, 0.28, 0.35];

  return (
    <PageLayout title={t("settings")} subtitle={t("settings")}>
      <div className="pb-24 md:pb-10 mt-6 space-y-8">

        {/* ── 1. Appearance ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionDelay[0] }}
        >
          <SectionTitle icon={<Sun className="w-4 h-4" />}>
            المظهر · Appearance
          </SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {/* Dark */}
            <OptionCard active={theme === "dark"} onClick={() => setTheme("dark")}>
              <Moon className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-gold)" }} />
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {language === "ar" ? "داكن" : "Dark"}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {language === "ar" ? "خلفية ليلية" : "Night mode"}
                </p>
              </div>
              {theme === "dark" && (
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--gold)" }} />
              )}
            </OptionCard>

            {/* Light */}
            <OptionCard active={theme === "light"} onClick={() => setTheme("light")}>
              <Sun className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-gold)" }} />
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {language === "ar" ? "فاتح" : "Light"}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {language === "ar" ? "خلفية نهارية" : "Day mode"}
                </p>
              </div>
              {theme === "light" && (
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--gold)" }} />
              )}
            </OptionCard>
          </div>
        </motion.section>

        {/* ── 2. Language ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionDelay[1] }}
        >
          <SectionTitle icon={<Globe className="w-4 h-4" />}>
            اللغة · Language
          </SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {languages.map((lang) => {
              const active = language === lang.code;
              return (
                <motion.button
                  key={lang.code}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSwitchLanguage(lang.code)}
                  className="p-3.5 rounded-xl transition-all flex items-center gap-2.5"
                  style={{
                    background: active ? "var(--gold-muted)" : "hsl(var(--card))",
                    border: `${active ? 2 : 1}px solid ${active ? "var(--gold)" : "var(--gold-border)"}`,
                  }}
                >
                  <span className="text-lg leading-none">{lang.flag}</span>
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className="font-semibold text-sm leading-tight truncate"
                      style={{ color: active ? "var(--text-gold)" : "var(--text-primary)" }}
                    >
                      {lang.native}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {lang.name}
                    </p>
                  </div>
                  {active && (
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--gold)" }} />
                  )}
                </motion.button>
              );
            })}
          </div>
          {/* Direction note */}
          <p
            className="mt-2 text-xs text-center"
            style={{ color: "var(--text-muted)" }}
          >
            {language === "ar"
              ? "سيتم تطبيق التغيير فوراً"
              : "Direction & layout update immediately"}
          </p>
        </motion.section>

        {/* ── 3. Font Size ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionDelay[2] }}
        >
          <SectionTitle icon={<Type className="w-4 h-4" />}>
            {language === "ar" ? "حجم الخط" : "Font Size"}
          </SectionTitle>
          <div
            className="p-4 rounded-xl space-y-3"
            style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>أ</span>
              <input
                type="range"
                min="12"
                max="28"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="flex-1 h-2 rounded-lg"
              />
              <span
                className="text-sm font-bold w-10 text-center"
                style={{ color: "var(--text-gold)" }}
              >
                {fontSize}px
              </span>
            </div>
            <div
              className="text-center p-3 rounded-lg"
              style={{ background: "var(--gold-muted)", border: "1px solid var(--gold-border)" }}
            >
              <p
                style={{ fontSize: `${fontSize}px`, color: "var(--text-primary)" }}
                className="font-medium leading-relaxed"
              >
                نص تجريبي · Sample Text
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── 4. Audio ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionDelay[3] }}
        >
          <SectionTitle icon={<Volume2 className="w-4 h-4" />}>
            {language === "ar" ? "الصوت" : "Audio"}
          </SectionTitle>
          <OptionCard active={soundEnabled} onClick={() => setSoundEnabled(!soundEnabled)}>
            <Volume2 className="w-5 h-5" style={{ color: "var(--text-teal)" }} />
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                {language === "ar" ? "أصوات التطبيق" : "App Sounds"}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {soundEnabled
                  ? language === "ar" ? "مفعّل" : "Enabled"
                  : language === "ar" ? "معطّل" : "Disabled"}
              </p>
            </div>
            {/* Toggle pill */}
            <div
              className="w-11 h-6 rounded-full flex items-center px-1 transition-all"
              style={{
                background: soundEnabled ? "var(--teal)" : "hsl(var(--muted))",
              }}
            >
              <motion.div
                animate={{ x: soundEnabled ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-4 h-4 rounded-full bg-white shadow"
              />
            </div>
          </OptionCard>
        </motion.section>

        {/* ── 5. Offline Mode ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionDelay[4] }}
        >
          <SectionTitle icon={<Download className="w-4 h-4" />}>
            {language === "ar" ? "وضع بدون إنترنت" : "Offline Mode"}
          </SectionTitle>
          <div className="space-y-2.5">
            <OptionCard active={offlineMode} onClick={() => setOfflineMode(!offlineMode)}>
              <Smartphone className="w-5 h-5" style={{ color: "var(--text-teal)" }} />
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {language === "ar" ? "وضع بدون إنترنت" : "Offline Mode"}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {offlineMode
                    ? language === "ar" ? "مفعّل" : "Enabled"
                    : language === "ar" ? "معطّل" : "Disabled"}
                </p>
              </div>
              <div
                className="w-11 h-6 rounded-full flex items-center px-1 transition-all"
                style={{ background: offlineMode ? "var(--teal)" : "hsl(var(--muted))" }}
              >
                <motion.div
                  animate={{ x: offlineMode ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-4 h-4 rounded-full bg-white shadow"
                />
              </div>
            </OptionCard>

            {offlineMode && (
              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full p-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, var(--gold-muted), var(--teal-muted))",
                  border: "1.5px solid var(--gold)",
                  color: "var(--text-gold)",
                }}
                onClick={async () => {
                  try {
                    await fetch("/data/adhkar-data.json").then((r) => r.json());
                    alert(language === "ar" ? "تم التنزيل بنجاح ✓" : "Downloaded successfully ✓");
                  } catch {
                    alert(language === "ar" ? "فشل التنزيل" : "Download failed");
                  }
                }}
              >
                <Download className="w-4 h-4" />
                {language === "ar" ? "تنزيل البيانات" : "Download Data"}
              </motion.button>
            )}
          </div>
        </motion.section>

        {/* ── 6. Review ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionDelay[5] }}
        >
          <SectionTitle icon={<Star className="w-4 h-4" />}>
            {language === "ar" ? "قيّم التطبيق" : "Rate the App"}
          </SectionTitle>

          <div
            className="p-5 rounded-2xl space-y-4"
            style={{
              background: "linear-gradient(135deg, var(--gold-muted), var(--teal-muted))",
              border: "1px solid var(--gold-border)",
            }}
          >
            {reviewSent ? (
              /* Thank you screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-2"
              >
                <div className="text-4xl mb-2">🌟</div>
                <p className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                  {language === "ar" ? "شكراً على تقييمك!" : "Thank you for your feedback!"}
                </p>
                <div className="flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-6 h-6"
                      fill={rating >= s ? "var(--gold)" : "none"}
                      style={{ color: rating >= s ? "var(--gold)" : "var(--text-muted)" }}
                    />
                  ))}
                </div>
                {reviewText && (
                  <p
                    className="text-sm italic px-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    "{reviewText}"
                  </p>
                )}
                <button
                  onClick={() => {
                    setReviewSent(false);
                    localStorage.removeItem("reviewSent");
                  }}
                  className="text-xs mt-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {language === "ar" ? "تعديل التقييم" : "Edit review"}
                </button>
              </motion.div>
            ) : (
              /* Rating form */
              <div className="space-y-4">
                <p className="text-sm font-medium text-center" style={{ color: "var(--text-secondary)" }}>
                  {language === "ar"
                    ? "ما رأيك في التطبيق؟"
                    : "How do you like the app?"}
                </p>

                {/* Stars */}
                <div className="flex justify-center">
                  <StarRating value={rating} onChange={setRating} />
                </div>

                {rating > 0 && (
                  <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
                    {["", "ضعيف", "مقبول", "جيد", "جيد جداً", "ممتاز!"][rating]}
                    {" · "}
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][rating]}
                  </p>
                )}

                {/* Comment */}
                <div className="relative">
                  <MessageSquare
                    className="absolute top-3 right-3 w-4 h-4"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <textarea
                    rows={3}
                    placeholder={
                      language === "ar"
                        ? "أضف تعليقاً (اختياري)..."
                        : "Add a comment (optional)..."
                    }
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="app-input w-full pr-9 pl-3 py-2.5 text-sm resize-none"
                    style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: rating ? 1.02 : 1 }}
                  whileTap={{ scale: rating ? 0.98 : 1 }}
                  onClick={handleSubmitReview}
                  disabled={!rating}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: rating
                      ? "linear-gradient(135deg, var(--gold), var(--teal))"
                      : "hsl(var(--muted))",
                    color: rating ? "#fff" : "var(--text-muted)",
                    cursor: rating ? "pointer" : "not-allowed",
                  }}
                >
                  {language === "ar" ? "إرسال التقييم" : "Submit Review"}
                </motion.button>
              </div>
            )}
          </div>
        </motion.section>

        {/* ── 7. About ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="p-4 rounded-xl flex items-center gap-3"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid var(--gold-border)",
          }}
        >
          <Info className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-teal)" }} />
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {language === "ar" ? "تطبيق الأذكار والسنن" : "Adhkar & Sonan App"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              v1.0.0 · SA7Tech
            </p>
          </div>
          <ChevronLeft className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        </motion.div>
      </div>
    </PageLayout>
  );
}
