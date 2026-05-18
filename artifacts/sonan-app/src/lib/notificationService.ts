import type { ContentItem } from '@/lib/contentData';
import { contentData } from '@/lib/contentData';

const DAILY_KEY = 'daily_notif_v2';
const NOTIF_HOUR_KEY = 'notif_hour';
const NOTIF_ENABLED_KEY = 'notif_enabled';

interface DailyData {
  date: string;
  items: ContentItem[];
  sent: boolean;
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getAllItems(): ContentItem[] {
  return (Object.values(contentData) as ContentItem[][]).flat();
}

function pickRandom(arr: ContentItem[], n: number): ContentItem[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function getTodayItems(): ContentItem[] {
  const today = getTodayStr();
  try {
    const stored = localStorage.getItem(DAILY_KEY);
    if (stored) {
      const data = JSON.parse(stored) as DailyData;
      if (data.date === today && data.items.length > 0) {
        return data.items;
      }
    }
  } catch {
    // ignore
  }

  const items = pickRandom(getAllItems(), 3);
  const data: DailyData = { date: today, items, sent: false };
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
  return items;
}

export function refreshTodayItems(): ContentItem[] {
  const items = pickRandom(getAllItems(), 3);
  const data: DailyData = { date: getTodayStr(), items, sent: false };
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
  return items;
}

export function markSent(): void {
  try {
    const stored = localStorage.getItem(DAILY_KEY);
    if (stored) {
      const data = JSON.parse(stored) as DailyData;
      data.sent = true;
      localStorage.setItem(DAILY_KEY, JSON.stringify(data));
    }
  } catch {
    // ignore
  }
}

export function wasSentToday(): boolean {
  const today = getTodayStr();
  try {
    const stored = localStorage.getItem(DAILY_KEY);
    if (stored) {
      const data = JSON.parse(stored) as DailyData;
      return data.date === today && data.sent;
    }
  } catch {
    // ignore
  }
  return false;
}

export function isNotificationEnabled(): boolean {
  return localStorage.getItem(NOTIF_ENABLED_KEY) !== 'false';
}

export function setNotificationEnabled(enabled: boolean): void {
  localStorage.setItem(NOTIF_ENABLED_KEY, enabled.toString());
}

export function getNotifHour(): number {
  return parseInt(localStorage.getItem(NOTIF_HOUR_KEY) || '8', 10);
}

export function setNotifHour(hour: number): void {
  localStorage.setItem(NOTIF_HOUR_KEY, hour.toString());
}

export function getPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function requestPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendNotifications(items: ContentItem[]): void {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  items.forEach((item, i) => {
    setTimeout(() => {
      try {
        new Notification(`ذكر اليوم (${i + 1}/3)`, {
          body: item.arabic.length > 100 ? item.arabic.slice(0, 100) + '…' : item.arabic,
          tag: `daily-${item.id}`,
          requireInteraction: false,
          silent: false,
        });
      } catch {
        // Notification API may be blocked
      }
    }, i * 3000);
  });

  markSent();
}

let _timerHandle: ReturnType<typeof setTimeout> | null = null;

export function initDailyNotifications(): void {
  if (!isNotificationEnabled()) return;
  if (getPermissionStatus() !== 'granted') return;

  if (_timerHandle) clearTimeout(_timerHandle);

  const hour = getNotifHour();
  const now = new Date();
  const target = new Date();
  target.setHours(hour, 0, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);

  const delay = target.getTime() - now.getTime();

  _timerHandle = setTimeout(() => {
    if (isNotificationEnabled() && getPermissionStatus() === 'granted') {
      const items = getTodayItems();
      sendNotifications(items);
    }
    initDailyNotifications();
  }, delay);
}

export function cancelDailyNotifications(): void {
  if (_timerHandle) {
    clearTimeout(_timerHandle);
    _timerHandle = null;
  }
}
