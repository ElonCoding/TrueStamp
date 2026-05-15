import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, MeshDistortMaterial, Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const HolographicCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Box ref={meshRef} args={[2.5, 2.5, 2.5]}>
        <meshPhysicalMaterial 
          color="#b026ff" 
          emissive="#b026ff"
          emissiveIntensity={0.5}
          wireframe={true}
          transparent={true}
          opacity={0.8}
          roughness={0.1}
          metalness={0.8}
        />
      </Box>
      <Box args={[2.4, 2.4, 2.4]}>
        <MeshDistortMaterial 
          color="#00f0ff" 
          emissive="#00f0ff"
          emissiveIntensity={1}
          attach="material" 
          distort={0.4} 
          speed={2} 
          transparent={true}
          opacity={0.3}
        />
      </Box>
    </Float>
  );
};

const Particles = () => {
  return (
    <Sparkles count={200} scale={10} size={4} speed={0.4} opacity={0.6} color="#00ffff" />
  );
};

const BlockchainCube = () => {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#b026ff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#00f0ff" />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ff00ff" distance={10} />
        
        <HolographicCube />
        <Particles />
        
        <Environment preset="city" />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default BlockchainCube;
