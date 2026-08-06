import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { NAVIGATION_ITEMS } from "../data";
import type { NavigationItem } from "../types";

interface HeaderProps {
  activeSectionId: string;
  onNavigate: (item: NavigationItem) => void;
}

export default function Header({ activeSectionId, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (item: NavigationItem) => {
    onNavigate(item);
    setMenuOpen(false);
  };

  return (
    <header className="absolute top-4 left-4 right-4 sm:top-8 sm:left-8 sm:right-8 md:top-[64px] md:left-[64px] md:right-[64px] flex items-center justify-between z-40">
      {/* Logo group */}
      <button
        type="button"
        onClick={() => onNavigate({ id: "hero", label: "Home", scrollRatio: 0 })}
        className="flex items-center gap-4 text-left cursor-pointer"
      >
        <Logo size={48} className="text-white shrink-0" />
        <span className="hidden sm:block font-manrope font-normal tracking-wide text-[12px] leading-[16px] text-white">
          Full Workflow Automation.
          <br />
          We Manage Everything. You
          <br />
          Unwind.
        </span>
      </button>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNav(item)}
            className="font-manrope font-medium text-[12px] leading-[16px] tracking-wider text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile burger */}
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white"
      >
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#11010a]/98 backdrop-blur-xl z-30 flex flex-col justify-center">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item)}
              className={`font-michroma text-[16px] uppercase tracking-widest py-4 px-6 border-b border-white/5 text-left ${
                activeSectionId === item.id
                  ? "text-[#FF005E] font-semibold"
                  : "text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
