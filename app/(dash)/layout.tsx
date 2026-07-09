import type { Metadata } from "next";
import DashShell from "@/components/dash/DashShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return <DashShell>{children}</DashShell>;
}
