// Internationalization (i18n) for Arabic and English

export const translations = {
  ar: {
    // Navigation
    home: "الرئيسية",
    adhkar: "الأذكار",
    sonan: "السنن",
    tasbeeh: "التسبيح",
    prayerTimes: "أوقات الصلاة",
    qibla: "القبلة",
    quran: "القرآن",
    quranAudio: "الاستماع للقرآن",
    shareApp: "مشاركة",
    favoritesList: "المفضلة",
    notifications: "الإشعارات",
    settings: "الإعدادات",

    // Settings Page
    appearance: "المظهر",
    darkMode: "الوضع الداكن (الافتراضي)",
    darkModeDesc: "تصميم إسلامي أنيق مع ألوان ذهبية",
    lightMode: "الوضع الفاتح",
    lightModeDesc: "تصميم مشرق وسهل الاستخدام",
    language: "اللغة",
    arabic: "العربية (الافتراضية)",
    english: "English",
    fontSize: "حجم الخط",
    offlineMode: "الوضع بلا إنترنت",
    offlineModeEnabled: "✓ مفعل",
    offlineModeLabel: "تفعيل الوضع بلا إنترنت",
    downloadData: "تحميل البيانات الإسلامية",
    aboutApp: "عن التطبيق",
    version: "الإصدار 1.0.0",
    copyright: "© 2026 - تطبيق إسلامي مجاني مفتوح المصدر",
    storageInfo: "معلومات التخزين",
    locallyStored: "البيانات مخزنة محلياً على جهازك",
    favoriteAdhkar: "الأذكار المفضلة",
    statistics: "الإحصائيات الشخصية",
    prayerTimesSaved: "أوقات الصلاة المحفوظة",
    preferences: "تفضيلاتك",

    // Tasbeeh Page
    counter: "العداد",
    count: "العدد",
    resetCounter: "إعادة تعيين",
    dailyCount: "العدد اليومي",
    streak: "السلسلة",
    days: "أيام",
    celebrations: "التهاني",
    startCounting: "ابدأ الآن",

    // Prayer Times
    nextPrayer: "الصلاة القادمة",
    fajr: "الفجر",
    sunrise: "الشروق",
    dhuhr: "الظهر",
    asr: "العصر",
    sunset: "الغروب",
    maghrib: "المغرب",
    isha: "العشاء",
    detectLocation: "كشف الموقع",
    selectCity: "اختر المدينة",

    // Qibla
    qiblaCompass: "بوصلة القبلة",
    location: "الموقع",
    accuracy: "الدقة",
    meters: "متر",

    // Quran
    quranReader: "قارئ القرآن الكريم",
    search: "ابحث عن سورة...",
    ayahs: "آية",
    makki: "مكية",
    madani: "مدنية",
    reciters: "القارئين",
    listen: "الاستماع للقراءات",

    // Buttons
    ok: "موافق",
    cancel: "إلغاء",
    save: "حفظ",
    delete: "حذف",
    share: "مشاركة",
    download: "تحميل",
    upload: "رفع",
    close: "إغلاق",
    open: "فتح",
  },
  en: {
    // Navigation
    home: "Home",
    adhkar: "Adhkar",
    sonan: "Sunnah",
    tasbeeh: "Tasbeeh",
    prayerTimes: "Prayer Times",
    qibla: "Qibla",
    quran: "Quran",
    quranAudio: "Quran Audio",
    shareApp: "Share",
    favoritesList: "Favorites",
    notifications: "Notifications",
    settings: "Settings",

    // Settings Page
    appearance: "Appearance",
    darkMode: "Dark Mode (Default)",
    darkModeDesc: "Elegant Islamic design with golden colors",
    lightMode: "Light Mode",
    lightModeDesc: "Bright and easy to use design",
    language: "Language",
    arabic: "Arabic (Default)",
    english: "English",
    fontSize: "Font Size",
    offlineMode: "Offline Mode",
    offlineModeEnabled: "✓ Enabled",
    offlineModeLabel: "Enable offline mode",
    downloadData: "Download Islamic Data",
    aboutApp: "About App",
    version: "Version 1.0.0",
    copyright: "© 2026 - Free Open Source Islamic App",
    storageInfo: "Storage Information",
    locallyStored: "Data is stored locally on your device",
    favoriteAdhkar: "Favorite Adhkar",
    statistics: "Personal Statistics",
    prayerTimesSaved: "Saved Prayer Times",
    preferences: "Your Preferences",

    // Tasbeeh Page
    counter: "Counter",
    count: "Count",
    resetCounter: "Reset",
    dailyCount: "Daily Count",
    streak: "Streak",
    days: "days",
    celebrations: "Celebrations",
    startCounting: "Start Now",

    // Prayer Times
    nextPrayer: "Next Prayer",
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    sunset: "Sunset",
    maghrib: "Maghrib",
    isha: "Isha",
    detectLocation: "Detect Location",
    selectCity: "Select City",

    // Qibla
    qiblaCompass: "Qibla Compass",
    location: "Location",
    accuracy: "Accuracy",
    meters: "meters",

    // Quran
    quranReader: "Quran Reader",
    search: "Search for surah...",
    ayahs: "Ayah",
    makki: "Makki",
    madani: "Madani",
    reciters: "Reciters",
    listen: "Listen to Recitations",

    // Buttons
    ok: "OK",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    share: "Share",
    download: "Download",
    upload: "Upload",
    close: "Close",
    open: "Open",
  },
};

export type Language = "ar" | "en";

export function getLanguage(): Language {
  const saved = localStorage.getItem("language");
  return (saved as Language) || "ar";
}

export function setLanguage(lang: Language) {
  localStorage.setItem("language", lang);
  if (lang === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.lang = "ar";
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.lang = "en";
  }
}

export function t(key: keyof typeof translations.ar, lang?: Language): string {
  const language = lang || getLanguage();
  return translations[language as Language][key as keyof typeof translations.ar] || key;
}
