export type Language = 'ar' | 'en' | 'fr' | 'es';

export const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    adhkar: 'الأذكار',
    sonan: 'السنن',
    advice: 'النصائح',
    tasbeeh: 'التسبيح',
    prayerTimes: 'أوقات الصلاة',
    qibla: 'القبلة',
    quran: 'القرآن',
    quranAudio: 'استماع القرآن',
    favorites: 'المفضلة',
    share: 'شارك',
    notifications: 'الإشعارات',
    settings: 'الإعدادات',
    statistics: 'الإحصائيات',

    // Generic
    home: 'الرئيسية',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'نجح',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    search: 'بحث',
    noData: 'لا توجد بيانات',

    // Settings
    appearance: 'المظهر',
    darkMode: 'الوضع الداكن (الافتراضي)',
    lightMode: 'الوضع الفاتح',
    language: 'اللغة',
    fontSize: 'حجم الخط',
    fontSize_description: 'اختر حجم الخط المناسب لك',
    offlineMode: 'الوضع بلا إنترنت',
    aboutApp: 'عن التطبيق',
    appVersion: 'الإصدار 1.0.0',
    privacy: 'سياسة الخصوصية',
    downloadData: 'تحميل البيانات',

    // Tasbeeh
    counter: 'عداد التسبيح',
    tasbeehs: 'التسابيح',
    daily: 'يومي',
    streak: 'الشريط',
    reset: 'إعادة تعيين',

    // Prayer Times
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    sunset: 'الغروب',
    maghrib: 'المغرب',
    isha: 'العشاء',
    nextPrayer: 'الصلاة القادمة',
    until: 'يتبقى',

    // Qibla
    qiblaCompass: 'بوصلة القبلة',
    direction: 'الاتجاه',
    accuracy: 'الدقة',

    // Quran
    quranReader: 'قارئ القرآن',
    suras: 'السور',
    ayahs: 'الآيات',
    reciters: 'القارئين',
    surah: 'سورة',
    ayah: 'آية',
    listening: 'استماع',
    makki: 'مكية',
    madani: 'مدنية',

    // Share
    shareWith: 'شارك مع',
    copied: 'تم النسخ',
    share: 'شارك',
    shareMessage: 'تطبيق الأذكار - تطبيق إسلامي جميل',

    // Favorites
    favorites: 'المفضلة',
    addToFavorites: 'أضف للمفضلة',
    removeFromFavorites: 'إزالة من المفضلة',

    // Notifications
    notifications: 'الإشعارات',
    prayerAlerts: 'تنبيهات الصلاة',
    adhkarReminders: 'تذكير الأذكار',
    quietHours: 'ساعات الهدوء',
    enableNotifications: 'تفعيل الإشعارات',

    // Statistics
    statistics: 'الإحصائيات',
    level: 'المستوى',
    xp: 'نقاط الخبرة',
    achievements: 'الإنجازات',
    totalCount: 'العدد الكلي',
    currentStreak: 'الشريط الحالي',
    longestStreak: 'أطول شريط',
  },
  en: {
    // Navigation
    home: 'Home',
    adhkar: 'Adhkar',
    sonan: 'Sunnah',
    advice: 'Advice',
    tasbeeh: 'Tasbeeh',
    prayerTimes: 'Prayer Times',
    qibla: 'Qibla',
    quran: 'Quran',
    quranAudio: 'Quran Audio',
    favorites: 'Favorites',
    share: 'Share',
    notifications: 'Notifications',
    settings: 'Settings',
    statistics: 'Statistics',

    // Generic
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    noData: 'No data available',

    // Settings
    appearance: 'Appearance',
    darkMode: 'Dark Mode (Default)',
    lightMode: 'Light Mode',
    language: 'Language',
    fontSize: 'Font Size',
    fontSize_description: 'Choose your preferred font size',
    offlineMode: 'Offline Mode',
    aboutApp: 'About App',
    appVersion: 'Version 1.0.0',
    privacy: 'Privacy Policy',
    downloadData: 'Download Data',

    // Tasbeeh
    counter: 'Tasbeeh Counter',
    tasbeehs: 'Tasbeehs',
    daily: 'Daily',
    streak: 'Streak',
    reset: 'Reset',

    // Prayer Times
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    sunset: 'Sunset',
    maghrib: 'Maghrib',
    isha: 'Isha',
    nextPrayer: 'Next Prayer',
    until: 'Remaining',

    // Qibla
    qiblaCompass: 'Qibla Compass',
    direction: 'Direction',
    accuracy: 'Accuracy',

    // Quran
    quranReader: 'Quran Reader',
    suras: 'Surahs',
    ayahs: 'Ayahs',
    reciters: 'Reciters',
    surah: 'Surah',
    ayah: 'Ayah',
    listening: 'Playing',
    makki: 'Makki (Mecca)',
    madani: 'Madani (Medina)',

    // Share
    shareWith: 'Share with',
    copied: 'Copied!',
    share: 'Share',
    shareMessage: 'Adhkar App - Beautiful Islamic App',

    // Favorites
    favorites: 'Favorites',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',

    // Notifications
    notifications: 'Notifications',
    prayerAlerts: 'Prayer Alerts',
    adhkarReminders: 'Adhkar Reminders',
    quietHours: 'Quiet Hours',
    enableNotifications: 'Enable Notifications',

    // Statistics
    statistics: 'Statistics',
    level: 'Level',
    xp: 'Experience Points',
    achievements: 'Achievements',
    totalCount: 'Total Count',
    currentStreak: 'Current Streak',
    longestStreak: 'Longest Streak',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    adhkar: 'Adhkar',
    sonan: 'Sunna',
    advice: 'Conseil',
    tasbeeh: 'Tasbeeh',
    prayerTimes: 'Horaires de prière',
    qibla: 'Qibla',
    quran: 'Coran',
    quranAudio: 'Écoute du Coran',
    favorites: 'Favoris',
    share: 'Partager',
    notifications: 'Notifications',
    settings: 'Paramètres',
    statistics: 'Statistiques',

    // Generic
    loading: 'Chargement...',
    error: 'Une erreur s\'est produite',
    success: 'Succès',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    search: 'Rechercher',
    noData: 'Aucune donnée disponible',

    // Settings
    appearance: 'Apparence',
    darkMode: 'Mode sombre (par défaut)',
    lightMode: 'Mode clair',
    language: 'Langue',
    fontSize: 'Taille de police',
    fontSize_description: 'Choisissez votre taille de police préférée',
    offlineMode: 'Mode hors ligne',
    aboutApp: 'À propos de l\'application',
    appVersion: 'Version 1.0.0',
    privacy: 'Politique de confidentialité',
    downloadData: 'Télécharger les données',

    // Tasbeeh
    counter: 'Compteur Tasbeeh',
    tasbeehs: 'Tasbeehs',
    daily: 'Quotidien',
    streak: 'Séquence',
    reset: 'Réinitialiser',

    // Prayer Times
    fajr: 'Fajr',
    sunrise: 'Lever du soleil',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    sunset: 'Coucher du soleil',
    maghrib: 'Maghrib',
    isha: 'Isha',
    nextPrayer: 'Prochaine prière',
    until: 'Temps restant',

    // Qibla
    qiblaCompass: 'Boussole Qibla',
    direction: 'Direction',
    accuracy: 'Précision',

    // Quran
    quranReader: 'Lecteur du Coran',
    suras: 'Sourates',
    ayahs: 'Versets',
    reciters: 'Récitateurs',
    surah: 'Sourate',
    ayah: 'Verset',
    listening: 'Lecture en cours',
    makki: 'Mecquoise',
    madani: 'Médinoise',

    // Share
    shareWith: 'Partager avec',
    copied: 'Copié !',
    share: 'Partager',
    shareMessage: 'Application Adhkar - Belle application islamique',

    // Favorites
    favorites: 'Favoris',
    addToFavorites: 'Ajouter aux favoris',
    removeFromFavorites: 'Supprimer des favoris',

    // Notifications
    notifications: 'Notifications',
    prayerAlerts: 'Alertes de prière',
    adhkarReminders: 'Rappels Adhkar',
    quietHours: 'Heures silencieuses',
    enableNotifications: 'Activer les notifications',

    // Statistics
    statistics: 'Statistiques',
    level: 'Niveau',
    xp: 'Points d\'expérience',
    achievements: 'Réalisations',
    totalCount: 'Nombre total',
    currentStreak: 'Séquence actuelle',
    longestStreak: 'Plus longue séquence',
  },
  es: {
    // Navigation
    home: 'Inicio',
    adhkar: 'Adhkar',
    sonan: 'Sunnah',
    advice: 'Consejos',
    tasbeeh: 'Tasbeeh',
    prayerTimes: 'Horarios de oración',
    qibla: 'Qibla',
    quran: 'Corán',
    quranAudio: 'Audio del Corán',
    favorites: 'Favoritos',
    share: 'Compartir',
    notifications: 'Notificaciones',
    settings: 'Configuración',
    statistics: 'Estadísticas',

    // Generic
    loading: 'Cargando...',
    error: 'Se produjo un error',
    success: 'Éxito',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Buscar',
    noData: 'No hay datos disponibles',

    // Settings
    appearance: 'Apariencia',
    darkMode: 'Modo oscuro (por defecto)',
    lightMode: 'Modo claro',
    language: 'Idioma',
    fontSize: 'Tamaño de fuente',
    fontSize_description: 'Elige tu tamaño de fuente preferido',
    offlineMode: 'Modo sin conexión',
    aboutApp: 'Acerca de la aplicación',
    appVersion: 'Versión 1.0.0',
    privacy: 'Política de privacidad',
    downloadData: 'Descargar datos',

    // Tasbeeh
    counter: 'Contador Tasbeeh',
    tasbeehs: 'Tasbeehs',
    daily: 'Diario',
    streak: 'Racha',
    reset: 'Reiniciar',

    // Prayer Times
    fajr: 'Fajr',
    sunrise: 'Salida del sol',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    sunset: 'Puesta de sol',
    maghrib: 'Maghrib',
    isha: 'Isha',
    nextPrayer: 'Próxima oración',
    until: 'Tiempo restante',

    // Qibla
    qiblaCompass: 'Brújula Qibla',
    direction: 'Dirección',
    accuracy: 'Precisión',

    // Quran
    quranReader: 'Lector del Corán',
    suras: 'Azoras',
    ayahs: 'Versículos',
    reciters: 'Recitadores',
    surah: 'Azora',
    ayah: 'Versículo',
    listening: 'Reproducción en curso',
    makki: 'Mecana',
    madani: 'Medina',

    // Share
    shareWith: 'Compartir con',
    copied: '¡Copiado!',
    share: 'Compartir',
    shareMessage: 'Aplicación Adhkar - Hermosa aplicación islámica',

    // Favorites
    favorites: 'Favoritos',
    addToFavorites: 'Agregar a favoritos',
    removeFromFavorites: 'Eliminar de favoritos',

    // Notifications
    notifications: 'Notificaciones',
    prayerAlerts: 'Alertas de oración',
    adhkarReminders: 'Recordatorios de Adhkar',
    quietHours: 'Horas de silencio',
    enableNotifications: 'Habilitar notificaciones',

    // Statistics
    statistics: 'Estadísticas',
    level: 'Nivel',
    xp: 'Puntos de experiencia',
    achievements: 'Logros',
    totalCount: 'Conteo total',
    currentStreak: 'Racha actual',
    longestStreak: 'Racha más larga',
  },
};

export function getTranslation(key: string, language: Language): string {
  const translationObj = translations[language] as Record<string, string>;
  return translationObj[key] || key;
}
