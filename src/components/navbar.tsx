"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { X } from "lucide-react";
import { NAV, SITE } from "@/lib/config";
import { scrollTopThen } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { SoundToggle } from "@/components/sound-toggle";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // The current anchor, so the nav item for a section can show as active
  // without both it and its parent page lighting up at once.
  const [hash, setHash] = useState("");

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  /**
   * The rise to the top is only animated when it is a real "back to top",
   * meaning the visitor is already on the page they clicked.
   *
   *   Same page      -> animate up, then re-navigate. This is the case that
   *                     was asking for it. Next.js resets scroll to 0 on a
   *                     same-route Link, which is why clicking Home while
   *                     scrolled down used to snap.
   *
   *   Different page -> go straight there. The new route renders at scroll 0
   *                     by definition, so animating the outgoing page first
   *                     only delays the arrival and reads as a stutter.
   *
   * Animating after the swap was tried as well and is worse: the new route
   * paints once at scroll 0 before the effect can move it, which flashes.
   *
   * An anchor link is a third case. Certifications points at a section
   * inside /about, so on that page the target already exists and the
   * browser should just scroll to it. Navigating to the bare route first
   * would send the visitor to the top of About and leave them to find the
   * certificates themselves.
   */
  const go = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
      // Leave modified clicks (new tab, download) to the browser.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      setOpen(false);

      const [path, hash] = href.split("#");
      const onSamePath =
        path === "/"
          ? pathname === "/"
          : pathname === path || pathname.startsWith(`${path}/`);

      if (hash) {
        if (onSamePath) {
          const target = document.getElementById(hash);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }
        }
        router.push(href);
        return;
      }

      if (onSamePath) {
        scrollTopThen().then(() => router.push(href));
      } else {
        router.push(href);
      }
    },
    [pathname, router],
  );

  // A hash that arrives by navigation rather than by a click still has to land
  // on the right section, and the target may only exist once the new route
  // has rendered.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const target = document.getElementById(hash);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <nav className="container-wide flex h-14 items-center justify-between">
        <Link
          href="/"
          onClick={(e) => go(e, "/")}
          className="group flex items-center gap-3"
          aria-label={`${SITE.name} home`}
        >
          {/* Bold, and tight. The reference mark is a heavy geometric glyph,
              not a text run at regular weight, and at 20px regular it read as
              punctuation. */}
          <span className="text-display text-[1.35rem] font-bold leading-none tracking-[-0.06em] transition-colors group-hover:text-accent">
            &lt;/&gt;
          </span>
          <span className="hidden h-5 w-px bg-border sm:block" aria-hidden />
          <span className="eyebrow hidden sm:inline">{SITE.navName}</span>
        </Link>

        {/* One right-hand group, not two siblings. With the list and the
            toggle as separate children, justify-between treated the list as
            the middle item and centred it, leaving a wide empty gutter on the
            right. */}
        <div className="flex items-center gap-1">
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            // An anchor item is only active when its section is the one being
            // looked at, so About and Certifications never light up together
            // on the same page.
            const [path, itemHash] = item.href.split("#");
            const active = itemHash
              ? pathname === path && hash === `#${itemHash}`
              : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(e) => go(e, item.href)}
                  className={cn(
                    "nav-link rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
                    active ? "active text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center md:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {/* The reference draws the toggle as a rule, not a glyph box.
                It becomes an X once the drawer is up. */}
            {open ? <X className="h-5 w-5" /> : <span className="block h-px w-7 bg-foreground" aria-hidden />}
          </button>

          {/* Theme switch. Sits inside the nav group so it inherits the fixed
              header's positioning instead of dropping into the page flow. */}
          <div className="ml-1 flex items-center gap-0.5 border-l border-border pl-2">
            <SoundToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <ul className="container-wide flex flex-col py-2">
            {NAV.map((item) => {
              const [path, itemHash] = item.href.split("#");
              const active = itemHash
                ? pathname === path && hash === `#${itemHash}`
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    className={cn(
                      "block rounded-md px-3 py-2.5 font-mono text-xs uppercase tracking-wider",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
