"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  MeshTransmissionMaterial,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

function EnergySphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.08;

    const material = meshRef.current.material as THREE.ShaderMaterial;

    if (material.uniforms?.uTime) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,

      uniforms: {
        uTime: { value: 0 },
      },

      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        uniform float uTime;

        float wave(vec3 p) {
          return sin(p.x * 4.0 + uTime * 1.2) * 0.03 +
                 sin(p.y * 5.0 + uTime * 1.5) * 0.03 +
                 sin(p.z * 6.0 + uTime) * 0.03;
        }

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);

          vec3 pos = position;
          pos += normal * wave(position);

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;

          gl_Position =
            projectionMatrix *
            viewMatrix *
            worldPos;
        }
      `,

      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        uniform float uTime;

        void main() {

          vec3 viewDirection =
            normalize(cameraPosition - vWorldPosition);

          float fresnel =
            pow(1.0 - dot(viewDirection, vNormal), 3.0);

          float glow =
            smoothstep(0.2, 1.0, fresnel);

          vec2 uv = vUv;

          float plasma =
            sin(uv.x * 12.0 + uTime) *
            sin(uv.y * 12.0 - uTime);

          plasma = plasma * 0.5 + 0.5;

          vec3 deep =
            vec3(0.02, 0.08, 0.22);

          vec3 mid =
            vec3(0.05, 0.4, 1.0);

          vec3 bright =
            vec3(0.7, 0.95, 1.0);

          vec3 color =
            mix(deep, mid, plasma);

          color =
            mix(color, bright, glow * 0.8);

          float alpha =
            0.18 + glow * 0.7;

          gl_FragColor =
            vec4(color, alpha);
        }
      `,
    });
  }, []);

  return (
    <>
      {/* внешняя энергетическая оболочка */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 256, 256]} />
        <primitive object={shaderMaterial} attach="material" />
      </mesh>

      {/* стеклянное ядро */}
      <mesh scale={0.92}>
        <sphereGeometry args={[1, 128, 128]} />

        <MeshTransmissionMaterial
          thickness={0.45}
          roughness={0}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.18}
          backside
          distortion={0.25}
          distortionScale={0.35}
          temporalDistortion={0.18}
          attenuationColor="#6ec8ff"
          attenuationDistance={1.2}
        />
      </mesh>

      {/* внутреннее свечение */}
      <mesh scale={0.55}>
        <sphereGeometry args={[1, 64, 64]} />

        <meshBasicMaterial
          color="#b9ecff"
          transparent
          opacity={0.9}
        />
      </mesh>
    </>
  );
}

function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(6000);

    for (let i = 0; i < 6000; i += 3) {
      arr[i] = (Math.random() - 0.5) * 120;
      arr[i + 1] = (Math.random() - 0.5) * 120;
      arr[i + 2] = (Math.random() - 0.5) * 120;
    }

    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.9}
        color="#ffffff"
      />
    </points>
  );
}

export default function HomePage() {
  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
      }}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <color attach="background" args={["#000000"]} />

        <fog attach="fog" args={["#020611", 8, 30]} />

        <ambientLight intensity={0.3} />

        <directionalLight
          position={[4, 4, 4]}
          intensity={2}
          color="#8bd8ff"
        />

        <pointLight
          position={[0, 0, 0]}
          intensity={8}
          color="#6ec8ff"
        />

        <Stars />

        <EnergySphere />

        <Environment preset="night" />

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.45}
        />
      </Canvas>
    </main>
  );
}