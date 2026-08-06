import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import VideoScrubber from "./components/VideoScrubber";
import SecondVideoScrubber from "./components/SecondVideoScrubber";
import ScrollExitSplitText from "./components/ScrollExitSplitText";
import SoapTiles from "./components/SoapTiles";
import CylindricalTextDrum from "./components/CylindricalTextDrum";
import Marquee from "./components/Marquee";
import { GoogleWordmark, GithubWordmark } from "./components/Logos";
import type { NavigationItem } from "./types";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const clamp01 = (v: number) => clamp(v, 0, 1);

const MAX_SCROLL = 3.5;

function updateActiveSection(progress: number): string {
  if (progress < 0.18) return "hero";
  if (progress < 0.45) return "projects";
  if (progress < 0.68) return "expertise";
  if (progress < 1.15) return "about";
  return "contact";
}

const easeInOutCubic = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lerpedScrollProgress, setLerpedScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState("hero");

  const scrollTargetRef = useRef(0);
  const lerpedRef = useRef(0);
  const navAnimRef = useRef<number | null>(null);

  // Keep target ref in sync with state
  scrollTargetRef.current = scrollProgress;

  const setScroll = useCallback((value: number) => {
    const clamped = clamp(value, 0, MAX_SCROLL);
    scrollTargetRef.current = clamped;
    setScrollProgress(clamped);
    setActiveSectionId(updateActiveSection(clamped));
  }, []);

  const cancelNavAnim = useCallback(() => {
    if (navAnimRef.current !== null) {
      cancelAnimationFrame(navAnimRef.current);
      navAnimRef.current = null;
    }
  }, []);

  // Gesture controller — runs once on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let lastTouchY = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelNavAnim();
      const scaleFactor = 0.0006;
      setScroll(scrollTargetRef.current + e.deltaY * scaleFactor);
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      cancelNavAnim();
      const currentTouchY = e.touches[0].clientY;
      const deltaTouchY = lastTouchY - currentTouchY;
      lastTouchY = currentTouchY;
      const scaleFactor = 0.0015;
      setScroll(scrollTargetRef.current + deltaTouchY * scaleFactor);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [setScroll, cancelNavAnim]);

  // Smoothing rAF loop for lerpedScrollProgress
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const target = scrollTargetRef.current;
      let current = lerpedRef.current;
      current += (target - current) * 0.08;
      if (Math.abs(target - current) < 0.0001) {
        current = target;
      }
      if (current !== lerpedRef.current) {
        lerpedRef.current = current;
        setLerpedScrollProgress(current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Programmatic navigation
  const handleNavigateToSection = useCallback(
    (item: NavigationItem) => {
      cancelNavAnim();
      const start = scrollTargetRef.current;
      const end = item.scrollRatio;
      const duration = 1200;
      let startTime: number | null = null;

      const step = (now: number) => {
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(t);
        const value = start + (end - start) * eased;
        setScroll(value);
        if (t < 1) {
          navAnimRef.current = requestAnimationFrame(step);
        } else {
          navAnimRef.current = null;
        }
      };
      navAnimRef.current = requestAnimationFrame(step);
    },
    [setScroll, cancelNavAnim]
  );

  // Derived values
  const secondScreenProgress = clamp01((lerpedScrollProgress - 1.15) / 0.5);
  const easedRisingProgress = 1 - Math.pow(1 - secondScreenProgress, 3);
  // A full-screen blur() over a decoding <video> is very GPU-heavy; cap it so
  // the rise stays smooth instead of stuttering.
  const smoothBlurAmount = Math.sin((secondScreenProgress * Math.PI) / 2) * 24;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#FF005E] text-white">
      <div className="relative w-full h-full overflow-hidden">
        {/* FIRST SCREEN — gets blurred as second screen rises */}
        <div
          className="absolute inset-0 w-full h-full z-10 transition-transform duration-[100ms] ease-out"
          style={{
            filter:
              secondScreenProgress > 0 ? `blur(${smoothBlurAmount}px)` : "none",
          }}
        >
          <VideoScrubber
            scrollProgress={Math.min(1, lerpedScrollProgress)}
            active={secondScreenProgress < 0.98}
          />

          {/* Hero title strip pinned to bottom */}
          <div className="absolute bottom-[40px] left-[1%] right-[1%] w-[98%] pointer-events-none z-20 select-none flex justify-center items-center">
            <ScrollExitSplitText
              scrollProgress={Math.min(1, lerpedScrollProgress)}
              containerClassName="w-full text-[10.4vw] leading-none font-michroma font-normal uppercase text-white whitespace-nowrap text-center transition-all duration-300 will-change-transform"
              style={{ letterSpacing: "-0.07em" }}
            >
              INNER CIRCLE
            </ScrollExitSplitText>
          </div>

          <SoapTiles scrollProgress={lerpedScrollProgress} />
        </div>

        <Header
          activeSectionId={activeSectionId}
          onNavigate={handleNavigateToSection}
        />

        {/* SECOND SCREEN — rises from below, rounded top */}
        <div
          className="absolute bottom-0 left-0 w-full h-full bg-[#11010a] rounded-t-[48px] overflow-hidden z-40"
          style={{
            transform: `translateY(${(1 - easedRisingProgress) * 100}%)`,
            visibility: secondScreenProgress > 0 ? "visible" : "hidden",
            willChange: "transform",
          }}
        >
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-[5px] bg-white rounded-full z-50 pointer-events-none" />
          <SecondVideoScrubber
            scrollProgress={lerpedScrollProgress}
            active={secondScreenProgress > 0}
          />
          <CylindricalTextDrum scrollProgress={lerpedScrollProgress} />

          <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 w-full sm:w-[65%] md:w-[60%] pl-6 sm:pl-12 md:pl-20 pr-6 sm:pr-12 md:pr-16 z-50 pointer-events-auto">
            <div className="w-full border-t border-white/[0.08] pt-6">
              <Marquee gap="80px" speed={25} fade>
                <GoogleWordmark size={100} />
                <GithubWordmark size={100} />
                <img
                  src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/voiceflow-logo-svg-150px.svg"
                  alt="Voiceflow"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/zendesk-logo-svg-150px.svg"
                  alt="Zendesk"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/pendo-logo-svg-150px.svg"
                  alt="Pendo"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/glide-logo-svg-150px.svg"
                  alt="Glide"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/canva-logo-svg-150px.svg"
                  alt="Canva"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
