import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || '31.97.198.49',
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || 'u170392488_smart_clinic3',
  password: process.env.DATABASE_PASSWORD || 'M0h@mm@d@Tef1976_2026',
  database: process.env.DATABASE_NAME || 'u170392488_smart_clinic3',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
