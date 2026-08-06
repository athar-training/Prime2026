import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";

interface ScrollExitSplitTextProps {
  children: string;
  scrollProgress: number;
  containerClassName?: string;
  style?: CSSProperties;
}

export default function ScrollExitSplitText({
  children,
  scrollProgress,
  containerClassName = "",
  style,
}: ScrollExitSplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Build split-text + timeline once (per text content)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = children.split(" ");
    container.innerHTML = "";

    const line = document.createElement("span");
    line.className = "inline-block";

    words.forEach((word, wi) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "inline-block";
      for (const ch of word) {
        const charSpan = document.createElement("span");
        charSpan.className = "char inline-block will-change-transform";
        charSpan.textContent = ch;
        wordSpan.appendChild(charSpan);
      }
      line.appendChild(wordSpan);
      if (wi < words.length - 1) {
        const space = document.createElement("span");
        space.className = "inline-block";
        space.innerHTML = "&nbsp;";
        line.appendChild(space);
      }
    });

    container.appendChild(line);

    const chars = container.querySelectorAll<HTMLElement>(".char");
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(
      chars,
      { opacity: 1, yPercent: 0, y: 0, scaleY: 1, scaleX: 1, transformOrigin: "50% 0%" },
      {
        opacity: 0,
        yPercent: 300,
        y: "25vh",
        scaleY: 1.2,
        scaleX: 0.9,
        stagger: 0.03,
        ease: "power2.inOut",
      }
    );
    timelineRef.current = tl;

    return () => {
      tl.kill();
      timelineRef.current = null;
    };
  }, [children]);

  // Scrub timeline based on scrollProgress
  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    gsap.to(tl, {
      progress: Math.min(1, Math.max(0, scrollProgress)),
      duration: 0.6,
      ease: "power1.out",
      overwrite: "auto",
    });
  }, [scrollProgress]);

  return <div ref={containerRef} className={containerClassName} style={style} />;
}
