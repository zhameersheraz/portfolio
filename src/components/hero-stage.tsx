"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { BinaryRain } from "@/components/binary-rain";
import { GlitchDissolve } from "@/components/glitch-dissolve";
import { HeroOrbit } from "@/components/hero-orbit";

/**
 * The portrait, the two live layers over it, and the floating cards, inside a
 * real 3D space.
 *
 * The pointer drives a small rotation on the stage. The cards sit at
 * different depths with translateZ, so they slide against the photograph as
 * the stage turns. That parallax is the point: it is what makes the layer read
 * as objects in a space rather than as stickers on a photograph.
 *
 * The rotation is deliberately tiny. A stage that turns like a card in a
 * casino advert reads as a gimmick; one that moves a few degrees reads as
 * depth. Touch devices have no hover, so they get the flat layout, and
 * prefers-reduced-motion turns the whole thing off.
 */
export function HeroStage() {
  const stage = useRef<HTMLDivElement | null>(null);

  // The cutout, not the original. The original photograph has a flat light
  // backdrop baked into it, which on the dark theme is a white rectangle
  // sitting on a black page. The cutout has that backdrop keyed away, so the
  // subject emerges from the page in either theme and the live layers can
  // sample the same file and stay in step with it.
  const src = "/me-hero-cut.png";

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only a device with a real hovering pointer can drive this. On touch the
    // pointer never leaves, so the stage would sit permanently skewed.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    // Eased toward the pointer target on its own frame, so the movement is
    // continuous rather than stepped at pointer event rate.
    const loop = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      el.style.transform = `rotateX(${(-cy * 3.2).toFixed(3)}deg) rotateY(${(cx * 4.2).toFixed(3)}deg)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[24rem] md:mx-0 md:max-w-none md:w-full lg:w-[120%] lg:-ml-[2%]">
      <div
        className="relative"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 45%" }}
      >
        <div
          ref={stage}
          className="relative"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {/* The photograph sits behind the live layers. A small negative Z
              pushes it away from the viewer, so the cards and the glitch in
              front of it have something to be in front of. */}
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