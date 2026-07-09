"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";

export default function AccountView() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/login");
  }

  if (loading) {
    return (
      <p style={{ fontSize: 14, color: "#63636B" }}>Loading…</p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      style={{ maxWidth: 420 }}
    >
      <Link
        href="/"
        className="flex items-center justify-center gap-2"
        style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.5px", marginBottom: 28 }}
      >
        <Image src="/images/logo/logo.png" alt="Lumi" width={30} height={30} style={{ borderRadius: 8 }} priority />
        <span style={{ color: "#6C63FF" }}>Lumi</span>
      </Link>

      <div className="surface rounded-3xl" style={{ padding: "clamp(28px, 6vw, 40px)" }}>
        <p className="label" style={{ marginBottom: 10 }}>Your account</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, color: "#0A0A0A", marginBottom: 24 }}>
          {user?.displayName ? `Hi, ${user.displayName}` : "Welcome back"}
        </h1>

        <div style={{ background: "#F7F7F8", borderRadius: 14, padding: "16px 18px", marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "#8E8E93", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Email</p>
          <p style={{ fontSize: 15, color: "#0A0A0A", fontWeight: 500 }}>{user?.email}</p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full hover:opacity-90"
          style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF", background: "#0A0A0A", borderRadius: 12, padding: "13px 16px", transition: "opacity 0.15s", cursor: "pointer" }}
        >
          Sign out
        </button>
      </div>
    </motion.div>
  );
}
