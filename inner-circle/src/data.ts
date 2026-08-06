import type { NavigationItem, Project, ExpertiseItem } from "./types";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "projects",  label: "Projects",  scrollRatio: 0.25 },
  { id: "expertise", label: "Expertise", scrollRatio: 0.50 },
  { id: "about",     label: "About",     scrollRatio: 0.95 },
  { id: "contact",   label: "Manifesto", scrollRatio: 3.50 },
];

// Kept for parity — unused on this page.
export const PROJECTS_DATA: Project[] = [
  {
    title: "Aurora Protocol",
    category: "Web3 Infrastructure",
    description: "A decentralized liquidity layer for cross-chain settlement.",
    tags: ["Solidity", "Rust", "zk-Proofs"],
  },
  {
    title: "Nightshade UI",
    category: "Design System",
    description: "A dark-first component library for high-signal interfaces.",
    tags: ["React", "Tailwind", "Motion"],
  },
  {
    title: "Signal Loop",
    category: "Automation",
    description: "Event-driven workflow orchestration for elite operators.",
    tags: ["TypeScript", "Node", "Edge"],
  },
];

// Kept for parity — unused on this page.
export const EXPERTISE_DATA: ExpertiseItem[] = [
  {
    title: "Interface Engineering",
    percentage: 98,
    description: "Fluid, high-performance interactions across the stack.",
  },
  {
    title: "Systems Automation",
    percentage: 94,
    description: "Eliminating intermediate noise from the execution layer.",
  },
  {
    title: "Product Strategy",
    percentage: 91,
    description: "Shipping elite digital products while others schedule meetings.",
  },
];
