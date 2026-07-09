"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { StoreProvider, useStore } from "./store";
import { LanguageProvider, useLang } from "./i18n";
import { LOCALES, type Locale } from "@/lib/i18n";
import { AppIcon } from "./AppIcon";
import { Select } from "./Select";

const NAV = [
  { href: "/dashboard", key: "nav.dashboard", icon: "HomeIcon" },
  { href: "/transactions/new", key: "nav.add", icon: "plus" },
  { href: "/budgets", key: "nav.budgets", icon: "TargetIcon" },
  { href: "/goals", key: "nav.goals", icon: "TrophyIcon" },
  { href: "/forecast", key: "nav.forecast", icon: "AnalyticsIcon" },
  { href: "/categories", key: "nav.categories", icon: "TagIcon" },
  { href: "/currency", key: "nav.currency", icon: "CurrencyIcon" },
];

function LanguageSelect({ compact }: { compact?: boolean }) {
  const { locale, setLocale } = useLang();
  return (
    <Select
      value={locale}
      onChange={(v) => setLocale(v as Locale)}
      fullWidth={!compact}
      direction={compact ? "down" : "up"}
      style={compact ? { width: 132 } : undefined}
      options={LOCALES.map((l) => ({ value: l.code, label: l.label }))}
    />
  );
}

function Sidebar({ user, onSignOut }: { user: User | null; onSignOut: () => void }) {
  const pathname = usePathname();
  const { currency } = useStore();
  const { t } = useLang();

  return (
    <aside
      className="hidden lg:flex"
      style={{
        flexDirection: "column",
        width: 256,
        flexShrink: 0,
        borderRight: "1px solid rgba(0,0,0,0.07)",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        height: "100vh",
        padding: "24px 16px",
      }}
    >
      <Link href="/" className="flex items-center gap-2" style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.5px", padding: "0 8px", marginBottom: 28 }}>
        <Image src="/images/logo/logo.png" alt="Lumi" width={26} height={26} style={{ borderRadius: 7 }} />
        <span style={{ color: "#6C63FF" }}>Lumi</span>
      </Link>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? "#6C63FF" : "#63636B",
                background: active ? "rgba(108,99,255,0.08)" : "transparent",
                borderRadius: 10,
                padding: "10px 12px",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <AppIcon name={item.icon} size={18} color={active ? "#6C63FF" : "#63636B"} />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <div style={{ padding: "0 4px 12px" }}>
          <LanguageSelect />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px", marginBottom: 4 }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 999, background: "#6C63FF", color: "#fff", fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
            {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
          </span>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.displayName || t("account.title")}
            </p>
            <p style={{ fontSize: 11, color: "#8E8E93", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email} · {currency.primary}
            </p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          style={{ width: "100%", textAlign: "left", fontSize: 13, fontWeight: 500, color: "#63636B", padding: "8px 12px", borderRadius: 10, cursor: "pointer" }}
          className="hover:text-text"
        >
          {t("account.signOut")}
        </button>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const { t } = useLang();
  return (
    <nav
      className="lg:hidden"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div style={{ display: "flex", gap: 6, overflowX: "auto", flex: 1, minWidth: 0 }}>
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flexShrink: 0,
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                color: active ? "#6C63FF" : "#63636B",
                background: active ? "rgba(108,99,255,0.08)" : "#F7F7F8",
                borderRadius: 999,
                padding: "7px 14px",
                whiteSpace: "nowrap",
              }}
            >
              {t(item.key)}
            </Link>
          );
        })}
      </div>
      <span style={{ flexShrink: 0 }}>
        <LanguageSelect compact />
      </span>
    </nav>
  );
}

export default function DashShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "authed" | "guest">("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth(), (u) => {
      if (u) {
        setUser(u);
        setStatus("authed");
      } else {
        setStatus("guest");
        router.replace("/login");
      }
    });
    return () => unsub();
  }, [router]);

  async function handleSignOut() {
    await signOut(firebaseAuth());
    router.replace("/login");
  }

  if (status !== "authed" || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 14, color: "#63636B" }}>Loading…</p>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <StoreProvider uid={user.uid}>
        <div style={{ display: "flex", minHeight: "100vh", background: "#FBFBFC" }}>
          <Sidebar user={user} onSignOut={handleSignOut} />
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <MobileNav />
            <main style={{ flex: 1, padding: "clamp(20px, 4vw, 40px)", maxWidth: 1120, width: "100%", margin: "0 auto" }}>
              {children}
            </main>
          </div>
        </div>
      </StoreProvider>
    </LanguageProvider>
  );
}
