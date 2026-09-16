import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // ka/ja/pl were dropped from the site (thin locales). Send their indexed
    // URLs to the English equivalents so link equity isn't lost to 404s.
    return ["ka", "ja", "pl"].flatMap((locale) => [
      { source: `/${locale}`, destination: "/", permanent: true },
      { source: `/${locale}/:path*`, destination: "/:path*", permanent: true },
    ]);
  },
  async headers() {
    return [
      {
        // iOS universal links (group invitations): Apple fetches this
        // extension-less file and requires a JSON content type.
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
