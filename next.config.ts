import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // app/global-not-found.tsx — required with multiple root layouts.
    globalNotFound: true,
  },
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
  async rewrites() {
    // OAuth discovery for the MCP connector (Claude, ChatGPT). Clients probe
    // both the bare and the path-suffixed protected-resource URL.
    return [
      { source: "/.well-known/oauth-authorization-server", destination: "/api/oauth/metadata/authorization-server" },
      { source: "/.well-known/oauth-authorization-server/:path*", destination: "/api/oauth/metadata/authorization-server" },
      { source: "/.well-known/oauth-protected-resource", destination: "/api/oauth/metadata/protected-resource" },
      { source: "/.well-known/oauth-protected-resource/:path*", destination: "/api/oauth/metadata/protected-resource" },
    ];
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
