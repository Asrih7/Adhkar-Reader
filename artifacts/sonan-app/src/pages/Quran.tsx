import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, AlignRight, ArrowRight, ChevronLeft } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { getSurahs, getSurahWithText } from "@/lib/quranApi";
import type { QuranSurah } from "@/lib/quranApi";
import { useTranslation } from "@/hooks/useTranslation";

/* Map app language to alquran.cloud edition */
const TRANSLATION_EDITIONS: Record<string, string> = {
  en: "en.asad",
  fr: "fr.hamidullah",
  es: "es.asad",
  tr: "tr.yazir",
  id: "id.indonesian",
  ar: "",
};

async function getSurahWithLangTranslation(
  surahNumber: number,
  lang: string
): Promise<QuranSurah | null> {
  try {
    const edition = TRANSLATION_EDITIONS[lang] || "en.asad";
    const arabicRes = fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    const transRes = lang !== "ar"
      ? fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`)
      : null;

    const [arabicData, translationData] = await Promise.all([
      arabicRes.then((r) => r.json()),
      transRes ? transRes.then((r) => r.json()) : Promise.resolve(null),
    ]);

    if (arabicData.code !== 200) return null;
    const ar = arabicData.data;
    const tr = translationData?.data;

    return {
      number: ar.number,
      name: ar.name,
      englishName: ar.englishName,
      englishNameTranslation: ar.englishNameTranslation,
      numberOfAyahs: ar.numberOfAyahs,
      revelationType: ar.revelationType === "Meccan" ? "Meccan" : "Medinan",
      ayahs: ar.ayahs.map((ayah: any, i: number) => ({
        number: ayah.number,
        text: ayah.text,
        translation: tr?.ayahs?.[i]?.text || "",
        numberInSurah: ayah.numberInSurah,
      })),
    };
  } catch (e) {
    console.error("getSurahWithLangTranslation error:", e);
    return null;
  }
}

export default function QuranPage() {
  const { t, language } = useTranslation();
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [selectedSurahNum, setSelectedSurahNum] = useState<number | null>(null);
  const [surahText, setSurahText] = useState<QuranSurah | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTranslation, setShowTranslation] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [textLoading, setTextLoading] = useState(false);
  /* Mobile: toggle between list view and content view */
  const [mobileView, setMobileView] = useState<"list" | "content">("list");

  useEffect(() => {
    getSurahs()
      .then((data) => {
        setSurahs(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  /* When surah selected: load content + switch to content view on mobile */
  const handleSelectSurah = (num: number) => {
    setSelectedSurahNum(num);
    setMobileView("content");
    setTextLoading(true);
    getSurahWithLangTranslation(num, language)
      .then((data) => {
        setSurahText(data);
        setTextLoading(false);
      })
      .catch(() => setTextLoading(false));
  };

  /* Reload translation when language changes */
  useEffect(() => {
    if (selectedSurahNum === null) return;
    setTextLoading(true);
    getSurahWithLangTranslation(selectedSurahNum, language)
      .then((data) => {
        setSurahText(data);
        setTextLoading(false);
      })
      .catch(() => setTextLoading(false));
  }, [language]);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.number.toString().includes(searchQuery) ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSurah = surahs.find((s) => s.number === selectedSurahNum);
  const isRtl = language === "ar";

  if (isLoading) {
    return (
      <PageLayout title={t("quran")} subtitle="Quran Reader">
        <div className="pb-20 md:pb-8 mt-6 flex items-center justify-center min-h-[400px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full"
            style={{ border: "4px solid var(--gold-muted)", borderTopColor: "var(--gold)" }}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t("quran")} subtitle={isRtl ? "قارئ القرآن الكريم" : "Quran Reader"}>
      <div className="pb-24 md:pb-8 mt-4">

        {/* ── Search + Controls ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 space-y-3"
        >
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder={isRtl ? "ابحث عن سورة..." : "Search surah..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (mobileView === "content") setMobileView("list");
              }}
              className="app-input w-full pl-10 pr-4 py-2.5 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl app-card"
              style={{ border: "1px solid var(--gold-border)" }}
            >
              <AlignRight className="w-4 h-4" style={{ color: "var(--text-gold)" }} />
              <input
                type="range"
                min="14"
                max="28"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-20 h-2 rounded-lg"
              />
              <span className="text-xs font-bold w-8" style={{ color: "var(--text-gold)" }}>
                {fontSize}
              </span>
            </div>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: showTranslation ? "var(--gold-muted)" : "hsl(var(--muted))",
                border: `1.5px solid ${showTranslation ? "var(--gold)" : "var(--gold-border)"}`,
                color: showTranslation ? "var(--text-gold)" : "var(--text-secondary)",
              }}
            >
              {isRtl ? "الترجمة" : "Translation"}
            </button>

            {/* Mobile: back to list button */}
            {mobileView === "content" && (
              <button
                onClick={() => setMobileView("list")}
                className="flex md:hidden items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{
                  background: "var(--teal-muted)",
                  border: "1px solid var(--teal-border)",
                  color: "var(--text-teal)",
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                {isRtl ? "السور" : "Surahs"}
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Main Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Surah List ── hide on mobile when content view is active ── */}
          <AnimatePresence mode="wait">
            {(mobileView === "list") && (
              <motion.div
                key="surah-list"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="lg:col-span-1 block"
              >
                <p className="text-sm font-bold mb-3" style={{ color: "var(--text-gold)" }}>
                  <BookOpen className="inline w-4 h-4 mr-1" />
                  {isRtl ? `السور (${filteredSurahs.length})` : `Surahs (${filteredSurahs.length})`}
                </p>

                <div className="space-y-1.5 overflow-y-auto pb-4 lg:max-h-[70vh] pr-1">
                  {filteredSurahs.map((sura) => {
                    const isActive = selectedSurahNum === sura.number;
                    return (
                      <motion.button
                        key={sura.number}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => handleSelectSurah(sura.number)}
                        className="w-full p-3 rounded-xl text-right transition-all"
                        style={{
                          background: isActive ? "var(--gold-muted)" : "hsl(var(--card))",
                          border: isActive
                            ? "2px solid var(--gold)"
                            : "1px solid var(--gold-border)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-bold text-sm truncate"
                              style={{ color: isActive ? "var(--text-gold)" : "var(--text-primary)" }}
                            >
                              {sura.name}
                            </p>
                            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>
                              {sura.englishName} · {sura.numberOfAyahs} {isRtl ? "آية" : "ayahs"}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                              {sura.revelationType === "Meccan"
                                ? (isRtl ? "مكية" : "Meccan")
                                : (isRtl ? "مدنية" : "Medinan")}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="badge-number">{sura.number}</span>
                            <ArrowRight
                              className="w-4 h-4"
                              style={{ color: isActive ? "var(--text-gold)" : "var(--text-muted)" }}
                            />
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Surah Content ── hide on mobile when list view is active ── */}
          <AnimatePresence mode="wait">
            {(mobileView === "content" || window.innerWidth >= 1024) && (
              <motion.div
                key="surah-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:col-span-2"
              >
                {currentSurah ? (
                  <div className="space-y-4">
                    <motion.div
                      key={currentSurah.number}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, var(--gold-muted), var(--teal-muted))",
                        border: "1px solid var(--gold-border)",
                      }}
                    >
                      <div className="text-center mb-4">
                        <h1
                          className="text-3xl font-bold amiri mb-1"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {currentSurah.name}
                        </h1>
                        <h2 className="text-base font-semibold" style={{ color: "var(--text-gold)" }}>
                          {currentSurah.englishName}
                        </h2>
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                          {currentSurah.englishNameTranslation}
                        </p>
                      </div>

                      <div className="divider" />

                      <div className="grid grid-cols-3 gap-3 text-center text-sm">
                        {[
                          { label: isRtl ? "الآيات" : "Ayahs", value: currentSurah.numberOfAyahs },
                          {
                            label: isRtl ? "النوع" : "Type",
                            value: currentSurah.revelationType === "Meccan"
                              ? (isRtl ? "مكية" : "Meccan")
                              : (isRtl ? "مدنية" : "Medinan"),
                          },
                          { label: isRtl ? "الترتيب" : "Order", value: currentSurah.number },
                        ].map((item) => (
                          <div key={item.label}>
                            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                              {item.label}
                            </p>
                            <p className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Basmalah */}
                    {currentSurah.number !== 9 && (
                      <div
                        className="p-4 rounded-xl text-center"
                        style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}
                      >
                        <p
                          className="amiri font-bold leading-relaxed"
                          style={{ fontSize: `${fontSize + 4}px`, color: "var(--text-gold)" }}
                        >
                          بِسْمِ اللَّهُ الرَّحْمَٰنِ الرَّحِيمِ
                        </p>
                      </div>
                    )}

                    {/* Ayahs */}
                    {textLoading ? (
                      <div className="flex justify-center py-10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="w-9 h-9 rounded-full"
                          style={{ border: "3px solid var(--gold-muted)", borderTopColor: "var(--gold)" }}
                        />
                      </div>
                    ) : surahText?.ayahs ? (
                      <motion.div
                        key={`text-${surahText.number}-${language}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-2xl overflow-hidden"
                        style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}
                      >
                        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-5">
                          {surahText.ayahs.map((ayah) => (
                            <div key={ayah.numberInSurah} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                  style={{
                                    background: "var(--gold-muted)",
                                    border: "1px solid var(--gold-border)",
                                    color: "var(--text-gold)",
                                  }}
                                >
                                  {ayah.numberInSurah}
                                </span>
                                <div className="h-px flex-1" style={{ background: "var(--gold-border)" }} />
                              </div>

                              <p
                                className="amiri leading-loose text-right"
                                style={{ fontSize: `${fontSize}px`, color: "var(--text-primary)", lineHeight: 2 }}
                              >
                                {ayah.text}
                              </p>

                              {showTranslation && ayah.translation && language !== "ar" && (
                                <div
                                  className="p-3 rounded-lg text-sm leading-relaxed"
                                  style={{
                                    background: "var(--teal-muted)",
                                    borderRight: "3px solid var(--teal)",
                                    color: "var(--text-secondary)",
                                    direction: "ltr",
                                    textAlign: "left",
                                  }}
                                >
                                  {ayah.translation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </div>
                ) : (
                  <div
                    className="hidden lg:flex items-center justify-center h-[300px] rounded-2xl"
                    style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}
                  >
                    <p style={{ color: "var(--text-muted)" }}>
                      {isRtl ? "اختر سورة للبدء" : "Select a surah to start"}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
}
