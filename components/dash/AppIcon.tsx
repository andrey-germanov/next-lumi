"use client";

import { ICON_INNER, EMOJI_TO_ICON } from "@/lib/appIcons";

// A few UI-action glyphs the category set doesn't cover, in the same line style.
const EXTRA: Record<string, string> = {
  plus: '<line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />',
};

/**
 * Renders an app icon by emoji (e.g. a category's `icon` field) or by icon name
 * (e.g. "HomeIcon"). Falls back to the clipboard icon, exactly like the app.
 */
export function AppIcon({ name, size = 24, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  if (EXTRA[name]) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ color, flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: EXTRA[name] }} />
    );
  }
  const key = EMOJI_TO_ICON[name] ?? name;
  const inner = ICON_INNER[key] ?? ICON_INNER.ClipboardIcon;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ color, flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: inner }} />
  );
}
