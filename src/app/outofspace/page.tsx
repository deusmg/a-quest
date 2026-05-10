"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
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
	<OrbitControls />
	</Canvas>
    </main>
 );
}
