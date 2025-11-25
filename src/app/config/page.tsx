'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useSupabase } from '@/hooks/useSupabase';
import type { Device } from '@/lib/supabase';
import { Save, Loader2, CheckCircle, XCircle } from 'lucide-react';

function ConfigContent() {
  const { getDevice, updateDevice } = useSupabase();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [listenerStatus, setListenerStatus] = useState<{ connected: boolean, isConnecting: boolean } | null>(null);
  const [startingListener, setStartingListener] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    device_id: '',
    name: '',
    mqtt_broker: '',
    mqtt_topic: '',
    location: '',
  });

  useEffect(() => {
    loadDevice();
    checkListenerStatus();
    
    // Verificar estado cada 30 segundos (reducido de 10s para evitar interferencias)
    const interval = setInterval(checkListenerStatus, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const checkListenerStatus = async () => {
    try {
      const response = await fetch('/api/mqtt/status', {
        cache: 'no-store', // Evitar caché
      });
      const status = await response.json();
      setListenerStatus(status);
    } catch (error) {
      console.error('Error checking listener status:', error);
    }
  };

  const startListener = async () => {
    setStartingListener(true);
    try {
      const response = await fetch('/api/mqtt/start', { 
        method: 'POST',
        cache: 'no-store',
      });
      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Listener MQTT iniciado en el servidor' });
        // Esperar un poco antes de verificar el estado
        setTimeout(() => checkListenerStatus(), 1000);
      } else {
        setMessage({ type: 'error', text: '❌ Error al iniciar el listener' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error de conexión' });
    } finally {
      setStartingListener(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const stopListener = async () => {
    try {
      const response = await fetch('/api/mqtt/stop', { 
        method: 'POST',
        cache: 'no-store',
      });
      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: '🛑 Listener MQTT detenido' });
        setTimeout(() => checkListenerStatus(), 1000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error al detener el listener' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const loadDevice = async () => {
    setLoading(true);
    const deviceData = await getDevice('shellydw2-7DCA66');
    if (deviceData) {
      setDevice(deviceData);
      setFormData({
        device_id: deviceData.device_id,
        name: deviceData.name,
        mqtt_broker: deviceData.mqtt_broker,
        mqtt_topic: deviceData.mqtt_topic,
        location: deviceData.location || '',
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const success = await updateDevice('shellydw2-7DCA66', {
      name: formData.name,
      mqtt_broker: formData.mqtt_broker,
      mqtt_topic: formData.mqtt_topic,
      location: formData.location,
    });

    setSaving(false);

    if (success) {
      setMessage({ type: 'success', text: '✅ Configuración guardada correctamente' });
      loadDevice(); // Recargar datos
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: '❌ Error al guardar la configuración' });
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-900 text-white p-4 sm:p-6 pt-20 sm:pt-24">
      <Navbar />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">⚙️ Configuración del Dispositivo</h1>
          <p className="text-sm sm:text-base text-gray-400">Edita la configuración del sensor Shelly DW2</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Device ID (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Device ID
              </label>
              <input
                type="text"
                value={formData.device_id}
                disabled
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">⚠️ Este campo no se puede modificar</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre del Dispositivo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Sensor Puerta Principal"
                required
              />
            </div>

            {/* MQTT Broker */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Broker MQTT
              </label>
              <input
                type="text"
                value={formData.mqtt_broker}
                onChange={(e) => setFormData({ ...formData, mqtt_broker: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: broker.hivemq.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Servidor MQTT al que se conecta el dispositivo
              </p>
            </div>

            {/* MQTT Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Topic MQTT
              </label>
              <input
                type="text"
                value={formData.mqtt_topic}
                onChange={(e) => setFormData({ ...formData, mqtt_topic: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: shellies/upvina/shellydw2-7DCA66"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Topic base para suscribirse a los mensajes del sensor
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Entrada casa, Puerta principal"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Guardar Configuración
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* MQTT Server Listener Control */}
        <div className="mt-4 sm:mt-6 backdrop-blur-xl bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-purple-400 mb-2">🖥️ Listener del Servidor</h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Guarda datos automáticamente en segundo plano, sin necesidad de tener la app abierta
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {listenerStatus?.connected ? (
                <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Activo
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full text-gray-400 text-sm">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Inactivo
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={startListener}
              disabled={startingListener || listenerStatus?.connected}
              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {startingListener ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Iniciando...</span>
                </>
              ) : (
                <>
                  <span>▶️ Iniciar Listener</span>
                </>
              )}
            </button>
            <button
              onClick={stopListener}
              disabled={!listenerStatus?.connected}
              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>⏹️ Detener Listener</span>
            </button>
            <button
              onClick={checkListenerStatus}
              className="px-3 sm:px-4 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors"
              title="Actualizar estado"
            >
              🔄
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <p>• El listener corre en el servidor Next.js</p>
            <p>• Guarda datos automáticamente cada vez que cambia el estado</p>
            <p>• Funciona 24/7 mientras el servidor esté corriendo</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-4 sm:mt-6 backdrop-blur-xl bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-blue-400">ℹ️ Información</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
            <li>• Los cambios se aplicarán inmediatamente al guardar</li>
            <li>• El broker MQTT debe ser accesible públicamente</li>
            <li>• El topic debe coincidir con la configuración del Shelly</li>
            <li>• Recarga la página del gemelo 3D después de cambiar la configuración</li>
          </ul>
        </div>

        {/* Device Info */}
        {device && (
          <div className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3">📊 Información del Dispositivo</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Creado</p>
                <p className="text-white">{new Date(device.created_at).toLocaleString('es-ES')}</p>
              </div>
              <div>
                <p className="text-gray-400">Última actualización</p>
                <p className="text-white">{new Date(device.updated_at).toLocaleString('es-ES')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfigPage() {
  return (
    <ProtectedRoute>
      <ConfigContent />
    </ProtectedRoute>
  );
}

