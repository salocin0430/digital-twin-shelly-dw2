# 🏠 Gemelo Digital - Shelly DW2

Visualización 3D en tiempo real del sensor **Shelly Door/Window 2** usando React Three Fiber, MQTT y Supabase.

## ✨ Características

### 🎨 **Gemelo Digital 3D**
- Escena 3D interactiva con puerta animada en tiempo real
- Iluminación reactiva según nivel de lux del sensor
- HUD elegante con glassmorphism mostrando datos en vivo
- Controles de cámara (rotar, zoom, pan)
- Animaciones suaves y fluidas
- 📱 **100% Responsive** (móvil, tablet, desktop)

### 📊 **Dashboard de Métricas**
- Gráfica de temperatura (24h)
- Gráfica de batería (7 días)
- Gráfica de iluminación (24h)
- KPIs en tiempo real (aperturas, batería, temperatura)
- Tabla de eventos históricos
- Estado actual prominente (ABIERTO/CERRADO)
- Actualización en tiempo real vía MQTT

### 🗄️ **Persistencia de Datos**
- Base de datos PostgreSQL (Supabase)
- Almacenamiento de lecturas históricas
- Configuración de dispositivos
- Backend listener 24/7 para guardar datos automáticamente
- Carga de último estado al iniciar

### 🔐 **Autenticación**
- Sistema de login simple
- Rutas protegidas
- Credenciales configurables

### ⚙️ **Configuración Dinámica**
- Editor de configuración de dispositivos
- Control del listener MQTT del servidor
- Actualización en tiempo real de broker/topic

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
cd digital-twin
npm install
```

### 2. Configurar Supabase

Crea un archivo `.env.local` con tus credenciales de Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=admin@digitaltwin.local
NEXT_PUBLIC_ADMIN_PASSWORD=shelly2024
```

Ver instrucciones detalladas en [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

### 3. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

### 4. Abrir en el navegador

Visita [http://localhost:3000](http://localhost:3000)

**Credenciales de login:**
- Email: `admin@digitaltwin.local`
- Password: `shelly2024`

## 📡 Configuración MQTT

El gemelo digital se conecta automáticamente a:

- **Broker**: `ws://broker.hivemq.com:8000/mqtt` (WebSocket)
- **Topic**: `shellies/upvina/shellydw2-7DCA66/#`

### ⚙️ Configurar tu Shelly DW2

1. Accede a la interfaz web del Shelly (http://192.168.1.x)
2. Ve a **Settings → MQTT**
3. Configura:
   - **Enable MQTT**: ✅
   - **Server**: `broker.hivemq.com:1883`
   - **Custom Prefix**: (dejar vacío, usa el ID del dispositivo)

## 🎮 Controles

- **Clic + Arrastrar**: Rotar cámara
- **Scroll**: Zoom in/out
- **Clic derecho + Arrastrar**: Pan (mover cámara)

## 🧩 Estructura del Proyecto

```
digital-twin/
├── src/
│   ├── app/
│   │   └── page.tsx          # Página principal
│   ├── components/
│   │   ├── Door.tsx          # Componente de puerta animada
│   │   ├── DoorFrame.tsx     # Marco de puerta
│   │   ├── Floor.tsx         # Suelo de la escena
│   │   ├── Scene.tsx         # Escena 3D completa
│   │   └── HUD.tsx           # Interfaz de usuario overlay
│   └── hooks/
│       └── useMQTT.ts        # Hook para conexión MQTT
```

## 📊 Datos del Sensor

El gemelo digital recibe y visualiza:

| Dato | Topic MQTT | Visualización |
|------|------------|---------------|
| Estado puerta | `sensor/state` | Animación de apertura 3D |
| Batería | `sensor/battery` | Porcentaje en HUD |
| Temperatura | `sensor/temperature` | Grados Celsius en HUD |
| Luminosidad | `sensor/lux` | Intensidad de luz 3D |
| Iluminación | `sensor/illumination` | Ambiente (dark/bright) |
| Online | `online` | Indicador de conexión |

## 🧪 Pruebas sin Sensor Real

Si no tienes el Shelly DW2 conectado, puedes simular datos:

### Opción 1: Usar el script Python de publicación

```bash
cd ../
source venv/bin/activate
python publicar_test.py
```

### Opción 2: Usar MQTT Explorer

1. Descargar [MQTT Explorer](http://mqtt-explorer.com/)
2. Conectar a `broker.hivemq.com:1883`
3. Publicar manualmente en topics como:
   - `shellies/upvina/shellydw2-7DCA66/sensor/state` → `open` o `close`
   - `shellies/upvina/shellydw2-7DCA66/sensor/battery` → `85`
   - `shellies/upvina/shellydw2-7DCA66/sensor/temperature` → `22.5`

## 🎨 Características Visuales

### Animaciones

- **Puerta**: Rotación suave de 0° a 90° cuando se abre
- **Iluminación**: Intensidad variable según lux (0-500)
- **Color de puerta**: Verde cuando cerrada, rojo cuando abierta
- **Punto de luz**: Cambia de color según estado

### Efectos

- **Sombras**: Sombras dinámicas en tiempo real
- **Niebla**: Profundidad atmosférica
- **Glassmorphism**: Panel HUD con desenfoque de fondo
- **Metalness & Roughness**: Materiales realistas

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **3D**: React Three Fiber + Three.js
- **Utils 3D**: @react-three/drei
- **MQTT**: mqtt.js (WebSocket)
- **Estilos**: Tailwind CSS 4
- **Iconos**: Lucide React
- **Animaciones**: Framer Motion
- **Lenguaje**: TypeScript

## 🚢 Despliegue en Vercel

El proyecto está listo para producción. Ver instrucciones completas en [`DEPLOYMENT.md`](./DEPLOYMENT.md)

```bash
# Verificar que el build funciona
npm run build

# Desplegar en Vercel
vercel --prod
```

**Variables de entorno requeridas en Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_EMAIL`
- `NEXT_PUBLIC_ADMIN_PASSWORD`

## 🔧 Solución de Problemas

### No se conecta a MQTT
- Verifica tu conexión a internet
- Algunos firewalls corporativos bloquean WebSockets
- Ve a `/config` y verifica el broker configurado

### No recibo datos del sensor
- Verifica que el Shelly esté online
- Confirma que MQTT esté habilitado en la configuración del Shelly
- Abre/cierra el sensor para forzar el envío de datos
- Usa MQTT Explorer para verificar que los mensajes llegan al broker
- Ve a `/config` e inicia el **Listener del Servidor**

### Dashboard no muestra datos
- Verifica que hay datos en Supabase (ve a la tabla `sensor_readings`)
- Inicia el listener del servidor en `/config`
- Abre/cierra el sensor para generar datos
- O ejecuta el simulador: `python3 simular_sensor.py`

### La escena 3D no carga
- Verifica que tu navegador soporte WebGL
- Prueba en Chrome/Edge (mejor compatibilidad con Three.js)
- Abre la consola del navegador para ver errores
- Limpia caché y recarga (Cmd+Shift+R / Ctrl+Shift+R)

### Error "Missing Supabase environment variables"
- Verifica que `.env.local` existe y tiene las variables correctas
- Reinicia el servidor de desarrollo después de crear `.env.local`

## 📚 Recursos

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Docs](https://threejs.org/docs/)
- [Shelly API Docs](https://shelly-api-docs.shelly.cloud/gen1/#shelly-door-window-1-2)
- [MQTT.js](https://github.com/mqttjs/MQTT.js)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

## 👨‍💻 Autor

Nicolás Ruiz - UPV - INA

## ✅ Estado del Proyecto

- [x] Gemelo 3D interactivo
- [x] Conexión MQTT en tiempo real
- [x] Dashboard de métricas
- [x] Persistencia en Supabase
- [x] Autenticación
- [x] Backend listener 24/7
- [x] Responsive design completo
- [x] Build optimizado para producción
- [x] Listo para Vercel

## 🎯 Próximas Mejoras

- [ ] Alertas push cuando la puerta se abre
- [ ] Exportar datos históricos a CSV
- [ ] Soporte para múltiples sensores
- [ ] Dashboard analytics avanzado
- [ ] Modo oscuro/claro
- [ ] Notificaciones de batería baja
- [ ] Integración con Alexa/Google Home
- [ ] API REST para terceros

## 📝 Licencia

Proyecto académico - Universidad Politécnica de Valencia (UPV)
