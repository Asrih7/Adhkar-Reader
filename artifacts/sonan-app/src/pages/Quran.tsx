import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, AlignRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { getSurahs, getSurahWithText } from "@/lib/quranApi";
import type { QuranSurah } from "@/lib/quranApi";

export default function QuranPage() {
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [selectedSurahNum, setSelectedSurahNum] = useState(1);
  const [surahText, setSurahText] = useState<QuranSurah | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTranslation, setShowTranslation] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [textLoading, setTextLoading] = useState(false);

  // Load all surahs on mount
  useEffect(() => {
    getSurahs()
      .then((data) => {
        setSurahs(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Load surah text when selection changes
  useEffect(() => {
    setTextLoading(true);
    getSurahWithText(selectedSurahNum)
      .then((data) => {
        setSurahText(data);
        setTextLoading(false);
      })
      .catch(() => setTextLoading(false));
  }, [selectedSurahNum]);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.number.toString().includes(searchQuery) ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSurah = surahs.find((s) => s.number === selectedSurahNum);

  if (isLoading) {
    return (
      <PageLayout title="القرآن الكريم" subtitle="Quran Reader">
        <div className="pb-20 md:pb-8 mt-6 flex items-center justify-center min-h-[400px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full"
            style={{
              border: "4px solid var(--gold-muted)",
              borderTopColor: "var(--gold)",
            }}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="القرآن الكريم" subtitle="Quran Reader">
      <div className="pb-20 md:pb-8 mt-6">
        {/* Search + Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 space-y-3"
        >
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="ابحث عن سورة... Search surah"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="app-input w-full pl-10 pr-4 py-2.5 text-sm"
            />
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Font size */}
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

            {/* Translation toggle */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: showTranslation ? "var(--gold-muted)" : "hsl(var(--muted))",
                border: `1.5px solid ${showTranslation ? "var(--gold)" : "var(--gold-border)"}`,
                color: showTranslation ? "var(--text-gold)" : "var(--text-secondary)",
              }}
            >
              ترجمة · Translation
            </button>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Surah List ── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <p
              className="text-sm font-bold mb-3"
              style={{ color: "var(--text-gold)" }}
            >
              <BookOpen className="inline w-4 h-4 mr-1" />
              السور ({filteredSurahs.length})
            </p>

            {/* Scrollable surah list — natural scroll on mobile, contained on desktop */}
            <div className="space-y-1.5 overflow-y-auto pb-4 lg:max-h-[70vh] pr-1">
              {filteredSurahs.map((sura) => {
                const isActive = selectedSurahNum === sura.number;
                return (
                  <motion.button
                    key={sura.number}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setSelectedSurahNum(sura.number)}
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
                          {sura.englishName} · {sura.numberOfAyahs} آية
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {sura.revelationType === "Meccan" ? "مكية" : "مدنية"}
                        </p>
                      </div>
                      <span className="badge-number flex-shrink-0">{sura.number}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Surah Content ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-2"
          >
            {currentSurah ? (
              <div className="space-y-4">
                {/* Header Card */}
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
                      { label: "الآيات", value: currentSurah.numberOfAyahs },
                      { label: "النوع", value: currentSurah.revelationType === "Meccan" ? "مكية" : "مدنية" },
                      { label: "الترتيب", value: currentSurah.number },
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
                    style={{
                      background: "hsl(var(--card))",
                      border: "1px solid var(--gold-border)",
                    }}
                  >
                    <p
                      className="amiri font-bold leading-relaxed"
                      style={{
                        fontSize: `${fontSize + 4}px`,
                        color: "var(--text-gold)",
                      }}
                    >
                      بِسْمِ اللَّهُ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  </div>
                )}

                {/* Ayahs — natural scroll within a max-height container */}
                {textLoading ? (
                  <div className="flex justify-center py-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-9 h-9 rounded-full"
                      style={{
                        border: "3px solid var(--gold-muted)",
                        borderTopColor: "var(--gold)",
                      }}
                    />
                  </div>
                ) : surahText?.ayahs ? (
                  <motion.div
                    key={`text-${surahText.number}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "hsl(var(--card))",
                      border: "1px solid var(--gold-border)",
                    }}
                  >
                    {/* Inner scroll area */}
                    <div className="overflow-y-auto max-h-[60vh] p-4 space-y-5">
                      {surahText.ayahs.map((ayah) => (
                        <div key={ayah.numberInSurah} className="space-y-2">
                          {/* Ayah number badge */}
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

                          {/* Arabic text */}
                          <p
                            className="amiri leading-loose text-right"
                            style={{
                              fontSize: `${fontSize}px`,
                              color: "var(--text-primary)",
                              lineHeight: 2,
                            }}
                          >
                            {ayah.text}
                          </p>

                          {/* Translation */}
                          {showTranslation && ayah.translation && (
                            <div
                              className="p-3 rounded-lg text-sm leading-relaxed"
                              style={{
                                background: "var(--teal-muted)",
                                borderRight: "3px solid var(--teal)",
                                color: "var(--text-secondary)",
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
                className="flex items-center justify-center h-[300px] rounded-2xl"
                style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}
              >
                <p style={{ color: "var(--text-muted)" }}>اختر سورة للبدء · Select a surah</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
