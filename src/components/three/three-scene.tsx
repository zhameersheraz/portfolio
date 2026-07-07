"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Three-orbit scene:
 *  - central wireframe icosahedron with subtle pulsing
 *  - smaller octahedron orbiting around it
 *  - tilted wireframe torus ring rotating the other way
 *  - sparse twinkling particle field as a backdrop
 *
 * Renders at capped DPR so phones don't cook.
 */

function Core() {
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
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glow shell behind the wireframe */}
      <mesh geometry={glowGeometry}>
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Main wireframe */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          color="#22c55e"
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

function OrbitOcta() {
  const ref = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.OctahedronGeometry(0.32, 0), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = -t * 0.6;
      ref.current.rotation.x = t * 0.3;
      const radius = 2.6;
      ref.current.position.x = Math.cos(t * 0.4) * radius;
      ref.current.position.z = Math.sin(t * 0.4) * radius;
      ref.current.position.y = Math.sin(t * 0.8) * 0.4;
    }
  });

  return (
    <group ref={ref}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#22c55e" wireframe transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function OrbitRing() {
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
        <meshBasicMaterial color="#22c55e" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function ParticleField({ count = 280 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = Math.random() * 0.6 + 0.2;
    }
    return { positions: pos, sizes: sz };
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
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#a1a1aa"
        sizeAttenuation
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </points>
  );
}

export function ThreeScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <Canvas
        camera={{ position: [0, 0.3, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.6} />
        <Core />
        <OrbitOcta />
        <OrbitRing />
        <ParticleField />
      </Canvas>
    </div>
  );
}