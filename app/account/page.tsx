import type { Metadata } from "next";
import AccountView from "@/components/AccountView";

export const metadata: Metadata = {
  title: "Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
      <div
        className="hero-orb pointer-events-none absolute"
        style={{ top: -450, left: "50%", transform: "translateX(-50%)", opacity: 0.7 }}
      />
      <div className="relative flex w-full justify-center">
        <AccountView />
      </div>
    </main>
  );
}
