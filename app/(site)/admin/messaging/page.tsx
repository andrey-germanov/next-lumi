import type { Metadata } from "next";
import MessagingAdmin from "@/components/MessagingAdmin";

export const metadata: Metadata = {
  title: "Messaging",
  robots: { index: false, follow: false },
};

export default function MessagingAdminPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16">
      <MessagingAdmin />
    </main>
  );
}
