"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function HeroMockup3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    /* ======================
       SCENE
    ====================== */
    const scene = new THREE.Scene();

    /* ======================
       CAMERA
    ====================== */
    const camera = new THREE.PerspectiveCamera(
      43,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    // 🔥 Camera closer so cube looks BIG
   camera.position.set(5.2, 5.2, 7.5);

    camera.lookAt(0, 0, 0);

    /* ======================
       RENDERER
    ====================== */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    

    /* ======================
       LIGHTING (WHITE / GRAY)
    ====================== */
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-6, -4, 6);
    scene.add(fillLight);

    /* ======================
       MATERIAL (WHITE + GRAY)
    ====================== */
   const material = new THREE.MeshPhysicalMaterial({
  color: 0xf1f3f5,        // milky white-gray
  roughness: 0.15,       // smooth surface
  metalness: 0.0,

  transmission: 0.6,     // 🔥 glass-like transparency
  thickness: 1.2,        // depth of crystal
  ior: 1.35,             // index of refraction (crystal-like)

  transparent: true,
  opacity: 0.85,         // not fully glass, milky crystal

  clearcoat: 0.4,        // subtle glossy layer
  clearcoatRoughness: 0.25,
});


    /* ======================
       BUILD SMALL CUBES
    ====================== */
    const cubes = [];
    const size = 1.4;   // 🔥 bigger cubes
    const gap = 0.05;   // slight separation

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const geometry = new THREE.BoxGeometry(size, size, size);
          const cube = new THREE.Mesh(geometry, material);

          // scattered start (lazy-load feel)
          cube.position.set(
            THREE.MathUtils.randFloat(-8, 8),
            THREE.MathUtils.randFloat(-8, 8),
            THREE.MathUtils.randFloat(-8, 8)
          );

          scene.add(cube);
          cubes.push({
            cube,
            target: {
              x: x * (size + gap),
              y: y * (size + gap),
              z: z * (size + gap),
            },
          });
        }
      }
    }

    /* ======================
       GSAP ASSEMBLE ANIMATION
    ====================== */
    cubes.forEach(({ cube, target }, i) => {
      gsap.to(cube.position, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 2.4,
        delay: i * 0.03,
        ease: "power4.out",
      });
    });

    // 🔥 Final scale punch so cube feels strong
    gsap.to(scene.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 0.8,
      ease: "power2.out",
      delay: 2.2,
    });

    /* ======================
       RENDER LOOP
    ====================== */
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    /* ======================
       HANDLE RESIZE
    ====================== */
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    /* ======================
       CLEANUP
    ====================== */
    return () => {
      window.removeEventListener("resize", onResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-[35vw] max-w-[520px] aspect-square"
    />
  );
}
