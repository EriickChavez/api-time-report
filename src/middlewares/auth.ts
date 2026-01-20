import { Request, Response, NextFunction } from 'express';
import { AuthUtils, TokenPayload } from '../utils/auth';

import { UserRole } from '../domain/entities/User';
import { ResponseUtil } from './response';
import { HttpStatus } from '../@types';

// Extender Request para incluir user
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload & {

            };
        }
    }
}

/**
 * Middleware para verificar JWT token
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        const token = AuthUtils.extractTokenFromHeader(authHeader);

        const decoded = AuthUtils.verifyToken(token);
        req.user = decoded;

        next();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error de autenticación';
        ResponseUtil.unauthorized(res, message);
    }
};
