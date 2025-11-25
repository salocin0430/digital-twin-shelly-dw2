'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import type { SensorReading } from '@/lib/supabase';

interface BatteryChartProps {
  data: SensorReading[];
}

export function BatteryChart({ data }: BatteryChartProps) {
  // Preparar datos para la gráfica
  const chartData = data
    .filter(reading => reading.battery !== null)
    .map(reading => ({
      time: format(new Date(reading.timestamp), 'dd/MM HH:mm'),
      bateria: reading.battery,
      fullDate: reading.timestamp,
    }))
    .reverse();

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No hay datos de batería disponibles
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
          domain={[0, 100]}
          label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#888' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value: number) => [`${value}%`, 'Batería']}
        />
        <Line 
          type="monotone" 
          dataKey="bateria" 
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ fill: '#22c55e', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

