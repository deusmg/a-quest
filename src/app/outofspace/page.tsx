"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type StarData = {
	position: [number, number, number];
	color: string;
	size: number;
	phase: number;
};

function AnimatedStar() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
   if (meshRef.current) {
	const time = state.clock.elapsedTime;
	const pulse = 1 + Math.sin(time * 3) * 0.25;

	meshRef.current.rotation.y += 0.02;
	meshRef.current.scale.set(pulse, pulse, pulse);
	}
      });
  return (
	<mesh ref={meshRef} position={[0, 0,-2]}>
	<sphereGeometry args={[0.12, 16, 16]} />
	<meshBasicMaterial color="white" />

	<mesh position={[0.25, 0, 0]}>
	 <sphereGeometry args={[0.03, 8, 8]} />
	 <meshBasicMaterial color="orange" />
	</mesh>

	</mesh>
	);
	}

function Star({ star }: { star: StarData}) {

	const meshRef = useRef<THREE.Mesh>(null)

	useFrame((state) => {
		if (meshRef.current) {

			const time = state.clock.elapsedTime;

			const pulse = 1 + Math.sin(time * 2 + star.phase) * 0.3;

			meshRef.current.scale.set(
				pulse,
				pulse,
				pulse
			);
		}
	});

	return (
		<mesh
			ref={meshRef}
			position={star.position}
		>
	 		<sphereGeometry args={[star.size, 32, 32]} />
	 		<meshBasicMaterial color={star.color} />
		</mesh>
  );
}

function StarField() {
	
	const positions = new Float32Array(3000);

	const colors = new Float32Array(3000);

	for (let i = 0; i < 3000; i += 3) {

	positions[i] =
	(Math.random() - 0.5) * 40;

	positions[i + 1] =
	(Math.random() - 0.5) * 40;

	positions[i + 2] =
	(Math.random() - 0.5) * 40;

	const colorType = Math.random();

	if (colorType < 0.55) { 
		colors[i] = 1.0;
		colors[i + 1] = 1.0;
		colors[i + 2] = 1.0; 
	} else if (colorType < 0.75){
		colors[i] = 0.65;
                colors[i + 1] = 0.85;
                colors[i + 2] = 1.0;
	} else if (colorType < 0.9) {
		colors[i] = 1.0;
                colors[i + 1] = 0.82;
                colors[i + 2] = 0.45;
	} else {
		colors[i] = 1.0;
                colors[i + 1] = 0.45;
                colors[i + 2] = 0.2;
	}
	}

	const starTexture = useMemo(() => {
		const canvas = document.createElement("canvas");
		canvas.width = 64;
		canvas.height = 64;

		const context = canvas.getContext("2d")!;
		const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
		
		gradient.addColorStop(0, "rgba(255,255,255,1)");
		gradient.addColorStop(0.35, "rgba(255,255,255,0.7)");
		gradient.addColorStop(1, "rgba(255,255,255,0)");

		context.fillStyle = gradient;
		context.fillRect(0, 0, 64, 64);
		
		return new THREE.CanvasTexture(canvas);

	}, []);

	return (
	<points>
	<bufferGeometry>
	 <bufferAttribute
	 attach="attributes-position"
	 args={[positions, 3]}
	 />
	 <bufferAttribute
	 attach="attributes-color"
	 args={[colors, 3]}
	 />
	</bufferGeometry>
	<pointsMaterial
	 vertexColors
	 map={starTexture}
	 transparent
	 depthWrite={false}
	 size={0.06}
	 sizeAttenuation
	/>
	</points>
);
}

export default function OutOfSpacePage() {

    const starColors = [
    "#ffffff",
    "#ffe9c4",
    "#d4fbff",
    "#fff6aa",
    "#ffddb4",
    ];
    const stars = Array.from({ length: 1000 }, () => ({
	position: [
	(Math.random() - 0.5) * 100,
	(Math.random() - 0.5) * 100,
	(Math.random() - 0.5) * 100,
	] as [number, number, number],

	color:
	starColors[
	  Math.floor(Math.random() * starColors.length)
	],

	size: Math.random() * 0.12 + 0.02,

	phase: Math.random() * Math.PI * 2

	}));
    return (
    <main style={{ width: "100vw", height: "100vh", background: "black" }}>
	<Canvas>

	{stars.map((star, index) => (
	  <Star key={index} star={star} />
	))}
	<AnimatedStar />
	/* <StarField /> */
	<OrbitControls
		enableZoom={false}
		enablePan={false}
		rotateSpeed={0.45}
		enableDamping
		dampingFactor={0.03}
	/>
	</Canvas>
    </main>
 );
}
