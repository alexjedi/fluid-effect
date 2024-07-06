'use client'

import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useScroll from '@/lib/scrollable'

const vertexShader = `
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 color;

varying vec3 vNormal;
varying vec2 vUv;

const float PI = 3.1415926;

float random(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec2 rotate2d(vec2 p, float angle){
  return vec2(
    cos(angle) * p.x - sin(angle) * p.y,
    sin(angle) * p.x + cos(angle) * p.y
  );
}

void main() {
  vec3 normal = normalize(vNormal);
  
  vec2 p = normal.xy;
  
  float l = length(p);
  
  for (float i = 1.0; i < 10.0; i++) {
    p = rotate2d(p, time / 5.0 + i);
    p += 0.5 * vec2(sin(time + i * p.y), cos(time + i * p.x));
  }
  
  float pattern = noise(p * 5.0 + time);
  
  float edgeHighlight = 1.0 - dot(normal, vec3(0.0, 0.0, 1.0));
  pattern += edgeHighlight * 0.5;
  
  pattern = smoothstep(0.0, 1.0, pattern);
  
  float lighting = dot(normal, normalize(vec3(1.0, 1.0, 1.0)));
  lighting = smoothstep(0.0, 1.0, lighting);
  
  vec3 finalColor = color * pattern * (0.5 + 0.5 * lighting);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`

interface ShaderOctahedronProps {
  color?: [number, number, number]
  radius?: number
  detail?: number
}

const ShaderOctahedron: React.FC<ShaderOctahedronProps> = ({
  color = [1, 1, 1],
  radius = 1,
  detail = 0,
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const scrollY = useScroll()

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      mouse: { value: new THREE.Vector2() },
      resolution: { value: new THREE.Vector2() },
      color: { value: new THREE.Color(...color) },
    }),
    [color]
  )

  useFrame(({ clock, mouse, size }) => {
    if (uniforms) {
      uniforms.time.value = clock.getElapsedTime()
      uniforms.mouse.value.set(mouse.x, mouse.y)
      uniforms.resolution.value.set(size.width, size.height)
    }

    if (meshRef.current) {
      meshRef.current.rotation.y = scrollY * 0.01
      meshRef.current.rotation.x = scrollY * 0.005
    }
  })

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[radius, detail]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default ShaderOctahedron
