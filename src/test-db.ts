import { pool } from './config/db';

async function testConnection() {
    console.log('Testing database connection...');
    const start = Date.now();
    try {
        const connection = await pool.getConnection(); // Basic check
        console.log('Successfully acquired connection from pool.');

        const [rows] = await connection.query('SELECT 1 as val');
        console.log('Query result:', rows);

        connection.release();
        console.log(`Connection test completed successfully in ${Date.now() - start}ms`);
        process.exit(0);
    } catch (error) {
        console.error(`Connection failed after ${Date.now() - start}ms`, error);
        process.exit(1);
    }
}

testConnection();
