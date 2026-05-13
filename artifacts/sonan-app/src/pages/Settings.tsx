import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Globe, Info, Download, Check } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { t, setLanguage } from "@/lib/i18n";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { language, switchLanguage } = useTranslation();
  
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("fontSize") || "16");
  });
  
  const [offlineMode, setOfflineMode] = useState(() => {
    return localStorage.getItem("offlineMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize.toString());
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("offlineMode", offlineMode.toString());
  }, [offlineMode]);

  const handleDownloadOfflineData = async () => {
    try {
      const adhkarData = await fetch("/data/adhkar-data.json").then(r => r.json());
      localStorage.setItem("adhkar-offline", JSON.stringify(adhkarData));
      alert(language === "ar" ? "تم تنزيل البيانات بنجاح" : "Data downloaded successfully");
    } catch (error) {
      alert(language === "ar" ? "حدث خطأ في التنزيل" : "Failed to download data");
    }
  };

  return (
    <PageLayout title={t("settings")} subtitle={language === "ar" ? "Settings" : "الإعدادات"}>
      <div className="pb-20 md:pb-8 mt-6">
        <div className="space-y-6">
          {/* Theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold gold-text mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5" />
              {t("appearance")}
            </h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTheme("dark")}
                className={`w-full p-4 rounded-lg transition-all flex items-center ${
                  theme === "dark"
                    ? "bg-blue-900/40 border-2 border-blue-400"
                    : "bg-amber-900/20 border border-amber-500/20 hover:border-amber-400/40"
                }`}
              >
                <Moon className="w-6 h-6 text-blue-400 ml-3" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-amber-300">{t("darkMode")}</p>
                  <p className="text-xs text-amber-200/50">{t("darkModeDesc")}</p>
                </div>
                {theme === "dark" && <Check className="w-5 h-5 text-blue-400" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTheme("light")}
                className={`w-full p-4 rounded-lg transition-all flex items-center ${
                  theme === "light"
                    ? "bg-yellow-900/40 border-2 border-yellow-400"
                    : "bg-amber-900/20 border border-amber-500/20 hover:border-amber-400/40"
                }`}
              >
                <Sun className="w-6 h-6 text-yellow-400 ml-3" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-amber-300">{t("lightMode")}</p>
                  <p className="text-xs text-amber-200/50">{t("lightModeDesc")}</p>
                </div>
                {theme === "light" && <Check className="w-5 h-5 text-yellow-400" />}
              </motion.button>
            </div>
          </motion.div>

          {/* Language */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold gold-text mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t("language")}
            </h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => switchLanguage("ar")}
                className={`w-full p-4 rounded-lg transition-all flex items-center justify-between ${
                  language === "ar"
                    ? "bg-blue-900/40 border-2 border-blue-400"
                    : "bg-amber-900/20 border border-amber-500/20 hover:border-amber-400/40"
                }`}
              >
                <span className="text-amber-300 font-medium">{t("arabic")}</span>
                {language === "ar" && <Check className="w-5 h-5 text-blue-400" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => switchLanguage("en")}
                className={`w-full p-4 rounded-lg transition-all flex items-center justify-between ${
                  language === "en"
                    ? "bg-blue-900/40 border-2 border-blue-400"
                    : "bg-amber-900/20 border border-amber-500/20 hover:border-amber-400/40"
                }`}
              >
                <span className="text-amber-300 font-medium">{t("english")}</span>
                {language === "en" && <Check className="w-5 h-5 text-blue-400" />}
              </motion.button>
            </div>
          </motion.div>

          {/* Font Size */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold gold-text mb-4">{t("fontSize")}</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-amber-200/60">أ</span>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="flex-1 h-2 bg-amber-900/40 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg text-amber-300 font-bold">أ</span>
              <span className="text-sm text-amber-300 w-12 text-center">{fontSize}px</span>
            </div>
          </motion.div>

          {/* Offline Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold gold-text mb-4">{t("offlineMode")}</h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOfflineMode(!offlineMode)}
              className={`w-full p-4 rounded-lg transition-all flex items-center justify-between ${
                offlineMode
                  ? "bg-green-900/40 border-2 border-green-400"
                  : "bg-amber-900/20 border border-amber-500/20 hover:border-amber-400/40"
              }`}
            >
              <span className="text-amber-300 font-medium">
                {offlineMode ? t("offlineModeEnabled") : t("offlineModeLabel")}
              </span>
              {offlineMode && <Check className="w-5 h-5 text-green-400" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadOfflineData}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="w-full mt-3 px-4 py-3 rounded-lg bg-green-600/20 hover:bg-green-600/40 text-green-300 text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              {t("downloadData")}
            </motion.button>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-amber-400" />
              <h3 className="font-medium gold-text">{t("aboutApp")}</h3>
            </div>
            <div className="space-y-2 text-sm text-amber-200/70">
              <p>{t("version")}</p>
              <p>{t("copyright")}</p>
              <p className="text-xs text-amber-200/50 mt-3">
                {language === "ar"
                  ? "تم بناؤه باستخدام React + TypeScript + Vite"
                  : "Built with React + TypeScript + Vite"}
              </p>
            </div>
          </motion.div>

          {/* Storage Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/20"
          >
            <h3 className="font-medium text-blue-300 mb-2">{t("storageInfo")}</h3>
            <p className="text-sm text-blue-200/70">{t("locallyStored")}</p>
            <div className="mt-3 space-y-2 text-xs text-blue-200/60">
              <p>✓ {t("favoriteAdhkar")}</p>
              <p>✓ {t("statistics")}</p>
              <p>✓ {t("prayerTimesSaved")}</p>
              <p>✓ {t("preferences")}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
