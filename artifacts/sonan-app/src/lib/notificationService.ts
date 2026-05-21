import { Capacitor } from '@capacitor/core';
import type { ContentItem } from '@/lib/contentData';
import { contentData } from '@/lib/contentData';
import { translateText } from '@/lib/translationService';
import type { Language } from '@/lib/translations';

const DAILY_KEY = 'daily_notif_v3';
const NOTIF_ENABLED_KEY = 'notif_enabled';
const SCHEDULE_HOURS = [6.5, 8.5, 12, 15.5, 18, 21];
const NATIVE_ID_BASE = 6100;
const NATIVE_CHANNEL_ID = 'daily-reminders';

interface DailyData {
  date: string;
  items: ContentItem[];
  sentSlots: number[];
}

interface ScheduleHandle {
  id: ReturnType<typeof setTimeout>;
}

type LocalNotificationsApi = {
  checkPermissions: () => Promise<{ display: string }>;
  requestPermissions: () => Promise<{ display: string }>;
  createChannel?: (options: {
    id: string;
    name: string;
    description?: string;
    importance?: number;
    visibility?: number;
  }) => Promise<void>;
  schedule: (options: { notifications: Array<Record<string, unknown>> }) => Promise<unknown>;
  cancel: (options: { notifications: Array<{ id: number }> }) => Promise<void>;
};

const _handles: ScheduleHandle[] = [];

function isNative(): boolean {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform();
}

async function getLocalNotifications(): Promise<LocalNotificationsApi | null> {
  if (!isNative()) return null;
  try {
    const mod = await import('@capacitor/local-notifications');
    return mod.LocalNotifications as unknown as LocalNotificationsApi;
  } catch {
    return null;
  }
}

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
    morningAdhkar: ['ذكر الصباح', 'Morning Dhikr'],
    eveningAdhkar: ['ذكر المساء', 'Evening Dhikr'],
    sleepAdhkar: ['ذكر النوم', 'Sleep Dhikr'],
    afterPrayerAdhkar: ['ذكر بعد الصلاة', 'After Prayer'],
    dailySonan: ['سنة يومية', 'Daily Sunnah'],
    eatingSonan: ['سنة الطعام', 'Eating Sunnah'],
    sleepingSonan: ['سنة النوم', 'Sleep Sunnah'],
    homeSonan: ['سنة المنزل', 'Home Sunnah'],
    advices: ['نصيحة نبوية', 'Prophetic Advice'],
    marriageAdvice: ['نصيحة زوجية', 'Marriage Advice'],
    wifeTips: ['سنة مع الزوجة', 'Wife Sunnah'],
  };
  const entry = map[category];
  if (!entry) return lang === 'ar' ? 'ذكر اليوم' : 'Daily Reminder';
  return lang === 'ar' ? entry[0] : entry[1];
}

function slotEmoji(hour: number): string {
  if (hour < 9) return '🌅';
  if (hour < 13) return '☀️';
  if (hour < 17) return '🌤';
  if (hour < 20) return '🌆';
  return '🌙';
}

function notificationId(slotIndex: number): number {
  return NATIVE_ID_BASE + slotIndex;
}

async function ensureNativeChannel(native: LocalNotificationsApi): Promise<void> {
  try {
    await native.createChannel?.({
      id: NATIVE_CHANNEL_ID,
      name: 'Daily Reminders',
      description: 'Daily adhkar and sunnah reminders',
      importance: 4,
      visibility: 1,
    });
  } catch { /**/ }
}

async function getNotificationBody(item: ContentItem, lang: Language): Promise<string> {
  const body = item.arabic.length > 120 ? `${item.arabic.slice(0, 120)}...` : item.arabic;
  return lang === 'ar' ? body : translateText(body, lang);
}

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
    if (!stored) return;
    const data = JSON.parse(stored) as DailyData;
    if (!data.sentSlots) data.sentSlots = [];
    if (!data.sentSlots.includes(slotIndex)) data.sentSlots.push(slotIndex);
    localStorage.setItem(DAILY_KEY, JSON.stringify(data));
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

export function isNotificationEnabled(): boolean {
  return localStorage.getItem(NOTIF_ENABLED_KEY) !== 'false';
}

export function setNotificationEnabled(enabled: boolean): void {
  localStorage.setItem(NOTIF_ENABLED_KEY, enabled.toString());
}

export function getPermissionStatus(): NotificationPermission | 'unsupported' {
  if (isNative()) return 'default';
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function getPermissionStatusAsync(): Promise<NotificationPermission | 'unsupported'> {
  const native = await getLocalNotifications();
  if (native) {
    const status = await native.checkPermissions();
    return status.display === 'granted' ? 'granted' : status.display === 'denied' ? 'denied' : 'default';
  }
  return getPermissionStatus();
}

export async function requestPermission(): Promise<boolean> {
  const native = await getLocalNotifications();
  if (native) {
    const status = await native.requestPermissions();
    return status.display === 'granted';
  }
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  return (await Notification.requestPermission()) === 'granted';
}

async function sendOne(item: ContentItem, slotIndex: number): Promise<void> {
  if (typeof window === 'undefined') return;

  const lang = (localStorage.getItem('language') || 'ar') as Language;
  const hour = SCHEDULE_HOURS[slotIndex] ?? 8;
  const emoji = slotEmoji(hour);
  const title = `${emoji} ${getCategoryLabel(item.category, lang)}`;
  const body = await getNotificationBody(item, lang);
  const native = await getLocalNotifications();

  if (native) {
    await ensureNativeChannel(native);
    const permission = await native.checkPermissions();
    if (permission.display !== 'granted') return;
    await native.schedule({
      notifications: [{
        id: notificationId(slotIndex),
        title,
        body,
        channelId: NATIVE_CHANNEL_ID,
      }],
    });
    markSlotSent(slotIndex);
    return;
  }

  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body,
      tag: `slot-${slotIndex}-${item.id}`,
      requireInteraction: false,
      silent: false,
    });
    markSlotSent(slotIndex);
  } catch { /**/ }
}

export function sendNotifications(items: ContentItem[]): void {
  items.forEach((item, i) => {
    setTimeout(() => { void sendOne(item, i); }, i * 3000);
  });
}

export async function initDailyNotifications(): Promise<void> {
  if (!isNotificationEnabled()) return;

  const native = await getLocalNotifications();
  if (native) {
    const permission = await native.checkPermissions();
    if (permission.display !== 'granted') return;
    await ensureNativeChannel(native);
    await native.cancel({
      notifications: SCHEDULE_HOURS.map((_, slotIdx) => ({ id: notificationId(slotIdx) })),
    });
  } else if (getPermissionStatus() !== 'granted') {
    return;
  }

  _handles.forEach(h => clearTimeout(h.id));
  _handles.length = 0;

  const items = getTodayItems();
  const now = new Date();
  const nowMs = now.getTime();
  const lang = (localStorage.getItem('language') || 'ar') as Language;

  SCHEDULE_HOURS.forEach((fractionalHour, slotIdx) => {
    const item = items[slotIdx];
    if (!item || wasSentToday(slotIdx)) return;

    const target = new Date();
    target.setHours(Math.floor(fractionalHour), (fractionalHour % 1) * 60, 0, 0);
    if (target.getTime() <= nowMs) target.setDate(target.getDate() + 1);

    if (native) {
      native.schedule({
        notifications: [{
          id: notificationId(slotIdx),
          title: `${slotEmoji(fractionalHour)} ${getCategoryLabel(item.category, lang)}`,
          body: item.arabic.length > 120 ? `${item.arabic.slice(0, 120)}...` : item.arabic,
          schedule: { at: target },
          channelId: NATIVE_CHANNEL_ID,
          smallIcon: 'ic_stat_icon_config_sample',
        }],
      }).catch(() => undefined);
    } else {
      const delay = target.getTime() - nowMs;
      const h: ScheduleHandle = { id: setTimeout(() => { void sendOne(item, slotIdx); }, delay) };
      _handles.push(h);
    }
  });

  const midnight = new Date();
  midnight.setHours(24, 0, 30, 0);
  const midnightDelay = midnight.getTime() - nowMs;
  const h: ScheduleHandle = {
    id: setTimeout(() => {
      refreshTodayItems();
      void initDailyNotifications();
    }, midnightDelay),
  };
  _handles.push(h);
}

export async function cancelDailyNotifications(): Promise<void> {
  _handles.forEach(h => clearTimeout(h.id));
  _handles.length = 0;
  const native = await getLocalNotifications();
  if (native) {
    await native.cancel({
      notifications: SCHEDULE_HOURS.map((_, slotIdx) => ({ id: notificationId(slotIdx) })),
    });
  }
}

export function getNotifHour(): number { return 8; }
export function setNotifHour(_h: number): void { /** multi-slot schedule */ }
export function wasSentTodayLegacy(): boolean { return false; }
export function markSent(): void { /** legacy no-op */ }
