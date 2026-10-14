import type { Locale } from "./i18n";

// Copy for /android (the Google Play closed-test signup). English is the source;
// a missing locale falls back to it.

export interface AndroidBetaCopy {
  metaTitle: string;
  /** Hero button on the landing, next to the App Store button. */
  heroCta: string;
  metaDescription: string;
  eyebrow: string;
  title1: string;
  title2: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailHint: string;
  deviceLabel: string;
  devicePlaceholder: string;
  submit: string;
  submitting: string;
  errInvalid: string;
  errGeneric: string;
  privacyNote: string;
  successTitle: string;
  successBody: string;
  successAlready: string;
  successTg: string;
  progressTitle: string;
  progressBody: string;
  progressCount: string;
  statTesters: string;
  statDays: string;
  stepsEyebrow: string;
  stepsTitle: string;
  steps: { title: string; body: string }[];
  perksEyebrow: string;
  perksTitle: string;
  perks: { title: string; body: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  bottomTitle: string;
  bottomBody: string;
  bottomCta: string;
  tgCta: string;
}

const en: AndroidBetaCopy = {
  heroCta: "Join the Android beta",
  metaTitle: "Lumi for Android — join the beta",
  metaDescription:
    "Lumi is coming to Android. Leave your Google account email to get early access to the closed beta on Google Play and help shape the app.",
  eyebrow: "Android beta",
  title1: "Lumi is coming to Android.",
  title2: "Try it before anyone else.",
  subtitle:
    "The same fast, private expense tracker iPhone users love — rebuilt natively for Android. Leave your Google account email and we'll invite you to the closed beta on Google Play.",
  emailLabel: "Your Google account email",
  emailPlaceholder: "you@gmail.com",
  emailHint: "Use the account you're signed in with in the Play Store on your phone — otherwise the invite won't work.",
  deviceLabel: "Your phone (optional)",
  devicePlaceholder: "e.g. Pixel 8, Galaxy S24",
  submit: "Join the beta",
  submitting: "Sending…",
  errInvalid: "That doesn't look like an email address.",
  errGeneric: "Something went wrong. Please try again in a minute.",
  privacyNote: "We use your email only to invite you to the test and to write about the beta. No spam, no sharing.",
  successTitle: "You're on the list!",
  successBody:
    "We'll add your account to the tester list on Google Play and email you the invite link. Open it on your phone, tap “Become a tester” and install Lumi.",
  successAlready: "This email is already on the list — no need to sign up again. Your invite is on its way.",
  successTg: "Follow updates on Telegram",
  progressTitle: "Help us reach the Play Store",
  progressBody:
    "Google lets a new app go public only after at least 12 testers have used it for 14 days in a row. Every tester gets Lumi closer to launch.",
  progressCount: "{n} people have already joined",
  statTesters: "testers",
  statDays: "days in a row",
  stepsEyebrow: "How it works",
  stepsTitle: "Three steps, two minutes",
  steps: [
    {
      title: "Leave your Google email",
      body: "The one your Android phone uses for the Play Store. Google only lets accounts on the tester list install a closed beta.",
    },
    {
      title: "Accept the invite",
      body: "We'll email you a link. Open it on your phone, tap “Become a tester”, then install Lumi from Google Play like any other app.",
    },
    {
      title: "Use it for two weeks",
      body: "Log your spending as usual and keep the app installed for at least 14 days. Found a bug or have an idea? Tell us — we read everything.",
    },
  ],
  perksEyebrow: "Why join",
  perksTitle: "What you get as a beta tester",
  perks: [
    { title: "Early access", body: "Use Lumi on Android weeks before it appears in the Play Store." },
    { title: "A direct line to the founder", body: "Your feedback goes straight to the person building the app, not a support queue." },
    { title: "Shape the app", body: "What testers ask for gets prioritized — the Android version is still being polished." },
    { title: "Same privacy", body: "No bank login, your data stays on your phone. Exactly like on iPhone." },
  ],
  faqTitle: "Questions",
  faq: [
    {
      q: "Why do you need my Google account email?",
      a: "Google Play distributes closed betas only to accounts on the developer's tester list. Your email is how we add you to that list. It must be the account signed in to the Play Store on your phone — a Gmail address or any email registered as a Google account.",
    },
    {
      q: "When will I get access?",
      a: "We add testers in batches and email you as soon as your account is on the list. After that, the app shows up in Google Play within a few minutes to a few hours.",
    },
    {
      q: "Why 14 days?",
      a: "It's a Google Play rule for new apps: at least 12 testers have to keep the app installed for 14 days in a row before it can be published. If you uninstall early, the count drops — so please keep it for two weeks.",
    },
    {
      q: "Is it the same as the iPhone app?",
      a: "Same design, same features, built natively for Android. A few things that rely on iOS — Back Tap and Apple Pay import — work differently or aren't available yet.",
    },
    {
      q: "Is the beta free?",
      a: "Yes, joining the beta costs nothing.",
    },
    {
      q: "Can I leave the beta?",
      a: "Any time. Open the invite link again and tap “Leave the program”, or email us and we'll remove your address.",
    },
  ],
  bottomTitle: "On iPhone? Lumi is already there.",
  bottomBody: "Download it from the App Store — free, no bank login.",
  bottomCta: "Back to top",
  tgCta: "Telegram channel",
};

const ru: AndroidBetaCopy = {
  heroCta: "Бета для Android",
  metaTitle: "Lumi для Android — бета-тест",
  metaDescription:
    "Lumi выходит на Android. Оставьте почту Google-аккаунта, чтобы получить ранний доступ к закрытой бете в Google Play и повлиять на приложение.",
  eyebrow: "Бета для Android",
  title1: "Lumi выходит на Android.",
  title2: "Попробуйте раньше всех.",
  subtitle:
    "Тот же быстрый и приватный трекер расходов, что и на iPhone, — заново собранный нативно под Android. Оставьте почту Google-аккаунта, и мы пригласим вас в закрытую бету в Google Play.",
  emailLabel: "Почта вашего Google-аккаунта",
  emailPlaceholder: "you@gmail.com",
  emailHint: "Укажите аккаунт, под которым вы вошли в Play Маркет на телефоне, — иначе приглашение не сработает.",
  deviceLabel: "Ваш телефон (необязательно)",
  devicePlaceholder: "например, Pixel 8, Galaxy S24",
  submit: "Хочу в бету",
  submitting: "Отправляем…",
  errInvalid: "Похоже, это не адрес почты.",
  errGeneric: "Что-то пошло не так. Попробуйте ещё раз через минуту.",
  privacyNote: "Почта нужна только для приглашения в тест и новостей о бете. Без спама и передачи третьим лицам.",
  successTitle: "Вы в списке!",
  successBody:
    "Мы добавим ваш аккаунт в список тестировщиков Google Play и пришлём ссылку-приглашение. Откройте её на телефоне, нажмите «Стать тестировщиком» и установите Lumi.",
  successAlready: "Эта почта уже в списке — повторно записываться не нужно. Приглашение скоро придёт.",
  successTg: "Следить за новостями в Telegram",
  progressTitle: "Помогите нам попасть в Google Play",
  progressBody:
    "Google публикует новое приложение только после того, как минимум 12 тестировщиков пользуются им 14 дней подряд. Каждый тестировщик приближает запуск.",
  progressCount: "Уже присоединились: {n}",
  statTesters: "тестировщиков",
  statDays: "дней подряд",
  stepsEyebrow: "Как это работает",
  stepsTitle: "Три шага, две минуты",
  steps: [
    {
      title: "Оставьте почту Google",
      body: "Ту, что используется в Play Маркете на вашем Android. Закрытую бету могут установить только аккаунты из списка тестировщиков.",
    },
    {
      title: "Примите приглашение",
      body: "Мы пришлём ссылку на почту. Откройте её на телефоне, нажмите «Стать тестировщиком» и установите Lumi из Google Play как обычное приложение.",
    },
    {
      title: "Пользуйтесь две недели",
      body: "Записывайте расходы как обычно и не удаляйте приложение минимум 14 дней. Нашли баг или есть идея? Напишите — мы читаем всё.",
    },
  ],
  perksEyebrow: "Зачем участвовать",
  perksTitle: "Что получают бета-тестировщики",
  perks: [
    { title: "Ранний доступ", body: "Lumi на Android за несколько недель до появления в Google Play." },
    { title: "Прямая связь с автором", body: "Ваш отзыв попадает напрямую к тому, кто делает приложение, а не в очередь поддержки." },
    { title: "Влияние на приложение", body: "Просьбы тестировщиков идут в приоритет — Android-версию ещё шлифуем." },
    { title: "Та же приватность", body: "Без входа в банк, данные остаются на телефоне. Ровно как на iPhone." },
  ],
  faqTitle: "Вопросы",
  faq: [
    {
      q: "Зачем нужна почта Google-аккаунта?",
      a: "Google Play раздаёт закрытую бету только аккаунтам из списка тестировщиков разработчика. По вашей почте мы добавляем вас в этот список. Это должен быть аккаунт, под которым вы вошли в Play Маркет на телефоне, — Gmail или любая почта, зарегистрированная как Google-аккаунт.",
    },
    {
      q: "Когда я получу доступ?",
      a: "Мы добавляем тестировщиков партиями и пишем вам, как только аккаунт окажется в списке. После этого приложение появляется в Google Play в течение от нескольких минут до нескольких часов.",
    },
    {
      q: "Почему 14 дней?",
      a: "Это правило Google Play для новых приложений: минимум 12 тестировщиков должны держать приложение установленным 14 дней подряд, прежде чем его можно опубликовать. Если удалить раньше, счётчик падает — поэтому, пожалуйста, оставьте его на две недели.",
    },
    {
      q: "Это то же самое, что на iPhone?",
      a: "Тот же дизайн и те же функции, собранные нативно под Android. Пара вещей, завязанных на iOS, — Back Tap и импорт Apple Pay — работают иначе или пока недоступны.",
    },
    { q: "Бета бесплатная?", a: "Да, участие в бете ничего не стоит." },
    {
      q: "Можно выйти из беты?",
      a: "В любой момент. Откройте ссылку-приглашение и нажмите «Покинуть программу» или напишите нам — удалим вашу почту.",
    },
  ],
  bottomTitle: "У вас iPhone? Lumi уже там.",
  bottomBody: "Скачайте в App Store — бесплатно, без входа в банк.",
  bottomCta: "Наверх",
  tgCta: "Telegram-канал",
};

const uk: AndroidBetaCopy = {
  heroCta: "Бета для Android",
  metaTitle: "Lumi для Android — бета-тест",
  metaDescription:
    "Lumi виходить на Android. Залиште пошту Google-акаунта, щоб отримати ранній доступ до закритої бети в Google Play і вплинути на застосунок.",
  eyebrow: "Бета для Android",
  title1: "Lumi виходить на Android.",
  title2: "Спробуйте раніше за всіх.",
  subtitle:
    "Той самий швидкий і приватний трекер витрат, що й на iPhone, — заново зібраний нативно під Android. Залиште пошту Google-акаунта, і ми запросимо вас до закритої бети в Google Play.",
  emailLabel: "Пошта вашого Google-акаунта",
  emailPlaceholder: "you@gmail.com",
  emailHint: "Вкажіть акаунт, під яким ви увійшли в Play Маркет на телефоні, — інакше запрошення не спрацює.",
  deviceLabel: "Ваш телефон (необов'язково)",
  devicePlaceholder: "наприклад, Pixel 8, Galaxy S24",
  submit: "Хочу в бету",
  submitting: "Надсилаємо…",
  errInvalid: "Схоже, це не адреса пошти.",
  errGeneric: "Щось пішло не так. Спробуйте ще раз за хвилину.",
  privacyNote: "Пошта потрібна лише для запрошення в тест і новин про бету. Без спаму й передачі третім особам.",
  successTitle: "Ви в списку!",
  successBody:
    "Ми додамо ваш акаунт до списку тестувальників Google Play і надішлемо посилання-запрошення. Відкрийте його на телефоні, натисніть «Стати тестувальником» і встановіть Lumi.",
  successAlready: "Ця пошта вже в списку — повторно записуватися не потрібно. Запрошення скоро прийде.",
  successTg: "Стежити за новинами в Telegram",
  progressTitle: "Допоможіть нам потрапити в Google Play",
  progressBody:
    "Google публікує новий застосунок лише після того, як щонайменше 12 тестувальників користуються ним 14 днів поспіль. Кожен тестувальник наближає запуск.",
  progressCount: "Вже приєдналися: {n}",
  statTesters: "тестувальників",
  statDays: "днів поспіль",
  stepsEyebrow: "Як це працює",
  stepsTitle: "Три кроки, дві хвилини",
  steps: [
    {
      title: "Залиште пошту Google",
      body: "Ту, що використовується в Play Маркеті на вашому Android. Закриту бету можуть встановити лише акаунти зі списку тестувальників.",
    },
    {
      title: "Прийміть запрошення",
      body: "Ми надішлемо посилання на пошту. Відкрийте його на телефоні, натисніть «Стати тестувальником» і встановіть Lumi з Google Play як звичайний застосунок.",
    },
    {
      title: "Користуйтеся два тижні",
      body: "Записуйте витрати як зазвичай і не видаляйте застосунок щонайменше 14 днів. Знайшли баг чи маєте ідею? Напишіть — ми читаємо все.",
    },
  ],
  perksEyebrow: "Навіщо брати участь",
  perksTitle: "Що отримують бета-тестувальники",
  perks: [
    { title: "Ранній доступ", body: "Lumi на Android за кілька тижнів до появи в Google Play." },
    { title: "Прямий зв'язок з автором", body: "Ваш відгук потрапляє напряму до того, хто робить застосунок, а не в чергу підтримки." },
    { title: "Вплив на застосунок", body: "Прохання тестувальників ідуть у пріоритет — Android-версію ще шліфуємо." },
    { title: "Та сама приватність", body: "Без входу в банк, дані залишаються на телефоні. Так само, як на iPhone." },
  ],
  faqTitle: "Питання",
  faq: [
    {
      q: "Навіщо потрібна пошта Google-акаунта?",
      a: "Google Play роздає закриту бету лише акаунтам зі списку тестувальників розробника. За вашою поштою ми додаємо вас до цього списку. Це має бути акаунт, під яким ви увійшли в Play Маркет на телефоні, — Gmail або будь-яка пошта, зареєстрована як Google-акаунт.",
    },
    {
      q: "Коли я отримаю доступ?",
      a: "Ми додаємо тестувальників партіями й пишемо вам, щойно акаунт опиниться в списку. Після цього застосунок з'являється в Google Play протягом від кількох хвилин до кількох годин.",
    },
    {
      q: "Чому 14 днів?",
      a: "Це правило Google Play для нових застосунків: щонайменше 12 тестувальників мають тримати застосунок встановленим 14 днів поспіль, перш ніж його можна опублікувати. Якщо видалити раніше, лічильник падає — тож, будь ласка, залиште його на два тижні.",
    },
    {
      q: "Це те саме, що на iPhone?",
      a: "Той самий дизайн і ті самі функції, зібрані нативно під Android. Кілька речей, прив'язаних до iOS, — Back Tap та імпорт Apple Pay — працюють інакше або поки недоступні.",
    },
    { q: "Бета безкоштовна?", a: "Так, участь у беті нічого не коштує." },
    {
      q: "Чи можна вийти з бети?",
      a: "Будь-коли. Відкрийте посилання-запрошення й натисніть «Залишити програму» або напишіть нам — видалимо вашу пошту.",
    },
  ],
  bottomTitle: "Маєте iPhone? Lumi вже там.",
  bottomBody: "Завантажте в App Store — безкоштовно, без входу в банк.",
  bottomCta: "Нагору",
  tgCta: "Telegram-канал",
};

const ro: AndroidBetaCopy = {
  heroCta: "Beta pentru Android",
  metaTitle: "Lumi pentru Android — înscrie-te în beta",
  metaDescription:
    "Lumi vine pe Android. Lasă emailul contului Google pentru acces timpuriu la beta închisă din Google Play și ajută-ne să modelăm aplicația.",
  eyebrow: "Beta Android",
  title1: "Lumi vine pe Android.",
  title2: "Încearcă-l înaintea tuturor.",
  subtitle:
    "Același tracker de cheltuieli rapid și privat pe care îl folosesc utilizatorii de iPhone — reconstruit nativ pentru Android. Lasă emailul contului Google și te invităm în beta închisă din Google Play.",
  emailLabel: "Emailul contului tău Google",
  emailPlaceholder: "tu@gmail.com",
  emailHint: "Folosește contul cu care ești conectat în Play Store pe telefon — altfel invitația nu va funcționa.",
  deviceLabel: "Telefonul tău (opțional)",
  devicePlaceholder: "ex. Pixel 8, Galaxy S24",
  submit: "Intră în beta",
  submitting: "Se trimite…",
  errInvalid: "Nu pare a fi o adresă de email.",
  errGeneric: "Ceva n-a mers. Încearcă din nou peste un minut.",
  privacyNote: "Folosim emailul doar pentru invitația la test și noutăți despre beta. Fără spam, fără partajare.",
  successTitle: "Ești pe listă!",
  successBody:
    "Îți adăugăm contul în lista de testeri din Google Play și îți trimitem linkul de invitație. Deschide-l pe telefon, apasă „Devino tester” și instalează Lumi.",
  successAlready: "Acest email e deja pe listă — nu trebuie să te înscrii din nou. Invitația e pe drum.",
  successTg: "Urmărește noutățile pe Telegram",
  progressTitle: "Ajută-ne să ajungem în Google Play",
  progressBody:
    "Google publică o aplicație nouă doar după ce cel puțin 12 testeri au folosit-o 14 zile la rând. Fiecare tester apropie lansarea.",
  progressCount: "S-au alăturat deja: {n}",
  statTesters: "testeri",
  statDays: "zile la rând",
  stepsEyebrow: "Cum funcționează",
  stepsTitle: "Trei pași, două minute",
  steps: [
    {
      title: "Lasă emailul Google",
      body: "Cel folosit în Play Store pe telefonul tău Android. Doar conturile din lista de testeri pot instala o beta închisă.",
    },
    {
      title: "Acceptă invitația",
      body: "Îți trimitem un link pe email. Deschide-l pe telefon, apasă „Devino tester”, apoi instalează Lumi din Google Play ca pe orice aplicație.",
    },
    {
      title: "Folosește-l două săptămâni",
      body: "Notează-ți cheltuielile ca de obicei și păstrează aplicația instalată cel puțin 14 zile. Ai găsit un bug sau ai o idee? Scrie-ne — citim tot.",
    },
  ],
  perksEyebrow: "De ce să participi",
  perksTitle: "Ce primești ca beta tester",
  perks: [
    { title: "Acces timpuriu", body: "Lumi pe Android cu săptămâni înainte să apară în Google Play." },
    { title: "Legătură directă cu fondatorul", body: "Feedbackul tău ajunge direct la cel care construiește aplicația, nu într-o coadă de suport." },
    { title: "Modelezi aplicația", body: "Cererile testerilor au prioritate — versiunea Android încă e șlefuită." },
    { title: "Aceeași confidențialitate", body: "Fără login bancar, datele rămân pe telefon. Exact ca pe iPhone." },
  ],
  faqTitle: "Întrebări",
  faq: [
    {
      q: "De ce aveți nevoie de emailul contului Google?",
      a: "Google Play distribuie beta închise doar conturilor din lista de testeri a dezvoltatorului. Prin emailul tău te adăugăm în acea listă. Trebuie să fie contul conectat în Play Store pe telefon — o adresă Gmail sau orice email înregistrat ca cont Google.",
    },
    {
      q: "Când primesc acces?",
      a: "Adăugăm testeri pe loturi și îți scriem imediat ce contul tău e pe listă. După aceea, aplicația apare în Google Play în câteva minute până la câteva ore.",
    },
    {
      q: "De ce 14 zile?",
      a: "E o regulă Google Play pentru aplicațiile noi: cel puțin 12 testeri trebuie să păstreze aplicația instalată 14 zile la rând înainte de publicare. Dacă o dezinstalezi mai devreme, numărul scade — așa că te rugăm s-o păstrezi două săptămâni.",
    },
    {
      q: "E la fel ca aplicația de iPhone?",
      a: "Același design, aceleași funcții, construite nativ pentru Android. Câteva lucruri care depind de iOS — Back Tap și importul Apple Pay — funcționează diferit sau nu sunt încă disponibile.",
    },
    { q: "Beta e gratuită?", a: "Da, înscrierea în beta nu costă nimic." },
    {
      q: "Pot ieși din beta?",
      a: "Oricând. Deschide din nou linkul de invitație și apasă „Părăsește programul” sau scrie-ne și îți ștergem adresa.",
    },
  ],
  bottomTitle: "Ai iPhone? Lumi e deja acolo.",
  bottomBody: "Descarcă-l din App Store — gratuit, fără login bancar.",
  bottomCta: "Sus",
  tgCta: "Canal Telegram",
};

const de: AndroidBetaCopy = {
  heroCta: "Android-Beta testen",
  metaTitle: "Lumi für Android — jetzt an der Beta teilnehmen",
  metaDescription:
    "Lumi kommt auf Android. Hinterlasse die E-Mail deines Google-Kontos, um früh Zugang zur geschlossenen Beta bei Google Play zu bekommen und die App mitzugestalten.",
  eyebrow: "Android-Beta",
  title1: "Lumi kommt auf Android.",
  title2: "Teste es vor allen anderen.",
  subtitle:
    "Derselbe schnelle, private Ausgaben-Tracker, den iPhone-Nutzer lieben — nativ für Android neu gebaut. Hinterlasse die E-Mail deines Google-Kontos und wir laden dich zur geschlossenen Beta bei Google Play ein.",
  emailLabel: "E-Mail deines Google-Kontos",
  emailPlaceholder: "du@gmail.com",
  emailHint: "Nutze das Konto, mit dem du auf deinem Handy im Play Store angemeldet bist — sonst funktioniert die Einladung nicht.",
  deviceLabel: "Dein Handy (optional)",
  devicePlaceholder: "z. B. Pixel 8, Galaxy S24",
  submit: "Zur Beta anmelden",
  submitting: "Wird gesendet…",
  errInvalid: "Das sieht nicht nach einer E-Mail-Adresse aus.",
  errGeneric: "Etwas ist schiefgelaufen. Bitte versuche es in einer Minute erneut.",
  privacyNote: "Wir nutzen deine E-Mail nur für die Test-Einladung und Neuigkeiten zur Beta. Kein Spam, keine Weitergabe.",
  successTitle: "Du bist auf der Liste!",
  successBody:
    "Wir fügen dein Konto zur Testerliste bei Google Play hinzu und schicken dir den Einladungslink. Öffne ihn auf dem Handy, tippe auf „Tester werden“ und installiere Lumi.",
  successAlready: "Diese E-Mail ist schon auf der Liste — du musst dich nicht erneut anmelden. Deine Einladung ist unterwegs.",
  successTg: "Neuigkeiten auf Telegram folgen",
  progressTitle: "Hilf uns in den Play Store",
  progressBody:
    "Google veröffentlicht eine neue App erst, wenn mindestens 12 Tester sie 14 Tage am Stück genutzt haben. Jeder Tester bringt Lumi dem Launch näher.",
  progressCount: "Bereits dabei: {n}",
  statTesters: "Tester",
  statDays: "Tage am Stück",
  stepsEyebrow: "So funktioniert's",
  stepsTitle: "Drei Schritte, zwei Minuten",
  steps: [
    {
      title: "Google-E-Mail eintragen",
      body: "Die, die dein Android-Handy für den Play Store nutzt. Nur Konten auf der Testerliste können eine geschlossene Beta installieren.",
    },
    {
      title: "Einladung annehmen",
      body: "Wir schicken dir einen Link per E-Mail. Öffne ihn auf dem Handy, tippe auf „Tester werden“ und installiere Lumi wie jede andere App aus Google Play.",
    },
    {
      title: "Zwei Wochen nutzen",
      body: "Erfasse deine Ausgaben wie gewohnt und lass die App mindestens 14 Tage installiert. Bug gefunden oder eine Idee? Schreib uns — wir lesen alles.",
    },
  ],
  perksEyebrow: "Warum mitmachen",
  perksTitle: "Was du als Beta-Tester bekommst",
  perks: [
    { title: "Früher Zugang", body: "Lumi auf Android, Wochen bevor es im Play Store erscheint." },
    { title: "Direkter Draht zum Gründer", body: "Dein Feedback landet direkt bei dem, der die App baut — nicht in einer Support-Warteschlange." },
    { title: "Gestalte die App mit", body: "Wünsche von Testern haben Vorrang — die Android-Version wird noch verfeinert." },
    { title: "Gleicher Datenschutz", body: "Kein Bank-Login, deine Daten bleiben auf dem Handy. Genau wie auf dem iPhone." },
  ],
  faqTitle: "Fragen",
  faq: [
    {
      q: "Warum braucht ihr die E-Mail meines Google-Kontos?",
      a: "Google Play verteilt geschlossene Betas nur an Konten auf der Testerliste des Entwicklers. Über deine E-Mail tragen wir dich dort ein. Es muss das Konto sein, mit dem du im Play Store auf dem Handy angemeldet bist — eine Gmail-Adresse oder jede als Google-Konto registrierte E-Mail.",
    },
    {
      q: "Wann bekomme ich Zugang?",
      a: "Wir fügen Tester in Gruppen hinzu und schreiben dir, sobald dein Konto auf der Liste ist. Danach erscheint die App innerhalb von Minuten bis wenigen Stunden in Google Play.",
    },
    {
      q: "Warum 14 Tage?",
      a: "Das ist eine Google-Play-Regel für neue Apps: Mindestens 12 Tester müssen die App 14 Tage am Stück installiert haben, bevor sie veröffentlicht werden kann. Deinstallierst du früher, sinkt die Zahl — bitte behalte sie also zwei Wochen.",
    },
    {
      q: "Ist es dasselbe wie die iPhone-App?",
      a: "Gleiches Design, gleiche Funktionen, nativ für Android gebaut. Einiges, das von iOS abhängt — Back Tap und Apple-Pay-Import — funktioniert anders oder ist noch nicht verfügbar.",
    },
    { q: "Ist die Beta kostenlos?", a: "Ja, die Teilnahme an der Beta kostet nichts." },
    {
      q: "Kann ich die Beta verlassen?",
      a: "Jederzeit. Öffne den Einladungslink erneut und tippe auf „Programm verlassen“ oder schreib uns, dann löschen wir deine Adresse.",
    },
  ],
  bottomTitle: "Du hast ein iPhone? Dort gibt es Lumi schon.",
  bottomBody: "Lade es im App Store — kostenlos, ohne Bank-Login.",
  bottomCta: "Nach oben",
  tgCta: "Telegram-Kanal",
};

const es: AndroidBetaCopy = {
  heroCta: "Beta de Android",
  metaTitle: "Lumi para Android — únete a la beta",
  metaDescription:
    "Lumi llega a Android. Deja el email de tu cuenta de Google para tener acceso anticipado a la beta cerrada en Google Play y ayudar a dar forma a la app.",
  eyebrow: "Beta de Android",
  title1: "Lumi llega a Android.",
  title2: "Pruébalo antes que nadie.",
  subtitle:
    "El mismo control de gastos rápido y privado que usan en iPhone, reconstruido de forma nativa para Android. Deja el email de tu cuenta de Google y te invitamos a la beta cerrada en Google Play.",
  emailLabel: "Email de tu cuenta de Google",
  emailPlaceholder: "tu@gmail.com",
  emailHint: "Usa la cuenta con la que inicias sesión en Play Store en tu móvil; si no, la invitación no funcionará.",
  deviceLabel: "Tu móvil (opcional)",
  devicePlaceholder: "p. ej. Pixel 8, Galaxy S24",
  submit: "Unirme a la beta",
  submitting: "Enviando…",
  errInvalid: "Eso no parece una dirección de email.",
  errGeneric: "Algo salió mal. Vuelve a intentarlo en un minuto.",
  privacyNote: "Usamos tu email solo para invitarte a la prueba y contarte novedades de la beta. Sin spam, sin compartirlo.",
  successTitle: "¡Estás en la lista!",
  successBody:
    "Añadiremos tu cuenta a la lista de testers de Google Play y te enviaremos el enlace de invitación. Ábrelo en el móvil, toca «Convertirse en tester» e instala Lumi.",
  successAlready: "Este email ya está en la lista; no hace falta apuntarse otra vez. Tu invitación está en camino.",
  successTg: "Sigue las novedades en Telegram",
  progressTitle: "Ayúdanos a llegar a Google Play",
  progressBody:
    "Google solo publica una app nueva cuando al menos 12 testers la han usado 14 días seguidos. Cada tester acerca el lanzamiento.",
  progressCount: "Ya se han unido: {n}",
  statTesters: "testers",
  statDays: "días seguidos",
  stepsEyebrow: "Cómo funciona",
  stepsTitle: "Tres pasos, dos minutos",
  steps: [
    {
      title: "Deja tu email de Google",
      body: "El que usa tu Android para Play Store. Solo las cuentas de la lista de testers pueden instalar una beta cerrada.",
    },
    {
      title: "Acepta la invitación",
      body: "Te enviaremos un enlace por email. Ábrelo en el móvil, toca «Convertirse en tester» e instala Lumi desde Google Play como cualquier otra app.",
    },
    {
      title: "Úsalo dos semanas",
      body: "Registra tus gastos como siempre y mantén la app instalada al menos 14 días. ¿Encontraste un bug o tienes una idea? Escríbenos: lo leemos todo.",
    },
  ],
  perksEyebrow: "Por qué unirte",
  perksTitle: "Qué obtienes como beta tester",
  perks: [
    { title: "Acceso anticipado", body: "Lumi en Android semanas antes de que aparezca en Google Play." },
    { title: "Línea directa con el fundador", body: "Tus comentarios llegan directamente a quien construye la app, no a una cola de soporte." },
    { title: "Da forma a la app", body: "Lo que piden los testers tiene prioridad: la versión de Android aún se está puliendo." },
    { title: "La misma privacidad", body: "Sin conectar tu banco, tus datos se quedan en el móvil. Igual que en iPhone." },
  ],
  faqTitle: "Preguntas",
  faq: [
    {
      q: "¿Por qué necesitáis el email de mi cuenta de Google?",
      a: "Google Play solo distribuye betas cerradas a las cuentas de la lista de testers del desarrollador. Con tu email te añadimos a esa lista. Debe ser la cuenta con la que inicias sesión en Play Store en tu móvil: una dirección de Gmail o cualquier email registrado como cuenta de Google.",
    },
    {
      q: "¿Cuándo tendré acceso?",
      a: "Añadimos testers por tandas y te escribimos en cuanto tu cuenta está en la lista. Después, la app aparece en Google Play en unos minutos o unas horas.",
    },
    {
      q: "¿Por qué 14 días?",
      a: "Es una norma de Google Play para apps nuevas: al menos 12 testers deben mantener la app instalada 14 días seguidos antes de poder publicarla. Si la desinstalas antes, el recuento baja, así que mantenla dos semanas, por favor.",
    },
    {
      q: "¿Es igual que la app de iPhone?",
      a: "Mismo diseño y mismas funciones, construidas de forma nativa para Android. Algunas cosas que dependen de iOS —Back Tap y la importación de Apple Pay— funcionan distinto o aún no están disponibles.",
    },
    { q: "¿La beta es gratis?", a: "Sí, unirte a la beta no cuesta nada." },
    {
      q: "¿Puedo salir de la beta?",
      a: "Cuando quieras. Abre de nuevo el enlace de invitación y toca «Abandonar el programa», o escríbenos y borraremos tu dirección.",
    },
  ],
  bottomTitle: "¿Tienes iPhone? Lumi ya está ahí.",
  bottomBody: "Descárgalo en el App Store: gratis y sin conectar tu banco.",
  bottomCta: "Volver arriba",
  tgCta: "Canal de Telegram",
};

const it: AndroidBetaCopy = {
  heroCta: "Beta per Android",
  metaTitle: "Lumi per Android — partecipa alla beta",
  metaDescription:
    "Lumi arriva su Android. Lascia l'email del tuo account Google per avere accesso anticipato alla beta chiusa su Google Play e aiutarci a migliorare l'app.",
  eyebrow: "Beta Android",
  title1: "Lumi arriva su Android.",
  title2: "Provalo prima di tutti.",
  subtitle:
    "Lo stesso tracker delle spese veloce e privato che gli utenti iPhone amano, ricostruito in modo nativo per Android. Lascia l'email del tuo account Google e ti invitiamo alla beta chiusa su Google Play.",
  emailLabel: "Email del tuo account Google",
  emailPlaceholder: "tu@gmail.com",
  emailHint: "Usa l'account con cui hai effettuato l'accesso al Play Store sul telefono, altrimenti l'invito non funzionerà.",
  deviceLabel: "Il tuo telefono (facoltativo)",
  devicePlaceholder: "es. Pixel 8, Galaxy S24",
  submit: "Entra nella beta",
  submitting: "Invio in corso…",
  errInvalid: "Non sembra un indirizzo email.",
  errGeneric: "Qualcosa è andato storto. Riprova tra un minuto.",
  privacyNote: "Usiamo la tua email solo per invitarti al test e per novità sulla beta. Niente spam, nessuna condivisione.",
  successTitle: "Sei nella lista!",
  successBody:
    "Aggiungeremo il tuo account alla lista dei tester su Google Play e ti invieremo il link d'invito. Aprilo sul telefono, tocca «Diventa un tester» e installa Lumi.",
  successAlready: "Questa email è già nella lista: non serve iscriversi di nuovo. Il tuo invito è in arrivo.",
  successTg: "Segui le novità su Telegram",
  progressTitle: "Aiutaci ad arrivare su Google Play",
  progressBody:
    "Google pubblica una nuova app solo dopo che almeno 12 tester l'hanno usata per 14 giorni di fila. Ogni tester avvicina il lancio.",
  progressCount: "Si sono già uniti: {n}",
  statTesters: "tester",
  statDays: "giorni di fila",
  stepsEyebrow: "Come funziona",
  stepsTitle: "Tre passi, due minuti",
  steps: [
    {
      title: "Lascia la tua email Google",
      body: "Quella che il tuo Android usa per il Play Store. Solo gli account nella lista dei tester possono installare una beta chiusa.",
    },
    {
      title: "Accetta l'invito",
      body: "Ti invieremo un link via email. Aprilo sul telefono, tocca «Diventa un tester» e installa Lumi da Google Play come qualsiasi altra app.",
    },
    {
      title: "Usalo per due settimane",
      body: "Registra le spese come al solito e tieni l'app installata per almeno 14 giorni. Hai trovato un bug o hai un'idea? Scrivici: leggiamo tutto.",
    },
  ],
  perksEyebrow: "Perché partecipare",
  perksTitle: "Cosa ottieni come beta tester",
  perks: [
    { title: "Accesso anticipato", body: "Lumi su Android settimane prima che compaia su Google Play." },
    { title: "Contatto diretto con il fondatore", body: "Il tuo feedback arriva direttamente a chi costruisce l'app, non a una coda di supporto." },
    { title: "Dai forma all'app", body: "Le richieste dei tester hanno la priorità: la versione Android è ancora in rifinitura." },
    { title: "Stessa privacy", body: "Nessun login bancario, i tuoi dati restano sul telefono. Proprio come su iPhone." },
  ],
  faqTitle: "Domande",
  faq: [
    {
      q: "Perché vi serve l'email del mio account Google?",
      a: "Google Play distribuisce le beta chiuse solo agli account nella lista dei tester dello sviluppatore. Con la tua email ti aggiungiamo a quella lista. Deve essere l'account con cui hai effettuato l'accesso al Play Store sul telefono: un indirizzo Gmail o qualsiasi email registrata come account Google.",
    },
    {
      q: "Quando avrò accesso?",
      a: "Aggiungiamo i tester a gruppi e ti scriviamo appena il tuo account è nella lista. Dopo, l'app compare su Google Play nel giro di pochi minuti o qualche ora.",
    },
    {
      q: "Perché 14 giorni?",
      a: "È una regola di Google Play per le nuove app: almeno 12 tester devono tenere l'app installata per 14 giorni di fila prima che possa essere pubblicata. Se la disinstalli prima, il conteggio scende, quindi tienila per due settimane, per favore.",
    },
    {
      q: "È uguale all'app per iPhone?",
      a: "Stesso design, stesse funzioni, costruite in modo nativo per Android. Alcune cose legate a iOS — Back Tap e l'importazione da Apple Pay — funzionano diversamente o non sono ancora disponibili.",
    },
    { q: "La beta è gratuita?", a: "Sì, partecipare alla beta non costa nulla." },
    {
      q: "Posso lasciare la beta?",
      a: "In qualsiasi momento. Riapri il link d'invito e tocca «Abbandona il programma», oppure scrivici e cancelleremo il tuo indirizzo.",
    },
  ],
  bottomTitle: "Hai un iPhone? Lumi è già lì.",
  bottomBody: "Scaricalo dall'App Store: gratis, senza login bancario.",
  bottomCta: "Torna su",
  tgCta: "Canale Telegram",
};

const COPY: Record<Locale, AndroidBetaCopy> = { en, ru, uk, ro, de, es, it };

export function getAndroidBetaCopy(locale: Locale): AndroidBetaCopy {
  return COPY[locale] ?? en;
}
