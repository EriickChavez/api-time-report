import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';


/**
 * Configuración de CORS
 */
export const corsOptions = {
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count']
};

/**
 * Rate limiting general
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Más permisivo en desarrollo
    message: {
        error: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.',
        retryAfter: '15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: 'Límite de peticiones excedido',
            retryAfter: '15 minutos',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * Rate limiting para autenticación (más restrictivo)
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,
    message: {
        error: 'Demasiados intentos de autenticación, intenta de nuevo en 15 minutos.',
        retryAfter: '15 minutos'
    },
    skipSuccessfulRequests: true
});

/**
 * Configuración de Helmet para headers de seguridad
 */
export const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 año
        includeSubDomains: true,
        preload: true
    }
});

/**
 * Middleware para validar Content-Type en POST/PUT
 */
export const validateContentType = (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers['content-type'];

    // Si es una subida de archivo, permitir
    if (contentType && contentType.startsWith('multipart/form-data')) {
        return next();
    }

    // Para otros métodos que envían cuerpo, exigir JSON
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!contentType || !contentType.includes('application/json')) {
            return res.status(400).json({
                success: false,
                error: 'Content-Type debe ser application/json',
                timestamp: new Date().toISOString(),
            });
        }
    }

    next();
};

/**
 * Middleware para remover headers innecesarios
 */
export const removeUnnecessaryHeaders = (req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('X-Powered-By');
    next();
};

/**
 * Middleware para logging de seguridad
 */
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';

    // Log de requests sospechosos
    if (req.path.includes('..') || req.path.includes('<script>')) {
        console.warn(`⚠️  Petición sospechosa detectada: ${timestamp}`, {
            ip,
            path: req.path,
            method: req.method,
            userAgent
        });
    }

    next();
};