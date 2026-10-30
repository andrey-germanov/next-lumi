"use client";

// Consent screen for MCP connectors (Claude, ChatGPT…): sign in to Lumi, see
// what the assistant gets, allow or cancel. All validation and the redirect
// URL come from /api/oauth/authorize — this page only relays the decision.
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseAuth, authErrorMessage } from "@/lib/firebase";

const OAUTH_PARAMS = ["response_type", "client_id", "redirect_uri", "code_challenge", "code_challenge_method", "state", "scope", "resource"];

type ClientInfo = { clientName: string; redirectHost: string };

const SHARED = [
  "Expenses and income, with categories, merchants and notes",
  "Budgets, savings goals and recurring payments",
  "Accounts and their balances",
];

const errorCode = (err: unknown) =>
  typeof err === "object" && err !== null && "code" in err ? String((err as { code: unknown }).code) : "";

export default function OAuthConsent() {
  const search = useSearchParams();
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const params = Object.fromEntries(OAUTH_PARAMS.map((k) => [k, search.get(k) ?? undefined]));

  useEffect(() => {
    fetch(`/api/oauth/authorize?${search.toString()}`)
      .then(async (res) => {
        const body = await res.json();
        if (res.ok) setClient(body);
        else setFatal(body.error_description ?? "This connection link is invalid.");
      })
      .catch(() => setFatal("Couldn't reach Lumi. Check your connection and reload."));
    return onAuthStateChanged(firebaseAuth(), setUser);
  }, [search]);

  async function withBusy(fn: () => Promise<void>) {
    setError(null);
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  }

  const signInWith = (provider: GoogleAuthProvider | OAuthProvider) =>
    withBusy(async () => {
      try {
        await signInWithPopup(firebaseAuth(), provider);
      } catch (err) {
        if (errorCode(err) !== "auth/popup-closed-by-user") setError(authErrorMessage(errorCode(err)));
      }
    });

  const signInWithEmail = (e: React.FormEvent) => {
    e.preventDefault();
    return withBusy(async () => {
      try {
        await signInWithEmailAndPassword(firebaseAuth(), email, password);
      } catch (err) {
        setError(authErrorMessage(errorCode(err)));
      }
    });
  };

  const decide = (decision: "allow" | "deny") =>
    withBusy(async () => {
      const idToken = await user!.getIdToken();
      const res = await fetch("/api/oauth/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ ...params, decision }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.redirectTo) {
        window.location.assign(body.redirectTo);
        return;
      }
      setError(
        body.error === "premium_required"
          ? "Connecting AI assistants is part of Lumi Pro. Upgrade in the Lumi app, then try connecting again."
          : body.error_description ?? "Something went wrong. Please try again.",
      );
    });

  const card = (children: React.ReactNode) => (
    <div className="w-full" style={{ maxWidth: 420 }}>
      <div className="flex items-center justify-center gap-2" style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.5px", marginBottom: 28 }}>
        <Image src="/images/logo/logo.png" alt="Lumi" width={30} height={30} style={{ borderRadius: 8 }} priority />
        <span style={{ color: "#6C63FF" }}>Lumi</span>
      </div>
      <div className="surface rounded-3xl" style={{ padding: "clamp(28px, 6vw, 40px)" }}>
        {children}
        {error && (
          <p role="alert" style={{ fontSize: 13, color: "#D63B57", background: "rgba(214,59,87,0.08)", borderRadius: 10, padding: "10px 12px", marginTop: 16, lineHeight: 1.5 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );

  const title = (text: string) => (
    <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.15, color: "#0A0A0A", marginBottom: 8 }}>{text}</h1>
  );
  const muted: React.CSSProperties = { fontSize: 14, color: "#63636B", lineHeight: 1.6 };
  const secondaryButton: React.CSSProperties = {
    width: "100%", fontSize: 15, fontWeight: 600, color: "#0A0A0A", background: "#F7F7F8",
    border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: "13px 16px",
  };
  const input: React.CSSProperties = {
    width: "100%", fontSize: 15, color: "#0A0A0A", background: "#F7F7F8",
    border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: "13px 14px", outline: "none",
  };

  if (fatal) return card(<>{title("Can't connect")}<p style={muted}>{fatal}</p></>);
  if (!client || user === undefined) return card(<p style={muted}>Loading…</p>);

  if (!user) {
    return card(
      <>
        <p className="label" style={{ marginBottom: 10 }}>Connect {client.clientName}</p>
        {title("Sign in to Lumi")}
        <p style={{ ...muted, marginBottom: 24 }}>Use the same account you use in the Lumi app.</p>
        <div style={{ display: "grid", gap: 10 }}>
          <button type="button" disabled={busy} onClick={() => signInWith(new OAuthProvider("apple.com"))}
            style={{ ...secondaryButton, background: "#0A0A0A", color: "#FFFFFF", border: "none" }}>
            Continue with Apple
          </button>
          <button type="button" disabled={busy} onClick={() => signInWith(new GoogleAuthProvider())} style={secondaryButton}>
            Continue with Google
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0" }}>
          <span style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
          <span style={{ fontSize: 12, color: "#8E8E93", fontWeight: 500 }}>or</span>
          <span style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
        </div>
        <form onSubmit={signInWithEmail} style={{ display: "grid", gap: 10 }}>
          <input type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
          <input type="password" required autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} />
          <button type="submit" disabled={busy} className="btn-violet w-full" style={{ fontSize: 15, padding: "13px 16px", opacity: busy ? 0.7 : 1 }}>
            {busy ? "Signing in…" : "Sign in with email"}
          </button>
        </form>
      </>,
    );
  }

  return card(
    <>
      <p className="label" style={{ marginBottom: 10 }}>Connect an AI assistant</p>
      {title(`${client.clientName} wants to read your Lumi finances`)}
      <p style={{ ...muted, marginBottom: 18 }}>
        It will be able to see, but not change:
      </p>
      <ul style={{ display: "grid", gap: 8, marginBottom: 18, paddingLeft: 18, listStyle: "disc", ...muted, color: "#0A0A0A" }}>
        {SHARED.map((line) => <li key={line}>{line}</li>)}
      </ul>
      <p style={{ ...muted, fontSize: 13, marginBottom: 24 }}>
        What you ask is processed by {client.clientName} under its own privacy terms. You can disconnect it at any time from {client.clientName}&apos;s connector settings.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        <button type="button" disabled={busy} onClick={() => decide("allow")} className="btn-violet w-full"
          style={{ fontSize: 15, padding: "13px 16px", opacity: busy ? 0.7 : 1 }}>
          {busy ? "Connecting…" : "Allow read access"}
        </button>
        <button type="button" disabled={busy} onClick={() => decide("deny")} style={secondaryButton}>
          Cancel
        </button>
      </div>
      <p style={{ ...muted, fontSize: 13, textAlign: "center", marginTop: 20 }}>
        Signed in as {user.email ?? "your Lumi account"} ·{" "}
        <button type="button" onClick={() => signOut(firebaseAuth())} style={{ color: "#6C63FF", fontWeight: 600 }}>Switch</button>
      </p>
      <p style={{ fontSize: 12, color: "#8E8E93", textAlign: "center", marginTop: 12 }}>
        Returning to {client.redirectHost} · <Link href="/privacy" style={{ color: "#63636B" }}>Privacy</Link>
      </p>
    </>,
  );
}
