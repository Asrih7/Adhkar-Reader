import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Settings } from "lucide-react";
import PageLayout from "@/components/PageLayout";

// All 114 Surahs of the Quran
const SURAHS = [
  { number: 1, name: "الفاتحة", ayahs: 7, pages: "1-2", makkiya: false },
  { number: 2, name: "البقرة", ayahs: 286, pages: "2-49", makkiya: false },
  { number: 3, name: "آل عمران", ayahs: 200, pages: "50-76", makkiya: false },
  { number: 4, name: "النساء", ayahs: 176, pages: "77-106", makkiya: false },
  { number: 5, name: "المائدة", ayahs: 120, pages: "106-127", makkiya: false },
  { number: 6, name: "الأنعام", ayahs: 165, pages: "128-150", makkiya: true },
  { number: 7, name: "الأعراف", ayahs: 206, pages: "151-176", makkiya: true },
  { number: 8, name: "الأنفال", ayahs: 75, pages: "177-187", makkiya: false },
  { number: 9, name: "التوبة", ayahs: 129, pages: "187-208", makkiya: false },
  { number: 10, name: "يونس", ayahs: 109, pages: "208-224", makkiya: true },
  { number: 11, name: "هود", ayahs: 123, pages: "221-235", makkiya: true },
  { number: 12, name: "يوسف", ayahs: 111, pages: "235-248", makkiya: true },
  { number: 13, name: "الرعد", ayahs: 43, pages: "249-255", makkiya: false },
  { number: 14, name: "إبراهيم", ayahs: 52, pages: "255-261", makkiya: true },
  { number: 15, name: "الحجر", ayahs: 99, pages: "262-267", makkiya: true },
  { number: 16, name: "النحل", ayahs: 128, pages: "267-281", makkiya: true },
  { number: 17, name: "الإسراء", ayahs: 111, pages: "282-293", makkiya: true },
  { number: 18, name: "الكهف", ayahs: 110, pages: "293-305", makkiya: true },
  { number: 19, name: "مريم", ayahs: 98, pages: "305-312", makkiya: true },
  { number: 20, name: "طه", ayahs: 135, pages: "312-323", makkiya: true },
  { number: 21, name: "الأنبياء", ayahs: 112, pages: "323-333", makkiya: true },
  { number: 22, name: "الحج", ayahs: 78, pages: "333-346", makkiya: false },
  { number: 23, name: "المؤمنون", ayahs: 118, pages: "346-356", makkiya: true },
  { number: 24, name: "النور", ayahs: 64, pages: "356-366", makkiya: false },
  { number: 25, name: "الفرقان", ayahs: 77, pages: "367-376", makkiya: true },
  { number: 26, name: "الشعراء", ayahs: 227, pages: "376-395", makkiya: true },
  { number: 27, name: "النمل", ayahs: 93, pages: "395-405", makkiya: true },
  { number: 28, name: "القصص", ayahs: 88, pages: "405-417", makkiya: true },
  { number: 29, name: "العنكبوت", ayahs: 69, pages: "417-425", makkiya: true },
  { number: 30, name: "الروم", ayahs: 60, pages: "426-434", makkiya: true },
  { number: 31, name: "لقمان", ayahs: 34, pages: "434-440", makkiya: true },
  { number: 32, name: "السجدة", ayahs: 30, pages: "440-442", makkiya: true },
  { number: 33, name: "الأحزاب", ayahs: 73, pages: "442-454", makkiya: false },
  { number: 34, name: "سبأ", ayahs: 54, pages: "454-461", makkiya: true },
  { number: 35, name: "فاطر", ayahs: 45, pages: "461-467", makkiya: true },
  { number: 36, name: "يس", ayahs: 83, pages: "467-473", makkiya: true },
  { number: 37, name: "الصافات", ayahs: 182, pages: "473-486", makkiya: true },
  { number: 38, name: "ص", ayahs: 88, pages: "486-493", makkiya: true },
  { number: 39, name: "الزمر", ayahs: 75, pages: "493-505", makkiya: true },
  { number: 40, name: "غافر", ayahs: 85, pages: "505-517", makkiya: true },
  { number: 41, name: "فصلت", ayahs: 54, pages: "517-525", makkiya: true },
  { number: 42, name: "الشورى", ayahs: 53, pages: "525-532", makkiya: true },
  { number: 43, name: "الزخرف", ayahs: 89, pages: "532-540", makkiya: true },
  { number: 44, name: "الدخان", ayahs: 59, pages: "540-544", makkiya: true },
  { number: 45, name: "الجاثية", ayahs: 37, pages: "544-549", makkiya: true },
  { number: 46, name: "الأحقاف", ayahs: 35, pages: "549-554", makkiya: true },
  { number: 47, name: "محمد", ayahs: 38, pages: "554-559", makkiya: false },
  { number: 48, name: "الفتح", ayahs: 29, pages: "559-562", makkiya: false },
  { number: 49, name: "الحجرات", ayahs: 18, pages: "562-565", makkiya: false },
  { number: 50, name: "ق", ayahs: 45, pages: "565-568", makkiya: true },
  { number: 51, name: "الذاريات", ayahs: 60, pages: "568-572", makkiya: true },
  { number: 52, name: "الطور", ayahs: 49, pages: "572-576", makkiya: true },
  { number: 53, name: "النجم", ayahs: 62, pages: "577-580", makkiya: true },
  { number: 54, name: "القمر", ayahs: 55, pages: "580-583", makkiya: true },
  { number: 55, name: "الرحمن", ayahs: 78, pages: "583-586", makkiya: false },
  { number: 56, name: "الواقعة", ayahs: 96, pages: "586-592", makkiya: true },
  { number: 57, name: "الحديد", ayahs: 29, pages: "592-598", makkiya: false },
  { number: 58, name: "المجادلة", ayahs: 22, pages: "598-601", makkiya: false },
  { number: 59, name: "الحشر", ayahs: 24, pages: "601-604", makkiya: false },
  { number: 60, name: "الممتحنة", ayahs: 13, pages: "604-606", makkiya: false },
  { number: 61, name: "الصف", ayahs: 14, pages: "606-608", makkiya: false },
  { number: 62, name: "الجمعة", ayahs: 11, pages: "608-609", makkiya: false },
  { number: 63, name: "المنافقون", ayahs: 11, pages: "609-610", makkiya: false },
  { number: 64, name: "التغابن", ayahs: 18, pages: "610-611", makkiya: false },
  { number: 65, name: "الطلاق", ayahs: 12, pages: "612-613", makkiya: false },
  { number: 66, name: "التحريم", ayahs: 12, pages: "613-614", makkiya: false },
  { number: 67, name: "الملك", ayahs: 30, pages: "614-617", makkiya: true },
  { number: 68, name: "القلم", ayahs: 52, pages: "617-619", makkiya: true },
  { number: 69, name: "الحاقة", ayahs: 52, pages: "619-622", makkiya: true },
  { number: 70, name: "المعارج", ayahs: 44, pages: "622-624", makkiya: true },
  { number: 71, name: "نوح", ayahs: 28, pages: "624-625", makkiya: true },
  { number: 72, name: "الجن", ayahs: 28, pages: "625-627", makkiya: true },
  { number: 73, name: "المزمل", ayahs: 20, pages: "627-628", makkiya: true },
  { number: 74, name: "المدثر", ayahs: 56, pages: "628-630", makkiya: true },
  { number: 75, name: "القيامة", ayahs: 40, pages: "631-632", makkiya: true },
  { number: 76, name: "الإنسان", ayahs: 31, pages: "633-634", makkiya: false },
  { number: 77, name: "المرسلات", ayahs: 50, pages: "635-636", makkiya: true },
  { number: 78, name: "النبأ", ayahs: 40, pages: "637-638", makkiya: true },
  { number: 79, name: "النازعات", ayahs: 46, pages: "638-640", makkiya: true },
  { number: 80, name: "عبس", ayahs: 42, pages: "640-641", makkiya: true },
  { number: 81, name: "التكوير", ayahs: 29, pages: "641-642", makkiya: true },
  { number: 82, name: "الإنفطار", ayahs: 19, pages: "642-643", makkiya: true },
  { number: 83, name: "المطففين", ayahs: 36, pages: "643-645", makkiya: true },
  { number: 84, name: "الانشقاق", ayahs: 25, pages: "645-646", makkiya: true },
  { number: 85, name: "البروج", ayahs: 22, pages: "646-647", makkiya: true },
  { number: 86, name: "الطارق", ayahs: 17, pages: "647-648", makkiya: true },
  { number: 87, name: "الأعلى", ayahs: 19, pages: "648-649", makkiya: true },
  { number: 88, name: "الغاشية", ayahs: 26, pages: "649-650", makkiya: true },
  { number: 89, name: "الفجر", ayahs: 30, pages: "650-651", makkiya: true },
  { number: 90, name: "البلد", ayahs: 20, pages: "651-652", makkiya: true },
  { number: 91, name: "الشمس", ayahs: 15, pages: "652-653", makkiya: true },
  { number: 92, name: "الليل", ayahs: 21, pages: "653-654", makkiya: true },
  { number: 93, name: "الضحى", ayahs: 11, pages: "654", makkiya: true },
  { number: 94, name: "الشرح", ayahs: 8, pages: "655", makkiya: true },
  { number: 95, name: "التين", ayahs: 8, pages: "655", makkiya: true },
  { number: 96, name: "العلق", ayahs: 19, pages: "656", makkiya: true },
  { number: 97, name: "القدر", ayahs: 5, pages: "656", makkiya: true },
  { number: 98, name: "البينة", ayahs: 8, pages: "657", makkiya: false },
  { number: 99, name: "الزلزلة", ayahs: 8, pages: "657", makkiya: false },
  { number: 100, name: "العاديات", ayahs: 11, pages: "657", makkiya: true },
  { number: 101, name: "القارعة", ayahs: 11, pages: "658", makkiya: true },
  { number: 102, name: "التكاثر", ayahs: 8, pages: "658", makkiya: true },
  { number: 103, name: "العصر", ayahs: 3, pages: "658", makkiya: true },
  { number: 104, name: "الهمزة", ayahs: 9, pages: "659", makkiya: true },
  { number: 105, name: "الفيل", ayahs: 5, pages: "659", makkiya: true },
  { number: 106, name: "قريش", ayahs: 4, pages: "659", makkiya: true },
  { number: 107, name: "الماعون", ayahs: 7, pages: "659", makkiya: true },
  { number: 108, name: "الكوثر", ayahs: 3, pages: "660", makkiya: true },
  { number: 109, name: "الكافرون", ayahs: 6, pages: "660", makkiya: true },
  { number: 110, name: "النصر", ayahs: 3, pages: "660", makkiya: false },
  { number: 111, name: "المسد", ayahs: 5, pages: "660", makkiya: true },
  { number: 112, name: "الإخلاص", ayahs: 4, pages: "661", makkiya: true },
  { number: 113, name: "الفلق", ayahs: 5, pages: "661", makkiya: true },
  { number: 114, name: "الناس", ayahs: 6, pages: "661", makkiya: true }
];

export default function QuranPage() {
  const [selectedSura, setSelectedSura] = useState(1);
  const [fontSize, setFontSize] = useState(18);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSurahs = SURAHS.filter(
    sura =>
      sura.name.includes(searchQuery) ||
      sura.number.toString().includes(searchQuery)
  );

  const currentSura = SURAHS.find(s => s.number === selectedSura);

  return (
    <PageLayout title="القرآن الكريم" subtitle="Quran Reader">
      <div className="pb-20 md:pb-8 mt-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/50" />
            <input
              type="text"
              placeholder="ابحث عن سورة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-amber-900/20 border border-amber-500/30 text-amber-300 placeholder-amber-200/40 focus:outline-none focus:border-amber-400/60"
            />
          </div>
          <button className="p-2 rounded-lg hover:bg-amber-400/10 transition-colors">
            <Settings className="w-5 h-5 text-amber-400" />
          </button>
        </motion.div>

        {/* Font Size */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3"
        >
          <p className="text-sm text-amber-200/60">حجم الخط:</p>
          <input
            type="range"
            min="14"
            max="28"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-amber-300 w-10">{fontSize}px</span>
        </motion.div>

        {/* Sura List */}
        <div className="mb-8">
          <h3 className="text-lg font-bold gold-text mb-4">
            السور ({filteredSurahs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pb-4">
            {filteredSurahs.map((sura, idx) => (
              <motion.button
                key={sura.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => setSelectedSura(sura.number)}
                className={`p-4 rounded-lg transition-all text-right ${
                  selectedSura === sura.number
                    ? "bg-gradient-to-r from-amber-600/40 to-amber-500/20 border-2 border-amber-400/50"
                    : "bg-amber-900/20 border border-amber-500/20 hover:border-amber-400/40"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-amber-200/50">
                      سورة {sura.number}
                    </p>
                    <p className="text-lg font-bold gold-text">{sura.name}</p>
                    <p className="text-xs text-amber-200/40 mt-1">
                      {sura.ayahs} آية • {sura.makkiya ? "مكية" : "مدنية"}
                    </p>
                  </div>
                  {selectedSura === sura.number && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-3 h-3 bg-amber-400 rounded-full mt-1"
                    />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quran Text Preview */}
        {currentSura && (
          <motion.div
            key={selectedSura}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-lg bg-amber-900/10 border border-amber-500/20 text-center mb-8"
          >
            <p
              style={{ fontSize: `${fontSize + 4}px` }}
              className="text-amber-100 leading-loose amiri font-bold mb-4"
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <p
              style={{ fontSize: `${fontSize}px` }}
              className="text-amber-200/80 leading-loose amiri mb-6"
            >
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ • الرَّحْمَنِ الرَّحِيمِ • مَالِكِ يَوْمِ الدِّينِ
            </p>
            <div className="h-px bg-amber-500/20 my-4" />
            <div className="text-sm space-y-2 text-amber-200/60">
              <p>
                <span className="font-bold text-amber-300">
                  {currentSura.name}
                </span>
              </p>
              <p>
                {currentSura.ayahs} آية • {currentSura.makkiya ? "مكية" : "مدنية"} •
                الصفحة {currentSura.pages}
              </p>
              <p className="text-xs">
                قريباً: النص الكامل والترجمات والتفاسير
              </p>
            </div>
          </motion.div>
        )}

        {/* Reciters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/20"
        >
          <h3 className="font-bold gold-text mb-4">الاستماع للقراءات</h3>
          <div className="space-y-2">
            {[
              "محمود خليل الحصري",
              "أحمد العجمي",
              "ياسين الجزائري",
              "سعود الشريم",
              "عبد الرحمن السديس"
            ].map((reciter) => (
              <motion.button
                key={reciter}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 rounded-lg bg-amber-900/30 hover:bg-amber-900/50 border border-amber-500/20 hover:border-amber-400/40 text-amber-300 text-sm text-right transition-colors"
              >
                ▶ {reciter}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
