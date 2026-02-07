const { execSync } = require("child_process");
const path = require("path");

const APP_NAME = "api-time-report";
const ENTRY_POINT = path.join("dist", "index.js");

function run(command) {
  try {
    console.log(`\n🏃 Ejecutando: ${command}`);
    // shell: true es necesario en Windows para encontrar ejecutables como npm o pm2
    execSync(command, { stdio: "inherit", shell: true });
    return true;
  } catch (error) {
    console.error(`\n❌ Error al ejecutar: ${command}`);
    process.exit(1);
  }
}

console.log(`🚀 Iniciando despliegue de ${APP_NAME}...`);

// 1. Instalar dependencias
run("npm install");

// 2. Compilar (Build)
run("npm run build");

// 3. Manejo de PM2 (Reinicio o Inicio)
try {
  console.log(`\n♻️ Intentando reiniciar ${APP_NAME}...`);
  execSync(`pm2 restart ${APP_NAME}`, { stdio: "inherit", shell: true });
} catch (e) {
  console.log(`\n🆕 La app no existía en PM2. Iniciando por primera vez...`);
  run(`pm2 start ${ENTRY_POINT} --name "${APP_NAME}"`);
}

// 4. Persistencia (Clave para Windows y reinicios)
run("pm2 save");

console.log(`\n✅ ¡Proceso completado con éxito en ${process.platform}!`);
console.log(`🚀 La API está blindada contra reinicios.`);
