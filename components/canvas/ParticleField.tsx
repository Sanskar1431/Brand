"use client";

import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import logoPoints from "@/public/models/logo-points.json";

// Initialize simplex noise
const noise3D = createNoise3D();

interface ParticleFieldProps {
  count: number;
  convergence: number; // 0 to 1
  opacity?: number;
}

function randomScatter(count: number): { x: number; y: number; z: number }[] {
  const points = [];
  for (let i = 0; i < count; i++) {
    // Distribute in a spherical volume
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * 8; // spread up to radius 8
    
    points.push({
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi) * (Math.random() - 0.5) * 2,
    });
  }
  return points;
}

function Particles({ count, convergence, opacity = 0.6 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create starting scatter positions
  const startPositions = useMemo(() => randomScatter(count), [count]);

  // Load the precomputed logo positions
  const targets = useMemo(() => {
    return logoPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z));
  }, []);

  // Load the circular glow sprite texture
  const texture = useLoader(THREE.TextureLoader, "/textures/glow.png");

  // Create point arrays for positions attribute
  const positionArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = startPositions[i].x;
      arr[i * 3 + 1] = startPositions[i].y;
      arr[i * 3 + 2] = startPositions[i].z;
    }
    return arr;
  }, [count, startPositions]);

  // Create color array for colorful glowing particles
  const colorArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      if (r < 0.35) {
        // Sunset Coral (#FF4E50)
        arr[i * 3] = 1.0;
        arr[i * 3 + 1] = 0.31;
        arr[i * 3 + 2] = 0.31;
      } else if (r < 0.7) {
        // Neon Cyan (#06B6D4)
        arr[i * 3] = 0.02;
        arr[i * 3 + 1] = 0.71;
        arr[i * 3 + 2] = 0.83;
      } else {
        // Vibrant Purple (#7C3AED)
        arr[i * 3] = 0.48;
        arr[i * 3 + 1] = 0.22;
        arr[i * 3 + 2] = 0.93;
      }
    }
    return arr;
  }, [count]);

  // Update loop (Section 5.1.3)
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const t = state.clock.getElapsedTime();
    const geom = pointsRef.current.geometry;
    const positions = geom.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const start = startPositions[i];
      const target = targets[i % targets.length];

      // Lerp toward logo point based on convergence value
      const currX = THREE.MathUtils.lerp(start.x, target.x, convergence);
      const currY = THREE.MathUtils.lerp(start.y, target.y, convergence);
      const currZ = THREE.MathUtils.lerp(start.z, target.z, convergence);

      // Simplex noise organic drift (Section 5.1.1)
      const driftX = noise3D(currX * 0.3, currY * 0.3, t * 0.08) * 0.25;
      const driftY = noise3D(currY * 0.3, currX * 0.3, t * 0.08 + 100) * 0.25;
      const driftZ = noise3D(currZ * 0.3, currX * 0.3, t * 0.08 + 200) * 0.15;

      positions.setXYZ(i, currX + driftX, currY + driftY, currZ + driftZ);
    }
    
    positions.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positionArray, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        vertexColors={true}
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function ParticleField({ count, convergence, opacity = 0.6 }: ParticleFieldProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <Particles count={count} convergence={convergence} opacity={opacity} />
      </Canvas>
    </div>
  );
}
