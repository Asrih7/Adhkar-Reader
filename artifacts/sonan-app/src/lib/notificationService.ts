import type { ContentItem } from '@/lib/contentData';
import { contentData } from '@/lib/contentData';

const DAILY_KEY       = 'daily_notif_v3';
const NOTIF_ENABLED_KEY = 'notif_enabled';

/* ── Spread-through-day schedule (24h times) ── */
const SCHEDULE_HOURS = [6.5, 8.5, 12, 15.5, 18, 21]; // 6:30, 8:30, 12:00, 15:30, 18:00, 21:00

interface DailyData {
  date: string;
  items: ContentItem[];
  sentSlots: number[];
}

interface ScheduleHandle { id: ReturnType<typeof setTimeout> }
const _handles: ScheduleHandle[] = [];

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getAllItems(): ContentItem[] {
  return (Object.values(contentData) as ContentItem[][]).flat();
}

function pickRandom(arr: ContentItem[], n: number): ContentItem[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function getCategoryLabel(category: string, lang = 'ar'): string {
  const map: Record<string, [string, string]> = {
    morningAdhkar:     ['ذكر الصباح',   'Morning Dhikr'],
    eveningAdhkar:     ['ذكر المساء',   'Evening Dhikr'],
    sleepAdhkar:       ['ذكر النوم',    'Sleep Dhikr'],
    afterPrayerAdhkar: ['ذكر بعد الصلاة','After Prayer'],
    dailySonan:        ['سنة يومية',    'Daily Sunnah'],
    eatingSonan:       ['سنة الطعام',   'Eating Sunnah'],
    sleepingSonan:     ['سنة النوم',    'Sleep Sunnah'],
    homeSonan:         ['سنة المنزل',   'Home Sunnah'],
    advices:           ['نصيحة نبوية',  'Prophetic Advice'],
    marriageAdvice:    ['نصيحة زوجية', 'Marriage Advice'],
    wifeTips:          ['سنة مع الزوجة','Wife Sunnah'],
  };
  const entry = map[category];
  if (!entry) return lang === 'ar' ? 'ذكر اليوم' : 'Daily Reminder';
  return lang === 'ar' ? entry[0] : entry[1];
}

/* ── Slot emoji helpers ── */
function slotEmoji(hour: number): string {
  if (hour < 9) return '🌅';
  if (hour < 13) return '☀️';
  if (hour < 17) return '🌤';
  if (hour < 20) return '🌆';
  return '🌙';
}

/* ── Storage helpers ── */
export function getTodayItems(): ContentItem[] {
  const today = getTodayStr();
  try {
    const stored = localStorage.getItem(DAILY_KEY);
    if (stored) {
      const data = JSON.parse(stored) as DailyData;
      if (data.date === today && data.items?.length > 0) return data.items;
    }
  } catch { /**/ }
  return refreshTodayItems();
}

export function refreshTodayItems(): ContentItem[] {
  const items = pickRandom(getAllItems(), SCHEDULE_HOURS.length);
  const data: DailyData = { date: getTodayStr(), items, sentSlots: [] };
  try { localStorage.setItem(DAILY_KEY, JSON.stringify(data)); } catch { /**/ }
  return items;
}

function markSlotSent(slotIndex: number): void {
  try {
    const stored = localStorage.getItem(DAILY_KEY);
    if (stored) {
      const data = JSON.parse(stored) as DailyData;
      if (!data.sentSlots) data.sentSlots = [];
      if (!data.sentSlots.includes(slotIndex)) data.sentSlots.push(slotIndex);
      localStorage.setItem(DAILY_KEY, JSON.stringify(data));
    }
  } catch { /**/ }
}

function wasSentToday(slotIndex: number): boolean {
  const today = getTodayStr();
  try {
    const stored = localStorage.getItem(DAILY_KEY);
    if (stored) {
      const data = JSON.parse(stored) as DailyData;
      return data.date === today && (data.sentSlots ?? []).includes(slotIndex);
    }
  } catch { /**/ }
  return false;
}

/* ── Permission helpers (exported) ── */
export function isNotificationEnabled(): boolean {
  return localStorage.getItem(NOTIF_ENABLED_KEY) !== 'false';
}

export function setNotificationEnabled(enabled: boolean): void {
  localStorage.setItem(NOTIF_ENABLED_KEY, enabled.toString());
}

export function getPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function requestPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  return (await Notification.requestPermission()) === 'granted';
}

/* ── Send one notification ── */
function sendOne(item: ContentItem, slotIndex: number): void {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const lang = localStorage.getItem('language') || 'ar';
  const hour = SCHEDULE_HOURS[slotIndex] ?? 8;
  const emoji = slotEmoji(hour);
  const category = getCategoryLabel(item.category, lang);
  const body = item.arabic.length > 120 ? item.arabic.slice(0, 120) + '…' : item.arabic;
  try {
    new Notification(`${emoji} ${category}`, {
      body,
      tag: `slot-${slotIndex}-${item.id}`,
      requireInteraction: false,
      silent: false,
    });
    markSlotSent(slotIndex);
  } catch { /**/ }
}

/* ── Backwards-compat export used by Notifications.tsx ── */
export function sendNotifications(items: ContentItem[]): void {
  items.forEach((item, i) => {
    setTimeout(() => sendOne(item, i), i * 3000);
  });
}

/* ── Schedule all 6 daily slots ── */
export function initDailyNotifications(): void {
  if (!isNotificationEnabled()) return;
  if (getPermissionStatus() !== 'granted') return;

  /* cancel previous */
  _handles.forEach(h => clearTimeout(h.id));
  _handles.length = 0;

  const items = getTodayItems();
  const now = new Date();
  const nowMs = now.getTime();

  SCHEDULE_HOURS.forEach((fractionalHour, slotIdx) => {
    const item = items[slotIdx];
    if (!item) return;
    if (wasSentToday(slotIdx)) return;

    const target = new Date();
    target.setHours(Math.floor(fractionalHour), (fractionalHour % 1) * 60, 0, 0);
    if (target.getTime() <= nowMs) {
      /* already past today — schedule for tomorrow */
      target.setDate(target.getDate() + 1);
    }
    const delay = target.getTime() - nowMs;
    const h: ScheduleHandle = { id: setTimeout(() => sendOne(item, slotIdx), delay) };
    _handles.push(h);
  });

  /* Re-initialise at midnight to pick fresh items for next day */
  const midnight = new Date();
  midnight.setHours(24, 0, 30, 0);
  const midnightDelay = midnight.getTime() - nowMs;
  const h: ScheduleHandle = { id: setTimeout(() => { refreshTodayItems(); initDailyNotifications(); }, midnightDelay) };
  _handles.push(h);
}

export function cancelDailyNotifications(): void {
  _handles.forEach(h => clearTimeout(h.id));
  _handles.length = 0;
}

/* ── Legacy compat ── */
export function getNotifHour(): number { return 8; }
export function setNotifHour(_h: number): void { /* multi-slot now */ }
export function wasSentTodayLegacy(): boolean { return false; }
export function markSent(): void { /* no-op */ }
