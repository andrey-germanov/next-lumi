"use client";

import { PLAY_STORE_URL } from "@/lib/constants";
import { trackEvent } from "@/lib/posthog";

interface GooglePlayButtonProps {
  location: string;
  variant?: "primary" | "secondary";
  className?: string;
}

/** Google Play twin of AppStoreButton: same size, shape and colours, so the two sit as a pair. */
export default function GooglePlayButton({ location, variant = "primary", className = "" }: GooglePlayButtonProps) {
  const baseStyles =
    "inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 text-base";
  const variants = {
    primary:
      "bg-primary !no-underline !text-[#fff] hover:bg-primary-dark text-white shadow-lg shadow-primary/25 hover:shadow-primary/40",
    secondary:
      "bg-transparent border-2 border-text text-text hover:bg-text hover:text-white",
  };
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("play_store_click", { location })}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M5 3.2v17.6c0 .5.3.9.8 1.1L17.3 12 5.8 2.1c-.5.2-.8.6-.8 1.1z" />
      </svg>
      Get it on Google Play
    </a>
  );
}
