import express from 'express';
import cors from 'cors';
import routes from './routes';
import {
    corsOptions,
    generalLimiter,
    helmetConfig,
    validateContentType,
    removeUnnecessaryHeaders,
    securityLogger
} from './middlewares/security';

const app = express();
const PORT = process.env.PORT;

// Servir archivos estáticos desde la carpeta public
app.use('/public', express.static('public'));

// Trust proxy (importante para rate limiting e IP logging)
app.set('trust proxy', 1);

// Middlewares de funcionalidades avanzadas (ORDEN IMPORTANTE)

// Middlewares de seguridad
app.use(helmetConfig); // Headers de seguridad
app.use(removeUnnecessaryHeaders); // Remover headers innecesarios
app.use(cors(corsOptions)); // CORS configurado
app.use(generalLimiter); // Rate limiting
app.use(securityLogger); // Logging de seguridad

// Middlewares de parsing
app.use(express.json({ limit: '5mb' })); // Límite de 10MB
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Validación de content-type y sanitización avanzada
app.use(validateContentType);

// Rutas
app.use('/', routes);

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de cierre graceful
const gracefulShutdown = async (signal: string) => {
    console.log(`\n🔄 Recibida señal ${signal}. Cerrando servidor gracefully...`);

    // Cerrar servidor HTTP
    server.close(async () => {
        console.log('🔌 Servidor HTTP cerrado');
    });

    // Forzar cierre después de 10 segundos
    setTimeout(() => {
        console.error('⚠️  Forzando cierre del servidor...');
        process.exit(1);
    }, 10000);
};

// Registrar manejadores de señales
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

export default app;