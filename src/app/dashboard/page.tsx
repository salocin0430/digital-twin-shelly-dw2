'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { TemperatureChart } from '@/components/TemperatureChart';
import { BatteryChart } from '@/components/BatteryChart';
import { LuxChart } from '@/components/LuxChart';
import { EventsTable } from '@/components/EventsTable';
import { useSupabase } from '@/hooks/useSupabase';
import { useMQTT } from '@/hooks/useMQTT';
import type { SensorReading } from '@/lib/supabase';
import { DoorOpen, DoorClosed, TrendingUp, Battery, Loader2 } from 'lucide-react';

function DashboardContent() {
  const { getReadings } = useSupabase();
  const { sensorData, connected } = useMQTT(); // ¡Usar MQTT en tiempo real!
  const [readings24h, setReadings24h] = useState<SensorReading[]>([]);
  const [readings7d, setReadings7d] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const prevStateRef = useRef<string | null>(null);

  // Función para cargar datos
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    
    console.log('🔄 Iniciando carga de datos...');
    
    try {
      // Obtener datos de las últimas 24 horas para temperatura
      const data24h = await getReadings('shellydw2-7DCA66', 100, 24);
      console.log('📊 Datos 24h obtenidos:', data24h.length, 'registros');
      setReadings24h(data24h);

      // Obtener datos de los últimos 7 días para batería
      const data7d = await getReadings('shellydw2-7DCA66', 200, 24 * 7);
      console.log('📊 Datos 7d obtenidos:', data7d.length, 'registros');
      setReadings7d(data7d);
      
      setLastUpdate(new Date());
      
      console.log('✅ Dashboard actualizado exitosamente');
      if (data24h.length > 0) {
        console.log('   Última lectura:', {
          estado: data24h[0].state,
          temperatura: data24h[0].temperature,
          batería: data24h[0].battery,
          timestamp: new Date(data24h[0].timestamp).toLocaleString('es-ES'),
        });
      }
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Cargar datos iniciales solo UNA VEZ
  useEffect(() => {
    console.log('🚀 Dashboard montado, cargando datos iniciales...');
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  // Detectar cambios en MQTT y recargar datos automáticamente
  useEffect(() => {
    // Solo recargar si el estado cambió (open <-> close)
    if (sensorData.state && sensorData.state !== prevStateRef.current) {
      console.log('🔔 Cambio de estado detectado via MQTT:', {
        anterior: prevStateRef.current,
        nuevo: sensorData.state,
      });
      console.log('⏳ Esperando 3 segundos para que el servidor guarde los datos...');
      
      // Esperar 3 segundos para que el servidor guarde los datos
      // (servidor tiene debounce de 2s + tiempo de procesamiento)
      const timeoutId = setTimeout(() => {
        console.log('⏰ Timeout completado, recargando datos...');
        loadData(true);
      }, 3000);
      
      prevStateRef.current = sensorData.state;
      
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensorData.state]); // Solo cuando cambia el estado MQTT

  // Calcular métricas del día
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayReadings = readings24h.filter(r => 
    new Date(r.timestamp) >= today
  );

  const openingsToday = todayReadings.filter(r => r.state === 'open').length;
  const currentBattery = readings24h[0]?.battery || null;
  const currentState = readings24h[0]?.state || null;
  const avgTemperature = readings24h.length > 0
    ? readings24h.reduce((acc, r) => acc + (r.temperature || 0), 0) / readings24h.filter(r => r.temperature !== null).length
    : null;

  if (loading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-900 text-white p-4 sm:p-6 pt-20 sm:pt-24">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">📊 Dashboard de Métricas</h1>
        <p className="text-sm sm:text-base text-gray-400">Monitor histórico del sensor Shelly DW2</p>
      </div>

      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Estado Actual Card (Destacado) */}
        <div className={`backdrop-blur-xl border rounded-2xl p-4 sm:p-8 transition-all ${
          currentState === 'open'
            ? 'bg-red-500/20 border-red-500/40'
            : 'bg-green-500/20 border-green-500/40'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`p-3 sm:p-4 rounded-2xl ${
                currentState === 'open'
                  ? 'bg-red-500/30'
                  : 'bg-green-500/30'
              }`}>
                {currentState === 'open' ? (
                  <DoorOpen className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" />
                ) : (
                  <DoorClosed className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
                )}
              </div>
              <div>
                <p className="text-gray-300 text-xs sm:text-sm mb-1">Estado Actual</p>
                <p className={`text-2xl sm:text-4xl font-bold ${
                  currentState === 'open' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {currentState === 'open' ? 'ABIERTO' : currentState === 'close' ? 'CERRADO' : '--'}
                </p>
              </div>
            </div>
            {readings24h[0] && (
              <div className="text-center sm:text-right text-gray-400 text-xs sm:text-sm">
                <span className="hidden sm:inline">Última actualización<br/></span>
                <span className="text-white">
                  {new Date(readings24h[0].timestamp).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Aperturas Hoy */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-orange-500/20 rounded-xl flex-shrink-0">
                <DoorOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Aperturas Hoy</p>
                <p className="text-2xl sm:text-3xl font-bold">{openingsToday}</p>
              </div>
            </div>
          </div>

          {/* Batería Actual */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${
                currentBattery && currentBattery < 20 
                  ? 'bg-red-500/20' 
                  : 'bg-green-500/20'
              }`}>
                <Battery className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  currentBattery && currentBattery < 20 
                    ? 'text-red-400' 
                    : 'text-green-400'
                }`} />
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Batería Actual</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {currentBattery !== null ? `${currentBattery}%` : '--'}
                </p>
              </div>
            </div>
          </div>

          {/* Temperatura Promedio */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-orange-500/20 rounded-xl flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Temp. Promedio (24h)</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {avgTemperature !== null ? `${avgTemperature.toFixed(1)}°C` : '--'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Gráfica de Temperatura */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              🌡️ Temperatura (24h)
            </h2>
            <TemperatureChart data={readings24h} />
          </div>

          {/* Gráfica de Batería */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              🔋 Batería (7 días)
            </h2>
            <BatteryChart data={readings7d} />
          </div>

          {/* Gráfica de Iluminación */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 lg:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              💡 Iluminación (24h)
            </h2>
            <LuxChart data={readings24h} />
          </div>
        </div>

        {/* Tabla de Eventos */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                📋 Últimos Eventos
              </h2>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                  {connected ? 'MQTT conectado' : 'MQTT desconectado'}
                </div>
                {lastUpdate && (
                  <div className="text-xs text-gray-400">
                    • Actualización: {lastUpdate.toLocaleTimeString('es-ES')}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Manual refresh */}
              <button
                onClick={() => loadData()}
                className="px-3 sm:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors text-xs sm:text-sm"
                title="Actualizar ahora"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-x-auto overflow-y-auto">
            <EventsTable data={readings24h.slice(0, 50)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

