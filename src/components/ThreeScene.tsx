'use client'

import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 color;

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
  p = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p;
  return p;
}

void main() {
  float ratio = resolution.x / resolution.y;
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
  float l = length(p);
  for (float i = 1.0; i < 24.0; i++) {
    p = rotate2d(p, i + time / 10.0);
    p.x += 0.5 / i * sin(i * p.y + time) + noise(vec2(l + time));
    p.y += 0.5 / i * cos(i * p.x + time) + noise(vec2(l + time));
  }
  l = pow(l, 5.0) + l + l + l;
  float pattern = l - noise(p * 2.0 + time) + sin(l + time) - 1.0;
  
  pattern = 1.0 - clamp(pattern, 0.0, 1.0);
  
  gl_FragColor = vec4(color * pattern, 1.0);
}
`

interface ShaderCanvasProps {
  color?: [number, number, number]
}

const ShaderCanvas: React.FC<ShaderCanvasProps> = ({ color = [1, 1, 1] }) => {
  const meshRef = useRef<THREE.Mesh>(null)

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
      uniforms.resolution.value.set(size.width * 2, size.height * 2)
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default ShaderCanvas
