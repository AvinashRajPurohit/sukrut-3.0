"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function SophisticatedGrid() {
  const gridRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Bahut slow movement taaki user ko distraction na ho
    gridRef.current.position.z = (t * 0.1) % 2; 
  });

  return (
    <group>
      {/* Perspective Grid Floor */}
      <gridHelper 
        ref={gridRef}
        // args: [size, divisions, centerLineColor, gridColor]
        args={[50, 40, "#d1d5db", "#f3f4f6"]} 
        position={[0, -2.5, 0]} 
        rotation={[0, 0, 0]}
        transparent
        opacity={0.5}
      >
        {/* Isse grid lines aur sharp aur clean dikhengi */}
        <lineBasicMaterial attach="material" transparent opacity={0.3} />
      </gridHelper>

      {/* Ambient Light to keep the scene clean */}
      <ambientLight intensity={1} />
    </group>
  );
}

export default function ActivityMockup() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
      <Canvas 
        // Alpha true rakha hai taaki background white transparent rahe
        shadows
        camera={{ position: [0, 1.5, 10], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <SophisticatedGrid />
        
        {/* Ek halki si point light jo floor par subtle chamak degi */}
        <pointLight position={[0, 5, 5]} intensity={0.5} />
      </Canvas>
    </div>
  );
}