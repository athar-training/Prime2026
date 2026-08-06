import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const VIDEO_URL =
  "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/202606021731-e_hqa6sn.mp4";

const FALLBACK_DURATION = 4.2;

interface VideoScrubberProps {
  scrollProgress: number;
}

export default function VideoScrubber({ scrollProgress }: VideoScrubberProps) {
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
        const target = Math.min(
          Math.max(scrollRef.current * duration, 0),
          duration
        );
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
      className="absolute inset-0 w-full h-full bg-[#FF005E] will-change-transform"
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
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#FF005Ef4]">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <span className="absolute inline-flex w-16 h-16 rounded-full bg-pink-500/20 animate-ping" />
            <span className="w-10 h-10 rounded-full border-4 border-[#ea1f63]/20 border-t-[#ea1f63] animate-spin" />
          </div>
          <p className="mt-6 font-manrope font-semibold text-[12px] uppercase tracking-[0.25em] text-pink-500 drop-shadow-[0_0_8px_rgba(234,31,99,0.4)]">
            LOADING SCROLL STREAM...
          </p>
        </div>
      )}
    </div>
  );
}
