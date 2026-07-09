"use client";

import { useEffect } from "react";

/** Sets <html lang> to the active locale on locale-prefixed pages. */
export default function HtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [locale]);
  return null;
}
