import { useEffect, useRef, useState } from 'react'
import { Settings, Heart } from 'lucide-react'

const VIDEO_ONE =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_181344_3a592329-bd0b-4dc6-9ac6-cfb250e5ecdd.mp4'
const VIDEO_TWO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_214302_820066a8-f3de-43f3-ab1d-96bd8b2716e6.mp4'

function App() {
  const [showSecond, setShowSecond] = useState(false)
  const [fading, setFading] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  const secondVideoRef = useRef<HTMLVideoElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const touch =
      'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouch(touch)
  }, [])

  useEffect(() => {
    if (isTouch) return
    const onMove = (e: MouseEvent) => {
      const el = cursorRef.current
      if (!el) return
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [isTouch])

  const closeSecond = () => {
    if (fading || !showSecond) return
    setFading(true)
    setShowSecond(false)
    setTimeout(() => {
      setFading(false)
      secondVideoRef.current?.pause()
    }, 600)
  }

  const toggle = () => {
    if (fading) return
    if (!showSecond) {
      const v = secondVideoRef.current
      if (v) {
        v.currentTime = 1
        v.play()
      }
      setShowSecond(true)
    } else {
      closeSecond()
    }
  }

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      onClick={toggle}
      style={{ cursor: isTouch ? 'auto' : 'none' }}
    >
      {!isTouch && (
        <div
          ref={cursorRef}
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
          style={{
            width: 90,
            height: 90,
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0,0,0,0.45)',
            willChange: 'left, top',
          }}
        >
          <span className="text-white text-sm font-medium tracking-wide select-none">
            {showSecond ? 'close' : 'open'}
          </span>
        </div>
      )}

      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_ONE}
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity: 1 }}
      />

      <video
        ref={secondVideoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_TWO}
        muted
        playsInline
        onEnded={closeSecond}
        style={{ opacity: showSecond ? 1 : 0, transition: 'opacity 600ms ease' }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-8 md:p-12 lg:p-16">
        {/* TOP ROW */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 sm:gap-3 max-w-[65%] sm:max-w-sm">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
              style={{
                background:
                  'linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Nexus/
            </h1>

            <Settings
              className="w-6 h-6 sm:w-8 sm:h-8 text-white/70"
              strokeWidth={1.5}
            />

            <p className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl leading-snug tracking-tight">
              A guild and space <span className="font-semibold">for</span>
              <br />
              <span className="font-semibold">forward-looking creation</span>
            </p>
          </div>

          <div
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight shrink-0"
            style={{ color: '#36306E' }}
          >
            /Circle
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold leading-[0.85] tracking-tighter"
              style={{
                background:
                  'linear-gradient(135deg, #ffffff 0%, #d8b4fe 40%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              150+
            </div>
            <div
              className="text-xs sm:text-sm md:text-base tracking-widest uppercase mt-1"
              style={{
                background:
                  'linear-gradient(90deg, #ffffff 0%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              curious minds on board
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div
              className="border rounded-2xl px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-sm bg-white/5 flex flex-col items-center gap-1"
              style={{ borderColor: 'rgba(54,48,110,0.3)' }}
            >
              <div className="text-xs sm:text-sm tracking-wide text-white/90 sm:text-[#36306E]">
                Secured to
              </div>

              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white sm:text-[#36306E]">
                  200
                </span>
                <Heart
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white sm:text-[#36306E]"
                  strokeWidth={1.2}
                />
              </div>

              <div className="text-xs sm:text-sm tracking-wide text-white/70 sm:text-[rgba(54,48,110,0.7)]">
                patrons
              </div>
            </div>

            <div className="text-xs sm:text-sm font-medium tracking-wide text-white/60 sm:text-[rgba(54,48,110,0.6)]">
              12.4K
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default App
