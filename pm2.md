Para apagar o gestionar tu aplicación en **PM2**, tienes varios comandos dependiendo de lo que quieras lograr (detener temporalmente, borrar de la lista o apagar todo el sistema).

Aquí tienes los comandos clave:

### 1. Detener la aplicación (Stop)

Esto "apaga" el proceso, pero lo mantiene en la lista de PM2 para que puedas iniciarlo después con un simple `start`.

```bash
# Por nombre
pm2 stop api-time-report

# Por ID (el número que sale en 'pm2 status')
pm2 stop 0

# Detener todas las aplicaciones activas
pm2 stop all

```

### 2. Eliminar de la lista (Delete)

Si ya no vas a usar la aplicación y quieres que deje de aparecer en `pm2 status` y libere la memoria por completo:

```bash
pm2 delete api-time-report

```

### 3. Matar el proceso de PM2 por completo (Kill)

Si quieres cerrar **todo** el gestor de PM2 (esto detendrá todas las aplicaciones que estés corriendo bajo PM2 de una vez):

```bash
pm2 kill

```

---

### Tabla de Resumen de Gestión

| Acción        | Comando                | Qué hace exactamente                               |
| ------------- | ---------------------- | -------------------------------------------------- |
| **Pausar**    | `pm2 stop <nombre>`    | Detiene el código, pero el registro sigue ahí.     |
| **Reactivar** | `pm2 start <nombre>`   | Vuelve a encender una app que estaba en `stop`.    |
| **Reiniciar** | `pm2 restart <nombre>` | Apaga y enciende (útil tras actualizar el código). |
| **Eliminar**  | `pm2 delete <nombre>`  | Borra la app de la lista de monitoreo.             |
