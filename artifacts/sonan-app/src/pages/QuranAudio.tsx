import { motion } from "framer-motion";
import { Headphones, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";

const reciters = [
  { id: 1, name: "محمود خليل الحصري", riwaya: "حفص عن عاصم" },
  { id: 2, name: "أحمد العجمي", riwaya: "حفص عن عاصم" },
  { id: 3, name: "ياسين الجزائري", riwaya: "حفص عن عاصم" },
  { id: 4, name: "سعود الشريم", riwaya: "حفص عن عاصم" },
  { id: 5, name: "عبد الرحمن السديس", riwaya: "حفص عن عاصم" },
  { id: 6, name: "ناصر القطامي", riwaya: "حفص عن عاصم" },
];

const surahs = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", 
  "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", 
  "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", 
  "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", 
  "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", 
  "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", 
  "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", 
  "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", 
  "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", 
  "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", 
  "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", 
  "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الإنفطار", "المطففين", 
  "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", 
  "الشمس", "القمر", "النجم", "الظل", "الأدياء", "الضحى", "الشرح", 
  "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", 
  "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", 
  "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

export default function QuranAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentReciter, setCurrentReciter] = useState(1);
  const [currentSura, setCurrentSura] = useState(0);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(70);

  return (
    <PageLayout title="الاستماع للقرآن" subtitle="Quran Audio">
      <div className="pb-20 md:pb-8 mt-6">
        {/* Now Playing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-900/40 to-indigo-900/30 border border-blue-500/30"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: isPlaying ? Infinity : 0 }}
              className="w-16 h-16 rounded-lg bg-blue-900/60 border border-blue-500/40 flex items-center justify-center"
            >
              <Headphones className="w-8 h-8 text-blue-400" />
            </motion.div>
            <div className="flex-1">
              <p className="text-sm text-blue-200/60">الآن يستمع</p>
              <h2 className="text-xl font-bold gold-text">
                {reciters.find(r => r.id === currentReciter)?.name || "محمود خليل الحصري"}
              </h2>
              <p className="text-sm text-blue-200/50">
                {surahs[currentSura]} - جزء من السورة
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="w-full h-2 bg-blue-900/50 rounded-full overflow-hidden cursor-pointer">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                animate={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-blue-200/50 mt-2">
              <span>{Math.floor(progress * 0.36)}:{Math.floor((progress % 1) * 60) || 0}0</span>
              <span>36:20</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-blue-900/50 transition-colors"
              onClick={() => setCurrentSura(Math.max(0, currentSura - 1))}
            >
              <SkipBack className="w-6 h-6 text-blue-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-blue-900/50 transition-colors"
              onClick={() => setCurrentSura(Math.min(surahs.length - 1, currentSura + 1))}
            >
              <SkipForward className="w-6 h-6 text-blue-400" />
            </motion.button>
            <div className="flex-1 flex items-center gap-2 ml-4">
              <Volume2 className="w-5 h-5 text-blue-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="flex-1 h-2 rounded-lg"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #1e3a8a ${volume}%, #1e3a8a 100%)`
                }}
              />
              <span className="text-xs text-blue-200 w-8 text-right">{volume}%</span>
            </div>
          </div>
        </motion.div>

        {/* Reciters */}
        <div className="mb-8">
          <h3 className="text-lg font-bold gold-text mb-4">القارئين</h3>
          <div className="space-y-3">
            {reciters.map((reciter) => (
              <motion.button
                key={reciter.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentReciter(reciter.id)}
                className={`w-full p-4 rounded-lg transition-all ${
                  currentReciter === reciter.id
                    ? "bg-gradient-to-r from-blue-600/40 to-indigo-500/20 border border-blue-400/50"
                    : "bg-amber-900/20 border border-amber-500/20 hover:border-amber-400/40"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <p className="font-medium text-amber-300">{reciter.name}</p>
                    <p className="text-xs text-amber-200/50 mt-1">{reciter.riwaya}</p>
                  </div>
                  {currentReciter === reciter.id && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="flex items-center gap-1"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <span className="text-xs text-blue-300">مختار</span>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sura List */}
        <div>
          <h3 className="text-lg font-bold gold-text mb-4">قائمة السور ({surahs.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto pb-4">
            {surahs.map((sura, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => setCurrentSura(idx)}
                className={`p-3 rounded-lg text-right transition-all ${
                  currentSura === idx
                    ? "bg-blue-600/40 border border-blue-400/50 text-blue-300"
                    : "bg-amber-900/15 border border-amber-500/15 hover:border-amber-400/30 text-amber-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  {currentSura === idx ? (
                    <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 0.6 }}>
                      <Play className="w-4 h-4 text-blue-400" />
                    </motion.div>
                  ) : (
                    <span className="text-xs text-amber-500/50">{idx + 1}</span>
                  )}
                  <span className="text-sm font-medium">{sura}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
