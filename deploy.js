const { execSync } = require("child_process");
const os = require("os");

const isWindows = os.platform() === "win32";

function run(command) {
  try {
    console.log(`\n🏃 Ejecutando: ${command}`);
    execSync(command, { stdio: "inherit", shell: true });
    return true;
  } catch (error) {
    console.error(`\n❌ Error en: ${command}`);
    return false;
  }
}

console.log(`🚀 Iniciando despliegue multiplataforma en: ${os.platform()}`);

// 1. Preparación estándar (Igual en todos los OS)
run("npm install");
run("npm run build");

// 2. Gestión de PM2 usando el archivo ecosystem
try {
  run("pm2 reload ecosystem.config.js --env production");
} catch (e) {
  run("pm2 start ecosystem.config.js");
}

// 3. Persistencia de auto-encendido según el OS
console.log("\n💾 Configurando persistencia de reinicio...");

if (isWindows) {
  // Para Windows requerimos pm2-windows-startup (debe instalarse una vez globalmente)
  console.log(
    "Tip: Asegúrate de haber ejecutado 'npm install -g pm2-windows-startup' una vez.",
  );
  run("pm2 save");
} else {
  // Para Linux/Mac, intentamos guardar y recordamos el comando startup
  run("pm2 save");
  console.log(
    "\n💡 Si es la primera vez en Linux/Mac, ejecuta: 'pm2 startup' y sigue sus instrucciones.",
  );
}

console.log(`\n✅ Despliegue completado con éxito.`);
