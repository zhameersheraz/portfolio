"use client";

import Image from "next/image";
import { BinaryRain } from "@/components/binary-rain";
import { GlitchDissolve } from "@/components/glitch-dissolve";

/**
 * The hero portrait and the two live layers over it.
 *
 * There used to be a floating layer here: three angled cards naming what he
 * works on, a soft halo, and a rotating badge, all inside a 3D space that
 * turned with the pointer. It was a lot, and it fought the photograph for
 * attention. The portrait is the strongest thing in the hero and the only
 * thing that needs to be there.
 *
 * What is left is the photograph, the binary field sampling it, and the
 * glitch layer breaking it up on the right. Both read from the same file, so
 * they stay in step at every width, and both are skipped entirely under
 * prefers-reduced-motion.
 *
 * The cutout, not the original. The original photograph has a flat light
 * backdrop baked into it, which on the dark theme is a white rectangle sitting
 * on a black page. The cutout has that backdrop keyed away, so the subject
 * emerges from the page in either theme.
 */
export function HeroStage() {
  const src = "/me-hero-cut.png";

  return (
    <div className="relative mx-auto w-full max-w-[24rem] md:mx-0 md:max-w-none md:w-full lg:w-[120%] lg:-ml-[2%]">
      <div className="relative">
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
    </div>
  );
}
