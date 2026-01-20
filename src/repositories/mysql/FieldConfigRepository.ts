import { pool } from "../../config/db";

import { FieldConfig } from "../../@types/models";
import { v4 as uuidv4 } from "uuid";
import { IFieldConfigRepository } from "../../interfaces/IFieldConfigRepository";

export class MySQLFieldConfigRepository implements IFieldConfigRepository {
    getConfigsByUserId(userId: string): Promise<FieldConfig[]> {
        throw new Error("Method not implemented.");
    }
    deleteConfig(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async getConfigs(userId: string): Promise<FieldConfig[]> {
        const [rows] = await pool.query(
            "SELECT * FROM field_configs WHERE user_id = ? ORDER BY `order` ASC",
            [userId]
        );
        return rows as FieldConfig[];
    }

    async saveConfigs(userId: string, configs: FieldConfig[]): Promise<void> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // Borramos configuración anterior para insertar la nueva (Sincronización total)
            await connection.execute("DELETE FROM field_configs WHERE user_id = ?", [userId]);

            for (const config of configs) {
                const sql = `INSERT INTO field_configs 
                    (id, user_id, field_id, label, type, required, enabled, allow_files, options, \`order\`) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                await connection.execute(sql, [
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
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}