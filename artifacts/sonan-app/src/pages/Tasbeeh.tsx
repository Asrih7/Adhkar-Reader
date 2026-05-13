import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Volume2, Smartphone } from "lucide-react";
import PageLayout from "@/components/PageLayout";

interface TasbeehPreset {
  name: string;
  nameAr: string;
  count: number;
  target: number;
}

const presets: TasbeehPreset[] = [
  { name: "Subhanallah", nameAr: "سبحان الله", count: 33, target: 33 },
  { name: "Alhamdulillah", nameAr: "الحمد لله", count: 33, target: 33 },
  { name: "Allahu Akbar", nameAr: "الله أكبر", count: 34, target: 34 },
  { name: "La ilaha illallah", nameAr: "لا إله إلا الله", count: 100, target: 100 },
  { name: "Astaghfirullah", nameAr: "أستغفر الله", count: 100, target: 100 },
];

export default function Tasbeeh() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [count, setCount] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showVibration, setShowVibration] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const preset = presets[selectedPreset];
  const progress = (count / preset.target) * 100;

  // Load data from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem("tasbeeh-data");
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.date === today) {
        setTotalToday(data.total);
        setCount(data.counts?.[selectedPreset] || 0);
      } else {
        setStreak(data.streak + 1);
      }
    }
  }, [selectedPreset]);

  // Save data to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const counts = { ...JSON.parse(localStorage.getItem("tasbeeh-data") || "{}").counts || {} };
    counts[selectedPreset] = count;
    
    localStorage.setItem(
      "tasbeeh-data",
      JSON.stringify({
        date: today,
        total: totalToday,
        counts,
        streak,
      })
    );
  }, [count, totalToday, selectedPreset, streak]);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    setTotalToday(totalToday + 1);

    // Haptic feedback
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
    setShowVibration(true);
    setTimeout(() => setShowVibration(false), 200);

    // Sound feedback
    if (soundEnabled) {
      playSound();
    }

    // Celebrate when target reached
    if (newCount === preset.target) {
      celebrateCompletion();
    }
  };

  const playSound = () => {
    // Simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const celebrateCompletion = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
    // You could add confetti animation here
  };

  const reset = () => {
    setCount(0);
  };

  const switchPreset = (index: number) => {
    setSelectedPreset(index);
    setCount(0);
  };

  return (
    <PageLayout title="مسبحة إلكترونية" subtitle="Electronic Tasbeeh Counter">
      <div className="pb-20 md:pb-8">
        {/* Main Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 mb-8"
        >
          <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
            {/* Glowing background */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-amber-400/30"
            />

            {/* Progress circle */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(217,119,6,0.1)"
                strokeWidth="3"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray="565.48"
                initial={{ strokeDashoffset: 565.48 }}
                animate={{ strokeDashoffset: 565.48 - (565.48 * progress) / 100 }}
                strokeLinecap="round"
                transition={{ duration: 0.5 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#9d7f1e" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <motion.div
              animate={showVibration ? { scale: 1.1 } : { scale: 1 }}
              className="text-center z-10 cursor-pointer"
              onClick={increment}
            >
              <motion.div
                key={count}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl font-bold gold-text"
              >
                {count}
              </motion.div>
              <p className="text-amber-200/60 text-sm mt-2">من {preset.target}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Preset Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold gold-text mb-2">{preset.nameAr}</h2>
          <p className="text-amber-200/50">{preset.name}</p>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-400 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            إعادة تعيين
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors ${
              soundEnabled
                ? "bg-amber-600/30 border-amber-500/30 text-amber-400"
                : "bg-amber-900/20 border-amber-500/20 text-amber-300/50"
            }`}
          >
            <Volume2 className="w-5 h-5" />
            {soundEnabled ? "صوت" : "صامت"}
          </motion.button>

          {/* Haptic toggle can be added here */}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-500/20"
          >
            <p className="text-amber-200/50 text-sm">اليوم</p>
            <p className="text-2xl font-bold gold-text">{totalToday}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-500/20"
          >
            <p className="text-amber-200/50 text-sm">السلسلة</p>
            <p className="text-2xl font-bold text-blue-300">{streak}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-500/20"
          >
            <p className="text-amber-200/50 text-sm">التقدم</p>
            <p className="text-2xl font-bold text-purple-300">{Math.round(progress)}%</p>
          </motion.div>
        </div>

        {/* Presets */}
        <div className="mb-8">
          <h3 className="text-lg font-bold gold-text mb-4">الأحراز</h3>
          <div className="space-y-2">
            {presets.map((p, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => switchPreset(idx)}
                className={`w-full px-4 py-3 rounded-lg transition-all ${
                  selectedPreset === idx
                    ? "bg-gradient-to-r from-amber-600/40 to-amber-500/20 border border-amber-400/50"
                    : "bg-amber-900/20 border border-amber-500/20 hover:bg-amber-900/30"
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">{p.nameAr}</p>
                  <p className="text-sm text-amber-200/50">{p.target} مرات</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Offline indicator */}
        <div className="flex items-center gap-2 text-sm text-green-400/60">
          <Smartphone className="w-4 h-4" />
          <p>يعمل بدون إنترنت</p>
        </div>
      </div>
    </PageLayout>
  );
}
