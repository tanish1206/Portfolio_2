"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WorldPhase } from "@/world/WorldController";

/**
 * Museum.tsx — Environment/
 *
 * Monumental Procedural Architectural Exhibition Hall.
 * Scale Proportions:
 *  - Width: 28m (x: -14 to +14)
 *  - Length: 46m (z: -23 to +23)
 *  - Height: 14m (y: 0 to 14)
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
        <cylinderGeometry args={[1.15, 1.25, 0.25, 36]} />
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
        <cylinderGeometry args={[1.12, 1.12, 0.04, 36]} />
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
        <cylinderGeometry args={[0.72, 0.78, 0.92, 36]} />
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
        <cylinderGeometry args={[0.82, 0.80, 0.08, 36]} />
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
        <cylinderGeometry args={[0.78, 0.78, 0.006, 36]} />
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

  // Pillar positions (10 monumental pillars forming side aisles)
  const pillarPositions = useMemo<[number, number, number][]>(
    () => [
      [-10, 0, -18],
      [10, 0, -18],
      [-10, 0, -9],
      [10, 0, -9],
      [-10, 0, 0],
      [10, 0, 0],
      [-10, 0, 9],
      [10, 0, 9],
      [-10, 0, 18],
      [10, 0, 18],
    ],
    []
  );

  // Side plinth positions (architectural gallery negative space)
  const sidePlinths = useMemo<[number, number, number][]>(
    () => [
      [-11.5, 0, -13.5],
      [11.5, 0, -13.5],
      [-11.5, 0, 13.5],
      [11.5, 0, 13.5],
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

    // 2. Pillars physical staggered vertical rise (20% to 35%)
    if (pillarsGroupRef.current) {
      pillarsGroupRef.current.children.forEach((pillarGroup, idx) => {
        // Stagger rise timing across pillar index
        const startP = 0.20 + (idx / pillarPositions.length) * 0.07;
        const pilProg = Math.min(1, Math.max(0, (p - startP) / 0.08));
        const targetPosY = THREE.MathUtils.lerp(-14, 0, pilProg);
        pillarGroup.position.y = THREE.MathUtils.lerp(pillarGroup.position.y, targetPosY, lerpSpeed);
      });
    }

    // 3. Walls & Steel support beams extrusion (35% to 50%)
    const wProg = Math.min(1, Math.max(0, (p - 0.35) / 0.15));
    if (wallGroupRef.current) {
      const targetScaleY = wProg > 0 ? wProg : 0.0001;
      wallGroupRef.current.children.forEach((wall) => {
        wall.scale.y = THREE.MathUtils.lerp(wall.scale.y, targetScaleY, lerpSpeed);
      });
    }

    // 4. Ceiling & Steel trusses assembly (50% to 65%)
    const cProg = Math.min(1, Math.max(0, (p - 0.50) / 0.15));
    if (ceilingGroupRef.current) {
      const targetPosY = THREE.MathUtils.lerp(22, 14, cProg);
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
      {/* ─── Polished Dark Concrete Floor (28m × 46m) ─── */}
      <group>
        <mesh
          ref={floorMeshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[28, 46, 14, 23]} />
          <meshStandardMaterial
            ref={floorMatRef}
            color="#2F2A2B"
            roughness={0.25}
            metalness={0.45}
            transparent
            opacity={0}
          />
        </mesh>

        {/* Floor Seam Grid Lines (Brass & Steel Expansion Joints) */}
        {[-10, -5, 0, 5, 10].map((x) => (
          <mesh key={`fseam-x-${x}`} position={[x, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.04, 46]} />
            <meshStandardMaterial color="#B89855" roughness={0.3} metalness={0.85} />
          </mesh>
        ))}
        {[-18, -9, 0, 9, 18].map((z) => (
          <mesh key={`fseam-z-${z}`} position={[0, 0.002, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[28, 0.04]} />
            <meshStandardMaterial color="#B89855" roughness={0.3} metalness={0.85} />
          </mesh>
        ))}
      </group>

      {/* ─── Surrounding Concrete Walls (28m Wide × 46m Deep × 14m High) ─── */}
      <group ref={wallGroupRef}>
        {/* Back Wall */}
        <group position={[0, 0, -23]}>
          <mesh position={[0, 7, 0]} receiveShadow castShadow>
            <boxGeometry args={[28, 14, 0.6]} />
            <meshStandardMaterial color="#3A3435" roughness={0.80} metalness={0.10} />
          </mesh>
          {/* Vertical steel ribs on back wall */}
          {[-10, -5, 0, 5, 10].map((x) => (
            <mesh key={`bw-rib-${x}`} position={[x, 7, 0.35]}>
              <boxGeometry args={[0.25, 14, 0.15]} />
              <meshStandardMaterial color="#221E1F" roughness={0.45} metalness={0.85} />
            </mesh>
          ))}
        </group>

        {/* Left Wall */}
        <group position={[-14, 0, 0]}>
          <mesh position={[0, 7, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[46, 14, 0.6]} />
            <meshStandardMaterial color="#363031" roughness={0.80} metalness={0.10} />
          </mesh>
          {/* Horizontal wall beam */}
          <mesh position={[0.35, 7, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[46, 0.35, 0.15]} />
            <meshStandardMaterial color="#221E1F" roughness={0.40} metalness={0.85} />
          </mesh>
        </group>

        {/* Right Wall */}
        <group position={[14, 0, 0]}>
          <mesh position={[0, 7, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[46, 14, 0.6]} />
            <meshStandardMaterial color="#363031" roughness={0.80} metalness={0.10} />
          </mesh>
          {/* Horizontal wall beam */}
          <mesh position={[-0.35, 7, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[46, 0.35, 0.15]} />
            <meshStandardMaterial color="#221E1F" roughness={0.40} metalness={0.85} />
          </mesh>
        </group>
      </group>

      {/* ─── Staggered Monumental Concrete Pillars (14m Tall) ─── */}
      <group ref={pillarsGroupRef}>
        {pillarPositions.map(([x, y, z], i) => (
          <group key={`pillar-${i}`} position={[x, y, z]}>
            {/* Square base plinth */}
            <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.3, 1.5]} />
              <meshStandardMaterial color="#3E3839" roughness={0.75} metalness={0.20} />
            </mesh>
            {/* Octagonal concrete shaft */}
            <mesh position={[0, 7, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.65, 0.75, 13.4, 8]} />
              <meshStandardMaterial color="#504A4B" roughness={0.78} metalness={0.12} />
            </mesh>
            {/* Steel base collar */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.80, 0.80, 0.12, 16]} />
              <meshStandardMaterial color="#6E6264" roughness={0.35} metalness={0.80} />
            </mesh>
            {/* Steel capital bracket at ceiling joint */}
            <mesh position={[0, 13.8, 0]}>
              <boxGeometry args={[1.6, 0.4, 1.6]} />
              <meshStandardMaterial color="#262223" roughness={0.45} metalness={0.88} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ─── Industrial Ceiling & Steel Roof Trusses ─── */}
      <group ref={ceilingGroupRef} position={[0, 14, 0]}>
        {/* Main Ceiling Concrete Slab */}
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[28, 46]} />
          <meshStandardMaterial color="#2B2627" roughness={0.88} metalness={0.08} />
        </mesh>

        {/* Transverse Steel Trusses across width */}
        {[-18, -9, 0, 9, 18].map((z, idx) => (
          <group key={`truss-${idx}`} position={[0, -0.3, z]}>
            {/* Main top I-beam */}
            <mesh castShadow>
              <boxGeometry args={[28, 0.4, 0.3]} />
              <meshStandardMaterial color="#221E1F" roughness={0.40} metalness={0.85} />
            </mesh>
            {/* Lower support rail */}
            <mesh position={[0, -0.6, 0]}>
              <boxGeometry args={[28, 0.2, 0.2]} />
              <meshStandardMaterial color="#1C1819" roughness={0.40} metalness={0.85} />
            </mesh>
            {/* Diagonal web struts */}
            {[-12, -8, -4, 0, 4, 8, 12].map((xStrut) => (
              <mesh key={`strut-${xStrut}`} position={[xStrut, -0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.8, 0.12, 0.12]} />
                <meshStandardMaterial color="#221E1F" roughness={0.40} metalness={0.85} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Longitudinal Steel Beams along length */}
        {[-10, 0, 10].map((x, idx) => (
          <mesh key={`long-beam-${idx}`} position={[x, -0.3, 0]}>
            <boxGeometry args={[0.3, 0.35, 46]} />
            <meshStandardMaterial color="#201C1D" roughness={0.40} metalness={0.85} />
          </mesh>
        ))}

        {/* Industrial Spotlight Fixture Housings (Physical 3D Light Models attached to Trusses) */}
        {[-18, -9, 0, 9, 18].map((z, idx) => (
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

      {/* ─── Architectural Props (Barriers, Plinths, Trims) ─── */}
      <group ref={propsGroupRef}>
        {/* Steel Stanchion Barriers around Central Pedestal Zone */}
        {[-3.5, 3.5].map((x) =>
          [-5, 5].map((z) => (
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
            <cylinderGeometry args={[0.015, 0.015, 10, 12]} />
            <meshStandardMaterial color="#3C3436" roughness={0.35} metalness={0.90} />
          </mesh>
        ))}

        {/* Secondary Exhibition Gallery Plinths in Side Aisles */}
        {sidePlinths.map(([x, y, z], idx) => (
          <group key={`side-plinth-${idx}`} position={[x, y, z]}>
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.4, 1.0, 1.4]} />
              <meshStandardMaterial color="#383233" roughness={0.80} metalness={0.15} />
            </mesh>
            <mesh position={[0, 1.01, 0]}>
              <boxGeometry args={[1.3, 0.02, 1.3]} />
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
