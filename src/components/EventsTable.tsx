'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { SensorReading } from '@/lib/supabase';
import { DoorOpen, DoorClosed, Battery, Thermometer } from 'lucide-react';

interface EventsTableProps {
  data: SensorReading[];
}

export function EventsTable({ data }: EventsTableProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No hay eventos disponibles
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium">Estado</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium hidden sm:table-cell">Temp</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium hidden md:table-cell">Batería</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium hidden lg:table-cell">Luz</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data.map((reading, index) => (
            <tr 
              key={reading.id || index} 
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              {/* Estado */}
              <td className="py-2 sm:py-3 px-2 sm:px-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  {reading.state === 'open' ? (
                    <>
                      <DoorOpen className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                      <span className="text-red-400 font-medium text-xs sm:text-sm">Abierto</span>
                    </>
                  ) : (
                    <>
                      <DoorClosed className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                      <span className="text-green-400 font-medium text-xs sm:text-sm">Cerrado</span>
                    </>
                  )}
                </div>
              </td>

              {/* Temperatura */}
              <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">
                <div className="flex items-center gap-1 sm:gap-2 text-white">
                  <Thermometer className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    {reading.temperature !== null 
                      ? `${reading.temperature.toFixed(1)}°C`
                      : '--'}
                  </span>
                </div>
              </td>

              {/* Batería */}
              <td className="py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell">
                <div className="flex items-center gap-1 sm:gap-2 text-white">
                  <Battery className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${
                    reading.battery && reading.battery < 20 ? 'text-red-400' : 'text-green-400'
                  }`} />
                  <span className="text-xs sm:text-sm">
                    {reading.battery !== null ? `${reading.battery}%` : '--'}
                  </span>
                </div>
              </td>

              {/* Luz */}
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-white hidden lg:table-cell">
                <span className="text-xs sm:text-sm">
                  {reading.lux !== null ? `${reading.lux} lux` : '--'}
                </span>
              </td>

              {/* Fecha */}
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-400">
                <span className="text-xs sm:text-sm whitespace-nowrap">
                  {format(new Date(reading.timestamp), 'dd/MM HH:mm', { locale: es })}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

