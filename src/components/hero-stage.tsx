"use client";

import Image from "next/image";
import { BinaryRain } from "@/components/binary-rain";
import { GlitchDissolve } from "@/components/glitch-dissolve";
import { HeroOrbit } from "@/components/hero-orbit";

/**
 * The portrait, the two live layers over it, and the floating cards, inside a
 * real 3D space.
 *
 * The cards sit at different depths with translateZ, inside a preserve-3d
 * context with a perspective on it, so they are genuinely further away than
 * the photograph rather than drawn to look that way. The portrait itself is
 * pushed back a little, so the cards and the glitch in front of it have
 * something to be in front of.
 *
 * There is no pointer tracking here. An earlier version rotated the stage
 * to follow the cursor, which meant his face turned toward whoever was
 * reading. It looked like the page was watching you, and it made the
 * photograph feel like it was being dragged around. The depth reads from the
 * staging alone and nothing follows the mouse.
 */
export function HeroStage() {
  // The cutout, not the original. The original photograph has a flat light
  // backdrop baked into it, which on the dark theme is a white rectangle
  // sitting on a black page. The cutout has that backdrop keyed away, so the
  // subject emerges from the page in either theme and the live layers can
  // sample the same file and stay in step with it.
  const src = "/me-hero-cut.png";

  return (
    <div className="relative mx-auto w-full max-w-[24rem] md:mx-0 md:max-w-none md:w-full lg:w-[120%] lg:-ml-[2%]">
      <div className="relative" style={{ perspective: "1200px", perspectiveOrigin: "50% 45%" }}>
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          <div
            className="relative"
            style={{ transform: "translateZ(-18px)", transformStyle: "preserve-3d" }}
          >
            <Image
              src={src}
              alt="Zhameer Sheraz U. Tampugao"
              width={1280}
              height={1203}
              priority
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="w-full select-none"
            />
            <BinaryRain src={src} />
            <GlitchDissolve src={src} />
          </div>

          <HeroOrbit />
        </div>
      </div>
    </div>
  );
}