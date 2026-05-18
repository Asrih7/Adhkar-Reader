/**
 * Islamic Content Data
 * All content stored with original Arabic text
 * Translations are generated dynamically using translation service
 */

export interface ContentItem {
  id: string;
  arabic: string;
  transliteration?: string;
  source?: string;
  category: string;
}

// Morning Adhkar
const morningAdhkar: ContentItem[] = [
  {
    id: 'morning_1',
    arabic: 'اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك النشور',
    transliteration: 'Allahumma bika amsayna, wa bika asbahna',
    source: 'At-Tirmidhi',
    category: 'morningAdhkar',
  },
  {
    id: 'morning_2',
    arabic: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور',
    transliteration: 'Alhamd-u lillah-il-lathee ahyana baada maa amitana',
    source: 'Al-Bukhari',
    category: 'morningAdhkar',
  },
  {
    id: 'morning_3',
    arabic: 'اللهم إني أسألك العفو والعافية في الدنيا والآخرة',
    transliteration: 'Allahumma inni as-aluka al-afw wa al-afiyah',
    source: 'Ibn Majah',
    category: 'morningAdhkar',
  },
  {
    id: 'morning_4',
    arabic: 'سبحان الله وبحمده سبحان الله العظيم',
    transliteration: 'Subhan-Allah wa bihamdihi, Subhan-Allah il-Azim',
    source: 'Al-Bukhari',
    category: 'morningAdhkar',
  },
  {
    id: 'morning_5',
    arabic: 'أستغفر الله وأتوب إليه',
    transliteration: 'Astaghfir-ullah wa atub ilayh',
    source: 'Tirmidhi',
    category: 'morningAdhkar',
  },
];

// Evening Adhkar
const eveningAdhkar: ContentItem[] = [
  {
    id: 'evening_1',
    arabic: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت',
    transliteration: 'Allahumma bika amsayna, wa bika asbahna',
    source: 'At-Tirmidhi',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_2',
    arabic: 'أمسينا على فطرة الله والحمد لله',
    transliteration: 'Amsayna ala fitratil-lah wal-hamdu lillah',
    source: 'Muslim',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_3',
    arabic: 'اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك',
    transliteration: 'Allahumma anta rabbi la ilaha illaa anta',
    source: 'At-Tirmidhi',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_4',
    arabic: 'رضيت بالله رباً، وبالإسلام ديناً، وبمحمد نبياً',
    transliteration: 'Raditubillahi rabba, wa bil-Islam dina, wa bi-Muhammadin nabiya',
    source: 'At-Tirmidhi',
    category: 'eveningAdhkar',
  },
];

// Sleep Adhkar
const sleepAdhkar: ContentItem[] = [
  {
    id: 'sleep_1',
    arabic: 'بسم الله وضعت جنبي',
    transliteration: 'Bismillaahi wada\'tu janbi',
    source: 'An-Nasa\'i',
    category: 'sleepAdhkar',
  },
  {
    id: 'sleep_2',
    arabic: 'الحمد لله الذي كفاني وآواني',
    transliteration: 'Alhamd-u lillahil-ladhi kafani wa awani',
    source: 'Abu Dawud',
    category: 'sleepAdhkar',
  },
  {
    id: 'sleep_3',
    arabic: 'اللهم باسمك أموت وأحيا',
    transliteration: 'Allahumma biismika amutu wa ahya',
    source: 'Al-Bukhari',
    category: 'sleepAdhkar',
  },
];

// Daily Sonan
const dailySonan: ContentItem[] = [
  {
    id: 'sonan_1',
    arabic: 'تنظيف الأسنان بالسواك أو بالفرشاة',
    transliteration: 'Tanzif al-asnani bi-s-swak',
    source: 'Sunnah Mu\'akkadah',
    category: 'sonan',
  },
  {
    id: 'sonan_2',
    arabic: 'الاستنشاق بماء نقي وتنظيف الأنف في الوضوء',
    transliteration: 'Al-Istinshaq bi-maa in naqiyy',
    source: 'Sunnah Mutafaq Alayha',
    category: 'sonan',
  },
  {
    id: 'sonan_3',
    arabic: 'تغطية الطعام والشراب، وإطفاء النار قبل النوم',
    transliteration: 'Taghti\'at al-ta\'am wa-sh-sharab',
    source: 'Sunnah Mutafaq Alayha',
    category: 'sonan',
  },
  {
    id: 'sonan_4',
    arabic: 'المشي بسرعة متوسطة لا بسرعة مفرطة',
    transliteration: 'Al-Mashy bi-sur\'ah mutawassita',
    source: 'Adab as-Sunnah',
    category: 'sonan',
  },
  {
    id: 'sonan_5',
    arabic: 'الجلوس بسكينة وحشمة، ودخول البيت برجل اليمين',
    transliteration: 'Al-Julus bi-sukina wa hashmah',
    source: 'Sunnah Mu\'akkadah',
    category: 'sonan',
  },
];

// Advices
const advices: ContentItem[] = [
  {
    id: 'advice_1',
    arabic: 'احذر من الغضب، فإن الغضب يفسد النية ويذهب البركة',
    transliteration: 'Ihthir mina l-ghadab',
    source: 'Hasan Hadith',
    category: 'advices',
  },
  {
    id: 'advice_2',
    arabic: 'من حسن إسلام المرء تركه ما لا يعنيه',
    transliteration: 'Man husun islamil mar\'i tarkuhu ma la ya\'neehi',
    source: 'Tirmidhi',
    category: 'advices',
  },
  {
    id: 'advice_3',
    arabic: 'الكلمة الطيبة صدقة والسلام على من لقيت صدقة',
    transliteration: 'Al-Kalimah at-tayyibah sadaqah',
    source: 'Muslim',
    category: 'advices',
  },
  {
    id: 'advice_4',
    arabic: 'لا تحقرن من المعروف شيئاً، ولو أن تلقى أخاك بوجه طليق',
    transliteration: 'La tahqirun min al-ma\'ruf shay\'an',
    source: 'Muslim',
    category: 'advices',
  },
  {
    id: 'advice_5',
    arabic: 'الرحمة لا تُنزع إلا من شقيّ',
    transliteration: 'Ar-Rahmah la tunza\'u illa min shaqi',
    source: 'Tirmidhi',
    category: 'advices',
  },
];

// Wife Tips
const wifeTips: ContentItem[] = [
  {
    id: 'wife_1',
    arabic: 'خيركم خيركم لأهله، وأنا خيركم لأهلي',
    transliteration: 'Khayrkum khayrkum li-ahlihi',
    source: 'Tirmidhi',
    category: 'wife',
  },
  {
    id: 'wife_2',
    arabic: 'استوصوا بالنساء خيراً فإن النساء عندكم عوان',
    transliteration: 'Istawsu bi-n-nisa khayran',
    source: 'Tirmidhi',
    category: 'wife',
  },
  {
    id: 'wife_3',
    arabic: 'أكمل المؤمنين إيماناً أحسنهم خلقاً، وخياركم خياركم لنسائهم',
    transliteration: 'Akmal al-mu\'minina imanan ahsanuhum khulq',
    source: 'Tirmidhi',
    category: 'wife',
  },
  {
    id: 'wife_4',
    arabic: 'النساء شقائق الرجال في الحقوق والواجبات',
    transliteration: 'An-nisa shaqa\'iq ar-rijal',
    source: 'Fiqh Hadith',
    category: 'wife',
  },
];

export const contentData = {
  morningAdhkar,
  eveningAdhkar,
  sleepAdhkar,
  dailySonan,
  advices,
  wifeTips,
};
