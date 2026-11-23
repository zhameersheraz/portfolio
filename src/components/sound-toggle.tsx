"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getSoundEnabled, subscribeSound, setSoundEnabled } from "@/lib/sound";

/**
 * Sound switch.
 *
 * Off by default, and the state is remembered. A site that makes noise
 * without being asked gets closed, so the toggle is a real control and not
 * a decoration.
 */
export function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(getSoundEnabled());
    return subscribeSound(setOn);
  }, []);

  const toggle = () => {
    const next = !on;
    setSoundEnabled(next);
    // The click itself is the user gesture that lets the browser start an
    // audio context, so the confirmation plays straight away.
    if (next) {
      window.setTimeout(() => {
        import("@/lib/sound").then((m) => m.playSound("toggle"));
      }, 30);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn interface sounds off" : "Turn interface sounds on"}
      title={on ? "Sounds on" : "Sounds off"}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="relative block h-4 w-4">
        <Volume2
          className="absolute inset-0 h-4 w-4 transition-opacity duration-300"
          style={{ opacity: on ? 1 : 0 }}
        />
        <VolumeX
          className="absolute inset-0 h-4 w-4 transition-opacity duration-300"
          style={{ opacity: on ? 0 : 1 }}
        />
      </span>
    </button>
  );
}
