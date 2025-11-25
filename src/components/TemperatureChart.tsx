'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import type { SensorReading } from '@/lib/supabase';

interface TemperatureChartProps {
  data: SensorReading[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  // Preparar datos para la gráfica
  const chartData = data
    .filter(reading => reading.temperature !== null)
    .map(reading => ({
      time: format(new Date(reading.timestamp), 'HH:mm'),
      temperatura: reading.temperature,
      fullDate: reading.timestamp,
    }))
    .reverse(); // Mostrar del más antiguo al más reciente

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No hay datos de temperatura disponibles
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="time" 
          stroke="#888"
          tick={{ fill: '#888', fontSize: 12 }}
        />
        <YAxis 
          stroke="#888"
          tick={{ fill: '#888', fontSize: 12 }}
          domain={['auto', 'auto']}
          label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#888' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value: number) => [`${value.toFixed(1)}°C`, 'Temperatura']}
        />
        <Line 
          type="monotone" 
          dataKey="temperatura" 
          stroke="#f97316"
          strokeWidth={2}
          dot={{ fill: '#f97316', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

