// Transactional / triggered email templates, in all 10 app locales.
//
//   welcome         — new account (daily cron, accounts created in the last 72 h)
//   pro_started     — Adapty trial_started / subscription_started
//   trial_cancelled — Adapty trial_renewal_cancelled: ask what was missing
//
// Copy is a first draft — edit freely. The CTA links to the user's store
// (Play when their device token says android, else the App Store).
import type { EmailContent } from "./email";
import { APP_STORE_URL } from "../../constants";

export type TemplateId = "welcome" | "pro_started" | "trial_cancelled";
export const LOCALES = ["en", "ru", "uk", "de", "es", "it", "ja", "ka", "pl", "ro"] as const;
type Locale = (typeof LOCALES)[number];

interface Localized {
  subject: string;
  body: string;
  cta?: string;
}

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.andrey5454germanov.moneytracker";
const storeUrl = (platform?: string | null) => (platform === "android" ? PLAY_STORE_URL : APP_STORE_URL);

const FOOTER: Record<Locale, { reason: string; unsubscribe: string }> = {
  en: { reason: "You're receiving this because you have a Lumi account.", unsubscribe: "Unsubscribe" },
  ru: { reason: "Вы получили это письмо, потому что у вас есть аккаунт Lumi.", unsubscribe: "Отписаться" },
  uk: { reason: "Ви отримали цей лист, бо маєте акаунт Lumi.", unsubscribe: "Відписатися" },
  de: { reason: "Du erhältst diese E-Mail, weil du ein Lumi-Konto hast.", unsubscribe: "Abmelden" },
  es: { reason: "Recibes este correo porque tienes una cuenta de Lumi.", unsubscribe: "Darse de baja" },
  it: { reason: "Ricevi questa email perché hai un account Lumi.", unsubscribe: "Annulla iscrizione" },
  ja: { reason: "Lumiアカウントをお持ちのため、このメールをお送りしています。", unsubscribe: "配信停止" },
  ka: { reason: "ამ წერილს იღებთ, რადგან გაქვთ Lumi-ის ანგარიში.", unsubscribe: "გამოწერის გაუქმება" },
  pl: { reason: "Otrzymujesz tę wiadomość, ponieważ masz konto Lumi.", unsubscribe: "Wypisz się" },
  ro: { reason: "Primești acest e-mail pentru că ai un cont Lumi.", unsubscribe: "Dezabonare" },
};

const TEMPLATES: Record<TemplateId, Record<Locale, Localized>> = {
  welcome: {
    en: {
      subject: "Welcome to Lumi",
      body: "Thanks for creating a Lumi account!\n\nThree things worth trying first:\n• Scan a receipt — Lumi reads the amount and category for you.\n• Set a monthly budget for the category you overspend on most.\n• Add the Lumi widget to your Home Screen to log an expense in two taps.\n\nQuestions or ideas? Just reply to this email.",
      cta: "Open Lumi",
    },
    ru: {
      subject: "Добро пожаловать в Lumi",
      body: "Спасибо, что создали аккаунт Lumi!\n\nС чего стоит начать:\n• Отсканируйте чек — Lumi сама распознает сумму и категорию.\n• Поставьте месячный бюджет на категорию, где тратите больше всего.\n• Добавьте виджет Lumi на экран «Домой», чтобы записывать расходы в два касания.\n\nВопросы или идеи? Просто ответьте на это письмо.",
      cta: "Открыть Lumi",
    },
    uk: {
      subject: "Ласкаво просимо до Lumi",
      body: "Дякуємо, що створили акаунт Lumi!\n\nЗ чого варто почати:\n• Відскануйте чек — Lumi сама розпізнає суму й категорію.\n• Встановіть місячний бюджет на категорію, де витрачаєте найбільше.\n• Додайте віджет Lumi на екран «Додому», щоб записувати витрати у два дотики.\n\nПитання чи ідеї? Просто дайте відповідь на цей лист.",
      cta: "Відкрити Lumi",
    },
    de: {
      subject: "Willkommen bei Lumi",
      body: "Danke, dass du ein Lumi-Konto erstellt hast!\n\nDrei Dinge, die sich zum Start lohnen:\n• Scanne einen Beleg — Lumi erkennt Betrag und Kategorie automatisch.\n• Lege ein Monatsbudget für die Kategorie fest, in der du am meisten ausgibst.\n• Füge das Lumi-Widget zum Home-Bildschirm hinzu und erfasse Ausgaben mit zwei Tipps.\n\nFragen oder Ideen? Antworte einfach auf diese E-Mail.",
      cta: "Lumi öffnen",
    },
    es: {
      subject: "Te damos la bienvenida a Lumi",
      body: "¡Gracias por crear una cuenta de Lumi!\n\nTres cosas para empezar:\n• Escanea un recibo: Lumi detecta el importe y la categoría por ti.\n• Pon un presupuesto mensual a la categoría en la que más gastas.\n• Añade el widget de Lumi a tu pantalla de inicio para registrar gastos en dos toques.\n\n¿Preguntas o ideas? Responde a este correo.",
      cta: "Abrir Lumi",
    },
    it: {
      subject: "Benvenuto in Lumi",
      body: "Grazie per aver creato un account Lumi!\n\nTre cose da provare subito:\n• Scansiona uno scontrino: Lumi riconosce importo e categoria al posto tuo.\n• Imposta un budget mensile per la categoria in cui spendi di più.\n• Aggiungi il widget di Lumi alla schermata Home per registrare una spesa in due tocchi.\n\nDomande o idee? Rispondi pure a questa email.",
      cta: "Apri Lumi",
    },
    ja: {
      subject: "Lumiへようこそ",
      body: "Lumiのアカウントを作成いただき、ありがとうございます！\n\nまず試してほしい3つのこと：\n• レシートをスキャン — 金額とカテゴリをLumiが自動で読み取ります。\n• 一番使いすぎているカテゴリに月の予算を設定。\n• ホーム画面にLumiウィジェットを追加して、2タップで支出を記録。\n\nご質問やご意見は、このメールに返信してください。",
      cta: "Lumiを開く",
    },
    ka: {
      subject: "კეთილი იყოს თქვენი მობრძანება Lumi-ში",
      body: "გმადლობთ, რომ Lumi-ის ანგარიში შექმენით!\n\nსამი რამ, რითაც ღირს დაწყება:\n• დაასკანერეთ ჩეკი — Lumi თავად ამოიცნობს თანხას და კატეგორიას.\n• დააწესეთ თვიური ბიუჯეტი იმ კატეგორიაზე, სადაც ყველაზე მეტს ხარჯავთ.\n• დაამატეთ Lumi-ის ვიჯეტი მთავარ ეკრანზე და ხარჯი ორი შეხებით ჩაწერეთ.\n\nკითხვები ან იდეები? უბრალოდ უპასუხეთ ამ წერილს.",
      cta: "Lumi-ის გახსნა",
    },
    pl: {
      subject: "Witaj w Lumi",
      body: "Dziękujemy za założenie konta Lumi!\n\nTrzy rzeczy na początek:\n• Zeskanuj paragon — Lumi sama rozpozna kwotę i kategorię.\n• Ustaw miesięczny budżet dla kategorii, w której wydajesz najwięcej.\n• Dodaj widżet Lumi do ekranu głównego, by zapisywać wydatki w dwa dotknięcia.\n\nPytania lub pomysły? Po prostu odpowiedz na tę wiadomość.",
      cta: "Otwórz Lumi",
    },
    ro: {
      subject: "Bun venit în Lumi",
      body: "Îți mulțumim că ți-ai creat un cont Lumi!\n\nTrei lucruri de încercat la început:\n• Scanează un bon — Lumi recunoaște suma și categoria pentru tine.\n• Setează un buget lunar pentru categoria la care cheltui cel mai mult.\n• Adaugă widgetul Lumi pe ecranul principal ca să notezi o cheltuială din două atingeri.\n\nÎntrebări sau idei? Răspunde la acest e-mail.",
      cta: "Deschide Lumi",
    },
  },
  pro_started: {
    en: {
      subject: "Lumi Pro is on",
      body: "Lumi Pro is now active on your account.\n\nWhat's unlocked:\n• Unlimited AI receipt scans\n• Unlimited budgets\n• Expense forecast and period comparison\n• Cloud sync and backup across your devices\n\nYou can manage or cancel the subscription anytime in your App Store settings.",
      cta: "Open Lumi",
    },
    ru: {
      subject: "Lumi Pro включён",
      body: "Lumi Pro активирован в вашем аккаунте.\n\nЧто теперь доступно:\n• Безлимитное AI-сканирование чеков\n• Неограниченное число бюджетов\n• Прогноз расходов и сравнение периодов\n• Облачная синхронизация и бэкап между устройствами\n\nУправлять подпиской или отменить её можно в любой момент в настройках App Store.",
      cta: "Открыть Lumi",
    },
    uk: {
      subject: "Lumi Pro увімкнено",
      body: "Lumi Pro активовано у вашому акаунті.\n\nЩо тепер доступно:\n• Безлімітне AI-сканування чеків\n• Необмежена кількість бюджетів\n• Прогноз витрат і порівняння періодів\n• Хмарна синхронізація та бекап між пристроями\n\nКерувати підпискою чи скасувати її можна будь-коли в налаштуваннях App Store.",
      cta: "Відкрити Lumi",
    },
    de: {
      subject: "Lumi Pro ist aktiv",
      body: "Lumi Pro ist jetzt in deinem Konto aktiv.\n\nDas ist freigeschaltet:\n• Unbegrenzte KI-Belegscans\n• Unbegrenzte Budgets\n• Ausgabenprognose und Zeitraumvergleich\n• Cloud-Sync und Backup über alle Geräte\n\nDu kannst das Abo jederzeit in den App-Store-Einstellungen verwalten oder kündigen.",
      cta: "Lumi öffnen",
    },
    es: {
      subject: "Lumi Pro está activado",
      body: "Lumi Pro ya está activo en tu cuenta.\n\nLo que se desbloquea:\n• Escaneos de recibos con IA ilimitados\n• Presupuestos ilimitados\n• Previsión de gastos y comparación de periodos\n• Sincronización y copia de seguridad en la nube entre dispositivos\n\nPuedes gestionar o cancelar la suscripción cuando quieras en los ajustes del App Store.",
      cta: "Abrir Lumi",
    },
    it: {
      subject: "Lumi Pro è attivo",
      body: "Lumi Pro è ora attivo sul tuo account.\n\nCosa si sblocca:\n• Scansioni degli scontrini con IA illimitate\n• Budget illimitati\n• Previsione delle spese e confronto tra periodi\n• Sincronizzazione e backup nel cloud tra i dispositivi\n\nPuoi gestire o annullare l'abbonamento in qualsiasi momento dalle impostazioni dell'App Store.",
      cta: "Apri Lumi",
    },
    ja: {
      subject: "Lumi Proが有効になりました",
      body: "お客様のアカウントでLumi Proが有効になりました。\n\n利用できるようになった機能：\n• AIレシートスキャン無制限\n• 予算の数が無制限\n• 支出予測と期間比較\n• デバイス間のクラウド同期とバックアップ\n\nサブスクリプションはApp Storeの設定からいつでも管理・解約できます。",
      cta: "Lumiを開く",
    },
    ka: {
      subject: "Lumi Pro ჩართულია",
      body: "Lumi Pro თქვენს ანგარიშზე გააქტიურდა.\n\nრა გაიხსნა:\n• ჩეკების შეუზღუდავი AI-სკანირება\n• შეუზღუდავი ბიუჯეტები\n• ხარჯების პროგნოზი და პერიოდების შედარება\n• ღრუბლოვანი სინქრონიზაცია და სარეზერვო ასლი მოწყობილობებს შორის\n\nგამოწერის მართვა ან გაუქმება ნებისმიერ დროს შეგიძლიათ App Store-ის პარამეტრებში.",
      cta: "Lumi-ის გახსნა",
    },
    pl: {
      subject: "Lumi Pro jest aktywne",
      body: "Lumi Pro jest już aktywne na Twoim koncie.\n\nCo zostało odblokowane:\n• Nielimitowane skanowanie paragonów z AI\n• Nielimitowane budżety\n• Prognoza wydatków i porównanie okresów\n• Synchronizacja i kopia zapasowa w chmurze między urządzeniami\n\nSubskrypcją możesz zarządzać lub ją anulować w dowolnej chwili w ustawieniach App Store.",
      cta: "Otwórz Lumi",
    },
    ro: {
      subject: "Lumi Pro este activ",
      body: "Lumi Pro este acum activ în contul tău.\n\nCe se deblochează:\n• Scanări nelimitate ale bonurilor cu AI\n• Bugete nelimitate\n• Prognoza cheltuielilor și compararea perioadelor\n• Sincronizare și backup în cloud între dispozitive\n\nPoți gestiona sau anula abonamentul oricând din setările App Store.",
      cta: "Deschide Lumi",
    },
  },
  trial_cancelled: {
    en: {
      subject: "One quick question",
      body: "You turned off renewal during your Lumi Pro trial — no problem, Pro stays on until the trial ends.\n\nCould you tell us in one line what was missing or didn't work for you? Just reply to this email — we read every answer.",
    },
    ru: {
      subject: "Один короткий вопрос",
      body: "Вы отключили продление во время пробного периода Lumi Pro — ничего страшного, Pro будет работать до конца пробного периода.\n\nНапишите, пожалуйста, одной строкой, чего не хватило или что не сработало? Просто ответьте на это письмо — мы читаем каждый ответ.",
    },
    uk: {
      subject: "Одне коротке запитання",
      body: "Ви вимкнули продовження під час пробного періоду Lumi Pro — нічого страшного, Pro працюватиме до кінця пробного періоду.\n\nНапишіть, будь ласка, одним рядком, чого бракувало або що не спрацювало? Просто дайте відповідь на цей лист — ми читаємо кожну відповідь.",
    },
    de: {
      subject: "Eine kurze Frage",
      body: "Du hast die Verlängerung während deiner Lumi-Pro-Testphase deaktiviert — kein Problem, Pro bleibt bis zum Ende der Testphase aktiv.\n\nMagst du uns in einem Satz sagen, was gefehlt oder nicht funktioniert hat? Antworte einfach auf diese E-Mail — wir lesen jede Antwort.",
    },
    es: {
      subject: "Una pregunta rápida",
      body: "Desactivaste la renovación durante tu prueba de Lumi Pro. No pasa nada: Pro sigue activo hasta que termine la prueba.\n\n¿Nos cuentas en una línea qué te faltó o qué no funcionó? Responde a este correo: leemos todas las respuestas.",
    },
    it: {
      subject: "Una domanda veloce",
      body: "Hai disattivato il rinnovo durante la prova di Lumi Pro: nessun problema, Pro resta attivo fino alla fine della prova.\n\nCi dici in una riga cosa è mancato o cosa non ha funzionato? Rispondi a questa email: leggiamo ogni risposta.",
    },
    ja: {
      subject: "ひとつだけ質問させてください",
      body: "Lumi Proの無料トライアル中に自動更新をオフにされました。トライアル終了まではProをそのままお使いいただけます。\n\n物足りなかった点やうまくいかなかった点を一言で教えていただけますか？このメールに返信するだけでOKです。すべての返信に目を通しています。",
    },
    ka: {
      subject: "ერთი მოკლე კითხვა",
      body: "Lumi Pro-ის საცდელი პერიოდის დროს განახლება გამორთეთ — არაუშავს, Pro საცდელი პერიოდის ბოლომდე იმუშავებს.\n\nერთი წინადადებით გვითხარით, რა გაკლდათ ან რა არ იმუშავა? უბრალოდ უპასუხეთ ამ წერილს — ყველა პასუხს ვკითხულობთ.",
    },
    pl: {
      subject: "Jedno krótkie pytanie",
      body: "Wyłączyłeś(-aś) odnawianie w trakcie okresu próbnego Lumi Pro — nic nie szkodzi, Pro działa do końca okresu próbnego.\n\nNapiszesz w jednym zdaniu, czego zabrakło albo co nie zadziałało? Po prostu odpowiedz na tę wiadomość — czytamy każdą odpowiedź.",
    },
    ro: {
      subject: "O întrebare scurtă",
      body: "Ai dezactivat reînnoirea în perioada de probă Lumi Pro — nicio problemă, Pro rămâne activ până la finalul perioadei de probă.\n\nNe spui într-un rând ce ți-a lipsit sau ce nu a funcționat? Răspunde pur și simplu la acest e-mail — citim fiecare răspuns.",
    },
  },
};

export function pickLocale(locale: string | null | undefined): Locale {
  const short = (locale ?? "en").slice(0, 2).toLowerCase();
  return (LOCALES as readonly string[]).includes(short) ? (short as Locale) : "en";
}

export function renderTemplate(id: TemplateId, locale: string | null | undefined, platform?: string | null): EmailContent {
  const lang = pickLocale(locale);
  const t = TEMPLATES[id][lang];
  return {
    subject: t.subject,
    body: t.body,
    ...(t.cta ? { cta: { label: t.cta, url: storeUrl(platform) } } : {}),
    footer: FOOTER[lang],
  };
}

export function campaignFooter(locale: string | null | undefined) {
  return FOOTER[pickLocale(locale)];
}
