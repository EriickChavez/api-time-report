import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db';
import { ResponseUtil } from '../middlewares/response';
import { HttpStatus } from '../@types';

export class TimeEntryController {

    /**
     * POST /api/time-entries
     * Guarda un nuevo reporte de tiempo
     */
    createEntry = async (req: Request, res: Response): Promise<Response> => {
        const {
            userId,
            date,
            startTime,
            endTime,
            reporter,
            status,
            fieldData,
            files
        } = req.body;
        console.log('Creating time entry for user:', userId, date);
        // Validación básica
        if (!userId || !date) {
            return ResponseUtil.error(res, 'Usuario y fecha son requeridos', HttpStatus.CONFLICT);
        }

        try {
            const id = uuidv4();

            // Query para MySQL/TiDB
            const query = `
                INSERT INTO time_entries 
                (id, user_id, \`date\`, start_time, end_time, reporter, status, field_data, files) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                id,
                userId,
                date, // Formato esperado: YYYY-MM-DD
                startTime || null,
                endTime || null,
                reporter || null,
                status || 'pending',
                JSON.stringify(fieldData || {}), // Los campos dinámicos de tu configuración
                JSON.stringify(files || [])      // URLs de evidencias
            ];

            await pool.query(query, values);
            console.log('Time entry created with ID:', id);
            return ResponseUtil.success(res, { id, userId, date, status }, 'Reporte de tiempo creado exitosamente', HttpStatus.CREATED)

        } catch (error: any) {
            console.error('[CREATE_TIME_ENTRY_ERROR]', error);

            // Error de llave foránea (si el userId no existe)
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return ResponseUtil.error(res, 'El usuario no existe', HttpStatus.CONFLICT);
            }
            return ResponseUtil.error(res, 'Error al procesar la solicitud', HttpStatus.CONFLICT);

        }
    };

    /**
     * GET /api/time-entries/:userId
     * Obtiene los reportes de un usuario específico
     */
    getEntriesByUser = async (req: Request, res: Response): Promise<Response> => {
        const { userId } = req.query;

        try {
            const [rows]: any = await pool.query(
                'SELECT * FROM time_entries WHERE user_id = ? ORDER BY `date` DESC, created_at DESC',
                [userId]
            );

            // Parseamos los campos JSON de vuelta a objetos de JS
            const entries = rows.map((row: any) => ({
                ...row,
                field_data: typeof row.field_data === 'string' ? JSON.parse(row.field_data) : row.field_data,
                files: typeof row.files === 'string' ? JSON.parse(row.files) : row.files
            }));
            console.log('Entries fetched for user:', userId, entries);
            // return res.status(200).json({ success: true, data: entries });
            return ResponseUtil.success(res, {
                entries
            }, 'Campos obtenidos exitosamente', HttpStatus.CREATED)

        } catch (error) {
            console.error('[GET_TIME_ENTRIES_ERROR]', error);
            return ResponseUtil.error(res, 'Error al obtener los reportes', HttpStatus.CONFLICT);

        }
    };

    /**
     * DELETE /api/time-entries/:id
     * Elimina un reporte de tiempo específico
     */
    deleteEntry = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.query;
        // Opcional: const { userId } = req.body; (para validar propiedad)

        try {
            // Ejecutamos la eliminación
            const [result]: any = await pool.query(
                'DELETE FROM time_entries WHERE id = ?',
                [id]
            );

            // Verificamos si realmente se borró algo
            if (result.affectedRows === 0) {
                return ResponseUtil.error(res, 'Configuración no encontrada', HttpStatus.CONFLICT);
            }
            return ResponseUtil.success(res, {}, 'Campo eliminado', HttpStatus.CREATED)
        } catch (error) {
            console.error('[DELETE_TIME_ENTRY_ERROR]', error);
            return ResponseUtil.error(res, 'Error al procesar la solicitud', HttpStatus.CONFLICT);
        }
    };
}