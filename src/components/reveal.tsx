"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Reveals its children once, when they enter the viewport.
 * Ambient motion only. No parallax, no scroll-jacking.
 * Falls back to visible if IntersectionObserver is missing or motion is reduced.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // Already in view on first paint (above the fold): show without animating.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // createElement instead of <Tag ...>. A dynamic tag typed as ElementType
  // collapses its JSX props to `never` under this TS config, so JSX fails to
  // type-check. createElement carries the props through without that.
  return createElement(
    Tag,
    {
      ref,
      "data-reveal": shown ? "in" : "out",
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
      className: `[transition:opacity_.6s_cubic-bezier(.22,.61,.36,1),transform_.6s_cubic-bezier(.22,.61,.36,1)] ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${className}`,
    },
    children,
  );
}
