'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Door } from './Door';
import { DoorFrame } from './DoorFrame';
import { Floor } from './Floor';
import { useRef } from 'react';
import * as THREE from 'three';

interface SceneProps {
  isOpen: boolean;
  luxLevel: number | null;
}

export function Scene({ isOpen, luxLevel }: SceneProps) {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  
  // Calcular intensidad de luz basada en lux (0-500 lux típico en interiores)
  const lightIntensity = luxLevel ? Math.max(0.2, Math.min(2, luxLevel / 100)) : 1;

  return (
    <Canvas shadows className="w-full h-full">
      {/* Cámara */}
      <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={50} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={10}
      />
      
      {/* Iluminación */}
      <ambientLight intensity={0.3 * lightIntensity} />
      
      <spotLight
        ref={spotLightRef}
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={lightIntensity * 100}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Luz direccional para sombras más definidas */}
      <directionalLight
        position={[-3, 5, 2]}
        intensity={0.5 * lightIntensity}
        castShadow
      />
      
      {/* Punto de luz que cambia según el estado de la puerta */}
      <pointLight 
        position={[-1, 1.5, 1]} 
        intensity={isOpen ? 50 : 20}
        color={isOpen ? '#ff6b6b' : '#51cf66'}
        distance={3}
      />
      
      {/* Escena */}
      <Floor />
      <DoorFrame />
      <Door isOpen={isOpen} />
      
      {/* Fog para profundidad */}
      <fog attach="fog" args={['#0a0a0a', 5, 15]} />
    </Canvas>
  );
}

