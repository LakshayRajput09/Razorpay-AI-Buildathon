"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Individual moving transaction token
function TransactionParticle({
  startPoint,
  agentPoint,
  endPoint,
  speed,
  color,
  offset,
}: {
  startPoint: [number, number, number];
  agentPoint: [number, number, number];
  endPoint: [number, number, number];
  speed: number;
  color: string;
  offset: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [t, setT] = useState(offset);

  useFrame((_, delta) => {
    let nextT = t + delta * speed;
    if (nextT > 1) nextT = 0;
    setT(nextT);

    if (meshRef.current) {
      // Quadratic Bezier interpolation: Origin -> Agent Node -> Guarded Settlement
      const p0 = new THREE.Vector3(...startPoint);
      const p1 = new THREE.Vector3(...agentPoint);
      const p2 = new THREE.Vector3(...endPoint);

      const oneMinusT = 1 - nextT;
      const x = oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * nextT * p1.x + nextT * nextT * p2.x;
      const y = oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * nextT * p1.y + nextT * nextT * p2.y;
      const z = oneMinusT * oneMinusT * p0.z + 2 * oneMinusT * nextT * p1.z + nextT * nextT * p2.z;

      meshRef.current.position.set(x, y, z);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.065, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// 4 Agent Filter Nodes + Central Business Brain Core
function SceneContent() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ mouse, clock }) => {
    if (groupRef.current) {
      // Subtle stately rotation & mouse parallax
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.15, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.1, 0.04);
    }
  });

  const origin: [number, number, number] = [-3.6, 0, 0];
  const settlement: [number, number, number] = [3.6, 0, 0];

  const agents: { name: string; pos: [number, number, number]; color: string }[] = [
    { name: "Revenue", pos: [-1.2, 1.3, 0.3], color: "#B69A5A" },
    { name: "Risk", pos: [1.2, 1.3, -0.3], color: "#9A7940" },
    { name: "Recovery", pos: [-1.2, -1.3, -0.3], color: "#66745D" },
    { name: "Finance", pos: [1.2, -1.3, 0.3], color: "#D1B56A" },
  ];

  return (
    <group ref={groupRef}>
      {/* Central "Central Business Brain" Core */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.65, 0]} />
        <meshBasicMaterial color="#B69A5A" wireframe />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshBasicMaterial color="#F2EEE5" />
      </mesh>

      {/* Origin Node (Merchant Inflow Gateway) */}
      <mesh position={origin}>
        <cylinderGeometry args={[0.3, 0.3, 0.12, 16]} />
        <meshBasicMaterial color="#706E68" wireframe />
      </mesh>

      {/* Destination Node (Guarded Treasury Ledger) */}
      <mesh position={settlement}>
        <cylinderGeometry args={[0.35, 0.35, 0.15, 16]} />
        <meshBasicMaterial color="#B69A5A" wireframe />
      </mesh>

      {/* 4 Specialized Agent Nodes */}
      {agents.map((ag) => (
        <group key={ag.name} position={ag.pos}>
          <mesh>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshBasicMaterial color={ag.color} wireframe />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshBasicMaterial color={ag.color} />
          </mesh>
        </group>
      ))}

      {/* Elegant Golden & Platinum Capital Streams */}
      <TransactionParticle startPoint={origin} agentPoint={agents[0].pos} endPoint={settlement} speed={0.32} color="#B69A5A" offset={0.1} />
      <TransactionParticle startPoint={origin} agentPoint={agents[0].pos} endPoint={settlement} speed={0.32} color="#F2EEE5" offset={0.5} />
      <TransactionParticle startPoint={origin} agentPoint={agents[1].pos} endPoint={settlement} speed={0.28} color="#9A7940" offset={0.25} />
      <TransactionParticle startPoint={origin} agentPoint={agents[1].pos} endPoint={settlement} speed={0.28} color="#713B3B" offset={0.75} />
      <TransactionParticle startPoint={origin} agentPoint={agents[2].pos} endPoint={settlement} speed={0.35} color="#66745D" offset={0.3} />
      <TransactionParticle startPoint={origin} agentPoint={agents[2].pos} endPoint={settlement} speed={0.35} color="#B69A5A" offset={0.85} />
      <TransactionParticle startPoint={origin} agentPoint={agents[3].pos} endPoint={settlement} speed={0.3} color="#D1B56A" offset={0.4} />
      <TransactionParticle startPoint={origin} agentPoint={agents[3].pos} endPoint={settlement} speed={0.3} color="#F2EEE5" offset={0.95} />
    </group>
  );
}

// Accessible Fallback for mobile & reduced motion
function StaticMoneyFlowFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="flex items-center gap-3 text-xs font-mono">
        <div className="px-3 py-2 rounded border border-[#F2EEE5]/10 bg-[#121211] text-[#A5A198]">
          Merchant Inflow
        </div>
        <div className="w-6 h-px bg-[#B69A5A]/40" />
        <div className="px-3 py-2 rounded border border-[#B69A5A]/30 bg-[#1A1917] text-[#B69A5A] font-semibold">
          Autonomous Business Brain
        </div>
        <div className="w-6 h-px bg-[#B69A5A]/40" />
        <div className="px-3 py-2 rounded border border-[#66745D]/30 bg-[#121211] text-[#66745D] font-semibold">
          Treasury Ledger
        </div>
      </div>
      <p className="text-[11px] text-[#706E68] max-w-sm">
        Transactions stream across Growth, Risk, Recovery, and Finance filters before verified settlement.
      </p>
    </div>
  );
}

export function HeroMoneyFlow3D() {
  const [hasWebGL, setHasWebGL] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
  }, []);

  if (!hasWebGL || prefersReducedMotion) {
    return <StaticMoneyFlowFallback />;
  }

  return (
    <div className="w-full h-[360px] md:h-[420px] relative rounded-lg border border-[#F2EEE5]/10 bg-[#121211] overflow-hidden">
      {/* Node Labels Overlay */}
      <div className="absolute top-3 left-4 z-10 text-[10px] font-mono text-[#706E68] tracking-widest uppercase">
        CAPITAL TOPOLOGY • ZERO-TRUST FINANCIAL NERVOUS SYSTEM
      </div>

      <div className="absolute bottom-3 left-4 z-10 flex flex-wrap items-center gap-4 text-[10px] font-mono">
        <span className="flex items-center gap-1.5 text-[#A5A198]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B69A5A]" /> Revenue Inflow
        </span>
        <span className="flex items-center gap-1.5 text-[#A5A198]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9A7940]" /> Zero-Trust Risk Gate
        </span>
        <span className="flex items-center gap-1.5 text-[#A5A198]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#66745D]" /> Reclaimed Dunning
        </span>
        <span className="flex items-center gap-1.5 text-[#A5A198]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D1B56A]" /> Treasury Settlement
        </span>
      </div>

      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <SceneContent />
      </Canvas>
    </div>
  );
}
