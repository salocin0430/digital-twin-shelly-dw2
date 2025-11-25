'use client';

import { Battery, Thermometer, Eye, Wifi, WifiOff, DoorOpen, DoorClosed, Sun } from 'lucide-react';
import type { SensorData } from '@/hooks/useMQTT';

interface HUDProps {
  sensorData: SensorData;
  connected: boolean;
}

export function HUD({ sensorData, connected }: HUDProps) {
  const { state, battery, temperature, lux, illumination, online } = sensorData;

  return (
    <div className="fixed top-4 left-4 z-10 pointer-events-none">
      {/* Panel principal con glassmorphism */}
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl min-w-[280px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">
            Shelly DW2
          </h2>
          <div className="flex items-center gap-2">
            {connected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <div 
              className={`w-2 h-2 rounded-full ${connected && online ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
            />
          </div>
        </div>

        {/* Estado de la puerta */}
        <div className={`mb-4 p-3 rounded-xl ${
          state === 'open' 
            ? 'bg-red-500/20 border border-red-500/30' 
            : 'bg-green-500/20 border border-green-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {state === 'open' ? (
                <DoorOpen className="w-5 h-5 text-red-400" />
              ) : (
                <DoorClosed className="w-5 h-5 text-green-400" />
              )}
              <span className="text-sm font-medium text-white">Estado</span>
            </div>
            <span className={`text-lg font-bold ${
              state === 'open' ? 'text-red-400' : 'text-green-400'
            }`}>
              {state === 'open' ? 'ABIERTO' : state === 'close' ? 'CERRADO' : '--'}
            </span>
          </div>
        </div>

        {/* Sensores */}
        <div className="space-y-3">
          {/* Temperatura */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/80">Temperatura</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {temperature !== null ? `${temperature.toFixed(1)}°C` : '--'}
            </span>
          </div>

          {/* Batería */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-2">
              <Battery className={`w-4 h-4 ${
                battery && battery < 20 ? 'text-red-400' : 'text-green-400'
              }`} />
              <span className="text-sm text-white/80">Batería</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {battery !== null ? `${battery}%` : '--'}
            </span>
          </div>

          {/* Luminosidad */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/80">Luz</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {lux !== null ? `${lux} lux` : '--'}
            </span>
          </div>

          {/* Iluminación */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/80">Ambiente</span>
            </div>
            <span className="text-sm font-semibold text-white capitalize">
              {illumination || '--'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>shellydw2-7DCA66</span>
            <span>{connected ? '🟢 Online' : '🔴 Offline'}</span>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-4 backdrop-blur-xl bg-black/30 border border-white/10 rounded-xl p-4 text-xs text-white/70">
        <p className="mb-2">🖱️ <strong>Controles:</strong></p>
        <ul className="space-y-1 ml-2">
          <li>• Clic + Arrastrar: Rotar</li>
          <li>• Scroll: Zoom</li>
          <li>• Clic derecho: Pan</li>
        </ul>
      </div>
    </div>
  );
}

