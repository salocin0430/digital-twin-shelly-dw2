'use client';

export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial 
        color="#2c2c2c" 
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
}

