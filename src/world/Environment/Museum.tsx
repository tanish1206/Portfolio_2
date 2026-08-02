"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * Museum.tsx — Environment/
 *
 * Monumental Procedural Architectural Exhibition Hall.
 * Refined Scale Proportions:
 *  - Width: 26m (x: -13 to +13)
 *  - Length: 42m (z: -21 to +21)
 *  - Height: 9.6m (y: 0 to 9.6) — Lowered ceiling for optimal camera framing.
 */

interface MuseumProps {
  phase: WorldPhase;
  progress?: number;
}

export function CompassPedestal({
  opacity = 1,
  positionY = 0,
}: {
  opacity?: number;
  positionY?: number;
}) {
  return (
    <group position={[0, positionY, 0]}>
      {/* Outer base plinth - dark slate */}
      <mesh castShadow receiveShadow position={[0, 0.125, 0]}>
        <cylinderGeometry args={[1.18, 1.28, 0.25, 36]} />
        <meshStandardMaterial
          color="#3A3435"
          roughness={0.65}
          metalness={0.25}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Brushed brass accent ring */}
      <mesh castShadow receiveShadow position={[0, 0.27, 0]}>
        <cylinderGeometry args={[1.14, 1.14, 0.04, 36]} />
        <meshStandardMaterial
          color="#C5A059"
          roughness={0.30}
          metalness={0.90}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Main concrete/stone column shaft */}
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.74, 0.80, 0.92, 36]} />
        <meshStandardMaterial
          color="#484243"
          roughness={0.75}
          metalness={0.18}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Top cap - dark steel rim */}
      <mesh castShadow receiveShadow position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.84, 0.82, 0.08, 36]} />
        <meshStandardMaterial
          color="#2F292A"
          roughness={0.40}
          metalness={0.80}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Polished top display face */}
      <mesh receiveShadow position={[0, 1.292, 0]}>
        <cylinderGeometry args={[0.80, 0.80, 0.006, 36]} />
        <meshStandardMaterial
          color="#1F1A1B"
          roughness={0.15}
          metalness={0.90}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}

export const Museum: React.FC<MuseumProps> = ({ phase, progress = 0 }) => {
  const floorMeshRef = useRef<THREE.Mesh>(null);
  const floorMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const wallGroupRef = useRef<THREE.Group>(null);
  const pillarsGroupRef = useRef<THREE.Group>(null);
  const ceilingGroupRef = useRef<THREE.Group>(null);
  const propsGroupRef = useRef<THREE.Group>(null);
  const pedestalGroupRef = useRef<THREE.Group>(null);

  // Pillar positions (10 monumental grounded pillars framing central gallery)
  const pillarPositions = useMemo<[number, number, number][]>(
    () => [
      [-9.5, 0, -16],
      [9.5, 0, -16],
      [-9.5, 0, -8],
      [9.5, 0, -8],
      [-9.5, 0, 0],
      [9.5, 0, 0],
      [-9.5, 0, 8],
      [9.5, 0, 8],
      [-9.5, 0, 16],
      [9.5, 0, 16],
    ],
    []
  );

  // Exhibition Alcoves in Recessed Walls (natural future project gallery locations)
  const alcovePositions = useMemo<[number, number, number][]>(
    () => [
      [-11.2, 0, -12],
      [11.2, 0, -12],
      [-11.2, 0, 12],
      [11.2, 0, 12],
    ],
    []
  );

  useFrame((_, delta) => {
    const p = progress;
    const lerpSpeed = Math.min(delta * 6, 1);

    // 1. Floor assembly (10% to 20%): physical radial scale expansion
    const fProg = Math.min(1, Math.max(0, (p - 0.10) / 0.10));
    if (floorMeshRef.current && floorMatRef.current) {
      const targetScaleXZ = fProg > 0 ? fProg : 0.0001;
      const targetOpacity = fProg > 0 ? 0.90 + fProg * 0.10 : 0;
      floorMeshRef.current.scale.x = THREE.MathUtils.lerp(floorMeshRef.current.scale.x, targetScaleXZ, lerpSpeed);
      floorMeshRef.current.scale.y = THREE.MathUtils.lerp(floorMeshRef.current.scale.y, targetScaleXZ, lerpSpeed);
      floorMatRef.current.opacity = THREE.MathUtils.lerp(floorMatRef.current.opacity, targetOpacity, lerpSpeed);
    }

    // 2. Pillars physical staggered vertical rise (20% to 35%): height 9.6m
    if (pillarsGroupRef.current) {
      pillarsGroupRef.current.children.forEach((pillarGroup, idx) => {
        const startP = 0.20 + (idx / pillarPositions.length) * 0.07;
        const pilProg = Math.min(1, Math.max(0, (p - startP) / 0.08));
        const targetPosY = THREE.MathUtils.lerp(-9.6, 0, pilProg);
        pillarGroup.position.y = THREE.MathUtils.lerp(pillarGroup.position.y, targetPosY, lerpSpeed);
      });
    }

    // 3. Recessed Walls & Alcoves extrusion (35% to 50%): height 9.6m
    const wProg = Math.min(1, Math.max(0, (p - 0.35) / 0.15));
    if (wallGroupRef.current) {
      const targetScaleY = wProg > 0 ? wProg : 0.0001;
      wallGroupRef.current.children.forEach((wall) => {
        wall.scale.y = THREE.MathUtils.lerp(wall.scale.y, targetScaleY, lerpSpeed);
      });
    }

    // 4. Lowered Ceiling & Steel Trusses assembly (50% to 65%): height 9.6m
    const cProg = Math.min(1, Math.max(0, (p - 0.50) / 0.15));
    if (ceilingGroupRef.current) {
      const targetPosY = THREE.MathUtils.lerp(18, 9.6, cProg);
      ceilingGroupRef.current.position.y = THREE.MathUtils.lerp(ceilingGroupRef.current.position.y, targetPosY, lerpSpeed);
    }

    // 5. Architectural Props (85% to 95%)
    const propProg = Math.min(1, Math.max(0, (p - 0.85) / 0.10));
    if (propsGroupRef.current) {
      const targetScale = propProg > 0 ? propProg : 0.0001;
      propsGroupRef.current.scale.setScalar(THREE.MathUtils.lerp(propsGroupRef.current.scale.x, targetScale, lerpSpeed));
    }

    // 6. Central Stone Pedestal emergence (95% to 100%)
    const pedProg = Math.min(1, Math.max(0, (p - 0.95) / 0.05));
    if (pedestalGroupRef.current) {
      const targetPedY = THREE.MathUtils.lerp(-1.5, 0, pedProg);
      pedestalGroupRef.current.position.y = THREE.MathUtils.lerp(pedestalGroupRef.current.position.y, targetPedY, lerpSpeed);
    }
  });

  return (
    <group>
      {/* ─── Premium Dark Honed Stone Floor (26m × 42m) ─── */}
      <group>
        <mesh
          ref={floorMeshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[26, 42, 13, 21]} />
          <meshStandardMaterial
            ref={floorMatRef}
            color="#2A2627"
            roughness={0.22}
            metalness={0.42}
            transparent
            opacity={0}
          />
        </mesh>

        {/* Natural Stone Seams & Brass Expansion Joints Grid */}
        {[-9.5, -4.75, 0, 4.75, 9.5].map((x) => (
          <mesh key={`fseam-x-${x}`} position={[x, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.04, 42]} />
            <meshStandardMaterial color="#B89855" roughness={0.3} metalness={0.85} />
          </mesh>
        ))}
        {[-16, -8, 0, 8, 16].map((z) => (
          <mesh key={`fseam-z-${z}`} position={[0, 0.002, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[26, 0.04]} />
            <meshStandardMaterial color="#B89855" roughness={0.3} metalness={0.85} />
          </mesh>
        ))}
      </group>

      {/* ─── Architectural Recessed Concrete Walls (26m Wide × 42m Deep × 9.6m High) ─── */}
      <group ref={wallGroupRef}>
        {/* Back Wall with Recessed Central Gallery Bay */}
        <group position={[0, 0, -21]}>
          {/* Main Wall Face */}
          <mesh position={[0, 4.8, 0]} receiveShadow castShadow>
            <boxGeometry args={[26, 9.6, 0.6]} />
            <meshStandardMaterial color="#3A3435" roughness={0.80} metalness={0.10} />
          </mesh>
          {/* Recessed Central Niche Bay */}
          <mesh position={[0, 4.8, 0.25]}>
            <boxGeometry args={[10, 8.0, 0.2]} />
            <meshStandardMaterial color="#2E282A" roughness={0.85} metalness={0.12} />
          </mesh>
          {/* Vertical Steel I-beam Framing */}
          {[-9.5, -4.75, 0, 4.75, 9.5].map((x) => (
            <mesh key={`bw-beam-${x}`} position={[x, 4.8, 0.35]}>
              <boxGeometry args={[0.25, 9.6, 0.15]} />
              <meshStandardMaterial color="#221E1F" roughness={0.45} metalness={0.85} />
            </mesh>
          ))}
        </group>

        {/* Left Wall with Exhibition Alcoves */}
        <group position={[-13, 0, 0]}>
          {/* Main Wall Plane */}
          <mesh position={[0, 4.8, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[42, 9.6, 0.6]} />
            <meshStandardMaterial color="#363031" roughness={0.80} metalness={0.10} />
          </mesh>
          {/* Recessed Exhibition Alcove Niche (Z: -12) */}
          <mesh position={[0.25, 4.8, -12]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[7.5, 7.0, 0.25]} />
            <meshStandardMaterial color="#292425" roughness={0.85} metalness={0.15} />
          </mesh>
          {/* Recessed Exhibition Alcove Niche (Z: +12) */}
          <mesh position={[0.25, 4.8, 12]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[7.5, 7.0, 0.25]} />
            <meshStandardMaterial color="#292425" roughness={0.85} metalness={0.15} />
          </mesh>
          {/* Horizontal Steel Beam */}
          <mesh position={[0.35, 4.8, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[42, 0.35, 0.15]} />
            <meshStandardMaterial color="#221E1F" roughness={0.40} metalness={0.85} />
          </mesh>
        </group>

        {/* Right Wall with Exhibition Alcoves */}
        <group position={[13, 0, 0]}>
          {/* Main Wall Plane */}
          <mesh position={[0, 4.8, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[42, 9.6, 0.6]} />
            <meshStandardMaterial color="#363031" roughness={0.80} metalness={0.10} />
          </mesh>
          {/* Recessed Exhibition Alcove Niche (Z: -12) */}
          <mesh position={[-0.25, 4.8, -12]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[7.5, 7.0, 0.25]} />
            <meshStandardMaterial color="#292425" roughness={0.85} metalness={0.15} />
          </mesh>
          {/* Recessed Exhibition Alcove Niche (Z: +12) */}
          <mesh position={[-0.25, 4.8, 12]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[7.5, 7.0, 0.25]} />
            <meshStandardMaterial color="#292425" roughness={0.85} metalness={0.15} />
          </mesh>
          {/* Horizontal Steel Beam */}
          <mesh position={[-0.35, 4.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[42, 0.35, 0.15]} />
            <meshStandardMaterial color="#221E1F" roughness={0.40} metalness={0.85} />
          </mesh>
        </group>
      </group>

      {/* ─── Grounded Monumental Concrete Pillars (9.6m Tall, Thicker Proportions) ─── */}
      <group ref={pillarsGroupRef}>
        {pillarPositions.map(([x, y, z], i) => (
          <group key={`pillar-${i}`} position={[x, y, z]}>
            {/* Square heavy base plinth */}
            <mesh position={[0, 0.175, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.9, 0.35, 1.9]} />
              <meshStandardMaterial color="#3E3839" roughness={0.75} metalness={0.20} />
            </mesh>
            {/* Thicker octagonal concrete column shaft (radius 0.90m) */}
            <mesh position={[0, 4.8, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.85, 0.92, 8.9, 8]} />
              <meshStandardMaterial color="#504A4B" roughness={0.78} metalness={0.12} />
            </mesh>
            {/* Steel base collar */}
            <mesh position={[0, 0.40, 0]}>
              <cylinderGeometry args={[0.96, 0.96, 0.12, 16]} />
              <meshStandardMaterial color="#6E6264" roughness={0.35} metalness={0.80} />
            </mesh>
            {/* Steel capital bracket at 9.6m ceiling joint */}
            <mesh position={[0, 9.4, 0]}>
              <boxGeometry args={[2.0, 0.4, 2.0]} />
              <meshStandardMaterial color="#262223" roughness={0.45} metalness={0.88} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ─── Industrial Ceiling & Steel Roof Trusses (Positioned at 9.6m Height) ─── */}
      <group ref={ceilingGroupRef} position={[0, 9.6, 0]}>
        {/* Main Ceiling Concrete Slab */}
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[26, 42]} />
          <meshStandardMaterial color="#2B2627" roughness={0.88} metalness={0.08} />
        </mesh>

        {/* Transverse Steel Trusses across width */}
        {[-16, -8, 0, 8, 16].map((z, idx) => (
          <group key={`truss-${idx}`} position={[0, -0.3, z]}>
            {/* Main top I-beam */}
            <mesh castShadow>
              <boxGeometry args={[26, 0.4, 0.3]} />
              <meshStandardMaterial color="#221E1F" roughness={0.40} metalness={0.85} />
            </mesh>
            {/* Lower support rail */}
            <mesh position={[0, -0.6, 0]}>
              <boxGeometry args={[26, 0.2, 0.2]} />
              <meshStandardMaterial color="#1C1819" roughness={0.40} metalness={0.85} />
            </mesh>
            {/* Diagonal web struts */}
            {[-10, -6, -2, 2, 6, 10].map((xStrut) => (
              <mesh key={`strut-${xStrut}`} position={[xStrut, -0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.8, 0.12, 0.12]} />
                <meshStandardMaterial color="#221E1F" roughness={0.40} metalness={0.85} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Longitudinal Steel Beams along length */}
        {[-9.5, 0, 9.5].map((x, idx) => (
          <mesh key={`long-beam-${idx}`} position={[x, -0.3, 0]}>
            <boxGeometry args={[0.3, 0.35, 42]} />
            <meshStandardMaterial color="#201C1D" roughness={0.40} metalness={0.85} />
          </mesh>
        ))}

        {/* Industrial Spotlight Fixture Housings attached to Trusses */}
        {[-16, -8, 0, 8, 16].map((z, idx) => (
          <group key={`spot-housing-${idx}`} position={[0, -0.8, z]}>
            {/* Mounting bracket */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.3, 0.2, 0.3]} />
              <meshStandardMaterial color="#1A1617" roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Cylindrical housing */}
            <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 6, 0, 0]}>
              <cylinderGeometry args={[0.32, 0.38, 0.6, 24]} />
              <meshStandardMaterial color="#2C2627" roughness={0.35} metalness={0.85} />
            </mesh>
            {/* Glass lens cap */}
            <mesh position={[0, -0.58, 0.12]} rotation={[Math.PI / 6, 0, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.04, 24]} />
              <meshStandardMaterial color="#665D5F" roughness={0.10} metalness={0.95} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ─── Architectural Props (Barriers, Wall Alcove Plinths, Trims) ─── */}
      <group ref={propsGroupRef}>
        {/* Steel Stanchion Barriers around Central Pedestal Zone */}
        {[-3.5, 3.5].map((x) =>
          [-4.5, 4.5].map((z) => (
            <group key={`stanchion-${x}-${z}`} position={[x, 0, z]}>
              {/* Heavy base */}
              <mesh position={[0, 0.04, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.25, 0.08, 20]} />
                <meshStandardMaterial color="#2A2425" roughness={0.35} metalness={0.85} />
              </mesh>
              {/* Post */}
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.035, 0.035, 0.92, 16]} />
                <meshStandardMaterial color="#3C3436" roughness={0.30} metalness={0.90} />
              </mesh>
              {/* Top brass ball cap */}
              <mesh position={[0, 0.98, 0]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#C5A059" roughness={0.30} metalness={0.88} />
              </mesh>
            </group>
          ))
        )}

        {/* Barrier Connecting Steel Rods */}
        {[-3.5, 3.5].map((x) => (
          <mesh key={`bar-rail-z-${x}`} position={[x, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 9, 12]} />
            <meshStandardMaterial color="#3C3436" roughness={0.35} metalness={0.90} />
          </mesh>
        ))}

        {/* Secondary Exhibition Gallery Plinths in Wall Alcoves */}
        {alcovePositions.map(([x, y, z], idx) => (
          <group key={`alcove-plinth-${idx}`} position={[x, y, z]}>
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 1.0, 1.5]} />
              <meshStandardMaterial color="#383233" roughness={0.80} metalness={0.15} />
            </mesh>
            <mesh position={[0, 1.01, 0]}>
              <boxGeometry args={[1.4, 0.02, 1.4]} />
              <meshStandardMaterial color="#201C1D" roughness={0.25} metalness={0.80} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ─── Central Circular Stone Pedestal (Rises at 95%-100%) ─── */}
      <group ref={pedestalGroupRef} position={[0, -1.5, 0]}>
        <CompassPedestal opacity={1} />
      </group>
    </group>
  );
};
