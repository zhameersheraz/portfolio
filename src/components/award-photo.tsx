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
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 30vw, 92vw"
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
