"use client";

import { useEffect, useState } from "react";
import {
  initSound,
  armSoundOnGesture,
  getSoundEnabled,
  setSoundEnabled,
  subscribeSound,
  playSound,
  type SoundName,
} from "@/lib/sound";

/**
 * Wires the sound engine to the page.
 *
 * Hover and click are picked up at the document level and filtered down to
 * things a person can actually interact with, so the engine does not have to
 * be attached to every link and button in the site.
 *
 * A single listener per element type, not one per element. A site with
 * hundreds of links would otherwise make a hundred oscillators.
 */
export function SoundEngine() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const initial = initSound();
    setOn(initial);
    if (initial) armSoundOnGesture();

    return subscribeSound(setOn);
  }, []);

  useEffect(() => {
    if (!on) return;

    const isInteractive = (el: Element | null) =>
      !!el?.closest?.(
        "a, button, [role='button'], summary, input[type='checkbox'], input[type='radio']",
      );

    let lastHover: Element | null = null;

    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (!el || !isInteractive(el)) return;
      // Do not re-tick while the pointer moves within the same control.
      if (el === lastHover) return;
      lastHover = el;
      playSound("hover");
    };

    const onOut = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (el && el === lastHover) lastHover = null;
    };

    const onClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!isInteractive(el)) return;
      playSound("click");
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("click", onClick);
    };
  }, [on]);

  // Exposed so the toggle can play a confirmation without importing the
  // store twice.
  useEffect(() => {
    (window as unknown as { __tmSound?: (n: SoundName) => void }).__tmSound =
      playSound;
    return () => {
      delete (window as unknown as { __tmSound?: (n: SoundName) => void })
        .__tmSound;
    };
  }, []);

  return null;
}

export function toggleSound(): boolean {
  const next = !getSoundEnabled();
  setSoundEnabled(next);
  return next;
}
