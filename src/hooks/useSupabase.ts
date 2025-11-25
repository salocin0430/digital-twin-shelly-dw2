'use client';

import { useState, useEffect } from 'react';
import { supabase, type Device, type SensorReading } from '@/lib/supabase';

export function useSupabase() {
  // Obtener configuración del dispositivo
  const getDevice = async (deviceId: string): Promise<Device | null> => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('device_id', deviceId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching device:', error);
      return null;
    }
  };

  // Obtener última lectura del sensor
  const getLatestReading = async (deviceId: string): Promise<SensorReading | null> => {
    try {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .eq('device_id', deviceId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching latest reading:', error);
      return null;
    }
  };

  // Guardar nueva lectura
  const saveReading = async (reading: Omit<SensorReading, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sensor_readings')
        .insert(reading);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving reading:', error);
      return false;
    }
  };

  // Obtener lecturas históricas
  const getReadings = async (
    deviceId: string,
    limit: number = 50,
    hoursAgo: number = 24
  ): Promise<SensorReading[]> => {
    try {
      const since = new Date();
      since.setHours(since.getHours() - hoursAgo);

      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .eq('device_id', deviceId)
        .gte('timestamp', since.toISOString())
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching readings:', error);
      return [];
    }
  };

  // Actualizar configuración del dispositivo
  const updateDevice = async (
    deviceId: string,
    updates: {
      name?: string;
      mqtt_broker?: string;
      mqtt_topic?: string;
      location?: string;
    }
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('devices')
        .update(updates)
        .eq('device_id', deviceId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating device:', error);
      return false;
    }
  };

  return {
    getDevice,
    getLatestReading,
    saveReading,
    getReadings,
    updateDevice,
  };
}

