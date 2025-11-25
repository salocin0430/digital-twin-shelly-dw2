# 🗄️ Configuración de Supabase

## 📋 PASO 1: Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Click en **"Start your project"**
3. Sign in con GitHub (o email)
4. Click en **"New Project"**
5. Rellena:
   - **Name**: `digital-twin-shelly` (o el que quieras)
   - **Database Password**: Guarda bien esta password (la necesitarás)
   - **Region**: Elige el más cercano (Europe West para España)
6. Click **"Create new project"**
7. ⏳ Espera 2-3 minutos mientras se crea

---

## 📋 PASO 2: Obtener las API Keys

1. En tu proyecto de Supabase, ve a:
   **Settings** (⚙️ abajo izquierda) → **API**

2. Copia estos dos valores:
   - **Project URL** (algo como: `https://xxxxxxxxxxx.supabase.co`)
   - **anon public** key (una clave larga que empieza con `eyJ...`)

3. **GUÁRDALOS** (los necesitarás en el siguiente paso)

---

## 📋 PASO 3: Configurar Variables de Entorno

1. En la carpeta `digital-twin/`, crea un archivo llamado `.env.local`

2. Pega esto dentro (reemplaza con tus valores):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ.....tu_clave_aqui

# Usuario hardcoded para login simple
NEXT_PUBLIC_ADMIN_EMAIL=admin@digitaltwin.local
NEXT_PUBLIC_ADMIN_PASSWORD=shelly2024
```

3. Guarda el archivo

---

## 📋 PASO 4: Crear las Tablas en Supabase

1. En Supabase, ve a:
   **SQL Editor** (en el menú izquierdo)

2. Click en **"New Query"**

3. Abre el archivo `supabase-setup.sql` de este proyecto

4. **Copia TODO el contenido** del archivo

5. **Pégalo** en el SQL Editor de Supabase

6. Click en **"Run"** (o presiona Ctrl+Enter)

7. ✅ Deberías ver: `Success. No rows returned`

8. Para verificar, ejecuta esta query:
   ```sql
   SELECT * FROM devices;
   ```
   Deberías ver 1 dispositivo (`shellydw2-7DCA66`)

---

## 📋 PASO 5: Verificar que Todo Funciona

1. En Supabase, ve a **Table Editor**

2. Deberías ver 2 tablas:
   - ✅ **devices** (1 fila)
   - ✅ **sensor_readings** (5 filas de prueba)

3. Click en cada tabla para ver los datos

---

## ✅ CHECKLIST

Marca cuando completes cada paso:

- [ ] Proyecto creado en Supabase
- [ ] API Keys copiadas
- [ ] Archivo `.env.local` creado con las keys
- [ ] SQL ejecutado en Supabase
- [ ] Tablas creadas y verificadas
- [ ] Datos de prueba insertados

---

## 🆘 Problemas Comunes

### "Error: relation does not exist"
- Asegúrate de ejecutar TODO el SQL del archivo `supabase-setup.sql`

### "Invalid API Key"
- Verifica que copiaste la **anon public** key correcta
- Verifica que no haya espacios extra al copiar

### "Connection refused"
- Espera unos minutos, el proyecto puede estar inicializándose

---

## 📞 Siguiente Paso

Una vez completado esto, avísame y continuamos con:
- ✅ **Paso completado**: Supabase configurado
- 🔜 **Siguiente**: Crear cliente de Supabase en el código

---

¿Algún problema? Avísame en qué paso te quedaste y te ayudo! 🚀

