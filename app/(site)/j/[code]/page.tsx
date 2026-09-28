// Group invitation landing: https://lumi.herman-apps.com/j/<code>
// With Lumi installed, iOS opens the app directly (universal link /
// app link) and this page is never shown. Without it: preview + install steps
// + the code to type in manually.
import type { Metadata } from "next";
import { cache } from "react";
import { headers } from "next/headers";
import InviteLanding, { type InvitePreview } from "@/components/groups/InviteLanding";
import { normalizeCode, previewInvite } from "@/lib/server/groups";
import { fill, groupsCopy, pickLocale } from "@/lib/groupsWebI18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ code: string }> };

const loadPreview = cache(async (code: string): Promise<InvitePreview | null> => {
  try {
    return (await previewInvite(code, null)) as unknown as InvitePreview;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const [preview, h] = await Promise.all([loadPreview(code), headers()]);
  const copy = groupsCopy(pickLocale(h.get("accept-language")));
  const title = preview ? `${preview.emoji} ${preview.name} · Lumi` : "Lumi";
  const description = preview
    ? fill(copy.invite.metaDescription, { owner: preview.ownerName, group: preview.name })
    : copy.invite.invalidTitle;
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description },
  };
}

export default async function InvitePage({ params }: Props) {
  const { code } = await params;
  const [preview, h] = await Promise.all([loadPreview(code), headers()]);
  const locale = pickLocale(h.get("accept-language"));

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div
        className="hero-orb pointer-events-none absolute"
        style={{ top: -450, left: "50%", transform: "translateX(-50%)", opacity: 0.7 }}
      />
      <div className="relative flex w-full justify-center">
        <InviteLanding preview={preview} code={normalizeCode(code)} locale={locale} />
      </div>
    </main>
  );
}
