import { Request, Response } from 'express';
import { FieldConfig } from '../@types/models';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db';
import { HttpStatus } from '../@types';
import { ResponseUtil } from '../middlewares/response';

export class ConfigFieldsController {
    // Inyectamos la interfaz si es necesario, o la implementamos directamente

    /**
     * GET /api/config-fields/:userId
     */
    getConfigsByUserId = async (req: Request, res: Response): Promise<Response> => {
        const { user_id } = req.query;
        console.log('UserID:', user_id);
        try {
            const [rows]: any = await pool.query(
                'SELECT * FROM field_configs WHERE user_id = ? ORDER BY `order` ASC',
                [user_id]
            );

            // Mapeo de Snake_case (DB) a CamelCase (Frontend)
            const configs: FieldConfig[] = rows.map((row: any) => ({
                id: row.id,
                userId: row.user_id,
                fieldId: row.field_id,
                label: row.label,
                type: row.type,
                required: Boolean(row.required),
                enabled: Boolean(row.enabled),
                allowFiles: Boolean(row.allow_files),
                options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
                order: row.order
            }));

            return ResponseUtil.success(res, {
                configs
            }, 'Campos obtenidos exitosamente', HttpStatus.CREATED)
        } catch (error) {
            console.error('[GET_CONFIGS_ERROR]', error);
            return ResponseUtil.error(res, 'Error al obtener configuraciones', HttpStatus.CONFLICT);
        }
    };

    /**
     * POST /api/config-fields/save
     */
    saveConfigs = async (req: Request, res: Response): Promise<Response> => {
        const { userId, configs } = req.body; // configs es un array de FieldConfig
        console.log('Saving configs for user:', userId, configs);
        if (!userId || !Array.isArray(configs)) {
            return res.status(400).json({ success: false, message: 'Datos inválidos' });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            for (const config of configs) {
                const query = `
                    INSERT INTO field_configs 
                    (id, user_id, field_id, label, type, required, enabled, allow_files, options, \`order\`)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                    label = VALUES(label),
                    type = VALUES(type),
                    required = VALUES(required),
                    enabled = VALUES(enabled),
                    allow_files = VALUES(allow_files),
                    options = VALUES(options),
                    \`order\` = VALUES(\`order\`),
                    updated_at = CURRENT_TIMESTAMP
                `;

                await connection.query(query, [
                    config.id || uuidv4(),
                    userId,
                    config.fieldId,
                    config.label,
                    config.type,
                    config.required ? 1 : 0,
                    config.enabled ? 1 : 0,
                    config.allowFiles ? 1 : 0,
                    JSON.stringify(config.options || []),
                    config.order
                ]);
            }

            await connection.commit();
            return ResponseUtil.success(res, {}, 'Configuraciones guardadas correctamente', HttpStatus.CREATED)

        } catch (error) {
            await connection.rollback();
            console.error('[SAVE_CONFIGS_ERROR]', error);
            return ResponseUtil.error(res, 'Error al procesar la solicitud', HttpStatus.CONFLICT);

        } finally {
            connection.release();
        }
    };

    /**
     * DELETE /api/config-fields/:id
     */
    deleteConfig = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.query;
        console.log('Deleting config with ID:', id);
        try {
            const [result]: any = await pool.query('DELETE FROM field_configs WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return ResponseUtil.error(res, 'Configuración no encontrada', HttpStatus.CONFLICT);

            }
            return ResponseUtil.success(res, {}, 'Campo eliminado', HttpStatus.CREATED)
        } catch (error) {
            console.error('[DELETE_CONFIG_ERROR]', error);
            return ResponseUtil.error(res, 'Error al procesar la solicitud', HttpStatus.CONFLICT);
        }
    };
}