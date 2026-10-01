"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * The hero object.
 *
 * A wireframe plate split by a step fault. The crease is the only thing that
 * catches the accent colour, so the eye goes straight to the break.
 *
 * Why this rather than a console readout: the hero should describe how he
 * works, not one of his repos. Web, network, cloud and reverse work are all
 * the same act of finding where a system splits. esp32sec already has its own
 * card further down the page.
 *
 * Geometry is baked once at mount. Per-frame work is only group rotation and
 * pointer parallax, so it stays cheap.
 */

const SEG_X = 56;
const SEG_Z = 40;
const SIZE_X = 5.0;
const SIZE_Z = 3.4;

const LINE = new THREE.Color("#9a968e");
const LINE_DEEP = new THREE.Color("#b9b4aa");
const FAULT = new THREE.Color("#e59a22");

type FaultMeshProps = { reduced: boolean; dark: boolean };

function FaultMesh({ reduced, dark }: FaultMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const smooth = useRef(new THREE.Vector2(0, 0));

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE_X, SIZE_Z, SEG_X, SEG_Z);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();

    // Fault runs diagonally across the plate. Everything on one side sits
    // lower than the other, with a smoothed lip instead of a hard step.
    const faultAngle = -0.62;
    const faultOffset = 0.3;

    // Light and dark need different line values: near-black lines vanish on
    // paper, and pale lines vanish on ink.
    const base = new THREE.Color(dark ? "#6f6b64" : "#b4afa5");
    const deep = new THREE.Color(dark ? "#3f3c37" : "#d6d1c7");

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Rolling topography: a few low-frequency waves, nothing noisy.
      const roll =
        Math.sin(x * 1.15 + 0.4) * 0.16 +
        Math.sin(z * 1.55 - 0.9) * 0.11 +
        Math.sin((x + z) * 0.72) * 0.09 +
        Math.cos((x - z) * 1.9) * 0.05;

      const nx = Math.cos(faultAngle);
      const nz = Math.sin(faultAngle);
      const sd = x * nx + z * nz - faultOffset;

      // Step, plus a trough parallel to the fault so it reads as a fault zone
      // rather than a single clean cut.
      const lip = THREE.MathUtils.smoothstep(sd, -0.55, 0.55);
      const step = -0.34 * lip;
      const trough = -0.1 * Math.exp(-Math.pow(sd / 0.85, 2));
      const fold = 0.05 * Math.exp(-Math.pow((sd - 1.15) / 0.6, 2));

      pos.setY(i, roll + step + trough + fold);

      const heat = Math.exp(-Math.pow(sd / 0.6, 2));
      c.copy(deep).lerp(base, THREE.MathUtils.clamp(0.45 + roll * 2.2, 0, 1));
      c.lerp(FAULT, heat * 0.95);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
    // Rebuild on theme change so the palette follows the mode.
  }, [dark]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    if (reduced) {
      g.rotation.set(0.86, -0.5, 0);
      g.position.set(1.02, 0, 0.55);
      return;
    }

    const t = state.clock.getElapsedTime();

    // Slow idle turn. Constant, unhurried, never visibly loops.
    g.rotation.y = -0.5 + t * 0.032;

    // Pointer parallax, heavily damped so it reads as weight, not chasing.
    smooth.current.x += (pointer.current.x - smooth.current.x) * Math.min(1, delta * 1.6);
    smooth.current.y += (pointer.current.y - smooth.current.y) * Math.min(1, delta * 1.6);
    g.rotation.x = 0.86 - smooth.current.y * 0.09;

    // Right of centre, sitting back so it stays inside the hero rather than
    // bleeding past the edge.
    g.position.x = 1.02 + smooth.current.x * 0.14;
    g.position.z = 0.55;
  });

  return (
    <group ref={groupRef} rotation={[0.86, -0.5, 0]} position={[1.02, 0, 0.55]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial vertexColors transparent opacity={0.9} wireframe />
      </mesh>
      {/* Faint fill beneath the wireframe so the plate reads as a mass rather
          than a floating net. Tone follows the theme. */}
      <mesh geometry={geometry} position={[0, -0.014, 0]}>
        <meshBasicMaterial
          color={dark ? "#101216" : "#efece5"}
          transparent
          opacity={dark ? 0.5 : 0.42}
        />
      </mesh>
    </group>
  );
}

function Rig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.05, 4.6);
    camera.lookAt(0, -0.15, 0);
  }, [camera]);
  return null;
}

export function FaultPlate() {
  const [reduced, setReduced] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMotion = () => setReduced(mq.matches);
    mq.addEventListener("change", onMotion);

    const readTheme = () => setDark(document.documentElement.classList.contains("dark"));
    readTheme();
    const mo = new MutationObserver(readTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      mq.removeEventListener("change", onMotion);
      mo.disconnect();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0.05, 4.6], fov: 40 }}
      >
        <Rig />
        <FaultMesh reduced={reduced} dark={dark} />
      </Canvas>

      {/* Edge fade, so the plate dissolves instead of being clipped by the
          viewport. Radial mask, weighted to the right where the object sits. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 46% 72% at 72% 46%, black 30%, rgba(0,0,0,0.55) 58%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse 46% 72% at 72% 46%, black 30%, rgba(0,0,0,0.55) 58%, transparent 80%)",
        }}
      />
      {/* Scrim. Keeps the headline column clear of geometry. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent lg:from-38% lg:via-8%" />
    </div>
  );
}