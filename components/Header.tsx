"use client";

import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, APP_STORE_URL } from "@/lib/constants";
import { trackAppStoreClick } from "@/lib/posthog";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link href="/" className="flex items-center gap-2" style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.5px" }}>
          <Image src="/images/logo/logo.png" alt="Lumi" width={28} height={28} style={{ borderRadius: 7 }} priority />
          <span style={{ color: "#6C63FF" }}>Lumi</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: 14, color: "#63636B", transition: "color 0.15s" }}
              className="hover:text-text"
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
