'use client';

import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { supabase } from '@/lib/supabase';

export interface SensorData {
  state: 'open' | 'close' | null;
  battery: number | null;
  temperature: number | null;
  lux: number | null;
  illumination: string | null;
  tilt: number | null;
  vibration: number | null;
  online: boolean;
}

// Configuración por defecto (fallback)
const DEFAULT_CONFIG = {
  broker: 'ws://broker.hivemq.com:8000/mqtt',
  topic: 'shellies/upvina/shellydw2-7DCA66/#',
  deviceId: 'shellydw2-7DCA66',
};

export function useMQTT() {
  const [sensorData, setSensorData] = useState<SensorData>({
    state: null,
    battery: null,
    temperature: null,
    lux: null,
    illumination: null,
    tilt: null,
    vibration: null,
    online: false,
  });
  
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<typeof DEFAULT_CONFIG | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Cargar configuración desde Supabase (solo una vez)
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('devices')
          .select('*')
          .eq('device_id', DEFAULT_CONFIG.deviceId)
          .single();

        if (error) throw error;

        if (data) {
          const mqttBroker = data.mqtt_broker || 'broker.hivemq.com';
          const mqttTopic = data.mqtt_topic || DEFAULT_CONFIG.topic.replace('/#', '');
          
          const newConfig = {
            broker: `ws://${mqttBroker}:8000/mqtt`,
            topic: `${mqttTopic}/#`,
            deviceId: data.device_id,
          };
          
          setConfig(newConfig);
          console.log('⚙️ Configuración cargada desde BD:', {
            broker: mqttBroker,
            topic: mqttTopic,
          });
        } else {
          setConfig(DEFAULT_CONFIG);
        }
      } catch (err) {
        console.warn('⚠️ Error cargando config, usando valores por defecto:', err);
        setConfig(DEFAULT_CONFIG);
      } finally {
        setConfigLoaded(true);
      }
    };

    loadConfig();
  }, []); // Solo ejecutar una vez

  // Conectar al MQTT solo cuando la configuración esté lista
  useEffect(() => {
    if (!configLoaded || !config) {
      console.log('⏳ Esperando configuración...');
      return;
    }

    console.log('🔌 Iniciando conexión MQTT con:', config);

    // Conectar al broker MQTT vía WebSockets (para navegador)
    const client = mqtt.connect(config.broker, {
      clientId: `digital-twin-${Math.random().toString(16).slice(2, 10)}`,
      clean: true,
      reconnectPeriod: 5000,
    });

    client.on('connect', () => {
      console.log('✅ Conectado a MQTT broker:', config.broker);
      setConnected(true);
      setError(null);
      
      // Suscribirse al topic del Shelly DW2
      client.subscribe(config.topic, (err) => {
        if (err) {
          console.error('❌ Error suscribiendo:', err);
          setError('Error al suscribirse al topic');
        } else {
          console.log('📡 Suscrito correctamente a:', config.topic);
        }
      });
    });

    client.on('message', (topic, payload) => {
      try {
        const message = payload.toString();
        console.log(`📩 ${topic}: ${message}`);

        // Parsear según el topic
        if (topic.includes('sensor/state')) {
          setSensorData(prev => ({ ...prev, state: message as 'open' | 'close' }));
        } else if (topic.includes('sensor/battery')) {
          setSensorData(prev => ({ ...prev, battery: parseInt(message) }));
        } else if (topic.includes('sensor/temperature')) {
          setSensorData(prev => ({ ...prev, temperature: parseFloat(message) }));
        } else if (topic.includes('sensor/lux')) {
          setSensorData(prev => ({ ...prev, lux: parseInt(message) }));
        } else if (topic.includes('sensor/illumination')) {
          setSensorData(prev => ({ ...prev, illumination: message }));
        } else if (topic.includes('sensor/tilt')) {
          setSensorData(prev => ({ ...prev, tilt: parseInt(message) }));
        } else if (topic.includes('sensor/vibration')) {
          setSensorData(prev => ({ ...prev, vibration: parseInt(message) }));
        } else if (topic.includes('online')) {
          setSensorData(prev => ({ ...prev, online: message === 'true' }));
        }
      } catch (err) {
        console.error('Error procesando mensaje:', err);
      }
    });

    client.on('error', (err) => {
      console.error('❌ Error MQTT:', err);
      setError(err.message);
      setConnected(false);
    });

    client.on('disconnect', () => {
      console.log('🔌 Desconectado de MQTT');
      setConnected(false);
    });

    client.on('reconnect', () => {
      console.log('🔄 Reconectando...');
    });

    // Cleanup
    return () => {
      console.log('🔌 Desconectando cliente MQTT...');
      client.end();
    };
  }, [configLoaded, config]); // Reconectar solo cuando config esté lista

  return { sensorData, connected, error, config: config || DEFAULT_CONFIG };
}

