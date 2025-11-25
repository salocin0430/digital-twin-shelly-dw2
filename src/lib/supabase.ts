'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para las tablas
export interface Device {
  id: string;
  device_id: string;
  name: string;
  mqtt_broker: string;
  mqtt_topic: string;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface SensorReading {
  id: string;
  device_id: string;
  state: 'open' | 'close' | null;
  battery: number | null;
  temperature: number | null;
  lux: number | null;
  illumination: 'dark' | 'bright' | null;
  tilt: number | null;
  vibration: number | null;
  online: boolean;
  timestamp: string;
  created_at: string;
}

