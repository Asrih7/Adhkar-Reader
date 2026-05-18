import { motion } from "framer-motion";
import {
  Headphones,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Music,
  Radio,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useState, useRef, useEffect } from "react";
import { getReciters, getRecitationAudioUrl, getSurahs } from "@/lib/quranApi";
import { useTranslation } from "@/hooks/useTranslation";
import type { QuranSurah, ReciterInfo } from "@/lib/quranApi";

export default function QuranAudio() {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [reciters, setReciters] = useState<ReciterInfo[]>([]);
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [currentReciter, setCurrentReciter] = useState("ar.alafasy");
  const [currentSurah, setCurrentSurah] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [quality, setQuality] = useState<128 | 192>(128);

  // Load surahs + reciters
  useEffect(() => {
    getSurahs().then((s) => {
      setSurahs(s);
      setDataLoading(false);
    });
    setReciters(getReciters());
  }, []);

  // Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    // Do NOT set crossOrigin — cdn.islamic.network doesn't need it and it causes CORS 403
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => setProgress(audio.currentTime));
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    });
    audio.addEventListener("canplay", () => setIsLoading(false));
    audio.addEventListener("waiting", () => setIsLoading(true));
    audio.addEventListener("playing", () => {
      setIsLoading(false);
      setAudioError(null);
    });
    audio.addEventListener("error", () => {
      setIsLoading(false);
      setIsPlaying(false);
      // Show translated error message
      setAudioError(t("audioNotLoaded"));
    });
    audio.addEventListener("ended", () => {
      if (currentSurah < 114) {
        setCurrentSurah((s) => s + 1);
      } else {
        setIsPlaying(false);
      }
    });

    audio.volume = volume / 100;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []); // eslint-disable-line

  // Update source when reciter / surah / quality changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const wasPlaying = isPlaying;
    audio.pause();
    setProgress(0);
    setDuration(0);
    setAudioError(null);

    const url = getRecitationAudioUrl(currentSurah, currentReciter, quality);
    audio.src = url;
    audio.load();

    if (wasPlaying) {
      setIsLoading(true);
      audio.play().catch(() => {
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  }, [currentReciter, currentSurah, quality]); // eslint-disable-line

  // Play / pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      setIsLoading(true);
      audio.play().catch(() => {
        setIsPlaying(false);
        setIsLoading(false);
      });
    } else {
      audio.pause();
      setIsLoading(false);
    }
  }, [isPlaying]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const currentReciterName =
    reciters.find((r) => r.id === currentReciter)?.name ?? "Mishary Al-Afasy";
  const currentReciterArabic =
    reciters.find((r) => r.id === currentReciter)?.arabicName ?? "";
  const currentSurahName =
    surahs.find((s) => s.number === currentSurah)?.name ?? `سورة ${currentSurah}`;

  if (dataLoading) {
    return (
      <PageLayout title="استماع القرآن" subtitle="Quran Audio">
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

  const progressPct = duration ? (progress / duration) * 100 : 0;

  return (
    <PageLayout title="استماع القرآن" subtitle="Quran Audio">
      <div className="pb-20 md:pb-8 mt-6 space-y-6">

        {/* ── Now Playing Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, var(--gold-muted), var(--teal-muted))",
            border: "1px solid var(--gold-border)",
          }}
        >
          {/* Info row */}
          <div className="flex items-center gap-4 mb-5">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "var(--gold-muted)",
                border: "2px solid var(--gold-border)",
              }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-7 h-7 rounded-full"
                  style={{ border: "2.5px solid var(--gold-border)", borderTopColor: "var(--gold)" }}
                />
              ) : (
                <Music className="w-7 h-7" style={{ color: "var(--text-gold)" }} />
              )}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
                الآن يُشغَّل · Now Playing
              </p>
              <h2 className="text-base font-bold truncate" style={{ color: "var(--text-primary)" }}>
                {currentSurahName}
              </h2>
              <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                {currentReciterArabic || currentReciterName}
              </p>
            </div>
          </div>

          {/* Error message with retry */}
          {audioError && (
            <div
              className="mb-4 px-4 py-3 rounded-lg flex items-center gap-3"
              style={{
                background: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
              }}
            >
              <AlertCircle className="w-4 h-4" style={{ color: "#dc2626", flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: "#dc2626" }}>
                  {audioError}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (audioRef.current) {
                    setAudioError(null);
                    const url = getRecitationAudioUrl(currentSurah, currentReciter, quality);
                    audioRef.current.src = url;
                    audioRef.current.load();
                    setIsLoading(true);
                  }
                }}
                className="px-3 py-1 rounded text-sm font-medium flex items-center gap-1 flex-shrink-0"
                style={{
                  background: "var(--gold)",
                  color: "#fff",
                  transition: "all 0.2s",
                }}
              >
                <RotateCcw className="w-3 h-3" />
                {t("retry") || "Retry"}
              </motion.button>
            </div>
          )}

          {/* Progress */}
          <div className="mb-4">
            <div
              className="w-full h-2.5 rounded-full cursor-pointer hover:h-3.5 transition-all"
              style={{ background: "hsl(var(--muted))" }}
              onClick={handleSeek}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, var(--gold), var(--teal))",
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-5 mb-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentSurah((s) => Math.max(1, s - 1))}
              disabled={currentSurah === 1}
              className="p-2.5 rounded-xl"
              style={{ background: "var(--gold-muted)", color: "var(--text-gold)" }}
            >
              <SkipBack className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsPlaying((p) => !p)}
              disabled={isLoading}
              className="btn-play w-14 h-14 flex items-center justify-center"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 rounded-full border-2 border-white/40 border-t-white"
                />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 text-white" fill="white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentSurah((s) => Math.min(114, s + 1))}
              disabled={currentSurah === 114}
              className="p-2.5 rounded-xl"
              style={{ background: "var(--gold-muted)", color: "var(--text-gold)" }}
            >
              <SkipForward className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Volume */}
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-3"
            style={{ background: "hsl(var(--card))", border: "1px solid var(--gold-border)" }}
          >
            <Volume2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-teal)" }} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="flex-1 h-2 rounded-lg"
            />
            <span className="text-xs font-bold w-9 text-right" style={{ color: "var(--text-teal)" }}>
              {volume}%
            </span>
          </div>

          {/* Quality */}
          <div className="flex gap-2">
            {([128, 192] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: quality === q ? "var(--teal-muted)" : "hsl(var(--card))",
                  border: `1.5px solid ${quality === q ? "var(--teal)" : "var(--teal-border)"}`,
                  color: quality === q ? "var(--text-teal)" : "var(--text-muted)",
                }}
              >
                {q} kbps
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Reciters ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3
            className="text-base font-bold mb-3 flex items-center gap-2"
            style={{ color: "var(--text-gold)" }}
          >
            <Radio className="w-4 h-4" style={{ color: "var(--text-teal)" }} />
            القراء · Reciters ({reciters.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pb-2 pr-1">
            {reciters.map((rec) => {
              const active = currentReciter === rec.id;
              return (
                <motion.button
                  key={rec.id}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    setCurrentReciter(rec.id);
                    setIsPlaying(false);
                    setAudioError(null);
                  }}
                  className="p-3 rounded-xl text-left transition-all"
                  style={{
                    background: active ? "var(--teal-muted)" : "hsl(var(--card))",
                    border: `${active ? "2" : "1"}px solid ${active ? "var(--teal)" : "var(--teal-border)"}`,
                  }}
                >
                  <p
                    className="font-semibold text-sm leading-tight"
                    style={{ color: active ? "var(--text-teal)" : "var(--text-primary)" }}
                  >
                    {rec.arabicName}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {rec.name}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Surahs ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3
            className="text-base font-bold mb-3 flex items-center gap-2"
            style={{ color: "var(--text-gold)" }}
          >
            <Headphones className="w-4 h-4" style={{ color: "var(--text-teal)" }} />
            السور · Surahs (114)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto pb-2 pr-1">
            {surahs.map((s) => {
              const active = currentSurah === s.number;
              return (
                <motion.button
                  key={s.number}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setCurrentSurah(s.number);
                    setProgress(0);
                    setIsPlaying(true);
                    setAudioError(null);
                  }}
                  className="p-2.5 rounded-xl text-center transition-all"
                  style={{
                    background: active ? "var(--gold-muted)" : "hsl(var(--card))",
                    border: `${active ? "2" : "1"}px solid ${active ? "var(--gold)" : "var(--gold-border)"}`,
                  }}
                >
                  <p
                    className="font-bold text-sm leading-tight"
                    style={{ color: active ? "var(--text-gold)" : "var(--text-primary)" }}
                  >
                    {s.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {s.numberOfAyahs} آية
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
