import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

const connectDB = async () => {
    try {
        // We "connect" by querying the database once to verify credentials
        const res = await pool.query('SELECT NOW()');
        console.log("✅ PostgreSQL connected successfully at:", res.rows[0].now);
    } catch (err) {
        console.error("❌ PostgreSQL connection error:", err.message);
        process.exit(1);
    }
};

export { pool, connectDB };
export default pool;