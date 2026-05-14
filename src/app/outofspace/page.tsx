"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

type StarData = {
	position: [number, number, number];
	color: string;
	size: number;
	phase: number;
};

function AnimatedStar({
	observeProgress,
	onObserve,
	}: {
	observeProgress: number;
	onObserve: (value: number) => void;
	}) {

  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const screenPosition = new THREE.Vector3();
	
  const observeStartRef = useRef<number | null>(null);

  useFrame((state) => {
   if (meshRef.current) {
	const time = state.clock.elapsedTime;
	
	meshRef.current.getWorldPosition(screenPosition);
	screenPosition.project(state.camera);
	
	const isInFrontOfCamera = screenPosition.z < 1;

	const distanceFromCenter = Math.sqrt(
	  screenPosition.x * screenPosition.x + 
	  screenPosition.y * screenPosition.y
	);

	if (isInFrontOfCamera && distanceFromCenter < 0.05) {
	 if (observeStartRef.current === null) {
	   observeStartRef.current = time;
	 }

	 const observedTime = time - observeStartRef.current;
	 const progress = Math.min(observedTime / 7, 1);

	 onObserve(progress);
	} else {
	  observeStartRef.current = null;
	  onObserve(0);
 	}	
	
	const pulseSpeed = 3 + observeProgress * 8;
	const pulsePower = 0.25 + observeProgress * 0.8;	

	const pulse = 1 + Math.sin(time * pulseSpeed) * pulsePower;

	meshRef.current.rotation.y += 0.02;

	const awakeningScale = 1 + observeProgress * 1.8;
	const finalScale = pulse * awakeningScale;

	meshRef.current.scale.set(finalScale, finalScale, finalScale);

	if (glowRef.current) {
	 const glowPulse =
	   1.4 +
	   Math.sin(time * 2.2) * 0.25 +
	   observeProgress * 1.2;

	glowRef.current.scale.set(glowPulse, glowPulse, glowPulse);
	}
	}
      });
  return (
	<mesh ref={meshRef} position={[0, 4, 14]}>
	<sphereGeometry args={[0.08, 16, 16]} />
	<meshBasicMaterial
	 color={
	 observeProgress > 0.66
	? "#ffdd66"
	: observeProgress > 0.33
	 ? "#8fd3ff"
	 : "#ffffff"
	}
	 />

	<mesh ref={glowRef}>
	 <sphereGeometry args={[0.18, 32, 32]} />
	 <meshBasicMaterial
	  color="#8fd3ff"
	  transparent	
	  opacity={0.12 + observeProgress * 0.28}
	 />
	</mesh>

	</mesh>
	);
	}

function CosmicHint() {
	return (
	<Text
	position={[0, 1.2, -3]}
	fontSize={0.20}
	color="#9fb7ff"
	anchorX="center"
	anchorY="middle"
	>
	Когда-то вселенная была меньше атома
	</Text>
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
    
    const [observeProgress, setObserveProgress] = useState(0);    
	
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
	
	<div 
	 style={{
	 position: "fixed",
	 left: 24,
	 bottom: 24,
	 zIndex: 10,
	 color: "white",
	 fontFamily: "monospace",
	 }}
	>
	observe: {Math.round(observeProgress * 100)}%
	</div>	

	<Canvas>
	
	<CosmicHint />
	<AnimatedStar
	 observeProgress={observeProgress}
	 onObserve={setObserveProgress}
	 />
	<OrbitControls
		makeDefault
		enableZoom={false}
		enablePan={false}
		rotateSpeed={0.45}
		enableDamping={true}
		dampingFactor={0.03}
	/>
	</Canvas>
    </main>
 );
}
