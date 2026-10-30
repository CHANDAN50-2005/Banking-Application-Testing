/**
 * Database Connection & Abstraction Layer
 * Banking Application Testing - Srinivas University
 * Supports both Live MySQL connection and Standalone In-Memory fallback.
 */

const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'banking_testing_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let isConnected = false;

async function initDatabase() {
  // If no password provided and we want to try connection
  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    isConnected = true;
    console.log(`[Database] Connected to MySQL successfully (Database: ${dbConfig.database})`);
    return true;
  } catch (err) {
    isConnected = false;
    console.log(`[Database] MySQL not connected (${err.code || err.message}).`);
    console.log(`[Database] Operating in Self-Contained / In-Memory Persistence Mode.`);
    console.log(`[Database] (All banking and testing functions operate 100% without requiring MySQL setup).`);
    return false;
  }
}

function isDbConnected() {
  return isConnected;
}

function getPool() {
  return pool;
}

module.exports = {
  initDatabase,
  isDbConnected,
  getPool
};

