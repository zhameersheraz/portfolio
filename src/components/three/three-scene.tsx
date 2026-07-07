"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const ACCENT_LIGHT = "#22c55e";
const ACCENT_DARK = "#10b981";
const TINT = "#a1a1aa";

function useAccentColor() {
  const ref = useRef(new THREE.Color(ACCENT_LIGHT));
  useEffect(() => {
    const root = document.documentElement;
    const read = () => {
      const isDark = root.classList.contains("dark");
      const fallback = isDark ? ACCENT_DARK : ACCENT_LIGHT;
      try {
        const v = getComputedStyle(root).getPropertyValue("--accent").trim();
        if (v) { const c = new THREE.Color(); c.set(v); ref.current.copy(c); }
        else ref.current.set(fallback);
      } catch { ref.current.set(fallback); }
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Core({ accent }: { accent: THREE.Color }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.4, 1), []);
  const glowGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.55, 1), []);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.18;
      groupRef.current.rotation.x = Math.sin(t * 0.25) * 0.12;
    }
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 + Math.sin(t * 1.2) * 0.18;
      mat.color.copy(accent);
    }
  });
  return (
    <group ref={groupRef}>
      <mesh geometry={glowGeometry}>
        <meshBasicMaterial color={accent} transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function OrbitOcta({ accent }: { accent: THREE.Color }) {
  const ref = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.OctahedronGeometry(0.32, 0), []);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      const r = 2.6;
      ref.current.position.x = Math.cos(t * 0.4) * r;
      ref.current.position.z = Math.sin(t * 0.4) * r;
      ref.current.position.y = Math.sin(t * 0.8) * 0.4;
      ref.current.rotation.y = -t * 0.6;
      ref.current.rotation.x = t * 0.3;
    }
  });
  return (
    <group ref={ref}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function OrbitRing({ accent }: { accent: THREE.Color }) {
  const ref = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.TorusGeometry(2.2, 0.012, 8, 96), []);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.15) * 0.1;
      ref.current.rotation.z = t * 0.08;
    }
  });
  return (
    <group ref={ref}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={accent} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function ParticleField({ count = 280 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return { positions: pos };
  }, [count]);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.04;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color={TINT} sizeAttenuation transparent opacity={0.6} depthWrite={false} />
    </points>
  );
}

function PointerCamera() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.3, 5));
  useFrame(() => {
    target.current.x += (pointer.x * 0.6 - target.current.x) * 0.04;
    target.current.y += (0.3 + pointer.y * 0.4 - target.current.y) * 0.04;
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (target.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function ThreeScene() {
  const accent = useAccentColor();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0.3, 5], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}>
        <ambientLight intensity={0.6} />
        <PointerCamera />
        <Core accent={accent.current} />
        <OrbitOcta accent={accent.current} />
        <OrbitRing accent={accent.current} />
        <ParticleField />
      </Canvas>
    </div>
  );
}
