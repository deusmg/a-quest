"use client";

import "./page.css";
import * as THREE from "three";
import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  Environment,
  Html,
} from "@react-three/drei";

import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Phase =
  | "void"
  | "collapse"
  | "bang"
  | "inflation"
  | "whiteout"
  | "begin";

const SECRET_POSITION = new THREE.Vector3(
  0.8,
  -0.2,
  0
);

export default function HomePage() {
  const [phase, setPhase] =
    useState<Phase>("void");

  useEffect(() => {
    if (phase === "collapse") {
      const t1 = setTimeout(
        () => setPhase("bang"),
        1800
      );

      const t2 = setTimeout(
        () => setPhase("inflation"),
        3200
      );

      const t3 = setTimeout(
        () => setPhase("whiteout"),
        7600
      );

      const t4 = setTimeout(
        () => setPhase("begin"),
        9200
      );

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [phase]);

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 45,
        }}
      >
        <color
          attach="background"
          args={["#000"]}
        />

        <fogExp2
          attach="fog"
          args={["#01030a", 0.032]}
        />

        <ambientLight intensity={0.15} />

        <pointLight
          position={[0, 0, 0]}
          intensity={8}
          color="#6ec8ff"
        />

        <Environment preset="night" />

        <PrimordialVoid />

        <StarField
          phase={phase}
          onActivate={() => {
            if (phase === "void") {
              setPhase("collapse");
            }
          }}
        />

        <Universe phase={phase} />

        <Whiteout phase={phase} />

        <BeginText phase={phase} />

        <EffectComposer>
          <Bloom
            intensity={2.4}
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
          />

          <ChromaticAberration
            offset={[0.0012, 0.0012]}
          />

          <Noise opacity={0.025} />

          <Vignette darkness={0.92} />
        </EffectComposer>
      </Canvas>

      {phase === "void" && (
        <div style={introStyle}>
          Когда вселенная была меньше атома
        </div>
      )}
    </main>
  );
}

function PrimordialVoid() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;

    mesh.current.rotation.z =
      state.clock.elapsedTime * 0.01;
  });

  return (
    <mesh ref={mesh} scale={40}>
      <sphereGeometry args={[1, 64, 64]} />

      <meshBasicMaterial
        side={THREE.BackSide}
        transparent
        opacity={0.22}
        color="#020611"
      />
    </mesh>
  );
}

function StarField({
  phase,
  onActivate,
}: {
  phase: Phase;
  onActivate: () => void;
}) {
  const ref = useRef<THREE.Points>(null);

  const { camera, mouse } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(9000);

    for (let i = 0; i < 9000; i += 3) {
      arr[i] =
        (Math.random() - 0.5) * 60;

      arr[i + 1] =
        (Math.random() - 0.5) * 60;

      arr[i + 2] =
        (Math.random() - 0.5) * 60;
    }

    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.rotation.y += 0.00035;

    if (phase === "inflation") {
      ref.current.scale.multiplyScalar(1.01);
    }

    const secret =
      SECRET_POSITION.clone();

    secret.project(camera);

    const dx =
      mouse.x - secret.x;

    const dy =
      mouse.y - secret.y;

    const dist =
      Math.sqrt(dx * dx + dy * dy);

    document.body.style.cursor =
      dist < 0.08
        ? "pointer"
        : "default";
  });

  return (
    <>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.03}
          transparent
          opacity={0.95}
          color="#ffffff"
          sizeAttenuation
        />
      </points>

      {phase === "void" && (
        <HiddenSingularity
          onActivate={onActivate}
        />
      )}
    </>
  );
}

function HiddenSingularity({
  onActivate,
}: {
  onActivate: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const pulse =
      Math.sin(
        state.clock.elapsedTime * 2.2
      ) *
      0.15;

    ref.current.scale.setScalar(
      1 + pulse
    );
  });

  return (
    <mesh
      ref={ref}
      position={SECRET_POSITION}
      onClick={onActivate}
    >
      <sphereGeometry
        args={[0.03, 32, 32]}
      />

      <meshBasicMaterial
        color="#9fd4ff"
      />
    </mesh>
  );
}

function Universe({
  phase,
}: {
  phase: Phase;
}) {
  if (
    phase === "void" ||
    phase === "begin"
  ) {
    return null;
  }

  return (
    <group position={SECRET_POSITION}>
      <Shockwave phase={phase} />

      <UniverseSphere phase={phase} />
    </group>
  );
}

function Shockwave({
  phase,
}: {
  phase: Phase;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;

    if (phase === "bang") {
      ref.current.scale.multiplyScalar(
        1.045
      );

      const material =
        ref.current
          .material as THREE.MeshBasicMaterial;

      material.opacity *= 0.965;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry
        args={[1, 64, 64]}
      />

      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
        wireframe
      />
    </mesh>
  );
}

function UniverseSphere({
  phase,
}: {
  phase: Phase;
}) {
  const shell =
    useRef<THREE.Mesh>(null);

  const atmosphere =
    useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t =
      state.clock.elapsedTime;

    if (shell.current) {
      shell.current.rotation.y +=
        0.002;

      const material =
        shell.current
          .material as THREE.ShaderMaterial;

      material.uniforms.uTime.value =
        t;

      if (
        phase === "inflation"
      ) {
        shell.current.scale.multiplyScalar(
          1.01
        );
      }
    }

    if (atmosphere.current) {
      atmosphere.current.rotation.y -=
        0.0015;
    }
  });

  const shader =
    useMemo(() => {
      return new THREE.ShaderMaterial({
        transparent: true,

        blending:
          THREE.AdditiveBlending,

        depthWrite: false,

        uniforms: {
          uTime: { value: 0 },
        },

        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;

          uniform float uTime;

          float wave(vec3 p) {
            return
              sin(p.x * 5.0 + uTime) *
              sin(p.y * 5.0 + uTime * 0.7) *
              sin(p.z * 5.0 + uTime * 0.5);
          }

          void main() {

            vUv = uv;

            vec3 pos = position;

            float distortion =
              wave(position) * 0.08;

            pos += normal * distortion;

            vNormal =
              normalize(normalMatrix * normal);

            vPosition =
              (modelMatrix * vec4(pos,1.0)).xyz;

            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(pos,1.0);
          }
        `,

        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;

          uniform float uTime;

          void main() {

            vec3 viewDir =
              normalize(
                cameraPosition -
                vPosition
              );

            float fresnel =
              pow(
                1.0 -
                dot(viewDir, vNormal),
                4.0
              );

            float nebula =
              sin(vUv.x * 12.0 + uTime) *
              sin(vUv.y * 12.0 - uTime);

            nebula =
              nebula * 0.5 + 0.5;

            vec3 deep =
              vec3(0.02,0.05,0.14);

            vec3 mid =
              vec3(0.05,0.4,1.0);

            vec3 bright =
              vec3(0.85,0.95,1.0);

            vec3 color =
              mix(deep, mid, nebula);

            color =
              mix(
                color,
                bright,
                fresnel
              );

            float alpha =
              0.15 +
              fresnel * 0.9;

            gl_FragColor =
              vec4(color, alpha);
          }
        `,
      });
    }, []);

  return (
    <>
      <mesh ref={shell}>
        <sphereGeometry
          args={[1, 128, 128]}
        />

        <primitive
          object={shader}
          attach="material"
        />
      </mesh>

      <mesh
        ref={atmosphere}
        scale={1.12}
      >
        <sphereGeometry
          args={[1, 128, 128]}
        />

        <meshBasicMaterial
          transparent
          opacity={0.12}
          color="#6ec8ff"
          blending={
            THREE.AdditiveBlending
          }
        />
      </mesh>

      <mesh scale={0.72}>
        <sphereGeometry
          args={[1, 64, 64]}
        />

        <meshBasicMaterial
          color="#dff4ff"
          transparent
          opacity={0.95}
        />
      </mesh>
    </>
  );
}

function Whiteout({
  phase,
}: {
  phase: Phase;
}) {
  if (
    phase !== "whiteout" &&
    phase !== "begin"
  ) {
    return null;
  }

  return (
    <Html fullscreen>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          opacity:
            phase === "begin"
              ? 1
              : 0.92,
          transition:
            "opacity 2s ease",
        }}
      />
    </Html>
  );
}

function BeginText({
  phase,
}: {
  phase: Phase;
}) {
  if (phase !== "begin") {
    return null;
  }

  return (
    <Html center>
      <div
        style={{
          color: "#111",
          fontSize: "clamp(48px,8vw,140px)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          animation:
            "fadeIn 3s ease forwards",
        }}
      >
        Начало
      </div>
    </Html>
  );
}

const introStyle: React.CSSProperties =
  {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "rgba(255,255,255,0.82)",
    fontSize:
      "clamp(22px,2vw,42px)",
    fontWeight: 600,
    letterSpacing: "0.02em",
    textShadow:
      "0 0 20px rgba(120,180,255,0.35)",
    pointerEvents: "none",
    zIndex: 10,
  };