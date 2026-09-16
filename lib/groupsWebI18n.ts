// Copy for the shared-expense group pages (/j/[code] invitation, /t/[token]
// live link). Kept separate from lib/i18n.ts, which serves the landing site.
import type { Locale } from "./i18n";

// Invite/trip pages serve app users (any app language), so they keep locales
// the marketing site no longer ships.
export type GroupsLocale = Locale | "pl" | "ja" | "ka";

/** Intl tags for the group-only locales (site locales use INTL_LOCALE). */
export const GROUPS_INTL: Partial<Record<GroupsLocale, string>> = { pl: "pl-PL", ja: "ja-JP", ka: "ka-GE" };

export interface GroupsCopy {
  getLumi: string;
  appStore: string;
  invite: {
    eyebrow: string;
    title: string;
    members: string;
    openInApp: string;
    howTitle: string;
    step1: string;
    step2: string;
    codeLabel: string;
    copy: string;
    copied: string;
    invalidTitle: string;
    invalidBody: string;
    full: string;
    metaDescription: string;
  };
  trip: {
    eyebrow: string;
    totalSpent: string;
    updated: string;
    whoPays: string;
    allSettled: string;
    balances: string;
    expenses: string;
    paidBy: string;
    payment: string;
    refund: string;
    youOwe: string;
    youAreOwed: string;
    youSettled: string;
    tellPaid: string;
    paidMessage: string;
    copiedMessage: string;
    disabledTitle: string;
    disabledBody: string;
    ctaTitle: string;
    ctaBody: string;
    former: string;
    viewOnly: string;
    noExpenses: string;
  };
}

const COPY: Record<GroupsLocale, GroupsCopy> = {
  en: {
    getLumi: "Get Lumi", appStore: "App Store",
    invite: {
      eyebrow: "Invitation", title: "{owner} invites you to join", members: "{count} members", openInApp: "Open in Lumi",
      howTitle: "Don't have Lumi yet?", step1: "Install Lumi from the App Store.",
      step2: "Come back to this page and tap “Open in Lumi”.", codeLabel: "Or enter this code in Lumi → Shared expenses",
      copy: "Copy code", copied: "Copied", invalidTitle: "This invitation is no longer valid",
      invalidBody: "Ask the person who invited you for a new link.", full: "This group is full.",
      metaDescription: "{owner} invites you to split expenses for “{group}” in Lumi.",
    },
    trip: {
      eyebrow: "Shared expenses", totalSpent: "Total spent", updated: "Updated {time}", whoPays: "Who pays whom",
      allSettled: "Everyone is settled up", balances: "Balances", expenses: "Expenses", paidBy: "{name} paid",
      payment: "{from} paid {to}", refund: "Refund", youOwe: "{name}, you owe {amount}", youAreOwed: "{name}, you are owed {amount}",
      youSettled: "{name}, you're all settled", tellPaid: "Tell them I paid", paidMessage: "I paid {amount} for “{group}” 👌",
      copiedMessage: "Message copied", disabledTitle: "This link is no longer active", disabledBody: "Ask the group owner for a new link.",
      ctaTitle: "Want to add expenses yourself?", ctaBody: "Install Lumi and ask for an invitation to the group.",
      former: "left", viewOnly: "View only", noExpenses: "No expenses yet",
    },
  },
  ru: {
    getLumi: "Скачать Lumi", appStore: "App Store",
    invite: {
      eyebrow: "Приглашение", title: "{owner} приглашает вас в группу", members: "Участников: {count}", openInApp: "Открыть в Lumi",
      howTitle: "Ещё нет Lumi?", step1: "Установите Lumi из App Store.",
      step2: "Вернитесь на эту страницу и нажмите «Открыть в Lumi».", codeLabel: "Или введите код в Lumi → Совместные траты",
      copy: "Скопировать код", copied: "Скопировано", invalidTitle: "Приглашение больше не действует",
      invalidBody: "Попросите у пригласившего новую ссылку.", full: "В группе уже максимум участников.",
      metaDescription: "{owner} приглашает вас делить траты «{group}» в Lumi.",
    },
    trip: {
      eyebrow: "Совместные траты", totalSpent: "Всего потрачено", updated: "Обновлено {time}", whoPays: "Кто кому платит",
      allSettled: "Все в расчёте", balances: "Балансы", expenses: "Траты", paidBy: "Платил(а) {name}",
      payment: "{from} вернул(а) {to}", refund: "Возврат", youOwe: "{name}, вы должны {amount}", youAreOwed: "{name}, вам должны {amount}",
      youSettled: "{name}, вы в расчёте", tellPaid: "Написать, что я вернул(а)", paidMessage: "Вернул(а) {amount} за «{group}» 👌",
      copiedMessage: "Сообщение скопировано", disabledTitle: "Ссылка больше не активна", disabledBody: "Попросите владельца группы новую ссылку.",
      ctaTitle: "Хотите добавлять траты сами?", ctaBody: "Установите Lumi и попросите приглашение в группу.",
      former: "вышел(ла)", viewOnly: "Только просмотр", noExpenses: "Трат пока нет",
    },
  },
  uk: {
    getLumi: "Завантажити Lumi", appStore: "App Store",
    invite: {
      eyebrow: "Запрошення", title: "{owner} запрошує вас до групи", members: "Учасників: {count}", openInApp: "Відкрити в Lumi",
      howTitle: "Ще немає Lumi?", step1: "Встановіть Lumi з App Store.",
      step2: "Поверніться на цю сторінку й натисніть «Відкрити в Lumi».", codeLabel: "Або введіть код у Lumi → Спільні витрати",
      copy: "Скопіювати код", copied: "Скопійовано", invalidTitle: "Запрошення більше не діє",
      invalidBody: "Попросіть у того, хто запросив, нове посилання.", full: "У групі вже максимум учасників.",
      metaDescription: "{owner} запрошує вас ділити витрати «{group}» у Lumi.",
    },
    trip: {
      eyebrow: "Спільні витрати", totalSpent: "Усього витрачено", updated: "Оновлено {time}", whoPays: "Хто кому платить",
      allSettled: "Усі розрахувалися", balances: "Баланси", expenses: "Витрати", paidBy: "Платив(ла) {name}",
      payment: "{from} повернув(ла) {to}", refund: "Повернення", youOwe: "{name}, ви винні {amount}", youAreOwed: "{name}, вам винні {amount}",
      youSettled: "{name}, ви розрахувалися", tellPaid: "Написати, що я повернув(ла)", paidMessage: "Повернув(ла) {amount} за «{group}» 👌",
      copiedMessage: "Повідомлення скопійовано", disabledTitle: "Посилання більше не активне", disabledBody: "Попросіть власника групи нове посилання.",
      ctaTitle: "Хочете додавати витрати самі?", ctaBody: "Встановіть Lumi й попросіть запрошення до групи.",
      former: "вийшов(ла)", viewOnly: "Лише перегляд", noExpenses: "Витрат поки немає",
    },
  },
  ro: {
    getLumi: "Descarcă Lumi", appStore: "App Store",
    invite: {
      eyebrow: "Invitație", title: "{owner} te invită în grup", members: "{count} membri", openInApp: "Deschide în Lumi",
      howTitle: "Nu ai încă Lumi?", step1: "Instalează Lumi din App Store.",
      step2: "Revino pe această pagină și atinge „Deschide în Lumi”.", codeLabel: "Sau introdu codul în Lumi → Cheltuieli comune",
      copy: "Copiază codul", copied: "Copiat", invalidTitle: "Invitația nu mai este valabilă",
      invalidBody: "Cere un link nou persoanei care te-a invitat.", full: "Grupul este plin.",
      metaDescription: "{owner} te invită să împărțiți cheltuielile pentru „{group}” în Lumi.",
    },
    trip: {
      eyebrow: "Cheltuieli comune", totalSpent: "Total cheltuit", updated: "Actualizat {time}", whoPays: "Cine cui plătește",
      allSettled: "Toată lumea e chit", balances: "Solduri", expenses: "Cheltuieli", paidBy: "A plătit {name}",
      payment: "{from} i-a plătit lui {to}", refund: "Rambursare", youOwe: "{name}, datorezi {amount}", youAreOwed: "{name}, ți se datorează {amount}",
      youSettled: "{name}, ești chit", tellPaid: "Spune-le că am plătit", paidMessage: "Am plătit {amount} pentru „{group}” 👌",
      copiedMessage: "Mesaj copiat", disabledTitle: "Linkul nu mai este activ", disabledBody: "Cere proprietarului grupului un link nou.",
      ctaTitle: "Vrei să adaugi singur cheltuieli?", ctaBody: "Instalează Lumi și cere o invitație în grup.",
      former: "a ieșit", viewOnly: "Doar vizualizare", noExpenses: "Încă nu sunt cheltuieli",
    },
  },
  de: {
    getLumi: "Lumi holen", appStore: "App Store",
    invite: {
      eyebrow: "Einladung", title: "{owner} lädt dich in die Gruppe ein", members: "{count} Mitglieder", openInApp: "In Lumi öffnen",
      howTitle: "Noch kein Lumi?", step1: "Installiere Lumi aus dem App Store.",
      step2: "Komm auf diese Seite zurück und tippe auf „In Lumi öffnen“.", codeLabel: "Oder gib diesen Code in Lumi → Geteilte Ausgaben ein",
      copy: "Code kopieren", copied: "Kopiert", invalidTitle: "Diese Einladung ist nicht mehr gültig",
      invalidBody: "Bitte die Person, die dich eingeladen hat, um einen neuen Link.", full: "Diese Gruppe ist voll.",
      metaDescription: "{owner} lädt dich ein, Ausgaben für „{group}“ in Lumi zu teilen.",
    },
    trip: {
      eyebrow: "Geteilte Ausgaben", totalSpent: "Insgesamt ausgegeben", updated: "Aktualisiert {time}", whoPays: "Wer zahlt wem",
      allSettled: "Alle sind quitt", balances: "Salden", expenses: "Ausgaben", paidBy: "{name} hat bezahlt",
      payment: "{from} hat {to} bezahlt", refund: "Erstattung", youOwe: "{name}, du schuldest {amount}", youAreOwed: "{name}, dir werden {amount} geschuldet",
      youSettled: "{name}, du bist quitt", tellPaid: "Sagen, dass ich bezahlt habe", paidMessage: "Ich habe {amount} für „{group}“ bezahlt 👌",
      copiedMessage: "Nachricht kopiert", disabledTitle: "Dieser Link ist nicht mehr aktiv", disabledBody: "Bitte den Gruppeninhaber um einen neuen Link.",
      ctaTitle: "Selbst Ausgaben hinzufügen?", ctaBody: "Installiere Lumi und bitte um eine Einladung in die Gruppe.",
      former: "ausgetreten", viewOnly: "Nur ansehen", noExpenses: "Noch keine Ausgaben",
    },
  },
  es: {
    getLumi: "Descargar Lumi", appStore: "App Store",
    invite: {
      eyebrow: "Invitación", title: "{owner} te invita al grupo", members: "{count} miembros", openInApp: "Abrir en Lumi",
      howTitle: "¿Aún no tienes Lumi?", step1: "Instala Lumi desde App Store.",
      step2: "Vuelve a esta página y toca «Abrir en Lumi».", codeLabel: "O introduce este código en Lumi → Gastos compartidos",
      copy: "Copiar código", copied: "Copiado", invalidTitle: "Esta invitación ya no es válida",
      invalidBody: "Pide un enlace nuevo a quien te invitó.", full: "Este grupo está completo.",
      metaDescription: "{owner} te invita a dividir los gastos de «{group}» en Lumi.",
    },
    trip: {
      eyebrow: "Gastos compartidos", totalSpent: "Total gastado", updated: "Actualizado {time}", whoPays: "Quién paga a quién",
      allSettled: "Todos están a mano", balances: "Saldos", expenses: "Gastos", paidBy: "Pagó {name}",
      payment: "{from} pagó a {to}", refund: "Reembolso", youOwe: "{name}, debes {amount}", youAreOwed: "{name}, te deben {amount}",
      youSettled: "{name}, estás a mano", tellPaid: "Avisar que pagué", paidMessage: "Pagué {amount} por «{group}» 👌",
      copiedMessage: "Mensaje copiado", disabledTitle: "Este enlace ya no está activo", disabledBody: "Pide un enlace nuevo al dueño del grupo.",
      ctaTitle: "¿Quieres añadir gastos tú mismo?", ctaBody: "Instala Lumi y pide una invitación al grupo.",
      former: "salió", viewOnly: "Solo lectura", noExpenses: "Aún no hay gastos",
    },
  },
  it: {
    getLumi: "Scarica Lumi", appStore: "App Store",
    invite: {
      eyebrow: "Invito", title: "{owner} ti invita nel gruppo", members: "{count} membri", openInApp: "Apri in Lumi",
      howTitle: "Non hai ancora Lumi?", step1: "Installa Lumi da App Store.",
      step2: "Torna su questa pagina e tocca «Apri in Lumi».", codeLabel: "Oppure inserisci il codice in Lumi → Spese condivise",
      copy: "Copia codice", copied: "Copiato", invalidTitle: "Questo invito non è più valido",
      invalidBody: "Chiedi un nuovo link a chi ti ha invitato.", full: "Questo gruppo è al completo.",
      metaDescription: "{owner} ti invita a dividere le spese di «{group}» in Lumi.",
    },
    trip: {
      eyebrow: "Spese condivise", totalSpent: "Totale speso", updated: "Aggiornato {time}", whoPays: "Chi paga chi",
      allSettled: "Tutti in pari", balances: "Saldi", expenses: "Spese", paidBy: "Ha pagato {name}",
      payment: "{from} ha pagato {to}", refund: "Rimborso", youOwe: "{name}, devi {amount}", youAreOwed: "{name}, ti devono {amount}",
      youSettled: "{name}, sei in pari", tellPaid: "Dire che ho pagato", paidMessage: "Ho pagato {amount} per «{group}» 👌",
      copiedMessage: "Messaggio copiato", disabledTitle: "Questo link non è più attivo", disabledBody: "Chiedi un nuovo link al proprietario del gruppo.",
      ctaTitle: "Vuoi aggiungere spese tu stesso?", ctaBody: "Installa Lumi e chiedi un invito al gruppo.",
      former: "uscito", viewOnly: "Sola lettura", noExpenses: "Nessuna spesa per ora",
    },
  },
  pl: {
    getLumi: "Pobierz Lumi", appStore: "App Store",
    invite: {
      eyebrow: "Zaproszenie", title: "{owner} zaprasza cię do grupy", members: "Członków: {count}", openInApp: "Otwórz w Lumi",
      howTitle: "Nie masz jeszcze Lumi?", step1: "Zainstaluj Lumi z App Store.",
      step2: "Wróć na tę stronę i dotknij „Otwórz w Lumi”.", codeLabel: "Albo wpisz kod w Lumi → Wspólne wydatki",
      copy: "Kopiuj kod", copied: "Skopiowano", invalidTitle: "To zaproszenie jest już nieważne",
      invalidBody: "Poproś osobę, która cię zaprosiła, o nowy link.", full: "Ta grupa jest pełna.",
      metaDescription: "{owner} zaprasza cię do dzielenia wydatków „{group}” w Lumi.",
    },
    trip: {
      eyebrow: "Wspólne wydatki", totalSpent: "Wydano łącznie", updated: "Zaktualizowano {time}", whoPays: "Kto komu płaci",
      allSettled: "Wszyscy są rozliczeni", balances: "Salda", expenses: "Wydatki", paidBy: "Zapłacił(a) {name}",
      payment: "{from} zapłacił(a) {to}", refund: "Zwrot", youOwe: "{name}, jesteś winien {amount}", youAreOwed: "{name}, należy ci się {amount}",
      youSettled: "{name}, jesteś rozliczony", tellPaid: "Napisz, że zapłaciłem", paidMessage: "Zapłaciłem {amount} za „{group}” 👌",
      copiedMessage: "Wiadomość skopiowana", disabledTitle: "Ten link nie jest już aktywny", disabledBody: "Poproś właściciela grupy o nowy link.",
      ctaTitle: "Chcesz sam dodawać wydatki?", ctaBody: "Zainstaluj Lumi i poproś o zaproszenie do grupy.",
      former: "wyszedł", viewOnly: "Tylko podgląd", noExpenses: "Brak wydatków",
    },
  },
  ja: {
    getLumi: "Lumiを入手", appStore: "App Store",
    invite: {
      eyebrow: "招待", title: "{owner}さんがグループに招待しています", members: "メンバー {count}人", openInApp: "Lumiで開く",
      howTitle: "まだLumiをお持ちでないですか？", step1: "App StoreからLumiをインストール。",
      step2: "このページに戻り「Lumiで開く」をタップ。", codeLabel: "またはLumi → 共有の支出 でこのコードを入力",
      copy: "コードをコピー", copied: "コピーしました", invalidTitle: "この招待は無効になりました",
      invalidBody: "招待した人に新しいリンクを依頼してください。", full: "このグループは満員です。",
      metaDescription: "{owner}さんがLumiで「{group}」の支出を割り勘しようと招待しています。",
    },
    trip: {
      eyebrow: "共有の支出", totalSpent: "合計支出", updated: "{time} 更新", whoPays: "誰が誰に払うか",
      allSettled: "全員精算済みです", balances: "残高", expenses: "支出", paidBy: "{name}が支払い",
      payment: "{from}が{to}に支払い", refund: "払い戻し", youOwe: "{name}さん、{amount}の支払いがあります", youAreOwed: "{name}さん、{amount}を受け取れます",
      youSettled: "{name}さん、精算済みです", tellPaid: "支払ったと伝える", paidMessage: "「{group}」の{amount}を支払いました 👌",
      copiedMessage: "メッセージをコピーしました", disabledTitle: "このリンクは無効になりました", disabledBody: "グループのオーナーに新しいリンクを依頼してください。",
      ctaTitle: "自分で支出を追加したいですか？", ctaBody: "Lumiをインストールして、グループへの招待を依頼しましょう。",
      former: "退出", viewOnly: "閲覧のみ", noExpenses: "まだ支出はありません",
    },
  },
  ka: {
    getLumi: "Lumi-ს ჩამოტვირთვა", appStore: "App Store",
    invite: {
      eyebrow: "მოწვევა", title: "{owner} გიწვევთ ჯგუფში", members: "{count} წევრი", openInApp: "Lumi-ში გახსნა",
      howTitle: "ჯერ არ გაქვთ Lumi?", step1: "დააინსტალირეთ Lumi App Store-დან.",
      step2: "დაბრუნდით ამ გვერდზე და დააჭირეთ „Lumi-ში გახსნა“.", codeLabel: "ან შეიყვანეთ კოდი Lumi → საერთო ხარჯები",
      copy: "კოდის კოპირება", copied: "კოპირებულია", invalidTitle: "მოწვევა აღარ მოქმედებს",
      invalidBody: "სთხოვეთ მომწვევს ახალი ბმული.", full: "ჯგუფი სავსეა.",
      metaDescription: "{owner} გიწვევთ Lumi-ში „{group}“-ის ხარჯების გასაყოფად.",
    },
    trip: {
      eyebrow: "საერთო ხარჯები", totalSpent: "სულ დაიხარჯა", updated: "განახლდა {time}", whoPays: "ვინ ვის უხდის",
      allSettled: "ყველა ანგარიშსწორებულია", balances: "ბალანსები", expenses: "ხარჯები", paidBy: "გადაიხადა {name}",
      payment: "{from} გადაუხადა {to}", refund: "დაბრუნება", youOwe: "{name}, თქვენ ვალი გაქვთ {amount}", youAreOwed: "{name}, თქვენ გერგებათ {amount}",
      youSettled: "{name}, თქვენ ანგარიშსწორებული ხართ", tellPaid: "მივწეროთ, რომ გადავიხადე", paidMessage: "გადავიხადე {amount} „{group}“-ისთვის 👌",
      copiedMessage: "შეტყობინება კოპირებულია", disabledTitle: "ბმული აღარ არის აქტიური", disabledBody: "სთხოვეთ ჯგუფის მფლობელს ახალი ბმული.",
      ctaTitle: "გსურთ თავად დაამატოთ ხარჯები?", ctaBody: "დააინსტალირეთ Lumi და სთხოვეთ ჯგუფში მოწვევა.",
      former: "გავიდა", viewOnly: "მხოლოდ ნახვა", noExpenses: "ხარჯები ჯერ არ არის",
    },
  },
};

export const GROUP_LOCALES = Object.keys(COPY) as GroupsLocale[];

export function pickLocale(acceptLanguage: string | null | undefined): GroupsLocale {
  const wanted = (acceptLanguage ?? "")
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
  return (wanted.find((code) => (GROUP_LOCALES as string[]).includes(code)) as GroupsLocale | undefined) ?? "en";
}

export function groupsCopy(locale: GroupsLocale): GroupsCopy {
  return COPY[locale] ?? COPY.en;
}

export const fill = (template: string, vars: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));

export const APP_STORE_URL = "https://apps.apple.com/app/lumi-bills-spending-log/id6754805457";

export const CATEGORY_EMOJI: Record<string, string> = {
  food: "🍽️", groceries: "🛒", transport: "🚗", accommodation: "🏨", travel: "✈️", entertainment: "🎬",
  shopping: "🛍️", utilities: "⚡", healthcare: "🏥", other: "📦",
};
