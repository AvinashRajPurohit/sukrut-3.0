"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/* === 1. THE DNA DATA-TOWER (BRIGHTER) === */
const DNADataTower = () => {
  const ref = useRef();
  const points = useMemo(() => {
    const count = 1600; 
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i * 0.05; 
      const radius = 1.2;
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      const y = (i * 0.005) - 4; 
      const randomSpread = 0.2;
      arr[i * 3] = x + (Math.random() - 0.5) * randomSpread;
      arr[i * 3 + 1] = y; 
      arr[i * 3 + 2] = z + (Math.random() - 0.5) * randomSpread;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5; 
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group rotation={[0.2, 0, 0]}>
       <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
          {/* UPDATED MATERIAL FOR GLOW */}
          <PointMaterial 
            transparent 
            color="#E39A2E" 
            size={0.05} // Increased size
            sizeAttenuation={true} 
            depthWrite={false} 
            opacity={1.0} // Full opacity
            toneMapped={false} // Makes it Neon
            blending={THREE.AdditiveBlending} // Glowing effect
          />
       </Points>
       <DNAHelixSecondary />
    </group>
  );
};

const DNAHelixSecondary = () => {
    const ref = useRef();
    const points = useMemo(() => {
        const count = 800;
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const t = i * 0.05 + Math.PI; 
          const radius = 1.2;
          const x = Math.cos(t) * radius;
          const z = Math.sin(t) * radius;
          const y = (i * 0.005) - 4;
          arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z;
        }
        return arr;
    }, []);
    useFrame((state, delta) => { if(ref.current) ref.current.rotation.y += delta * 0.5; });
    return (
        <Points ref={ref} positions={points} stride={3}>
            <PointMaterial 
              transparent 
              color="white" 
              size={0.03} 
              sizeAttenuation={true} 
              opacity={0.8} 
              toneMapped={false}
              blending={THREE.AdditiveBlending}
            />
        </Points>
    )
}


/* === 2. DOTTED SPHERE (BRIGHTER) === */
const DottedSphere = () => {
  const ref = useRef();
  const generateSpherePoints = (count, radius) => {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);
        points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
    }
    return points;
  }
  const sphere = useMemo(() => generateSpherePoints(1500, 1.5), []);
  useFrame((state, delta) => {
    if(ref.current) { ref.current.rotation.x -= delta / 10; ref.current.rotation.y -= delta / 15; }
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial 
            transparent 
            color="#E39A2E" 
            size={0.035} // Increased size
            sizeAttenuation={true} 
            depthWrite={false} 
            opacity={1.0} 
            toneMapped={false} // Neon
            blending={THREE.AdditiveBlending} // Glow
        />
      </Points>
    </group>
  );
};


/* === 3. THE INFINITY LOOP (BRIGHTER) === */
const ParticleMobiusStrip = () => {
  const ref = useRef();

  const points = useMemo(() => {
    const count = 2500; // High density
    const arr = new Float32Array(count * 3);
    const radius = 1.6; // Size of the loop
    const width = 0.5;  // Width of the strip

    for(let i=0; i<count; i++) {
        const t = (i / count) * Math.PI * 2; 
        const w = (Math.random() - 0.5) * width;
        const x = (radius + w * Math.cos(t / 2)) * Math.cos(t);
        const y = (radius + w * Math.cos(t / 2)) * Math.sin(t);
        const z = w * Math.sin(t / 2);

        arr[i*3] = x;
        arr[i*3+1] = y;
        arr[i*3+2] = z;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
     if(ref.current) {
         ref.current.rotation.x += delta * 0.2;
         ref.current.rotation.y += delta * 0.1;
     }
  });

  return (
    <group>
        <Points ref={ref} positions={points} stride={3}>
            <PointMaterial 
              transparent 
              color="#E39A2E" 
              size={0.045} // Bigger dots
              sizeAttenuation={true} 
              depthWrite={false} 
              opacity={1.0} 
              blending={THREE.AdditiveBlending} // Intense glow
              toneMapped={false} // Neon
            />
        </Points>
    </group>
  );
};

/* === EXPORT WRAPPER === */
export default function AbstractGraphic({ type }) {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas camera={{ position: [0, 0, 7], fov: 40 }} gl={{ antialias: true }}>
        {/* Simply increased ambient light intensity for brightness */}
        <ambientLight intensity={1.5} />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
             {type === "network" && <DNADataTower />} 
             {type === "globe" && <DottedSphere />}
             {type === "burst" && <ParticleMobiusStrip />}
        </Float>
      </Canvas>
    </div>
  );
}