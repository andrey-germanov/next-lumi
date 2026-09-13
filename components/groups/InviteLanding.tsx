"use client";

import { useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { APP_STORE_URL, GOOGLE_PLAY_URL, fill, groupsCopy } from "@/lib/groupsWebI18n";

export interface InvitePreview {
  groupId: string;
  name: string;
  emoji: string;
  ownerName: string;
  memberCount: number;
  members: { id: string; name: string; color: string; hasAccount: boolean }[];
  full: boolean;
  status: string;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function StoreButtons({ locale }: { locale: Locale }) {
  const copy = groupsCopy(locale);
  const style: React.CSSProperties = {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 600,
    padding: "12px 14px",
    borderRadius: 12,
    background: "#0A0A0A",
    color: "#FFFFFF",
  };
  return (
    <div className="flex gap-3">
      <a href={APP_STORE_URL} style={style}>
         {copy.appStore}
      </a>
      <a href={GOOGLE_PLAY_URL} style={style}>
        ▶ {copy.googlePlay}
      </a>
    </div>
  );
}

export default function InviteLanding({ preview, code, locale }: { preview: InvitePreview | null; code: string; locale: Locale }) {
  const copy = groupsCopy(locale);
  const [copied, setCopied] = useState(false);
  const prettyCode = code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prettyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the code is visible anyway */
    }
  };

  return (
    <div className="w-full" style={{ maxWidth: 420 }}>
      <div className="flex items-center justify-center gap-2" style={{ marginBottom: 24 }}>
        <Image src="/images/logo/logo.png" alt="Lumi" width={28} height={28} style={{ borderRadius: 8 }} priority />
        <span style={{ fontSize: 19, fontWeight: 700, color: "#6C63FF", letterSpacing: "-0.5px" }}>Lumi</span>
      </div>

      <div className="surface rounded-3xl" style={{ padding: "clamp(24px, 6vw, 36px)" }}>
        {!preview ? (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.8px", color: "#0A0A0A", marginBottom: 8 }}>
              {copy.invite.invalidTitle}
            </h1>
            <p style={{ fontSize: 15, color: "#63636B", lineHeight: 1.5, marginBottom: 24 }}>{copy.invite.invalidBody}</p>
            <StoreButtons locale={locale} />
          </>
        ) : (
          <>
            <p className="label" style={{ marginBottom: 12 }}>
              {copy.invite.eyebrow}
            </p>
            <p style={{ fontSize: 15, color: "#63636B", marginBottom: 6 }}>{fill(copy.invite.title, { owner: preview.ownerName })}</p>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, color: "#0A0A0A", marginBottom: 16 }}>
              {preview.emoji} {preview.name}
            </h1>

            <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
              <div className="flex" style={{ paddingLeft: 8 }}>
                {preview.members.slice(0, 6).map((member) => (
                  <span
                    key={member.id}
                    title={member.name}
                    style={{
                      width: 34,
                      height: 34,
                      marginLeft: -8,
                      borderRadius: "50%",
                      border: "2px solid #FFFFFF",
                      background: member.color,
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {initials(member.name)}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: 14, color: "#63636B" }}>{fill(copy.invite.members, { count: preview.memberCount })}</span>
            </div>

            {preview.full ? (
              <p style={{ fontSize: 15, color: "#B42318", marginBottom: 8 }}>{copy.invite.full}</p>
            ) : (
              <a
                href={`lumi://join/${code}`}
                className="btn-violet block text-center"
                style={{ fontSize: 16, padding: "15px 18px", marginBottom: 28 }}
              >
                {copy.invite.openInApp}
              </a>
            )}

            <div className="surface-raised rounded-2xl" style={{ padding: 18 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", marginBottom: 10 }}>{copy.invite.howTitle}</p>
              <ol style={{ fontSize: 14, color: "#3F3F46", lineHeight: 1.55, paddingLeft: 18, marginBottom: 14, listStyle: "decimal" }}>
                <li>{copy.invite.step1}</li>
                <li>{copy.invite.step2}</li>
              </ol>
              <StoreButtons locale={locale} />
              <p style={{ fontSize: 13, color: "#63636B", marginTop: 18, marginBottom: 8 }}>{copy.invite.codeLabel}</p>
              <div className="flex items-center gap-3">
                <code
                  style={{
                    flex: 1,
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: "#0A0A0A",
                    background: "#FFFFFF",
                    borderRadius: 12,
                    padding: "10px 14px",
                    textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {prettyCode}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{ fontSize: 14, fontWeight: 600, color: "#6C63FF", padding: "10px 12px", borderRadius: 12, background: "#FFFFFF" }}
                >
                  {copied ? copy.invite.copied : copy.invite.copy}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
