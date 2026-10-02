"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Photo slot that degrades to a flat placeholder when the file is absent,
 * so a missing upload never renders a broken-image icon.
 * Client component because it owns the error state.
 */
export function AwardPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    // Fixed height, not aspect. Both cards carry two photos, so the strip is
    // sized to keep a cell near 1.28:1. That is close enough to the 16:9 team
    // shots that object-cover has almost nothing left to trim, and it still
    // crops the ceiling and footer off the square ones.
    <div className="relative h-48 w-full overflow-hidden bg-secondary sm:h-52">
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 25vw, 92vw"
          className="object-cover"
          unoptimized
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div
          className="absolute inset-0 grid place-items-center"
          aria-hidden
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            photo
          </span>
        </div>
      )}
    </div>
  );
}
