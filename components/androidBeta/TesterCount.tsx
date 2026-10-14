"use client";

import { useEffect, useState } from "react";

/** "N people have already joined" — rendered only once the count is known and non-zero. */
export default function TesterCount({ template }: { template: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/android-beta")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { count?: number } | null) => {
        if (!cancelled && typeof d?.count === "number") setCount(d.count);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!count) return null;

  return (
    <p className="inline-flex items-center gap-2" style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>
      <span className="relative flex" style={{ width: 8, height: 8 }}>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full" style={{ background: "#34D399", opacity: 0.6 }} />
        <span className="relative inline-flex rounded-full" style={{ width: 8, height: 8, background: "#34D399" }} />
      </span>
      {template.replace("{n}", String(count))}
    </p>
  );
}
