import { useEffect, useState } from "react";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface Tile {
  label: string;
  baseXOffset: number;
  delay: number;
}

const TILES: Tile[] = [
  { label: "Private Discord & Networking", baseXOffset: 120, delay: 0 },
  { label: "Weekly Market Alpha Drops", baseXOffset: 180, delay: 100 },
  { label: "Exclusive Web3 Tooling Access", baseXOffset: 240, delay: 200 },
];

interface SoapTilesProps {
  scrollProgress: number;
}

export default function SoapTiles({ scrollProgress }: SoapTilesProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visible = scrollProgress > 0.75;
  const easeProgress = clamp01((scrollProgress - 0.75) / 0.22);

  return (
    <div
      className={`absolute left-4 right-4 md:left-[64px] top-[38%] md:top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-[10px] z-40 pointer-events-auto transition-all duration-[800ms] ease-out ${
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-6 md:-translate-x-12 pointer-events-none"
      }`}
    >
      {TILES.map((tile, idx) => {
        const responsiveOffset = isMobile
          ? tile.baseXOffset * 0.25
          : tile.baseXOffset;
        const translateX = (easeProgress - 1) * responsiveOffset;
        const opacity = easeProgress;
        const blur = (1 - easeProgress) * 12;

        // Hover behavior (desktop only)
        let scale = 1;
        let hoverShiftY = 0;
        if (!isMobile && hovered !== null) {
          const baseHeight = 138;
          if (hovered === idx) {
            scale = 1.2;
          } else {
            const shift = baseHeight * 0.1; // 13.8px
            hoverShiftY = idx < hovered ? -shift : shift;
          }
        }

        return (
          <div
            key={tile.label}
            onMouseEnter={() => !isMobile && setHovered(idx)}
            onMouseLeave={() => !isMobile && setHovered(null)}
            className="group relative h-[52px] sm:h-[72px] md:h-[138px] text-black bg-white rounded-xl sm:rounded-2xl md:rounded-[34px] flex items-center justify-center px-4 sm:px-8 md:px-14 w-full md:w-auto md:self-start cursor-pointer origin-left transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap"
            style={{
              transform: `translateX(${translateX}px) translateY(${hoverShiftY}px) scale(${scale})`,
              opacity,
              filter: `blur(${blur}px)`,
              transitionDelay: `${tile.delay}ms`,
            }}
          >
            <span
              className="font-michroma font-medium text-[11px] sm:text-[14px] md:text-[23px] leading-[16px] sm:leading-[22px] md:leading-[34px] tracking-tight"
              style={{ letterSpacing: "-0.03em" }}
            >
              {tile.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
