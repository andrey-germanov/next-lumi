import Image from "next/image";

/**
 * Realistic iPhone mockup shared with the mobile app's App Store screenshot
 * generator. The frame PNG (public/images/phone-mockup.png) is 1022×2082 with a
 * transparent screen cutout; the screenshot is overlaid on top of the frame at
 * the exact screen inset, matching the app repo's <Phone> component 1:1.
 */
const MK_W = 1022;
const MK_H = 2082;
const SC_L = (52 / MK_W) * 100;
const SC_T = (46 / MK_H) * 100;
const SC_W = (918 / MK_W) * 100;
const SC_H = (1990 / MK_H) * 100;
const SC_RX = (126 / 918) * 100;
const SC_RY = (126 / 1990) * 100;

export default function PhoneFrame({
  src,
  alt,
  width,
  sizes = "(max-width: 640px) 60vw, 280px",
  priority = false,
  className,
  style,
}: {
  src: string;
  alt: string;
  width?: number | string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{ position: "relative", width: width ?? "100%", aspectRatio: `${MK_W} / ${MK_H}`, ...style }}
    >
      {/* Screenshot, clipped to the screen cutout, sitting on top of the frame */}
      <div
        style={{
          position: "absolute",
          left: `${SC_L}%`,
          top: `${SC_T}%`,
          width: `${SC_W}%`,
          height: `${SC_H}%`,
          borderRadius: `${SC_RX}% / ${SC_RY}%`,
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover", objectPosition: "top" }} priority={priority} />
      </div>

      {/* Device frame (base layer; transparent screen lets the shot show) */}
      <Image
        src="/images/phone-mockup.png"
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        style={{ objectFit: "contain", zIndex: 1, pointerEvents: "none" }}
        priority={priority}
      />
    </div>
  );
}
