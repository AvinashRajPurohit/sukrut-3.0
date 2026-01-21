// components/Mockups/HeroMockup.jsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// 1. The Glowing Sphere Component
const GlowingSphere = () => {
  const meshRef = useRef();

  // Animation: Rotate the sphere
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 5.5; // Rotate slowly
      // meshRef.current.rotation.x += delta * 1.2; // Slight tilt rotation
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 1.8, 0]}>
      {/* The Sphere Geometry */}
      <sphereGeometry args={[0.8, 64, 64]} />
      
      {/* Glowing Material */}
      <meshStandardMaterial
        color="#1a2b4b"
        emissive="#1a2b4b"
        emissiveIntensity={2}
        roughness={0.1}
        metalness={0.1}
        toneMapped={false} // Helps the glow pop
      />
      
      {/* Optional: Add a wireframe or stripe effect overlay if desired */}
      <mesh scale={[1.01, 1.01, 1.01]}>
         <sphereGeometry args={[0.8, 64, 64]} />
         <meshBasicMaterial 
            color="gray" 
            wireframe 
            transparent 
            opacity={0.1} 
         />
      </mesh>
    </mesh>
  );
};

// 2. The Spring Cube Component
const SpringCube = ({ position, delay }) => {
  const meshRef = useRef();
  
  // Initial position to return to
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      // Animation: Move up and down like a spring based on time + delay
      // Math.sin creates the wave, the delay makes them move separately
      meshRef.current.position.y = initialY + Math.sin(t * 2 + delay) * 0.2; 
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      
      {/* Dark Glassy/Tech Material */}
      <meshPhysicalMaterial
        color="#1a2b4b"       // Dark Blue-ish tint
        metalness={0.8}
        roughness={0.1}
        transmission={0.2}    // Slight glass effect
        thickness={1}
        clearcoat={1}
        clearcoatRoughness={0}
      />
      
      {/* Edge Highlights (Optional for that tech look) */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.2, 1.2, 1.2)]} />
        <lineBasicMaterial color="#4a8dff" transparent opacity={0.3} />
      </lineSegments>
    </mesh>
  );
};

// 3. The Main Scene Assembly
const Scene = () => {
  return (
    <group rotation={[0, -Math.PI / 4, 0]}> {/* Rotate whole group to match 3/4 view */}
      
      {/* The 4 Cubes (2x2 Grid) */}
      {/* We pass a 'delay' prop to offset their animation for the wave effect */}
      <SpringCube position={[-0.65, 0, -0.65]} delay={0} />
      <SpringCube position={[0.65, 0, -0.65]} delay={1} />
      <SpringCube position={[-0.65, 0, 0.65]} delay={2} />
      <SpringCube position={[0.65, 0, 0.65]} delay={3} />

      {/* The Sphere on top */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
         <GlowingSphere />
      </Float>
    </group>
  );
};

// components/Mockups/HeroMockup.jsx

export default function HeroMockup() {
  return (
    <div className="w-full h-[600px] lg:h-[700px] relative">
      
      <Canvas
        // CHANGE 2: Camera wahi 'z: 6' rakha hai (zoom maintain karne ke liye)
        // lekin 'y' ko 2.5 kar diya taaki camera thoda upar dekhe
        camera={{ position: [0, 2.5, 6], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />
        <pointLight position={[0, 1, 0]} intensity={2} color="#0088ff" distance={3} />
        
        <Environment preset="city" />

        {/* Scene Logic */}
        <group position={[0, -0.5, 0]}>
           <Scene />
        </group>

        <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#0a1a3a" />
      </Canvas>
    </div>
  );
}