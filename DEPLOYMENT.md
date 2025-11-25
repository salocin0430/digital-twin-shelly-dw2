# 🚀 Guía de Despliegue en Vercel

## ✅ Build exitoso
El proyecto está listo para producción.

## 📋 Pasos para desplegar en Vercel

### 1️⃣ Preparar el repositorio

Si aún no has subido los cambios a GitHub:

```bash
cd "/Users/nicolasruiz/Developer/UPV Repos/INA/INA-Tarea-Bloque1"
git add digital-twin/
git commit -m "feat: Digital Twin con Supabase y MQTT - Responsive completo"
git push origin main
```

### 2️⃣ Crear proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Click en **"Add New Project"**
4. Selecciona tu repositorio: `digital-twin-shelly-dw2`
5. **Root Directory**: `digital-twin` ⚠️ IMPORTANTE
6. **Framework Preset**: Next.js (detectado automáticamente)

### 3️⃣ Configurar Variables de Entorno

En la sección **Environment Variables**, añade:

#### **Variables Requeridas:**
```
NEXT_PUBLIC_SUPABASE_URL=https://ribwredcfjwjatimbbpi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYndyZWRjZmp3amF0aW1iYnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjM1MTAsImV4cCI6MjA3OTYzOTUxMH0.I6AoS93lJ-oOvMF2UOg9ZqSUo5dtnBWRPz5ClywY0dk
NEXT_PUBLIC_ADMIN_EMAIL=admin@digitaltwin.local
NEXT_PUBLIC_ADMIN_PASSWORD=shelly2024
```

#### **Variables Opcionales:**
```
MQTT_USE_TCP=false
```

**📝 Nota sobre `MQTT_USE_TCP`:**
- ❌ **NO la agregues en Vercel** (o déjala en `false`)
- ✅ **Vercel usa WSS automáticamente** (WebSocket Secure - funciona en serverless)
- ✅ **Solo úsala en servidores dedicados** (ej: VPS, EC2, DigitalOcean)
- Si en el futuro despliegas en un servidor propio, cámbiala a `true` para usar TCP (más eficiente)

⚠️ **Marca todas como disponibles en:** `Production`, `Preview`, y `Development`

### 4️⃣ Desplegar

1. Click en **"Deploy"**
2. Espera ~2-3 minutos
3. ✅ ¡Listo!

---

## 🌐 Después del despliegue

### URL de tu aplicación
Vercel te dará una URL como:
```
https://digital-twin-shelly-dw2.vercel.app
```

### Credenciales de Login
```
Email: admin@digitaltwin.local
Password: shelly2024
```

---

## 🔌 Protocolos MQTT: TCP vs WSS

### **WebSocket Secure (WSS) - Default**
```
URL: wss://broker.hivemq.com:8884/mqtt
Puerto: 8884
```
✅ **Usar en:**
- Vercel (Serverless)
- Netlify Functions
- AWS Lambda
- Cualquier plataforma serverless

✅ **Ventajas:**
- Funciona en navegadores
- Funciona en serverless
- Atraviesa firewalls fácilmente
- HTTPS compatible

❌ **Desventajas:**
- Overhead de protocolo HTTP
- Ligeramente más lento que TCP puro

---

### **TCP (MQTT nativo)**
```
URL: mqtt://broker.hivemq.com:1883
Puerto: 1883
```
✅ **Usar en:**
- Servidores dedicados (VPS, EC2, DigitalOcean)
- Contenedores Docker
- Servidores on-premise
- Kubernetes

✅ **Ventajas:**
- Más eficiente (menos overhead)
- Protocolo nativo MQTT
- Mejor para conexiones persistentes

❌ **Desventajas:**
- No funciona en navegadores
- Limitaciones en serverless
- Puede ser bloqueado por firewalls

---

### **¿Cuándo cambiar a TCP?**

Si en el futuro migras a un servidor dedicado:

1. Añade la variable de entorno:
   ```
   MQTT_USE_TCP=true
   ```

2. El sistema automáticamente usará:
   ```
   mqtt://broker.hivemq.com:1883 (TCP)
   ```

3. Ventajas:
   - ⚡ 20-30% más rápido
   - 💾 Menor uso de memoria
   - 🔌 Conexión más estable

---

## 🔧 Configuración Post-Despliegue

### 1. Actualizar Configuración del Dispositivo
Una vez desplegado:
1. Inicia sesión en tu app
2. Ve a **Config**
3. Verifica que el broker MQTT esté configurado:
   - Broker: `broker.hivemq.com`
   - Topic: `shellies/upvina/shellydw2-7DCA66`

### 2. Iniciar el Listener del Servidor
1. En la página **Config**
2. Click en **"▶️ Iniciar Listener"**
3. Verifica que el estado cambie a **"Activo"**

⚠️ **IMPORTANTE**: El listener solo funciona mientras el servidor de Vercel esté activo. En el plan gratuito, se apaga después de inactividad.

---

## 📊 Estructura del Deploy

```
Vercel Server
├── Next.js App (SSR)
├── API Routes
│   ├── /api/mqtt/start
│   ├── /api/mqtt/stop
│   └── /api/mqtt/status
└── MQTT Listener (Backend)
    └── Guarda datos en Supabase

Supabase (Siempre activo)
├── Database (PostgreSQL)
│   ├── devices
│   └── sensor_readings
└── Authentication (RLS)

MQTT Broker (Público)
└── broker.hivemq.com
    └── shellies/upvina/shellydw2-7DCA66/#
```

---

## 🎯 Verificar que todo funciona

### ✅ Checklist Post-Despliegue

1. [ ] La app carga correctamente
2. [ ] Login funciona
3. [ ] Gemelo 3D se renderiza
4. [ ] MQTT se conecta (punto verde)
5. [ ] HUD muestra datos
6. [ ] Dashboard muestra gráficas
7. [ ] Tabla de eventos tiene datos
8. [ ] Config muestra configuración
9. [ ] Listener se puede iniciar
10. [ ] Datos se guardan en Supabase

---

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que las variables de entorno estén configuradas en Vercel
- Redeploy el proyecto después de añadir las variables

### MQTT no se conecta
- Verifica el broker en Config
- Asegúrate que sea WebSocket: `ws://broker.hivemq.com:8000/mqtt` (cliente)
- Para servidor: `mqtt://broker.hivemq.com:1883` (TCP)

### Listener no inicia
- Es normal en despliegues serverless
- Solo funciona mientras hay actividad en el servidor
- Considera usar un servidor dedicado para 24/7

### Gráficas vacías
1. Ve a Config
2. Inicia el Listener
3. Espera a que el sensor envíe datos
4. O ejecuta `simular_sensor.py` localmente

---

## 🔄 Actualizar el Deploy

Cada vez que hagas cambios:

```bash
git add .
git commit -m "descripción del cambio"
git push origin main
```

Vercel detectará automáticamente y re-desplegará.

---

## 💡 Tips para Producción

### Optimización
- ✅ Build optimizado automáticamente por Vercel
- ✅ Imágenes optimizadas con Next.js Image
- ✅ Code splitting automático
- ✅ Compresión Gzip/Brotli

### Seguridad
- 🔒 HTTPS automático
- 🔒 Credenciales en variables de entorno
- 🔒 RLS habilitado en Supabase

### Monitoreo
- Ver logs en Vercel Dashboard
- Ver analytics en Vercel
- Ver queries en Supabase Dashboard

---

## 📱 Testing Responsive

Una vez desplegado, prueba en:
- 📱 iPhone (Safari)
- 📱 Android (Chrome)
- 💻 Desktop (Chrome, Firefox, Safari)
- 📱 iPad

---

¡Tu Digital Twin está listo para producción! 🚀

