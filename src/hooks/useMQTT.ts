'use client';

import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

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

  useEffect(() => {
    // Conectar al broker MQTT vía WebSockets (para navegador)
    const client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt', {
      clientId: `digital-twin-${Math.random().toString(16).slice(2, 10)}`,
      clean: true,
      reconnectPeriod: 5000,
    });

    client.on('connect', () => {
      console.log('✅ Conectado a MQTT broker');
      setConnected(true);
      setError(null);
      
      // Suscribirse al topic del Shelly DW2
      client.subscribe('shellies/upvina/shellydw2-7DCA66/#', (err) => {
        if (err) {
          console.error('Error suscribiendo:', err);
          setError('Error al suscribirse al topic');
        } else {
          console.log('📡 Suscrito a: shellies/upvina/shellydw2-7DCA66/#');
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
      client.end();
    };
  }, []);

  return { sensorData, connected, error };
}

