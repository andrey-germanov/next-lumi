"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { motion } from "framer-motion";
import { auth, authErrorMessage } from "@/lib/firebase";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
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

  const focus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#6C63FF";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.12)";
  };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)";
    e.currentTarget.style.boxShadow = "none";
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
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
        <p className="label" style={{ marginBottom: 10 }}>Get started</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, color: "#0A0A0A", marginBottom: 6 }}>
          Create your account
        </h1>
        <p style={{ fontSize: 14, color: "#63636B", lineHeight: 1.6, marginBottom: 28 }}>
          Sync your budgets, forecasts, and savings goals across devices.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="name" style={labelStyle}>Name</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

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
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 64 }}
                onFocus={focus}
                onBlur={blur}
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
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>

      <p style={{ textAlign: "center", fontSize: 14, color: "#63636B", marginTop: 24 }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#6C63FF", fontWeight: 600 }} className="hover:underline">
          Sign in
        </Link>
      </p>

      <p style={{ textAlign: "center", fontSize: 12, color: "#8E8E93", marginTop: 28, lineHeight: 1.6 }}>
        By creating an account you agree to our{" "}
        <Link href="/terms" style={{ color: "#63636B" }} className="hover:text-text">Terms</Link>{" "}
        and{" "}
        <Link href="/privacy" style={{ color: "#63636B" }} className="hover:text-text">Privacy Policy</Link>.
      </p>
    </motion.div>
  );
}
