'use client';

export function DoorFrame() {
  return (
    <group position={[-1.5, 0, 0]}>
      {/* Marco izquierdo (bisagra) */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.1, 2.2, 0.15]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      
      {/* Marco derecho */}
      <mesh position={[1.1, 1, 0]} castShadow>
        <boxGeometry args={[0.1, 2.2, 0.15]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      
      {/* Marco superior */}
      <mesh position={[0.55, 2.05, 0]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.15]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      
      {/* Pared - Lado izquierdo (antes del marco) */}
      <mesh position={[-0.65, 1.5, 0]} receiveShadow>
        <boxGeometry args={[1.2, 3, 0.2]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Pared - Lado derecho (después del marco) */}
      <mesh position={[1.7, 1.5, 0]} receiveShadow>
        <boxGeometry args={[1.2, 3, 0.2]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Pared - Parte superior (encima del marco) */}
      <mesh position={[0.55, 2.55, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.9, 0.2]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

    </group>
  );
}

