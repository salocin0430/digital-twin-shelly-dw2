# 🏠 Gemelo Digital - Shelly DW2

Visualización 3D en tiempo real del sensor **Shelly Door/Window 2** usando React Three Fiber y MQTT.

## ✨ Características

- 🎨 **Escena 3D Interactiva**: Puerta animada que se abre/cierra en tiempo real
- 📡 **Conexión MQTT**: Recibe datos en vivo del sensor Shelly DW2
- 💡 **Iluminación Reactiva**: La luz de la escena varía según el nivel de lux del sensor
- 📊 **HUD con Glassmorphism**: Panel elegante mostrando estado, temperatura, batería, etc.
- 🎮 **Controles de Cámara**: Rotar, zoom y pan para explorar la escena
- 🔄 **Animaciones Suaves**: Interpolación fluida para movimientos naturales

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

### 3. Abrir en el navegador

Visita [http://localhost:3000](http://localhost:3000)

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

## 🔧 Solución de Problemas

### No se conecta a MQTT

- Verifica tu conexión a internet
- Algunos firewalls corporativos bloquean WebSockets
- Prueba con otro broker: `ws://test.mosquitto.org:8080/mqtt`

### No recibo datos del sensor

- Verifica que el Shelly esté online
- Confirma que MQTT esté habilitado en la configuración
- Abre/cierra el sensor para forzar el envío de datos
- Usa MQTT Explorer para verificar que los mensajes llegan al broker

### La escena 3D no carga

- Verifica que tu navegador soporte WebGL
- Prueba en Chrome/Edge (mejor compatibilidad con Three.js)
- Abre la consola del navegador para ver errores

### Rendimiento lento

- Reduce la calidad de sombras en `Scene.tsx`
- Limita el framerate con `frameloop="demand"` en Canvas
- Desactiva `OrbitControls` si no los necesitas

## 📚 Recursos

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Docs](https://threejs.org/docs/)
- [Shelly API Docs](https://shelly-api-docs.shelly.cloud/gen1/#shelly-door-window-1-2)
- [MQTT.js](https://github.com/mqttjs/MQTT.js)

## 👨‍💻 Autor

Nicolás Ruiz - UPV - INA

## 🎯 Próximas Mejoras

- [ ] Gráficos históricos de temperatura/batería
- [ ] Alertas visuales cuando batería baja
- [ ] Sonidos cuando la puerta se abre
- [ ] Múltiples vistas de cámara predefinidas
- [ ] Modo VR/AR
- [ ] Exportar datos a CSV
- [ ] Dashboard con múltiples sensores

## 📝 Licencia

Proyecto académico - UPV
