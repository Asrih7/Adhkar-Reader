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

// ─── Morning Adhkar ────────────────────────────────────────────────────────────
const morningAdhkar: ContentItem[] = [
  {
    id: 'morning_1',
    arabic: 'اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور',
    transliteration: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilayka an-nushur',
    source: 'At-Tirmidhi',
    category: 'morningAdhkar',
  },
  {
    id: 'morning_2',
    arabic: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور',
    transliteration: 'Alhamd-u lillah-il-lathee ahyana baada maa amitana wa ilayhil-nushur',
    source: 'Al-Bukhari',
    category: 'morningAdhkar',
  },
  {
    id: 'morning_3',
    arabic: 'اللهم إني أسألك العفو والعافية في الدنيا والآخرة',
    transliteration: 'Allahumma inni as-aluka al-afw wa al-afiyah fid-dunya wal-akhirah',
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
    source: 'At-Tirmidhi',
    category: 'morningAdhkar',
  },
  {
    id: 'morning_6',
    arabic: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم',
    transliteration: 'Bismillahil-ladhi la yadurru maas-mihi shay\'un fil-ardi wa la fis-sama\'i wa huwas-sami\'ul-\'alim',
    source: 'Abu Dawud',
    category: 'morningAdhkar',
  },
  {
    id: 'morning_7',
    arabic: 'رضيت بالله رباً وبالإسلام ديناً وبمحمد ﷺ نبياً ورسولاً',
    transliteration: 'Raditu billahi rabban, wa bil-islami dinan, wa bi-Muhammadin nabiyyan wa rasulan',
    source: 'At-Tirmidhi',
    category: 'morningAdhkar',
  },
  {
    id: 'morning_8',
    arabic: 'اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والجبن والبخل، وضلع الدين وغلبة الرجال',
    transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazani wal-\'ajzi wal-kasali',
    source: 'Al-Bukhari',
    category: 'morningAdhkar',
  },
  {
    id: 'morning_9',
    arabic: 'اللهم إني أسألك الجنة، وأعوذ بك من النار',
    transliteration: 'Allahumma inni as\'alukal-jannata wa a\'udhu bika minan-nar',
    source: 'Abu Dawud',
    category: 'morningAdhkar',
  },
  {
    id: 'morning_10',
    arabic: 'حسبي الله لا إله إلا هو، عليه توكلت وهو رب العرش العظيم',
    transliteration: 'Hasbiyallahu la ilaha illa huwa, \'alayhi tawakkaltu wa huwa rabbul-\'arshil-\'azim',
    source: 'Abu Dawud',
    category: 'morningAdhkar',
  },
];

// ─── Evening Adhkar ───────────────────────────────────────────────────────────
const eveningAdhkar: ContentItem[] = [
  {
    id: 'evening_1',
    arabic: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير',
    transliteration: 'Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal-masir',
    source: 'At-Tirmidhi',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_2',
    arabic: 'أمسينا على فطرة الإسلام وكلمة الإخلاص والحمد لله',
    transliteration: 'Amsayna ala fitratil-islami wa kalimatil-ikhlas wal-hamdu lillah',
    source: 'Muslim',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_3',
    arabic: 'اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت',
    transliteration: 'Allahumma anta rabbi la ilaha illaa anta, khalaqtani wa ana abduka',
    source: 'At-Tirmidhi',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_4',
    arabic: 'رضيت بالله رباً، وبالإسلام ديناً، وبمحمد ﷺ نبياً',
    transliteration: 'Raditubillahi rabban, wa bil-islami dinan, wa bi-Muhammadin nabiyyan',
    source: 'At-Tirmidhi',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_5',
    arabic: 'اللهم ما أمسى بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك، فلك الحمد ولك الشكر',
    transliteration: 'Allahumma ma amsa bi min ni\'matin aw bi-ahadin min khalqika fa-minka wahdaka',
    source: 'An-Nasa\'i',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_6',
    arabic: 'أعوذ بكلمات الله التامات من شر ما خلق',
    transliteration: 'A\'udhu bikalimatillahit-tammati min sharri ma khalaq',
    source: 'Muslim',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_7',
    arabic: 'اللهم إني أعوذ بك من الكفر والفقر، وأعوذ بك من عذاب القبر',
    transliteration: 'Allahumma inni a\'udhu bika minal-kufri wal-faqri wa a\'udhu bika min \'adhabill-qabr',
    source: 'An-Nasa\'i',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_8',
    arabic: 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له',
    transliteration: 'Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallah wahdahu la sharika lah',
    source: 'Muslim',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_9',
    arabic: 'سبحان الله وبحمده عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته',
    transliteration: 'Subhanallahi wa bihamdihi adada khalqihi wa rida nafsihi wa zinata arshihi wa midada kalimatihi',
    source: 'Muslim',
    category: 'eveningAdhkar',
  },
  {
    id: 'evening_10',
    arabic: 'اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت',
    transliteration: 'Allahumma afini fi badani, allahumma afini fi sam\'i, allahumma afini fi basari',
    source: 'Abu Dawud',
    category: 'eveningAdhkar',
  },
];

// ─── Sleep Adhkar ─────────────────────────────────────────────────────────────
const sleepAdhkar: ContentItem[] = [
  {
    id: 'sleep_1',
    arabic: 'بسم الله وضعت جنبي، اللهم اغفر لي ذنبي وأخسئ شيطاني',
    transliteration: 'Bismillahi wada\'tu janbi, allahummaghfir li dhanbi wa akhsi\' shaytani',
    source: 'An-Nasa\'i',
    category: 'sleepAdhkar',
  },
  {
    id: 'sleep_2',
    arabic: 'الحمد لله الذي كفاني وآواني، وأطعمني وسقاني',
    transliteration: 'Alhamdu lillahil-ladhi kafani wa awani, wa at\'amani wa saqani',
    source: 'Abu Dawud',
    category: 'sleepAdhkar',
  },
  {
    id: 'sleep_3',
    arabic: 'اللهم باسمك أموت وأحيا',
    transliteration: 'Allahumma bismika amutu wa ahya',
    source: 'Al-Bukhari',
    category: 'sleepAdhkar',
  },
  {
    id: 'sleep_4',
    arabic: 'اللهم إني أسلمت نفسي إليك، ووجهت وجهي إليك، وفوضت أمري إليك',
    transliteration: 'Allahumma inni aslamtu nafsi ilayk, wa wajjahtu wajhi ilayk, wa fawwadtu amri ilayk',
    source: 'Al-Bukhari',
    category: 'sleepAdhkar',
  },
  {
    id: 'sleep_5',
    arabic: 'اللهم قني عذابك يوم تبعث عبادك',
    transliteration: 'Allahumma qini \'adhabaka yawma tab\'athu \'ibadak',
    source: 'Abu Dawud',
    category: 'sleepAdhkar',
  },
  {
    id: 'sleep_6',
    arabic: 'سبحانك اللهم وبحمدك، أشهد أن لا إله إلا أنت، أستغفرك وأتوب إليك',
    transliteration: 'Subhanakallahumma wa bihamdika, ash-hadu an la ilaha illa anta, astaghfiruka wa atubu ilayk',
    source: 'Al-Bukhari',
    category: 'sleepAdhkar',
  },
  {
    id: 'sleep_7',
    arabic: 'اللهم رب السماوات والأرض وما بينهما، رب العرش العظيم، ربنا ورب كل شيء',
    transliteration: 'Allahumma rabbus-samawati wal-ardi wa ma baynahuma, rabbul-arshil-azim',
    source: 'Abu Dawud',
    category: 'sleepAdhkar',
  },
  {
    id: 'sleep_8',
    arabic: 'قُل هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    transliteration: 'Qul huwallahu ahad, allahus-samad, lam yalid wa lam yulad, wa lam yakul-lahu kufuwan ahad',
    source: 'Al-Bukhari',
    category: 'sleepAdhkar',
  },
  {
    id: 'sleep_9',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    transliteration: 'Qul a\'udhu birrabbil-falaq',
    source: 'Al-Bukhari',
    category: 'sleepAdhkar',
  },
  {
    id: 'sleep_10',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliteration: 'Qul a\'udhu birabbin-nas',
    source: 'Al-Bukhari',
    category: 'sleepAdhkar',
  },
];

// ─── After Prayer Adhkar ──────────────────────────────────────────────────────
const afterPrayerAdhkar: ContentItem[] = [
  {
    id: 'afterprayer_1',
    arabic: 'أستغفر الله، أستغفر الله، أستغفر الله',
    transliteration: 'Astaghfirullah, astaghfirullah, astaghfirullah',
    source: 'Muslim',
    category: 'afterPrayerAdhkar',
  },
  {
    id: 'afterprayer_2',
    arabic: 'اللهم أنت السلام ومنك السلام، تباركت يا ذا الجلال والإكرام',
    transliteration: 'Allahumma antas-salamu wa minkas-salamu, tabarakta ya dhal-jalali wal-ikram',
    source: 'Muslim',
    category: 'afterPrayerAdhkar',
  },
  {
    id: 'afterprayer_3',
    arabic: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير',
    transliteration: 'La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay\'in qadir',
    source: 'Muslim',
    category: 'afterPrayerAdhkar',
  },
  {
    id: 'afterprayer_4',
    arabic: 'سبحان الله (ثلاثاً وثلاثين)',
    transliteration: 'Subhanallah (33 times)',
    source: 'Muslim',
    category: 'afterPrayerAdhkar',
  },
  {
    id: 'afterprayer_5',
    arabic: 'الحمد لله (ثلاثاً وثلاثين)',
    transliteration: 'Alhamdulillah (33 times)',
    source: 'Muslim',
    category: 'afterPrayerAdhkar',
  },
  {
    id: 'afterprayer_6',
    arabic: 'الله أكبر (ثلاثاً وثلاثين)',
    transliteration: 'Allahu Akbar (33 times)',
    source: 'Muslim',
    category: 'afterPrayerAdhkar',
  },
  {
    id: 'afterprayer_7',
    arabic: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، يحيي ويميت وهو على كل شيء قدير',
    transliteration: 'La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu, yuhyi wa yumitu wa huwa ala kulli shay\'in qadir',
    source: 'Muslim',
    category: 'afterPrayerAdhkar',
  },
  {
    id: 'afterprayer_8',
    arabic: 'اللهم أعني على ذكرك وشكرك وحسن عبادتك',
    transliteration: 'Allahumma a\'inni ala dhikrika wa shukrika wa husni \'ibadatik',
    source: 'Abu Dawud',
    category: 'afterPrayerAdhkar',
  },
  {
    id: 'afterprayer_9',
    arabic: 'اللهم لا مانع لما أعطيت، ولا معطي لما منعت، ولا ينفع ذا الجد منك الجد',
    transliteration: 'Allahumma la mani\'a lima a\'tayta, wa la mu\'tiya lima mana\'ta, wa la yanfa\'u dhal-jaddi minkal-jadd',
    source: 'Al-Bukhari',
    category: 'afterPrayerAdhkar',
  },
  {
    id: 'afterprayer_10',
    arabic: 'اللهم إني أعوذ بك من البخل، وأعوذ بك من الجبن، وأعوذ بك أن أرد إلى أرذل العمر',
    transliteration: 'Allahumma inni a\'udhu bika minal-bukhli, wa a\'udhu bika minal-jubni',
    source: 'Al-Bukhari',
    category: 'afterPrayerAdhkar',
  },
];

// ─── Daily Sonan ──────────────────────────────────────────────────────────────
const dailySonan: ContentItem[] = [
  {
    id: 'sonan_1',
    arabic: 'تنظيف الأسنان بالسواك، وهو سنة عند كل صلاة وعند الوضوء',
    transliteration: 'Tanzif al-asnan bis-siwak',
    source: 'Al-Bukhari',
    category: 'dailySonan',
  },
  {
    id: 'sonan_2',
    arabic: 'الاستنشاق بالماء وإخراجه في كل وضوء',
    transliteration: 'Al-istinshaq bil-maa wa ikhrajuhu',
    source: 'Al-Bukhari',
    category: 'dailySonan',
  },
  {
    id: 'sonan_3',
    arabic: 'تغطية الطعام والشراب، وإطفاء النار قبل النوم',
    transliteration: 'Taghtiyat al-ta\'am wash-sharab wa itfa\' an-nar',
    source: 'Al-Bukhari',
    category: 'dailySonan',
  },
  {
    id: 'sonan_4',
    arabic: 'المشي بسكينة ووقار، وعدم الإسراع بغير حاجة',
    transliteration: 'Al-mashy bi-sakinatin wa waqar',
    source: 'At-Tirmidhi',
    category: 'dailySonan',
  },
  {
    id: 'sonan_5',
    arabic: 'الجلوس بسكينة وحشمة، واليمين في الدخول والخروج',
    transliteration: 'Al-julus bi-sakinatin wa hashmah',
    source: 'Sunnah Mu\'akkadah',
    category: 'dailySonan',
  },
  {
    id: 'sonan_6',
    arabic: 'البداءة بالسلام على من لقيت من المسلمين',
    transliteration: 'Al-bida\' bis-salam ala man laqita minal-muslimin',
    source: 'Al-Bukhari',
    category: 'dailySonan',
  },
  {
    id: 'sonan_7',
    arabic: 'المصافحة عند اللقاء وهي من أسباب المغفرة',
    transliteration: 'Al-musafaha indal-liqa\' wa hiya min asbaabil-maghfirah',
    source: 'At-Tirmidhi',
    category: 'dailySonan',
  },
  {
    id: 'sonan_8',
    arabic: 'قص الأظفار وتقليمها والاهتمام بالنظافة الشخصية',
    transliteration: 'Qasd al-adhfar wa taqlimha',
    source: 'Al-Bukhari',
    category: 'dailySonan',
  },
  {
    id: 'sonan_9',
    arabic: 'التبكير في طلب الرزق في صباح كل يوم',
    transliteration: 'At-tabkir fi talab ar-rizq',
    source: 'Abu Dawud',
    category: 'dailySonan',
  },
  {
    id: 'sonan_10',
    arabic: 'صلاة الضحى ركعتان على الأقل بعد ارتفاع الشمس',
    transliteration: 'Salat ad-duha rak\'atan',
    source: 'Muslim',
    category: 'dailySonan',
  },
];

// ─── Eating Sonan ─────────────────────────────────────────────────────────────
const eatingSonan: ContentItem[] = [
  {
    id: 'eat_1',
    arabic: 'قول بسم الله في أول الأكل، فإن نسي في أوله قال: بسم الله أوله وآخره',
    transliteration: 'Bismillah fil-akl, fa-in nasiya fawwala qal: bismillahi awwalahu wa akhirah',
    source: 'Abu Dawud',
    category: 'eatingSonan',
  },
  {
    id: 'eat_2',
    arabic: 'الأكل باليد اليمنى، فإن الشيطان يأكل بشماله',
    transliteration: 'Al-akl bil-yad al-yumna',
    source: 'Muslim',
    category: 'eatingSonan',
  },
  {
    id: 'eat_3',
    arabic: 'الأكل مما يلي من الطعام ولا يتناول من وسط الصحفة',
    transliteration: 'Al-akl mimma yali minat-ta\'am',
    source: 'Al-Bukhari',
    category: 'eatingSonan',
  },
  {
    id: 'eat_4',
    arabic: 'عدم ذم الطعام أبداً، فإن اشتهاه أكله وإلا تركه',
    transliteration: 'Adam dhamm at-ta\'am',
    source: 'Al-Bukhari',
    category: 'eatingSonan',
  },
  {
    id: 'eat_5',
    arabic: 'حمد الله بعد الطعام: الحمد لله الذي أطعمنا وسقانا وجعلنا مسلمين',
    transliteration: 'Hamd-u lillahil-ladhi at\'amana wa saqana wa ja\'alana muslimin',
    source: 'At-Tirmidhi',
    category: 'eatingSonan',
  },
  {
    id: 'eat_6',
    arabic: 'الأكل بثلاثة أصابع واللعق بعد الأكل',
    transliteration: 'Al-akl bi-thalathati asabi\' wa al-la\'q ba\'dal-akl',
    source: 'Muslim',
    category: 'eatingSonan',
  },
  {
    id: 'eat_7',
    arabic: 'لعق الأصابع والصحفة بعد الطعام لأن البركة في آخر الطعام',
    transliteration: 'La\'q al-asabi\' was-sahfah ba\'dat-ta\'am',
    source: 'Muslim',
    category: 'eatingSonan',
  },
  {
    id: 'eat_8',
    arabic: 'عدم الأكل متكئاً على مائدة أو وسادة',
    transliteration: 'Adam al-akl muttaki\'an',
    source: 'Al-Bukhari',
    category: 'eatingSonan',
  },
  {
    id: 'eat_9',
    arabic: 'الأكل مع الضيف والجماعة فإن الطعام المشترك يبارك فيه',
    transliteration: 'Al-akl ma\'al-dayf wal-jama\'ah',
    source: 'Abu Dawud',
    category: 'eatingSonan',
  },
  {
    id: 'eat_10',
    arabic: 'السحور في رمضان وعدم تركه فإن فيه بركة',
    transliteration: 'As-suhur fi ramadan wa adam tarkihi',
    source: 'Al-Bukhari',
    category: 'eatingSonan',
  },
];

// ─── Sleeping Sonan ───────────────────────────────────────────────────────────
const sleepingSonan: ContentItem[] = [
  {
    id: 'sleeping_1',
    arabic: 'الوضوء قبل النوم والنوم على طهارة',
    transliteration: 'Al-wudu\' qablan-nawm wan-nawm ala taharah',
    source: 'Al-Bukhari',
    category: 'sleepingSonan',
  },
  {
    id: 'sleeping_2',
    arabic: 'النوم على الجنب الأيمن ووضع اليد اليمنى تحت الخد',
    transliteration: 'An-nawm ala al-janb al-aymin',
    source: 'Al-Bukhari',
    category: 'sleepingSonan',
  },
  {
    id: 'sleeping_3',
    arabic: 'نفض الفراش قبل النوم ثلاث مرات وذكر اسم الله',
    transliteration: 'Nafd al-firash qabl an-nawm thalath marrat',
    source: 'Al-Bukhari',
    category: 'sleepingSonan',
  },
  {
    id: 'sleeping_4',
    arabic: 'قراءة آية الكرسي قبل النوم لحفظ الملائكة',
    transliteration: 'Qira\'at ayat al-kursi qabl an-nawm',
    source: 'Al-Bukhari',
    category: 'sleepingSonan',
  },
  {
    id: 'sleeping_5',
    arabic: 'قراءة المعوذتين وسورة الإخلاص قبل النوم ثلاثاً',
    transliteration: 'Qira\'at al-mu\'awwidhatayni wa surat al-ikhlas',
    source: 'Al-Bukhari',
    category: 'sleepingSonan',
  },
  {
    id: 'sleeping_6',
    arabic: 'التسبيح ثلاثاً وثلاثين والتحميد ثلاثاً وثلاثين والتكبير أربعاً وثلاثين',
    transliteration: 'At-tasbih 33 wat-tahmid 33 wat-takbir 34',
    source: 'Al-Bukhari',
    category: 'sleepingSonan',
  },
  {
    id: 'sleeping_7',
    arabic: 'قراءة سورة الكافرون قبل النوم براءة من الشرك',
    transliteration: 'Qira\'at surat al-kafirun qabl an-nawm',
    source: 'At-Tirmidhi',
    category: 'sleepingSonan',
  },
  {
    id: 'sleeping_8',
    arabic: 'إطفاء الأنوار والنار والمصابيح عند النوم',
    transliteration: 'Itfa\' al-anwar wan-nar wal-masabih ind an-nawm',
    source: 'Al-Bukhari',
    category: 'sleepingSonan',
  },
  {
    id: 'sleeping_9',
    arabic: 'إغلاق الأبواب والنوافذ وتغطية الأواني',
    transliteration: 'Ighlaq al-abwab wan-nawafidh wa taghtiyat al-awani',
    source: 'Al-Bukhari',
    category: 'sleepingSonan',
  },
  {
    id: 'sleeping_10',
    arabic: 'إيقاظ الأهل لصلاة الفجر وعدم الإفراط في النوم بعده',
    transliteration: 'Iqaz al-ahl li-salat al-fajr',
    source: 'Abu Dawud',
    category: 'sleepingSonan',
  },
];

// ─── Home Entry / Exit Sonan ──────────────────────────────────────────────────
const homeSonan: ContentItem[] = [
  {
    id: 'home_1',
    arabic: 'التسمية عند دخول البيت: بسم الله ولجنا وبسم الله خرجنا',
    transliteration: 'Bismillahi walajna wa bismillahi kharajna',
    source: 'Muslim',
    category: 'homeSonan',
  },
  {
    id: 'home_2',
    arabic: 'السلام على أهل البيت عند الدخول ولو لم يكن فيه أحد',
    transliteration: 'As-salam ala ahl al-bayt ind ad-dukhul',
    source: 'An-Nur: 61',
    category: 'homeSonan',
  },
  {
    id: 'home_3',
    arabic: 'الدخول بالقدم اليمنى وذكر اسم الله',
    transliteration: 'Ad-dukhul bil-qadam al-yumna',
    source: 'Sunnah Mu\'akkadah',
    category: 'homeSonan',
  },
  {
    id: 'home_4',
    arabic: 'الخروج بالقدم اليسرى وقراءة دعاء الخروج',
    transliteration: 'Al-khuruj bil-qadam al-yusra',
    source: 'Sunnah Mu\'akkadah',
    category: 'homeSonan',
  },
  {
    id: 'home_5',
    arabic: 'دعاء الخروج: بسم الله، توكلت على الله، لا حول ولا قوة إلا بالله',
    transliteration: 'Bismillah, tawakkaltu alallah, la hawla wa la quwwata illa billah',
    source: 'Abu Dawud',
    category: 'homeSonan',
  },
  {
    id: 'home_6',
    arabic: 'اللهم إني أسألك خير المولج وخير المخرج',
    transliteration: 'Allahumma inni as\'aluka khayral-mawlaji wa khayral-makhraj',
    source: 'Abu Dawud',
    category: 'homeSonan',
  },
  {
    id: 'home_7',
    arabic: 'الاستئذان ثلاثاً قبل الدخول وعدم الدخول بغير إذن',
    transliteration: 'Al-isti\'dhan thalathan qabl ad-dukhul',
    source: 'Al-Bukhari',
    category: 'homeSonan',
  },
  {
    id: 'home_8',
    arabic: 'عدم الاطلاع في بيوت الغير بغير إذن',
    transliteration: 'Adam al-ittila\' fi buyut al-ghayr bila idhn',
    source: 'Muslim',
    category: 'homeSonan',
  },
  {
    id: 'home_9',
    arabic: 'صلاة ركعتين عند العودة من السفر تحية للمنزل',
    transliteration: 'Salat rak\'atayn ind al-awdah min as-safar',
    source: 'Al-Bukhari',
    category: 'homeSonan',
  },
  {
    id: 'home_10',
    arabic: 'إحكام إغلاق الأبواب عند الليل وذكر اسم الله',
    transliteration: 'Ihkam ighlaq al-abwab ind al-layl wa dhikr ism Allah',
    source: 'Al-Bukhari',
    category: 'homeSonan',
  },
];

// ─── Islamic Life Advice ──────────────────────────────────────────────────────
const advices: ContentItem[] = [
  {
    id: 'advice_1',
    arabic: 'لا تغضب، ولك الجنة — وصية النبي ﷺ لمن سأله النصيحة',
    transliteration: 'La taghdab wa lakal-jannah',
    source: 'At-Tirmidhi',
    category: 'advices',
  },
  {
    id: 'advice_2',
    arabic: 'من حسن إسلام المرء تركه ما لا يعنيه',
    transliteration: 'Min husun islami-l-mar\'i tarkuhu ma la ya\'nihi',
    source: 'At-Tirmidhi',
    category: 'advices',
  },
  {
    id: 'advice_3',
    arabic: 'الكلمة الطيبة صدقة، والسلام على من لقيت صدقة، وإرشاد الضال صدقة',
    transliteration: 'Al-kalimah at-tayyibah sadaqah',
    source: 'Muslim',
    category: 'advices',
  },
  {
    id: 'advice_4',
    arabic: 'لا تحقرن من المعروف شيئاً ولو أن تلقى أخاك بوجه طليق',
    transliteration: 'La tahqiran minal-ma\'ruf shay\'an wa law an talqa akhaka bi-wajhin taliq',
    source: 'Muslim',
    category: 'advices',
  },
  {
    id: 'advice_5',
    arabic: 'الرحمة لا تُنزع إلا من شقيّ، فارحم من في الأرض يرحمك من في السماء',
    transliteration: 'Ar-rahmah la tunza\'u illa min shaqi',
    source: 'At-Tirmidhi',
    category: 'advices',
  },
  {
    id: 'advice_6',
    arabic: 'احذر من الغضب، فإن الغضب يفسد النية ويذهب البركة',
    transliteration: 'Ihthadir mina-l-ghadab',
    source: 'Hasan Hadith',
    category: 'advices',
  },
  {
    id: 'advice_7',
    arabic: 'إماطة الأذى عن الطريق صدقة، وبيانك عن الأعمى صدقة',
    transliteration: 'Imalat al-adha \'an at-tariq sadaqah',
    source: 'Al-Bukhari',
    category: 'advices',
  },
  {
    id: 'advice_8',
    arabic: 'ابتسامتك في وجه أخيك صدقة، وإعانتك الضعيف صدقة',
    transliteration: 'Ibtisamatuka fi wajhi akhika sadaqah',
    source: 'At-Tirmidhi',
    category: 'advices',
  },
  {
    id: 'advice_9',
    arabic: 'البر حسن الخلق، والإثم ما حاك في نفسك وكرهت أن يطلع عليه الناس',
    transliteration: 'Al-birr husn al-khuluq',
    source: 'Muslim',
    category: 'advices',
  },
  {
    id: 'advice_10',
    arabic: 'أحب للناس ما تحب لنفسك تكن مؤمناً، وأحسن جوار من جاورك تكن مسلماً',
    transliteration: 'Ahib lin-nasi ma tuhibbu li-nafsika takun mu\'minan',
    source: 'Ibn Majah',
    category: 'advices',
  },
];

// ─── Marriage Advice ──────────────────────────────────────────────────────────
const marriageAdvice: ContentItem[] = [
  {
    id: 'marriage_1',
    arabic: 'خيركم خيركم لأهله، وأنا خيركم لأهلي',
    transliteration: 'Khayrukum khayrukum li-ahlihi wa ana khayrukum li-ahli',
    source: 'At-Tirmidhi',
    category: 'marriageAdvice',
  },
  {
    id: 'marriage_2',
    arabic: 'أكمل المؤمنين إيماناً أحسنهم خلقاً، وخياركم خياركم لنسائهم',
    transliteration: 'Akmal al-mu\'minina imanan ahsanuhum khuluqan',
    source: 'At-Tirmidhi',
    category: 'marriageAdvice',
  },
  {
    id: 'marriage_3',
    arabic: 'الدنيا متاع وخير متاعها المرأة الصالحة التي تسرك إذا نظرت إليها',
    transliteration: 'Ad-dunya mata\' wa khayru mata\'iha al-mar\'ah as-saliha',
    source: 'Muslim',
    category: 'marriageAdvice',
  },
  {
    id: 'marriage_4',
    arabic: 'تزوجوا الودود الولود، فإني مكاثر بكم الأمم',
    transliteration: 'Tazawwaju al-wadud al-walud',
    source: 'Abu Dawud',
    category: 'marriageAdvice',
  },
  {
    id: 'marriage_5',
    arabic: 'انظر إليها فإنه أحرى أن يؤدم بينكما',
    transliteration: 'Undhur ilayha fa-innahu ahra an yu\'dama baynakuma',
    source: 'At-Tirmidhi',
    category: 'marriageAdvice',
  },
  {
    id: 'marriage_6',
    arabic: 'وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ ۚ فَإِن كَرِهْتُمُوهُنَّ فَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَيَجْعَلَ اللَّهُ فِيهِ خَيْرًا كَثِيرًا',
    source: 'القرآن الكريم — النساء: 19',
    category: 'marriageAdvice',
  },
  {
    id: 'marriage_7',
    arabic: 'هُنَّ لِبَاسٌ لَّكُمْ وَأَنتُمْ لِبَاسٌ لَّهُنَّ',
    source: 'القرآن الكريم — البقرة: 187',
    category: 'marriageAdvice',
  },
  {
    id: 'marriage_8',
    arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    source: 'القرآن الكريم — الروم: 21',
    category: 'marriageAdvice',
  },
  {
    id: 'marriage_9',
    arabic: 'الرجل راعٍ في أهله ومسؤول عن رعيته، والمرأة راعية في بيت زوجها',
    transliteration: 'Ar-rajul ra\'in fi ahlihi wa mas\'ulun an ra\'iyyatihi',
    source: 'Al-Bukhari',
    category: 'marriageAdvice',
  },
  {
    id: 'marriage_10',
    arabic: 'وَلَهُنَّ مِثْلُ الَّذِي عَلَيْهِنَّ بِالْمَعْرُوفِ ۚ وَلِلرِّجَالِ عَلَيْهِنَّ دَرَجَةٌ',
    source: 'القرآن الكريم — البقرة: 228',
    category: 'marriageAdvice',
  },
];

// ─── Wife Tips ────────────────────────────────────────────────────────────────
const wifeTips: ContentItem[] = [
  {
    id: 'wife_1',
    arabic: 'خيركم خيركم لأهله، وأنا خيركم لأهلي',
    transliteration: 'Khayrukum khayrukum li-ahlihi',
    source: 'At-Tirmidhi',
    category: 'wifeTips',
  },
  {
    id: 'wife_2',
    arabic: 'استوصوا بالنساء خيراً فإن النساء عندكم عوانٍ لا يملكن لأنفسهن شيئاً',
    transliteration: 'Istawsu bin-nisa\' khayran',
    source: 'At-Tirmidhi',
    category: 'wifeTips',
  },
  {
    id: 'wife_3',
    arabic: 'أكمل المؤمنين إيماناً أحسنهم خلقاً، وخياركم خياركم لنسائهم',
    transliteration: 'Akmal al-mu\'minina imanan ahsanuhum khuluqan',
    source: 'At-Tirmidhi',
    category: 'wifeTips',
  },
  {
    id: 'wife_4',
    arabic: 'النساء شقائق الرجال في الحقوق والواجبات الشرعية',
    transliteration: 'An-nisa\' shaqa\'iq ar-rijal',
    source: 'Abu Dawud',
    category: 'wifeTips',
  },
  {
    id: 'wife_5',
    arabic: 'لا يفرك مؤمن مؤمنة، إن كره منها خلقاً رضي منها آخر',
    transliteration: 'La yafrak mu\'minun mu\'minatan, in kariha minha khuluqan radia minha akhar',
    source: 'Muslim',
    category: 'wifeTips',
  },
  {
    id: 'wife_6',
    arabic: 'من أنفق نفقة على أهله يحتسبها فهي له صدقة',
    transliteration: 'Man anfaqa nafaqatan ala ahlihi yahtasibuha fa-hiya lahu sadaqah',
    source: 'Al-Bukhari',
    category: 'wifeTips',
  },
  {
    id: 'wife_7',
    arabic: 'فاتقوا الله في النساء فإنكم أخذتموهن بأمان الله',
    transliteration: 'Fattaqullaha fin-nisa\' fa-innakum akhadhtumuhunna bi-amanillah',
    source: 'Muslim',
    category: 'wifeTips',
  },
  {
    id: 'wife_8',
    arabic: 'وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ ۚ فَإِن كَرِهْتُمُوهُنَّ فَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَيَجْعَلَ اللَّهُ فِيهِ خَيْرًا كَثِيرًا',
    source: 'القرآن الكريم — النساء: 19',
    category: 'wifeTips',
  },
  {
    id: 'wife_9',
    arabic: 'إن الله يوصيكم بالنساء خيراً، فإنهن أمهاتكم وبناتكم وعماتكم وخالاتكم',
    transliteration: 'Innallaha yusikum bin-nisa\' khayran',
    source: 'Ibn Majah',
    category: 'wifeTips',
  },
  {
    id: 'wife_10',
    arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    source: 'القرآن الكريم — الروم: 21',
    category: 'wifeTips',
  },
];

export const contentData = {
  morningAdhkar,
  eveningAdhkar,
  sleepAdhkar,
  afterPrayerAdhkar,
  dailySonan,
  eatingSonan,
  sleepingSonan,
  homeSonan,
  advices,
  marriageAdvice,
  wifeTips,
};

export type ContentCategory = keyof typeof contentData;
