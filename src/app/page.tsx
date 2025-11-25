'use client';

import { useMQTT } from '@/hooks/useMQTT';
import { Scene } from '@/components/Scene';
import { HUD } from '@/components/HUD';
import { useEffect, useState } from 'react';

export default function Home() {
  const { sensorData, connected, error } = useMQTT();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="w-screen h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-900 overflow-hidden relative">
      {/* Loading mientras se inicializa el cliente */}
      {!isClient && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white text-xl">Cargando gemelo digital... ⚡</div>
        </div>
      )}
      
      {/* Escena 3D - Solo se renderiza en el cliente */}
      {isClient && (
        <Scene 
          isOpen={sensorData.state === 'open'} 
          luxLevel={sensorData.lux}
        />
      )}
      
      {/* HUD con datos del sensor */}
      {isClient && <HUD sensorData={sensorData} connected={connected} />}
      
      {/* Error banner si hay problemas de conexión */}
      {error && (
        <div className="fixed top-4 right-4 z-10 backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-xl p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <span className="text-red-400 text-xl">⚠️</span>
            <div>
              <h3 className="text-sm font-semibold text-red-400 mb-1">
                Error de Conexión
              </h3>
              <p className="text-xs text-white/70">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Título flotante */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 backdrop-blur-xl bg-black/30 border border-white/10 rounded-full px-6 py-3">
        <h1 className="text-white text-sm font-semibold tracking-wider">
          🏠 GEMELO DIGITAL - SENSOR PUERTA
        </h1>
      </div>
    </main>
  );
}
