-- ============================================
-- GEMELO DIGITAL SHELLY DW2 - DATABASE SETUP
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- Dashboard → SQL Editor → New Query → Pega esto → Run
-- ============================================

-- Tabla 1: Dispositivos (Configuración)
CREATE TABLE IF NOT EXISTS devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    mqtt_broker TEXT NOT NULL,
    mqtt_topic TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 2: Lecturas del sensor (Histórico)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id TEXT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    state TEXT CHECK (state IN ('open', 'close')),
    battery INTEGER CHECK (battery >= 0 AND battery <= 100),
    temperature FLOAT,
    lux INTEGER,
    illumination TEXT CHECK (illumination IN ('dark', 'bright')),
    tilt INTEGER,
    vibration INTEGER,
    online BOOLEAN DEFAULT true,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_device_id ON sensor_readings(device_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_state ON sensor_readings(state);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en devices
CREATE TRIGGER update_devices_updated_at
    BEFORE UPDATE ON devices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar dispositivo de prueba
INSERT INTO devices (device_id, name, mqtt_broker, mqtt_topic, location)
VALUES (
    'shellydw2-7DCA66',
    'Sensor Puerta Principal',
    'broker.hivemq.com',
    'shellies/upvina/shellydw2-7DCA66',
    'Entrada casa'
)
ON CONFLICT (device_id) DO NOTHING;

-- Insertar algunos datos de prueba (opcional)
INSERT INTO sensor_readings (device_id, state, battery, temperature, lux, illumination, tilt, vibration, online, timestamp)
VALUES 
    ('shellydw2-7DCA66', 'close', 93, 25.9, 31, 'dark', -1, -1, true, NOW() - INTERVAL '1 hour'),
    ('shellydw2-7DCA66', 'open', 93, 25.8, 30, 'dark', 5, 2, true, NOW() - INTERVAL '50 minutes'),
    ('shellydw2-7DCA66', 'close', 93, 25.7, 29, 'dark', -1, -1, true, NOW() - INTERVAL '40 minutes'),
    ('shellydw2-7DCA66', 'open', 92, 26.1, 150, 'bright', 8, 3, true, NOW() - INTERVAL '30 minutes'),
    ('shellydw2-7DCA66', 'close', 92, 26.0, 145, 'bright', -1, -1, true, NOW() - INTERVAL '20 minutes')
ON CONFLICT DO NOTHING;

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
-- ============================================
-- Por ahora desactivamos RLS para simplificar (proyecto universitario)
ALTER TABLE devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings DISABLE ROW LEVEL SECURITY;

-- Si quieres activar RLS más adelante (más seguro):
-- ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Enable read access for all users" ON devices FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for all users" ON sensor_readings FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for all users" ON sensor_readings FOR INSERT WITH CHECK (true);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Verifica que todo se creó correctamente:

SELECT 'Devices table' as table_name, COUNT(*) as rows FROM devices
UNION ALL
SELECT 'Sensor readings table', COUNT(*) FROM sensor_readings;

-- Deberías ver:
-- Devices table: 1 row
-- Sensor readings table: 5 rows (o 0 si no insertaste datos de prueba)

