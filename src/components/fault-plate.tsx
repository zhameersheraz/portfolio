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

const SEG_X = 48;
const SEG_Z = 34;
const SIZE_X = 3.0;
const SIZE_Z = 2.1;

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

    // Light and dark need different line values. On paper the wireframe has to
    // be genuinely dark or it reads as a smudge; on ink it has to stay pale.
    const base = new THREE.Color(dark ? "#6f6b64" : "#6f6a61");
    const deep = new THREE.Color(dark ? "#3f3c37" : "#a9a398");

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
      g.rotation.set(0.82, -0.5, 0);
      g.position.set(0, 0, 1.15);
      return;
    }

    const t = state.clock.getElapsedTime();

    // Slow idle turn. Constant, unhurried, never visibly loops.
    g.rotation.y = -0.5 + t * 0.032;

    // Pointer parallax, heavily damped so it reads as weight, not chasing.
    smooth.current.x += (pointer.current.x - smooth.current.x) * Math.min(1, delta * 1.6);
    smooth.current.y += (pointer.current.y - smooth.current.y) * Math.min(1, delta * 1.6);
    g.rotation.x = 0.82 - smooth.current.y * 0.09;
    g.position.x = smooth.current.x * 0.1;
    g.position.z = 1.15;
  });

  return (
    <group ref={groupRef} rotation={[0.82, -0.5, 0]} position={[0, 0, 1.15]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial vertexColors transparent opacity={0.95} wireframe />
      </mesh>
      {/* Fill only in dark mode. On paper a translucent slab turned the whole
          card muddy beige; wireframe alone is cleaner there. */}
      {dark && (
        <mesh geometry={geometry} position={[0, -0.014, 0]}>
          <meshBasicMaterial color="#0d0f13" transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}

function Rig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.05, 4.2);
    camera.lookAt(0, -0.12, 0);
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
    // A contained specimen, not wallpaper. Fixed height so the card does not
    // resize as the plate turns.
    <div
      aria-hidden
      className="relative h-64 w-full overflow-hidden rounded-t-2xl bg-secondary sm:h-72"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0.05, 4.2], fov: 40 }}
      >
        <Rig />
        <FaultMesh reduced={reduced} dark={dark} />
      </Canvas>
      {/* Edge fade inside the frame so the plate dissolves rather than being
          cut off by the container. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 62% 74% at 50% 48%, black 34%, rgba(0,0,0,0.6) 60%, transparent 84%)",
          maskImage:
            "radial-gradient(ellipse 62% 74% at 50% 48%, black 34%, rgba(0,0,0,0.6) 60%, transparent 84%)",
        }}
      />
    </div>
  );
}