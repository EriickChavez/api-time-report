import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('DB Config Check:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    ssl: true
});

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 4000,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000, // 60 seconds
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },
    typeCast: (field: any, next: any) => {
        if (field.type === 'JSON') {
            const value = field.string("utf8");

            if (value === null) return null;

            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }
        return next();
    }
});