"use client";

/* eslint-disable react-hooks/purity, react-hooks/immutability -- React Three Fiber scene code is intentionally imperative: it mutates three.js objects (camera/group transforms) every frame and uses Math.random for one-time procedural star placement. These are the correct, idiomatic R3F patterns. */

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/** Drifting starfield — instanced points with a slow rotation + pointer parallax. */
function Starfield({ count = 1500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 34;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 34;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 24 - 6;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    ref.current.rotation.x +=
      (state.pointer.y * 0.04 - ref.current.rotation.x) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#ffffff"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

/** Nested luminous wireframe icosahedra — the brand's "form built of light". */
function WireframeForm() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x += delta * 0.04;
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      state.pointer.x * 0.18,
      0.04,
    );
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.85, 3]} />
        <meshBasicMaterial color="#9fc1ff" wireframe transparent opacity={0.22} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.25, 2]} />
        <meshBasicMaterial color="#3080ff" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshBasicMaterial color="#e4edff" wireframe transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

/** Camera parallax (pointer) + gentle scroll dolly. */
function CameraRig() {
  const { camera } = useThree();
  useFrame((state) => {
    const scrollNorm =
      typeof window !== "undefined"
        ? Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
        : 0;
    camera.position.x += (state.pointer.x * 0.7 - camera.position.x) * 0.04;
    camera.position.y += (state.pointer.y * 0.45 - camera.position.y) * 0.04;
    camera.position.z = 6 - scrollNorm * 1.4;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroCanvas() {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <Starfield />
      <WireframeForm />
      <CameraRig />
      <EffectComposer>
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
