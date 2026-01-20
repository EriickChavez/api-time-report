# 🛠️ Guía : Gestión de Servidores con PM2

Esta guía cubre desde el encendido inicial hasta la configuración de **auto-arranque**, asegurando que tanto tu **API** como tu **Frontend** sobrevivan a fallos y reinicios del servidor.

## Paso 1: Instalación Global

PM2 debe estar disponible en todo el sistema.

```bash
npm install -g pm2

```

---

## Paso 2: Encendido de Aplicaciones

Entra a la carpeta de tu API y ejecuta:

```bash
pm2 start dist/index.js --name "api-time-report"

```

---

## Paso 3: Configuración de "Supervivencia" (Auto-reboot)

Por defecto, si el servidor físico se apaga, PM2 no iniciará solo. Sigue estos pasos para que tu servidor sea 100% autónomo:

1. **Generar el script de sistema:**
   Ejecuta el siguiente comando:

```bash
pm2 startup

```

2. **Ejecutar el comando resultante:**
   PM2 te responderá con una línea de código que empieza con `sudo env PATH...`. **Copia esa línea completa, pégala en tu terminal y dale Enter.**
3. **Guardar el estado actual:**
   Una vez que tus apps estén en `online` y hayas ejecutado el paso anterior, guarda la configuración:

```bash
pm2 save

```

_Esto crea un "archivo de resurrección" que PM2 usará al encender el servidor._

---

## Paso 4: Monitoreo y Mantenimiento (opcional)

### Panel de Control Visual

Para ver el consumo de CPU, memoria y logs en tiempo real de forma elegante:

```bash
pm2 monit

```

### Gestión de Procesos

- **Ver lista:** `pm2 status`
- **Reiniciar tras cambios:** `pm2 restart all` (o el nombre de la app)
- **Ver errores recientes:** `pm2 logs --lines 50`

---

## Paso 5: Ciclo de Actualización de Código

Cuando hagas cambios en tu código, el flujo correcto para no romper nada es:

### En el Backend:

```bash
git pull
npm install
npm run build
pm2 restart api-time-report

```

---

## Resumen de Comandos de Apagado

| Acción                   | Comando               |
| ------------------------ | --------------------- |
| **Pausar temporalmente** | `pm2 stop <nombre>`   |
| **Eliminar de la lista** | `pm2 delete <nombre>` |
| **Apagar todo PM2**      | `pm2 kill`            |
| **Limpiar estadísticas** | `pm2 flush`           |

---
