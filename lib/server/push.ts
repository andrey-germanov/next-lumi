// Group push notifications via the Expo push API. Tokens live in
// users/{uid}/pushTokens/{deviceId} ({ token, locale }) — registered by the app
// for everyone in a group, independent of Family Sharing's device registry.
import { adminDb } from "./firebaseAdmin";
import { fromMinor } from "../groupMath";

export type PushType =
  | "expense_added"
  | "expense_edited"
  | "expense_deleted"
  | "expense_restored"
  | "settlement_added"
  | "member_joined"
  | "group_deleted";

type Strings = Record<PushType, string> & { more: string };

const STRINGS: Record<string, Strings> = {
  en: {
    expense_added: "{actor} added “{title}” · {amount}",
    expense_edited: "{actor} edited “{title}”",
    expense_deleted: "{actor} deleted “{title}”",
    expense_restored: "{actor} restored “{title}”",
    settlement_added: "{actor} recorded a payment · {amount}",
    member_joined: "{actor} joined the group",
    group_deleted: "{actor} deleted the group",
    more: " and {count} more",
  },
  ru: {
    expense_added: "{actor} добавил(а) «{title}» · {amount}",
    expense_edited: "{actor} изменил(а) «{title}»",
    expense_deleted: "{actor} удалил(а) «{title}»",
    expense_restored: "{actor} восстановил(а) «{title}»",
    settlement_added: "{actor} отметил(а) погашение · {amount}",
    member_joined: "{actor} вступил(а) в группу",
    group_deleted: "{actor} удалил(а) группу",
    more: " и ещё {count}",
  },
  uk: {
    expense_added: "{actor} додав(ла) «{title}» · {amount}",
    expense_edited: "{actor} змінив(ла) «{title}»",
    expense_deleted: "{actor} видалив(ла) «{title}»",
    expense_restored: "{actor} відновив(ла) «{title}»",
    settlement_added: "{actor} позначив(ла) погашення · {amount}",
    member_joined: "{actor} приєднався(лася) до групи",
    group_deleted: "{actor} видалив(ла) групу",
    more: " і ще {count}",
  },
  de: {
    expense_added: "{actor} hat „{title}“ hinzugefügt · {amount}",
    expense_edited: "{actor} hat „{title}“ bearbeitet",
    expense_deleted: "{actor} hat „{title}“ gelöscht",
    expense_restored: "{actor} hat „{title}“ wiederhergestellt",
    settlement_added: "{actor} hat eine Zahlung erfasst · {amount}",
    member_joined: "{actor} ist der Gruppe beigetreten",
    group_deleted: "{actor} hat die Gruppe gelöscht",
    more: " und {count} weitere",
  },
  es: {
    expense_added: "{actor} añadió «{title}» · {amount}",
    expense_edited: "{actor} editó «{title}»",
    expense_deleted: "{actor} eliminó «{title}»",
    expense_restored: "{actor} restauró «{title}»",
    settlement_added: "{actor} registró un pago · {amount}",
    member_joined: "{actor} se unió al grupo",
    group_deleted: "{actor} eliminó el grupo",
    more: " y {count} más",
  },
  it: {
    expense_added: "{actor} ha aggiunto «{title}» · {amount}",
    expense_edited: "{actor} ha modificato «{title}»",
    expense_deleted: "{actor} ha eliminato «{title}»",
    expense_restored: "{actor} ha ripristinato «{title}»",
    settlement_added: "{actor} ha registrato un pagamento · {amount}",
    member_joined: "{actor} è entrato nel gruppo",
    group_deleted: "{actor} ha eliminato il gruppo",
    more: " e altre {count}",
  },
  ja: {
    expense_added: "{actor}が「{title}」を追加 · {amount}",
    expense_edited: "{actor}が「{title}」を編集",
    expense_deleted: "{actor}が「{title}」を削除",
    expense_restored: "{actor}が「{title}」を復元",
    settlement_added: "{actor}が支払いを記録 · {amount}",
    member_joined: "{actor}がグループに参加しました",
    group_deleted: "{actor}がグループを削除しました",
    more: " ほか{count}件",
  },
  ka: {
    expense_added: "{actor} დაამატა „{title}“ · {amount}",
    expense_edited: "{actor} შეცვალა „{title}“",
    expense_deleted: "{actor} წაშალა „{title}“",
    expense_restored: "{actor} აღადგინა „{title}“",
    settlement_added: "{actor} დააფიქსირა გადახდა · {amount}",
    member_joined: "{actor} შეუერთდა ჯგუფს",
    group_deleted: "{actor} წაშალა ჯგუფი",
    more: " და კიდევ {count}",
  },
  pl: {
    expense_added: "{actor} dodał(a) „{title}” · {amount}",
    expense_edited: "{actor} edytował(a) „{title}”",
    expense_deleted: "{actor} usunął(ęła) „{title}”",
    expense_restored: "{actor} przywrócił(a) „{title}”",
    settlement_added: "{actor} zapisał(a) spłatę · {amount}",
    member_joined: "{actor} dołączył(a) do grupy",
    group_deleted: "{actor} usunął(ęła) grupę",
    more: " i jeszcze {count}",
  },
  ro: {
    expense_added: "{actor} a adăugat „{title}” · {amount}",
    expense_edited: "{actor} a modificat „{title}”",
    expense_deleted: "{actor} a șters „{title}”",
    expense_restored: "{actor} a restaurat „{title}”",
    settlement_added: "{actor} a înregistrat o plată · {amount}",
    member_joined: "{actor} s-a alăturat grupului",
    group_deleted: "{actor} a șters grupul",
    more: " și încă {count}",
  },
};

const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));

export interface PushPayload {
  type: PushType;
  groupId: string;
  groupName: string;
  groupEmoji: string;
  actorName: string;
  title?: string;
  amountMinor?: number;
  currency?: string;
  suppressedCount?: number;
}

export async function sendGroupPush(recipientUids: string[], payload: PushPayload): Promise<void> {
  if (recipientUids.length === 0) return;
  const db = adminDb();
  const tokenDocs = await Promise.all(recipientUids.map((uid) => db.collection("users").doc(uid).collection("pushTokens").get()));

  const messages = tokenDocs.flatMap((snapshot) =>
    snapshot.docs
      .map((doc) => doc.data() as { token?: string; locale?: string })
      .filter((data) => typeof data.token === "string" && data.token.startsWith("ExponentPushToken"))
      .map((data) => {
        const locale = (data.locale ?? "en").slice(0, 2);
        const strings = STRINGS[locale] ?? STRINGS.en;
        let amount = "";
        if (payload.amountMinor != null && payload.currency) {
          try {
            amount = new Intl.NumberFormat(locale, { style: "currency", currency: payload.currency }).format(
              fromMinor(payload.amountMinor, payload.currency),
            );
          } catch {
            amount = `${fromMinor(payload.amountMinor, payload.currency)} ${payload.currency}`;
          }
        }
        const more = payload.suppressedCount ? fill(strings.more, { count: payload.suppressedCount }) : "";
        return {
          to: data.token as string,
          title: `${payload.groupEmoji} ${payload.groupName}`.trim(),
          body: fill(strings[payload.type], { actor: payload.actorName, title: payload.title ?? "", amount }) + more,
          sound: "default",
          // The app routes on type/groupId (HomeScreen's legacy `deepLink` field expects a different shape).
          data: { type: "group", groupId: payload.groupId },
        };
      }),
  );

  for (let i = 0; i < messages.length; i += 100) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(messages.slice(i, i + 100)),
    }).catch((error) => console.warn("[push] send failed", error));
  }
}
