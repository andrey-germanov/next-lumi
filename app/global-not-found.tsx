import type { Metadata } from "next";
import RootDocument from "@/components/RootDocument";
import NotFound from "./(site)/not-found";

// Unmatched URLs. Needed because the app has two root layouts ((site) and
// [locale]), so there's no single layout to compose a 404 from.
export const metadata: Metadata = {
  title: "Page not found | Lumi",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <NotFound />
    </RootDocument>
  );
}
