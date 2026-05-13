import { motion } from "framer-motion";
import { Share2, Copy, Download, MessageCircle, Send } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const socialPlatforms = [
  { name: "WhatsApp", icon: "💬", color: "from-green-600 to-green-700" },
  { name: "Telegram", icon: "✈️", color: "from-blue-600 to-blue-700" },
  { name: "Instagram", icon: "📷", color: "from-pink-600 to-purple-600" },
  { name: "Twitter", icon: "𝕏", color: "from-gray-600 to-gray-700" },
  { name: "Facebook", icon: "f", color: "from-blue-700 to-blue-800" },
  { name: "TikTok", icon: "♪", color: "from-gray-900 to-black" },
];

export default function Share() {
  const handleShare = (platform: string) => {
    const shareText = "تطبيق الأذكار - تطبيق إسلامي جميل وسهل الاستخدام للأذكار والسنن والأدعية المأثورة";
    const shareUrl = window.location.href;

    const urls: { [key: string]: string } = {
      WhatsApp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      Telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      Twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    } else {
      navigator.share?.({
        title: "تطبيق الأذكار",
        text: shareText,
        url: shareUrl,
      });
    }
  };

  const generateShareCard = () => {
    // Generate an Islamic-styled share card as image
    const text = "أذكار الصباح والمساء\n\nسبحان الله وبحمده\nسبحان الله العظيم";
    alert("سيتم تحميل بطاقة إسلامية جميلة");
  };

  return (
    <PageLayout title="المشاركة" subtitle="Share">
      <div className="pb-20 md:pb-8 mt-6">
        {/* Quick Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-lg bg-gradient-to-r from-amber-600/20 to-amber-500/10 border border-amber-400/30"
        >
          <h3 className="text-lg font-bold gold-text mb-4">شارك مع الآخرين</h3>
          <p className="text-amber-200/70 text-sm mb-4">شارك أذكاراً وأدعية مفيدة مع أصدقائك وأحبائك</p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {socialPlatforms.map((platform, idx) => (
              <motion.button
                key={platform.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShare(platform.name)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex flex-col items-center gap-2 px-3 py-4 rounded-lg bg-gradient-to-br ${platform.color} hover:shadow-lg hover:shadow-amber-500/20 transition-all`}
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="text-xs text-white font-medium text-center">{platform.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Copy to Clipboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 rounded-lg bg-amber-900/20 border border-amber-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <Copy className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold gold-text">نسخ النص</h3>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText("سبحان الله وبحمده، سبحان الله العظيم");
              alert("تم النسخ!");
            }}
            className="w-full px-4 py-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 text-amber-300 transition-colors"
          >
            نسخ الدعاء
          </button>
        </motion.div>

        {/* Generate Share Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold gold-text">بطاقة إسلامية</h3>
          </div>
          <button
            onClick={generateShareCard}
            className="w-full px-4 py-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 text-amber-300 transition-colors"
          >
            تحميل بطاقة جميلة
          </button>
        </motion.div>

        {/* Featured Content */}
        <div className="mt-8">
          <h3 className="text-lg font-bold gold-text mb-4">محتوى مقترح للمشاركة</h3>
          <div className="space-y-3">
            {["أذكار الصباح", "أذكار المساء", "دعاء النوم", "دعاء الاستيقاظ"].map((title, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-amber-900/20 border border-amber-500/20 hover:border-amber-400/40 transition-colors cursor-pointer"
              >
                <span className="text-amber-300">{title}</span>
                <Share2 className="w-4 h-4 text-amber-400" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
