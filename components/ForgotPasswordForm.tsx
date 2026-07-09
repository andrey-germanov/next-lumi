"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { motion } from "framer-motion";
import { firebaseAuth, authErrorMessage } from "@/lib/firebase";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    fontSize: 15,
    color: "#0A0A0A",
    background: "#F7F7F8",
    border: "1px solid rgba(0,0,0,0.07)",
    borderRadius: 12,
    padding: "13px 14px",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await sendPasswordResetEmail(firebaseAuth(), email);
      setSent(true);
    } catch (err) {
      const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code: unknown }).code) : "";
      setError(authErrorMessage(code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      style={{ maxWidth: 400 }}
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
        <p className="label" style={{ marginBottom: 10 }}>Reset password</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, color: "#0A0A0A", marginBottom: 6 }}>
          Forgot your password?
        </h1>

        {sent ? (
          <p style={{ fontSize: 14, color: "#63636B", lineHeight: 1.6, marginTop: 12 }}>
            If an account exists for <strong style={{ color: "#0A0A0A" }}>{email}</strong>, we&apos;ve sent a link to reset your password. Check your inbox.
          </p>
        ) : (
          <>
            <p style={{ fontSize: 14, color: "#63636B", lineHeight: 1.6, marginBottom: 28 }}>
              Enter your email and we&apos;ll send you a link to reset it.
            </p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0A0A0A", marginBottom: 8 }}>Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#6C63FF"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.12)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
              />

              {error && (
                <p role="alert" style={{ fontSize: 13, color: "#D63B57", background: "rgba(214,59,87,0.08)", borderRadius: 10, padding: "10px 12px", marginTop: 16, lineHeight: 1.5 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-violet w-full"
                style={{ fontSize: 15, padding: "13px 16px", marginTop: 16, opacity: submitting ? 0.7 : 1, cursor: submitting ? "default" : "pointer" }}
              >
                {submitting ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}
      </div>

      <p style={{ textAlign: "center", fontSize: 14, color: "#63636B", marginTop: 24 }}>
        <Link href="/login" style={{ color: "#6C63FF", fontWeight: 600 }} className="hover:underline">
          Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}
