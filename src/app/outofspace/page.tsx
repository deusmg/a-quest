"use client";

import {Canvas} from "@react-three/fiber";

export default function OutOfSpacePage() {
  return (
    <main style={{ width: "100vw", height: "100vh", background: "black" }}>
	<Canvas>
	  <mesh>
	   <sphereGeometry args={[0.08, 16, 16]} />
	   <meshBasicMaterial color="white" />	
	  </mesh>
	</Canvas>
    </main> 
 );
}
