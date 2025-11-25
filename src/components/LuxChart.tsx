'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { SensorReading } from '@/lib/supabase';

interface LuxChartProps {
  data: SensorReading[];
}

export function LuxChart({ data }: LuxChartProps) {
  // Filtrar datos con valores de lux válidos y ordenar por timestamp
  const chartData = data
    .filter(d => d.lux !== null)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(d => ({
      timestamp: new Date(d.timestamp).getTime(),
      lux: d.lux,
      illumination: d.illumination || 'unknown',
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No hay datos de iluminación disponibles
      </div>
    );
  }

  // Formatear tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(payload[0].payload.timestamp);
      const illumination = payload[0].payload.illumination;
      
      return (
        <div className="bg-black/90 border border-white/20 rounded-lg p-3">
          <p className="text-white font-semibold mb-1">
            {format(date, "d MMM, HH:mm", { locale: es })}
          </p>
          <p className="text-yellow-400 text-lg">
            💡 {payload[0].value} lux
          </p>
          <p className="text-gray-400 text-sm capitalize">
            {illumination === 'dark' ? '🌙 Oscuro' : 
             illumination === 'twilight' ? '🌆 Penumbra' :
             illumination === 'bright' ? '☀️ Luminoso' : '❓ Desconocido'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calcular min y max para el dominio
  const luxValues = chartData.map(d => d.lux).filter((v): v is number => v !== null);
  const minLux = luxValues.length > 0 ? Math.min(...luxValues) : 0;
  const maxLux = luxValues.length > 0 ? Math.max(...luxValues) : 100;
  const padding = (maxLux - minLux) * 0.1 || 10;

  return (
    <ResponsiveContainer width="100%" height={200} className="sm:h-[250px] lg:h-[300px]">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="luxGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#FCD34D" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timestamp) => format(new Date(timestamp), 'HH:mm', { locale: es })}
          stroke="#888"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          domain={[Math.max(0, minLux - padding), maxLux + padding]}
          stroke="#888"
          style={{ fontSize: '12px' }}
          label={{ value: 'Lux', angle: -90, position: 'insideLeft', fill: '#888' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="lux"
          stroke="#FCD34D"
          strokeWidth={2}
          fill="url(#luxGradient)"
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

