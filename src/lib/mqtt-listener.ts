// MQTT Listener para servidor (Node.js)
// Este archivo se ejecuta en el servidor, no en el navegador

import mqtt from 'mqtt';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente global para mantener la conexión
let mqttClient: mqtt.MqttClient | null = null;
let isConnecting = false;

// Buffer para acumular datos antes de guardar
interface SensorDataBuffer {
  state: string | null;
  battery: number | null;
  temperature: number | null;
  lux: number | null;
  illumination: string | null;
  tilt: number | null;
  vibration: number | null;
  online: boolean;
  lastUpdate: Date;
}

let dataBuffer: SensorDataBuffer = {
  state: null,
  battery: null,
  temperature: null,
  lux: null,
  illumination: null,
  tilt: null,
  vibration: null,
  online: false,
  lastUpdate: new Date(),
};

let saveTimeout: NodeJS.Timeout | null = null;

export async function startMQTTListener() {
  if (mqttClient?.connected) {
    console.log('✅ MQTT listener ya está activo');
    return { success: true, message: 'Already connected' };
  }

  if (isConnecting) {
    console.log('⏳ Conexión MQTT en progreso...');
    return { success: true, message: 'Connection in progress' };
  }

  isConnecting = true;

  try {
    // Cargar configuración desde Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: device } = await supabase
      .from('devices')
      .select('*')
      .eq('device_id', 'shellydw2-7DCA66')
      .single();

    const broker = device?.mqtt_broker || 'broker.hivemq.com';
    const topicBase = device?.mqtt_topic || 'shellies/upvina/shellydw2-7DCA66';

    console.log('🔌 Iniciando MQTT Listener del servidor...');
    console.log(`   Broker: ${broker}`);
    console.log(`   Topic: ${topicBase}`);

    // Determinar protocolo según variable de entorno
    // Si MQTT_USE_TCP=true, usar TCP (para servidores dedicados)
    // Si no existe o es false, usar WSS (para Vercel/serverless)
    const useTCP = process.env.MQTT_USE_TCP === 'true';
    const brokerUrl = useTCP 
      ? `mqtt://${broker}:1883`        // TCP - Servidores dedicados
      : `wss://${broker}:8884/mqtt`;   // WSS - Vercel/Serverless
    
    console.log(`   Protocolo: ${useTCP ? 'TCP' : 'WebSocket Secure (WSS)'}`);
    console.log(`   URL: ${brokerUrl}`);
    
    mqttClient = mqtt.connect(brokerUrl, {
      clientId: `server-listener-${Math.random().toString(16).slice(2, 10)}`,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 10000, // 10 segundos de timeout
    });

    mqttClient.on('connect', () => {
      console.log('✅ Servidor conectado a MQTT broker');
      
      // Suscribirse al topic
      mqttClient!.subscribe(`${topicBase}/#`, (err) => {
        if (err) {
          console.error('❌ Error suscribiendo:', err);
        } else {
          console.log(`📡 Servidor suscrito a: ${topicBase}/#`);
        }
      });
    });

    mqttClient.on('message', async (topic: string, payload: Buffer) => {
      const message = payload.toString();
      
      // Actualizar buffer según el topic
      if (topic.includes('sensor/state')) {
        dataBuffer.state = message;
      } else if (topic.includes('sensor/battery')) {
        dataBuffer.battery = parseInt(message);
      } else if (topic.includes('sensor/temperature')) {
        dataBuffer.temperature = parseFloat(message);
      } else if (topic.includes('sensor/lux')) {
        dataBuffer.lux = parseInt(message);
      } else if (topic.includes('sensor/illumination')) {
        dataBuffer.illumination = message;
      } else if (topic.includes('sensor/tilt')) {
        dataBuffer.tilt = parseInt(message);
      } else if (topic.includes('sensor/vibration')) {
        dataBuffer.vibration = parseInt(message);
      } else if (topic.includes('online')) {
        dataBuffer.online = message === 'true';
      }

      dataBuffer.lastUpdate = new Date();

      // Cancelar timeout anterior y crear uno nuevo
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Guardar después de 2 segundos de inactividad (debounce)
      saveTimeout = setTimeout(async () => {
        await saveToDatabase();
      }, 2000);
    });

    mqttClient.on('error', (err) => {
      console.error('❌ Error MQTT servidor:', err);
    });

    mqttClient.on('disconnect', () => {
      console.log('🔌 Servidor desconectado de MQTT');
    });

    isConnecting = false;
    return { success: true, message: 'MQTT listener started' };
  } catch (error) {
    console.error('❌ Error iniciando MQTT listener:', error);
    isConnecting = false;
    return { success: false, message: 'Failed to start listener' };
  }
}

async function saveToDatabase() {
  if (!dataBuffer.state) {
    console.log('⏭️ No hay datos completos para guardar');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const reading = {
      device_id: 'shellydw2-7DCA66',
      state: dataBuffer.state,
      battery: dataBuffer.battery,
      temperature: dataBuffer.temperature,
      lux: dataBuffer.lux,
      illumination: dataBuffer.illumination,
      tilt: dataBuffer.tilt,
      vibration: dataBuffer.vibration,
      online: dataBuffer.online,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('sensor_readings')
      .insert(reading);

    if (error) {
      console.error('❌ Error guardando en BD:', error);
    } else {
      console.log('💾 Servidor guardó lectura:', {
        estado: reading.state,
        temperatura: reading.temperature,
        bateria: reading.battery,
      });
    }
  } catch (error) {
    console.error('❌ Error en saveToDatabase:', error);
  }
}

export function stopMQTTListener() {
  if (mqttClient) {
    console.log('🛑 Deteniendo MQTT listener del servidor...');
    mqttClient.end();
    mqttClient = null;
  }
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }
  return { success: true, message: 'MQTT listener stopped' };
}

export function getMQTTStatus() {
  return {
    connected: mqttClient?.connected || false,
    isConnecting,
  };
}

