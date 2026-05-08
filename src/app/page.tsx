"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { animated, useSpring } from "@react-spring/three";
import { extend } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { config } from "process";

const ColorSphereMaterial = shaderMaterial(
  { uTime: 0 },
  `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }
  `,
  `
  unform float uTime;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
	float wave1 = sin(vPosition.x * 5.0 + uTime * 2.0);
	float wave2 = cos(vPosition.y * 7.0 - uTime * 1.6);
	float wave3 = sin((vPosition.x = vPosition.y - vPosition.z) * 4.0 + uTime * 2.8);
  
  vec3 colorA = vec3(1.0, 0.05, 0.45);
  vec3 colorB = vec3(0.05, 0.65, 1.0);
  vec3 colorC = vec3(1.0, 0.85, 0.05);
  vec3 colorD = vec3(0.35, 0.0, 1.0);
	
  vec3 color = mix(colorA, colorB, wave1 * 0.5 + 0.5);
  color = mix(color, colorC, wave2 * 0.5 + 0.5);
  color = mix(color, colorD, wave3 * 0.35 + 0.35);

  float glow = 0.65 + 0.35 * sin(uTime * 3.0);
  
  gl_FragColor = vec4(color + glow, 1.0);
}
`
);

extend({ ColorSphereMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    colorSphereMaterial: React.JSX.IntrinsicElements["shaderMaterial"];
  }
}

function LivingSphere() {
  const materialRef = useRef<any>(null);

  const { scale } = useSpring({
    from: { scale: 0.01 },
    to: { scale: 1 },
    config: { tension: 70, friction: 12 }, 
  });

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <animated.mesh scale={scale}>
      <sphereGeometry args={[1.7, 128, 128]} />
      <colorSphereMaterial ref={materialRef} />
    </animated.mesh>
  );
}

function SphereScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45}}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={3} />

      <LivingSphere />

      <EffectComposer>
        <Bloom intensity={2.4} luminanceTheshold={0.1} luminanceSmoothing={0.2} />
      </EffectComposer>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
    </Canvas>
  );
}

export default function LevelOne() {
  const [activated, setActivated] = useState(false);

  const stars = useMemo(() => {
    return Array.from({ length: 420 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.2 + 0.6,
      opacity: Math.random() * 0.55 + 0.12,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 1.5,
    }));
  }, []);

  const secretStarIndex = 173;

  return (
    <main className="levelOne">
      {!activated && (
        <>
          <div className="introText">
            Вселенная была невообразимо горячей и плотной,
            <br />
            размером меньше атома.
          </div>

          <div className="stars">
            {stars.map((star, index) => {
              const isSecret = index === secretStarIndex;
              return (
                <button
                key={star.id}
                className={isSecret ? "star secretStar" : "star"}
                onClick={isSecret ? () => setActivated(true) : undefined}
                aria-label={isSecret ? "Скрытая точка" : undefined}
                style={{
                  left: `${star.left}`,
                  top: `${star.top}`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`,
                }}
                />
              );
            })}
          </div>
        </>
      )}
      {activated && (
        <div className="sphereWrap">
          <SphereScene />
        </div>
      )}
    </main>
  );
}

  
