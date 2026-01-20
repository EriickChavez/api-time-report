# 🚀 Guía de Despliegue de Producción: API Time Report

Esta guía detalla los pasos para transformar tu entorno de desarrollo en una infraestructura de producción estable, segura y siempre activa.

## 1. Preparación del Entorno (Multiplataforma)

Independientemente del sistema operativo, asegúrate de tener instalado:

- **Node.js** (LTS recomendado v18 o superior)
- **npm** (viene con Node)
- **Git**

---

## 2. Configuración del Proyecto

### 2.1 Variables de Entorno

Crea un archivo `.env` en la raíz del servidor (este archivo **nunca** se sube a GitHub).

```env
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=time_report
JWT_SECRET=una_clave_muy_segura_y_larga
NODE_ENV=production

```

### 2.2 Compilación (Build)

Node.js no entiende TypeScript de forma nativa en producción. Debes convertirlo a JavaScript:

```bash
# Instalar dependencias
npm install

# Generar la carpeta /dist
npm run build

```

---

## 3. Mantener el Servidor Siempre Activo (PM2)

En producción, si el servidor falla o se reinicia la máquina, tu API se detendría. Usaremos **PM2**, un gestor de procesos que reinicia la app automáticamente ante cualquier fallo.

### Instalación

```bash
npm install -g pm2

```

### Comandos Principales

```bash
# Iniciar la API
pm2 start dist/index.js --name "api-time-report"

# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs

# Reiniciar ante cambios
pm2 restart api-time-report

```

---

## 4. Despliegue (Hosting)

### VPS Propio (Control Total)

1. Instala Node.js y MySQL.
2. Clona tu repo.
3. Configura **Nginx** como "Reverse Proxy" para redirigir el tráfico del puerto 80 al puerto 4000 de tu API (opcional).
4. Usa PM2 para mantenerlo vivo.

---

## 5. Comandos de Mantenimiento

Si necesitas actualizar el código en el servidor:

```bash
git pull origin main
npm install
npm run build
pm2 restart api-time-report

```

---
