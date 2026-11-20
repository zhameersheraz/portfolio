"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "zham:theme";
export type Theme = "light" | "dark";

/**
 * Theme is read once, before paint, by the inline script in the document head.
 * This component only has to keep the DOM in sync with what that script
 * already decided, so it never renders a different theme than the page did.
 */
function read(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(read());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light" : "Dark"}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
    >
      {/* Both glyphs are mounted and cross-faded so the icon does not pop when
          the theme changes. Before hydration the button is invisible, which is
          better than showing the wrong one. */}
      <span className="relative block h-4 w-4">
        <Sun
          className="absolute inset-0 h-4 w-4 transition-opacity duration-300"
          style={{ opacity: mounted && theme === "light" ? 1 : 0 }}
        />
        <Moon
          className="absolute inset-0 h-4 w-4 transition-opacity duration-300"
          style={{ opacity: mounted && theme === "dark" ? 1 : 0 }}
        />
      </span>
    </button>
  );
}