"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Wireframe icosahedron with subtle vertex displacement,
 * orbiting inside a sparse particle field. Renders at low DPR
 * to keep the page snappy on mid-range laptops.
 */
function WireShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.4, 1), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 + Math.sin(t * 1.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          color="#22c55e"
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function ParticleField({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#71717a"
        sizeAttenuation
        transparent
        opacity={0.7}
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
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <WireShape />
        <ParticleField />
      </Canvas>
    </div>
  );
}