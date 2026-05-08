"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { animated, useSpring } from "@react-spring/three";
import { extend } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

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

  float glow 
}
  `
  

