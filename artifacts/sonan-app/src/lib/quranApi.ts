/**
 * Quran API Service
 * - Alquran.cloud API for Quran text + translations
 * - cdn.islamic.network for audio (works without CORS issues)
 */

export interface QuranAyah {
  number: number;
  text: string;
  translation?: string;
  numberInSurah: number;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
  ayahs?: QuranAyah[];
}

export interface ReciterInfo {
  id: string;
  name: string;
  arabicName: string;
}

/**
 * All available reciters on cdn.islamic.network
 * IDs match exactly the CDN path format: /quran/audio-surah/<quality>/<id>/<surah>.mp3
 */
export const RECITERS: ReciterInfo[] = [
  { id: "ar.alafasy",            name: "Mishary Rashid Al-Afasy",       arabicName: "مشاري راشد العفاسي" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit (Murattal)",         arabicName: "عبد الباسط عبد الصمد (مرتّل)" },
  { id: "ar.abdulbasitmujawwad", name: "Abdul Basit (Mujawwad)",         arabicName: "عبد الباسط عبد الصمد (مجوّد)" },
  { id: "ar.minshawi",           name: "Muhammad Siddiq Al-Minshawi",    arabicName: "محمد صديق المنشاوي" },
  { id: "ar.muhammadjabreel",    name: "Muhammad Jibril",                arabicName: "محمد جبريل" },
  { id: "ar.husary",             name: "Mahmoud Khalil Al-Husary",       arabicName: "محمود خليل الحصري" },
  { id: "ar.husarymubashshir",   name: "Husary (Mubashshir)",            arabicName: "الحصري (مبشّر)" },
  { id: "ar.saoodshuraym",       name: "Saud Al-Shuraim",                arabicName: "سعود الشريم" },
  { id: "ar.sudais",             name: "Abdurrahman Al-Sudais",          arabicName: "عبد الرحمن السديس" },
  { id: "ar.mahermuaiqly",       name: "Maher Al-Muaiqly",              arabicName: "ماهر المعيقلي" },
  { id: "ar.aymanswoaid",        name: "Ayman Swaid",                    arabicName: "أيمن سويد" },
  { id: "ar.ibrahimakhdar",      name: "Ibrahim Al-Akhdar",              arabicName: "إبراهيم الأخضر" },
  { id: "ar.khalifaalqahtani",   name: "Khalifah Al-Qahtani",           arabicName: "خليفة القحطاني" },
  { id: "ar.shaatree",           name: "Abu Bakr Al-Shatri",             arabicName: "أبو بكر الشاطري" },
  { id: "ar.parhizgar",          name: "Hossein Parhizgar",              arabicName: "حسين پرهیزکار" },
];

/**
 * Get audio URL for a surah from cdn.islamic.network
 * Format: https://cdn.islamic.network/quran/audio-surah/<quality>/<reciterId>/<surahNum>.mp3
 */
export function getRecitationAudioUrl(
  surahNumber: number,
  reciterId: string = "ar.alafasy",
  quality: 128 | 192 = 128
): string {
  // Pad surah number (some CDNs need it, some don't — without is safer)
  return `https://cdn.islamic.network/quran/audio-surah/${quality}/${reciterId}/${surahNumber}.mp3`;
}

/**
 * Get all Surahs metadata
 */
export async function getSurahs(): Promise<QuranSurah[]> {
  try {
    const res = await fetch("https://api.alquran.cloud/v1/surah");
    const data = await res.json();
    if (data.code === 200) {
      return data.data.map((s: any) => ({
        number: s.number,
        name: s.name,
        englishName: s.englishName,
        englishNameTranslation: s.englishNameTranslation,
        numberOfAyahs: s.numberOfAyahs,
        revelationType: s.revelationType === "Meccan" ? "Meccan" : "Medinan",
      }));
    }
    return [];
  } catch (e) {
    console.error("getSurahs error:", e);
    return [];
  }
}

/**
 * Get surah with Arabic text + English translation
 */
export async function getSurahWithText(
  surahNumber: number
): Promise<QuranSurah | null> {
  try {
    const [arabicRes, translationRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`),
    ]);

    const [arabicData, translationData] = await Promise.all([
      arabicRes.json(),
      translationRes.json(),
    ]);

    if (arabicData.code !== 200) return null;

    const ar = arabicData.data;
    const tr = translationData.data;

    return {
      number: ar.number,
      name: ar.name,
      englishName: ar.englishName,
      englishNameTranslation: ar.englishNameTranslation,
      numberOfAyahs: ar.numberOfAyahs,
      revelationType: ar.revelationType === "Meccan" ? "Meccan" : "Medinan",
      ayahs: ar.ayahs.map((ayah: any, i: number) => ({
        number: ayah.number,
        text: ayah.text,
        translation: tr?.ayahs?.[i]?.text || "",
        numberInSurah: ayah.numberInSurah,
      })),
    };
  } catch (e) {
    console.error("getSurahWithText error:", e);
    return null;
  }
}

export function getReciters(): ReciterInfo[] {
  return RECITERS;
}

export async function getRandomAyah(): Promise<any> {
  try {
    const res = await fetch("https://api.alquran.cloud/v1/ayah/random");
    const data = await res.json();
    return data.code === 200 ? data.data : null;
  } catch {
    return null;
  }
}

export async function searchQuran(keyword: string): Promise<any[]> {
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/search/${encodeURIComponent(keyword)}/all/en`
    );
    const data = await res.json();
    return data.code === 200 ? data.data.matches || [] : [];
  } catch {
    return [];
  }
}

export default {
  getSurahs,
  getSurahWithText,
  getRecitationAudioUrl,
  getReciters,
  getRandomAyah,
  searchQuran,
};
