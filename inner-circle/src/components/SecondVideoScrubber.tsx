import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const VIDEO_URL =
  "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/2026060218225-v_kcy5rl.mp4";

const FALLBACK_DURATION = 4.2;
const DRUM_START = 1.45;
const DRUM_END = 3.5;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface SecondVideoScrubberProps {
  scrollProgress: number;
}

export default function SecondVideoScrubber({
  scrollProgress,
}: SecondVideoScrubberProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentTimeRef = useRef(0);
  const scrollRef = useRef(scrollProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  scrollRef.current = scrollProgress;

  // rAF scrub loop
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const video = videoRef.current;
      if (video) {
        const duration = video.duration || FALLBACK_DURATION;
        const drumProgress = clamp01(
          (scrollRef.current - DRUM_START) / (DRUM_END - DRUM_START)
        );
        const target = drumProgress * duration;
        currentTimeRef.current += (target - currentTimeRef.current) * 0.15;
        if (
          !video.seeking &&
          Math.abs(video.currentTime - currentTimeRef.current) > 0.01
        ) {
          video.currentTime = currentTimeRef.current;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Kickstart: force the browser to fetch + decode the first frame.
  // A scrub-only <video> is never play()'d, so many browsers (Chrome,
  // Safari/iOS) won't fire loadeddata or paint a frame until it plays once.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let settled = false;
    const markLoaded = () => {
      if (!settled) {
        settled = true;
        setIsLoaded(true);
      }
    };
    video.addEventListener("loadeddata", markLoaded);
    video.addEventListener("canplay", markLoaded);

    const kick = () => {
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => video.pause()).catch(() => {
          // Autoplay blocked or interrupted — the frame still buffers.
        });
      }
    };
    video.load();
    kick();

    // Safety net: never trap the loader forever.
    const fallback = window.setTimeout(markLoaded, 12000);

    return () => {
      video.removeEventListener("loadeddata", markLoaded);
      video.removeEventListener("canplay", markLoaded);
      window.clearTimeout(fallback);
    };
  }, []);

  // GSAP mouse parallax
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMove = (e: MouseEvent) => {
      const mx = e.clientX / window.innerWidth - 0.5;
      const my = e.clientY / window.innerHeight - 0.5;
      gsap.to(container, {
        x: -mx * 40,
        y: -my * 40,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-[#11010a] will-change-transform"
    >
      <div className="w-full h-full will-change-transform" style={{ scale: "1.05" }}>
        <video
          ref={videoRef}
          src={VIDEO_URL}
          playsInline
          muted
          preload="auto"
          className="w-full h-full object-cover pointer-events-none"
          onLoadedData={() => setIsLoaded(true)}
        />
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#11010af4]">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <span className="absolute inline-flex w-16 h-16 rounded-full bg-pink-500/20 animate-ping" />
            <span className="w-10 h-10 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin" />
          </div>
          <p className="mt-6 font-manrope font-semibold text-[12px] uppercase tracking-[0.25em] text-pink-500 drop-shadow-[0_0_8px_rgba(234,31,99,0.4)]">
            LOADING DRUM STREAM...
          </p>
        </div>
      )}
    </div>
  );
}
