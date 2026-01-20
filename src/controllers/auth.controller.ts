import { Request, Response } from 'express';
import { ResponseUtil } from '../middlewares/response';
import { AuthUtils } from '../utils/auth';
import { HttpStatus } from '../@types';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from '../domain/entities/User';
import { v4 as uuidv4 } from "uuid";

export class AuthController {

    /**
     * Registro de nuevos usuarios
     */

    register = async (req: Request, res: Response): Promise<Response> => {
        const { full_name, email, password } = req.body;

        try {
            // 1. Validar si el usuario ya existe
            const [existingUser] = await pool.query(
                'SELECT id FROM profiles WHERE email = ?',
                [email]
            );

            if ((existingUser as any[]).length > 0) {
                return ResponseUtil.error(res, 'El email ya está registrado', HttpStatus.CONFLICT);
            }

            // 2. Encriptar la contraseña
            const passwordHash = await AuthUtils.hashPassword(password);


            // 3. Crear el objeto de usuario basado en tu interfaz
            const newUser: IUser = {
                id: uuidv4(), // Generamos un ID único
                full_name,
                email,
                passwordHash
            };

            // 4. Guardar en la base de datos
            await pool.query(
                'INSERT INTO profiles (id, full_name, email, password) VALUES (?, ?, ?, ?)',
                [newUser.id, newUser.full_name, newUser.email, newUser.passwordHash]
            );

            const token = AuthUtils.generateToken({
                userId: newUser.id,
                email: newUser.email,
            });

            // 5. Respuesta exitosa (sin devolver el passwordHash)
            return ResponseUtil.success(res, {
                user: {
                    id: newUser.id,
                    full_name: newUser.full_name,
                    email: newUser.email,
                },
                token
            }, 'Usuario registrado exitosamente', HttpStatus.CREATED);


        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'Error en el registro';
            return ResponseUtil.error(res, message, HttpStatus.BAD_REQUEST);
        }
    };

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        console.log("Login attempt for email:", email);
        try {
            // 1. Buscar al usuario por email
            // Usamos RowDataPacket para que TS sepa que esperamos filas de la DB
            const [rows] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM profiles WHERE email = ?',
                [email]
            );
            console.log("Login 1 - DB query executed", rows);

            const user = rows[0];

            // 2. Verificar si el usuario existe
            if (!user) {
                return ResponseUtil.error(res, 'Credenciales inválidas', HttpStatus.BAD_REQUEST);
            }

            // 3. Comparar la contraseña enviada con la encriptada en la DB
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Login 1 - Password comparison result:", isMatch);

            if (!isMatch) {
                return ResponseUtil.error(res, 'Credenciales inválidas', HttpStatus.BAD_REQUEST);
            }

            // 4. Generar el Token JWT
            // El payload contiene info no sensible (como el ID)
            const token = AuthUtils.generateToken({
                userId: user.id,
                email: user.email,
            });
            console.log("Login 1 - DB query executed, user authenticated, token generated");

            // 5. Responder con el token y datos básicos del usuario
            return ResponseUtil.success(res, {
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                },
                token
            }, 'Login exitoso', HttpStatus.OK);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    };
}