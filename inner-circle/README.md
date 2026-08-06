# Inner Circle

A single-screen, scroll-driven, custom-gesture landing page. There is **no native
browser scrolling** — a wheel/touch gesture controller drives a single
`scrollProgress` value from `0` to `3.5`, and every animation (video scrubbing,
hero text exit, rising second panel, cylindrical text drum) is derived from it.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- GSAP 3.15 (char-level split-text + parallax)
- lucide-react (menu icons)

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Structure

```
src/
  App.tsx                     gesture controller + layout
  main.tsx
  index.css                   fonts, palette, marquee keyframes
  types.ts
  data.ts
  components/
    Header.tsx
    Logo.tsx
    Logos.tsx                 GoogleWordmark, GithubWordmark
    Marquee.tsx
    VideoScrubber.tsx
    SecondVideoScrubber.tsx
    ScrollExitSplitText.tsx
    SoapTiles.tsx
    CylindricalTextDrum.tsx
```
