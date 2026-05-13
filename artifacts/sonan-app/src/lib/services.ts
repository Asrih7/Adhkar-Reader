// Offline storage service
export const OfflineStorage = {
  // Save data for offline use
  saveForOffline: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      if ("serviceWorker" in navigator && "caches" in window) {
        caches.open("v1").then((cache) => {
          // Cache important assets
          cache.addAll(["/index.html", "/manifest.json"]);
        });
      }
    } catch (error) {
      console.error("Failed to save offline data:", error);
    }
  },

  // Load data from offline storage
  loadFromOffline: (key: string) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to load offline data:", error);
      return null;
    }
  },

  // Clear offline data
  clearOffline: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to clear offline data:", error);
    }
  },
};

// Notification service
export const NotificationService = {
  // Request notification permission
  requestPermission: async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  },

  // Send notification
  sendNotification: (title: string, options?: NotificationOptions) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        icon: "/islamic-icon.png",
        badge: "/islamic-badge.png",
        ...options,
      });
    }
  },

  // Schedule notification
  scheduleNotification: (title: string, delay: number, options?: NotificationOptions) => {
    setTimeout(() => {
      NotificationService.sendNotification(title, options);
    }, delay);
  },
};

// Haptic feedback service
export const HapticService = {
  light: () => {
    if ("vibrate" in navigator) navigator.vibrate(50);
  },
  medium: () => {
    if ("vibrate" in navigator) navigator.vibrate(100);
  },
  heavy: () => {
    if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
  },
  pattern: (pattern: number[]) => {
    if ("vibrate" in navigator) navigator.vibrate(pattern);
  },
};

// Streak tracking
export const StreakService = {
  getStreak: () => {
    const data = localStorage.getItem("streak-data");
    return data ? JSON.parse(data) : { streak: 0, lastDate: null };
  },

  updateStreak: () => {
    const today = new Date().toDateString();
    const data = StreakService.getStreak();

    if (data.lastDate === today) {
      return data.streak;
    } else if (data.lastDate === new Date(Date.now() - 86400000).toDateString()) {
      // Yesterday
      data.streak += 1;
    } else {
      // More than a day ago
      data.streak = 1;
    }

    data.lastDate = today;
    localStorage.setItem("streak-data", JSON.stringify(data));
    return data.streak;
  },

  getStreakData: () => {
    return StreakService.getStreak();
  },
};

// Prayer times helper
export const PrayerHelper = {
  // Check if it's prayer time (within 10 minutes)
  isPrayerTime: (prayerTime: string, buffer: number = 10): boolean => {
    const [hours, minutes] = prayerTime.split(":").map(Number);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayerMinutes = hours * 60 + minutes;

    return Math.abs(currentMinutes - prayerMinutes) <= buffer;
  },

  // Get next prayer
  getNextPrayer: (prayers: any[]) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    for (const prayer of prayers) {
      if (prayer.time > currentTime) {
        return prayer;
      }
    }
    return null;
  },

  // Calculate time until prayer
  timeUntilPrayer: (prayerTime: string): string => {
    const [hours, minutes] = prayerTime.split(":").map(Number);
    const now = new Date();
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0);

    if (prayerDate < now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }

    const diff = prayerDate.getTime() - now.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);

    return `${h}:${String(m).padStart(2, "0")}`;
  },
};
