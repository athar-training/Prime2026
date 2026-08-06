const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface Segment {
  text: string;
  highlight: boolean;
}

type Line = Segment[];

const h = (text: string): Segment => ({ text, highlight: true });
const p = (text: string): Segment => ({ text, highlight: false });

// 32 entries — index 15 (the 16th line) is intentionally empty.
const LINES: Line[] = [
  [p("Welcome to the "), h("ultimate convergence")],
  [p("of "), h("digital rebels"), p(", "), h("underground creators"), p(",")],
  [p("and "), h("top-tier product builders"), p(" who")],
  [p("refuse to follow "), h("guidelines"), p(".")],
  [p("This is where "), h("high-end design principles")],
  [p("meet "), h("pure technical execution"), p(",")],
  [p("without the "), h("corporate bureaucracy"), p(" and")],
  [p("meaningless "), h("standard aesthetics"), p(".")],
  [p("We "), h("gather in the shadows"), p(" to build")],
  [p("the "), h("next generation"), p(" of "), h("scalable interfaces"), p(",")],
  [h("automated workflows"), p(", and "), h("decentralized assets")],
  [p("that move the "), h("cultural needle forward"), p(".")],
  [p("Experience "), h("zero-bullshit networking"), p(",")],
  [p("weekly "), h("alpha allocations"), p(", and "), h("unreleased")],
  [h("toolkits"), p(" to shape the "), h("internet's landscape"), p(".")],
  [],
  [p("This is "), h("not another social club")],
  [p("for casual enthusiasts or "), h("template consumers"), p(".")],
  [p("This is a "), h("highly selective environment")],
  [p("engineered for "), h("hyper-productive creators"), p(",")],
  [h("UI/UX visionaries"), p(", and "), h("AI prompt architects")],
  [p("who operate at the "), h("absolute limits")],
  [p("of "), h("digital product creation"), p(".")],
  [p("Our "), h("framework is simple"), p(":")],
  [h("eliminate intermediate noise"), p(",")],
  [h("automate the execution layer"), p(",")],
  [p("and "), h("deploy elite digital products")],
  [p("while others are still "), h("scheduling meetings"), p(".")],
  [p("We loop through "), h("complex design systems"), p(",")],
  [h("break conventional grids"), p(", and")],
  [h("execute fluid interactions"), p(" that")],
  [h("redefine digital environments"), p(".")],
];

const R = 380;
const LINE_HEIGHT = 32;

interface CylindricalTextDrumProps {
  scrollProgress: number;
}

export default function CylindricalTextDrum({
  scrollProgress,
}: CylindricalTextDrumProps) {
  const targetIndex =
    clamp01((scrollProgress - 1.45) / 2.05) * (LINES.length - 1);

  return (
    <div
      className="absolute inset-y-0 left-0 w-full sm:w-[65%] md:w-[60%] z-30 flex flex-col items-start justify-center pointer-events-none select-none text-left pl-6 sm:pl-12 md:pl-20 py-16"
      style={{ perspective: "1000px", perspectiveOrigin: "25% 50%" }}
    >
      <div
        className="relative w-full h-[85vh] flex flex-col justify-center items-start overflow-visible"
        style={{ transformStyle: "preserve-3d" }}
      >
        {LINES.map((segments, idx) => {
          const indexDiff = idx - targetIndex;
          const translateY = indexDiff * LINE_HEIGHT;
          const angleRad = translateY / R;
          const angleDeg = (angleRad * 180) / Math.PI;
          const translateZ = Math.cos(angleRad) * R - R;
          const baseScale = 0.78 + Math.cos(angleRad) * 0.22;
          const opacity = Math.max(0, (Math.cos(angleRad) - 0.2) / 0.8);
          const depthBlur = Math.min(
            8,
            Math.max(0, (Math.abs(indexDiff) - 1.5) * 0.75)
          );

          const transform = `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${
            -angleDeg * 0.8
          }deg) scale(${baseScale})`;

          const isEmpty = segments.length === 0;

          return (
            <p
              key={idx}
              className="absolute font-manrope text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold leading-[0.90] tracking-tight whitespace-nowrap"
              style={{
                transform,
                transformOrigin: "left center",
                opacity: isEmpty ? opacity * 0.3 : opacity,
                letterSpacing: "-0.035em",
                filter: depthBlur > 0.1 ? `blur(${depthBlur}px)` : "none",
                willChange: "transform, opacity, filter",
              }}
            >
              {isEmpty ? (
                <span>&nbsp;</span>
              ) : (
                segments.map((seg, si) => (
                  <span
                    key={si}
                    className={
                      seg.highlight
                        ? "text-white font-bold opacity-100"
                        : "text-white/60"
                    }
                  >
                    {seg.text}
                  </span>
                ))
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}
