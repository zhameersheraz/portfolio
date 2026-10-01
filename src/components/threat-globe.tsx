"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * An interactive globe.
 *
 * The surface is a Fibonacci point sphere rather than a wireframe, because
 * points read as a network and a grid reads as a beach ball. Some points are
 * promoted to nodes; nodes are joined by great-circle arcs; a dot travels each
 * arc on its own offset, so the routes read as live traffic rather than a
 * static diagram.
 *
 * Drag to spin. Release and momentum carries. Idle long enough and a slow
 * auto-rotation resumes on its own.
 *
 * Per-frame work is a handful of vector lerps and two matrix updates, so this
 * costs about the same as a static scene.
 */

const R = 1;
const FIB_POINTS = 900;
const NODE_COUNT = 15;
const ARC_COUNT = 11;
const TRAVELERS = ARC_COUNT;
const ARC_SEGMENTS = 56;

const PALETTE = {
  light: {
    point: "#8f8a80",
    pointOpacity: 0.82,
    pointSize: 0.013,
    node: "#3f3b36",
    nodeOpacity: 1,
    nodeSize: 0.042,
    arc: "#a49f94",
    arcOpacity: 0.6,
    accent: "#d9821a",
    // Barely there. An opaque shell in light mode turns the globe into a grey
    // ball and swallows every point on it.
    shell: "#f2efe9",
    shellOpacity: 0.3,
  },
  dark: {
    point: "#8f8a80",
    pointOpacity: 0.78,
    pointSize: 0.013,
    node: "#f2ede2",
    nodeOpacity: 1,
    nodeSize: 0.042,
    arc: "#6b665e",
    arcOpacity: 0.55,
    accent: "#f0a832",
    shell: "#0f1218",
    shellOpacity: 0.55,
  },
};

type Palette = typeof PALETTE.light;

/** Even distribution over a sphere, no pole clustering. */
function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push(
      new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(
        radius,
      ),
    );
  }
  return pts;
}

/** Deterministic PRNG so the globe is identical on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Arc = {
  curve: THREE.QuadraticBezierCurve3;
  speed: number;
  offset: number;
};

function buildNetwork(dark: boolean) {
  const p: Palette = dark ? PALETTE.dark : PALETTE.light;
  const rand = rng(20260916);

  const surface = fibonacciSphere(FIB_POINTS, R);

  // Promote a scattered subset of the surface points to nodes.
  const nodeIdx = new Set<number>();
  while (nodeIdx.size < NODE_COUNT) {
    nodeIdx.add(Math.floor(rand() * FIB_POINTS));
  }
  const nodes = [...nodeIdx].map((i) => surface[i]);

  const nodePts = new Float32Array(nodes.length * 3);
  nodes.forEach((n, i) => {
    nodePts[i * 3] = n.x;
    nodePts[i * 3 + 1] = n.y;
    nodePts[i * 3 + 2] = n.z;
  });

  const surfacePts = new Float32Array(surface.length * 3);
  surface.forEach((s, i) => {
    surfacePts[i * 3] = s.x;
    surfacePts[i * 3 + 1] = s.y;
    surfacePts[i * 3 + 2] = s.z;
  });

  // Arcs between random node pairs, lifted off the surface so they read as
  // routes rather than chords buried in the sphere.
  const arcs: Arc[] = [];
  const arcObjects: THREE.Line[] = [];

  for (let i = 0; i < ARC_COUNT; i++) {
    const a = nodes[Math.floor(rand() * nodes.length)];
    let b = nodes[Math.floor(rand() * nodes.length)];
    let guard = 0;
    while (b === a && guard++ < 8) {
      b = nodes[Math.floor(rand() * nodes.length)];
    }

    const mid = a
      .clone()
      .add(b)
      .normalize()
      .multiplyScalar(R * (1.18 + rand() * 0.22));

    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const pts = curve.getPoints(ARC_SEGMENTS);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(p.arc),
      transparent: true,
      opacity: p.arcOpacity,
    });
    arcObjects.push(new THREE.Line(geo, mat));
    arcs.push({ curve, speed: 0.06 + rand() * 0.12, offset: rand() });
  }

  return {
    surfacePts,
    nodePts,
    arcObjects,
    arcs,
    palette: p,
  };
}

type GlobeProps = { reduced: boolean; dark: boolean };

function Globe({ reduced, dark }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const travelerRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.Group>(null);

  const vel = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const idle = useRef(0);
  const scratch = useRef(new THREE.Vector3());

  const net = useMemo(() => buildNetwork(dark), [dark]);

  useEffect(
    () => () => {
      net.arcObjects.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
    },
    [net],
  );

  const travelerGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(TRAVELERS * 3), 3),
    );
    return g;
  }, []);

  useEffect(() => () => travelerGeo.dispose(), [travelerGeo]);

  // Pointer drag lives on the window so the gesture survives leaving the canvas.
  useEffect(() => {
    if (reduced) return;

    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.("a,button")) return;
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      idle.current = 0;
      vel.current.x = 0;
      vel.current.y = 0;
    };

    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      vel.current.y = dx * 0.005;
      vel.current.x = dy * 0.004;
      idle.current = 0;
    };

    const up = () => {
      dragging.current = false;
    };

    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [reduced]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);

    if (reduced) {
      g.rotation.y += dt * 0.08;
      updateTravelers(travelerRef.current, net.arcs, 0, dt, true);
      return;
    }

    if (dragging.current) {
      g.rotation.y += vel.current.y;
      g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + vel.current.x, -1.2, 1.2);
    } else {
      // Momentum, bled off. Feels like a real object rather than a slider.
      vel.current.y *= 0.94;
      vel.current.x *= 0.94;
      g.rotation.y += vel.current.y;
      g.rotation.x = THREE.MathUtils.clamp(
        g.rotation.x + vel.current.x,
        -1.2,
        1.2,
      );

      idle.current += dt;
      if (idle.current > 2.6) {
        // Idle drift, eased in so it never snaps back into motion.
        const ramp = Math.min(1, (idle.current - 2.6) / 2.2);
        g.rotation.y += dt * 0.085 * ramp;
      }
    }

    updateTravelers(travelerRef.current, net.arcs, state.clock.getElapsedTime(), dt, false);
  });

  function updateTravelers(
    pts: THREE.Points | null,
    arcs: Arc[],
    t: number,
    _dt: number,
    frozen: boolean,
  ) {
    if (!pts) return;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < arcs.length; i++) {
      const a = arcs[i];
      const u = ((t * a.speed + a.offset) % 1 + 1) % 1;
      a.curve.getPoint(u, scratch.current);
      attr.setXYZ(i, scratch.current.x, scratch.current.y, scratch.current.z);
    }
    attr.needsUpdate = true;
    if (frozen) pts.visible = true;
  }

  const p = net.palette;

  return (
    <group ref={groupRef}>
      {/* Faint shell for volume, so the sphere is not just a floating net. */}
      <mesh ref={shellRef}>
        <sphereGeometry args={[R * 0.985, 32, 24]} />
        <meshBasicMaterial
          color={p.shell}
          transparent
          opacity={p.shellOpacity}
          depthWrite={false}
        />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[net.surfacePts, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={p.pointSize}
          color={p.point}
          sizeAttenuation
          transparent
          opacity={p.pointOpacity}
          depthWrite={false}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[net.nodePts, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={p.nodeSize}
          color={p.node}
          sizeAttenuation
          transparent
          opacity={p.nodeOpacity}
          depthWrite={false}
        />
      </points>

      <group ref={linesRef}>
        {net.arcObjects.map((line, i) => (
          <primitive key={i} object={line} />
        ))}
      </group>

      {/* Traffic. Accent coloured so it reads as the active thing. */}
      <points ref={travelerRef} geometry={travelerGeo}>
        <pointsMaterial
          size={0.05}
          color={p.accent}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function Rig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 3.05);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

export function ThreatGlobe() {
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

  const onEnter = useCallback(() => undefined, []);

  return (
    <div
      aria-hidden
      className="relative h-64 w-full touch-pan-y sm:h-72"
      style={{ cursor: "grab" }}
      onPointerEnter={onEnter}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 3.05], fov: 42 }}
      >
        <Rig />
        <Globe reduced={reduced} dark={dark} />
      </Canvas>
      {/* Edge fade so the object dissolves at the frame rather than being cut. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 58% 70% at 50% 50%, black 42%, transparent 82%)",
          maskImage:
            "radial-gradient(ellipse 58% 70% at 50% 50%, black 42%, transparent 82%)",
        }}
      />
    </div>
  );
}