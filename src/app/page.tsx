'use client';

import { useMQTT } from '@/hooks/useMQTT';
import { Scene } from '@/components/Scene';
import { HUD } from '@/components/HUD';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useSupabase } from '@/hooks/useSupabase';
import { useEffect, useState } from 'react';

function HomeContent() {
  const { sensorData: mqttData, connected, error } = useMQTT();
  const { logout, user } = useAuth();
  const { saveReading, getLatestReading } = useSupabase();
  const [isClient, setIsClient] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [lastState, setLastState] = useState<string | null>(null);
  const [loadedFromDB, setLoadedFromDB] = useState(false);
  
  // Estado del sensor: usa datos MQTT o datos cargados de BD
  const [sensorData, setSensorData] = useState(mqttData);

  useEffect(() => {
    setIsClient(true);
    
    // Cargar último estado de la BD al iniciar
    loadLatestReading();
  }, []);

  // Actualizar estado cuando lleguen datos MQTT
  useEffect(() => {
    if (mqttData.state !== null) {
      setSensorData(mqttData);
    }
  }, [mqttData]);

  // Cargar última lectura de Supabase
  const loadLatestReading = async () => {
    const reading = await getLatestReading('shellydw2-7DCA66');
    if (reading) {
      console.log('📊 Último estado cargado desde BD:', reading);
      
      // Inicializar con datos de BD si no hay datos MQTT aún
      if (mqttData.state === null) {
        setSensorData({
          state: reading.state,
          battery: reading.battery,
          temperature: reading.temperature,
          lux: reading.lux,
          illumination: reading.illumination,
          tilt: reading.tilt,
          vibration: reading.vibration,
          online: reading.online,
        });
        setLoadedFromDB(true);
        console.log('✅ Datos iniciales cargados desde BD');
      }
    }
  };

  // Guardar lecturas en Supabase cuando cambien (con debounce)
  useEffect(() => {
    if (!sensorData.state || !connected) return; // No guardar si no hay datos o no está conectado

    // Detectar cambio de estado (open <-> close)
    const stateChanged = lastState !== null && lastState !== sensorData.state;
    
    // Guardar si:
    // 1. Es el primer dato (lastSaved === null)
    // 2. Cambió el estado de la puerta
    // 3. Han pasado más de 5 minutos desde el último guardado
    const timeSinceLastSave = lastSaved ? Date.now() - lastSaved.getTime() : Infinity;
    const shouldSave = 
      !lastSaved || 
      stateChanged || 
      timeSinceLastSave > 5 * 60 * 1000;

    if (shouldSave) {
      // DEBOUNCE: Esperar 2 segundos para que lleguen todos los datos MQTT
      const timer = setTimeout(() => {
        const newReading = {
          device_id: 'shellydw2-7DCA66',
          state: sensorData.state,
          battery: sensorData.battery,
          temperature: sensorData.temperature,
          lux: sensorData.lux,
          illumination: sensorData.illumination,
          tilt: sensorData.tilt,
          vibration: sensorData.vibration,
          online: sensorData.online,
          timestamp: new Date().toISOString(),
        };

        console.log('📝 Preparando guardar:', newReading);

        saveReading(newReading).then((success) => {
          if (success) {
            setLastSaved(new Date());
            setLastState(sensorData.state);
            console.log('💾 Lectura guardada en Supabase:', {
              estado: sensorData.state,
              temperatura: sensorData.temperature,
              bateria: sensorData.battery,
              lux: sensorData.lux,
              razon: stateChanged ? 'Cambio de estado' : 'Tiempo transcurrido'
            });
          }
        });
      }, 2000); // Esperar 2 segundos

      // Cleanup: cancelar timer si el componente se desmonta o cambian las dependencias
      return () => clearTimeout(timer);
    }
  }, [sensorData.state, sensorData.battery, sensorData.temperature, sensorData.lux, connected]);

  return (
    <main className="w-screen h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-900 overflow-hidden relative">
      {/* Navbar */}
      <Navbar />
      
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
      
      {/* Indicador de datos desde BD */}
      {loadedFromDB && !connected && (
        <div className="fixed top-24 right-4 z-10 backdrop-blur-xl bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 text-xl">💾</span>
            <div>
              <h3 className="text-sm font-semibold text-blue-400 mb-1">
                Datos Históricos
              </h3>
              <p className="text-xs text-white/70">
                Mostrando último estado guardado. Esperando conexión MQTT...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error banner si hay problemas de conexión */}
      {error && (
        <div className="fixed top-24 right-4 z-10 backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-xl p-4 max-w-sm">
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

      {/* Indicador de guardado */}
      {lastSaved && (
        <div className="fixed bottom-6 right-4 z-10 backdrop-blur-xl bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2 text-xs text-green-400">
          💾 Guardado: {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
