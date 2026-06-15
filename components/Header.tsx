"use client";

import Link from "next/link";
import { NAV_LINKS, APP_STORE_URL } from "@/lib/constants";
import { trackAppStoreClick } from "@/lib/posthog";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link href="/" style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
          <span style={{ color: "#6C63FF" }}>Lumi</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: 14, color: "#666", transition: "color 0.15s" }}
              className="hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Download — always visible */}
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackAppStoreClick("header")}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            background: "#6C63FF",
            borderRadius: 10,
            padding: "8px 16px",
            transition: "background 0.15s",
          }}
          className="hover:bg-primary-dark"
        >
          Download
        </a>
      </nav>
    </header>
  );
}
