"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function OrbitingRing({ radius, color }: { radius: number; color: string }) {
  const points = [];
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
  }
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

  return (
    // @ts-ignore
    <line geometry={lineGeo}>
      <lineBasicMaterial color={color} transparent opacity={0.25} />
    </line>
  );
}

function OrbitingAgent({
  radius,
  speed,
  initialAngle,
  color,
  size = 0.25,
}: {
  radius: number;
  speed: number;
  initialAngle: number;
  color: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() * speed + initialAngle;
    const x = Math.cos(elapsed) * radius;
    const z = Math.sin(elapsed) * radius;
    if (meshRef.current) {
      meshRef.current.position.set(x, 0, z);
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[size, 0]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function OrbitScene() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ mouse }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = 0.5 - mouse.y * 0.2;
      groupRef.current.rotation.y = mouse.x * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color="#2979FF" wireframe />
      </mesh>

      {/* Orbit Track Rings */}
      <OrbitingRing radius={1.5} color="#2979FF" />
      <OrbitingRing radius={2.3} color="#FF3B56" />
      <OrbitingRing radius={3.1} color="#00C48C" />
      <OrbitingRing radius={3.8} color="#2979FF" />

      {/* 4 Agent Nodes Orbiting with differing radii and speeds */}
      <OrbitingAgent radius={1.5} speed={0.8} initialAngle={0} color="#2979FF" size={0.22} />
      <OrbitingAgent radius={2.3} speed={0.6} initialAngle={Math.PI / 2} color="#FF3B56" size={0.26} />
      <OrbitingAgent radius={3.1} speed={0.45} initialAngle={Math.PI} color="#00C48C" size={0.28} />
      <OrbitingAgent radius={3.8} speed={0.35} initialAngle={(3 * Math.PI) / 2} color="#2979FF" size={0.3} />
    </group>
  );
}

export function AgentOrbit3D() {
  const [hasWebGL, setHasWebGL] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-xs font-mono text-text-muted">
        [Multi-Agent Orbit: 4 Agents Active]
      </div>
    );
  }

  return (
    <div className="w-full h-[280px] md:h-[320px] rounded-2xl border border-surface-border bg-canvas overflow-hidden relative">
      <div className="absolute top-3 left-4 z-10 text-[10px] font-mono text-text-muted tracking-wider">
        AUTONOMOUS ORBIT • 4 SPECIALIST NODES
      </div>
      <Canvas camera={{ position: [0, 4, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <OrbitScene />
      </Canvas>
    </div>
  );
}
