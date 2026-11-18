"use client";

// /admin/messaging — compose and send push / email campaigns.
// Talks to /api/messaging/campaigns with the admin key (sessionStorage only).
import { useCallback, useEffect, useMemo, useState } from "react";
import { renderEmailLayout } from "@/lib/messaging/emailLayout";
import { campaignFooter } from "@/lib/server/messaging/templates";

const LOCALES = ["en", "ru", "uk", "de", "es", "it", "ja", "ka", "pl", "ro"];
const DEEP_LINKS = ["", "home", "budgets", "autopilot", "forecast"];
const KEY_STORAGE = "lumi-messaging-admin-key";

type Channel = "push" | "email";

interface Campaign {
  id: string;
  channel: Channel;
  name: string | null;
  title: string | null;
  body: string;
  status: string;
  recipients: number;
  result: { sent?: number; failed?: number; suppressed?: number; removedTokens?: number } | null;
  createdAt: string | null;
}

const splitList = (text: string) =>
  text
    .split(/[\s,;]+/)
    .map((v) => v.trim())
    .filter(Boolean);

const inputClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2.5 text-[15px] outline-none focus:border-[var(--color-primary)]";

export default function MessagingAdmin() {
  const [adminKey, setAdminKey] = useState("");
  const [channel, setChannel] = useState<Channel>("push");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [deepLink, setDeepLink] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [locales, setLocales] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [testRecipients, setTestRecipients] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    try {
      setAdminKey(sessionStorage.getItem(KEY_STORAGE) ?? "");
    } catch {}
  }, []);

  const call = useCallback(
    async (method: "GET" | "POST", payload?: unknown) => {
      const response = await fetch("/api/messaging/campaigns", {
        method,
        headers: { Authorization: `Bearer ${adminKey}`, "Content-Type": "application/json" },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error([data.error ?? response.status, data.missing].filter(Boolean).join(": "));
      return data;
    },
    [adminKey],
  );

  const loadCampaigns = useCallback(async () => {
    if (!adminKey) return;
    try {
      setCampaigns((await call("GET")).campaigns ?? []);
    } catch (error) {
      setStatus({ tone: "error", text: `History: ${(error as Error).message}` });
    }
  }, [adminKey, call]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const saveKey = (value: string) => {
    setAdminKey(value);
    try {
      sessionStorage.setItem(KEY_STORAGE, value);
    } catch {}
  };

  const payload = (test: boolean, dryRun: boolean) => {
    const testList = splitList(testRecipients);
    return {
      channel,
      name: name || undefined,
      body,
      dryRun,
      ...(channel === "push"
        ? { title: title || undefined, deepLink: deepLink || undefined }
        : { subject, cta: ctaLabel && ctaUrl ? { label: ctaLabel, url: ctaUrl } : undefined }),
      audience: test
        ? channel === "push"
          ? { uids: testList }
          : { emails: testList }
        : { locales, platforms: channel === "push" ? platforms : [] },
    };
  };

  const run = async (mode: "count" | "test" | "send") => {
    setStatus(null);
    if (!adminKey) return setStatus({ tone: "error", text: "Enter the admin key first." });
    if (!body.trim() || (channel === "email" && !subject.trim()))
      return setStatus({ tone: "error", text: channel === "email" ? "Subject and body are required." : "Body is required." });
    if (mode === "test" && splitList(testRecipients).length === 0)
      return setStatus({ tone: "error", text: `Add test ${channel === "push" ? "uids" : "emails"} first.` });

    setBusy(true);
    try {
      if (mode === "send") {
        const { recipients } = await call("POST", payload(false, true));
        const ok = window.confirm(`Send this ${channel} to ${recipients} recipient${recipients === 1 ? "" : "s"}? This can't be undone.`);
        if (!ok) return;
      }
      const result = await call("POST", payload(mode === "test", mode === "count"));
      if (mode === "count") {
        setStatus({ tone: "ok", text: `${result.recipients} recipient${result.recipients === 1 ? "" : "s"} match.` });
      } else {
        const parts = [`sent ${result.sent ?? 0} of ${result.recipients}`];
        if (result.failed) parts.push(`${result.failed} failed`);
        if (result.suppressed) parts.push(`${result.suppressed} unsubscribed`);
        if (result.removedTokens) parts.push(`${result.removedTokens} dead tokens removed`);
        setStatus({ tone: result.failed ? "error" : "ok", text: `${mode === "test" ? "Test" : "Campaign"}: ${parts.join(", ")}.` });
        loadCampaigns();
      }
    } catch (error) {
      setStatus({ tone: "error", text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm font-medium transition ${
      active
        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
        : "border-[var(--color-border)] text-[var(--color-text-muted)]"
    }`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="label" style={{ marginBottom: 8 }}>Lumi messaging</p>
        <h1 className="text-3xl font-bold tracking-tight">Push &amp; email campaigns</h1>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="flex min-w-0 flex-col gap-6">
      <section className="surface rounded-3xl p-5 sm:p-7 flex flex-col gap-3">
        <label className="text-sm font-semibold">Admin key</label>
        <input
          type="password"
          className={inputClass}
          value={adminKey}
          onChange={(e) => saveKey(e.target.value)}
          placeholder="MESSAGING_ADMIN_KEY"
          autoComplete="off"
        />
      </section>

      <section className="surface rounded-3xl p-5 sm:p-7 flex flex-col gap-4">
        <div className="flex gap-2">
          {(["push", "email"] as Channel[]).map((c) => (
            <button key={c} type="button" className={chip(channel === c)} onClick={() => setChannel(c)}>
              {c === "push" ? "Push" : "Email"}
            </button>
          ))}
        </div>

        <Field label="Internal name (optional)">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="November budgets nudge" />
        </Field>

        {channel === "push" ? (
          <>
            <Field label="Title (optional)">
              <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
            </Field>
            <Field label={`Body · ${body.length}/500`}>
              <textarea className={inputClass} rows={3} value={body} onChange={(e) => setBody(e.target.value)} maxLength={500} />
            </Field>
            <Field label="Opens on tap">
              <select className={inputClass} value={deepLink} onChange={(e) => setDeepLink(e.target.value)}>
                {DEEP_LINKS.map((d) => (
                  <option key={d} value={d}>
                    {d || "App (no specific screen)"}
                  </option>
                ))}
              </select>
            </Field>
          </>
        ) : (
          <>
            <Field label="Subject">
              <input className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} />
            </Field>
            <Field label="Body (plain text, blank line = new paragraph, URLs become links)">
              <textarea className={inputClass} rows={9} value={body} onChange={(e) => setBody(e.target.value)} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Button label (optional)">
                <input className={inputClass} value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} maxLength={60} />
              </Field>
              <Field label="Button URL (https)">
                <input className={inputClass} value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://" />
              </Field>
            </div>
          </>
        )}
      </section>

      <section className="surface rounded-3xl p-5 sm:p-7 flex flex-col gap-4">
        <h2 className="text-lg font-bold">Audience</h2>
        <Field label="App language (none selected = everyone)">
          <div className="flex flex-wrap gap-2">
            {LOCALES.map((l) => (
              <button key={l} type="button" className={chip(locales.includes(l))} onClick={() => toggle(locales, setLocales, l)}>
                {l}
              </button>
            ))}
          </div>
        </Field>
        {channel === "push" && (
          <Field label="Platform (none selected = both)">
            <div className="flex gap-2">
              {["ios", "android"].map((p) => (
                <button key={p} type="button" className={chip(platforms.includes(p))} onClick={() => toggle(platforms, setPlatforms, p)}>
                  {p === "ios" ? "iOS" : "Android"}
                </button>
              ))}
            </div>
          </Field>
        )}
        {channel === "email" && (
          <p className="text-sm text-[var(--color-text-muted)]">
            Accounts with an email (Firebase Auth). Language comes from the user&apos;s device token; users without one only
            match when no language is selected. Unsubscribed addresses are always skipped.
          </p>
        )}
        <Field label={channel === "push" ? "Test uids (Firebase uid, comma or newline separated)" : "Test emails"}>
          <textarea className={inputClass} rows={2} value={testRecipients} onChange={(e) => setTestRecipients(e.target.value)} />
        </Field>

        <div className="flex flex-wrap gap-2 pt-1">
          <button type="button" disabled={busy} className={chip(false)} onClick={() => run("count")}>
            Count recipients
          </button>
          <button type="button" disabled={busy} className={chip(false)} onClick={() => run("test")}>
            Send test
          </button>
          <button type="button" disabled={busy} className="btn-violet rounded-full px-5 py-2 text-sm font-semibold" onClick={() => run("send")}>
            {busy ? "Working…" : "Send to audience"}
          </button>
        </div>
        {status && (
          <p className={`text-sm font-medium ${status.tone === "ok" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
            {status.text}
          </p>
        )}
      </section>

      <section className="surface rounded-3xl p-5 sm:p-7 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">History</h2>
          <button type="button" className="text-sm text-[var(--color-primary)]" onClick={loadCampaigns}>
            Refresh
          </button>
        </div>
        {campaigns.length === 0 && <p className="text-sm text-[var(--color-text-muted)]">No campaigns yet.</p>}
        {campaigns.map((c) => (
          <div key={c.id} className="border-t border-[var(--color-border)] pt-3 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold">
                {c.channel === "push" ? "Push" : "Email"} · {c.name || c.title || c.body.slice(0, 40)}
              </span>
              <span className="text-[var(--color-text-muted)]">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</span>
            </div>
            <div className="text-[var(--color-text-muted)]">
              {c.status} · {c.result?.sent ?? 0}/{c.recipients} sent
              {c.result?.failed ? ` · ${c.result.failed} failed` : ""}
              {c.result?.suppressed ? ` · ${c.result.suppressed} unsubscribed` : ""}
            </div>
          </div>
        ))}
      </section>
      </div>

      <div className="min-w-0 lg:sticky lg:top-6 order-first lg:order-none">
        <Preview
          channel={channel}
          title={title}
          subject={subject}
          body={body}
          ctaLabel={ctaLabel}
          ctaUrl={ctaUrl}
          defaultLocale={locales[0] ?? "en"}
          defaultPlatform={platforms.length === 1 ? platforms[0] : "ios"}
        />
      </div>
      </div>
    </div>
  );
}

// ── Preview ────────────────────────────────────────────────────────────────

function Preview(props: {
  channel: Channel;
  title: string;
  subject: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  defaultLocale: string;
  defaultPlatform: string;
}) {
  const [platform, setPlatform] = useState(props.defaultPlatform);
  const [locale, setLocale] = useState(props.defaultLocale);
  const [wide, setWide] = useState(false);
  useEffect(() => setPlatform(props.defaultPlatform), [props.defaultPlatform]);
  useEffect(() => setLocale(props.defaultLocale), [props.defaultLocale]);

  const segment = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-semibold transition ${
      active ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-muted)]"
    }`;

  return (
    <section className="surface rounded-3xl p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Preview</h2>
        <div className="flex gap-1 rounded-full border border-[var(--color-border)] p-1">
          {props.channel === "push"
            ? (["ios", "android"] as const).map((p) => (
                <button key={p} type="button" className={segment(platform === p)} onClick={() => setPlatform(p)}>
                  {p === "ios" ? "iOS" : "Android"}
                </button>
              ))
            : [false, true].map((w) => (
                <button key={String(w)} type="button" className={segment(wide === w)} onClick={() => setWide(w)}>
                  {w ? "Desktop" : "Phone"}
                </button>
              ))}
        </div>
      </div>
      {props.channel === "push" ? (
        platform === "android" ? (
          <AndroidPush title={props.title} body={props.body} />
        ) : (
          <IosPush title={props.title} body={props.body} />
        )
      ) : (
        <>
          <label className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            Footer language
            <select
              className="rounded-lg border border-[var(--color-border)] bg-transparent px-2 py-1"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
            >
              {LOCALES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <EmailPreview {...props} locale={locale} wide={wide} />
        </>
      )}
      <p className="text-xs text-[var(--color-text-muted)]">
        {props.channel === "push"
          ? "Approximation: the system draws the real notification and may cut long text differently."
          : "The exact HTML that will be sent. Your mail app may restyle it slightly."}
      </p>
    </section>
  );
}

const placeholder = (text: string, fallback: string) => text.trim() || fallback;

function IosPush({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-[28px] px-3 pb-10 pt-8 text-white"
      style={{ background: "linear-gradient(160deg,#4C46B8 0%,#6C63FF 45%,#A78BFA 100%)", minHeight: 360 }}
    >
      <div className="text-center">
        <div className="text-sm font-semibold opacity-90">Wednesday, 12 November</div>
        <div className="text-[64px] font-bold leading-none tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
          9:41
        </div>
      </div>
      <div
        className="mt-8 flex gap-2.5 rounded-[22px] p-3 text-black"
        style={{ background: "rgba(245,245,250,0.78)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.png" alt="" width={38} height={38} className="h-[38px] w-[38px] shrink-0 rounded-[9px]" />
        <div className="min-w-0 flex-1 text-[15px] leading-[1.3]">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate font-semibold">{title.trim() || "Lumi"}</span>
            <span className="shrink-0 text-[13px] text-black/50">now</span>
          </div>
          <div className="line-clamp-4 whitespace-pre-line break-words">{placeholder(body, "Notification text appears here")}</div>
        </div>
      </div>
    </div>
  );
}

function AndroidPush({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[28px] bg-[#1f1f24] px-3 pb-10 pt-6" style={{ minHeight: 360 }}>
      <div className="mb-6 flex justify-between px-2 text-xs font-medium text-white/80">
        <span>9:41</span>
        <span>Wed, Nov 12</span>
      </div>
      <div className="rounded-[24px] bg-[#f3f1f8] p-4 text-[#1b1b1f]">
        <div className="mb-1.5 flex items-center gap-2 text-xs text-[#5c5b66]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="" width={18} height={18} className="h-[18px] w-[18px] rounded-full" />
          <span>Lumi</span>
          <span>•</span>
          <span>now</span>
        </div>
        {title.trim() && <div className="truncate text-[15px] font-semibold">{title}</div>}
        <div className="line-clamp-2 whitespace-pre-line break-words text-[14px] text-[#45444f]">
          {placeholder(body, "Notification text appears here")}
        </div>
      </div>
    </div>
  );
}

function EmailPreview(props: {
  subject: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  locale: string;
  wide: boolean;
}) {
  const html = useMemo(
    () =>
      renderEmailLayout(
        {
          subject: placeholder(props.subject, "Subject"),
          body: placeholder(props.body, "Email text appears here.\n\nBlank line = new paragraph."),
          ...(props.ctaLabel && props.ctaUrl ? { cta: { label: props.ctaLabel, url: props.ctaUrl } } : {}),
          footer: campaignFooter(props.locale),
        },
        "#",
      ).html,
    [props.subject, props.body, props.ctaLabel, props.ctaUrl, props.locale],
  );
  const snippet = props.body.replace(/\s+/g, " ").trim().slice(0, 90);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
      <div className="border-b border-[var(--color-border)] px-4 py-3 text-[13px] leading-snug">
        <div className="flex justify-between gap-2">
          <span className="font-semibold">Lumi</span>
          <span className="text-[var(--color-text-muted)]">9:41</span>
        </div>
        <div className="truncate font-medium">{placeholder(props.subject, "Subject")}</div>
        <div className="truncate text-[var(--color-text-muted)]">{snippet || "Preview text"}</div>
      </div>
      <div className="overflow-x-auto bg-[#f9f9fd]">
        <iframe
          title="Email preview"
          sandbox=""
          srcDoc={html}
          className="mx-auto block border-0"
          style={{ width: props.wide ? 600 : 375, maxWidth: props.wide ? "none" : "100%", height: 620 }}
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </div>
  );
}
