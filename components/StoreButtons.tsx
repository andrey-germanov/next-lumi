import AppStoreButton from "./AppStoreButton";
import GooglePlayButton from "./GooglePlayButton";

interface StoreButtonsProps {
  location: string;
  variant?: "primary" | "secondary";
  className?: string;
  /** Stack the two buttons vertically (narrow cards). */
  stack?: boolean;
}

/** Store pair: App Store and Google Play side by side, always used together. */
export default function StoreButtons({ location, variant = "primary", className = "", stack = false }: StoreButtonsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${stack ? "flex-col items-stretch" : ""}`}>
      <AppStoreButton location={location} variant={variant} className={className} />
      <GooglePlayButton location={location} variant={variant} className={className} />
    </div>
  );
}
