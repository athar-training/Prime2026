import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  gap?: string;
  speed?: number;
  fade?: boolean;
}

export default function Marquee({
  children,
  gap = "80px",
  speed = 25,
  fade = false,
}: MarqueeProps) {
  return (
    <div
      className={fade ? "marquee-container" : "marquee-container [mask-image:none] [-webkit-mask-image:none]"}
    >
      <div className="marquee-track" style={{ animationDuration: `${speed}s`, gap }}>
        <div className="flex items-center shrink-0" style={{ gap }}>
          {children}
        </div>
        <div className="flex items-center shrink-0" style={{ gap }} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
