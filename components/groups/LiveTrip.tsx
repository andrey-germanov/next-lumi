"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { INTL_LOCALE, type Locale } from "@/lib/i18n";
import { fromMinor } from "@/lib/groupMath";
import { APP_STORE_URL, CATEGORY_EMOJI, GROUPS_INTL, fill, groupsCopy, type GroupsLocale } from "@/lib/groupsWebI18n";

export interface PublicTrip {
  name: string;
  emoji: string;
  baseCurrency: string;
  status: "active" | "frozen" | "archived";
  updatedAt: number;
  ownerMemberId: string | null;
  members: { id: string; name: string; color: string; status: "active" | "left" }[];
  expenses: {
    id: string;
    kind: "expense" | "refund" | "settlement";
    title: string;
    categoryKey: string;
    date: string;
    amountMinor: number;
    currency: string;
    amountBaseMinor: number;
    paidBy: string;
    splits: Record<string, number>;
  }[];
  balances: Record<string, number>;
  transfers: { from: string; to: string; amountMinor: number }[];
  totalSpentMinor: number;
}

const POLL_MS = 25_000;

export default function LiveTrip({
  token,
  initial,
  locale,
  memberId,
}: {
  token: string;
  initial: PublicTrip | null;
  locale: GroupsLocale;
  memberId: string | null;
}) {
  const copy = groupsCopy(locale);
  const intl = INTL_LOCALE[locale as Locale] ?? GROUPS_INTL[locale] ?? "en-US";
  const [trip, setTrip] = useState<PublicTrip | null>(initial);
  const [inactive, setInactive] = useState(initial === null);
  const [lastUpdated, setLastUpdated] = useState(() => initial?.updatedAt ?? Date.now());
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`/api/public/trip/${encodeURIComponent(token)}`, { cache: "no-store" });
      if (response.status === 404) {
        setInactive(true);
        return;
      }
      if (!response.ok) return;
      const data = (await response.json()) as PublicTrip;
      setTrip(data);
      setInactive(false);
      setLastUpdated(Date.now());
    } catch {
      /* offline — keep showing the last data */
    }
  }, [token]);

  useEffect(() => {
    const id = setInterval(refresh, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const money = useCallback(
    (minor: number, currency: string) => {
      try {
        return new Intl.NumberFormat(intl, { style: "currency", currency }).format(fromMinor(minor, currency));
      } catch {
        return `${fromMinor(minor, currency)} ${currency}`;
      }
    },
    [intl],
  );

  const memberName = useMemo(() => {
    const map = new Map(trip?.members.map((m) => [m.id, m]) ?? []);
    return (id: string) => map.get(id)?.name ?? "—";
  }, [trip]);

  const memberColor = useMemo(() => {
    const map = new Map(trip?.members.map((m) => [m.id, m.color]) ?? []);
    return (id: string) => map.get(id) ?? "#A1A1AA";
  }, [trip]);

  const formatDate = (date: string) =>
    new Date(`${date}T12:00:00`).toLocaleDateString(intl, { day: "numeric", month: "short" });

  if (inactive || !trip) {
    return (
      <div className="surface rounded-3xl" style={{ padding: 32, marginTop: 40 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0A0A0A", marginBottom: 8 }}>{copy.trip.disabledTitle}</h1>
        <p style={{ fontSize: 15, color: "#63636B" }}>{copy.trip.disabledBody}</p>
      </div>
    );
  }

  const me = memberId ? trip.members.find((m) => m.id === memberId) : undefined;
  const myBalance = me ? trip.balances[me.id] ?? 0 : 0;
  const myTransfers = me ? trip.transfers.filter((t) => t.from === me.id) : [];

  const handleTellPaid = async () => {
    const owed = myTransfers.reduce((sum, t) => sum + t.amountMinor, 0);
    const text = fill(copy.trip.paidMessage, { amount: money(owed, trip.baseCurrency), group: `${trip.emoji} ${trip.name}` });
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setNotice(copy.trip.copiedMessage);
      setTimeout(() => setNotice(null), 2500);
    } catch {
      /* user dismissed the share sheet */
    }
  };

  const sectionTitle: React.CSSProperties = { marginBottom: 12, marginTop: 28 };
  const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.06)" };
  const dot = (color: string): React.CSSProperties => ({ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 });

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <a href="/" className="flex items-center gap-2">
          <Image src="/images/logo/logo.png" alt="Lumi" width={26} height={26} style={{ borderRadius: 7 }} />
          <span style={{ fontSize: 17, fontWeight: 700, color: "#6C63FF" }}>Lumi</span>
        </a>
        {trip.status !== "active" && (
          <span className="label" style={{ background: "#F4F4F5", padding: "5px 10px", borderRadius: 999 }}>
            {copy.trip.viewOnly}
          </span>
        )}
      </div>

      <div className="surface rounded-3xl" style={{ padding: "clamp(22px, 5vw, 32px)" }}>
        <p className="label" style={{ marginBottom: 8 }}>
          {copy.trip.eyebrow}
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", color: "#0A0A0A", lineHeight: 1.1 }}>
          {trip.emoji} {trip.name}
        </h1>
        <div className="flex items-end justify-between" style={{ marginTop: 20 }}>
          <div>
            <p className="label">{copy.trip.totalSpent}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#0A0A0A", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.8px" }}>
              {money(trip.totalSpentMinor, trip.baseCurrency)}
            </p>
          </div>
          <p style={{ fontSize: 12, color: "#A1A1AA" }}>
            {fill(copy.trip.updated, { time: new Date(lastUpdated).toLocaleTimeString(intl, { hour: "2-digit", minute: "2-digit" }) })}
          </p>
        </div>

        {me && (
          <div
            className="rounded-2xl"
            style={{
              marginTop: 22,
              padding: 18,
              background: myBalance < 0 ? "#FEF3F2" : myBalance > 0 ? "#ECFDF3" : "#F4F4F5",
            }}
          >
            <p style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A" }}>
              {myBalance < 0
                ? fill(copy.trip.youOwe, { name: me.name, amount: money(-myBalance, trip.baseCurrency) })
                : myBalance > 0
                  ? fill(copy.trip.youAreOwed, { name: me.name, amount: money(myBalance, trip.baseCurrency) })
                  : fill(copy.trip.youSettled, { name: me.name })}
            </p>
            {myTransfers.map((t) => (
              <p key={t.to} style={{ fontSize: 15, color: "#3F3F46", marginTop: 6 }}>
                → {memberName(t.to)} · <strong>{money(t.amountMinor, trip.baseCurrency)}</strong>
              </p>
            ))}
            {myTransfers.length > 0 && (
              <button type="button" onClick={handleTellPaid} className="btn-violet" style={{ marginTop: 14, padding: "11px 16px", fontSize: 14 }}>
                {copy.trip.tellPaid}
              </button>
            )}
            {notice && <p style={{ fontSize: 13, color: "#63636B", marginTop: 8 }}>{notice}</p>}
          </div>
        )}

        <p className="label" style={sectionTitle}>
          {copy.trip.whoPays}
        </p>
        {trip.transfers.length === 0 ? (
          <p style={{ fontSize: 15, color: "#63636B" }}>{copy.trip.allSettled}</p>
        ) : (
          trip.transfers.map((t) => (
            <div key={`${t.from}-${t.to}`} style={row}>
              <span style={dot(memberColor(t.from))} />
              <span style={{ flex: 1, fontSize: 15, color: "#0A0A0A" }}>
                {memberName(t.from)} → {memberName(t.to)}
              </span>
              <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{money(t.amountMinor, trip.baseCurrency)}</span>
            </div>
          ))
        )}

        <p className="label" style={sectionTitle}>
          {copy.trip.balances}
        </p>
        {trip.members.map((m) => {
          const value = trip.balances[m.id] ?? 0;
          return (
            <div key={m.id} style={row}>
              <span style={dot(m.color)} />
              <span style={{ flex: 1, fontSize: 15, color: m.status === "left" ? "#A1A1AA" : "#0A0A0A" }}>
                {m.name}
                {m.status === "left" ? ` · ${copy.trip.former}` : ""}
              </span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                  color: value > 0 ? "#067647" : value < 0 ? "#B42318" : "#63636B",
                }}
              >
                {value > 0 ? "+" : ""}
                {money(value, trip.baseCurrency)}
              </span>
            </div>
          );
        })}

        <p className="label" style={sectionTitle}>
          {copy.trip.expenses}
        </p>
        {trip.expenses.length === 0 && <p style={{ fontSize: 15, color: "#63636B" }}>{copy.trip.noExpenses}</p>}
        {trip.expenses.map((e) => (
          <div key={e.id} style={row}>
            <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>
              {e.kind === "settlement" ? "🤝" : e.kind === "refund" ? "↩️" : (CATEGORY_EMOJI[e.categoryKey] ?? "📦")}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, color: "#0A0A0A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {e.kind === "settlement"
                  ? fill(copy.trip.payment, { from: memberName(e.paidBy), to: memberName(Object.keys(e.splits)[0] ?? "") })
                  : e.title || (e.kind === "refund" ? copy.trip.refund : "—")}
              </p>
              <p style={{ fontSize: 12, color: "#A1A1AA" }}>
                {formatDate(e.date)}
                {e.kind !== "settlement" ? ` · ${fill(copy.trip.paidBy, { name: memberName(e.paidBy) })}` : ""}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: e.kind === "refund" ? "#067647" : "#0A0A0A" }}>
                {e.kind === "refund" ? "−" : ""}
                {money(e.amountMinor, e.currency)}
              </p>
              {e.currency !== trip.baseCurrency && (
                <p style={{ fontSize: 12, color: "#A1A1AA", fontVariantNumeric: "tabular-nums" }}>{money(e.amountBaseMinor, trip.baseCurrency)}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="surface-dark rounded-3xl" style={{ padding: 24, marginTop: 16 }}>
        <p style={{ fontSize: 18, fontWeight: 700 }}>{copy.trip.ctaTitle}</p>
        <p style={{ fontSize: 14, color: "#A1A1AA", marginTop: 4, marginBottom: 16 }}>{copy.trip.ctaBody}</p>
        <div className="flex gap-3">
          <a href={APP_STORE_URL} className="btn-violet" style={{ flex: 1, textAlign: "center", padding: "12px 14px", fontSize: 14 }}>
            {copy.appStore}
          </a>
        </div>
      </div>
    </div>
  );
}
