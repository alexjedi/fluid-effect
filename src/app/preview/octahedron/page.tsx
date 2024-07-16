'use client'

import {
  Component,
  Copy,
  Dribbble,
  Framer,
  Github,
  Grip,
  Linkedin,
  Star,
  TestTube,
  TestTubeDiagonal,
  Twitter,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import CustomLink from '@/components/ui/link'
import Image from 'next/image'
import profilePic from '@/app/avatar.png'
import ShaderBlob from '@/components/ShaderBlob'
import ShaderSphere from '@/components/ShaderSphere'
import ShaderPyramid from '@/components/ShaderPyramid'
import ShaderOctahedron from '@/components/ShaderOctahedron'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { EffectControls } from '@/components/EffectControlls'
import { component } from '@/lib/copyable'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'

const projectLinks = {
  code: 'https://github.com/alexjedi/noise-effect',
  framer: 'https://framer.com/projects/new?duplicate=4nZDiYRDmL3lVtSryEzt',
  twitter: 'https://twitter.com/pxl_alexjedi',
  linkedin: 'https://www.linkedin.com/in/alex-shelvey/',
  dribbble: 'https://dribbble.com/pxlhead',
}

export default function Home() {
  const { toast } = useToast()
  return (
    <main className="relative flex w-screen h-[100vh] flex-col items-start justify-center p-24">
      <div className="fixed z-0 inset-0 bg-black h-100vh">
        <Canvas>
          <ShaderOctahedron color={[1, 1, 1]} radius={2} detail={0} />
        </Canvas>
      </div>
    </main>
  )
}
