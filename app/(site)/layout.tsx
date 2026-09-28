import RootDocument, { rootMetadata } from "@/components/RootDocument";

export const metadata = rootMetadata;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
