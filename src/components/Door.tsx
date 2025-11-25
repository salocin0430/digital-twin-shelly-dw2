'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DoorProps {
  isOpen: boolean;
}

export function Door({ isOpen }: DoorProps) {
  const doorRef = useRef<THREE.Group>(null);
  const targetRotation = isOpen ? Math.PI / 2 : 0; // 90 grados cuando abierto

  useFrame(() => {
    if (doorRef.current) {
      // Interpolación suave (lerp) para animación fluida
      doorRef.current.rotation.y = THREE.MathUtils.lerp(
        doorRef.current.rotation.y,
        targetRotation,
        0.05
      );
    }
  });

  return (
    <group ref={doorRef} position={[-1.5, 1, 0]}>
      {/* La puerta rota desde su borde izquierdo (bisagra) */}
      <mesh position={[0.55, 0, 0]} castShadow>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial 
          color={isOpen ? '#ff6b6b' : '#51cf66'} 
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Manija de la puerta */}
      <mesh position={[0.9, 0, 0.08]} castShadow>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

