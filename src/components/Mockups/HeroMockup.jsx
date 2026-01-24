// components/Mockups/HeroMockup.jsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sparkles } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

/* =======================
   PREMIUM GLOWING SPHERE
======================= */
const GlowingSphere = () => {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.rotation.z -= delta * 0.1;
      // Pulse effect
      const t = state.clock.elapsedTime;
      glowRef.current.material.opacity = 0.4 + Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group position={[0, 1.8, 0]}>
      {/* 1. INNER DARK CORE */}
      {/* <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshPhysicalMaterial
          color="#000000"
          emissive="#1d4ed8" // Deep Blue Glow
          emissiveIntensity={.5}
          roughness={0.1}
          metalness={1}
          clearcoat={1}
        />
      </mesh> */}

      {/* 2. OUTER HOLOGRAPHIC SHELL */}
      <mesh ref={glowRef} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshBasicMaterial
          color="#E39A2E"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
      
      {/* 3. LIGHT SOURCE INSIDE */}
      <pointLight intensity={3} color="#3b82f6" distance={3} decay={2} />
    </group>
  );
};

/* =======================
   FUTURISTIC HUD RING
======================= */
const BackgroundHUD = () => {
  const groupRef = useRef();
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Smooth LookAt
    groupRef.current.lookAt(camera.position);
    // Subtle Rotation
    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 1.8, -1.5]} scale={1.2}>
      {/* Thin Line Ring */}
      <mesh>
        <ringGeometry args={[2.8, 2.82, 128]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Dashed Tech Ring */}
      <mesh rotation={[0, 0, 0.5]}>
        <ringGeometry args={[2.4, 2.45, 64, 1, 0, Math.PI * 1.5]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Inner Glow Circle */}
      <mesh>
         <ringGeometry args={[2.0, 2.01, 128]} />
         <meshBasicMaterial color="#E39A2E" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/* =======================
   PREMIUM OBSIDIAN CUBES
======================= */
const SpringCube = ({ position, delay }) => {
  const ref = useRef();
  const baseY = position[1];

  useFrame(({ clock }) => {
    // Smooth floating animation
    const t = clock.elapsedTime;
    ref.current.position.y = baseY + Math.sin(t * 1.5 + delay) * 0.15;
    
    // Slight tilt for realism
    ref.current.rotation.x = Math.sin(t * 0.5 + delay) * 0.05;
    ref.current.rotation.z = Math.cos(t * 0.5 + delay) * 0.05;
  });

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      {/* OBSIDIAN GLASS MATERIAL */}
     <meshPhysicalMaterial
  color="#081628"        // ⚫ mostly black with blue base (60/40)
  emissive="#172554"     // 🔵 subtle deep blue inner tone
  emissiveIntensity={0.28}

  metalness={0.88}      // strong metal feel
  roughness={0.14}      // controlled gloss
  transmission={0.15}   // very subtle glass
  thickness={2}

  clearcoat={1}
  clearcoatRoughness={0.07}
  ior={1.5}
/>



      {/* NEON EDGES */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.2, 1.2, 1.2)]} />
        <lineBasicMaterial
  color="#3b82f6"
  transparent
  opacity={0.25}
/>

      </lineSegments>
    </mesh>
  );
};

/* =======================
   RESTORED: FADED SHADER GRID
======================= */
// const FadedGrid = () => {
//   const mat = useRef();

//   useFrame(({ clock }) => {
//     if (mat.current) {
//       mat.current.uniforms.uTime.value = clock.elapsedTime;
//     }
//   });

//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
//       <planeGeometry args={[12, 12, 1, 1]} />
//       <shaderMaterial
//         ref={mat}
//         transparent
//         depthWrite={false}
//         uniforms={{
//           uTime: { value: 0 },
//           uColor: { value: new THREE.Color("#E39A2E") }, // ORANGE/GOLD Color
//         }}
//         vertexShader={`
//           varying vec2 vUv;
//           void main() {
//             vUv = uv;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
//           }
//         `}
//         fragmentShader={`
//           varying vec2 vUv;
//           uniform vec3 uColor;
//           uniform float uTime;

//           float gridLine(float coord) {
//             float width = fwidth(coord);
//             return 1.0 - smoothstep(0.0, width * 1.2, abs(fract(coord) - 0.5));
//           }

//           void main() {
//             float scale = 20.0;
//             float gx = gridLine(vUv.x * scale);
//             float gy = gridLine(vUv.y * scale);
//             float grid = max(gx, gy);

//             // Center Fade
//             float centerDist = distance(vUv, vec2(0.5));
//             float centerFade = smoothstep(0.55, 0.25, centerDist);

//             // Edge Fade
//             float edgeFadeX = smoothstep(0.0, 0.08, vUv.x) * smoothstep(0.0, 0.08, 1.0 - vUv.x);
//             float edgeFadeY = smoothstep(0.0, 0.08, vUv.y) * smoothstep(0.0, 0.08, 1.0 - vUv.y);
//             float edgeFade = edgeFadeX * edgeFadeY;

//             // Soft Pulse
//             float pulse = 0.12 + sin(uTime * 2.0) * 0.03;

//             float alpha = grid * centerFade * edgeFade * pulse;

//             gl_FragColor = vec4(uColor, alpha);
//           }
//         `}
//       />
//     </mesh>
//   );
// };

/* =======================
   MAIN SCENE ASSEMBLY
======================= */
const Scene = () => {
  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      
      {/* Floating Cubes */}
      <SpringCube position={[-0.65, 0, -0.65]} delay={0} />
      <SpringCube position={[0.65, 0, -0.65]} delay={1} />
      <SpringCube position={[-0.65, 0, 0.65]} delay={2} />
      <SpringCube position={[0.65, 0, 0.65]} delay={3} />

      {/* Restored Shader Grid */}
      {/* <FadedGrid /> */}
      
      {/* Atmosphere Sparkles */}
      <Sparkles 
        count={50} 
        scale={6} 
        size={4} 
        speed={0.4} 
        opacity={0.5} 
        color="#E39A2E" // Gold Accents
      />

      {/* Floating Centerpiece */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[0, 0.3]}>
        <BackgroundHUD />
        <GlowingSphere />
      </Float>

    </group>
  );
};

/* =======================
   HERO MOCKUP EXPORT
======================= */
export default function HeroMockup() {
  return (
    <div className="w-full h-[600px] lg:h-[700px] relative">
      
      <Canvas
        camera={{ position: [0, 2, 8], fov: 35 }} 
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, exposure: 1.2 }}
        shadows
      >
        {/* LIGHTING SETUP */}
        <ambientLight intensity={0.4} color="#ffffff" />
        
        {/* Main Key Light */}
        <spotLight
          position={[10, 15, 10]}
          angle={0.3}
          penumbra={0.5}
          intensity={5}
          color="#ffffff"
          castShadow
          shadow-bias={-0.0001}
        />

        {/* Blue Rim Light (Left) */}
        <spotLight position={[-5, 5, -5]} angle={0.5} intensity={5} color="#3b82f6" />
        
        {/* Gold Rim Light (Right - Subtle) */}
        <pointLight position={[5, 0, 0]} intensity={2} color="#E39A2E" distance={5} />

        {/* Environment Reflections */}
        <Environment preset="city" />

        {/* Scene Content */}
        <group position={[0, -0.8, 0]}>
          <Scene />
        </group>
      </Canvas>
    </div>
  );
}