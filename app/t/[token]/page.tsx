// Live read-only group page: https://lumi.herman-apps.com/t/<token>[?m=<memberId>]
// For people who don't want the app. Rendered with fresh data on the server,
// then the client polls /api/public/trip/<token> so it stays current.
import type { Metadata } from "next";
import { cache } from "react";
import { headers } from "next/headers";
import LiveTrip, { type PublicTrip } from "@/components/groups/LiveTrip";
import { getPublicTrip } from "@/lib/server/groups";
import { groupsCopy, pickLocale } from "@/lib/groupsWebI18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ m?: string | string[] }>;
};

const loadTrip = cache(async (token: string): Promise<PublicTrip | null> => {
  try {
    return (await getPublicTrip(token)) as unknown as PublicTrip;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const [trip, h] = await Promise.all([loadTrip(token), headers()]);
  const copy = groupsCopy(pickLocale(h.get("accept-language")));
  // No amounts in the preview: link previews are visible to everyone in a chat.
  const title = trip ? `${trip.emoji} ${trip.name} · Lumi` : "Lumi";
  return {
    title: { absolute: title },
    description: trip ? copy.trip.eyebrow : copy.trip.disabledTitle,
    robots: { index: false, follow: false },
    openGraph: { title, description: copy.trip.eyebrow },
  };
}

export default async function TripPage({ params, searchParams }: Props) {
  const [{ token }, query, h] = await Promise.all([params, searchParams, headers()]);
  const trip = await loadTrip(token);
  const locale = pickLocale(h.get("accept-language"));
  const memberId = typeof query.m === "string" ? query.m : null;

  return (
    <main className="relative flex min-h-screen justify-center overflow-hidden px-4 py-10">
      <div
        className="hero-orb pointer-events-none absolute"
        style={{ top: -500, left: "50%", transform: "translateX(-50%)", opacity: 0.55 }}
      />
      <div className="relative w-full" style={{ maxWidth: 560 }}>
        <LiveTrip token={token} initial={trip} locale={locale} memberId={memberId} />
      </div>
    </main>
  );
}
