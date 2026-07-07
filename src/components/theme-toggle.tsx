"use client";

import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const options = [
    { key: "system" as const, icon: Monitor, label: "System" },
    { key: "light" as const, icon: Sun, label: "Light" },
    { key: "dark" as const, icon: Moon, label: "Dark" },
  ];

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5"
      role="radiogroup"
      aria-label="Color theme"
    >
      {options.map(({ key, icon: Icon, label }) => {
        const active = mounted ? theme === key : key === "dark";
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            onClick={() => setTheme(key)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}