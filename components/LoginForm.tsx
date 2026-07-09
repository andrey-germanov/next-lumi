"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { auth, authErrorMessage } from "@/lib/firebase";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#0A0A0A",
    marginBottom: 8,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code: unknown }).code) : "";
      setError(authErrorMessage(code));
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
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center justify-center gap-2"
        style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.5px", marginBottom: 28 }}
      >
        <Image src="/images/logo/logo.png" alt="Lumi" width={30} height={30} style={{ borderRadius: 8 }} priority />
        <span style={{ color: "#6C63FF" }}>Lumi</span>
      </Link>

      <div className="surface rounded-3xl" style={{ padding: "clamp(28px, 6vw, 40px)" }}>
        <p className="label" style={{ marginBottom: 10 }}>Welcome back</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, color: "#0A0A0A", marginBottom: 6 }}>
          Sign in to Lumi
        </h1>
        <p style={{ fontSize: 14, color: "#63636B", lineHeight: 1.6, marginBottom: 28 }}>
          Access your account to sync budgets and forecasts across devices.
        </p>

        {/* <button
          type="button"
          className="w-full hover:opacity-90"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontSize: 15,
            fontWeight: 600,
            color: "#FFFFFF",
            background: "#0A0A0A",
            borderRadius: 12,
            padding: "13px 16px",
            transition: "opacity 0.15s",
          }}
        >
          <AppleMark />
          Continue with Apple
        </button> */}

        {/* Divider */}
        {/* <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0" }}>
          <span style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
          <span style={{ fontSize: 12, color: "#8E8E93", fontWeight: 500 }}>or</span>
          <span style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
        </div> */}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="email" style={labelStyle}>Email</label>
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
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <label htmlFor="password" style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: 13, color: "#6C63FF", fontWeight: 500 }} className="hover:underline">
                Forgot?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 64 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#6C63FF"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.12)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 500, color: "#63636B" }}
                className="hover:text-text"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" style={{ fontSize: 13, color: "#D63B57", background: "rgba(214,59,87,0.08)", borderRadius: 10, padding: "10px 12px", marginTop: 16, lineHeight: 1.5 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-violet w-full"
            style={{ fontSize: 15, padding: "13px 16px", marginTop: 12, opacity: submitting ? 0.7 : 1, cursor: submitting ? "default" : "pointer" }}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <p style={{ textAlign: "center", fontSize: 14, color: "#63636B", marginTop: 24 }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ color: "#6C63FF", fontWeight: 600 }} className="hover:underline">
          Create one
        </Link>
      </p>

      <p style={{ textAlign: "center", fontSize: 12, color: "#8E8E93", marginTop: 28, lineHeight: 1.6 }}>
        Lumi is privacy-first — your financial data stays on your device.
        <br />
        By continuing you agree to our{" "}
        <Link href="/terms" style={{ color: "#63636B" }} className="hover:text-text">Terms</Link>{" "}
        and{" "}
        <Link href="/privacy" style={{ color: "#63636B" }} className="hover:text-text">Privacy Policy</Link>.
      </p>
    </motion.div>
  );
}
